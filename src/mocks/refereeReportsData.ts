export interface BAPRecord {
  id: string;
  matchNumber: number;
  teams: string;
  court: string;
  score: string;
  date: string;
  referee1: string;
  referee2: string;
  yellowCards: number;
  redCards: number;
  isFullySigned: boolean;
  sport: string;
}

export interface IncidentReport {
  id: string;
  matchTitle: string;
  minute: number;
  incidentType: string;
  details: string;
  timestamp: string;
  status: 'SUBMITTED' | 'REVIEWED';
}

export const INITIAL_BAPS: BAPRecord[] = [
  {
    id: 'bap-101',
    matchNumber: 1,
    teams: 'MIN 1 Kota vs MIS Al-Hidayah',
    court: 'Lapangan Utama (Vinyl)',
    score: '4 - 2',
    date: '24 Okt 2026, 09:30 WIB',
    referee1: 'M. Irfan, S.Pd',
    referee2: 'Ahmad Fauzi, S.Pd',
    yellowCards: 2,
    redCards: 0,
    isFullySigned: true,
    sport: 'Futsal Putra',
  },
  {
    id: 'bap-102',
    matchNumber: 2,
    teams: 'SDN Percobaan 1 vs SDIT Bina Insani',
    court: 'Lapangan 2 (Semen)',
    score: '3 - 3 (Pen. 4-3)',
    date: '24 Okt 2026, 11:15 WIB',
    referee1: 'Budi Santoso',
    referee2: 'M. Irfan, S.Pd',
    yellowCards: 4,
    redCards: 1,
    isFullySigned: true,
    sport: 'Futsal Putra',
  },
];

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'inc-01',
    matchTitle: 'MIN 1 Kota vs MIS Al-Hidayah (Laga #1)',
    minute: 14,
    incidentType: 'Protes Keras Official',
    details: 'Pelatih kepala MIS Al-Hidayah memasuki lapangan mempertanyakan keputusan handsball pemain nomor 7.',
    timestamp: '24 Okt 2026, 09:10 WIB',
    status: 'REVIEWED',
  },
];
