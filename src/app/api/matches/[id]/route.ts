import { NextResponse } from 'next/server';
import { query, queryOne } from '@/db/sqlite';
import '@/sports';
import { sportRegistry } from '@/core/registry';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const match = queryOne<any>(
      `SELECT 
        m.*,
        ht.name as home_team_name, ht.short_name as home_team_short, ht.logo_url as home_team_logo,
        at.name as away_team_name, at.short_name as away_team_short, at.logo_url as away_team_logo,
        v.name as venue_name,
        c.name as competition_name, c.sport_code, c.rules_snapshot
       FROM matches m
       LEFT JOIN teams ht ON m.home_team_id = ht.id
       LEFT JOIN teams at ON m.away_team_id = at.id
       LEFT JOIN venues v ON m.venue_id = v.id
       LEFT JOIN competitions c ON m.competition_id = c.id
       WHERE m.id = ?`,
      [id]
    );

    if (!match) {
      return NextResponse.json({ success: false, error: 'Pertandingan tidak ditemukan' }, { status: 404 });
    }

    // Lineups
    const lineups = query<any>(
      `SELECT ml.*, p.full_name as player_name 
       FROM match_lineups ml
       JOIN players p ON ml.player_id = p.id
       WHERE ml.match_id = ?
       ORDER BY ml.is_starter DESC, ml.jersey_number ASC`,
      [id]
    );

    // Events (all, ordered by seq)
    const events = query<any>(
      `SELECT * FROM match_events WHERE match_id = ? ORDER BY seq ASC`,
      [id]
    );

    // Officials
    const officials = query<any>(
      `SELECT mo.*, p.display_name, p.role
       FROM match_officials mo
       JOIN profiles p ON mo.profile_id = p.id
       WHERE mo.match_id = ?`,
      [id]
    );

    // Sport module console config
    const sportModule = sportRegistry.get(match.sport_code);
    const rules = match.rules_snapshot ? JSON.parse(match.rules_snapshot) : {};
    const consoleConfig = sportModule ? sportModule.consoleConfig({}, rules) : null;

    return NextResponse.json({
      success: true,
      data: {
        id: match.id,
        competitionId: match.competition_id,
        competitionName: match.competition_name,
        sportCode: match.sport_code,
        stageId: match.stage_id,
        groupId: match.group_id,
        roundNo: match.round_no,
        matchNo: match.match_no,
        scheduledAt: match.scheduled_at,
        status: match.status,
        result: JSON.parse(match.result || '{}'),
        winnerTeamId: match.winner_team_id,
        locked: Boolean(match.locked),
        homeTeam: {
          id: match.home_team_id,
          name: match.home_team_name,
          shortName: match.home_team_short,
          logoUrl: match.home_team_logo,
        },
        awayTeam: {
          id: match.away_team_id,
          name: match.away_team_name,
          shortName: match.away_team_short,
          logoUrl: match.away_team_logo,
        },
        venue: {
          id: match.venue_id,
          name: match.venue_name,
          courtName: match.court_name,
        },
        lineups,
        events: events.map((e) => ({
          ...e,
          payload: JSON.parse(e.payload || '{}'),
        })),
        officials,
        consoleConfig,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
