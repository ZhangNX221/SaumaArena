'use client';

import React, { useState, useMemo } from 'react';
import { HelpCircle, ChevronLeft, ChevronRight, ListOrdered, ShieldCheck, Crown } from 'lucide-react';
import { getTeamLogoUrl } from '@/mocks/teamLogos';
import { SportCode, Match, StandingRow as AppStandingRow } from '@/types';
import { PublicPageHeader } from '../layout/PublicPageHeader';
import { usePersistentState } from '@/hooks/usePersistentState';
import { initialMatches } from '@/mocks/tournamentData';
import { recalculateGroupStandingsFromMatches } from '@/lib/apiSync';

const DEFAULT_GROUP_A_STANDINGS: AppStandingRow[] = [
  { rank: 1, teamId: 'team-sdi-kardina', teamName: 'SDI KARDINA MASSA (A1)', schoolName: 'SD Islam Kardina Massa Blitar', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 2, teamId: 'team-min7-blitar', teamName: 'MIN 7 BLITAR (A2)', schoolName: 'Madrasah Ibtidaiyah Negeri 7 Blitar', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 3, teamId: 'team-min8-blitar', teamName: 'MIN 8 BLITAR (A3)', schoolName: 'Madrasah Ibtidaiyah Negeri 8 Blitar', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
];

const DEFAULT_GROUP_B_STANDINGS: AppStandingRow[] = [
  { rank: 1, teamId: 'team-sdn1-srengat', teamName: 'UPT SDN 1 SRENGAT (B1)', schoolName: 'UPT SD Negeri 1 Srengat Blitar', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 2, teamId: 'team-min14-blitar', teamName: 'MIN 14 BLITAR (B2)', schoolName: 'Madrasah Ibtidaiyah Negeri 14 Blitar', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 3, teamId: 'team-mi-mambaululum', teamName: 'MI MAMBAUL ULUM BUNTARAN TULUNGAGUNG (B3)', schoolName: 'Madrasah Ibtidaiyah Mambaul Ulum Buntaran Tulungagung', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 4, teamId: 'team-min13-b', teamName: 'MIN 13 BLITAR A (B4)', schoolName: 'Madrasah Ibtidaiyah Negeri 13 Blitar', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
];

const DEFAULT_GROUP_C_STANDINGS: AppStandingRow[] = [
  { rank: 1, teamId: 'team-min2-blitar', teamName: 'MIN 2 BLITAR (C1)', schoolName: 'Madrasah Ibtidaiyah Negeri 2 Blitar', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 2, teamId: 'team-mi-wahidhasyim', teamName: 'MI WAHID HASYIM BAKUNG (C2)', schoolName: 'Madrasah Ibtidaiyah Wahid Hasyim Bakung', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 3, teamId: 'team-min13-c', teamName: 'MIN 13 BLITAR B (C3)', schoolName: 'Madrasah Ibtidaiyah Negeri 13 Blitar', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
];

const DEFAULT_GROUP_D_STANDINGS: AppStandingRow[] = [
  { rank: 1, teamId: 'team-min5-tulungagung', teamName: 'MIN 5 TULUNGAGUNG (D4)', schoolName: 'Madrasah Ibtidaiyah Negeri 5 Tulungagung', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 2, teamId: 'team-mi-ploso', teamName: 'MI PLOSO KEDIRI (D1)', schoolName: 'Madrasah Ibtidaiyah Ploso Kediri', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 3, teamId: 'team-mi-darussalam', teamName: 'MI UNGGULAN DARUSSALAM (D2)', schoolName: 'Madrasah Ibtidaiyah Unggulan Darussalam', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 4, teamId: 'team-mi-yabunaya', teamName: 'MI YAA BUNAYYA SRENGAT (D3)', schoolName: 'Madrasah Ibtidaiyah Yaa Bunayya Srengat Blitar', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
];

interface StandingsTabProps {
  sportCode?: SportCode;
}

export const StandingsTab: React.FC<StandingsTabProps> = ({ sportCode = 'FUTSAL' }) => {
  // Akses state tersinkronisasi klasemen dari Admin & Meja Juri
  const [groupA] = usePersistentState<AppStandingRow[]>('sauma_arena_standings_a', DEFAULT_GROUP_A_STANDINGS);
  const [groupB] = usePersistentState<AppStandingRow[]>('sauma_arena_standings_b', DEFAULT_GROUP_B_STANDINGS);
  const [groupC] = usePersistentState<AppStandingRow[]>('sauma_arena_standings_c', DEFAULT_GROUP_C_STANDINGS);
  const [groupD] = usePersistentState<AppStandingRow[]>('sauma_arena_standings_d', DEFAULT_GROUP_D_STANDINGS);

  // Sorting dan penomoran ranking dinamis sesuai aturan resmi turnamen MMFC I:
  // 1. Poin tertinggi (PTS)
  // 2. Selisih Gol tertinggi (SG)
  // 3. Gol Dicetak terbanyak (GM)
  // 4. Point Supporter tertinggi (PS)
  const sortAndRankGroup = (rows: AppStandingRow[]) => {
    return [...(rows || [])]
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return (b.supporterPoints ?? 0) - (a.supporterPoints ?? 0);
      })
      .map((row, idx) => ({ ...row, rank: idx + 1 }));
  };

  const allFutsalGroups = useMemo(() => [
    { groupName: 'Grup A', rows: sortAndRankGroup(groupA) },
    { groupName: 'Grup B', rows: sortAndRankGroup(groupB) },
    { groupName: 'Grup C', rows: sortAndRankGroup(groupC) },
    { groupName: 'Grup D', rows: sortAndRankGroup(groupD) },
  ], [groupA, groupB, groupC, groupD]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-6">
      {/* Public Page Header */}
      <PublicPageHeader
        icon={ListOrdered}
        category={`PERINGKAT FASE GRUP • ${sportCode}`}
        title="Klasemen & Kualifikasi"
        description="Perolehan poin, selisih gol, rekor kemenangan, dan penentuan juara grup yang melaju ke babak semifinal."
      />

      {/* Two-Stage Verification Notice */}
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-sky-950/40 border-2 border-blue-200 dark:border-sky-800 text-[var(--text-main)] text-xs flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-4 h-4 text-[#1D63B8] dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-[#1D63B8] dark:text-sky-300 block text-xs">
            Klasemen Tersinkronisasi Real-Time dengan Meja Wasit Lapangan
          </span>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            Perolehan menang, seri, kalah, selisih gol, dan poin klasemen dihitung secara otomatis setiap kali skor pertandingan diperbarui oleh wasit atau admin turnamen MMFC I.
          </p>
        </div>
      </div>

      {/* Group Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allFutsalGroups.map((group) => (
          <div
            key={group.groupName}
            className="rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-[var(--bg-surface)] shadow-xs overflow-hidden"
          >
            {/* Table Header Strip */}
            <div className="px-4 py-3 bg-[var(--bg-muted)] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1D63B8]" />
                <h3 className="font-bold text-sm text-[var(--text-main)] font-[var(--font-display)] tracking-wide">
                  {group.groupName}
                </h3>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">
                Top 2 Lolos ke Semifinal
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-muted)]/50">
                    <th className="py-2 px-3 w-8 text-center" title="Peringkat">#</th>
                    <th className="py-2 px-3">Tim / Madrasah</th>
                    <th className="py-2 px-2 text-center w-8" title="Main / Pertandingan Dimainkan">MN</th>
                    <th className="py-2 px-2 text-center w-8 text-emerald-600 dark:text-emerald-400" title="Menang (+3 Poin)">M</th>
                    <th className="py-2 px-2 text-center w-8 text-amber-600 dark:text-amber-400" title="Seri (+1 Poin)">S</th>
                    <th className="py-2 px-2 text-center w-8 text-red-600 dark:text-red-400" title="Kalah (0 Poin)">K</th>
                    <th className="py-2 px-2 text-center w-10" title="Gol Dicetak - Gol Kebobolan">GM-GK</th>
                    <th className="py-2 px-2 text-center w-8" title="Selisih Gol (GM - GK)">SG</th>
                    <th className="py-2 px-2 text-center w-8 text-amber-600 dark:text-amber-400 font-bold" title="Point Supporter">PS</th>
                    <th className="py-2 px-3 text-center w-10 font-bold text-[#1D63B8] dark:text-sky-400" title="Total Poin Klasemen">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                  {group.rows.map((row, idx) => {
                    const isQualified = idx < 2;
                    return (
                      <tr
                        key={row.teamId}
                        className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                          isQualified ? 'bg-emerald-500/5' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-xs">
                          {isQualified ? (
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white inline-flex items-center justify-center text-[10px]">
                              {row.rank}
                            </span>
                          ) : (
                            <span className="text-[var(--text-muted)]">{row.rank}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={getTeamLogoUrl(row.teamId)}
                              alt={row.teamName}
                              className="w-5 h-5 object-contain shrink-0 rounded-xs"
                            />
                            <div className="truncate max-w-[140px] sm:max-w-[180px]">
                              <span className="font-bold text-[var(--text-main)] block truncate">
                                {row.teamName}
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)] truncate block">
                                {row.schoolName || row.teamName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-[var(--text-muted)]">{row.played}</td>
                        <td className="py-2.5 px-2 text-center font-mono text-[var(--text-muted)]">{row.won}</td>
                        <td className="py-2.5 px-2 text-center font-mono text-[var(--text-muted)]">{row.drawn}</td>
                        <td className="py-2.5 px-2 text-center font-mono text-[var(--text-muted)]">{row.lost}</td>
                        <td className="py-2.5 px-2 text-center font-mono text-[10px] text-[var(--text-muted)]">
                          {row.goalsFor}-{row.goalsAgainst}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-[var(--text-muted)]">
                          {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-[10px] text-amber-600 font-bold">
                          {row.supporterPoints || 100}
                        </td>
                        <td className="py-2.5 px-3 text-center font-scoreboard font-bold text-sm text-[#1D63B8] dark:text-sky-400">
                          {row.points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Zona Lolos Semifinal (Top 2 Grup)</span>
              </div>
              <span>MN: Main • M: Menang • S: Seri • K: Kalah • PS: Point Supporter</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
