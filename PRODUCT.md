# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Fullstack Node.js (Rekomendasi Utama: SvelteKit untuk performa mobile paling ringan / Rekomendasi Kedua: Next.js 15 App Router Standalone) + Tailwind CSS v4. Database: PostgreSQL 16 / SQLite (WAL mode) via Drizzle atau Prisma ORM. Real-time Streaming: Server-Sent Events (SSE) berbasis HTTP/2 dengan In-Memory Fan-Out Broker (Valkey/Redis) untuk menangani ribuan klien simultan tanpa membebani database. Arsitektur terinci terdokumentasi di [docs/prd/08-software-architecture.md](docs/prd/08-software-architecture.md).

## Users

**Penyelenggara (EO / Panitia)**
Ketua panitia dan tim operasional yang mengelola 2-4 turnamen olahraga per tahun di tingkat kecamatan hingga kabupaten. Menggunakan laptop untuk setup turnamen dan smartphone untuk monitoring di lapangan pada hari pertandingan. Rata-rata memimpin tim 5-10 orang panitia.

**Peserta (Individu / Tim)**
Atlet atau tim olahraga amatir yang mengikuti kompetisi di tingkat lokal. Usia 16-35 tahun, mayoritas mengakses via smartphone Android mid-range. Mengikuti 3-5 turnamen per tahun.

**Penonton / Suporter**
Keluarga, teman, dan komunitas yang menonton pertandingan secara langsung di venue. Mengakses via smartphone untuk membeli tiket, check-in, dan memantau skor.

## Product Purpose

Sauma Arena mengotomatisasi siklus hidup turnamen olahraga dari registrasi peserta hingga penerbitan sertifikat. Platform ini menggantikan koordinasi manual via WhatsApp dan spreadsheet yang rentan kesalahan, lambat, dan tidak terstruktur. Sukses berarti: penyelenggara menyelesaikan turnamen tanpa kesalahan data, waktu persiapan berkurang setengah dibanding proses manual, dan peserta serta penonton mendapat informasi akurat secara real-time.

## Positioning

Platform terpadu yang mencakup registrasi, jadwal, klasemen, bracket, tiket QR, dan e-sertifikat dalam satu tempat. Kompetitor (Challonge, Toornament) berfokus pada bracket saja dan tidak menyediakan tiket QR atau sertifikat. Sauma Arena menargetkan konteks Indonesia: multi-cabang olahraga (futsal, badminton, voli, e-sports), bahasa Indonesia sebagai bahasa utama, dan skala komunitas (kecamatan hingga kabupaten) yang diabaikan oleh platform global.

## Operating Context

- Turnamen diadakan di gedung olahraga, lapangan terbuka, atau tempat sewa (GOR, hall)
- Panitia membuat turnamen berminggu-minggu sebelumnya, mendaftarkan peserta via form, lalu mengelola pertandingan di hari H
- Hari pertandingan (matchday): admin menginput skor secara langsung dari pinggir lapangan via smartphone, petugas pintu memindai tiket QR penonton
- Koneksi internet bervariasi: WiFi di venue besar, 4G di lapangan terbuka, kadang koneksi lemah
- Cabor prioritas utama: Futsal dan Sepak Bola (dengan arsitektur modular yang dapat disesuaikan untuk bola voli, badminton, basket, dan e-sports)
- Arsitektur dua portal: Admin Dashboard (khusus admin/panitia dengan otentikasi) dan Portal Publik Live Score (7 tab bebas akses tanpa login: Info, Tim Peserta, Jadwal, Klasemen, Bracket, Statistik, Skor Suporter)
- Sertifikat diterbitkan 1-3 hari setelah turnamen selesai (atau seketika pasca-final)

## Capabilities and Constraints

**Kapabilitas Inti (MVP):**
1. Registrasi: formulir peserta individu/tim, upload dokumen kelayakan, verifikasi manual oleh admin
2. Tim & Skuad: profil tim/sekolah, roster pemain, nomor punggung, manajemen official, kunci roster
3. Jadwal & Hasil: manajemen waktu dan venue, deteksi konflik otomatis, notifikasi pengingat, skor laga
4. Live Score & Match Control: input cepat skor laga di Admin Dashboard, peristiwa gol/kartu, BAP digital
5. Klasemen: perhitungan poin otomatis (menang/seri/kalah), tiebreaker bertingkat konfigurabel
6. Bracket: Single Elimination dengan update dan propagasi pemenang otomatis
7. Statistik & Sanksi: top skor, akumulasi kartu kuning/merah, sanksi skorsing otomatis
8. Tiket QR: klaim tiket penonton, tiket rombongan, QR scanner web camera untuk check-in
9. Halaman Publik Event: landing page turnamen dengan 7 tab navigasi (Info, Tim, Jadwal, Klasemen, Bracket, Statistik, Skor Suporter)
10. E-Sertifikat: generator massal otomatis, unduh PDF vektor, QR verifikasi keaslian
11. Skor & Penilaian Suporter: sistem kompetisi suporter terbaik (Best Supporter) dengan parameter aksi positif (+koreo 25, maskot 20, seragam 15, yel-yel 10, tiket +1/tiket) dan penalti pelanggaran (-rusuh 50, lempar benda 25, rasis 15, barang terlarang 5)

**Belum tersedia di MVP:**
- Payment gateway otomatis (pembayaran transfer manual dengan verifikasi bukti transfer di MVP)
- Double Elimination interaktif penuh dan Round Robin murni (disiapkan untuk fase lanjutan)
- Push notification browser native (email dan notifikasi web di MVP)
- Mobile native app (PWA web mobile-first di MVP)
- Live video streaming embed langsung
- Engine cabor non-futsal/bola (disiapkan secara arsitektur, diimplementasikan bertahap)

**Constraints:**
- Self-hosted pada single server (SQLite/PostgreSQL, standalone Next.js build)
- Target 2.500 concurrent users di MVP saat babak puncak
- Bahasa Indonesia sebagai bahasa utama antarmuka
- Domain target: arena.sauma.id

## Brand Commitments

- Nama: **Sauma Arena**
- Produk ini bagian dari ekosistem Sauma (SaumaDrive/SaumaMediaPro sebagai produk sibling)
- Identitas visual berpedoman pada [DESIGN.md](DESIGN.md)
- Bahasa antarmuka: Indonesia
- Tone komunikasi: profesional, lugas, teknis, cocok untuk komunitas olahraga lokal

## Evidence on Hand

- Dokumen PRD lengkap terbagi dalam 7 berkas di [docs/prd/00-index.md](docs/prd/00-index.md)
- Referensi benchmark: [FloEvent — Piala Gubernur Antar Pelajar SMA/SMK/MA Se-NTT 2026](https://floevent.id/dia-lagi-sport/piala-gubernur-antar-pelajar-smasmk-ma-se-ntt-2026)
- Belum ada kode implementasi (greenfield)
- Belum ada logo final [USER MUST PROVIDE]
- Belum ada data pengguna nyata atau testimonial [REAL DATA]
- Belum ada screenshot produk [PRODUCT NOT BUILT YET]

## Product Principles

1. **Data Harus Benar.** Klasemen, bracket, dan tiket tidak boleh memiliki kesalahan hitung atau validasi. Akurasi 100% bukan target, tapi syarat.
2. **Informasi Real-Time.** Skor, jadwal, dan status tiket harus terupdate dalam hitungan detik, bukan menit. Peserta dan penonton tidak boleh melihat data basi.
3. **Satu Alur untuk Semua.** Satu platform untuk tiga peran (admin, peserta, penonton). Tidak ada kebutuhan aplikasi tambahan, spreadsheet, atau grup WhatsApp.
4. **Akses dari Lapangan.** Antarmuka harus bekerja di smartphone layar kecil, koneksi 4G, dan di bawah sinar matahari. Matchday bukan ruang kantor.
5. **Bukti, Bukan Klaim.** Sertifikat bisa diverifikasi. Tiket bisa divalidasi. Data klasemen bisa diaudit. Setiap output sistem bisa dibuktikan kebenarannya.

## Accessibility & Inclusion

- WCAG 2.1 Level AA sebagai standar minimum
- Kontras teks minimum 4.5:1 untuk semua teks
- Touch target minimum 44x44px untuk semua elemen interaktif
- Navigasi keyboard penuh untuk seluruh fitur
- Label ARIA untuk screen reader pada komponen interaktif
- Antarmuka harus readable di bawah sinar matahari (outdoor use case)
