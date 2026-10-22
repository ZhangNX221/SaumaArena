# 01. Ringkasan Eksekutif (Executive Summary)

**Dokumen PRD — Bagian 1/7**  
**Produk:** Sauma Arena  
**Tanggal:** 19 Oktober 2026

---

## 1.1 Visi Produk

Sauma Arena adalah platform manajemen turnamen olahraga terpadu yang menghubungkan tiga pelaku utama kompetisi: **penyelenggara** (EO/Panitia), **peserta** (individu/tim/sekolah), dan **penonton** (suporter/masyarakat umum).

Platform ini mengotomatisasi seluruh siklus hidup turnamen, dari pendaftaran peserta hingga penerbitan sertifikat pemenang, dalam satu ekosistem web yang terintegrasi.

**Target cakupan:**
- **Cabang olahraga prioritas (MVP):** Sepak Bola dan Futsal sebagai fokus utama, dengan arsitektur modular (*Sport Rule Engine*) yang dirancang fleksibel untuk ekspansi cabor lain (bola voli, badminton, bola basket, e-sports) di fase berikutnya.
- **Skala:** Kecamatan hingga kabupaten/kota (dengan arsitektur yang memungkinkan perluasan ke skala provinsi/nasional di iterasi berikutnya)
- **Referensi benchmark:** [FloEvent — Piala Gubernur Antar Pelajar SMA/SMK/MA Se-NTT 2026](https://floevent.id/dia-lagi-sport/piala-gubernur-antar-pelajar-smasmk-ma-se-ntt-2026)

---

## 1.2 Masalah yang Diselesaikan

### Masalah Penyelenggara (EO/Panitia)

| Masalah | Kondisi Saat Ini | Dampak | Solusi Sauma Arena |
|:--------|:-----------------|:-------|:-------------------|
| **Registrasi manual** | Peserta mendaftar via Google Form/WhatsApp, panitia rekap manual ke spreadsheet | Data peserta tersebar, rawan duplikasi, verifikasi lambat | Form registrasi terstruktur dengan verifikasi dokumen, pembayaran, dan kelayakan peserta (validasi kartu pelajar/KTP) |
| **Jadwal tersebar** | Jadwal via grup WA, sering berubah tanpa notifikasi | Peserta datang salah waktu/venue, pertandingan tabrakan | Kalender terpusat dengan deteksi konflik venue dan notifikasi otomatis |
| **Klasemen manual** | Panitia menghitung poin via Excel | Salah hitung, update lambat, peserta tidak percaya hasil | Kalkulasi poin otomatis, real-time, dengan audit trail |
| **Bracket digambar manual** | Dibuat di kertas, Canva, atau PowerPoint | Update lambat, salah pasang pemenang, bracket tidak konsisten | Bracket interaktif dengan propagasi pemenang otomatis |
| **Tiket fisik** | Tiket kertas atau nama di daftar hadir | Dipalsukan, antrean panjang, tidak ada data kehadiran | Tiket digital QR code dengan validasi scan instan |
| **Sertifikat lambat** | Dibuat satu per satu di Word/Canva setelah turnamen selesai | Peserta menunggu berminggu-minggu, sertifikat sering salah nama | Template otomatis, terbit saat turnamen ditutup, QR verifikasi keaslian |
| **Statistik manual** | Top skor dan kartu dicatat di kertas oleh petugas meja | Data hilang, tidak konsisten, wasit dan panitia beda catatan | Pencatatan statistik terintegrasi dengan input skor pertandingan |
| **Penilaian suporter subjektif** | Kategori 'Best Supporter' dinilai manual tanpa parameter pasti | Menimbulkan kecurigaan, protes antarsekolah, rawan bentrok | Sistem Skor Suporter Terstruktur: poin aksi kreatif (+koreo, maskot, seragam, yel-yel, tiket) dan penalti pelanggaran (-rusuh, lemparan, rasis, selundup barang) |

### Masalah Peserta (Tim/Individu)

| Masalah | Dampak | Solusi |
|:--------|:-------|:------|
| Tidak tahu kapan dan di mana bertanding | Datang ke venue yang salah, waktu terbuang | Jadwal personal yang difilter per tim, notifikasi pengingat H-1 dan H-1jam |
| Informasi jadwal berubah tanpa pemberitahuan | Missed match, protes ke panitia | Notifikasi real-time saat jadwal diubah |
| Klasemen tidak transparan | Tidak percaya hasil, konflik antar tim | Klasemen real-time dengan detail perhitungan yang bisa dilihat semua pihak |
| Sertifikat lama terbit atau tidak terbit | Tidak bisa melampirkan untuk portofolio/beasiswa | E-sertifikat otomatis tersedia di akun peserta saat turnamen selesai |
| Roster tim sulit dikelola | Panitia dan tim beda data siapa yang bermain | Portal tim untuk mengelola skuad, update pemain, dan upload dokumen kelayakan |

### Masalah Penonton (Suporter)

| Masalah | Dampak | Solusi |
|:--------|:-------|:------|
| Antrean panjang di pintu masuk | Pengalaman buruk, kehilangan momen pertandingan | Check-in instan via QR scan (<2 detik) |
| Tidak tahu skor terbaru jika tidak hadir | Harus tanya di grup WA | Portal Live Score publik real-time (tanpa login) |
| Tiket kertas hilang atau rusak | Tidak bisa masuk venue | Tiket digital di akun, bisa diakses kapan saja |
| Tidak ada wadah resmi apresiasi suporter | Kreativitas tribun tidak tercatat adil | Klasemen Skor Suporter publik dengan transparansi rincian poin |

---

## 1.3 Diferensiasi dari Kompetitor

| Aspek | Challonge | Toornament | FloEvent | Sauma Arena |
|:------|:---------:|:----------:|:--------:|:-----------:|
| Bracket & Klasemen | ✅ | ✅ | ✅ | ✅ |
| Registrasi & Verifikasi Dokumen | ❌ | Terbatas | ✅ | ✅ |
| Tiket QR & Scanner | ❌ | ❌ | ✅ | ✅ |
| E-Sertifikat dengan QR Verifikasi | ❌ | ❌ | ✅ | ✅ |
| Tim & Skuad Management | ❌ | Terbatas | ✅ | ✅ |
| Statistik Pemain (Top Skor, Kartu) | ❌ | ❌ | ✅ | ✅ |
| Halaman Publik Event (Landing Page) | ❌ | Terbatas | ✅ | ✅ |
| Skor & Penilaian Suporter Terstruktur | ❌ | ❌ | ❌ | ✅ |
| Arsitektur Admin Dashboard vs Live Score Publik | Terbatas | Terbatas | Terbatas | ✅ |
| Engine Aturan Olahraga Modular (Futsal/Bola ke Cabor Lain) | ❌ | Terbatas | ❌ | ✅ |
| Galeri & Berita | ❌ | ❌ | ✅ | ✅ (Could Have) |
| Self-hosted (bukan SaaS only) | ❌ | ❌ | ❌ | ✅ |
| Bahasa Indonesia native | ❌ | ❌ | ✅ | ✅ |
| Target komunitas lokal (kecamatan-kabupaten) | ❌ | ❌ | ✅ | ✅ |

**Positioning Sauma Arena:** Platform terpadu yang menggabungkan fitur-fitur terbaik dari kompetitor global (bracket Challonge) dan lokal (ekosistem lengkap FloEvent), dengan keunggulan self-hosted, open-source, dan fokus pada konteks turnamen olahraga komunitas Indonesia.

---

## 1.4 Rekomendasi Tagline / Slogan Branding

| # | Tagline | Konteks Penggunaan | Alasan |
|:-:|:--------|:-------------------|:-------|
| 1 | **"Satu Platform, Seluruh Kompetisi."** | Hero section, tagline utama | Menekankan solusi end-to-end: registrasi sampai sertifikat dalam satu tempat |
| 2 | **"Turnamenmu, Terkelola."** | Landing page subtitle, marketing | Langsung menyasar pain point penyelenggara: kontrol penuh tanpa kerepotan |
| 3 | **"Dari Peluit Pertama Sampai Podium."** | Banner event, media sosial | Narasi perjalanan kompetisi yang lengkap, emosional, dan sporty |
| 4 | **"Kelola. Tanding. Menang."** | Logo lockup, merchandise | Tiga kata kerja yang merangkum pengalaman tiga persona utama |
| 5 | **"Arena Digitalmu."** | Favicon tagline, app title | Singkat, mudah diingat, memposisikan platform sebagai "rumah" turnamen |

---

## 1.5 Benchmark: Piala Gubernur NTT 2026 di FloEvent

Referensi utama untuk fitur dan alur produk Sauma Arena adalah event **Piala Gubernur Antar Pelajar SMA/SMK/MA Se-NTT 2026** yang dikelola melalui platform FloEvent. Berikut peta fitur yang diadopsi:

### Fitur yang Diadopsi Langsung

| Fitur FloEvent | Adaptasi di Sauma Arena | Prioritas |
|:---------------|:------------------------|:---------:|
| Registrasi tim sekolah + verifikasi dokumen pelajar | Registrasi generik (tim/individu) + verifikasi dokumen konfigurabel | Must Have |
| Jadwal & Hasil per venue (GOR Oepoi, dll.) | Jadwal dengan multi-venue management, filter per tanggal/grup/venue | Must Have |
| Klasemen grup (M/M/S/K/GM/GK/SG/P) | Klasemen dengan konfigurasi poin dan tiebreaker | Must Have |
| Bagan eliminasi (16 Besar sampai Final) | Bracket Single/Double Elimination + Round Robin | Must/Should |
| Profil tim + roster pemain + official | Modul Tim & Skuad | Must Have |
| Top Skor, Kartu Kuning/Merah | Modul Statistik Pemain | Should Have |
| QR Tiket + Scanner gate check-in | Tiket QR + Scanner | Must Have |
| E-Sertifikat dengan QR validasi | E-Sertifikat + QR verifikasi publik | Should Have |

### Fitur yang Ditambahkan (Tidak Ada di FloEvent)

| Fitur Sauma Arena | Deskripsi |
|:------------------|:----------|
| **Self-hosted deployment** | Tidak bergantung pada SaaS pihak ketiga, panitia bisa hosting sendiri |
| **Open-source** | Kode sumber terbuka untuk kustomisasi dan transparansi |
| **Sanksi otomatis (kartu)** | Akumulasi kartu kuning/merah otomatis menghasilkan skorsing |
| **Verifikasi kelayakan konfigurabel** | Admin mengatur sendiri jenis dokumen yang dibutuhkan (KTP, kartu pelajar, ijazah, dll.) |

### Fitur yang Ditunda (Ada di FloEvent, Belum Prioritas)

| Fitur | Alasan Ditunda |
|:------|:---------------|
| Live streaming embed | Kompleksitas infrastruktur tinggi, bukan kebutuhan inti |
| Galeri foto/video | Bisa digantikan sementara dengan link eksternal (Google Photos, YouTube) |
| Berita/pengumuman | Cukup menggunakan notifikasi in-app di MVP |
