import { NextResponse } from 'next/server';
import { query, run } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';

export async function GET() {
  try {
    const rows = query<any>('SELECT * FROM venues ORDER BY name ASC');
    const venues = rows.map((v) => ({
      ...v,
      courts: JSON.parse(v.courts || '[]'),
    }));
    return NextResponse.json({ success: true, data: venues });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 1. Otorisasi ketat: Hanya ADMIN yang berhak menambah venue/lapangan
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json().catch(() => ({}));
    const { name, address, notes, courts = [] } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    const venueId = `ven_${randomUUID().slice(0, 8)}`;
    run(
      'INSERT INTO venues (id, name, address, notes, courts) VALUES (?, ?, ?, ?, ?)',
      [venueId, name, address || '', notes || '', JSON.stringify(courts)]
    );

    return NextResponse.json({ success: true, data: { id: venueId } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
