'use client';

import React from 'react';
import { Trophy } from 'lucide-react';

export interface TopScorerItem {
  id: string;
  name: string;
  teamName: string;
  schoolName: string;
  goals: number;
}

interface StatsTopScorersCardProps {
  topScorers: TopScorerItem[];
}

export const StatsTopScorersCard: React.FC<StatsTopScorersCardProps> = ({ topScorers }) => {
  return (
    <div className="p-5 sm:p-6 rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <h4 className="font-bebas text-lg sm:text-xl text-[var(--text-main)] uppercase tracking-wide">
            Peringkat Top Scorer Turnamen &bull; Sepatu Emas
          </h4>
        </div>
        <span className="text-xs font-mono text-[var(--text-muted)]">Top 5 Pencetak Gol</span>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {topScorers.map((player, idx) => (
          <div key={player.id} className="py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`w-7 h-7 rounded-lg font-mono font-black text-xs flex items-center justify-center shrink-0 ${
                  idx === 0
                    ? 'bg-[var(--color-arena-accent)] text-slate-950 shadow-xs'
                    : idx === 1
                    ? 'bg-slate-200 dark:bg-slate-700 text-[var(--text-main)]'
                    : idx === 2
                    ? 'bg-amber-700/20 text-amber-800 dark:text-amber-300'
                    : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
                }`}
              >
                {idx + 1}
              </span>

              <div className="min-w-0">
                <span className="font-barlow font-bold text-sm text-[var(--text-main)] block truncate">
                  {player.name}
                </span>
                <span className="text-[11px] text-[var(--text-muted)] block truncate font-sans">
                  {player.teamName} &bull; {player.schoolName}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="font-teko font-bold text-2xl text-[#1D63B8] dark:text-sky-400 tabular-nums leading-none block">
                {player.goals}
              </span>
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Gol
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

