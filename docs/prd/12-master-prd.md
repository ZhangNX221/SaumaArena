# 12. Master Dokumen Spesifikasi Produk (Compiled PRD v1.0)

**Dokumen PRD — Bagian 12/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Versi Dokumen:** 1.0  
**Bahasa UI Aplikasi:** Bahasa Indonesia (siapkan struktur i18n)  
**Bahasa Kode & Identifier:** Inggris  
**Tujuan Dokumen:** Spesifikasi utama untuk AI coding agent dan seluruh tim engineering.

---

## 0. Cara Memakai Dokumen Ini (WAJIB DIBACA AGENT)

### 0.1 Aturan kerja

1. Baca seluruh dokumen dulu. Jangan mulai coding dari bagian tengah.
2. Kerjakan **per fase** (Bagian 14). Selesaikan semua *acceptance criteria* dan tes satu fase sebelum pindah ke fase berikutnya.
3. **Dilarang menaruh aturan olahraga di luar folder `/sports/<kode-cabang>/`.** Kode `/core` tidak boleh tahu aturan sepakbola, bulutangkis, dll.
4. `/core` hanya boleh memakai modul cabang lewat **registry** (Bagian 8.1), tidak boleh import langsung.
5. Semua logika aturan olahraga ditulis sebagai **fungsi murni** (tanpa akses database/jaringan) dan wajib punya unit test.
6. **Skor bukan sumber kebenaran.** Sumber kebenaran adalah rangkaian `match_events`. Skor, klasemen, top skor, dan kartu selalu dihitung dari event.
7. Setiap perubahan oleh Admin/Panitia pada pertandingan harus menulis `audit_logs`.
8. Jika ada hal yang ambigu atau tidak tercakup, **tanyakan ke pemilik produk**. Jika tidak bisa bertanya, ambil asumsi paling sederhana dan catat di [11-decisions.md](./11-decisions.md).
9. Commit kecil dan sering. Satu commit = satu perubahan yang bisa dijelaskan dalam satu kalimat.
10. Jangan menambah fitur di luar dokumen ini tanpa persetujuan.

### 0.2 Prioritas requirement

| Kode | Arti |
|---|---|
| **P0** | Wajib ada (MVP) |
| **P1** | Sebaiknya ada, dikerjakan setelah P0 fase terkait |
| **P2** | Opsional / masa depan |

---

## 1. Ringkasan Produk

Aplikasi web untuk mengelola turnamen/liga/event olahraga di **banyak cabang** (sepakbola, futsal, bola voli, bulutangkis, esport, dan cabang lain di masa depan) dalam **satu aplikasi dan satu codebase**.

Karena aturan setiap cabang berbeda, aplikasi memakai **Sport Template** (konfigurasi aturan) dan **Sport Module** (logika khusus per cabang) sehingga cabang baru ditambah dengan membuat modul baru, bukan mengubah inti aplikasi.

### 1.1 Tujuan

- **G1.** Panitia/wasit bisa mencatat pertandingan langsung dari HP dengan cepat dan **tanpa melanggar aturan cabang**.
- **G2.** Admin bisa membuat kompetisi, jadwal, dan klasemen dengan sedikit pekerjaan manual.
- **G3.** Publik bisa melihat skor live, jadwal, klasemen, dan bagan **tanpa login**.
- **G4.** Menambah cabang olahraga baru cukup dengan membuat template + modul baru.

### 1.2 Bukan tujuan (di luar cakupan, kecuali disebut lain)

- Pembayaran/biaya pendaftaran
- Live streaming video
- Pendaftaran mandiri oleh tim (Admin yang memasukkan tim)
- Aplikasi native iOS/Android (cukup web PWA)
- Multi-penyelenggara/multi-tenant penuh (P2)
- Cabang berbasis peringkat/placement (battle royale, balap) (P2)

---

## 2. Prinsip Desain (Invariant)

Prinsip ini tidak boleh dilanggar oleh implementasi apa pun.

1. **Data-driven rules:** aturan = template (JSON) + modul cabang. Bukan `if (sport === 'football')` di core.
2. **Event sourcing ringan:** state pertandingan = hasil reduce dari event yang tidak di-void. Event tidak pernah dihapus, hanya di-*void* dengan alasan.
3. **Validasi saat input:** event yang melanggar aturan **ditolak** dengan pesan jelas (bahasa Indonesia).
4. **Dua tahap hasil:** Panitia menginput, Admin memverifikasi. Hanya pertandingan `verified` yang dihitung di klasemen resmi.
5. **Snapshot aturan:** saat kompetisi dimulai, aturan yang berlaku disalin ke `competitions.rules_snapshot`. Perubahan template di kemudian hari tidak mengubah kompetisi yang sedang berjalan.
6. **Mobile-first untuk Panitia, read-only cepat untuk Publik.**
7. **Idempoten:** pengiriman event yang sama dua kali (misal karena sinyal buruk) tidak boleh menggandakan event.

---

## 3. Peran & Hak Akses

Ada 3 jenis pengguna.

| Peran | Login? | Deskripsi |
|---|---|---|
| `admin` | Ya | Mengelola semua data dan memverifikasi hasil |
| `official` | Ya | Panitia: wasit, juri, scorekeeper/operator. Hanya mengakses pertandingan yang ditugaskan |
| Publik | **Tidak** | Penonton. Hanya baca data yang dipublikasikan |

### 3.1 Matriks hak akses

| Aksi | Admin | Panitia | Publik |
|---|:-:|:-:|:-:|
| Kelola cabang/template aturan | ✅ | ❌ | ❌ |
| Kelola kompetisi, fase, grup | ✅ | ❌ | ❌ |
| Kelola tim, pemain, venue | ✅ | ❌ | ❌ |
| Kelola user & tugaskan panitia | ✅ | ❌ | ❌ |
| Buat/ubah jadwal | ✅ | ❌ | ❌ |
| Lihat pertandingan yang ditugaskan | ✅ | ✅ (hanya miliknya) | ❌ |
| Konfirmasi lineup | ✅ | ✅ (miliknya) | ❌ |
| Input event pertandingan | ✅ | ✅ (miliknya, status `live`/`break`) | ❌ |
| Void/koreksi event | ✅ | ✅ (miliknya, sebelum `finished`, wajib alasan) | ❌ |
| Tandai pertandingan selesai | ✅ | ✅ (miliknya) | ❌ |
| Verifikasi hasil (`verified`) | ✅ | ❌ | ❌ |
| Buka kunci pertandingan terverifikasi | ✅ (wajib alasan) | ❌ | ❌ |
| Lihat audit log | ✅ | ❌ | ❌ |
| Lihat jadwal, skor, klasemen, bagan, profil tim | ✅ | ✅ | ✅ (hanya data publik) |

### 3.2 Tugas panitia per pertandingan (`match_officials.duty`)

`referee` (wasit utama), `scorekeeper` (pencatat skor/operator), `judge` (juri), `assistant`. Wasit/scorekeeper/operator boleh menginput event. Aturan siapa-boleh-apa per tugas bisa disempurnakan di P1.

---

## 4. Glosarium

| Istilah | Arti |
|---|---|
| **Competition** | Satu turnamen/liga/event untuk satu cabang olahraga |
| **Stage** | Fase dalam kompetisi (grup, gugur, final) |
| **Participant / Team** | Peserta pertandingan: tim, individu, atau pasangan (ganda) |
| **Match** | Satu pertandingan antara dua peserta |
| **Period** | Bagian pertandingan berbasis waktu (babak, quarter) |
| **Set / Game** | Bagian pertandingan berbasis poin (voli, bulutangkis) |
| **Map** | Satu permainan dalam seri esport |
| **Event** | Kejadian yang tercatat (gol, poin, kartu, pergantian) |
| **Sport Template** | Konfigurasi aturan cabang (JSON) |
| **Sport Module** | Kode TypeScript yang menjalankan aturan cabang |
| **Verified** | Hasil sudah disahkan Admin, terkunci, dihitung di klasemen |
| **WO** | Walkover: salah satu tim tidak hadir, lawan menang administratif |

---

## 5. Arsitektur & Tech Stack

### 5.1 Pola arsitektur

**Modular monolith**: satu aplikasi, satu repo, dengan modul cabang yang terpisah.

### 5.2 Stack default

| Lapisan | Pilihan default |
|---|---|
| Bahasa | TypeScript (strict mode) |
| Framework web | Next.js (App Router) |
| UI | Tailwind CSS + komponen sederhana |
| Database & Auth & Realtime | Supabase (PostgreSQL, Auth, Realtime, Row Level Security) |
| Validasi data | Zod |
| Tes | Vitest (unit), Playwright (e2e, P1) |
| PWA | Service worker + manifest (untuk konsol Panitia) |

### 5.3 Struktur folder

```
/
├─ docs/
│  └─ prd/                    # 00-index s/d 12-master-prd
├─ src/
│  ├─ core/                   # TIDAK boleh berisi aturan cabang tertentu
│  │  ├─ types/               # tipe bersama (SportModule, MatchState, Event, dll)
│  │  ├─ registry/            # registrasi modul cabang
│  │  ├─ standings/           # hitung klasemen + registry tie-breaker
│  │  ├─ scheduling/          # generator jadwal & bagan
│  │  ├─ statemachine/        # status pertandingan
│  │  └─ events/              # penyimpanan event, void, idempotensi
│  ├─ sports/
│  │  ├─ football/            # template.json, module.ts, console.tsx, *.test.ts
│  │  ├─ futsal/
│  │  ├─ volleyball/
│  │  ├─ badminton/
│  │  └─ esport/
│  ├─ app/
│  │  ├─ (public)/            # halaman publik tanpa login
│  │  ├─ admin/
│  │  └─ official/
│  └─ lib/                    # supabase client, util
└─ supabase/
   └─ migrations/             # SQL migrasi + kebijakan RLS
```

---

## 6. Model Data (PostgreSQL)

Gunakan PostgreSQL. Semua tabel punya `id uuid primary key`, `created_at`, `updated_at` kecuali dinyatakan lain. Aktifkan **Row Level Security** di semua tabel.

Tabel lengkap terdefinisi di [08-software-architecture.md](./08-software-architecture.md):
`profiles`, `sports`, `competitions`, `stages`, `stage_groups`, `teams`, `players`, `competition_teams`, `competition_players`, `venues`, `matches`, `match_officials`, `match_lineups`, `match_events`, `protests`, `audit_logs`.

---

## 7. Sport Template (Konfigurasi Aturan)

Mendukung model skor `timed_goals` (sepakbola, futsal), `rally_set` (bola voli, bulutangkis), `map_series` (esport generik). Konfigurasi lengkap JSON terdefinisi di [04-functional-specs.md](./04-functional-specs.md).

---

## 8. Mesin Aturan (Sport Module)

Interface wajib `SportModule<Rules, State>` diimplementasikan murni oleh setiap cabor di `src/sports/<kode>/module.ts` dan diregistrasikan ke `src/core/registry`. State selalu dihitung murni melalui reduce event valid.

---

## 9. State Machine Pertandingan

`scheduled` $\rightarrow$ `lineup_confirmed` $\rightarrow$ `live` $\rightleftarrows$ `break` $\rightarrow$ `finished` $\rightarrow$ `verified` (`locked=true`).

---

## 10. Format Kompetisi, Jadwal & Klasemen

Format didukung: `round_robin`, `single_elimination`, `group_then_knockout`. Urutan peringkat klasemen menerapkan registry `tiebreakers` berurutan.

---

## 11. Requirement Fungsional

- Admin: `FR-ADM-01` s/d `FR-ADM-18` (P0/P1/P2)
- Panitia: `FR-OFF-01` s/d `FR-OFF-11` (P0/P1/P2)
- Publik: `FR-PUB-01` s/d `FR-PUB-09` (P0/P1/P2)
- Konsol Lapangan Cabor: `timed_goals`, `rally_set`, `map_series` (lihat [09-wireframes-and-ui.md](./09-wireframes-and-ui.md)).

---

## 12. Requirement Non-Fungsional

`NFR-01` s/d `NFR-10` (LCP < 2,5s, realtime < 3s, touch response < 100ms, RLS, privasi pemain, audit logs, zona waktu UTC/WIB).

---

## 13. Rute Halaman

- Publik: `/`, `/c/[slug]`, `/c/[slug]/m/[matchId]`, `/c/[slug]/t/[teamId]`
- Auth: `/login`
- Admin: `/admin`, `/admin/competitions`, `/admin/teams`, `/admin/players`, `/admin/venues`, `/admin/officials`, `/admin/audit`
- Panitia: `/official`, `/official/match/[id]`

---

## 14. Roadmap & Acceptance Criteria

Fase 0 (Fondasi) $\rightarrow$ Fase 1 (Inti + Sepakbola) $\rightarrow$ Fase 2 (Bulutangkis & Refactor) $\rightarrow$ Fase 3 (Format & Futsal/Voli) $\rightarrow$ Fase 4 (Esport & Offline Sync). Rincian per fase terdokumentasi di [07-success-metrics.md](./07-success-metrics.md).

---

## 15. Persyaratan Pengujian

Unit test (Vitest) **wajib** untuk seluruh fungsi murni di `src/sports/*` dan modul perhitungan `core/*`.

---

## 16. Definition of Done (per fitur)

Terdokumentasi lengkap di [07-success-metrics.md](./07-success-metrics.md).

---

## 17. Pertanyaan Terbuka

Terdokumentasi lengkap di [07-success-metrics.md](./07-success-metrics.md).

---

## 18. Catatan Penutup untuk Agent

- Prioritaskan **kebenaran aturan** dan **kemudahan input Panitia** di atas fitur tambahan.
- Jika ragu antara "generik tapi rumit" dan "sederhana tapi jalan", pilih sederhana dulu, lalu refactor saat cabang berikutnya menuntutnya.
- Jangan menebak aturan olahraga. Jika aturan tidak tercantum di template, tanyakan atau minta pemilik produk menambahkan ke template.
