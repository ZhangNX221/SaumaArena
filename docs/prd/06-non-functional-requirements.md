# 06. Kebutuhan Non-Fungsional (Non-Functional Requirements)

**Dokumen PRD — Bagian 6/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Versi:** 1.0  

---

## 6.1 Matriks Kebutuhan Non-Fungsional (NFR-01 s/d NFR-10)

| ID | Parameter | Spesifikasi Teknis | Standar Pengujian |
|---|---|---|---|
| **NFR-01** | Kecepatan Muat Halaman Publik | Waktu muat Largest Contentful Paint (LCP) **< 2,5 detik** pada jaringan seluler 4G standar. Gunakan strategi caching dan Incremental Static Regeneration (ISR) untuk halaman publik. | Lighthouse Performance Score $\ge 90$ |
| **NFR-02** | Latensi Pembaruan Real-Time | Pembaruan peristiwa pertandingan (skor gol, poin rally, kartu) diterima oleh penonton publik dalam waktu **< 3 detik** sejak disimpan panitia, memanfaatkan koneksi Supabase Realtime / WebSocket / Server-Sent Events (SSE). | Realtime latency benchmark |
| **NFR-03** | Responsivitas Sentuhan Konsol | Tombol aksi pada konsol panitia/wasit wajib merespons ketukan dalam waktu **< 100 milidetik** memanfaatkan prinsip *Optimistic UI*, dengan mekanisme *rollback* halus jika server menolak validasi. | Mobile input response test |
| **NFR-04** | Keamanan Data & Autorisasi (RLS) | Mekanisme **Row Level Security (RLS)** wajib diaktifkan pada seluruh tabel PostgreSQL. Kunci rahasia API tidak boleh bocor ke bundle JavaScript klien. Semua input wajib divalidasi ganda di server menggunakan Zod. | Audit keamanan & penetration testing dasar |
| **NFR-05** | Perlindungan Privasi Pemain | Data sensitif atlet (tanggal lahir, nomor telepon, NISN/NIK) **dilarang keras** diekspos ke publik. Gunakan PostgreSQL Database View khusus untuk endpoint publik tanpa login. | RLS Policy unit test untuk peran anonim |
| **NFR-06** | Audit Trail Lengkap | Seluruh aksi modifikasi data penting (void event, pengubahan jadwal, putusan WO, pembukaan kunci laga) wajib mencatat rekaman ke tabel `audit_logs` (mencakup `actor_id`, `before`, `after`, dan `reason`). | Integritas audit log test |
| **NFR-07** | Konsistensi Zona Waktu | Seluruh stempel waktu (`scheduled_at`, `created_at`, durasi clock) disimpan dalam format **UTC**. Antarmuka pengguna menyajikan waktu dalam zona **Asia/Jakarta (WIB)** atau zona waktu lokal venue (WITA/WIT). | Timezone conversion test |
| **NFR-08** | Aksesibilitas & Ergonomi Lapangan | Memenuhi pedoman dasar aksesibilitas: kontras warna tinggi (terbaca jelas di bawah terik matahari lapangan outdoor), ukuran target sentuh minimal **44 × 44 piksel**, dan dukungan navigasi keyboard di sisi Admin. | Antislop-human & WCAG 2.1 AA check |
| **NFR-09** | Pembatasan Beban & Anti-Scraping | Pembatasan laju permintaan (*Rate Limiting*) diterapkan pada rute publik untuk mencegah scraping agresif dan serangan denial of service (DoS) saat lonjakan suporter di hari final. | Load test 1.000 req/sec |
| **NFR-10** | Dukungan Tema Terang / Gelap | Antarmuka mendukung mode gelap (*Dark Mode*) dan terang (*Light Mode*) secara konsisten, mengadaptasi preferensi sistem perangkat pengguna dengan opsi toggle manual. | Visual contrast audit |

---

## 6.2 Ketahanan Jaringan & Mode Offline Lapangan

Mengingat venue pertandingan olahraga (seperti gedung olahraga bawah tanah atau lapangan tertutup) kerap memiliki sinyal seluler yang fluktuatif, platform mengimplementasikan protokol ketahanan jaringan:

1. **Idempotensi Berbasis UUID Klien:**
   - Setiap kali panitia menekan tombol aksi (misal +1 Gol), klien men-generate UUID unik v4 di sisi browser.
   - Database memiliki *unique constraint* pada pasangan `(match_id, id)`.
   - Jika jaringan terputus dan browser melakukan pengiriman ulang (*retry*), basis data akan mengabaikan duplikasi secara aman tanpa menambah skor dobel.

2. **Penyimpanan Lokal Sementara (Local Caching):**
   - State pertandingan dan antrean event yang belum terkirim disimpan dalam `localStorage` / IndexedDB.
   - Header konsol menampilkan pill indikator koneksi: `🟢 Online • Sinkron` vs `🟡 Offline Lokal • Tersimpan`.
   - Begitu koneksi internet pulih, antrean event disinkronkan secara otomatis sesuai nomor urut `seq`.
