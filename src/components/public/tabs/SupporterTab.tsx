'use client';

import React, { useState } from 'react';
import { Award, ChevronRight, Search, Crown } from 'lucide-react';
import { initialSupporterAssessments, initialTeams } from '@/mocks/tournamentData';
import { getTeamLogoUrl } from '@/mocks/teamLogos';
import { SupporterAssessment, Team } from '@/types';
import { usePersistentState } from '@/hooks/usePersistentState';
import { SupporterDetailModal } from './SupporterDetailModal';
import { SupporterRulesInfo } from './SupporterRulesInfo';
import { SupporterDesktopTable, SupporterLeaderboardRow } from './SupporterDesktopTable';
import { PublicPageHeader } from '../layout/PublicPageHeader';

export const SupporterTab: React.FC = () => {
  const [assessments] = usePersistentState<SupporterAssessment[]>('sauma_arena_supporter_scores', initialSupporterAssessments);
  const [teams] = usePersistentState<Team[]>('sauma_arena_teams', initialTeams);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Agregasi skor suporter per sekolah/tim (Poin Positif 1-4 & Sanksi 1-4 dengan label 1 kata)
  const leaderboard: SupporterLeaderboardRow[] = teams
    .map((team) => {
      const teamAssessments = assessments.filter((a) => a.teamId === team.id);

      let p1Points = 0; // 1. Maskot (+20)
      let p2Points = 0; // 2. Seragam (+15)
      let p3Points = 0; // 3. Yel-yel (+10)
      let p4Points = 0; // 4. Tiket (+1)

      let s1Points = 0; // 1. Ricuh (-50)
      let s2Points = 0; // 2. Lempar (-25)
      let s3Points = 0; // 3. Rasis (-15)
      let s4Points = 0; // 4. Barang dilarang (-5)

      teamAssessments.forEach((a) => {
        if (a.schoolMascot) p1Points += 20;
        if (a.supporterUniform) p2Points += 15;
        if (a.cheerMin3Chants) p3Points += 10;
        p4Points += a.checkedInTickets > 0 ? 1 : 0;

        if (a.incidentViolentChaos) s1Points += 50;
        if (a.incidentThrowObjects) s2Points += 25;
        if (a.incidentRacismProvocation) s3Points += 15;
        if (a.incidentSmuggleContraband) s4Points += 5;
      });

      const penaltyPoints = s1Points + s2Points + s3Points + s4Points;
      const totalScore = p1Points + p2Points + p3Points + p4Points - penaltyPoints;

      return {
        teamId: team.id,
        schoolName: team.schoolName,
        shortName: team.shortName,
        logoUrl: team.logoUrl,
        p1Points,
        p2Points,
        p3Points,
        p4Points,
        s1Points,
        s2Points,
        s3Points,
        s4Points,
        penaltyPoints,
        totalScore,
        matchCount: teamAssessments.length,
      };
    })
    .filter((row) => row.schoolName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.totalScore - a.totalScore);

  const selectedTeam = initialTeams.find((t) => t.id === selectedSchool);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-6">
      {/* Public Page Header */}
      <PublicPageHeader
        icon={Award}
        category="PENGHARGAAN TRIBUN • SUPORTER KONTINGEN"
        title="Klasemen Suporter Terbaik"
        description="Peringkat kreativitas dan ketertiban suporter tim berdasarkan koreografi, yel-yel, tiket resmi, serta sportivitas di tribun."
      />

      {/* Ketentuan & Bobot Penilaian (Subkomponen Ramping) */}
      <SupporterRulesInfo />

      {/* Search and Filter Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Cari sekolah atau kontingen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#1D63B8] min-h-[44px] transition-all"
            />
          </div>
          <div className="text-xs font-semibold text-[var(--text-muted)]">
            Menampilkan <span className="text-[var(--text-main)] font-black font-mono tabular-nums">{leaderboard.length}</span> kontingen sekolah
          </div>
        </div>

        {/* 1. MOBILE-FIRST RESPONSIVE CARD STACK (block sm:hidden) */}
        <div className="block sm:hidden space-y-3">
          {leaderboard.map((row, index) => {
            const rank = index + 1;
            const isTop1 = rank === 1;

            return (
              <div
                key={`mobile-${row.teamId}`}
                className={`p-4 rounded-xl border-2 transition-all shadow-xs ${
                  isTop1
                    ? 'bg-amber-500/5 dark:bg-amber-500/10 border-[var(--color-arena-accent)] ring-1 ring-[var(--color-arena-accent)]/30'
                    : 'bg-[var(--bg-surface)] border-slate-300 dark:border-slate-800'
                }`}
              >
                {/* Header Row: Rank, Logo, Name, Score */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0">
                      {isTop1 ? (
                        <div className="w-8 h-8 rounded-lg bg-[var(--color-arena-accent)] text-slate-950 font-black text-xs flex flex-col items-center justify-center shadow-xs font-mono">
                          <Crown className="w-3.5 h-3.5 text-slate-950" />
                          <span className="leading-none text-[10px]">#1</span>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] border border-slate-200 dark:border-slate-700 text-[var(--text-muted)] font-mono font-bold text-xs flex items-center justify-center">
                          {rank}
                        </div>
                      )}
                    </div>

                    <div className="w-9 h-9 rounded-lg bg-[var(--bg-muted)] border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={row.logoUrl || getTeamLogoUrl(row.teamId)}
                        alt={row.schoolName}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-barlow font-bold text-sm tracking-wide text-[var(--text-main)] truncate">
                        {row.schoolName}
                      </h4>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        {row.matchCount} Laga Terverifikasi
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-2xl font-teko font-bold tabular-nums text-[#1D63B8] dark:text-sky-400 leading-none block">
                      {row.totalScore}
                    </span>
                    <span className="text-[9px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Total Poin
                    </span>
                  </div>
                </div>

                {/* Score Breakdown Pills (1 Kata Saja) */}
                <div className="py-2.5 flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded-sm bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800 font-bold">
                    Maskot +{row.p1Points}
                  </span>
                  <span className="px-2 py-0.5 rounded-sm bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800 font-bold">
                    Seragam +{row.p2Points}
                  </span>
                  <span className="px-2 py-0.5 rounded-sm bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800 font-bold">
                    Yel +{row.p3Points}
                  </span>
                  <span className="px-2 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                    Tiket +{row.p4Points}
                  </span>
                  {row.s1Points > 0 && (
                    <span className="px-2 py-0.5 rounded-sm bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 font-bold">
                      Ricuh -{row.s1Points}
                    </span>
                  )}
                  {row.s2Points > 0 && (
                    <span className="px-2 py-0.5 rounded-sm bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 font-bold">
                      Lempar -{row.s2Points}
                    </span>
                  )}
                  {row.s3Points > 0 && (
                    <span className="px-2 py-0.5 rounded-sm bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 font-bold">
                      Rasis -{row.s3Points}
                    </span>
                  )}
                  {row.s4Points > 0 && (
                    <span className="px-2 py-0.5 rounded-sm bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 font-bold">
                      Barang -{row.s4Points}
                    </span>
                  )}
                  {row.penaltyPoints > 0 && (
                    <span className="px-2 py-0.5 rounded-sm bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 font-black">
                      Total Sanksi -{row.penaltyPoints}
                    </span>
                  )}
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => setSelectedSchool(row.teamId)}
                  className="btn-tactile w-full mt-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[var(--bg-muted)] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-main)] min-h-[44px] cursor-pointer"
                >
                  <span>Lihat Rincian Penilaian</span>
                  <ChevronRight className="w-4 h-4 text-[#1D63B8] dark:text-sky-400" />
                </button>
              </div>
            );
          })}
        </div>

        {/* 2. DESKTOP/TABLET TABULAR LEADERBOARD (hidden sm:block) */}
        <SupporterDesktopTable
          leaderboard={leaderboard}
          onSelectSchool={(teamId) => setSelectedSchool(teamId)}
        />
      </div>

      {/* School Detail Modal Subcomponent */}
      <SupporterDetailModal
        isOpen={Boolean(selectedSchool)}
        onClose={() => setSelectedSchool(null)}
        team={selectedTeam}
        assessments={assessments}
      />
    </div>
  );
};
