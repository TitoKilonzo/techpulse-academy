# TechPulse Academy

> Open-source e-learning platform for Tech, Cybersecurity, Claude/AI, Open Source & Cloud Computing.

![TechPulse Academy](https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80)

## Features

- **Multi-track Learning** — Courses in Cybersecurity, AI/Claude, Cloud Computing, Open Source, and Tech Fundamentals
- **Progress Tracking** — Per-user lesson completion stored in Turso (SQLite edge database)
- **Auth** — JWT-based auth with bcrypt password hashing; httpOnly cookies
- **Responsive** — Mobile-first design, works on all screen sizes
- **Real Content** — SOC Analyst Lab, Authentication Fundamentals, AWS Foundations, and more
- **Vercel Ready** — One-click deploy with environment variable support

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + CSS Variables |
| Database | Turso (libsql / SQLite) |
| Auth | JWT (jose) + bcryptjs |
| Icons | Lucide React |
| Deploy | Vercel |

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/TitoKilonzo/techpulse-academy
cd techpulse-academy
npm install
```

### 2. Set up Turso Database

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Create database
turso db create techpulse-academy

# Get connection URL
turso db show techpulse-academy --url

# Create auth token
turso db tokens create techpulse-academy
```

### 3. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local with your Turso URL, auth token, and JWT secret
```

### 4. Initialize database

```bash
npm run db:init
```

### 5. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. Add environment variables:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `JWT_SECRET`
4. Deploy

## Project Structure

```
techpulse-academy/
├── app/                    # Next.js App Router
│   ├── page.js             # Landing page
│   ├── login/              # Login page
│   ├── signup/             # Sign-up page
│   ├── dashboard/          # Protected dashboard
│   │   ├── page.js         # Main dashboard
│   │   ├── courses/        # Course listing
│   │   └── profile/        # User profile
│   └── api/                # API routes
├── components/             # React components
│   ├── dashboard/          # Dashboard-specific components
│   ├── courses/            # Course-related components
│   └── ui/                 # Reusable UI primitives
├── lib/                    # Utilities & data
│   ├── db.js               # Turso database client
│   ├── auth.js             # JWT helpers
│   ├── courses.js          # All course content data
│   └── utils.js            # Shared utilities
└── scripts/
    └── init-db.mjs         # Database initialization script
```

## Contributing

Pull requests are welcome! Please open an issue first to discuss changes.

## License

MIT © TechPulse Academy Contributors
