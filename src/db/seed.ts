import { DatabaseSync } from 'node:sqlite';
import footballTemplate from '../sports/football/template.json';
import futsalTemplate from '../sports/futsal/template.json';
import volleyballTemplate from '../sports/volleyball/template.json';
import badmintonTemplate from '../sports/badminton/template.json';
import esportTemplate from '../sports/esport/template.json';
import { initialTeams } from '../mocks/mockTeams';
import { initialMatches } from '../mocks/tournamentData';

export function seedDatabase(db: DatabaseSync): void {
  // Check if database is fully seeded
  const matchCount = (db.prepare('SELECT COUNT(*) as count FROM matches').get() as { count: number })?.count || 0;
  const teamCount = (db.prepare('SELECT COUNT(*) as count FROM teams').get() as { count: number })?.count || 0;
  if (teamCount >= 13 && matchCount >= 10) {
    return; // Already fully seeded
  }

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
  const insertMatch = db.prepare(`
    INSERT OR REPLACE INTO matches (id, competition_id, stage_id, group_id, round_no, match_no, home_team_id, away_team_id, venue_id, court_name, scheduled_at, status, result)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const validTeamIds = new Set(initialTeams.map((t) => t.id));
  const validGroupIds = new Set(['grp_a', 'grp_b', 'grp_c', 'grp_d']);

  for (const m of initialMatches) {
    const rawStatus = (m.status || '').toLowerCase();
    const dbStatus = rawStatus === 'upcoming' ? 'scheduled' : rawStatus === 'completed' ? 'verified' : rawStatus || 'scheduled';
    const homeId = validTeamIds.has(m.teamAId) ? m.teamAId : null;
    const awayId = validTeamIds.has(m.teamBId) ? m.teamBId : null;
    const isKnockout = m.stage !== 'GROUP';
    const stageId = isKnockout ? 'stg_ko_1' : 'stg_grp_1';
    const grpKey = m.group ? `grp_${m.group.toLowerCase()}` : '';
    const groupId = validGroupIds.has(grpKey) ? grpKey : null;

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
      `2026-11-03T08:00:00Z`,
      dbStatus,
      JSON.stringify({ scoreHome: m.scoreA, scoreAway: m.scoreB })
    );
  }

  // Assign referee to match 1
  const insertOfficial = db.prepare(`
    INSERT OR IGNORE INTO match_officials (id, match_id, profile_id, duty)
    VALUES (?, ?, ?, ?)
  `);
  insertOfficial.run('mo_1', 'm_1', 'usr_ref_1', 'referee');
}
