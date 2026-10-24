# 03. Kebutuhan Fungsional & User Stories

**Dokumen PRD — Bagian 3/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Versi:** 1.0  

---

## 3.1 Kebutuhan Fungsional Administrator (`FR-ADM`)

| ID | Kebutuhan Fungsional | Prioritas | Kriteria Penerimaan (Acceptance Criteria) |
|---|---|:---:|---|
| **FR-ADM-01** | Autentikasi & Dashboard Ringkas | **P0** | Admin dapat login/logout dengan aman; melihat kartu statistik kompetisi aktif, jumlah tim terdaftar, dan jadwal pertandingan hari ini. |
| **FR-ADM-02** | Manajemen Kompetisi (CRUD) | **P0** | Admin dapat memilih cabang olahraga, menentukan nama turnamen, slug URL unik, musim, rentang tanggal pelaksanaan, dan visibilitas (`public` / `private`). |
| **FR-ADM-03** | Konfigurasi & Override Aturan Cabor | **P0** | Admin dapat melihat template standar cabor dan menerapkan override aturan spesifik turnamen (misal: durasi babak, batas pergantian) yang divalidasi lewat `validateRules`. |
| **FR-ADM-04** | Pembekuan Aturan (*Rules Snapshot*) | **P0** | Saat status kompetisi diubah menjadi `ongoing`, konfigurasi aturan otomatis disalin permanen ke `rules_snapshot` dan terkunci dari perubahan global. |
| **FR-ADM-05** | Master Data Tim & Pemain | **P0 (CRUD)<br>P1 (CSV)** | Admin dapat menambah/mengedit/menghapus peserta dan pemain, serta mengunggah data pemain via berkas CSV/Excel. |
| **FR-ADM-06** | Pendaftaran Tim & Roster Kompetisi | **P0** | Admin dapat menetapkan tim ke dalam kompetisi, membagi grup/seeding, menyetujui status kepesertaan, serta mengunci nomor punggung roster. |
| **FR-ADM-07** | Manajemen Venue & Lapangan | **P0** | Admin dapat mendaftarkan nama venue/GOR, jumlah lapangan (Court 1, Court 2), alamat, dan catatan teknis operasional. |
| **FR-ADM-08** | Manajemen Fase Kompetisi (*Stages*) | **P0** | Admin dapat membuat fase pertandingan bertingkat dan memilih format turnamen (`round_robin`, `single_elimination`, `group_then_knockout`). |
| **FR-ADM-09** | Plotting Jadwal & Deteksi Bentrok | **P0 (Manual)<br>P1 (Oto)** | Admin dapat mengatur jadwal pertandingan; sistem otomatis memvalidasi dan memperingatkan jika terjadi bentrok jadwal venue, tim, atau wasit. |
| **FR-ADM-10** | Manajemen Akun Panitia / Perangkat | **P0** | Admin dapat membuat dan mengundang akun panitia/wasit (`official`), mengatur status aktif, dan mereset kredensial jika diperlukan. |
| **FR-ADM-11** | Penugasan Panitia Lapangan | **P0** | Admin dapat menugaskan satu atau lebih panitia ke suatu laga berdasarkan tugasnya (`referee`, `scorekeeper`, `judge`, `assistant`). |
| **FR-ADM-12** | Tinjauan & Verifikasi Hasil Laga | **P0** | Admin dapat meninjau timeline event laga yang telah berstatus `finished`, lalu melakukan pengesahan resmi menjadi `verified` (`locked = true`). |
| **FR-ADM-13** | Pembukaan Kunci Laga Terverifikasi | **P0** | Jika terjadi kesalahan fatal, Admin dapat membuka kunci laga terverifikasi kembali ke `finished` dengan mewajibkan alasan tertulis dan mencatatnya ke audit log. |
| **FR-ADM-14** | Putusan Administratif (WO, Tunda, Batal) | **P0** | Admin dapat mengubah status pertandingan menjadi `walkover`, `postponed`, atau `cancelled` dengan pencatatan skor default sesuai regulasi cabor. |
| **FR-ADM-15** | Peninjau Audit Log | **P1** | Admin dapat memeriksa jejak audit sistem dengan filter nama aktor, nomor laga, rentang tanggal, dan tipe aksi perubahan data. |
| **FR-ADM-16** | Manajemen Protes & Sengketa Tim | **P1** | Admin dapat mendokumentasikan protes resmi tim, mengubah status sengketa (`open`, `accepted`, `rejected`), dan menuliskan resolusi putusan. |
| **FR-ADM-17** | Manajemen Skorsing & Akumulasi Kartu | **P1** | Sistem menghitung akumulasi kartu kuning/merah secara otomatis sesuai template dan memberikan peringatan larangan tanding pada laga berikutnya. |
| **FR-ADM-18** | Ekspor Dokumen Resmi (BAP / PDF / CSV) | **P2** | Admin dapat mengunduh Berita Acara Pertandingan (BAP) dan tabel klasemen resmi dalam format PDF siap cetak atau CSV. |

---

## 3.2 Kebutuhan Fungsional Panitia & Wasit Lapangan (`FR-OFF`)

| ID | Kebutuhan Fungsional | Prioritas | Kriteria Penerimaan (Acceptance Criteria) |
|---|---|:---:|---|
| **FR-OFF-01** | Beranda Tugas Lapangan | **P0** | Panitia yang login langsung disajikan daftar pertandingan yang ditugaskan kepadanya, dengan laga aktif hari ini berada di posisi teratas. |
| **FR-OFF-02** | Konfirmasi Lineup Pertandingan | **P0** | Panitia memeriksa dan memilih pemain starter serta cadangan dari daftar roster resmi sebelum pertandingan dimulai. |
| **FR-OFF-03** | Konsol Pertandingan Terkonfigurasi | **P0** | Antarmuka konsol pertandingan dibentuk secara dinamis dari `consoleConfig` modul cabor (tombol, nama aksi, dan skema input disesuaikan cabor). |
| **FR-OFF-04** | Pencatatan Event Cepat & Validasi | **P0** | Panitia mencatat skor atau pelanggaran dalam 1–2 ketukan; setiap aksi diverifikasi murni oleh `validateEvent` (input tidak sah langsung ditolak). |
| **FR-OFF-05** | Pembatalan / Void Event | **P0** | Panitia dapat membatalkan event yang salah input sebelum laga selesai dengan alasan wajib; sistem otomatis menghitung ulang skor secara instan. |
| **FR-OFF-06** | Timer Pertandingan Andal | **P0** | Untuk cabor berbasis waktu (`timed_goals`), timer dapat dimulai, dijeda, dan ditambah waktu tanpa desinkronisasi saat tab diminimalkan (dihitung dari timestamp). |
| **FR-OFF-07** | Transisi Periode & Selesai Laga | **P0** | Panitia dapat menutup babak/set/map dan menandai laga selesai (`finished`) saat syarat kemenangan pada modul cabor terpenuhi. |
| **FR-OFF-08** | Ringkasan BAP Lapangan | **P0** | Sebelum menyerahkan hasil ke Admin, panitia dapat meninjau ringkasan statistik (skor akhir, pencetak poin, kartu, pencatat waktu). |
| **FR-OFF-09** | Mode Offline Lapangan | **P1** | Saat koneksi internet di venue putus, event disimpan lokal dengan UUID unik dan nomor urut `seq`, lalu disinkronkan otomatis tanpa duplikasi saat online kembali. |
| **FR-OFF-10** | Tanda Tangan Digital Wasit | **P2** | Wasit utama dan kapten kedua tim dapat membubuhkan tanda tangan digital langsung pada layar sentuh perangkat sebagai bukti pengesahan BAP. |
| **FR-OFF-11** | Laporan Insiden Khusus (*Match Incident*) | **P1** | Panitia dapat mencatat insiden khusus (kericuhan, cedera parah, kerusakan fasilitas) dalam bentuk catatan berkas resmi. |

---

## 3.3 Kebutuhan Fungsional Publik Tanpa Login (`FR-PUB`)

| ID | Kebutuhan Fungsional | Prioritas | Kriteria Penerimaan (Acceptance Criteria) |
|---|---|:---:|---|
| **FR-PUB-01** | Direktori Turnamen Publik | **P0** | Pengunjung dapat melihat daftar kejuaraan yang dipublikasikan, dengan turnamen "Sedang Berlangsung" ditampilkan di bagian paling atas. |
| **FR-PUB-02** | Halaman Utama Kompetisi Modular | **P0** | Halaman kompetisi memiliki tab navigasi terstruktur: **Jadwal**, **Hasil**, **Klasemen**, **Bagan Gugur (Bracket)**, dan **Statistik**. |
| **FR-PUB-03** | Halaman Detail Laga Live | **P0** | Menampilkan papan skor besar, status waktu/set, timeline peristiwa (menit demi menit / poin demi poin), dan susunan pemain dengan update live tanpa refresh. |
| **FR-PUB-04** | Profil Tim & Atlet Publik | **P1** | Menampilkan profil tim, daftar pemain aktif, jadwal tanding, dan riwayat skor tim tanpa mengekspos data pribadi sensitif (tanggal lahir/kontak disembunyikan). |
| **FR-PUB-05** | URL Ramah Sosial Media (OpenGraph) | **P0** | Setiap URL kompetisi dan pertandingan menyajikan preview meta-tag OpenGraph lengkap (nama laga, skor live, logo cabor) saat dibagikan ke media sosial. |
| **FR-PUB-06** | Label Transparansi Hasil | **P0** | Pertandingan yang belum disahkan Admin diberi label penjelas *"Belum Resmi"*, dan hasilnya tidak dimasukkan ke dalam tabel klasemen publik sebelum `verified`. |
| **FR-PUB-07** | Filter Pencarian Jadwal | **P1** | Publik dapat memfilter laga berdasarkan tanggal, nama tim sekolah, lapangan venue, atau babak pertandingan. |
| **FR-PUB-08** | QR Code Cepat Laga & Turnamen | **P1** | Tersedia tombol generate QR code untuk discan oleh penonton di tribun menggunakan kamera HP guna membuka halaman live score laga bersangkutan. |
| **FR-PUB-09** | Tim Favorit & Notifikasi Web | **P2** | Pengunjung dapat menandai tim favorit (disimpan di browser lokal) dan menerima notifikasi web push saat tim favorit bertanding atau mencetak skor. |

---

## 3.4 Desain Antarmuka Konsol Lapangan Berdasarkan Model Skor

UI konsol pertandingan dibentuk secara otomatis melalui konfigurasi `consoleConfig` modul cabor:

1. **Model `timed_goals` (Sepakbola & Futsal):**
   - Scoreboard digital besar dengan kontras tinggi.
   - Timer babak terintegrasi (Mulai, Jeda, Tambah Waktu Hentian).
   - Tombol cepat per tim: **+ Gol**, **Kartu Kuning**, **Kartu Merah**, **Pelanggaran (Foul)**, **Pergantian Pemain**, dan **Timeout**.
   - Pemilihan pemain instan dari daftar pemain yang sedang berada di atas lapangan.
   - Indikator khusus futsal: Penghitung akumulasi foul per babak (peringatan saat mencapai 5 foul dan penanda penalti 10m).

2. **Model `rally_set` (Bola Voli & Bulutangkis):**
   - Scoreboard set dan perolehan poin set berjalan.
   - Tombol raksasa **+1 Poin** untuk Tim Kiri dan Tim Kanan yang mudah ditekan satu tangan.
   - Tombol **Undo Cepat** untuk koreksi poin seketika.
   - Penanda interval otomatis (misal poin 11 pada bulutangkis) dan tombol timeout resmi.
   - Sistem otomatis mengunci set saat syarat kemenangan tercapai dan membuka set berikutnya.

3. **Model `map_series` (Esport):**
   - Daftar Game/Map 1 hingga N sesuai aturan best-of.
   - Form ringkas input skor map: Pemenang Map, Skor Kills/Rounds, dan durasi pertandingan.
   - Perhitungan otomatis agregat kemenangan seri (misal: 2-0 atau 2-1 pada format BO3).

*Ilustrasi wireframe visual lengkap untuk masing-masing model konsol lapangan dapat dilihat pada dokumen [09-wireframes-and-ui.md](./09-wireframes-and-ui.md).*
