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
  matchId?: string;
  status?: string;
  group?: string;
  scoreA?: number;
  scoreB?: number;
  teamAName?: string;
  teamBName?: string;
  foulsCount?: number;
  events?: Array<{
    id: string;
    minute: number;
    type: string;
    teamId: string;
    playerName?: string;
    detail?: string;
  }>;
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

export const INITIAL_BAPS: BAPRecord[] = [];

export const INITIAL_INCIDENTS: IncidentReport[] = [];
