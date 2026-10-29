import { DatabaseSync } from 'node:sqlite';
import footballTemplate from '../sports/football/template.json';
import futsalTemplate from '../sports/futsal/template.json';
import volleyballTemplate from '../sports/volleyball/template.json';
import badmintonTemplate from '../sports/badminton/template.json';
import esportTemplate from '../sports/esport/template.json';
import { initialTeams } from '../mocks/mockTeams';
import { initialMatches, initialTickets } from '../mocks/tournamentData';

export function seedDatabase(db: DatabaseSync): void {
  // 1. Seed Sports
  const insertSport = db.prepare(`
    INSERT OR REPLACE INTO sports (code, name, scoring_model, default_rules, rules_version)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertSport.run('football', 'Sepakbola', 'timed_goals', JSON.stringify(footballTemplate), '1.0.0');
  insertSport.run('futsal', 'Futsal', 'timed_goals', JSON.stringify(futsalTemplate), '1.0.0');
  insertSport.run('volleyball', 'Bola Voli', 'rally_set', JSON.stringify(volleyballTemplate), '1.0.0');
  insertSport.run('badminton', 'Bulutangkis', 'rally_set', JSON.stringify(badmintonTemplate), '1.0.0');
  insertSport.run('esport', 'Esport (Generik)', 'map_series', JSON.stringify(esportTemplate), '1.0.0');

  // 2. Seed Default Profiles
  const insertProfile = db.prepare(`
    INSERT OR IGNORE INTO profiles (id, role, display_name, phone, is_active)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertProfile.run('usr_admin_1', 'admin', 'Administrator Sauma Arena', '081234567890', 1);
  insertProfile.run('usr_ref_1', 'official', 'Wasit Nasional Budi', '081298765432', 1);
  insertProfile.run('usr_ref_2', 'official', 'Wasit Ahmad Santoso', '081298765433', 1);
  insertProfile.run('USR-ADMIN', 'admin', 'Ust. H. Syamsul Arifin, M.Pd', '081234567890', 1);
  insertProfile.run('USR-JURI-1', 'official', 'Juri M. Irfan, S.Pd', '081298765432', 1);
  insertProfile.run('USR-JURI-2', 'official', 'Juri Hendra Wijaya, S.Or', '081298765433', 1);
  insertProfile.run('USR-JURI-3', 'official', 'Juri Ahmad Fauzi, S.Pd', '081298765434', 1);
  insertProfile.run('USR-JURI-4', 'official', 'Juri Doni Kurniawan, M.Pd', '081298765435', 1);

  // 3. Seed Venues
  const insertVenue = db.prepare(`
    INSERT OR REPLACE INTO venues (id, name, address, notes, courts)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertVenue.run(
    'ven_1',
    'Lapangan Futsal Seabless Srengat (Vinyl)',
    'Jl. Raya Srengat, Blitar, Jawa Timur',
    'Venue Indoor Lapangan Vinyl Standar FFI',
    JSON.stringify(['Lapangan Utama', 'Lapangan Latihan'])
  );

  // 4. Seed Teams
  const insertTeam = db.prepare(`
    INSERT OR REPLACE INTO teams (id, name, short_name, logo_url, school_name, kind)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // 5. Seed Players
  const insertPlayer = db.prepare(`
    INSERT OR REPLACE INTO players (id, team_id, full_name, birth_date, gender, jersey_number, position)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const teamCount = (db.prepare('SELECT COUNT(*) as count FROM teams').get() as { count: number })?.count || 0;
  if (teamCount < 13) {
    for (const t of initialTeams) {
      insertTeam.run(
        t.id,
        t.name,
        t.shortName || t.name.slice(0, 3).toUpperCase(),
        t.logoUrl || '',
        t.schoolName || '',
        'team'
      );
      if (t.players && t.players.length > 0) {
        for (const p of t.players) {
          insertPlayer.run(
            p.id,
            t.id,
            p.name,
            '2012-05-10',
            'M',
            p.number || 0,
            p.position || 'Pemain'
          );
        }
      }
    }
  }

  // 6. Seed Default Competition
  const insertComp = db.prepare(`
    INSERT OR REPLACE INTO competitions (id, sport_code, name, slug, season, status, rules_snapshot, visibility, start_date, end_date, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertComp.run(
    'comp_futsal_2026',
    'futsal',
    'Milad Matsanega Futsal Competition I (MMFC I) 2026',
    'milad-matsanega-futsal-2026',
    '2026',
    'ongoing',
    JSON.stringify(futsalTemplate),
    'public',
    '2026-11-03',
    '2026-11-04',
    'Kejuaraan Futsal Antarmadrasah se-Jawa Timur'
  );

  // 7. Seed Stage & Group
  const insertStage = db.prepare(`
    INSERT OR REPLACE INTO stages (id, competition_id, name, order_index, format)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertStage.run('stg_grp_1', 'comp_futsal_2026', 'Penyisihan Grup', 1, 'round_robin');
  insertStage.run('stg_ko_1', 'comp_futsal_2026', 'Babak Gugur', 2, 'single_elimination');

  const insertGroup = db.prepare(`
    INSERT OR REPLACE INTO stage_groups (id, stage_id, name)
    VALUES (?, ?, ?)
  `);
  insertGroup.run('grp_a', 'stg_grp_1', 'Grup A');
  insertGroup.run('grp_b', 'stg_grp_1', 'Grup B');
  insertGroup.run('grp_c', 'stg_grp_1', 'Grup C');
  insertGroup.run('grp_d', 'stg_grp_1', 'Grup D');

  // 8. Register Teams to Competition
  const insertCompTeam = db.prepare(`
    INSERT OR REPLACE INTO competition_teams (id, competition_id, team_id, group_id, seed, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (let idx = 0; idx < initialTeams.length; idx++) {
    const t = initialTeams[idx];
    const grpId = t.group ? `grp_${t.group.toLowerCase()}` : 'grp_a';
    insertCompTeam.run(`ct_${t.id}`, 'comp_futsal_2026', t.id, grpId, idx + 1, 'approved');
  }

  // 9. Seed Matches
  const matchCount = (db.prepare('SELECT COUNT(*) as count FROM matches').get() as { count: number })?.count || 0;
  if (matchCount < 10) {
    const insertMatch = db.prepare(`
      INSERT OR REPLACE INTO matches (id, competition_id, stage_id, group_id, round_no, match_no, home_team_id, away_team_id, venue_id, court_name, scheduled_at, status, result)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const validTeamIds = new Set(initialTeams.map((t) => t.id));
    const validGroupIds = new Set(['grp_a', 'grp_b', 'grp_c', 'grp_d']);

    const matchTimestamps: Record<number, string> = {
      1: '2026-11-03T07:30:00+07:00',
      2: '2026-11-03T08:00:00+07:00',
      3: '2026-11-03T08:30:00+07:00',
      4: '2026-11-03T09:00:00+07:00',
      5: '2026-11-03T09:30:00+07:00',
      6: '2026-11-03T10:00:00+07:00',
      7: '2026-11-03T12:00:00+07:00',
      8: '2026-11-03T12:30:00+07:00',
      9: '2026-11-03T13:00:00+07:00',
      10: '2026-11-03T13:30:00+07:00',
      11: '2026-11-04T07:30:00+07:00',
      12: '2026-11-04T08:00:00+07:00',
      13: '2026-11-04T08:30:00+07:00',
      14: '2026-11-04T09:00:00+07:00',
      15: '2026-11-04T13:00:00+07:00',
      16: '2026-11-04T13:45:00+07:00',
      17: '2026-11-04T15:00:00+07:00',
    };

    for (const m of initialMatches) {
      const rawStatus = (m.status || '').toLowerCase();
      const dbStatus = rawStatus === 'upcoming' ? 'scheduled' : rawStatus === 'completed' ? 'verified' : rawStatus || 'scheduled';
      const homeId = validTeamIds.has(m.teamAId) ? m.teamAId : null;
      const awayId = validTeamIds.has(m.teamBId) ? m.teamBId : null;
      const isKnockout = m.stage !== 'GROUP';
      const stageId = isKnockout ? 'stg_ko_1' : 'stg_grp_1';
      const grpKey = m.group ? `grp_${m.group.toLowerCase()}` : '';
      const groupId = validGroupIds.has(grpKey) ? grpKey : null;
      const scheduledIso = matchTimestamps[m.matchNumber] || '2026-11-03T07:30:00+07:00';

      insertMatch.run(
        `m_${m.id}`,
        'comp_futsal_2026',
        stageId,
        groupId,
        isKnockout ? 2 : 1,
        m.matchNumber,
        homeId,
        awayId,
        'ven_1',
        m.courtName || 'Lapangan Utama',
        scheduledIso,
        dbStatus,
        JSON.stringify({ scoreHome: m.scoreA, scoreAway: m.scoreB })
      );
    }

    // Assign referee to match 1
    const insertOfficial = db.prepare(`
      INSERT OR IGNORE INTO match_officials (id, match_id, profile_id, duty)
      VALUES (?, ?, ?, ?)
    `);
    const firstMatchId = `m_${initialMatches[0]?.id || 'match-1'}`;
    insertOfficial.run('mo_1', firstMatchId, 'usr_ref_1', 'referee');
  }

  // 10. Seed New PRD Entities
  seedNewEntities(db);
}

function seedNewEntities(db: DatabaseSync): void {
  // 10.1 Match Settings
  const settingsCount = (db.prepare('SELECT COUNT(*) as count FROM match_settings').get() as { count: number })?.count || 0;
  if (settingsCount === 0) {
    const insertSettings = db.prepare(`
      INSERT OR REPLACE INTO match_settings (
        id, sport_code, period_count, period_minutes_group, period_minutes_knockout,
        clock_group, clock_knockout, half_time_minutes, fouls_limit,
        timeout_duration_seconds, allow_draw_group, penalty_shootout_enabled, penalty_shootout_kicks
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertSettings.run(
      'settings_futsal',
      'futsal',
      2,
      15,
      15,
      'running_clock',
      'stop_clock',
      5,
      5,
      60,
      1,
      1,
      3
    );
  }

  // 10.2 Tickets
  const ticketCount = (db.prepare('SELECT COUNT(*) as count FROM tickets').get() as { count: number })?.count || 0;
  if (ticketCount === 0) {
    const insertTicket = db.prepare(`
      INSERT OR REPLACE INTO tickets (
        id, booking_code, buyer_name, buyer_phone, buyer_email, team_id,
        category, quantity, price, status, checked_in_at, checked_in_by, gate_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const t of initialTickets) {
      const isCheckedIn = t.status === 'CHECKED_IN';
      insertTicket.run(
        t.id,
        t.code,
        t.buyerName,
        t.buyerPhone,
        `${t.buyerName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
        t.supportedTeamId || 'team-sdi-kardina',
        t.ticketType === 'ROMBONGAN' ? 'SUPPORTER' : 'REGULAR',
        t.quantity,
        15000,
        t.status || 'ISSUED',
        isCheckedIn ? '2026-11-03 07:45:00' : null,
        isCheckedIn ? 'usr_admin_1' : null,
        isCheckedIn ? 'Gate Timur 1 (Suporter)' : null
      );
    }
  }

  // 10.3 Supporter Scores (Tribun Suporter Madrasah)
  const supporterCount = (db.prepare('SELECT COUNT(*) as count FROM supporter_scores').get() as { count: number })?.count || 0;
  if (supporterCount === 0) {
    const insertSupporter = db.prepare(`
      INSERT OR REPLACE INTO supporter_scores (
        id, competition_id, team_id, match_id, ticket_points, creativity_points,
        penalty_points, total_score, details_json, notes, evaluated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const sampleScores: Record<string, { tkt: number; crt: number; pen: number; notes: string }> = {
      'team-sdi-kardina': { tkt: 32, crt: 60, pen: 0, notes: 'Yel-yel bergemuruh, membawa maskot singa, tribun tertib dan bersih.' },
      'team-sdn1-srengat': { tkt: 28, crt: 55, pen: 0, notes: 'Atribut bendera lengkap, drum perkusi konsisten.' },
      'team-min2-blitar': { tkt: 24, crt: 50, pen: 0, notes: 'Koreografi gerak kompak sepanjang 30 menit laga.' },
      'team-mi-ploso': { tkt: 20, crt: 45, pen: 0, notes: 'Kreativitas yel-yel madrasah santun dan positif.' },
      'team-min7-blitar': { tkt: 18, crt: 45, pen: 0, notes: 'Atribut seragam sekolah rapi.' },
      'team-min8-blitar': { tkt: 16, crt: 40, pen: 0, notes: 'Dukungan vokal tanpa henti.' },
      'team-min14-blitar': { tkt: 15, crt: 40, pen: 0, notes: 'Tribun bersih pasca pertandingan usai.' },
      'team-mi-mambaululum': { tkt: 14, crt: 35, pen: 0, notes: 'Kekompakan yel-yel baik.' },
      'team-mi-wahidhasyim': { tkt: 14, crt: 35, pen: 0, notes: 'Spanduk sportivitas terpasang rapi.' },
      'team-min13-c': { tkt: 12, crt: 35, pen: 0, notes: 'Semangat tinggi mendampingi tim.' },
      'team-mi-darussalam': { tkt: 12, crt: 30, pen: 0, notes: 'Koreografi sederhana namun rapi.' },
      'team-mi-yabunaya': { tkt: 10, crt: 30, pen: 0, notes: 'Tribun tertib.' },
      'team-min5-tulungagung': { tkt: 10, crt: 30, pen: 0, notes: 'Rombongan suporter luar kota yang sportif.' },
      'team-min13-b': { tkt: 8, crt: 25, pen: 0, notes: 'Dukungan suporter madrasah.' },
    };

    for (const team of initialTeams) {
      const score = sampleScores[team.id] || { tkt: 10, crt: 30, pen: 0, notes: 'Partisipasi suporter madrasah.' };
      const total = score.tkt + score.crt - score.pen;
      insertSupporter.run(
        `sup_${team.id}`,
        'comp_futsal_2026',
        team.id,
        null,
        score.tkt,
        score.crt,
        score.pen,
        total,
        JSON.stringify({
          yel_yel: 15,
          atribut: 10,
          maskot: 10,
          perkusi: 10,
          kebersihan: 15,
        }),
        score.notes,
        'USR-JURI-1'
      );
    }
  }

  // 10.4 Registrations (Pendaftaran Tim Kontingen)
  const regCount = (db.prepare('SELECT COUNT(*) as count FROM registrations').get() as { count: number })?.count || 0;
  if (regCount === 0) {
    const insertReg = db.prepare(`
      INSERT OR REPLACE INTO registrations (
        id, team_name, school_name, city, coach_name, coach_phone, coach_email,
        players_json, recommendation_doc_url, status, notes, verified_by, verified_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < initialTeams.length; i++) {
      const t = initialTeams[i];
      const playersList = (t.players || []).map((p) => ({
        fullName: p.name,
        nisn: p.nisn || `013${Math.floor(1000000 + Math.random() * 9000000)}`,
        jerseyNumber: p.number || 10,
        position: p.position || 'Pemain',
        birthDate: '2013-05-12',
        isCaptain: p.number === 10,
      }));

      insertReg.run(
        `reg_${t.id}`,
        t.name,
        t.schoolName,
        t.city || 'Blitar',
        t.coachName || 'Official Tim',
        '081234567890',
        `${t.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@sekolah.id`,
        JSON.stringify(playersList),
        `/documents/rekomendasi_${t.id}.pdf`,
        'VERIFIED',
        'Berkas NISN, rapor, dan surat rekomendasi kepala madrasah terverifikasi lengkap.',
        'usr_admin_1',
        '2026-10-25 10:00:00'
      );
    }
  }
}
