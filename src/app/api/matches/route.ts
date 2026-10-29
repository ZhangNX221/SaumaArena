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

    const matches = rows.map((r) => ({
      id: r.id,
      competitionId: r.competition_id,
      competitionName: r.competition_name,
      sportCode: r.sport_code,
      stageId: r.stage_id,
      groupId: r.group_id,
      roundNo: r.round_no,
      matchNo: r.match_no,
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
      scheduledAt: r.scheduled_at,
      status: r.status,
      result: JSON.parse(r.result || '{}'),
      winnerTeamId: r.winner_team_id,
      locked: Boolean(r.locked),
    }));

    return NextResponse.json({ success: true, data: matches });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 1. Otorisasi ketat: Hanya ADMIN yang berhak menjadwalkan pertandingan
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json().catch(() => ({}));
    const {
      competitionId,
      stageId,
      groupId,
      roundNo = 1,
      matchNo,
      homeTeamId,
      awayTeamId,
      venueId,
      courtName,
      scheduledAt,
    } = body;

    if (!competitionId || !stageId || !homeTeamId || !awayTeamId || !scheduledAt) {
      return NextResponse.json(
        { success: false, error: 'competitionId, stageId, homeTeamId, awayTeamId, and scheduledAt are required' },
        { status: 400 }
      );
    }

    // Schedule conflict detection (PRD Flow 5.2)
    const courtConflict = query<any>(
      `SELECT id FROM matches 
       WHERE venue_id = ? AND court_name = ? AND scheduled_at = ? AND status != 'cancelled'`,
      [venueId, courtName, scheduledAt]
    );

    if (courtConflict.length > 0) {
      return NextResponse.json(
        { success: false, error: `Bentrok: Lapangan ${courtName} sudah terpakai pada waktu tersebut.` },
        { status: 409 }
      );
    }

    const teamConflict = query<any>(
      `SELECT id FROM matches 
       WHERE (home_team_id IN (?, ?) OR away_team_id IN (?, ?)) 
         AND scheduled_at = ? AND status != 'cancelled'`,
      [homeTeamId, awayTeamId, homeTeamId, awayTeamId, scheduledAt]
    );

    if (teamConflict.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Bentrok: Salah satu tim sudah memiliki jadwal tanding pada waktu tersebut.' },
        { status: 409 }
      );
    }

    const matchId = `m_${randomUUID().slice(0, 8)}`;
    run(
      `INSERT INTO matches (id, competition_id, stage_id, group_id, round_no, match_no, home_team_id, away_team_id, venue_id, court_name, scheduled_at, status, result)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', '{}')`,
      [
        matchId,
        competitionId,
        stageId,
        groupId || null,
        roundNo,
        matchNo || 1,
        homeTeamId,
        awayTeamId,
        venueId || null,
        courtName || null,
        scheduledAt,
      ]
    );

    return NextResponse.json({ success: true, data: { id: matchId } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
