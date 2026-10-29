'use client';

import React from 'react';
import { Trophy } from 'lucide-react';
import { Match, MatchEvent } from '@/types';

interface LiveMatchGoalHistoryProps {
  match: Match;
  scoreA: number;
  scoreB: number;
  totalGoals: number;
  events: MatchEvent[];
}

export const LiveMatchGoalHistory: React.FC<LiveMatchGoalHistoryProps> = ({
  match,
  scoreA,
  scoreB,
  totalGoals,
  events,
}) => {
  const teamAGoals = events.filter((e) => e.type === 'GOAL' && e.teamId === match.teamAId);
  const teamBGoals = events.filter((e) => e.type === 'GOAL' && e.teamId === match.teamBId);

  return (
    <div className="rounded-2xl bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)] p-4 sm:p-5 shadow-xs space-y-3.5 transition-colors duration-150">
      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[var(--color-arena-accent)]" />
          <h3 className="font-bebas text-base uppercase tracking-wider text-[var(--text-main)]">
            Riwayat Gol Pertandingan
          </h3>
        </div>
        <span className="text-xs font-mono text-[var(--text-muted)] font-bold">
          Total: <strong className="text-[var(--color-arena-accent)]">{totalGoals} Gol</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-start">
        {/* Sisi Tim A */}
        <div className="rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] p-3 space-y-2 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-barlow font-bold text-xs uppercase tracking-wide text-[var(--text-main)]">
                {match.teamAName}
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-mono font-bold">
              {scoreA} Gol
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] font-barlow font-bold uppercase text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                  <th className="py-1.5 px-2 w-6 text-center">#</th>
                  <th className="py-1.5 px-2 w-16">Menit</th>
                  <th className="py-1.5 px-2">Pencetak / Detail</th>
                  <th className="py-1.5 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]/60 font-medium">
                {teamAGoals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-[var(--text-muted)] text-xs">
                      Belum ada gol tercatat
                    </td>
                  </tr>
                ) : (
                  teamAGoals.map((ev, idx) => (
                    <tr key={ev.id || idx} className="hover:bg-[var(--bg-surface)]/80 transition-colors">
                      <td className="py-2 px-2 text-center font-mono text-[var(--text-muted)]">{idx + 1}</td>
                      <td className="py-2 px-2 font-mono font-bold text-amber-600 dark:text-amber-400">{ev.minute}&apos;</td>
                      <td className="py-2 px-2 font-barlow font-bold text-[var(--text-main)] text-xs">{ev.playerName}</td>
                      <td className="py-2 px-2 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 text-[9px] font-mono font-bold uppercase tracking-wider">
                          GOL
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sisi Tim B */}
        <div className="rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] p-3 space-y-2 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="font-barlow font-bold text-xs uppercase tracking-wide text-[var(--text-main)]">
                {match.teamBName}
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold">
              {scoreB} Gol
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] font-barlow font-bold uppercase text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                  <th className="py-1.5 px-2 w-6 text-center">#</th>
                  <th className="py-1.5 px-2 w-16">Menit</th>
                  <th className="py-1.5 px-2">Pencetak / Detail</th>
                  <th className="py-1.5 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]/60 font-medium">
                {teamBGoals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-[var(--text-muted)] text-xs">
                      Belum ada gol tercatat
                    </td>
                  </tr>
                ) : (
                  teamBGoals.map((ev, idx) => (
                    <tr key={ev.id || idx} className="hover:bg-[var(--bg-surface)]/80 transition-colors">
                      <td className="py-2 px-2 text-center font-mono text-[var(--text-muted)]">{idx + 1}</td>
                      <td className="py-2 px-2 font-mono font-bold text-amber-600 dark:text-amber-400">{ev.minute}&apos;</td>
                      <td className="py-2 px-2 font-barlow font-bold text-[var(--text-main)] text-xs">{ev.playerName}</td>
                      <td className="py-2 px-2 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 text-[9px] font-mono font-bold uppercase tracking-wider">
                          GOL
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
