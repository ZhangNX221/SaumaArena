import { NextResponse } from 'next/server';
import { query, queryOne, run } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import '@/sports';
import { sportRegistry } from '@/core/registry';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const altId = id.startsWith('m_') ? id.replace(/^m_/, '') : `m_${id}`;

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
       WHERE m.id = ? OR m.id = ?`,
      [id, altId]
    );

    if (!match) {
      return NextResponse.json({ success: false, error: 'Pertandingan tidak ditemukan' }, { status: 404 });
    }

    const realId = match.id;

    // Lineups
    const lineups = query<any>(
      `SELECT ml.*, p.full_name as player_name 
       FROM match_lineups ml
       JOIN players p ON ml.player_id = p.id
       WHERE ml.match_id = ?
       ORDER BY ml.is_starter DESC, ml.jersey_number ASC`,
      [realId]
    );

    // Events (all, ordered by seq)
    const events = query<any>(
      `SELECT * FROM match_events WHERE match_id = ? ORDER BY seq ASC`,
      [realId]
    );

    // Officials
    const officials = query<any>(
      `SELECT mo.*, p.display_name, p.role
       FROM match_officials mo
       JOIN profiles p ON mo.profile_id = p.id
       WHERE mo.match_id = ?`,
      [realId]
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

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(request, ['ADMIN', 'REFEREE']);
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const altId = id.startsWith('m_') ? id.replace(/^m_/, '') : `m_${id}`;

    const match = queryOne<any>(
      'SELECT * FROM matches WHERE id = ? OR id = ?',
      [id, altId]
    );

    if (!match) {
      return NextResponse.json({ success: false, error: 'Pertandingan tidak ditemukan' }, { status: 404 });
    }

    const realId = match.id;
    let currentResult: Record<string, any> = {};
    try {
      currentResult = JSON.parse(match.result || '{}');
    } catch {
      currentResult = {};
    }

    const updatedResult: Record<string, any> = { ...currentResult };
    if (body.scoreHome !== undefined || body.scoreA !== undefined) {
      updatedResult.scoreHome = Number(body.scoreHome !== undefined ? body.scoreHome : body.scoreA);
    }
    if (body.scoreAway !== undefined || body.scoreB !== undefined) {
      updatedResult.scoreAway = Number(body.scoreAway !== undefined ? body.scoreAway : body.scoreB);
    }

    let normalizedStatus = match.status;
    if (body.status) {
      const s = String(body.status).toUpperCase();
      if (s === 'LIVE') normalizedStatus = 'live';
      else if (s === 'COMPLETED' || s === 'FINISHED') normalizedStatus = 'finished';
      else if (s === 'UPCOMING' || s === 'SCHEDULED') normalizedStatus = 'scheduled';
      else if (s === 'VERIFIED') normalizedStatus = 'verified';
      else normalizedStatus = String(body.status).toLowerCase();
    }

    const newCourt = body.courtName !== undefined ? body.courtName : match.court_name;
    const newScheduled = body.scheduledAt !== undefined ? body.scheduledAt : match.scheduled_at;
    const newWinner = body.winnerTeamId !== undefined ? body.winnerTeamId : match.winner_team_id;
    const newHomeTeam = body.homeTeamId !== undefined ? body.homeTeamId : match.home_team_id;
    const newAwayTeam = body.awayTeamId !== undefined ? body.awayTeamId : match.away_team_id;

    run(
      `UPDATE matches 
       SET result = ?, status = ?, court_name = ?, scheduled_at = ?, winner_team_id = ?, home_team_id = ?, away_team_id = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        JSON.stringify(updatedResult),
        normalizedStatus,
        newCourt,
        newScheduled,
        newWinner,
        newHomeTeam,
        newAwayTeam,
        realId,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Pertandingan berhasil disinkronkan ke database',
      data: {
        id: realId,
        status: normalizedStatus,
        result: updatedResult,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;
    const altId = id.startsWith('m_') ? id.replace(/^m_/, '') : `m_${id}`;

    const match = queryOne<any>(
      'SELECT id FROM matches WHERE id = ? OR id = ?',
      [id, altId]
    );

    if (!match) {
      return NextResponse.json({ success: false, error: 'Pertandingan tidak ditemukan' }, { status: 404 });
    }

    run('DELETE FROM matches WHERE id = ?', [match.id]);
    return NextResponse.json({ success: true, message: 'Pertandingan berhasil dihapus dari database' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
