# 10. Konteks Produk & Brand (Product Context)

**Dokumen PRD — Bagian 10/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Edisi Turnamen:** Milad Matsanega Futsal Competition I (MMFC I) • MTsN 3 Blitar  
**Versi:** 2.0  

---

<!-- impeccable:product-schema 2 -->

## Platform

Web Application (Responsive Mobile-First Progressive Web App / PWA) terpadu dalam satu basis kode (*single codebase*) Next.js App Router yang menyajikan tiga konsol antarmuka: Portal Publik (`/`), Konsol Wasit Lapangan (`/?view=referee`), dan Admin Arena Command Center (`/?view=admin`).

## Stack Teknologi

- **Frontend & Server Framework:** Next.js (App Router, Turbopack, TypeScript Strict Mode).
- **Sistem Desain & Styling:** Tailwind CSS dengan arsitektur Dual Athletic Sports Theme.
- **Basis Data & State Engine:** PostgreSQL Relasional dengan Row Level Security (RLS) dan dukungan Realtime Broadcast.
- **Validasi Skema:** Zod Schema Validation.
- **Tipografi Olahraga:** `Bebas Neue` (display judul), `Teko` (angka scoreboard & durasi waktu), `Barlow Condensed` (lencana & navigasi atletik), serta `Plus Jakarta Sans` / `Inter` (teks antarmuka).

## Pengguna & Pemangku Kepentingan

**1. Superadmin & Komisioner Turnamen (`admin`)**
Pengelola tertinggi turnamen (misal: Komisioner MMFC I Ust. H. Syamsul Arifin, M.Pd). Bertanggung jawab atas inisiasi kompetisi, pembekuan snapshot regulasi, verifikasi berkas atlet (NISN), drawing bagan gugur, plotting jadwal & penugasan wasit, manajemen kuota tiket stadion, pengesahan hasil laga dua tahap, sinkronisasi durasi waktu, serta pencadangan data sistem.

**2. Perangkat Pertandingan (`referee` & `official`)**
Wasit utama (Wasit 1 & 2), pencatat skor meja (*scorekeeper*), juri suporter, dan pengawas pertandingan. Mengoperasikan konsol tablet lapangan untuk kendali stopwatch digital (*running clock* vs *stop clock*), pencatatan gol per menit, pemantauan foul akumulasi (5/5), time-out 60 detik, sanksi disiplin kartu wasit, penilaian tribun suporter madrasah, dan penandatanganan digital lembar Berita Acara Pertandingan (BAP).

**3. Penonton, Wali Murid & Suporter Madrasah (Publik)**
Siswa madrasah, suporter sekolah kontingen, atlet, dan masyarakat umum. Mengakses portal publik `/` secara bebas tanpa login untuk memantau jadwal 17 laga, siaran langsung skor (< 3 detik), klasemen resmi fase grup A–D, bagan gugur 4 besar, leaderboard suporter madrasah, mengunduh PDF juknis resmi, mendaftarkan kontingen sekolah, dan memesan e-tiket masuk stadion.

## Konteks Operasional (Matchday Milad ke-31 MTsN 3 Blitar)

- **Ajang Pertandingan:** *Milad Matsanega Futsal Competition I (MMFC I)* diselenggarakan dalam rangka memperingati Milad ke-31 MTsN 3 Blitar.
- **Peserta:** 14 Tim Kontingen Pelajar SD/MI se-derajat di Blitar Raya yang terbagi ke dalam 4 Grup (A, B, C, D) dengan sistem setengah kompetisi dilanjutkan babak semifinal, bronze match, dan grand final (total 17 pertandingan).
- **Lokasi Venue:** *Lapangan Futsal Seabless Srengat, Blitar* dengan kapasitas 500 penonton dan pembagian pintu: Gate Barat (VIP & Atlet) serta Gate Timur (Suporter Madrasah & Umum).
- **Lingkungan Lapangan:** GOR futsal dengan pantulan sinar matahari dan fluktuasi sinyal internet; membutuhkan konsol wasit bertombol besar, kontras visual tinggi, dan ketahanan simpan offline lokal.

## Prinsip Desain & Visual Branding (Dual Athletic Theme)

1. **Mode Terang (*Light Mode* — Putih-Biru Sporty Enerjik):**
   - Warna Utama: Royal Blue Atletik (`#1D63B8`), Navy Pekat (`#0C2340`), Latar Sejuk (`#F4F8FD`), Aksen Sky Blue (`#0284C7`), dan Emas Piala (`#F59E0B`).
   - Garis Pembatas Tegas: Border card menggunakan slate-300 (`#CBD5E1`) berketebalan 1.5–2px dan elevasi bayangan halus (`rgba(12, 35, 64, 0.08)`).
   - **Bebas Nuansa Coklat/Pudar:** Menghindari warna teks oranye/kuning gelap yang menyerupai coklat pada mode terang guna menjaga kesan sporty, segar, dan berenergi.
2. **Mode Gelap (*Dark Mode* — Emas Pemenang & Midnight Pitch):**
   - Warna Utama: Biru Elektrik Sky (`#38BDF8`), Emas Pemenang (`#F59E0B`), dan Midnight Charcoal (`#07131F`).
3. **Tata Letak Dasbor Simetris:** Area konten admin dibungkus dalam container simetris `max-w-7xl mx-auto` sehingga terhindar dari ruang kosong sepihak di monitor layar lebar.

## Rujukan Dokumen Terkait

- [00-index.md](./00-index.md) — Indeks PRD Sauma Arena v2.0
- [05-user-flows.md](./05-user-flows.md) — Alur Pengguna Operasional Lengkap & Diagram Interaksi
- [09-wireframes-and-ui.md](./09-wireframes-and-ui.md) — Desain Antarmuka & Ilustrasi Wireframe Tiga Konsol
- [11-decisions.md](./11-decisions.md) — Log Keputusan Arsitektural (ADR-001 s/d ADR-012)
- [12-master-prd.md](./12-master-prd.md) — Master Dokumen Spesifikasi Produk v2.0
