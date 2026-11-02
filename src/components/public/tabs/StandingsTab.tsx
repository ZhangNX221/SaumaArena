'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { HelpCircle, ChevronLeft, ChevronRight, ListOrdered, ShieldCheck, Crown } from 'lucide-react';
import { getTeamLogoUrl } from '@/mocks/teamLogos';
import { SportCode, Match, StandingRow as AppStandingRow } from '@/types';
import { PublicPageHeader } from '../layout/PublicPageHeader';
import { usePersistentState } from '@/hooks/usePersistentState';
import { initialMatches } from '@/mocks/tournamentData';
import {
  DEFAULT_GROUP_A_STANDINGS,
  DEFAULT_GROUP_B_STANDINGS,
  DEFAULT_GROUP_C_STANDINGS,
  DEFAULT_GROUP_D_STANDINGS,
} from '@/mocks/defaultStandingsData';
import { recalculateGroupStandingsFromMatches } from '@/lib/apiSync';

interface StandingsTabProps {
  sportCode?: SportCode;
}

export const StandingsTab: React.FC<StandingsTabProps> = ({ sportCode = 'FUTSAL' }) => {
  // Akses state tersinkronisasi klasemen dari Admin & Meja Juri
  const [groupA, setGroupA] = usePersistentState<AppStandingRow[]>('sauma_arena_standings_a', DEFAULT_GROUP_A_STANDINGS);
  const [groupB, setGroupB] = usePersistentState<AppStandingRow[]>('sauma_arena_standings_b', DEFAULT_GROUP_B_STANDINGS);
  const [groupC, setGroupC] = usePersistentState<AppStandingRow[]>('sauma_arena_standings_c', DEFAULT_GROUP_C_STANDINGS);
  const [groupD, setGroupD] = usePersistentState<AppStandingRow[]>('sauma_arena_standings_d', DEFAULT_GROUP_D_STANDINGS);

  // Self-healing: bersihkan imbuhan kode grup seperti (A1), (B1), dst dan sinkronkan data tim resmi
  useEffect(() => {
    const sanitizeRow = (r: AppStandingRow) => {
      let cleaned = r.teamName.replace(/\s*\([A-D][1-4]\)\s*$/i, '').trim();
      if (cleaned.includes('KARDINA MASSA')) cleaned = 'SDI KARDINA MASSA';
      if (cleaned.includes('MIN 14 BLITAR')) cleaned = 'MIN 14 BLITAR';
      if (cleaned.includes('MAMBAUL ULUM')) cleaned = 'MI MAMBAUL ULUM BUNTARAN';
      if (cleaned.includes('BUNAYYA')) cleaned = 'MI YA BUNAYYA SRENGAT';
      return {
        ...r,
        teamName: cleaned,
      };
    };
    const needsSanitize = (list: AppStandingRow[]) =>
      list.some(
        (r) =>
          /\s*\([A-D][1-4]\)\s*$/i.test(r.teamName) ||
          r.teamName.includes('MASSA A') ||
          r.teamName.includes('MASSA B') ||
          (r.teamName.includes('BLITAR A') && r.teamId.includes('min14')) ||
          (r.teamName.includes('BLITAR B') && r.teamId.includes('min14'))
      );

    if (needsSanitize(groupA)) setGroupA((l) => l.map(sanitizeRow));
    if (needsSanitize(groupB)) setGroupB((l) => l.map(sanitizeRow));
    if (needsSanitize(groupC)) setGroupC((l) => l.map(sanitizeRow));
    if (needsSanitize(groupD)) setGroupD((l) => l.map(sanitizeRow));

    // Sinkronkan pembagian tim resmi MMFC I jika belum ada laga dimainkan
    const isUnplayed = (list: AppStandingRow[]) => list.every((r) => r.played === 0);
    const matchesTeamIds = (list: AppStandingRow[], defaults: AppStandingRow[]) =>
      list.length === defaults.length && list.every((r, i) => r.teamId === defaults[i]?.teamId);

    if (isUnplayed(groupA) && !matchesTeamIds(groupA, DEFAULT_GROUP_A_STANDINGS)) {
      setGroupA(DEFAULT_GROUP_A_STANDINGS);
    }
    if (isUnplayed(groupB) && !matchesTeamIds(groupB, DEFAULT_GROUP_B_STANDINGS)) {
      setGroupB(DEFAULT_GROUP_B_STANDINGS);
    }
    if (isUnplayed(groupC) && !matchesTeamIds(groupC, DEFAULT_GROUP_C_STANDINGS)) {
      setGroupC(DEFAULT_GROUP_C_STANDINGS);
    }
    if (isUnplayed(groupD) && !matchesTeamIds(groupD, DEFAULT_GROUP_D_STANDINGS)) {
      setGroupD(DEFAULT_GROUP_D_STANDINGS);
    }

    // Ambil snapshot klasemen resmi dari SQLite backend jika tersedia
    fetch('/api/standings')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data?.groupStandingsSnapshot) {
          const snap = res.data.groupStandingsSnapshot;
          if (snap.A && Array.isArray(snap.A) && snap.A.length > 0) setGroupA(snap.A);
          if (snap.B && Array.isArray(snap.B) && snap.B.length > 0) setGroupB(snap.B);
          if (snap.C && Array.isArray(snap.C) && snap.C.length > 0) setGroupC(snap.C);
          if (snap.D && Array.isArray(snap.D) && snap.D.length > 0) setGroupD(snap.D);
        }
      })
      .catch((err) => console.warn('[StandingsTab] Gagal fetch snapshot klasemen:', err));
  }, []);

  // Sorting dan penomoran ranking dinamis sesuai aturan resmi turnamen MMFC I:
  // Rumus PTS = (Menang × 3) + (Seri × 1) + (Point Supporter × 1)
  // 1. Poin tertinggi (PTS)
  // 2. Selisih Gol tertinggi (SG)
  // 3. Gol Dicetak terbanyak (GM)
  // 4. Point Supporter tertinggi (PS)
  const sortAndRankGroup = (rows: AppStandingRow[]) => {
    return [...(rows || [])]
      .map((r) => ({
        ...r,
        points: (r.won || 0) * 3 + (r.drawn || 0) * 1 + (Number(r.supporterPoints) || 0) * 1,
      }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return (b.supporterPoints ?? 0) - (a.supporterPoints ?? 0);
      })
      .map((row, idx) => ({ ...row, rank: idx + 1 }));
  };

  const allFutsalGroups = useMemo(() => [
    { groupName: 'Grup A', rows: sortAndRankGroup(groupA?.length ? groupA : DEFAULT_GROUP_A_STANDINGS) },
    { groupName: 'Grup B', rows: sortAndRankGroup(groupB?.length ? groupB : DEFAULT_GROUP_B_STANDINGS) },
    { groupName: 'Grup C', rows: sortAndRankGroup(groupC?.length ? groupC : DEFAULT_GROUP_C_STANDINGS) },
    { groupName: 'Grup D', rows: sortAndRankGroup(groupD?.length ? groupD : DEFAULT_GROUP_D_STANDINGS) },
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

      {/* Panduan Sistem Poin & Keterangan Klasemen Resmi */}
      <div className="rounded-2xl bg-[var(--bg-surface)] border-2 border-blue-200 dark:border-sky-800 p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1D63B8] dark:text-sky-300">
            <ShieldCheck className="w-4 h-4 text-[#1D63B8] dark:text-sky-400 shrink-0" />
            <span className="uppercase tracking-wider font-barlow text-sm">
              Sistem Poin Resmi &amp; Keterangan Klasemen Turnamen MMFC I
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono font-bold bg-blue-50 dark:bg-sky-950/60 text-[#1D63B8] dark:text-sky-300 border border-blue-300 dark:border-sky-800 w-fit">
            Rumus PTS = (M × 3) + (S × 1) + (PS × 1)
          </span>
        </div>

        {/* Kotak Rincian Penambahan Poin */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-xs">Menang (M)</span>
              <span className="text-[10px] text-[var(--text-muted)]">1x Menang</span>
            </div>
            <span className="font-teko font-bold text-2xl text-emerald-600 dark:text-emerald-400">+3</span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="font-bold text-amber-700 dark:text-amber-400 block text-xs">Seri (S)</span>
              <span className="text-[10px] text-[var(--text-muted)]">1x Hasil Seri</span>
            </div>
            <span className="font-teko font-bold text-2xl text-amber-600 dark:text-amber-400">+1</span>
          </div>

          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between">
            <div>
              <span className="font-bold text-sky-700 dark:text-sky-400 block text-xs">Point Supporter (PS)</span>
              <span className="text-[10px] text-[var(--text-muted)]">Ada Supporter</span>
            </div>
            <span className="font-teko font-bold text-2xl text-sky-600 dark:text-sky-400">+1</span>
          </div>

          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between">
            <div>
              <span className="font-bold text-red-700 dark:text-red-400 block text-xs">Kalah (K)</span>
              <span className="text-[10px] text-[var(--text-muted)]">Hasil Kalah</span>
            </div>
            <span className="font-teko font-bold text-2xl text-red-600 dark:text-red-400">0</span>
          </div>
        </div>

        {/* Legend Singkatan Kolom Lengkap */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-[var(--text-muted)] font-mono leading-relaxed">
          <span className="font-bold text-[var(--text-main)]">Keterangan Kolom:</span>{' '}
          <strong className="text-[var(--text-main)]">MN</strong>: Berapa kali Main &bull;{' '}
          <strong className="text-emerald-600 dark:text-emerald-400">M</strong>: Poin Menang (+3) &bull;{' '}
          <strong className="text-amber-600 dark:text-amber-400">S</strong>: Seri (+1) &bull;{' '}
          <strong className="text-red-600 dark:text-red-400">K</strong>: Kalah (0) &bull;{' '}
          <strong>GM-GK</strong>: Gol Masuk - Kebobolan &bull;{' '}
          <strong>SG</strong>: Selisih Gol &bull;{' '}
          <strong className="text-sky-600 dark:text-sky-400">PS</strong>: Point Supporter (+1) &bull;{' '}
          <strong className="text-[#1D63B8] dark:text-sky-400">PTS</strong>: Total Poin Klasemen
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
                Top 1 Lolos ke Semifinal
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-muted)]/50">
                    <th className="py-2 px-3 w-8 text-center" title="Peringkat">#</th>
                    <th className="py-2 px-3">Tim / Madrasah</th>
                    <th className="py-2 px-2 text-center w-8" title="Berapa kali Main">MN</th>
                    <th className="py-2 px-2 text-center w-8 text-emerald-600 dark:text-emerald-400" title="Poin Menang (+3)">M</th>
                    <th className="py-2 px-2 text-center w-8 text-amber-600 dark:text-amber-400" title="Poin Seri (+1)">S</th>
                    <th className="py-2 px-2 text-center w-8 text-red-600 dark:text-red-400" title="Kalah (0 Poin)">K</th>
                    <th className="py-2 px-2 text-center w-10" title="Gol Memasukkan - Gol Kemasukan">GM-GK</th>
                    <th className="py-2 px-2 text-center w-8" title="Selisih Gol (GM - GK)">SG</th>
                    <th className="py-2 px-2 text-center w-8 text-amber-600 dark:text-amber-400 font-bold" title="Point Supporter (+1)">PS</th>
                    <th className="py-2 px-3 text-center w-10 font-bold text-[#1D63B8] dark:text-sky-400" title="Total Poin: (M × 3) + (S × 1) + (PS × 1)">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                  {group.rows.map((row, idx) => {
                    const isQualified = idx < 1;
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
                                {row.teamName.replace(/\s*\([A-D][1-4]\)\s*$/i, '').trim()}
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)] truncate block">
                                {row.schoolName || row.teamName.replace(/\s*\([A-D][1-4]\)\s*$/i, '').trim()}
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
                          {row.supporterPoints ?? 0}
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
          </div>
        ))}
      </div>
    </div>
  );
};
