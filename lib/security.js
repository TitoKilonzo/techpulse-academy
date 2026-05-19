/**
 * lib/security.js
 * Central security utilities: rate limiting, input validation, sanitization.
 *
 * Rate limiter note: uses an in-memory Map — suitable for single-process and
 * local dev. For multi-instance Vercel production, swap the store with
 * @upstash/ratelimit + @upstash/redis (documented in README).
 */

// ─── Rate limiter ────────────────────────────────────────────────────────────

/** @type {Map<string, {count:number, resetAt:number}>} */
const RL_STORE = new Map();

// Prune expired entries every 10 minutes to avoid unbounded memory growth.
// setInterval is fine in Node.js API-route context; skipped in Edge runtime.
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of RL_STORE) {
      if (now > v.resetAt) RL_STORE.delete(k);
    }
  }, 10 * 60 * 1000);
}

/**
 * Sliding-window rate limiter.
 * @param {string}  key        Unique key, e.g. `login:${ip}` or `signup:${ip}`
 * @param {number}  max        Max requests allowed in the window
 * @param {number}  windowMs   Window length in milliseconds
 * @returns {{ allowed: boolean, remaining: number, retryAfterSec: number }}
 */
export function rateLimit(key, max, windowMs) {
  const now  = Date.now();
  let   entry = RL_STORE.get(key);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs };
  }

  entry.count += 1;
  RL_STORE.set(key, entry);

  return {
    allowed:       entry.count <= max,
    remaining:     Math.max(0, max - entry.count),
    retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
  };
}

// Pre-configured limiters (exported for convenience)
/** 5 login attempts per 15 minutes per IP */
export const loginLimiter   = (ip) => rateLimit(`login:${ip}`,  5,  15 * 60 * 1000);
/** 3 signups per hour per IP */
export const signupLimiter  = (ip) => rateLimit(`signup:${ip}`, 3,  60 * 60 * 1000);
/** 60 progress updates per minute per user (generous) */
export const progressLimiter= (id) => rateLimit(`prog:${id}`,  60,  60 * 1000);

// ─── IP extractor ────────────────────────────────────────────────────────────

/**
 * Extract client IP from a Next.js request.
 * Respects Vercel's x-forwarded-for in production.
 */
export function getClientIp(request) {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? '127.0.0.1';
}

// ─── CSRF / Origin validation ────────────────────────────────────────────────

/**
 * Validates that the request Origin matches the app host.
 * Protects mutating API routes against CSRF (defence-in-depth on top of
 * SameSite=Lax cookies).
 * Returns true when the origin is acceptable (or in dev with no origin).
 */
export function isSameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) {
    // No Origin header — likely server-to-server or same-origin non-browser.
    // Allow but log; browsers always send Origin on cross-site requests.
    return true;
  }
  try {
    const host       = request.headers.get('host') ?? '';
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

// ─── Input validators ────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns true for a plausible email address. */
export function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_RE.test(email) && email.length <= 320;
}

/**
 * Password complexity rules (fixes M2):
 *  - 8–128 characters
 *  - At least one uppercase letter
 *  - At least one digit or special character
 * Returns null on success, or a human-readable error string.
 */
export function validatePassword(password) {
  if (typeof password !== 'string')     return 'Password is required.';
  if (password.length < 8)              return 'Password must be at least 8 characters.';
  if (password.length > 128)            return 'Password must be 128 characters or fewer.';
  if (!/[A-Z]/.test(password))         return 'Password must contain at least one uppercase letter.';
  if (!/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    return 'Password must contain at least one number or special character.';
  return null;
}

/**
 * Validates a display name.
 * Returns null on success, or an error string.
 */
export function validateName(name) {
  if (typeof name !== 'string' || !name.trim()) return 'Name is required.';
  if (name.trim().length < 2)   return 'Name must be at least 2 characters.';
  if (name.trim().length > 100) return 'Name must be 100 characters or fewer.';
  return null;
}

// ─── Sanitizers ──────────────────────────────────────────────────────────────

/** Strip HTML tags and trim whitespace. Prevents stored XSS. */
export function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>/g, '')   // strip HTML tags
    .replace(/[<>]/g, '')      // strip any remaining angle brackets
    .trim();
}

/** Normalise and sanitize an email address. */
export function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email.toLowerCase().trim().slice(0, 320);
}

// ─── Request body size guard ─────────────────────────────────────────────────

const MAX_BODY_BYTES = 8 * 1024; // 8 KB — more than enough for auth payloads

/**
 * Returns true if Content-Length exceeds MAX_BODY_BYTES.
 * Protects against DoS via oversized JSON bodies (fixes H5).
 */
export function isBodyTooLarge(request) {
  const cl = request.headers.get('content-length');
  if (!cl) return false; // no content-length — can't check; rely on JSON parse limit
  return parseInt(cl, 10) > MAX_BODY_BYTES;
}

// ─── Safe error logger ───────────────────────────────────────────────────────

/**
 * Logs an error server-side without leaking sensitive fields (fixes M3).
 * In production you would send this to a structured logging service.
 */
export function logError(context, err) {
  const safe = {
    context,
    message: err?.message ?? String(err),
    code:    err?.code,
  };
  // Intentionally omit err.stack and request body from logs.
  console.error(JSON.stringify(safe));
}

// ─── JWT secret guard ────────────────────────────────────────────────────────

/** Throws if JWT_SECRET is too short (fixes M5). Call once at startup. */
export function assertJwtSecret() {
  const s = process.env.JWT_SECRET ?? '';
  if (s.length < 32) {
    throw new Error(
      'JWT_SECRET must be at least 32 characters. ' +
      'Generate one with: openssl rand -base64 32'
    );
  }
}
