'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Clock, ChevronDown, ChevronUp, Calendar, AlertCircle } from 'lucide-react';
import { initialMatches } from '@/mocks/tournamentData';
import { CABOR_INFO_DATA } from '@/mocks/caborContentData';
import { Match, SportCode } from '@/types';
import { usePersistentState } from '@/hooks/usePersistentState';
import { PublicPageHeader } from '../layout/PublicPageHeader';
import { TournamentRundownTable } from './schedule/TournamentRundownTable';

interface ScheduleTabProps {
  sportCode?: SportCode;
}

const parseScheduleInfo = (scheduledTimeStr: string, matchNumber: number) => {
  const parts = scheduledTimeStr.split('•').map((s) => s.trim());
  const dateStr = parts[0] || 'Jadwal Turnamen';
  const restStr = parts.slice(1).join(' • ');

  const timeMatch = restStr.match(/(\d{2}[:.]\d{2}\s*-\s*\d{2}[:.]\d{2}(?:\s*WIB)?)/i);
  const time = timeMatch ? (timeMatch[1].includes('WIB') ? timeMatch[1] : `${timeMatch[1]} WIB`) : '07:30 - 08:00 WIB';

  const codeMatch = restStr.match(/\((.*?)\)/);
  const code = codeMatch ? codeMatch[1] : `Partai P${matchNumber}`;

  return { dateStr, time, code };
};

export const ScheduleTab: React.FC<ScheduleTabProps> = ({ sportCode = 'FUTSAL' }) => {
  const caborMeta = CABOR_INFO_DATA[sportCode] || CABOR_INFO_DATA.FUTSAL;

  const [matches] = usePersistentState<Match[]>('sauma_arena_matches', initialMatches);
  const [dateFilter, setDateFilter] = useState<'ALL' | 'H1' | 'H2'>('ALL');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>('match-1');
  const [calendarData, setCalendarData] = useState<any>(null);

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

  const filteredMatches = matches.filter((m) => {
    if (dateFilter === 'H1') return m.scheduledTime.includes('Selasa, 3 Nov') || m.matchNumber <= 10;
    if (dateFilter === 'H2') return m.scheduledTime.includes('Rabu, 4 Nov') || m.matchNumber >= 11;
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedMatchId(expandedMatchId === id ? null : id);
  };

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
            <span>Selasa, 3 Nov 2026</span>
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
            Rabu, 4 Nov 2026
          </button>
        </div>

        <div className="text-xs text-[var(--text-muted)] flex items-center gap-2 font-medium">
          <Clock className="w-4 h-4 text-[#1D63B8] dark:text-sky-400" />
          <span>Zona Waktu: WIB (GMT+7) &bull; {caborMeta.venueCourt}</span>
        </div>
      </div>

      {/* Tab Semua Tanggal: Munculkan Tabel Rundown saja. Tab Tanggal: Tampilkan per Pertandingan */}
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
            const isLive = match.status === 'LIVE';
            const isCompleted = match.status === 'COMPLETED';
            const isExpanded = expandedMatchId === match.id;
            const { time, code } = parseScheduleInfo(match.scheduledTime, match.matchNumber);

            return (
              <div
                key={match.id}
                className={`rounded-xl bg-[var(--bg-surface)] border-2 transition-all overflow-hidden shadow-sm ${
                  isLive
                    ? 'border-red-500/80 ring-2 ring-red-500/15'
                    : 'border-slate-300 dark:border-slate-800 hover:border-[#1D63B8]/60'
                }`}
              >
                <div className="px-4 sm:px-6 py-2.5 bg-[var(--bg-muted)]/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs text-[var(--text-muted)]">
                  <div className="flex items-center gap-2 font-bold">
                    <span className="text-[var(--text-main)] font-mono text-xs sm:text-sm">Pertandingan #{match.matchNumber}</span>
                    <span>&bull;</span>
                    <span className="uppercase tracking-wider text-[11px] sm:text-xs font-mono font-bold text-[#1D63B8] dark:text-sky-400">
                      {match.stage === 'GROUP'
                        ? `FASE GRUP ${match.group}`
                        : match.stage === 'QUARTER_FINAL'
                        ? 'BABAK 8 BESAR'
                        : match.stage === 'SEMI_FINAL'
                        ? 'BABAK 4 BESAR (SEMIFINAL)'
                        : match.stage === 'FINAL'
                        ? 'BABAK GRAND FINAL'
                        : 'BABAK GUGUR'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <a
                      href="https://maps.app.goo.gl/71UwUT3czxJj5Mip7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-tactile inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] text-[#1D63B8] dark:text-sky-400 border border-slate-300 dark:border-slate-700 text-[11px] font-bold shadow-2xs transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[var(--color-arena-accent)]" />
                      <span>{match.courtName}</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-blue-50 dark:bg-sky-950/40 font-mono font-bold">
                        Maps ↗
                      </span>
                    </a>

                    {isLive && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-[10px] font-barlow font-bold uppercase tracking-wider bg-red-600 text-white shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        <span>LIVE {match.timeDisplay || 'Babak 2'}</span>
                      </span>
                    )}
                    {isCompleted && match.isVerified === false && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-[10px] font-barlow font-bold uppercase tracking-wider bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">⚠️ Belum Resmi</span>
                    )}
                    {isCompleted && match.isVerified !== false && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-[10px] font-barlow font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">✓ Terverifikasi Resmi</span>
                    )}
                    {match.status === 'UPCOMING' && (
                      <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-barlow font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">Akan Datang</span>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-5">
                    {/* TIM A (Kiri) */}
                    <div className="flex-1 w-full md:w-auto flex items-center justify-between md:justify-end gap-3 sm:gap-4 text-left md:text-right">
                      <div className="min-w-0 flex-1 md:flex-initial">
                        <h4 className="font-barlow font-bold text-lg sm:text-xl text-[var(--text-main)] leading-tight tracking-wide">
                          {match.teamAName}
                        </h4>
                        <div className="mt-1 flex items-center md:justify-end">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-barlow font-bold uppercase tracking-wider bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800">
                            {match.group ? `Fase Grup ${match.group}` : (match.stage === 'FINAL' ? 'Grand Final' : 'Babak 4 Besar')}
                          </span>
                        </div>
                      </div>
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[var(--bg-muted)] border border-slate-300 dark:border-slate-700 flex items-center justify-center p-1.5 shrink-0 shadow-2xs overflow-hidden">
                        {match.teamALogo ? (
                          <img src={match.teamALogo} alt={match.teamAName} className="w-full h-full object-contain" />
                        ) : (
                          <span className="font-barlow font-bold text-base text-[#1D63B8]">
                            {match.teamAName.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* AREA TENGAH: WAKTU & VS / SKOR */}
                    <div className="shrink-0 flex flex-col items-center justify-center text-center">
                      {match.status === 'UPCOMING' ? (
                        <div className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg bg-[var(--bg-muted)]/80 border border-slate-300 dark:border-slate-700 shadow-2xs min-w-[150px]">
                          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1D63B8] dark:text-sky-400">
                            <Clock className="w-3.5 h-3.5 text-[var(--color-arena-accent)] shrink-0" />
                            <span>{time}</span>
                          </div>
                          <span className="font-bebas text-sm text-[var(--text-muted)] tracking-wider">VS</span>
                          <div className="text-[10px] font-mono font-bold text-[var(--text-muted)]">
                            {code}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-1 px-5 py-2 rounded-lg bg-[var(--bg-muted)] border border-slate-300 dark:border-slate-700 shadow-xs min-w-[150px]">
                          <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
                            Skor Akhir
                          </span>
                          <div className="text-3xl sm:text-4xl font-teko font-bold text-[var(--color-arena-accent)] tabular-nums leading-none">
                            {match.scoreA} - {match.scoreB}
                          </div>
                          <span className="text-[10px] font-mono text-[var(--text-muted)]">
                            {match.timeDisplay || 'Selesai'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* TIM B (Kanan) */}
                    <div className="flex-1 w-full md:w-auto flex items-center justify-between md:justify-start gap-3 sm:gap-4 text-right md:text-left">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[var(--bg-muted)] border border-slate-300 dark:border-slate-700 flex items-center justify-center p-1.5 shrink-0 shadow-2xs overflow-hidden order-2 md:order-1">
                        {match.teamBLogo ? (
                          <img src={match.teamBLogo} alt={match.teamBName} className="w-full h-full object-contain" />
                        ) : (
                          <span className="font-barlow font-bold text-base text-[var(--color-arena-accent)]">
                            {match.teamBName.split(' ')[0]}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 md:flex-initial order-1 md:order-2">
                        <h4 className="font-barlow font-bold text-lg sm:text-xl text-[var(--text-main)] leading-tight tracking-wide">
                          {match.teamBName}
                        </h4>
                        <div className="mt-1 flex items-center md:justify-start">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-barlow font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            {match.group ? `Fase Grup ${match.group}` : (match.stage === 'FINAL' ? 'Grand Final' : 'Babak 4 Besar')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
