# 11. Catatan Keputusan Arsitektur & Asumsi (ADR & Decisions)

**Dokumen PRD — Bagian 11/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Edisi Turnamen:** Milad Matsanega Futsal Competition I (MMFC I) • MTsN 3 Blitar  
**Versi:** 2.0  

---

Dokumen ini mencatat seluruh Keputusan Arsitektural (*Architectural Decision Records / ADR*), asumsi teknis, dan trade-off implementasi yang menjadi rujukan kode sumber Sauma Arena.

---

## ADR-001: Arsitektur Modular Monolith dalam Satu Basis Kode
- **Status:** Diterima & Diimplementasikan (Accepted)
- **Konteks:** Sistem harus melayani kebutuhan penonton publik, wasit lapangan, dan panitia admin tanpa memerlukan deployment multiproyek yang rumit.
- **Keputusan:**
  - Menggabungkan seluruh antarmuka dalam satu basis kode Next.js App Router tunggal (`src/components/public/`, `src/components/referee/`, dan `src/components/admin/`).
  - Menghubungkan seluruh modul melalui kontrak antarmuka TypeScript terpusat di `src/types/index.ts`.
- **Konsekuensi:** Pemeliharaan kode efisien, type-safety end-to-end, dan pembaruan state reaktif instan antar-antarmuka.

---

## ADR-002: Event Sourcing Ringan untuk Pertandingan
- **Status:** Diterima & Diimplementasikan (Accepted)
- **Konteks:** Riwayat laga rentan sengketa dan kesalahan input wasit di bawah tekanan waktu lapangan.
- **Keputusan:**
  - Skor, kartu, foul, dan statistik **bukan sumber kebenaran tunggal**.
  - Sumber kebenaran mutlak adalah rangkaian `match_events` append-only yang dicatat per menit.
  - Event tidak pernah dihapus secara destruktif; koreksi dilakukan melalui aksi *void* dengan mencatat alasan resmi.
- **Konsekuensi:** Audit trail lengkap, pencatatan transparan, dan rollback aman jika terjadi gol yang dianulir wasit.

---

## ADR-003: Alur Verifikasi Hasil Dua Tahap (Two-Stage Verification)
- **Status:** Diterima & Diimplementasikan (Accepted)
- **Konteks:** Mencegah perubahan sepihak atau kesalahan input di lapangan memengaruhi tabel klasemen resmi.
- **Keputusan:**
  - Tahap 1: Wasit 1, Wasit 2, dan Pengawas Pertandingan menandatangani BAP di lapangan (`finished`).
  - Tahap 2: Komisioner/Pengawas mengesahkan dan mengunci hasil permanen di Admin Arena (`verified` & `locked = true`).
  - Hanya pertandingan berstatus `verified` yang diakumulasikan ke dalam tabel klasemen publik.
- **Konsekuensi:** Integritas kompetisi terjamin bebas manipulasi.

---

## ADR-004: Pembekuan Regulasi Kompetisi (Rules Snapshotting)
- **Status:** Diterima & Diimplementasikan (Accepted)
- **Konteks:** Perubahan aturan global tidak boleh merusak kompetisi yang sedang berlangsung di tengah turnamen.
- **Keputusan:** Saat status kompetisi diubah menjadi `ongoing`, seluruh aturan cabor (durasi, sistem kartu, batas foul, dan tie-breaker) dibekukan permanen ke kolom `competitions.rules_snapshot`.
- **Konsekuensi:** Stabilitas regulasi turnamen terjamin dari awal babak grup hingga grand final.

---

## ADR-005: Stack Teknologi & Ekosistem
- **Status:** Diterima & Diimplementasikan (Accepted)
- **Konteks:** Membutuhkan performa rendering instan, responsivitas sentuh tinggi, dan kesederhanaan deployment.
- **Keputusan:**
  - Frontend & Server Framework: **Next.js (App Router, Turbopack)** dengan **TypeScript Strict Mode**.
  - Styling: **Tailwind CSS** dengan arsitektur variabel CSS adaptif.
  - Skema Validasi: **Zod**.
  - Tipografi Olahraga: `Bebas Neue`, `Teko`, `Barlow Condensed`, dan `Plus Jakarta Sans`.
- **Konsekuensi:** Waktu kompilasi cepat (< 50ms) dan performa antarmuka halus.

---

## ADR-006: Standar Zona Waktu UTC & Tampilan WIB
- **Status:** Diterima & Diimplementasikan (Accepted)
- **Konteks:** Penjadwalan pertandingan memerlukan kejelasan waktu tanpa risiko kesalahan zona waktu.
- **Keputusan:** Seluruh timestamp disimpan dalam format **UTC (ISO 8601)** dan disajikan kepada pengguna dalam zona **Waktu Indonesia Barat (WIB / UTC+7)**.
- **Konsekuensi:** Sinkronisasi waktu konsisten di semua perangkat panitia dan penonton.

---

## ADR-007: Idempotensi & Antrean Caching Offline di GOR
- **Status:** Diterima & Diimplementasikan (Accepted)
- **Konteks:** Sinyal seluler di dalam gedung olahraga (GOR) Lapangan Seabless kerap berfluktuasi.
- **Keputusan:**
  - Setiap aksi pencatatan gol/pelanggaran diberi **UUID unik di sisi klien**.
  - Server memberlakukan batasan unik `(match_id, client_uuid)` sehingga pengiriman ulang (*retry*) tidak akan menggandakan skor.
  - Event yang belum terkirim ditampung dalam local cache tablet dan otomatis disinkronkan saat online.
- **Konsekuensi:** Data pertandingan aman dari kehilangan dan bebas duplikasi.

---

## ADR-008: Dual Athletic Sports Theme Bebas Coklat
- **Status:** Diterima & Diimplementasikan (Accepted)
- **Konteks:** Pengguna menginginkan antarmuka yang energetik, bernuansa biru sporty atletik, tidak samar di bawah terik matahari, dan bebas dari kesan warna coklat/pudar pada kartu dan teks.
- **Keputusan:**
  - Mode Terang (*Light Mode*): Menggunakan Royal Blue Enerjik (`#1D63B8`), Deep Athletic Navy (`#0C2340`), border kartu tegas slate-300 (`#CBD5E1` berbobot 1.5–2px), bayangan halus (`rgba(12, 35, 64, 0.08)`), dan teks berkontras tinggi. Seluruh elemen teks kuning/oranye gelap yang menyerupai coklat digantikan dengan biru sporty atau warna kartu wasit asli.
  - Mode Gelap (*Dark Mode*): Menggunakan Emas Pemenang (`#F59E0B`) dan Midnight Pitch Charcoal (`#07131F`).
- **Konsekuensi:** Tampilan kartu tajam, terbaca jelas di luar ruangan, dan memenuhi standar aksesibilitas WCAG AA.

---

## ADR-009: Konsol Terpusat Tiga Antarmuka via Query Switcher
- **Status:** Diterima & Diimplementasikan (Accepted)
- **Konteks:** Memfasilitasi perpindahan cepat antara Portal Publik (`/`), Konsol Wasit Meja (`?view=referee`), dan Admin Arena (`?view=admin`) dalam satu browser pengembang maupun panitia.
- **Keputusan:** Menggunakan query string `?view=` pada `src/app/page.tsx` dengan pengawalan sesi login RBAC untuk rute terproteksi.
- **Konsekuensi:** Navigasi mulus, pengalaman operasional cepat tanpa me-reload seluruh aplikasi.

---

## ADR-010: Sistem Penilaian Tribun Suporter Terpadu
- **Status:** Diterima & Diimplementasikan (Accepted)
- **Konteks:** Penentuan gelar Best Supporter MMFC I memerlukan parameter penilaian yang adil dan dapat dipertanggungjawabkan.
- **Keputusan:**
  - Mengintegrasikan form penilaian juri suporter langsung pada konsol tablet lapangan.
  - Menggabungkan poin kehadiran tiket gate masuk (+poin), 5 kriteria positif kreativitas (+poin), dan 5 kategori sanksi kedisiplinan (-poin).
  - Skor suporter dihubungkan langsung ke profil kontingen sekolah dan leaderboard publik.
- **Konsekuensi:** Penilaian suporter transparan, menekan risiko anarkis, dan mendorong atmosfer tribun yang sportif.

---

## ADR-011: Pengesahan Berita Acara Pertandingan (BAP) Digital 3 Pihak
- **Status:** Diterima & Diimplementasikan (Accepted)
- **Konteks:** Menghilangkan ketergantungan pada lembar kertas BAP fisik yang rawan hilang atau basah di lapangan.
- **Keputusan:** Menyediakan modal pratinjau lembar rekapitulasi BAP digital dengan verifikasi tanda tangan digital Wasit 1, Wasit 2, dan Pengawas Pertandingan sebelum hasil pertandingan dapat dikunci permanen.
- **Konsekuensi:** Efisiensi waktu administrasi pertandingan dan arsip digital instan.

---

## ADR-012: Tata Letak Dasbor Admin Simetris (*Centered Layout*)
- **Status:** Diterima & Diimplementasikan (Accepted)
- **Konteks:** Pada monitor layar lebar (1080p, 2K, 4K), pembungkus konten admin yang menempel di sisi kiri menyisakan area kosong (*void*) besar di sisi kanan.
- **Keputusan:** Menetapkan class `max-w-7xl mx-auto` pada elemen pembungkus `<main>` di `AdminDashboard.tsx`.
- **Konsekuensi:** Konten dasbor admin terpusat secara simetris, seimbang, dan nyaman dipandang pada berbagai resolusi layar.

---

## ADR-013: Wizard Pendaftaran Kontingen 4 Tahap & Validasi NISN
- **Status:** Diterima & Diimplementasikan (Accepted)
- **Konteks:** Pendaftaran kontingen sekolah memerlukan penertiban batas usia dan keabsahan status siswa madrasah.
- **Keputusan:** Menyediakan modal pendaftaran 4 tahap di portal publik (Data Sekolah, Roster 10-12 Atlet dengan NISN 10 digit, Unggah Rekomendasi Kepala Madrasah, Ringkasan) yang bermuara pada antrean verifikasi admin.
- **Konsekuensi:** Mencegah manipulasi usia pemain dan menjamin keabsahan atlet pelajar.

---

## ADR-014: E-Tiket Masuk Stadion & Poin Kehadiran Suporter
- **Status:** Diterima & Diimplementasikan (Accepted)
- **Konteks:** Mengatur kapasitas tribun Lapangan Seabless dan memberikan apresiasi bagi suporter rombongan.
- **Keputusan:** Menyediakan pemesanan e-tiket dengan kode booking QR di portal publik dan modul scanner gate di admin yang secara otomatis mengkreditkan poin kehadiran ke kontingen suporter bersangkutan.
- **Konsekuensi:** Pengendalian kapasitas stadion tertib dan integrasi langsung dengan leaderboard Best Supporter.
