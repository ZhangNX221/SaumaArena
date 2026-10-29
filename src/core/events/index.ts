import { SportModule, MatchEvent, MatchResult, Lineup } from '../types/sport';

export interface EventReductionResult<State = unknown> {
  state: State;
  result: MatchResult;
  appliedEventsCount: number;
}

export function reduceMatchEvents<Rules = unknown, State = unknown>(
  module: SportModule<Rules, State>,
  rules: Rules,
  homeId: string,
  awayId: string,
  events: MatchEvent[],
  lineups?: Lineup[]
): EventReductionResult<State> {
  let state = module.initialState({ rules, homeId, awayId, lineups });

  // Filter out voided events and sort strictly by seq
  const activeEvents = events
    .filter((e) => !e.voidedAt)
    .sort((a, b) => a.seq - b.seq);

  for (const event of activeEvents) {
    state = module.applyEvent(state, event, rules);
  }

  const result = module.getResult(state, rules);

  return {
    state,
    result,
    appliedEventsCount: activeEvents.length,
  };
}
