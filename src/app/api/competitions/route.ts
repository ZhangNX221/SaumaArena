import { NextResponse } from 'next/server';
import { query, queryOne, run } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sportCode = searchParams.get('sportCode');

    let sql = 'SELECT * FROM competitions';
    const params: unknown[] = [];

    if (sportCode) {
      sql += ' WHERE sport_code = ?';
      params.push(sportCode.toLowerCase());
    }

    sql += ' ORDER BY created_at DESC';
    const rows = query(sql, params);

    const competitions = rows.map((r: any) => ({
      ...r,
      rulesOverrides: JSON.parse(r.rules_overrides || '{}'),
      rulesSnapshot: r.rules_snapshot ? JSON.parse(r.rules_snapshot) : null,
    }));

    return NextResponse.json({ success: true, data: competitions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 1. Otorisasi ketat: Hanya ADMIN yang berhak membuat kompetisi baru
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json().catch(() => ({}));
    const {
      sportCode,
      name,
      slug,
      season,
      status = 'draft',
      rulesOverrides = {},
      startDate,
      endDate,
      description,
      logoUrl,
    } = body;

    if (!sportCode || !name || !slug || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'sportCode, name, slug, startDate, and endDate are required' },
        { status: 400 }
      );
    }

    // Check sport template
    const sport = queryOne<{ default_rules: string }>('SELECT default_rules FROM sports WHERE code = ?', [
      sportCode.toLowerCase(),
    ]);

    if (!sport) {
      return NextResponse.json({ success: false, error: `Cabang olahraga '${sportCode}' tidak ditemukan.` }, { status: 404 });
    }

    const id = `comp_${randomUUID().slice(0, 8)}`;
    const defaultRules = JSON.parse(sport.default_rules || '{}');
    const mergedRules = { ...defaultRules, ...rulesOverrides };

    // Snapshot rules if status is 'ongoing'
    const rulesSnapshot = status === 'ongoing' ? JSON.stringify(mergedRules) : null;

    run(
      `INSERT INTO competitions (id, sport_code, name, slug, season, status, rules_overrides, rules_snapshot, start_date, end_date, description, logo_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        sportCode.toLowerCase(),
        name,
        slug,
        season || new Date().getFullYear().toString(),
        status,
        JSON.stringify(rulesOverrides),
        rulesSnapshot,
        startDate,
        endDate,
        description || '',
        logoUrl || '',
      ]
    );

    return NextResponse.json({ success: true, data: { id, slug, status } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
