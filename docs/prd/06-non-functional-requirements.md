# 06. Kebutuhan Non-Fungsional (Non-Functional Requirements)

**Dokumen PRD — Bagian 6/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Edisi Turnamen:** Milad Matsanega Futsal Competition I (MMFC I) • MTsN 3 Blitar  
**Versi:** 2.0  

---

## 6.1 Matriks Kebutuhan Non-Fungsional (NFR-01 s/d NFR-10)

| ID | Parameter Sistem | Spesifikasi Teknis & Standar Arsitektur | Kriteria Verifikasi |
|---|---|---|---|
| **NFR-01** | Kecepatan Muat Portal Publik | Waktu muat Largest Contentful Paint (LCP) **< 2,0 detik** pada jaringan seluler 4G. Memanfaatkan Next.js Client Component Caching dan SSR teroptimasi. | Lighthouse Performance $\ge 90$ |
| **NFR-02** | Latensi Siaran Skor Real-Time | Pembaruan peristiwa pertandingan (skor gol, foul 5/5, kartu, dan waktu) diterima penonton dalam waktu **< 3 detik** sejak disimpan wasit meja. | Realtime benchmark latency |
| **NFR-03** | Responsivitas Sentuh Tablet Wasit | Tombol taktil konsol wasit (`+1 GOL`, `+ FOUL`, `STOPWATCH`) merespons dalam waktu **< 80 milidetik** dengan konfirmasi haptik / visual instan. | Touch latency test (< 80ms) |
| **NFR-04** | Keamanan Sesi & Otorisasi RBAC | Autentikasi aman melalui cookie HTTP-only terenkripsi. Hak akses dibatasi ketat antar Superadmin, Pengawas Pertandingan, dan Wasit Lapangan. | Audit sesi & proteksi rute |
| **NFR-05** | Perlindungan Privasi Atlet Pelajar | NISN, nomor induk kependudukan, dan nomor telepon siswa **wajib dilindungi**. Data sensitif tidak boleh diekspos pada endpoint publik tanpa autentikasi. | Pemeriksaan payload JSON publik |
| **NFR-06** | Audit Trail Lengkap | Setiap aksi void gol, modifikasi skor manual, perubahan jadwal, dan pembatalan pertandingan wajib mencatat rekaman ke log audit (`actor`, `timestamp`, `reason`). | Integritas audit trail test |
| **NFR-07** | Konsistensi Zona Waktu | Seluruh stempel waktu pertandingan disimpan dalam format **UTC (ISO 8601)** dan disajikan kepada pengguna dalam zona **Waktu Indonesia Barat (WIB / UTC+7)**. | Timezone verification test |
| **NFR-08** | Desain Kontras Tinggi Anti-Samar | Mematuhi standar WCAG 2.1 AA. Mode terang menggunakan border tegas slate-300 (`#CBD5E1`), bayangan kartu halus (`rgba(12, 35, 64, 0.08)`), dan bebas warna teks pudar/coklat. | Audit rasio kontras > 4.5:1 |
| **NFR-09** | Tata Letak Admin Simetris | Tampilan konten Admin Arena diatur terpusat secara simetris (`max-w-7xl mx-auto`), menghilangkan area void/kosong pada monitor widescreen 1080p dan 4K. | Pengujian multi-resolusi layar |
| **NFR-10** | Ketahanan Offline Lapangan | Jika koneksi internet di Lapangan Seabless putus, konsol wasit menyimpan event secara lokal di IndexedDB/localStorage dan melakukan sinkronisasi otomatis saat online. | Pengujian offline network toggle |

---

## 6.2 Protokol Ketahanan Jaringan & Mode Offline di GOR

Mengingat kondisi gedung olahraga (GOR) atau arena futsal sering mengalami pelemahan sinyal operator seluler, Sauma Arena menerapkan protokol ketahanan jaringan berlapis:

1. **Idempotensi Berbasis UUID Klien:**
   - Setiap kali wasit menekan tombol aksi (misal `+1 Gol` atau `+ Foul`), peramban men-generate UUID unik v4 di sisi klien.
   - Server memberlakukan *unique constraint* pada pasangan `(match_id, event_uuid)`.
   - Jika jaringan terputus dan browser melakukan pengiriman ulang (*retry queue*), basis data akan mengabaikan duplikasi secara aman tanpa menambah skor ganda.
2. **Penyimpanan Lokal Sementara (Local Caching):**
   - Rangkaian event pertandingan yang belum terkirim ditampung dalam antrean lokal (`localStorage` / IndexedDB).
   - Header konsol menampilkan indikator status:
     - `🟢 Terhubung • Sinkron` (Sinyal stabil, data live).
     - `🟡 Mode Offline Lapangan • Tersimpan Aman` (Sinyal terputus, data tersimpan lokal).
   - Begitu koneksi internet kembali pulih, sistem secara otomatis mengeksekusi *queue flush* sesuai urutan kronologis kejadian.
3. **Penyimpanan Snapshot BAP Fisik:**
   - Setelah laga selesai, konsol wasit dapat langsung mengekspor berkas BAP digital menjadi dokumen pratinjau yang dapat disimpan sebagai cadangan sebelum diunggah ke server.
