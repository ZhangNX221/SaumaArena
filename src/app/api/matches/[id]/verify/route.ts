import { NextResponse } from 'next/server';
import { queryOne, run } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // 1. Otorisasi ketat (hunt-auth-bypass): Hanya ADMIN yang berhak memverifikasi laga resmi
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const { id: matchId } = await context.params;
    const body = await request.json().catch(() => ({}));
    const { notes = '' } = body;

    const match = queryOne<any>(
      `SELECT * FROM matches WHERE id = ?`,
      [matchId]
    );

    if (!match) {
      return NextResponse.json({ success: false, error: 'Pertandingan tidak ditemukan' }, { status: 404 });
    }

    if (match.status !== 'finished' && match.status !== 'walkover') {
      return NextResponse.json(
        { success: false, error: `Hanya pertandingan dengan status 'finished' atau 'walkover' yang dapat diverifikasi.` },
        { status: 400 }
      );
    }

    // Mark as verified & locked dengan ID admin yang terverifikasi
    run(
      `UPDATE matches 
       SET status = 'verified', locked = 1, verified_by = ?, verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [user.id, matchId]
    );

    // Propagate winner to next match if knockout stage (PRD Flow 5.5)
    if (match.next_match_id && match.winner_team_id && match.next_match_slot) {
      const slotColumn = match.next_match_slot === 'home' ? 'home_team_id' : 'away_team_id';
      run(
        `UPDATE matches SET ${slotColumn} = ? WHERE id = ?`,
        [match.winner_team_id, match.next_match_id]
      );
    }

    // Write audit log
    const auditId = `audit_${randomUUID().slice(0, 8)}`;
    run(
      `INSERT INTO audit_logs (id, actor_id, action, entity, entity_id, before_val, after_val, reason)
       VALUES (?, ?, 'verify_match', 'matches', ?, ?, ?, ?)`,
      [
        auditId,
        user.id,
        matchId,
        JSON.stringify({ status: match.status, locked: match.locked }),
        JSON.stringify({ status: 'verified', locked: 1 }),
        notes || `Pengesahan resmi hasil pertandingan oleh ${user.name}`,
      ]
    );

    return NextResponse.json({
      success: true,
      data: {
        matchId,
        status: 'verified',
        locked: true,
        verifiedBy: user.id,
        verifierName: user.name,
        winnerTeamId: match.winner_team_id,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
