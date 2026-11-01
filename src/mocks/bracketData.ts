export interface MatchTeam {
  id: string;
  name: string;
  score: number;
  isWinner?: boolean;
}

export interface BracketMatch {
  id: string;
  stageCode: string;
  stageName: string;
  schedule: string;
  court: string;
  status: 'COMPLETED' | 'LIVE' | 'SCHEDULED';
  teamA: MatchTeam;
  teamB: MatchTeam;
}

export type BracketSize = 24 | 16 | 8 | 4 | 2;

export interface BracketSizeOption {
  value: BracketSize;
  title: string;
  badge: string;
  desc: string;
  stages: string[];
  matchCountText: string;
}

export const STORAGE_KEY_BRACKET_SIZE = 'sauma_arena_bracket_size';

export const BRACKET_SIZE_OPTIONS: BracketSizeOption[] = [
  {
    value: 24,
    title: '24 Besar (Playoff & Eliminasi Lengkap)',
    badge: '24 Tim',
    desc: 'Babak gugur 24 tim dengan Playoff 24 Besar (8 laga) menuju 16 Besar, Perempat Final, Semifinal, dan Grand Final.',
    stages: ['Playoff 24 Besar', '16 Besar', '8 Besar (QF)', 'Semifinal (SF)', 'Grand Final'],
    matchCountText: '23 Pertandingan Eliminasi',
  },
  {
    value: 16,
    title: '16 Besar (Babak Perdelapan Final)',
    badge: '16 Tim',
    desc: 'Babak gugur 16 tim dari 8 laga perdelapan final menuju Perempat Final, Semifinal, dan Grand Final.',
    stages: ['16 Besar (R16)', '8 Besar (QF)', 'Semifinal (SF)', 'Grand Final'],
    matchCountText: '15 Pertandingan Eliminasi',
  },
  {
    value: 8,
    title: '8 Besar (Perempat Final / Quarter Finals)',
    badge: '8 Tim • Standar',
    desc: 'Format standar turnamen: 4 laga Perempat Final dari Juara & Runner-up Grup, Semifinal, dan Grand Final.',
    stages: ['8 Besar (QF)', 'Semifinal (SF)', 'Grand Final'],
    matchCountText: '7 Pertandingan Eliminasi',
  },
  {
    value: 4,
    title: '4 Besar (Babak Semifinal / Final Four)',
    badge: '4 Tim',
    desc: 'Langsung fase Semifinal untuk 4 tim terbaik (Juara Grup A, B, C, D) menuju Grand Final & Perebutan Juara 3.',
    stages: ['Semifinal (SF)', 'Grand Final'],
    matchCountText: '3 Pertandingan Eliminasi',
  },
  {
    value: 2,
    title: '2 Besar (Grand Final Langsung)',
    badge: '2 Tim',
    desc: 'Hanya menyajikan 1 pertandingan puncak perebutan gelar juara utama turnamen dan penentuan podium.',
    stages: ['Grand Final'],
    matchCountText: '1 Pertandingan Puncak',
  },
];

export function getStoredBracketSize(): BracketSize {
  if (typeof window === 'undefined') return 8;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BRACKET_SIZE);
    if (!raw) return 8;
    const val = Number(raw) as BracketSize;
    if ([24, 16, 8, 4, 2].includes(val)) return val;
  } catch {
    // fallback
  }
  return 8;
}

export function saveStoredBracketSize(size: BracketSize): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_BRACKET_SIZE, String(size));
    window.dispatchEvent(new CustomEvent('sauma_bracket_size_updated', { detail: size }));
  } catch (e) {
    console.error('Gagal menyimpan ukuran bagan:', e);
  }
}

export const ROUND_OF_24: BracketMatch[] = [
  {
    id: 'R24-1',
    stageCode: 'R24-1',
    stageName: 'Playoff 24 Besar 1',
    schedule: 'Senin, 2 Nov 2026 • 13:30 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-r24-1a', name: 'Peringkat 9 Klasemen', score: 0 },
    teamB: { id: 'tbd-r24-1b', name: 'Peringkat 24 Klasemen', score: 0 },
  },
  {
    id: 'R24-2',
    stageCode: 'R24-2',
    stageName: 'Playoff 24 Besar 2',
    schedule: 'Senin, 2 Nov 2026 • 14:00 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-r24-2a', name: 'Peringkat 10 Klasemen', score: 0 },
    teamB: { id: 'tbd-r24-2b', name: 'Peringkat 23 Klasemen', score: 0 },
  },
  {
    id: 'R24-3',
    stageCode: 'R24-3',
    stageName: 'Playoff 24 Besar 3',
    schedule: 'Senin, 2 Nov 2026 • 14:30 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-r24-3a', name: 'Peringkat 11 Klasemen', score: 0 },
    teamB: { id: 'tbd-r24-3b', name: 'Peringkat 22 Klasemen', score: 0 },
  },
  {
    id: 'R24-4',
    stageCode: 'R24-4',
    stageName: 'Playoff 24 Besar 4',
    schedule: 'Senin, 2 Nov 2026 • 15:00 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-r24-4a', name: 'Peringkat 12 Klasemen', score: 0 },
    teamB: { id: 'tbd-r24-4b', name: 'Peringkat 21 Klasemen', score: 0 },
  },
  {
    id: 'R24-5',
    stageCode: 'R24-5',
    stageName: 'Playoff 24 Besar 5',
    schedule: 'Senin, 2 Nov 2026 • 15:30 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-r24-5a', name: 'Peringkat 13 Klasemen', score: 0 },
    teamB: { id: 'tbd-r24-5b', name: 'Peringkat 20 Klasemen', score: 0 },
  },
  {
    id: 'R24-6',
    stageCode: 'R24-6',
    stageName: 'Playoff 24 Besar 6',
    schedule: 'Senin, 2 Nov 2026 • 16:00 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-r24-6a', name: 'Peringkat 14 Klasemen', score: 0 },
    teamB: { id: 'tbd-r24-6b', name: 'Peringkat 19 Klasemen', score: 0 },
  },
  {
    id: 'R24-7',
    stageCode: 'R24-7',
    stageName: 'Playoff 24 Besar 7',
    schedule: 'Senin, 2 Nov 2026 • 16:30 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-r24-7a', name: 'Peringkat 15 Klasemen', score: 0 },
    teamB: { id: 'tbd-r24-7b', name: 'Peringkat 18 Klasemen', score: 0 },
  },
  {
    id: 'R24-8',
    stageCode: 'R24-8',
    stageName: 'Playoff 24 Besar 8',
    schedule: 'Senin, 2 Nov 2026 • 17:00 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-r24-8a', name: 'Peringkat 16 Klasemen', score: 0 },
    teamB: { id: 'tbd-r24-8b', name: 'Peringkat 17 Klasemen', score: 0 },
  },
];

export const ROUND_OF_16: BracketMatch[] = [
  {
    id: 'R16-1',
    stageCode: '16 BESAR 1',
    stageName: 'Babak 16 Besar 1',
    schedule: 'Selasa, 3 Nov 2026 • 07:30 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-r16-1a', name: 'Juara Grup A', score: 0 },
    teamB: { id: 'tbd-r16-1b', name: 'Runner-Up Grup B', score: 0 },
  },
  {
    id: 'R16-2',
    stageCode: '16 BESAR 2',
    stageName: 'Babak 16 Besar 2',
    schedule: 'Selasa, 3 Nov 2026 • 08:00 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-r16-2a', name: 'Juara Grup C', score: 0 },
    teamB: { id: 'tbd-r16-2b', name: 'Runner-Up Grup D', score: 0 },
  },
  {
    id: 'R16-3',
    stageCode: '16 BESAR 3',
    stageName: 'Babak 16 Besar 3',
    schedule: 'Selasa, 3 Nov 2026 • 08:30 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-r16-3a', name: 'Juara Grup B', score: 0 },
    teamB: { id: 'tbd-r16-3b', name: 'Runner-Up Grup A', score: 0 },
  },
  {
    id: 'R16-4',
    stageCode: '16 BESAR 4',
    stageName: 'Babak 16 Besar 4',
    schedule: 'Selasa, 3 Nov 2026 • 09:00 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-r16-4a', name: 'Juara Grup D', score: 0 },
    teamB: { id: 'tbd-r16-4b', name: 'Runner-Up Grup C', score: 0 },
  },
  {
    id: 'R16-5',
    stageCode: '16 BESAR 5',
    stageName: 'Babak 16 Besar 5',
    schedule: 'Selasa, 3 Nov 2026 • 09:30 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-r16-5a', name: 'Pemenang Playoff 1', score: 0 },
    teamB: { id: 'tbd-r16-5b', name: 'Pemenang Playoff 2', score: 0 },
  },
  {
    id: 'R16-6',
    stageCode: '16 BESAR 6',
    stageName: 'Babak 16 Besar 6',
    schedule: 'Selasa, 3 Nov 2026 • 10:00 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-r16-6a', name: 'Pemenang Playoff 3', score: 0 },
    teamB: { id: 'tbd-r16-6b', name: 'Pemenang Playoff 4', score: 0 },
  },
  {
    id: 'R16-7',
    stageCode: '16 BESAR 7',
    stageName: 'Babak 16 Besar 7',
    schedule: 'Selasa, 3 Nov 2026 • 10:30 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-r16-7a', name: 'Pemenang Playoff 5', score: 0 },
    teamB: { id: 'tbd-r16-7b', name: 'Pemenang Playoff 6', score: 0 },
  },
  {
    id: 'R16-8',
    stageCode: '16 BESAR 8',
    stageName: 'Babak 16 Besar 8',
    schedule: 'Selasa, 3 Nov 2026 • 11:00 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-r16-8a', name: 'Pemenang Playoff 7', score: 0 },
    teamB: { id: 'tbd-r16-8b', name: 'Pemenang Playoff 8', score: 0 },
  },
];

export const QUARTER_FINALS: [BracketMatch, BracketMatch, BracketMatch, BracketMatch] = [
  {
    id: 'SEED-A',
    stageCode: 'GRUP A',
    stageName: 'Slot Juara Grup A (SF 1)',
    schedule: 'Menunggu Klasemen Grup A',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-a1', name: 'Menunggu Juara Grup A', score: 0 },
    teamB: { id: 'tbd-a2', name: 'Menunggu Runner-Up Grup A', score: 0 },
  },
  {
    id: 'SEED-C',
    stageCode: 'GRUP C',
    stageName: 'Slot Juara Grup C (SF 1)',
    schedule: 'Menunggu Klasemen Grup C',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-c1', name: 'Menunggu Juara Grup C', score: 0 },
    teamB: { id: 'tbd-c2', name: 'Menunggu Runner-Up Grup C', score: 0 },
  },
  {
    id: 'SEED-B',
    stageCode: 'GRUP B',
    stageName: 'Slot Juara Grup B (SF 2)',
    schedule: 'Menunggu Klasemen Grup B',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-b1', name: 'Menunggu Juara Grup B', score: 0 },
    teamB: { id: 'tbd-b2', name: 'Menunggu Runner-Up Grup B', score: 0 },
  },
  {
    id: 'SEED-D',
    stageCode: 'GRUP D',
    stageName: 'Slot Juara Grup D (SF 2)',
    schedule: 'Menunggu Klasemen Grup D',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-d1', name: 'Menunggu Juara Grup D', score: 0 },
    teamB: { id: 'tbd-d2', name: 'Menunggu Runner-Up Grup D', score: 0 },
  },
];

export const SEMI_FINALS: [BracketMatch, BracketMatch] = [
  {
    id: 'P15',
    stageCode: '4 BESAR 1',
    stageName: 'Babak 4 Besar 1 (P15)',
    schedule: 'Selasa, 3 Nov 2026 • 10:00 - 10:30 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-sf1-a', name: 'Menunggu Juara Grup A', score: 0 },
    teamB: { id: 'tbd-sf1-b', name: 'Menunggu Juara Grup C', score: 0 },
  },
  {
    id: 'P16',
    stageCode: '4 BESAR 2',
    stageName: 'Babak 4 Besar 2 (P16)',
    schedule: 'Selasa, 3 Nov 2026 • 10:30 - 11:00 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-sf2-a', name: 'Menunggu Juara Grup B', score: 0 },
    teamB: { id: 'tbd-sf2-b', name: 'Menunggu Juara Grup D', score: 0 },
  },
];

export const GRAND_FINAL: BracketMatch = {
  id: 'P17',
  stageCode: 'FINAL',
  stageName: 'Grand Final (P17)',
  schedule: 'Selasa, 3 Nov 2026 • 11:30 - 12:00 WIB',
  court: 'Lapangan Futsal Seabless',
  status: 'SCHEDULED',
  teamA: { id: 'tbd-fn-1', name: 'JUARA SEMIFINAL 1', score: 0 },
  teamB: { id: 'tbd-fn-2', name: 'JUARA SEMIFINAL 2', score: 0 },
};

export const BRONZE_MATCH: BracketMatch = {
  id: 'BRONZE',
  stageCode: '3RD PLACE',
  stageName: 'Perebutan Juara 3 Bersama',
  schedule: 'Selasa, 3 Nov 2026 • 11:00 - 11:30 WIB',
  court: 'Lapangan Futsal Seabless',
  status: 'SCHEDULED',
  teamA: { id: 'tbd-br-1', name: 'Menunggu Tim Kalah SF 1', score: 0 },
  teamB: { id: 'tbd-br-2', name: 'Menunggu Tim Kalah SF 2', score: 0 },
};
