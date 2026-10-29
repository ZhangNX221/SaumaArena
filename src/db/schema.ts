
export const SCHEMA_SQL = `
-- 1. PROFILES (Pengguna Terotentikasi)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('admin', 'official')),
  display_name TEXT NOT NULL,
  phone TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 2. SPORTS (Daftar Cabang Olahraga & Template)
CREATE TABLE IF NOT EXISTS sports (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  scoring_model TEXT NOT NULL,
  default_rules TEXT NOT NULL, -- JSON string
  rules_version TEXT NOT NULL DEFAULT '1.0.0',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 3. COMPETITIONS (Entitas Turnamen)
CREATE TABLE IF NOT EXISTS competitions (
  id TEXT PRIMARY KEY,
  sport_code TEXT NOT NULL REFERENCES sports(code),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  season TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'registration', 'ongoing', 'finished')),
  rules_overrides TEXT DEFAULT '{}', -- JSON string
  rules_snapshot TEXT, -- JSON string; frozen when ongoing
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('private', 'public')),
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 4. STAGES (Fase Kompetisi: Grup / Gugur)
CREATE TABLE IF NOT EXISTS stages (
  id TEXT PRIMARY KEY,
  competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('round_robin', 'single_elimination', 'group_then_knockout', 'double_elimination', 'swiss')),
  config TEXT DEFAULT '{}',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 5. STAGE_GROUPS (Grup Penyisihan)
CREATE TABLE IF NOT EXISTS stage_groups (
  id TEXT PRIMARY KEY,
  stage_id TEXT NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 6. TEAMS (Peserta Kompetisi Generik)
CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  logo_url TEXT,
  school_name TEXT,
  kind TEXT NOT NULL DEFAULT 'team' CHECK (kind IN ('team', 'individual', 'pair')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 7. PLAYERS (Master Data Atlet)
CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  team_id TEXT REFERENCES teams(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('M', 'F')),
  photo_url TEXT,
  jersey_number INTEGER,
  position TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 8. COMPETITION_TEAMS (Pendaftaran Tim ke Turnamen)
CREATE TABLE IF NOT EXISTS competition_teams (
  id TEXT PRIMARY KEY,
  competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  group_id TEXT REFERENCES stage_groups(id) ON DELETE SET NULL,
  seed INTEGER,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  UNIQUE(competition_id, team_id)
);

-- 9. COMPETITION_PLAYERS (Roster Pemain Turnamen)
CREATE TABLE IF NOT EXISTS competition_players (
  id TEXT PRIMARY KEY,
  competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  jersey_number INTEGER NOT NULL,
  position TEXT,
  status TEXT NOT NULL DEFAULT 'eligible' CHECK (status IN ('eligible', 'suspended', 'removed')),
  UNIQUE(competition_id, player_id)
);

-- 10. VENUES (Lokasi & Lapangan)
CREATE TABLE IF NOT EXISTS venues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  notes TEXT,
  courts TEXT DEFAULT '[]', -- JSON array of court names
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 11. MATCHES (Sesi Pertandingan)
CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  stage_id TEXT NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  group_id TEXT REFERENCES stage_groups(id) ON DELETE SET NULL,
  round_no INTEGER NOT NULL DEFAULT 1,
  match_no INTEGER NOT NULL,
  home_team_id TEXT REFERENCES teams(id),
  away_team_id TEXT REFERENCES teams(id),
  venue_id TEXT REFERENCES venues(id),
  court_name TEXT,
  scheduled_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN (
    'scheduled', 'lineup_confirmed', 'live', 'break', 'finished',
    'verified', 'postponed', 'cancelled', 'walkover', 'abandoned'
  )),
  result TEXT DEFAULT '{}', -- JSON cache hasil
  winner_team_id TEXT REFERENCES teams(id),
  verified_by TEXT REFERENCES profiles(id),
  verified_at TEXT,
  locked INTEGER DEFAULT 0,
  next_match_id TEXT,
  next_match_slot TEXT CHECK (next_match_slot IN ('home', 'away')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 12. MATCH_OFFICIALS (Penugasan Perangkat Laga)
CREATE TABLE IF NOT EXISTS match_officials (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  duty TEXT NOT NULL CHECK (duty IN ('referee', 'scorekeeper', 'judge', 'assistant')),
  UNIQUE(match_id, profile_id)
);

-- 13. MATCH_LINEUPS (Lineup Laga)
CREATE TABLE IF NOT EXISTS match_lineups (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  is_starter INTEGER NOT NULL DEFAULT 1,
  position TEXT,
  jersey_number INTEGER NOT NULL,
  UNIQUE(match_id, player_id)
);

-- 14. MATCH_EVENTS (SUMBER KEBENARAN PERTANDINGAN - APPEND ONLY)
CREATE TABLE IF NOT EXISTS match_events (
  id TEXT NOT NULL,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  seq INTEGER NOT NULL,
  type TEXT NOT NULL,
  team_id TEXT,
  player_id TEXT,
  period_no INTEGER,
  clock_ms INTEGER,
  payload TEXT DEFAULT '{}', -- JSON string
  created_by TEXT REFERENCES profiles(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  voided_at TEXT,
  voided_by TEXT REFERENCES profiles(id),
  void_reason TEXT,
  PRIMARY KEY (match_id, id),
  UNIQUE (match_id, seq)
);

-- 15. PROTESTS (Sengketa Laga)
CREATE TABLE IF NOT EXISTS protests (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL REFERENCES teams(id),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'accepted', 'rejected')),
  resolution TEXT,
  resolved_by TEXT REFERENCES profiles(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 16. AUDIT_LOGS (Perekam Jejak Perubahan)
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_id TEXT REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  before_val TEXT, -- JSON
  after_val TEXT, -- JSON
  reason TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 17. AUTH_USERS (Kredensial Autentikasi Backend Resmi)
CREATE TABLE IF NOT EXISTS auth_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'REFEREE')),
  name TEXT NOT NULL,
  role_label TEXT,
  avatar_text TEXT,
  specialization TEXT,
  license_level TEXT,
  assigned_match_ids TEXT DEFAULT '[]', -- JSON string
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_matches_comp ON matches(competition_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_events_match ON match_events(match_id, seq);
CREATE INDEX IF NOT EXISTS idx_auth_username ON auth_users(username);
CREATE INDEX IF NOT EXISTS idx_auth_email ON auth_users(email);
`;
