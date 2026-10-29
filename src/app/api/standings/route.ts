import { NextResponse } from 'next/server';
import { query, queryOne, run } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { calculateStandings, TeamInfo, VerifiedMatchSummary } from '@/core/standings';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const competitionId = searchParams.get('competitionId') || 'comp_futsal_2026';
    const groupId = searchParams.get('groupId');

    const comp = queryOne<any>(
      'SELECT rules_snapshot, rules_overrides FROM competitions WHERE id = ?',
      [competitionId]
    );
    const rules = comp?.rules_snapshot ? JSON.parse(comp.rules_snapshot) : {};
    const overrides = comp?.rules_overrides ? JSON.parse(comp.rules_overrides) : {};
    const tiebreakers = rules.tiebreakers || [
      'points',
      'goal_difference',
      'goals_for',
      'head_to_head_points',
      'supporter_fair_play_points',
      'fair_play',
      'draw_lots',
    ];

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

    const rawTeams = query<TeamInfo>(teamSql, teamParams);

    // Ambil poin suporter per tim dari tabel supporter_scores
    const supporterMap = new Map<string, number>();
    try {
      const supRows = query<any>(
        'SELECT team_id, total_score FROM supporter_scores WHERE competition_id = ?',
        [competitionId]
      );
      for (const s of supRows) {
        supporterMap.set(s.team_id, s.total_score || 0);
      }
    } catch (e) {
      console.warn('Could not load supporter_scores for standings:', e);
    }

    const teams: TeamInfo[] = rawTeams.map((t) => ({
      ...t,
      supporterPoints: supporterMap.get(t.id) || 0,
    }));

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

    const matchIds = matchRows.map((m) => m.id);
    const cardMap = new Map<string, { yellows: number; reds: number }>();
    if (matchIds.length > 0) {
      const placeholders = matchIds.map(() => '?').join(',');
      const cardCounts = query<any>(
        `SELECT match_id, team_id,
          SUM(CASE WHEN LOWER(type) = 'yellow_card' THEN 1 ELSE 0 END) as yellows,
          SUM(CASE WHEN LOWER(type) = 'red_card' THEN 1 ELSE 0 END) as reds
         FROM match_events
         WHERE match_id IN (${placeholders}) AND voided_at IS NULL
         GROUP BY match_id, team_id`,
        matchIds
      );
      for (const c of cardCounts) {
        cardMap.set(`${c.match_id}_${c.team_id}`, {
          yellows: Number(c.yellows) || 0,
          reds: Number(c.reds) || 0,
        });
      }
    }

    const verifiedMatches: VerifiedMatchSummary[] = matchRows.map((m) => {
      const res = JSON.parse(m.result || '{}');
      const homeCards = cardMap.get(`${m.id}_${m.home_team_id}`);
      const awayCards = cardMap.get(`${m.id}_${m.away_team_id}`);

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
        groupStandingsSnapshot: overrides.standings_override || null,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const competitionId = body.competitionId || 'comp_futsal_2026';
    const groups = body.groups;

    if (!groups) {
      return NextResponse.json({ success: false, error: 'Missing groups payload' }, { status: 400 });
    }

    const comp = queryOne<any>('SELECT rules_overrides FROM competitions WHERE id = ?', [competitionId]);
    const currentOverrides = comp?.rules_overrides ? JSON.parse(comp.rules_overrides) : {};
    currentOverrides.standings_override = groups;

    run('UPDATE competitions SET rules_overrides = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
      JSON.stringify(currentOverrides),
      competitionId,
    ]);

    return NextResponse.json({
      success: true,
      message: 'Klasemen grup berhasil disimpan ke database SQLite',
      data: groups,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
