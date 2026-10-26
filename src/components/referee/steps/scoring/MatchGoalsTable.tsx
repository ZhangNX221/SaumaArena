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
    <div className="flex-1 rounded-xl bg-[#07131F] border border-[#1C3B5B] overflow-hidden flex flex-col">
      {/* Table Header Pill with Team-Specific Undo Button */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0D1E30] border-b border-[#1C3B5B] gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`w-2 h-2 rounded-full ${sideColor} shrink-0`} />
          <span className="font-barlow font-bold text-xs uppercase tracking-wide text-white truncate">
            {teamName}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${badgeBg} border border-white/10 shrink-0`}
          >
            {goals.length} Gol
          </span>

          {goals.length > 0 && (
            <button
              type="button"
              onClick={() => handleCancelGoal(teamKey)}
              className="btn-tactile flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-600/15 hover:bg-rose-600/25 active:scale-95 text-rose-300 text-[10px] font-barlow font-bold uppercase tracking-wider border border-rose-500/30 transition-all shrink-0"
              title={`Batalkan gol terakhir ${teamName}`}
            >
              <Undo2 className="w-2.5 h-2.5" />
              <span>Batalkan Terakhir</span>
            </button>
          )}
        </div>
      </div>

      {/* Goal Records Table */}
      <div className="overflow-x-auto max-h-36 overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#091827] text-slate-400 font-barlow font-bold uppercase text-[10px] tracking-wider border-b border-[#1C3B5B]/70">
              <th className="py-1 px-2.5 w-8 text-center">#</th>
              <th className="py-1 px-2.5 w-16">Menit</th>
              <th className="py-1 px-2.5">Pencetak / Detail</th>
              <th className="py-1 px-2.5 w-20 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C3B5B]/40">
            {goals.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-3 px-2 text-center text-slate-500 font-sans italic text-[11px]"
                >
                  Belum ada gol tercatat
                </td>
              </tr>
            ) : (
              goals.map((g, idx) => (
                <tr
                  key={g.id || `goal-${idx}`}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-1 px-2.5 text-center font-mono text-[11px] text-slate-400 font-semibold">
                    {idx + 1}
                  </td>
                  <td className="py-1 px-2.5 font-mono text-[11px] text-[#F6AE2D] font-bold">
                    {g.minute}&apos;
                  </td>
                  <td className="py-1 px-2.5 text-slate-200 text-xs font-sans truncate max-w-[140px]">
                    {g.playerName || g.detail || 'Gol Lapangan'}
                  </td>
                  <td className="py-1 px-2.5 text-center">
                    <div className="inline-flex items-center gap-1">
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-barlow font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        GOL
                      </span>
                      {onUndoTeamGoal && (
                        <button
                          type="button"
                          onClick={() => handleCancelGoal(teamKey, g.id)}
                          className="p-0.5 text-slate-400 hover:text-rose-300 hover:bg-rose-500/20 rounded transition-colors"
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
    <div className="pt-2 border-t border-[#1C3B5B] space-y-2">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-[#F6AE2D]" />
          <span className="font-bebas text-sm sm:text-base uppercase tracking-wider text-white leading-none">
            Riwayat Gol Pertandingan
          </span>
        </div>

        <span className="text-[11px] text-slate-400 font-sans">
          Total: <strong className="text-[#F6AE2D]">{goalsA.length + goalsB.length}</strong> Gol
        </span>
      </div>

      {/* 2 Tables: Side-by-side for each team with their own undo buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {renderTeamGoalTable(
          teamAName,
          goalsA,
          'bg-[var(--color-arena-primary)]',
          'bg-[var(--color-arena-primary)]/20 text-blue-300',
          'A'
        )}
        {renderTeamGoalTable(
          teamBName,
          goalsB,
          'bg-[#F6AE2D]',
          'bg-[#F6AE2D]/20 text-amber-300',
          'B'
        )}
      </div>
    </div>
  );
};
