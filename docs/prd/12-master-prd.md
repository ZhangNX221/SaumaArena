# 12. Master Dokumen Spesifikasi Produk (Compiled PRD v2.0)

**Dokumen PRD — Bagian 12/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Edisi Turnamen:** Milad Matsanega Futsal Competition I (MMFC I) • MTsN 3 Blitar  
**Versi Dokumen:** 2.0 (Arsitektur Lengkap Tiga Konsol Terpadu)  
**Bahasa UI Aplikasi:** Bahasa Indonesia (dengan struktur penamaan atletik standar internasional)  
**Bahasa Kode & Identifier:** TypeScript / English  
**Tujuan Dokumen:** Spesifikasi induk operasional dan teknis bagi seluruh tim pengembang, wasit, dan panitia pelaksana.

---

## 0. Cara Memakai Dokumen Ini (Wajib Dipatuhi)

### 0.1 Aturan Kerja Utama
1. **Prinsip Tiga Konsol Terpadu:** Platform beroperasi dalam satu codebase tunggal (`Next.js App Router`) dengan tiga antarmuka terintegrasi:
   - **Portal Publik (`/`):** 8 Tab informasi, live score, jadwal, klasemen, bagan gugur, tim, statistik, suporter, registrasi kontingen, dan pemesanan e-tiket.
   - **Konsol Wasit Lapangan (`/?view=referee`):** Tablet digital untuk stopwatch (running/stop clock), pencatatan gol per menit, foul 5/5, time-out, kartu wasit, form penilaian suporter madrasah, dan pengesahan BAP digital.
   - **Admin Arena Command Center (`/?view=admin`):** Pusat kendali komisioner turnamen untuk verifikasi berkas atlet (NISN), drawing bagan, verifikasi BAP dua tahap, scanner gate tiket, sinkronisasi waktu laga, dan ekspor laporan resmi.
2. **Desain Dual Athletic Sports Theme:**
   - **Mode Terang (*Light Mode*):** Putih-Biru Sporty Enerjik (`#1D63B8`, Deep Athletic Navy `#0C2340`, latar sejuk `#F4F8FD`, border tegas `#CBD5E1`, dan bayangan kartu halus). Bebas dari nuansa coklat/amber pada teks dan kartu.
   - **Mode Gelap (*Dark Mode*):** Emas Pemenang (`#F59E0B`) & Midnight Pitch Charcoal (`#07131F`).
3. **Skor Bukan Sumber Kebenaran Tunggal:** Sumber kebenaran mutlak adalah rangkaian peristiwa `match_events` (gol, foul, kartu, timeout) yang dicatat kronologis per menit. Skor, klasemen, top scorer sepatu emas, dan evaluasi suporter dihitung secara konsisten dari deretan event yang sah.
4. **Verifikasi Hasil Dua Tahap (*Two-Stage Verification*):**
   - Tahap 1: Wasit 1, Wasit 2, dan Pengawas Pertandingan menandatangani BAP digital lapangan (`finished`).
   - Tahap 2: Komisioner/Pengawas Pertandingan di Admin Arena mengesahkan dan mengunci permanen (`verified` & `locked = true`). Hanya hasil berstatus `verified` yang diakumulasikan ke klasemen resmi.
5. **Idempotensi & Ketahanan Lapangan:** Setiap aksi pencatatan gol/pelanggaran memiliki UUID unik di sisi klien untuk mencegah duplikasi skor saat jaringan seluler di GOR terputus (*offline queue caching*).

---

## 1. Ringkasan Eksekutif & Konteks Turnamen MMFC I

- **Ajang Pertandingan:** *Milad Matsanega Futsal Competition I (MMFC I)* dalam rangka memperingati Milad ke-31 MTsN 3 Blitar.
- **Peserta:** 14 Tim Kontingen Pelajar SD/MI se-derajat di Blitar Raya yang terbagi ke dalam 4 Grup (A, B, C, D) dengan sistem setengah kompetisi dilanjutkan babak semifinal, bronze match, dan grand final (total 17 pertandingan).
- **Lokasi Venue:** *Lapangan Futsal Seabless Srengat, Blitar* dengan kapasitas 500 penonton dan pembagian pintu: Gate Barat (VIP & Atlet) serta Gate Timur (Suporter Madrasah & Umum).

---

## 2. Prinsip Desain Invariant Sistem

1. **Data-Driven Rules:** Regulasi cabor didefinisikan sebagai template JSON dan modul TypeScript terisolasi.
2. **Event Sourcing Ringan:** State pertandingan merupakan hasil kalkulasi murni dari deretan `match_events` append-only yang tidak di-void.
3. **Validasi Saat Input:** Setiap input yang melanggar aturan teknis cabor ditolak seketika oleh fungsi murni `validateEvent` dengan pesan bahasa Indonesia.
4. **Verifikasi Dua Tahap:** Hasil lapangan ditandatangani wasit, lalu diverifikasi pengawas pertandingan sebelum masuk klasemen resmi.
5. **Snapshot Aturan:** Regulasi dibekukan ke `rules_snapshot` saat kompetisi berstatus `ongoing`.
6. **Mobile-First Lapangan & Centered Admin:** Tablet wasit dioptimasi untuk kecepatan sentuh di pinggir lapangan, sedangkan dasbor admin diposisikan simetris di tengah layar lebar (`max-w-7xl mx-auto`).
7. **Idempotensi Mutlak:** UUID unik klien menjamin tidak ada duplikasi data akibat pengiriman ulang jaringan.
8. **Dual Athletic Theme Bebas Coklat:** Konsistensi visual sporty biru energetik tanpa teks atau kartu bernuansa coklat/pudar.

---

## 3. Matriks Peran & Hak Akses

| Operasi Sistem | Superadmin | Pengawas (PP) | Wasit & Meja | Juri Suporter | Petugas Gate | Official Tim | Publik |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Konfigurasi Cabor & Freeze Rules | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Verifikasi Berkas Atlet (NISN) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Drawing Bagan & Plotting Jadwal | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Kendali Stopwatch & Skor Laga | ✅ *(override)* | ❌ | ✅ *(tugasnya)* | ❌ | ❌ | ❌ | ❌ |
| Form Penilaian Tribun Suporter | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Tanda Tangan Digital BAP | ❌ | ✅ *(Tahap 3)* | ✅ *(Tahap 1&2)*| ❌ | ❌ | ❌ | ❌ |
| Pengesahan Akhir BAP (Kunci) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Scanner Validasi E-Tiket Gate | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Form Registrasi Tim Kontingen | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ *(Form)* | ❌ |
| Pesan E-Tiket Masuk Stadion | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ *(Form)* |
| Lihat Live Score, Jadwal & Klasemen | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ *(Read-Only)* |

---

## 4. Spesifikasi Fungsional Kunci

### 4.1 Portal Publik (`/`)
- **Pencarian Tim Reaktif:** Input navbar untuk mencari kontingen dengan hasil dropdown instan.
- **Hero Spotlight MMFC I:** Banner atletik berlatar stadion navy, sorotan logo resmi Matsanega, dan ticker jadwal.
- **8 Tab Publik:** Informasi & Juknis (Bento Grid), Live Match, Jadwal 17 Laga, Klasemen Grup A-D, Bagan Gugur 4 Besar, Profil 14 Tim, Statistik Top Scorer Sepatu Emas, dan Leaderboard Best Supporter.
- **Modal Registrasi Tim Kontingen:** Wizard 4 tahap (Data Tim, Roster 10-12 Atlet NISN, Unggah Rekomendasi, Ringkasan).
- **Modal E-Tiket & Booking QR:** Pemesanan e-tiket dengan kode QR untuk Gate Barat / Timur.

### 4.2 Konsol Wasit Meja Lapangan (`/?view=referee`)
- **Stopwatch Digital Taktil:** Running clock (Grup) vs Stop clock (Gugur), tombol Jalankan/Jeda, Bel Kick-off, Reset.
- **Papan Skor & Pencatat Gol:** Tombol raksasa `+ 1 GOL` dengan perekaman menit otomatis dan pemilihan pemain.
- **Akumulasi Foul Tim (5/5):** 5 Lampu indikator pelanggaran dengan bel peringatan dan aktivasi second penalty 10m.
- **Time-Out 60 Detik:** Hitung mundur time-out 60 detik (1x per babak tiap tim).
- **Sanksi Disiplin Kartu:** Kartu kuning, akumulasi 2 KK menjadi kartu merah, dan kartu merah langsung KKM.
- **Form Penilaian Suporter:** Form khusus juri untuk menilai 5 kriteria positif (+poin) dan 5 kategori sanksi (-poin).
- **Lembar BAP Digital 3 Pihak:** Tanda tangan digital Wasit 1, Wasit 2, dan Pengawas Pertandingan.
- **Pelaporan Insiden Komdis:** Pencatatan insiden perusakan, kericuhan, atau pelanggaran disiplin berat.

### 4.3 Admin Arena Dashboard (`/?view=admin`)
- **Tata Letak Simetris:** Container terpusat `max-w-7xl mx-auto` bebas void layar lebar.
- **Beranda Metrik & Medali 1-Tap:** Total kontingen, total laga, laga live, dan stepper medali cepat.
- **Verifikasi Berkas Kontingen:** Validasi status NISN atlet (`VERIFIED`, `REJECTED`, `PENDING`) dan cetak ID card QR.
- **Drawing Bracket & Penjadwalan:** Bagan interaktif 4 besar dan deteksi bentrok jadwal wasit.
- **Verifikasi Hasil Dua Tahap:** Pengawas pertandingan mengesahkan BAP dan memicu kalkulasi poin klasemen.
- **Scanner Tiket Gate Masuk:** Validasi QR e-tiket, cegah double check-in, dan akumulasi poin suporter sekolah.
- **Sinkronisasi Durasi Waktu:** Pengaturan durasi babak dan timeout yang langsung sinkron ke konsol wasit.
- **Pencadangan & Ekspor:** Backup/Restore database JSON 1-klik dan ekspor laporan PDF/Excel resmi.

---

## 5. Kebutuhan Non-Fungsional (NFR)

- **LCP Portal Publik:** $< 2,0$ detik pada jaringan 4G.
- **Latensi Skor Realtime:** $< 3$ detik dari meja wasit ke publik.
- **Respons Sentuh Tablet:** $< 80$ milidetik dengan konfirmasi haptik/visual.
- **Keamanan:** Cookie HTTP-only, proteksi RBAC, dan masking NISN pada data publik.
- **Audit Trail:** Perekaman lengkap seluruh aksi void dan override skor.
- **Ketahanan Offline:** Penyimpanan antrean lokal di tablet saat sinyal GOR terputus dengan auto-sync.
- **Aksesibilitas:** WCAG 2.1 AA, border tegas `#CBD5E1`, bayangan kartu halus, dan bebas warna teks coklat/pudar.

---

## 6. Daftar Rujukan Dokumen Spesifikasi

1. [00-index.md](./00-index.md) — Panduan Kerja & Indeks Dokumen PRD
2. [01-executive-summary.md](./01-executive-summary.md) — Visi, Tujuan & Batasan Produk
3. [02-target-personas.md](./02-target-personas.md) — Matriks Hak Akses & Glosarium Teknis
4. [03-user-stories.md](./03-user-stories.md) — Kebutuhan Fungsional FR-ADM, FR-OFF, FR-PUB
5. [04-functional-specs.md](./04-functional-specs.md) — Mesin Aturan, Template Cabor & State Machine
6. [05-user-flows.md](./05-user-flows.md) — Alur Pengguna Operasional Lengkap & Diagram Interaksi
7. [06-non-functional-requirements.md](./06-non-functional-requirements.md) — Spesifikasi Kebutuhan Non-Fungsional
8. [07-success-metrics.md](./07-success-metrics.md) — Roadmap, Kasus Uji & Definition of Done
9. [08-software-architecture.md](./08-software-architecture.md) — Arsitektur Modular Monolith & Model Data
10. [09-wireframes-and-ui.md](./09-wireframes-and-ui.md) — Desain Antarmuka & Ilustrasi Wireframe Tiga Konsol
11. [10-product-context.md](./10-product-context.md) — Konteks Produk & Brand MMFC I MTsN 3 Blitar
12. [11-decisions.md](./11-decisions.md) — Architectural Decision Records (ADR-001 s/d ADR-014)
