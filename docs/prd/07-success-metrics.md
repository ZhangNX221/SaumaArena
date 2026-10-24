# 07. Roadmap Pengembangan, Pengujian & Definition of Done

**Dokumen PRD — Bagian 7/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Versi:** 1.0  

---

## 7.1 Roadmap Pengembangan & Kriteria Keberhasilan (Acceptance Criteria)

Pengembangan wajib dijalankan secara berurutan **per fase**. Dilarang melompat fase sebelum seluruh kriteria penerimaan dan pengujian pada fase sebelumnya lulus 100%.

### Fase 0: Fondasi Sistem
- **Lingkup:** Inisialisasi arsitektur repository, Next.js App Router, Tailwind CSS, skema PostgreSQL Supabase, konfigurasi autentikasi peran (`admin` dan `official`), middleware proteksi rute, kebijakan RLS dasar, dokumentasi [11-decisions.md](./11-decisions.md), serta pipeline CI untuk lint dan testing.
- **Kriteria Selesai (Acceptance Criteria):**
  - [ ] Admin dan Panitia dapat login; Publik dapat membuka halaman publik `/` tanpa login.
  - [ ] Rute `/admin/*` menolak akses pengguna non-admin (panitia dan anonim).
  - [ ] Pengujian RLS berhasil: pengguna anonim tidak dapat membaca kolom sensitif; panitia tidak dapat menginput event untuk laga yang bukan penugasannya.
  - [ ] Perintah `npm run lint` dan `npm test` lulus tanpa error (0 error).

---

### Fase 1: Inti Aplikasi + Modul Sepakbola (End-to-End Pertama)
- **Lingkup:** Pembangunan `core/types`, `core/registry`, `core/events`, dan `core/statemachine`; implementasi modul **football** (`timed_goals`) di balik interface `SportModule`; CRUD kompetisi, tim, pemain, venue, dan jadwal manual; konsol panitia sepakbola; live score publik; verifikasi hasil admin; serta kalkulasi klasemen round robin.
- **Kriteria Selesai (Acceptance Criteria):**
  - [ ] Alur operasional lengkap berjalan mulus dari awal hingga akhir: Admin membuat kompetisi $\rightarrow$ input roster tim $\rightarrow$ membuat jadwal $\rightarrow$ menugaskan panitia $\rightarrow$ panitia konfirmasi lineup, input gol/kartu/pergantian, tandai selesai $\rightarrow$ Admin memverifikasi hasil $\rightarrow$ poin klasemen publik otomatis terbarui.
  - [ ] Skor publik terupdate secara real-time (< 3 detik).
  - [ ] Seluruh aturan validasi sepakbola memiliki unit test murni dan lulus.
  - [ ] Pembatalan (void) event berhasil menghitung ulang skor secara akurat dan mencatat audit log.
  - [ ] Pertandingan yang sudah berstatus `verified` menolak penambahan event baru.

---

### Fase 2: Cabang Kedua dengan Model Skor Berbeda (Bulutangkis)
- **Lingkup:** Implementasi modul **badminton** berbasis model skor `rally_set`. Menguji dan merefaktor kelemahan abstraksi pada kode inti (`core`), menjamin tidak ada kebocoran aturan cabor di luar folder `/sports/badminton/`.
- **Kriteria Selesai (Acceptance Criteria):**
  - [ ] Bulutangkis berjalan sempurna melalui engine core yang sama **tanpa ada satupun percabangan `if (sport === ...)` di core**.
  - [ ] Antarmuka konsol panitia otomatis menyesuaikan layout tombol dari `consoleConfig` cabor.
  - [ ] Pengujian aturan deuce, selisih 2 poin, dan batas maksimal 30 poin pada bulutangkis lulus 100%.
  - [ ] Modul sepakbola tetap lulus seluruh tes tanpa regresi setelah refactoring core.

---

### Fase 3: Format Kompetisi & Cabang Tambahan
- **Lingkup:** Pembangunan generator jadwal otomatis anti-bentrok, bagan eliminasi gugur (`single_elimination`) dengan propagasi pemenang otomatis (`next_match_id`), format `group_then_knockout`, implementasi modul **futsal** (`timed_goals`) dan **volleyball** (`rally_set`), serta registry tiebreaker lengkap.
- **Kriteria Selesai (Acceptance Criteria):**
  - [ ] Bagan gugur berhasil menangani jumlah tim non-pangkat-2 dengan penempatan *bye* dan *seeding* otomatis.
  - [ ] Futsal lulus uji ambang 5 foul dan penalti 10m; bola voli lulus uji set penentu 15 poin dan distribusi poin 3-2.
  - [ ] Generator jadwal menghasilkan jadwal tanpa bentrok venue, tim, atau wasit.

---

### Fase 4: Esport, Sinkronisasi Offline & Penyempurnaan Fitur
- **Lingkup:** Implementasi modul **esport** (`map_series`), mode offline panitia lapangan dengan sinkronisasi antrean event, kalkulasi statistik akumulasi kartu dan skorsing otomatis, pencatatan insiden/protes tim, serta viewer audit log.
- **Kriteria Selesai (Acceptance Criteria):**
  - [ ] Panitia dapat mencatat skor saat koneksi internet terputus, dan data tersinkronisasi otomatis saat online tanpa duplikasi event.
  - [ ] Seri pertandingan esport BO1, BO3, dan BO5 terhitung agregat kemenangannya dengan benar.
  - [ ] Pemain yang terkena sanksi skorsing otomatis ditandai tidak memenuhi syarat (*ineligible*) pada tahap lineup.

---

## 7.2 Persyaratan Pengujian Wajib (Unit Test Cases)

Seluruh fungsi murni pada `src/sports/*` dan modul perhitungan di `src/core/*` wajib memiliki unit test menggunakan **Vitest**:

1. **Kasus Uji Bulutangkis (`badminton`):**
   - Skor 21-19 $\rightarrow$ Set selesai (pemenang tim yang mencapai 21).
   - Skor 20-20 $\rightarrow$ Set belum selesai (berlaku aturan selisih 2 poin).
   - Skor 22-20 $\rightarrow$ Set selesai.
   - Skor 29-29 $\rightarrow$ Set belum selesai; skor 30-29 $\rightarrow$ Set selesai (mencapai batas maksimal 30 poin).
   - Menang 2 set langsung $\rightarrow$ Pertandingan selesai; skor 1-1 $\rightarrow$ Set ke-3 (penentu) wajib dimainkan.
   - Event `point` yang dikirim setelah set selesai wajib ditolak.

2. **Kasus Uji Bola Voli (`volleyball`):**
   - Set 1 s/d 4: Skor 25-23 selesai; 25-24 belum selesai; 26-24 selesai.
   - Set 5 (penentu): Target 15 poin (15-13 selesai; 15-14 belum selesai).
   - Kemenangan 3-0 atau 3-1 menghasilkan distribusi poin klasemen 3 untuk pemenang dan 0 untuk yang kalah.
   - Kemenangan 3-2 menghasilkan distribusi poin klasemen 2 untuk pemenang dan 1 untuk yang kalah.

3. **Kasus Uji Sepakbola (`football`):**
   - Event `own_goal` (gol bunuh diri) menambahkan angka pada skor tim lawan.
   - Kartu kuning kedua kepada pemain yang sama otomatis berakibat kartu merah.
   - Pemain berkartu merah dilarang mencetak gol atau masuk sebagai pemain pengganti setelahnya.
   - Pemain yang telah diganti keluar dilarang masuk kembali (`reentry_allowed = false`).
   - Pergantian pemain ke-6 wajib ditolak (maksimal 5 pergantian).
   - Jumlah pemain aktif di lapangan < 7 memicu peringatan laga dihentikan (`abandon`).

4. **Kasus Uji Futsal (`futsal`):**
   - Pelanggaran ke-1 s/d 5 dalam satu babak berstatus normal; pelanggaran ke-6 otomatis diberi tanda penalti 10 meter.
   - Pergantian pemain berulang kali diperbolehkan (`reentry_allowed = true`).

5. **Kasus Uji Esport (`esport`):**
   - Seri Best-of-3 (BO3): Tim menang 2-0 $\rightarrow$ Laga selesai; skor 1-1 $\rightarrow$ Membutuhkan Map 3; pendaftaran Map 4 ditolak.
   - Duplikasi nomor map (`map_no`) ditolak.

6. **Kasus Uji Event & State:**
   - Dua event dengan `id` sama yang dikirim ke server hanya dicatat satu kali (idempotensi mutlak).
   - Void event menghitung ulang skor secara benar; void yang membatalkan prasyarat event setelahnya wajib ditolak.
   - Pertandingan berstatus `locked = true` (`verified`) menolak seluruh penambahan atau pembatalan event.

7. **Kasus Uji Klasemen:**
   - Urutan tiebreaker dijalankan bertingkat: Total Poin $\rightarrow$ Selisih Gol $\rightarrow$ Produktivitas Gol $\rightarrow$ Head-to-Head.
   - Hanya pertandingan berstatus `verified` yang memengaruhi poin klasemen.

---

## 7.3 Definition of Done (DoD) per Fitur

Setiap penambahan atau pembaruan fitur dianggap selesai hanya jika:
1. Memenuhi seluruh kriteria spesifikasi ber-ID pada dokumen PRD ini.
2. Seluruh aturan teknis cabor ditulis sebagai fungsi murni dan memiliki unit test dengan coverage memadai.
3. Tidak ada kebocoran aturan cabor di dalam folder `src/core`.
4. Setiap operasi pengubahan data administratif menuliskan jejak ke `audit_logs`.
5. Kebijakan Row Level Security (RLS) teruji aman untuk peran `admin`, `official`, dan anonim.
6. Antarmuka responsif, nyaman dioperasikan satu tangan di smartphone, dan menggunakan bahasa Indonesia baku.
7. Pemeriksaan kode lokal lulus tanpa error: `npm run lint`, `tsc --noEmit`, dan `npm test`.
8. Seluruh asumsi yang diambil terdokumentasi di [11-decisions.md](./11-decisions.md).

---

## 7.4 Pertanyaan Terbuka untuk Pemilik Produk

1. **Stack Default:** Apakah kombinasi Next.js App Router + Supabase telah disepakati penuh untuk fase produksi? *(Dijawab: Ya, disepakati sesuai ADR-005)*.
2. **Kebutuhan Multi-Tenant:** Apakah sistem ditujukan untuk satu penyelenggara tunggal atau membuka pendaftaran penyelenggara independen (*SaaS*)? *(Dijawab: Single-tenant untuk MVP, multi-tenant disiapkan di P2)*.
3. **Hirarki Hak Akses Admin:** Apakah diperlukan pemisahan Super Admin dan Admin per Kompetisi?
4. **Prioritas Cabor Lanjutan:** Cabang olahraga apa yang diprioritaskan setelah Sepakbola, Bulutangkis, Futsal, dan Bola Voli?
5. **Detail Judul Esport:** Game esport spesifik apa yang pertama kali diintegrasikan (MLBB / Valorant) dan apakah membutuhkan statistik KDA per atlet?
