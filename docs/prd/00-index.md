# Sauma Arena — Product Requirements Document (PRD)

- **Produk:** Sauma Arena (Platform Manajemen Pertandingan & Match Center Olahraga Terpadu)
- **Implementasi Resmi:** Milad Matsanega Futsal Competition I (MMFC I) • MTsN 3 Blitar
- **Versi Dokumen:** 2.0 (Arsitektur Lengkap Tiga Konsol: Publik, Wasit Lapangan, dan Admin Arena)
- **Bahasa UI Aplikasi:** Bahasa Indonesia (dengan struktur penamaan atletik standar internasional)
- **Bahasa Kode & Identifier:** TypeScript / English
- **Tujuan Dokumen:** Spesifikasi induk operasional dan teknis bagi seluruh tim pengembang, wasit, dan panitia pelaksana.

---

## 0. Panduan Kerja & Standar Integritas Sistem (Wajib Dipatuhi)

1. **Prinsip Tiga Konsol Terpadu:** Platform beroperasi dalam satu codebase tunggal (`Single Codebase / App Router`) dengan tiga antarmuka terintegrasi:
   - **Portal Publik (`/`):** 8 Tab informasi, live score, klasemen, bagan gugur, registrasi tim, dan pemesanan e-tiket.
   - **Konsol Wasit Meja (`/?view=referee`):** Kendali stopwatch digital, pencatatan gol per menit, akumulasi foul 5/5, time-out, kartu wasit, form penilaian tribun suporter, dan penandatanganan Berita Acara Pertandingan (BAP).
   - **Admin Arena Dashboard (`/?view=admin`):** Pusat kendali komisioner turnamen untuk verifikasi berkas kontingen atlet, drawing bagan, override skor, scanner gate tiket, sinkronisasi waktu laga, dan ekspor laporan resmi.
2. **Desain Dual Athletic Sports Theme:**
   - **Mode Terang (*Light Mode*):** Putih-Biru Sporty Enerjik (`#1D63B8`, Deep Athletic Navy `#0C2340`, latar sejuk `#F4F8FD`, border tegas `#CBD5E1`, dan bayangan kartu halus). Bebas dari nuansa coklat/amber pada teks dan kartu.
   - **Mode Gelap (*Dark Mode*):** Emas Pemenang (`#F59E0B`) & Midnight Pitch Charcoal (`#07131F`).
3. **Skor Bukan Sumber Kebenaran Tunggal:** Sumber kebenaran mutlak adalah rangkaian peristiwa `match_events` (gol, foul, kartu, timeout) yang dicatat kronologis per menit. Skor, klasemen, top scorer sepatu emas, dan evaluasi suporter dihitung secara konsisten dari deretan event yang sah.
4. **Verifikasi Hasil Dua Tahap (*Two-Stage Verification*):**
   - Tahap 1: Wasit 1, Wasit 2, dan Pengawas Pertandingan menandatangani BAP digital lapangan (`finished`).
   - Tahap 2: Komisioner/Pengawas Pertandingan di Admin Arena mengesahkan dan mengunci permanen (`verified` & `locked = true`). Hanya hasil berstatus `verified` yang diakumulasikan ke klasemen resmi.
5. **Idempotensi & Ketahanan Lapangan:** Setiap aksi pencatatan gol/pelanggaran memiliki UUID unik di sisi klien untuk mencegah duplikasi skor saat jaringan seluler di GOR terputus (*offline queue caching*).

---

## Daftar Lengkap Dokumen PRD (01 s/d 12)

| No | Dokumen | Cakupan Utama | Rujukan Implementasi |
|:--:|:--------|:--------------|:---------------------|
| 01 | [Ringkasan Eksekutif](./01-executive-summary.md) | Visi, Tujuan (G1-G4), Bukan Tujuan, dan Prinsip Desain Invariant | `src/app/page.tsx` |
| 02 | [Peran & Hak Akses](./02-target-personas.md) | Matriks hak akses Superadmin, Pengawas, Wasit Meja, Official Tim, Publik | `src/types/index.ts` |
| 03 | [Kebutuhan Fungsional & User Stories](./03-user-stories.md) | Spesifikasi FR-ADM (01-22), FR-OFF (01-13), FR-PUB (01-13) | `src/config/menuConfig.ts` |
| 04 | [Mesin Aturan & Format Pertandingan](./04-functional-specs.md) | Regulasi Futsal 2x15M, Akumulasi 2 KK, Foul 5/5, Penilaian Suporter | `src/mocks/tournamentData.ts` |
| 05 | [Alur Pengguna Operasional](./05-user-flows.md) | Alur setup turnamen, drawing, live score, BAP digital, tiket scanner | `docs/prd/05-user-flows.md` |
| 06 | [Kebutuhan Non-Fungsional](./06-non-functional-requirements.md) | Latensi < 3 dtk, Mode offline tablet, Kontras tinggi anti-samar | `src/app/globals.css` |
| 07 | [Roadmap, Tes & Definition of Done](./07-success-metrics.md) | Rencana rilis, matriks pengujian Vitest & tsc, kriteria selesai | `package.json` |
| 08 | [Arsitektur Perangkat Lunak](./08-software-architecture.md) | Struktur direktori Next.js, model data relasional, event sourcing | `src/components/` |
| 09 | [Desain Antarmuka & Wireframe](./09-wireframes-and-ui.md) | Wireframe Admin Centered, Konsol Tablet Wasit, 8 Tab Portal Publik | `src/components/public/` |
| 10 | [Konteks Produk & Brand](./10-product-context.md) | Positioning MMFC I, identitas visual atletik, Lapangan Seabless | `src/components/brand/` |
| 11 | [Keputusan Arsitektur & Asumsi](./11-decisions.md) | ADR-001 s/d ADR-012 (Dual Theme, BAP Digital, Suporter Scoring) | `docs/prd/11-decisions.md` |
| 12 | [Master Spesifikasi Produk](./12-master-prd.md) | Kompilasi Utuh Seluruh Spesifikasi PRD v2.0 | Seluruh Dokumen |

---

## Peta Model Skor & Karakteristik Cabang Olahraga

| Model Skor (`scoring_model`) | Cabor Utama | Karakteristik Regulasi & Fitur Lapangan |
|---|---|---|
| `timed_goals` | **Futsal (MMFC I)**, Sepakbola | Babak waktu (2×15M kotor di grup, waktu bersih di gugur), akumulasi foul 5/5, second penalty 10m, akumulasi 2 kartu kuning, time-out 60 detik. |
| `rally_set` | Bola Voli, Bulutangkis, Tenis Meja | Sistem game/set target poin, selisih minimal (win-by-2), interval interval poin 11, tombol raksasa satu tangan. |
| `map_series` | Esport (MLBB, Valorant, Free Fire) | Seri Best-of-1, Best-of-3, perhitungan agregat map, durasi pertandingan, MVP game. |
| `judged_supporter` | **Tribun Suporter Madrasah** | Penilaian kuantitatif juri suporter: kreativitas atribut, kekompakan yel-yel, maskot, kebersihan tribun, dan pemotongan poin akibat sanksi/anarkis. |

---

## Arsitektur Tiga Konsol Terpadu Sauma Arena

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                       SAUMA ARENA TERPADU (NEXT.JS APP ROUTER)                              │
├─────────────────────────────────────────┬───────────────────────────────────────────────────┤
│    KONSOL ADMIN ARENA (?view=admin)     │      KONSOL WASIT LAPANGAN (?view=referee)        │
│      Pusat Kendali Komisioner           │      Tablet Touchscreen Wasit & Juri Meja         │
├─────────────────────────────────────────┼───────────────────────────────────────────────────┤
│ • Tata letak simetris (max-w-7xl mx-auto│ • Jadwal laga tugas wasit (LIVE & Hari ini)       │
│ • Ringkasan 4 metrik & medali 1-tap     │ • Stopwatch digital (Waktu Kotor / Waktu Bersih)  │
│ • Master data cabor, kategori, & venue  │ • Tombol taktil pencatat gol per menit & pemain   │
│ • Verifikasi dokumen NISN & ID Card QR  │ • Akumulasi pelanggaran tim 5/5 & bel peringatan  │
│ • Interactive Drawing Bracket & Seeding │ • Kartu wasit (KK, Akumulasi 2 KK = KKM, Sanksi)  │
│ • Verifikasi BAP Dua Tahap (Pengawas)   │ • Form penilaian skor tribun suporter madrasah    │
│ • Check-in Scanner Gate Tiket Stadion   │ • Lembar pengesahan BAP digital 3 pihak           │
│ • Sinkronisasi durasi waktu laga        │ • Pelaporan insiden khusus rujukan Komdis         │
│ • Backup JSON, Restore & Ekspor PDF     │ • Penyimpanan offline lokal saat sinyal GOR drop  │
├─────────────────────────────────────────┴───────────────────────────────────────────────────┤
│                         PORTAL PUBLIK PENONTON & SUPORTER (/)                               │
│                   Akses Bebas Tanpa Login (Desain Biru Sporty & Kontras Tinggi)             │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ • Navbar atas dengan pencarian reaktif kontingen sekolah & tombol registrasi tim            │
│ • Hero Spotlight MMFC I, Piala Bergilir, dan athletic scoreboard ticker                     │
│ • Tab 1: Informasi & Juknis (Sport Bento Grid, Download PDF Juknis 2.4 MB, Akses Gate)      │
│ • Tab 2: Live Match (Scoreboard raksasa, timeline gol, indikator foul & timeout)           │
│ • Tab 3: Jadwal & Hasil Pertandingan (Filter grup A-D, semifinal, final, status verified)   │
│ • Tab 4: Klasemen Fase Grup (Poin 3/1/0, selisih gol, supporter points, kelolosan)         │
│ • Tab 5: Bagan Gugur (Bracket 4 besar interaktif, bronze match, dan grand final)            │
│ • Tab 6: Profil Tim Kontingen (Roster 10-12 atlet, official, logo sekolah, status berkas)  │
│ • Tab 7: Statistik Turnamen (Sepatu Emas Top Scorer, grafik menit & produktivitas gol)      │
│ • Tab 8: Leaderboard Best Supporter (Poin gabungan tiket, atribut, yel-yel & minus sanksi) │
│ • Modal Registrasi Tim Kontingen (Wizard 4 langkah, validasi berkas NISN atlet)             │
│ • Modal Pembelian E-Tiket Masuk Stadion & QR Code Gate Check-In                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```
