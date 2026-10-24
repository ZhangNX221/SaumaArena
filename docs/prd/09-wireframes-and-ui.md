# 09. Desain Antarmuka & Ilustrasi Wireframe (UI/UX Wireframes)

**Dokumen PRD — Bagian 9/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Versi:** 1.0  
**Inspirasi Desain:** Sofascore / Flashscore (Hierarki data padat rapi), Toornament (Dasbor jadwal & bagan), Strava / Nike Training Club (Tema gelap atletik, tipografi tebal `Bebas Neue` & `Teko`).

---

## 9.1 Wireframe 1: Admin Matchday Command Center (`/admin/competitions/[id]`)

Pusat kendali panitia utama untuk memantau seluruh lapangan secara simultan, mengganti status laga (1 ketukan), dan override skor instan.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ [ SAUMA ARENA ]   Turnamen Futsal Pelajar 2026   [🟢 Online • Sinkron]  [🌙] [Profil Admin ▼] │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ ◄ Kembali ke Daftar Kompetisi                                                                │
│                                                                                              │
│ BABAK PENYISIHAN GRUP • GOR FLOBAMORA                                                        │
│ [Ringkasan] [Plotting Jadwal & Juri] [Live Monitor & Override] [Bagan Gugur] [Klasemen Grup] │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ Status Filter: [ Semua (12) ] [ 🔴 Live (2) ] [ Terjadwal (8) ] [ Selesai (2) ]   [🔍 Cari...]│
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────┐ ┌──────────────────────────────────────────┐ │
│ │ Laga #04 • Lapangan A             🔴 LIVE    │ │ Laga #05 • Lapangan B         TERJADWAL  │ │
│ │ Babak 1 (14:22) • Wasit: Yohanes S.          │ │ Mulai: 15:30 WITA • Wasit: Robert M.     │ │
│ ├──────────────────────────────────────────────┤ ├──────────────────────────────────────────┤ │
│ │  SMAN 1 Kupang                 SMA Taruna    │ │  SMA Kristen 1               SMK 2 Kupang│ │
│ │  ┌───────────────┐ ┌─────────┐ ┌───────────┐ │ │  ┌─────────────┐ ┌─────────┐ ┌─────────┐ │ │
│ │  │ [ - ] [ +Poin]│ │  3 - 1  │ │[+Poin] [-]│ │ │  │ [ - ] [+Poin]│ │  0 - 0  │ │[+Poin][-]│ │ │
│ │  └───────────────┘ └─────────┘ └───────────┘ │ │  └─────────────┘ └─────────┘ └─────────┘ │ │
│ │  Foul: 3/5                     Foul: 5/5 ⚠️  │ │  Roster: 12 Atlet            Roster: 10  │ │
│ ├──────────────────────────────────────────────┤ ├──────────────────────────────────────────┤ │
│ │ [✓ Set Selesai]    [Monitor Juri]  [Kustom ⚙]│ │ [▶ Mulai Laga]   [Monitor Juri] [Kustom ⚙]│ │
│ └──────────────────────────────────────────────┘ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────┐ ┌──────────────────────────────────────────┐ │
│ │ Laga #03 • Lapangan A             ✓ SELESAI  │ │ Laga #06 • Lapangan A         TERJADWAL  │ │
│ │ Skor Akhir: 4 - 2 • Disahkan oleh Admin      │ │ Mulai: 16:45 WITA • Wasit: Antonius K.   │ │
│ └──────────────────────────────────────────────┘ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9.2 Wireframe 2: Konsol Mobile Panitia — Model `timed_goals` (Sepakbola & Futsal)

Antarmuka smartphone satu tangan untuk wasit / pencatat meja lapangan di pinggir garis lapangan.

```
┌────────────────────────────────────────┐
│ [◄] Laga #04 • Futsal Putra  [🟢 Sinkron]│
│ GOR Flobamora Lapangan A               │
├────────────────────────────────────────┤
│           BABAK 1 • 14:20              │
│       [⏸ JEDA]   [+1 Menit]            │
├────────────────────────────────────────┤
│    SMAN 1 KUPANG       SMA TARUNA      │
│         3          -        1          │
│                                        │
│    Akumulasi Foul      Akumulasi Foul  │
│      [ ● ● ● ○ ○ ]       [ ● ● ● ● ● ] ⚠️│
│                         (Penalti 10m!) │
├────────────────────────────────────────┤
│ AKSI TIM A (SMAN 1)  │ AKSI TIM B (TARUNA) │
├──────────────────────┼─────────────────┤
│ [ ⚽ + GOL TIM A ]   │ [ ⚽ + GOL TIM B ]│
│ [ 🟨 KARTU KUNING ]  │ [ 🟨 KARTU KUNING]│
│ [ 🟥 KARTU MERAH ]   │ [ 🟥 KARTU MERAH] │
│ [ ⚠️ +1 FOUL ]       │ [ ⚠️ +1 FOUL ]    │
│ [ 🔄 GANTI PEMAIN ]  │ [ 🔄 GANTI PEMAIN]│
│ [ ⏱️ TIMEOUT (1) ]   │ [ ⏱️ TIMEOUT (0) ]│
├────────────────────────────────────────┤
│ TIMELINE PERISTIWA CEPAT:              │
│ • 14' ⚽ Gol: #10 Marselino (SMAN 1)   │
│ • 11' ⚠️ Foul ke-5: #04 Dimas (Taruna) │
│ • 08' 🟨 Kartu: #07 Kevin (Taruna)     │
│ [ ↩️ BATALKAN / VOID EVENT TERAKHIR ]  │
├────────────────────────────────────────┤
│ [ SELESAIKAN BABAK 1 ] [ LAPOR INSIDEN]│
└────────────────────────────────────────┘
```

---

## 9.3 Wireframe 3: Konsol Mobile Panitia — Model `rally_set` (Bola Voli & Bulutangkis)

Desain tombol raksasa ergonomis untuk wasit bulutangkis atau operator voli. Poin dapat dicatat dalam 1 ketukan cepat (<100ms response).

```
┌────────────────────────────────────────┐
│ [◄] Semifinal Bulutangkis Tunggal [🟢] │
│ Match #12 • Lapangan 3                 │
├────────────────────────────────────────┤
│              GAME KE-2                 │
│         (Game 1: 21 - 18)              │
├────────────────────────────────────────┤
│  A. GINTING (SMA 1)   J. CHRISTIE (SMA 2)│
│                                        │
│        19                     20       │
│                                        │
│   [ MATCH POINT ]        [ DEUCE! ]    │
│   (Selisih minimal 2 poin atau cap 30) │
├────────────────────────────────────────┤
│ ┌──────────────────┐ ┌───────────────┐ │
│ │                  │ │               │ │
│ │     +1 POIN      │ │    +1 POIN    │ │
│ │   A. GINTING     │ │  J. CHRISTIE  │ │
│ │    (KIRI)        │ │    (KANAN)    │ │
│ │                  │ │               │ │
│ └──────────────────┘ └───────────────┘ │
├────────────────────────────────────────┤
│ [ ↩️ UNDO POIN ]   [ ⏱️ INTERVAL 60s ] │
├────────────────────────────────────────┤
│ Riwayat Game:                          │
│ • Game 1: 21 - 18 (22 menit) Selesai   │
│ • Game 2: Sedang Berlangsung (19 - 20) │
├────────────────────────────────────────┤
│ [ TUTUP GAME & KUNCI ] [ PINDAH SISI ] │
└────────────────────────────────────────┘
```

---

## 9.4 Wireframe 4: Konsol Mobile Panitia — Model `map_series` (Esport Generik)

Pencatatan seri best-of (BO3 / BO5) turnamen game kompetitif dengan durasi dan skor per map.

```
┌────────────────────────────────────────┐
│ [◄] Grand Final MLBB (BO5)       [🟢] │
│ Stage: Main Event Stage A              │
├────────────────────────────────────────┤
│       EVOS ACADEMY vs RRQ JUNIOR       │
│          SERI SKOR:  2  -  1           │
│         (Butuh 3 Kemenangan)           │
├────────────────────────────────────────┤
│ MAP 1 (Selesai):                       │
│ Pemenang: EVOS ACADEMY (Skor: 18 - 11) │
│ Durasi: 14 menit 10 detik              │
├────────────────────────────────────────┤
│ MAP 2 (Selesai):                       │
│ Pemenang: RRQ JUNIOR (Skor: 09 - 22)   │
│ Durasi: 18 menit 45 detik              │
├────────────────────────────────────────┤
│ MAP 3 (Selesai):                       │
│ Pemenang: EVOS ACADEMY (Skor: 15 - 13) │
│ Durasi: 21 menit 02 detik              │
├────────────────────────────────────────┤
│ MAP 4 (SEDANG BERJALAN):               │
│ Pemenang Map: [ EVOS ▼ ]               │
│ Skor Kills: [ 12 ] vs [ 14 ]           │
│ Durasi (Menit): [ 16 ]                 │
│ [ SIMPAN HASIL MAP 4 ]                 │
├────────────────────────────────────────┤
│ [ SAHKAN HASIL SERI KE ADMIN ]         │
└────────────────────────────────────────┘
```

---

## 9.5 Wireframe 5: Portal Publik Live Score & Kompetisi (`/c/[slug]`)

Tampilan responsif tanpa login untuk penonton publik, suporter, dan jurnalis olahraga.

```
┌────────────────────────────────────────────────────────┐
│ [ SAUMA ARENA ]              Turnamen Antar Pelajar 🔍 │
├────────────────────────────────────────────────────────┤
│ 🏆 PIALA GUBERNUR PELAJAR SE-NTT 2026                 │
│ Futsal Putra • 16 Tim Peserta • GOR Flobamora Kupang   │
├────────────────────────────────────────────────────────┤
│ [ JADWAL ] [ HASIL ] [ KLASEMEN ] [ BAGAN ] [STATISTIK]│
├────────────────────────────────────────────────────────┤
│ 🔴 SEDANG BERLANGSUNG (LIVE)                           │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Babak 2 • Menit 34'           Lapangan A  🔴 LIVE  │ │
│ │                                                    │ │
│ │ SMAN 1 Kupang                     SMA Taruna       │ │
│ │     [ 3 ]                            [ 2 ]         │ │
│ │                                                    │ │
│ │ ⚽ Pencetak Gol:                                   │ │
│ │ 12' Marselino, 24' Rizky      18' Dimas, 31' Kevin │ │
│ │                                                    │ │
│ │ ⚠️ Status: Belum Resmi (Menunggu Verifikasi Admin) │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ 📅 JADWAL PERTANDINGAN HARI INI                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 15:30 WITA • Lapangan B               TERJADWAL    │ │
│ │ SMA Kristen 1 Kupang vs SMK Negeri 2 Kupang        │ │
│ └────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 17:00 WITA • Lapangan A               TERJADWAL    │ │
│ │ SMA Santo Arnoldus vs MAN Model Kupang             │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

## 9.6 Wireframe 6: Bagan Gugur (Single Elimination Bracket)

Visualisasi pohon turnamen dengan propagasi otomatis pemenang pertandingan (`next_match_id`).

```
  PEREMPAT FINAL          SEMIFINAL                FINAL               JUARA
┌────────────────┐
│ SMAN 1 (4)     │───┐
│ SMK 2  (1)     │   │  ┌────────────────┐
└────────────────┘   ├──│ SMAN 1 (3)     │───┐
┌────────────────┐   │  │ SMA Taruna (2) │   │
│ SMA Taruna (2) │───┘  └────────────────┘   │
│ SMA Kencana(0) │                           │  ┌────────────────┐
└────────────────┘                           ├──│ SMAN 1         │─── [ 🏆 TROFI ]
┌────────────────┐                           │  │ SMAN 3         │
│ SMAN 3 (3)     │───┐                       │  └────────────────┘
│ MAN Model (1)  │   │  ┌────────────────┐   │
└────────────────┘   ├──│ SMAN 3 (2)     │───┘
┌────────────────┐   │  │ SMA Santo (1)  │
│ SMA Santo (2)  │───┘  └────────────────┘
│ SMA Ragunan(1) │
└────────────────┘
```
