# 08. Spesifikasi Arsitektur Perangkat Lunak (Software Architecture PRD)

**Dokumen PRD: Bagian 8/8**  
**Produk:** Sauma Arena  
**Tanggal:** 19 Oktober 2026  
**Referensi:** [00-index.md](./00-index.md) | [04-functional-specs.md](./04-functional-specs.md) | [06-non-functional-requirements.md](./06-non-functional-requirements.md)

---

## 8.1 Gambaran Umum & Kebutuhan Arsitektur

Dokumen ini menetapkan cetak biru (*blueprint*) arsitektur perangkat lunak untuk Sauma Arena. Target utama arsitektur ini adalah:
1. **Fullstack Node.js:** Seluruh lapisan aplikasi (antarmuka, API server, logika bisnis, dan pekerja latar belakang) berjalan dalam satu ekosistem Node.js/TypeScript yang kohesif.
2. **Ringan & Nyaman di Akses Mobile:** Waktu muat awal (*Initial Load*) di bawah 1.5 detik pada ponsel Android kelas menengah dengan jaringan 3G/4G di dalam gedung olahraga (GOR).
3. **Skalabilitas Ribuan Klien Lancar (Concurrency):** Mampu melayani **5.000 hingga 10.000 pengguna aktif serentak** yang memantau skor pertandingan dan skor suporter tanpa lonjakan beban memori atau kemacetan (*bottleneck*) basis data.

---

## 8.2 Evaluasi & Komparasi Framework Fullstack Node.js

Untuk memilih framework Node.js yang paling tepat, dilakukan perbandingan terhadap empat kandidat arsitektur fullstack:

| Kriteria Evaluasi | SvelteKit (Node.js) | Next.js 15 (App Router) | Nuxt 3 (Nitro Engine) | Fastify + Vite SPA |
|:------------------|:-------------------:|:-----------------------:|:--------------------:|:------------------:|
| **Ukuran Bundle Client (Hydration)** | **Sangat Ringan (~15 - 25 KB)** | Sedang (~85 - 130 KB) | Ringan (~45 - 65 KB) | Ringan (~50 - 70 KB) |
| **Virtual DOM Overhead** | **Nol (Kompilasi Murni)** | Ada (React Virtual DOM) | Ada (Vue Virtual DOM) | Tergantung framework |
| **Konsumsi RAM Server (Baseline)** | **~35 - 50 MB** | ~120 - 200 MB | ~50 - 80 MB | **~25 - 40 MB** |
| **Throughput SSR (RPS per core)** | **Tinggi (~3.200 req/s)** | Menengah (~1.400 req/s) | Tinggi (~2.800 req/s) | **Sangat Tinggi (~4.500 req/s)** |
| **Kenyamanan Mobile (Low-end CPU)** | **Sangat Mulus (Zero VDOM)** | Cukup Mulus | Mulus | Mulus |
| **Pengelolaan Monorepo / Kode** | Terpadu (1 codebase) | Terpadu (1 codebase) | Terpadu (1 codebase) | Terpisah (Frontend + API) |
| **Dukungan Server-Sent Events (SSE)** | Native Web Standards | Native Route Handlers | Native EventStream | Plugin Fastify SSE |

### Rekomendasi Framework Resmi

Berdasarkan kebutuhan utama pengguna (ringan, nyaman di mobile, dan stabil untuk ribuan koneksi):

#### Rekomendasi 1 (Pilihan Terbaik untuk Performa & Ringan): **SvelteKit + Node.js Adapter**
- **Mengapa SvelteKit?**
  1. *Zero Virtual DOM:* Svelte mengompilasi komponen langsung menjadi JavaScript imperatif kecil. Pada ponsel berspesifikasi rendah di lokasi turnamen, antarmuka tidak mengalami lag ketikan atau keterlambatan rendering saat skor berubah.
  2. *Ukuran File Terkecil:* Hanya 15-20 KB JavaScript awal yang dikirim ke penonton di tribun, sangat hemat kuota data seluler.
  3. *Konsumsi Memori Server Minimal:* Menggunakan memori RAM 3x lebih hemat dibanding Next.js saat menangani ribuan koneksi streaming skor simultan.

#### Rekomendasi 2 (Pilihan Alternatif untuk Ekosistem & Tim React): **Next.js 15 (App Router) dengan Standalone Output + Tailwind CSS v4**
- **Mengapa Next.js?**
  1. *Ekosistem Komponen Matang:* Tersedia pustaka komponen antarmuka yang sangat luas (Lucide, Radix, Tailwind v4).
  2. *Optimasi Lanjutan:* Menggunakan mode `output: 'standalone'` untuk meminimalkan ukuran Docker image, ditambah arsitektur *Route Handlers Streaming* untuk distribusi live score.

> **Keputusan Arsitektur:** Arsitektur backend dan data Sauma Arena dirancang bersifat agnostik terhadap framework antarmuka (*decoupled business logic*). Rekomendasi bawaan yang diterapkan dalam PRD ini menggunakan pola **Node.js TypeScript Fullstack** yang mengutamakan **SvelteKit** atau **Next.js 15 Standalone** dengan antarmuka web standar (Fetch API, Streams API, dan Server-Sent Events).

---

## 8.3 Cetak Biru Arsitektur Tingkat Tinggi (High-Level Architecture)

```
                       [ PENGUNJUNG DI VENUE & ONLINE ]
                       ├── Smartphone Suporter (Mobile Web / PWA)
                       ├── Laptop Panitia / Admin Dashboard
                       └── Tablet Petugas Meja (Scorer & Juri)
                                      │
                                      ▼
                      ┌───────────────────────────────┐
                      │    CLOUDFLARE EDGE CDN        │
                      │  - SSL/TLS 1.3 Termination    │
                      │  - DDoS Protection & WAF      │
                      │  - Edge Static Asset Caching  │
                      └───────────────┬───────────────┘
                                      │
                                      ▼
                      ┌───────────────────────────────┐
                      │    REVERSE PROXY (CADDY/NGINX)│
                      │  - HTTP/2 Multiplexing        │
                      │  - Gzip / Brotli Compression  │
                      │  - WebSocket / SSE Streaming  │
                      └───────────────┬───────────────┘
                                      │
                                      ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                    NODE.JS FULLSTACK APPLICATION RUNTIME                    │
 ├─────────────────────────────────────────┬───────────────────────────────────┤
 │         ZONA PUBLIK (OPEN ACCESS)       │      ZONA ADMIN (RBAC PROTECTED)  │
 │  Route: /event/[slug]/*                 │      Route: /admin/*              │
 ├─────────────────────────────────────────┼───────────────────────────────────┤
 │ • 7 Tab Navigasi Publik:                │ • Autentikasi: JWT Cookie HttpOnly│
 │   - Info & Regulasi (SSG/ISR)           │ • Modul Kelola Turnamen & Cabor   │
 │   - Tim Peserta & Roster                │ • Verifikasi Berkas & Roster Lock │
 │   - Jadwal & Live Score Real-time       │ • Live Matchday Scorer Controller │
 │   - Klasemen Grup Otomatis              │ • Form Penilaian Juri Suporter    │
 │   - Bagan Gugur (Bracket)               │ • Operator Gate QR Ticket Scanner │
 │   - Statistik Top Skor / Kartu          │ • E-Sertifikat Batch Generator    │
 │   - Tabel Skor Suporter                 │                                   │
 ├─────────────────────────────────────────┴───────────────────────────────────┤
 │                       CORE APPLICATION SERVICES LAYER                       │
 │  - TournamentService      - StandingsEngine (Tiebreaker Resolver)           │
 │  - ScheduleService        - BracketEngine (Binary Tree & Bye)               │
 │  - MatchControlService    - SupporterScoringEngine (+Poin & -Penalti)       │
 │  - TicketingGateService   - CertificateEngine (Vector PDF & SHA-256)        │
 │  - ModularSportRuleEngine (Futsal & Sepak Bola Active, Extensible)          │
 ├─────────────────────────────────────────────────────────────────────────────┤
 │                       REALTIME BROADCAST ENGINE (SSE)                       │
 │  - Server-Sent Events (SSE) Channel Hub                                     │
 │  - In-Memory Fanout Broadcast (Pub/Sub Event Bus)                           │
 └──────────────────────────────┬──────────────────────────────────────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
   ┌───────────────────────────┐ ┌───────────────────────────┐
   │ DATABASE RELASIONAL       │ │ IN-MEMORY CACHE (VALKEY)  │
   │ PostgreSQL / SQLite (WAL) │ │ - Cached Standings & Live │
   │ Menggunakan Drizzle/Prisma│ │ - Rate Limiter Counter    │
   └───────────────────────────┘ └───────────────────────────┘
```

---

## 8.4 Strategi Menangani Ribuan Klien Lancar (High-Concurrency Engine)

Tantangan utama aplikasi turnamen adalah saat pertandingan semifinal atau final: **ribuan penonton memantau layar ponsel serentak**. Jika setiap klien melakukan *HTTP Polling* setiap 2 detik ke database, server Node.js dan database akan mengalami kelebihan beban (*crash*).

Sauma Arena menerapkan tiga pilar optimasi konkurensi tinggi:

### 8.4.1 Real-Time Streaming: Server-Sent Events (SSE) vs WebSocket

Untuk publikasi live score dan skor suporter, sistem menggunakan **Server-Sent Events (SSE)** melalui protokol **HTTP/2**:

| Parameter Perbandingan | Server-Sent Events (SSE) | WebSocket | Keputusan Sauma Arena |
|:-----------------------|:-------------------------|:----------|:----------------------|
| **Arah Komunikasi** | Satu Arah (Server ke Klien) | Dua Arah (Duplex) | **SSE:** Penonton publik hanya menerima pembaruan (*read-only*), tidak perlu mengirim balik. |
| **Protokol Dasar** | HTTP/2 Murni | Upgrade ke Protokol TCP Khusus | **SSE:** Memanfaatkan infrastruktur HTTP/2 tanpa *handshake* tambahan. |
| **Efisiensi Koneksi** | **Sangat Ringan (~5 KB RAM per klien)** | Menengah (~20-50 KB per klien) | **SSE:** 5.000 klien hanya membutuhkan ~25 MB RAM server. |
| **Multiplexing** | Didukung (ribuan koneksi dalam 1 pipa) | Tidak didukung (tiap koneksi soket terpisah) | **SSE:** Menghemat konsumsi soket sistem operasi. |
| **Koneksi Ulang Otomatis** | **Bawaan browser (`EventSource`)** | Harus ditangani manual lewat kode | **SSE:** Jika sinyal HP penonton hilang sebentar, browser langsung rekoneksi otomatis. |
| **Dukungan Firewall / Proxy** | Lolos tanpa konfigurasi khusus | Sering diblokir di jaringan WiFi publik | **SSE:** Berjalan di port 443 standar peramban. |

### 8.4.2 Pola Fan-Out Realtime Non-Blocking

```
 [ Input Gol / Kartu / Skor Suporter oleh Petugas di Admin Dashboard ]
                                  │
                                  ▼
                     [ Simpan ke Basis Data Transaksi ]
                                  │
                                  ▼
                 [ Emit Event ke In-Memory Event Hub ]
                                  │
              ┌───────────────────┴───────────────────┐
              ▼                                       ▼
    [ Channel: match-102 ]                 [ Channel: supporter-rank ]
              │                                       │
     (Fan-out ke 3.000 Klien)                (Fan-out ke 4.500 Klien)
              │                                       │
              ▼                                       ▼
     [ Browser Penonton 1..N ]              [ Browser Suporter 1..N ]
```

- Ketika skor bertambah atau juri suporter memasukkan nilai, server hanya melakukan **1 kali kueri tulis ke database**.
- Hasil pembaruan tersebut dikirim ke *In-Memory Event Bus*.
- Event Bus menyebarkan data JSON kecil (< 500 byte) ke seluruh koneksi SSE penonton yang sedang terhubung secara non-blocking (*zero database read query*).

### 8.4.3 Caching Bertingkat (Multi-Tier Caching)

1. **Lapisan 1 (Browser Cache / Service Worker PWA):**
   - Kerangka antarmuka HTML/CSS/JS di-cache secara permanen di ponsel penonton.
   - Peramban hanya mengambil data dinamis yang berubah.
2. **Lapisan 2 (Edge CDN Cache - Cloudflare):**
   - Halaman `Info Regulasi`, `Profil Tim`, dan `Galeri` di-cache di jaringan CDN global dengan masa aktif *Stale-While-Revalidate*.
3. **Lapisan 3 (In-Memory L1 Cache di Node.js):**
   - Tabel klasemen grup dan klasemen skor suporter disimpan di memori RAM (LRU Cache / Valkey). Kueri database hanya dieksekusi jika terjadi pergantian data pertandingan.

---

## 8.5 Pemisahan Arsitektur: Admin Dashboard vs Portal Publik

### 8.5.1 Admin Dashboard (`/admin/*`)
- **Fokus Desain:** Produktivitas, keamanan tingkat tinggi, input padat data, dan keandalan transaksi.
- **Mekanisme Keamanan:**
  - Middleware otentikasi memeriksa token JWT yang tersimpan di dalam cookie `__Host-Session` bertipe `HttpOnly`, `Secure`, dan `SameSite=Strict`.
  - Verifikasi peran (*Role-Based Access Control*):
    - `SUPER_ADMIN`: Akses menyeluruh sistem.
    - `EVENT_ADMIN`: Pengaturan turnamen dan verifikasi peserta.
    - `SCORER_OPERATOR`: Kontrol papan skor lapangan dan berita acara (BAP).
    - `SUPPORTER_JURY`: Input form penilaian dan sanksi tribun suporter.
    - `GATE_SCANNER`: Operator pemindai QR tiket di pintu masuk stadion.
  - Setiap mutasi data dicatat pada tabel `AuditLog` (mencakup IP, user ID, waktu, dan perubahan data).

### 8.5.2 Portal Publik & Live Score (`/event/[slug]/*`)
- **Fokus Desain:** Kecepatan kilat, konsumsi kuota hemat, mobile-first, dan bebas friksi (tanpa registrasi/login).
- **Struktur Antarmuka (Bilah 7 Tab):**
  1. `[ (i) Info ]`: Deskripsi event, juklak PDF, lokasi venue, sponsor.
  2. `[ Tim Peserta ]`: Daftar sekolah/klub, foto skuad, susunan pemain.
  3. `[ Jadwal ]`: Linimasa pertandingan harian, status laga berjalan, skor langsung.
  4. `[ Klasemen ]`: Tabel grup liga (M, M, S, K, GM, GK, SG, Poin), indikator lolos.
  5. `[ Bracket ]`: Bagan sistem gugur interaktif, penjaluran pemenang otomatis.
  6. `[ Statistik ]`: Top skor, top assist, catatan sanksi kartu kuning/merah.
  7. `[ Skor Suporter ]`: Tabel klasemen kompetisi suporter terbaik (*Best Supporter*) dengan rincian poin positif (+koreo, maskot, seragam, yel-yel, tiket) dan penalti pelanggaran.

---

## 8.6 Mesin Aturan Olahraga Modular (Modular Sport Rule Engine)

Untuk memenuhi kebutuhan prioritas **Sepak Bola & Futsal** saat ini sekaligus memastikan fleksibilitas untuk cabor lain di masa depan, sistem menerapkan arsitektur *Strategy Pattern*:

```typescript
// Abstraksi Inti Mesin Olahraga
export interface SportRuleEngine {
  readonly sportCode: string;
  readonly sportName: string;
  
  // Format Waktu & Periode
  getMatchPeriodConfig(): {
    totalPeriods: number;
    periodDurationMinutes: number;
    breakDurationMinutes: number;
    isCleanTime: boolean; // Waktu bersih (futsal) vs waktu kotor (sepak bola)
  };

  // Logika Poin Klasemen
  calculateMatchPoints(scoreA: number, scoreB: number): {
    pointsA: number;
    pointsB: number;
    resultType: 'WIN_A' | 'WIN_B' | 'DRAW';
  };

  // Validasi Sanksi Disiplin
  evaluateDisciplinaryAction(history: MatchEvent[], newEvent: MatchEvent): {
    triggersSuspension: boolean;
    suspensionMatches: number;
    description: string;
  };

  // Penanganan Seri Babak Gugur
  resolveKnockoutTie(match: Match): {
    requiresOvertime: boolean;
    requiresPenalties: boolean;
    penaltyKicksCount: number;
  };
}
```

### Implementasi Aktif (MVP):
1. **`FutsalRuleEngine`:**
   - Periode: 2 x 20 menit (waktu kotor / bersih konfigurabel).
   - Akumulasi foul per babak (foul ke-6 menghasilkan *second penalty* dari titik 10 meter).
   - Akumulasi kartu: 2 kartu kuning pada laga berbeda menghasilkan skorsing 1 laga berikutnya; kartu merah langsung menghasilkan skorsing 1 laga berikutnya.
   - Penalti fase gugur: 3 penendang utama + sudden death.
2. **`SoccerRuleEngine`:**
   - Periode: 2 x 35-45 menit.
   - Poin: Menang 3, Seri 1, Kalah 0.
   - Penalti fase gugur: 5 penendang utama + sudden death.

### Kemudahan Adaptasi Cabor Baru (Masa Depan):
Ketika cabor **Bola Voli** atau **Badminton** ingin ditambahkan, pengembang cukup membuat berkas baru `VolleyballRuleEngine.ts` (menghitung poin set 25 dengan deuce dan rally point) tanpa perlu mengubah kode tabel klasemen, bagan bracket, tiket, maupun skor suporter.

---

## 8.7 Struktur Data & ORM (Database Architecture)

Sistem menggunakan ORM berbasis TypeScript bertipe ketat (**Drizzle ORM** atau **Prisma**) dengan database relasional terindeks:

### Entitas Kunci Basis Data:
1. `Tournament`: Konfigurasi event, cabor terpilih, juklak, banner, status publikasi.
2. `SportRuleConfig`: Parameter aturan cabor (durasi babak, poin menang/seri/kalah, batas kartu).
3. `Category`: Kategori pertandingan (SMA Putra, SMA Putri, Umum).
4. `GroupPool`: Pembagian grup (Grup A, Grup B, dll).
5. `Team`: Data profil tim, asal sekolah/klub, logo, status verifikasi berkas.
6. `Player`: Data roster, NIK/NISN, nomor punggung, foto, dokumen persyaratan.
7. `Match`: Jadwal laga, venue/lapangan, status (UPCOMING, LIVE, COMPLETED), skor normal, skor penalti.
8. `MatchEvent`: Detail kejadian di lapangan (Gol, Assist, Kartu Kuning, Kartu Merah, Pergantian Pemain).
9. `SupporterAssessment`: Form evaluasi suporter per laga (centang koreo, maskot, seragam, yel-yel, tiket masuk, dan pelanggaran).
10. `Ticket`: Data tiket QR penonton, status (ISSUED, CHECKED_IN), relasi tim sekolah suporter.
11. `Certificate`: Data e-sertifikat pemenang/peserta, nomor registrasi seri, hash SHA-256.

---

## 8.8 Spesifikasi Infrastruktur & Penerapan (Deployment Specs)

Sistem dirancang untuk dapat di-host secara mandiri (*self-hosted*) dengan biaya terjangkau pada satu server VPS:

### Spesifikasi Server Minimum (Untuk 5.000 Klien Serentak)
- **CPU:** 4 vCPU (arsitektur x86_64 atau ARM64)
- **RAM:** 4 GB - 8 GB RAM
- **Penyimpanan:** 40 GB NVMe SSD
- **Jaringan:** 1 Gbps port dengan bandwidth unmetered
- **Sistem Operasi:** Ubuntu Server 24.04 LTS / Debian 12

### Tumpukan Perangkat Lunak (Software Stack Container)
- **Runtime:** Node.js v22 LTS
- **Reverse Proxy:** Caddy v2 (otomatis HTTPS Let's Encrypt + HTTP/2 support native)
- **Database:** PostgreSQL 16 (atau SQLite dengan mode WAL untuk instalasi single-file portabel)
- **Cache & Pub/Sub:** Valkey 7 / Redis 7 (ringan, in-memory)
- **Containerization:** Docker Compose multi-container terisolasi

---

## 8.9 Ringkasan Kunci Keputusan Arsitektur

1. **Stack:** Fullstack Node.js (SvelteKit atau Next.js 15 Standalone) menjamin satu bahasa pemrograman (TypeScript) dari ujung depan hingga ujung belakang.
2. **Keringanan Mobile:** Menghindari beban virtual DOM berlebih dan memanfaatkan arsitektur aset ringan agar cepat dimuat di ponsel lapangan GOR beratap seng.
3. **Konkurensi Ribuan Klien:** Menggunakan **Server-Sent Events (SSE)** berbasis HTTP/2 yang sangat hemat memori (~5 KB/klien) dan mekanisme *Fan-Out non-blocking* sehingga lonjakan ribuan penonton tidak membebani database utama.
4. **Keamanan:** Pemisahan ketat antara Admin Dashboard terproteksi RBAC dan Portal Publik 7 Tab yang bebas akses tanpa login.
5. **Ekstensibilitas:** Mesin aturan cabor berorientasi strategi (*Strategy Pattern*) yang fokus pada Futsal dan Sepak Bola di tahap MVP, namun siap menerima cabor lain di masa mendatang.
