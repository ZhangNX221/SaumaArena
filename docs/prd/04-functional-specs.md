# 04. Spesifikasi Fungsional & Logika Sistem

**Dokumen PRD: Bagian 4/7**  
**Produk:** Sauma Arena  
**Tanggal:** 19 Oktober 2026  
**Referensi:** [00-index.md](./00-index.md) | [03-user-stories.md](./03-user-stories.md)

---

## 4.1 Gambaran Umum

Dokumen ini mendefinisikan aturan bisnis, formula perhitungan matematis, diagram alur logika, dan algoritma teknis di balik layar (*under the hood*) untuk setiap modul Sauma Arena. Dokumen ini menjadi rujukan teknis utama bagi tim rekayasa perangkat lunak (engineering) dalam membangun *backend services*, *database schema*, dan *frontend state machine*.

---

## 4.2 Mesin Kalkulasi Klasemen (Standings Engine)

Klasemen dihitung secara reaktif setiap kali pertandingan berstatus `COMPLETED` dan diverifikasi oleh petugas meja.

### 4.2.1 Aturan Poin Standar
- **Menang (Win):** +3 Poin
- **Seri (Draw):** +1 Poin
- **Kalah (Loss):** 0 Poin
- *Catatan:* Konfigurasi poin dapat disesuaikan untuk cabang olahraga khusus (contoh cabor bola voli: Menang 3-0/3-1 = 3 poin; Menang 3-2 = 2 poin; Kalah 2-3 = 1 poin; Kalah 0-3/1-3 = 0 poin).

### 4.2.2 Algoritma Pengurutan & Tiebreaker Bertingkat

Jika dua tim atau lebih dalam grup yang sama memiliki poin total yang identik, sistem menerapkan algoritma tiebreaker bertingkat secara berurutan:

```
Tingkat 1: Total Poin Tertinggi
   ↓ (Jika Poin Sama)
Tingkat 2: Head-to-Head (H2H) Poin antar tim yang berselisih
   ↓ (Jika Masih Sama)
Tingkat 3: Head-to-Head Selisih Gol (SG) khusus antar tim yang berselisih
   ↓ (Jika Masih Sama)
Tingkat 4: Selisih Gol (SG) Keseluruhan dalam Grup (Total GM - Total GK)
   ↓ (Jika Masih Sama)
Tingkat 5: Jumlah Gol Memasukkan (GM) Keseluruhan dalam Grup
   ↓ (Jika Masih Sama)
Tingkat 6: Poin Fair Play (Disiplin Kartu):
          - Kartu Kuning = -1 poin
          - Kartu Merah Tak Langsung (2 Kuning) = -3 poin
          - Kartu Merah Langsung = -4 poin
          - Kartu Kuning diikuti Kartu Merah Langsung = -5 poin
   ↓ (Jika Masih Sama)
Tingkat 7: Undian Koin (Coin Toss / Manual Draw by Admin)
```

### 4.2.3 Pseudocode Kalkulasi Klasemen Grup

```typescript
interface TeamRecord {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  fairPlayScore: number;
}

function calculateGroupStandings(groupId: string, matches: Match[]): TeamRecord[] {
  const standingsMap = new Map<string, TeamRecord>();

  // 1. Akumulasi metrik dari semua pertandingan grup yang selesai
  for (const match of matches) {
    if (match.groupId !== groupId || match.status !== "COMPLETED") continue;

    const recordA = getOrCreateRecord(standingsMap, match.teamAId);
    const recordB = getOrCreateRecord(standingsMap, match.teamBId);

    recordA.played += 1;
    recordB.played += 1;
    recordA.goalsFor += match.scoreA;
    recordA.goalsAgainst += match.scoreB;
    recordB.goalsFor += match.scoreB;
    recordB.goalsAgainst += match.scoreA;

    if (match.scoreA > match.scoreB) {
      recordA.won += 1;
      recordA.points += 3;
      recordB.lost += 1;
    } else if (match.scoreA < match.scoreB) {
      recordB.won += 1;
      recordB.points += 3;
      recordA.lost += 1;
    } else {
      recordA.drawn += 1;
      recordA.points += 1;
      recordB.drawn += 1;
      recordB.points += 1;
    }

    recordA.goalDifference = recordA.goalsFor - recordA.goalsAgainst;
    recordB.goalDifference = recordB.goalsFor - recordB.goalsAgainst;
    recordA.fairPlayScore += calculateFairPlay(match.events, match.teamAId);
    recordB.fairPlayScore += calculateFairPlay(match.events, match.teamBId);
  }

  // 2. Sorting bertingkat dengan H2H resolver
  const records = Array.from(standingsMap.values());
  return records.sort((teamA, teamB) => {
    // Tingkat 1: Poin Total
    if (teamB.points !== teamA.points) return teamB.points - teamA.points;

    // Tingkat 2 & 3: Head to Head
    const h2h = resolveHeadToHead(teamA.teamId, teamB.teamId, matches);
    if (h2h !== 0) return h2h;

    // Tingkat 4: Selisih Gol Keseluruhan
    if (teamB.goalDifference !== teamA.goalDifference) {
      return teamB.goalDifference - teamA.goalDifference;
    }

    // Tingkat 5: Produktivitas Gol
    if (teamB.goalsFor !== teamA.goalsFor) {
      return teamB.goalsFor - teamA.goalsFor;
    }

    // Tingkat 6: Fair Play Score (skor lebih tinggi = lebih fair / minim kartu)
    return teamB.fairPlayScore - teamA.fairPlayScore;
  });
}
```

---

## 4.3 Mesin Bagan Gugur & Propagasi (Bracket Engine)

### 4.3.1 Struktur Pohon Single Elimination
Bagan eliminasi tunggal direpresentasikan sebagai struktur pohon biner terbalik. Jumlah ronde total adalah:
$$\text{Total Ronde} = \lceil \log_2(N) \rceil$$
di mana $N$ adalah jumlah peserta.

### 4.3.2 Penanganan Peserta Ganjil (Bye Allocation)
Jika $N$ bukan pangkat dua ($N \neq 2^k$), jumlah slot bye pada babak pertama adalah:
$$\text{Jumlah Bye} = 2^{\lceil \log_2(N) \rceil} - N$$
*Contoh:* Jika terdapat 12 tim, maka slot bagan adalah $2^4 = 16$. Jumlah Bye = $16 - 12 = 4$ tim. Empat tim unggulan (seeding 1 sampai 4) secara otomatis langsung melaju ke Babak Perempat Final (Round of 8) tanpa perlu bertanding di Babak 16 Besar.

### 4.3.3 Propagasi Pemenang Otomatis
Setiap node pertandingan dalam database menyimpan relasi penjaluran:
- `nextMatchId`: ID pertandingan pada babak berikutnya yang menampung pemenang laga ini.
- `nextMatchSlot`: Posisi slot (`slotA` atau `slotB`) di pertandingan tujuan.
- `loserMatchId` *(opsional)*: Untuk perebutan Juara 3 atau jalur Lower Bracket pada Double Elimination.

```typescript
function onMatchCompleted(completedMatch: Match): void {
  const winnerTeamId = completedMatch.scoreA > completedMatch.scoreB 
    ? completedMatch.teamAId 
    : completedMatch.teamBId;
  const loserTeamId = completedMatch.scoreA > completedMatch.scoreB 
    ? completedMatch.teamBId 
    : completedMatch.teamAId;

  // 1. Loloskan pemenang ke laga berikutnya
  if (completedMatch.nextMatchId) {
    db.matches.update({
      where: { id: completedMatch.nextMatchId },
      data: {
        [completedMatch.nextMatchSlot === 'A' ? 'teamAId' : 'teamBId']: winnerTeamId
      }
    });
  }

  // 2. Jika semifinal dan terdapat laga Juara 3, loloskan yang kalah ke bronze match
  if (completedMatch.bronzeMatchId) {
    db.matches.update({
      where: { id: completedMatch.bronzeMatchId },
      data: {
        [completedMatch.bronzeMatchSlot === 'A' ? 'teamAId' : 'teamBId']: loserTeamId
      }
    });
  }
}
```

---

## 4.4 Mesin Disiplin & Sanksi Otomatis (Disciplinary Engine)

*Modul esensial untuk turnamen pelajar dan amatir berdasarkan standar FloEvent*

### 4.4.1 Aturan Akumulasi Kartu & Skorsing
1. **Aturan 2 Kartu Kuning (Laga Berbeda):**
   - Jika pemain memperoleh 1 kartu kuning pada Laga 1 dan 1 kartu kuning pada Laga 2, pemain tersebut **dilarang bermain (skorsing) pada 1 laga berikutnya** (Laga 3).
   - Setelah sanksi dijalani, hitungan kartu kuning direset kembali ke 0.
2. **Aturan Kartu Merah Langsung:**
   - Pemain yang menerima kartu merah langsung otomatis **dilarang bermain pada 1 laga berikutnya** (dapat ditambah sanksi komdis jika pelanggaran berat).
3. **Pemutihan Kartu (Opsional Panitia):**
   - Panitia dapat mengaktifkan opsi pemutihan akumulasi 1 kartu kuning menjelang babak Semifinal, sehingga pemain tidak kehilangan hak bertanding di Final hanya karena akumulasi kartu kuning tunggal. Namun, pemain yang sedang dalam masa hukuman skorsing aktif tetap wajib menjalani hukumannya.

### 4.4.2 Validasi Keabsahan Pemain (Line-up Validator)

Sebelum pertandingan dimulai, sistem memeriksa status kelayakan setiap pemain dalam roster tim:

```typescript
interface EligibilityResult {
  isEligible: boolean;
  reason?: string;
  warningNotice?: string;
}

function checkPlayerEligibility(playerId: string, targetMatchId: string): EligibilityResult {
  const player = getPlayer(playerId);
  const targetMatch = getMatch(targetMatchId);

  // 1. Cek kelengkapan dokumen persyaratan
  if (player.documentStatus !== 'APPROVED') {
    return { 
      isEligible: false, 
      reason: 'Dokumen persyaratan belum disetujui panitia.' 
    };
  }

  // 2. Cek status sanksi skorsing aktif
  const activeSanction = getActiveSanction(playerId, targetMatch.tournamentId);
  if (activeSanction && activeSanction.matchesRemaining > 0) {
    return {
      isEligible: false,
      reason: `Pemain sedang terkena sanksi skorsing (${activeSanction.type}): dilarang tampil pada laga ini.`
    };
  }

  // 3. Peringatan akumulasi 1 kartu kuning (warning state)
  const yellowCardCount = countYellowCards(playerId, targetMatch.tournamentId);
  if (yellowCardCount === 1) {
    return {
      isEligible: true,
      warningNotice: 'Pemain telah mengantongi 1 kartu kuning. Hati-hati akumulasi kartu.'
    };
  }

  return { isEligible: true };
}
```

---

## 4.5 Mesin Manajemen Jadwal & Deteksi Konflik (Schedule Engine)

### 4.5.1 Algoritma Deteksi Konflik Lapangan & Tim

Setiap kali admin membuat atau memindahkan jadwal pertandingan, sistem menjalankan validasi *overlap check*:

$$\text{Overlap} \iff (\text{Start}_A < \text{End}_B) \land (\text{End}_A > \text{Start}_B)$$

```typescript
interface ScheduleConflictResult {
  hasConflict: boolean;
  conflicts: Array<{
    type: 'VENUE_COLLISION' | 'TEAM_REST_VIOLATION' | 'TEAM_DOUBLE_BOOKING';
    message: string;
  }>;
}

function validateScheduleSlot(
  newMatch: { teamAId: string; teamBId: string; venueId: string; startTime: Date; endTime: Date },
  existingMatches: Match[],
  currentMatchId?: string
): ScheduleConflictResult {
  const conflicts = [];
  const MIN_REST_TIME_MS = 90 * 60 * 1000; // Minimal istirahat tim: 90 menit

  for (const m of existingMatches) {
    if (m.id === currentMatchId || m.status === 'CANCELLED') continue;

    const isOverlap = (newMatch.startTime < m.endTime) && (newMatch.endTime > m.startTime);

    // 1. Tabrakan Venue Lapangan
    if (m.venueId === newMatch.venueId && isOverlap) {
      conflicts.push({
        type: 'VENUE_COLLISION',
        message: `Lapangan ${m.venueName} sudah digunakan oleh laga ${m.title} (${formatTime(m.startTime)} - ${formatTime(m.endTime)}).`
      });
    }

    // 2. Tim Bermain Ganda di Jam Sama
    const involvesSameTeam = [newMatch.teamAId, newMatch.teamBId].some(
      id => id === m.teamAId || id === m.teamBId
    );
    if (involvesSameTeam && isOverlap) {
      conflicts.push({
        type: 'TEAM_DOUBLE_BOOKING',
        message: `Salah satu tim memiliki jadwal lain pada jam yang sama (${m.title}).`
      });
    }

    // 3. Pelanggaran Waktu Istirahat Minimal Tim
    if (involvesSameTeam && !isOverlap) {
      const restDelta1 = Math.abs(newMatch.startTime.getTime() - m.endTime.getTime());
      const restDelta2 = Math.abs(m.startTime.getTime() - newMatch.endTime.getTime());
      if (Math.min(restDelta1, restDelta2) < MIN_REST_TIME_MS) {
        conflicts.push({
          type: 'TEAM_REST_VIOLATION',
          message: `Jarak istirahat antar laga kurang dari 90 menit dengan laga ${m.title}.`
        });
      }
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts
  };
}
```

---

## 4.6 Mesin Tiket QR & Keamanan Check-in (Gate Engine)

### 4.6.1 Struktur Payload & Kriptografi Anti-Pemalsuan
Untuk mencegah pemalsuan tiket menggunakan tangkapan layar tiruan, string QR Code berisi token yang ditandatangani secara kriptografis menggunakan algoritma **HMAC-SHA256**:

```
Format Payload QR:
SA-TIK:[TicketID]:[TournamentID]:[Timestamp]:[HMAC_Signature]

Contoh:
SA-TIK:TK-881920:TRN-001:1771382400:a9f4c3d8e7b1a20f5c6e8b7a4d3c2e1f
```

- Kunci rahasia (*secret salt*) hanya tersimpan di server aman Sauma Arena.
- Scanner memvalidasi integritas tanda tangan digital sebelum memeriksa status ke database.

### 4.6.2 Siklus Hidup & State Machine Tiket

```
  [ ISSUED ] ──(Scan di Pintu Masuk Sukses)──> [ CHECKED_IN ]
      │                                              │
      │ (Turnamen Berakhir)                          │ (Keluar Venue / Re-entry jika diizinkan)
      ↓                                              ↓
  [ EXPIRED ]                                  [ CHECKED_OUT ]
```

1. **Scan Pertama:** Status berubah dari `ISSUED` menjadi `CHECKED_IN`, menyimpan `scannedAt` dan `scannedByGateOfficerId`.
2. **Scan Ulang (Replay Attack):** Jika tiket yang sama di-scan kembali, sistem membunyikan alarm getar merah dan menampilkan:
   > *"PERINGATAN: Tiket sudah digunakan pada pukul 14:12 WITA oleh Budi Santoso di Gate Barat."*
3. **Penyimpanan Offline (PWA Cache):** Jika koneksi internet di gerbang stadion terputus, daftar tiket terverifikasi disimpan sementara di IndexedDB lokal browser petugas dan disinkronkan otomatis saat koneksi kembali pulih.

---

## 4.7 Mesin E-Sertifikat & Validasi Integritas (Certificate Engine)

### 4.7.1 Pembuatan Sertifikat Otomatis
1. **Template Renderer:** Sistem menggunakan template SVG berbasis vektor beresolusi 300 DPI dengan placeholder dinamis:
   - `{{RECIPIENT_NAME}}`: Nama Lengkap Atlet / Official / Wasit.
   - `{{TEAM_NAME}}`: Asal Tim / Sekolah / Kabupaten.
   - `{{AWARD_TITLE}}`: Gelar Juara (Juara 1, Juara 2, Juara 3, Top Scorer, atau Peserta).
   - `{{CERTIFICATE_NUMBER}}`: Nomor seri resmi berformat `SA/[YEAR]/[CABOR]/[SERIAL]`.
   - `{{VERIFY_QR_CODE}}`: Gambar QR Code yang mengarah ke URL validasi keaslian.
2. **Output:** Dikonversi ke file PDF (ukuran A4 Landscape, 300 DPI) siap cetak menggunakan headless rendering engine.

### 4.7.2 Verifikasi Keaslian Sertifikat Digital
Setiap sertifikat memiliki sidik jari digital (SHA-256 Hash) dari data sertifikat yang disimpan permanen di database:

```
URL Verifikasi Publik:
https://saumaarena.id/verify-cert/SA-2026-FUT-0089

Payload Halaman Verifikasi:
- Status: SAH & RESMI TERVERIFIKASI
- Penerima: Dina Kusuma
- Instansi: SMAN 1 Kupang
- Predikat: Juara 1 (Piala Gubernur Pelajar 2026)
- Tanggal Terbit: 24 Oktober 2026
- Ditandatangani oleh: Andi Pratama (Ketua Panitia) & Kadispora
```

---

## 4.8 Mesin Penilaian Skor Suporter & Leaderboard (Supporter Scoring Engine)

*Sistem kompetisi "Best Supporter" untuk turnamen pelajar dan komunitas (berdasarkan rincian standar kompetisi suporter sekolah)*

### 4.8.1 Formula & Aturan Pembobotan Skor
Total skor suporter dihitung per tim/sekolah secara kumulatif sepanjang turnamen:

$$\text{Total Poin Suporter} = \sum (\text{Poin Kreativitas}) + (\text{Total Tiket Ter-check-in} \times 1) - \sum (\text{Penalti Pelanggaran})$$

#### Tabel Parameter Penilaian Poin

| Kategori | Parameter Aksi Penilaian | Nilai Poin | Sumber Data & Validasi |
|:---------|:-------------------------|:----------:|:-----------------------|
| **Poin Positif (+)** | **Membentang Koreografi** | **+25** | Input Juri Admin: Form checklist laga (foto koreo) |
| **Poin Positif (+)** | **Membawa Maskot Sekolah** | **+20** | Input Juri Admin: Form checklist kehadiran maskot |
| **Poin Positif (+)** | **Menggunakan Seragam Supporter** | **+15** | Input Juri Admin: Kompak mengenakan jersey/kaos tim |
| **Poin Positif (+)** | **Menyanyikan Yel-yel Minimal 3** | **+10** | Input Juri Admin: Terverifikasi oleh tim pengawas tribun |
| **Poin Positif (+)** | **Jumlah Tiket Penonton** | **+1 / tiket** | **Otomatis:** Sinkronisasi realtime dari modul Tiket QR (`CHECKED_IN`) |
| **Penalti Negatif (-)** | **Membuat Kericuhan, Kekerasan dll** | **-50** | Input Admin / Laporan Keamanan & Wasit |
| **Penalti Negatif (-)** | **Melempar Benda ke Dalam Lapangan** | **-25** | Input Admin / Laporan Wasit / Pengawas Laga |
| **Penalti Negatif (-)** | **Melakukan Rasis / Provokasi** | **-15** | Input Admin / Pengawas Tribun |
| **Penalti Negatif (-)** | **Menyelundupkan Barang yang Dilarang** | **-5** | Input Admin / Laporan Gate Scanner Pintu Masuk |

### 4.8.2 Struktur Data & Pseudocode Penilaian Suporter

```typescript
interface SupporterCriteriaItem {
  id: string;
  name: string;
  type: 'POSITIVE' | 'NEGATIVE';
  points: number; // Positif (+25, +20, dll) atau Negatif (-50, -25, dll)
}

interface MatchSupporterAssessment {
  id: string;
  matchId: string;
  schoolTeamId: string;
  juryUserId: string;
  choreography: boolean;     // +25
  schoolMascot: boolean;     // +20
  supporterUniform: boolean; // +15
  cheerMin3Chants: boolean;  // +10
  checkedInTickets: number;  // +1 per tiket
  incidentViolentChaos: boolean;      // -50
  incidentThrowObjects: boolean;      // -25
  incidentRacismProvocation: boolean; // -15
  incidentSmuggleContraband: boolean; // -5
  notes?: string;
  createdAt: Date;
}

interface SupporterLeaderboardRow {
  rank: number;
  schoolTeamId: string;
  schoolName: string;
  logoUrl: string;
  totalCreativityPoints: number;
  totalTicketPoints: number;
  totalPenaltyPoints: number;
  totalScore: number;
}

function calculateSupporterScore(assessment: MatchSupporterAssessment): number {
  let score = 0;
  if (assessment.choreography) score += 25;
  if (assessment.schoolMascot) score += 20;
  if (assessment.supporterUniform) score += 15;
  if (assessment.cheerMin3Chants) score += 10;
  score += assessment.checkedInTickets * 1;

  if (assessment.incidentViolentChaos) score -= 50;
  if (assessment.incidentThrowObjects) score -= 25;
  if (assessment.incidentRacismProvocation) score -= 15;
  if (assessment.incidentSmuggleContraband) score -= 5;

  return score;
}
```

### 4.8.3 Algoritma Pengurutan Klasemen Suporter (Tiebreaker)
Jika terdapat dua sekolah dengan Total Skor suporter yang sama:
1. **Prioritas 1:** Total Poin Penalti paling sedikit (sekolah yang paling disiplin berada di atas).
2. **Prioritas 2:** Total Poin Tiket terbanyak (kehadiran suporter di venue lebih banyak).
3. **Prioritas 3:** Total Poin Kreativitas tertinggi.

---

## 4.9 Pemisahan Arsitektur: Admin Dashboard vs Publik Live Score Portal

Untuk menjamin keamanan kontrol operasional dan kenyamanan penonton, arsitektur antarmuka dibagi menjadi dua zona terisolasi:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       ARSITEKTUR ANTARMUKA SAUMA ARENA                      │
├─────────────────────────────────────────┬───────────────────────────────────┤
│       ADMIN DASHBOARD (TERPROTEKSI)     │     PORTAL PUBLIK & LIVE SCORE    │
│            Route: /admin/*              │      Route: /event/[slug]/*       │
├─────────────────────────────────────────┼───────────────────────────────────┤
│ • Otentikasi: JWT Session + RBAC        │ • Akses: Publik Terbuka (No Auth) │
│ • Middleware: Validasi Role Server-Side │ • Kinerja: Edge Caching & SSG/ISR │
│ • Modul:                                │ • Realtime: WebSocket / SSE Client│
│   - Setup Turnamen & Format Cabor       │ • Tab Bar Navigasi Publik:        │
│   - Verifikasi Berkas & Roster Lock     │   [1] Info (Juknis & Sponsor)     │
│   - Match Control (Scoring Meja Lapangan│   [2] Tim Peserta & Roster        │
│   - Form Penilaian Juri Skor Suporter   │   [3] Jadwal & Skor Live          │
│   - Operator Scanner Tiket Gate Masuk   │   [4] Klasemen Grup Realtime      │
│   - Generator Sertifikat & Laporan LPJ  │   [5] Bagan Gugur (Bracket)       │
│                                         │   [6] Statistik Top Skor / Kartu  │
│                                         │   [7] Klasemen Skor Suporter      │
└─────────────────────────────────────────┴───────────────────────────────────┘
```

1. **Keamanan Admin Dashboard:** Seluruh mutasi data (perubahan skor, verifikasi tim, input pelanggaran suporter) dilindungi otentikasi ketat dan mencatat jejak audit (*audit log* berupa `userId` dan `timestamp`).
2. **Optimasi Portal Publik:** Halaman publik dirancang *lightweight*, bebas autentikasi, dan dapat diakses dengan cepat bahkan pada koneksi seluler 3G/4G di dalam stadion.

---

## 4.10 Mesin Aturan Olahraga Modular (Modular Sport Rule Engine)

### 4.10.1 Fokus Utama MVP: Futsal & Sepak Bola
MVP Sauma Arena berfokus penuh pada **Sepak Bola dan Futsal** dengan spesifikasi aturan baku:
- **Durasi Laga:**
  - Futsal: 2 babak x 20 menit (bersih/kotor sesuai regulasi panitia) + jeda 5-10 menit.
  - Sepak Bola: 2 babak x 35-45 menit + jeda 15 menit.
- **Poin Klasemen:** Menang = 3, Seri = 1, Kalah = 0.
- **Kedisiplinan:** Kartu Kuning (akumulasi 2 kartu pada laga berbeda = skorsing 1 laga berikutnya), Kartu Merah Langsung (skorsing 1 laga berikutnya).
- **Fase Gugur:** Jika seri hingga waktu normal berakhir, langsung dilanjutkan ke Adu Penalti (3 atau 5 penendang).

### 4.10.2 Abstraksi untuk Cabor Masa Depan (Extensibility)
Sistem menggunakan pola *Strategy Pattern* dengan antarmuka generic `SportRuleEngine`:

```typescript
export interface SportRuleEngine {
  sportCode: 'FUTSAL' | 'SOCCER' | 'VOLLEYBALL' | 'BADMINTON' | 'BASKETBALL';
  name: string;
  scoringFormat: 'GOAL' | 'POINTS' | 'SETS';
  periods: number;
  periodDurationMinutes: number;
  allowsDrawInGroup: boolean;
  hasPenaltiesOrOvertime: boolean;
  calculateStandings(matches: Match[]): TeamRecord[];
  checkDisciplinarySanctions(events: MatchEvent[]): SanctionResult;
}
```

*Implementasi:* Di fase MVP, mesin `FutsalRuleEngine` dan `SoccerRuleEngine` aktif sebagai default. Ketika cabor Bola Voli (aturan reli 25 poin, best of 3/5 set) atau Badminton (poin 21, rubber set) diaktifkan di fase 2, pengembang cukup menambahkan kelas adaptor baru tanpa mengubah modul bracket, registrasi, ticketing, maupun skor suporter.

---

## 4.11 Arsitektur Data Terintegrasi (Data Model Relationships)

```
[ Tournament ] 
      │ 1
      ├─────── N ──────> [ Category / Division ]
      │                         │ 1
      │                         ├─────── N ──────> [ Group / Pool ]
      │                         │                         │ 1
      │                         │                         └─────── N ──────> [ Team ] ◄────────┐
      │                         │                                               │ 1            │
      │                         │                                               ├───── N ──> [ Player / Official ]
      │                         │                                               │              │
      │                         └─────── N ──────> [ Match ] <──────────────────┘              │
      │                                               │ 1                                      │
      │                                               ├─────── N ──────> [ MatchEvent ]        │
      │                                               ├─────── 1 ──────> [ BAP / Report ]      │
      │                                               └─────── N ──────> [ SupporterAssessment ]
      ├─────── N ──────> [ Ticket ] (Poin Tiket Terintegrasi Otomatis ke Supporter)
      └─────── N ──────> [ Certificate ] (Termasuk E-Sertifikat Juara Best Supporter)
```

Arsitektur relasional ini mengintegrasikan seluruh elemen pertandingan, pergerakan suporter di tribun, hingga pelaporan akhir dalam satu kesatuan data yang konsisten.

