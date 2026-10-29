import { NextResponse } from 'next/server';
import { query, queryOne, run } from '@/db/sqlite';
import '@/sports';
import { sportRegistry } from '@/core/registry';
import { reduceMatchEvents } from '@/core/events';
import { MatchEvent } from '@/core/types/sport';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const events = query<any>('SELECT * FROM match_events WHERE match_id = ? ORDER BY seq ASC', [id]);
    return NextResponse.json({
      success: true,
      data: events.map((e) => ({
        ...e,
        payload: JSON.parse(e.payload || '{}'),
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // 1. Otorisasi ketat (hunt-auth-bypass): Pengguna wajib login sebagai ADMIN atau REFEREE
    const auth = requireAuth(request, ['ADMIN', 'REFEREE']);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const { id: matchId } = await context.params;

    // 2. Jika REFEREE, pastikan memiliki penugasan resmi pada laga ini
    if (user.role === 'REFEREE') {
      const isAssigned = user.assignedMatchIds?.includes(matchId);
      const officialRow = queryOne<any>(
        'SELECT id FROM match_officials WHERE match_id = ? AND profile_id = ?',
        [matchId, user.id]
      );
      if (!isAssigned && !officialRow && user.assignedMatchIds && user.assignedMatchIds.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Akses ditolak: Anda tidak memiliki penugasan untuk mencatat skor pertandingan ini.' },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const {
      id = randomUUID(), // Client-generated UUID for idempotency
      type,
      teamId,
      playerId,
      periodNo,
      clockMs,
      payload = {},
    } = body;

    // createdBy mutlak diambil dari user terotentikasi, bukan dari klaim body
    const createdBy = user.id;

    // 1. Check idempotency: if event with this id already exists, return it (ADR-007)
    const existing = queryOne<any>('SELECT * FROM match_events WHERE match_id = ? AND id = ?', [matchId, id]);
    if (existing) {
      return NextResponse.json({
        success: true,
        idempotent: true,
        data: { ...existing, payload: JSON.parse(existing.payload || '{}') },
      });
    }

    // 2. Fetch match and sport module
    const match = queryOne<any>(
      `SELECT m.*, c.sport_code, c.rules_snapshot
       FROM matches m
       JOIN competitions c ON m.competition_id = c.id
       WHERE m.id = ?`,
      [matchId]
    );

    if (!match) {
      return NextResponse.json({ success: false, error: 'Pertandingan tidak ditemukan' }, { status: 404 });
    }

    if (match.locked) {
      return NextResponse.json(
        { success: false, error: 'Pertandingan telah dikunci (verified). Tidak dapat menambah peristiwa baru.' },
        { status: 403 }
      );
    }

    const sportModule = sportRegistry.get(match.sport_code);
    if (!sportModule) {
      return NextResponse.json({ success: false, error: `Modul cabang '${match.sport_code}' tidak terdaftar.` }, { status: 500 });
    }

    const rules = match.rules_snapshot ? JSON.parse(match.rules_snapshot) : {};

    // 3. Fetch past valid events to compute current state
    const pastEventRows = query<any>(
      'SELECT * FROM match_events WHERE match_id = ? AND voided_at IS NULL ORDER BY seq ASC',
      [matchId]
    );

    const pastEvents: MatchEvent[] = pastEventRows.map((e) => ({
      id: e.id,
      matchId: e.match_id,
      seq: e.seq,
      type: e.type,
      teamId: e.team_id,
      playerId: e.player_id,
      periodNo: e.period_no,
      clockMs: e.clock_ms,
      payload: JSON.parse(e.payload || '{}'),
      createdAt: e.created_at,
    }));

    // 4. Compute current state
    const { state: currentState } = reduceMatchEvents(
      sportModule,
      rules,
      match.home_team_id,
      match.away_team_id,
      pastEvents
    );

    // 5. Next seq
    const lastSeqRow = queryOne<{ maxSeq: number }>(
      'SELECT COALESCE(MAX(seq), 0) as maxSeq FROM match_events WHERE match_id = ?',
      [matchId]
    );
    const nextSeq = (lastSeqRow?.maxSeq ?? 0) + 1;

    const newEvent: MatchEvent = {
      id,
      matchId,
      seq: nextSeq,
      type,
      teamId,
      playerId,
      periodNo,
      clockMs,
      payload,
      createdBy,
    };

    // 6. Validate event using pure rule engine
    const validation = sportModule.validateEvent(currentState, newEvent, rules);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.message || 'Peristiwa pertandingan tidak sah.' },
        { status: 400 }
      );
    }

    // 7. Insert event into SQLite
    run(
      `INSERT INTO match_events (id, match_id, seq, type, team_id, player_id, period_no, clock_ms, payload, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        matchId,
        nextSeq,
        type,
        teamId || null,
        playerId || null,
        periodNo || null,
        clockMs || null,
        JSON.stringify(payload),
        createdBy,
      ]
    );

    // 8. Recalculate match result
    const allEvents = [...pastEvents, newEvent];
    const { state: nextState, result: nextResult } = reduceMatchEvents(
      sportModule,
      rules,
      match.home_team_id,
      match.away_team_id,
      allEvents
    );

    // 9. Update match result cache in database
    const isFinished = sportModule.isFinished(nextState, rules);
    const updatedStatus = isFinished ? 'finished' : match.status === 'scheduled' || match.status === 'lineup_confirmed' ? 'live' : match.status;

    run(
      `UPDATE matches 
       SET result = ?, winner_team_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [JSON.stringify(nextResult), nextResult.winnerTeamId || null, updatedStatus, matchId]
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          event: newEvent,
          result: nextResult,
          status: updatedStatus,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
