/**
 * lib/auth.js
 * JWT helpers — hardened with iss/aud claims (fixes M1) and secret
 * length validation (fixes M5).
 */
import { SignJWT, jwtVerify } from 'jose';
import { cookies }            from 'next/headers';

const COOKIE_NAME = 'tp_token';
const ISSUER      = 'techpulse-academy';
const AUDIENCE    = 'techpulse-users';
const EXPIRY      = '7d';

function getSecret() {
  const secret = process.env.JWT_SECRET ?? '';
  if (secret.length < 32) {
    throw new Error(
      'JWT_SECRET must be at least 32 characters. ' +
      'Generate with: openssl rand -base64 32'
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .setIssuer(ISSUER)       // fixes M1
    .setAudience(AUDIENCE)   // fixes M1
    .sign(getSecret());
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer:   ISSUER,
      audience: AUDIENCE,
    });
    // Validate expected shape to prevent tampered payloads
    if (typeof payload.id !== 'number' || !payload.email) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(payload) {
  const token = await signToken(payload);
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,                                          // no JS access
    secure:   process.env.NODE_ENV === 'production',        // HTTPS only in prod
    sameSite: 'lax',                                        // CSRF protection
    maxAge:   60 * 60 * 24 * 7,                             // 7 days
    path:     '/',
  });
  return token;
}

export async function clearAuthCookie() {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   0,   // expire immediately
    path:     '/',
  });
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
