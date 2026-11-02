'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export interface CleanSheetTeamItem {
  id: string;
  name: string;
  logoUrl?: string;
  group?: string;
  cleanSheets: number;
  goalsConceded: number;
  csPercentage: number;
}

interface StatsCleanSheetCardProps {
  cleanSheetTeams: CleanSheetTeamItem[];
}

export const StatsCleanSheetCard: React.FC<StatsCleanSheetCardProps> = ({ cleanSheetTeams }) => {
  return (
    <div className="p-5 sm:p-6 rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <h4 className="font-bebas text-lg sm:text-xl text-[var(--text-main)] uppercase tracking-wide">
            Rekap Pertahanan Terbaik &bull; Clean Sheet Tim
          </h4>
        </div>
        <span className="text-xs font-mono text-[var(--text-muted)]">Nirbobol Sempurna</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cleanSheetTeams.map((team) => (
          <div
            key={team.id}
            className="p-3.5 rounded-xl bg-[var(--bg-muted)]/70 border border-[var(--border-subtle)] flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center p-1 shrink-0 overflow-hidden">
                {team.logoUrl ? (
                  <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                    {team.name.slice(0, 2)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <span className="font-barlow font-bold text-xs text-[var(--text-main)] block truncate">
                  {team.name}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] truncate block">
                  Grup {team.group || '-'}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                {team.cleanSheets} Nirbobol
              </span>
              <span className="text-[9px] font-mono text-[var(--text-muted)]">
                {team.goalsConceded} Kebobolan ({team.csPercentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

