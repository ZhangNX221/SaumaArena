'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { getTeamLogoUrl } from '@/mocks/teamLogos';

export interface SupporterLeaderboardRow {
  teamId: string;
  schoolName: string;
  shortName: string;
  logoUrl?: string;
  p1Points: number; // 1. Maskot (+20)
  p2Points: number; // 2. Seragam (+15)
  p3Points: number; // 3. Yel-yel (+10)
  p4Points: number; // 4. Tiket (+1)
  p5Points?: number;
  s1Points: number; // 1. Ricuh (-50)
  s2Points: number; // 2. Lempar (-25)
  s3Points: number; // 3. Rasis (-15)
  s4Points: number; // 4. Barang dilarang (-5)
  s5Points?: number;
  penaltyPoints: number;
  totalScore: number;
  matchCount: number;
}

interface SupporterDesktopTableProps {
  leaderboard: SupporterLeaderboardRow[];
  onSelectSchool: (teamId: string) => void;
}

export const SupporterDesktopTable: React.FC<SupporterDesktopTableProps> = ({
  leaderboard,
  onSelectSchool,
}) => {
  return (
    <div className="hidden sm:block overflow-x-auto rounded-xl border-2 border-slate-300 dark:border-slate-800 bg-[var(--bg-surface)] shadow-sm">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-300 dark:border-slate-800 bg-[var(--bg-muted)] text-[var(--text-muted)] font-bold uppercase tracking-wider text-xs font-barlow">
            <th className="py-3 px-3 w-12 text-center">Pos</th>
            <th className="py-3 px-4 min-w-[200px] sticky left-0 bg-[var(--bg-muted)] sm:static">Sekolah Suporter</th>
            <th className="py-3 px-2 text-center">Laga</th>

            {/* 4 Kriteria Positif */}
            <th className="py-3 px-2 text-center" title="Membawa maskot sekolah (+20)">
              <div className="flex flex-col items-center">
                <span className="w-5 h-5 rounded-md bg-[var(--bg-surface)] border border-slate-300 dark:border-slate-700 text-[#1D63B8] dark:text-sky-400 font-black text-[11px] flex items-center justify-center shadow-2xs font-mono">1</span>
                <span className="text-[10px] text-[var(--text-muted)] font-bold mt-0.5 font-barlow uppercase">Maskot</span>
              </div>
            </th>
            <th className="py-3 px-2 text-center" title="Menggunakan seragam supporter (+15)">
              <div className="flex flex-col items-center">
                <span className="w-5 h-5 rounded-md bg-[var(--bg-surface)] border border-slate-300 dark:border-slate-700 text-[#1D63B8] dark:text-sky-400 font-black text-[11px] flex items-center justify-center shadow-2xs font-mono">2</span>
                <span className="text-[10px] text-[var(--text-muted)] font-bold mt-0.5 font-barlow uppercase">Seragam</span>
              </div>
            </th>
            <th className="py-3 px-2 text-center" title="Menyanyikan yel yel minimal 2 (+10)">
              <div className="flex flex-col items-center">
                <span className="w-5 h-5 rounded-md bg-[var(--bg-surface)] border border-slate-300 dark:border-slate-700 text-[#1D63B8] dark:text-sky-400 font-black text-[11px] flex items-center justify-center shadow-2xs font-mono">3</span>
                <span className="text-[10px] text-[var(--text-muted)] font-bold mt-0.5 font-barlow uppercase">Yel-yel</span>
              </div>
            </th>
            <th className="py-3 px-2 text-center" title="Jumlah tiket kehadiran supporter (di atas 50) (+1 / Match)">
              <div className="flex flex-col items-center">
                <span className="w-5 h-5 rounded-md bg-[var(--bg-surface)] border border-slate-300 dark:border-slate-700 text-[var(--color-arena-accent)] font-black text-[11px] flex items-center justify-center shadow-2xs font-mono">4</span>
                <span className="text-[10px] text-[var(--text-muted)] font-bold mt-0.5 font-barlow uppercase">Tiket</span>
              </div>
            </th>

            {/* 4 Kriteria Sanksi (Sesuai Ketentuan Baru) */}
            <th className="py-3 px-2 text-center" title="Membuat kericuhan, kekerasan dll (-50)">
              <div className="flex flex-col items-center">
                <span className="px-1 min-w-[20px] h-5 rounded-md bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 font-black text-[9px] flex items-center justify-center shadow-2xs font-mono">-50</span>
                <span className="text-[10px] text-red-600 dark:text-red-400 font-bold mt-0.5 font-barlow uppercase">Ricuh</span>
              </div>
            </th>
            <th className="py-3 px-2 text-center" title="Melempar benda ke dalam lapangan (-25)">
              <div className="flex flex-col items-center">
                <span className="px-1 min-w-[20px] h-5 rounded-md bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 font-black text-[9px] flex items-center justify-center shadow-2xs font-mono">-25</span>
                <span className="text-[10px] text-red-600 dark:text-red-400 font-bold mt-0.5 font-barlow uppercase">Lempar</span>
              </div>
            </th>
            <th className="py-3 px-2 text-center" title="Melakukan rasis/provokasi (-15)">
              <div className="flex flex-col items-center">
                <span className="px-1 min-w-[20px] h-5 rounded-md bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 font-black text-[9px] flex items-center justify-center shadow-2xs font-mono">-15</span>
                <span className="text-[10px] text-red-600 dark:text-red-400 font-bold mt-0.5 font-barlow uppercase">Rasis</span>
              </div>
            </th>
            <th className="py-3 px-2 text-center" title="Membawa atau menyelundupkan barang yang dilarang (-5)">
              <div className="flex flex-col items-center">
                <span className="px-1 min-w-[20px] h-5 rounded-md bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 font-black text-[9px] flex items-center justify-center shadow-2xs font-mono">-5</span>
                <span className="text-[10px] text-red-600 dark:text-red-400 font-bold mt-0.5 font-barlow uppercase">Barang</span>
              </div>
            </th>

            {/* Total Sanksi */}
            <th className="py-3 px-2 text-center text-red-600 dark:text-red-400" title="Total Akumulasi Sanksi">
              <div className="flex flex-col items-center">
                <span className="px-1 min-w-[20px] h-5 rounded-md bg-red-500/20 border border-red-500/40 text-red-600 dark:text-red-400 font-black text-[10px] flex items-center justify-center shadow-2xs font-mono">∑</span>
                <span className="text-[10px] text-red-600 dark:text-red-400 font-bold mt-0.5 font-barlow uppercase">Sanksi</span>
              </div>
            </th>

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

                {/* 4 Positif */}
                <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-[var(--text-main)]">
                  +{row.p1Points}
                </td>
                <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-[var(--text-main)]">
                  +{row.p2Points}
                </td>
                <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-[var(--text-main)]">
                  +{row.p3Points}
                </td>
                <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  +{row.p4Points}
                </td>

                {/* 4 Sanksi */}
                <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-red-600 dark:text-red-400">
                  {row.s1Points > 0 ? `-${row.s1Points}` : '0'}
                </td>
                <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-red-600 dark:text-red-400">
                  {row.s2Points > 0 ? `-${row.s2Points}` : '0'}
                </td>
                <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-red-600 dark:text-red-400">
                  {row.s3Points > 0 ? `-${row.s3Points}` : '0'}
                </td>
                <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-red-600 dark:text-red-400">
                  {row.s4Points > 0 ? `-${row.s4Points}` : '0'}
                </td>

                {/* Total Sanksi */}
                <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-red-600 dark:text-red-400 bg-red-500/5">
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
                    onClick={() => onSelectSchool(row.teamId)}
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
  );
};

