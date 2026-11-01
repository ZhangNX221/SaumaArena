import { NextResponse } from 'next/server';
import { query, queryOne } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const matchSettings = query<any>('SELECT * FROM match_settings');
    const compRow = queryOne<any>(
      'SELECT id, name, sport_code, rules_overrides FROM competitions WHERE id = ?',
      ['comp_futsal_2026']
    );

    let overrides: Record<string, any> = {};
    if (compRow?.rules_overrides) {
      try {
        overrides = JSON.parse(compRow.rules_overrides);
      } catch {
        overrides = {};
      }
    }

    const payload = {
      app: 'SaumaArena',
      type: 'SETTINGS_BACKUP',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      exportedBy: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
      settings: {
        matchSettings,
        competitionId: compRow?.id || 'comp_futsal_2026',
        competitionName: compRow?.name || 'Milad Matsanega Futsal Competition I',
        rulesOverrides: overrides,
      },
    };

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="sauma_settings_backup_${Date.now()}.json"`,
      },
    });
  } catch (error: any) {
    console.error('Error generating settings backup:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal membuat berkas cadangan pengaturan.' },
      { status: 500 }
    );
  }
}

