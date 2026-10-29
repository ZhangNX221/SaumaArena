import { SportModule, MatchEvent, ValidationResult, MatchResult, ConsoleConfig } from '../../core/types/sport';
import template from './template.json';

export interface BadmintonRules {
  code: string;
  name: string;
  scoring_model: 'rally_set';
  sets: {
    best_of: number;
    points_to_win: number;
    deciding_set_points: number;
    win_by: number;
    max_points: number;
  };
  interval: { at_leading_points: number };
  points_system: { win: number; loss: number };
}

export interface BadmintonSetScore {
  home: number;
  away: number;
}

export interface BadmintonState {
  homeId: string;
  awayId: string;
  currentSetIndex: number;
  setScores: BadmintonSetScore[];
  setsWonHome: number;
  setsWonAway: number;
  intervalTriggered: boolean;
  isFinished: boolean;
}

export const badmintonModule: SportModule<BadmintonRules, BadmintonState> = {
  code: 'badminton',
  scoringModel: 'rally_set',

  validateRules(raw: unknown) {
    if (!raw || typeof raw !== 'object') {
      return { ok: false, errors: ['Rules must be an object'] };
    }
    return { ok: true, rules: { ...template, ...(raw as Record<string, unknown>) } as BadmintonRules };
  },

  initialState({ homeId, awayId }): BadmintonState {
    return {
      homeId,
      awayId,
      currentSetIndex: 0,
      setScores: [{ home: 0, away: 0 }],
      setsWonHome: 0,
      setsWonAway: 0,
      intervalTriggered: false,
      isFinished: false,
    };
  },

  validateEvent(state, event) {
    if (state.isFinished && event.type !== 'match_end') {
      return { valid: false, message: 'Pertandingan bulutangkis sudah selesai.' };
    }
    return { valid: true };
  },

  applyEvent(state, event, rules) {
    const next: BadmintonState = {
      ...state,
      setScores: state.setScores.map((s) => ({ ...s })),
    };

    if (event.type === 'point' && !next.isFinished) {
      const current = next.setScores[next.currentSetIndex];
      if (event.teamId === state.homeId) current.home += 1;
      else if (event.teamId === state.awayId) current.away += 1;

      // Interval 11 points check
      if (
        !next.intervalTriggered &&
        (current.home === rules.interval.at_leading_points || current.away === rules.interval.at_leading_points)
      ) {
        next.intervalTriggered = true;
      }

      // Check set finish: win by 2 up to max_points (30)
      const maxPts = rules.sets.max_points;
      const targetPts = rules.sets.points_to_win;
      const homeWon =
        current.home === maxPts || (current.home >= targetPts && current.home - current.away >= rules.sets.win_by);
      const awayWon =
        current.away === maxPts || (current.away >= targetPts && current.away - current.home >= rules.sets.win_by);

      if (homeWon || awayWon) {
        if (homeWon) next.setsWonHome += 1;
        if (awayWon) next.setsWonAway += 1;

        const neededToWin = Math.ceil(rules.sets.best_of / 2);
        if (next.setsWonHome >= neededToWin || next.setsWonAway >= neededToWin) {
          next.isFinished = true;
        } else {
          next.currentSetIndex += 1;
          next.intervalTriggered = false;
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

  getResult(state, rules): MatchResult {
    const winner =
      state.setsWonHome > state.setsWonAway
        ? state.homeId
        : state.setsWonAway > state.setsWonHome
        ? state.awayId
        : null;

    return {
      scoreHome: state.setsWonHome,
      scoreAway: state.setsWonAway,
      winnerTeamId: winner,
      isDraw: false,
      pointsHome: winner === state.homeId ? rules.points_system.win : rules.points_system.loss,
      pointsAway: winner === state.awayId ? rules.points_system.win : rules.points_system.loss,
      details: {
        setScores: state.setScores,
      },
    };
  },

  consoleConfig(): ConsoleConfig {
    return {
      sportCode: 'badminton',
      scoringModel: 'rally_set',
      periodLabel: 'Game',
      actions: [
        { id: 'point', label: '+1 Poin', type: 'point', variant: 'primary' },
        { id: 'interval', label: 'Interval (11 Poin)', type: 'interval', variant: 'secondary' },
      ],
    };
  },
};
