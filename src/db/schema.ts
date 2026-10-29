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
    'scheduled', 'lineup_confirmed', 'live', 'break', 'finished', 'bap_signed',
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

-- 18. REGISTRATIONS (Pendaftaran Kontingen Sekolah & Atlet)
CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  team_name TEXT NOT NULL,
  school_name TEXT NOT NULL,
  city TEXT NOT NULL,
  coach_name TEXT NOT NULL,
  coach_phone TEXT NOT NULL,
  coach_email TEXT,
  players_json TEXT NOT NULL DEFAULT '[]', -- JSON array of players
  recommendation_doc_url TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),
  notes TEXT,
  verified_by TEXT REFERENCES profiles(id),
  verified_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 19. TICKETS (E-Tiket & Scanner Gate Masuk Stadion)
CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  booking_code TEXT UNIQUE NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  buyer_email TEXT,
  team_id TEXT REFERENCES teams(id),
  category TEXT NOT NULL DEFAULT 'REGULAR' CHECK (category IN ('REGULAR', 'VIP', 'SUPPORTER')),
  quantity INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL DEFAULT 15000,
  status TEXT NOT NULL DEFAULT 'ISSUED' CHECK (status IN ('ISSUED', 'CHECKED_IN', 'CANCELLED')),
  checked_in_at TEXT,
  checked_in_by TEXT REFERENCES profiles(id),
  gate_name TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 20. SUPPORTER_SCORES (Penilaian Tribun Suporter Madrasah MMFC I)
CREATE TABLE IF NOT EXISTS supporter_scores (
  id TEXT PRIMARY KEY,
  competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  match_id TEXT REFERENCES matches(id) ON DELETE SET NULL,
  ticket_points INTEGER DEFAULT 0,
  creativity_points INTEGER DEFAULT 0,
  penalty_points INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  details_json TEXT DEFAULT '{}',
  notes TEXT,
  evaluated_by TEXT REFERENCES profiles(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 21. MATCH_BAP (Berita Acara Pertandingan & Tanda Tangan 3 Pihak)
CREATE TABLE IF NOT EXISTS match_bap (
  id TEXT PRIMARY KEY,
  match_id TEXT UNIQUE NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  final_score_home INTEGER NOT NULL DEFAULT 0,
  final_score_away INTEGER NOT NULL DEFAULT 0,
  period_scores_json TEXT DEFAULT '{}',
  goals_json TEXT DEFAULT '[]',
  cards_json TEXT DEFAULT '[]',
  fouls_json TEXT DEFAULT '{}',
  timeouts_json TEXT DEFAULT '{}',
  referee_1_name TEXT,
  referee_1_sig TEXT,
  referee_1_signed_at TEXT,
  referee_2_name TEXT,
  referee_2_sig TEXT,
  referee_2_signed_at TEXT,
  commissioner_name TEXT,
  commissioner_sig TEXT,
  commissioner_signed_at TEXT,
  verification_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'BAP_SIGNED', 'VERIFIED')),
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 22. INCIDENTS (Laporan Insiden & Sanksi Komisi Disiplin / Komdis)
CREATE TABLE IF NOT EXISTS incidents (
  id TEXT PRIMARY KEY,
  match_id TEXT REFERENCES matches(id) ON DELETE SET NULL,
  team_id TEXT REFERENCES teams(id) ON DELETE SET NULL,
  reported_by TEXT REFERENCES profiles(id),
  reporter_name TEXT NOT NULL,
  classification TEXT NOT NULL CHECK (classification IN ('RINGAN', 'SEDANG', 'BERAT', 'FORCE_MAJEURE')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_url TEXT,
  recommendation TEXT,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'INVESTIGATING', 'RESOLVED', 'DISMISSED')),
  sanction TEXT,
  resolution_notes TEXT,
  resolved_by TEXT REFERENCES profiles(id),
  resolved_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 23. MATCH_SETTINGS (Sinkronisasi Durasi Pertandingan & Aturan Waktu)
CREATE TABLE IF NOT EXISTS match_settings (
  id TEXT PRIMARY KEY,
  sport_code TEXT NOT NULL UNIQUE REFERENCES sports(code),
  period_count INTEGER NOT NULL DEFAULT 2,
  period_minutes_group INTEGER NOT NULL DEFAULT 15,
  period_minutes_knockout INTEGER NOT NULL DEFAULT 15,
  clock_group TEXT NOT NULL DEFAULT 'running_clock' CHECK (clock_group IN ('running_clock', 'stop_clock')),
  clock_knockout TEXT NOT NULL DEFAULT 'stop_clock' CHECK (clock_knockout IN ('running_clock', 'stop_clock')),
  half_time_minutes INTEGER NOT NULL DEFAULT 5,
  fouls_limit INTEGER NOT NULL DEFAULT 5,
  timeout_duration_seconds INTEGER NOT NULL DEFAULT 60,
  allow_draw_group INTEGER NOT NULL DEFAULT 1,
  penalty_shootout_enabled INTEGER NOT NULL DEFAULT 1,
  penalty_shootout_kicks INTEGER NOT NULL DEFAULT 3,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_matches_comp ON matches(competition_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_events_match ON match_events(match_id, seq);
CREATE INDEX IF NOT EXISTS idx_auth_username ON auth_users(username);
CREATE INDEX IF NOT EXISTS idx_auth_email ON auth_users(email);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_tickets_code ON tickets(booking_code);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_supporter_team ON supporter_scores(team_id);
CREATE INDEX IF NOT EXISTS idx_bap_match ON match_bap(match_id);
CREATE INDEX IF NOT EXISTS idx_incidents_match ON incidents(match_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
`;
