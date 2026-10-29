import { NextResponse } from 'next/server';
import { queryOne, run } from '@/db/sqlite';
import { validateMatchTransition, MatchStatus, UserRole as StateMachineRole } from '@/core/statemachine';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // 1. Otorisasi ketat (hunt-auth-bypass): Pengguna wajib login sebagai ADMIN atau REFEREE
    const auth = requireAuth(request, ['ADMIN', 'REFEREE']);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const { targetStatus, reason = '' } = body;

    if (!targetStatus) {
      return NextResponse.json(
        { success: false, error: 'targetStatus wajib disertakan.' },
        { status: 400 }
      );
    }

    // 2. Jika peran adalah REFEREE, periksa penugasan laga
    if (user.role === 'REFEREE') {
      const isAssigned = user.assignedMatchIds?.includes(id);
      const officialRow = queryOne<any>(
        'SELECT id FROM match_officials WHERE match_id = ? AND profile_id = ?',
        [id, user.id]
      );
      if (!isAssigned && !officialRow && user.assignedMatchIds && user.assignedMatchIds.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Akses ditolak: Anda tidak memiliki penugasan resmi untuk pertandingan ini.' },
          { status: 403 }
        );
      }
    }

    const match = queryOne<any>('SELECT status, locked FROM matches WHERE id = ?', [id]);
    if (!match) {
      return NextResponse.json({ success: false, error: 'Pertandingan tidak ditemukan' }, { status: 404 });
    }

    if (match.locked && targetStatus !== 'finished') {
      return NextResponse.json(
        { success: false, error: 'Pertandingan telah dikunci (verified). Hanya Admin yang dapat membuka kunci.' },
        { status: 403 }
      );
    }

    // 3. Gunakan peran terverifikasi dari sesi JWT (bukan klaim dari request body)
    const stateRole: StateMachineRole = user.role === 'ADMIN' ? 'admin' : 'official';
    const currentStatus = match.status as MatchStatus;
    const validation = validateMatchTransition(currentStatus, targetStatus as MatchStatus, stateRole, reason);

    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    // Update match status
    run(
      'UPDATE matches SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [targetStatus, id]
    );

    // Record audit log dengan actor_id asli dari sesi
    const auditId = `audit_${randomUUID().slice(0, 8)}`;
    run(
      `INSERT INTO audit_logs (id, actor_id, action, entity, entity_id, before_val, after_val, reason)
       VALUES (?, ?, 'status_change', 'matches', ?, ?, ?, ?)`,
      [
        auditId,
        user.id,
        id,
        JSON.stringify({ status: currentStatus }),
        JSON.stringify({ status: targetStatus }),
        reason,
      ]
    );

    return NextResponse.json({
      success: true,
      data: {
        matchId: id,
        previousStatus: currentStatus,
        currentStatus: targetStatus,
        updatedBy: user.name,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
