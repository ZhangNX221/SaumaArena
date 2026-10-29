'use client';

import React from 'react';
import { Clock, Maximize, Minimize } from 'lucide-react';
import { Match } from '@/types';

interface LiveMatchScoreboardProps {
  match: Match;
  scoreA: number;
  scoreB: number;
  timerSeconds: number;
  isTimerRunning: boolean;
  currentPeriod: string;
  foulsA: number;
  foulsB: number;
  timeoutsA: number;
  timeoutsB: number;
  yellowCardsA?: number;
  redCardsA?: number;
  yellowCardsB?: number;
  redCardsB?: number;
  formatTime: (secs: number) => string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const LiveMatchScoreboard: React.FC<LiveMatchScoreboardProps> = ({
  match,
  scoreA,
  scoreB,
  timerSeconds,
  isTimerRunning,
  currentPeriod,
  foulsA,
  foulsB,
  timeoutsA,
  timeoutsB,
  yellowCardsA = 0,
  redCardsA = 0,
  yellowCardsB = 0,
  redCardsB = 0,
  formatTime,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const renderFoulDots = (count: number) =>
    [1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border transition-all ${
          i <= count
            ? count >= 5
              ? 'bg-red-500 border-red-400 shadow-xs ring-1 ring-red-400/50'
              : 'bg-amber-500 border-amber-400 dark:bg-amber-400 dark:border-amber-300 shadow-2xs'
            : 'bg-slate-200 dark:bg-slate-700/60 border-slate-300 dark:border-slate-600'
        }`}
      />
    ));

  return (
    <div
      className={`rounded-2xl bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)] p-4 sm:p-6 shadow-sm space-y-4 animate-fadeIn transition-colors duration-150 ${
        isFullscreen ? 'p-6 sm:p-8' : ''
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between text-xs pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bebas text-base sm:text-xl uppercase tracking-wider text-[var(--text-main)] leading-none">
            Papan Skor &amp; Stopwatch Lapangan
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-md bg-[var(--bg-muted)] text-[var(--color-arena-accent)] font-barlow font-bold uppercase tracking-wider text-xs border border-[var(--border-subtle)]">
            {currentPeriod}
          </span>

          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="btn-tactile px-2.5 py-1 rounded-md bg-[var(--bg-muted)] hover:bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)] font-barlow font-bold uppercase text-[11px] flex items-center gap-1.5 transition-colors shadow-2xs"
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Buka Layar Penuh (Fullscreen)'}
            >
              {isFullscreen ? (
                <>
                  <Minimize className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Keluar Layar Penuh</span>
                </>
              ) : (
                <>
                  <Maximize className="w-3.5 h-3.5 text-[var(--color-arena-accent)]" />
                  <span>Layar Penuh</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 3 Kolom Papan Skor Utama: Tim A, Timer Pusat, Tim B */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
        {/* TIM A (Kiri) */}
        <div className="md:col-span-4 lg:col-span-4 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] p-4 flex flex-col justify-between space-y-3 transition-colors">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-bebas text-2xl sm:text-3xl text-[var(--text-main)] uppercase tracking-wide truncate leading-tight">
              {match.teamAName}
            </h2>
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
              Tim A
            </span>
          </div>

          {/* Kotak Skor Tim A (Disesuaikan Lebih Ramping & Proporsional) */}
          <div className="flex items-center justify-center bg-[var(--bg-surface)] dark:bg-[var(--bg-page)]/80 py-2.5 px-4 rounded-xl border border-[var(--border-subtle)] shadow-xs transition-colors">
            <div className="text-5xl sm:text-6xl lg:text-6xl font-scoreboard font-bold text-[var(--color-arena-accent)] tabular-nums leading-none drop-shadow-sm">
              {scoreA}
            </div>
          </div>

          {/* Indikator Foul, Kartu & Timeout Tim A */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-barlow font-bold uppercase text-[var(--text-muted)]">
                Foul {foulsA}/5:
              </span>
              <div className="flex items-center gap-1">{renderFoulDots(foulsA)}</div>
            </div>

            {/* Indikator Kartu Tim A */}
            <div className="flex items-center gap-1" title="Kartu Laga Ini: Kuning & Merah">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
                <span className="w-2 h-2.5 bg-amber-400 rounded-2xs inline-block shadow-2xs" />
                <span>{yellowCardsA}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-[10px] font-mono font-bold text-red-700 dark:text-red-400">
                <span className="w-2 h-2.5 bg-red-500 rounded-2xs inline-block shadow-2xs" />
                <span>{redCardsA}</span>
              </span>
            </div>

            <div className="text-[10px] font-barlow font-bold uppercase px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/25 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>TO ({timeoutsA})</span>
            </div>
          </div>
        </div>

        {/* TIMER PUSAT (Tengah - Dibuat Lebih Besar & Menonjol) */}
        <div className="md:col-span-4 lg:col-span-4 rounded-xl bg-gradient-to-b from-[var(--bg-muted)]/80 to-[var(--bg-muted)]/40 border border-[var(--border-subtle)] p-4 flex flex-col items-center justify-center text-center space-y-3 transition-colors shadow-xs">
          <span className="text-[11px] font-barlow font-extrabold uppercase tracking-widest text-[var(--color-arena-primary)] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[var(--color-arena-accent)]" />
            <span>Waktu Pertandingan</span>
          </span>

          {/* Kotak Timer Stadion Berukuran Besar */}
          <div className="p-3 sm:p-4 rounded-2xl bg-[var(--bg-surface)] dark:bg-black/35 border border-[var(--border-subtle)] shadow-inner w-full flex items-center justify-center">
            <div className="font-scoreboard font-black text-5xl sm:text-6xl lg:text-7xl text-[var(--text-main)] tracking-widest tabular-nums leading-none drop-shadow-sm">
              {formatTime(timerSeconds)}
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-barlow font-bold uppercase tracking-wider">
            <span className={`w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 ${isTimerRunning ? 'animate-ping' : ''}`} />
            <span>{isTimerRunning ? 'Pertandingan Berjalan' : 'Waktu Berhenti'}</span>
          </div>

          <span className="text-[11px] text-[var(--text-muted)] font-mono font-semibold">
            {currentPeriod}
          </span>
        </div>

        {/* TIM B (Kanan) */}
        <div className="md:col-span-4 lg:col-span-4 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] p-4 flex flex-col justify-between space-y-3 transition-colors">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
              Tim B
            </span>
            <h2 className="font-bebas text-2xl sm:text-3xl text-[var(--text-main)] uppercase tracking-wide truncate leading-tight text-right">
              {match.teamBName}
            </h2>
          </div>

          {/* Kotak Skor Tim B (Disesuaikan Lebih Ramping & Proporsional) */}
          <div className="flex items-center justify-center bg-[var(--bg-surface)] dark:bg-[var(--bg-page)]/80 py-2.5 px-4 rounded-xl border border-[var(--border-subtle)] shadow-xs transition-colors">
            <div className="text-5xl sm:text-6xl lg:text-6xl font-scoreboard font-bold text-[var(--color-arena-accent)] tabular-nums leading-none drop-shadow-sm">
              {scoreB}
            </div>
          </div>

          {/* Indikator Timeout, Kartu & Foul Tim B */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
            <div className="text-[10px] font-barlow font-bold uppercase px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/25 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>TO ({timeoutsB})</span>
            </div>

            {/* Indikator Kartu Tim B */}
            <div className="flex items-center gap-1" title="Kartu Laga Ini: Kuning & Merah">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
                <span className="w-2 h-2.5 bg-amber-400 rounded-2xs inline-block shadow-2xs" />
                <span>{yellowCardsB}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-[10px] font-mono font-bold text-red-700 dark:text-red-400">
                <span className="w-2 h-2.5 bg-red-500 rounded-2xs inline-block shadow-2xs" />
                <span>{redCardsB}</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1">{renderFoulDots(foulsB)}</div>
              <span className="text-[11px] font-barlow font-bold uppercase text-[var(--text-muted)]">
                :Foul {foulsB}/5
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
