import { NextResponse } from 'next/server';
import { queryOne, run } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Otorisasi ketat: Hanya ADMIN atau REFEREE yang berhak melihat berkas insiden Komdis
    const auth = requireAuth(request, ['ADMIN', 'REFEREE']);
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;
    const r = queryOne<any>(
      `SELECT 
        i.*,
        t.name as team_name, t.school_name,
        m.match_no, m.stage_id
       FROM incidents i
       LEFT JOIN teams t ON i.team_id = t.id
       LEFT JOIN matches m ON i.match_id = m.id
       WHERE i.id = ?`,
      [id]
    );

    if (!r) {
      return NextResponse.json(
        { success: false, error: 'Berkas insiden tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      incident: {
        id: r.id,
        matchId: r.match_id || null,
        matchNo: r.match_no || null,
        teamId: r.team_id || null,
        teamName: r.team_name || null,
        schoolName: r.school_name || null,
        reportedBy: r.reported_by || null,
        reporterName: r.reporter_name,
        classification: r.classification,
        title: r.title,
        description: r.description,
        evidenceUrl: r.evidence_url || '',
        recommendation: r.recommendation || '',
        status: r.status,
        sanction: r.sanction || null,
        resolutionNotes: r.resolution_notes || null,
        resolvedBy: r.resolved_by || null,
        resolvedAt: r.resolved_at || null,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      },
    });
  } catch (error: any) {
    console.error('Error fetching incident detail:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memuat rincian insiden.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Otorisasi ketat: Hanya ADMIN / Komdis yang berhak memutuskan sanksi insiden
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const { status, sanction = '', resolutionNotes = '' } = body;

    const incident = queryOne<any>('SELECT * FROM incidents WHERE id = ?', [id]);
    if (!incident) {
      return NextResponse.json(
        { success: false, error: 'Berkas insiden tidak ditemukan.' },
        { status: 404 }
      );
    }

    const validStatus = ['OPEN', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'].includes(status?.toUpperCase())
      ? status.toUpperCase()
      : incident.status;

    run(
      `UPDATE incidents
       SET status = ?, sanction = ?, resolution_notes = ?,
           resolved_by = ?, resolved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [validStatus, sanction.trim(), resolutionNotes.trim(), user.id, id]
    );

    // Catat log audit keputusan Komdis
    const auditId = `audit_${randomUUID().slice(0, 8)}`;
    run(
      `INSERT INTO audit_logs (id, actor_id, action, entity, entity_id, before_val, after_val, reason)
       VALUES (?, ?, 'resolve_incident', 'incidents', ?, ?, ?, ?)`,
      [
        auditId,
        user.id,
        id,
        JSON.stringify({ status: incident.status, sanction: incident.sanction }),
        JSON.stringify({ status: validStatus, sanction: sanction.trim() }),
        resolutionNotes.trim() || `Keputusan sidang Komdis oleh ${user.name}`,
      ]
    );

    return NextResponse.json({
      success: true,
      message: `Status insiden berhasil diperbarui menjadi ${validStatus}.`,
      status: validStatus,
      sanction: sanction.trim(),
    });
  } catch (error: any) {
    console.error('Error resolving incident:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui keputusan insiden Komisi Disiplin.' },
      { status: 500 }
    );
  }
}
