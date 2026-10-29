# 09. Desain Antarmuka & Ilustrasi Wireframe (UI/UX Wireframes)

**Dokumen PRD — Bagian 9/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Edisi Turnamen:** Milad Matsanega Futsal Competition I (MMFC I) • MTsN 3 Blitar  
**Versi:** 2.0  
**Desain Sistem:** Dual Athletic Sports Theme (Mode Terang: Putih-Biru Sporty Enerjik `#1D63B8`, Border Tegas `#CBD5E1`, Bayangan Halus, Bebas Coklat; Mode Gelap: Emas Royal `#F59E0B` & Midnight Navy `#07131F`). Tipografi: `Bebas Neue`, `Teko`, `Barlow Condensed`, & `Plus Jakarta Sans`.

---

## 9.1 Wireframe 1: Portal Publik — Beranda & Bento Grid Informasi (`/`)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [ SAUMA ARENA • MMFC I ]    [ 🔍 Cari tim atau sekolah kontingen... ]       [ LOGIN PORTAL ] [ DAFTAR] [🌙]│
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [ HERO SPOTLIGHT MMFC I • MTsN 3 BLITAR ]                                                               │
│                                                                                                        │
│  MILAD MATSANEGA FUTSAL COMPETITION I (MMFC I)                ┌───────────────────────────────┐        │
│  ----------------------------------------------               │       [ LOGO RESMI 2026 ]     │        │
│  Turnamen futsal antarpelajar tingkat SD/MI se-derajat        │     MATSANEGA FUTSAL CHAMP.   │        │
│  memperebutkan Piala Bergilir MMFC I & Best Supporter.        └───────────────────────────────┘        │
│                                                                                                        │
│  [📅 3 - 4 November 2026]  [📍 Lapangan Seabless Srengat]  [🏆 14 Tim (4 Grup)]  [⏱️ 2x15 Menit/Laga]   │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [DOCKED SUB-NAVBAR]: [1. INFORMASI] [2. LIVE🔴] [3. JADWAL] [4. GRUP] [5. BRACKET] [6. TIM] [7. STATS]  │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PANDUAN & REGULASI RESMI • FUTSAL                                                                      │
│ INFORMASI & PETUNJUK TEKNIS                                                                            │
│                                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 📄 BUKU PANDUAN RESMI (DISPORA & ASOSIASI FUTSAL)                                                  │ │
│ │ FORMAT PERTANDINGAN FUTSAL & ALUR TURNAMEN                     [ 📥 UNDUH JUKNIS (PDF) • 2.4 MB ] │ │
│ │ 14 Tim dibagi 4 Grup (A, B, C, D) setengah kompetisi.         Edisi Revisi Technical Meeting Resmi │ │
│ └────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                        │
│ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌──────────────────────────────────┐ │
│ │ 30                 [⏱️ WAKTU] │ │ 2              [⚠️ KARTU]    │ │ 1·2·3             [🏆 PENGHARGAAN] │ │
│ │ 2 × 15 MENIT                 │ │ AKUMULASI 2 KARTU            │ │ PIALA BERGILIR & SERTIFIKAT    │ │
│ │ Kotor di Grup • Bersih Gugur │ │ Larangan Tampil 1 Laga Lanjut│ │ Juara 1, 2, 3 • Sepatu Emas    │ │
│ │ Running clock babak grup;    │ │ 2 Kartu kuning di laga beda  │ │ Juara 1-3 piala tetap, sepatu  │ │
│ │ Stop clock babak 4 besar.    │ │ kena sanksi skorsing 1 laga. │ │ emas top scorer, e-sertifikat. │ │
│ │ [GRUP: 2x15M] [FINAL: BERSIH]│ │ [2 KUNING = SKORS] [MERAH=KKM│ │ [PIALA BERGILIR] [E-SERTIFIKAT] │ │
│ └──────────────────────────────┘ └──────────────────────────────┘ └──────────────────────────────────┘ │
│                                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 📍 INFORMASI VENUE & AKSES STADION: LAPANGAN FUTSAL SEABLESS SRENGAT BLITAR  [ 🗺️ BUKA MAPS ]      │ │
│ │ • Gate Barat: Pintu Khusus VIP, Wasit, Atlet & Official Kontingen (Wajib ID Card)                  │ │
│ │ • Gate Timur 1: Pintu Khusus Rombongan Suporter Madrasah (Scan QR Tiket Masuk +1 Poin)              │ │
│ │ • Gate Timur 2: Pintu Masuk Penonton Reguler & Umum                                                 │ │
│ └────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9.2 Wireframe 2: Konsol Tablet Wasit Meja Lapangan (`/?view=referee`)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [◄ DAFTAR LAGA]   KONSOL JURI MEJA • LAPANGAN SEABLESS SRENGAT            [ 🟢 ONLINE • SINKRON ]      │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                PAPAN SKOR & STOPWATCH DIGITAL                                          │
│ ┌────────────────────────────────────┐ ┌─────────────────────┐ ┌─────────────────────────────────────┐ │
│ │ SDI KARDINA MASSA           [TIM A]│ │  WAKTU PERTANDINGAN │ │ [TIM B]                MIN 7 BLITAR │ │
│ │                                    │ │       14:20         │ │                                     │ │
│ │                3                   │ │                     │ │                  1                  │ │
│ │                                    │ │   [ ▶ JALANKAN ]    │ │                                     │ │
│ │  [ - ]        [ + 1 GOL ]          │ │   [ 🔔 BUNYIKAN BEL]│ │   [ - ]         [ + 1 GOL ]         │ │
│ │                                    │ │   [ +1M ]  [RESET]  │ │                                     │ │
│ │ FOUL 3/5: [● ● ● ○ ○]     [+ FOUL] │ └─────────────────────┘ │ FOUL 5/5: [● ● ● ● ●] ⚠️   [+ FOUL] │ │
│ │ TIME-OUT: [ ⏱️ TO DIGUNAKAN (1) ]  │                         │ TIME-OUT: [ ⏱️ AMBIL TIME-OUT (0) ]  │ │
│ │ KARTU: [🟨 KUNING (1)] [🟥 MERAH (0)│                         │ KARTU: [🟨 KUNING (2)] [🟥 MERAH (1)] │ │
│ └────────────────────────────────────┘                         └─────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ RIWAYAT GOL PERTANDINGAN (TIMELINE EVENT)                                                 Total: 4 Gol │
│ • 14' ⚽ SDI KARDINA MASSA: #10 Moch. Farel (Gol Biasa Lapangan)                                       │
│ • 11' ⚠️ MIN 7 BLITAR: Akumulasi Foul ke-5 Tercapai (Second Penalty Aktif)                              │
│ • 08' 🟨 MIN 7 BLITAR: #07 Dwi Cahyo (Kartu Kuning - Pelanggaran Menjegal)                              │
│ • 04' ⚽ SDI KARDINA MASSA: #08 Rizky Pratama (Tendangan Bebas 10M)                                     │
│ • 02' ⚽ MIN 7 BLITAR: #09 Ahmad Zaki (Gol Lapangan)                                                   │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [ ↩️ ANULIR / VOID GOL TERAKHIR ]     [ 📝 FORM PENILAIAN SUPORTER ]      [ ✓ SELESAIKAN & SAHKAN BAP ]│
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9.3 Wireframe 3: Form Penilaian Skor Tribun Suporter Madrasah

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [◄ KEMBALI KE MEJA WASIT]   FORM PENILAIAN TRIBUN SUPORTER MADRASAH                                    │
│ KONSOL JURI • PENILAIAN KONTINGEN SUPORTER TRIBUN MMFC I                                               │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. PILIH SUPORTER SEKOLAH KONTINGEN:                                                                   │
│ [ SDI KARDINA MASSA                                                                                 ▼ ]│
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. KRITERIA POSITIF & KREATIVITAS TRIBUN (+ POIN)                                   Subtotal: +45 Poin │
│ [✓] Kekompakan & Gemuruh Yel-Yel Madrasah (+15 Poin)                                                   │
│ [✓] Atribut, Bendera Raksasa & Seragam Kontingen (+10 Poin)                                            │
│ [✓] Maskot Sekolah & Koreografi Gerak Berirama (+10 Poin)                                              │
│ [ ] Instrumen Musik Akustik / Perkusi Teratur (+10 Poin)                                               │
│ [✓] Kebersihan & Kerapian Tribun Pasca Laga (+15 Poin)                                                 │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. SANKSI PELANGGARAN & KETERTIBAN (- POIN)                                        Pengurangan: 0 Poin │
│ [ ] Penggunaan Flare / Asap / Bahan Berbahaya (-50 Poin)                                               │
│ [ ] Ujaran Kebencian / Nyanyian Provokatif Rasis (-30 Poin)                                            │
│ [ ] Pelemparan Botol / Benda Keras ke Lapangan (-25 Poin)                                              │
│ [ ] Memanjat Pagar Pengaman Tribun Lapangan (-15 Poin)                                                 │
│ [ ] Sampah Berserakan di Area Tribun Suporter (-10 Poin)                                               │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 4. REKAPITULASI NILAI BERSIH:                                                                          │
│ Poin Kehadiran Tiket Gate: +85 Poin  |  Nilai Kreativitas: +45 Poin  |  Sanksi: 0 Poin                 │
│ TOTAL POIN SESI INI: 130 POIN                                                                          │
│ Catatan Juri: "Suporter sangat kompak, koreografi rapi, dan tertib memungut sampah."                  │
│                                                                                                        │
│                                           [ BATAL ]   [ 💾 SIMPAN & KIRIM SKOR KE LEADERBOARD PUBLIK ] │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9.4 Wireframe 4: Berita Acara Pertandingan (BAP) Digital 3 Pihak

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ BERITA ACARA PERTANDINGAN (BAP) DIGITAL • MMFC I 2026                               [ CETAK DOKUMEN 🖨️] │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Pertandingan #01 • Fase Grup A • Lapangan Futsal Seabless Srengat Blitar                               │
│ Waktu: Selasa, 3 November 2026 • 08:00 - 08:35 WIB                                                     │
│                                                                                                        │
│ HASIL AKHIR PERTANDINGAN:                                                                              │
│      SDI KARDINA MASSA (A1)    [ 3 ]   -   [ 1 ]    MIN 7 BLITAR (A2)                                  │
│      (Babak 1: 2 - 1  •  Babak 2: 1 - 0)                                                               │
│                                                                                                        │
│ PENCETAK GOL:                                 PELANGGARAN & DISIPLIN KARTU:                            │
│ • 02' #09 Ahmad Zaki (MIN 7)                  • 08' 🟨 #07 Dwi Cahyo (MIN 7 Blitar)                   │
│ • 04' #08 Rizky Pratama (SDI Kardina)         • Akumulasi Foul Babak 1: Kardina (3) - MIN 7 (5)        │
│ • 14' #10 Moch. Farel (SDI Kardina)           • Akumulasi Foul Babak 2: Kardina (2) - MIN 7 (3)        │
│ • 26' #10 Moch. Farel (SDI Kardina)           • Time-Out: Kardina (Babak 1), MIN 7 (Babak 2)           │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PENGESAHAN & TANDA TANGAN DIGITAL TIGA PIHAK:                                                          │
│                                                                                                        │
│       WASIT UTAMA 1                  WASIT UTAMA 2              PENGAWAS PERTANDINGAN (PP)             │
│   [ ✍️ TERTANDATANGANI ]        [ ✍️ TERTANDATANGANI ]             [ ✍️ TERTANDATANGANI ]               │
│   Yohanes S., S.Pd (Blitar)     Budi Santoso (Kediri)          Ust. H. Syamsul Arifin, M.Pd            │
│   Kode Verifikasi: #BAP-8491    Kode Verifikasi: #BAP-8492     Status: RESMI DISAHKAN & DIKUNCI        │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9.5 Wireframe 5: Admin Arena Dashboard Centered (`/?view=admin`)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [ SAUMA ARENA • ADMIN ]    RINGKASAN UTAMA                        [ 🌙 MODE ]  [ UST. SYAMSUL (SUPER) ▼]│
├──────────────┬─────────────────────────────────────────────────────────────────────────────────────────┤
│ [SIDEBAR]    │ ◄ CONTAINER UTAMA SIMETRIS TERPUSAT (max-w-7xl mx-auto px-6 py-7)                      │
│              │                                                                                         │
│ 📊 BERANDA   │ ┌─────────────────────────────────────────────────────────────────────────────────────┐ │
│ • Ringkasan  │ │ BERANDA • RINGKASAN HARI INI                                                        │ │
│ • Medali     │ │ RINGKASAN TURNAMEN & KLASEMEN PEROLEHAN MEDALI                                      │ │
│              │ └─────────────────────────────────────────────────────────────────────────────────────┘ │
│ ⚙️ PERSIAPAN  │                                                                                         │
│ • Kompetisi  │ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────────────────────┐ │
│ • Cabor      │ │TOTAL KONTINGEN│ │TOTAL LAGASAH │ │LAGA BERJALAN  │ │PUNCAK KLASEMEN MEDALI         │ │
│ • Kategori   │ │ 14 Tim        │ │ 17 Laga       │ │ 3 - 1         │ │ SDI KARDINA MASSA           │ │
│ • Lapangan   │ │ 146 Atlet     │ │ 14 Grup, 3 Gug│ │ Menit 14 LIVE │ │ 1 Emas • 0 Perak • 0 Pgg    │ │
│              │ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────────────────────┘ │
│ 👥 PESERTA   │                                                                                         │
│ • Verifikasi │ ┌──────────────────────────────────────┐ ┌────────────────────────────────────────────┐ │
│ • Data Atlet │ │ DISTRIBUSI TOTAL GOL PER KONTINGEN   │ │ DISTRIBUSI WAKTU MENIT TERCIPTANYA GOL     │ │
│ • Tim/Sekolah│ │ [ GRAFIK BATANG GOL TIM A S/D TIM D ]│ │ [ GRAFIK GARIS MENIT 1-10, 11-20, 21-30 ]  │ │
│              │ └──────────────────────────────────────┘ └────────────────────────────────────────────┘ │
│ ⚽ LAGA       │                                                                                         │
│ • Drawing    │ KLASEMEN PEROLEHAN MEDALI KONTINGEN (1-TAP STEPPER)              [ + TAMBAH KONTINGEN ] │
│ • Jadwal     │ ┌───────┬───────────────────────────┬─────────────┬─────────────┬─────────────┬───────┐ │
│ • Override   │ │ Pering│ Kontingen Sekolah         │  Emas (1-Tap│ Perak (1-Tap│ Perunggu    │ Total │ │
│ • Verif BAP  │ ├───────┼───────────────────────────┼─────────────┼─────────────┼─────────────┼───────┤ │
│              │ │  🥇 1 │ SDI KARDINA MASSA         │ [ - ] 1 [ +]│ [ - ] 0 [ +]│ [ - ] 0 [ +]│   1   │ │
│ 🎫 TIKET     │ │  🥈 2 │ MIN 7 BLITAR              │ [ - ] 0 [ +]│ [ - ] 1 [ +]│ [ - ] 0 [ +]│   1   │ │
│ • Kuota      │ │  🥉 3 │ UPT SDN 1 SRENGAT         │ [ - ] 0 [ +]│ [ - ] 0 [ +]│ [ - ] 1 [ +]│   1   │ │
│ • Scanner    │ └───────┴───────────────────────────┴─────────────┴─────────────┴─────────────┴───────┘ │
│ • Best Supp  │                                                                                         │
│              │                                                                                         │
│ 🛠️ SISTEM    │                                                                                         │
│ • Akun User  │                                                                                         │
│ • Waktu Laga │                                                                                         │
│ • Banner     │                                                                                         │
│ • Backup/Rest│                                                                                         │
│ • Laporan PDF│                                                                                         │
└──────────────┴─────────────────────────────────────────────────────────────────────────────────────────┘
```
