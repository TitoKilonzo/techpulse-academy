// scripts/init-db.mjs  –  run: node scripts/init-db.mjs
import { createClient } from '@libsql/client';
import { config }       from 'dotenv';

config({ path: '.env.local' });

const db = createClient({
  url:       process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const schema = [
  `CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT    NOT NULL,
    email         TEXT    UNIQUE NOT NULL,
    password_hash TEXT    NOT NULL,
    avatar_url    TEXT    DEFAULT NULL,
    role          TEXT    DEFAULT 'student',
    xp            INTEGER DEFAULT 0,
    streak        INTEGER DEFAULT 0,
    last_active   TEXT    DEFAULT NULL,
    created_at    TEXT    DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS user_progress (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id           INTEGER NOT NULL,
    course_slug       TEXT    NOT NULL,
    completed_lessons TEXT    DEFAULT '[]',
    lesson_count      INTEGER DEFAULT 0,
    completed         INTEGER DEFAULT 0,
    last_accessed     TEXT    DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, course_slug)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_users_email   ON users(email)`,
  `CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id)`,
];

async function init() {
  console.log('Initializing TechPulse Academy database...\n');
  for (const sql of schema) {
    try {
      await db.execute(sql);
      const name = sql.match(/TABLE IF NOT EXISTS (\w+)/)?.[1]
                ?? sql.match(/INDEX IF NOT EXISTS (\w+)/)?.[1]
                ?? 'statement';
      console.log('  OK  ' + name);
    } catch (err) {
      console.error('  ERR ' + err.message);
      process.exit(1);
    }
  }
  console.log('\nDatabase ready. Run: npm run dev\n');
  process.exit(0);
}

init();
