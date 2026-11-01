import { NextResponse } from 'next/server';
import { query, queryOne, run } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';
import { DEFAULT_SPORT_RULES } from '@/config/sportRules';
import { normalizeAssessmentConfig } from '@/config/supporterRules';

const DEFAULT_COMPETITION_ID = 'comp_futsal_2026';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sportCode = (searchParams.get('sport') || 'futsal').toLowerCase();
    const competitionId = searchParams.get('competitionId') || DEFAULT_COMPETITION_ID;

    // 1. Ambil pengaturan dari tabel match_settings
    const matchSettingRow = queryOne<any>(
      'SELECT * FROM match_settings WHERE sport_code = ?',
      [sportCode]
    );

    // 2. Ambil snapshot aturan & overrides dari tabel competitions
    const compRow = queryOne<any>(
      'SELECT rules_overrides, rules_snapshot FROM competitions WHERE id = ?',
      [competitionId]
    );

    let overrides: Record<string, any> = {};
    if (compRow?.rules_overrides) {
      try {
        overrides = JSON.parse(compRow.rules_overrides);
      } catch {
        overrides = {};
      }
    }

    const sportRules = overrides.sport_rules || DEFAULT_SPORT_RULES;
    const bracketSize = overrides.bracket_size ?? 4;
    const teamCardLayout = overrides.team_card_layout ?? 'MINIMAL';
    const statsConfig = overrides.stats_display_config ?? null;
    const protocols = overrides.protocols ?? {
      woScoreA: 3,
      woScoreB: 0,
      lateToleranceMinutes: 10,
      bapVerificationMode: 'MANUAL',
      allowOvertimeInGroup: false,
    };
    const supporterWeights = normalizeAssessmentConfig(overrides.supporter_weights);
    const broadcastMessage = overrides.broadcast_message ?? '';
    const banners = overrides.banners ?? null;
    const standingsSnapshot = overrides.standings_override ?? null;

    return NextResponse.json({
      success: true,
      data: {
        competitionId,
        sportCode,
        matchSettings: matchSettingRow
          ? {
              id: matchSettingRow.id,
              sportCode: matchSettingRow.sport_code,
              periodCount: matchSettingRow.period_count,
              periodMinutesGroup: matchSettingRow.period_minutes_group,
              periodMinutesKnockout: matchSettingRow.period_minutes_knockout,
              clockGroup: matchSettingRow.clock_group,
              clockKnockout: matchSettingRow.clock_knockout,
              halfTimeMinutes: matchSettingRow.half_time_minutes,
              foulsLimit: matchSettingRow.fouls_limit,
              timeoutDurationSeconds: matchSettingRow.timeout_duration_seconds,
              allowDrawGroup: Boolean(matchSettingRow.allow_draw_group),
              penaltyShootoutEnabled: Boolean(matchSettingRow.penalty_shootout_enabled),
              penaltyShootoutKicks: matchSettingRow.penalty_shootout_kicks,
              updatedAt: matchSettingRow.updated_at,
            }
          : null,
        sportRules,
        bracketSize,
        teamCardLayout,
        statsConfig,
        protocols,
        supporterWeights,
        broadcastMessage,
        banners,
        standingsSnapshot,
      },
    });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memuat pengaturan dari database.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Otorisasi ketat: Hanya ADMIN yang berhak mengubah pengaturan turnamen
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const body = await request.json().catch(() => ({}));
    const {
      competitionId = DEFAULT_COMPETITION_ID,
      sportCode = 'futsal',
      sportRules,
      matchSettings,
      bracketSize,
      teamCardLayout,
      statsConfig,
      protocols,
      supporterWeights,
      broadcastMessage,
      banners,
      standingsSnapshot,
    } = body;

    const normalizedSport = String(sportCode).toLowerCase();

    // 1. Simpan atau perbarui data di match_settings jika ada field terkait waktu pertandingan
    if (matchSettings || (sportRules && sportRules[sportCode.toUpperCase()])) {
      const activeSportRule = sportRules ? sportRules[sportCode.toUpperCase()] : null;
      const periodCount = matchSettings?.periodCount ?? activeSportRule?.periodCount ?? 2;
      const periodMinutes = matchSettings?.periodMinutesGroup ?? activeSportRule?.durationPerPeriod ?? 15;
      const halfTimeMinutes = matchSettings?.halfTimeMinutes ?? activeSportRule?.breakDuration ?? 5;
      const foulsLimit = matchSettings?.foulsLimit ?? activeSportRule?.foulLimit ?? 5;
      const timeoutDurationSeconds = matchSettings?.timeoutDurationSeconds ?? 60;
      const allowDraw = matchSettings?.allowDrawGroup ?? true;
      const penaltyShootoutKicks = matchSettings?.penaltyShootoutKicks ?? activeSportRule?.penaltyKicksCount ?? 3;
      const clockGroup = matchSettings?.clockGroup === 'stop_clock' ? 'stop_clock' : 'running_clock';
      const clockKnockout = matchSettings?.clockKnockout === 'running_clock' ? 'running_clock' : 'stop_clock';

      const existingMs = queryOne<any>('SELECT id FROM match_settings WHERE sport_code = ?', [normalizedSport]);
      if (existingMs) {
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
            Number(periodMinutes) || 15,
            Number(periodMinutes) || 15,
            clockGroup,
            clockKnockout,
            Number(halfTimeMinutes) || 5,
            Number(foulsLimit) || 5,
            Number(timeoutDurationSeconds) || 60,
            allowDraw ? 1 : 0,
            penaltyShootoutKicks > 0 ? 1 : 0,
            Number(penaltyShootoutKicks) || 3,
            normalizedSport,
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
            `settings_${normalizedSport}`,
            normalizedSport,
            Number(periodCount) || 2,
            Number(periodMinutes) || 15,
            Number(periodMinutes) || 15,
            clockGroup,
            clockKnockout,
            Number(halfTimeMinutes) || 5,
            Number(foulsLimit) || 5,
            Number(timeoutDurationSeconds) || 60,
            allowDraw ? 1 : 0,
            penaltyShootoutKicks > 0 ? 1 : 0,
            Number(penaltyShootoutKicks) || 3,
          ]
        );
      }
    }

    // 2. Simpan atau perbarui rules_overrides di tabel competitions
    const compRow = queryOne<any>(
      'SELECT rules_overrides FROM competitions WHERE id = ?',
      [competitionId]
    );

    let currentOverrides: Record<string, any> = {};
    if (compRow?.rules_overrides) {
      try {
        currentOverrides = JSON.parse(compRow.rules_overrides);
      } catch {
        currentOverrides = {};
      }
    }

    if (sportRules !== undefined) currentOverrides.sport_rules = sportRules;
    if (bracketSize !== undefined) currentOverrides.bracket_size = bracketSize;
    if (teamCardLayout !== undefined) currentOverrides.team_card_layout = teamCardLayout;
    if (statsConfig !== undefined) currentOverrides.stats_display_config = statsConfig;
    if (protocols !== undefined) currentOverrides.protocols = protocols;
    if (supporterWeights !== undefined) currentOverrides.supporter_weights = supporterWeights;
    if (broadcastMessage !== undefined) currentOverrides.broadcast_message = broadcastMessage;
    if (banners !== undefined) currentOverrides.banners = banners;
    if (standingsSnapshot !== undefined) currentOverrides.standings_override = standingsSnapshot;

    run(
      'UPDATE competitions SET rules_overrides = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [JSON.stringify(currentOverrides), competitionId]
    );

    // 3. Catat audit log
    const auditId = `audit_${randomUUID().slice(0, 8)}`;
    run(
      `INSERT INTO audit_logs (id, actor_id, action, entity, entity_id, after_val, reason)
       VALUES (?, ?, 'UPDATE_SETTINGS', 'competitions', ?, ?, ?)`,
      [
        auditId,
        user.id,
        competitionId,
        JSON.stringify(currentOverrides),
        `Pembaruan pengaturan turnamen (${normalizedSport}) oleh Administrator ${user.name}`,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Pengaturan turnamen berhasil disimpan ke database SQLite!',
      data: {
        competitionId,
        sportCode: normalizedSport,
        overrides: currentOverrides,
      },
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menyimpan pengaturan ke database.' },
      { status: 500 }
    );
  }
}

