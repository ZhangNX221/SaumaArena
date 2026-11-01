import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { SCHEMA_SQL } from './schema';
import { seedDatabase } from './seed';
import { initialTeams } from '../mocks/mockTeams';
import {
  DEFAULT_GROUP_A_STANDINGS,
  DEFAULT_GROUP_B_STANDINGS,
  DEFAULT_GROUP_C_STANDINGS,
  DEFAULT_GROUP_D_STANDINGS,
} from '../mocks/defaultStandingsData';

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

  // Auto-migration: Ensure supporter_weights, bracket_size, layout, standings, and stats are synchronized
  try {
    const compRows = db.prepare('SELECT id, rules_overrides FROM competitions').all() as any[];
    for (const comp of compRows) {
      let overrides = comp?.rules_overrides ? JSON.parse(comp.rules_overrides) : {};
      let updated = false;

      // Selalu pastikan kriteria supporter sinkron 4 positif & 4 sanksi
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
      updated = true;

      if (overrides.bracket_size !== 4) {
        overrides.bracket_size = 4;
        updated = true;
      }

      if (overrides.team_card_layout !== 'MINIMAL') {
        overrides.team_card_layout = 'MINIMAL';
        updated = true;
      }

      if (!overrides.standings_override) {
        overrides.standings_override = {
          A: DEFAULT_GROUP_A_STANDINGS,
          B: DEFAULT_GROUP_B_STANDINGS,
          C: DEFAULT_GROUP_C_STANDINGS,
          D: DEFAULT_GROUP_D_STANDINGS,
        };
        updated = true;
      }

      if (!overrides.stats_config) {
        overrides.stats_config = {
          showQuickMetrics: true,
          showTopScorers: false,
          showCleanSheet: false,
          showFairPlay: true,
          showTeamGoals: true,
          showTimeDistribution: false,
        };
        updated = true;
      }

      if (updated) {
        db.prepare('UPDATE competitions SET rules_overrides = ? WHERE id = ?').run(JSON.stringify(overrides), comp.id);
      }
    }

    // Auto-migration: Update nama tim resmi & master pemain default (5 pemain per tim) di tabel SQLite
    db.prepare("UPDATE teams SET name = 'MI MAMBAUL ULUM BUNTARAN (TULUNGAGUNG)' WHERE id = 'team-mi-mambaululum'").run();
    db.prepare("UPDATE teams SET name = 'MIN 13 BLITAR A', short_name = 'MIN 13 A', school_name = 'Madrasah Ibtidaiyah Negeri 13 Blitar' WHERE id = 'team-min13-b'").run();
    db.prepare("UPDATE teams SET name = 'MIN 13 BLITAR B', short_name = 'MIN 13 B', school_name = 'Madrasah Ibtidaiyah Negeri 13 Blitar' WHERE id = 'team-min13-c'").run();
    db.prepare("UPDATE teams SET name = 'MI YA BUNAYYA SRENGAT', short_name = 'YA BUNAYYA', school_name = 'Madrasah Ibtidaiyah Ya Bunayya Srengat Blitar' WHERE id = 'team-mi-yabunaya'").run();

    // Hapus data pemain lama/acak dan ganti dengan rata 5 pemain default per tim (Pemain 1 - Pemain 5)
    db.prepare("DELETE FROM players WHERE full_name NOT LIKE 'Pemain %' OR team_id IS NULL").run();
    const insertPlayerStmt = db.prepare(`
      INSERT OR REPLACE INTO players (id, team_id, full_name, birth_date, gender, jersey_number, position, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `);
    for (const t of initialTeams) {
      if (t.players && t.players.length > 0) {
        for (const p of t.players) {
          insertPlayerStmt.run(p.id, t.id, p.name, '2012-05-10', 'M', p.number, p.position);
        }
      }
    }
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
