# 11. Catatan Keputusan Arsitektur & Asumsi (ADR & Decisions)

**Dokumen PRD — Bagian 11/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Versi:** 1.0  

---

Dokumen ini mencatat keputusan arsitektural, asumsi teknis, dan trade-off implementasi sesuai arahan [12-master-prd.md](./12-master-prd.md).

---

## ADR-001: Modular Monolith & Sport Registry Pattern
- **Status:** Diterima (Accepted)
- **Konteks:** Sistem harus mendukung berbagai cabang olahraga dengan karakteristik penilaian berbeda (`timed_goals`, `rally_set`, `map_series`) tanpa mencemari kode core (`src/core`).
- **Keputusan:**
  - Kode core tidak boleh berisi logika spesifik cabor (dilarang menggunakan `if (sport === 'football')` di core).
  - Setiap cabang didefinisikan secara mandiri di `src/sports/<kode-cabor>/` yang mengimplementasikan interface murni `SportModule`.
  - Core hanya mengakses modul cabang melalui registry terpusat di `src/core/registry`.
- **Konsekuensi:** Penambahan cabor baru (misal basket, tenis meja) dapat dilakukan cukup dengan membuat folder cabor baru dan mendaftarkannya di registry tanpa merusak modul yang sudah ada.

---

## ADR-002: Event Sourcing Ringan untuk Pertandingan
- **Status:** Diterima (Accepted)
- **Konteks:** Riwayat pertandingan rawan sengketa, perubahan skor, atau kesalahan pencatatan oleh panitia di lapangan.
- **Keputusan:**
  - Skor, kartu, pelanggaran, dan statistik **bukan sumber kebenaran utama**.
  - Sumber kebenaran adalah deretan `match_events` append-only berurutan (`seq`).
  - Baris event tidak pernah di-DELETE atau di-UPDATE secara destruktif; koreksi dilakukan melalui penandaan `voided_at`, `voided_by`, dan `void_reason`.
  - Kolom `matches.result` hanya berfungsi sebagai cache baca yang dapat dihitung ulang (*recomputed*) kapan saja dari event murni.
- **Konsekuensi:** Audit trail lengkap, pencatatan transparan, dan rollback aman terhadap kesalahan input panitia.

---

## ADR-003: Alur Dua Tahap Verifikasi Hasil (Two-Stage Verification)
- **Status:** Diterima (Accepted)
- **Konteks:** Panitia lapangan berada di bawah tekanan waktu, sedangkan klasemen resmi turnamen harus bebas manipulasi dan valid secara hukum kompetisi.
- **Keputusan:**
  - Panitia lapangan/wasit menginput event dan menandai laga `finished`.
  - Hanya Admin yang memiliki hak mengubah status menjadi `verified` (`locked = true`).
  - Publik dapat melihat skor langsung selama pertandingan dengan label "Belum resmi", namun kalkulasi poin klasemen resmi hanya mengambil data dari pertandingan yang berstatus `verified`.
- **Konsekuensi:** Mencegah perubahan sepihak pada klasemen tanpa tinjauan admin turnamen.

---

## ADR-004: Snapshot Aturan Kompetisi (Rules Snapshotting)
- **Status:** Diterima (Accepted)
- **Konteks:** Perubahan regulasi global pada template cabor tidak boleh mengubah aturan kompetisi yang sedang berlangsung di tengah jalan.
- **Keputusan:**
  - Saat kompetisi beralih status dari `draft`/`registration` ke `ongoing`, gabungan aturan default dan `rules_overrides` disalin permanen ke `competitions.rules_snapshot`.
  - Seluruh mesin validasi pertandingan mengambil rujukan aturan dari `rules_snapshot` kompetisi tersebut.
- **Konsekuensi:** Integritas regulasi terjamin stabil dari awal hingga akhir turnamen.

---

## ADR-005: Stack Teknologi & Ekosistem
- **Status:** Diterima (Accepted)
- **Konteks:** Memilih stack yang mendukung performa mobile tinggi, pengetikan ketat, dan kemudahan deployment.
- **Keputusan:**
  - Frontend & Backend API: **Next.js (App Router)** dengan **TypeScript Strict Mode**.
  - Styling: **Tailwind CSS** dengan fondasi atletik berkinerja tinggi.
  - Basis Data & Autentikasi: **Supabase** (PostgreSQL 16, Supabase Auth, Realtime Broadcast, Row Level Security).
  - Skema Validasi: **Zod**.
  - Pengujian: **Vitest** untuk unit test logika murni, **Playwright** untuk end-to-end.
- **Konsekuensi:** Produktivitas tinggi, keamanan RLS di lapisan basis data, dan type-safety end-to-end.

---

## ADR-006: Penanganan Waktu UTC & Tampilan Regional
- **Status:** Diterima (Accepted)
- **Konteks:** Pertandingan di berbagai venue memerlukan pencatatan waktu yang konsisten tanpa masalah timezone.
- **Keputusan:**
  - Semua stempel waktu disimpan dalam format **UTC (ISO 8601)** di basis data.
  - Tampilan waktu ke pengguna dikonversi secara default ke zona waktu **Asia/Jakarta (WIB)** atau zona waktu lokal venue (WITA/WIT).
- **Konsekuensi:** Tidak ada ambiguitas waktu saat sinkronisasi multi-perangkat.

---

## ADR-007: Idempotensi & Cache Offline di Lapangan
- **Status:** Diterima (Accepted)
- **Konteks:** Jaringan internet di venue pertandingan (misal GOR bawah tanah atau stadion terbuka) seringkali tidak stabil.
- **Keputusan:**
  - Setiap event pertandingan yang dibuat di konsol panitia mendapatkan **UUID unik yang di-generate di client**.
  - Database memberlakukan batasan unik `(match_id, id)` sehingga pengiriman ulang akibat retry jaringan tidak akan menggandakan skor/kartu.
  - State lokal dicache di `localStorage` perangkat panitia, memungkinkan pencatatan tetap berjalan saat koneksi terputus.
- **Konsekuensi:** Data panitia aman dari duplikasi dan kehilangan data saat gangguan sinyal.
