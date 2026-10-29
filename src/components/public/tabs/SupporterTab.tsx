'use client';

import React, { useState } from 'react';
import { Award, ShieldAlert, ChevronRight, Search, Info, Crown, Ticket } from 'lucide-react';
import { initialSupporterAssessments, initialTeams } from '@/mocks/tournamentData';
import { getTeamLogoUrl } from '@/mocks/teamLogos';
import { SupporterAssessment, Team } from '@/types';
import { usePersistentState } from '@/hooks/usePersistentState';
import { SupporterDetailModal } from './SupporterDetailModal';
import { PublicPageHeader } from '../layout/PublicPageHeader';

export const SupporterTab: React.FC = () => {
  const [assessments] = usePersistentState<SupporterAssessment[]>('sauma_arena_supporter_scores', initialSupporterAssessments);
  const [teams] = usePersistentState<Team[]>('sauma_arena_teams', initialTeams);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Agregasi skor suporter per sekolah/tim (Poin 1 s/d 5 & Sanksi)
  const leaderboard = teams
    .map((team) => {
      const teamAssessments = assessments.filter((a) => a.teamId === team.id);

      let p1Points = 0; // 1. Koreografi (+25)
      let p2Points = 0; // 2. Maskot (+20)
      let p3Points = 0; // 3. Seragam (+15)
      let p4Points = 0; // 4. Yel-yel (+10)
      let p5Points = 0; // 5. Tiket (+1)
      let penaltyPoints = 0;

      teamAssessments.forEach((a) => {
        if (a.choreography) p1Points += 25;
        if (a.schoolMascot) p2Points += 20;
        if (a.supporterUniform) p3Points += 15;
        if (a.cheerMin3Chants) p4Points += 10;
        p5Points += a.checkedInTickets * 1;

        if (a.incidentViolentChaos) penaltyPoints += 50;
        if (a.incidentThrowObjects) penaltyPoints += 25;
        if (a.incidentRacismProvocation) penaltyPoints += 15;
        if (a.incidentSmuggleContraband) penaltyPoints += 5;
        if (a.incidentLitteringTribun) penaltyPoints += 1;
      });

      const totalScore = p1Points + p2Points + p3Points + p4Points + p5Points - penaltyPoints;

      return {
        teamId: team.id,
        schoolName: team.schoolName,
        shortName: team.shortName,
        logoUrl: team.logoUrl,
        p1Points,
        p2Points,
        p3Points,
        p4Points,
        p5Points,
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

      {/* Ketentuan Penilaian */}
      <div className="rounded-xl border-2 border-slate-300 dark:border-slate-800 bg-[var(--bg-surface)] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <Info className="w-4 h-4 text-[#1D63B8] dark:text-sky-400 shrink-0" />
          <h3 className="font-bebas text-base sm:text-lg text-[var(--text-main)] tracking-wider">
            Ketentuan &amp; Bobot Penilaian Best Supporter MMFC I
          </h3>
        </div>

        {/* Rubric Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Poin Positif */}
          <div className="space-y-2 text-xs">
            <div className="font-barlow font-bold uppercase tracking-wider text-[#1D63B8] dark:text-sky-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Poin Apresiasi Kreativitas Tribun</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-muted)] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#1D63B8] text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono">
                    1
                  </span>
                  <span className="font-medium text-[var(--text-main)]">Membentang Koreografi 3D / Kertas</span>
                </div>
                <span className="stadium-badge-positive">+25</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-muted)] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#1D63B8] text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono">
                    2
                  </span>
                  <span className="font-medium text-[var(--text-main)]">Membawa Maskot Sekolah / Kostum Unik</span>
                </div>
                <span className="stadium-badge-positive">+20</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-muted)] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#1D63B8] text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono">
                    3
                  </span>
                  <span className="font-medium text-[var(--text-main)]">Menggunakan Seragam Kompak Kontingen</span>
                </div>
                <span className="stadium-badge-positive">+15</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-muted)] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#1D63B8] text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono">
                    4
                  </span>
                  <span className="font-medium text-[var(--text-main)]">Menyanyikan Yel-Yel Minimal 3 Lagu</span>
                </div>
                <span className="stadium-badge-positive">+10</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300 font-bold border border-blue-200 dark:border-sky-800">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#1D63B8] text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono">
                    5
                  </span>
                  <span className="text-[var(--text-main)] font-semibold">Tiket Penonton Terverifikasi per Pertandingan</span>
                </div>
                <span className="stadium-badge-positive">+1 / Tiket</span>
              </div>
            </div>
          </div>

          {/* Sanksi Pengurangan */}
          <div className="space-y-2 text-xs">
            <div className="font-barlow font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Sanksi Pelanggaran Ketertiban Tribun</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--text-main)]">
                <span className="font-medium">Kericuhan atau Kekerasan Fisik</span>
                <span className="stadium-badge-penalty font-mono tabular-nums">-50</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--text-main)]">
                <span className="font-medium">Melempar Benda ke Lapangan Pertandingan</span>
                <span className="stadium-badge-penalty font-mono tabular-nums">-25</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--text-main)]">
                <span className="font-medium">Tindakan Rasisme atau Provokasi Negatif</span>
                <span className="stadium-badge-penalty font-mono tabular-nums">-15</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--text-main)]">
                <span className="font-medium">Membawa Barang Terlarang / Flare / Petasan</span>
                <span className="stadium-badge-penalty font-mono tabular-nums">-5</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--text-main)]">
                <span className="font-medium">Membuang Sampah Sembarangan / Mengotori Tribun</span>
                <span className="stadium-badge-penalty font-mono tabular-nums">-1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                {/* Header Row: Rank, Logo, Name, Teko Score */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Badge */}
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

                    {/* Logo & School Name */}
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

                  {/* Big Total Score */}
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-teko font-bold tabular-nums text-[#1D63B8] dark:text-sky-400 leading-none block">
                      {row.totalScore}
                    </span>
                    <span className="text-[9px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Total Poin
                    </span>
                  </div>
                </div>

                {/* Score Breakdown Pills */}
                <div className="py-2.5 flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded-sm bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800 font-bold">
                    Koreo +{row.p1Points}
                  </span>
                  <span className="px-2 py-0.5 rounded-sm bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800 font-bold">
                    Maskot +{row.p2Points}
                  </span>
                  <span className="px-2 py-0.5 rounded-sm bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800 font-bold">
                    Seragam +{row.p3Points}
                  </span>
                  <span className="px-2 py-0.5 rounded-sm bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800 font-bold">
                    Yel +{row.p4Points}
                  </span>
                  <span className="px-2 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                    Tiket +{row.p5Points}
                  </span>
                  {row.penaltyPoints > 0 && (
                    <span className="px-2 py-0.5 rounded-sm bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 font-bold">
                      Sanksi -{row.penaltyPoints}
                    </span>
                  )}
                </div>

                {/* Full-width 44px Action Button */}
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
        <div className="hidden sm:block overflow-x-auto rounded-xl border-2 border-slate-300 dark:border-slate-800 bg-[var(--bg-surface)] shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 dark:border-slate-800 bg-[var(--bg-muted)] text-[var(--text-muted)] font-bold uppercase tracking-wider text-xs font-barlow">
                <th className="py-3 px-3 w-12 text-center">Pos</th>
                <th className="py-3 px-4 min-w-[200px] sticky left-0 bg-[var(--bg-muted)] sm:static">Sekolah Suporter</th>
                <th className="py-3 px-2 text-center">Laga</th>
                <th className="py-3 px-2 text-center">
                  <div className="flex flex-col items-center">
                    <span className="w-5 h-5 rounded-md bg-[var(--bg-surface)] border border-slate-300 dark:border-slate-700 text-[#1D63B8] dark:text-sky-400 font-black text-[11px] flex items-center justify-center shadow-2xs font-mono">1</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold mt-0.5 font-barlow uppercase">Koreo</span>
                  </div>
                </th>
                <th className="py-3 px-2 text-center">
                  <div className="flex flex-col items-center">
                    <span className="w-5 h-5 rounded-md bg-[var(--bg-surface)] border border-slate-300 dark:border-slate-700 text-[#1D63B8] dark:text-sky-400 font-black text-[11px] flex items-center justify-center shadow-2xs font-mono">2</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold mt-0.5 font-barlow uppercase">Maskot</span>
                  </div>
                </th>
                <th className="py-3 px-2 text-center">
                  <div className="flex flex-col items-center">
                    <span className="w-5 h-5 rounded-md bg-[var(--bg-surface)] border border-slate-300 dark:border-slate-700 text-[#1D63B8] dark:text-sky-400 font-black text-[11px] flex items-center justify-center shadow-2xs font-mono">3</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold mt-0.5 font-barlow uppercase">Seragam</span>
                  </div>
                </th>
                <th className="py-3 px-2 text-center">
                  <div className="flex flex-col items-center">
                    <span className="w-5 h-5 rounded-md bg-[var(--bg-surface)] border border-slate-300 dark:border-slate-700 text-[#1D63B8] dark:text-sky-400 font-black text-[11px] flex items-center justify-center shadow-2xs font-mono">4</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold mt-0.5 font-barlow uppercase">Yel-yel</span>
                  </div>
                </th>
                <th className="py-3 px-2 text-center">
                  <div className="flex flex-col items-center">
                    <span className="w-5 h-5 rounded-md bg-[var(--bg-surface)] border border-slate-300 dark:border-slate-700 text-[var(--color-arena-accent)] font-black text-[11px] flex items-center justify-center shadow-2xs font-mono">5</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold mt-0.5 font-barlow uppercase">Tiket</span>
                  </div>
                </th>
                <th className="py-3 px-2.5 text-center text-red-600 dark:text-red-400">Sanksi</th>
                <th className="py-3 px-4 text-right font-bold text-[var(--text-main)]">Total Skor</th>
                <th className="py-3 px-3 text-center w-14">Rincian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {leaderboard.map((row, index) => {
                const rank = index + 1;
                const isTop1 = rank === 1;

                return (
                  <tr
                    key={row.teamId}
                    className={`hover:bg-[var(--bg-muted)]/60 transition-colors ${
                      isTop1 ? 'bg-amber-500/5 dark:bg-amber-500/10' : ''
                    }`}
                  >
                    <td className="py-4 px-4 text-center">
                      {isTop1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--color-arena-accent)] text-slate-950 font-black text-xs shadow-xs font-mono">
                          1
                        </span>
                      ) : (
                        <span className="font-extrabold text-sm text-[var(--text-muted)] font-mono">{rank}</span>
                      )}
                    </td>

                    <td className="py-4 px-4 font-medium text-[var(--text-main)] sticky left-0 bg-[var(--bg-surface)] sm:static">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[var(--bg-muted)] border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-2xs">
                          <img
                            src={row.logoUrl || getTeamLogoUrl(row.teamId)}
                            alt={row.schoolName}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-barlow font-bold text-sm sm:text-base tracking-wide text-[var(--text-main)] truncate max-w-[200px] sm:max-w-none">
                            {row.schoolName}
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] font-medium">
                            Basis Suporter Terdaftar
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3 text-center tabular-nums font-mono text-[var(--text-muted)] font-semibold">
                      {row.matchCount}
                    </td>

                    <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-[var(--text-main)]">
                      +{row.p1Points}
                    </td>

                    <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-[var(--text-main)]">
                      +{row.p2Points}
                    </td>

                    <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-[var(--text-main)]">
                      +{row.p3Points}
                    </td>

                    <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-[var(--text-main)]">
                      +{row.p4Points}
                    </td>

                    <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      +{row.p5Points}
                    </td>

                    <td className="py-4 px-2.5 text-center tabular-nums font-mono font-bold text-red-600 dark:text-red-400">
                      {row.penaltyPoints > 0 ? `-${row.penaltyPoints}` : '0'}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <span className="text-xl sm:text-2xl font-teko font-bold tabular-nums text-[#1D63B8] dark:text-sky-400 leading-none tracking-wide">
                        {row.totalScore}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedSchool(row.teamId)}
                        className="btn-tactile inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
                        aria-label={`Rincian nilai ${row.schoolName}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
