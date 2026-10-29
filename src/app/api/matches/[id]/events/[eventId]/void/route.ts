import { NextResponse } from 'next/server';
import { query, queryOne, run } from '@/db/sqlite';
import '@/sports';
import { sportRegistry } from '@/core/registry';
import { reduceMatchEvents } from '@/core/events';
import { MatchEvent } from '@/core/types/sport';
import { requireAuth } from '@/lib/auth';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string; eventId: string }> }
) {
  try {
    // 1. Otorisasi ketat (hunt-auth-bypass): Pengguna wajib login sebagai ADMIN atau REFEREE
    const auth = requireAuth(request, ['ADMIN', 'REFEREE']);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const { id: matchId, eventId } = await context.params;

    // 2. Jika REFEREE, pastikan memiliki penugasan resmi pada laga ini
    if (user.role === 'REFEREE') {
      const isAssigned = user.assignedMatchIds?.includes(matchId);
      const officialRow = queryOne<any>(
        'SELECT id FROM match_officials WHERE match_id = ? AND profile_id = ?',
        [matchId, user.id]
      );
      if (!isAssigned && !officialRow && user.assignedMatchIds && user.assignedMatchIds.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Akses ditolak: Anda tidak memiliki penugasan untuk mengubah peristiwa laga ini.' },
          { status: 403 }
        );
      }
    }

    const body = await request.json().catch(() => ({}));
    const { reason } = body;

    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Alasan pembatalan (void) wajib diisi.' }, { status: 400 });
    }

    const voidedBy = user.id;

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
        { success: false, error: 'Pertandingan telah dikunci (verified). Tidak dapat membatalkan peristiwa.' },
        { status: 403 }
      );
    }

    const event = queryOne<any>(
      'SELECT * FROM match_events WHERE match_id = ? AND id = ?',
      [matchId, eventId]
    );

    if (!event) {
      return NextResponse.json({ success: false, error: 'Peristiwa tidak ditemukan' }, { status: 404 });
    }

    if (event.voided_at) {
      return NextResponse.json({ success: false, error: 'Peristiwa sudah dibatalkan sebelumnya.' }, { status: 400 });
    }

    // Mark event as voided
    run(
      `UPDATE match_events 
       SET voided_at = CURRENT_TIMESTAMP, voided_by = ?, void_reason = ?
       WHERE match_id = ? AND id = ?`,
      [voidedBy, reason, matchId, eventId]
    );

    // Fetch remaining non-voided events
    const validRows = query<any>(
      'SELECT * FROM match_events WHERE match_id = ? AND voided_at IS NULL ORDER BY seq ASC',
      [matchId]
    );

    const validEvents: MatchEvent[] = validRows.map((e) => ({
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

    const sportModule = sportRegistry.get(match.sport_code);
    const rules = match.rules_snapshot ? JSON.parse(match.rules_snapshot) : {};

    if (sportModule) {
      const { result } = reduceMatchEvents(
        sportModule,
        rules,
        match.home_team_id,
        match.away_team_id,
        validEvents
      );

      run(
        `UPDATE matches 
         SET result = ?, winner_team_id = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [JSON.stringify(result), result.winnerTeamId || null, matchId]
      );

      return NextResponse.json({
        success: true,
        data: {
          voidedEventId: eventId,
          recalculatedResult: result,
        },
      });
    }

    return NextResponse.json({ success: true, data: { voidedEventId: eventId } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
