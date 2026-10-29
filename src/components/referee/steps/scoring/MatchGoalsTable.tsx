'use client';

import React, { useMemo } from 'react';
import { Undo2, Trophy } from 'lucide-react';
import { MatchEvent } from '@/types';

interface MatchGoalsTableProps {
  teamAName: string;
  teamBName: string;
  teamAId: string;
  teamBId: string;
  events?: MatchEvent[];
  onUndoLastEvent?: () => void;
  onUndoTeamGoal?: (team: 'A' | 'B', eventId?: string) => void;
}

export const MatchGoalsTable: React.FC<MatchGoalsTableProps> = ({
  teamAName,
  teamBName,
  teamAId,
  teamBId,
  events = [],
  onUndoLastEvent,
  onUndoTeamGoal,
}) => {
  // Goals for Team A (chronological order)
  const goalsA = useMemo(() => {
    const firstWordA = teamAName.split(' ')[0].toLowerCase();
    return events
      .filter((e) => {
        if (e.type !== 'GOAL') return false;
        if (e.teamId === teamAId) return true;
        const nameLower = (e.playerName || '').toLowerCase();
        return nameLower.includes('tim a') || nameLower.includes(firstWordA);
      })
      .slice()
      .reverse();
  }, [events, teamAId, teamAName]);

  // Goals for Team B (chronological order)
  const goalsB = useMemo(() => {
    const firstWordB = teamBName.split(' ')[0].toLowerCase();
    return events
      .filter((e) => {
        if (e.type !== 'GOAL') return false;
        if (e.teamId === teamBId) return true;
        const nameLower = (e.playerName || '').toLowerCase();
        return nameLower.includes('tim b') || nameLower.includes(firstWordB);
      })
      .slice()
      .reverse();
  }, [events, teamBId, teamBName]);

  const handleCancelGoal = (teamKey: 'A' | 'B', eventId?: string) => {
    if (onUndoTeamGoal) {
      onUndoTeamGoal(teamKey, eventId);
    } else if (onUndoLastEvent) {
      onUndoLastEvent();
    }
  };

  const renderTeamGoalTable = (
    teamName: string,
    goals: MatchEvent[],
    sideColor: string,
    badgeBg: string,
    teamKey: 'A' | 'B'
  ) => (
    <div className="flex-1 rounded-xl bg-[var(--bg-surface)] border border-slate-300 dark:border-slate-800 overflow-hidden flex flex-col shadow-xs">
      {/* Table Header Pill with Team-Specific Undo Button */}
      <div className="flex items-center justify-between px-3 py-2 bg-[var(--bg-muted)] border-b border-slate-200 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-full ${sideColor} shrink-0`} />
          <span className="font-barlow font-bold text-xs uppercase tracking-wide text-[var(--text-main)] truncate">
            {teamName}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${badgeBg} border border-slate-300 dark:border-slate-700 shrink-0`}
          >
            {goals.length} Gol
          </span>

          {goals.length > 0 && (
            <button
              type="button"
              onClick={() => handleCancelGoal(teamKey)}
              className="btn-tactile flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 active:scale-95 text-rose-700 dark:text-rose-300 text-[10px] font-barlow font-bold uppercase tracking-wider border border-rose-300 dark:border-rose-800 transition-all shrink-0 cursor-pointer"
              title={`Batalkan gol terakhir ${teamName}`}
            >
              <Undo2 className="w-2.5 h-2.5" />
              <span>Batalkan</span>
            </button>
          )}
        </div>
      </div>

      {/* Goal Records Table */}
      <div className="overflow-x-auto max-h-40 overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[var(--bg-muted)]/50 text-[var(--text-muted)] font-barlow font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <th className="py-1 px-2.5 w-8 text-center">#</th>
              <th className="py-1 px-2.5 w-16">Menit</th>
              <th className="py-1 px-2.5">Pencetak / Detail</th>
              <th className="py-1 px-2.5 w-20 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {goals.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-3 px-2 text-center text-[var(--text-muted)] font-sans italic text-[11px]"
                >
                  Belum ada gol tercatat
                </td>
              </tr>
            ) : (
              goals.map((g, idx) => (
                <tr
                  key={g.id || `goal-${idx}`}
                  className="hover:bg-[var(--bg-muted)]/50 transition-colors"
                >
                  <td className="py-1 px-2.5 text-center font-mono text-[11px] text-[var(--text-muted)] font-semibold">
                    {idx + 1}
                  </td>
                  <td className="py-1 px-2.5 font-mono text-[11px] text-[#1D63B8] dark:text-sky-400 font-bold">
                    {g.minute}&apos;
                  </td>
                  <td className="py-1 px-2.5 text-[var(--text-main)] text-xs font-sans truncate max-w-[140px]">
                    {g.playerName || g.detail || 'Gol Lapangan'}
                  </td>
                  <td className="py-1 px-2.5 text-center">
                    <div className="inline-flex items-center gap-1">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-barlow font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        GOL
                      </span>
                      {onUndoTeamGoal && (
                        <button
                          type="button"
                          onClick={() => handleCancelGoal(teamKey, g.id)}
                          className="p-0.5 text-[var(--text-muted)] hover:text-rose-600 rounded transition-colors cursor-pointer"
                          title={`Batalkan gol menit ke-${g.minute}`}
                          aria-label="Batalkan gol"
                        >
                          <Undo2 className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-[var(--color-arena-accent)]" />
          <span className="font-bebas text-sm sm:text-base uppercase tracking-wider text-[var(--text-main)] leading-none">
            Riwayat Gol Pertandingan
          </span>
        </div>

        <span className="text-[11px] text-[var(--text-muted)] font-sans">
          Total: <strong className="text-[var(--color-arena-accent)]">{goalsA.length + goalsB.length}</strong> Gol
        </span>
      </div>

      {/* 2 Tables: Side-by-side for each team with their own undo buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {renderTeamGoalTable(
          teamAName,
          goalsA,
          'bg-[#1D63B8]',
          'bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300',
          'A'
        )}
        {renderTeamGoalTable(
          teamBName,
          goalsB,
          'bg-[var(--color-arena-accent)]',
          'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300',
          'B'
        )}
      </div>
    </div>
  );
};
