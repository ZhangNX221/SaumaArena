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
> = {};

export interface CaborStatLeader {
  rank: number;
  name: string;
  team: string;
  metricLabel: string;
  metricValue: string | number;
  badge: string;
}

export const CABOR_STATS_LEADERS: Record<string, { title: string; subtitle: string; leaders: CaborStatLeader[] }> = {};
