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
    <div className="space-y-8 animate-fadeIn pb-6">
      {/* Public Page Header */}
      <PublicPageHeader
        icon={BarChart3}
        category="INFOGRAFIS & ANALISIS PERTANDINGAN • FUTSAL"
        title="Statistik & Performa Turnamen Futsal"
        description="Visualisasi data terstruktur perolehan gol tim, indeks sportivitas, serta peringkat performa individu atlet."
      />
          {/* Quick Stat Pill Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span className="text-[11px] font-barlow font-bold uppercase tracking-wider">Total Gol Tercipta</span>
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl sm:text-4xl font-teko font-bold text-[var(--text-main)] mt-1 leading-none tracking-wide">0</div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">0.00 Gol per Laga</span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span className="text-[11px] font-barlow font-bold uppercase tracking-wider">Laga Selesai</span>
                <Zap className="w-4 h-4 text-[var(--color-arena-primary)]" />
              </div>
              <div className="text-3xl sm:text-4xl font-teko font-bold text-[var(--text-main)] mt-1 leading-none tracking-wide">0 / 17</div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Menunggu Kickoff Hari-1</span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span className="text-[11px] font-barlow font-bold uppercase tracking-wider">Kartu Kuning</span>
                <div className="w-3.5 h-4 bg-amber-400 rounded-xs" />
              </div>
              <div className="text-3xl sm:text-4xl font-teko font-bold text-amber-600 mt-1 leading-none tracking-wide">0</div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">0.00 Kartu per Laga</span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span className="text-[11px] font-barlow font-bold uppercase tracking-wider">Kartu Merah</span>
                <div className="w-3.5 h-4 bg-red-500 rounded-xs" />
              </div>
              <div className="text-3xl sm:text-4xl font-teko font-bold text-red-600 mt-1 leading-none tracking-wide">0</div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Fair Play Terkendali</span>
            </div>
          </div>

          {/* Section 1: Charts (Side-by-Side on Desktop) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div className="h-full">
              <TeamGoalsBarChart />
            </div>
            <div className="h-full">
              <DisciplineFairPlayChart />
            </div>
          </div>

          {/* Section 2: Top Scorers (Piala Sepatu Emas) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h4 className="font-extrabold text-sm sm:text-base text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
                  Peringkat Top Scorer Turnamen
                </h4>
              </div>
              <span className="text-xs text-[var(--text-muted)] font-mono font-bold">Piala Sepatu Emas</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {topScorers.map((player, idx) => (
                <div
                  key={player.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 transition-all ${
                    idx === 0
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-[var(--bg-muted)]/50 border-[var(--border-subtle)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono tabular-nums font-black text-xs px-2 py-0.5 rounded-md ${
                        idx === 0
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <span className="font-teko font-bold text-2xl text-[var(--color-arena-primary)] leading-none">
                      {player.goals} <span className="text-xs font-sans text-[var(--text-muted)] font-normal">Gol</span>
                    </span>
                  </div>
                  <div>
                    <div className="font-barlow font-bold text-sm text-[var(--text-main)] truncate" title={player.name}>
                      {player.name}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] font-barlow truncate" title={player.teamName}>
                      {player.teamName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Informasi Akumulasi Kartu Seluruh Tim */}
          <LiveMatchTeamCardsSummary />
    </div>
  );
};
