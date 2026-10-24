# 01. Ringkasan Eksekutif (Executive Summary)

**Dokumen PRD — Bagian 1/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Versi:** 1.0  

---

## 1.1 Visi Produk

Sauma Arena adalah platform aplikasi web terpadu untuk mengelola turnamen, liga, dan event olahraga di **banyak cabang olahraga** (sepakbola, futsal, bola voli, bulutangkis, esport, dan cabang lain di masa mendatang) dalam **satu aplikasi dan satu codebase**.

Mengatasi tantangan keragaman aturan kompetisi olahraga yang sangat bervariasi, Sauma Arena mengadopsi pendekatan arsitektur **Sport Template** (konfigurasi aturan berbasis data) dan **Sport Module** (mesin aturan khusus per cabor). Dengan pendekatan ini, penambahan cabang olahraga baru dilakukan murni dengan menyusun template dan modul mandiri, tanpa memodifikasi kode inti aplikasi (*core engine*).

---

## 1.2 Tujuan Utama Produk (Product Goals)

- **G1. Efisiensi & Kepatuhan Lapangan:** Panitia dan wasit dapat mencatat skor dan peristiwa pertandingan langsung dari smartphone dengan cepat (maksimal 1–2 ketukan) tanpa melanggar regulasi teknis cabor bersangkutan.
- **G2. Otomasi Operasional Admin:** Admin turnamen dapat menyusun kompetisi, plotting jadwal, penugasan perangkat pertandingan, dan kalkulasi klasemen otomatis dengan beban kerja manual yang minimal.
- **G3. Akses Informasi Publik Cepat & Bebas Hambatan:** Publik dan suporter dapat memantau live score, jadwal pertandingan, bagan gugur, dan klasemen secara real-time tanpa perlu registrasi atau login.
- **G4. Ekstensibilitas Multi-Cabor:** Arsitektur modular memungkinkan penambahan cabor baru dengan mudah tanpa risiko regresi pada cabor yang sudah berjalan.

---

## 1.3 Batasan Produk / Bukan Tujuan (Out of Scope)

Kecuali dinyatakan lain secara eksplisit di masa mendatang, fitur-fitur berikut berada di luar cakupan rilis utama:

1. **Pembayaran & Biaya Pendaftaran:** Tidak menyediakan payment gateway otomatis; biaya pendaftaran dikelola di luar aplikasi atau dicatat secara administratif.
2. **Live Streaming Video:** Aplikasi fokus pada live text commentary, timeline peristiwa, dan pembaruan skor numerik (bukan video stream).
3. **Pendaftaran Mandiri Tim Publik:** Pada rilis awal, tim peserta didaftarkan dan diatur langsung oleh Admin turnamen.
4. **Aplikasi Native (iOS / Android):** Cukup menggunakan teknologi PWA (*Progressive Web App*) responsif dengan kemampuan offline caching.
5. **Multi-Penyelenggara / Multi-Tenant Penuh (P2):** Dioptimasi untuk satu organisasi penyelenggara pada satu instans.
6. **Cabang Berbasis Placement / Juri Nilai (P2):** Format seperti battle royale, balap, dan seni bela diri bersubjektivitas juri disiapkan untuk iterasi lanjutan.

---

## 1.4 Prinsip Desain (Invariant Sistem)

Tujuh prinsip ini adalah **hukum mutlak** yang tidak boleh dilanggar oleh implementasi kode apa pun:

1. **Data-Driven Rules:** Aturan olahraga didefinisikan sebagai template JSON dan modul cabang terisolasi. Dilarang keras menaruh pengkondisian nama cabor (`if (sport === 'football')`) di dalam kode `/core`.
2. **Event Sourcing Ringan:** State pertandingan merupakan hasil kalkulasi murni (*reduce*) dari rentetan `match_events` yang tidak di-void. Event tidak pernah dihapus dari basis data, melainkan hanya di-*void* dengan menyertakan alasan resmi.
3. **Validasi Saat Input:** Setiap input peristiwa yang melanggar aturan teknis cabor wajib **langsung ditolak** oleh mesin validasi dengan pesan penolakan yang jelas dalam bahasa Indonesia.
4. **Dua Tahap Hasil (Two-Stage Verification):** Panitia lapangan mencatat event dan menyelesaikan laga (`finished`), sedangkan Admin turnamen melakukan verifikasi resmi (`verified`). Hanya laga berstatus `verified` yang dihitung ke dalam klasemen resmi turnamen.
5. **Snapshot Aturan (Rules Snapshotting):** Saat kompetisi dimulai (`ongoing`), aturan yang berlaku dibekukan ke kolom `competitions.rules_snapshot`. Perubahan template cabor di masa depan tidak akan memengaruhi kompetisi yang sedang berjalan.
6. **Mobile-First Lapangan & Read-Only Cepat Publik:** Konsol panitia dioptimasi untuk kecepatan satu tangan di bawah terik matahari, sementara portal publik dioptimasi untuk kecepatan render read-only tanpa login.
7. **Idempotensi:** Pengiriman event yang sama berulang kali (akibat gangguan koneksi internet di lapangan) dijamin tidak akan menduplikasi skor atau kartu di server.

---

## 1.5 Klasifikasi Prioritas Kebutuhan

| Kode | Tingkat Prioritas | Definisi |
|---|---|---|
| **P0** | Wajib Ada (MVP) | Persyaratan mutlak agar alur turnamen dari awal hingga akhir dapat berjalan |
| **P1** | Sebaiknya Ada | Dikerjakan segera setelah fondasi P0 pada fase terkait selesai dan teruji |
| **P2** | Opsional / Masa Depan | Fitur penyempurna untuk iterasi lanjutan |
