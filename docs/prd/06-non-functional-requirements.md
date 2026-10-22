# 06. Kebutuhan Non-Fungsional (Non-Functional Requirements)

**Dokumen PRD: Bagian 6/7**  
**Produk:** Sauma Arena  
**Tanggal:** 19 Oktober 2026  
**Referensi:** [00-index.md](./00-index.md) | [04-functional-specs.md](./04-functional-specs.md)

---

## 6.1 Gambaran Umum

Kebutuhan Non-Fungsional (NFR) menetapkan standar kualitas, keandalan, keamanan, dan kinerja sistem yang harus dipenuhi oleh arsitektur perangkat lunak Sauma Arena. Standar ini disusun secara realistis untuk operasional turnamen di lapangan olahraga (GOR/stadion) yang kerap menghadapi keterbatasan infrastruktur jaringan seluler dan daya listrik.

---

## 6.2 Keamanan & Privasi Data (Security & Privacy)

### 6.2.1 Kepatuhan Perlindungan Data Pribadi (UU PDP No. 27/2022)
Turnamen antar-pelajar dan amatir melibatkan data sensitif atlet usia muda (foto kartu pelajar, NISN, NIK, ijazah, dan tanggal lahir).
- **Proteksi Akses Data:** Dokumen identitas (KTP, kartu pelajar, akta kelahiran) hanya dapat diakses oleh Panitia Terverifikasi dan Manajer Tim pemilik berkas. Dokumen disimpan pada penyimpanan objek privat berizin waktu terbatas (*pre-signed URLs* dengan masa aktif maksimal 15 menit).
- **Penyamaran Data Publik:** Halaman publik turnamen hanya menampilkan Nama Pemain, Nomor Punggung, Asal Sekolah/Klub, dan Foto Profil atlet. NIK, nomor telepon, dan NISN tidak pernah diekspos ke publik atau respon API publik.

### 6.2.2 Enkripsi
- **Data in Transit:** Wajib menggunakan protokol HTTPS dengan TLS 1.3 di seluruh endpoint.
- **Data at Rest:** Database utama dan arsip dokumen dienkripsi menggunakan standar AES-256.
- **Kata Sandi Akun:** Disimpan menggunakan fungsi hash adaptif dengan garam acak (Argon2id atau bcrypt dengan *work factor* minimal 12).

### 6.2.3 Kontrol Akses Berbasis Peran (Role-Based Access Control / RBAC)
Sistem menerapkan pemisahan hak akses ketat (*least privilege principle*):

| Peran (Role) | Hak Akses Utama |
|:-------------|:----------------|
| **Super Admin** | Akses penuh sistem, manajemen konfigurasi platform, dan audit log menyeluruh. |
| **Event Admin / Panitia** | Manajemen turnamen spesifik, verifikasi tim, pengaturan jadwal, dan penerbitan sertifikat. |
| **Scorer / Petugas Meja** | Akses terbatas ke kontrol laga yang ditugaskan di Admin Dashboard: input skor, kartu, dan verifikasi line-up. |
| **Juri Suporter / Pengawas Tribun** | Akses ke formulir penilaian suporter di Admin Dashboard: input checklist koreo, maskot, seragam, yel-yel, dan sanksi penalti. |
| **Gate Officer / Scanner** | Akses khusus pemindaian QR tiket masuk di pintu venue (terintegrasi otomatis ke poin tiket suporter). |
| **Manajer Tim** | Mengelola profil tim sendiri, mendaftarkan roster, mengunggah berkas, dan mengunduh sertifikat tim. |
| **Penonton / Publik** | Akses bebas (*read-only*) tanpa login ke portal publik: Info, Tim, Jadwal & Live Score, Klasemen, Bracket, Statistik, dan Skor Suporter. |

### 6.2.4 Keamanan Tiket QR & Anti-Brute Force
- Payload tiket menggunakan tanda tangan kriptografis HMAC-SHA256 untuk mencegah pemalsuan QR.
- Proteksi rate limiting pada endpoint pendaftaran dan klaim tiket (maksimal 10 request per menit per alamat IP) untuk mencegah penyerangan bot otomatis.

### 6.2.5 Isolasi Keamanan Admin Dashboard vs Portal Publik
- **Admin Dashboard (`/admin/*`):** Terisolasi penuh dengan autentikasi session berbasis HTTP-Only Secure Cookie, perlindungan CSRF token pada setiap mutasi POST/PUT/DELETE, dan larangan perayapan mesin pencari (`robots.txt: Disallow: /admin`).
- **Portal Publik (`/event/[slug]/*`):** Bersifat *stateless* dan *read-heavy*, dilindungi Cloudflare DDoS mitigation dan didukung lapisan Edge Caching sehingga ribuan penonton dapat memantau livescore dan skor suporter tanpa membebani database utama panitia.

---

## 6.3 Performa Sistem (Performance Targets)

Operasional di lapangan menuntut kecepatan respons tinggi agar tidak menghambat jalannya pertandingan.

| Parameter | Target Ambang Batas | Kondisi Uji |
|:----------|:--------------------|:------------|
| **Waktu Muat Halaman Publik (First Load)** | < 1.5 detik | Koneksi seluler 4G standar (7 Mbps unduh) |
| **Waktu Muat Ulang (Subsequent Visits)** | < 0.6 detik | Memanfaatkan browser caching & Service Worker |
| **Largest Contentful Paint (LCP)** | < 2.0 detik | Core Web Vitals standar Google |
| **Cumulative Layout Shift (CLS)** | < 0.05 | Tidak ada pergeseran tata letak saat data live termuat |
| **Latensi Sinkronisasi Live Score** | < 3.0 detik | Dari tombol skor ditekan petugas meja hingga layar penonton |
| **Latensi Distribusi Skor Suporter** | < 2.0 detik | Dari konfirmasi juri admin hingga pembaruan tabel publik |
| **Kecepatan Validasi Scanner QR** | < 0.8 detik | Pemindaian kamera hingga verifikasi database & +1 poin tiket |
| **Kalkulasi Klasemen Otomatis** | < 200 milidetik | Setelah status laga diubah menjadi `COMPLETED` |
| **Penerbitan E-Sertifikat Massal** | < 60 detik | Untuk 300 lembar sertifikat tim & suporter (background worker) |

---

## 6.4 Skalabilitas & Ketersediaan (Scalability & Availability)

### 6.4.1 Tingkat Ketersediaan (Availability)
- Menjamin tingkat ketersediaan (*uptime SLA*) minimal **99.9%** selama rentang hari turnamen aktif.
- Masa pemeliharaan sistem (*maintenance window*) hanya diizinkan di luar jam pertandingan (antara pukul 23:00 hingga 05:00 waktu setempat).

### 6.4.2 Kapasitas & Beban Puncak (Traffic Concurrency)
- Mampu melayani hingga **2.500 pengguna aktif serentak (concurrent users)** saat babak semifinal dan final berlangsung tanpa degradasi performa.
- Arsitektur backend bersifat *stateless* untuk memfasilitasi penambahan kapasitas instan (*horizontal auto-scaling*).
- Lapisan *Edge Caching* (CDN) diaktifkan untuk aset statis dan API publik jadwal/klasemen guna memotong 80% beban kueri langsung ke database utama.

---

## 6.5 Ketahanan Operasional Lapangan (Offline Resilience)

Sistem dirancang tangguh terhadap situasi darurat di arena olahraga:

1. **Penyimpanan Lokal Petugas Meja (Local Storage Fallback):**
   - Jika koneksi internet di meja pertandingan terputus tiba-tiba, antarmuka pencatatan skor tetap dapat digunakan normal.
   - Peristiwa gol, kartu, dan skor tersimpan di IndexedDB browser lokal petugas dengan stempel waktu perangkat.
   - Begitu koneksi internet kembali terdeteksi, data secara otomatis dikirimkan ke server (*background sync*).
2. **Pencadangan Data Berkala (Automated Backups):**
   - Pencadangan basis data otomatis dilakukan setiap 6 jam sekali selama turnamen berlangsung.
   - Titik pemulihan data (*Recovery Point Objective / RPO*) maksimal 15 menit jika terjadi insiden kegagalan sistem.
   - Waktu pemulihan layanan (*Recovery Time Objective / RTO*) maksimal 30 menit.

---

## 6.6 Kompatibilitas & Aksesibilitas (Compatibility & Accessibility)

### 6.6.1 Dukungan Peramban Web (Browser Support)
Sistem web Sauma Arena dapat diakses tanpa instalasi khusus pada seluruh peramban modern (versi 2 tahun terakhir):
- Google Chrome (Desktop & Android)
- Apple Safari (macOS & iOS)
- Mozilla Firefox
- Microsoft Edge

### 6.6.2 Responsivitas Tata Letak (Responsive Breakpoints)
- **Smartphone Layar Sempit (360px - 480px):** Tata letak optimal satu kolom untuk manajer tim, atlet, dan penonton tribun.
- **Tablet (768px - 1024px):** Tata letak dua kolom untuk petugas meja pencatat skor (*quick touch layout*).
- **Desktop / Laptop (1280px+):** Dasbor lebar dengan navigasi samping (*sidebar*) untuk kebutuhan admin menyusun jadwal dan bagan turnamen.

### 6.6.3 Aksesibilitas (WCAG 2.1 Level AA)
- Rasio kontras teks terhadap latar belakang minimal 4.5:1 untuk menjamin keterbacaan di bawah lampu sorot malam hari atau pantulan terik sinar matahari lapangan semi-terbuka.
- Area ketuk (*touch target*) untuk tombol operasional utama di smartphone berukuran minimal 44 x 44 piksel guna mencegah salah pencet saat jari berkeringat.
