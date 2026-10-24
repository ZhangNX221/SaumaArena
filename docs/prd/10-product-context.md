# 10. Konteks Produk & Brand (Product Context)

**Dokumen PRD — Bagian 10/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Versi:** 1.0  

---

<!-- impeccable:product-schema 1 -->

## Platform

Web Application (Responsive Mobile-First Progressive Web App / PWA)

## Stack

Fullstack Modular Monolith: Next.js App Router (TypeScript Strict Mode) + Tailwind CSS. Database & Backend Engine: Supabase (PostgreSQL 16 dengan Row Level Security, Supabase Auth, Realtime Broadcast). Validasi skema: Zod. Unit Testing: Vitest. Arsitektur terinci terdokumentasi di [12-master-prd.md](./12-master-prd.md) dan [08-software-architecture.md](./08-software-architecture.md).

## Users

**Administrator (`admin`)**
Pengelola utama kejuaraan/turnamen olahraga. Bertanggung jawab atas inisiasi kompetisi, kustomisasi aturan cabang olahraga (*Sport Template*), pendaftaran tim & pemain, plotting jadwal & venue, penugasan panitia, dan verifikasi akhir hasil pertandingan (*two-stage verification*).

**Panitia / Perangkat Pertandingan (`official`)**
Wasit utama (*referee*), pencatat skor (*scorekeeper*), juri (*judge*), dan asisten lapangan. Mengakses konsol mobile lapangan untuk konfirmasi lineup, pencatatan waktu/babak, input peristiwa laga secara real-time (1–2 ketukan), dan penutupan pertandingan.

**Penonton / Publik (Anonim)**
Suporter, keluarga, atlet, dan masyarakat umum. Mengakses portal publik `/c/[slug]` secara bebas tanpa login untuk memantau jadwal, live score pertandingan (< 3 detik), klasemen resmi, bagan gugur, dan statistik pemain.

## Product Purpose

Sauma Arena adalah platform manajemen pertandingan multi-cabang olahraga (sepakbola, futsal, bola voli, bulutangkis, esport, dll.) dalam satu aplikasi dan satu codebase. Menggantikan proses manual spreadsheet dan koordinasi pesan instan yang rentan sengketa dan lambat, Sauma Arena menghadirkan otomasi berbasis aturan cabor (*data-driven rules*), pencatatan peristiwa berbasis event sourcing ringan (*match_events*), dan verifikasi hasil dua tahap yang transparan.

## Positioning

Platform manajemen turnamen multi-cabor pertama yang mengombinasikan fleksibilitas *Sport Template* (mendukung model skor waktu, reli set, dan seri map esport) dengan kesederhanaan konsol lapangan mobile-first dan portal publik real-time tanpa login. Menargetkan ekosistem kompetisi olahraga pelajar, komunitas, hingga kejuaraan daerah di Indonesia.

## Operating Context

- Pertandingan berlangsung di gedung olahraga tertutup (GOR), hall serbaguna, atau lapangan luar ruang dengan kondisi sinyal internet bervariasi.
- Hari pertandingan (*matchday*): Panitia mencatat skor dan insiden langsung dari pinggir lapangan via smartphone di bawah tekanan waktu (maksimal 1–2 ketukan).
- Arsitektur ketahanan offline: Klien menggunakan UUID unik per event untuk menjamin idempotensi saat jaringan tidak stabil; data dicache lokal di perangkat (`localStorage`).
- Cabor bawaan MVP: Sepakbola, Futsal, Bola Voli, Bulutangkis, dan Esport (Generik).
- Dua portal terpisah: Portal Admin & Konsol Lapangan (akses terproteksi) serta Portal Publik Turnamen (bebas akses tanpa login).

## Invariants & Principles

1. **Data-Driven Rules:** Aturan cabor didefinisikan sebagai template JSON dan modul TypeScript terpisah di `src/sports/<kode>/`. Kode `src/core/` dilarang keras memuat logika spesifik cabang (`no if (sport === 'football')`).
2. **Event Sourcing Ringan:** Sumber kebenaran adalah deretan `match_events` append-only. Skor dan klasemen selalu dihitung murni dari event yang sah (tidak pernah di-DELETE).
3. **Validasi Saat Input:** Setiap event yang melanggar aturan teknis cabor ditolak seketika oleh fungsi murni `validateEvent` dengan pesan bahasa Indonesia.
4. **Dua Tahap Hasil:** Panitia menandai `finished`, Admin mengesahkan `verified` (`locked = true`). Hanya hasil terverifikasi yang masuk perhitungan klasemen resmi.
5. **Snapshot Aturan:** Saat kompetisi dimulai (`ongoing`), aturan dibekukan ke `rules_snapshot` agar perubahan global di kemudian hari tidak mengubah kompetisi yang sedang berjalan.
6. **Mobile-First Lapangan:** Konsol panitia dirancang responsif, kontras tinggi di bawah sinar matahari, dan memiliki touch target $\ge 44\times 44\text{px}$.
7. **Idempotensi Mutlak:** Pengiriman event berulang akibat retry jaringan tidak akan menggandakan skor di server.

## Rujukan Dokumen Terkait

- [00-index.md](./00-index.md) — Indeks Modular PRD Sauma Arena
- [09-wireframes-and-ui.md](./09-wireframes-and-ui.md) — Desain Antarmuka & Ilustrasi Wireframe
- [11-decisions.md](./11-decisions.md) — Architectural Decision Records & Asumsi Teknis
- [12-master-prd.md](./12-master-prd.md) — Master Dokumen Spesifikasi PRD v1.0
- [DESIGN.md](../../DESIGN.md) — Sistem Desain & Tipografi Athletic Sauma Arena
