# Supabase Setup Guide — AWS S3 Quiz App

Follow these steps ONCE before sharing the app with your team.
Total time: ~5 minutes.

---

## Step 1 — Create a free Supabase project

1. Go to https://supabase.com and sign up (free)
2. Click **"New project"**
3. Fill in:
   - **Name**: s3-quiz-app
   - **Database Password**: choose a strong password (save it)
   - **Region**: pick the closest to your team
4. Click **"Create new project"** — wait ~1 minute for it to provision

---

## Step 2 — Create the database tables

1. In your Supabase project, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Paste the entire SQL block below and click **"Run"**

```sql
-- Users table
create table public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  password_hash text not null,
  role text not null default 'member',
  status text not null default 'active',
  created_at timestamptz default now()
);

-- Quiz attempts table
create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  email text not null,
  name text not null,
  score integer not null,
  total integer not null,
  percentage integer not null,
  timed_out boolean default false,
  completed_at timestamptz default now()
);

-- Seed the admin account
-- Password is: Admin@123  (base64: QWRtaW5AMTIz)
insert into public.users (email, name, password_hash, role, status)
values ('admin@company.com', 'Administrator', 'QWRtaW5AMTIz', 'admin', 'active');
```

---

## Step 3 — Set Row Level Security policies (open access via API key)

Paste this in a **new SQL query** and run it:

```sql
-- Enable RLS
alter table public.users   enable row level security;
alter table public.attempts enable row level security;

-- Allow all operations using the anon key (app handles auth itself)
create policy "anon_all_users"    on public.users    for all using (true) with check (true);
create policy "anon_all_attempts" on public.attempts for all using (true) with check (true);
```

---

## Step 4 — Get your API credentials

1. Click **"Project Settings"** (gear icon, bottom-left)
2. Click **"API"**
3. Copy:
   - **Project URL** — looks like `https://xyzxyz.supabase.co`
   - **anon public key** — long string starting with `eyJ...`

---

## Step 5 — Add credentials to the app

Open `index.html` and find these two lines near the top of the `<script>` section:

```js
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

Replace with your actual values:

```js
const SUPABASE_URL = 'https://xyzxyz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

Save the file.

---

## Step 6 — Deploy to Netlify (free, permanent public URL)

1. Go to https://netlify.com and sign up (free)
2. From your dashboard click **"Add new site" → "Deploy manually"**
3. Drag the entire `ec2-quiz-app` folder onto the upload area
4. Netlify gives you a URL like `https://jolly-hamilton-abc123.netlify.app`
5. Share that URL with your team!

**Optional**: Click "Site settings → Change site name" to get a cleaner URL
like `https://myteam-ec2-quiz.netlify.app`

---

## Admin credentials
- Email: `admin@company.com`
- Password: `Admin@123`

## Notes
- All user data lives in Supabase — everyone shares the same database
- The anon key is safe to expose in frontend code — RLS policies protect data
- Free Supabase plan: 500MB storage, 2GB bandwidth/month — plenty for a team quiz
