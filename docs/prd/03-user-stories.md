# 03. Kebutuhan Fungsional & User Stories (Functional Specs & Stories)

**Dokumen PRD — Bagian 3/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Edisi Turnamen:** Milad Matsanega Futsal Competition I (MMFC I) • MTsN 3 Blitar  
**Versi:** 2.0  

---

## 3.1 Kebutuhan Fungsional Administrator Arena (`FR-ADM`)

| ID | Kebutuhan Fungsional | Prioritas | Kriteria Penerimaan (Acceptance Criteria) |
|---|---|:---:|---|
| **FR-ADM-01** | Autentikasi & Sesi RBAC Aman | **P0** | Superadmin dan Pengawas Pertandingan dapat login via `/api/auth/login`, sesi aman via cookie terenkripsi, dan proteksi rute admin. |
| **FR-ADM-02** | Dashboard Beranda & 4 Metrik Kunci | **P0** | Menyajikan ringkasan instan: Total Kontingen (14 Tim), Total Laga (17 Pertandingan), Status Laga Berjalan (LIVE), dan Puncak Klasemen Medali. |
| **FR-ADM-03** | Klasemen Perolehan Medali 1-Tap | **P0** | Stepper cepat tombol `+` dan `-` untuk mencatat medali Emas, Perak, Perunggu tanpa modal rumit, otomatis mengurutkan kontingen teratas. |
| **FR-ADM-04** | Manajemen Kompetisi & Freeze Rules | **P0** | Admin dapat membuat kompetisi baru dan membekukan seluruh regulasi teknis ke `rules_snapshot` saat status beralih ke `ongoing`. |
| **FR-ADM-05** | Master Data Cabor, Kategori & Lapangan | **P0** | Pengelolaan data cabor Futsal, batas usia pelajar SD/MI, nomor tanding, dan master venue Lapangan Futsal Seabless Srengat. |
| **FR-ADM-06** | Verifikasi Berkas Kontingen Atlet | **P0** | Antarmuka peninjauan dokumen pendaftaran sekolah: verifikasi NISN resmi, surat rekomendasi kepala madrasah, dengan aksi `VERIFIED`, `REJECTED`, atau `PENDING`. |
| **FR-ADM-07** | Database Atlet & Cetak ID Card Ber-QR | **P0** | Tabel database seluruh atlet terdaftar lengkap dengan fungsi ekspor dan pencetakan ID Card ber-QR code untuk akses gerbang atlet Gate Barat. |
| **FR-ADM-08** | Interactive Drawing Bracket Bagan Gugur | **P0** | Alat interaktif pengundian bagan grup dan fase gugur (Semifinal, Bronze Match, Grand Final) dengan opsi seeding manual atau acak. |
| **FR-ADM-09** | Penjadwalan Laga & Deteksi Bentrok Wasit | **P0** | Plotting jam tanding, nomor lapangan, dan penugasan wasit dengan deteksi bentrok otomatis jika wasit/lapangan terjadwal ganda. |
| **FR-ADM-10** | Live Score Override Darurat Lapangan | **P0** | Kemampuan darurat bagi komisioner untuk mengoreksi skor, menit, atau status pertandingan jika terjadi kegagalan teknis pada konsol wasit. |
| **FR-ADM-11** | Verifikasi BAP Dua Tahap (Pengawas) | **P0** | Pengawas Pertandingan memeriksa kecocokan BAP digital wasit, menandatangani persetujuan, dan mengunci hasil permanen (`locked = true`). |
| **FR-ADM-12** | Otomasi Propagasi Klasemen & Bagan | **P0** | Saat laga berstatus `verified`, sistem otomatis menghitung ulang poin klasemen (3/1/0) dan memajukan tim pemenang ke slot babak semifinal/final. |
| **FR-ADM-13** | Konfigurasi Kuota Tiket Masuk Stadion | **P0** | Mengatur batas kuota harian e-tiket suporter rombongan dan penonton umum di Lapangan Seabless. |
| **FR-ADM-14** | Scanner Check-in Tiket Gate Masuk | **P0** | Pemindai kamera/barcode untuk validasi QR e-tiket di pintu masuk; mencegah *double check-in* dan mengkreditkan poin kehadiran suporter sekolah. |
| **FR-ADM-15** | Rekapitulasi & Moderasi Best Supporter | **P0** | Tinjauan agregat nilai tribun suporter madrasah yang menggabungkan poin tiket, kreativitas yel-yel, atribut, maskot, dan sanksi kedisiplinan. |
| **FR-ADM-16** | Sinkronisasi Pengaturan Durasi Waktu | **P0** | Panel pengaturan durasi babak 1 & 2 (15 menit), akumulasi foul (5), time-out (1 menit), dan jeda istirahat yang langsung sinkron ke konsol wasit. |
| **FR-ADM-17** | Kustomisasi Banner Hero & Portal Publik | **P1** | Pengaturan preset banner stadion, slider transparansi overlay, pengaturan posisi dan ukuran logo resmi MMFC I MTsN 3 Blitar. |
| **FR-ADM-18** | Manajemen Akun Panitia & Hak Akses | **P1** | Pengelolaan pengguna panpel, wasit, dan juri suporter dengan penetapan role RBAC. |
| **FR-ADM-19** | Cadangkan & Pulihkan Database (JSON) | **P1** | Fitur 1-klik unduh seluruh database turnamen dalam format JSON terenkripsi dan restore instan jika terjadi bencana perangkat keras. |
| **FR-ADM-20** | Ekspor Laporan Resmi (PDF & Excel) | **P1** | Ekspor lembar BAP resmi, klasemen akhir fase grup, dan rekapitulasi pencetak gol terbanyak (Sepatu Emas) untuk arsip Dispora & Kemenag. |
| **FR-ADM-21** | Jejak Audit Log Perubahan Skor & Hasil | **P1** | Perekaman otomatis setiap aksi void gol, perubahan jadwal, dan pembukaan kunci laga (`actor_id`, `timestamp`, `reason`). |
| **FR-ADM-22** | Tata Letak Dasbor Simetris (*Centered*) | **P0** | Konten dasbor admin dibungkus dalam container simetris `max-w-7xl mx-auto` sehingga tampil seimbang dan proporsional di layar lebar (*widescreen*). |

---

## 3.2 Kebutuhan Fungsional Wasit Lapangan (`FR-OFF`)

| ID | Kebutuhan Fungsional | Prioritas | Kriteria Penerimaan (Acceptance Criteria) |
|---|---|:---:|---|
| **FR-OFF-01** | Jadwal Pertandingan Tugas Hari Ini | **P0** | Wasit/juri yang membuka konsol langsung disajikan daftar laga tugasnya, dengan laga LIVE atau laga berikutnya berada di posisi teratas. |
| **FR-OFF-02** | Konfirmasi Kehadiran & Lineup Roster | **P0** | Pemeriksaan daftar 10–12 atlet yang sah bertanding dan penentuan 5 pemain starter di lapangan. |
| **FR-OFF-03** | Kendali Stopwatch Digital (Running/Stop) | **P0** | Stopwatch taktil besar: Waktu kotor (*running clock*) di babak grup; Waktu bersih (*stop clock*) di babak gugur. Tombol Jalankan/Jeda, Bel Kick-Off, dan Reset. |
| **FR-OFF-04** | Pencatatan Gol Cepat per Menit | **P0** | Tombol raksasa `+ 1 GOL` dengan perekaman otomatis menit pertandingan, pemilihan atlet pencetak gol, dan jenis gol (biasa, penalti, own goal). |
| **FR-OFF-05** | Papan Skor Digital Kontras Tinggi | **P0** | Tampilan angka skor besar tabular di tengah konsol dengan nama kontingen sekolah dan lencana tim A / tim B. |
| **FR-OFF-06** | Akumulasi Pelanggaran Tim (Fouls 5/5) | **P0** | Stepper pencatat foul dengan 5 lampu indikator; saat mencapai 5/5, sistem membunyikan bel peringatan dan mengaktifkan second penalty 10m. |
| **FR-OFF-07** | Kuota & Hitung Mundur Time-Out (60 Dtk) | **P0** | Pemicu time-out 60 detik (1x per babak tiap tim) dengan audio sinyal bel pada sisa 10 detik. |
| **FR-OFF-08** | Sanksi Disiplin Kartu Wasit | **P0** | Pencatatan kartu kuning dan kartu merah langsung; otomatis mengonversi akumulasi 2 kartu kuning menjadi kartu merah keluar lapangan. |
| **FR-OFF-09** | Pembatalan Gol / Koreksi Kesalahan (*Void*) | **P0** | Kemampuan membatalkan gol atau event yang salah input sebelum laga berakhir dengan pencatatan alasan wajib. |
| **FR-OFF-10** | Form Penilaian Tribun Suporter Madrasah | **P0** | Formulir khusus juri suporter: memilih sekolah kontingen, menilai 5 kriteria positif (+poin), dan mencatat sanksi pelanggaran (-poin). |
| **FR-OFF-11** | Pratinjau & Tanda Tangan Digital BAP | **P0** | Modal pratinjau berita acara pertandingan lengkap dengan tanda tangan digital 3 pihak: Wasit 1, Wasit 2, dan Pengawas Pertandingan. |
| **FR-OFF-12** | Form Pelaporan Insiden Khusus Komdis | **P1** | Formulir formal pencatatan insiden perusakan, kericuhan, atau pelanggaran disiplin berat untuk disidangkan Komisi Disiplin. |
| **FR-OFF-13** | Ketahanan Jaringan & Mode Offline GOR | **P1** | Jika koneksi internet di venue putus, event tetap dicatat di local storage tablet dan otomatis disinkronkan saat sinyal kembali normal. |

---

## 3.3 Kebutuhan Fungsional Publik & Suporter (`FR-PUB`)

| ID | Kebutuhan Fungsional | Prioritas | Kriteria Penerimaan (Acceptance Criteria) |
|---|---|:---:|---|
| **FR-PUB-01** | Akses Bebas Hambatan Tanpa Login | **P0** | Publik dapat membuka seluruh informasi portal publik langsung dari browser tanpa mewajibkan registrasi atau pembuatan akun. |
| **FR-PUB-02** | Navbar Atas dengan Pencarian Reaktif | **P0** | Input pencarian instan pada navbar untuk mencari tim atau sekolah kontingen madrasah dengan hasil dropdown cepat. |
| **FR-PUB-03** | Hero Spotlight MMFC I & Scoreboard Ticker | **P0** | Banner atletik berlatar stadion navy, sorotan logo resmi Matsanega, jadwal, lokasi Seabless Srengat, dan ticker informasi waktu. |
| **FR-PUB-04** | Sub-Navigation Bar 8 Tab Docked | **P0** | Tab bar berlabuh (*sticky*) di bawah navbar dengan indikator aktif biru royal: Info, Live, Jadwal, Grup, Bracket, Tim, Statistik, Suporter. |
| **FR-PUB-05** | Tab Informasi & Juknis (Bento Grid) | **P0** | Bento grid olahraga berkontras tinggi: kartu durasi 2x15M, kartu disiplin wasit (visual kartu kuning & merah), kartu penghargaan, dan panduan gate access. |
| **FR-PUB-06** | Unduh Berkas Juknis Resmi (PDF 2.4 MB) | **P0** | Tombol taktil unduh berkas juknis teknis pertandingan resmi Dispora/Asosiasi Futsal dengan notifikasi konfirmasi. |
| **FR-PUB-07** | Tab Live Scoreboard & Timeline Laga | **P0** | Skor langsung pertandingan aktif (< 3 detik latensi), menit gol, nama pencetak gol, akumulasi foul tim, dan status time-out. |
| **FR-PUB-08** | Tab Jadwal & Hasil Pertandingan | **P0** | Daftar lengkap 17 laga dengan filter fase grup A–D, semifinal, final, tautan Google Maps venue, dan lencana status verifikasi resmi. |
| **FR-PUB-09** | Tab Klasemen Fase Grup (Grup A–D) | **P0** | Tabel klasemen 14 tim kontingen dengan metrik P, W, D, L, GF, GA, GD, Poin Suporter (SP), PTS, dan penanda kelolosan juara grup ke semifinal. |
| **FR-PUB-10** | Tab Bagan Eliminasi (Knockout Bracket) | **P0** | Bagan gugur interaktif Babak 4 Besar (Semifinal 1 & 2), Perebutan Juara 3 (Bronze Match), dan Grand Final dengan propagasi pemenang otomatis. |
| **FR-PUB-11** | Tab Profil 14 Tim Kontingen Madrasah | **P0** | Profil kontingen sekolah, foto logo madrasah, roster 10–12 atlet, pelatih kepala, dan catatan akumulasi kartu. |
| **FR-PUB-12** | Tab Statistik & Sepatu Emas (Top Scorer) | **P0** | Peringkat pencetak gol terbanyak turnamen, grafik batang produktivitas per tim, dan grafik garis menit terciptanya gol. |
| **FR-PUB-13** | Tab & Leaderboard Best Supporter | **P0** | Peringkat suporter madrasah berdasarkan akumulasi poin kehadiran tiket, atribut, yel-yel, maskot, serta pengurangan poin sanksi. |
| **FR-PUB-14** | Modal Wizard Pendaftaran Kontingen | **P0** | Formulir pendaftaran 4 langkah bagi sekolah peserta: biodata tim, roster 10–12 atlet dengan NISN, unggah surat rekomendasi kepala madrasah. |
| **FR-PUB-15** | Modal Pemesanan E-Tiket Masuk Stadion | **P0** | Pemilihan kategori tiket suporter rombongan atau umum, konfirmasi reservasi, dan penerbitan kode booking QR tiket masuk. |
| **FR-PUB-16** | Desain Biru Sporty & Anti-Samar | **P0** | Tampilan mode terang didominasi Putih-Biru Sporty Enerjik (`#1D63B8`), Navy (`#0C2340`), border tegas (`#CBD5E1`), dan bebas elemen teks bernuansa coklat/pudar. |
