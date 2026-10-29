'use client';

import React from 'react';
import { Radio, Clock, CheckCircle2 } from 'lucide-react';
import { Match } from '@/types';

interface LiveMatchHeaderProps {
  match: Match;
  scoreA: number;
  scoreB: number;
}

export const LiveMatchHeader: React.FC<LiveMatchHeaderProps> = ({
  match,
  scoreA,
  scoreB,
}) => {
  const isMatchLive = match.status === 'LIVE';
  const isMatchCompleted = match.status === 'COMPLETED';

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)] transition-colors duration-150 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Column: Status Badge, Match Meta Chip, Title, Subtitle */}
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {isMatchLive ? (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-[10px] font-barlow font-bold uppercase tracking-wider">
                <Radio className="w-3 h-3 text-red-500 animate-pulse shrink-0" />
                <span>Siaran Langsung &bull; Live Match</span>
              </span>
            ) : isMatchCompleted ? (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[10px] font-barlow font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Pertandingan Selesai &bull; Skor Akhir</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-[10px] font-barlow font-bold uppercase tracking-wider">
                <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                <span>Belum Dimulai &bull; Menunggu Kick-Off</span>
              </span>
            )}

            <span className="text-xs font-mono font-bold text-[var(--text-main)] px-2.5 py-0.5 rounded-md bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
              Laga #{match.matchNumber} &bull; {match.courtName || 'Lapangan Utama (Vinyl)'} &bull; {match.stage || 'GROUP'}
            </span>
          </div>

          <h1 className="font-bebas text-2xl sm:text-3xl uppercase tracking-wide text-[var(--text-main)] leading-none truncate">
            {match.teamAName} <span className="text-[var(--color-arena-accent)] text-xl sm:text-2xl">VS</span> {match.teamBName}
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-sans">
            {isMatchLive
              ? 'Pantauan papan skor pertandingan, jalannya waktu, dan perolehan skor secara langsung dan real-time.'
              : isMatchCompleted
              ? 'Laga telah selesai dan Berita Acara Pertandingan (BAP) telah diverifikasi meja wasit.'
              : 'Pertandingan belum dimulai. Papan skor akan otomatis aktif dan berjalan begitu juri meja lapangan memulai pertandingan.'}
          </p>
        </div>

        {/* Right Column: Skor Saat Ini Box */}
        <div className="shrink-0 self-start sm:self-center">
          <div className="px-5 py-2.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-center min-w-[100px] flex flex-col justify-center">
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block leading-tight">
              {isMatchCompleted ? 'Skor Akhir' : 'Skor Saat Ini'}
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
