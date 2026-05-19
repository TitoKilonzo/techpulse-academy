import { NextResponse }    from 'next/server';
import { clearAuthCookie } from '@/lib/auth';
import { isSameOrigin }    from '@/lib/security';

export const runtime = 'nodejs';

export async function POST(request) {
  // CSRF guard: only accept same-origin logout requests
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }
  await clearAuthCookie();
  return NextResponse.json({ ok: true });
}
