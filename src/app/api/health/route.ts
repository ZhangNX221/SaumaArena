import { NextResponse } from 'next/server';
import { queryOne } from '@/db/sqlite';

export async function GET() {
  try {
    const row = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM sports');
    return NextResponse.json({
      status: 'ok',
      database: 'sqlite',
      sportsCount: row?.count ?? 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Database error' },
      { status: 500 }
    );
  }
}
