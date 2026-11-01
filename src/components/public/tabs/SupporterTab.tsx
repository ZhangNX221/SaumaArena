'use client';

import React, { useState } from 'react';
import { Award, Search } from 'lucide-react';
import { initialSupporterAssessments, initialTeams } from '@/mocks/tournamentData';
import { SupporterAssessment, Team } from '@/types';
import { usePersistentState } from '@/hooks/usePersistentState';
import { SupporterRulesInfo } from './SupporterRulesInfo';
import { SupporterDesktopTable, SupporterLeaderboardRow } from './SupporterDesktopTable';
import { PublicPageHeader } from '../layout/PublicPageHeader';

export const SupporterTab: React.FC = () => {
  const [assessments] = usePersistentState<SupporterAssessment[]>('sauma_arena_supporter_scores', initialSupporterAssessments);
  const [teams] = usePersistentState<Team[]>('sauma_arena_teams', initialTeams);
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

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-6">
      {/* Public Page Header */}
      <PublicPageHeader
        icon={Award}
        category="PENGHARGAAN TRIBUN • SUPORTER KONTINGEN"
        title="Klasemen Suporter Terbaik"
        description="Peringkat kreativitas dan ketertiban suporter tim berdasarkan maskot, seragam, yel-yel, tiket resmi, serta sanksi ketertiban di tribun."
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

        {/* Petunjuk Geser Horizontal pada Tampilan Mobile */}
        <div className="sm:hidden flex items-center justify-between px-2 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5">
            <span className="text-[#1D63B8] dark:text-sky-400 font-bold">⇄</span>
            Geser tabel ke samping untuk melihat seluruh 12 kolom penilaian
          </span>
        </div>

        {/* TABULAR LEADERBOARD DENGAN SELURUH KOLOM PENILAIAN */}
        <SupporterDesktopTable leaderboard={leaderboard} />
      </div>
    </div>
  );
};
