/**
 * GET /api/auth/me
 * Returns the current user's public profile — no sensitive fields.
 */
import { NextResponse }   from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { queryFirst }     from '@/lib/db';
import { logError }       from '@/lib/security';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const payload = await getCurrentUser();
    if (!payload) return NextResponse.json({ user: null });

    // Only return safe, non-sensitive columns (no password_hash, no role exposure)
    const user = await queryFirst(
      'SELECT id, name, email, xp, streak, created_at FROM users WHERE id = ?',
      [payload.id]
    );
    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({ user });
  } catch (err) {
    logError('me', err);
    return NextResponse.json({ user: null });
  }
}
