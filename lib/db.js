import { createClient } from '@libsql/client';

let _client = null;

export function getDb() {
  if (_client) return _client;

  if (!process.env.TURSO_DATABASE_URL) {
    throw new Error('TURSO_DATABASE_URL environment variable is not set');
  }

  _client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  return _client;
}

export async function query(sql, args = []) {
  const db = getDb();
  return db.execute({ sql, args });
}

export async function queryFirst(sql, args = []) {
  const result = await query(sql, args);
  return result.rows[0] ?? null;
}

export async function queryAll(sql, args = []) {
  const result = await query(sql, args);
  return result.rows;
}
