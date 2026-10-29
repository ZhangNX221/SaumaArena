import { NextResponse } from 'next/server';
import { query, run } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';

export async function GET(request: Request) {
  try {
    // Otorisasi ketat (Perlindungan PII): Hanya ADMIN yang berhak melihat data lengkap pendaftaran atlet & pelatih
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const q = searchParams.get('q');

    let sql = 'SELECT * FROM registrations WHERE 1=1';
    const params: unknown[] = [];

    if (status && ['PENDING', 'VERIFIED', 'REJECTED'].includes(status.toUpperCase())) {
      sql += ' AND status = ?';
      params.push(status.toUpperCase());
    }

    if (q && q.trim()) {
      sql += ' AND (team_name LIKE ? OR school_name LIKE ? OR coach_name LIKE ? OR city LIKE ?)';
      const term = `%${q.trim()}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY created_at DESC';
    const rows = query<any>(sql, params);

    const registrations = rows.map((r) => {
      let players = [];
      try {
        players = JSON.parse(r.players_json || '[]');
      } catch {
        players = [];
      }

      return {
        id: r.id,
        teamName: r.team_name,
        schoolName: r.school_name,
        city: r.city,
        coachName: r.coach_name,
        coachPhone: r.coach_phone,
        coachEmail: r.coach_email || '',
        players,
        recommendationDocUrl: r.recommendation_doc_url || '',
        status: r.status,
        notes: r.notes || '',
        verifiedBy: r.verified_by || null,
        verifiedAt: r.verified_at || null,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      };
    });

    return NextResponse.json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error: any) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data pendaftaran kontingen.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      teamName,
      schoolName,
      city,
      coachName,
      coachPhone,
      coachEmail = '',
      players = [],
      recommendationDocUrl = '',
      notes = '',
    } = body;

    // Validasi data kontingen wajib
    if (!teamName || !schoolName || !city || !coachName || !coachPhone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nama tim, nama madrasah/sekolah, kota, nama pelatih, dan nomor telepon pelatih wajib diisi.',
        },
        { status: 400 }
      );
    }

    // Validasi daftar pemain atlet (minimal 1, dianjurkan 10-12 sesuai standar turnamen)
    if (!Array.isArray(players) || players.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Daftar atlet minimal harus memiliki 1 pemain (disarankan 10-12 atlet).',
        },
        { status: 400 }
      );
    }

    // Validasi NISN tiap atlet
    for (const p of players) {
      if (!p.fullName || !p.nisn) {
        return NextResponse.json(
          {
            success: false,
            error: 'Seluruh atlet wajib memiliki nama lengkap dan Nomor Induk Siswa Nasional (NISN).',
          },
          { status: 400 }
        );
      }
    }

    const regId = `reg_${Date.now()}_${randomUUID().slice(0, 6)}`;
    const playersJson = JSON.stringify(players);

    run(
      `INSERT INTO registrations (
        id, team_name, school_name, city, coach_name, coach_phone, coach_email,
        players_json, recommendation_doc_url, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)`,
      [
        regId,
        teamName.trim(),
        schoolName.trim(),
        city.trim(),
        coachName.trim(),
        coachPhone.trim(),
        coachEmail.trim(),
        playersJson,
        recommendationDocUrl.trim(),
        notes.trim(),
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Pendaftaran kontingen sekolah berhasil dikirim! Berkas Anda saat ini berstatus PENDING menunggu verifikasi komisioner.',
        registrationId: regId,
        status: 'PENDING',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error submitting registration:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat memproses formulir pendaftaran.' },
      { status: 500 }
    );
  }
}

