'use client';

import React, { useState } from 'react';
import { MapPin, Clock, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
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

  const filteredMatches = matches.filter((m) => {
    if (dateFilter === 'H1') return m.scheduledTime.includes('Selasa, 3 Nov') || m.matchNumber <= 10;
    if (dateFilter === 'H2') return m.scheduledTime.includes('Rabu, 4 Nov') || m.matchNumber >= 11;
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedMatchId(expandedMatchId === id ? null : id);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Public Page Header */}
      <PublicPageHeader
        icon={Calendar}
        category={`AGENDA • ${sportCode}`}
        title="Jadwal &amp; Skor Pertandingan"
        description="Pembaruan skor langsung babak per babak, hasil pertandingan terverifikasi berita acara juri, dan agenda pertandingan berikutnya."
      />

      {/* Top Filter Segmented Bar: Tanggal Pertandingan */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setDateFilter('ALL')}
            className={`px-4 py-2 rounded-lg transition-all min-h-[38px] ${
              dateFilter === 'ALL'
                ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-xs font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Semua Tanggal
          </button>
          <button
            type="button"
            onClick={() => setDateFilter('H1')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 min-h-[38px] ${
              dateFilter === 'H1'
                ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-xs font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>Selasa, 3 Nov 2026</span>
          </button>
          <button
            type="button"
            onClick={() => setDateFilter('H2')}
            className={`px-4 py-2 rounded-lg transition-all min-h-[38px] ${
              dateFilter === 'H2'
                ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-xs font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Rabu, 4 Nov 2026
          </button>
        </div>

        <div className="text-xs text-[var(--text-muted)] flex items-center gap-2 font-medium">
          <Clock className="w-4 h-4 text-[var(--color-arena-primary)]" />
          <span>Zona Waktu: WIB (GMT+7) &bull; {caborMeta.venueCourt}</span>
        </div>
      </div>

      {/* Tab Semua Tanggal: Munculkan Tabel Rundown saja. Tab Tanggal: Tampilkan per Pertandingan */}
      {dateFilter === 'ALL' ? (
        <TournamentRundownTable />
      ) : filteredMatches.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
          <p className="text-sm font-bold text-[var(--text-main)]">
            Tidak ada pertandingan pada tanggal ini.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Silakan pilih tanggal lain atau klik Semua Tanggal untuk melihat seluruh pertandingan.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredMatches.map((match) => {
            const isLive = match.status === 'LIVE';
            const isCompleted = match.status === 'COMPLETED';
            const isExpanded = expandedMatchId === match.id;
            const { time, code } = parseScheduleInfo(match.scheduledTime, match.matchNumber);

            return (
              <div
                key={match.id}
                className={`rounded-2xl bg-[var(--bg-surface)] border transition-all overflow-hidden shadow-xs ${
                  isLive
                    ? 'border-red-500/60 ring-2 ring-red-500/10'
                    : 'border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)]/40'
                }`}
              >
                <div className="px-5 sm:px-7 py-3 bg-[var(--bg-muted)]/70 border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
                  <div className="flex items-center gap-2.5 font-bold">
                    <span className="text-[var(--text-main)] font-mono text-xs sm:text-sm">Pertandingan #{match.matchNumber}</span>
                    <span>&bull;</span>
                    <span className="uppercase tracking-wider text-[11px] sm:text-xs font-mono font-bold text-[var(--color-arena-primary)]">
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

                  <div className="flex items-center gap-3">
                    <a
                      href="https://maps.app.goo.gl/71UwUT3czxJj5Mip7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-tactile inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] text-[var(--color-arena-primary)] border border-[var(--border-subtle)] text-[11px] font-bold shadow-2xs transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[var(--color-arena-accent)]" />
                      <span>{match.courtName}</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-[var(--color-arena-primary-light)] font-mono font-bold">
                        Maps ↗
                      </span>
                    </a>

                    {isLive && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-barlow font-black uppercase tracking-wider bg-red-600 text-white shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        <span>LIVE {match.timeDisplay || 'Babak 2'}</span>
                      </span>
                    )}
                    {isCompleted && match.isVerified === false && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">⚠️ Belum Resmi (Menunggu Verifikasi)</span>
                    )}
                    {isCompleted && match.isVerified !== false && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">✓ Terverifikasi Resmi</span>
                    )}
                    {match.status === 'UPCOMING' && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-barlow font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">Akan Datang</span>
                    )}
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-5">
                    {/* TIM A (Kiri) */}
                    <div className="flex-1 w-full md:w-auto flex items-center justify-between md:justify-end gap-4 sm:gap-5 text-left md:text-right">
                      <div className="min-w-0 flex-1 md:flex-initial">
                        <h4 className="font-barlow font-extrabold text-xl sm:text-2xl lg:text-3xl text-[var(--text-main)] leading-tight tracking-tight">
                          {match.teamAName}
                        </h4>
                        <div className="mt-1.5 flex items-center md:justify-end">
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs sm:text-sm font-barlow font-bold uppercase tracking-wider bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] border border-[var(--color-arena-primary)]/25">
                            {match.group ? `Fase Grup ${match.group}` : (match.stage === 'FINAL' ? 'Grand Final' : 'Babak 4 Besar')}
                          </span>
                        </div>
                      </div>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[84px] lg:h-[84px] rounded-2xl bg-[var(--bg-muted)] border-2 border-[var(--border-subtle)] flex items-center justify-center p-2.5 shrink-0 shadow-xs overflow-hidden">
                        {match.teamALogo ? (
                          <img src={match.teamALogo} alt={match.teamAName} className="w-full h-full object-contain" />
                        ) : (
                          <span className="font-barlow font-black text-lg sm:text-xl text-[var(--color-arena-primary)]">
                            {match.teamAName.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* AREA TENGAH: WAKTU & VS / SKOR */}
                    <div className="shrink-0 flex flex-col items-center justify-center text-center">
                      {match.status === 'UPCOMING' ? (
                        <div className="flex flex-col items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[var(--bg-muted)]/70 border border-[var(--border-subtle)] shadow-2xs min-w-[170px]">
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold text-[var(--color-arena-primary)]">
                            <Clock className="w-3.5 h-3.5 text-[var(--color-arena-accent)] shrink-0" />
                            <span>{time}</span>
                          </div>
                          <div className="px-3.5 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xs">
                            <span className="font-bebas text-sm sm:text-base text-[var(--text-muted)] tracking-wider">VS</span>
                          </div>
                          <div className="text-[11px] font-mono font-bold text-[var(--text-muted)] tracking-tight">
                            {code}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center px-5 py-2 min-w-[140px]">
                          <div className="flex items-center gap-3 font-teko tabular-nums font-bold text-4xl sm:text-5xl lg:text-6xl tracking-wide text-[var(--text-main)] leading-none">
                            <span className={match.scoreA > match.scoreB ? 'text-[var(--color-arena-primary)]' : ''}>
                              {match.scoreA}
                            </span>
                            <span className="text-[var(--text-muted)] text-2xl font-normal">:</span>
                            <span className={match.scoreB > match.scoreA ? 'text-[var(--color-arena-primary)]' : ''}>
                              {match.scoreB}
                            </span>
                          </div>
                          <span className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] mt-1.5">
                            {isLive ? 'Babak Ke-2' : 'Skor Akhir'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* TIM B (Kanan) */}
                    <div className="flex-1 w-full md:w-auto flex items-center justify-between md:justify-start gap-4 sm:gap-5 text-left">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[84px] lg:h-[84px] rounded-2xl bg-[var(--bg-muted)] border-2 border-[var(--border-subtle)] flex items-center justify-center p-2.5 shrink-0 shadow-xs overflow-hidden order-last md:order-first">
                        {match.teamBLogo ? (
                          <img src={match.teamBLogo} alt={match.teamBName} className="w-full h-full object-contain" />
                        ) : (
                          <span className="font-barlow font-black text-lg sm:text-xl text-[var(--color-arena-primary)]">
                            {match.teamBName.split(' ')[0]}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 md:flex-initial">
                        <h4 className="font-barlow font-extrabold text-xl sm:text-2xl lg:text-3xl text-[var(--text-main)] leading-tight tracking-tight">
                          {match.teamBName}
                        </h4>
                        <div className="mt-1.5 flex items-center md:justify-start">
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs sm:text-sm font-barlow font-bold uppercase tracking-wider bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] border border-[var(--color-arena-primary)]/25">
                            {match.group ? `Fase Grup ${match.group}` : (match.stage === 'FINAL' ? 'Grand Final' : 'Babak 4 Besar')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {match.events && match.events.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-[var(--border-subtle)]">
                      <button
                        type="button"
                        onClick={() => toggleExpand(match.id)}
                        className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors py-1"
                      >
                        <span>{isExpanded ? 'Sembunyikan Riwayat Gol & Kartu' : `Lihat Log Gol & Kartu (${match.events.length})`}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-4 pt-3 border-t border-dashed border-[var(--border-subtle)] space-y-2">
                          {match.events.map((ev) => (
                            <div
                              key={ev.id}
                              className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-[var(--bg-muted)]/50"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[11px] px-1.5 py-0.5 rounded bg-[var(--color-arena-dark)] text-white">
                                  {ev.minute}&apos;
                                </span>
                                <span className="font-semibold text-[var(--text-main)]">{ev.playerName}</span>
                                {ev.type === 'GOAL' && (
                                  <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span>Gol</span>
                                  </span>
                                )}
                                {ev.type === 'YELLOW_CARD' && (
                                  <span className="text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1.5">
                                    <span className="w-2 h-2.5 rounded-2xs bg-amber-400 border border-amber-600/40" />
                                    <span>Kartu Kuning</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-[var(--text-muted)]">
                                {ev.teamId === match.teamAId ? match.teamAName : match.teamBName}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        )}
    </div>
  );
};
