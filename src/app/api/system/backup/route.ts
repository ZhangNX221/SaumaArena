import { NextResponse } from 'next/server';
import { query, getDatabase } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // 1. Otorisasi ketat: Hanya ADMIN yang berhak mengunduh cadangan database lengkap
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const db = getDatabase();

    // Daftar tabel yang dicadangkan
    const tableNames = [
      'sports',
      'competitions',
      'stages',
      'stage_groups',
      'teams',
      'players',
      'competition_teams',
      'competition_players',
      'venues',
      'matches',
      'match_officials',
      'match_lineups',
      'match_events',
      'protests',
      'audit_logs',
      'registrations',
      'tickets',
      'supporter_scores',
      'match_bap',
      'incidents',
      'match_settings',
    ];

    const backupData: Record<string, any[]> = {};
    const tableCounts: Record<string, number> = {};

    for (const tbl of tableNames) {
      try {
        const rows = query<any>(`SELECT * FROM ${tbl}`);
        backupData[tbl] = rows;
        tableCounts[tbl] = rows.length;
      } catch (err) {
        console.warn(`Table ${tbl} not present or query failed during backup:`, err);
        backupData[tbl] = [];
        tableCounts[tbl] = 0;
      }
    }

    const payload = {
      app: 'SaumaArena',
      version: '2.0.0',
      edition: 'Milad Matsanega Futsal Competition I (MMFC I)',
      exportedAt: new Date().toISOString(),
      exportedBy: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
      summary: tableCounts,
      tables: backupData,
    };

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="sauma_arena_backup_${Date.now()}.json"`,
      },
    });
  } catch (error: any) {
    console.error('Error generating database backup:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal membuat cadangan database sistem.' },
      { status: 500 }
    );
  }
}

