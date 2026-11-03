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

  // Auto-migration: Ensure players table has athlete_code column & index
  try {
    db.exec('ALTER TABLE players ADD COLUMN athlete_code TEXT;');
  } catch {
    // Column already exists
  }
  try {
    db.exec('ALTER TABLE players ADD COLUMN yellow_cards INTEGER DEFAULT 0;');
  } catch {
    // Column already exists
  }
  try {
    db.exec('ALTER TABLE players ADD COLUMN red_cards INTEGER DEFAULT 0;');
  } catch {
    // Column already exists
  }
  try {
    db.exec('ALTER TABLE players ADD COLUMN goals INTEGER DEFAULT 0;');
  } catch {
    // Column already exists
  }
  try {
    db.exec('CREATE INDEX IF NOT EXISTS idx_players_athlete_code ON players(athlete_code);');
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

      if (
        !overrides.standings_override ||
        !Array.isArray(overrides.standings_override.A) || overrides.standings_override.A.length === 0 ||
        !Array.isArray(overrides.standings_override.B) || overrides.standings_override.B.length === 0 ||
        !Array.isArray(overrides.standings_override.C) || overrides.standings_override.C.length === 0 ||
        !Array.isArray(overrides.standings_override.D) || overrides.standings_override.D.length === 0
      ) {
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

    // Auto-migration: Pastikan tabel tim & pemain terisi tanpa menimpa data yang sudah diedit user
    const upsertTeamStmt = db.prepare(`
      INSERT INTO teams (id, code, name, short_name, school_name, logo_url, kind)
      VALUES (?, ?, ?, ?, ?, ?, 'team')
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        short_name = excluded.short_name,
        school_name = excluded.school_name,
        logo_url = excluded.logo_url
    `);

    // Bersihkan pemain dummy usang jika ada
    db.prepare("DELETE FROM players WHERE full_name LIKE 'Pemain %'").run();

    const existingPlayersCount = (db.prepare('SELECT COUNT(*) as count FROM players').get() as { count: number })?.count || 0;

    if (existingPlayersCount === 0) {
      // Inisialisasi awal pemain hanya jika tabel players benar-benar kosong
      const insertPlayerStmt = db.prepare(`
        INSERT INTO players (id, team_id, full_name, birth_date, gender, jersey_number, position, athlete_code, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        ON CONFLICT(id) DO NOTHING
      `);

      let athleteCounter = 1;
      for (const t of initialTeams) {
        upsertTeamStmt.run(t.id, t.code || t.id, t.name, t.shortName, t.schoolName, t.logoUrl);
        if (t.players && t.players.length > 0) {
          for (const p of t.players) {
            const athleteCode = p.athleteCode || `ATL-${String(athleteCounter++).padStart(3, '0')}`;
            insertPlayerStmt.run(p.id, t.id, p.name, '2012-05-10', 'M', p.number, p.position, athleteCode);
          }
        }
      }
    } else {
      // Jika tabel sudah ada data, pastikan tim terdaftar & pemain resmi masuk tanpa menimpa editan pengguna
      for (const t of initialTeams) {
        upsertTeamStmt.run(t.id, t.code || t.id, t.name, t.shortName, t.schoolName, t.logoUrl);
      }

      const insertMissingPlayerStmt = db.prepare(`
        INSERT INTO players (id, team_id, full_name, birth_date, gender, jersey_number, position, athlete_code, is_active)
        VALUES (?, ?, ?, '2012-05-10', 'M', ?, ?, ?, 1)
        ON CONFLICT(id) DO UPDATE SET
          full_name = CASE WHEN players.full_name LIKE 'Pemain %' OR players.full_name = '' THEN excluded.full_name ELSE players.full_name END,
          jersey_number = CASE WHEN players.full_name LIKE 'Pemain %' OR players.full_name = '' THEN excluded.jersey_number ELSE players.jersey_number END,
          position = CASE WHEN players.full_name LIKE 'Pemain %' OR players.full_name = '' THEN excluded.position ELSE players.position END,
          athlete_code = COALESCE(players.athlete_code, excluded.athlete_code)
      `);

      for (const t of initialTeams) {
        if (t.players && t.players.length > 0) {
          for (const p of t.players) {
            insertMissingPlayerStmt.run(p.id, t.id, p.name, p.number, p.position, p.athleteCode || null);
          }
        }
      }

      // Isi kode atlet yang masih kosong tanpa mengubah editan pengguna
      const unassignedAthletes = db.prepare('SELECT id FROM players WHERE athlete_code IS NULL OR athlete_code = "" ORDER BY rowid ASC').all() as any[];
      if (unassignedAthletes.length > 0) {
        const maxCodeRow = db.prepare("SELECT athlete_code FROM players WHERE athlete_code LIKE 'ATL-%' ORDER BY athlete_code DESC LIMIT 1").get() as { athlete_code?: string } | undefined;
        let lastIdx = 0;
        if (maxCodeRow?.athlete_code) {
          const matched = maxCodeRow.athlete_code.match(/\d+/);
          if (matched) lastIdx = parseInt(matched[0], 10);
        }

        const updateCodeStmt = db.prepare('UPDATE players SET athlete_code = ? WHERE id = ?');
        for (const row of unassignedAthletes) {
          updateCodeStmt.run(`ATL-${String(++lastIdx).padStart(3, '0')}`, row.id);
        }
      }
    }
  } catch {
    // ignore
  }

  // Auto-migration: Pastikan laga knockout Semifinal 1 (P15) dan Semifinal 2 (P16) terisi tim juara grup jika masih kosong
  try {
    const m15 = db.prepare('SELECT home_team_id, away_team_id FROM matches WHERE match_no = 15').get() as any;
    if (m15 && (!m15.home_team_id || m15.home_team_id.startsWith('placeholder'))) {
      db.prepare('UPDATE matches SET home_team_id = ?, away_team_id = ? WHERE match_no = 15').run('team-min7-blitar', 'team-min13-c');
    }
    const m16 = db.prepare('SELECT home_team_id, away_team_id FROM matches WHERE match_no = 16').get() as any;
    if (m16 && (!m16.home_team_id || m16.home_team_id.startsWith('placeholder'))) {
      db.prepare('UPDATE matches SET home_team_id = ?, away_team_id = ? WHERE match_no = 16').run('team-mi-mambaululum', 'team-min5-tulungagung');
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
