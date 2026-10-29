import { NextResponse } from 'next/server';
import { queryOne, run } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const row = queryOne<any>('SELECT * FROM registrations WHERE id = ?', [id]);

    if (!row) {
      return NextResponse.json(
        { success: false, error: 'Data pendaftaran tidak ditemukan.' },
        { status: 404 }
      );
    }

    let players = [];
    try {
      players = JSON.parse(row.players_json || '[]');
    } catch {
      players = [];
    }

    return NextResponse.json({
      success: true,
      registration: {
        id: row.id,
        teamName: row.team_name,
        schoolName: row.school_name,
        city: row.city,
        coachName: row.coach_name,
        coachPhone: row.coach_phone,
        coachEmail: row.coach_email || '',
        players,
        recommendationDocUrl: row.recommendation_doc_url || '',
        status: row.status,
        notes: row.notes || '',
        verifiedBy: row.verified_by || null,
        verifiedAt: row.verified_at || null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (error: any) {
    console.error('Error fetching registration detail:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil detail pendaftaran.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Otorisasi ketat: Hanya ADMIN yang berhak memverifikasi atau menolak berkas kontingen
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const { status, notes = '' } = body;

    if (!status || !['PENDING', 'VERIFIED', 'REJECTED'].includes(status.toUpperCase())) {
      return NextResponse.json(
        { success: false, error: "Status harus bernilai 'PENDING', 'VERIFIED', atau 'REJECTED'." },
        { status: 400 }
      );
    }

    const currentReg = queryOne<any>('SELECT * FROM registrations WHERE id = ?', [id]);
    if (!currentReg) {
      return NextResponse.json(
        { success: false, error: 'Data pendaftaran tidak ditemukan.' },
        { status: 404 }
      );
    }

    const newStatus = status.toUpperCase();

    // 2. Perbarui status pendaftaran
    run(
      `UPDATE registrations
       SET status = ?, notes = ?, verified_by = ?, verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [newStatus, notes.trim(), user.id, id]
    );

    // 3. Jika disetujui (VERIFIED), pastikan kontingen otomatis terdaftar ke tabel teams & players
    if (newStatus === 'VERIFIED') {
      const teamId = `team_${id.replace(/[^a-zA-Z0-9_]/g, '_')}`;
      const existingTeam = queryOne<any>('SELECT id FROM teams WHERE id = ? OR name = ?', [
        teamId,
        currentReg.team_name,
      ]);

      let targetTeamId = teamId;
      if (!existingTeam) {
        run(
          `INSERT INTO teams (id, name, short_name, school_name, kind)
           VALUES (?, ?, ?, ?, 'team')`,
          [
            teamId,
            currentReg.team_name,
            currentReg.team_name.slice(0, 12).toUpperCase(),
            currentReg.school_name,
          ]
        );
      } else {
        targetTeamId = existingTeam.id;
      }

      // Masukkan atlet jika ada
      try {
        const athletes = JSON.parse(currentReg.players_json || '[]');
        for (const ath of athletes) {
          const playerId = `ply_${id}_${ath.jerseyNumber || Math.floor(Math.random() * 100)}`;
          run(
            `INSERT OR IGNORE INTO players (id, team_id, full_name, birth_date, gender, jersey_number, position)
             VALUES (?, ?, ?, ?, 'M', ?, ?)`,
            [
              playerId,
              targetTeamId,
              ath.fullName,
              ath.birthDate || '2013-01-01',
              ath.jerseyNumber || 10,
              ath.position || 'Pemain',
            ]
          );
        }
      } catch (err) {
        console.error('Error synchronizing athletes to master players table:', err);
      }
    }

    // 4. Catat riwayat audit
    const auditId = `audit_${randomUUID().slice(0, 8)}`;
    run(
      `INSERT INTO audit_logs (id, actor_id, action, entity, entity_id, before_val, after_val, reason)
       VALUES (?, ?, 'verify_registration', 'registrations', ?, ?, ?, ?)`,
      [
        auditId,
        user.id,
        id,
        JSON.stringify({ status: currentReg.status, notes: currentReg.notes }),
        JSON.stringify({ status: newStatus, notes: notes.trim() }),
        notes.trim() || `Verifikasi pendaftaran oleh ${user.name}`,
      ]
    );

    return NextResponse.json({
      success: true,
      message: `Status pendaftaran kontingen '${currentReg.team_name}' berhasil diperbarui menjadi ${newStatus}.`,
      status: newStatus,
    });
  } catch (error: any) {
    console.error('Error updating registration status:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui status pendaftaran kontingen.' },
      { status: 500 }
    );
  }
}

