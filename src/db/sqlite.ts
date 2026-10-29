import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { SCHEMA_SQL } from './schema';
import { seedDatabase } from './seed';

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  const dbDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = process.env.SQLITE_DB_PATH || path.join(dbDir, 'sauma_arena.db');
  const db = new DatabaseSync(dbPath);

  // Performance and integrity pragmas
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');

  // Initialize schema
  db.exec(SCHEMA_SQL);

  // Normalize match IDs if existing database has legacy m_ prefix
  try {
    db.exec(`
      PRAGMA foreign_keys = OFF;
      UPDATE matches SET id = REPLACE(id, 'm_match-', 'match-') WHERE id LIKE 'm_match-%';
      UPDATE match_officials SET match_id = REPLACE(match_id, 'm_match-', 'match-') WHERE match_id LIKE 'm_match-%';
      UPDATE match_events SET match_id = REPLACE(match_id, 'm_match-', 'match-') WHERE match_id LIKE 'm_match-%';
      UPDATE match_lineups SET match_id = REPLACE(match_id, 'm_match-', 'match-') WHERE match_id LIKE 'm_match-%';
      UPDATE match_bap SET match_id = REPLACE(match_id, 'm_match-', 'match-') WHERE match_id LIKE 'm_match-%';
      PRAGMA foreign_keys = ON;
    `);
  } catch {
    // ignore
  }

  // Seed default data if sports table is empty
  seedDatabase(db);

  dbInstance = db;
  return db;
}

export function query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): T[] {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  return stmt.all(...params) as T[];
}

export function queryOne<T = Record<string, unknown>>(sql: string, params: unknown[] = []): T | undefined {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  return stmt.get(...params) as T | undefined;
}

export function run(sql: string, params: unknown[] = []) {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  return stmt.run(...params);
}

export function transaction<T>(fn: () => T): T {
  const db = getDatabase();
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
