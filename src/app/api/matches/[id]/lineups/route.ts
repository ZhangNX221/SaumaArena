import { NextResponse } from 'next/server';
import { query, run, transaction } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const lineups = query<any>(
      `SELECT ml.*, p.full_name as player_name, p.position as default_position
       FROM match_lineups ml
       JOIN players p ON ml.player_id = p.id
       WHERE ml.match_id = ?
       ORDER BY ml.is_starter DESC, ml.jersey_number ASC`,
      [id]
    );

    return NextResponse.json({ success: true, data: lineups });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // 1. Otorisasi ketat: Hanya ADMIN atau REFEREE yang berhak mengatur lineup laga
    const auth = requireAuth(request, ['ADMIN', 'REFEREE']);
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const { lineups = [] } = body; // Array of { teamId, playerId, isStarter, jerseyNumber, position }

    // Atomic replacement: Delete old lineups, insert new items, and advance status in a single transaction
    transaction(() => {
      run('DELETE FROM match_lineups WHERE match_id = ?', [id]);

      for (const item of lineups) {
        const lineupId = `ml_${randomUUID().slice(0, 8)}`;
        run(
          `INSERT INTO match_lineups (id, match_id, team_id, player_id, is_starter, position, jersey_number)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            lineupId,
            id,
            item.teamId,
            item.playerId,
            item.isStarter ? 1 : 0,
            item.position || '',
            item.jerseyNumber || 0,
          ]
        );
      }

      // Automatically advance match status to lineup_confirmed if currently scheduled
      run(
        "UPDATE matches SET status = 'lineup_confirmed' WHERE id = ? AND status = 'scheduled'",
        [id]
      );
    });

    return NextResponse.json({ success: true, count: lineups.length }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
