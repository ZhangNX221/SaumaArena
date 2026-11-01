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

  // Auto-migration: Ensure teams table has code column & index
  try {
    db.exec('ALTER TABLE teams ADD COLUMN code TEXT;');
  } catch {
    // Column already exists
  }
  try {
    db.exec('CREATE INDEX IF NOT EXISTS idx_teams_code ON teams(code);');
  } catch {
    // Index already exists
  }

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

  // Auto-migration: Ensure supporter_weights in competitions has latest 4 positive & 4 penalty criteria
  try {
    const compRows = db.prepare('SELECT id, rules_overrides FROM competitions WHERE rules_overrides IS NOT NULL').all() as any[];
    for (const comp of compRows) {
      if (comp?.rules_overrides) {
        const overrides = JSON.parse(comp.rules_overrides);
        if (overrides.supporter_weights) {
          overrides.supporter_weights = {
            title: 'Ketentuan & Bobot Penilaian Best Supporter MMFC I',
            positiveCriteria: [
              { id: 'crit_pos_1', badge: 'MASKOT', label: 'Membawa maskot sekolah', points: 20 },
              { id: 'crit_pos_2', badge: 'SERAGAM', label: 'Menggunakan seragam supporter', points: 15 },
              { id: 'crit_pos_3', badge: 'YEL-YEL', label: 'Menyanyikan yel yel minimal 2', points: 10 },
              { id: 'crit_pos_4', badge: 'TIKET', label: 'Jumlah tiket kehadiran supporter (di atas 50)', points: 1, suffix: ' / Match' },
            ],
            penaltyCriteria: [
              { id: 'crit_neg_1', badge: 'RICUH', label: 'Membuat kericuhan, kekerasan dll', points: 50 },
              { id: 'crit_neg_2', badge: 'LEMPAR', label: 'Melempar benda ke dalam lapangan', points: 25 },
              { id: 'crit_neg_3', badge: 'RASIS', label: 'Melakukan rasis/provokasi', points: 15 },
              { id: 'crit_neg_4', badge: 'BARANG', label: 'Membawa atau menyelundupkan barang yang dilarang', points: 5 },
            ],
          };
          db.prepare('UPDATE competitions SET rules_overrides = ? WHERE id = ?').run(JSON.stringify(overrides), comp.id);
        }
      }
    }

    // Auto-migration: Update nama tim resmi di tabel teams SQLite
    db.prepare("UPDATE teams SET name = 'MI MAMBAUL ULUM BUNTARAN (TULUNGAGUNG)' WHERE id = 'team-mi-mambaululum'").run();
    db.prepare("UPDATE teams SET name = 'MI YA BUNAYYA SRENGAT', short_name = 'YA BUNAYYA', school_name = 'Madrasah Ibtidaiyah Ya Bunayya Srengat Blitar' WHERE id = 'team-mi-yabunaya'").run();
  } catch {
    // ignore
  }

  // Seed default data if sports table is empty
  const sportsCount = (db.prepare('SELECT COUNT(*) as count FROM sports').get() as { count: number })?.count || 0;
  if (sportsCount === 0) {
    seedDatabase(db);
  }

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
