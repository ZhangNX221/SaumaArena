export interface TeamInfo {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string;
  schoolName?: string;
  supporterPoints?: number;
}

export interface VerifiedMatchSummary {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  scoreHome: number;
  scoreAway: number;
  pointsHome: number;
  pointsAway: number;
  homeYellowCards?: number;
  homeRedCards?: number;
  awayYellowCards?: number;
  awayRedCards?: number;
}

export interface StandingRow {
  rank: number;
  teamId: string;
  teamName: string;
  shortName: string;
  logoUrl?: string;
  schoolName?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  fairPlayScore: number; // lower penalty is better, or higher fair play
  supporterPoints: number; // Poin Suporter Madrasah MMFC I
}

export type TiebreakerFn = (a: StandingRow, b: StandingRow, matches: VerifiedMatchSummary[]) => number;

export const TIEBREAKER_REGISTRY: Record<string, TiebreakerFn> = {
  points: (a, b) => b.points - a.points,
  goal_difference: (a, b) => b.goalDifference - a.goalDifference,
  goals_for: (a, b) => b.goalsFor - a.goalsFor,
  wins: (a, b) => b.won - a.won,
  fair_play: (a, b) => b.fairPlayScore - a.fairPlayScore, // Higher is better (100 baseline minus cards)
  supporter_fair_play_points: (a, b) => (b.supporterPoints || 0) - (a.supporterPoints || 0),
  supporter_points: (a, b) => (b.supporterPoints || 0) - (a.supporterPoints || 0),
  head_to_head_points: (a, b, matches) => {
    let h2hA = 0;
    let h2hB = 0;
    for (const m of matches) {
      if (m.homeTeamId === a.teamId && m.awayTeamId === b.teamId) {
        h2hA += m.pointsHome;
        h2hB += m.pointsAway;
      } else if (m.homeTeamId === b.teamId && m.awayTeamId === a.teamId) {
        h2hB += m.pointsHome;
        h2hA += m.pointsAway;
      }
    }
    return h2hB - h2hA;
  },
  draw_lots: (a, b) => a.teamName.localeCompare(b.teamName),
};

export function calculateStandings(
  teams: TeamInfo[],
  matches: VerifiedMatchSummary[],
  tiebreakers: string[] = [
    'points',
    'goal_difference',
    'goals_for',
    'head_to_head_points',
    'supporter_fair_play_points',
    'fair_play',
    'draw_lots',
  ]
): StandingRow[] {
  const map = new Map<string, StandingRow>();

  for (const t of teams) {
    map.set(t.id, {
      rank: 0,
      teamId: t.id,
      teamName: t.name,
      shortName: t.shortName,
      logoUrl: t.logoUrl,
      schoolName: t.schoolName,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      fairPlayScore: 100, // starting fair play baseline
      supporterPoints: t.supporterPoints || 0,
    });
  }

  for (const m of matches) {
    const home = map.get(m.homeTeamId);
    const away = map.get(m.awayTeamId);
    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;
    home.goalsFor += m.scoreHome;
    home.goalsAgainst += m.scoreAway;
    away.goalsFor += m.scoreAway;
    away.goalsAgainst += m.scoreHome;

    home.points += m.pointsHome;
    away.points += m.pointsAway;

    if (m.scoreHome > m.scoreAway) {
      home.won += 1;
      away.lost += 1;
    } else if (m.scoreAway > m.scoreHome) {
      away.won += 1;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
    }

    // Fair play penalty: yellow -1, red -3
    home.fairPlayScore -= (m.homeYellowCards || 0) * 1 + (m.homeRedCards || 0) * 3;
    away.fairPlayScore -= (m.awayYellowCards || 0) * 1 + (m.awayRedCards || 0) * 3;
  }

  // Calculate goal differences
  for (const row of map.values()) {
    row.goalDifference = row.goalsFor - row.goalsAgainst;
  }

  const rows = Array.from(map.values());

  // Multi-tier comparator according to configured tiebreaker chain
  rows.sort((a, b) => {
    for (const key of tiebreakers) {
      const fn = TIEBREAKER_REGISTRY[key];
      if (fn) {
        const diff = fn(a, b, matches);
        if (diff !== 0) return diff;
      }
    }
    return a.teamName.localeCompare(b.teamName);
  });

  // Assign ranks
  rows.forEach((r, idx) => {
    r.rank = idx + 1;
  });

  return rows;
}
