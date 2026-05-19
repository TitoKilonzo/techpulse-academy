/**
 * POST /api/auth/login
 *
 * Security fixes applied:
 *  C1 — rate limiting (5 attempts / 15 min per IP)
 *  C5 — constant-time response: bcrypt.compare runs even when email not found
 *  H2 — SELECT only needed columns (no password_hash in broader scope)
 *  H4 — same-origin check
 *  H5 — body size guard
 *  H6 — email format validation
 *  M3 — safe error logging (no stack/body leakage)
 */
import { NextResponse }  from 'next/server';
import bcrypt            from 'bcryptjs';
import { queryFirst }    from '@/lib/db';
import { setAuthCookie } from '@/lib/auth';
import {
  loginLimiter,
  getClientIp,
  isSameOrigin,
  isBodyTooLarge,
  isValidEmail,
  sanitizeEmail,
  logError,
} from '@/lib/security';

export const runtime = 'nodejs';

// Dummy hash used when the email doesn't exist, so bcrypt always runs
// and the response time is indistinguishable (fixes C5 timing attack).
const DUMMY_HASH = '$2b$12$dummyhashfortimingattackpreventionXXXXXXXXXXXXXXXXX';

const ERR_INVALID = 'Invalid email or password.';

export async function POST(request) {
  try {
    // ── Body size guard (H5) ──
    if (isBodyTooLarge(request)) {
      return NextResponse.json({ error: 'Request too large.' }, { status: 413 });
    }

    // ── CSRF / same-origin check (H4) ──
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    // ── Rate limiting (C1) ──
    const ip = getClientIp(request);
    const rl = loginLimiter(ip);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${rl.retryAfterSec} seconds.` },
        {
          status: 429,
          headers: {
            'Retry-After':        String(rl.retryAfterSec),
            'X-RateLimit-Limit':  '5',
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // ── Parse & validate input ──
    let body;
    try { body = await request.json(); }
    catch { return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 }); }

    const { email: rawEmail, password } = body;

    if (!rawEmail || !password) {
      return NextResponse.json({ error: ERR_INVALID }, { status: 401 });
    }

    // H6 — email format validation
    const email = sanitizeEmail(rawEmail);
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: ERR_INVALID }, { status: 401 });
    }

    // ── Lookup (H2: only needed columns) ──
    const user = await queryFirst(
      'SELECT id, name, email, password_hash FROM users WHERE email = ?',
      [email]
    );

    // C5 — always run bcrypt regardless of whether user exists
    const hashToCompare = user?.password_hash ?? DUMMY_HASH;
    const valid = await bcrypt.compare(password, hashToCompare);

    // Unified response — never distinguish "no account" from "wrong password"
    if (!user || !valid) {
      return NextResponse.json({ error: ERR_INVALID }, { status: 401 });
    }

    // ── Issue token ──
    await setAuthCookie({ id: user.id, name: user.name, email: user.email });

    // Return minimal user info — no password_hash, no role, nothing sensitive
    return NextResponse.json({
      ok:   true,
      user: { id: user.id, name: user.name, email: user.email },
    });

  } catch (err) {
    logError('login', err);  // M3: safe logging
    return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 });
  }
}
