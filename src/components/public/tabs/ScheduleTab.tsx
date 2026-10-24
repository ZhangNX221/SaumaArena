'use client';

import React, { useState } from 'react';
import { MapPin, Clock, ChevronDown, ChevronUp, ShieldCheck, Calendar } from 'lucide-react';
import { initialMatches } from '@/mocks/tournamentData';
import { CABOR_MATCHES_DATA, CABOR_INFO_DATA } from '@/mocks/caborContentData';
import { Match, SportCode } from '@/types';

interface ScheduleTabProps {
  sportCode?: SportCode;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({ sportCode = 'FUTSAL' }) => {
  const isCustomCabor = sportCode === 'VOLI' || sportCode === 'ESPORT';
  const customMatches = CABOR_MATCHES_DATA[sportCode] || [];
  const caborMeta = CABOR_INFO_DATA[sportCode] || CABOR_INFO_DATA.FUTSAL;

  const [matches] = useState<Match[]>(initialMatches);
  const hasLive = (isCustomCabor ? customMatches : matches).some((m) => m.status === 'LIVE');
  const [statusFilter, setStatusFilter] = useState<'LIVE' | 'UPCOMING' | 'COMPLETED'>(
    hasLive ? 'LIVE' : 'UPCOMING'
  );
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>('match-103');

  const filteredMatches = matches.filter((m) => m.status === statusFilter);
  const filteredCustomMatches = customMatches.filter((m) => m.status === statusFilter);

  const toggleExpand = (id: string) => {
    setExpandedMatchId(expandedMatchId === id ? null : id);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Public Page Header */}
      <div className="space-y-1.5 pb-2">
        <div className="flex items-center gap-2 text-[var(--color-arena-primary)]">
          <Calendar className="w-4 h-4 shrink-0" />
          <span className="text-xs font-barlow font-bold uppercase tracking-wider">
            AGENDA &bull; {sportCode}
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl text-[var(--text-main)] font-bebas uppercase tracking-wide">
          Jadwal &amp; Skor Pertandingan
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Pembaruan skor langsung babak per babak, hasil pertandingan terverifikasi berita acara juri, dan agenda pertandingan berikutnya.
        </p>
      </div>

      {/* Top Filter Segmented Bar: Sedang Berlangsung | Akan Datang | Selesai */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setStatusFilter('LIVE')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 min-h-[38px] ${
              statusFilter === 'LIVE'
                ? 'bg-red-600 text-white shadow-xs font-bold'
                : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span>Sedang Berlangsung</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('UPCOMING')}
            className={`px-4 py-2 rounded-lg transition-all min-h-[38px] ${
              statusFilter === 'UPCOMING'
                ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-xs font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Akan Datang
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('COMPLETED')}
            className={`px-4 py-2 rounded-lg transition-all min-h-[38px] ${
              statusFilter === 'COMPLETED'
                ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-xs font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Selesai
          </button>
        </div>

        <div className="text-xs text-[var(--text-muted)] flex items-center gap-2 font-medium">
          <Clock className="w-4 h-4 text-[var(--color-arena-primary)]" />
          <span>Zona Waktu: WIB (GMT+7) &bull; {caborMeta.venueCourt}</span>
        </div>
      </div>

      {/* Render Custom Cabor Matches (Voli / Esport) */}
      {isCustomCabor ? (
        filteredCustomMatches.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <p className="text-sm font-bold text-[var(--text-main)]">
              Tidak ada pertandingan pada status ini.
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Silakan klik tab Selesai atau Akan Datang untuk meninjau pertandingan lainnya.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredCustomMatches.map((m) => {
            const isLive = m.status === 'LIVE';
            const isCompleted = m.status === 'COMPLETED';
            return (
              <div
                key={m.id}
                className={`rounded-2xl bg-[var(--bg-surface)] border transition-all overflow-hidden shadow-xs ${
                  isLive
                    ? 'border-red-500/60 ring-2 ring-red-500/10'
                    : 'border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)]/40'
                }`}
              >
                <div className="px-6 py-3 bg-[var(--bg-muted)]/70 border-b border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <div className="flex items-center gap-2.5 font-bold">
                    <span className="text-[var(--text-main)] font-mono">Pertandingan #{m.matchNumber}</span>
                    <span>&bull;</span>
                    <span className="uppercase tracking-wider text-[11px] font-mono">{m.stage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
                      <span>{m.courtName}</span>
                    </span>
                    {isLive && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-barlow font-black uppercase tracking-wider bg-red-600 text-white">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        <span>LIVE NOW</span>
                      </span>
                    )}
                    {isCompleted && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                        ✓ Terverifikasi Resmi
                      </span>
                    )}
                    {m.status === 'UPCOMING' && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-barlow font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                        Akan Datang
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-5 sm:gap-6">
                    <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-3.5 text-left md:text-right">
                      <div>
                        <h4 className="font-barlow font-bold text-lg sm:text-xl text-[var(--text-main)] tracking-wide">
                          {m.teamAName}
                        </h4>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                        <img src={m.teamALogo} alt={m.teamAName} className="w-full h-full object-contain" />
                      </div>
                    </div>

                    <div className="md:col-span-1 flex flex-col items-center justify-center text-center">
                      <div className="flex items-center gap-2 font-teko tabular-nums font-bold text-3xl sm:text-4xl tracking-wide text-[var(--text-main)] leading-none">
                        <span>{m.scoreA}</span>
                        <span className="text-[var(--text-muted)] text-xl font-normal">:</span>
                        <span>{m.scoreB}</span>
                      </div>
                      {m.scoreDetail && (
                        <div className="text-[11px] font-semibold text-[var(--color-arena-primary)] mt-1 font-barlow">
                          {m.scoreDetail}
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-3 flex items-center justify-between md:justify-start gap-3.5 text-left">
                      <div className="w-12 h-12 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-center p-1.5 shrink-0 overflow-hidden order-last md:order-first">
                        <img src={m.teamBLogo} alt={m.teamBName} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h4 className="font-barlow font-bold text-lg sm:text-xl text-[var(--text-main)] tracking-wide">
                          {m.teamBName}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )
      ) : (
        /* Render Futsal Matches */
        filteredMatches.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <p className="text-sm font-bold text-[var(--text-main)]">
              Tidak ada pertandingan pada status ini.
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Silakan klik tab Selesai atau Akan Datang untuk meninjau pertandingan lainnya.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
          {filteredMatches.map((match) => {
            const isLive = match.status === 'LIVE';
            const isCompleted = match.status === 'COMPLETED';
            const isExpanded = expandedMatchId === match.id;

            return (
              <div
                key={match.id}
                className={`rounded-2xl bg-[var(--bg-surface)] border transition-all overflow-hidden shadow-xs ${
                  isLive
                    ? 'border-red-500/60 ring-2 ring-red-500/10'
                    : 'border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)]/40'
                }`}
              >
                <div className="px-6 py-3 bg-[var(--bg-muted)]/70 border-b border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <div className="flex items-center gap-2.5 font-bold">
                    <span className="text-[var(--text-main)] font-mono">Pertandingan #{match.matchNumber}</span>
                    <span>&bull;</span>
                    <span className="uppercase tracking-wider text-[11px] font-mono">
                      {match.stage === 'GROUP' ? `Fase Grup ${match.group}` : 'Babak Perempat Final'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href="https://maps.google.com/?q=MTsN+1+Kota+Malang"
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
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                        ⚠️ Belum Resmi (Menunggu Verifikasi Admin)
                      </span>
                    )}
                    {isCompleted && match.isVerified !== false && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                        ✓ Terverifikasi Resmi
                      </span>
                    )}
                    {match.status === 'UPCOMING' && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-barlow font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                        Akan Datang
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-5 sm:gap-6">
                    <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-3.5 text-left md:text-right">
                      <div className="min-w-0 flex-1 md:flex-initial">
                        <h4 className="font-barlow font-bold text-lg sm:text-xl text-[var(--text-main)] leading-tight tracking-wide truncate md:overflow-visible">
                          {match.teamAName}
                        </h4>
                        <span className="text-xs text-[var(--text-muted)] font-medium block mt-0.5">
                          {match.group ? `Grup ${match.group}` : 'Tim Unggulan'}
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-center p-1.5 shrink-0 shadow-2xs overflow-hidden">
                        {match.teamALogo ? (
                          <img src={match.teamALogo} alt={match.teamAName} className="w-full h-full object-contain" />
                        ) : (
                          <span className="font-barlow font-bold text-xs text-[var(--color-arena-primary)]">
                            {match.teamAName.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-1 flex flex-col items-center justify-center text-center">
                      {match.status === 'UPCOMING' ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="px-3 py-1 rounded-lg bg-[var(--bg-muted)] text-[var(--text-main)] font-mono font-bold text-xs border border-[var(--border-subtle)]">
                            {match.scheduledTime.split(',')[1]?.trim() || match.scheduledTime}
                          </span>
                          <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-bebas">
                            VS
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-3 font-teko tabular-nums font-bold text-3xl sm:text-4xl tracking-wide text-[var(--text-main)] leading-none">
                            <span className={match.scoreA > match.scoreB ? 'text-[var(--color-arena-primary)]' : ''}>
                              {match.scoreA}
                            </span>
                            <span className="text-[var(--text-muted)] text-xl font-normal">:</span>
                            <span className={match.scoreB > match.scoreA ? 'text-[var(--color-arena-primary)]' : ''}>
                              {match.scoreB}
                            </span>
                          </div>
                          <span className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">
                            {isLive ? 'Babak Ke-2' : 'Skor Akhir'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-3 flex items-center justify-between md:justify-start gap-3.5 text-left">
                      <div className="w-12 h-12 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-center p-1.5 shrink-0 shadow-2xs overflow-hidden order-last md:order-first">
                        {match.teamBLogo ? (
                          <img src={match.teamBLogo} alt={match.teamBName} className="w-full h-full object-contain" />
                        ) : (
                          <span className="font-barlow font-bold text-xs text-[var(--color-arena-primary)]">
                            {match.teamBName.split(' ')[0]}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 md:flex-initial">
                        <h4 className="font-barlow font-bold text-lg sm:text-xl text-[var(--text-main)] leading-tight tracking-wide truncate md:overflow-visible">
                          {match.teamBName}
                        </h4>
                        <span className="text-xs text-[var(--text-muted)] font-medium block mt-0.5">
                          {match.group ? `Grup ${match.group}` : 'Kuda Hitam'}
                        </span>
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
        )
      )}
    </div>
  );
};
