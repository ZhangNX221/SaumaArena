import { SportModule, MatchEvent, ValidationResult, MatchResult, ConsoleConfig } from '../../core/types/sport';
import template from './template.json';

export interface EsportRules {
  code: string;
  name: string;
  scoring_model: 'map_series';
  series: { best_of: number };
  points_system: { win: number; loss: number };
}

export interface MapResult {
  mapNo: number;
  winnerTeamId: string;
  scoreHome: number;
  scoreAway: number;
}

export interface EsportState {
  homeId: string;
  awayId: string;
  mapsWonHome: number;
  mapsWonAway: number;
  currentMapNo: number;
  mapResults: MapResult[];
  isFinished: boolean;
}

export const esportModule: SportModule<EsportRules, EsportState> = {
  code: 'esport',
  scoringModel: 'map_series',

  validateRules(raw: unknown) {
    if (!raw || typeof raw !== 'object') {
      return { ok: false, errors: ['Rules must be an object'] };
    }
    return { ok: true, rules: { ...template, ...(raw as Record<string, unknown>) } as EsportRules };
  },

  initialState({ homeId, awayId }): EsportState {
    return {
      homeId,
      awayId,
      mapsWonHome: 0,
      mapsWonAway: 0,
      currentMapNo: 1,
      mapResults: [],
      isFinished: false,
    };
  },

  validateEvent(state, event, rules) {
    if (state.isFinished && event.type !== 'match_end') {
      return { valid: false, message: 'Seri pertandingan esport sudah selesai.' };
    }
    if (event.type === 'map_result') {
      if (state.mapResults.length >= rules.series.best_of) {
        return { valid: false, message: 'Jumlah map sudah mencapai batas maksimum best of series.' };
      }
    }
    return { valid: true };
  },

  applyEvent(state, event, rules) {
    const next: EsportState = {
      ...state,
      mapResults: [...state.mapResults],
    };

    if (event.type === 'map_result') {
      const winner = (event.payload?.winnerTeamId as string) || (event.teamId as string);
      const scoreHome = Number(event.payload?.scoreHome ?? 0);
      const scoreAway = Number(event.payload?.scoreAway ?? 0);

      next.mapResults.push({
        mapNo: next.currentMapNo,
        winnerTeamId: winner,
        scoreHome,
        scoreAway,
      });

      if (winner === state.homeId) next.mapsWonHome += 1;
      else if (winner === state.awayId) next.mapsWonAway += 1;

      const neededToWin = Math.ceil(rules.series.best_of / 2);
      if (next.mapsWonHome >= neededToWin || next.mapsWonAway >= neededToWin) {
        next.isFinished = true;
      } else {
        next.currentMapNo += 1;
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
      state.mapsWonHome > state.mapsWonAway
        ? state.homeId
        : state.mapsWonAway > state.mapsWonHome
        ? state.awayId
        : null;

    return {
      scoreHome: state.mapsWonHome,
      scoreAway: state.mapsWonAway,
      winnerTeamId: winner,
      isDraw: false,
      pointsHome: winner === state.homeId ? rules.points_system.win : rules.points_system.loss,
      pointsAway: winner === state.awayId ? rules.points_system.win : rules.points_system.loss,
      details: {
        mapResults: state.mapResults,
      },
    };
  },

  consoleConfig(): ConsoleConfig {
    return {
      sportCode: 'esport',
      scoringModel: 'map_series',
      periodLabel: 'Game / Map',
      actions: [
        { id: 'map_win', label: 'Menang Map', type: 'map_result', variant: 'primary' },
        { id: 'match_end', label: 'Selesaikan Seri', type: 'match_end', variant: 'danger' },
      ],
    };
  },
};
