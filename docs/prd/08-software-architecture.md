# 08. Arsitektur Perangkat Lunak & Model Data (Software Architecture & Schema)

**Dokumen PRD — Bagian 8/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Edisi Turnamen:** Milad Matsanega Futsal Competition I (MMFC I) • MTsN 3 Blitar  
**Versi:** 2.0  

---

## 8.1 Pola Arsitektur: Unified App Router dengan Tiga Konsol Terpadu

Sauma Arena dibangun menggunakan **Next.js App Router (TypeScript Strict Mode)** dengan arsitektur *Modular Monolith*. Aplikasi ini menggabungkan tiga konsol operasional dalam satu rute aplikasi tunggal yang dinamis (`src/app/page.tsx`):

1. **Konsol Publik (`/` atau `?view=public`):** Antarmuka penonton dan suporter madrasah yang dioptimasi untuk kecepatan baca (*read-optimized*).
2. **Konsol Wasit Lapangan (`?view=referee`):** Tablet digital ramah sentuhan (*touchscreen-optimized*) untuk pencatatan skor, waktu, foul, kartu, dan penilaian suporter.
3. **Konsol Admin Arena (`?view=admin`):** Pusat manajemen komisioner yang beroperasi dengan perlindungan sesi autentikasi dan tata letak simetris terpusat (`max-w-7xl mx-auto`).

---

## 8.2 Struktur Direktori Proyek Sebenarnya (`/src`)

```
src/
├─ app/
│  ├─ api/auth/
│  │  ├─ login/route.ts       # Endpoint autentikasi admin & wasit
│  │  ├─ logout/route.ts      # Endpoint pembersihan cookie sesi
│  │  └─ me/route.ts          # Pemeriksaan data pengguna aktif
│  ├─ favicon.ico
│  ├─ globals.css             # Desain sistem Dual Athletic Theme & token warna
│  ├─ layout.tsx              # Root layout & deklarasi font (Teko, Bebas, Barlow)
│  └─ page.tsx                # Rute tunggal utama pengatur peralihan 3 konsol
├─ components/
│  ├─ brand/
│  │  └─ SaumaArenaLogo.tsx   # Logo resmi Sauma Arena (berbagai ukuran)
│  ├─ layout/
│  │  └─ Navbar.tsx           # Header utama publik + live team search
│  ├─ public/
│  │  ├─ PublicTournamentHeader.tsx # Hero spotlight MMFC I & athletic ticker
│  │  ├─ PublicTabBar.tsx           # 8 Tab navigasi publik docked
│  │  ├─ tabs/
│  │  │  ├─ InfoTab.tsx             # Panduan, Juknis PDF, & Alur Gate
│  │  │  ├─ LiveMatchTab.tsx        # Live score & event timeline
│  │  │  ├─ ScheduleTab.tsx         # Jadwal 17 laga & filter grup A-D
│  │  │  ├─ StandingsTab.tsx        # Klasemen grup resmi (aturan 3/1/0)
│  │  │  ├─ BracketTab.tsx          # Bagan eliminasi 4 besar & grand final
│  │  │  ├─ TeamsTab.tsx            # Profil 14 tim kontingen & atlet
│  │  │  ├─ StatsTab.tsx            # Sepatu Emas & grafik analisis gol
│  │  │  ├─ SupporterTab.tsx        # Leaderboard Best Supporter madrasah
│  │  │  └─ SupporterDetailModal.tsx
│  │  ├─ live/                      # Sub-komponen papan skor & kartu atlet
│  │  ├─ stats/                     # Grafik batang & garis produktivitas gol
│  │  ├─ registration/              # Modal pendaftaran kontingen 4 tahap
│  │  └─ ticket/                    # Modal pembelian & checkout e-tiket QR
│  ├─ referee/
│  │  ├─ RefereeDashboard.tsx       # Root container konsol tablet wasit
│  │  ├─ RefereeHeader.tsx          # Top bar wasit & indikator sinkron
│  │  ├─ RefereeSidebar.tsx         # Menu samping konsol tablet
│  │  ├─ RefereeBottomNav.tsx       # Navigasi bawah ramah jempol mobile
│  │  ├─ RefereeDashboardHome.tsx   # Daftar laga tugas wasit hari ini
│  │  ├─ RefereeMatchCenter.tsx     # Konsol kendali laga aktif
│  │  ├─ RefereeSupporterScoringView.tsx # Form penilaian suporter madrasah
│  │  ├─ RefereeSchedule.tsx        # Jadwal penugasan wasit
│  │  ├─ RefereeRosterView.tsx      # Pemeriksaan kehadiran atlet & starter
│  │  ├─ RefereeProfile.tsx         # Profil lisensi wasit
│  │  ├─ steps/scoring/             # Stopwatch, papan skor, pencatat gol & foul
│  │  └─ reports/                   # Pratinjau BAP digital & laporan insiden
│  ├─ admin/
│  │  ├─ AdminDashboard.tsx         # Root container admin (max-w-7xl mx-auto)
│  │  ├─ AdminSidebar.tsx           # Sidebar navigasi modul admin
│  │  ├─ layout/AdminHeader.tsx     # Top bar admin & tombol aksi
│  │  ├─ common/                    # Komponen bersama (AdminPageHeaderCard, ConfirmModal)
│  │  └─ modules/
│  │     ├─ AdminOverviewModule.tsx # Ringkasan metrik & medal tally 1-tap
│  │     ├─ master/                 # Manajemen kompetisi, cabor, kategori, venue
│  │     ├─ participants/           # Verifikasi berkas NISN & ID Card QR
│  │     ├─ matches/                # Drawing bracket, jadwal, override, verifikasi BAP
│  │     ├─ ticketing/              # Kuota tiket & scanner QR gate stadion
│  │     └─ system/                 # Durasi waktu, banner hero, backup/restore
├─ config/
│  ├─ menuConfig.ts                 # Definisi konfigurasi menu publik & admin
│  └─ features.ts                   # Feature flags (ticketing, supporter, dll)
├─ mocks/                           # Data sumber kebenaran turnamen MMFC I
│  ├─ tournamentData.ts             # 17 Laga, skor, foul, kartu, & BAP
│  ├─ mockTeams.ts                  # 14 Kontingen madrasah & roster pemain
│  ├─ multiSportData.ts             # Klasemen perolehan medali
│  ├─ headerConfig.ts               # Preset banner & konfigurasi hero
│  └─ partnersData.ts               # Daftar sponsor resmi MMFC I
└─ types/
   └─ index.ts                      # Kontrak antarmuka TypeScript lengkap
```

---

## 8.3 Skema Model Data Relasional (PostgreSQL)

Berikut adalah struktur entitas database untuk mendukung seluruh alur operasional:

```sql
-- 1. USERS & PROFILES (Autentikasi & RBAC)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('superadmin', 'commissioner', 'referee', 'gate_officer')),
  full_name text not null,
  phone text,
  license_number text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 2. COMPETITIONS (Entitas Turnamen MMFC I)
create table competitions (
  id uuid primary key default gen_random_uuid(),
  sport_code text not null default 'futsal',
  name text not null,
  slug text unique not null,
  season text not null,
  status text not null default 'ongoing' check (status in ('draft', 'registration', 'ongoing', 'finished')),
  rules_snapshot jsonb not null,
  venue_name text not null,
  start_date date not null,
  end_date date not null,
  created_at timestamptz default now()
);

-- 3. TEAMS & CONTINGENTS (14 Kontingen Sekolah)
create table teams (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid references competitions(id) on delete cascade,
  name text not null,
  school_name text not null,
  city text not null,
  group_name text check (group_name in ('A', 'B', 'C', 'D')),
  logo_url text,
  coach_name text not null,
  coach_phone text,
  verification_status text default 'VERIFIED' check (verification_status in ('PENDING', 'VERIFIED', 'REJECTED')),
  created_at timestamptz default now()
);

-- 4. PLAYERS & ATHLETES (Roster 10-12 Atlet per Tim)
create table players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  jersey_number integer not null,
  full_name text not null,
  nisn text not null,
  position text check (position in ('GK', 'Anchor', 'Flank', 'Pivot', 'Universal')),
  is_captain boolean default false,
  photo_url text,
  created_at timestamptz default now(),
  unique (team_id, jersey_number)
);

-- 5. MATCHES (17 Pertandingan Turnamen)
create table matches (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid references competitions(id) on delete cascade,
  match_number integer not null,
  stage text not null check (stage in ('GROUP', 'SEMI_FINAL', 'BRONZE', 'FINAL')),
  group_name text,
  team_a_id uuid references teams(id),
  team_b_id uuid references teams(id),
  scheduled_time timestamptz not null,
  court_name text not null,
  status text not null default 'SCHEDULED' check (status in ('SCHEDULED', 'LIVE', 'FINISHED', 'VERIFIED')),
  score_team_a integer default 0,
  score_team_b integer default 0,
  period text default 'FIRST_HALF',
  fouls_team_a integer default 0,
  fouls_team_b integer default 0,
  timeouts_team_a integer default 0,
  timeouts_team_b integer default 0,
  is_verified boolean default false,
  locked boolean default false,
  created_at timestamptz default now()
);

-- 6. MATCH_EVENTS (Pencatatan Gol, Kartu, & Foul per Menit)
create table match_events (
  id uuid primary key default gen_random_uuid(),
  client_uuid uuid not null unique,
  match_id uuid references matches(id) on delete cascade,
  seq integer not null,
  minute integer not null,
  period text not null,
  team_id uuid references teams(id),
  player_id uuid references players(id),
  event_type text not null check (event_type in ('GOAL', 'FOUL', 'YELLOW_CARD', 'RED_CARD', 'TIMEOUT')),
  sub_type text, -- 'regular', 'first_penalty', 'second_penalty_10m', 'own_goal'
  voided_at timestamptz,
  void_reason text,
  created_at timestamptz default now()
);

-- 7. SUPPORTER_SCORES (Penilaian Tribun Suporter Madrasah)
create table supporter_scores (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid references competitions(id) on delete cascade,
  team_id uuid references teams(id) on delete cascade,
  ticket_points integer default 0,
  creativity_points integer default 0,
  penalty_points integer default 0,
  total_score integer generated always as (ticket_points + creativity_points - penalty_points) stored,
  notes text,
  evaluated_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- 8. TICKETS (E-Tiket & Scanner Gate Pintu Masuk)
create table tickets (
  id uuid primary key default gen_random_uuid(),
  booking_code text unique not null,
  buyer_name text not null,
  buyer_phone text not null,
  team_id uuid references teams(id), -- jika tiket rombongan suporter
  quantity integer not null default 1,
  status text not null default 'ISSUED' check (status in ('ISSUED', 'CHECKED_IN', 'CANCELLED')),
  checked_in_at timestamptz,
  checked_in_by uuid references profiles(id),
  gate_name text check (gate_name in ('Gate Barat (VIP/Atlet)', 'Gate Timur 1 (Suporter)', 'Gate Timur 2 (Umum)')),
  created_at timestamptz default now()
);
```
