export type ScoringModel = 'timed_goals' | 'rally_set' | 'map_series';

export interface LineupPlayer {
  playerId: string;
  playerName: string;
  jerseyNumber: number;
  position?: string;
  isStarter: boolean;
}

export interface Lineup {
  teamId: string;
  players: LineupPlayer[];
}

export interface MatchEvent {
  id: string; // Client-generated UUID for idempotency
  matchId: string;
  seq: number;
  type: string;
  teamId?: string;
  playerId?: string;
  periodNo?: number;
  clockMs?: number;
  payload?: Record<string, unknown>;
  createdBy?: string;
  createdAt?: string;
  voidedAt?: string;
  voidedBy?: string;
  voidReason?: string;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export interface MatchResult {
  scoreHome: number;
  scoreAway: number;
  winnerTeamId?: string | null; // null for draw
  isDraw?: boolean;
  pointsHome: number;
  pointsAway: number;
  details?: Record<string, unknown>;
}

export interface ConsoleActionButton {
  id: string;
  label: string;
  type: string;
  requiresPlayer?: boolean;
  variant?: 'primary' | 'secondary' | 'warning' | 'danger';
}

export interface ConsoleConfig {
  sportCode: string;
  scoringModel: ScoringModel;
  periodLabel: string;
  actions: ConsoleActionButton[];
}

export interface SportModule<Rules = Record<string, unknown>, State = Record<string, unknown>> {
  code: string;
  scoringModel: ScoringModel;
  validateRules(raw: unknown): { ok: true; rules: Rules } | { ok: false; errors: string[] };
  initialState(ctx: { rules: Rules; homeId: string; awayId: string; lineups?: Lineup[] }): State;
  validateEvent(state: State, event: MatchEvent, rules: Rules): ValidationResult;
  applyEvent(state: State, event: MatchEvent, rules: Rules): State;
  isFinished(state: State, rules: Rules): boolean;
  getResult(state: State, rules: Rules): MatchResult;
  consoleConfig(state: State, rules: Rules): ConsoleConfig;
}
