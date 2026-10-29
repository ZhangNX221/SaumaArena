import { NextResponse } from 'next/server';
import { query } from '@/db/sqlite';
import '@/sports'; // Ensures all sport modules are registered
import { sportRegistry } from '@/core/registry';

export async function GET() {
  try {
    const rows = query('SELECT code, name, scoring_model, default_rules, rules_version FROM sports');
    const sports = rows.map((r: any) => ({
      code: r.code,
      name: r.name,
      scoringModel: r.scoring_model,
      rulesVersion: r.rules_version,
      defaultRules: JSON.parse(r.default_rules || '{}'),
      isRegistered: sportRegistry.has(r.code),
    }));

    return NextResponse.json({ success: true, data: sports });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
