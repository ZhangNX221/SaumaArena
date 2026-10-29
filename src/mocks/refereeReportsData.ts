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

export const INITIAL_BAPS: BAPRecord[] = [];

export const INITIAL_INCIDENTS: IncidentReport[] = [];
