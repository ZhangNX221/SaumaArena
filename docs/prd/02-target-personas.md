# 02. Target Pengguna & User Persona

**Dokumen PRD: Bagian 2/7**  
**Produk:** Sauma Arena  
**Tanggal:** 19 Oktober 2026  
**Referensi:** [00-index.md](./00-index.md)

---

## 2.1 Ringkasan Segmentasi Pengguna

Sauma Arena melayani empat kelompok pengguna utama dalam ekosistem turnamen olahraga amatir dan semi-profesional:

1. **Penyelenggara (Admin / Panitia / EO / Pembina Olahraga):** Mengelola turnamen dari persiapan hingga penutupan.
2. **Manajer Tim & Peserta (Pelatih / Official / Atlet / Siswa):** Mendaftarkan tim, melengkapi berkas, dan memantau kompetisi.
3. **Petugas Lapangan (Scorer / Wasit / Operator Meja):** Mencatat jalannya pertandingan dan memverifikasi kehadiran.
4. **Penonton & Suporter (Masyarakat Umum / Orang Tua / Komunitas Sekolah):** Menikmati pertandingan, memantau skor, dan mendukung tim.

---

## 2.2 Persona Detail

### Persona 1: Penyelenggara Turnamen (Event Organizer / Panitia)

![Persona Admin](https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80)

| Atribut | Deskripsi |
|:--------|:----------|
| **Nama** | Andi Pratama |
| **Usia** | 32 tahun |
| **Profesi** | Ketua Panitia Turnamen / Guru Olahraga & Pembina Ekstrakurikuler / Pengurus Asosiasi Cabor |
| **Lokasi** | Tingkat Kecamatan / Kabupaten (contoh: Kupang, NTT atau kota tier-2/3 di Indonesia) |
| **Tingkat Kemahiran Teknologi** | Menengah (terbiasa WhatsApp, Google Drive, spreadsheet dasar, aplikasi perbankan) |
| **Perangkat yang Digunakan** | Laptop (saat persiapan jadwal dan konfigurasi turnamen), Smartphone Android (saat hari H di venue) |

#### Tujuan (Goals)
- Menyelesaikan proses pendaftaran 32 sampai 64 tim tanpa tumpukan kertas dan rekapan manual.
- Mengatur jadwal pertandingan 5 hari turnamen di 2 lapangan tanpa terjadi jadwal bentrok.
- Menyajikan klasemen dan bagan gugur secara instan tanpa tuduhan kecurangan dari manajer tim.
- Menerbitkan e-sertifikat ber-QR ke seluruh atlet dan juara dalam waktu 1 jam setelah final selesai.

#### Rasa Frustrasi (Pain Points)
- Waktu habis untuk mencocokkan bukti transfer bank dan mengecek NISN/KTP manual satu per satu.
- Komplain manajer tim di grup WhatsApp setiap ada revisi jadwal atau keterlambatan laga.
- Risiko salah hitung selisih gol atau poin head-to-head di babak penyisihan grup.
- Ditinggal panitia lain saat hari penutupan karena kelelahan mengetik nama di sertifikat piagam.

#### Perilaku & Konteks Penggunaan
- Mempersiapkan turnamen pada malam hari via laptop.
- Menghadapi situasi bising, tergesa-gesa, dan sinyal seluler fluktuatif di lokasi pertandingan.
- Membutuhkan antarmuka yang padat informasi, memiliki tombol aksi kontras tinggi, dan tombol undo/edit jika terjadi keliru input.

---

### Persona 2: Manajer Tim / Kapten / Pelatih (Peserta)

![Persona Peserta](https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80)

| Atribut | Deskripsi |
|:--------|:----------|
| **Nama** | Dina Kusuma |
| **Usia** | 24 tahun |
| **Profesi** | Kapten Tim Futsal Putri / Manajer Tim Futsal Sekolah SMA / Mahasiswa |
| **Lokasi** | Kota/Kabupaten peserta turnamen |
| **Tingkat Kemahiran Teknologi** | Mahir (aktif media sosial, mobile banking, aplikasi pesan instan) |
| **Perangkat yang Digunakan** | 100% Smartphone Android/iOS (layar sentuh, mobilitas tinggi) |

#### Tujuan (Goals)
- Mendaftarkan skuad (12 pemain + 3 official) dengan unggah foto kartu pelajar/KTP secara mandiri dari ponsel.
- Mengetahui status verifikasi pendaftaran tim tanpa harus bolak-balik bertanya ke panitia.
- Mendapatkan jadwal tanding yang jelas (lapangan berapa, jam berapa, jersey warna apa).
- Memantau akumulasi kartu kuning pemain agar tidak menurunkan atlet yang terkena sanksi skorsing.
- Mengunduh sertifikat resmi untuk portofolio beasiswa atau laporan sekolah.

#### Rasa Frustrasi (Pain Points)
- Panitia meminta berkas fisik rangkap tiga padahal berkas digital sudah dikirim via WhatsApp.
- Jadwal pertandingan dimajukan atau dimundurkan mendadak tanpa pemberitahuan terstruktur.
- Tidak ada catatan resmi mengenai siapa saja pemain lawan yang sah terdaftar (rawan pemain cabutan).
- Sertifikat turnamen tidak kunjung dibagikan hingga berbulan-bulan setelah acara berakhir.

#### Perilaku & Konteks Penggunaan
- Mengisi data saat istirahat kerja atau pulang sekolah melalui smartphone.
- Memeriksa jadwal dan hasil pertandingan sambil melakukan pemanasan di pinggir lapangan.
- Memerlukan tampilan mobile yang responsif, cepat dibuka pada koneksi 4G standar, dan hemat kuota data.

---

### Persona 3: Penonton / Suporter / Orang Tua Atlet

![Persona Penonton](https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80)

| Atribut | Deskripsi |
|:--------|:----------|
| **Nama** | Budi Santoso |
| **Usia** | 28 tahun |
| **Profesi** | Karyawan Swasta / Suporter Tim Lokal / Kakak atau Orang Tua Atlet Pelajar |
| **Lokasi** | Domisili sekitar venue turnamen |
| **Tingkat Kemahiran Teknologi** | Menengah hingga Mahir (pengguna e-commerce dan aplikasi tiket bioskop) |
| **Perangkat yang Digunakan** | Smartphone Android/iOS |

#### Tujuan (Goals)
- Membeli atau mengklaim tiket masuk turnamen secara instan tanpa antre di loket panas.
- Melihat jadwal dan skor terkini tim kebanggaannya meskipun sedang tidak berada di dalam arena.
- Mengetahui daftar pencetak gol terbanyak (top skor) dan bagan babak gugur turnamen.
- Memantau klasemen dan perolehan poin tim suporternya dalam kompetisi "Best Supporter" secara transparan.
- Menyimpan bukti tiket digital langsung di ponsel untuk ditunjukkan di pintu masuk.

#### Rasa Frustrasi (Pain Points)
- Antrean fisik tiket di pintu stadion yang panjang dan desak-desakan.
- Karcis fisik mudah hilang, basah karena keringat, atau sobek di saku celana.
- Tidak ada papan skor digital resmi, harus bertanya ke orang di tribun untuk tahu skor laga berjalan.
- Penilaian predikat suporter terbaik sering dianggap curang dan tidak transparan karena tidak ada rincian poin resmi.

#### Perilaku & Konteks Penggunaan
- Membuka tautan turnamen dari tautan Instagram atau grup suporter sekolah.
- Menunjukkan QR tiket saat berjalan melewati pintu gate masuk arena.
- Membuka halaman livescore berkala saat bekerja di kantor atau di perjalanan untuk memantau skor laga dan klasemen suporter.

---

### Persona 4: Petugas Meja / Scorer Lapangan (Technical Delegate)

![Persona Scorer](https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80)

| Atribut | Deskripsi |
|:--------|:----------|
| **Nama** | Riko Sanjaya |
| **Usia** | 27 tahun |
| **Profesi** | Wasit Lisensi Daerah / Petugas Pencatat Skor (Scorer) Meja Pertandingan |
| **Lokasi** | Berada langsung di meja pinggir lapangan venue turnamen |
| **Tingkat Kemahiran Teknologi** | Menengah (terbiasa dengan formulir online dan tablet/ponsel) |
| **Perangkat yang Digunakan** | Tablet Android 10 inci atau Smartphone (mode landscape/portrait) |

#### Tujuan (Goals)
- Mencatat gol, poin, set, dan pelanggaran (kartu kuning/merah) dengan satu ketukan tombol.
- Melakukan verifikasi check-in skuad pemain sebelum peluit kick-off dimulai.
- Mengunci hasil akhir pertandingan dan menghasilkan Berita Acara Pertandingan (BAP) digital.
- Menghindari kesalahan kalkulasi waktu dan skor di tengah tekanan teriakan penonton.

#### Rasa Frustrasi (Pain Points)
- Kertas skor basah terkena tumpahan air minum atau robek karena angin kencang di lapangan semi-terbuka.
- Waktu terbuang untuk menghitung manual akumulasi kartu turnamen sebelum laga dimulai.
- Manajer tim memprotes catatan skor yang ditulis dengan tulisan tangan buram.

#### Perilaku & Konteks Penggunaan
- Bertugas selama 6 sampai 8 jam berturut-turut di meja ofisial.
- Membutuhkan tampilan kontras tinggi yang jelas terbaca di bawah terik matahari atau lampu sorot malam hari.
- Membutuhkan input modal cepat (Quick Event Logger: Gol, Assist, Kartu Kuning, Kartu Merah, Pergantian Pemain).

---

## 2.3 Matriks Kebutuhan Fitur per Persona

Tabel berikut menunjukkan hak akses dan kebutuhan interaksi setiap persona terhadap 10 modul Sauma Arena:

| Modul Fitur | Penyelenggara (Andi) | Manajer Tim (Dina) | Penonton (Budi) | Scorer Lapangan (Riko) |
|:------------|:--------------------:|:------------------:|:---------------:|:----------------------:|
| **1. Registrasi & Dokumen** | Review & Verifikasi Penuh | Input Data & Upload Berkas | Melihat Daftar Peserta | Check-in Pemain Lapangan |
| **2. Tim & Skuad** | Validasi Roster & Official | Kelola Daftar Pemain & Posisi | Melihat Profil Tim & Skuad | Verifikasi Line-up Pertandingan |
| **3. Jadwal & Hasil** | Buat, Atur, & Publikasi | Pantau Jadwal Tim & Hasil | Lihat Jadwal & Notifikasi | Mulai Laga & Finalisasi Skor |
| **4. Live Score & Log Pertandingan** | Supervisi & Override | Pantau Status Laga Berjalan | Nonton Skor Real-time | Input Gol, Kartu, & Pergantian |
| **5. Klasemen & Tiebreaker** | Atur Aturan Poin & Tiebreaker | Pantau Posisi & Margin Poin | Lihat Update Klasemen | Menghasilkan Data Otomatis |
| **6. Bagan Gugur (Bracket)** | Generate & Atur Bagan | Pantau Lawan Berikutnya | Lihat Pohon Turnamen | Update Otomatis via Hasil Laga |
| **7. Statistik & Sanksi** | Kelola Aturan Akumulasi | Pantau Status Skorsing Pemain | Pantau Top Skor & MVP | Catat Pelanggaran & Kartu |
| **8. Tiket QR & Check-in** | Atur Kuota & Pantau Kedatangan | Beli Tiket Rombongan | Beli/Klaim & Simpan Tiket | Scan QR di Pintu Masuk |
| **9. Media, Galeri & Berita** | Publikasi Rilis & Dokumentasi | Akses Dokumentasi Tim | Lihat Foto & Highlight | - |
| **10. E-Sertifikat Digital** | Desain & Terbitkan Massal | Unduh Sertifikat Skuad | - | - |
| **11. Skor & Penilaian Suporter** | Kelola Parameter & Verifikasi Juri | Pantau Poin Suporter Tim | Lihat Tabel Klasemen Suporter | Input Form Penilaian Tribun |

---

## 2.4 Pemisahan Zona Akses: Admin Dashboard vs Publik Live Score

Sistem mengimplementasikan pemisahan hak dan pengalaman pengguna antara zona privat terproteksi dan zona terbuka:

### 1. Admin Dashboard (Akses Terproteksi Panitia)
- **Tujuan:** Pusat komando dan operasional seluruh siklus turnamen.
- **Pengguna:** Superadmin, Ketua Panitia (Andi), Technical Delegate, Scorer (Riko), Juri Suporter, dan Petugas Gate Scanner.
- **Otentikasi:** Wajib login dengan peran RBAC bertingkat (*Role-Based Access Control*).
- **Fitur Khusus:** Konfigurasi turnamen, verifikasi berkas tim, penyusunan jadwal bebas konflik, kontrol papan skor meja, validasi form penilaian suporter, pemindai QR tiket, dan pencetakan sertifikat.

### 2. Portal Publik & Live Score (Akses Bebas Tanpa Login)
- **Tujuan:** Wadah informasi dan interaksi terbuka bagi suporter, penonton umum, dan media.
- **Pengguna:** Penonton (Budi), Manajer Tim (Dina), Atlet, dan Masyarakat Luas.
- **Akses:** Bebas diakses tanpa perlu membuat akun atau login.
- **Struktur Tab Navigasi Publik:**
  1. `[Info]`: Pengumuman resmi, juknis regulasi turnamen, profil venue, dan sponsor.
  2. `[Tim Peserta]`: Roster pemain, foto, asal sekolah/klub, dan riwayat laga.
  3. `[Jadwal]`: Timeline pertandingan, status pertandingan (Upcoming, LIVE, Finished), dan skor akhir.
  4. `[Klasemen]`: Tabel klasemen grup dengan detail poin, selisih gol, dan indikator lolos.
  5. `[Bracket]`: Bagan babak gugur interaktif dengan propagasi pemenang real-time.
  6. `[Statistik]`: Papan peringkat top skor, top assist, dan catatan kartu sanksi.
  7. `[Skor Suporter]`: Tabel klasemen kompetisi suporter terbaik (*Best Supporter*) dengan rincian poin positif (+koreo, maskot, seragam, yel-yel, tiket) dan penalti minus (-kericuhan, lemparan, rasisme, barang terlarang).

---

## 2.5 Prinsip Empati Pengguna (User Empathy Principles)

1. **Jaringan Seluler Terbatas:** 70% pengguna mengakses sistem menggunakan koneksi 3G/4G di dalam gedung olahraga (GOR) yang beratap seng. Halaman publik dan scorer meja harus dapat dimuat di bawah 2 detik dengan aset terkompresi.
2. **Kelelahan Panitia:** Panitia bekerja maraton dari pagi hingga larut malam. Antarmuka admin harus memiliki navigasi yang minim klik, pesan konfirmasi yang jelas sebelum aksi destruktif, dan visual pembeda status yang tegas.
3. **Transparansi Menghilangkan Konflik:** Protes dari manajer tim atau suporter umumnya bersumber dari ketidakpastian. Menampilkan status dokumen, catatan waktu sanksi kartu, detail tiebreaker klasemen, dan rincian skor suporter secara terbuka akan meredam perselisihan di lapangan.
