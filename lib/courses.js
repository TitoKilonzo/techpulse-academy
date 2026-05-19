export const CATEGORIES = [
  { id: 'all', label: 'All Courses' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'ai', label: 'AI & Claude' },
  { id: 'cloud', label: 'Cloud Computing' },
  { id: 'tech', label: 'Tech' },
  { id: 'opensource', label: 'Open Source' },
];

export const courses = [
  /* ────────── 1. AUTH FUNDAMENTALS ────────── */
  {
    slug: 'auth-fundamentals',
    title: 'Authentication Fundamentals',
    subtitle: 'Cookies · Sessions · Tokens · JWT · OAuth 2.0',
    description:
      'Master the five authentication primitives every developer confuses. Interactive lessons with diagrams, real-world analogies, and a knowledge quiz.',
    category: 'tech',
    level: 'intermediate',
    duration: 120,
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80',
    tags: ['Auth', 'JWT', 'OAuth', 'Cookies', 'Sessions'],
    featured: true,
    lessons: [
      {
        id: 1,
        title: 'Five Terms. One Mental Model.',
        type: 'lesson',
        duration: 8,
        content: `Cookie, Session, Token, JWT, and OAuth 2.0 are not competitors — they operate at different layers of the stack.\n\n**Cookie** is a transport mechanism — the browser's name tag.\n**Session** is server-side state — the server's memory of you.\n**Token** is a self-contained credential the client carries.\n**JWT** is the most common token format (three base64 parts).\n**OAuth 2.0** is a delegation protocol, not a login system.\n\nUnderstanding which layer each concept belongs to is the unlock for everything that follows.`,
      },
      {
        id: 2,
        title: 'Cookie — the browser\'s name tag',
        type: 'lesson',
        duration: 7,
        content: `A cookie is a small string the server tells the browser to remember. The server sends \`Set-Cookie\` once. After that, the browser auto-attaches it to every request to the same origin — no JavaScript needed.\n\nA cookie is just a **transport mechanism**. Whatever lives inside it (session id, JWT, preference flag) decides what the cookie actually means. Don't confuse the envelope with its contents.`,
      },
      {
        id: 3,
        title: 'Three flags that make cookies safe',
        type: 'lesson',
        duration: 8,
        content: `A cookie without security flags is a vulnerability waiting to happen. Always set:\n\n- **HttpOnly** — blocks JavaScript from reading the cookie, stopping most XSS theft\n- **Secure** — HTTPS only; prevents plaintext transit over HTTP\n- **SameSite=Lax** — prevents the cookie from being sent on cross-site requests, stopping most CSRF\n\nDrop SameSite=None (with Secure) only when you legitimately need cross-site posting.`,
      },
      {
        id: 4,
        title: 'Session — stateful auth',
        type: 'lesson',
        duration: 8,
        content: `On login, the server creates a record: your user id, permissions, and session timestamp. It hands the browser a tiny key (the session id) via a cookie. On each request, the server uses that key to look up your record in a store (memory, Redis, database).\n\n**Key insight**: the cookie carries nothing sensitive — just an opaque id. All actual data stays on the server, where it's easy to revoke or change without touching the client.`,
      },
      {
        id: 5,
        title: 'Sessions at scale — Redis',
        type: 'lesson',
        duration: 7,
        content: `If your app runs on three servers behind a load balancer, the session created on server #2 doesn't exist on servers #1 and #3. Your options:\n\n1. **Sticky sessions** — pin users to one server. Fragile; bites you when an instance crashes.\n2. **Shared session store** — Redis. All servers read/write the same store.\n\nUse Redis from day one. It's the boring, correct answer.`,
      },
      {
        id: 6,
        title: 'Token — stateless auth',
        type: 'lesson',
        duration: 8,
        content: `A token is a self-contained pass the client carries. Instead of looking you up in a database, the server checks the token's **signature**. If valid, you're in. No session store, no DB hit, no shared state — just cryptography.\n\nAdd another server tomorrow — it doesn't need to sync anything. Tokens carry their proof of identity with them. That's the entire pitch for stateless auth.`,
      },
      {
        id: 7,
        title: 'JWT anatomy — header.payload.signature',
        type: 'lesson',
        duration: 10,
        content: `A JWT looks like: \`xxxxx.yyyyy.zzzzz\` — three base64url chunks separated by dots.\n\n- **Header**: algorithm and token type \`{"alg":"HS256","typ":"JWT"}\`\n- **Payload**: claims about the user \`{"sub":"u_42","exp":1718,"role":"admin"}\`\n- **Signature**: \`HMAC(header + "." + payload, SECRET)\` — proves nobody tampered with it\n\n**The payload is NOT encrypted** — it's just base64. Don't ever put passwords or secrets in the payload.`,
      },
      {
        id: 8,
        title: 'JWT verification',
        type: 'lesson',
        duration: 8,
        content: `On every request, the server takes the header and payload, recomputes the signature with its secret key, and compares it to the signature in the token. If anyone tampered with a single character, the hashes diverge and the request is rejected.\n\n**HS256 vs RS256**:\n- HS256 — shared secret, fine when one service signs and verifies\n- RS256 — private/public key pair; use when multiple services need to verify but only one signs`,
      },
      {
        id: 9,
        title: 'Four JWT traps to avoid',
        type: 'lesson',
        duration: 9,
        content: `Most JWT breaches come from these four mistakes:\n\n1. **Storing in localStorage** — any XSS script owns the token. Prefer HttpOnly cookies or memory.\n2. **Trusting alg:none** — old libraries accept unsigned JWTs. Always pin allowed algorithms.\n3. **No expiration** — lost laptop = lifetime access. Keep access tokens short (15 min).\n4. **Trying to revoke instantly** — JWTs are bearer credentials. Use short exp + refresh token rotation instead.\n\n**The pattern**: short-lived access token (15 min) in memory + long-lived refresh token in HttpOnly cookie.`,
      },
      {
        id: 10,
        title: 'OAuth 2.0 — four roles, one handshake',
        type: 'lesson',
        duration: 10,
        content: `OAuth 2.0 is NOT a login system. It is a delegation protocol — a way for one app to act on a user's behalf at another app, without the user handing over their password.\n\n**Four roles**:\n- Resource Owner — the user\n- Client — the third-party app requesting access\n- Authorization Server — issues access tokens\n- Resource Server — the API hosting the protected data\n\nOAuth 2.0 answers: "Is this app allowed to call this API on the user's behalf?" To answer "Who is this user?" you need **OpenID Connect** on top.`,
      },
      {
        id: 11,
        title: 'Authorization Code Flow',
        type: 'lesson',
        duration: 10,
        content: `The authorization code flow is the canonical, secure OAuth flow — the one behind every "Sign in with Google" button.\n\n1. User clicks "Sign in with GitHub"\n2. App redirects to GitHub with \`client_id\`, \`redirect_uri\`, \`scope\`, \`state\`\n3. User approves; GitHub redirects back with a short-lived \`code\`\n4. Your server exchanges the code for an access token (server-to-server, code never touches the browser again)\n5. Use the access token to call the GitHub API\n\n**PKCE** (Proof Key for Code Exchange) extends this for SPAs and mobile apps where you can't safely store a client secret.`,
      },
      {
        id: 12,
        title: 'Knowledge Check Quiz',
        type: 'quiz',
        duration: 10,
        questions: [
          {
            q: 'What does the HttpOnly cookie flag prevent?',
            options: ['Cross-site request forgery', 'JavaScript from reading the cookie', 'Cookie transmission over HTTP', 'Cookie expiration'],
            answer: 1,
          },
          {
            q: 'Which part of a JWT is NOT encrypted?',
            options: ['Header', 'Payload', 'Signature', 'All parts are encrypted'],
            answer: 1,
          },
          {
            q: 'OAuth 2.0 primarily solves which problem?',
            options: ['User authentication', 'Delegated authorization', 'Password management', 'Session storage'],
            answer: 1,
          },
          {
            q: 'What is the recommended storage for short-lived access tokens in a browser?',
            options: ['localStorage', 'sessionStorage', 'In-memory (JS variable)', 'IndexedDB'],
            answer: 2,
          },
          {
            q: 'What is the main advantage of stateless tokens over sessions?',
            options: ['Easier revocation', 'No shared server state needed', 'Better encryption', 'Smaller size'],
            answer: 1,
          },
        ],
      },
    ],
  },

  /* ────────── 2. SOC ANALYST LAB ────────── */
  {
    slug: 'soc-analyst-lab',
    title: 'SOC Analyst Incident Lab',
    subtitle: 'Splunk · Sysmon · Kali · Atomic Red Team',
    description:
      'Build a real home SOC lab. Generate attack activity, ingest logs into Splunk, detect threats, and write a professional incident report.',
    category: 'cybersecurity',
    level: 'intermediate',
    duration: 180,
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80',
    tags: ['SIEM', 'Splunk', 'Blue Team', 'Incident Response', 'Sysmon'],
    featured: true,
    lessons: [
      {
        id: 1,
        title: 'Lab Architecture Overview',
        type: 'lesson',
        duration: 15,
        content: `In this lab you'll build a mini SOC environment from scratch using free tools.\n\n**Architecture:**\n- **Splunk Free** (SIEM) — receives and indexes all logs\n- **Windows 10/Server VM** — victim machine with Sysmon\n- **Kali Linux VM** — attacker machine\n- **Sysmon** — enhanced Windows process/network logging\n- **Atomic Red Team** — attack simulation framework\n\n**What you'll do:**\n1. Set up Splunk SIEM\n2. Install & configure Sysmon\n3. Generate realistic attack activity\n4. Ingest logs and search for threats\n5. Investigate and write an incident report`,
      },
      {
        id: 2,
        title: 'Setup Splunk SIEM',
        type: 'lab',
        duration: 25,
        content: `**Download:** https://www.splunk.com/en_us/download/splunk-enterprise.html\n\n**Installation:**\n1. Download Splunk Enterprise (Free tier — up to 500MB/day)\n2. Install on your VM (Linux or Windows)\n3. During setup: choose "Free Single Instance" license\n4. Create an admin user\n\n**Access Splunk Web:**\n\`\`\`\nhttp://your-vm-ip:8000\n\`\`\`\n\n**First steps after login:**\n- Navigate to Settings → Indexes\n- Create index: \`win_logs\`\n- Create index: \`wineventlog\`\n\nSplunk is now ready to receive logs from your Windows VM.`,
      },
      {
        id: 3,
        title: 'Install Sysmon on Windows VM',
        type: 'lab',
        duration: 20,
        content: `Sysmon (System Monitor) is a Windows service that logs detailed process activity that Windows doesn't capture by default.\n\n**Download Sysinternals Suite:** https://learn.microsoft.com/sysinternals/\n\n**Download SwiftOnSecurity config:** https://github.com/SwiftOnSecurity/sysmon-config\n\n**Install Sysmon:**\n\`\`\`powershell\nSysmon64.exe -accepteula -i sysmonconfig.xml\n\`\`\`\n\n**Verify running:**\n\`\`\`powershell\nGet-Service Sysmon\n# Status should be "Running"\n\`\`\`\n\n**What Sysmon logs (key Event IDs):**\n- Event 1: Process creation\n- Event 3: Network connection\n- Event 11: File created\n- Event 22: DNS query`,
      },
      {
        id: 4,
        title: 'Generate Attack Activity',
        type: 'lab',
        duration: 20,
        content: `**From Kali Linux (attacker):**\n\`\`\`bash\n# Network reconnaissance\nnmap -sV <windows-vm-ip>\n\n# Port scan\nnmap -p- <windows-vm-ip>\n\n# Optional: brute force SSH/RDP\nhydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://<target-ip>\n\`\`\`\n\n**On Windows VM — install Atomic Red Team:**\n\`\`\`powershell\nIEX (IWR 'https://raw.githubusercontent.com/redcanaryco/invoke-atomicredteam/master/install-atomicredteam.ps1' -UseBasicParsing);\nInstall-AtomicRedTeam\n\`\`\`\n\n**Simulate attacks:**\n\`\`\`powershell\n# T1003 - Credential dumping\nInvoke-AtomicTest T1003\n\n# T1059.001 - PowerShell execution\nInvoke-AtomicTest T1059.001\n\n# T1071 - Web traffic C2\nInvoke-AtomicTest T1071.001\n\`\`\`\n\nThese actions create realistic log entries that will appear in Splunk.`,
      },
      {
        id: 5,
        title: 'Ingest Logs into Splunk',
        type: 'lab',
        duration: 20,
        content: `We'll use the Splunk Universal Forwarder to ship Windows logs to Splunk.\n\n**Install Universal Forwarder on Windows VM:**\n1. Download from splunk.com/universalforwarder\n2. During install, provide your Splunk server IP and port 9997\n\n**Configure inputs.conf** (\`C:\\Program Files\\SplunkUniversalForwarder\\etc\\system\\local\\inputs.conf\`):\n\`\`\`ini\n[WinEventLog://Microsoft-Windows-Sysmon/Operational]\ndisabled = 0\nrenderXml = true\nindex = win_logs\n\n[WinEventLog://Security]\ndisabled = 0\nindex = wineventlog\n\`\`\`\n\n**Restart forwarder:**\n\`\`\`powershell\nRestart-Service SplunkForwarder\n\`\`\`\n\nIn Splunk: Apps → Search & Reporting → search \`index=win_logs\` to confirm logs are flowing.`,
      },
      {
        id: 6,
        title: 'Detect Suspicious Activity',
        type: 'lab',
        duration: 25,
        content: `In Splunk Search & Reporting, run these queries:\n\n**PowerShell executions:**\n\`\`\`spl\nindex=win_logs EventCode=1 Image="*powershell*"\n| table _time, User, CommandLine\n\`\`\`\n\n**Suspicious PowerShell keywords:**\n\`\`\`spl\nindex=win_logs powershell AND (Invoke-WebRequest OR IEX OR DownloadString)\n\`\`\`\n\n**New process creations:**\n\`\`\`spl\nindex=win_logs EventCode=1\n| stats count by Image, User\n| sort -count\n\`\`\`\n\n**Network connections:**\n\`\`\`spl\nindex=win_logs EventCode=3\n| table _time, Image, DestinationIp, DestinationPort\n\`\`\`\n\n**Failed logons:**\n\`\`\`spl\nindex=wineventlog EventCode=4625\n| stats count by Account_Name, Workstation_Name, src_ip\n\`\`\``,
      },
      {
        id: 7,
        title: 'Investigate the Incident',
        type: 'lesson',
        duration: 20,
        content: `With suspicious events identified, ask these investigative questions:\n\n**What happened?**\nCorrelate timestamps. Build a timeline of events from first detection.\n\n**Attacker objectives:**\n- Reconnaissance (scans, enumeration)\n- Initial access (brute force, phishing)\n- Persistence (scheduled tasks, registry keys)\n- Credential access (T1003)\n- Lateral movement\n- Exfiltration\n\n**Evidence to document:**\n- Source IP addresses\n- Compromised user accounts\n- Affected hostnames\n- Malicious processes and their parent processes\n- Files created or modified\n- Network connections made\n- Commands executed (command line arguments)\n\nSplunk tip: use \`| transaction\` to group related events.`,
      },
      {
        id: 8,
        title: 'Write the Incident Report',
        type: 'lesson',
        duration: 15,
        content: `A professional incident report must include:\n\n**1. Executive Summary** (1 paragraph — non-technical)\nWhat happened, business impact, current status.\n\n**2. Timeline** (chronological table)\n| Timestamp | Event | Source |\n|-----------|-------|--------|\n| 2024-01-15 14:23 | Nmap scan detected | Sysmon EventID 3 |\n| 2024-01-15 14:31 | T1003 credential dump | Sysmon EventID 1 |\n\n**3. Indicators of Compromise (IoCs)**\n- IP addresses\n- File hashes (SHA256)\n- Domain names\n- Registry keys\n\n**4. Attack Chain (MITRE ATT&CK mapping)**\nMap each detected technique to its MITRE ATT&CK ID.\n\n**5. Recommendations**\nSpecific, actionable mitigations.\n\n**6. Appendix**\nRaw Splunk queries used, screenshots, log excerpts.`,
      },
    ],
  },

  /* ────────── 3. AWS CLOUD FOUNDATIONS ────────── */
  {
    slug: 'aws-foundations',
    title: 'AWS Cloud Foundations',
    subtitle: 'IAM · EC2 · S3 · VPC · Auto Scaling',
    description:
      'Learn the core AWS services used in every production environment. Build real infrastructure with hands-on demos and understand the shared responsibility model.',
    category: 'cloud',
    level: 'beginner',
    duration: 240,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    tags: ['AWS', 'Cloud', 'IAM', 'EC2', 'S3', 'VPC'],
    featured: true,
    lessons: [
      {
        id: 1,
        title: 'What is Cloud Computing?',
        type: 'lesson',
        duration: 12,
        content: `Cloud computing is the on-demand delivery of IT resources over the internet with pay-as-you-go pricing.\n\n**Three service models:**\n- **IaaS** (Infrastructure as a Service) — raw compute, storage, network (EC2, S3)\n- **PaaS** (Platform as a Service) — managed platform to run your code (Elastic Beanstalk, Lambda)\n- **SaaS** (Software as a Service) — complete applications delivered over internet (Gmail, Salesforce)\n\n**Three deployment models:**\n- **Public Cloud** — AWS, Azure, GCP; multi-tenant, fully managed\n- **Private Cloud** — dedicated infrastructure for one org\n- **Hybrid Cloud** — combination of public + on-premise\n\n**AWS Global Infrastructure:** 33 Regions, 105 Availability Zones. Each Region = 2+ physically isolated AZs connected by low-latency fiber.`,
      },
      {
        id: 2,
        title: 'IAM — Identity & Access Management',
        type: 'lesson',
        duration: 20,
        content: `IAM is how you control who (identity) can do what (actions) on which AWS resources.\n\n**Core IAM concepts:**\n- **Users** — individual people or applications\n- **Groups** — collection of users sharing the same permissions\n- **Roles** — assumed by AWS services or federated users (no passwords)\n- **Policies** — JSON documents defining permissions\n\n**IAM Policy structure:**\n\`\`\`json\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": ["s3:GetObject", "s3:PutObject"],\n    "Resource": "arn:aws:s3:::my-bucket/*"\n  }]\n}\n\`\`\`\n\n**IAM best practices:**\n- Never use root account for daily operations\n- Enable MFA on all accounts\n- Apply least privilege principle\n- Use roles for applications, not IAM users\n- Rotate access keys every 90 days`,
      },
      {
        id: 3,
        title: 'Amazon EC2 — Virtual Servers',
        type: 'lesson',
        duration: 25,
        content: `Amazon EC2 (Elastic Compute Cloud) provides resizable virtual servers in the cloud.\n\n**Key concepts:**\n- **AMI** (Amazon Machine Image) — template for your instance (OS + software)\n- **Instance Type** — hardware profile (t3.micro = 2 vCPU, 1GB RAM)\n- **Key Pair** — SSH access credentials\n- **Security Group** — virtual firewall (stateful, inbound/outbound rules)\n- **Elastic IP** — static public IP address\n- **EBS Volume** — persistent block storage attached to your instance\n\n**Instance families:**\n| Family | Optimized for |\n|--------|---------------|\n| t3/t4g | General purpose, burstable |\n| m6i | General purpose, balanced |\n| c6i | Compute intensive |\n| r6i | Memory intensive |\n| p4d | GPU / ML workloads |\n\n**Pricing models:**\n- On-Demand — pay per hour, no commitment\n- Reserved — 1-3 year commitment, up to 72% discount\n- Spot — bid on spare capacity, up to 90% discount (interruptible)\n- Savings Plans — flexible, compute-family discounts`,
      },
      {
        id: 4,
        title: 'Amazon S3 — Object Storage',
        type: 'lesson',
        duration: 20,
        content: `Amazon S3 (Simple Storage Service) is infinitely scalable object storage.\n\n**Key concepts:**\n- **Bucket** — container for objects (globally unique name)\n- **Object** — file + metadata (up to 5TB per object)\n- **Key** — full path of the object (\`photos/2024/vacation.jpg\`)\n- **Prefix** — used to organize objects (simulates folders)\n\n**S3 Storage Classes:**\n| Class | Use Case | Cost |\n|-------|----------|------|\n| S3 Standard | Frequently accessed | $$$ |\n| S3-IA | Infrequently accessed | $$ |\n| S3 Glacier | Archive, minutes retrieval | $ |\n| S3 Glacier Deep | Archive, 12hr retrieval | ¢ |\n\n**S3 Security:**\n- Buckets are private by default\n- Bucket policies — resource-based IAM policies\n- ACLs — legacy; prefer bucket policies\n- Block Public Access — org-wide setting\n- SSE-S3, SSE-KMS — encryption at rest\n- SSL/TLS — encryption in transit\n\n**S3 Versioning** enables keeping multiple versions of objects — essential for backup and recovery.`,
      },
      {
        id: 5,
        title: 'VPC — Virtual Private Cloud',
        type: 'lesson',
        duration: 25,
        content: `A VPC is your own logically isolated section of the AWS cloud — your private network.\n\n**VPC components:**\n- **CIDR Block** — IP range for your VPC (e.g., 10.0.0.0/16)\n- **Subnet** — segment of VPC in one AZ (public or private)\n- **Internet Gateway** — enables internet access for public subnets\n- **NAT Gateway** — lets private subnet instances reach internet (outbound only)\n- **Route Tables** — rules for where traffic flows\n- **Security Groups** — stateful, instance-level firewall\n- **NACLs** — stateless, subnet-level firewall\n\n**3-tier architecture pattern:**\n\`\`\`\nInternet\n    ↓\nPublic Subnet (Load Balancer, Bastion)\n    ↓\nPrivate Subnet (App Servers)\n    ↓\nDatabase Subnet (RDS, ElastiCache)\n\`\`\`\n\n**Security Group vs NACL:**\n| Feature | Security Group | NACL |\n|---------|---------------|------|\n| State | Stateful | Stateless |\n| Scope | Instance | Subnet |\n| Rules | Allow only | Allow + Deny |\n| Order | All rules | Numbered order |`,
      },
      {
        id: 6,
        title: 'Auto Scaling & Load Balancing',
        type: 'lesson',
        duration: 20,
        content: `Auto Scaling automatically adjusts your compute capacity based on demand.\n\n**Auto Scaling Group (ASG):**\n- Min size, max size, desired capacity\n- Launch template (which AMI, instance type, etc.)\n- Scaling policies:\n  - **Target Tracking** — keep CPU at 40% (simplest)\n  - **Step Scaling** — add 2 instances when CPU > 70%\n  - **Scheduled Scaling** — scale at 9am weekdays\n\n**Elastic Load Balancer (ELB) types:**\n- **ALB** (Application Load Balancer) — HTTP/HTTPS, path-based routing, Layer 7\n- **NLB** (Network Load Balancer) — TCP/UDP, ultra-high performance, Layer 4\n- **GLB** (Gateway Load Balancer) — third-party virtual appliances\n\n**Health Checks** — ELB sends requests to each instance; unhealthy instances are removed from rotation and replaced by ASG.`,
      },
      {
        id: 7,
        title: 'CloudWatch — Monitoring & Logging',
        type: 'lesson',
        duration: 18,
        content: `CloudWatch is AWS's monitoring and observability service.\n\n**Core features:**\n- **Metrics** — time-series data from AWS services (CPU, NetworkIn, etc.)\n- **Logs** — collect, store, and analyze log files\n- **Alarms** — trigger actions when metrics breach thresholds\n- **Dashboards** — custom real-time monitoring views\n- **Events** — respond to state changes in AWS resources\n\n**CloudWatch Logs Insights** — query language for log analysis:\n\`\`\`\nfields @timestamp, @message\n| filter @message like /ERROR/\n| sort @timestamp desc\n| limit 100\n\`\`\`\n\n**Key metrics to monitor:**\n- EC2: CPUUtilization, NetworkIn/Out, StatusCheckFailed\n- RDS: DatabaseConnections, ReadLatency, WriteLatency\n- Lambda: Errors, Duration, Throttles\n- ALB: RequestCount, TargetResponseTime, HTTPCode_Target_5XX`,
      },
      {
        id: 8,
        title: 'AWS Shared Responsibility Model',
        type: 'lesson',
        duration: 15,
        content: `Security in AWS is a shared responsibility between AWS and the customer.\n\n**AWS is responsible for** (Security OF the cloud):\n- Physical data centers (access, power, cooling)\n- Global network infrastructure\n- Virtualization layer (hypervisor)\n- Managed service software (RDS OS patches, etc.)\n\n**You are responsible for** (Security IN the cloud):\n- Your data and encryption choices\n- OS patches on EC2 instances\n- IAM configuration\n- Network & firewall configuration (Security Groups, NACLs)\n- Application code and dependencies\n\n**Memory aid**: "If you can touch it in the console, you own the security of it."\n\nFor managed services like S3, RDS, Lambda — AWS handles more; you configure security settings, encryption, access control, and your application code.`,
      },
    ],
  },

  /* ────────── 4. CLAUDE & AI MASTERY ────────── */
  {
    slug: 'claude-ai-mastery',
    title: 'Claude & AI Mastery',
    subtitle: 'LLMs · Prompt Engineering · Anthropic API',
    description:
      'Understand how large language models work, master prompt engineering, and build production AI applications with the Anthropic Claude API.',
    category: 'ai',
    level: 'beginner',
    duration: 150,
    thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
    tags: ['Claude', 'Anthropic', 'LLM', 'Prompt Engineering', 'API'],
    featured: true,
    lessons: [
      {
        id: 1,
        title: 'How Large Language Models Work',
        type: 'lesson',
        duration: 15,
        content: `A Large Language Model (LLM) is a neural network trained on vast amounts of text to predict the next token in a sequence.\n\n**Key concepts:**\n- **Tokens** — chunks of text (~4 characters average). "Hello world" ≈ 2 tokens.\n- **Parameters** — the billions of numerical weights learned during training\n- **Context window** — how much text the model can "see" at once (Claude: 200K tokens)\n- **Temperature** — randomness in outputs (0 = deterministic, 1 = creative)\n- **Top-p sampling** — controls output diversity\n\n**Training stages:**\n1. **Pre-training** — predict next token on massive text corpus\n2. **Fine-tuning** — supervised on high-quality examples\n3. **RLHF** — Reinforcement Learning from Human Feedback — align with human preferences\n4. **Constitutional AI** (Anthropic) — align using a set of principles\n\nLLMs don't "understand" — they learn statistical patterns. This explains both their power and their failure modes.`,
      },
      {
        id: 2,
        title: 'Why Claude? Anthropic\'s Approach',
        type: 'lesson',
        duration: 12,
        content: `Anthropic is an AI safety company that built Claude.\n\n**Constitutional AI (CAI):**\nClaude is trained with a "constitution" — a set of principles guiding its behavior. During training, the model critiques and revises its own outputs against these principles. This produces a model that's more helpful, harmless, and honest.\n\n**Claude model families:**\n- **Claude Opus** — most intelligent, complex reasoning\n- **Claude Sonnet** — balance of speed and intelligence (most used)\n- **Claude Haiku** — fastest, most compact, cost-effective\n\n**Claude's strengths:**\n- 200K context window (process entire codebases or books)\n- Strong at following complex, nuanced instructions\n- Excellent at long-form writing and code\n- Honest about uncertainty and limitations\n- Built-in safety reasoning\n\n**Access:** claude.ai (web), API (developers), Claude Code (CLI), enterprise integrations`,
      },
      {
        id: 3,
        title: 'Prompt Engineering Fundamentals',
        type: 'lesson',
        duration: 18,
        content: `Prompt engineering is the art of communicating with AI models effectively.\n\n**The anatomy of a great prompt:**\n1. **Role** — "You are an expert security researcher..."\n2. **Task** — Clear, specific description of what you want\n3. **Context** — Relevant background information\n4. **Format** — How you want the output structured\n5. **Constraints** — What to avoid or include\n6. **Examples** — Few-shot demonstrations\n\n**Key techniques:**\n\n**Zero-shot:** Just give the task directly.\n> "Explain DNS resolution in 3 steps."\n\n**Few-shot:** Provide examples before the task.\n> "Bug: null pointer → Fix: add null check\\nBug: off-by-one → Fix: ...\\nBug: race condition → Fix: ?"\n\n**Chain of Thought:** Ask the model to reason step-by-step.\n> "Think through this step by step before answering..."\n\n**XML tags:** Use structured tags for clarity.\n> \`<context>...</context> <task>...</task>\``,
      },
      {
        id: 4,
        title: 'Advanced Prompting Techniques',
        type: 'lesson',
        duration: 20,
        content: `**System prompts:**\nDefine the model's persona, constraints, and context. In the Claude API, use the \`system\` parameter.\n\n\`\`\`json\n{\n  "system": "You are a senior cloud architect. Provide concise, production-ready advice. Always mention cost implications.",\n  "messages": [{"role": "user", "content": "How should I store user uploads?"}]\n}\n\`\`\`\n\n**Prompt chaining:**\nBreak complex tasks into sequential steps, passing outputs between them.\n> Step 1: "Extract all action items from this meeting transcript."\n> Step 2: "For each action item, estimate effort and assign priority."\n> Step 3: "Format as a Jira-ready CSV."\n\n**Meta-prompting:**\nAsk Claude to improve your prompt.\n> "Here is my prompt: [prompt]. How would you rewrite it to get better results?"\n\n**Grounding:**\nProvide context documents and ask Claude to answer based only on them.\n> "Based on the documentation below, answer: [question]\\n<doc>[content]</doc>"\n\n**Structured output:**\nRequest JSON or specific formats for reliable parsing.\n> "Respond only with valid JSON matching this schema: {...}"`,
      },
      {
        id: 5,
        title: 'Using the Anthropic API',
        type: 'lesson',
        duration: 20,
        content: `**Authentication:**\nGet your API key from console.anthropic.com.\n\n\`\`\`bash\nexport ANTHROPIC_API_KEY=sk-ant-...\n\`\`\`\n\n**Simple API call (Python):**\n\`\`\`python\nimport anthropic\n\nclient = anthropic.Anthropic()\nmessage = client.messages.create(\n    model="claude-sonnet-4-20250514",\n    max_tokens=1024,\n    messages=[\n        {"role": "user", "content": "Explain IAM roles in one paragraph."}\n    ]\n)\nprint(message.content[0].text)\n\`\`\`\n\n**Streaming (for long responses):**\n\`\`\`python\nwith client.messages.stream(\n    model="claude-sonnet-4-20250514",\n    max_tokens=2048,\n    messages=[{"role": "user", "content": "Write a security policy..."}]\n) as stream:\n    for text in stream.text_stream:\n        print(text, end="", flush=True)\n\`\`\`\n\n**Key parameters:**\n- \`model\` — which Claude model\n- \`max_tokens\` — maximum output length\n- \`temperature\` — 0.0-1.0, default 1.0\n- \`system\` — system prompt string\n- \`messages\` — conversation history array`,
      },
      {
        id: 6,
        title: 'Building AI-Powered Applications',
        type: 'lesson',
        duration: 25,
        content: `**Common AI application patterns:**\n\n**1. RAG (Retrieval-Augmented Generation)**\nEmbed your knowledge base → retrieve relevant chunks → inject into Claude's context → answer grounded in your data.\n\n\`\`\`\nUser query → embed → vector search → top-k chunks → Claude → answer\n\`\`\`\n\n**2. AI Agents**\nGive Claude tools (functions it can call) and let it decide which to use:\n\`\`\`python\ntools = [\n  {"name": "search_docs", "description": "Search the knowledge base"},\n  {"name": "create_ticket", "description": "Create a Jira ticket"},\n]\n\`\`\`\n\n**3. Prompt caching**\nCache frequently-used context (e.g., large system prompts) for 5-minute TTL. Reduces latency + cost by up to 90% for repeated prompts.\n\n**4. Structured output with tool use**\nForce Claude to respond in a specific format using tool definitions with JSON schema.\n\n**Best practices:**\n- Always validate and sanitize LLM output before using it in code\n- Log all API calls for debugging\n- Implement retries with exponential backoff\n- Set reasonable max_tokens limits\n- Use the cheapest model that meets your quality bar`,
      },
      {
        id: 7,
        title: 'AI Safety & Responsible Use',
        type: 'lesson',
        duration: 15,
        content: `Building with AI responsibly requires understanding its risks and limitations.\n\n**Common failure modes:**\n- **Hallucinations** — confident, plausible-sounding falsehoods. Always verify factual claims.\n- **Prompt injection** — malicious user input hijacks your system prompt. Sanitize inputs.\n- **Context poisoning** — adversarial content in retrieved documents manipulates output.\n- **Overreliance** — treating AI output as ground truth without verification.\n\n**Anthropic's Responsible Scaling Policy:**\nAnthropicties deployment decisions to safety evaluations. Before each new capability level, they run red-teaming and safety benchmarks.\n\n**Practical safety measures:**\n- Define clear guardrails in your system prompt\n- Use Claude's built-in refusals — don't try to bypass them\n- Implement human-in-the-loop for high-stakes decisions\n- Log and monitor production conversations\n- Rate-limit and authenticate your AI endpoints\n- Don't give AI access to irreversible actions (delete, send, pay) without confirmation`,
      },
    ],
  },

  /* ────────── 5. OPEN SOURCE CONTRIBUTION ────────── */
  {
    slug: 'open-source-guide',
    title: 'Open Source Contribution Guide',
    subtitle: 'Git · GitHub · Licensing · Community',
    description:
      'Learn to contribute to open source projects, understand licenses, and build a public portfolio that gets you hired.',
    category: 'opensource',
    level: 'beginner',
    duration: 135,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
    tags: ['Git', 'GitHub', 'Open Source', 'Licensing', 'Community'],
    featured: false,
    lessons: [
      {
        id: 1,
        title: 'What is Open Source?',
        type: 'lesson',
        duration: 10,
        content: `Open source software has its source code publicly available, allowing anyone to inspect, modify, and distribute it.\n\n**The Four Freedoms (GNU):**\n0. Freedom to run the program for any purpose\n1. Freedom to study how it works and change it\n2. Freedom to redistribute copies\n3. Freedom to distribute modified versions\n\n**Why contribute?**\n- Build real-world portfolio projects\n- Learn from expert code reviews\n- Give back to tools you use daily\n- Network with global developers\n- Many jobs specifically value open source experience\n\n**Famous open source projects:**\n- Linux kernel (C) — powers 96% of servers\n- VS Code (TypeScript) — 5M+ contributors\n- React (JavaScript) — Meta\n- Kubernetes (Go) — Google → CNCF\n- PostgreSQL (C) — most loved database`,
      },
      {
        id: 2,
        title: 'Git Workflow for Contributors',
        type: 'lesson',
        duration: 20,
        content: `The standard open source contribution workflow:\n\n**1. Fork the repository**\nClick "Fork" on GitHub — creates your copy at \`github.com/you/project\`\n\n**2. Clone your fork**\n\`\`\`bash\ngit clone git@github.com:you/project.git\ncd project\n\`\`\`\n\n**3. Add upstream remote**\n\`\`\`bash\ngit remote add upstream git@github.com:original-org/project.git\ngit remote -v  # verify\n\`\`\`\n\n**4. Create a feature branch**\n\`\`\`bash\ngit checkout -b fix/login-null-check\n\`\`\`\n\n**5. Make changes, commit, push**\n\`\`\`bash\ngit add -p  # stage changes interactively\ngit commit -m "fix: handle null user in login flow"\ngit push origin fix/login-null-check\n\`\`\`\n\n**6. Open a Pull Request**\nGitHub → Compare & pull request → describe your changes.\n\n**7. Sync with upstream**\n\`\`\`bash\ngit fetch upstream\ngit rebase upstream/main\n\`\`\``,
      },
      {
        id: 3,
        title: 'Writing Great Pull Requests',
        type: 'lesson',
        duration: 15,
        content: `A great PR respects maintainers' time and increases the chance of being merged.\n\n**Before opening a PR:**\n- Check CONTRIBUTING.md (if it exists)\n- Search existing issues and PRs for duplicates\n- Open an issue first for large changes — get buy-in before coding\n- Run the project's test suite locally\n\n**PR title format (Conventional Commits):**\n\`\`\`\nfeat: add dark mode toggle\nfix: resolve memory leak in auth middleware\ndocs: update README installation steps\ntest: add unit tests for payment module\nchore: update dependencies to latest\n\`\`\`\n\n**PR description template:**\n\`\`\`markdown\n## What\nBrief description of the change.\n\n## Why\nThe problem this solves.\n\n## How\nApproach taken and any tradeoffs.\n\n## Testing\nHow you verified the change works.\n\n## Screenshots (if UI change)\n\`\`\`\n\n**After opening a PR:**\n- Respond to review comments promptly\n- Push fixes as new commits (don't force push until asked)\n- Be gracious — maintainers are volunteers`,
      },
      {
        id: 4,
        title: 'Open Source Licenses',
        type: 'lesson',
        duration: 15,
        content: `Every open source project has a license that determines what you can do with the code.\n\n**Permissive licenses (do almost anything):**\n- **MIT** — do whatever, just keep the copyright notice. Most popular.\n- **Apache 2.0** — same as MIT + patent protection\n- **BSD 2/3-clause** — similar to MIT\n\n**Copyleft licenses (derivatives must stay open):**\n- **GPL v2/v3** — if you distribute a modified version, you must open-source it (Linux kernel)\n- **LGPL** — softer GPL, allows linking without copyleft (used for libraries)\n- **AGPL** — GPL extended to network use (if you run modified AGPL code as a service, release it)\n\n**Not open source (watch out for):**\n- Business Source License (BSL) — becomes OSS after X years\n- SSPL — MongoDB's license; rejected by OSI\n- Commons Clause — adds commercial restrictions to any license\n\n**Rule of thumb:** For new projects, use MIT unless you have a strong reason not to. For libraries used in enterprise software, check for GPL compatibility issues.`,
      },
      {
        id: 5,
        title: 'Finding Your First Issue',
        type: 'lesson',
        duration: 12,
        content: `Finding a good first issue is the hardest part for beginners. Here's how:\n\n**GitHub labels to search:**\n- \`good first issue\` — explicitly marked beginner-friendly\n- \`help wanted\` — maintainers want external help\n- \`documentation\` — often low barrier\n- \`bug\` — concrete problem to fix\n\n**Search on GitHub:**\n\`\`\`\nlabel:"good first issue" language:python stars:>500\n\`\`\`\n\n**Other resources:**\n- **goodfirstissue.dev** — curated first issues\n- **up-for-grabs.net** — project directory\n- **opensourcefriday.com** — Fridays dedicated to OSS\n- **hacktoberfest** — October event with prizes\n\n**Start small:**\n- Fix a typo in documentation\n- Add a missing test\n- Improve error messages\n- Translate strings\n\nYour first merged PR is the hardest. After that, it gets much easier.`,
      },
      {
        id: 6,
        title: 'Building Your OSS Portfolio',
        type: 'lesson',
        duration: 15,
        content: `Your GitHub profile is your live portfolio. Here's how to make it stand out.\n\n**Profile README:**\nCreate \`github.com/username/username\` repo with a README.md:\n- Brief intro (who you are, what you build)\n- Tech stack badges\n- GitHub stats widget\n- Recent contributions or blog posts\n\n**Contribution graph:**\nConsistency matters more than volume. 1-2 commits/day beats a burst then nothing.\n\n**Pinned repositories:**\nPin your best 6 repos. Each should have:\n- Descriptive README with setup instructions\n- Live demo link (Vercel/Netlify)\n- Topics/tags for discoverability\n\n**Contribute to projects people use:**\nA merged PR in VS Code, ESLint, or React carries more weight than 10 PRs in obscure projects.\n\n**Write about what you learn:**\nBlog posts, dev.to articles, or Twitter threads referencing your PRs dramatically increase visibility.`,
      },
    ],
  },

  /* ────────── 6. NETWORK SECURITY ────────── */
  {
    slug: 'network-security',
    title: 'Network Security Fundamentals',
    subtitle: 'TCP/IP · Firewalls · IDS/IPS · VPN · TLS',
    description:
      'Understand how networks work and how to secure them. From TCP/IP fundamentals to firewalls, VPNs, and TLS — the foundational layer of all security.',
    category: 'cybersecurity',
    level: 'beginner',
    duration: 160,
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    tags: ['Networking', 'TCP/IP', 'TLS', 'Firewall', 'VPN'],
    featured: false,
    lessons: [
      {
        id: 1,
        title: 'The OSI Model & TCP/IP Stack',
        type: 'lesson',
        duration: 18,
        content: `The OSI (Open Systems Interconnection) model is a conceptual framework with 7 layers. In practice, TCP/IP uses 4 layers.\n\n**OSI layers (remember: "Please Do Not Throw Sausage Pizza Away"):**\n7. Application — HTTP, FTP, DNS, SMTP\n6. Presentation — encryption, compression, encoding\n5. Session — manages connections between apps\n4. Transport — TCP/UDP, port numbers, reliability\n3. Network — IP addresses, routing\n2. Data Link — MAC addresses, switches, ARP\n1. Physical — cables, WiFi signals, voltages\n\n**TCP vs UDP:**\n| | TCP | UDP |\n|--|-----|-----|\n| Connection | Yes (3-way handshake) | No |\n| Reliability | Guaranteed delivery | Best-effort |\n| Order | In-order | Any order |\n| Speed | Slower | Faster |\n| Use | HTTP, SSH, SMTP | DNS, DHCP, video |\n\n**TCP 3-way handshake:**\nClient → SYN → Server\nClient ← SYN-ACK ← Server\nClient → ACK → Server`,
      },
      {
        id: 2,
        title: 'DNS, DHCP & Core Protocols',
        type: 'lesson',
        duration: 15,
        content: `**DNS (Domain Name System):**\nTranslates domain names to IP addresses.\n\n**DNS resolution process:**\n1. Browser cache → OS cache → /etc/hosts\n2. Recursive resolver (your ISP or 8.8.8.8)\n3. Root nameserver → "ask .com"\n4. TLD nameserver (.com) → "ask example.com NS"\n5. Authoritative nameserver → returns A record\n\n**DNS record types:**\n- A — IPv4 address\n- AAAA — IPv6 address\n- CNAME — alias to another hostname\n- MX — mail server\n- TXT — verification, SPF, DKIM\n- NS — nameserver\n\n**DHCP (Dynamic Host Configuration Protocol):**\nAutomates IP address assignment. Process: DORA\n- **D**iscover — broadcast "any DHCP servers?"\n- **O**ffer — DHCP server proposes an IP\n- **R**equest — client accepts the offer\n- **A**cknowledge — DHCP server confirms\n\n**Key ports to memorize:**\n| Port | Service |\n|------|---------|\n| 22 | SSH |\n| 25/465/587 | SMTP |\n| 53 | DNS |\n| 80/443 | HTTP/HTTPS |\n| 389/636 | LDAP/LDAPS |\n| 3306 | MySQL |\n| 5432 | PostgreSQL |`,
      },
      {
        id: 3,
        title: 'TLS/SSL — Encryption in Transit',
        type: 'lesson',
        duration: 20,
        content: `TLS (Transport Layer Security) encrypts data in transit between client and server.\n\n**TLS 1.3 Handshake (simplified):**\n1. Client Hello — supported cipher suites, TLS version, random nonce\n2. Server Hello — chosen cipher, server certificate, random nonce\n3. Key Exchange — ECDHE generates shared secret (Diffie-Hellman)\n4. Client Finished — Handshake complete\n5. Application data — symmetrically encrypted with AES-GCM\n\n**Certificates:**\n- Issued by Certificate Authorities (CAs): Let's Encrypt (free), DigiCert, Comodo\n- Contains: domain, public key, issuer, expiry, signature\n- Browser validates: chain of trust to trusted root CA\n\n**Common TLS vulnerabilities:**\n- **BEAST** — TLS 1.0 CBC mode flaw → upgrade to TLS 1.2+\n- **POODLE** — SSL 3.0 flaw → disable SSL 3.0\n- **Heartbleed** — OpenSSL memory leak → patch OpenSSL\n- **BEAST/CRIME/BREACH** — compression attacks → disable TLS compression\n\n**Best practice config:**\n- TLS 1.2 minimum, prefer TLS 1.3\n- Disable SSLv2, SSLv3, TLS 1.0, TLS 1.1\n- Use HSTS (HTTP Strict Transport Security)\n- Enable OCSP Stapling`,
      },
      {
        id: 4,
        title: 'Firewalls & Network Segmentation',
        type: 'lesson',
        duration: 20,
        content: `A firewall filters network traffic based on rules.\n\n**Firewall types:**\n- **Packet filter** — rules based on IP, port, protocol. Fast, stateless.\n- **Stateful firewall** — tracks connection state, allows return traffic automatically.\n- **Next-gen firewall (NGFW)** — deep packet inspection, application awareness, IPS, TLS decryption.\n- **WAF** (Web Application Firewall) — protects web apps from SQLi, XSS, CSRF.\n\n**iptables example (Linux):**\n\`\`\`bash\n# Allow established connections\niptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT\n\n# Allow SSH from specific IP\niptables -A INPUT -p tcp --dport 22 -s 192.168.1.0/24 -j ACCEPT\n\n# Drop all other inbound\niptables -A INPUT -j DROP\n\`\`\`\n\n**Network segmentation:**\nDivide your network into zones based on trust level:\n\n\`\`\`\nInternet → DMZ → Internal → Restricted\n  (low trust)  (medium)  (high)  (critical)\n\`\`\`\n\n- Web servers in DMZ\n- App servers in internal\n- Database in restricted\n- Only necessary traffic flows between zones`,
      },
    ],
  },

  /* ────────── 7. DOCKER & CONTAINERS ────────── */
  {
    slug: 'docker-containers',
    title: 'Docker & Container Fundamentals',
    subtitle: 'Docker · Compose · Registries · Security',
    description:
      'Package and ship applications using Docker. Learn containers, images, Compose, and container security from first principles.',
    category: 'cloud',
    level: 'beginner',
    duration: 150,
    thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&q=80',
    tags: ['Docker', 'Containers', 'DevOps', 'CI/CD', 'Kubernetes'],
    featured: false,
    lessons: [
      {
        id: 1,
        title: 'Containers vs Virtual Machines',
        type: 'lesson',
        duration: 12,
        content: `**Virtual Machines** include a full OS, hypervisor, and app. Heavy (~GBs), slow to start.\n\n**Containers** share the host OS kernel, isolate at the process level. Lightweight (~MBs), start in milliseconds.\n\n| | VM | Container |\n|--|----|-----------|\n| Isolation | Full OS | Process-level |\n| Boot time | Minutes | Milliseconds |\n| Size | GBs | MBs |\n| Density | Low | High |\n| Portability | Low | High |\n\n**Docker** is the most popular container runtime. It uses Linux kernel features:\n- **namespaces** — isolate process, network, filesystem views\n- **cgroups** — limit CPU, memory, I/O usage\n- **Union filesystems** — layered filesystem for images\n\nThe Docker daemon (\`dockerd\`) runs as root and manages containers. The Docker CLI (\`docker\`) communicates with the daemon via a socket.`,
      },
      {
        id: 2,
        title: 'Dockerfile — building images',
        type: 'lesson',
        duration: 20,
        content: `A Dockerfile is a recipe for building a container image.\n\n**Example Node.js Dockerfile:**\n\`\`\`dockerfile\n# Base image\nFROM node:20-alpine\n\n# Set working directory\nWORKDIR /app\n\n# Copy dependency files first (layer caching)\nCOPY package*.json ./\nRUN npm ci --only=production\n\n# Copy app code\nCOPY . .\n\n# Non-root user for security\nRUN addgroup -S appgroup && adduser -S appuser -G appgroup\nUSER appuser\n\n# Expose port\nEXPOSE 3000\n\n# Start command\nCMD ["node", "server.js"]\n\`\`\`\n\n**Build & run:**\n\`\`\`bash\ndocker build -t myapp:1.0 .\ndocker run -p 3000:3000 --env-file .env myapp:1.0\n\`\`\`\n\n**Multi-stage builds** (reduce final image size):\n\`\`\`dockerfile\nFROM node:20 AS builder\nWORKDIR /app\nCOPY . .\nRUN npm ci && npm run build\n\nFROM node:20-alpine\nCOPY --from=builder /app/dist ./dist\nCMD ["node", "dist/server.js"]\n\`\`\``,
      },
      {
        id: 3,
        title: 'Docker Compose — multi-container apps',
        type: 'lesson',
        duration: 20,
        content: `Docker Compose defines and runs multi-container applications.\n\n**docker-compose.yml example:**\n\`\`\`yaml\nversion: '3.8'\n\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      DATABASE_URL: postgresql://user:pass@db:5432/myapp\n    depends_on:\n      db:\n        condition: service_healthy\n    restart: unless-stopped\n\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: pass\n      POSTGRES_DB: myapp\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n    healthcheck:\n      test: ["CMD", "pg_isready", "-U", "user"]\n      interval: 5s\n      timeout: 5s\n      retries: 5\n\nvolumes:\n  postgres_data:\n\`\`\`\n\n**Commands:**\n\`\`\`bash\ndocker compose up -d       # start in background\ndocker compose logs -f app # follow logs\ndocker compose down        # stop and remove\ndocker compose ps          # status\n\`\`\``,
      },
    ],
  },

  /* ────────── 8. LINUX FUNDAMENTALS ────────── */
  {
    slug: 'linux-fundamentals',
    title: 'Linux for Developers & DevOps',
    subtitle: 'CLI · Shell · Permissions · Processes · SSH',
    description:
      'Become fluent at the Linux command line. Everything from filesystem navigation to shell scripting, processes, and SSH — skills used daily by every engineer.',
    category: 'opensource',
    level: 'beginner',
    duration: 180,
    thumbnail: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1200&q=80',
    tags: ['Linux', 'CLI', 'Bash', 'Shell', 'SSH', 'Scripting'],
    featured: false,
    lessons: [
      {
        id: 1,
        title: 'The Filesystem Hierarchy',
        type: 'lesson',
        duration: 12,
        content: `Linux uses a single unified filesystem tree rooted at \`/\`.\n\n**Key directories:**\n\`\`\`\n/           Root of the filesystem\n├── bin     Essential system binaries (ls, cp, mv)\n├── etc     System configuration files\n├── home    User home directories (/home/tito)\n├── var     Variable data (logs, databases, mail)\n├── tmp     Temporary files (cleared on reboot)\n├── usr     User programs and libraries\n│   ├── bin     User binaries\n│   └── local   Locally installed software\n├── opt     Optional third-party software\n├── proc    Virtual filesystem — kernel/process info\n├── sys     Virtual filesystem — hardware info\n└── dev     Device files (hard drives, terminals)\n\`\`\`\n\n**Navigation:**\n\`\`\`bash\npwd           # print working directory\nls -la        # list all files with permissions\ncd ~          # go to home directory\ncd -          # go to previous directory\nfind /etc -name "*.conf"   # find files\ntree -L 2     # directory tree (install: apt install tree)\n\`\`\``,
      },
      {
        id: 2,
        title: 'File Permissions & Ownership',
        type: 'lesson',
        duration: 18,
        content: `Linux permission system controls who can read, write, or execute files.\n\n**Permission string: \`-rwxr-xr--\`**\n\`\`\`\n- rwx r-x r--\n│ │   │   └─ Others: read only\n│ │   └───── Group: read + execute\n│ └───────── Owner: read + write + execute\n└─────────── Type: - file, d directory, l symlink\n\`\`\`\n\n**chmod (change permissions):**\n\`\`\`bash\nchmod 755 script.sh   # rwxr-xr-x  (numeric)\nchmod +x script.sh    # add execute bit (symbolic)\nchmod go-w file.txt   # remove write from group+others\n\`\`\`\n\n**Octal reference:**\n\`\`\`\n4 = read (r)\n2 = write (w)\n1 = execute (x)\n\n7 = rwx, 6 = rw-, 5 = r-x, 4 = r--, 0 = ---\n\`\`\`\n\n**chown (change ownership):**\n\`\`\`bash\nchown tito:developers file.txt  # user:group\nchown -R www-data /var/www      # recursive\n\`\`\`\n\n**SUID/SGID/Sticky:**\n- SUID (\`4xxx\`) — run as owner (sudo, passwd)\n- SGID (\`2xxx\`) — inherit group on new files\n- Sticky (\`1xxx\`) — only owner can delete (/tmp)`,
      },
      {
        id: 3,
        title: 'Processes & System Resources',
        type: 'lesson',
        duration: 15,
        content: `**Process commands:**\n\`\`\`bash\nps aux            # list all processes\ntop               # interactive process monitor\nhtop              # better top (install: apt install htop)\nkill -9 PID       # forcefully terminate process\npkill nginx       # kill by name\nnohup cmd &       # run in background, survive logout\njobs              # list background jobs\nbg %1             # resume job 1 in background\nfg %1             # bring job 1 to foreground\n\`\`\`\n\n**systemd (service management):**\n\`\`\`bash\nsystemctl status nginx     # check service status\nsystemctl start nginx      # start\nsystemctl stop nginx       # stop\nsystemctl restart nginx    # restart\nsystemctl enable nginx     # auto-start on boot\nsystemctl disable nginx    # remove auto-start\njournalctl -u nginx -f     # follow service logs\n\`\`\`\n\n**Resource monitoring:**\n\`\`\`bash\ndf -h            # disk usage\ndu -sh /var/*    # directory sizes\nfree -h          # memory usage\nvmstat 1         # CPU/memory/io stats (every 1s)\niostat           # I/O statistics\nnetstat -tlnp    # listening ports + PIDs\nss -tlnp         # modern replacement for netstat\n\`\`\``,
      },
    ],
  },

  /* ────────── 9. PROMPT ENGINEERING PRO ────────── */
  {
    slug: 'prompt-engineering-pro',
    title: 'Prompt Engineering for Professionals',
    subtitle: 'Advanced Techniques · RAG · Agents · Evals',
    description:
      'Go beyond basics. Master production-grade prompt patterns, build reliable AI pipelines, and evaluate LLM outputs systematically.',
    category: 'ai',
    level: 'intermediate',
    duration: 140,
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
    tags: ['Prompt Engineering', 'RAG', 'LLM', 'Claude', 'Evals'],
    featured: false,
    lessons: [
      {
        id: 1,
        title: 'The Prompt Engineering Mindset',
        type: 'lesson',
        duration: 12,
        content: `Prompt engineering is not just writing instructions — it's designing a reliable interface between human intent and model behavior.\n\n**The four properties of great prompts:**\n1. **Clarity** — unambiguous intent, no guessing required\n2. **Completeness** — all necessary context provided\n3. **Constraints** — explicit boundaries on format, tone, scope\n4. **Calibration** — appropriate difficulty for the model\n\n**Mental model: LLMs as junior developers**\nThink of the model as a brilliant but over-eager new hire who:\n- Takes instructions literally\n- Fills gaps with plausible-sounding guesses\n- Needs explicit success criteria\n- Works best with examples\n\n**The "blank page" test:**\nIf a random person read only your prompt with no other context, could they do the task correctly? If no — your prompt needs more information.`,
      },
      {
        id: 2,
        title: 'Structured Prompting with XML',
        type: 'lesson',
        duration: 15,
        content: `Anthropic's Claude is particularly good at following XML-structured prompts because XML was heavily represented in its training data.\n\n**Template for complex tasks:**\n\`\`\`xml\n<task>Analyze this code for security vulnerabilities</task>\n\n<context>\n  Language: Python\n  Framework: FastAPI\n  Environment: Production API handling PII\n</context>\n\n<code>\ndef get_user(user_id):\n    query = f"SELECT * FROM users WHERE id = {user_id}"\n    return db.execute(query)\n</code>\n\n<output_format>\nRespond with:\n1. Vulnerability name and OWASP category\n2. Severity: Critical/High/Medium/Low\n3. Affected line numbers\n4. Fixed code\n5. Why the fix works\n</output_format>\n\`\`\`\n\n**Benefits of XML structure:**\n- Model clearly knows where each component begins and ends\n- Easier to programmatically substitute values\n- Reduces ambiguity in complex prompts\n- Model can reference specific sections by tag name`,
      },
      {
        id: 3,
        title: 'Building RAG Systems',
        type: 'lesson',
        duration: 25,
        content: `Retrieval-Augmented Generation (RAG) grounds LLM responses in your own data.\n\n**RAG pipeline:**\n\`\`\`\nDocument → Chunk → Embed → Store in vector DB\n                                ↓\nUser query → Embed → Similarity search → Top-k chunks\n                                            ↓\nSystem prompt + chunks + query → LLM → Grounded answer\n\`\`\`\n\n**Chunking strategies:**\n- Fixed-size chunks (512 tokens) — simple, works well\n- Semantic chunking — split on meaning boundaries\n- Hierarchical — document → sections → paragraphs\n\n**Embedding models:**\n- OpenAI text-embedding-3-small — best price/quality\n- Cohere embed-v3 — strong multilingual\n- BGE-M3 — open source, self-hostable\n\n**Vector databases:**\n- Pinecone — managed, simple\n- Weaviate — open source, GraphQL interface\n- pgvector — Postgres extension (simplest if you're already on Postgres)\n- Chroma — local development\n\n**Retrieval quality tips:**\n- Store metadata with chunks (source, date, section)\n- Use hybrid search (dense + sparse BM25)\n- Re-rank results with a cross-encoder before sending to LLM\n- Include surrounding context with each retrieved chunk`,
      },
    ],
  },

  /* ────────── 10. PYTHON FOR SECURITY ────────── */
  {
    slug: 'python-security',
    title: 'Python for Security Professionals',
    subtitle: 'Scripting · Automation · Network Tools · Malware Analysis',
    description:
      'Use Python to automate security tasks — port scanners, log parsers, exploit PoCs, and threat intel tools. Build tools that real security teams use.',
    category: 'cybersecurity',
    level: 'intermediate',
    duration: 200,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80',
    tags: ['Python', 'Security', 'Automation', 'Scripting', 'Network'],
    featured: false,
    lessons: [
      {
        id: 1,
        title: 'Python Security Toolkit Setup',
        type: 'lesson',
        duration: 15,
        content: `**Environment setup:**\n\`\`\`bash\n# Create isolated environment\npython3 -m venv secenv\nsource secenv/bin/activate\n\n# Install essential security libs\npip install scapy requests python-nmap dnspython\npip install cryptography pycryptodome\npip install pandas colorama tqdm\n\`\`\`\n\n**Essential security libraries:**\n\n| Library | Purpose |\n|---------|---------|\n| scapy | Packet crafting, sniffing |\n| requests | HTTP requests, web scraping |\n| python-nmap | Nmap automation |\n| dnspython | DNS queries and zone transfers |\n| cryptography | Encryption, certificates |\n| impacket | SMB, Kerberos, NTLM |\n| paramiko | SSH client automation |\n| shodan | Search engine API |\n\n**Running scripts safely:**\nAlways test in an isolated VM. Never run scripts on networks you don't own without explicit permission. Document all testing activity.`,
      },
      {
        id: 2,
        title: 'Network Scanner from Scratch',
        type: 'lesson',
        duration: 25,
        content: `**Simple TCP port scanner:**\n\`\`\`python\nimport socket\nimport concurrent.futures\nimport sys\n\ndef scan_port(host, port):\n    try:\n        with socket.create_connection((host, port), timeout=1):\n            return port, True\n    except (ConnectionRefusedError, TimeoutError):\n        return port, False\n\ndef scan_host(host, port_range=(1, 1024)):\n    open_ports = []\n    ports = range(port_range[0], port_range[1] + 1)\n    \n    with concurrent.futures.ThreadPoolExecutor(max_workers=100) as executor:\n        futures = {executor.submit(scan_port, host, p): p for p in ports}\n        for future in concurrent.futures.as_completed(futures):\n            port, is_open = future.result()\n            if is_open:\n                open_ports.append(port)\n                print(f"  [+] Port {port} OPEN")\n    \n    return sorted(open_ports)\n\nif __name__ == "__main__":\n    target = sys.argv[1] if len(sys.argv) > 1 else "127.0.0.1"\n    print(f"Scanning {target}...")\n    open_ports = scan_host(target)\n    print(f"\\nFound {len(open_ports)} open port(s)")\n\`\`\`\n\nRun: \`python scanner.py 192.168.1.1\`\n\n**Add service banner grabbing** — try to read the first bytes after connecting to identify what's listening.`,
      },
      {
        id: 3,
        title: 'Log Analysis & Threat Detection',
        type: 'lesson',
        duration: 25,
        content: `**Parse Apache access logs:**\n\`\`\`python\nimport re\nfrom collections import Counter\n\nLOG_PATTERN = re.compile(\n    r'(\\S+) \\S+ \\S+ \\[(.+?)\\] "(.+?)" (\\d+) (\\S+)'\n)\n\ndef parse_log(filepath):\n    entries = []\n    with open(filepath) as f:\n        for line in f:\n            match = LOG_PATTERN.match(line)\n            if match:\n                ip, timestamp, request, status, size = match.groups()\n                entries.append({\n                    "ip": ip,\n                    "timestamp": timestamp,\n                    "request": request,\n                    "status": int(status),\n                    "size": size,\n                })\n    return entries\n\ndef detect_brute_force(entries, threshold=20):\n    """Flag IPs with 20+ failed auth attempts"""\n    failed = [e for e in entries if e["status"] in (401, 403)]\n    ip_counts = Counter(e["ip"] for e in failed)\n    return {ip: count for ip, count in ip_counts.items() \n            if count >= threshold}\n\nentries = parse_log("/var/log/apache2/access.log")\nsuspicious = detect_brute_force(entries)\nfor ip, count in suspicious.items():\n    print(f"ALERT: {ip} — {count} failed attempts")\n\`\`\``,
      },
    ],
  },
];

export function getCourseBySlug(slug) {
  return courses.find((c) => c.slug === slug) ?? null;
}

export function getCoursesByCategory(category) {
  if (!category || category === 'all') return courses;
  return courses.filter((c) => c.category === category);
}

export function getFeaturedCourses() {
  return courses.filter((c) => c.featured);
}

export function getTotalStats() {
  return {
    totalCourses: courses.length,
    totalLessons: courses.reduce((acc, c) => acc + c.lessons.length, 0),
    totalHours: Math.round(courses.reduce((acc, c) => acc + c.duration, 0) / 60),
  };
}
