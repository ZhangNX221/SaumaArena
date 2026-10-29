import { NextResponse } from 'next/server';
import { query, queryOne } from '@/db/sqlite';
import { calculateStandings, TeamInfo, VerifiedMatchSummary } from '@/core/standings';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const competitionId = searchParams.get('competitionId');
    const groupId = searchParams.get('groupId');

    if (!competitionId) {
      return NextResponse.json({ success: false, error: 'competitionId is required' }, { status: 400 });
    }

    const comp = queryOne<any>('SELECT rules_snapshot FROM competitions WHERE id = ?', [competitionId]);
    const rules = comp?.rules_snapshot ? JSON.parse(comp.rules_snapshot) : {};
    const tiebreakers = rules.tiebreakers || ['points', 'goal_difference', 'goals_for', 'head_to_head_points', 'fair_play', 'draw_lots'];

    // 1. Fetch registered teams
    let teamSql = `
      SELECT t.id, t.name, t.short_name as shortName, t.logo_url as logoUrl, t.school_name as schoolName
      FROM competition_teams ct
      JOIN teams t ON ct.team_id = t.id
      WHERE ct.competition_id = ?
    `;
    const teamParams: unknown[] = [competitionId];

    if (groupId) {
      teamSql += ' AND ct.group_id = ?';
      teamParams.push(groupId);
    }

    const teams = query<TeamInfo>(teamSql, teamParams);

    // 2. Fetch only VERIFIED matches for official standings (PRD ADR-003)
    let matchSql = `
      SELECT id, home_team_id, away_team_id, result
      FROM matches
      WHERE competition_id = ? AND status = 'verified'
    `;
    const matchParams: unknown[] = [competitionId];

    if (groupId) {
      matchSql += ' AND group_id = ?';
      matchParams.push(groupId);
    }

    const matchRows = query<any>(matchSql, matchParams);

    // Parse match summaries and calculate cards for fair play
    const verifiedMatches: VerifiedMatchSummary[] = matchRows.map((m) => {
      const res = JSON.parse(m.result || '{}');

      // Fetch cards for home & away teams
      const cardCounts = query<any>(
        `SELECT team_id,
          SUM(CASE WHEN type = 'yellow_card' THEN 1 ELSE 0 END) as yellows,
          SUM(CASE WHEN type = 'red_card' THEN 1 ELSE 0 END) as reds
         FROM match_events
         WHERE match_id = ? AND voided_at IS NULL
         GROUP BY team_id`,
        [m.id]
      );

      const homeCards = cardCounts.find((c) => c.team_id === m.home_team_id);
      const awayCards = cardCounts.find((c) => c.team_id === m.away_team_id);

      return {
        id: m.id,
        homeTeamId: m.home_team_id,
        awayTeamId: m.away_team_id,
        scoreHome: Number(res.scoreHome ?? 0),
        scoreAway: Number(res.scoreAway ?? 0),
        pointsHome: Number(res.pointsHome ?? 0),
        pointsAway: Number(res.pointsAway ?? 0),
        homeYellowCards: homeCards?.yellows || 0,
        homeRedCards: homeCards?.reds || 0,
        awayYellowCards: awayCards?.yellows || 0,
        awayRedCards: awayCards?.reds || 0,
      };
    });

    const standings = calculateStandings(teams, verifiedMatches, tiebreakers);

    return NextResponse.json({
      success: true,
      data: {
        competitionId,
        groupId,
        tiebreakers,
        verifiedMatchesCount: verifiedMatches.length,
        standings,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
