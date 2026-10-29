import { SportModule, MatchEvent, ValidationResult, MatchResult, Lineup, ConsoleConfig } from '../../core/types/sport';
import template from './template.json';

export interface FootballRules {
  code: string;
  name: string;
  scoring_model: 'timed_goals';
  periods: { count: number; minutes: number };
  substitutions: { max: number; reentry_allowed: boolean };
  discipline: { second_yellow_is_red: boolean };
  points_system: { win: number; draw: number; loss: number };
  tiebreakers: string[];
}

export interface FootballPlayerState {
  yellowCards: number;
  redCards: number;
  isOffField: boolean;
}

export interface FootballState {
  homeId: string;
  awayId: string;
  scoreHome: number;
  scoreAway: number;
  currentPeriod: number;
  substitutionsCount: { [teamId: string]: number };
  playerStates: { [playerId: string]: FootballPlayerState };
  isFinished: boolean;
}

export const footballModule: SportModule<FootballRules, FootballState> = {
  code: 'football',
  scoringModel: 'timed_goals',

  validateRules(raw: unknown) {
    if (!raw || typeof raw !== 'object') {
      return { ok: false, errors: ['Rules must be an object'] };
    }
    const r = { ...template, ...(raw as Record<string, unknown>) } as FootballRules;
    return { ok: true, rules: r };
  },

  initialState({ rules, homeId, awayId, lineups }): FootballState {
    const playerStates: { [playerId: string]: FootballPlayerState } = {};
    if (lineups) {
      for (const lineup of lineups) {
        for (const p of lineup.players) {
          playerStates[p.playerId] = {
            yellowCards: 0,
            redCards: 0,
            isOffField: !p.isStarter,
          };
        }
      }
    }
    return {
      homeId,
      awayId,
      scoreHome: 0,
      scoreAway: 0,
      currentPeriod: 1,
      substitutionsCount: { [homeId]: 0, [awayId]: 0 },
      playerStates,
      isFinished: false,
    };
  },

  validateEvent(state, event, rules) {
    if (state.isFinished && event.type !== 'match_end') {
      return { valid: false, message: 'Pertandingan sudah selesai.' };
    }

    const pState = event.playerId ? state.playerStates[event.playerId] : undefined;

    if (pState && pState.redCards > 0) {
      return { valid: false, message: 'Pemain telah menerima kartu merah dan tidak boleh terlibat dalam pertandingan.' };
    }

    if (event.type === 'goal') {
      if (!event.teamId) {
        return { valid: false, message: 'Tim pencetak gol harus ditentukan.' };
      }
    }

    if (event.type === 'substitution') {
      const teamId = event.teamId;
      if (!teamId) return { valid: false, message: 'Tim pergantian pemain harus ditentukan.' };
      const currentSubs = state.substitutionsCount[teamId] || 0;
      if (currentSubs >= rules.substitutions.max) {
        return { valid: false, message: `Batas maksimum pergantian pemain (${rules.substitutions.max}) telah tercapai.` };
      }
    }

    return { valid: true };
  },

  applyEvent(state, event, rules) {
    const next: FootballState = {
      ...state,
      substitutionsCount: { ...state.substitutionsCount },
      playerStates: { ...state.playerStates },
    };

    const playerId = event.playerId;
    if (playerId && !next.playerStates[playerId]) {
      next.playerStates[playerId] = { yellowCards: 0, redCards: 0, isOffField: false };
    }

    switch (event.type) {
      case 'goal':
        if (event.teamId === state.homeId) next.scoreHome += 1;
        else if (event.teamId === state.awayId) next.scoreAway += 1;
        break;

      case 'own_goal':
        // Gol bunuh diri menambah skor tim lawan
        if (event.teamId === state.homeId) next.scoreAway += 1;
        else if (event.teamId === state.awayId) next.scoreHome += 1;
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

      case 'substitution':
        if (event.teamId) {
          next.substitutionsCount[event.teamId] = (next.substitutionsCount[event.teamId] || 0) + 1;
        }
        break;

      case 'period_start':
        if (event.periodNo) next.currentPeriod = event.periodNo;
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
      sportCode: 'football',
      scoringModel: 'timed_goals',
      periodLabel: 'Babak',
      actions: [
        { id: 'goal', label: '+ Gol', type: 'goal', requiresPlayer: true, variant: 'primary' },
        { id: 'yellow_card', label: 'Kartu Kuning', type: 'yellow_card', requiresPlayer: true, variant: 'warning' },
        { id: 'red_card', label: 'Kartu Merah', type: 'red_card', requiresPlayer: true, variant: 'danger' },
        { id: 'substitution', label: 'Pergantian', type: 'substitution', variant: 'secondary' },
        { id: 'own_goal', label: 'Gol Bunuh Diri', type: 'own_goal', variant: 'secondary' },
      ],
    };
  },
};
