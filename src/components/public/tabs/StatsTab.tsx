'use client';

import React from 'react';
import {
  Trophy,
  BarChart3,
  Flame,
  Zap,
} from 'lucide-react';
import { initialTeams } from '@/mocks/tournamentData';
import { TeamGoalsBarChart } from '../stats/TeamGoalsBarChart';
import { DisciplineFairPlayChart } from '../stats/DisciplineFairPlayChart';
import { LiveMatchTeamCardsSummary } from './live/LiveMatchTeamCardsSummary';
import { SportCode } from '@/types';
import { PublicPageHeader } from '../layout/PublicPageHeader';

interface StatsTabProps {
  sportCode?: SportCode;
}

export const StatsTab: React.FC<StatsTabProps> = ({ sportCode = 'FUTSAL' }) => {
  // Ambil seluruh pemain Futsal
  const allPlayers = initialTeams.flatMap((t) =>
    t.players.map((p) => ({
      ...p,
      teamName: t.name,
      schoolName: t.schoolName,
      logoUrl: t.logoUrl,
    }))
  );

  const topScorers = [...allPlayers].sort((a, b) => b.goals - a.goals).slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-6">
      {/* Public Page Header */}
      <PublicPageHeader
        icon={BarChart3}
        category="INFOGRAFIS & ANALISIS PERTANDINGAN • FUTSAL"
        title="Statistik & Performa Turnamen Futsal"
        description="Visualisasi data terstruktur perolehan gol tim, indeks sportivitas, serta peringkat performa individu atlet."
      />

      {/* Quick Stat Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-barlow font-bold uppercase tracking-wider">Total Gol Tercipta</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-teko font-bold text-[#1D63B8] dark:text-sky-400 mt-1 leading-none tracking-wide">0</div>
          <span className="text-[10px] text-[var(--text-muted)] font-mono">0.00 Gol per Laga</span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-barlow font-bold uppercase tracking-wider">Laga Selesai</span>
            <Zap className="w-4 h-4 text-[#1D63B8] dark:text-sky-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-teko font-bold text-[var(--text-main)] mt-1 leading-none tracking-wide">0 / 17</div>
          <span className="text-[10px] text-[var(--text-muted)] font-mono">Menunggu Kickoff Hari-1</span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-barlow font-bold uppercase tracking-wider">Kartu Kuning</span>
            <div className="w-3.5 h-4 bg-amber-400 rounded-2xs" />
          </div>
          <div className="text-3xl sm:text-4xl font-teko font-bold text-amber-600 mt-1 leading-none tracking-wide">0</div>
          <span className="text-[10px] text-[var(--text-muted)] font-mono">0.00 Kartu per Laga</span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-barlow font-bold uppercase tracking-wider">Kartu Merah</span>
            <div className="w-3.5 h-4 bg-red-500 rounded-2xs" />
          </div>
          <div className="text-3xl sm:text-4xl font-teko font-bold text-red-600 mt-1 leading-none tracking-wide">0</div>
          <span className="text-[10px] text-[var(--text-muted)] font-mono">Fair Play Terkendali</span>
        </div>
      </div>

      {/* Section 1: Charts (Side-by-Side on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="h-full rounded-xl border-2 border-slate-300 dark:border-slate-800 bg-[var(--bg-surface)] overflow-hidden shadow-sm p-4 sm:p-5">
          <TeamGoalsBarChart />
        </div>
        <div className="h-full rounded-xl border-2 border-slate-300 dark:border-slate-800 bg-[var(--bg-surface)] overflow-hidden shadow-sm p-4 sm:p-5">
          <DisciplineFairPlayChart />
        </div>
      </div>

      {/* Section 2: Top Scorers (Piala Sepatu Emas) */}
      <div className="p-5 sm:p-6 rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h4 className="font-bebas text-lg sm:text-xl text-[var(--text-main)] uppercase tracking-wide">
              Peringkat Top Scorer Turnamen &bull; Sepatu Emas
            </h4>
          </div>
          <span className="text-xs font-mono text-[var(--text-muted)]">Top 5 Pencetak Gol</span>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {topScorers.map((player, idx) => (
            <div key={player.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-7 h-7 rounded-lg font-mono font-black text-xs flex items-center justify-center shrink-0 ${
                    idx === 0
                      ? 'bg-[var(--color-arena-accent)] text-slate-950 shadow-xs'
                      : idx === 1
                      ? 'bg-slate-200 dark:bg-slate-700 text-[var(--text-main)]'
                      : idx === 2
                      ? 'bg-amber-700/20 text-amber-800 dark:text-amber-300'
                      : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
                  }`}
                >
                  {idx + 1}
                </span>

                <div className="min-w-0">
                  <span className="font-barlow font-bold text-sm text-[var(--text-main)] block truncate">
                    {player.name}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] block truncate font-sans">
                    {player.teamName} &bull; {player.schoolName}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-teko font-bold text-2xl text-[#1D63B8] dark:text-sky-400 tabular-nums leading-none block">
                  {player.goals}
                </span>
                <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Gol
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
