# 04. Mesin Aturan, Template Cabor & State Machine

**Dokumen PRD — Bagian 4/12**  
**Produk:** Sauma Arena (Platform Manajemen Pertandingan Multi-Cabang Olahraga)  
**Versi:** 1.0  

---

## 4.1 Sport Template (Konfigurasi Aturan JSON)

Setiap cabang olahraga memiliki berkas konfigurasi bawaan `template.json` yang ditempatkan pada direktorinya masing-masing (`src/sports/<kode>/`). Skema berkas ini divalidasi dengan Zod. Admin dapat meng-override konfigurasi ini per kompetisi (`competitions.rules_overrides`), yang kemudian disalin permanen ke `competitions.rules_snapshot` saat kompetisi berstatus `ongoing`.

### 4.1.1 Model Skor yang Didukung

| `scoring_model` | Karakteristik Perhitungan | Contoh Cabang Olahraga |
|---|---|---|
| `timed_goals` | Periode berbasis waktu, skor bertambah per gol/poin | Sepakbola, Futsal, Bola Basket |
| `rally_set` | Sistem set sampai target poin tertentu, selisih minimal (win-by-N), best-of-N | Bola Voli, Bulutangkis, Tenis Meja |
| `map_series` | Seri best-of-N, hasil dihitung per kemenangan map/game | Game Esport (MLBB, Valorant, Free Fire) |
| `judged` (P2) | Nilai akumulasi subjektif dari juri | Seni Pencak Silat, Senam Artistik |
| `placement_points` (P2) | Distribusi poin berdasarkan peringkat klasemen akhir | Battle Royale (PUBG Mobile), Balap Lari |

---

### 4.1.2 Konfigurasi Template Bawaan

#### A. Template: Sepakbola (`football`)
```json
{
  "code": "football",
  "name": "Sepakbola",
  "version": "1.0.0",
  "scoring_model": "timed_goals",
  "participants": {
    "kind": "team",
    "on_field": 11,
    "min_on_field_to_continue": 7,
    "squad_min": 11,
    "squad_max": 23,
    "starters": 11
  },
  "periods": {
    "count": 2,
    "minutes": 45,
    "clock": "running",
    "allow_stoppage_time": true
  },
  "extra_time": { "enabled": false, "periods": 2, "minutes": 15 },
  "penalty_shootout": { "enabled": false, "initial_kicks": 5 },
  "substitutions": { "max": 5, "max_windows": 3, "reentry_allowed": false },
  "discipline": {
    "cards": ["yellow", "red"],
    "second_yellow_is_red": true,
    "suspension": { "yellow_accumulation": 3, "red_card_matches": 1 }
  },
  "points_system": { "win": 3, "draw": 1, "loss": 0 },
  "tiebreakers": ["points", "goal_difference", "goals_for", "head_to_head_points", "fair_play", "draw_lots"],
  "draw_allowed": { "group": true, "knockout": false }
}
```

#### B. Template: Futsal (`futsal`)
```json
{
  "code": "futsal",
  "name": "Futsal",
  "version": "1.0.0",
  "scoring_model": "timed_goals",
  "participants": {
    "kind": "team",
    "on_field": 5,
    "min_on_field_to_continue": 3,
    "squad_min": 5,
    "squad_max": 14,
    "starters": 5
  },
  "periods": {
    "count": 2,
    "minutes": 20,
    "clock": "stopped",
    "allow_stoppage_time": false
  },
  "extra_time": { "enabled": false, "periods": 2, "minutes": 5 },
  "penalty_shootout": { "enabled": false, "initial_kicks": 3 },
  "timeouts": { "per_period": 1, "seconds": 60 },
  "substitutions": { "max": null, "reentry_allowed": true },
  "fouls": {
    "accumulated_threshold_per_period": 5,
    "effect_from_next_foul": "free_kick_10m_no_wall"
  },
  "discipline": {
    "cards": ["yellow", "red"],
    "second_yellow_is_red": true,
    "suspension": { "yellow_accumulation": 2, "red_card_matches": 1 }
  },
  "points_system": { "win": 3, "draw": 1, "loss": 0 },
  "tiebreakers": ["points", "goal_difference", "goals_for", "head_to_head_points", "fair_play", "draw_lots"],
  "draw_allowed": { "group": true, "knockout": false }
}
```

#### C. Template: Bola Voli (`volleyball`)
```json
{
  "code": "volleyball",
  "name": "Bola Voli",
  "version": "1.0.0",
  "scoring_model": "rally_set",
  "participants": {
    "kind": "team",
    "on_field": 6,
    "squad_min": 6,
    "squad_max": 14,
    "libero_max": 2
  },
  "sets": {
    "best_of": 5,
    "points_to_win": 25,
    "deciding_set_points": 15,
    "win_by": 2,
    "max_points": null
  },
  "timeouts": { "per_set": 2, "seconds": 30 },
  "substitutions": { "per_set": 6 },
  "points_system": {
    "by_result": [
      { "sets": "3-0", "winner": 3, "loser": 0 },
      { "sets": "3-1", "winner": 3, "loser": 0 },
      { "sets": "3-2", "winner": 2, "loser": 1 }
    ]
  },
  "tiebreakers": ["points", "wins", "set_ratio", "point_ratio", "head_to_head_points"]
}
```

#### D. Template: Bulutangkis (`badminton`)
```json
{
  "code": "badminton",
  "name": "Bulutangkis",
  "version": "1.0.0",
  "scoring_model": "rally_set",
  "participants": {
    "kind": "individual_or_pair",
    "per_side_options": [1, 2]
  },
  "sets": {
    "best_of": 3,
    "points_to_win": 21,
    "deciding_set_points": 21,
    "win_by": 2,
    "max_points": 30
  },
  "interval": { "at_leading_points": 11, "seconds": 60 },
  "between_sets_seconds": 120,
  "service_tracking": false,
  "points_system": { "win": 1, "loss": 0 },
  "tiebreakers": ["points", "set_difference", "point_difference", "head_to_head_points"]
}
```

#### E. Template: Esport Generik (`esport`)
```json
{
  "code": "esport",
  "name": "Esport (Generik)",
  "version": "1.0.0",
  "scoring_model": "map_series",
  "participants": { "kind": "team", "starters": 5, "substitutes_max": 2 },
  "series": { "best_of": 3, "allowed_best_of": [1, 3, 5] },
  "map_result_fields": ["winner", "score_home", "score_away", "duration_sec"],
  "points_system": { "win": 3, "loss": 0 },
  "tiebreakers": ["points", "map_difference", "head_to_head_points"]
}
```

---

## 4.2 Mesin Aturan: Interface `SportModule`

Setiap modul cabang olahraga wajib mengimplementasikan interface TypeScript murni berikut dan didaftarkan pada `core/registry`:

```ts
export interface SportModule<Rules = unknown, State = unknown> {
  code: string;                                   // contoh: 'football', 'badminton'
  scoringModel: 'timed_goals' | 'rally_set' | 'map_series';

  /** Validasi struktur konfigurasi aturan (Zod parse). */
  validateRules(raw: unknown): { ok: true; rules: Rules } | { ok: false; errors: string[] };

  /** Inisialisasi state awal pertandingan berdasarkan lineup & snapshot aturan. */
  initialState(ctx: { rules: Rules; homeId: string; awayId: string; lineups?: Lineup[] }): State;

  /** Memeriksa keabsahan suatu event terhadap state saat ini (Fungsi Murni). */
  validateEvent(state: State, event: MatchEvent, rules: Rules): ValidationResult;

  /** Menerapkan event dan menghasilkan state pertandingan yang baru (Fungsi Murni). */
  applyEvent(state: State, event: MatchEvent, rules: Rules): State;

  /** Menentukan apakah pertandingan sudah memenuhi syarat selesai secara teknis. */
  isFinished(state: State, rules: Rules): boolean;

  /** Menghitung hasil akhir: skor ringkas, id pemenang, dan poin klasemen tiap tim. */
  getResult(state: State, rules: Rules): MatchResult;

  /** Konfigurasi tata letak dan tombol konsol panitia lapangan. */
  consoleConfig(state: State, rules: Rules): ConsoleConfig;
}
```

---

## 4.3 Alur Perhitungan State & Event Sourcing

State pertandingan dihitung melalui proses reduksi berurutan:
```
state = initialState(...)
for event in match_events (urut berdasarkan seq, abaikan yang di-void):
    state = applyEvent(state, event, rules)
```

### Penanganan Koreksi (Void Event)
Saat wasit atau operator membatalkan suatu peristiwa:
1. Kolom `voided_at`, `voided_by`, dan `void_reason` pada record event diisi.
2. Seluruh state pertandingan dihitung ulang dari awal (`seq = 1`).
3. Jika pembatalan event tersebut mengakibatkan event-event berikutnya menjadi tidak valid (misal: membatalkan pergantian pemain padahal pemain tersebut mencetak gol di menit setelahnya), sistem **wajib menolak pembatalan** dan menampilkan penjelasan penyebab penolakan.

---

## 4.4 Aturan Validasi Khusus per Cabang Olahraga

1. **Sepakbola & Futsal (`timed_goals`):**
   - Pemain yang telah menerima kartu merah dilarang menerima event `goal`, `foul`, atau `substitution` (masuk lapangan).
   - Kartu kuning kedua kepada pemain yang sama otomatis dikonversi sistem menjadi kartu merah.
   - `own_goal` (gol bunuh diri) otomatis menambahkan angka skor pada tim lawan.
   - Pemain yang ditarik keluar dilarang masuk kembali apabila `reentry_allowed = false`.
   - Jumlah pergantian pemain tidak boleh melebihi `substitutions.max`.
   - Apabila jumlah pemain aktif di lapangan kurang dari `min_on_field_to_continue` (misal < 7 di sepakbola, atau < 3 di futsal), sistem menampilkan peringatan laga harus dihentikan (`abandon` / WO).
   - Pada Futsal: akumulasi pelanggaran dihitung per tim per babak; pelanggaran ke-6 otomatis ditandai sebagai penalti 10 meter tanpa pagar betis.

2. **Bola Voli & Bulutangkis (`rally_set`):**
   - Event `point` ditolak apabila set yang sedang berlangsung sudah selesai.
   - Set selesai bila: skor $\ge$ `points_to_win` (atau `deciding_set_points` di set penentu) dengan selisih $\ge$ `win_by`, atau skor menyentuh angka `max_points` (misal 30 pada bulutangkis).
   - Pertandingan selesai bila salah satu peserta mengamankan $\lceil \text{best\_of} / 2 \rceil$ set kemenangan.
   - Penanda interval istirahat bulutangkis otomatis dimunculkan saat salah satu pemain pertama kali menyentuh angka 11 di tiap set.

3. **Esport (`map_series`):**
   - Pendaftaran `map_result` hanya diizinkan hingga jumlah maksimum map `best_of`.
   - Seri selesai ketika salah satu tim memenangkan $\lceil \text{best\_of} / 2 \rceil$ map.
   - Nomor map (`map_no`) harus urut dan tidak boleh duplikat.

---

## 4.5 State Machine Pertandingan

```
              ┌─────────────────────────────────────────────────────────┐
              │                                                         │
              ▼                                                         │
[scheduled] ──► [lineup_confirmed] ──► [live] ◄──► [break] ──► [finished] ──► [verified]
     │                 │                  │                       │
     ├─────────────────┴──────────────────┼───────────────────────┤
     ▼                                    ▼                       ▼
[postponed] / [cancelled]            [walkover]              [abandoned]
```

### Tabel Transisi & Kewenangan

| Transisi Status | Kewenangan Aktor | Syarat / Prakondisi |
|---|---|---|
| `scheduled` $\rightarrow$ `lineup_confirmed` | Panitia / Admin | Lineup kedua tim terisi memenuhi `squad_min` dan `starters`. |
| `lineup_confirmed` $\rightarrow$ `live` | Panitia / Admin | Lineup telah terkonfirmasi resmi. |
| `live` $\rightleftarrows$ `break` | Panitia / Admin | Mengikuti pergantian babak, jeda set, atau interval waktu. |
| `live` / `break` $\rightarrow$ `finished` | Panitia / Admin | Fungsi `isFinished()` bernilai `true`, atau penghentian manual berizin. |
| `finished` $\rightarrow$ `verified` | **Hanya Admin** | Laga diperiksa, status disahkan, `locked = true`, klasemen diperbarui. |
| `verified` $\rightarrow$ `finished` | **Hanya Admin** | Pembukaan kunci darurat (*unlock*), wajib menyertakan alasan tertulis & masuk audit log. |
| $\rightarrow$ `postponed` / `cancelled` | Admin | Kondisi cuaca, force majeure, atau kendala teknis venue. |
| $\rightarrow$ `walkover` (WO) | Admin / Panitia | Salah satu tim tidak hadir melewati batas toleransi keterlambatan. |
| $\rightarrow$ `abandoned` | Admin / Panitia | Pertandingan dihentikan di tengah jalan karena kericuhan atau pelanggaran kuota pemain. |

---

## 4.6 Format Kompetisi & Registry Tiebreaker Klasemen

### Format Kompetisi
1. `round_robin`: Sistem setengah kompetisi atau kompetisi penuh menggunakan algoritma *Circle Method*.
2. `single_elimination`: Bagan gugur tunggal mendukung jumlah tim non-pangkat-2 dengan penempatan *bye* dan *seeding*.
3. `group_then_knockout`: Penyisihan grup round robin yang dilanjutkan babak gugur untuk tim peringkat teratas.

### Registry Tiebreaker Klasemen
Urutan penentuan peringkat klasemen dieksekusi secara berurutan sesuai daftar `tiebreakers` pada snapshot aturan cabor. Fungsi-fungsi pembanding didaftarkan di `core/standings`:
- `points`: Total poin klasemen tertinggi.
- `goal_difference`: Selisih gol/poin (memasukkan dikurangi kemasukan).
- `goals_for`: Total produktivitas gol/poin yang dicetak.
- `head_to_head_points`: Poin pertandingan langsung antar tim yang memiliki nilai sama.
- `wins`: Total jumlah pertandingan yang dimenangkan.
- `set_ratio`: Rasio set menang dibanding set kalah (voli/bulutangkis).
- `point_ratio`: Rasio total poin rally yang diperoleh dibanding kemasukan.
- `fair_play`: Nilai kedisiplinan terendah (penalti poin kartu kuning/merah).
- `draw_lots`: Undian acak manual oleh panitia (sistem akan menandai status "Perlu Putusan Manual Admin").
