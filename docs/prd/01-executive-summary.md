# 01. Ringkasan Eksekutif (Executive Summary)

**Dokumen PRD — Bagian 1/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Edisi Turnamen:** Milad Matsanega Futsal Competition I (MMFC I) • MTsN 3 Blitar  
**Versi:** 2.0  

---

## 1.1 Visi Produk

**Sauma Arena** adalah platform aplikasi web terpadu untuk mengelola kejuaraan dan turnamen olahraga di berbagai cabang (futsal, sepakbola, bola voli, bulutangkis, esport) dalam **satu aplikasi, satu basis kode (*single codebase*)**, dan **tiga konsol antarmuka yang terintegrasi penuh**:
1. **Portal Publik Penonton (`/`):** Akses bebas hambatan tanpa login bagi suporter madrasah, atlet, dan wali murid untuk memantau siaran langsung pertandingan (*live score*), klasemen fase grup, bagan eliminasi, jadwal, registrasi tim kontingen, dan pemesanan e-tiket stadion.
2. **Konsol Wasit Lapangan (`/?view=referee`):** Tablet digital ramah sentuhan (*touchscreen-first*) bagi wasit dan juri meja untuk mengendalikan waktu laga, mencatat peristiwa pertandingan (gol per menit, foul 5/5, kartu wasit), menilai kreativitas suporter madrasah, dan menandatangani Berita Acara Pertandingan (BAP) secara digital.
3. **Admin Arena Command Center (`/?view=admin`):** Pusat operasional komisioner dan panitia pelaksana untuk verifikasi berkas atlet, drawing bagan, penugasan wasit, pengesahan hasil laga dua tahap, scanner tiket gerbang masuk, sinkronisasi durasi waktu, serta ekspor dokumen resmi Kemenag dan Dispora.

---

## 1.2 Tujuan Utama Produk (Product Goals)

- **G1. Efisiensi & Kepatuhan Lapangan:** Wasit dan pencatat meja dapat mengoperasikan stopwatch dan mencatat peristiwa pertandingan langsung dari tablet/smartphone dengan kecepatan 1–2 ketukan tanpa melanggar regulasi teknis turnamen.
- **G2. Otomasi Operasional & Integritas Admin:** Komisioner dapat menyusun kompetisi, drawing bagan, verifikasi berkas atlet (NISN), memvalidasi tiket masuk, dan mengesahkan klasemen otomatis tanpa risiko salah hitung manual.
- **G3. Akses Publik Bebas Hambatan (< 3 Detik):** Suporter madrasah dan penonton umum dapat memantau pergerakan skor, jadwal, klasemen, dan unduh juknis resmi secara instan tanpa perlu mendaftar atau mengunduh aplikasi terpisah.
- **G4. Ekstensibilitas Multi-Cabor & Penilaian Terpadu:** Arsitektur modular memfasilitasi integrasi berbagai model skor: waktu (`timed_goals`), reli set (`rally_set`), seri map esport (`map_series`), hingga penilaian subjektif berbobot (*judged supporter tribunal*).

---

## 1.3 Ruang Lingkup Produk

### Fitur Dalam Cakupan (In-Scope — Edisi MMFC I):
1. **Portal Publik 8 Tab:** Informasi & Juknis (Bento Grid), Live Match & Timeline, Jadwal & Hasil, Klasemen Grup A–D, Bagan Gugur 4 Besar, Profil 14 Tim Kontingen, Statistik Top Scorer Sepatu Emas, dan Leaderboard Best Supporter.
2. **Pendaftaran Mandiri Kontingen:** Modal wizard 4 tahap bagi manajer sekolah untuk mendaftarkan 10–12 atlet, melampirkan NISN resmi, dan mengunggah surat rekomendasi kepala madrasah.
3. **E-Tiket Masuk & Gate Scanner:** Pemesanan e-tiket dengan kode booking QR dan scanner validasi pintu masuk Gate Barat & Gate Timur yang terintegrasi poin suporter.
4. **Konsol Wasit Meja Lengkap:** Stopwatch running/stop clock, tombol taktil gol per menit, akumulasi foul 5/5 dengan bel peringatan, kuota time-out 60 detik, sanksi akumulasi 2 kartu kuning dan kartu merah langsung.
5. **Form Penilaian Tribun Suporter:** Form khusus juri untuk mencatat poin kreativitas yel-yel, atribut, maskot, kebersihan tribun (+poin), serta pemotongan poin akibat sanksi/anarkis (-poin).
6. **Berita Acara Pertandingan (BAP) Digital 3 Pihak:** Tanda tangan digital Wasit 1, Wasit 2, dan Pengawas Pertandingan sebelum hasil dikunci permanen.
7. **Admin Arena Simetris (*Centered Layout*):** Tata letak responsif `max-w-7xl mx-auto` bebas void layar lebar, generator ID card atlet ber-QR, modul backup/restore JSON, dan sinkronisasi durasi waktu.

### Batasan Produk / Di Luar Cakupan (Out of Scope):
1. **Live Streaming Video:** Fokus pada live scoreboard digital, kronologi teks per menit, dan grafik analisis data (bukan transmisi video kamera).
2. **Aplikasi Native Store (iOS / Android):** Cukup menggunakan teknologi Web Responsive / PWA berperforma tinggi dengan kemampuan offline caching.
3. **Sistem Pembayaran Otomatis Bank (Payment Gateway):** Menggunakan sistem konfirmasi reservasi tiket & transfer manual panitia pelaksana.

---

## 1.4 Prinsip Desain (Invariant Sistem)

Delapan prinsip ini adalah **hukum mutlak** yang mengikat seluruh arsitektur Sauma Arena:

1. **Data-Driven Rules:** Regulasi cabor didefinisikan sebagai template JSON dan modul TypeScript terisolasi. Dilarang keras menaruh pengkondisian nama cabor (`if (sport === 'futsal')`) pada kode core bersama.
2. **Event Sourcing Ringan:** Sumber kebenaran adalah deretan `match_events` append-only. Skor dan klasemen selalu dihitung murni dari event yang sah. Event tidak pernah di-DELETE, hanya di-*void* dengan menyertakan alasan resmi.
3. **Validasi Saat Input:** Setiap input peristiwa yang melanggar aturan teknis cabor (misal pemain terkena kartu merah mencetak gol) wajib **langsung ditolak** oleh mesin validasi dengan pesan penolakan jelas dalam bahasa Indonesia.
4. **Verifikasi Hasil Dua Tahap (*Two-Stage Verification*):** Panitia lapangan mencatat event dan menyelesaikan laga (`finished`), sedangkan Admin turnamen / Pengawas Pertandingan melakukan verifikasi resmi (`verified`). Hanya laga berstatus `verified` yang dihitung ke klasemen resmi.
5. **Snapshot Aturan (*Rules Snapshotting*):** Saat kompetisi dimulai (`ongoing`), aturan yang berlaku dibekukan permanen ke `competitions.rules_snapshot`. Perubahan template cabor di masa depan tidak akan memengaruhi kompetisi yang sedang berjalan.
6. **Mobile-First Lapangan & Centered Admin:** Konsol wasit dioptimasi untuk kecepatan sentuhan di pinggir lapangan, sedangkan dasbor admin diposisikan simetris di tengah layar lebar (`max-w-7xl mx-auto`).
7. **Idempotensi & Ketahanan Sinyal GOR:** Pengiriman event berulang akibat fluktuasi jaringan di venue dijamin tidak akan menggandakan skor di server berkat UUID unik klien dan offline local queue.
8. **Dual Athletic Sports Theme Bebas Coklat:** Desain mode terang memprioritaskan Putih-Biru Sporty Enerjik (`#1D63B8`), Navy Pekat (`#0C2340`), border tegas (`#CBD5E1`), dan bayangan kartu lembut tanpa elemen teks atau kartu yang bernuansa coklat/pudar.
