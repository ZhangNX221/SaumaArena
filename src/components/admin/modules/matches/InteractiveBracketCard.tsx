'use client';

import React from 'react';
import { Settings2 } from 'lucide-react';
import { BracketMatch } from '@/mocks/bracketData';
import { getTeamLogoUrl } from '@/mocks/teamLogos';

interface InteractiveBracketCardProps {
  match: BracketMatch;
  isHighlighted?: boolean;
  className?: string;
  onClick?: () => void;
}

export const InteractiveBracketCard: React.FC<InteractiveBracketCardProps> = ({
  match: m,
  isHighlighted = false,
  className = '',
  onClick,
}) => {
  return (
    <div
      key={m.id}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`group w-full rounded-2xl transition-all duration-150 p-3.5 space-y-2.5 shadow-sm cursor-pointer select-none relative ${
        isHighlighted
          ? 'bg-[#091325]/95 border-2 border-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.18)] hover:border-sky-300 hover:shadow-[0_0_25px_rgba(14,165,233,0.3)]'
          : 'bg-[#0a1222]/90 border border-slate-800/80 hover:border-sky-500/70 hover:bg-[#0c162b]'
      } ${className}`}
    >
      {/* Header bar: Stage name & Schedule */}
      <div className="flex items-center justify-between text-[11px] font-mono pb-1 border-b border-slate-800/60">
        <span className="font-barlow font-bold uppercase tracking-wider text-sky-400 group-hover:text-sky-300 transition-colors">
          {m.stageCode}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 truncate max-w-[130px] text-[10px]">
            {m.schedule}
          </span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded bg-sky-500/20 text-sky-300">
            <Settings2 className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Teams list */}
      <div className="space-y-1.5 text-xs">
        {/* Team A */}
        <div
          className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border transition-colors ${
            m.teamA.isWinner
              ? 'bg-[#0a1a33] border-sky-500/50 text-white font-bold'
              : 'bg-[#070e1c] border-slate-800/80 text-slate-300 group-hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2 truncate min-w-0">
            {m.teamA.id.startsWith('tbd') ? (
              <div className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700/80 flex items-center justify-center text-[10px] text-slate-400 font-mono font-bold shrink-0">
                -
              </div>
            ) : (
              <img
                src={getTeamLogoUrl(m.teamA.id)}
                alt={m.teamA.name}
                className="w-5 h-5 object-contain shrink-0 rounded-xs"
              />
            )}
            <span className="truncate text-xs font-semibold">{m.teamA.name}</span>
          </div>
          <span className="font-mono text-xs font-bold text-slate-400 shrink-0 ml-2">
            {m.status === 'COMPLETED' ? m.teamA.score : '-'}
          </span>
        </div>

        {/* Team B */}
        <div
          className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border transition-colors ${
            m.teamB.isWinner
              ? 'bg-[#0a1a33] border-sky-500/50 text-white font-bold'
              : 'bg-[#070e1c] border-slate-800/80 text-slate-300 group-hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2 truncate min-w-0">
            {m.teamB.id.startsWith('tbd') ? (
              <div className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700/80 flex items-center justify-center text-[10px] text-slate-400 font-mono font-bold shrink-0">
                -
              </div>
            ) : (
              <img
                src={getTeamLogoUrl(m.teamB.id)}
                alt={m.teamB.name}
                className="w-5 h-5 object-contain shrink-0 rounded-xs"
              />
            )}
            <span className="truncate text-xs font-semibold">{m.teamB.name}</span>
          </div>
          <span className="font-mono text-xs font-bold text-slate-400 shrink-0 ml-2">
            {m.status === 'COMPLETED' ? m.teamB.score : '-'}
          </span>
        </div>
      </div>
    </div>
  );
};

