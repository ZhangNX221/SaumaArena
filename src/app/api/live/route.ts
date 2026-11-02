import { NextResponse } from 'next/server';
import { query, queryOne, run } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { MatchLiveTelemetry, MatchEvent } from '@/types';

const DEFAULT_COMPETITION_ID = 'comp_futsal_2026';

export async function GET() {
  try {
    const compRow = queryOne<any>(
      'SELECT rules_overrides FROM competitions WHERE id = ?',
      [DEFAULT_COMPETITION_ID]
    );

    let overrides: Record<string, any> = {};
    if (compRow?.rules_overrides) {
      try {
        overrides = JSON.parse(compRow.rules_overrides);
      } catch {
        overrides = {};
      }
    }

    const telemetryMap: Record<string, MatchLiveTelemetry> = overrides.live_telemetry || {};
    const liveEventsMap: Record<string, MatchEvent[]> = overrides.live_events || {};
    const activeMatchId: string = overrides.active_referee_match_id || 'match-1';

    const matchRows = query<any>(
      `SELECT 
        m.*,
        ht.name as home_team_name, ht.short_name as home_team_short, ht.logo_url as home_team_logo,
        at.name as away_team_name, at.short_name as away_team_short, at.logo_url as away_team_logo
      FROM matches m
      LEFT JOIN teams ht ON m.home_team_id = ht.id
      LEFT JOIN teams at ON m.away_team_id = at.id
      ORDER BY m.scheduled_at ASC, m.match_no ASC`
    );

    const matches = matchRows.map((r) => {
      let resultObj: { scoreHome?: number; scoreAway?: number } = {};
      try {
        resultObj = JSON.parse(r.result || '{}');
      } catch {
        resultObj = {};
      }

      const rawStatus = (r.status || '').toLowerCase();
      const normalizedStatus =
        rawStatus === 'live'
          ? 'LIVE'
          : rawStatus === 'finished' || rawStatus === 'verified' || rawStatus === 'bap_signed'
          ? 'COMPLETED'
          : 'UPCOMING';

      const stage =
        r.match_no === 17
          ? 'FINAL'
          : r.match_no === 15 || r.match_no === 16
          ? 'SEMI_FINAL'
          : r.stage_id === 'stg_ko_1'
          ? 'KNOCKOUT'
          : 'GROUP';

      const defaultHomeName =
        r.match_no === 15
          ? 'JUARA GRUP A'
          : r.match_no === 16
          ? 'JUARA GRUP B'
          : r.match_no === 17
          ? 'JUARA SEMIFINAL 1'
          : 'Tim A';

      const defaultAwayName =
        r.match_no === 15
          ? 'JUARA GRUP C'
          : r.match_no === 16
          ? 'JUARA GRUP D'
          : r.match_no === 17
          ? 'JUARA SEMIFINAL 2'
          : 'Tim B';

      return {
        id: r.id,
        competitionId: r.competition_id,
        stage,
        group: r.group_id ? r.group_id.replace(/^grp_/, '').toUpperCase() : undefined,
        matchNumber: r.match_no,
        scheduledTime: r.scheduled_at,
        courtName: r.court_name || 'Lapangan Futsal Seabless',
        status: normalizedStatus,
        scoreA: Number(resultObj.scoreHome ?? 0),
        scoreB: Number(resultObj.scoreAway ?? 0),
        teamAId: r.home_team_id || '',
        teamBId: r.away_team_id || '',
        teamAName: r.home_team_name || defaultHomeName,
        teamBName: r.away_team_name || defaultAwayName,
        events: liveEventsMap[r.id] || [],
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        activeMatchId,
        telemetryMap,
        matches,
        serverTime: Date.now(),
      },
    });
  } catch (error: any) {
    console.error('Error in GET /api/live:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = requireAuth(request, ['ADMIN', 'REFEREE']);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json().catch(() => ({}));
    const {
      matchId,
      activeMatchId,
      scoreA,
      scoreB,
      status,
      telemetry,
      events,
    } = body;

    // 1. Perbarui data match di tabel matches jika matchId dan score/status disertakan
    if (matchId) {
      const matchRow = queryOne<any>('SELECT result, status FROM matches WHERE id = ?', [matchId]);
      if (matchRow) {
        let currentResult: { scoreHome?: number; scoreAway?: number } = {};
        try {
          currentResult = JSON.parse(matchRow.result || '{}');
        } catch {
          currentResult = {};
        }

        if (scoreA !== undefined) currentResult.scoreHome = Number(scoreA);
        if (scoreB !== undefined) currentResult.scoreAway = Number(scoreB);

        let newStatus = matchRow.status;
        if (status) {
          const s = String(status).toUpperCase();
          if (s === 'LIVE') newStatus = 'live';
          else if (s === 'COMPLETED' || s === 'FINISHED') newStatus = 'finished';
          else if (s === 'UPCOMING' || s === 'SCHEDULED') newStatus = 'scheduled';
        }

        run(
          'UPDATE matches SET result = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [JSON.stringify(currentResult), newStatus, matchId]
        );
      }
    }

    // 2. Perbarui live_telemetry, live_events, dan active_referee_match_id di tabel competitions
    const compRow = queryOne<any>(
      'SELECT rules_overrides FROM competitions WHERE id = ?',
      [DEFAULT_COMPETITION_ID]
    );

    let overrides: Record<string, any> = {};
    if (compRow?.rules_overrides) {
      try {
        overrides = JSON.parse(compRow.rules_overrides);
      } catch {
        overrides = {};
      }
    }

    if (activeMatchId) {
      overrides.active_referee_match_id = String(activeMatchId);
    } else if (matchId) {
      overrides.active_referee_match_id = String(matchId);
    }

    if (matchId && telemetry) {
      const currentTelemetryMap = overrides.live_telemetry || {};
      currentTelemetryMap[matchId] = {
        ...telemetry,
        updatedAt: Date.now(),
      };
      overrides.live_telemetry = currentTelemetryMap;
    }

    if (matchId && events) {
      const currentEventsMap = overrides.live_events || {};
      currentEventsMap[matchId] = events;
      overrides.live_events = currentEventsMap;
    }

    run(
      'UPDATE competitions SET rules_overrides = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [JSON.stringify(overrides), DEFAULT_COMPETITION_ID]
    );

    return NextResponse.json({
      success: true,
      message: 'Status live skor dan telemetri berhasil disinkronkan ke database',
      serverTime: Date.now(),
    });
  } catch (error: any) {
    console.error('Error in POST /api/live:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

