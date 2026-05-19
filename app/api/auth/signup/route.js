/**
 * POST /api/auth/signup
 *
 * Security fixes:
 *  C2 — rate limiting (3 signups / hour per IP)
 *  H4 — same-origin check
 *  H5 — body size guard
 *  H6 — email format + name validation
 *  M2 — password complexity (uppercase + digit/special)
 *  M3 — safe error logging
 */
import { NextResponse }  from 'next/server';
import bcrypt            from 'bcryptjs';
import { queryFirst, query } from '@/lib/db';
import { setAuthCookie } from '@/lib/auth';
import {
  signupLimiter,
  getClientIp,
  isSameOrigin,
  isBodyTooLarge,
  isValidEmail,
  validatePassword,
  validateName,
  sanitizeEmail,
  sanitizeText,
  logError,
} from '@/lib/security';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    // ── Body size guard ──
    if (isBodyTooLarge(request)) {
      return NextResponse.json({ error: 'Request too large.' }, { status: 413 });
    }

    // ── CSRF check ──
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    // ── Rate limiting (C2) ──
    const ip = getClientIp(request);
    const rl = signupLimiter(ip);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Too many signup attempts. Try again in ${rl.retryAfterSec} seconds.` },
        {
          status: 429,
          headers: { 'Retry-After': String(rl.retryAfterSec) },
        }
      );
    }

    // ── Parse body ──
    let body;
    try { body = await request.json(); }
    catch { return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 }); }

    const { name: rawName, email: rawEmail, password } = body;

    // ── Validate name (H6) ──
    const nameErr = validateName(rawName);
    if (nameErr) return NextResponse.json({ error: nameErr }, { status: 400 });
    const name = sanitizeText(rawName);

    // ── Validate email (H6) ──
    const email = sanitizeEmail(rawEmail);
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // ── Validate password (M2) ──
    const pwErr = validatePassword(password);
    if (pwErr) return NextResponse.json({ error: pwErr }, { status: 400 });

    // ── Check for existing account ──
    const existing = await queryFirst('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // ── Hash password with cost factor 12 ──
    const hash = await bcrypt.hash(password, 12);

    // ── Insert user ──
    const result = await query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hash]
    );
    const userId = Number(result.lastInsertRowid);

    await setAuthCookie({ id: userId, name, email });

    return NextResponse.json({
      ok:   true,
      user: { id: userId, name, email },
    });

  } catch (err) {
    logError('signup', err);
    return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 });
  }
}
