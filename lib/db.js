import { createClient } from '@libsql/client';

let _client = null;

export function getDb() {
  if (_client) return _client;

  if (!process.env.TURSO_DATABASE_URL) {
    throw new Error('TURSO_DATABASE_URL environment variable is not set');
  }
  if (!process.env.TURSO_AUTH_TOKEN) {
    throw new Error('TURSO_AUTH_TOKEN environment variable is not set');
  }

  _client = createClient({
    url:       process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  return _client;
}

function handleDbError(err) {
  const msg = err?.message ?? String(err);
  // Turso returns "Host not in allowlist" when the DB has a network allowlist
  // configured. Throw a developer-friendly error so it is easy to diagnose.
  if (msg.includes('Host not in allowlist')) {
    const e = new Error(
      'Database connection blocked: your Turso database has a network ' +
      'allowlist enabled. Open the Turso dashboard → your database → ' +
      'Settings → Allowed IPs and either disable the allowlist or add ' +
      'the IP of your server/Vercel deployment.'
    );
    e.code = 'TURSO_ALLOWLIST';
    throw e;
  }
  // Re-throw anything else unchanged
  throw err;
}

export async function query(sql, args = []) {
  try {
    const db = getDb();
    return await db.execute({ sql, args });
  } catch (err) {
    handleDbError(err);
  }
}

export async function queryFirst(sql, args = []) {
  const result = await query(sql, args);
  return result.rows[0] ?? null;
}

export async function queryAll(sql, args = []) {
  const result = await query(sql, args);
  return result.rows;
}