'use client';

import React, { useEffect } from 'react';
import {
  Trophy,
  BarChart3,
  Flame,
  Zap,
  ShieldCheck,
  PieChart,
  SlidersHorizontal,
} from 'lucide-react';
import { initialTeams } from '@/mocks/tournamentData';
import { TeamGoalsBarChart } from '../stats/TeamGoalsBarChart';
import { DisciplineFairPlayChart } from '../stats/DisciplineFairPlayChart';
import { SportCode, PublicStatsDisplayConfig, STORAGE_KEY_STATS_CONFIG, DEFAULT_PUBLIC_STATS_CONFIG } from '@/types';
import { PublicPageHeader } from '../layout/PublicPageHeader';
import { usePersistentState } from '@/hooks/usePersistentState';

interface StatsTabProps {
  sportCode?: SportCode;
}

export const StatsTab: React.FC<StatsTabProps> = ({ sportCode = 'FUTSAL' }) => {
  const [statsConfig, setStatsConfig] = usePersistentState<PublicStatsDisplayConfig>(
    STORAGE_KEY_STATS_CONFIG,
    DEFAULT_PUBLIC_STATS_CONFIG
  );

  useEffect(() => {
    fetch('/api/settings?sport=futsal')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.statsConfig) {
          setStatsConfig(json.data.statsConfig);
        }
      })
      .catch(() => {});
  }, [setStatsConfig]);

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

  const hasAnyActiveCard =
    statsConfig.showQuickMetrics ||
    statsConfig.showTeamGoalsChart ||
    statsConfig.showDisciplineChart ||
    statsConfig.showTopScorers ||
    statsConfig.showCleanSheet ||
    statsConfig.showGoalDistribution;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-6">
      {/* Public Page Header */}
      <PublicPageHeader
        icon={BarChart3}
        category="INFOGRAFIS & ANALISIS PERTANDINGAN • FUTSAL"
        title="Statistik & Performa Turnamen Futsal"
        description="Visualisasi data terstruktur perolehan gol tim, indeks sportivitas, serta peringkat performa individu atlet."
      />

      {!hasAnyActiveCard && (
        <div className="p-8 rounded-2xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h4 className="font-bebas text-xl text-[var(--text-main)] uppercase tracking-wide">
            Modul Grafik Sedang Dinonaktifkan
          </h4>
          <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
            Seluruh card grafik statistik saat ini dinonaktifkan oleh administrator turnamen melalui menu Pengaturan Publik.
          </p>
        </div>
      )}

      {/* 1. Quick Stat Metric Cards */}
      {statsConfig.showQuickMetrics && (
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
      )}

      {/* 2. Charts (Side-by-Side or Full width) */}
      {(statsConfig.showTeamGoalsChart || statsConfig.showDisciplineChart) && (
        <div className={`grid grid-cols-1 ${statsConfig.showTeamGoalsChart && statsConfig.showDisciplineChart ? 'lg:grid-cols-2' : ''} gap-6 items-stretch`}>
          {statsConfig.showTeamGoalsChart && (
            <div className="h-full rounded-xl border-2 border-slate-300 dark:border-slate-800 bg-[var(--bg-surface)] overflow-hidden shadow-sm p-4 sm:p-5">
              <TeamGoalsBarChart />
            </div>
          )}
          {statsConfig.showDisciplineChart && (
            <div className="h-full rounded-xl border-2 border-slate-300 dark:border-slate-800 bg-[var(--bg-surface)] overflow-hidden shadow-sm p-4 sm:p-5">
              <DisciplineFairPlayChart />
            </div>
          )}
        </div>
      )}

      {/* 3. Top Scorers (Piala Sepatu Emas) */}
      {statsConfig.showTopScorers && (
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
      )}

      {/* 4. Rekap Pertahanan Terbaik & Clean Sheet */}
      {statsConfig.showCleanSheet && (
        <div className="p-5 sm:p-6 rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h4 className="font-bebas text-lg sm:text-xl text-[var(--text-main)] uppercase tracking-wide">
                Rekap Pertahanan Terbaik &bull; Clean Sheet Tim
              </h4>
            </div>
            <span className="text-xs font-mono text-[var(--text-muted)]">Nirbobol Sempurna</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {initialTeams.slice(0, 4).map((team) => (
              <div
                key={team.id}
                className="p-3.5 rounded-xl bg-[var(--bg-muted)]/70 border border-[var(--border-subtle)] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center p-1 shrink-0 overflow-hidden">
                    <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-barlow font-bold text-xs text-[var(--text-main)] block truncate">
                      {team.name}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] truncate block">
                      Grup {team.group}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                    0 Kebobolan
                  </span>
                  <span className="text-[9px] font-mono text-[var(--text-muted)]">100% CS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Grafik Distribusi Waktu Gol */}
      {statsConfig.showGoalDistribution && (
        <div className="p-5 sm:p-6 rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-rose-500" />
              <h4 className="font-bebas text-lg sm:text-xl text-[var(--text-main)] uppercase tracking-wide">
                Distribusi Sebaran Waktu Gol
              </h4>
            </div>
            <span className="text-xs font-mono text-[var(--text-muted)]">Fase Waktu Laga</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex justify-between font-barlow font-bold">
                <span>Babak Pertama (Menit 1 - 10)</span>
                <span className="font-mono text-sky-500">50%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full w-1/2" />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex justify-between font-barlow font-bold">
                <span>Babak Kedua (Menit 11 - 20)</span>
                <span className="font-mono text-amber-500">50%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-1/2" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
