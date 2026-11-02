'use client';

import React, { useEffect, useMemo } from 'react';
import { BarChart3, PieChart, SlidersHorizontal } from 'lucide-react';
import { initialMatches, initialTeams } from '@/mocks/tournamentData';
import { TeamGoalsBarChart } from '../stats/TeamGoalsBarChart';
import { DisciplineFairPlayChart } from '../stats/DisciplineFairPlayChart';
import { StatsQuickMetricsCards } from '../stats/StatsQuickMetricsCards';
import { StatsTopScorersCard, TopScorerItem } from '../stats/StatsTopScorersCard';
import { StatsCleanSheetCard, CleanSheetTeamItem } from '../stats/StatsCleanSheetCard';
import {
  SportCode,
  PublicStatsDisplayConfig,
  STORAGE_KEY_STATS_CONFIG,
  DEFAULT_PUBLIC_STATS_CONFIG,
  Match,
  Team,
  FlattenedAthlete,
  STORAGE_KEY_MASTER_ATHLETES,
  STORAGE_KEY_TEAMS,
} from '@/types';
import { PublicPageHeader } from '../layout/PublicPageHeader';
import { usePersistentState } from '@/hooks/usePersistentState';
import { fetchLiveStateFromBackend } from '@/lib/apiSync';
import { fetchAthletesFromBackend } from '@/lib/athleteSync';

interface StatsTabProps {
  sportCode?: SportCode;
}

export const StatsTab: React.FC<StatsTabProps> = ({ sportCode = 'FUTSAL' }) => {
  const [statsConfig, setStatsConfig] = usePersistentState<PublicStatsDisplayConfig>(
    STORAGE_KEY_STATS_CONFIG,
    DEFAULT_PUBLIC_STATS_CONFIG
  );

  const [matches, setMatches] = usePersistentState<Match[]>('sauma_arena_matches', initialMatches);
  const [teams] = usePersistentState<Team[]>(STORAGE_KEY_TEAMS, initialTeams);
  const [athletes, setAthletes] = usePersistentState<FlattenedAthlete[]>(STORAGE_KEY_MASTER_ATHLETES, []);

  // Sinkronisasi data pengaturan, jadwal laga, dan master atlet dari backend
  useEffect(() => {
    fetch('/api/settings?sport=futsal')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.statsConfig) {
          setStatsConfig(json.data.statsConfig);
        }
      })
      .catch(() => {});

    fetchLiveStateFromBackend().then((state) => {
      if (state && Array.isArray(state.matches) && state.matches.length > 0) {
        setMatches(state.matches);
      }
    });

    fetchAthletesFromBackend().then((remoteData) => {
      if (remoteData && Array.isArray(remoteData) && remoteData.length > 0) {
        setAthletes((prev) => {
          let currentList = prev;
          if (!currentList || currentList.length === 0) {
            try {
              const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_MASTER_ATHLETES) : null;
              if (saved) currentList = JSON.parse(saved);
            } catch {}
          }
          if (!currentList || currentList.length === 0) return remoteData;
          const prevMap = new Map(currentList.map((a) => [a.id, a]));
          return remoteData.map((remote) => {
            const local = prevMap.get(remote.id);
            return {
              ...remote,
              goals: Math.max(Number(local?.goals || 0), Number(remote.goals || 0)),
              yellowCards: Math.max(Number(local?.yellowCards || 0), Number(remote.yellowCards || 0)),
              redCards: Math.max(Number(local?.redCards || 0), Number(remote.redCards || 0)),
            };
          });
        });
      }
    });
  }, [setStatsConfig, setMatches, setAthletes]);

  // Ringkasan metrik gol turnamen
  const totalGoals = useMemo(() => {
    return matches.reduce((acc, m) => {
      if (m.status === 'COMPLETED' || m.status === 'LIVE') {
        return acc + Number(m.scoreA || 0) + Number(m.scoreB || 0);
      }
      return acc;
    }, 0);
  }, [matches]);

  const completedMatches = useMemo(() => {
    return matches.filter((m) => m.status === 'COMPLETED').length;
  }, [matches]);

  const totalMatches = matches.length || 17;
  const avgGoals = completedMatches > 0 ? (totalGoals / completedMatches).toFixed(2) : '0.00';

  // Akumulasi total kartu kuning dan merah turnamen
  const { totalYellowCards, totalRedCards } = useMemo(() => {
    const baseTeams = teams.length > 0 ? teams : initialTeams;
    let sumYellow = 0;
    let sumRed = 0;

    baseTeams.forEach((t) => {
      const athleteY = athletes
        .filter((a) => a.teamId === t.id || (a.teamName && a.teamName.toLowerCase() === t.name.toLowerCase()))
        .reduce((s, a) => s + Number(a.yellowCards || 0), 0);

      const playerY = (t.players || []).reduce((s, p) => s + Number(p.yellowCards || 0), 0);

      const matchY = matches.reduce((s, m) => {
        return (
          s +
          (m.events || []).filter((e) => {
            if (e.type !== 'YELLOW_CARD') return false;
            return (
              e.teamId === t.id ||
              (m.teamAId === t.id && (e.teamId === 'A' || e.playerName?.includes('Tim A'))) ||
              (m.teamBId === t.id && (e.teamId === 'B' || e.playerName?.includes('Tim B'))) ||
              (e.playerName && e.playerName.toLowerCase().includes(t.name.toLowerCase()))
            );
          }).length
        );
      }, 0);

      sumYellow += Math.max(athleteY, playerY, matchY);

      const athleteR = athletes
        .filter((a) => a.teamId === t.id || (a.teamName && a.teamName.toLowerCase() === t.name.toLowerCase()))
        .reduce((s, a) => s + Number(a.redCards || 0), 0);

      const playerR = (t.players || []).reduce((s, p) => s + Number(p.redCards || 0), 0);

      const matchR = matches.reduce((s, m) => {
        return (
          s +
          (m.events || []).filter((e) => {
            if (e.type !== 'RED_CARD') return false;
            return (
              e.teamId === t.id ||
              (m.teamAId === t.id && (e.teamId === 'A' || e.playerName?.includes('Tim A'))) ||
              (m.teamBId === t.id && (e.teamId === 'B' || e.playerName?.includes('Tim B'))) ||
              (e.playerName && e.playerName.toLowerCase().includes(t.name.toLowerCase()))
            );
          }).length
        );
      }, 0);

      sumRed += Math.max(athleteR, playerR, matchR);
    });

    return { totalYellowCards: sumYellow, totalRedCards: sumRed };
  }, [athletes, teams, matches]);

  const avgCards =
    completedMatches > 0
      ? ((totalYellowCards + totalRedCards) / completedMatches).toFixed(2)
      : '0.00';

  // Peringkat pencetak gol terbanyak
  const topScorers: TopScorerItem[] = useMemo(() => {
    const playerMap: Record<string, TopScorerItem> = {};

    const baseAthletes =
      athletes.length > 0
        ? athletes
        : teams.flatMap((t) =>
            t.players.map((p) => ({ ...p, teamId: t.id, teamName: t.name, schoolName: t.schoolName }))
          );

    baseAthletes.forEach((p) => {
      playerMap[p.id] = {
        id: p.id,
        name: p.name,
        teamName: p.teamName || 'Tim Futsal',
        schoolName: p.schoolName || '',
        goals: Number(p.goals || 0),
      };
    });

    matches.forEach((m) => {
      (m.events || []).forEach((e) => {
        if (e.type === 'GOAL' && e.playerId && playerMap[e.playerId]) {
          const directGoal = baseAthletes.find((a) => a.id === e.playerId)?.goals || 0;
          if (directGoal === 0) {
            playerMap[e.playerId].goals += 1;
          }
        }
      });
    });

    return Object.values(playerMap)
      .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name))
      .slice(0, 5);
  }, [athletes, teams, matches]);

  // Rekap pertahanan dan clean sheet tim
  const cleanSheetTeams: CleanSheetTeamItem[] = useMemo(() => {
    const list = (teams.length > 0 ? teams : initialTeams).map((team) => {
      let cleanSheets = 0;
      let goalsConceded = 0;
      let matchesPlayed = 0;

      matches.forEach((m) => {
        if (m.status === 'COMPLETED') {
          if (m.teamAId === team.id || m.teamAName?.toLowerCase() === team.name?.toLowerCase()) {
            matchesPlayed += 1;
            const conceded = Number(m.scoreB || 0);
            goalsConceded += conceded;
            if (conceded === 0) cleanSheets += 1;
          } else if (m.teamBId === team.id || m.teamBName?.toLowerCase() === team.name?.toLowerCase()) {
            matchesPlayed += 1;
            const conceded = Number(m.scoreA || 0);
            goalsConceded += conceded;
            if (conceded === 0) cleanSheets += 1;
          }
        }
      });

      return {
        id: team.id,
        name: team.name,
        logoUrl: team.logoUrl,
        group: team.group,
        cleanSheets,
        goalsConceded,
        matchesPlayed,
        csPercentage: matchesPlayed > 0 ? Math.round((cleanSheets / matchesPlayed) * 100) : 100,
      };
    });

    return list
      .sort((a, b) => b.cleanSheets - a.cleanSheets || a.goalsConceded - b.goalsConceded)
      .slice(0, 4);
  }, [teams, matches]);

  // Distribusi fase waktu terjadinya gol
  const goalTimingStats = useMemo(() => {
    const goalEvents = matches.flatMap((m) => m.events || []).filter((e) => e.type === 'GOAL');
    const totalGoalEvents = goalEvents.length;
    if (totalGoalEvents === 0) {
      return {
        h1Count: 0,
        h2Count: 0,
        h1Percent: totalGoals > 0 ? 50 : 0,
        h2Percent: totalGoals > 0 ? 50 : 0,
        totalGoalEvents: totalGoals,
      };
    }
    const h1Count = goalEvents.filter((g) => (g.minute || 1) <= 10).length;
    const h2Count = totalGoalEvents - h1Count;
    const h1Percent = Math.round((h1Count / totalGoalEvents) * 100);
    const h2Percent = 100 - h1Percent;
    return { h1Count, h2Count, h1Percent, h2Percent, totalGoalEvents };
  }, [matches, totalGoals]);

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
        <StatsQuickMetricsCards
          totalGoals={totalGoals}
          avgGoals={avgGoals}
          completedMatches={completedMatches}
          totalMatches={totalMatches}
          totalYellowCards={totalYellowCards}
          totalRedCards={totalRedCards}
          avgCards={avgCards}
        />
      )}

      {/* 2. Charts (Side-by-Side or Full width) */}
      {(statsConfig.showTeamGoalsChart || statsConfig.showDisciplineChart) && (
        <div className={`grid grid-cols-1 ${statsConfig.showTeamGoalsChart && statsConfig.showDisciplineChart ? 'lg:grid-cols-2' : ''} gap-6 items-stretch`}>
          {statsConfig.showTeamGoalsChart && (
            <div className="h-full rounded-xl border-2 border-slate-300 dark:border-slate-800 bg-[var(--bg-surface)] overflow-hidden shadow-sm p-4 sm:p-5">
              <TeamGoalsBarChart matches={matches} teams={teams} />
            </div>
          )}
          {statsConfig.showDisciplineChart && (
            <div className="h-full rounded-xl border-2 border-slate-300 dark:border-slate-800 bg-[var(--bg-surface)] overflow-hidden shadow-sm p-4 sm:p-5">
              <DisciplineFairPlayChart matches={matches} teams={teams} athletes={athletes} />
            </div>
          )}
        </div>
      )}

      {/* 3. Top Scorers (Piala Sepatu Emas) */}
      {statsConfig.showTopScorers && <StatsTopScorersCard topScorers={topScorers} />}

      {/* 4. Rekap Pertahanan Terbaik & Clean Sheet */}
      {statsConfig.showCleanSheet && <StatsCleanSheetCard cleanSheetTeams={cleanSheetTeams} />}

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
                <span className="font-mono text-sky-500">
                  {goalTimingStats.h1Percent}% ({goalTimingStats.h1Count} Gol)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-300"
                  style={{ width: `${goalTimingStats.h1Percent}%` }}
                />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex justify-between font-barlow font-bold">
                <span>Babak Kedua (Menit 11 - 20)</span>
                <span className="font-mono text-amber-500">
                  {goalTimingStats.h2Percent}% ({goalTimingStats.h2Count} Gol)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${goalTimingStats.h2Percent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
