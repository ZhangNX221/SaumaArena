/**
 * Modul Perhitungan Kalender & Penjadwalan Turnamen (Backend Calendar Engine)
 * 
 * Menyediakan kapabilitas:
 * 1. Zonasi Waktu Indonesia Barat (WIB / UTC+7) & Penanggalan Bahasa Indonesia
 * 2. Konversi Penanggalan Hijriyah (Konteks Milad Madrasah MMFC I)
 * 3. Status Siklus Turnamen (Countdown H-X, Hari H-1/H-2, Selesai)
 * 4. Perhitungan Slot Waktu, Durasi Bersih, Jeda Istirahat, dan Deteksi Konflik Jadwal
 * 5. Validasi Aturan Istirahat Minimum Atlet (Player Rest Safety Margin)
 */

export const WIB_OFFSET_HOURS = 7;
export const MS_PER_MINUTE = 60 * 1000;
export const MS_PER_HOUR = 60 * MS_PER_MINUTE;
export const MS_PER_DAY = 24 * MS_PER_HOUR;

export const NAMA_HARI_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const NAMA_BULAN_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const NAMA_BULAN_HIJRI = [
  "Muharram", "Safar", "Rabi'ul Awwal", "Rabi'ul Akhir",
  "Jumadil Awwal", "Jumadil Akhir", "Rajab", "Sya'ban",
  "Ramadhan", "Syawwal", "Zulqa'dah", "Zulhijjah"
];

export interface CalendarCurrentInfo {
  nowIso: string;
  currentDate: string; // YYYY-MM-DD
  currentTimeWib: string; // HH:mm WIB
  dayName: string;
  formattedIndonesian: string;
  hijri: string;
}

export type TournamentPhase = 'COUNTDOWN' | 'MATCHDAY' | 'COMPLETED';

export interface TournamentTimelineInfo {
  competitionId: string;
  name: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  phase: TournamentPhase;
  currentDayNumber: number | null; // 1, 2, dst. jika sedang berlangsung
  dayCode: string | null; // 'H1', 'H2', dst.
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    label: string;
    isKickoffImminent: boolean; // < 24 jam
  };
  isTodayInTournament: boolean;
  statusLabel: string;
}

export interface CalendarDaySummary {
  dayCode: string; // 'H1', 'H2'
  dayNumber: number;
  date: string; // YYYY-MM-DD
  dayName: string;
  formattedDate: string;
  hijri: string;
  status: 'UPCOMING' | 'TODAY' | 'COMPLETED';
  isToday: boolean;
  matchCount: number;
  completedMatchCount: number;
  liveMatchCount: number;
  scheduledMatchCount: number;
  firstMatchTime: string | null;
  lastMatchTime: string | null;
}

export interface ScheduleConflict {
  type: 'VENUE_COLLISION' | 'TEAM_REST_VIOLATION' | 'OVERLAPPING_MATCH';
  severity: 'WARNING' | 'CRITICAL';
  description: string;
  matchIds: string[];
}

/**
 * Konversi tanggal Date ke objek waktu WIB (UTC+7).
 */
export function getWibDate(dateInput: Date | string | number = new Date()): Date {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc + WIB_OFFSET_HOURS * MS_PER_HOUR);
}

/**
 * Format tanggal YYYY-MM-DD standar WIB.
 */
export function formatDateYmd(date: Date = new Date()): string {
  const wib = getWibDate(date);
  const y = wib.getFullYear();
  const m = String(wib.getMonth() + 1).padStart(2, '0');
  const d = String(wib.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Format waktu HH:mm WIB.
 */
export function formatTimeWib(date: Date = new Date()): string {
  const wib = getWibDate(date);
  const h = String(wib.getHours()).padStart(2, '0');
  const m = String(wib.getMinutes()).padStart(2, '0');
  return `${h}:${m} WIB`;
}

/**
 * Format lengkap Bahasa Indonesia: "Selasa, 3 November 2026"
 */
export function formatIndonesianFullDate(dateInput: Date | string = new Date()): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const wib = getWibDate(d);
  const dayName = NAMA_HARI_ID[wib.getDay()];
  const dayNum = wib.getDate();
  const monthName = NAMA_BULAN_ID[wib.getMonth()];
  const year = wib.getFullYear();
  return `${dayName}, ${dayNum} ${monthName} ${year}`;
}

/**
 * Perhitungan Kalender Hijriyah berdasarkan Algoritma Tabular Islam / Kuwaiti Standard.
 * Sangat relevan untuk institusi madrasah (MTsN 3 Blitar / Milad Matsanega).
 */
export function getHijriDate(dateInput: Date | string = new Date()): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const wib = getWibDate(d);

  let day = wib.getDate();
  let month = wib.getMonth();
  let year = wib.getFullYear();

  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;

  const z = Math.floor(jd + 0.5);
  let alpha = Math.floor((z - 1867216.25) / 36524.25);
  let f = z + 1 + alpha - Math.floor(alpha / 4);
  let fInt = Math.floor(f);
  let bVal = fInt + 1524;
  let cVal = Math.floor((bVal - 122.1) / 365.25);
  let dVal = Math.floor(365.25 * cVal);
  let eVal = Math.floor((bVal - dVal) / 30.6001);

  // Estimasi Hijriyah
  let epochAstro = 1948084;
  let epochCivil = 1948085;
  let shift1 = 8.01 / 60;

  let zHijri = jd - epochCivil;
  let cyc = Math.floor(zHijri / 10631);
  zHijri = zHijri - 10631 * cyc;
  let j = Math.floor((zHijri - shift1) / 354.36667);
  let hijriYear = 30 * cyc + j + 1;
  zHijri = zHijri - Math.floor(j * 354.36667 + shift1);
  let hijriMonth = Math.floor((zHijri + 28.5001) / 29.5);
  if (hijriMonth === 13) hijriMonth = 12;
  let hijriDay = Math.floor(zHijri - Math.floor(29.5001 * hijriMonth - 29));

  // Penyesuaian batas kalender sipil
  if (hijriDay < 1) hijriDay = 1;
  const monthName = NAMA_BULAN_HIJRI[Math.max(0, Math.min(11, hijriMonth - 1))];
  return `${hijriDay} ${monthName} ${hijriYear} H`;
}

/**
 * Informasi waktu saat ini terkalibrasi ke zona WIB.
 */
export function getCurrentCalendarInfo(referenceDate?: Date): CalendarCurrentInfo {
  const ref = referenceDate || new Date();
  const wib = getWibDate(ref);

  return {
    nowIso: ref.toISOString(),
    currentDate: formatDateYmd(ref),
    currentTimeWib: formatTimeWib(ref),
    dayName: NAMA_HARI_ID[wib.getDay()],
    formattedIndonesian: formatIndonesianFullDate(ref),
    hijri: getHijriDate(ref),
  };
}

/**
 * Hitung timeline & fase turnamen berdasarkan tanggal mulai dan selesai.
 */
export function calculateTournamentTimeline(
  startDateYmd: string, // '2026-11-03'
  endDateYmd: string,   // '2026-11-04'
  competitionName: string = 'MMFC I 2026',
  competitionId: string = 'comp_futsal_2026',
  referenceDate?: Date
): TournamentTimelineInfo {
  const currentInfo = getCurrentCalendarInfo(referenceDate);
  const todayYmd = currentInfo.currentDate;

  const startUtc = new Date(`${startDateYmd}T00:00:00Z`).getTime();
  const endUtc = new Date(`${endDateYmd}T23:59:59Z`).getTime();
  const nowUtc = new Date(`${todayYmd}T12:00:00Z`).getTime();

  const totalDays = Math.max(1, Math.round((endUtc - startUtc) / MS_PER_DAY));

  let phase: TournamentPhase = 'COUNTDOWN';
  let currentDayNumber: number | null = null;
  let dayCode: string | null = null;
  let isTodayInTournament = false;
  let statusLabel = '';

  const startOfTournamentMs = new Date(`${startDateYmd}T07:30:00+07:00`).getTime();
  const endOfTournamentMs = new Date(`${endDateYmd}T18:00:00+07:00`).getTime();
  const nowActualMs = (referenceDate || new Date()).getTime();

  if (nowActualMs < startOfTournamentMs) {
    phase = 'COUNTDOWN';
    const diffMs = startOfTournamentMs - nowActualMs;
    const days = Math.floor(diffMs / MS_PER_DAY);
    const hours = Math.floor((diffMs % MS_PER_DAY) / MS_PER_HOUR);
    const minutes = Math.floor((diffMs % MS_PER_HOUR) / MS_PER_MINUTE);

    statusLabel = days > 0 ? `H-${days} Menuju Kickoff Perdana` : `Kickoff dalam ${hours} jam ${minutes} menit`;

    return {
      competitionId,
      name: competitionName,
      startDate: startDateYmd,
      endDate: endDateYmd,
      totalDays,
      phase,
      currentDayNumber: null,
      dayCode: null,
      countdown: {
        days,
        hours,
        minutes,
        label: statusLabel,
        isKickoffImminent: days === 0,
      },
      isTodayInTournament: false,
      statusLabel,
    };
  } else if (nowActualMs > endOfTournamentMs) {
    phase = 'COMPLETED';
    statusLabel = 'Turnamen Telah Selesai';

    return {
      competitionId,
      name: competitionName,
      startDate: startDateYmd,
      endDate: endDateYmd,
      totalDays,
      phase,
      currentDayNumber: totalDays,
      dayCode: `H${totalDays}`,
      countdown: {
        days: 0,
        hours: 0,
        minutes: 0,
        label: 'Turnamen Selesai',
        isKickoffImminent: false,
      },
      isTodayInTournament: false,
      statusLabel,
    };
  } else {
    // Sedang dalam rentang hari pertandingan
    phase = 'MATCHDAY';
    isTodayInTournament = true;

    // Tentukan hari ke berapa (H1 atau H2)
    const startDateObj = new Date(`${startDateYmd}T00:00:00Z`);
    const todayDateObj = new Date(`${todayYmd}T00:00:00Z`);
    const dayDiff = Math.max(0, Math.floor((todayDateObj.getTime() - startDateObj.getTime()) / MS_PER_DAY));
    currentDayNumber = Math.min(totalDays, dayDiff + 1);
    dayCode = `H${currentDayNumber}`;
    statusLabel = `HARI-${currentDayNumber}: ${currentInfo.formattedIndonesian.toUpperCase()}`;

    return {
      competitionId,
      name: competitionName,
      startDate: startDateYmd,
      endDate: endDateYmd,
      totalDays,
      phase,
      currentDayNumber,
      dayCode,
      countdown: {
        days: 0,
        hours: 0,
        minutes: 0,
        label: 'Pertandingan Hari Ini Sedang Berlangsung',
        isKickoffImminent: false,
      },
      isTodayInTournament,
      statusLabel,
    };
  }
}

/**
 * Generate ringkasan kalender harian untuk setiap hari turnamen.
 */
export function generateCalendarDays(
  startDateYmd: string,
  endDateYmd: string,
  matches: Array<{ id: string; scheduledAt: string; status: string; matchNo?: number }>,
  referenceDate?: Date
): CalendarDaySummary[] {
  const todayYmd = formatDateYmd(referenceDate);
  const summaries: CalendarDaySummary[] = [];

  const start = new Date(`${startDateYmd}T00:00:00Z`);
  const end = new Date(`${endDateYmd}T00:00:00Z`);
  const daysCount = Math.max(1, Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1);

  for (let i = 0; i < daysCount; i++) {
    const dayDateObj = new Date(start.getTime() + i * MS_PER_DAY);
    const dayYmd = dayDateObj.toISOString().slice(0, 10);
    const dayNumber = i + 1;
    const dayCode = `H${dayNumber}`;

    // Filter pertandingan yang terjadwal di hari ini
    const dayMatches = matches.filter((m) => {
      if (!m.scheduledAt) return false;
      const mDateYmd = m.scheduledAt.slice(0, 10);
      return mDateYmd === dayYmd;
    });

    const isToday = dayYmd === todayYmd;
    let status: 'UPCOMING' | 'TODAY' | 'COMPLETED' = 'UPCOMING';
    if (isToday) {
      status = 'TODAY';
    } else if (dayYmd < todayYmd) {
      status = 'COMPLETED';
    } else {
      status = 'UPCOMING';
    }

    const completed = dayMatches.filter((m) => ['finished', 'verified', 'bap_signed', 'completed'].includes(m.status.toLowerCase())).length;
    const live = dayMatches.filter((m) => ['live', 'break'].includes(m.status.toLowerCase())).length;
    const scheduled = dayMatches.filter((m) => ['scheduled', 'lineup_confirmed', 'upcoming'].includes(m.status.toLowerCase())).length;

    // Ambil jam laga pertama dan terakhir
    let firstMatchTime: string | null = null;
    let lastMatchTime: string | null = null;
    if (dayMatches.length > 0) {
      const sortedTimes = [...dayMatches].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
      firstMatchTime = formatTimeWib(new Date(sortedTimes[0].scheduledAt));
      lastMatchTime = formatTimeWib(new Date(sortedTimes[sortedTimes.length - 1].scheduledAt));
    }

    summaries.push({
      dayCode,
      dayNumber,
      date: dayYmd,
      dayName: NAMA_HARI_ID[getWibDate(dayDateObj).getDay()],
      formattedDate: formatIndonesianFullDate(dayDateObj),
      hijri: getHijriDate(dayDateObj),
      status,
      isToday,
      matchCount: dayMatches.length,
      completedMatchCount: completed,
      liveMatchCount: live,
      scheduledMatchCount: scheduled,
      firstMatchTime,
      lastMatchTime,
    });
  }

  return summaries;
}

/**
 * Deteksi potensi bentrok jadwal dan pelanggaran waktu istirahat tim.
 */
export function analyzeScheduleConflicts(
  matches: Array<{
    id: string;
    matchNo: number;
    homeTeamId: string | null;
    awayTeamId: string | null;
    courtName?: string | null;
    scheduledAt: string;
    durationMinutes?: number;
  }>
): { hasConflict: boolean; conflicts: ScheduleConflict[] } {
  const conflicts: ScheduleConflict[] = [];
  const DEFAULT_MATCH_DURATION = 35; // 2x15 menit + 5 menit istirahat babak
  const MINIMUM_REST_MINUTES = 30; // Batas aman istirahat atlet usia dini (SD/MI)

  // 1. Periksa tabrakan lapangan/venue pada waktu yang sama
  for (let i = 0; i < matches.length; i++) {
    for (let j = i + 1; j < matches.length; j++) {
      const m1 = matches[i];
      const m2 = matches[j];
      if (!m1.scheduledAt || !m2.scheduledAt) continue;

      const t1Start = new Date(m1.scheduledAt).getTime();
      const t1End = t1Start + (m1.durationMinutes || DEFAULT_MATCH_DURATION) * MS_PER_MINUTE;

      const t2Start = new Date(m2.scheduledAt).getTime();
      const t2End = t2Start + (m2.durationMinutes || DEFAULT_MATCH_DURATION) * MS_PER_MINUTE;

      // Cek lapangan sama
      const court1 = m1.courtName || 'Lapangan Utama';
      const court2 = m2.courtName || 'Lapangan Utama';

      if (court1 === court2) {
        if (t1Start < t2End && t2Start < t1End) {
          conflicts.push({
            type: 'VENUE_COLLISION',
            severity: 'CRITICAL',
            description: `Bentrok Lapangan: Partai P${m1.matchNo} dan P${m2.matchNo} dijadwalkan pada waktu tumpang tindih di ${court1}.`,
            matchIds: [m1.id, m2.id],
          });
        }
      }

      // Cek tim yang sama bermain berturut-turut tanpa istirahat cukup
      const teams1 = [m1.homeTeamId, m1.awayTeamId].filter(Boolean);
      const teams2 = [m2.homeTeamId, m2.awayTeamId].filter(Boolean);
      const sharedTeam = teams1.find((id) => teams2.includes(id));

      if (sharedTeam) {
        const intervalMs = Math.abs(t2Start - t1End);
        const intervalMinutes = intervalMs / MS_PER_MINUTE;

        if (intervalMinutes < MINIMUM_REST_MINUTES && t2Start >= t1Start) {
          conflicts.push({
            type: 'TEAM_REST_VIOLATION',
            severity: 'WARNING',
            description: `Waktu Istirahat Kurang: Kontingen bertanding di Partai P${m1.matchNo} dan P${m2.matchNo} dengan jeda istirahat hanya ${Math.round(intervalMinutes)} menit (minimal standar ${MINIMUM_REST_MINUTES} menit untuk atlet pelajar).`,
            matchIds: [m1.id, m2.id],
          });
        }
      }
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
  };
}

