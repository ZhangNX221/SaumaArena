import { NextResponse } from 'next/server';
import { queryOne, run } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sportCode = searchParams.get('sport') || 'futsal';

    const row = queryOne<any>(
      'SELECT * FROM match_settings WHERE sport_code = ?',
      [sportCode]
    );

    if (row) {
      return NextResponse.json({
        success: true,
        settings: {
          id: row.id,
          sportCode: row.sport_code,
          periodCount: row.period_count,
          periodMinutesGroup: row.period_minutes_group,
          periodMinutesKnockout: row.period_minutes_knockout,
          clockGroup: row.clock_group,
          clockKnockout: row.clock_knockout,
          halfTimeMinutes: row.half_time_minutes,
          foulsLimit: row.fouls_limit,
          timeoutDurationSeconds: row.timeout_duration_seconds,
          allowDrawGroup: Boolean(row.allow_draw_group),
          penaltyShootoutEnabled: Boolean(row.penalty_shootout_enabled),
          penaltyShootoutKicks: row.penalty_shootout_kicks,
          updatedAt: row.updated_at,
        },
      });
    }

    // Default fallback jika data spesifik cabor belum ada
    return NextResponse.json({
      success: true,
      settings: {
        id: `settings_${sportCode}`,
        sportCode,
        periodCount: 2,
        periodMinutesGroup: 15,
        periodMinutesKnockout: 15,
        clockGroup: 'running_clock',
        clockKnockout: 'stop_clock',
        halfTimeMinutes: 5,
        foulsLimit: 5,
        timeoutDurationSeconds: 60,
        allowDrawGroup: true,
        penaltyShootoutEnabled: true,
        penaltyShootoutKicks: 3,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error fetching match settings:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memuat pengaturan waktu pertandingan.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // 1. Otorisasi ketat: Hanya ADMIN yang berhak mengubah aturan waktu turnamen
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const body = await request.json().catch(() => ({}));
    const {
      sportCode = 'futsal',
      periodCount = 2,
      periodMinutesGroup = 15,
      periodMinutesKnockout = 15,
      clockGroup = 'running_clock',
      clockKnockout = 'stop_clock',
      halfTimeMinutes = 5,
      foulsLimit = 5,
      timeoutDurationSeconds = 60,
      allowDrawGroup = true,
      penaltyShootoutEnabled = true,
      penaltyShootoutKicks = 3,
    } = body;

    const validClockGroup = clockGroup === 'stop_clock' ? 'stop_clock' : 'running_clock';
    const validClockKo = clockKnockout === 'running_clock' ? 'running_clock' : 'stop_clock';

    const settingsId = `settings_${sportCode}`;

    const existing = queryOne<any>(
      'SELECT * FROM match_settings WHERE sport_code = ?',
      [sportCode]
    );

    if (existing) {
      run(
        `UPDATE match_settings
         SET period_count = ?, period_minutes_group = ?, period_minutes_knockout = ?,
             clock_group = ?, clock_knockout = ?, half_time_minutes = ?,
             fouls_limit = ?, timeout_duration_seconds = ?,
             allow_draw_group = ?, penalty_shootout_enabled = ?, penalty_shootout_kicks = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE sport_code = ?`,
        [
          Number(periodCount) || 2,
          Number(periodMinutesGroup) || 15,
          Number(periodMinutesKnockout) || 15,
          validClockGroup,
          validClockKo,
          Number(halfTimeMinutes) || 5,
          Number(foulsLimit) || 5,
          Number(timeoutDurationSeconds) || 60,
          allowDrawGroup ? 1 : 0,
          penaltyShootoutEnabled ? 1 : 0,
          Number(penaltyShootoutKicks) || 3,
          sportCode,
        ]
      );
    } else {
      run(
        `INSERT INTO match_settings (
          id, sport_code, period_count, period_minutes_group, period_minutes_knockout,
          clock_group, clock_knockout, half_time_minutes, fouls_limit,
          timeout_duration_seconds, allow_draw_group, penalty_shootout_enabled, penalty_shootout_kicks
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          settingsId,
          sportCode,
          Number(periodCount) || 2,
          Number(periodMinutesGroup) || 15,
          Number(periodMinutesKnockout) || 15,
          validClockGroup,
          validClockKo,
          Number(halfTimeMinutes) || 5,
          Number(foulsLimit) || 5,
          Number(timeoutDurationSeconds) || 60,
          allowDrawGroup ? 1 : 0,
          penaltyShootoutEnabled ? 1 : 0,
          Number(penaltyShootoutKicks) || 3,
        ]
      );
    }

    // Catat log audit
    const auditId = `audit_${randomUUID().slice(0, 8)}`;
    run(
      `INSERT INTO audit_logs (id, actor_id, action, entity, entity_id, before_val, after_val, reason)
       VALUES (?, ?, 'update_match_settings', 'match_settings', ?, ?, ?, ?)`,
      [
        auditId,
        user.id,
        settingsId,
        JSON.stringify(existing || {}),
        JSON.stringify(body),
        `Pembaruan aturan durasi waktu pertandingan ${sportCode} oleh ${user.name}`,
      ]
    );

    return NextResponse.json({
      success: true,
      message: `Pengaturan durasi waktu pertandingan ${sportCode.toUpperCase()} berhasil disimpan dan disinkronkan ke seluruh konsol wasit!`,
      settings: {
        id: settingsId,
        sportCode,
        periodCount,
        periodMinutesGroup,
        periodMinutesKnockout,
        clockGroup: validClockGroup,
        clockKnockout: validClockKo,
        halfTimeMinutes,
        foulsLimit,
        timeoutDurationSeconds,
        allowDrawGroup,
        penaltyShootoutEnabled,
        penaltyShootoutKicks,
      },
    });
  } catch (error: any) {
    console.error('Error updating match settings:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui pengaturan durasi pertandingan.' },
      { status: 500 }
    );
  }
}

