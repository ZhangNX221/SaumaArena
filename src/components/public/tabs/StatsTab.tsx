'use client';

import React from 'react';
import {
  Trophy,
  ShieldAlert,
  BarChart3,
  Flame,
  Zap,
  Award,
} from 'lucide-react';
import { initialTeams } from '@/mocks/tournamentData';
import { CABOR_STATS_LEADERS } from '@/mocks/caborStandingsAndStats';
import { TeamGoalsBarChart } from '../stats/TeamGoalsBarChart';
import { DisciplineFairPlayChart } from '../stats/DisciplineFairPlayChart';
import { SportCode } from '@/types';

interface StatsTabProps {
  sportCode?: SportCode;
}

export const StatsTab: React.FC<StatsTabProps> = ({ sportCode = 'FUTSAL' }) => {
  const isCustomCabor = sportCode === 'VOLI' || sportCode === 'ESPORT';
  const customStats = CABOR_STATS_LEADERS[sportCode];

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
  const topAssists = [...allPlayers].sort((a, b) => b.assists - a.assists).slice(0, 5);
  const disciplinedPlayers = [...allPlayers]
    .filter((p) => p.yellowCards > 0 || p.redCards > 0 || p.isSuspended)
    .sort((a, b) => b.yellowCards + b.redCards * 2 - (a.yellowCards + a.redCards * 2));

  return (
    <div className="space-y-8 animate-fadeIn pb-6">
      {/* Public Page Header */}
      <div className="space-y-1.5 pb-2">
        <div className="flex items-center gap-2 text-[var(--color-arena-primary)]">
          <BarChart3 className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[11px] font-black uppercase tracking-widest">
            INFOGRAFIS &amp; ANALISIS PERTANDINGAN &bull; {sportCode}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
          {isCustomCabor && customStats ? customStats.title : `Statistik Turnamen MMFC I ${sportCode}`}
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
          {isCustomCabor && customStats
            ? customStats.subtitle
            : 'Visualisasi data terstruktur perolehan gol tim, indeks sportivitas, serta peringkat performa individu atlet.'}
        </p>
      </div>

      {/* Render Custom Cabor Stats (Voli / Esport) */}
      {isCustomCabor && customStats ? (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[var(--color-arena-accent)]" />
                <h3 className="font-extrabold text-base text-[var(--text-main)]">
                  Peringkat Pemain Bintang Terbaik ({sportCode})
                </h3>
              </div>
              <span className="text-xs text-[var(--text-muted)] font-mono">Update Match Terakhir</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[var(--bg-muted)] text-[var(--text-muted)] text-[10px] uppercase font-bold border-b border-[var(--border-subtle)]">
                    <th className="py-3 px-4 w-12 text-center">Rank</th>
                    <th className="py-3 px-4">Nama Atlet</th>
                    <th className="py-3 px-4">Klub / Tim</th>
                    <th className="py-3 px-4">Kategori Gelar</th>
                    <th className="py-3 px-4 text-right">Pencapaian Rekor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {customStats.leaders.map((leader) => (
                    <tr key={leader.rank} className="hover:bg-[var(--bg-muted)]/30">
                      <td className="py-3 px-4 text-center font-black font-mono">
                        {leader.rank === 1 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 inline-flex items-center justify-center text-xs">
                            1
                          </span>
                        ) : (
                          leader.rank
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-[var(--text-main)] text-sm">{leader.name}</td>
                      <td className="py-3 px-4 text-[var(--text-muted)] font-medium">{leader.team}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] border border-[var(--border-subtle)]">
                          {leader.badge}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-sm text-[var(--color-arena-primary)]">
                        {leader.metricValue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Render Futsal Charts & Stats */
        <>
          {/* Quick Stat Pill Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span className="text-[11px] font-bold">Total Gol Tercipta</span>
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black font-mono text-[var(--text-main)] mt-1">55</div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">3.67 Gol per Laga</span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span className="text-[11px] font-bold">Laga Selesai</span>
                <Zap className="w-4 h-4 text-[var(--color-arena-primary)]" />
              </div>
              <div className="text-2xl font-black font-mono text-[var(--text-main)] mt-1">15 / 26</div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Fase Grup Selesai 100%</span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span className="text-[11px] font-bold">Kartu Kuning</span>
                <div className="w-3.5 h-4 bg-amber-400 rounded-xs" />
              </div>
              <div className="text-2xl font-black font-mono text-amber-600 mt-1">12</div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">0.80 Kartu per Laga</span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span className="text-[11px] font-bold">Kartu Merah</span>
                <div className="w-3.5 h-4 bg-red-500 rounded-xs" />
              </div>
              <div className="text-2xl font-black font-mono text-red-600 mt-1">1</div>
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

          {/* Section 2: Tables & Rankings */}
          <div className="space-y-6 pt-2">
            {/* Top Scorer & Top Assist Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Scorer */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <h4 className="font-extrabold text-sm sm:text-base text-[var(--text-main)] font-[var(--font-display)] tracking-tight">Peringkat Top Scorer</h4>
                  </div>
                  <span className="text-xs text-[var(--text-muted)] font-mono font-bold">Piala Sepatu Emas</span>
                </div>

                <div className="space-y-2.5">
                  {topScorers.map((player, idx) => (
                    <div
                      key={player.id}
                      className="p-3 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono tabular-nums font-black text-xs text-[var(--text-muted)] w-5 text-center">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-[var(--text-main)] font-[var(--font-display)]">{player.name}</div>
                          <div className="text-[10px] text-[var(--text-muted)]">{player.teamName}</div>
                        </div>
                      </div>
                      <span className="font-mono tabular-nums font-black text-sm text-[var(--color-arena-primary)]">
                        {player.goals} Gol
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Assist */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-500" />
                    <h4 className="font-extrabold text-sm sm:text-base text-[var(--text-main)] font-[var(--font-display)] tracking-tight">Peringkat Top Assist</h4>
                  </div>
                  <span className="text-xs text-[var(--text-muted)] font-mono font-bold">Playmaker Terbaik</span>
                </div>

                <div className="space-y-2.5">
                  {topAssists.map((player, idx) => (
                    <div
                      key={player.id}
                      className="p-3 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono tabular-nums font-black text-xs text-[var(--text-muted)] w-5 text-center">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-[var(--text-main)] font-[var(--font-display)]">{player.name}</div>
                          <div className="text-[10px] text-[var(--text-muted)]">{player.teamName}</div>
                        </div>
                      </div>
                      <span className="font-mono tabular-nums font-black text-sm text-blue-600 dark:text-blue-400">
                        {player.assists} Assist
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Disciplinary Table (Full Width) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-[var(--text-main)] font-[var(--font-display)] tracking-tight">Rekapitulasi Kartu &amp; Sanksi Disiplin</h4>
                    <p className="text-[11px] text-[var(--text-muted)]">Pencatatan kartu kuning, kartu merah, dan status skorsing pemain</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[var(--bg-muted)] text-[var(--text-muted)] text-[10px] uppercase font-bold border-b border-[var(--border-subtle)] font-mono">
                      <th className="py-3 px-4 font-sans">Pemain</th>
                      <th className="py-3 px-4 font-sans">Sekolah / Kontingen</th>
                      <th className="py-3 px-4 text-center">Kuning (KK)</th>
                      <th className="py-3 px-4 text-center">Merah (KM)</th>
                      <th className="py-3 px-4 font-sans">Status Pertandingan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {disciplinedPlayers.map((player) => (
                      <tr key={player.id} className="hover:bg-[var(--bg-muted)]/30">
                        <td className="py-3 px-4 font-bold text-[var(--text-main)] font-[var(--font-display)]">{player.name}</td>
                        <td className="py-3 px-4 text-[var(--text-muted)]">{player.teamName}</td>
                        <td className="py-3 px-4 text-center font-mono tabular-nums font-bold text-amber-600">{player.yellowCards}</td>
                        <td className="py-3 px-4 text-center font-mono tabular-nums font-bold text-red-600">{player.redCards}</td>
                        <td className="py-3 px-4">
                          {player.isSuspended ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                              Skorsing 1 Laga
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                              Aktif Bertanding
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
