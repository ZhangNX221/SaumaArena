'use client';

import React from 'react';
import { Trophy, Users, Ticket, Activity, BarChart3, Medal } from 'lucide-react';
import { MEDAL_TALLY } from '@/mocks/multiSportData';
import { initialTeams, initialMatches, initialTickets } from '@/mocks/tournamentData';
import { SportCode } from '@/types';
import { TeamGoalsBarChart } from '@/components/public/stats/TeamGoalsBarChart';
import { GoalMinuteLineChart } from '@/components/public/stats/GoalMinuteLineChart';
import { MedalTallyCrudTab } from './overview/MedalTallyCrudTab';
import { FEATURES } from '@/config/features';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';

export interface AdminOverviewModuleProps {
  selectedSport: SportCode;
  onOpenMatchControl?: () => void;
  subTab?: 'stats' | 'medals';
  onSelectSubTab?: (tab: 'stats' | 'medals') => void;
}

export const AdminOverviewModule: React.FC<AdminOverviewModuleProps> = ({
  selectedSport,
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
      {/* Title Card */}
      <AdminPageHeaderCard
        icon={BarChart3}
        category="BERANDA • RINGKASAN HARI INI"
        title="Ringkasan Turnamen & Klasemen Perolehan"
        description="Pantauan metrik kontingen, analisis gol pertandingan, status tiket masuk, serta rekapitulasi klasemen perolehan medali seluruh kontingen."
      />

      {/* Kartu Metrik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Kontingen & Atlet */}
        <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs hover:shadow-md hover:border-[var(--color-arena-primary)]/30 transition-all group flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              Total Kontingen
            </span>
            <div className="text-3xl sm:text-4xl font-teko font-bold tabular-nums text-[var(--text-main)] tracking-wide leading-none pt-1">
              {initialTeams.length} <span className="text-sm font-semibold font-barlow text-[var(--text-muted)]">Tim</span>
            </div>
            <span className="text-xs text-[var(--color-arena-primary)] font-bold font-barlow block pt-1">
              {totalAthletes} Atlet Terdaftar
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Tiket Masuk (Jika enabled) atau Jadwal Pertandingan */}
        {FEATURES.ticketing ? (
          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs hover:shadow-md hover:border-amber-500/30 transition-all group flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Tiket Terjual
              </span>
              <div className="text-3xl sm:text-4xl font-teko font-bold tabular-nums text-[var(--text-main)] tracking-wide leading-none pt-1">
                {totalTicketsSold} <span className="text-sm font-semibold font-barlow text-[var(--text-muted)]">Tiket</span>
              </div>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-bold font-barlow block pt-1">
                {totalCheckedIn} Hadir di Gate Masuk
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <Ticket className="w-6 h-6" />
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs hover:shadow-md hover:border-blue-500/30 transition-all group flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Total Pertandingan
              </span>
              <div className="text-3xl sm:text-4xl font-teko font-bold tabular-nums text-[var(--text-main)] tracking-wide leading-none pt-1">
                {initialMatches.length} <span className="text-sm font-semibold font-barlow text-[var(--text-muted)]">Pertandingan</span>
              </div>
              <span className="text-xs text-[var(--color-arena-primary)] font-bold font-barlow block pt-1">
                {initialMatches.filter((m) => m.status === 'COMPLETED').length} Pertandingan Selesai
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-arena-primary-light)] dark:bg-sky-950/40 text-[var(--color-arena-primary)] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        )}

        {/* Card 3: Laga Live */}
        <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs hover:shadow-md hover:border-red-500/30 transition-all group flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span className="text-xs font-barlow font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block">
                Pertandingan Berjalan
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-teko font-bold tabular-nums text-red-600 dark:text-red-400 tracking-wide leading-none pt-1">
              {liveMatch ? `${liveMatch.scoreA} - ${liveMatch.scoreB}` : '0 - 0'}
            </div>
            <span className="text-xs text-[var(--text-muted)] font-semibold font-barlow block pt-1 truncate max-w-[170px]">
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
            <span className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              Puncak Klasemen Medali
            </span>
            <div className="text-2xl sm:text-3xl font-barlow font-bold text-[var(--text-main)] tracking-wide truncate max-w-[160px] pt-1">
              {medalLeader?.contingentName || '-'}
            </div>
            <span className="text-xs text-[var(--color-arena-accent)] font-bold font-barlow tabular-nums block pt-1">
              {medalLeader?.gold || 0} Emas &bull; {medalLeader?.silver || 0} Perak &bull; {medalLeader?.bronze || 0} Perunggu
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Trophy className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts: Sejajar Kiri - Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <TeamGoalsBarChart />
        <GoalMinuteLineChart />
      </div>

      {/* Klasemen Perolehan Medali Kontingen */}
      <MedalTallyCrudTab selectedSport={selectedSport} />
    </div>
  );
};

