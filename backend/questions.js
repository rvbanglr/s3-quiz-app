const questions = [
  {
    id: 1,
    question: "What does EC2 stand for?",
    options: [
      "Elastic Compute Cloud",
      "Elastic Container Cloud",
      "Elastic Cluster Computing",
      "Enterprise Compute Cloud"
    ],
    correct: 0,
    explanation: "EC2 stands for Elastic Compute Cloud — AWS's resizable compute capacity service."
  },
  {
    id: 2,
    question: "Which EC2 pricing model offers the highest potential discount (up to 90%) compared to On-Demand pricing?",
    options: [
      "Reserved Instances",
      "Savings Plans",
      "Spot Instances",
      "Dedicated Hosts"
    ],
    correct: 2,
    explanation: "Spot Instances can offer up to 90% discount vs On-Demand, but can be interrupted by AWS with 2 minutes notice."
  },
  {
    id: 3,
    question: "What is the minimum EBS volume size for a General Purpose SSD (gp2/gp3)?",
    options: [
      "1 GB",
      "8 GB",
      "16 GB",
      "20 GB"
    ],
    correct: 0,
    explanation: "The minimum EBS volume size is 1 GB for General Purpose SSD volumes."
  },
  {
    id: 4,
    question: "Which EC2 instance family is optimized for memory-intensive workloads?",
    options: [
      "C-family (e.g., c5, c6i)",
      "R-family (e.g., r5, r6i)",
      "T-family (e.g., t3, t4g)",
      "P-family (e.g., p3, p4)"
    ],
    correct: 1,
    explanation: "R-family instances are memory-optimized, designed for memory-intensive databases, in-memory caches, and analytics."
  },
  {
    id: 5,
    question: "What is an EC2 Security Group?",
    options: [
      "A firewall that controls inbound and outbound traffic at the subnet level",
      "A virtual firewall that controls inbound and outbound traffic at the instance level",
      "An IAM policy that controls EC2 access",
      "A VPC routing table for EC2 instances"
    ],
    correct: 1,
    explanation: "Security Groups act as a virtual firewall at the EC2 instance level, controlling inbound and outbound traffic."
  },
  {
    id: 6,
    question: "What is the maximum number of Elastic IP addresses allocated per AWS account per region by default?",
    options: [
      "2",
      "5",
      "10",
      "20"
    ],
    correct: 1,
    explanation: "By default, AWS allows 5 Elastic IP addresses per region per account. You can request an increase."
  },
  {
    id: 7,
    question: "Which storage type is instance store (ephemeral storage) best described as?",
    options: [
      "Persistent storage that survives instance stop/termination",
      "Temporary block storage physically attached to the host, lost on stop/termination",
      "Network-attached storage shared across instances",
      "S3-backed object storage mounted to the instance"
    ],
    correct: 1,
    explanation: "Instance store is ephemeral — data is lost when the instance is stopped, terminated, or the underlying hardware fails."
  },
  {
    id: 8,
    question: "What is the purpose of an EC2 Key Pair?",
    options: [
      "Encrypting EBS volumes",
      "Authenticating API calls to AWS",
      "Securely connecting to EC2 instances via SSH/RDP",
      "Enabling cross-region replication"
    ],
    correct: 2,
    explanation: "EC2 Key Pairs are used for secure SSH (Linux) or RDP password decryption (Windows) access to instances."
  },
  {
    id: 9,
    question: "Which EC2 instance type uses ARM-based processors developed by AWS?",
    options: [
      "T4g instances",
      "M5 instances",
      "C5n instances",
      "X1e instances"
    ],
    correct: 0,
    explanation: "T4g (and other 'g' suffix instances like m6g, c6g) use AWS Graviton2 ARM-based processors, offering up to 40% better price-performance."
  },
  {
    id: 10,
    question: "What is EC2 Auto Scaling used for?",
    options: [
      "Automatically upgrading EC2 instance types",
      "Automatically adjusting the number of EC2 instances based on demand",
      "Automatically patching EC2 instances",
      "Automatically migrating instances between regions"
    ],
    correct: 1,
    explanation: "EC2 Auto Scaling automatically adds or removes instances based on defined policies, ensuring you have the right capacity at the right time."
  },
  {
    id: 11,
    question: "What is an Amazon Machine Image (AMI)?",
    options: [
      "A snapshot of an EBS volume",
      "A template containing OS, application server, and applications used to launch EC2 instances",
      "A container image for ECS",
      "An EC2 instance backup stored in S3"
    ],
    correct: 1,
    explanation: "An AMI is a template that contains the software configuration (OS, application server, apps) required to launch an EC2 instance."
  },
  {
    id: 12,
    question: "Which feature allows you to run EC2 instances on physical servers dedicated solely to your use?",
    options: [
      "Reserved Instances",
      "Placement Groups",
      "Dedicated Hosts",
      "Bare Metal Instances"
    ],
    correct: 2,
    explanation: "Dedicated Hosts provide physical EC2 servers fully dedicated to your use, useful for regulatory compliance and BYOL licensing."
  },
  {
    id: 13,
    question: "What is the difference between stopping and terminating an EC2 instance?",
    options: [
      "There is no difference; both permanently delete the instance",
      "Stopping pauses billing; terminating permanently deletes the instance and its EBS root volume (by default)",
      "Stopping deletes EBS; terminating keeps it",
      "Terminating only stops the instance temporarily"
    ],
    correct: 1,
    explanation: "Stopping an instance halts it (EBS data persists, billed for storage); terminating permanently deletes the instance and by default its root EBS volume."
  },
  {
    id: 14,
    question: "What is EC2 Placement Groups used for?",
    options: [
      "Placing instances in specific AWS regions",
      "Grouping instances for IAM permission management",
      "Controlling the physical placement of instances to influence performance or resilience",
      "Grouping instances under a single billing account"
    ],
    correct: 2,
    explanation: "Placement Groups influence where AWS places your instances physically. Cluster = low latency, Spread = fault isolation, Partition = distributed workloads."
  },
  {
    id: 15,
    question: "What is the purpose of EC2 User Data?",
    options: [
      "Storing persistent application data on the instance",
      "Running scripts or commands automatically when an instance launches for the first time",
      "Passing user credentials to the instance",
      "Tagging instances with user metadata"
    ],
    correct: 1,
    explanation: "User Data scripts run automatically at instance launch (first boot), used for bootstrapping — installing software, pulling configs, etc."
  },
  {
    id: 16,
    question: "Which EC2 network feature provides enhanced networking with high bandwidth and low latency?",
    options: [
      "Elastic Network Interface (ENI)",
      "Elastic Fabric Adapter (EFA)",
      "Elastic IP Address",
      "VPC Peering"
    ],
    correct: 1,
    explanation: "Elastic Fabric Adapter (EFA) provides OS-bypass networking for HPC and ML workloads needing high throughput and ultra-low latency."
  },
  {
    id: 17,
    question: "What is the purpose of EC2 Instance Metadata Service (IMDS)?",
    options: [
      "A service to monitor EC2 performance metrics",
      "An API allowing instances to access their own configuration data like instance ID, IP, and IAM role credentials",
      "A backup service for EC2 configuration",
      "A service for cross-region instance replication"
    ],
    correct: 1,
    explanation: "IMDS (accessible at 169.254.169.254) lets running instances query their own metadata — instance ID, region, IAM credentials, and more."
  },
  {
    id: 18,
    question: "What is gp3 EBS volume's baseline throughput compared to gp2?",
    options: [
      "gp3 has lower throughput than gp2",
      "gp3 provides 1,000 MiB/s baseline vs gp2's 250 MiB/s",
      "gp3 provides 125 MiB/s baseline, gp2 provides 250 MiB/s",
      "Both have the same baseline throughput"
    ],
    correct: 1,
    explanation: "gp3 provides 1,000 MiB/s baseline throughput vs gp2's 250 MiB/s, and also 20% cheaper per GB — making gp3 the preferred choice."
  },
  {
    id: 19,
    question: "Which of the following best describes an EC2 Reserved Instance (1-year or 3-year)?",
    options: [
      "AWS reserves specific physical hardware for you",
      "A billing discount applied to On-Demand instances matching the reserved configuration",
      "An instance that can never be terminated by AWS",
      "An instance type that provides guaranteed network throughput"
    ],
    correct: 1,
    explanation: "Reserved Instances are not physical reservations — they're billing commitments that provide discounts (up to 72%) when you commit to 1 or 3 years."
  },
  {
    id: 20,
    question: "What does the EC2 Nitro System provide?",
    options: [
      "A managed container runtime for EC2",
      "A lightweight hypervisor and hardware offload cards enabling near bare-metal performance and enhanced security",
      "A serverless compute layer built on EC2",
      "An automatic OS patching system for EC2 instances"
    ],
    correct: 1,
    explanation: "The AWS Nitro System is a combination of hardware and lightweight hypervisor that offloads virtualization functions, delivering near bare-metal performance, improved security, and innovation pace."
  }
];

module.exports = questions;
