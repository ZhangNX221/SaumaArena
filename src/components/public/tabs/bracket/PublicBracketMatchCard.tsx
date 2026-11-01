'use client';

import React from 'react';
import { BracketMatch } from '@/mocks/bracketData';
import { getTeamLogoUrl } from '@/mocks/teamLogos';

interface PublicBracketMatchCardProps {
  match: BracketMatch;
  isHighlighted?: boolean;
  className?: string;
}

export const PublicBracketMatchCard: React.FC<PublicBracketMatchCardProps> = ({
  match: m,
  isHighlighted = false,
  className = '',
}) => {
  return (
    <div
      key={m.id}
      className={`w-full rounded-2xl transition-all duration-150 p-3.5 space-y-2.5 shadow-sm ${
        isHighlighted
          ? 'bg-[#091325]/95 border-2 border-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.18)]'
          : 'bg-[#0a1222]/90 border border-slate-800/80 hover:border-sky-500/50'
      } ${className}`}
    >
      {/* Header bar: Stage name & Schedule */}
      <div className="flex items-center justify-between text-[11px] font-mono pb-1 border-b border-slate-800/60">
        <span className="font-barlow font-bold uppercase tracking-wider text-sky-400">
          {m.stageCode}
        </span>
        <span className="text-slate-400 truncate max-w-[150px] text-[10px]">
          {m.schedule}
        </span>
      </div>

      {/* Teams list */}
      <div className="space-y-1.5 text-xs">
        {/* Team A */}
        <div
          className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border transition-colors ${
            m.teamA.isWinner
              ? 'bg-[#0a1a33] border-sky-500/40 text-white font-bold'
              : 'bg-[#070e1c] border-slate-800/80 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2 truncate min-w-0">
            {m.teamA.id.startsWith('tbd') || m.teamA.id.startsWith('placeholder') || m.teamA.id.startsWith('fn-') || !getTeamLogoUrl(m.teamA.id) ? (
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
              ? 'bg-[#0a1a33] border-sky-500/40 text-white font-bold'
              : 'bg-[#070e1c] border-slate-800/80 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2 truncate min-w-0">
            {m.teamB.id.startsWith('tbd') || m.teamB.id.startsWith('placeholder') || m.teamB.id.startsWith('fn-') || !getTeamLogoUrl(m.teamB.id) ? (
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
