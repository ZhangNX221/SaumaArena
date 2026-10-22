# 03. User Stories & Kriteria Penerimaan (Acceptance Criteria)

**Dokumen PRD: Bagian 3/7**  
**Produk:** Sauma Arena  
**Tanggal:** 19 Oktober 2026  
**Referensi:** [00-index.md](./00-index.md) | [02-target-personas.md](./02-target-personas.md)

---

## 3.1 Gambaran Umum

Dokumen ini mendokumentasikan spesifikasi kebutuhan pengguna dalam format User Story standar industri:
> *"Sebagai [Peran], Saya ingin [Tindakan/Kebutuhan], Sehingga [Nilai Manfaat]."*

Setiap user story dilengkapi dengan Kriteria Penerimaan (Acceptance Criteria / AC) yang dapat diuji secara terukur (testable), estimasi prioritas MoSCoW, serta dependensi modul terkait.

---

## 3.2 Modul 1: Registrasi & Verifikasi Peserta (REG)

| ID | User Story | Kriteria Penerimaan (Acceptance Criteria) | Prioritas |
|:---|:-----------|:------------------------------------------|:---------:|
| **REG-01** | **Pendaftaran Tim & Kategori**<br>Sebagai Manajer Tim, saya ingin mendaftarkan tim ke turnamen dan memilih kategori usia/cabor yang dibuka, sehingga tim saya resmi terdata sebagai calon peserta. | 1. Sistem menyediakan formulir pendaftaran: Nama Tim, Asal Instansi/Sekolah/Klub, Nama Manajer, Nomor WhatsApp, Email, dan Kategori Pertandingan.<br>2. Kuota pendaftaran ditampilkan secara real-time. Jika kuota penuh, sistem menampilkan status "Kuota Penuh" dan menonaktifkan submit.<br>3. Tim yang berhasil mendaftar menerima kode registrasi unik (contoh: `SA-2026-FUT-014`). | **Must Have** |
| **REG-02** | **Upload Dokumen Persyaratan & Kelayakan**<br>Sebagai Manajer Tim, saya ingin mengunggah berkas persyaratan (Kartu Pelajar/KTP, Pas Foto, Surat Rekomendasi), sehingga panitia dapat memverifikasi keabsahan pemain. | 1. Mendukung format berkas JPEG, PNG, dan PDF dengan ukuran maksimal 2 MB per file.<br>2. Formulir mewajibkan upload dokumen sesuai ketentuan yang diatur panitia (contoh: untuk turnamen antar-pelajar wajib NISN dan Kartu Pelajar).<br>3. Status dokumen ditandai jelas: "Belum Lengkap", "Menunggu Verifikasi", "Disetujui", atau "Ditolak". | **Must Have** |
| **REG-03** | **Konfirmasi Pembayaran Manual**<br>Sebagai Manajer Tim, saya ingin mengunggah bukti transfer biaya pendaftaran, sehingga panitia dapat mengonfirmasi slot tim saya. | 1. Sistem menampilkan nomor rekening resmi panitia, nama bank, dan nominal biaya pendaftaran.<br>2. Manajer dapat mengunggah foto bukti transfer beserta nama pemilik rekening pengirim.<br>3. Status pembayaran otomatis berubah menjadi "Menunggu Konfirmasi Pembayaran". | **Must Have** |
| **REG-04** | **Dashboard Verifikasi Panitia**<br>Sebagai Panitia, saya ingin meninjau berkas pendaftaran dan bukti pembayaran dalam satu dasbor terpadu, sehingga proses validasi dapat dilakukan cepat tanpa membuka spreadsheet terpisah. | 1. Panitia dapat melihat daftar seluruh pendaftar yang dilengkapi filter status: Semua, Menunggu Verifikasi, Terverifikasi, Ditolak.<br>2. Panitia memiliki tombol aksi "Setujui" atau "Tolak".<br>3. Jika ditolak, panitia wajib memilih/mengetik alasan penolakan (contoh: "Foto kartu pelajar buram, silakan upload ulang").<br>4. Notifikasi email dan pembaruan status terkirim otomatis ke manajer tim. | **Must Have** |
| **REG-05** | **Batas Waktu & Penutupan Pendaftaran**<br>Sebagai Panitia, saya ingin menetapkan tanggal dan jam penutupan pendaftaran, sehingga pendaftaran tertutup secara otomatis saat tenggat waktu berakhir. | 1. Panitia dapat mengatur tanggal dan jam batas akhir pendaftaran pada konfigurasi turnamen.<br>2. Sistem secara otomatis mengubah status registrasi menjadi "Ditutup" tepat pada waktu yang ditentukan.<br>3. Pengunjung yang mengakses formulir pendaftaran setelah penutupan melihat pengumuman bahwa pendaftaran telah berakhir. | **Should Have** |

---

## 3.3 Modul 2: Manajemen Tim & Skuad (TIM)

*Modul terinspirasi dari fitur roster Piala Gubernur NTT 2026 (FloEvent)*

| ID | User Story | Kriteria Penerimaan (Acceptance Criteria) | Prioritas |
|:---|:-----------|:------------------------------------------|:---------:|
| **TIM-01** | **Kelola Roster Skuad Pemain**<br>Sebagai Manajer Tim, saya ingin menambah, mengubah, dan menghapus daftar pemain dan official, sehingga daftar skuad sesuai dengan regulasi jumlah maksimal pemain. | 1. Manajer dapat mendaftarkan minimal 5 dan maksimal 15 pemain (konfigurabel per cabor).<br>2. Setiap pemain memiliki atribut: Nama Lengkap, Nomor Punggung, Posisi (Kiper/Anchor/Flank/Pivot dll), Tanggal Lahir/Usia, dan Foto Profil.<br>3. Sistem memvalidasi agar tidak ada nomor punggung ganda dalam satu tim.<br>4. Data official mencakup: Pelatih Kepala, Asisten Pelatih, Manajer, dan Tenaga Medis. | **Must Have** |
| **TIM-02** | **Kunci Roster (Roster Lock)**<br>Sebagai Panitia, saya ingin mengunci pengeditan roster setelah technical meeting, sehingga tidak ada tim yang mengganti pemain tanpa izin di tengah turnamen. | 1. Panitia memiliki toggle "Kunci Roster Pemain" di dasbor turnamen.<br>2. Saat toggle aktif, manajer tim tidak dapat menambah, menghapus, atau mengubah identitas pemain.<br>3. Permintaan perubahan darurat (cedera berat) hanya dapat disetujui melalui izin admin utama. | **Must Have** |
| **TIM-03** | **Profil Publik Tim & Statistik Skuad**<br>Sebagai Penonton, saya ingin melihat halaman profil tim beserta daftar pemain dan fotonya, sehingga saya mengenal pemain favorit yang bertanding. | 1. Halaman profil tim memuat: Nama Tim, Logo, Asal Sekolah/Klub, Nama Pelatih, dan daftar seluruh anggota skuad beserta nomor punggung.<br>2. Tersedia riwayat pertandingan tim yang telah selesai dan jadwal laga berikutnya.<br>3. Menampilkan ringkasan statistik tim (jumlah gol memasukkan, kemasukan, kartu). | **Should Have** |
| **TIM-04** | **Pemeriksaan Keabsahan di Meja Lapangan**<br>Sebagai Petugas Lapangan, saya ingin melihat kartu identitas digital setiap pemain di layar tablet, sehingga saya dapat memverifikasi fisik atlet sebelum bertanding. | 1. Menampilkan daftar skuad tim per laga lengkap dengan foto wajah dan nomor punggung.<br>2. Petugas dapat menandai checklist kehadiran pemain yang turun ke lapangan.<br>3. Sistem memberi peringatan merah tebal jika pemain dalam status "Skorsing Akumulasi Kartu". | **Must Have** |

---

## 3.4 Modul 3: Manajemen Jadwal & Venue (SCH)

| ID | User Story | Kriteria Penerimaan (Acceptance Criteria) | Prioritas |
|:---|:-----------|:------------------------------------------|:---------:|
| **SCH-01** | **Pembuatan Slot Jadwal Pertandingan**<br>Sebagai Panitia, saya ingin membuat jadwal pertandingan dengan memilih tim bertanding, tanggal, jam kick-off, dan lapangan/venue, sehingga jadwal tersusun rapi. | 1. Panitia dapat memilih Tim A vs Tim B dari daftar tim yang telah diverifikasi.<br>2. Menentukan venue/lapangan (contoh: Lapangan 1 GOR Oepoi, Lapangan 2).<br>3. Menentukan durasi estimasi laga (contoh: 2 x 20 menit + jeda 10 menit). | **Must Have** |
| **SCH-02** | **Deteksi Otomatis Jadwal Bentrok (Conflict Detector)**<br>Sebagai Panitia, saya ingin sistem memperingatkan jika ada venue atau tim yang dijadwalkan pada waktu yang sama, sehingga tidak terjadi kekacauan lapangan. | 1. Sistem memblokir atau memberi peringatan jika lapangan yang sama telah terisi pada rentang waktu yang beririsan.<br>2. Sistem memberi peringatan jika salah satu tim memiliki jadwal lain dalam jarak waktu istirahat kurang dari 2 jam.<br>3. Dialog peringatan menampilkan rincian bentrok dengan jelas. | **Must Have** |
| **SCH-03** | **Publikasi & Filter Jadwal Publik**<br>Sebagai Penonton dan Peserta, saya ingin melihat jadwal pertandingan yang dapat difilter berdasarkan tanggal, lapangan, atau tim, sehingga saya mudah mencari laga yang ingin saya tonton. | 1. Jadwal tersaji dalam format timeline harian dan kartu pertandingan.<br>2. Filter responsif: Berdasarkan Tanggal, Kategori/Grup, dan Nama Tim.<br>3. Label status pertandingan jelas: "Akan Datang", "Sedang Berlangsung (LIVE)", "Selesai", atau "Ditunda". | **Must Have** |
| **SCH-04** | **Reschedule & Riwayat Perubahan Jadwal**<br>Sebagai Panitia, saya ingin mengubah jadwal pertandingan yang tertunda karena hujan/faktor darurat dan mencatat alasannya, sehingga jadwal selalu mutakhir. | 1. Panitia dapat memperbarui jam, tanggal, atau venue pertandingan.<br>2. Panitia wajib memasukkan catatan alasan perubahan (contoh: "Hujan deras, lapangan basah").<br>3. Halaman publik menampilkan label "Jadwal Diperbarui" beserta jam revisi terakhir. | **Must Have** |
| **SCH-05** | **Notifikasi Pengingat Laga**<br>Sebagai Manajer Tim, saya ingin menerima email pengingat H-1 dan H-2 jam sebelum laga dimulai, sehingga tim saya tidak terlambat hadir di arena. | 1. Sistem mengirimkan ringkasan jadwal pertandingan H-1 via email terdaftar.<br>2. Pesan mencakup informasi: Lawan, Lapangan, Jam Kick-off, dan Warna Jersey utama/cadangan. | **Should Have** |

---

## 3.5 Modul 4: Kontrol Pertandingan & Live Score (MSC)

| ID | User Story | Kriteria Penerimaan (Acceptance Criteria) | Prioritas |
|:---|:-----------|:------------------------------------------|:---------:|
| **MSC-01** | **Pembaruan Skor Pertandingan Cepat**<br>Sebagai Petugas Meja, saya ingin menambah dan mengurangi skor dengan tombol satu ketukan (+ / -), sehingga papan skor online terbarui seketika. | 1. Antarmuka sentuh besar dengan tombol `+1` dan `-1` untuk Skor Tim A dan Skor Tim B.<br>2. Tombol "Mulai Babak", "Jeda Babak", dan "Selesai Laga".<br>3. Pembaruan skor tersinkronisasi ke penonton online dalam waktu kurang dari 3 detik. | **Must Have** |
| **MSC-02** | **Pencatatan Peristiwa Pertandingan (Match Event Log)**<br>Sebagai Petugas Meja, saya ingin mencatat pencetak gol, pemberi assist, dan penerima kartu pelanggaran, sehingga statistik pertandingan terekam akurat. | 1. Modal pencatatan cepat: Pilih Jenis Event (Gol, Kartu Kuning, Kartu Merah, Gol Bunuh Diri).<br>2. Pilih nama pemain dari dropdown roster tim terkait.<br>3. Catat menit terjadinya peristiwa.<br>4. Linimasa peristiwa muncul secara kronologis pada ringkasan pertandingan. | **Must Have** |
| **MSC-03** | **Adu Penalti & Babak Tambahan**<br>Sebagai Petugas Meja, saya ingin mencatat sesi adu penalti jika pertandingan babak gugur berakhir imbang, sehingga pemenang sah ditentukan sistem. | 1. Jika skor akhir imbang pada laga knockout, aktifkan mode adu penalti.<br>2. Pencatatan hasil tendangan tiap penendang: Gol (Hijau) atau Gagal (Merah).<br>3. Skor akhir menampilkan akumulasi skor waktu normal + skor penalti (contoh: 2-2, Penalti: 4-3). | **Must Have** |
| **MSC-04** | **Berita Acara Pertandingan (BAP) Digital**<br>Sebagai Panitia dan Wasit, saya ingin menandatangani dan mengunci hasil akhir pertandingan secara digital, sehingga hasil tidak dapat digugat setelah laga usai. | 1. Sistem menghasilkan ringkasan BAP digital: Skor Akhir, Pencetak Gol, Kartu, Nama Wasit, dan Catatan Khusus.<br>2. Status laga berubah menjadi "Final / Verified".<br>3. Data skor yang telah final otomatis memperbarui klasemen atau bagan gugur. | **Should Have** |

---

## 3.6 Modul 5: Klasemen & Perhitungan Poin (STD)

| ID | User Story | Kriteria Penerimaan (Acceptance Criteria) | Prioritas |
|:---|:-----------|:------------------------------------------|:---------:|
| **STD-01** | **Kalkulasi Klasemen Otomatis**<br>Sebagai Penonton dan Peserta, saya ingin melihat tabel klasemen grup yang terbarui otomatis setiap kali pertandingan selesai, sehingga posisi tim langsung diketahui. | 1. Tabel memuat kolom standar: Posisi, Nama Tim, Main (M), Menang (Mn), Seri (S), Kalah (K), Memasukkan (GM), Kemasukan (GK), Selisih Gol (SG), dan Poin (P).<br>2. Aturan poin default: Menang = 3 poin, Seri = 1 poin, Kalah = 0 poin (bisa disesuaikan jika turnamen voli/futsal memiliki aturan poin berbeda).<br>3. Klasemen terhitung otomatis tanpa perlu penekanan tombol manual oleh admin. | **Must Have** |
| **STD-02** | **Konfigurasi Aturan Tiebreaker Bertingkat**<br>Sebagai Panitia, saya ingin menentukan urutan penentu peringkat jika dua tim atau lebih memiliki poin yang sama, sehingga urutan klasemen adil dan transparan. | 1. Panitia dapat mengatur urutan prioritas tiebreaker:<br>&nbsp;&nbsp;a. Head-to-Head (H2H) antar tim terkait.<br>&nbsp;&nbsp;b. Selisih Gol (SG) keseluruhan.<br>&nbsp;&nbsp;c. Produktivitas Gol Memasukkan (GM).<br>&nbsp;&nbsp;d. Poin Fair Play (jumlah kartu paling sedikit).<br>&nbsp;&nbsp;e. Undian koin.<br>2. Terdapat tooltip/catatan penjelasan di tabel klasemen saat aturan tiebreaker diberlakukan. | **Must Have** |
| **STD-03** | **Indikator Lolos Babak Gugur**<br>Sebagai Penonton dan Peserta, saya ingin melihat garis batas dan warna pembeda tim yang berhak lolos ke babak perempat-final/semifinal, sehingga persaingan terlihat jelas. | 1. Baris peringkat 1 dan 2 diberi penanda warna khusus (contoh: aksen hijau dengan label "Lolos ke 8 Besar").<br>2. Baris tim yang dipastikan gugur diberi penanda redup.<br>3. Tim yang lolos otomatis dipetakan ke bagan fase gugur sesuai skema turnamen. | **Must Have** |

---

## 3.7 Modul 6: Bagan Gugur / Bracket Interaktif (BRK)

| ID | User Story | Kriteria Penerimaan (Acceptance Criteria) | Prioritas |
|:---|:-----------|:------------------------------------------|:---------:|
| **BRK-01** | **Pembuatan Bagan Single Elimination**<br>Sebagai Panitia, saya ingin membuat bagan sistem gugur otomatis untuk 8, 16, atau 32 tim, sehingga skema babak gugur langsung terbentuk rapi. | 1. Mendukung struktur piramida dari Babak 32 Besar, 16 Besar, Perempat Final, Semifinal, hingga Final (termasuk perebutan Juara 3).<br>2. Mendukung penempatan bye jika jumlah tim tidak genap pangkat dua (contoh: 12 tim).<br>3. Tampilan visual diagram pohon responsif dengan garis penghubung antar-babak. | **Must Have** |
| **BRK-02** | **Propagasi Otomatis Pemenang Laga**<br>Sebagai Panitia dan Penonton, saya ingin pemenang pertandingan langsung berpindah ke slot babak berikutnya di bagan secara otomatis, sehingga tidak perlu menggeser manual. | 1. Saat status laga ditandai "Final" oleh scorer, nama tim pemenang otomatis mengisi slot babak selanjutnya.<br>2. Skor laga sebelumnya ditampilkan kecil di samping nama tim pada kartu bracket.<br>3. Tim yang kalah otomatis ditandai garis coret atau warna abu-abu. | **Must Have** |
| **BRK-03** | **Mode Seeding Fleksibel (Acak atau Skema Grup)**<br>Sebagai Panitia, saya ingin memilih metode penempatan tim pada bagan (undian acak atau Juara Grup A vs Runner-up Grup B), sehingga bagan sesuai dengan petunjuk teknis. | 1. Pilihan metode: "Manual Slotting", "Random Draw (Undian Acak)", atau "Aturan Grup Terhubung".<br>2. Pada mode aturan grup, slot secara otomatis terisi pemenang klasemen masing-masing grup. | **Must Have** |
| **BRK-04** | **Dukungan Double Elimination & Bagan Interaktif**<br>Sebagai Panitia turnamen e-sports atau badminton, saya ingin menyediakan bagan Double Elimination (Upper Bracket & Lower Bracket), sehingga turnamen yang memakai sistem gugur ganda dapat terfasilitasi. | 1. Visualisasi terbagi dua jalur: Winners Bracket dan Losers Bracket.<br>2. Tim yang kalah di Winners Bracket otomatis turun ke slot Losers Bracket yang sesuai.<br>3. Dukungan pan & zoom interaktif pada tampilan layar ponsel. | **Should Have** |

---

## 3.8 Modul 7: Statistik Pemain & Sanksi Otomatis (STAT)

*Modul terinspirasi dari kebutuhan disiplin turnamen Piala Gubernur NTT 2026 (FloEvent)*

| ID | User Story | Kriteria Penerimaan (Acceptance Criteria) | Prioritas |
|:---|:-----------|:------------------------------------------|:---------:|
| **STAT-01** | **Papan Peringkat Top Skor & Assist**<br>Sebagai Penonton dan Atlet, saya ingin melihat tabel daftar pencetak gol terbanyak dari seluruh pertandingan, sehingga performa pemain terbaik diapresiasi. | 1. Tabel memuat: Peringkat, Foto, Nama Pemain, Nama Tim, dan Jumlah Gol.<br>2. Jika jumlah gol sama, peringkat ditentukan oleh jumlah menit bermain yang lebih sedikit atau jumlah assist.<br>3. Data diperbarui seketika setelah setiap laga disahkan. | **Should Have** |
| **STAT-02** | **Pencatatan Akumulasi Kartu & Pelanggaran**<br>Sebagai Panitia, saya ingin sistem menghitung akumulasi kartu kuning dan merah per pemain secara otomatis, sehingga rekapitulasi sanksi tidak terlewat. | 1. Menampilkan daftar seluruh pemain yang mengantongi kartu kuning dan merah.<br>2. Menghitung jumlah akumulasi kartu kuning lintas pertandingan dalam satu turnamen. | **Must Have** |
| **STAT-03** | **Sanksi Otomatis Skorsing Pertandingan**<br>Sebagai Panitia dan Petugas Meja, saya ingin sistem menandai pemain yang terkena skorsing 1 pertandingan akibat 2 kartu kuning atau 1 kartu merah langsung, sehingga pemain tidak sah dilarang bermain. | 1. Aturan sanksi konfigurabel (default: 2 Kartu Kuning pada laga berbeda = Skorsing 1 Laga Berikutnya; 1 Kartu Merah Langsung = Skorsing 1 Laga Berikutnya).<br>2. Sistem memblokir nama pemain yang terkena skorsing pada pemilihan line-up laga terkait.<br>3. Terdapat badge merah "SKORSING" di samping nama pemain pada kartu laga dan profil tim. | **Must Have** |
| **STAT-04** | **Penetapan Pemain Terbaik (Best Player / MVP)**<br>Sebagai Panitia, saya ingin menetapkan dan mempublikasikan Pemain Terbaik, Kiper Terbaik, dan Tim Fair Play di akhir turnamen, sehingga penghargaan dapat diumumkan resmi. | 1. Form penentuan penghargaan turnamen: Best Player, Best Goalkeeper, Top Scorer, dan Fair Play Team.<br>2. Pemenang penghargaan ditampilkan di banner khusus pada halaman publik turnamen. | **Should Have** |

---

## 3.9 Modul 8: Tiket QR & Check-in Penonton (TIK)

| ID | User Story | Kriteria Penerimaan (Acceptance Criteria) | Prioritas |
|:---|:-----------|:------------------------------------------|:---------:|
| **TIK-01** | **Klaim Tiket Digital Penonton**<br>Sebagai Penonton, saya ingin memesan atau mengklaim tiket masuk digital gratis/berbayar dengan mengisi nama dan nomor WhatsApp, sehingga saya memiliki tiket resmi di ponsel. | 1. Formulir pemesanan cepat: Nama Lengkap, Nomor HP/WhatsApp, Email, dan Jumlah Tiket.<br>2. Kuota tiket per hari/kategori pertandingan dibatasi sesuai kapasitas venue.<br>3. Setelah konfirmasi, sistem menerbitkan E-Tiket berformat kartu digital dengan QR Code unik. | **Must Have** |
| **TIK-02** | **Tiket Kolektif Rombongan / Suporter Sekolah**<br>Sebagai Koordinator Suporter Sekolah, saya ingin memesan tiket rombongan (10-50 tiket sekaligus), sehingga suporter sekolah kami terdata resmi dan dapat masuk bersama. | 1. Pilihan pemesanan tipe "Rombongan / Suporter".<br>2. Input nama instansi/sekolah dan nama koordinator penanggung jawab.<br>3. Menghasilkan Master QR Code untuk rombongan atau paket kode QR individu dalam 1 file PDF. | **Could Have** |
| **TIK-03** | **Scanner QR Validasi Pintu Masuk (Gate Scanner)**<br>Sebagai Panitia Pintu Masuk, saya ingin memindai QR code tiket pengunjung menggunakan kamera smartphone, sehingga proses masuk cepat dan bebas tiket palsu. | 1. Scanner berbasis web browser (memanfaatkan API kamera ponsel tanpa perlu instal aplikasi Android/iOS).<br>2. Kecepatan verifikasi scan di bawah 1 detik per tiket.<br>3. Layar scanner memberi umpan balik visual dan audio:<br>&nbsp;&nbsp;a. Hijau & bunyi "Beep": Tiket Valid, nama pengunjung ditampilkan.<br>&nbsp;&nbsp;b. Merah & getar: Tiket Sudah Digunakan sebelumnya (menampilkan jam check-in awal).<br>&nbsp;&nbsp;c. Merah: Tiket Tidak Dikenal / Kadaluarsa. | **Must Have** |
| **TIK-04** | **Dasbor Okupansi & Kehadiran Penonton**<br>Sebagai Panitia Utama, saya ingin melihat jumlah penonton yang sudah masuk venue secara real-time, sehingga kami dapat mengendalikan kapasitas keamanan gedung. | 1. Grafik meteran okupansi: Jumlah tiket diterbitkan vs Jumlah tiket yang sudah di-scan.<br>2. Peringatan dini jika okupansi venue telah mencapai 90% dari batas aman. | **Should Have** |

---

## 3.10 Modul 9: Media, Galeri & Berita Turnamen (MED)

*Modul terinspirasi dari media center FloEvent Piala Gubernur NTT 2026*

| ID | User Story | Kriteria Penerimaan (Acceptance Criteria) | Prioritas |
|:---|:-----------|:------------------------------------------|:---------:|
| **MED-01** | **Publikasi Pengumuman & Berita Resmi**<br>Sebagai Panitia, saya ingin mempublikasikan pengumuman penting, regulasi turnamen (PDF), dan rilis berita terkini, sehingga semua peserta membaca informasi resmi satu pintu. | 1. Editor berita sederhana untuk mengunggah judul, tanggal, isi artikel, dan lampiran PDF (Juklak/Juknis).<br>2. Banner pengumuman penting (urgent notice) dapat disematkan di bagian atas halaman publik turnamen. | **Should Have** |
| **MED-02** | **Galeri Dokumentasi Pertandingan**<br>Sebagai Penonton dan Peserta, saya ingin melihat foto-foto aksi pertandingan per hari atau per pertandingan, sehingga momen pertandingan dapat diunduh dan dibagikan ke media sosial. | 1. Panitia dapat mengunggah album foto dengan tag pertandingan atau tanggal tertentu.<br>2. Fitur pratinjau foto resolusi cepat dan tombol "Unduh Foto Resolusi Tinggi".<br>3. Tombol share tautan langsung ke WhatsApp, Instagram, dan Facebook. | **Could Have** |
| **MED-03** | **Tautan Video Highlight & Siaran Laga**<br>Sebagai Penonton yang tidak sempat hadir, saya ingin menonton video ringkasan gol atau rekaman siaran pertandingan, sehingga tidak ketinggalan momen terbaik. | 1. Dukungan sematan tautan video (YouTube embed atau link video eksternal).<br>2. Kartu pertandingan yang telah selesai menampilkan ikon video jika rekaman tersedia. | **Could Have** |

---

## 3.11 Modul 10: E-Sertifikat Digital (SER)

| ID | User Story | Kriteria Penerimaan (Acceptance Criteria) | Prioritas |
|:---|:-----------|:------------------------------------------|:---------:|
| **SER-01** | **Generator Sertifikat Massal Otomatis**<br>Sebagai Panitia, saya ingin sistem membuatkan e-sertifikat untuk seluruh atlet, official, juara, dan wasit secara otomatis dengan satu kali klik, sehingga panitia tidak perlu mengetik nama satu per satu. | 1. Template bawaan yang elegan untuk kategori: Juara 1, Juara 2, Juara 3, Peserta Resmi, Official Tim, dan Best Player.<br>2. Data Nama Atlet, Asal Tim/Sekolah, dan Gelar Juara otomatis terisi dari database turnamen.<br>3. Setiap sertifikat memiliki Nomor Unik Registrasi Sertifikat (contoh: `CERT-SA2026-FUT-0089`). | **Must Have** |
| **SER-02** | **QR Code Verifikasi Keaslian Sertifikat**<br>Sebagai Instansi Sekolah atau Penyelenggara Beasiswa, saya ingin memindai QR code pada lembar sertifikat fisik/digital, sehingga saya dapat memvalidasi keaslian prestasi siswa tanpa ragu. | 1. Setiap sertifikat memuat QR code verifikasi di sudut bawah lembar dokumen.<br>2. Saat QR discan, mengarah ke URL publik resmi Sauma Arena (`saumaarena.id/verify/[cert_id]`).<br>3. Halaman verifikasi menampilkan nama penerima, tim, nama turnamen, tanggal, dan tanda tangan digital panitia. | **Must Have** |
| **SER-03** | **Unduh Mandiri PDF oleh Peserta**<br>Sebagai Atlet atau Manajer Tim, saya ingin mengunduh sertifikat digital seluruh skuad saya dalam format PDF siap cetak, sehingga dapat segera kami cetak atau arsipkan. | 1. Tombol "Unduh E-Sertifikat" aktif di dasbor manajer setelah turnamen resmi ditutup oleh panitia.<br>2. Pilihan unduh per individu pemain atau unduh sekaligus seluruh tim dalam format ZIP / PDF gabungan.<br>3. Ukuran file PDF teroptimasi untuk cetak ukuran A4 (300 DPI vector text). | **Must Have** |

---

## 3.12 Modul 11: Skor & Penilaian Suporter (SUP)

*Modul kompetisi "Best Supporter" untuk turnamen pelajar dan komunitas (berdasarkan format kompetisi tribun sekolah)*

| ID | User Story | Kriteria Penerimaan (Acceptance Criteria) | Prioritas |
|:---|:-----------|:------------------------------------------|:---------:|
| **SUP-01** | **Formulir Input Penilaian Suporter di Admin Dashboard**<br>Sebagai Juri Suporter / Panitia di Admin Dashboard, saya ingin menginput poin penilaian kreativitas dan pelanggaran suporter tiap sekolah per laga, sehingga nilai suporter tercatat resmi. | 1. Formulir penilaian khusus di Admin Dashboard (`/admin/tournaments/[id]/supporter-scoring`).<br>2. Pilihan tim/sekolah yang bertanding pada laga terkait.<br>3. **Daftar Checklist Poin Positif (+):**<br>&nbsp;&nbsp;• Membentang Koreografi: **+25 Poin**<br>&nbsp;&nbsp;• Membawa Maskot Sekolah: **+20 Poin**<br>&nbsp;&nbsp;• Menggunakan Seragam Supporter: **+15 Poin**<br>&nbsp;&nbsp;• Menyanyikan Yel-yel Minimal 3: **+10 Poin**<br>4. **Daftar Checklist Penalti Pelanggaran (-):**<br>&nbsp;&nbsp;• Membuat Kericuhan, Kekerasan dll: **-50 Poin**<br>&nbsp;&nbsp;• Melempar Benda ke Dalam Lapangan: **-25 Poin**<br>&nbsp;&nbsp;• Melakukan Rasis / Provokasi: **-15 Poin**<br>&nbsp;&nbsp;• Menyelundupkan Barang yang Dilarang: **-5 Poin**<br>5. Input catatan peristiwa khusus dan bukti dokumentasi foto/laporan wasit.<br>6. Tombol "Simpan & Publikasikan Nilai Laga". | **Must Have** |
| **SUP-02** | **Kalkulasi Otomatis Poin Tiket Suporter**<br>Sebagai Sistem, saya ingin mengakumulasikan +1 poin untuk setiap tiket penonton sekolah terkait yang berhasil di-scan di gate masuk, sehingga partisipasi massa suporter otomatis terhitung adil. | 1. Setiap tiket penonton yang terhubung dengan tim sekolah terkait dan berstatus `CHECKED_IN` di gate pintu masuk otomatis menyumbang **+1 Poin per Tiket**.<br>2. Akumulasi poin tiket terintegrasi secara dinamis dengan modul tiket QR tanpa memerlukan input manual juri.<br>3. Data diverifikasi dengan batas kapasitas maksimal tribun yang dialokasikan untuk sekolah tersebut. | **Must Have** |
| **SUP-03** | **Tabel Klasemen Skor Suporter di Halaman Live Score Publik**<br>Sebagai Penonton dan Suporter, saya ingin melihat tabel klasemen skor suporter beserta rincian poin di halaman publik (Tab Skor Suporter), sehingga persaingan suporter terbaik transparan. | 1. Tersedia tab khusus `[Skor Suporter]` pada bilah navigasi publik bersama tab Info, Tim, Jadwal, Klasemen, Bracket, dan Statistik.<br>2. Tabel menyajikan kolom:<br>&nbsp;&nbsp;• Peringkat (*Rank*)<br>&nbsp;&nbsp;• Logo & Nama Sekolah / Komunitas Suporter<br>&nbsp;&nbsp;• Total Poin Kreativitas (+Koreo, Maskot, Seragam, Yel-yel)<br>&nbsp;&nbsp;• Total Poin Tiket Penonton (+1/tiket)<br>&nbsp;&nbsp;• Total Penalti Pelanggaran (-Kericuhan, Lempar Benda, Rasis, Selundup Barang)<br>&nbsp;&nbsp;• **Total Skor Akhir** (diberi penanda warna tegas)<br>3. Modal rincian (*detail breakdown*) dapat dibuka per sekolah untuk melihat riwayat penilaian di setiap laga yang dihadiri.<br>4. Pembaruan data terjadi secara real-time saat juri admin menyimpan penilaian. | **Must Have** |
| **SUP-04** | **Penganugerahan & E-Sertifikat Juara Best Supporter**<br>Sebagai Panitia, saya ingin menetapkan Juara 1, 2, dan 3 Best Supporter serta mencetak sertifikat penghargaan resmi untuk sekolah pemenang, sehingga apresiasi suporter terlegitimasi. | 1. Sistem mengunci klasemen suporter saat turnamen berakhir.<br>2. Menetapkan status "Pemenang Best Supporter" pada 3 sekolah dengan poin tertinggi.<br>3. Sistem otomatis menghasilkan E-Sertifikat Ber-QR khusus kategori "Best Supporter" yang dapat diunduh oleh koordinator suporter sekolah. | **Should Have** |
