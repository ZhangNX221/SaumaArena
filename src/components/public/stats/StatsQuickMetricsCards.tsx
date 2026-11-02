'use client';

import React from 'react';
import { Flame, Zap } from 'lucide-react';

interface StatsQuickMetricsCardsProps {
  totalGoals: number;
  avgGoals: string;
  completedMatches: number;
  totalMatches: number;
  totalYellowCards: number;
  totalRedCards: number;
  avgCards: string;
}

export const StatsQuickMetricsCards: React.FC<StatsQuickMetricsCardsProps> = ({
  totalGoals,
  avgGoals,
  completedMatches,
  totalMatches,
  totalYellowCards,
  totalRedCards,
  avgCards,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Gol */}
      <div className="p-4 rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-[var(--text-muted)]">
          <span className="text-[11px] font-barlow font-bold uppercase tracking-wider">Total Gol Tercipta</span>
          <Flame className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-3xl sm:text-4xl font-teko font-bold text-[#1D63B8] dark:text-sky-400 mt-1 leading-none tracking-wide">
          {totalGoals}
        </div>
        <span className="text-[10px] text-[var(--text-muted)] font-mono">{avgGoals} Gol per Laga</span>
      </div>

      {/* 2. Laga Selesai */}
      <div className="p-4 rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-[var(--text-muted)]">
          <span className="text-[11px] font-barlow font-bold uppercase tracking-wider">Laga Selesai</span>
          <Zap className="w-4 h-4 text-[#1D63B8] dark:text-sky-400" />
        </div>
        <div className="text-3xl sm:text-4xl font-teko font-bold text-[var(--text-main)] mt-1 leading-none tracking-wide">
          {completedMatches} / {totalMatches}
        </div>
        <span className="text-[10px] text-[var(--text-muted)] font-mono">
          {completedMatches === 0 ? 'Menunggu Kickoff Hari-1' : `${completedMatches} Pertandingan Resmi`}
        </span>
      </div>

      {/* 3. Kartu Kuning */}
      <div className="p-4 rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-[var(--text-muted)]">
          <span className="text-[11px] font-barlow font-bold uppercase tracking-wider">Kartu Kuning</span>
          <div className="w-3.5 h-4 bg-amber-400 rounded-2xs shadow-xs" />
        </div>
        <div className="text-3xl sm:text-4xl font-teko font-bold text-amber-600 mt-1 leading-none tracking-wide">
          {totalYellowCards}
        </div>
        <span className="text-[10px] text-[var(--text-muted)] font-mono">{avgCards} Kartu per Laga</span>
      </div>

      {/* 4. Kartu Merah */}
      <div className="p-4 rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-[var(--text-muted)]">
          <span className="text-[11px] font-barlow font-bold uppercase tracking-wider">Kartu Merah</span>
          <div className="w-3.5 h-4 bg-red-500 rounded-2xs shadow-xs" />
        </div>
        <div className="text-3xl sm:text-4xl font-teko font-bold text-red-600 mt-1 leading-none tracking-wide">
          {totalRedCards}
        </div>
        <span className="text-[10px] text-[var(--text-muted)] font-mono">
          {totalRedCards === 0 ? 'Fair Play Terkendali' : `${totalRedCards} Kartu Dikeluarkan`}
        </span>
      </div>
    </div>
  );
};

