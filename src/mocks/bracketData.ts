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
    id: 'QF-1',
    stageCode: 'QF 1',
    stageName: 'Perempat Final 1',
    schedule: '26 Okt • 09:00 WIB',
    court: 'Lapangan Indoor Vinyl',
    status: 'COMPLETED',
    teamA: { id: 'team-min1', name: 'MIN 1 Kota', score: 4, isWinner: true },
    teamB: { id: 'team-bina-insani', name: 'SDIT Bina Insani', score: 1 },
  },
  {
    id: 'QF-2',
    stageCode: 'QF 2',
    stageName: 'Perempat Final 2',
    schedule: '26 Okt • 10:30 WIB',
    court: 'Lapangan Indoor Vinyl',
    status: 'COMPLETED',
    teamA: { id: 'team-sdn-percobaan', name: 'SDN Percobaan 1', score: 3, isWinner: true },
    teamB: { id: 'team-maarif', name: "MI Ma'arif Nurul Ulum", score: 2 },
  },
  {
    id: 'QF-3',
    stageCode: 'QF 3',
    stageName: 'Perempat Final 3',
    schedule: '26 Okt • 13:00 WIB',
    court: 'Lapangan Indoor Vinyl',
    status: 'COMPLETED',
    teamA: { id: 'team-min2', name: 'MIN 2 Unggulan', score: 5, isWinner: true },
    teamB: { id: 'team-harum', name: 'SDIT Harapan Umat', score: 1 },
  },
  {
    id: 'QF-4',
    stageCode: 'QF 4',
    stageName: 'Perempat Final 4',
    schedule: '26 Okt • 14:30 WIB',
    court: 'Lapangan Indoor Vinyl',
    status: 'COMPLETED',
    teamA: { id: 'team-alhidayah', name: 'MIS Al-Hidayah', score: 3, isWinner: true },
    teamB: { id: 'team-sdn-harapan', name: 'SDN 2 Harapan', score: 2 },
  },
];

export const SEMI_FINALS: [BracketMatch, BracketMatch] = [
  {
    id: 'SF-1',
    stageCode: 'SF 1',
    stageName: 'Semifinal 1',
    schedule: '27 Okt • 09:30 WIB',
    court: 'Lapangan Indoor Vinyl',
    status: 'COMPLETED',
    teamA: { id: 'team-min1', name: 'MIN 1 Kota', score: 3, isWinner: true },
    teamB: { id: 'team-sdn-percobaan', name: 'SDN Percobaan 1', score: 1 },
  },
  {
    id: 'SF-2',
    stageCode: 'SF 2',
    stageName: 'Semifinal 2',
    schedule: '27 Okt • 11:00 WIB',
    court: 'Lapangan Indoor Vinyl',
    status: 'COMPLETED',
    teamA: { id: 'team-min2', name: 'MIN 2 Unggulan', score: 4, isWinner: true },
    teamB: { id: 'team-alhidayah', name: 'MIS Al-Hidayah', score: 2 },
  },
];

export const GRAND_FINAL: BracketMatch = {
  id: 'FINAL',
  stageCode: 'FINAL',
  stageName: 'Grand Final MMFC I',
  schedule: '28 Okt • 14:00 WIB',
  court: 'Lapangan Utama Indoor',
  status: 'COMPLETED',
  teamA: { id: 'team-min1', name: 'MIN 1 Kota', score: 3, isWinner: true },
  teamB: { id: 'team-min2', name: 'MIN 2 Unggulan', score: 1 },
};

export const BRONZE_MATCH: BracketMatch = {
  id: 'BRONZE',
  stageCode: '3RD PLACE',
  stageName: 'Perebutan Juara 3',
  schedule: '28 Okt • 10:00 WIB',
  court: 'Lapangan Utama Indoor',
  status: 'COMPLETED',
  teamA: { id: 'team-sdn-percobaan', name: 'SDN Percobaan 1', score: 3, isWinner: true },
  teamB: { id: 'team-alhidayah', name: 'MIS Al-Hidayah', score: 2 },
};
