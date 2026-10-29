import { NextResponse } from 'next/server';
import { query, run } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';

export async function GET() {
  try {
    const teams = query<any>('SELECT * FROM teams ORDER BY name ASC');
    for (const team of teams) {
      team.players = query<any>('SELECT * FROM players WHERE team_id = ? ORDER BY jersey_number ASC', [team.id]);
    }
    return NextResponse.json({ success: true, data: teams });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 1. Otorisasi ketat: Hanya ADMIN yang berhak mendaftarkan tim dan atlet master
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json().catch(() => ({}));
    const { name, shortName, logoUrl, schoolName, kind = 'team', players = [] } = body;

    if (!name || !shortName) {
      return NextResponse.json({ success: false, error: 'Name and shortName are required' }, { status: 400 });
    }

    const teamId = `team_${randomUUID().slice(0, 8)}`;
    run(
      'INSERT INTO teams (id, name, short_name, logo_url, school_name, kind) VALUES (?, ?, ?, ?, ?, ?)',
      [teamId, name, shortName, logoUrl || '', schoolName || '', kind]
    );

    if (Array.isArray(players)) {
      for (const p of players) {
        const playerId = `p_${randomUUID().slice(0, 8)}`;
        run(
          'INSERT INTO players (id, team_id, full_name, birth_date, gender, jersey_number, position) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [playerId, teamId, p.fullName, p.birthDate || '2010-01-01', p.gender || 'M', p.jerseyNumber || 0, p.position || '']
        );
      }
    }

    return NextResponse.json({ success: true, data: { id: teamId } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json().catch(() => ({}));
    const { id, name, shortName, logoUrl, schoolName } = body;

    if (!id || !name) {
      return NextResponse.json({ success: false, error: 'ID and Name are required' }, { status: 400 });
    }

    run(
      'UPDATE teams SET name = ?, short_name = ?, logo_url = ?, school_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, shortName || name.slice(0, 3).toUpperCase(), logoUrl || '', schoolName || '', id]
    );

    return NextResponse.json({ success: true, message: 'Team updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Team ID is required' }, { status: 400 });
    }

    run('DELETE FROM players WHERE team_id = ?', [id]);
    run('DELETE FROM teams WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Team deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
