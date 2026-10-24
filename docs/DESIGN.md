# Sauma Arena — Design Direction

**Produk:** Sauma Arena  
**Versi:** 1.0.0  
**Tanggal:** 19 Oktober 2026  
**Status:** Draft, siap untuk implementasi  

---

## Design Read

> Reading this as: **tournament management dashboard & public-facing event app** for **community sports organizers, amateur athletes, and local spectators in Indonesia**, in a **bold-athletic visual language with high-contrast outdoor readability**, dial **ENERGY 2 / RHYTHM 2 / MOTION 2**.

**Mode:** Operate (admin menyelesaikan task), Persuade (halaman publik turnamen)

---

## 1. Design Philosophy

### Prinsip Inti

1. **Outdoor-Ready** — Antarmuka dirancang untuk readability di bawah sinar matahari (high contrast, warna solid, ukuran teks memadai).  
   *Alasan: admin menginput skor dari pinggir lapangan, penonton check-in di luar ruangan.*

2. **Mobile-First, Laptop-Enhanced** — Setiap komponen dimulai dari layar 320px. Desktop adalah bonus, bukan keharusan.  
   *Alasan: 80%+ pengguna target mengakses via smartphone Android mid-range.*

3. **Data Clarity** — Angka, skor, dan status harus terbaca dalam 1 detik tanpa ambiguitas. Tidak ada dekorasi yang mengganggu data.  
   *Alasan: matchday menuntut keputusan cepat berdasarkan data yang akurat.*

4. **Athletic, Not Corporate** — Identitas visual yang energik dan sporty, tanpa jatuh ke estetika korporat yang steril.  
   *Alasan: konteks produk adalah kompetisi olahraga komunitas, bukan SaaS enterprise.*

---

## 2. Color Tokens

### 2.1 Dual Theme Strategy

Identitas visual Sauma Arena mengusung perpaduan dinamis:
- **Mode Gelap:** **Emas Royal (`#F6AE2D` / `#F59E0B`)** dan **Biru Gelap (`#07131F` / `#0D1E30`)** untuk atmosfer malam stadion yang megah, sporty, royal, challenging, dan kompetitif.
- **Mode Cerah:** **Putih-Biru (`#FFFFFF`, `#F4F8FD`, dan `#1D63B8`)** yang disesuaikan agar terasa sporty, fresh, penuh semangat, dan ringan untuk pertandingan siang hari.

| Token | Mode Cerah | Mode Gelap | Peran | Alasan & Karakteristik |
|:------|:-----------|:-----------|:------|:-----------------------|
| `--arena-primary` | `#1D63B8` (Fresh Royal Blue) | `#2563EB` (Electric Royal Blue) | Aksi primer, navigasi aktif, status verified | Biru atletik penuh energi dan ketangkasan olahraga kompetitif. Kontras tajam terhadap putih segar (cerah) dan biru malam pekat (gelap). |
| `--arena-accent` | `#F59E0B` (Trophy Gold) | `#F6AE2D` (Emas Royal Murni) | Aksen juara, piala, badge rating, tombol wasit | Warna emas kejuaraan, trofi prestisius, dan status hot. Memancarkan aura royal dan kompetitif di mode gelap. |
| `--bg-page` | `#F4F8FD` (Putih Sejuk) | `#07131F` (Midnight Stadium Navy) | Latar belakang halaman | Sejuk dan fresh di siang hari; megah, maskulin, dan fokus di malam hari. |
| `--bg-surface` | `#FFFFFF` (Putih Bersih) | `#0D1E30` (Pitch Carbon Navy) | Kontainer kartu, modul, tabel | Memberikan batas visual bersih dengan bayangan lembut (light) atau garis neon stadion (dark). |
| `--text-main` | `#0C2340` (Navy Atletik) | `#F8FAFC` (Chalk White) | Teks utama & heading | Memenuhi standar WCAG AAA outdoor readability tanpa warna hitam/abu-abu kusam. |

### 2.2 Semantik

| Token | Hex | Penggunaan |
|:------|:----|:-----------|
| `--status-verified` | `var(--arena-primary)` | Status terverifikasi sah, tiket valid, peserta lolos |
| `--status-pending` | `var(--arena-accent)` | Menunggu verifikasi berkas, jadwal tanding mendatang |
| `--status-rejected` | `#EF4444` | Ditolak, tiket tidak valid, kartu merah, sanksi pelanggaran |
| `--status-used` | `#64748B` | Tiket sudah digunakan, pertandingan selesai |

### 2.3 Light Mode (Putih-Biru: Sporty, Fresh, Semangat, Ringan)

```css
:root {
  --arena-primary: #1D63B8;         /* Energetic Fresh Royal Blue */
  --arena-primary-hover: #154D92;
  --arena-primary-light: #EBF3FC;

  --arena-accent: #F59E0B;          /* Trophy Gold */
  --arena-dark: #0C2340;

  --bg-page: #F4F8FD;               /* Putih kebiruan sangat sejuk & ringan */
  --bg-surface: #FFFFFF;            /* Putih bersih kristal */
  --bg-surface-elevated: #FFFFFF;
  --bg-muted: #E8F1FA;              /* Pill segar & tombol sekunder */

  --text-main: #0C2340;             /* Navy atletik pekat (outdoor-ready) */
  --text-muted: #436382;            /* Slate-blue segar */
  --text-faint: #7597B8;

  --border-subtle: #D2E3F2;          /* Garis batas biru muda bersih */
  --border-field: rgba(29, 99, 184, 0.25);

  --shadow-card: 0 1px 4px rgba(12, 35, 64, 0.05);
  --shadow-elevated: 0 4px 16px rgba(12, 35, 64, 0.09);
}
```

### 2.4 Dark Mode (Emas Royal & Biru Gelap: Sporty, Royal, Challenging, Kompetitif)

```css
html.dark {
  --arena-primary: #2563EB;         /* Biru Elektrik Royal */
  --arena-primary-hover: #1D4ED8;
  --arena-primary-light: #12273D;

  --arena-accent: #F6AE2D;          /* Emas Royal Murni */
  --arena-accent-hover: #E59A16;
  --arena-gold-glow: rgba(246, 174, 45, 0.35);

  --arena-dark: #07131F;            /* Midnight Stadium Arena Navy */

  --bg-page: #07131F;               /* Biru Gelap Stadion Malam */
  --bg-surface: #0D1E30;            /* Pitch Carbon Navy Surface */
  --bg-surface-elevated: #13273D;
  --bg-muted: #1A334E;              /* Inset Biru Stadion */

  --text-main: #F8FAFC;             /* Chalk White Tajam */
  --text-muted: #9AB3CC;            /* Metallic Stadium Blue-Gray */
  --text-faint: #63819F;

  --border-subtle: #1C3B5B;         /* Garis batas malam kokoh */
  --border-field: rgba(246, 174, 45, 0.4); /* Garis aksen emas royal */

  --shadow-card: 0 2px 6px rgba(0, 0, 0, 0.5);
  --shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.7);
}
```

---

## 3. Typography

### Font Selection: Kategori Sports / Athletic Display

Typography Sauma Arena didesain dengan perpaduan tipografi atletik berperforma tinggi (Sports / Athletic Display) yang memiliki karakter kuat, tebal, dan bernuansa kompetitif untuk branding, papan skor, jadwal, dan aksi turnamen:

| Peran Tipografi | Font Family | Karakter & Kesan | Penggunaan Terbaik di Sauma Arena |
|:----------------|:------------|:-----------------|:-----------------------------------|
| **Judul, Skor & Statistik** | **Teko** (Google Fonts, 400-700) | Sans-serif condensed (memanjang ke atas), tegas, berenergi, modern, dan sangat hemat ruang horizontal. | Judul aplikasi (`SAUMA ARENA`), nama turnamen hero banner, nomor punggung/statistik, papan skor (scoreboard), dan timer wasit. |
| **Header, Poster & CTA** | **Bebas Neue** (Google Fonts, 400 All-Caps) | Bersih, gagah, kapital semua (all-caps), profesional, kokoh, dan berwibawa. | Header section tab, tombol aksi utama / Call to Action (`Beli Tiket`, `Pendaftaran Tim`, `Poin +1`), dan poster turnamen. |
| **Nama Tim & Jadwal** | **Barlow Condensed** (Google Fonts, 400-700) | Terinspirasi tipografi utilitas jalan raya, sudut sedikit melengkung namun tetap tajam, fungsional, dinamis, dan industrial. | Nama kontingen/tim di bracket & jadwal laga, info waktu/lapangan, badge kategori olahraga (`Turnamen Olahraga`, `SD / MI`), dan filter bar. |
| **Body & Readability Data** | **Inter** (Google Fonts, 400-500) | Geometrik neo-grotesque dengan tabular figures bawaan, readability tinggi di layar smartphone luar ruangan. | Paragraf deskripsi turnamen, label form input, petunjuk juri, dan teks konten reguler. |

### Type Scale

| Level | Size | Weight / Font | Line Height | Penggunaan |
|:------|:----:|:--------------|:-----------:|:-----------|
| Scoreboard Large | 4.5rem - 6rem (72-96px) | 700 / Teko | 1.0 | Papan skor wasit (Referee Match Center) & Timer laga |
| Display Hero | 3rem - 4.5rem (48-72px) | 700 / Teko | 1.05 | Judul turnamen di hero header publik & skor pertandingan |
| H1 Section | 1.75rem - 2.25rem (28-36px) | 400 / Bebas Neue | 1.15 | Judul tab publik & judul modul back-office |
| H2 Sub-Header | 1.25rem - 1.5rem (20-24px) | 400 / Bebas Neue | 1.2 | Header babak (Perempat Final, Semifinal, Final), grup |
| Team Label | 1rem - 1.125rem (16-18px) | 700 / Barlow Condensed | 1.25 | Nama tim di bracket, jadwal laga, dan kartu tim |
| CTA Button | 0.875rem - 1rem (14-16px) | 400 / Bebas Neue | 1.0 | Tombol aksi utama (Beli Tiket, Pendaftaran Tim) |
| Body | 0.875rem - 1rem (14-16px) | 400 / Inter | 1.5 | Teks deskripsi, rincian aturan turnamen |
| Badge / Pill | 0.75rem (12px) | 700 / Barlow Condensed | 1.2 | Kategori cabor, status verifikasi, pill grup |

---

## 4. Spacing & Layout

### Grid Base: 4px

Semua spacing kelipatan 4px. Nilai yang digunakan: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.  
*Alasan: konsistensi pixel-perfect di berbagai densitas layar.*

### Layout Constants

| Token | Value | Alasan |
|:------|:-----:|:-------|
| `--sidebar-width` | 256px | Cukup untuk navigasi turnamen tanpa scrollbar horizontal |
| `--sidebar-collapsed` | 56px | Icon-only rail untuk tablet landscape |
| `--header-height` | 56px | Standar mobile header, konsisten dengan SaumaDrive |
| `--bottom-nav-height` | 56px + safe-area | Navigasi utama di mobile |
| `--max-content-width` | 1280px | Mencegah baris tabel terlalu panjang di monitor ultra-wide |

### Border Radius

| Token | Value | Penggunaan | Alasan |
|:------|:-----:|:-----------|:-------|
| `--radius-sm` | 4px | Badge, status pill | Subtle rounding untuk elemen kecil |
| `--radius-md` | 8px | Kartu, input, dropdown | Radius standar, konsisten |
| `--radius-lg` | 12px | Modal, panel besar | Membedakan kontainer besar dari elemen kecil |
| `--radius-full` | 9999px | Avatar peserta/tim | Hanya untuk elemen yang semantiknya bulat |

*Tidak semua elemen pill-shaped (R-11). Radius bervariasi sesuai hierarki visual.*

---

## 5. Component Direction

### Bracket Visualization

- Tree diagram horizontal (desktop) atau vertikal (mobile)
- Garis connector menggunakan `--arena-blue` (`#33658A`) dengan opacity 40% (belum tanding) dan 100% (sudah tanding)
- Slot pemenang ditandai background `--arena-accent` (`#F6AE2D`) tipis (10% opacity), bukan glow (R-13)
- Skor ditampilkan dalam angka besar (Display size), nama tim dalam H3
- *Alasan: bracket adalah focal point utama halaman kompetisi*

### Klasemen Table

- Tabel sederhana, bukan kartu grid (R-14)
- Kolom angka menggunakan tabular nums (Inter)
- Baris tim yang lolos mendapat left border 3px `--arena-blue` (`#33658A`)
- Baris posisi 1 mendapat ikon mahkota `--arena-accent` (`#F6AE2D`) (bukan badge capsule)
- *Alasan: tabel klasemen harus scannable dalam 2 detik*

### Tiket QR

- Kartu vertikal dengan QR code sebagai focal point (ukuran minimal 200x200px)
- Informasi: nama turnamen, pertandingan, tanggal, waktu, nomor tiket
- Background kartu: putih solid (tidak gradient), agar QR scannable di segala kondisi cahaya
- Status indikator: bar warna penuh di top edge (biru valid, merah expired, abu digunakan)
- *Alasan: QR harus bisa di-scan dalam 2 detik di outdoor*

### Scanner View

- Fullscreen camera view, overlay frame QR di tengah
- Hasil validasi: banner besar (biru/merah/kuning) yang muncul 2 detik setelah scan
- Teks hasil: ukuran Display, kontras tinggi, bisa dilihat dari jarak 1 meter
- *Alasan: petugas pintu memindai dengan satu tangan sambil mengatur antrean*

### E-Sertifikat

- Template landscape A4 (2480x3508px @ 300dpi horizontal)
- Elemen wajib: nama peserta, nama turnamen, kategori, peringkat, tanggal, QR verifikasi, tanda tangan digital admin
- Desain: formal tapi sporty, border `--arena-blue` (`#33658A`), aksen `--arena-accent` (`#F6AE2D`) pada elemen peringkat
- *Alasan: sertifikat perlu terlihat resmi untuk keperluan portofolio dan verifikasi institusional*

### Public Tab Bar Navigation (Sesuai Lampiran 1)

- Floating capsule tab bar horizontal melengkung (`--radius-full`) di bagian atas portal publik
- Tab aktif: pill solid berwarna dengan ikon dan teks kontras tinggi (tab aktif menggunakan background Biru Tegas `#33658A` penuh, teks putih tebal)
- Tab tidak aktif: background transparan, teks abu-abu netral, hover background halus (5% opacity)
- Scrollable horizontal dengan indikator geser halus pada layar smartphone (360px - 480px)
- Urutan 7 Tab Publik:
  1. `[ (i) Info ]`
  2. `[ Tim Peserta ]` (ikon Users)
  3. `[ Jadwal ]` (ikon Calendar)
  4. `[ Klasemen ]` (ikon ListOrdered)
  5. `[ Bracket ]` (ikon GitBranch)
  6. `[ Statistik ]` (ikon Activity / Flame)
  7. `[ Skor Suporter ]` (ikon Megaphone / Trophy)
- *Alasan: navigasi instan satu sentuhan tanpa reload halaman untuk penonton di tribun*

### Supporter Scoring Table & Badges (Sesuai Lampiran 2)

- Kartu rincian poin suporter menggunakan estetika papan pengumuman stadion kontras tinggi:
  - Header kartu: Label tebal "SUPPORTER / KLASEMEN BEST SUPPORTER"
  - Bar Poin Positif (+): Kartu putih bersih dengan label teks hitam tegas di kiri, dan badge kotak Biru Gelap / Navy di kanan:
    - Membentang Koreografi: Badge `+25`
    - Membawa Maskot Sekolah: Badge `+20`
    - Menggunakan Seragam Supporter: Badge `+15`
    - Menyanyikan Yel-Yel Minimal 3: Badge `+10`
    - Jumlah Tiket Penonton: Badge `+1` (per tiket check-in)
  - Bar Penalti Pelanggaran (-): Kartu putih bersih dengan badge kotak Merah Peringatan (`#DC2626`) di kanan:
    - Membuat Kericuhan, Kekerasan dll: Badge `-50`
    - Melempar Benda ke Dalam Lapangan: Badge `-25`
    - Melakukan Rasis / Provokasi: Badge `-15`
    - Menyelundupkan Barang yang Dilarang: Badge `-5`
- Tabel Utama Klasemen Suporter:
  - Peringkat 1 mendapatkan penanda mahkota emas (`--arena-accent`)
  - Kolom Poin Positif, Kolom Penalti Minus, dan Total Skor Akhir (huruf tebal ukuran Display)
- *Alasan: rincian poin harus terbaca jelas dari kejauhan dan membedakan secara tegas antara apresiasi kreativitas dan sanksi pelanggaran*

---

## 6. Motion & Animation

**Dial: MOTION 2 (Balanced)**  
*Alasan: cukup hidup untuk memberi feedback interaksi, tidak berlebihan untuk konteks data-heavy.*

| Animation | Duration | Easing | Penggunaan | Alasan |
|:----------|:--------:|:------:|:-----------|:-------|
| Hover state | 150ms | ease-out | Button, card, nav item | Feedback interaksi standar |
| Page transition | 200ms | ease-in-out | Navigasi antar halaman | Kontinuitas visual |
| Score update | 300ms | ease-out | Angka skor berubah di bracket/klasemen | Menarik perhatian ke perubahan data |
| QR scan result | 400ms | spring | Banner hasil validasi muncul | Feedback yang jelas dan tegas untuk keputusan akses |
| Modal enter | 250ms | ease-out | Dialog konfirmasi, detail pertandingan | Standar dialog |
| Toast notification | 200ms + 3s display | ease-in | Notifikasi perubahan jadwal, skor update | Informasi transien |

**Tidak ada:**
- Parallax scroll (R-19: tidak ada tujuan UX di dashboard)
- Floating/bouncing elements (R-19: mengganggu readability data)
- Entrance animation pada setiap card (R-19: MOTION 2 bukan 3)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Iconography

**Library:** Lucide React (tree-shakeable).  
*Alasan pemilihan (R-04): Lucide dipilih bukan sebagai default AI, tetapi karena konsistensi dengan SaumaDrive dan dukungan tree-shaking yang mengurangi bundle size. Setiap ikon dipilih berdasarkan relevansi konten, bukan kesamaan gaya.*

| Konteks | Ikon | Alasan Relevansi |
|:--------|:-----|:-----------------|
| Turnamen | `Trophy` | Simbol kompetisi, langsung dikenali |
| Jadwal | `Calendar` | Standar universal untuk jadwal |
| Klasemen | `BarChart3` | Representasi peringkat/data |
| Bracket | `GitBranch` (rotated) | Percabangan visual yang mewakili struktur bracket |
| Tiket | `Ticket` | Langsung mewakili fungsi |
| Sertifikat | `Award` | Simbol penghargaan |
| Scanner | `ScanLine` | Representasi aksi scanning |
| Registrasi | `UserPlus` | Aksi menambah peserta |

**Ukuran:**
- 16px: inline text
- 20px: navigasi, item list
- 24px: header action
- 32px: empty state, onboarding

---

## 8. Responsive Behavior

| Komponen | < 640px (Mobile) | 640-1023px (Tablet) | >= 1024px (Desktop) |
|:---------|:-----------------|:--------------------|:--------------------|
| Sidebar | Hidden, bottom nav | Icon rail (56px) | Full (256px) |
| Bottom Nav | Visible (5 tab) | Hidden | Hidden |
| Bracket | Vertikal scroll | Horizontal scroll | Horizontal, full view |
| Klasemen | Horizontal scroll pada tabel | Full table | Full table |
| Kartu pertandingan | Stack vertikal, full width | 2 kolom | 3 kolom |
| Modal | Bottom sheet, 90vh max | Centered, 560px max | Centered, 560px max |
| QR Tiket | Full width card | Centered 400px | Centered 400px |
| Touch target | >= 48px | >= 44px | >= 36px |

---

## 9. Identity Motif

**Motif: Garis Lapangan (Field Line)**

Satu elemen visual yang diulang secara konsisten sebagai penanda identitas Sauma Arena:

- Garis horizontal tipis (1px, `--arena-blue` / `#33658A`, opacity 25%) sebagai separator antar section, menggantikan shadow atau border tebal
- Pada header halaman: dua garis paralel (seperti garis tengah lapangan) di bawah judul halaman
- Pada bracket connector: garis solid yang menghubungkan slot pertandingan

*Alasan: garis lapangan adalah elemen paling universal di semua cabang olahraga. Subtil tapi spesifik. Tidak bisa diklaim milik produk lain.*

---

## 10. Anti-Patterns (Hal yang Dihindari)

| Yang Dihindari | Alasan |
|:---------------|:-------|
| Gradient background penuh | Tidak ada tujuan hierarki (R-01). Background solid lebih readable di outdoor. |
| Glassmorphism pada kartu dan navbar | Mengurangi kontras di outdoor (R-10). |
| Glow pada badge skor | Skor harus sharp, bukan blurry (R-13). |
| Dark mode sebagai default | Penggunaan utama outdoor siang hari (R-21). |
| Badge "Live" dengan animasi pulse berlebihan | Cukup dot kecil `--status-verified` yang berkedip pelan (R-09, R-19). |
| Skeleton preview sebagai screenshot produk | Produk belum dibangun, tidak ada screenshot yang bisa ditampilkan. |
| Testimonial atau statistik pengguna | Belum ada data nyata (R-17, R-18, R-38). |

---

## 11. Guardrails

1. **Tidak boleh** menampilkan data tanpa state lengkap: empty, loading, error (R-27)
2. **Tidak boleh** menggunakan warna di luar token yang didefinisikan di atas
3. **Tidak boleh** menambah font baru tanpa alasan tertulis
4. **Tidak boleh** menambah animasi tanpa tujuan UX yang ditulis
5. **Harus** memverifikasi kontras WCAG AA sebelum menambah token warna baru
6. **Harus** test di 3 viewport: 375px (iPhone SE), 768px (iPad), 1440px (Desktop)
7. **Harus** test di outdoor (brightness max) untuk readability
8. **Harus** menyediakan toggle dark/light mode yang berfungsi di kedua arah (R-34)
