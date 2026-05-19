import { NextResponse } from 'next/server';
import { jwtVerify }   from 'jose';

const PROTECTED  = ['/dashboard'];
const AUTH_PAGES = ['/login', '/signup'];

const SECURITY_HEADERS = {
  'X-Frame-Options':           'DENY',
  'X-Content-Type-Options':    'nosniff',
  'Referrer-Policy':           'strict-origin-when-cross-origin',
  'Permissions-Policy':        'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' https://images.unsplash.com data: blob:",
    "connect-src 'self'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; '),
};

function applySecurityHeaders(response) {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(k, v);
  }
  return response;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('tp_token')?.value;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthPage  = AUTH_PAGES.some((p) => pathname.startsWith(p));

  if (isProtected) {
    if (!token) {
      return applySecurityHeaders(NextResponse.redirect(new URL('/login', request.url)));
    }
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret, {
        issuer:   'techpulse-academy',
        audience: 'techpulse-users',
      });
      return applySecurityHeaders(NextResponse.next());
    } catch {
      const res = NextResponse.redirect(new URL('/login', request.url));
      res.cookies.delete('tp_token');
      return applySecurityHeaders(res);
    }
  }

  if (isAuthPage && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret, {
        issuer:   'techpulse-academy',
        audience: 'techpulse-users',
      });
      return applySecurityHeaders(NextResponse.redirect(new URL('/dashboard', request.url)));
    } catch {
      // stale token — let them reach login
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
