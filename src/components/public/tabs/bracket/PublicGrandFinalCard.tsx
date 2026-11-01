'use client';

import React from 'react';
import { Trophy, Crown } from 'lucide-react';
import { BracketMatch } from '@/mocks/bracketData';
import { getTeamLogoUrl } from '@/mocks/teamLogos';

interface PublicGrandFinalCardProps {
  gf: BracketMatch;
  championTeamName: string;
}

export const PublicGrandFinalCard: React.FC<PublicGrandFinalCardProps> = ({
  gf,
  championTeamName,
}) => {
  return (
    <div className="w-full rounded-2xl border-2 border-sky-400 bg-[#071120] p-4 sm:p-5 space-y-3.5 shadow-[0_0_25px_rgba(14,165,233,0.22)]">
      {/* Top Header line */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
        <span className="text-xs sm:text-[13px] font-mono font-bold text-amber-400">
          {gf.schedule}
        </span>
        <div className="bg-[#38bdf8] text-slate-950 px-3 py-1.5 rounded-xl font-barlow font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm shrink-0">
          <Trophy className="w-3.5 h-3.5" />
          <span>CHAMPION MATCH</span>
        </div>
      </div>

      {/* Team Cards */}
      <div className="space-y-2 text-xs">
        {/* Team 1 */}
        <div
          className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
            gf.teamA.isWinner
              ? 'bg-[#0a1a33] border-sky-500/50 text-white font-bold'
              : 'bg-[#091120] border-slate-800/90 text-slate-200'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0 truncate">
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-xs text-slate-400 font-mono font-bold shrink-0 relative">
              {gf.teamA.id.startsWith('tbd') ? (
                '-'
              ) : (
                <img
                  src={getTeamLogoUrl(gf.teamA.id)}
                  alt={gf.teamA.name}
                  className="w-5 h-5 object-contain rounded-xs"
                />
              )}
              {gf.teamA.isWinner && (
                <Crown className="w-3.5 h-3.5 text-amber-400 absolute -top-2 -right-1.5" />
              )}
            </div>
            <div className="truncate">
              <span className="font-barlow font-bold text-sm text-white block truncate">
                {gf.teamA.name}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {gf.teamA.isWinner ? 'Juara 1 Turnamen' : 'Finalis 1 (Pemenang P15)'}
              </span>
            </div>
          </div>
          <span className="font-mono text-sm font-bold text-sky-400 shrink-0 ml-2">
            {gf.status === 'COMPLETED' ? gf.teamA.score : '-'}
          </span>
        </div>

        {/* Team 2 */}
        <div
          className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
            gf.teamB.isWinner
              ? 'bg-[#0a1a33] border-sky-500/50 text-white font-bold'
              : 'bg-[#091120] border-slate-800/90 text-slate-200'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0 truncate">
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-xs text-slate-400 font-mono font-bold shrink-0 relative">
              {gf.teamB.id.startsWith('tbd') ? (
                '-'
              ) : (
                <img
                  src={getTeamLogoUrl(gf.teamB.id)}
                  alt={gf.teamB.name}
                  className="w-5 h-5 object-contain rounded-xs"
                />
              )}
              {gf.teamB.isWinner && (
                <Crown className="w-3.5 h-3.5 text-amber-400 absolute -top-2 -right-1.5" />
              )}
            </div>
            <div className="truncate">
              <span className="font-barlow font-bold text-sm text-white block truncate">
                {gf.teamB.name}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {gf.teamB.isWinner ? 'Juara 1 Turnamen' : 'Finalis 2 (Pemenang P16)'}
              </span>
            </div>
          </div>
          <span className="font-mono text-sm font-bold text-sky-400 shrink-0 ml-2">
            {gf.status === 'COMPLETED' ? gf.teamB.score : '-'}
          </span>
        </div>
      </div>

      {/* Winner Podium Banner */}
      <div className="p-3.5 rounded-xl bg-[#14120c] border border-amber-500/40 text-center space-y-1 shadow-inner">
        <div className="text-[11px] font-barlow font-black uppercase tracking-widest text-amber-400 flex items-center justify-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>KAMPIUN TROFI BERGILIR ARENA</span>
        </div>
        <div className="font-bebas text-lg tracking-wider text-white uppercase truncate">
          {championTeamName}
        </div>
      </div>
    </div>
  );
};
