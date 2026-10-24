# Sauma Arena — Product Requirements Document (PRD)

- **Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)
- **Versi Dokumen:** 1.0
- **Bahasa UI Aplikasi:** Bahasa Indonesia (dengan struktur i18n)
- **Bahasa Kode & Identifier:** Inggris
- **Tujuan Dokumen:** Spesifikasi utama untuk tim pengembangan dan AI coding agent.

---

## 0. Panduan Kerja Agent (Wajib Dibaca)

1. Baca seluruh dokumen sebelum menulis kode. Jangan mulai coding dari bagian tengah.
2. Kerjakan **per fase** (lihat [07-success-metrics.md](./07-success-metrics.md)). Selesaikan semua *acceptance criteria* dan tes satu fase sebelum pindah ke fase berikutnya.
3. **Dilarang menaruh aturan olahraga di luar folder `/sports/<kode-cabang>/`.** Kode `/core` tidak boleh tahu aturan sepakbola, bulutangkis, dll.
4. `/core` hanya boleh memakai modul cabang lewat **registry**, tidak boleh import langsung.
5. Semua logika aturan olahraga ditulis sebagai **fungsi murni** (tanpa akses database/jaringan) dan wajib punya unit test.
6. **Skor bukan sumber kebenaran.** Sumber kebenaran adalah rangkaian `match_events`. Skor, klasemen, top skor, dan kartu selalu dihitung dari event.
7. Setiap perubahan oleh Admin/Panitia pada pertandingan harus menulis `audit_logs`.
8. Jika ada hal yang ambigu atau tidak tercakup, catat asumsi paling sederhana di [11-decisions.md](./11-decisions.md).
9. Commit kecil dan sering. Satu commit = satu perubahan yang bisa dijelaskan dalam satu kalimat.
10. Jangan menambah fitur di luar dokumen ini tanpa persetujuan.

---

## Daftar Lengkap Dokumen PRD (01 s/d 12)

| No | Dokumen | Cakupan Utama | Rujukan Master |
|:--:|:--------|:--------------|:---------------|
| 01 | [Ringkasan Eksekutif](./01-executive-summary.md) | Visi, Tujuan (G1-G4), Bukan Tujuan, dan Prinsip Desain Invariant | Bagian 1, 2 |
| 02 | [Peran & Hak Akses](./02-target-personas.md) | Matriks hak akses Admin, Official (Wasit, Juri, Scorekeeper), Publik | Bagian 3, 4 |
| 03 | [Kebutuhan Fungsional & User Stories](./03-user-stories.md) | Spesifikasi FR-ADM (01-18), FR-OFF (01-11), FR-PUB (01-09) | Bagian 11 |
| 04 | [Mesin Aturan & Format Pertandingan](./04-functional-specs.md) | Template Cabor, Interface SportModule, State Machine, Tiebreaker | Bagian 7, 8, 9, 10 |
| 05 | [Alur Pengguna Operasional](./05-user-flows.md) | Alur setup kompetisi, plotting jadwal, live scoring, hingga verifikasi | Bagian 8.2, 9 |
| 06 | [Kebutuhan Non-Fungsional](./06-non-functional-requirements.md) | Latensi, Keamanan RLS, Optimistic UI, Privasi data pemain | Bagian 12 |
| 07 | [Roadmap, Tes & Definition of Done](./07-success-metrics.md) | Roadmap Fase 0-4, Kasus Uji Wajib (Vitest), DoD, Pertanyaan Terbuka | Bagian 14, 15, 16, 17 |
| 08 | [Arsitektur Perangkat Lunak](./08-software-architecture.md) | Modular Monolith, Model Data PostgreSQL, Event Sourcing, Dependensi | Bagian 5, 6 |
| 09 | [Desain Antarmuka & Wireframe](./09-wireframes-and-ui.md) | Ilustrasi Wireframe Admin Command Center, 3 Konsol Mobile, Portal Publik & Bagan | Desain UI/UX |
| 10 | [Konteks Produk & Brand](./10-product-context.md) | Skema Impeccable, Positioning, Prinsip Produk, dan Batasan Sistem | Konteks Produk |
| 11 | [Keputusan Arsitektur & Asumsi](./11-decisions.md) | Architectural Decision Records (ADR-001 s/d ADR-007) & Asumsi Teknis | Log ADR |
| 12 | [Master Spesifikasi Produk](./12-master-prd.md) | Kompilasi Utuh Seluruh 18 Bagian Spesifikasi PRD v1.0 | Bagian 0–18 |

---

## Peta Model Skor & Cabang Olahraga

| Model Skor (`scoring_model`) | Cabor Bawaan | Ciri Utama Aturan |
|---|---|---|
| `timed_goals` | Sepakbola, Futsal | Babak waktu (menit), skor naik tiap gol, akumulasi kartu & foul |
| `rally_set` | Bola Voli, Bulutangkis | Sistem set/game, target poin, selisih minimal (win-by-2), batas maks |
| `map_series` | Esport (Generik) | Seri best-of-N (BO1, BO3, BO5), hasil per map |
| `judged` (P2) | Silat, Senam | Penilaian subjektif juri |
| `placement_points` (P2) | Battle Royale, Balap | Poin berbasis posisi peringkat akhir |

---

## Arsitektur Portal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SAUMA ARENA MODULAR MONOLITH                           │
├─────────────────────────────────────────┬───────────────────────────────────┤
│        ADMIN PORTAL (/admin)            │       OFFICIAL CONSOLE (/official)│
│       Akses Penuh Manajemen             │       Khusus Wasit/Operator Lapangan│
├─────────────────────────────────────────┼───────────────────────────────────┤
│ • Manajemen Cabor & Template Aturan     │ • Daftar Laga Ditugaskan          │
│ • Setup Kompetisi & Rules Snapshot      │ • Konfirmasi Lineup Tim           │
│ • Plotting Jadwal, Venue & Wasit        │ • Live Scoring & Timer Cabor      │
│ • Dua Tahap Verifikasi Hasil (Lock)     │ • Catat Pelanggaran / Kartu / Set │
│ • Audit Log & Penanganan Sengketa       │ • Mode Offline Caching Lokal      │
├─────────────────────────────────────────┴───────────────────────────────────┤
│                       PORTAL PUBLIK (/c/[slug])                             │
│                  Akses Bebas Tanpa Login (Read-Only)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Tab Jadwal & Hasil Laga Real-time (Label 'Belum Resmi' sebelum verified)   │
│ • Tab Klasemen Resmi (Hanya dihitung dari pertandingan berstatus verified)  │
│ • Tab Bagan Gugur (Bracket) dengan Propagasi Pemenang Otomatis              │
│ • Tab Profil Tim & Statistik Pemain (Tanpa Data Pribadi Sensitif)           │
└─────────────────────────────────────────────────────────────────────────────┘
```
