# Security Policy

## Reporting a Vulnerability

Please **do not** open public GitHub issues for security vulnerabilities.
Email: security@your-domain.com

We aim to acknowledge reports within 48 hours and resolve critical issues within 7 days.

---

## Security Audit — Fixes Applied (v1.1.0)

### CRITICAL

| ID | Vulnerability | Fix |
|----|--------------|-----|
| C1 | Brute-force on `/api/auth/login` | Sliding-window rate limiter: 5 attempts / 15 min per IP |
| C2 | Account-spam on `/api/auth/signup` | Rate limiter: 3 signups / hour per IP |
| C3 | Client-controlled `lessonCount` allowed instant 100% course completion | `lessonCount` now derived server-side from course data; client value ignored |
| C4 | `courseSlug` and `lessonId` not validated against real data | Both are now validated against `lib/courses.js` before any DB write |
| C5 | Timing attack on login (early return skipped bcrypt) | `bcrypt.compare` always runs using a dummy hash when email not found |

### HIGH

| ID | Vulnerability | Fix |
|----|--------------|-----|
| H1 | No security headers | Middleware injects: CSP, X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| H2 | `SELECT *` returned `password_hash` to application layer | Explicit column selection excludes `password_hash` |
| H3 | XP awarded on every progress POST — repeat requests farm unlimited XP | XP only incremented for newly-completed lessons; capped at 99,999 |
| H4 | No CSRF origin validation on mutating routes | `isSameOrigin()` check on all POST routes |
| H5 | No request body size limit (DoS vector) | 8 KB body limit enforced on all auth/progress routes |
| H6 | No email format validation | RFC-5321-style regex + 320-char limit |

### MEDIUM

| ID | Vulnerability | Fix |
|----|--------------|-----|
| M1 | JWT had no `iss` / `aud` claims | `issuer: 'techpulse-academy'`, `audience: 'techpulse-users'` added to sign & verify |
| M2 | Password only checked for length | Complexity: min 8 chars + 1 uppercase + 1 digit/special; enforced client-side and server-side |
| M3 | `console.error` logged full error objects including stack traces | `logError()` sanitizer logs only `message` and `code` — no stack, no request body |
| M5 | JWT secret length not validated | `getSecret()` throws if `JWT_SECRET` < 32 characters |

---

## Security Architecture

### Authentication
- Passwords hashed with **bcrypt**, cost factor **12**
- JWTs signed with **HS256**, 7-day expiry, with `iss`/`aud`/`iat`/`exp` claims
- Tokens stored in **HttpOnly + Secure + SameSite=Lax** cookies — inaccessible to JavaScript

### Database
- All queries use **parameterized statements** via `@libsql/client` — no SQL injection possible
- Columns returned are always explicitly listed — no `SELECT *` in production paths

### Rate Limiting
The current in-memory rate limiter (using a `Map`) works correctly for single-process
deployments (local dev, single Vercel instance, Docker containers).

**For high-traffic multi-instance Vercel production**, swap `lib/security.js`'s store
with [@upstash/ratelimit](https://github.com/upstash/ratelimit):

```bash
npm install @upstash/ratelimit @upstash/redis
```

### Content Security Policy
The CSP allows `'unsafe-inline'` for scripts (required by Next.js) and styles
(required by the inline-styles architecture). To remove `'unsafe-inline'` for
scripts, migrate to Next.js nonce-based CSP and replace all inline styles with
CSS modules.

---

## Production Checklist

- [ ] `JWT_SECRET` is at least 32 random characters (`openssl rand -base64 32`)
- [ ] `NODE_ENV=production` so cookies set `Secure` flag
- [ ] Turso database has auth token rotated after any exposure
- [ ] Vercel environment variables set (never in `.env` committed to git)
- [ ] Consider adding [@upstash/ratelimit](https://github.com/upstash/ratelimit) for distributed rate limiting
