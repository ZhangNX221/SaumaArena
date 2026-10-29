import { NextResponse } from 'next/server';
import { query, queryOne } from '@/db/sqlite';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const comp = queryOne<any>(
      'SELECT * FROM competitions WHERE id = ? OR slug = ?',
      [id, id]
    );

    if (!comp) {
      return NextResponse.json({ success: false, error: 'Kompetisi tidak ditemukan' }, { status: 404 });
    }

    const stages = query<any>('SELECT * FROM stages WHERE competition_id = ? ORDER BY order_index ASC', [comp.id]);
    for (const stage of stages) {
      stage.groups = query<any>('SELECT * FROM stage_groups WHERE stage_id = ?', [stage.id]);
    }

    const teams = query<any>(
      `SELECT t.*, ct.group_id, ct.seed, ct.status as registration_status
       FROM competition_teams ct
       JOIN teams t ON ct.team_id = t.id
       WHERE ct.competition_id = ?`,
      [comp.id]
    );

    return NextResponse.json({
      success: true,
      data: {
        ...comp,
        rulesOverrides: JSON.parse(comp.rules_overrides || '{}'),
        rulesSnapshot: comp.rules_snapshot ? JSON.parse(comp.rules_snapshot) : null,
        stages,
        teams,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
