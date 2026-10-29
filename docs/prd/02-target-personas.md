# 02. Peran Pengguna & Glosarium (Target Personas & Glossary)

**Dokumen PRD — Bagian 2/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Edisi Turnamen:** Milad Matsanega Futsal Competition I (MMFC I) • MTsN 3 Blitar  
**Versi:** 2.0  

---

## 2.1 Peran Utama Pengguna (Target Personas)

Sistem Sauma Arena mengklasifikasikan pengguna ke dalam peran-peran terdefinisi secara ketat guna menjaga integritas data turnamen:

| Peran Sistem | Login? | Deskripsi & Tanggung Jawab Operasional |
|---|:---:|---|
| **Superadmin / Komisioner** | **Ya** | Pengelola tertinggi turnamen (misal: Komisioner MMFC I). Mengatur kompetisi, membekukan regulasi, memvalidasi berkas kontingen atlet, melakukan drawing bagan, override darurat, manajemen kuota tiket, dan backup sistem. |
| **Pengawas Pertandingan (PP)** | **Ya** | Perangkat netral yang mengawasi kepatuhan regulasi. Bertanggung jawab atas verifikasi dua tahap BAP wasit, peninjauan insiden khusus Komisi Disiplin (Komdis), dan pengesahan resmi klasemen. |
| **Wasit Lapangan (Wasit 1 & 2)** | **Ya** | Memimpin laga di lapangan, menetapkan pelanggaran, menerbitkan kartu kuning/merah, mengesahkan skor akhir, dan membubuhkan tanda tangan digital pada lembar BAP. |
| **Pencatat Meja (Scorekeeper)** | **Ya** | Mengoperasikan konsol tablet lapangan: menjalankan/menjeda stopwatch laga, mencatat menit gol dan pencetak gol, memantau foul akumulasi (5/5), time-out, dan bel arena. |
| **Juri Tribun Suporter** | **Ya** | Petugas khusus penilai suporter: mencatat skor kreativitas yel-yel, atribut, maskot, kebersihan tribun (+poin), serta menjatuhkan sanksi jika terjadi provokasi/flare (-poin). |
| **Petugas Gate Masuk** | **Ya** | Memindai kode QR e-tiket pengunjung di Gate Barat dan Gate Timur stadion, mencegah pemindaian ganda, serta mengakumulasikan poin tiket rombongan suporter madrasah. |
| **Official / Manajer Tim** | **Modal** | Pelatih atau perwakilan sekolah/madrasah yang mendaftarkan tim kontingen (10–12 atlet), mengunggah berkas NISN dan surat rekomendasi kepala madrasah. |
| **Publik & Suporter Tribun** | **Tidak** | Wali murid, siswa madrasah, dan penonton umum. Mengakses jadwal, live score (< 3 detik), klasemen, bagan gugur, profil tim, statistik sepatu emas, dan memesan e-tiket tanpa perlu registrasi akun. |

---

## 2.2 Matriks Hak Akses (Access Control Matrix)

| Operasi Sistem & Modul | Superadmin | Pengawas (PP) | Wasit & Meja | Juri Suporter | Petugas Gate | Official Tim | Publik (Anon) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Konfigurasi Cabor & Freeze Rules | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Verifikasi Berkas Atlet (NISN) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Drawing Bagan & Plotting Jadwal | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Kendali Stopwatch & Skor Laga | ✅ *(override)* | ❌ | ✅ *(tugasnya)* | ❌ | ❌ | ❌ | ❌ |
| Input Foul, Time-out & Kartu | ✅ *(override)* | ❌ | ✅ *(tugasnya)* | ❌ | ❌ | ❌ | ❌ |
| Form Penilaian Tribun Suporter | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Tanda Tangan Digital BAP | ❌ | ✅ *(Tahap 3)* | ✅ *(Tahap 1&2)*| ❌ | ❌ | ❌ | ❌ |
| Pengesahan Akhir BAP (Kunci) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Scanner Validasi E-Tiket Gate | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Form Registrasi Tim Kontingen | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ *(Form)* | ❌ |
| Pesan E-Tiket Masuk Stadion | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ *(Form)* |
| Lihat Live Score, Jadwal & Klasemen | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ *(Read-Only)* |
| Ekspor Laporan Resmi (PDF/Excel)| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 2.3 Glosarium Teknis & Istilah Turnamen (MMFC I)

| Istilah | Definisi Operasional dalam Sauma Arena |
|---|---|
| **MMFC I** | *Milad Matsanega Futsal Competition I*, turnamen futsal resmi tingkat SD/MI se-derajat di Blitar Raya yang diselenggarakan oleh MTsN 3 Blitar. |
| **Kontingen** | Delegasi olahraga dari satu sekolah/madrasah peserta yang terdiri atas 10–12 atlet pelajar, pelatih kepala, dan official. |
| **Running Clock** | Sistem waktu kotor selama 2 × 15 menit pada babak penyisihan grup; stopwatch terus berjalan kecuali ada arahan time-out resmi. |
| **Stop Clock** | Sistem waktu bersih pada babak semifinal dan grand final; stopwatch dijeda seketika setiap kali bola keluar lapangan atau terjadi insiden. |
| **Fouls 5/5** | Batas maksimal 5 pelanggaran tim per babak. Pelanggaran ke-6 dan seterusnya berbuah tendangan bebas langsung dari titik kedua (10 meter) tanpa pagar betis. |
| **Second Penalty Spot** | Titik penalti berjarak 10 meter dari gawang lawan yang diberikan otomatis setelah tim mencapai akumulasi 5 pelanggaran dalam 1 babak. |
| **Akumulasi 2 Kartu Kuning** | Pemain yang mengumpulkan 2 kartu kuning pada laga berbeda terkena sanksi larangan bermain 1 laga. Bila 2 KK terjadi pada laga yang sama, otomatis menjadi Kartu Merah (keluar lapangan). |
| **Kartu Merah Langsung (KKM)** | Sanksi pelanggaran keras; pemain diusir dari lapangan, tim bermain dengan 4 atlet selama 2 menit (atau sampai lawan mencetak gol), ditambah sanksi denda Komdis. |
| **BAP (Berita Acara Pertandingan)** | Lembar rekapitulasi sah pertandingan (skor, menit gol, kartu wasit, insiden) yang ditandatangani secara digital oleh Wasit 1, Wasit 2, dan Pengawas Pertandingan. |
| **Two-Stage Verification** | Alur verifikasi hasil dua tahap: Wasit menandatangani di lapangan (`finished`), kemudian Pengawas Pertandingan mengesahkan di panel admin (`verified`), yang memicu kalkulasi klasemen resmi. |
| **Poin Suporter (SP)** | Agregat penilaian kuantitatif suporter madrasah yang menggabungkan poin kehadiran tiket gate, kekompakan yel-yel, maskot, kebersihan tribun, serta dikurangi poin sanksi. |
| **Top Scorer / Sepatu Emas** | Penghargaan individu bagi atlet pencetak gol terbanyak sepanjang turnamen yang dihitung otomatis dari log event gol resmi. |
| **Gate Check-In** | Validasi kode QR tiket penonton di gerbang masuk stadion (Gate Barat untuk VIP/Atlet, Gate Timur untuk Suporter Rombongan & Umum) untuk mencegah pemindaian ganda. |
