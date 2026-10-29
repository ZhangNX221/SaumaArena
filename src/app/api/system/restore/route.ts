import { NextResponse } from 'next/server';
import { getDatabase, run } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';

export async function POST(request: Request) {
  try {
    // 1. Otorisasi ketat: Hanya ADMIN yang berhak memulihkan snapshot database
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Format berkas cadangan JSON tidak valid.' },
        { status: 400 }
      );
    }

    if (body.app !== 'SaumaArena' || !body.tables || typeof body.tables !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: "Berkas cadangan tidak valid atau bukan berasal dari sistem Sauma Arena (atribut 'app: SaumaArena' tidak ditemukan).",
        },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const tables = body.tables as Record<string, any[]>;
    const restoredTables: string[] = [];
    let totalRestoredRows = 0;

    // Gunakan transaksi untuk menjamin integritas
    db.exec('BEGIN TRANSACTION;');

    try {
      for (const [tableName, rows] of Object.entries(tables)) {
        if (!Array.isArray(rows) || rows.length === 0) continue;

        // Validasi nama tabel terhadap whitelist untuk mencegah SQL Injection
        const allowedTables = [
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

        if (!allowedTables.includes(tableName)) {
          continue;
        }

        // Ambil kolom dari baris pertama dan sanitasi ketat untuk mencegah SQL Injection
        const firstRow = rows[0];
        const rawColumns = Object.keys(firstRow);
        const columns = rawColumns.filter((col) => /^[a-zA-Z0-9_]+$/.test(col));
        if (columns.length === 0) continue;

        const placeholders = columns.map(() => '?').join(', ');
        const columnNames = columns.map((col) => `"${col}"`).join(', ');
        const insertStmt = db.prepare(
          `INSERT OR REPLACE INTO "${tableName}" (${columnNames}) VALUES (${placeholders})`
        );

        for (const row of rows) {
          const values = columns.map((col) => row[col] ?? null);
          insertStmt.run(...values);
          totalRestoredRows++;
        }

        restoredTables.push(`${tableName} (${rows.length} baris)`);
      }

      db.exec('COMMIT;');
    } catch (txError) {
      db.exec('ROLLBACK;');
      throw txError;
    }

    // Catat audit log pemulihan database
    const auditId = `audit_${randomUUID().slice(0, 8)}`;
    run(
      `INSERT INTO audit_logs (id, actor_id, action, entity, entity_id, before_val, after_val, reason)
       VALUES (?, ?, 'restore_database', 'system', 'database', '{}', ?, ?)`,
      [
        auditId,
        user.id,
        JSON.stringify({ restoredTables, totalRestoredRows }),
        `Pemulihan database dari berkas cadangan oleh ${user.name} (${totalRestoredRows} rekaman)`,
      ]
    );

    return NextResponse.json({
      success: true,
      message: `Database Sauma Arena berhasil dipulihkan secara aman! Total ${totalRestoredRows} data dipulihkan dari ${restoredTables.length} tabel.`,
      restoredTables,
      totalRestoredRows,
    });
  } catch (error: any) {
    console.error('Error restoring database snapshot:', error);
    return NextResponse.json(
      { success: false, error: `Gagal memulihkan database: ${error.message || 'Kesalahan transaksi database'}` },
      { status: 500 }
    );
  }
}

