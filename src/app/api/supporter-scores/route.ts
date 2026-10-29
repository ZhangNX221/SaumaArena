import { NextResponse } from 'next/server';
import { query, queryOne, run } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    let sql = `
      SELECT 
        s.*,
        t.name as team_name,
        t.school_name,
        t.logo_url
      FROM supporter_scores s
      JOIN teams t ON s.team_id = t.id
      WHERE 1=1
    `;
    const params: unknown[] = [];

    if (teamId) {
      sql += ' AND s.team_id = ?';
      params.push(teamId);
    }

    sql += ' ORDER BY s.total_score DESC, s.creativity_points DESC';
    const rows = query<any>(sql, params);

    const leaderboard = rows.map((r, index) => {
      let details = {};
      try {
        details = JSON.parse(r.details_json || '{}');
      } catch {
        details = {};
      }

      return {
        rank: index + 1,
        id: r.id,
        teamId: r.team_id,
        teamName: r.team_name,
        schoolName: r.school_name,
        logoUrl: r.logo_url || '',
        ticketPoints: r.ticket_points || 0,
        creativityPoints: r.creativity_points || 0,
        penaltyPoints: r.penalty_points || 0,
        totalScore: r.total_score || 0,
        details,
        notes: r.notes || '',
        evaluatedBy: r.evaluated_by || null,
        updatedAt: r.updated_at,
        isLeader: index === 0,
      };
    });

    return NextResponse.json({
      success: true,
      count: leaderboard.length,
      leaderboard,
    });
  } catch (error: any) {
    console.error('Error fetching supporter leaderboard:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memuat rekapitulasi nilai suporter madrasah.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      teamId,
      matchId = null,
      positivePoints = 0,
      penaltyPoints = 0,
      details = {},
      notes = '',
    } = body;

    if (!teamId) {
      return NextResponse.json(
        { success: false, error: 'Kontingen suporter sekolah (teamId) wajib dipilih.' },
        { status: 400 }
      );
    }

    const team = queryOne<any>('SELECT * FROM teams WHERE id = ?', [teamId]);
    if (!team) {
      return NextResponse.json(
        { success: false, error: 'Kontingen sekolah tidak ditemukan.' },
        { status: 404 }
      );
    }

    // Otorisasi ketat: Hanya ADMIN atau REFEREE yang berhak memasukkan nilai suporter
    const auth = requireAuth(request, ['ADMIN', 'REFEREE']);
    if (auth instanceof NextResponse) return auth;
    const juryId = auth.user.id;

    const cleanPositive = Math.max(0, Number(positivePoints) || 0);
    const cleanPenalty = Math.max(0, Number(penaltyPoints) || 0);

    const existingScore = queryOne<any>(
      'SELECT * FROM supporter_scores WHERE team_id = ?',
      [teamId]
    );

    let finalRecordId = '';
    let updatedTotal = 0;

    if (existingScore) {
      finalRecordId = existingScore.id;
      const newCreativity = (existingScore.creativity_points || 0) + cleanPositive;
      const newPenalty = (existingScore.penalty_points || 0) + cleanPenalty;
      const ticketPoints = existingScore.ticket_points || 0;
      updatedTotal = ticketPoints + newCreativity - newPenalty;

      run(
        `UPDATE supporter_scores
         SET creativity_points = ?, penalty_points = ?, total_score = ?,
             details_json = ?, notes = ?, evaluated_by = ?, match_id = COALESCE(?, match_id),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          newCreativity,
          newPenalty,
          updatedTotal,
          JSON.stringify(details),
          notes.trim() || existingScore.notes,
          juryId,
          matchId,
          existingScore.id,
        ]
      );
    } else {
      finalRecordId = `sup_${teamId}`;
      updatedTotal = cleanPositive - cleanPenalty;

      run(
        `INSERT INTO supporter_scores (
          id, competition_id, team_id, match_id, ticket_points, creativity_points,
          penalty_points, total_score, details_json, notes, evaluated_by
        ) VALUES (?, 'comp_futsal_2026', ?, ?, 0, ?, ?, ?, ?, ?, ?)`,
        [
          finalRecordId,
          teamId,
          matchId,
          cleanPositive,
          cleanPenalty,
          updatedTotal,
          JSON.stringify(details),
          notes.trim(),
          juryId,
        ]
      );
    }

    // Catat log penilaian suporter
    const auditId = `audit_${randomUUID().slice(0, 8)}`;
    run(
      `INSERT INTO audit_logs (id, actor_id, action, entity, entity_id, before_val, after_val, reason)
       VALUES (?, ?, 'evaluate_supporter', 'supporter_scores', ?, ?, ?, ?)`,
      [
        auditId,
        juryId,
        finalRecordId,
        JSON.stringify({ total: existingScore?.total_score || 0 }),
        JSON.stringify({ total: updatedTotal, positive: cleanPositive, penalty: cleanPenalty }),
        `Penilaian suporter ${team.school_name || team.name} oleh juri (${notes.trim() || 'Formulir juri suporter'})`,
      ]
    );

    return NextResponse.json({
      success: true,
      message: `Penilaian suporter untuk kontingen '${team.name}' berhasil disimpan!`,
      score: {
        teamId,
        teamName: team.name,
        schoolName: team.school_name,
        totalScore: updatedTotal,
        addedCreativity: cleanPositive,
        addedPenalty: cleanPenalty,
      },
    });
  } catch (error: any) {
    console.error('Error submitting supporter score:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menyimpan penilaian suporter madrasah.' },
      { status: 500 }
    );
  }
}

