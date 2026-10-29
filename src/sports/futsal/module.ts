import { SportModule, MatchEvent, ValidationResult, MatchResult, ConsoleConfig } from '../../core/types/sport';
import template from './template.json';

export interface FutsalRules {
  code: string;
  name: string;
  scoring_model: 'timed_goals';
  periods: { count: number; minutes: number };
  fouls: { accumulated_threshold_per_period: number };
  discipline: { second_yellow_is_red: boolean };
  points_system: { win: number; draw: number; loss: number };
  tiebreakers: string[];
}

export interface FutsalPlayerState {
  yellowCards: number;
  redCards: number;
}

export interface FutsalState {
  homeId: string;
  awayId: string;
  scoreHome: number;
  scoreAway: number;
  currentPeriod: number;
  foulsCount: { [teamId: string]: number };
  playerStates: { [playerId: string]: FutsalPlayerState };
  isFinished: boolean;
}

export const futsalModule: SportModule<FutsalRules, FutsalState> = {
  code: 'futsal',
  scoringModel: 'timed_goals',

  validateRules(raw: unknown) {
    if (!raw || typeof raw !== 'object') {
      return { ok: false, errors: ['Rules must be an object'] };
    }
    return { ok: true, rules: { ...template, ...(raw as Record<string, unknown>) } as FutsalRules };
  },

  initialState({ homeId, awayId }): FutsalState {
    return {
      homeId,
      awayId,
      scoreHome: 0,
      scoreAway: 0,
      currentPeriod: 1,
      foulsCount: { [homeId]: 0, [awayId]: 0 },
      playerStates: {},
      isFinished: false,
    };
  },

  validateEvent(state, event) {
    if (state.isFinished && event.type !== 'match_end') {
      return { valid: false, message: 'Pertandingan futsal sudah selesai.' };
    }

    const pState = event.playerId ? state.playerStates[event.playerId] : undefined;
    if (pState && pState.redCards > 0) {
      return { valid: false, message: 'Pemain telah menerima kartu merah dan dilarang bertanding.' };
    }

    return { valid: true };
  },

  applyEvent(state, event, rules) {
    const next: FutsalState = {
      ...state,
      foulsCount: { ...state.foulsCount },
      playerStates: { ...state.playerStates },
    };

    const playerId = event.playerId;
    if (playerId && !next.playerStates[playerId]) {
      next.playerStates[playerId] = { yellowCards: 0, redCards: 0 };
    }

    switch (event.type) {
      case 'goal':
        if (event.teamId === state.homeId) next.scoreHome += 1;
        else if (event.teamId === state.awayId) next.scoreAway += 1;
        break;

      case 'own_goal':
        if (event.teamId === state.homeId) next.scoreAway += 1;
        else if (event.teamId === state.awayId) next.scoreHome += 1;
        break;

      case 'foul':
        if (event.teamId) {
          next.foulsCount[event.teamId] = (next.foulsCount[event.teamId] || 0) + 1;
        }
        break;

      case 'yellow_card':
        if (playerId) {
          const p = { ...next.playerStates[playerId] };
          p.yellowCards += 1;
          if (rules.discipline.second_yellow_is_red && p.yellowCards >= 2) {
            p.redCards += 1;
          }
          next.playerStates[playerId] = p;
        }
        break;

      case 'red_card':
        if (playerId) {
          next.playerStates[playerId] = {
            ...next.playerStates[playerId],
            redCards: (next.playerStates[playerId]?.redCards || 0) + 1,
          };
        }
        break;

      case 'period_start':
        if (event.periodNo) {
          next.currentPeriod = event.periodNo;
          // Reset foul accumulation on new period
          next.foulsCount = { [state.homeId]: 0, [state.awayId]: 0 };
        }
        break;

      case 'match_end':
        next.isFinished = true;
        break;
    }

    return next;
  },

  isFinished(state) {
    return state.isFinished;
  },

  getResult(state, rules): MatchResult {
    const isDraw = state.scoreHome === state.scoreAway;
    let winner: string | null = null;
    let pointsHome = rules.points_system.draw;
    let pointsAway = rules.points_system.draw;

    if (state.scoreHome > state.scoreAway) {
      winner = state.homeId;
      pointsHome = rules.points_system.win;
      pointsAway = rules.points_system.loss;
    } else if (state.scoreAway > state.scoreHome) {
      winner = state.awayId;
      pointsHome = rules.points_system.loss;
      pointsAway = rules.points_system.win;
    }

    return {
      scoreHome: state.scoreHome,
      scoreAway: state.scoreAway,
      winnerTeamId: winner,
      isDraw,
      pointsHome,
      pointsAway,
    };
  },

  consoleConfig(): ConsoleConfig {
    return {
      sportCode: 'futsal',
      scoringModel: 'timed_goals',
      periodLabel: 'Babak',
      actions: [
        { id: 'goal', label: '+ Gol', type: 'goal', requiresPlayer: true, variant: 'primary' },
        { id: 'foul', label: '+ Pelanggaran', type: 'foul', variant: 'secondary' },
        { id: 'yellow_card', label: 'Kartu Kuning', type: 'yellow_card', requiresPlayer: true, variant: 'warning' },
        { id: 'red_card', label: 'Kartu Merah', type: 'red_card', requiresPlayer: true, variant: 'danger' },
        { id: 'timeout', label: 'Time Out', type: 'timeout', variant: 'secondary' },
      ],
    };
  },
};
