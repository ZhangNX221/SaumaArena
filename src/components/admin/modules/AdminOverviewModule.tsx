'use client';

import React from 'react';
import { Trophy, Users, Ticket, Activity } from 'lucide-react';
import { MEDAL_TALLY } from '@/mocks/multiSportData';
import { initialTeams, initialMatches, initialTickets } from '@/mocks/tournamentData';
import { SportCode } from '@/types';
import { TeamGoalsBarChart } from '@/components/public/stats/TeamGoalsBarChart';
import { GoalMinuteLineChart } from '@/components/public/stats/GoalMinuteLineChart';
import { MedalTallyCrudTab } from './overview/MedalTallyCrudTab';

export interface AdminOverviewModuleProps {
  selectedSport: SportCode;
  onOpenMatchControl?: () => void;
  subTab?: 'stats' | 'medals';
  onSelectSubTab?: (tab: 'stats' | 'medals') => void;
}

export const AdminOverviewModule: React.FC<AdminOverviewModuleProps> = ({
  selectedSport,
  onOpenMatchControl,
  subTab = 'stats',
  onSelectSubTab,
}) => {
  const totalAthletes = initialTeams.reduce((sum, t) => sum + (t.players?.length || 0), 0);
  const totalTicketsSold = initialTickets.reduce((sum, t) => sum + t.quantity, 0);
  const totalCheckedIn = initialTickets
    .filter((t) => t.status === 'CHECKED_IN')
    .reduce((sum, t) => sum + t.quantity, 0);
  const liveMatch = initialMatches.find((m) => m.status === 'LIVE');
  const medalLeader = MEDAL_TALLY[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Header & Sub-Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
            Ringkasan &amp; Statistik Turnamen
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-[var(--font-sans)] mt-1">
            Pantauan metrik kontingen, analisis gol pertandingan, dan klasemen perolehan medali secara real-time.
          </p>
        </div>

        {onSelectSubTab && (
          <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-[var(--bg-muted)]/80 border border-[var(--border-subtle)] text-xs font-bold font-[var(--font-display)] w-fit">
            <button
              type="button"
              onClick={() => onSelectSubTab('stats')}
              className={`btn-tactile px-4 py-2 rounded-xl transition-all ${
                subTab === 'stats'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Statistik &amp; Analisis
            </button>
            <button
              type="button"
              onClick={() => onSelectSubTab('medals')}
              className={`btn-tactile px-4 py-2 rounded-xl transition-all ${
                subTab === 'medals'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Klasemen Medali
            </button>
          </div>
        )}
      </div>

      {/* Top Metric Cards Row — Generous Breathing Room & Athletic Typeset */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Kontingen & Atlet */}
        <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs hover:shadow-md hover:border-[var(--color-arena-primary)]/30 transition-all group flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-[var(--font-display)] block">
              Total Kontingen
            </span>
            <div className="text-2xl sm:text-3xl font-black font-[var(--font-mono)] tabular-nums text-[var(--text-main)] tracking-tight">
              {initialTeams.length} <span className="text-sm font-semibold font-[var(--font-sans)] text-[var(--text-muted)]">Sekolah</span>
            </div>
            <span className="text-xs text-[var(--color-arena-primary)] font-bold font-[var(--font-display)] block pt-1">
              {totalAthletes} Atlet Terdaftar
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Tiket Masuk */}
        <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs hover:shadow-md hover:border-amber-500/30 transition-all group flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-[var(--font-display)] block">
              Tiket Terjual
            </span>
            <div className="text-2xl sm:text-3xl font-black font-[var(--font-mono)] tabular-nums text-[var(--text-main)] tracking-tight">
              {totalTicketsSold} <span className="text-sm font-semibold font-[var(--font-sans)] text-[var(--text-muted)]">Tiket</span>
            </div>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold font-[var(--font-display)] block pt-1">
              {totalCheckedIn} Hadir di Gate Masuk
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Laga Live */}
        <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs hover:shadow-md hover:border-red-500/30 transition-all group flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 font-[var(--font-display)] block">
                Pertandingan Berjalan
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-[var(--font-mono)] tabular-nums text-red-600 dark:text-red-400 tracking-tight">
              {liveMatch ? `${liveMatch.scoreA} - ${liveMatch.scoreB}` : '0 - 0'}
            </div>
            <span className="text-xs text-[var(--text-muted)] font-semibold font-[var(--font-sans)] block pt-1 truncate max-w-[170px]" title={liveMatch ? `${liveMatch.teamAName} vs ${liveMatch.teamBName}` : 'Tidak ada laga live'}>
              {liveMatch ? `${liveMatch.teamAName} vs ${liveMatch.teamBName}` : 'Menunggu Kickoff'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Medal Tally Leader */}
        <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs hover:shadow-md hover:border-amber-500/30 transition-all group flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-[var(--font-display)] block">
              Puncak Klasemen Medali
            </span>
            <div className="text-xl sm:text-2xl font-black font-[var(--font-display)] text-[var(--text-main)] tracking-tight truncate max-w-[160px]" title={medalLeader?.contingentName}>
              {medalLeader?.contingentName || '-'}
            </div>
            <span className="text-xs text-[var(--color-arena-accent)] font-black font-[var(--font-mono)] tabular-nums block pt-1">
              {medalLeader?.gold || 0} Emas &bull; {medalLeader?.silver || 0} Perak &bull; {medalLeader?.bronze || 0} Perunggu
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Trophy className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts (Stats SubTab) */}
      {subTab === 'stats' && (
        <div className="space-y-8">
          <TeamGoalsBarChart />
          <GoalMinuteLineChart />
        </div>
      )}

      {/* Medal Tally with Full CRUD (Medals SubTab or Overview bottom) */}
      <MedalTallyCrudTab selectedSport={selectedSport} />
    </div>
  );
};

