import { getTeamLogoUrl } from './teamLogos';

export interface CaborStandingRow {
  rank: number;
  teamId: string;
  teamName: string;
  logoUrl: string;
  col1: number; // Voli: Main | Esport: Match W-L
  col2: number; // Voli: Set Menang | Esport: Game Win
  col3: number; // Voli: Set Kalah | Esport: Game Loss
  col4: number; // Voli: Rasio Set | Esport: Selisih Game
  points: number;
  isQualified: boolean;
}

export const CABOR_STANDINGS_DATA: Record<
  string,
  {
    headers: [string, string, string, string, string];
    groupA: CaborStandingRow[];
    groupB: CaborStandingRow[];
  }
> = {
  VOLI: {
    headers: ['Main', 'Set Menang', 'Set Kalah', 'Poin Set', 'Poin Klasemen'],
    groupA: [
      { rank: 1, teamId: 'v1', teamName: 'Rajawali Spikers (MIN 1)', logoUrl: getTeamLogoUrl('team-min1'), col1: 2, col2: 4, col3: 1, col4: 112, points: 6, isQualified: true },
      { rank: 2, teamId: 'v2', teamName: 'Garuda Volley (SDN Percobaan)', logoUrl: getTeamLogoUrl('team-sdn-percobaan'), col1: 2, col2: 3, col3: 2, col4: 98, points: 4, isQualified: true },
      { rank: 3, teamId: 'v3', teamName: 'Sukun Smashers (SDN Kauman 1)', logoUrl: getTeamLogoUrl('team-sdn-kauman'), col1: 2, col2: 2, col3: 3, col4: 85, points: 2, isQualified: false },
      { rank: 4, teamId: 'v4', teamName: 'Bromo Spike (MIS Al-Hidayah)', logoUrl: getTeamLogoUrl('team-alhidayah'), col1: 2, col2: 0, col3: 4, col4: 64, points: 0, isQualified: false },
    ],
    groupB: [
      { rank: 1, teamId: 'v5', teamName: 'Merpati Spikers (Bina Insani)', logoUrl: getTeamLogoUrl('team-bina-insani'), col1: 2, col2: 4, col3: 0, col4: 100, points: 6, isQualified: true },
      { rank: 2, teamId: 'v6', teamName: 'Angkasa Spiker (SD Model)', logoUrl: getTeamLogoUrl('team-sd-model'), col1: 2, col2: 3, col3: 2, col4: 94, points: 4, isQualified: true },
      { rank: 3, teamId: 'v7', teamName: 'Harapan Volley (Permata Hati)', logoUrl: getTeamLogoUrl('team-permata-hati'), col1: 2, col2: 1, col3: 3, col4: 78, points: 2, isQualified: false },
      { rank: 4, teamId: 'v8', teamName: 'Kencana Spikers (Nurul Huda)', logoUrl: getTeamLogoUrl('team-nurul-huda'), col1: 2, col2: 0, col3: 4, col4: 60, points: 0, isQualified: false },
    ],
  },
  ESPORT: {
    headers: ['Match (W-L)', 'Game Win', 'Game Loss', 'Diff Game', 'Poin'],
    groupA: [
      { rank: 1, teamId: 'e1', teamName: 'MIN 1 Cyber Knights', logoUrl: getTeamLogoUrl('team-min1'), col1: 2, col2: 4, col3: 0, col4: 4, points: 6, isQualified: true },
      { rank: 2, teamId: 'e2', teamName: 'Percobaan Esports', logoUrl: getTeamLogoUrl('team-sdn-percobaan'), col1: 2, col2: 3, col3: 2, col4: 1, points: 4, isQualified: true },
      { rank: 3, teamId: 'e3', teamName: 'Kauman Phoenix', logoUrl: getTeamLogoUrl('team-sdn-kauman'), col1: 2, col2: 2, col3: 3, col4: -1, points: 2, isQualified: false },
      { rank: 4, teamId: 'e4', teamName: 'Mythic Al-Hidayah', logoUrl: getTeamLogoUrl('team-alhidayah'), col1: 2, col2: 0, col3: 4, col4: -4, points: 0, isQualified: false },
    ],
    groupB: [
      { rank: 1, teamId: 'e5', teamName: 'Bina Insani Cyber', logoUrl: getTeamLogoUrl('team-bina-insani'), col1: 2, col2: 4, col3: 1, col4: 3, points: 6, isQualified: true },
      { rank: 2, teamId: 'e6', teamName: 'Model Titans', logoUrl: getTeamLogoUrl('team-sd-model'), col1: 2, col2: 3, col3: 2, col4: 1, points: 4, isQualified: true },
      { rank: 3, teamId: 'e7', teamName: 'Vanguard Permata', logoUrl: getTeamLogoUrl('team-permata-hati'), col1: 2, col2: 1, col3: 3, col4: -2, points: 2, isQualified: false },
      { rank: 4, teamId: 'e8', teamName: 'Nurul Huda Legion', logoUrl: getTeamLogoUrl('team-nurul-huda'), col1: 2, col2: 0, col3: 4, col4: -4, points: 0, isQualified: false },
    ],
  },
};

export interface CaborStatLeader {
  rank: number;
  name: string;
  team: string;
  metricLabel: string;
  metricValue: string | number;
  badge: string;
}

export const CABOR_STATS_LEADERS: Record<string, { title: string; subtitle: string; leaders: CaborStatLeader[] }> = {
  VOLI: {
    title: 'Top Spiker & Blocker Terbaik (MVC 2026)',
    subtitle: 'Statistik perolehan poin spike, blok sukses, dan servis ace selama turnamen bola voli berlangsung.',
    leaders: [
      { rank: 1, name: 'Faris Pratama', team: 'Rajawali Spikers (MIN 1)', metricLabel: 'Spike Poin', metricValue: '38 Poin', badge: 'MVP Spiker' },
      { rank: 2, name: 'Bagas Aditya', team: 'Garuda Volley (SDN Percobaan)', metricLabel: 'Spike Poin', metricValue: '31 Poin', badge: 'Ace Spiker' },
      { rank: 3, name: 'Dimas Setiawan', team: 'Sukun Smashers (SDN Kauman 1)', metricLabel: 'Blok Sukses', metricValue: '18 Blok', badge: 'Best Blocker' },
      { rank: 4, name: 'Rizky Ramadhan', team: 'Merpati Spikers (Bina Insani)', metricLabel: 'Servis Ace', metricValue: '12 Ace', badge: 'Ace Server' },
      { rank: 5, name: 'Kevin Pratama', team: 'Angkasa Spiker (SD Model)', metricLabel: 'Poin Total', metricValue: '26 Poin', badge: 'All-Rounder' },
    ],
  },
  ESPORT: {
    title: 'Peringkat MVP & KDA Tertinggi (MLBB Cup 2026)',
    subtitle: 'Statistik performa individu atlet e-sport: Kill-Death-Assist (KDA), Kill Participation, dan gelar MVP.',
    leaders: [
      { rank: 1, name: 'Rafi "SkyFall" Pratama', team: 'MIN 1 Cyber Knights', metricLabel: 'KDA Rasio', metricValue: '12.4 (MVP 3x)', badge: 'Gold Laner MVP' },
      { rank: 2, name: 'Zidan "Apex" Ali', team: 'Percobaan Esports', metricLabel: 'KDA Rasio', metricValue: '9.8 (MVP 2x)', badge: 'Jungler Assassin' },
      { rank: 3, name: 'Reza "Blaze" Saputra', team: 'Kauman Phoenix', metricLabel: 'Kill Part.', metricValue: '86.5%', badge: 'Mid Laner Mage' },
      { rank: 4, name: 'Syamil "Viper" Robbani', team: 'Bina Insani Cyber', metricLabel: 'KDA Rasio', metricValue: '8.2 (MVP 2x)', badge: 'EXP Laner Fighter' },
      { rank: 5, name: 'Arga "Titan" Maulana', team: 'Model Titans', metricLabel: 'Assist Total', metricValue: '48 Assist', badge: 'Roamer Tanker' },
    ],
  },
};
