import { NextResponse } from 'next/server';
import { query, queryOne } from '@/db/sqlite';
import {
  getCurrentCalendarInfo,
  calculateTournamentTimeline,
  generateCalendarDays,
  analyzeScheduleConflicts,
  formatIndonesianFullDate,
  formatTimeWib,
  getHijriDate,
} from '@/lib/calendar';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const competitionId = searchParams.get('competitionId') || 'comp_futsal_2026';
    const refDateParam = searchParams.get('referenceDate') || searchParams.get('date');

    const referenceDate = refDateParam ? new Date(refDateParam) : new Date();

    // 1. Ambil data kompetisi dari SQLite
    const comp = queryOne<any>(
      'SELECT id, name, start_date, end_date, sport_code, status FROM competitions WHERE id = ?',
      [competitionId]
    );

    const startDateYmd = comp?.start_date || '2026-11-03';
    const endDateYmd = comp?.end_date || '2026-11-04';
    const compName = comp?.name || 'Milad Matsanega Futsal Competition I (MMFC I)';

    // 2. Ambil data seluruh pertandingan
    const matches = query<any>(
      `SELECT 
        m.id, m.match_no, m.stage_id, m.group_id, m.court_name, m.scheduled_at, m.status,
        m.home_team_id, m.away_team_id,
        ht.name as home_team_name, ht.school_name as home_school,
        at.name as away_team_name, at.school_name as away_school,
        v.name as venue_name
       FROM matches m
       LEFT JOIN teams ht ON m.home_team_id = ht.id
       LEFT JOIN teams at ON m.away_team_id = at.id
       LEFT JOIN venues v ON m.venue_id = v.id
       WHERE m.competition_id = ?
       ORDER BY m.scheduled_at ASC, m.match_no ASC`,
      [competitionId]
    );

    // 3. Lakukan kalkulasi kalender & timeline turnamen
    const currentCalendar = getCurrentCalendarInfo(referenceDate);
    const timeline = calculateTournamentTimeline(
      startDateYmd,
      endDateYmd,
      compName,
      competitionId,
      referenceDate
    );

    const calendarDays = generateCalendarDays(
      startDateYmd,
      endDateYmd,
      matches.map((m) => ({
        id: m.id,
        scheduledAt: m.scheduled_at,
        status: m.status,
        matchNo: m.match_no,
      })),
      referenceDate
    );

    // 4. Analisis potensi bentrok jadwal & jeda istirahat
    const conflictAnalysis = analyzeScheduleConflicts(
      matches.map((m) => ({
        id: m.id,
        matchNo: m.match_no,
        homeTeamId: m.home_team_id,
        awayTeamId: m.away_team_id,
        courtName: m.court_name,
        scheduledAt: m.scheduled_at,
        durationMinutes: 30,
      }))
    );

    // 5. Format daftar pertandingan dengan penanggalan ramah manusia
    const formattedMatches = matches.map((m) => {
      let formattedDate = 'Jadwal Ditentukan';
      let formattedTime = '07:30 WIB';
      let dayCode = 'H1';

      if (m.scheduled_at) {
        const matchDate = new Date(m.scheduled_at);
        formattedDate = formatIndonesianFullDate(matchDate);
        formattedTime = formatTimeWib(matchDate);
        const matchYmd = m.scheduled_at.slice(0, 10);
        dayCode = matchYmd === endDateYmd ? 'H2' : 'H1';
      }

      return {
        id: m.id,
        matchNo: m.match_no,
        dayCode,
        stageId: m.stage_id,
        groupId: m.group_id,
        scheduledAt: m.scheduled_at,
        formattedDate,
        formattedTime,
        venueName: m.venue_name || 'Lapangan Utama Seabless Srengat',
        courtName: m.court_name || 'Lapangan 1',
        status: m.status,
        homeTeam: {
          id: m.home_team_id,
          name: m.home_team_name,
          school: m.home_school,
        },
        awayTeam: {
          id: m.away_team_id,
          name: m.away_team_name,
          school: m.away_school,
        },
      };
    });

    return NextResponse.json({
      success: true,
      current: currentCalendar,
      tournament: timeline,
      calendarDays,
      scheduleAnalysis: {
        totalMatches: matches.length,
        hasConflict: conflictAnalysis.hasConflict,
        conflicts: conflictAnalysis.conflicts,
      },
      matches: formattedMatches,
    });
  } catch (error: any) {
    console.error('Error in /api/calendar:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal melakukan kalkulasi kalender turnamen.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      startDateYmd = '2026-11-03',
      firstMatchTime = '07:30',
      matchDurationMinutes = 30,
      breakMinutes = 5,
      matches = [],
      ceremonies = [
        { name: 'Upacara Pembukaan Turnamen', time: '10:30', durationMinutes: 60 },
        { name: 'ISHOMA (Istirahat, Sholat, Makan)', time: '11:30', durationMinutes: 30 },
      ],
    } = body;

    // Kalkulasi plot waktu rundown otomatis
    const [startHour, startMin] = firstMatchTime.split(':').map(Number);
    let currentHour = Number.isNaN(startHour) ? 7 : startHour;
    let currentMinute = Number.isNaN(startMin) ? 30 : startMin;

    const plannedRundown: any[] = [];
    let matchIndex = 0;

    for (const item of matches) {
      const matchNo = item.matchNo || matchIndex + 1;
      const startStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

      // Tambahkan durasi pertandingan
      let endTotalMin = currentHour * 60 + currentMinute + matchDurationMinutes;
      const endHour = Math.floor(endTotalMin / 60);
      const endMin = endTotalMin % 60;
      const endStr = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

      plannedRundown.push({
        matchNo,
        timeSlot: `${startStr} - ${endStr} WIB`,
        homeTeam: item.homeTeam || 'Tim A',
        awayTeam: item.awayTeam || 'Tim B',
        durationMinutes: matchDurationMinutes,
      });

      // Geser waktu ke laga berikutnya (+ jeda istirahat)
      let nextTotalMin = endTotalMin + breakMinutes;
      currentHour = Math.floor(nextTotalMin / 60);
      currentMinute = nextTotalMin % 60;
      matchIndex++;
    }

    return NextResponse.json({
      success: true,
      startDateYmd,
      firstMatchTime,
      plannedRundown,
      totalMatchesPlanned: plannedRundown.length,
      ceremonies,
    });
  } catch (error: any) {
    console.error('Error in POST /api/calendar:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menyusun simulasi plot kalender.' },
      { status: 500 }
    );
  }
}

