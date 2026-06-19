const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const questions = require('./questions');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'ec2-quiz-secret-key-2024';

app.use(cors());
app.use(express.json());

// ─── Helpers ────────────────────────────────────────────────────────────────

function isBusinessEmail(email) {
  const freeProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'aol.com', 'icloud.com', 'live.com', 'msn.com',
    'protonmail.com', 'mail.com', 'ymail.com'
  ];
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return !freeProviders.includes(domain);
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// ─── Auth Routes ─────────────────────────────────────────────────────────────

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Email, name, and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!isBusinessEmail(email)) {
      return res.status(400).json({ error: 'Please use your business email address (personal email providers are not allowed)' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = db.prepare(
      'INSERT INTO users (email, name, password) VALUES (?, ?, ?)'
    ).run(email.toLowerCase(), name.trim(), hashedPassword);

    const token = jwt.sign(
      { id: result.lastInsertRowid, email: email.toLowerCase(), name: name.trim() },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: result.lastInsertRowid, email: email.toLowerCase(), name: name.trim() }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ─── Quiz Routes ─────────────────────────────────────────────────────────────

// Get questions (without correct answers)
app.get('/api/questions', authenticateToken, (req, res) => {
  const sanitized = questions.map(({ id, question, options }) => ({
    id, question, options
  }));
  res.json({ questions: sanitized, total: sanitized.length });
});

// Submit quiz
app.post('/api/quiz/submit', authenticateToken, (req, res) => {
  try {
    const { answers } = req.body; // { questionId: selectedOptionIndex }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Answers are required' });
    }

    let score = 0;
    const results = questions.map((q) => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correct;
      if (isCorrect) score++;
      return {
        id: q.id,
        question: q.question,
        options: q.options,
        userAnswer: userAnswer !== undefined ? userAnswer : null,
        correctAnswer: q.correct,
        isCorrect,
        explanation: q.explanation
      };
    });

    const total = questions.length;
    const percentage = Math.round((score / total) * 100);

    // Save attempt
    db.prepare(
      'INSERT INTO quiz_attempts (user_id, score, total, percentage, answers) VALUES (?, ?, ?, ?, ?)'
    ).run(req.user.id, score, total, percentage, JSON.stringify(answers));

    res.json({ score, total, percentage, results });
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ error: 'Server error during submission' });
  }
});

// Get user's attempt history
app.get('/api/quiz/history', authenticateToken, (req, res) => {
  try {
    const attempts = db.prepare(
      'SELECT id, score, total, percentage, completed_at FROM quiz_attempts WHERE user_id = ? ORDER BY completed_at DESC'
    ).all(req.user.id);
    res.json({ attempts });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch history' });
  }
});

// Leaderboard — best score per user
app.get('/api/leaderboard', authenticateToken, (req, res) => {
  try {
    const leaderboard = db.prepare(`
      SELECT 
        u.name,
        u.email,
        MAX(qa.percentage) as best_percentage,
        MAX(qa.score) as best_score,
        qa.total,
        COUNT(qa.id) as attempts,
        MAX(qa.completed_at) as last_attempt
      FROM quiz_attempts qa
      JOIN users u ON qa.user_id = u.id
      GROUP BY qa.user_id
      ORDER BY best_percentage DESC, best_score DESC
    `).all();

    res.json({ leaderboard });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Could not fetch leaderboard' });
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`✅ EC2 Quiz API running on http://localhost:${PORT}`);
});
