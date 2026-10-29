import { SportModule, MatchEvent, ValidationResult, MatchResult, ConsoleConfig } from '../../core/types/sport';
import template from './template.json';

export interface VolleyballRules {
  code: string;
  name: string;
  scoring_model: 'rally_set';
  sets: {
    best_of: number;
    points_to_win: number;
    deciding_set_points: number;
    win_by: number;
  };
  tiebreakers: string[];
}

export interface SetScore {
  home: number;
  away: number;
}

export interface VolleyballState {
  homeId: string;
  awayId: string;
  currentSetIndex: number;
  setScores: SetScore[];
  setsWonHome: number;
  setsWonAway: number;
  isFinished: boolean;
}

export const volleyballModule: SportModule<VolleyballRules, VolleyballState> = {
  code: 'volleyball',
  scoringModel: 'rally_set',

  validateRules(raw: unknown) {
    if (!raw || typeof raw !== 'object') {
      return { ok: false, errors: ['Rules must be an object'] };
    }
    return { ok: true, rules: { ...template, ...(raw as Record<string, unknown>) } as VolleyballRules };
  },

  initialState({ homeId, awayId }): VolleyballState {
    return {
      homeId,
      awayId,
      currentSetIndex: 0,
      setScores: [{ home: 0, away: 0 }],
      setsWonHome: 0,
      setsWonAway: 0,
      isFinished: false,
    };
  },

  validateEvent(state, event) {
    if (state.isFinished && event.type !== 'match_end') {
      return { valid: false, message: 'Pertandingan bola voli sudah selesai.' };
    }
    return { valid: true };
  },

  applyEvent(state, event, rules) {
    const next: VolleyballState = {
      ...state,
      setScores: state.setScores.map((s) => ({ ...s })),
    };

    if (event.type === 'point' && !next.isFinished) {
      const current = next.setScores[next.currentSetIndex];
      if (event.teamId === state.homeId) current.home += 1;
      else if (event.teamId === state.awayId) current.away += 1;

      // Check if current set has a winner
      const isDecidingSet = next.currentSetIndex === rules.sets.best_of - 1;
      const targetPoints = isDecidingSet ? rules.sets.deciding_set_points : rules.sets.points_to_win;

      const homeWon = current.home >= targetPoints && current.home - current.away >= rules.sets.win_by;
      const awayWon = current.away >= targetPoints && current.away - current.home >= rules.sets.win_by;

      if (homeWon || awayWon) {
        if (homeWon) next.setsWonHome += 1;
        if (awayWon) next.setsWonAway += 1;

        const neededToWin = Math.ceil(rules.sets.best_of / 2);
        if (next.setsWonHome >= neededToWin || next.setsWonAway >= neededToWin) {
          next.isFinished = true;
        } else {
          next.currentSetIndex += 1;
          next.setScores.push({ home: 0, away: 0 });
        }
      }
    } else if (event.type === 'match_end') {
      next.isFinished = true;
    }

    return next;
  },

  isFinished(state) {
    return state.isFinished;
  },

  getResult(state): MatchResult {
    const winner =
      state.setsWonHome > state.setsWonAway
        ? state.homeId
        : state.setsWonAway > state.setsWonHome
        ? state.awayId
        : null;

    // Standard FIVB points: 3-0 or 3-1 gives 3-0 pts; 3-2 gives 2-1 pts
    let pointsHome = 0;
    let pointsAway = 0;
    const diff = Math.abs(state.setsWonHome - state.setsWonAway);

    if (winner === state.homeId) {
      pointsHome = diff === 1 ? 2 : 3;
      pointsAway = diff === 1 ? 1 : 0;
    } else if (winner === state.awayId) {
      pointsAway = diff === 1 ? 2 : 3;
      pointsHome = diff === 1 ? 1 : 0;
    }

    return {
      scoreHome: state.setsWonHome,
      scoreAway: state.setsWonAway,
      winnerTeamId: winner,
      isDraw: false,
      pointsHome,
      pointsAway,
      details: {
        setScores: state.setScores,
      },
    };
  },

  consoleConfig(): ConsoleConfig {
    return {
      sportCode: 'volleyball',
      scoringModel: 'rally_set',
      periodLabel: 'Set',
      actions: [
        { id: 'point', label: '+1 Poin', type: 'point', variant: 'primary' },
        { id: 'timeout', label: 'Time Out', type: 'timeout', variant: 'secondary' },
      ],
    };
  },
};
