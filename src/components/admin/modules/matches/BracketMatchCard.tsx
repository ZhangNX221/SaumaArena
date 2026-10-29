'use client';

import React from 'react';
import { BracketMatch } from '@/mocks/bracketData';
import { initialTeams } from '@/mocks/tournamentData';

interface TeamDropdownProps {
  currentId: string;
  currentName: string;
  onSelect: (id: string) => void;
}

export const TeamDropdown: React.FC<TeamDropdownProps> = ({
  currentId,
  currentName,
  onSelect,
}) => {
  const isTbd = currentId.startsWith('tbd') || !currentId;

  return (
    <select
      value={isTbd ? '' : currentId}
      onChange={(e) => onSelect(e.target.value)}
      className="w-full text-xs font-semibold px-2 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--color-arena-primary)] cursor-pointer truncate"
    >
      <option value="">{isTbd ? currentName : '-- Ganti Pilihan Tim --'}</option>
      <optgroup label="Grup A">
        {initialTeams.filter((t) => t.group === 'A').map((t) => (
          <option key={t.id} value={t.id}>{t.name} (Grup A)</option>
        ))}
      </optgroup>
      <optgroup label="Grup B">
        {initialTeams.filter((t) => t.group === 'B').map((t) => (
          <option key={t.id} value={t.id}>{t.name} (Grup B)</option>
        ))}
      </optgroup>
      <optgroup label="Grup C">
        {initialTeams.filter((t) => t.group === 'C').map((t) => (
          <option key={t.id} value={t.id}>{t.name} (Grup C)</option>
        ))}
      </optgroup>
      <optgroup label="Grup D">
        {initialTeams.filter((t) => t.group === 'D').map((t) => (
          <option key={t.id} value={t.id}>{t.name} (Grup D)</option>
        ))}
      </optgroup>
    </select>
  );
};

interface BracketMatchCardProps {
  node: BracketMatch;
  stage: 'QF' | 'SF' | 'GF';
  accentColor: string;
  onTeamChange: (stage: 'QF' | 'SF' | 'GF', matchId: string, slot: 'teamA' | 'teamB', teamId: string) => void;
  onScoreChange: (stage: 'QF' | 'SF' | 'GF', matchId: string, slot: 'teamA' | 'teamB', score: number) => void;
  onSetWinner: (stage: 'QF' | 'SF' | 'GF', matchId: string, winnerSlot: 'teamA' | 'teamB') => void;
}

export const BracketMatchCard: React.FC<BracketMatchCardProps> = ({
  node,
  stage,
  accentColor,
  onTeamChange,
  onScoreChange,
  onSetWinner,
}) => {
  return (
    <div
      key={node.id}
      className={`p-3.5 rounded-xl border bg-[var(--bg-muted)]/40 space-y-2.5 shadow-2xs transition-all ${
        node.status === 'COMPLETED' ? 'border-emerald-500/30' : 'border-[var(--border-subtle)]'
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-1.5">
        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${accentColor}`}>
          {node.stageName}
        </span>
        <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[120px]">
          {node.schedule}
        </span>
      </div>

      {/* Tim A */}
      <div
        className={`p-2 rounded-lg border transition-all ${
          node.teamA.isWinner
            ? 'bg-emerald-500/10 border-emerald-500/40 text-[var(--text-main)]'
            : 'bg-[var(--bg-surface)] border-[var(--border-subtle)]'
        }`}
      >
        <div className="flex items-center gap-1.5 justify-between">
          <div className="flex-1 min-w-0">
            <TeamDropdown
              currentId={node.teamA.id}
              currentName={node.teamA.name}
              onSelect={(id) => onTeamChange(stage, node.id, 'teamA', id)}
            />
          </div>
          <input
            type="number"
            min={0}
            value={node.teamA.score}
            onChange={(e) =>
              onScoreChange(stage, node.id, 'teamA', parseInt(e.target.value) || 0)
            }
            className="w-10 text-center font-teko font-bold text-base px-1 py-1 rounded bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--color-arena-accent)] shrink-0"
            title="Skor Tim A"
          />
          <button
            type="button"
            onClick={() => onSetWinner(stage, node.id, 'teamA')}
            className={`px-2 py-1 rounded text-[10px] font-barlow font-bold uppercase tracking-wider shrink-0 transition-all ${
              node.teamA.isWinner
                ? 'bg-emerald-500 text-slate-950 font-black shadow-2xs'
                : 'bg-[var(--bg-muted)] hover:bg-emerald-500/20 text-[var(--text-muted)] hover:text-emerald-400 border border-[var(--border-subtle)]'
            }`}
            title="Tandai Sebagai Pemenang Laga"
          >
            {node.teamA.isWinner ? '✓ Menang' : 'Menang'}
          </button>
        </div>
      </div>

      {/* Tim B */}
      <div
        className={`p-2 rounded-lg border transition-all ${
          node.teamB.isWinner
            ? 'bg-emerald-500/10 border-emerald-500/40 text-[var(--text-main)]'
            : 'bg-[var(--bg-surface)] border-[var(--border-subtle)]'
        }`}
      >
        <div className="flex items-center gap-1.5 justify-between">
          <div className="flex-1 min-w-0">
            <TeamDropdown
              currentId={node.teamB.id}
              currentName={node.teamB.name}
              onSelect={(id) => onTeamChange(stage, node.id, 'teamB', id)}
            />
          </div>
          <input
            type="number"
            min={0}
            value={node.teamB.score}
            onChange={(e) =>
              onScoreChange(stage, node.id, 'teamB', parseInt(e.target.value) || 0)
            }
            className="w-10 text-center font-teko font-bold text-base px-1 py-1 rounded bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--color-arena-accent)] shrink-0"
            title="Skor Tim B"
          />
          <button
            type="button"
            onClick={() => onSetWinner(stage, node.id, 'teamB')}
            className={`px-2 py-1 rounded text-[10px] font-barlow font-bold uppercase tracking-wider shrink-0 transition-all ${
              node.teamB.isWinner
                ? 'bg-emerald-500 text-slate-950 font-black shadow-2xs'
                : 'bg-[var(--bg-muted)] hover:bg-emerald-500/20 text-[var(--text-muted)] hover:text-emerald-400 border border-[var(--border-subtle)]'
            }`}
            title="Tandai Sebagai Pemenang Laga"
          >
            {node.teamB.isWinner ? '✓ Menang' : 'Menang'}
          </button>
        </div>
      </div>
    </div>
  );
};

