'use client';

import React from 'react';
import { Target, AlertTriangle, ShieldAlert, Users, Award } from 'lucide-react';

interface PerformanceStatCardsProps {
  totalGoals: number;
  totalYellowCards: number;
  totalRedCards: number;
  totalAthletes: number;
  topScorer?: { name: string; goals: number; teamName: string } | null;
}

export const PerformanceStatCards: React.FC<PerformanceStatCardsProps> = ({
  totalGoals,
  totalYellowCards,
  totalRedCards,
  totalAthletes,
  topScorer,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Gol */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-surface)] border border-emerald-500/20 shadow-xs relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-barlow font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Total Gol Tercatat
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-teko font-bold text-[var(--text-main)] leading-none">
            {totalGoals}
          </span>
          <span className="text-xs text-[var(--text-muted)] font-medium">Gol Sah</span>
        </div>
        {topScorer && topScorer.goals > 0 && (
          <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] truncate">
            <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-semibold text-[var(--text-main)] truncate">{topScorer.name}</span>
            <span className="text-emerald-600 font-bold">({topScorer.goals})</span>
          </div>
        )}
      </div>

      {/* 2. Total Kartu Kuning */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-surface)] border border-amber-500/20 shadow-xs relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-barlow font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Kartu Kuning (KK)
          </span>
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-teko font-bold text-amber-500 leading-none">
            {totalYellowCards}
          </span>
          <span className="text-xs text-[var(--text-muted)] font-medium">Peringatan</span>
        </div>
        <p className="mt-2 text-[10px] text-[var(--text-muted)]">2 Kartu Kuning = 1 Laga Larangan Bermain</p>
      </div>

      {/* 3. Total Kartu Merah */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-surface)] border border-rose-500/20 shadow-xs relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-all pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-barlow font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Kartu Merah (KM)
          </span>
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-teko font-bold text-rose-600 leading-none">
            {totalRedCards}
          </span>
          <span className="text-xs text-[var(--text-muted)] font-medium">Pengusiran</span>
        </div>
        <p className="mt-2 text-[10px] text-[var(--text-muted)]">Kartu Merah langsung = Dikeluarkan dari arena</p>
      </div>

      {/* 4. Total Atlet Terdaftar */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Total Atlet Master
          </span>
          <div className="w-7 h-7 rounded-lg bg-[var(--bg-muted)] flex items-center justify-center text-[var(--text-muted)]">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-teko font-bold text-[var(--text-main)] leading-none">
            {totalAthletes}
          </span>
          <span className="text-xs text-[var(--text-muted)] font-medium">Dari 14 Kontingen</span>
        </div>
        <p className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
          Tersinkron dengan Database Admin
        </p>
      </div>
    </div>
  );
};

