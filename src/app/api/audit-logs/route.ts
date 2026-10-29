import { NextResponse } from 'next/server';
import { query } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // 1. Otorisasi ketat (hunt-auth-bypass): Audit logs bersifat sensitif dan hanya boleh diakses oleh ADMIN
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(request.url);
    const entity = searchParams.get('entity');
    const entityId = searchParams.get('entityId');

    let sql = 'SELECT * FROM audit_logs';
    const whereClauses: string[] = [];
    const params: unknown[] = [];

    if (entity) {
      whereClauses.push('entity = ?');
      params.push(entity);
    }
    if (entityId) {
      whereClauses.push('entity_id = ?');
      params.push(entityId);
    }

    if (whereClauses.length > 0) {
      sql += ' WHERE ' + whereClauses.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC LIMIT 100';
    const rows = query<any>(sql, params);

    const logs = rows.map((r) => {
      let beforeVal = null;
      let afterVal = null;
      try {
        if (r.before_val) beforeVal = JSON.parse(r.before_val);
      } catch {
        beforeVal = r.before_val;
      }
      try {
        if (r.after_val) afterVal = JSON.parse(r.after_val);
      } catch {
        afterVal = r.after_val;
      }

      return {
        ...r,
        beforeVal,
        afterVal,
      };
    });

    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
