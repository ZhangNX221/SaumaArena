# 05. Alur Pengguna Operasional (User Flows)

**Dokumen PRD — Bagian 5/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Versi:** 1.0  

---

## 5.1 Alur 1: Setup Kompetisi & Pembekuan Aturan (Admin)

```
[Mulai] ──► [Admin Login] ──► [Pilih Cabor & Template Aturan]
                                       │
                                       ▼
                         [Atur Override Regulasi Khusus]
                                       │
                                       ▼
                          [Input Data Tim & Roster Pemain]
                                       │
                                       ▼
                         [Ubah Status Menjadi 'ongoing']
                                       │
                                       ▼
                   [Sistem Bekukan Snapshot ke 'rules_snapshot'] ──► [Selesai]
```

1. **Inisiasi Turnamen:** Admin membuka `/admin/competitions`, memilih cabor (misal `futsal`), menentukan nama, slug URL, dan tanggal pelaksanaan.
2. **Kustomisasi Aturan:** Admin meninjau template standar. Jika ada penyesuaian khusus (misal durasi babak 2x15 menit atau batas kartu kuning), Admin mengisi `rules_overrides`. Sistem memvalidasi konfigurasi dengan skema Zod cabor.
3. **Penyusunan Peserta:** Admin memasukkan tim peserta dan memvalidasi kelayakan berkas pemain (kartu pelajar/identitas).
4. **Pembekuan Regulasi:** Saat kompetisi diubah menjadi `ongoing`, sistem otomatis menggabungkan template default dengan overrides dan menyimpannya ke `competitions.rules_snapshot`. Regulasi turnamen terkunci permanen dari perubahan global.

---

## 5.2 Alur 2: Plotting Jadwal, Venue & Penugasan Panitia (Admin)

1. **Pemilihan Fase:** Admin membuka tab Plotting Jadwal pada kompetisi bersangkutan.
2. **Alokasi Slot:** Menentukan nomor laga, tanggal, jam tanding (disimpan UTC), venue, dan nomor lapangan (misal GOR Flobamora, Lapangan A).
3. **Penugasan Perangkat Laga:** Memilih panitia terdaftar dan menetapkan tugasnya (`referee`, `scorekeeper`, atau `judge`).
4. **Deteksi Bentrok Otomatis:** Sistem mengecek:
   - Apakah lapangan yang sama sudah terpakai pada jam tersebut?
   - Apakah salah satu tim dijadwalkan bertanding di waktu yang sama?
   - Apakah wasit yang ditugaskan sedang memimpin laga lain?
5. **Konfirmasi Jadwal:** Jika tidak ada bentrok (atau jika Admin menyetujui override bentrok), jadwal tersimpan dengan status awal `scheduled`.

---

## 5.3 Alur 3: Persiapan Lapangan & Konfirmasi Lineup (Panitia / Official)

1. **Akses Konsol Mobile:** Wasit atau operator membuka smartphone di `/official`, memilih laga tugas hari ini.
2. **Pengecekan Identitas:** Memeriksa kehadiran fisik tim di lapangan sesuai daftar pemain terdaftar.
3. **Pemilihan Lineup:**
   - Memilih pemain inti (*starters*) sesuai kuota template cabor (misal 5 pemain untuk futsal, 11 untuk sepakbola, 6 untuk voli).
   - Memilih pemain cadangan (*substitutes*).
4. **Validasi Kesiapan:** Sistem memeriksa apakah syarat kuota minimum pemain terpenuhi dan memastikan tidak ada pemain yang berstatus terkena sanksi larangan bertanding (*suspended*).
5. **Kunci Lineup:** Panitia menekan tombol "Konfirmasi Lineup"; status laga beralih menjadi `lineup_confirmed`.

---

## 5.4 Alur 4: Pencatatan Event Laga & Validasi Lapangan (Official)

```
[Laga 'live'] ──► [Panitia Tap Aksi: Gol / Kartu / Poin]
                              │
                              ▼
                [Mesin Validasi: validateEvent()]
                 ├── Tidak Sah ──► [Tolak Event + Tampilkan Pesan Error]
                 └── Sah ───────► [Simpan Event + UUID Unik Klien]
                                          │
                                          ▼
                         [Hitung Ulang Skor & Broadcast Realtime]
                                          │
                                          ▼
                         [Tersimpan di Cache Lokal Perangkat]
```

1. **Memulai Laga:** Panitia menekan tombol "Mulai Pertandingan" / "Mulai Babak"; status berubah menjadi `live`.
2. **Pencatatan Cepat (1–2 Ketukan):**
   - *Sepakbola/Futsal:* Tekan **+ Poin Tim A** $\rightarrow$ Pilih nama pemain pencetak gol $\rightarrow$ Skor bertambah seketika.
   - *Voli/Bulutangkis:* Tekan tombol raksasa **+1 Poin** untuk tim yang memenangkan rally.
3. **Penyaringan Pelanggaran Regulasi:** Setiap event diverifikasi oleh `validateEvent()`. Bila pemain berkartu merah dipilih untuk mencetak gol atau pergantian pemain melebihi batas, aksi ditolak seketika dengan pesan bahasa Indonesia.
4. **Koreksi Kesalahan (Void Event):** Jika terjadi salah pencet, panitia memilih tombol undo/void, memasukkan alasan koreksi (misal "Salah identifikasi nomor punggung"). Sistem menghitung ulang skor dari event-event valid yang tersisa.
5. **Penyelesaian Laga:** Saat waktu berakhir atau salah satu tim mencapai set penentu, panitia menekan "Selesaikan Laga"; status berubah menjadi `finished`.

---

## 5.5 Alur 5: Verifikasi Hasil Dua Tahap & Pengesahan Klasemen (Admin)

```
[Laga 'finished'] ──► [Admin Tinjau Timeline & Statistik]
                                  │
                                  ▼
                    [Admin Klik 'Verifikasi Hasil']
                                  │
                                  ▼
                [Status Berubah 'verified' & 'locked=true']
                                  │
                                  ▼
                [Sistem Hitung Ulang Poin Klasemen Resmi]
                                  │
                                  ▼
                [Bagan Gugur Memajukan Tim Pemenang ke Babak Berikutnya]
```

1. **Tinjauan Hasil:** Admin membuka tab verifikasi hasil pada dasbor, memeriksa kesesuaian skor dan kartu.
2. **Pengesahan Resmi:** Admin mengklik tombol "Sahkan & Kunci Pertandingan". Status laga berubah menjadi `verified` dan dikunci permanen (`locked = true`).
3. **Kalkulasi Klasemen:** Sistem memicu fungsi `recalculateStandings()`. Hanya laga berstatus `verified` yang diakumulasikan ke dalam poin, selisih gol, dan rasio set pada tabel klasemen publik.
4. **Propagasi Bagan Gugur:** Jika pertandingan merupakan bagian dari bagan eliminasi (`single_elimination`), pemenang laga otomatis dipropagasikan mengisi slot tim di babak selanjutnya (`next_match_id`).

---

## 5.6 Alur 6: Akses Suporter & Penonton Publik

1. **Akses Langsung:** Penonton membuka portal turnamen melalui URL `/c/[slug]` atau memindai QR code dari tribun. Tidak memerlukan registrasi maupun login.
2. **Pemantauan Live Score:** Pada tab Jadwal, pertandingan yang sedang berlangsung menampilkan lencana `🔴 LIVE` berdenyut, dengan pembaruan angka skor yang masuk secara instan via Web Realtime (< 3 detik).
3. **Pemberitahuan Status:** Jika pertandingan belum disahkan oleh Admin turnamen, skor menyertakan label penjelas *"Belum Resmi"*, menjamin transparansi informasi sebelum pengesahan final.
