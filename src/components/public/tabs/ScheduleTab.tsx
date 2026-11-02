'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { initialMatches, TOURNAMENT_RUNDOWN } from '@/mocks/tournamentData';
import { REFEREE_DUTIES } from '@/mocks/multiSportData';
import { CABOR_INFO_DATA } from '@/mocks/caborContentData';
import { Match, RefereeMatchDuty, SportCode } from '@/types';
import { usePersistentState } from '@/hooks/usePersistentState';
import { fetchLiveStateFromBackend } from '@/lib/apiSync';
import { PublicPageHeader } from '../layout/PublicPageHeader';
import { TournamentRundownTable } from './schedule/TournamentRundownTable';
import { PublicMatchCard } from './schedule/PublicMatchCard';

interface ScheduleTabProps {
  sportCode?: SportCode;
}

const parseScheduleInfo = (scheduledTimeStr: string, matchNumber: number) => {
  const rundownItem = TOURNAMENT_RUNDOWN.find((r) => r.matchCode === `P${matchNumber}`);

  let time = '';
  if (rundownItem && rundownItem.time) {
    const formattedRundownTime = rundownItem.time.replace(/\./g, ':');
    time = `${formattedRundownTime} WIB`;
  } else {
    const timeMatch = (scheduledTimeStr || '').match(/(\d{1,2}[:.]\d{2}\s*-\s*\d{1,2}[:.]\d{2}(?:\s*WIB)?)/i);
    time = timeMatch
      ? timeMatch[1].includes('WIB')
        ? timeMatch[1].replace(/\./g, ':')
        : `${timeMatch[1].replace(/\./g, ':')} WIB`
      : '07:30 - 08:00 WIB';
  }

  const parts = (scheduledTimeStr || '').split('•').map((s) => s.trim());
  const dateStr = parts[0] || (rundownItem ? rundownItem.dayDate : 'Senin, 2 Nov 2026');
  const restStr = parts.slice(1).join(' • ');

  const codeMatch = restStr.match(/\((.*?)\)/);
  const code = rundownItem
    ? `Partai ${rundownItem.matchCode} (${rundownItem.agendaCode})`
    : codeMatch
    ? codeMatch[1]
    : `Partai P${matchNumber}`;

  return { dateStr, time, code };
};

const KNOCKOUT_HEAL: Record<number, Partial<Match>> = {
  15: { teamAId: 'placeholder-ga', teamAName: 'JUARA GRUP A', teamBId: 'placeholder-gc', teamBName: 'JUARA GRUP C', teamALogo: '', teamBLogo: '' },
  16: { teamAId: 'placeholder-gb', teamAName: 'JUARA GRUP B', teamBId: 'placeholder-gd', teamBName: 'JUARA GRUP D', teamALogo: '', teamBLogo: '' },
  17: { teamAId: 'placeholder-sf1', teamAName: 'JUARA SEMIFINAL 1', teamBId: 'placeholder-sf2', teamBName: 'JUARA SEMIFINAL 2', teamALogo: '', teamBLogo: '' },
};

const isMatchCompleted = (m: Match, dutyList?: RefereeMatchDuty[]): boolean => {
  const s = (m.status || '').toUpperCase();
  if (s === 'COMPLETED' || s === 'FINISHED' || s === 'VERIFIED' || s === 'BAP_SIGNED') return true;
  if (m.bapSigned) return true;
  if (dutyList) {
    const d = dutyList.find((duty) => duty.matchId === m.id || String(duty.matchNumber) === String(m.matchNumber));
    if (d) {
      const ds = (d.status || '').toUpperCase();
      if (ds === 'COMPLETED' || ds === 'FINISHED' || ds === 'VERIFIED') return true;
    }
  }
  return false;
};

const isMatchLive = (m: Match, dutyList?: RefereeMatchDuty[]): boolean => {
  if (isMatchCompleted(m, dutyList)) return false;
  const s = (m.status || '').toUpperCase();
  if (s === 'LIVE') return true;
  if (dutyList) {
    const d = dutyList.find((duty) => duty.matchId === m.id || String(duty.matchNumber) === String(m.matchNumber));
    if (d && (d.status || '').toUpperCase() === 'LIVE') return true;
  }
  return false;
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
        copy = { ...copy, ...KNOCKOUT_HEAL[m.matchNumber] };
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
        if (copy.teamAName !== initial.teamAName) {
          copy.teamAName = initial.teamAName;
          hasChanged = true;
        }
        if (copy.teamBName !== initial.teamBName) {
          copy.teamBName = initial.teamBName;
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
            const isNameDiff =
              (Boolean(remote.teamAName) && remote.teamAName !== local.teamAName) ||
              (Boolean(remote.teamBName) && remote.teamBName !== local.teamBName);

            if (isScoreDiff || isStatusDiff || isNameDiff) {
              hasDiff = true;
              return {
                ...local,
                teamAName: remote.teamAName || local.teamAName,
                teamBName: remote.teamBName || local.teamBName,
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
