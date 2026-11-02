import { NextResponse } from 'next/server';
import { query, run, transaction } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const rows = query<any>(`
      SELECT 
        p.id,
        p.team_id,
        p.full_name,
        p.jersey_number,
        p.position,
        p.athlete_code,
        p.photo_url,
        COALESCE(p.yellow_cards, 0) as yellow_cards,
        COALESCE(p.red_cards, 0) as red_cards,
        COALESCE(p.goals, 0) as goals,
        t.name as team_name,
        t.short_name as team_short,
        t.school_name,
        ct.group_id
      FROM players p
      LEFT JOIN teams t ON p.team_id = t.id
      LEFT JOIN competition_teams ct ON t.id = ct.team_id
      ORDER BY p.athlete_code ASC, t.code ASC, p.jersey_number ASC
    `);

    let autoCodeIndex = 1;
    const athletes = rows.map((r) => {
      const athleteCode =
        r.athlete_code && r.athlete_code.trim() !== ''
          ? r.athlete_code
          : `ATL-${String(autoCodeIndex++).padStart(3, '0')}`;

      const groupLetter = r.group_id
        ? r.group_id.replace(/^grp_/, '').toUpperCase()
        : undefined;

      return {
        id: r.id,
        athleteCode,
        name: r.full_name || '',
        number: Number(r.jersey_number || 0),
        position: r.position || 'Pemain',
        photoUrl: r.photo_url || '',
        documentStatus: 'APPROVED' as const,
        teamId: r.team_id || '',
        teamName: r.team_name || 'Tim Kontingen',
        schoolName: r.school_name || '',
        group: groupLetter,
        yellowCards: Number(r.yellow_cards || 0),
        redCards: Number(r.red_cards || 0),
        goals: Number(r.goals || 0),
        assists: 0,
      };
    });

    return NextResponse.json({ success: true, data: athletes });
  } catch (error: any) {
    console.error('Error in GET /api/athletes:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = requireAuth(request, ['ADMIN', 'REFEREE']);
    if (auth instanceof NextResponse && process.env.NODE_ENV === 'production') {
      return auth;
    }

    const body = await request.json().catch(() => ({}));

    // Mode 0: Update specific stat (goals, yellowCards, redCards) dari Konsol Juri
    if (body.athleteId && body.field) {
      const col =
        body.field === 'goals'
          ? 'goals'
          : body.field === 'yellowCards'
          ? 'yellow_cards'
          : body.field === 'redCards'
          ? 'red_cards'
          : null;

      if (col) {
        if (body.value !== undefined) {
          run(`UPDATE players SET ${col} = MAX(0, ?) WHERE id = ?`, [Number(body.value), body.athleteId]);
        } else if (body.delta !== undefined) {
          run(`UPDATE players SET ${col} = MAX(0, COALESCE(${col}, 0) + ?) WHERE id = ?`, [Number(body.delta), body.athleteId]);
        }
        return NextResponse.json({ success: true, message: `Updated ${col} for athlete ${body.athleteId}` });
      }
    }

    // Mode 1: Bulk update / synchronization
    if (Array.isArray(body.athletes)) {
      transaction(() => {
        const updateStmt = dbStmt();
        for (const a of body.athletes) {
          updateStmt.run(
            a.id,
            a.teamId,
            a.name,
            Number(a.number || 0),
            a.position || 'Pemain',
            a.athleteCode || null,
            Number(a.yellowCards || 0),
            Number(a.redCards || 0),
            Number(a.goals || 0)
          );
        }
      });
      return NextResponse.json({ success: true, message: 'All athletes updated successfully' });
    }

    // Mode 2: Single athlete edit
    const { id, name, teamId, number, position, athleteCode, yellowCards, redCards, goals } = body;
    if (!id || !name) {
      return NextResponse.json(
        { success: false, error: 'ID and Name are required' },
        { status: 400 }
      );
    }

    run(
      `INSERT INTO players (id, team_id, full_name, birth_date, gender, jersey_number, position, athlete_code, yellow_cards, red_cards, goals, is_active)
       VALUES (?, ?, ?, '2012-05-10', 'M', ?, ?, ?, ?, ?, ?, 1)
       ON CONFLICT(id) DO UPDATE SET
         full_name = excluded.full_name,
         team_id = excluded.team_id,
         jersey_number = excluded.jersey_number,
         position = excluded.position,
         athlete_code = excluded.athlete_code,
         yellow_cards = CASE WHEN excluded.yellow_cards > 0 THEN excluded.yellow_cards ELSE players.yellow_cards END,
         red_cards = CASE WHEN excluded.red_cards > 0 THEN excluded.red_cards ELSE players.red_cards END,
         goals = CASE WHEN excluded.goals > 0 THEN excluded.goals ELSE players.goals END`,
      [id, teamId, name, Number(number || 0), position || 'Pemain', athleteCode || null, Number(yellowCards || 0), Number(redCards || 0), Number(goals || 0)]
    );

    return NextResponse.json({
      success: true,
      data: { id, name, teamId, number: Number(number || 0), position, athleteCode },
    });
  } catch (error: any) {
    console.error('Error in POST /api/athletes:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = requireAuth(request, ['ADMIN', 'REFEREE']);
    if (auth instanceof NextResponse && process.env.NODE_ENV === 'production') {
      return auth;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    run('DELETE FROM players WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: `Athlete ${id} deleted successfully` });
  } catch (error: any) {
    console.error('Error in DELETE /api/athletes:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function dbStmt() {
  const { getDatabase } = require('@/db/sqlite');
  return getDatabase().prepare(`
    INSERT INTO players (id, team_id, full_name, birth_date, gender, jersey_number, position, athlete_code, yellow_cards, red_cards, goals, is_active)
    VALUES (?, ?, ?, '2012-05-10', 'M', ?, ?, ?, ?, ?, ?, 1)
    ON CONFLICT(id) DO UPDATE SET
      full_name = excluded.full_name,
      team_id = excluded.team_id,
      jersey_number = excluded.jersey_number,
      position = excluded.position,
      athlete_code = excluded.athlete_code,
      yellow_cards = CASE WHEN excluded.yellow_cards > 0 THEN excluded.yellow_cards ELSE players.yellow_cards END,
      red_cards = CASE WHEN excluded.red_cards > 0 THEN excluded.red_cards ELSE players.red_cards END,
      goals = CASE WHEN excluded.goals > 0 THEN excluded.goals ELSE players.goals END
  `);
}
