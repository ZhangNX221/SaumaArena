'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { initialMatches, TOURNAMENT_RUNDOWN } from '@/mocks/tournamentData';
import { REFEREE_DUTIES } from '@/mocks/multiSportData';
import { CABOR_INFO_DATA } from '@/mocks/caborContentData';
import { Match, RefereeMatchDuty, SportCode } from '@/types';
import { usePersistentState } from '@/hooks/usePersistentState';
import { fetchLiveStateFromBackend } from '@/lib/apiSync';
import { getTeamLogoUrl } from '@/mocks/teamLogos';
import { PublicPageHeader } from '../layout/PublicPageHeader';
import { TournamentRundownTable } from './schedule/TournamentRundownTable';
import { PublicMatchCard } from './schedule/PublicMatchCard';

interface ScheduleTabProps {
  sportCode?: SportCode;
}

const cleanTeamName = (name?: string | null) => {
  if (!name) return '';
  const cleaned = name.replace(/\s*\([A-D][1-4]\)\s*$/i, '').trim();
  if (cleaned.includes('KARDINA MASSA')) return 'SDI KARDINA MASSA';
  if (cleaned.includes('MIN 14 BLITAR')) return 'MIN 14 BLITAR';
  if (cleaned.includes('MAMBAUL ULUM')) return 'MI MAMBAUL ULUM BUNTARAN';
  if (cleaned.includes('BUNAYYA')) return 'MI YA BUNAYYA SRENGAT';
  return cleaned;
};

const parseScheduleInfo = (scheduledTimeStr: string, matchNumber: number) => {
  const rundownItem = TOURNAMENT_RUNDOWN.find((r) => r.matchCode === `P${matchNumber}`);
  let time = '07:30 - 08:00 WIB';
  if (rundownItem?.time) {
    time = `${rundownItem.time.replace(/\./g, ':')} WIB`;
  } else {
    const tm = (scheduledTimeStr || '').match(/(\d{1,2}[:.]\d{2}\s*-\s*\d{1,2}[:.]\d{2}(?:\s*WIB)?)/i);
    if (tm) time = tm[1].includes('WIB') ? tm[1].replace(/\./g, ':') : `${tm[1].replace(/\./g, ':')} WIB`;
  }
  const parts = (scheduledTimeStr || '').split('•').map((s) => s.trim());
  const dateStr = parts[0] || (rundownItem ? rundownItem.dayDate : 'Senin, 2 Nov 2026');
  const restStr = parts.slice(1).join(' • ');
  const codeMatch = restStr.match(/\((.*?)\)/);
  const stageDesc = matchNumber === 15 ? 'Semifinal 1' : matchNumber === 16 ? 'Semifinal 2' : matchNumber === 17 ? 'Grand Final' : rundownItem?.agendaCode;
  const code = rundownItem ? `Partai ${rundownItem.matchCode} (${stageDesc})` : codeMatch ? codeMatch[1] : `Partai P${matchNumber}`;
  return { dateStr, time, code };
};

const KNOCKOUT_HEAL: Record<number, Partial<Match>> = {
  15: { teamAId: 'team-min7-blitar', teamAName: 'MIN 7 BLITAR', teamBId: 'team-min13-c', teamBName: 'MIN 13 BLITAR B', teamALogo: getTeamLogoUrl('team-min7-blitar'), teamBLogo: getTeamLogoUrl('team-min13-c') },
  16: { teamAId: 'team-mi-mambaululum', teamAName: 'MI MAMBAUL ULUM BUNTARAN', teamBId: 'team-min5-tulungagung', teamBName: 'MIN 5 TULUNGAGUNG', teamALogo: getTeamLogoUrl('team-mi-mambaululum'), teamBLogo: getTeamLogoUrl('team-min5-tulungagung') },
  17: { teamAId: 'placeholder-sf1', teamAName: 'JUARA SEMIFINAL 1', teamBId: 'placeholder-sf2', teamBName: 'JUARA SEMIFINAL 2', teamALogo: '', teamBLogo: '' },
};

const isMatchCompleted = (m: Match, dutyList?: RefereeMatchDuty[]): boolean => {
  const s = (m.status || '').toUpperCase();
  if (['COMPLETED', 'FINISHED', 'VERIFIED', 'BAP_SIGNED'].includes(s) || m.bapSigned) return true;
  return Boolean(dutyList?.some((d) => (d.matchId === m.id || String(d.matchNumber) === String(m.matchNumber)) && ['COMPLETED', 'FINISHED', 'VERIFIED'].includes((d.status || '').toUpperCase())));
};

const isMatchLive = (m: Match, dutyList?: RefereeMatchDuty[]): boolean => {
  if (isMatchCompleted(m, dutyList)) return false;
  if ((m.status || '').toUpperCase() === 'LIVE') return true;
  return Boolean(dutyList?.some((d) => (d.matchId === m.id || String(d.matchNumber) === String(m.matchNumber)) && (d.status || '').toUpperCase() === 'LIVE'));
};

export const ScheduleTab: React.FC<ScheduleTabProps> = ({ sportCode = 'FUTSAL' }) => {
  const caborMeta = CABOR_INFO_DATA[sportCode] || CABOR_INFO_DATA.FUTSAL;

  const [matches, setMatches] = usePersistentState<Match[]>('sauma_arena_matches', initialMatches);
  const [duties] = usePersistentState<RefereeMatchDuty[]>('sauma_arena_duties', REFEREE_DUTIES);
  const [dateFilter, setDateFilter] = useState<'ALL' | 'H1' | 'H2'>('ALL');
  const [calendarData, setCalendarData] = useState<any>(null);

  // 1. Self-healing: bersihkan placeholder knockout dan sinkronkan alokasi waktu resmi
  useEffect(() => {
    let hasChanged = false;
    const updated = matches.map((m) => {
      let copy = { ...m };
      if (KNOCKOUT_HEAL[m.matchNumber]) {
        const heal = KNOCKOUT_HEAL[m.matchNumber];
        const isPlaceholderA = !copy.teamAId || copy.teamAId.startsWith('placeholder-') || copy.teamAName?.startsWith('JUARA GRUP');
        const isPlaceholderB = !copy.teamBId || copy.teamBId.startsWith('placeholder-') || copy.teamBName?.startsWith('JUARA GRUP');
        if (m.matchNumber === 17) {
          if (!copy.teamAName) copy.teamAName = 'JUARA SEMIFINAL 1';
          if (!copy.teamBName) copy.teamBName = 'JUARA SEMIFINAL 2';
        } else if (isPlaceholderA || isPlaceholderB) {
          if (isPlaceholderA && heal.teamAId) {
            copy.teamAId = heal.teamAId;
            copy.teamAName = heal.teamAName || copy.teamAName;
            copy.teamALogo = heal.teamALogo || copy.teamALogo;
            hasChanged = true;
          }
          if (isPlaceholderB && heal.teamBId) {
            copy.teamBId = heal.teamBId;
            copy.teamBName = heal.teamBName || copy.teamBName;
            copy.teamBLogo = heal.teamBLogo || copy.teamBLogo;
            hasChanged = true;
          }
        }
      }
      const rundown = TOURNAMENT_RUNDOWN.find((r) => r.matchCode === `P${m.matchNumber}`);
      if (rundown) {
        const formattedTime = rundown.time.replace(/\./g, ':');
        const correctScheduled = `${rundown.dayDate} • ${formattedTime} WIB (${rundown.matchCode} • ${rundown.agendaCode})`;
        if (copy.scheduledTime !== correctScheduled) {
          copy.scheduledTime = correctScheduled;
          hasChanged = true;
        }
      }
      const initial = initialMatches.find((im) => im.id === m.id || im.matchNumber === m.matchNumber);
      if (initial && m.stage === 'GROUP') {
        const cleanInitialA = cleanTeamName(initial.teamAName);
        const cleanInitialB = cleanTeamName(initial.teamBName);
        const cleanCurrentA = cleanTeamName(copy.teamAName);
        const cleanCurrentB = cleanTeamName(copy.teamBName);
        if (cleanCurrentA !== cleanInitialA) {
          copy.teamAName = cleanInitialA;
          hasChanged = true;
        }
        if (cleanCurrentB !== cleanInitialB) {
          copy.teamBName = cleanInitialB;
          hasChanged = true;
        }
        if (copy.teamAId !== initial.teamAId) {
          copy.teamAId = initial.teamAId;
          hasChanged = true;
        }
        if (copy.teamBId !== initial.teamBId) {
          copy.teamBId = initial.teamBId;
          hasChanged = true;
        }
      }
      return copy;
    });

    if (hasChanged) {
      setMatches(updated);
    }
  }, [matches, setMatches]);

  // 2. Sinkronisasi kalender turnamen
  useEffect(() => {
    fetch('/api/calendar')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCalendarData(data);
        }
      })
      .catch((err) => console.error('Failed to load calendar data:', err));
  }, []);

  // 3. Sinkronisasi Real-Time Otomatis dari SQLite Backend (/api/live) saat laga selesai atau live
  useEffect(() => {
    let isMounted = true;

    const pullLiveState = async () => {
      try {
        const liveData = await fetchLiveStateFromBackend();
        if (!liveData || !isMounted || !Array.isArray(liveData.matches) || liveData.matches.length === 0) return;

        setMatches((prev) => {
          let hasDiff = false;
          const merged = prev.map((local) => {
            const remote = liveData.matches.find(
              (m) => m.id === local.id || String(m.matchNumber) === String(local.matchNumber)
            );
            if (!remote) return local;

            const isRemoteCompleted =
              remote.status === 'COMPLETED' ||
              (remote.status as string)?.toLowerCase() === 'finished' ||
              (remote.status as string)?.toLowerCase() === 'verified';
            const isRemoteLive = remote.status === 'LIVE' || (remote.status as string)?.toLowerCase() === 'live';

            const newStatus = isRemoteCompleted ? 'COMPLETED' : isRemoteLive ? 'LIVE' : local.status;
            const isScoreDiff = remote.scoreA !== local.scoreA || remote.scoreB !== local.scoreB;
            const isStatusDiff = newStatus !== local.status;
            const cleanRemoteA = cleanTeamName(remote.teamAName);
            const cleanRemoteB = cleanTeamName(remote.teamBName);
            const cleanLocalA = cleanTeamName(local.teamAName);
            const cleanLocalB = cleanTeamName(local.teamBName);

            const isRemotePlaceholder = (name: string) =>
              !name || name.toLowerCase().includes('tim a') || name.toLowerCase().includes('tim b');

            const isNameDiff =
              (Boolean(cleanRemoteA) && !isRemotePlaceholder(cleanRemoteA) && cleanRemoteA !== cleanLocalA) ||
              (Boolean(cleanRemoteB) && !isRemotePlaceholder(cleanRemoteB) && cleanRemoteB !== cleanLocalB);

            if (isScoreDiff || isStatusDiff || isNameDiff) {
              hasDiff = true;
              return {
                ...local,
                teamAName: isRemotePlaceholder(cleanRemoteA) ? local.teamAName : (cleanRemoteA || local.teamAName),
                teamBName: isRemotePlaceholder(cleanRemoteB) ? local.teamBName : (cleanRemoteB || local.teamBName),
                scoreA: remote.scoreA,
                scoreB: remote.scoreB,
                status: newStatus,
                isVerified: (remote.status as string)?.toLowerCase() === 'verified' || local.isVerified,
              };
            }
            return local;
          });

          return hasDiff ? merged : prev;
        });
      } catch {
        // Fallback hening jika jaringan terputus
      }
    };

    pullLiveState();
    const interval = setInterval(pullLiveState, 2500);

    const handleFocus = () => pullLiveState();
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [setMatches]);

  const filteredMatches = matches.filter((m) => {
    if (dateFilter === 'H1') return m.scheduledTime.includes('Senin, 2 Nov') || m.matchNumber <= 10;
    if (dateFilter === 'H2') return m.scheduledTime.includes('Selasa, 3 Nov') || m.scheduledTime.includes('Rabu, 4 Nov') || m.matchNumber >= 11;
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-6">
      {/* Public Page Header */}
      <PublicPageHeader
        icon={Calendar}
        category={`AGENDA • ${sportCode}`}
        title="Jadwal &amp; Skor Pertandingan"
        description="Pembaruan skor langsung babak per babak, hasil pertandingan terverifikasi berita acara juri, dan agenda pertandingan berikutnya."
      />

      {/* Backend Calendar Engine Live Indicator */}
      {calendarData && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-blue-50/70 dark:bg-sky-950/30 border-2 border-blue-200/80 dark:border-sky-800/60 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#1D63B8] text-white shrink-0 shadow-xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-barlow font-bold uppercase tracking-wider text-[#1D63B8] dark:text-sky-400">
                  {calendarData.tournament.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white animate-pulse">
                  {calendarData.tournament.countdown.label}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-medium">
                Waktu Sistem: <strong>{calendarData.current.formattedIndonesian}</strong> ({calendarData.current.currentTimeWib})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-mono">
            <span>{calendarData.tournament.startDate} s/d {calendarData.tournament.endDate}</span>
            <span>&bull;</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{calendarData.scheduleAnalysis.totalMatches} Partai Terplot</span>
          </div>
        </div>
      )}

      {/* Top Filter Segmented Bar: Tanggal Pertandingan */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[var(--bg-muted)] border-2 border-slate-300 dark:border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setDateFilter('ALL')}
            className={`btn-tactile px-4 py-2 rounded-md transition-all min-h-[38px] font-barlow font-bold uppercase tracking-wider cursor-pointer ${
              dateFilter === 'ALL'
                ? 'bg-[#1D63B8] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Semua Tanggal
          </button>
          <button
            type="button"
            onClick={() => setDateFilter('H1')}
            className={`btn-tactile px-4 py-2 rounded-md transition-all flex items-center gap-1.5 min-h-[38px] font-barlow font-bold uppercase tracking-wider cursor-pointer ${
              dateFilter === 'H1'
                ? 'bg-[#1D63B8] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>Senin, 2 Nov 2026</span>
          </button>
          <button
            type="button"
            onClick={() => setDateFilter('H2')}
            className={`btn-tactile px-4 py-2 rounded-md transition-all min-h-[38px] font-barlow font-bold uppercase tracking-wider cursor-pointer ${
              dateFilter === 'H2'
                ? 'bg-[#1D63B8] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Selasa, 3 Nov 2026
          </button>
        </div>

        <div className="text-xs text-[var(--text-muted)] flex items-center gap-2 font-medium">
          <Clock className="w-4 h-4 text-[#1D63B8] dark:text-sky-400" />
          <span>Zona Waktu: WIB (GMT+7) &bull; {caborMeta.venueCourt}</span>
        </div>
      </div>

      {/* Tab Semua Tanggal: Munculkan Tabel Rundown. Tab Tanggal: Tampilkan per Pertandingan */}
      {dateFilter === 'ALL' ? (
        <TournamentRundownTable />
      ) : filteredMatches.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 space-y-2">
          <p className="text-sm font-bold text-[var(--text-main)]">
            Tidak ada pertandingan pada tanggal ini.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Silakan pilih tanggal lain atau klik Semua Tanggal untuk melihat seluruh pertandingan.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map((match) => {
            const isCompleted = isMatchCompleted(match, duties);
            const isLive = isMatchLive(match, duties);
            const { time, code } = parseScheduleInfo(match.scheduledTime, match.matchNumber);

            return (
              <PublicMatchCard
                key={match.id}
                match={match}
                isCompleted={isCompleted}
                isLive={isLive}
                time={time}
                code={code}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
