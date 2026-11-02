'use client';

import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { Match } from '@/types';

interface PublicMatchCardProps {
  match: Match;
  isCompleted: boolean;
  isLive: boolean;
  time: string;
  code: string;
}

const isPlaceholderTeam = (name: string, stage?: string) => {
  if (!name) return true;
  const upper = name.trim().toUpperCase();
  return (
    upper.startsWith('JUARA') ||
    upper.startsWith('PEMENANG') ||
    upper.startsWith('P15') ||
    upper.startsWith('P16') ||
    upper.startsWith('P17') ||
    upper.startsWith('TBD') ||
    upper.startsWith('MENUNGGU') ||
    (stage !== 'GROUP' && (upper.includes('GRUP') || upper.includes('SEMIFINAL')))
  );
};

const cleanTeamName = (name?: string | null) => {
  if (!name) return '';
  if (name.includes('KARDINA MASSA')) return 'SDI KARDINA MASSA';
  if (name.includes('MIN 14 BLITAR')) return 'MIN 14 BLITAR';
  return name;
};

export const PublicMatchCard: React.FC<PublicMatchCardProps> = ({
  match,
  isCompleted,
  isLive,
  time,
  code,
}) => {
  const isFinalMatch = match.stage === 'FINAL' || match.matchNumber === 17;
  const rawTeamAName =
    isFinalMatch && (match.teamAName === 'P15' || match.teamAName.includes('15') || !match.teamAName)
      ? 'JUARA SEMIFINAL 1'
      : match.teamAName;
  const rawTeamBName =
    isFinalMatch && (match.teamBName === 'P16' || match.teamBName.includes('16') || !match.teamBName)
      ? 'JUARA SEMIFINAL 2'
      : match.teamBName;

  const teamAName = cleanTeamName(rawTeamAName);
  const teamBName = cleanTeamName(rawTeamBName);

  const isTeamAPlaceholder = isPlaceholderTeam(teamAName, match.stage);
  const isTeamBPlaceholder = isPlaceholderTeam(teamBName, match.stage);

  const showLogoA = !isTeamAPlaceholder && Boolean(match.teamALogo);
  const showLogoB = !isTeamBPlaceholder && Boolean(match.teamBLogo);

  return (
    <div
      className={`rounded-xl bg-[var(--bg-surface)] border-2 transition-all overflow-hidden shadow-sm ${
        isLive
          ? 'border-red-500/80 ring-2 ring-red-500/15'
          : 'border-slate-300 dark:border-slate-800 hover:border-[#1D63B8]/60'
      }`}
    >
      {/* Header Bar */}
      <div className="px-4 sm:px-6 py-2.5 bg-[var(--bg-muted)]/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-2 font-bold flex-wrap">
          <span className="text-[var(--text-main)] font-mono text-xs sm:text-sm">
            Pertandingan #{match.matchNumber}
          </span>
          <span>&bull;</span>
          <span className="text-xs font-mono font-bold text-[var(--color-arena-primary)] dark:text-sky-400">
            {time}
          </span>
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
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-[10px] font-barlow font-bold uppercase tracking-wider bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
              ⚠️ Belum Resmi
            </span>
          )}
          {isCompleted && match.isVerified !== false && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-[10px] font-barlow font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              ✓ Terverifikasi Resmi
            </span>
          )}
          {!isLive && !isCompleted && (
            <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-barlow font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              Akan Datang
            </span>
          )}
        </div>
      </div>

      {/* Main Row */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          {/* TIM A */}
          <div className="flex-1 w-full md:w-auto flex items-center justify-between md:justify-end gap-3 sm:gap-4 text-left md:text-right">
            <div className="min-w-0 flex-1 md:flex-initial">
              <h4 className="font-barlow font-bold text-lg sm:text-xl text-[var(--text-main)] leading-tight tracking-wide">
                {teamAName}
              </h4>
              <div className="mt-1 flex items-center md:justify-end">
                <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-barlow font-bold uppercase tracking-wider bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800">
                  {match.group ? `Fase Grup ${match.group}` : match.stage === 'FINAL' ? 'Grand Final' : 'Babak 4 Besar'}
                </span>
              </div>
            </div>
            {showLogoA ? (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[var(--bg-muted)] border border-slate-300 dark:border-slate-700 flex items-center justify-center p-1.5 shrink-0 shadow-2xs overflow-hidden">
                <img src={match.teamALogo} alt={teamAName} className="w-full h-full object-contain" />
              </div>
            ) : !isTeamAPlaceholder ? (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[var(--bg-muted)] border border-slate-300 dark:border-slate-700 flex items-center justify-center p-1.5 shrink-0 shadow-2xs overflow-hidden">
                <span className="font-barlow font-bold text-base text-[#1D63B8]">
                  {teamAName.split(' ')[0]}
                </span>
              </div>
            ) : null}
          </div>

          {/* AREA TENGAH: WAKTU & VS / SKOR */}
          <div className="shrink-0 flex flex-col items-center justify-center text-center">
            {isCompleted || isLive ? (
              <div className="flex flex-col items-center justify-center gap-1 px-5 py-2 rounded-lg bg-[var(--bg-muted)] border border-slate-300 dark:border-slate-700 shadow-xs min-w-[150px]">
                <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {isLive ? 'Skor Sementara' : 'Skor Akhir'}
                </span>
                <div className="text-3xl sm:text-4xl font-teko font-bold text-[var(--color-arena-accent)] tabular-nums leading-none">
                  {match.scoreA} - {match.scoreB}
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {code} &bull; {match.timeDisplay || (isLive ? 'Sedang Berlangsung' : 'Selesai')}
                </span>
              </div>
            ) : (
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
            )}
          </div>

          {/* TIM B */}
          <div className="flex-1 w-full md:w-auto flex items-center justify-between md:justify-start gap-3 sm:gap-4 text-right md:text-left">
            {showLogoB ? (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[var(--bg-muted)] border border-slate-300 dark:border-slate-700 flex items-center justify-center p-1.5 shrink-0 shadow-2xs overflow-hidden order-2 md:order-1">
                <img src={match.teamBLogo} alt={teamBName} className="w-full h-full object-contain" />
              </div>
            ) : !isTeamBPlaceholder ? (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[var(--bg-muted)] border border-slate-300 dark:border-slate-700 flex items-center justify-center p-1.5 shrink-0 shadow-2xs overflow-hidden order-2 md:order-1">
                <span className="font-barlow font-bold text-base text-[var(--color-arena-accent)]">
                  {teamBName.split(' ')[0]}
                </span>
              </div>
            ) : null}
            <div className="min-w-0 flex-1 md:flex-initial order-1 md:order-2">
              <h4 className="font-barlow font-bold text-lg sm:text-xl text-[var(--text-main)] leading-tight tracking-wide">
                {teamBName}
              </h4>
              <div className="mt-1 flex items-center md:justify-start">
                <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-barlow font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {match.group ? `Fase Grup ${match.group}` : match.stage === 'FINAL' ? 'Grand Final' : 'Babak 4 Besar'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

