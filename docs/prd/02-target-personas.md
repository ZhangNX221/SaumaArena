# 02. Peran Pengguna & Glosarium (Target Personas & Glossary)

**Dokumen PRD — Bagian 2/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Versi:** 1.0  

---

## 2.1 Peran Utama Pengguna

Sistem Sauma Arena mengklasifikasikan pengguna ke dalam 3 peran terdefinisi secara ketat:

| Peran | Login Diperlukan? | Deskripsi Tanggung Jawab |
|---|:---:|---|
| `admin` | **Ya** | Pengelola utama sistem: membuat kompetisi, mengonfigurasi aturan cabor, mengatur tim/pemain/venue, menugaskan perangkat pertandingan, mengunci dan memverifikasi hasil pertandingan resmi. |
| `official` | **Ya** | Panitia pelaksana teknis (wasit, juri, pencatat skor / scorekeeper, operator). Hanya memiliki akses kerja ke pertandingan yang ditugaskan kepadanya melalui konsol mobile. |
| **Publik** | **Tidak** | Penonton, atlet, manajer tim, jurnalis, dan masyarakat umum. Mengakses informasi publik secara instan tanpa perlu akun atau proses autentikasi. |

---

## 2.2 Matriks Hak Akses (Access Control Matrix)

Berikut adalah kewenangan akses untuk setiap operasi dalam platform:

| Operasi Sistem | Admin | Panitia (`official`) | Publik (Anon) |
|---|:---:|:---:|:---:|
| Kelola template aturan cabor & override aturan | ✅ | ❌ | ❌ |
| Kelola kompetisi, fase (stage), dan grup | ✅ | ❌ | ❌ |
| Kelola master data tim, pemain, dan venue | ✅ | ❌ | ❌ |
| Kelola akun panitia & penugasan perangkat pertandingan | ✅ | ❌ | ❌ |
| Buat dan ubah jadwal pertandingan | ✅ | ❌ | ❌ |
| Melihat pertandingan yang ditugaskan | ✅ | ✅ *(hanya laga tugasnya)* | ❌ |
| Konfirmasi lineup & nomor punggung tim | ✅ | ✅ *(laga tugasnya)* | ❌ |
| Input peristiwa pertandingan (skor, kartu, set, foul) | ✅ | ✅ *(laga tugasnya, status `live`/`break`)* | ❌ |
| Koreksi / void event (wajib alasan tertulis) | ✅ | ✅ *(sebelum status `finished`)* | ❌ |
| Tandai pertandingan selesai (`finished`) | ✅ | ✅ *(laga tugasnya)* | ❌ |
| Verifikasi hasil akhir & kunci laga (`verified`) | ✅ | ❌ | ❌ |
| Buka kunci hasil verifikasi (*unlock* dengan alasan) | ✅ *(wajib alasan)* | ❌ | ❌ |
| Akses audit log perubahan | ✅ | ❌ | ❌ |
| Lihat jadwal, live score, klasemen resmi, bagan, dan profil tim | ✅ | ✅ | ✅ *(data publik)* |
| Akses data pribadi sensitif (tanggal lahir, kontak) | ✅ | ❌ | ❌ *(diblokir via RLS)* |

---

## 2.3 Spesifikasi Tugas Panitia Lapangan (`match_officials.duty`)

Pada setiap pertandingan, admin dapat menugaskan satu atau beberapa panitia dengan spesialisasi tugas:

1. `referee` (Wasit Utama): Memimpin jalannya pertandingan di lapangan, mengawasi kepatuhan aturan, dan menyetujui ringkasan akhir laga.
2. `scorekeeper` (Pencatat Skor / Operator Meja): Bertanggung jawab atas pencatatan event digital real-time (gol, poin set, kartu kuning/merah, timeout, dan foul) via konsol mobile.
3. `judge` (Juri / Hakim Garis): Membantu wasit utama dalam pencatatan garis atau poin spesifik (misal bulutangkis/voli).
4. `assistant` (Asisten Wasit / Panitia Pembantu): Mengelola administrasi fisik, pengecekan kesiapan tim, dan kelengkapan dokumen lapangan.

*Catatan:* Pada implementasi P0, wasit utama (`referee`) dan pencatat skor (`scorekeeper`) keduanya diizinkan menginput event pada konsol pertandingan.

---

## 2.4 Glosarium Istilah Pertandingan

| Istilah | Definisi Teknis dalam Sauma Arena |
|---|---|
| **Competition** | Satu entitas turnamen, kejuaraan, atau liga untuk satu cabang olahraga tertentu (misal: "Turnamen Futsal Pelajar 2026"). |
| **Stage** | Fase kompetisi yang memiliki format pertandingan tertentu (misal: Babak Penyisihan Grup, Babak Gugur, Play-off). |
| **Participant / Team** | Peserta kompetisi generik, dapat berupa tim (sepakbola/futsal/voli/esport), individu (bulutangkis tunggal), atau pasangan (bulutangkis ganda). |
| **Match** | Satu sesi pertandingan resmi antara dua peserta yang memperebutkan skor/kemenangan. |
| **Period** | Bagian pertandingan berbasis durasi waktu (misal: Babak 1 dan Babak 2 pada sepakbola/futsal; Quarter 1–4 pada basket). |
| **Set / Game** | Bagian pertandingan berbasis capaian target poin (misal: Set 1–5 pada bola voli; Game 1–3 pada bulutangkis). |
| **Map** | Satu permainan individu dalam rangkaian seri kompetisi esport (misal: Game 1 pada seri Best-of-3). |
| **Event** | Peristiwa berurutan yang dicatat selama pertandingan (gol, kartu kuning, pelanggaran, poin, timeout, pergantian pemain). |
| **Sport Template** | Berkas konfigurasi JSON yang menentukan batas aturan, durasi, sistem kartu, dan model penilaian suatu cabor. |
| **Sport Module** | Kode TypeScript murni yang mengimplementasikan interface `SportModule` untuk mengeksekusi validasi aturan cabor. |
| **Verified** | Status pengesahan administratif tertinggi oleh Admin; menandakan pertandingan terkunci (`locked = true`) dan hasilnya sah dihitung ke klasemen. |
| **WO (Walkover)** | Kemenangan administratif yang diberikan kepada satu tim karena lawan tidak hadir, mengundurkan diri, atau melanggar regulasi kelayakan. |
