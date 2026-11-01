import { NextResponse } from 'next/server';
import { run, queryOne, getDatabase } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';
import { DEFAULT_SPORT_RULES } from '@/config/sportRules';

export async function POST(request: Request) {
  try {
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

    const db = getDatabase();

    // Skenario A: Pemulihan dari Preset Cepat
    if (body.presetCode) {
      const presetCode = body.presetCode;
      let sportRules = { ...DEFAULT_SPORT_RULES };
      let bracketSize = 8;
      let protocols = {
        woScoreA: 3,
        woScoreB: 0,
        lateToleranceMinutes: 15,
        bapVerificationMode: 'MANUAL',
        allowOvertimeInGroup: false,
      };
      let periodMinutes = 15;
      let clockGroup = 'running_clock';
      let clockKo = 'stop_clock';
      let foulsLimit = 5;

      if (presetCode === 'mmfc_official') {
        sportRules.FUTSAL = {
          durationPerPeriod: 15,
          periodCount: 2,
          breakDuration: 5,
          winPoints: 3,
          drawPoints: 1,
          lossPoints: 0,
          foulLimit: 5,
          timeoutPerPeriod: 1,
          extraTimeDuration: 5,
          penaltyKicksCount: 3,
        };
        bracketSize = 8;
        periodMinutes = 15;
        clockGroup = 'running_clock';
        clockKo = 'stop_clock';
      } else if (presetCode === 'futsal_quick') {
        sportRules.FUTSAL = {
          durationPerPeriod: 10,
          periodCount: 2,
          breakDuration: 3,
          winPoints: 3,
          drawPoints: 1,
          lossPoints: 0,
          foulLimit: 4,
          timeoutPerPeriod: 1,
          extraTimeDuration: 3,
          penaltyKicksCount: 3,
        };
        bracketSize = 4;
        periodMinutes = 10;
        clockGroup = 'running_clock';
        clockKo = 'running_clock';
      } else if (presetCode === 'basketball') {
        bracketSize = 8;
        periodMinutes = 10;
        foulsLimit = 5;
      }

      // Terapkan ke tabel match_settings
      run(
        `INSERT OR REPLACE INTO match_settings (
           id, sport_code, period_count, period_minutes_group, period_minutes_knockout,
           clock_group, clock_knockout, half_time_minutes, fouls_limit, timeout_duration_seconds,
           allow_draw_group, penalty_shootout_enabled, penalty_shootout_kicks, updated_at
         ) VALUES (?, 'futsal', 2, ?, ?, ?, ?, 5, ?, 60, 1, 1, 3, CURRENT_TIMESTAMP)`,
        [`settings_futsal`, periodMinutes, periodMinutes, clockGroup, clockKo, foulsLimit]
      );

      // Terapkan ke tabel competitions
      const compRow = queryOne<any>('SELECT rules_overrides FROM competitions WHERE id = ?', ['comp_futsal_2026']);
      let currentOverrides: Record<string, any> = {};
      if (compRow?.rules_overrides) {
        try { currentOverrides = JSON.parse(compRow.rules_overrides); } catch {}
      }
      currentOverrides.sport_rules = sportRules;
      currentOverrides.bracket_size = bracketSize;
      currentOverrides.protocols = protocols;

      run(
        'UPDATE competitions SET rules_overrides = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [JSON.stringify(currentOverrides), 'comp_futsal_2026']
      );

      return NextResponse.json({
        success: true,
        message: `Template preset '${presetCode}' berhasil diterapkan ke database SQLite!`,
        restoredSettings: {
          sportRules,
          bracketSize,
          protocols,
          matchSettings: { periodMinutes, clockGroup, clockKo, foulsLimit },
        },
      });
    }

    // Skenario B: Pemulihan dari Berkas JSON Cadangan
    if (body.app !== 'SaumaArena' || !body.settings) {
      return NextResponse.json(
        {
          success: false,
          error: "Berkas cadangan tidak valid (atribut 'app: SaumaArena' atau 'settings' tidak ditemukan).",
        },
        { status: 400 }
      );
    }

    const { matchSettings, rulesOverrides, competitionId = 'comp_futsal_2026' } = body.settings;

    db.exec('BEGIN TRANSACTION;');
    try {
      if (Array.isArray(matchSettings) && matchSettings.length > 0) {
        for (const ms of matchSettings) {
          run(
            `INSERT OR REPLACE INTO match_settings (
               id, sport_code, period_count, period_minutes_group, period_minutes_knockout,
               clock_group, clock_knockout, half_time_minutes, fouls_limit,
               timeout_duration_seconds, allow_draw_group, penalty_shootout_enabled, penalty_shootout_kicks, updated_at
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [
              ms.id || `settings_${ms.sport_code}`,
              ms.sport_code,
              Number(ms.period_count) || 2,
              Number(ms.period_minutes_group) || 15,
              Number(ms.period_minutes_knockout) || 15,
              ms.clock_group || 'running_clock',
              ms.clock_knockout || 'stop_clock',
              Number(ms.half_time_minutes) || 5,
              Number(ms.fouls_limit) || 5,
              Number(ms.timeout_duration_seconds) || 60,
              ms.allow_draw_group ? 1 : 0,
              ms.penalty_shootout_enabled ? 1 : 0,
              Number(ms.penalty_shootout_kicks) || 3,
            ]
          );
        }
      }

      if (rulesOverrides && typeof rulesOverrides === 'object') {
        run(
          'UPDATE competitions SET rules_overrides = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [JSON.stringify(rulesOverrides), competitionId]
        );
      }

      db.exec('COMMIT;');
    } catch (err) {
      db.exec('ROLLBACK;');
      throw err;
    }

    // Catat audit log pemulihan pengaturan
    const auditId = `audit_${randomUUID().slice(0, 8)}`;
    run(
      `INSERT INTO audit_logs (id, actor_id, action, entity, entity_id, after_val, reason)
       VALUES (?, ?, 'RESTORE_SETTINGS', 'match_settings', ?, ?, ?)`,
      [
        auditId,
        user.id,
        competitionId,
        JSON.stringify(body.settings),
        `Pemulihan berkas cadangan pengaturan oleh Administrator ${user.name}`,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Seluruh pengaturan turnamen berhasil dipulihkan ke database SQLite!',
      restoredSettings: {
        matchSettings,
        rulesOverrides,
      },
    });
  } catch (error: any) {
    console.error('Error restoring settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memulihkan pengaturan sistem.' },
      { status: 500 }
    );
  }
}

