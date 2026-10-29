import { NextResponse } from 'next/server';
import { query, run } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';

export async function GET(request: Request) {
  try {
    // Otorisasi ketat: Hanya ADMIN atau REFEREE yang berhak melihat berkas insiden Komdis
    const auth = requireAuth(request, ['ADMIN', 'REFEREE']);
    if (auth instanceof NextResponse) return auth;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const classification = searchParams.get('classification');
    const matchId = searchParams.get('matchId');
    const teamId = searchParams.get('teamId');

    let sql = `
      SELECT 
        i.*,
        t.name as team_name, t.school_name,
        m.match_no, m.stage_id
      FROM incidents i
      LEFT JOIN teams t ON i.team_id = t.id
      LEFT JOIN matches m ON i.match_id = m.id
      WHERE 1=1
    `;
    const params: unknown[] = [];

    if (status) {
      sql += ' AND i.status = ?';
      params.push(status.toUpperCase());
    }

    if (classification) {
      sql += ' AND i.classification = ?';
      params.push(classification.toUpperCase());
    }

    if (matchId) {
      sql += ' AND i.match_id = ?';
      params.push(matchId);
    }

    if (teamId) {
      sql += ' AND i.team_id = ?';
      params.push(teamId);
    }

    sql += ' ORDER BY i.created_at DESC';
    const rows = query<any>(sql, params);

    const incidents = rows.map((r) => ({
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
    }));

    return NextResponse.json({
      success: true,
      count: incidents.length,
      incidents,
    });
  } catch (error: any) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil daftar insiden Komisi Disiplin.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      matchId = null,
      teamId = null,
      classification = 'SEDANG',
      title,
      description,
      evidenceUrl = '',
      recommendation = '',
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Judul insiden dan uraian kronologi kejadian wajib diisi.' },
        { status: 400 }
      );
    }

    const validClass = ['RINGAN', 'SEDANG', 'BERAT', 'FORCE_MAJEURE'].includes(classification.toUpperCase())
      ? classification.toUpperCase()
      : 'SEDANG';

    // Otorisasi ketat: Hanya ADMIN atau REFEREE yang berhak melaporkan insiden Komdis
    const auth = requireAuth(request, ['ADMIN', 'REFEREE']);
    if (auth instanceof NextResponse) return auth;
    const reporterId = auth.user.id;
    const reporterName = auth.user.name;

    const incidentId = `inc_${Date.now()}_${randomUUID().slice(0, 6)}`;

    run(
      `INSERT INTO incidents (
        id, match_id, team_id, reported_by, reporter_name,
        classification, title, description, evidence_url, recommendation, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')`,
      [
        incidentId,
        matchId,
        teamId,
        reporterId,
        reporterName,
        validClass,
        title.trim(),
        description.trim(),
        evidenceUrl.trim(),
        recommendation.trim(),
      ]
    );

    // Catat log audit
    const auditId = `audit_${randomUUID().slice(0, 8)}`;
    run(
      `INSERT INTO audit_logs (id, actor_id, action, entity, entity_id, before_val, after_val, reason)
       VALUES (?, ?, 'file_incident', 'incidents', ?, '{}', ?, ?)`,
      [
        auditId,
        reporterId,
        incidentId,
        JSON.stringify({ classification: validClass, title: title.trim() }),
        `Laporan insiden Komdis: ${title.trim()}`,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Laporan insiden berhasil dikirim ke meja Komisi Disiplin untuk ditindaklanjuti.',
        incidentId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error reporting incident:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menyampaikan laporan insiden Komdis.' },
      { status: 500 }
    );
  }
}

