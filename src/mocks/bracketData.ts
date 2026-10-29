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
    schedule: 'Rabu, 4 Nov 2026 • 10:00 - 10:30 WIB',
    court: 'Lapangan Futsal Seabless',
    status: 'SCHEDULED',
    teamA: { id: 'tbd-sf1-a', name: 'Menunggu Juara Grup A', score: 0 },
    teamB: { id: 'tbd-sf1-b', name: 'Menunggu Juara Grup C', score: 0 },
  },
  {
    id: 'P16',
    stageCode: '4 BESAR 2',
    stageName: 'Babak 4 Besar 2 (P16)',
    schedule: 'Rabu, 4 Nov 2026 • 10:30 - 11:00 WIB',
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
  schedule: 'Rabu, 4 Nov 2026 • 11:30 - 12:00 WIB',
  court: 'Lapangan Futsal Seabless',
  status: 'SCHEDULED',
  teamA: { id: 'tbd-fn-1', name: 'Menunggu Pemenang SF 1 (P15)', score: 0 },
  teamB: { id: 'tbd-fn-2', name: 'Menunggu Pemenang SF 2 (P16)', score: 0 },
};

export const BRONZE_MATCH: BracketMatch = {
  id: 'BRONZE',
  stageCode: '3RD PLACE',
  stageName: 'Perebutan Juara 3 Bersama',
  schedule: 'Rabu, 4 Nov 2026 • 11:00 - 11:30 WIB',
  court: 'Lapangan Futsal Seabless',
  status: 'SCHEDULED',
  teamA: { id: 'tbd-br-1', name: 'Menunggu Tim Kalah SF 1', score: 0 },
  teamB: { id: 'tbd-br-2', name: 'Menunggu Tim Kalah SF 2', score: 0 },
};
