'use client';

import React from 'react';
import { Radio, Maximize, Minimize } from 'lucide-react';
import { Match } from '@/types';

interface LiveMatchHeaderProps {
  match: Match;
  scoreA: number;
  scoreB: number;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const LiveMatchHeader: React.FC<LiveMatchHeaderProps> = ({
  match,
  scoreA,
  scoreB,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)] transition-colors duration-150 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-[10px] font-barlow font-bold uppercase tracking-wider">
              <Radio className="w-3 h-3 text-red-500 animate-pulse" />
              <span>Siaran Langsung &bull; Live Match</span>
            </span>
            <span className="text-xs font-mono font-bold text-[var(--text-main)] px-2.5 py-0.5 rounded-md bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
              Laga #{match.matchNumber} &bull; {match.courtName || 'Lapangan Utama (Vinyl)'} &bull; {match.stage || 'GROUP'}
            </span>
          </div>

          <h1 className="font-bebas text-2xl sm:text-3xl uppercase tracking-wide text-[var(--text-main)] leading-none">
            {match.teamAName} <span className="text-[var(--color-arena-accent)] text-xl sm:text-2xl">VS</span> {match.teamBName}
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-sans">
            Pantauan papan skor pertandingan, jalannya waktu, dan perolehan skor secara langsung dan real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="btn-tactile px-3 py-2 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--bg-surface)] active:scale-95 text-[var(--text-main)] border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Buka Tampilan Layar Penuh (Jumbotron / TV)'}
            >
              {isFullscreen ? (
                <>
                  <Minimize className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Keluar Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize className="w-3.5 h-3.5 text-[var(--color-arena-accent)]" />
                  <span>Layar Penuh</span>
                </>
              )}
            </button>
          )}

          <div className="px-4 py-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-center min-w-[100px]">
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              Skor Saat Ini
            </span>
            <span className="font-scoreboard font-bold text-2xl sm:text-3xl text-[var(--color-arena-accent)] tabular-nums leading-none">
              {scoreA} - {scoreB}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
