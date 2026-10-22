# Sauma Arena — Product Requirements Document (PRD)

**Produk:** Sauma Arena  
**Versi Dokumen:** 2.0.0  
**Tanggal:** 19 Oktober 2026  
**Status:** Draft, Siap Review  
**Penulis:** Product & Architecture Team  
**Target Rilis MVP:** Q1 2027  
**Referensi Benchmark:** [FloEvent — Piala Gubernur Antar Pelajar SMA/SMK/MA Se-NTT 2026](https://floevent.id/dia-lagi-sport/piala-gubernur-antar-pelajar-smasmk-ma-se-ntt-2026)

---

## Daftar Dokumen PRD

| No | Dokumen | Deskripsi |
|:--:|:--------|:----------|
| 01 | [Ringkasan Eksekutif](./01-executive-summary.md) | Visi produk, masalah yang diselesaikan, 5 rekomendasi tagline branding |
| 02 | [Target Pengguna & User Persona](./02-target-personas.md) | Profil detail 3 peran utama: Penyelenggara, Peserta, Penonton |
| 03 | [User Stories & Acceptance Criteria](./03-user-stories.md) | Tabel user stories untuk 8 modul fitur beserta kriteria penerimaan |
| 04 | [Spesifikasi Fungsional](./04-functional-specs.md) | Logika sistem di balik layar untuk setiap modul fitur |
| 05 | [Alur Pengguna Utama](./05-user-flows.md) | Alur langkah demi langkah dari pembuatan turnamen hingga penerbitan sertifikat |
| 06 | [Kebutuhan Non-Fungsional](./06-non-functional-requirements.md) | Keamanan, performa, skalabilitas, kompatibilitas |
| 07 | [Metrik Keberhasilan](./07-success-metrics.md) | KPI untuk mengukur kesuksesan rilis MVP |
| 08 | [Arsitektur Perangkat Lunak](./08-software-architecture.md) | Blueprint Fullstack Node.js, komparasi framework ringan, penanganan ribuan klien, SSE realtime fanout |
| — | [PRODUCT.md](../../PRODUCT.md) | Product context (impeccable init schema) |
| — | [DESIGN.md](../../DESIGN.md) | Design direction & visual system |

---

## Peta Fitur (Feature Map)

### Fitur Inti (Core Features)

| # | Modul | Deskripsi Singkat |
|:-:|:------|:------------------|
| 1 | **Registrasi** | Pendaftaran peserta individu/tim, upload dokumen, verifikasi pembayaran & kelayakan |
| 2 | **Jadwal & Hasil** | Manajemen pertandingan, venue, notifikasi pengingat, skor live |
| 3 | **Klasemen** | Perhitungan poin otomatis (liga/grup), tiebreaker konfigurabel |
| 4 | **Bracket** | Bagan eliminasi otomatis/manual (SE, DE, RR) dengan update real-time |
| 5 | **Tiket QR** | Klaim/pembelian tiket digital, QR scanner untuk check-in di venue |
| 6 | **E-Sertifikat** | Sertifikat digital otomatis dengan QR verifikasi keaslian |

### Fitur Tambahan (Referensi FloEvent & Kompetisi Pelajar)

| # | Modul | Deskripsi Singkat |
|:-:|:------|:------------------|
| 7 | **Tim & Skuad** | Profil tim/sekolah, roster pemain, manajemen official |
| 8 | **Statistik Pemain** | Top skor, top assist, kartu kuning/merah, sanksi otomatis |
| 9 | **Galeri & Berita** | Media center: foto, video highlight, pengumuman resmi panitia |
| 10 | **Halaman Publik Event** | Landing page turnamen: tab Info, Tim Peserta, Jadwal, Klasemen, Bracket, Statistik, Skor Suporter |
| 11 | **Skor & Penilaian Suporter** | Kompetisi Suporter Terbaik: penilaian aksi positif (+koreografi, maskot, seragam, yel-yel, tiket) dan penalti pelanggaran (-kericuhan, lempar benda, rasis, selundup barang) |

---

## Arsitektur Portal: Admin Dashboard vs Publik Live Score

Sistem memisahkan secara tegas antarmuka internal operasional panitia dan portal penonton publik:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SAUMA ARENA ARCHITECTURE                              │
├─────────────────────────────────────────┬───────────────────────────────────┤
│    ADMIN DASHBOARD (Akses Terproteksi)  │   PORTAL PUBLIK & LIVE SCORE      │
│    URL: /admin/tournaments/[id]         │   URL: /event/[slug] (Tanpa Login)│
├─────────────────────────────────────────┼───────────────────────────────────┤
│ • Konfigurasi Cabor & Aturan Poin       │ • Tab 1: Info (Regulasi & Sponsor)│
│ • Verifikasi Berkas Tim & Roster Lock   │ • Tab 2: Tim Peserta & Profil     │
│ • Matchday Controller & Quick Scoring   │ • Tab 3: Jadwal & Live Score      │
│ • Form Penilaian Juri Skor Suporter     │ • Tab 4: Klasemen Real-time       │
│ • Ticketing & QR Gate Scanner Operator  │ • Tab 5: Bagan Gugur (Bracket)    │
│ • Generator E-Sertifikat Massal         │ • Tab 6: Statistik Top Skor/Kartu │
│                                         │ • Tab 7: Klasemen Skor Suporter   │
└─────────────────────────────────────────┴───────────────────────────────────┘
```

---

## Fokus Cabang Olahraga & Desain Fleksibel

- **Fokus Utama MVP: Sepak Bola & Futsal**
  - Dioptimasi untuk regulasi standar futsal (2x20 menit) dan sepak bola (2x45 menit).
  - Mekanisme kartu kuning (akumulasi 2 kartu = skorsing), kartu merah langsung, adu penalti gugur, dan penilaian kreativitas suporter sekolah di tribun.
- **Arsitektur Extensible (Modular Sport Rule Engine):**
  - Dirancang menggunakan abstraksi antarmuka aturan olahraga (*SportRuleEngine*) sehingga sistem di fase berikutnya dapat diadaptasi untuk cabor bola voli (aturan set & poin 25), badminton (best of 3 games), basket (4 kuarter), dan e-sports tanpa merombak struktur database inti.

---

## Prioritas Fitur (MoSCoW)

| Prioritas | Fitur |
|:----------|:------|
| **Must Have** | Registrasi, Tim & Skuad, Jadwal & Live Score, Klasemen, Bracket (Single Elimination), Tiket QR (klaim gratis), Admin Dashboard (terproteksi), Halaman Publik Event (7 Tab: Info, Tim, Jadwal, Klasemen, Bracket, Statistik, Skor Suporter), Mesin Aturan Futsal & Sepak Bola |
| **Should Have** | Skor & Penilaian Suporter (form juri admin + kalkulasi otomatis tiket ter-scan), Bracket (Double Elimination), Statistik Pemain (top skor, kartu, sanksi otomatis), E-Sertifikat (template bawaan), Notifikasi email |
| **Could Have** | Galeri & Berita, Tiket berbayar (manual transfer), Adaptor cabor Bola Voli & Badminton, E-Sertifikat custom upload, Push notification browser |
| **Won't Have (MVP)** | Mobile native app, Live streaming video embed langsung, Payment gateway otomatis, Marketplace sponsor |
