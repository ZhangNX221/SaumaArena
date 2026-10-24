# 08. Arsitektur Perangkat Lunak & Model Data

**Dokumen PRD — Bagian 8/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Versi:** 1.0  

---

## 8.1 Pola Arsitektur: Modular Monolith

Sauma Arena dibangun menggunakan pola **Modular Monolith**: satu aplikasi tunggal dalam satu repositori (*single codebase*), namun memiliki batasan modul cabang olahraga yang terisolasi secara ketat di balik kontrak antarmuka (*interface contract*).

### Prinsip Batasan Modul & Dependensi
1. **Isolasi Inti (`src/core`):** Folder `src/core` berisi logika umum yang berlaku universal untuk semua cabang olahraga (state machine status laga, event store, tiebreaker klasemen, generator jadwal, tipe bersama). **Dilarang keras memasukkan aturan spesifik cabor apa pun ke dalam `src/core`**.
2. **Modul Cabor Terisolasi (`src/sports/<kode>`):** Setiap cabang olahraga memiliki folder mandiri yang berisi `template.json`, `module.ts`, `console.tsx`, dan unit test murni `*.test.ts`. Modul ini hanya boleh mengimpor dari `src/core/types`. Dilarang mengimpor dari modul cabang olahraga lain.
3. **Penyambungan via Registry (`src/core/registry`):** Kode inti aplikasi hanya boleh berinteraksi dengan modul cabang melalui registri terpusat (`registry.get(sportCode)`).

---

## 8.2 Struktur Direktori Proyek

```
/
├─ docs/
│  └─ prd/                    # Dokumentasi modular PRD (00-index s/d 12-master-prd)
├─ src/
│  ├─ core/                   # TIDAK BOLEH berisi aturan cabang tertentu
│  │  ├─ types/               # Interface SportModule, MatchState, MatchEvent, dll.
│  │  ├─ registry/            # Registrasi dan loader modul cabor
│  │  ├─ standings/           # Kalkulasi klasemen + registry fungsi tie-breaker
│  │  ├─ scheduling/          # Generator jadwal & bagan gugur
│  │  ├─ statemachine/        # Mesin status pertandingan
│  │  └─ events/              # Pengelolaan event, pembatalan (void), dan idempotensi
│  ├─ sports/
│  │  ├─ football/            # template.json, module.ts, console.tsx, football.test.ts
│  │  ├─ futsal/              # template.json, module.ts, console.tsx, futsal.test.ts
│  │  ├─ volleyball/          # template.json, module.ts, console.tsx, volleyball.test.ts
│  │  ├─ badminton/           # template.json, module.ts, console.tsx, badminton.test.ts
│  │  └─ esport/              # template.json, module.ts, console.tsx, esport.test.ts
│  ├─ app/
│  │  ├─ (public)/            # Rute publik bebas akses tanpa login (/c/[slug])
│  │  ├─ admin/               # Rute dasbor pengelola turnamen (/admin/*)
│  │  ├─ official/            # Rute konsol panitia/wasit lapangan (/official/*)
│  │  └─ login/               # Halaman autentikasi sistem
│  ├─ components/             # Komponen UI modular (< 400 baris per file)
│  ├─ mocks/                  # Data uji coba terisolasi
│  └─ lib/                    # Klien Supabase, format waktu, utilitas bersama
└─ supabase/
   └─ migrations/             # Skema DDL PostgreSQL + kebijakan RLS
```

---

## 8.3 Skema Model Data Relasional (PostgreSQL)

Seluruh entitas disimpan dalam basis data PostgreSQL. Setiap tabel memiliki kolom `id uuid primary key default gen_random_uuid()`, `created_at timestamptz default now()`, dan `updated_at timestamptz default now()`.

```sql
-- 1. PROFILES (Pengguna Terotentikasi)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'official')),
  display_name text not null,
  phone text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. SPORTS (Daftar Cabang Olahraga)
create table sports (
  code text primary key, -- misal: 'football', 'futsal', 'badminton'
  name text not null,
  scoring_model text not null check (scoring_model in ('timed_goals', 'rally_set', 'map_series', 'judged', 'placement_points')),
  default_rules jsonb not null,
  rules_version text not null default '1.0.0',
  created_at timestamptz default now()
);

-- 3. COMPETITIONS (Entitas Turnamen)
create table competitions (
  id uuid primary key default gen_random_uuid(),
  sport_code text not null references sports(code),
  name text not null,
  slug text unique not null,
  season text not null,
  status text not null default 'draft' check (status in ('draft', 'registration', 'ongoing', 'finished')),
  rules_overrides jsonb default '{}'::jsonb,
  rules_snapshot jsonb, -- dibekukan permanen saat status beralih ke 'ongoing'
  visibility text not null default 'public' check (visibility in ('private', 'public')),
  start_date date not null,
  end_date date not null,
  description text,
  logo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. STAGES (Fase Kompetisi: Grup / Gugur)
create table stages (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references competitions(id) on delete cascade,
  name text not null,
  order_index int not null,
  format text not null check (format in ('round_robin', 'single_elimination', 'group_then_knockout', 'double_elimination', 'swiss')),
  config jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 5. STAGE_GROUPS (Grup Penyisihan)
create table stage_groups (
  id uuid primary key default gen_random_uuid(),
  stage_id uuid not null references stages(id) on delete cascade,
  name text not null, -- misal: 'Grup A', 'Grup B'
  created_at timestamptz default now()
);

-- 6. TEAMS (Peserta Kompetisi Generik)
create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text not null,
  logo_url text,
  kind text not null default 'team' check (kind in ('team', 'individual', 'pair')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. PLAYERS (Master Data Atlet)
create table players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete set null,
  full_name text not null,
  birth_date date not null, -- SENSITIF: Diblokir dari akses publik
  gender text not null check (gender in ('M', 'F')),
  photo_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 8. COMPETITION_TEAMS (Pendaftaran Tim ke Turnamen)
create table competition_teams (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references competitions(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  group_id uuid references stage_groups(id) on delete set null,
  seed int,
  status text not null default 'approved' check (status in ('pending', 'approved', 'rejected')),
  unique(competition_id, team_id)
);

-- 9. COMPETITION_PLAYERS (Roster Pemain Turnamen)
create table competition_players (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references competitions(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  jersey_number int not null,
  position text,
  status text not null default 'eligible' check (status in ('eligible', 'suspended', 'removed')),
  unique(competition_id, player_id)
);

-- 10. VENUES (Lokasi & Lapangan)
create table venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  notes text,
  created_at timestamptz default now()
);

-- 11. MATCHES (Sesi Pertandingan)
create table matches (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references competitions(id) on delete cascade,
  stage_id uuid not null references stages(id) on delete cascade,
  group_id uuid references stage_groups(id) on delete set null,
  round_no int not null default 1,
  match_no int not null,
  home_team_id uuid references teams(id),
  away_team_id uuid references teams(id),
  venue_id uuid references venues(id),
  scheduled_at timestamptz not null, -- format UTC
  status text not null default 'scheduled' check (status in (
    'scheduled', 'lineup_confirmed', 'live', 'break', 'finished',
    'verified', 'postponed', 'cancelled', 'walkover', 'abandoned'
  )),
  result jsonb default '{}'::jsonb, -- CACHE HASIL (dihitung dari events)
  winner_team_id uuid references teams(id),
  verified_by uuid references profiles(id),
  verified_at timestamptz,
  locked boolean default false,
  next_match_id uuid references matches(id),
  next_match_slot text check (next_match_slot in ('home', 'away')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 12. MATCH_OFFICIALS (Penugasan Perangkat Laga)
create table match_officials (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  duty text not null check (duty in ('referee', 'scorekeeper', 'judge', 'assistant')),
  unique(match_id, profile_id)
);

-- 13. MATCH_LINEUPS (Lineup Laga)
create table match_lineups (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  is_starter boolean not null default true,
  position text,
  jersey_number int not null,
  unique(match_id, player_id)
);

-- 14. MATCH_EVENTS (SUMBER KEBENARAN PERTANDINGAN - APPEND ONLY)
create table match_events (
  id uuid not null, -- UUID dibuat di klien untuk idempotensi
  match_id uuid not null references matches(id) on delete cascade,
  seq int not null, -- urutan kronologis kejadian
  type text not null,
  team_id uuid references teams(id),
  player_id uuid references players(id),
  period_no int,
  clock_ms int,
  payload jsonb default '{}'::jsonb,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  voided_at timestamptz,
  voided_by uuid references profiles(id),
  void_reason text,
  primary key (match_id, id),
  unique (match_id, seq)
);

-- 15. PROTESTS (Sengketa Laga Resmi)
create table protests (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  team_id uuid not null references teams(id),
  reason text not null,
  status text not null default 'open' check (status in ('open', 'accepted', 'rejected')),
  resolution text,
  resolved_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 16. AUDIT_LOGS (Perekam Jejak Perubahan Administratif)
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action text not null,
  entity text not null,
  entity_id text not null,
  before jsonb,
  after jsonb,
  reason text,
  created_at timestamptz default now()
);
```

---

## 8.4 Kebijakan Keamanan Row Level Security (RLS)

1. **Akses Publik (Anonim):**
   - Hanya diizinkan melakukan operasi `SELECT` pada kompetisi dengan status `visibility = 'public'` beserta pertandingan, tim, dan event yang berelasi dengannya.
   - Kolom sensitif atlet (`players.birth_date`, `profiles.phone`) tidak diekspos melalui kebijakan RLS kolom / PostgreSQL View publik.

2. **Akses Panitia Lapangan (`official`):**
   - Hanya dapat membaca pertandingan yang terdapat dalam penugasan `match_officials` miliknya.
   - Hanya dapat melakukan `INSERT` pada tabel `match_events` untuk laga yang berstatus `live` atau `break`.
   - Dilarang keras melakukan `UPDATE` atau `DELETE` pada isi event yang telah tersimpan (kecuali mengisi kolom `voided_*`).

3. **Akses Administrator (`admin`):**
   - Memiliki hak akses penuh (`ALL`) untuk seluruh tabel operasional, audit log, dan eksekusi penguncian hasil (`verified`).
