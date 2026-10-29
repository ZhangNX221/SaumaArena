import { NextResponse } from 'next/server';
import { query, run } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const competitionId = searchParams.get('competitionId');
    const status = searchParams.get('status');
    const stageId = searchParams.get('stageId');

    let sql = `
      SELECT 
        m.*,
        ht.name as home_team_name, ht.short_name as home_team_short, ht.logo_url as home_team_logo,
        at.name as away_team_name, at.short_name as away_team_short, at.logo_url as away_team_logo,
        v.name as venue_name,
        c.name as competition_name, c.sport_code
      FROM matches m
      LEFT JOIN teams ht ON m.home_team_id = ht.id
      LEFT JOIN teams at ON m.away_team_id = at.id
      LEFT JOIN venues v ON m.venue_id = v.id
      LEFT JOIN competitions c ON m.competition_id = c.id
      WHERE 1=1
    `;
    const params: unknown[] = [];

    if (competitionId) {
      sql += ' AND m.competition_id = ?';
      params.push(competitionId);
    }
    if (status) {
      sql += ' AND m.status = ?';
      params.push(status);
    }
    if (stageId) {
      sql += ' AND m.stage_id = ?';
      params.push(stageId);
    }

    sql += ' ORDER BY m.scheduled_at ASC, m.match_no ASC';
    const rows = query<any>(sql, params);

    const matches = rows.map((r) => {
      let resultObj: { scoreHome?: number; scoreAway?: number } = {};
      try {
        resultObj = JSON.parse(r.result || '{}');
      } catch {
        resultObj = {};
      }

      const cleanId = r.id.replace(/^m_/, '');
      const rawStatus = (r.status || '').toLowerCase();
      const normalizedStatus =
        rawStatus === 'live'
          ? 'LIVE'
          : rawStatus === 'finished' || rawStatus === 'verified' || rawStatus === 'bap_signed'
          ? 'COMPLETED'
          : 'UPCOMING';

      return {
        id: cleanId,
        rawDbId: r.id,
        competitionId: r.competition_id,
        competitionName: r.competition_name,
        sportCode: r.sport_code || 'FUTSAL',
        stageId: r.stage_id,
        stage: r.stage_id === 'stg_ko_1' ? 'KNOCKOUT' : 'GROUP',
        groupId: r.group_id,
        group: r.group_id ? r.group_id.replace(/^grp_/, '').toUpperCase() : undefined,
        roundNo: r.round_no,
        matchNo: r.match_no,
        matchNumber: r.match_no,
        scheduledAt: r.scheduled_at,
        scheduledTime: r.scheduled_at,
        courtName: r.court_name || 'Lapangan Futsal Seabless',
        status: normalizedStatus,
        dbStatus: r.status,
        scoreA: Number(resultObj.scoreHome ?? 0),
        scoreB: Number(resultObj.scoreAway ?? 0),
        teamAId: r.home_team_id || '',
        teamBId: r.away_team_id || '',
        teamAName: r.home_team_name || 'Tim A',
        teamBName: r.away_team_name || 'Tim B',
        teamASchool: r.home_team_name || '',
        teamBSchool: r.away_team_name || '',
        homeTeam: {
          id: r.home_team_id,
          name: r.home_team_name,
          shortName: r.home_team_short,
          logoUrl: r.home_team_logo,
        },
        awayTeam: {
          id: r.away_team_id,
          name: r.away_team_name,
          shortName: r.away_team_short,
          logoUrl: r.away_team_logo,
        },
        venue: {
          id: r.venue_id,
          name: r.venue_name,
          courtName: r.court_name,
        },
        result: resultObj,
        winnerTeamId: r.winner_team_id,
        locked: Boolean(r.locked),
      };
    });

    return NextResponse.json({ success: true, data: matches });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 1. Otorisasi ketat: Hanya ADMIN yang berhak membuat atau menjadwalkan pertandingan
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json().catch(() => ({}));
    const {
      competitionId = 'comp_futsal_2026',
      stageId = 'stg_grp_1',
      groupId = null,
      roundNo = 1,
      matchNo,
      homeTeamId,
      awayTeamId,
      venueId = 'ven_1',
      courtName = 'Lapangan Utama',
      scheduledAt = new Date().toISOString(),
      scoreA = 0,
      scoreB = 0,
      status = 'UPCOMING',
    } = body;

    if (!homeTeamId || !awayTeamId) {
      return NextResponse.json(
        { success: false, error: 'homeTeamId dan awayTeamId wajib diisi' },
        { status: 400 }
      );
    }

    const calculatedMatchNo = matchNo || (query<any>('SELECT COUNT(*) as c FROM matches')[0]?.c || 0) + 1;
    const matchId = `match-${calculatedMatchNo}`;

    const normalizedDbStatus =
      String(status).toUpperCase() === 'LIVE'
        ? 'live'
        : String(status).toUpperCase() === 'COMPLETED'
        ? 'finished'
        : 'scheduled';

    const resultStr = JSON.stringify({
      scoreHome: Number(scoreA) || 0,
      scoreAway: Number(scoreB) || 0,
    });

    run(
      `INSERT OR REPLACE INTO matches (id, competition_id, stage_id, group_id, round_no, match_no, home_team_id, away_team_id, venue_id, court_name, scheduled_at, status, result)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        matchId,
        competitionId,
        stageId,
        groupId || null,
        roundNo,
        calculatedMatchNo,
        homeTeamId,
        awayTeamId,
        venueId,
        courtName,
        scheduledAt,
        normalizedDbStatus,
        resultStr,
      ]
    );

    return NextResponse.json({ success: true, data: { id: matchId, matchNumber: calculatedMatchNo } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
