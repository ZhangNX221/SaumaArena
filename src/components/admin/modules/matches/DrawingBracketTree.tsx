'use client';

import React from 'react';
import { Trophy, Medal } from 'lucide-react';
import { BracketMatch, BracketSize } from '@/mocks/bracketData';
import { BracketStageKey } from './BracketMatchCard';
import { InteractiveBracketCard } from './InteractiveBracketCard';
import { InteractiveGrandFinalCard } from './InteractiveGrandFinalCard';

interface DrawingBracketTreeProps {
  bracketSize: BracketSize;
  qf: BracketMatch[];
  sf: BracketMatch[];
  gf: BracketMatch;
  bronze: BracketMatch;
  championTeamName: string;
  hasBronzeMatch?: boolean;
  onSelectMatch: (node: BracketMatch, stage: BracketStageKey) => void;
}

export const DrawingBracketTree: React.FC<DrawingBracketTreeProps> = ({
  bracketSize,
  qf,
  sf,
  gf,
  bronze,
  championTeamName,
  hasBronzeMatch = true,
  onSelectMatch,
}) => {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="w-full bg-[#060c18] border border-sky-950/80 rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col items-center justify-center">
        <div className="w-fit space-y-6">
          {/* Header Bar Across Columns */}
          <div className="flex items-center gap-0">
            {bracketSize >= 8 && (
              <>
                <div className="w-[260px] shrink-0 flex items-center gap-2">
                  <span className="font-barlow font-black text-sm uppercase tracking-wide text-white">
                    8 Besar (Perempat Final)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-700 bg-slate-900 text-slate-300 font-bold">
                    {qf.length} Laga
                  </span>
                </div>
                <div className="w-[36px] shrink-0" />
              </>
            )}

            {bracketSize >= 4 && (
              <>
                <div className="w-[260px] shrink-0 flex items-center gap-2">
                  <span className="font-barlow font-black text-sm uppercase tracking-wide text-sky-400">
                    {bracketSize === 4 ? 'Semifinal (4 Besar)' : 'Babak Semifinal'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-sky-800 bg-sky-950/80 text-sky-300 font-bold">
                    {sf.length} Laga
                  </span>
                </div>
                <div className="w-[36px] shrink-0" />
              </>
            )}

            <div className="w-[380px] shrink-0 flex items-center justify-between">
              <span className="font-barlow font-black text-sm uppercase tracking-wide text-sky-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                <span>Grand Final</span>
              </span>
              <span className="text-[11px] font-barlow font-bold uppercase tracking-wider text-sky-400/80">
                Perebutan Juara 1
              </span>
            </div>
          </div>

          {/* Bracket Tree Columns with Aligned SVG Connectors */}
          <div className="flex items-start gap-0">
            {/* COLUMN 1: 8 BESAR (QF) */}
            {bracketSize >= 8 && (
              <>
                <div className="w-[260px] shrink-0 space-y-0">
                  <div className="space-y-6">
                    <div className="space-y-6">
                      <InteractiveBracketCard
                        match={qf[0]}
                        onClick={() => onSelectMatch(qf[0], 'QF')}
                      />
                      <InteractiveBracketCard
                        match={qf[1]}
                        onClick={() => onSelectMatch(qf[1], 'QF')}
                      />
                    </div>
                    <div className="h-2" />
                    <div className="space-y-6">
                      <InteractiveBracketCard
                        match={qf[2]}
                        onClick={() => onSelectMatch(qf[2], 'QF')}
                      />
                      <InteractiveBracketCard
                        match={qf[3]}
                        onClick={() => onSelectMatch(qf[3], 'QF')}
                      />
                    </div>
                  </div>
                </div>

                {/* CONNECTOR 1: QF -> SF */}
                <div className="w-[36px] shrink-0 h-[528px] relative pointer-events-none">
                  <svg className="w-full h-full text-sky-500" viewBox="0 0 36 528" preserveAspectRatio="none">
                    <path d="M 0,55 H 18 V 189 H 0 M 18,122 H 36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="36" cy="122" r="3" fill="currentColor" />
                    <path d="M 0,339 H 18 V 473 H 0 M 18,406 H 36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="36" cy="406" r="3" fill="currentColor" />
                  </svg>
                </div>
              </>
            )}

            {/* COLUMN 2: SEMIFINAL (4 BESAR) */}
            {bracketSize >= 4 && (
              <>
                <div className="w-[260px] shrink-0 h-[528px] relative">
                  <div className="absolute top-[67px] w-full">
                    <InteractiveBracketCard
                      match={sf[0]}
                      isHighlighted={true}
                      onClick={() => onSelectMatch(sf[0], 'SF')}
                    />
                  </div>
                  <div className="absolute top-[351px] w-full">
                    <InteractiveBracketCard
                      match={sf[1]}
                      isHighlighted={true}
                      onClick={() => onSelectMatch(sf[1], 'SF')}
                    />
                  </div>
                </div>

                {/* CONNECTOR 2: SF -> GRAND FINAL */}
                <div className="w-[36px] shrink-0 h-[528px] relative pointer-events-none">
                  <svg className="w-full h-full text-sky-400" viewBox="0 0 36 528" preserveAspectRatio="none">
                    <path d="M 0,122 H 18 V 406 H 0 M 18,264 H 36" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="36" cy="264" r="3.5" fill="currentColor" />
                  </svg>
                </div>
              </>
            )}

            {/* COLUMN 3: GRAND FINAL & PEREBUTAN JUARA 3 */}
            <div className="w-[380px] shrink-0 h-[528px] flex flex-col justify-center space-y-6">
              <InteractiveGrandFinalCard
                gf={gf}
                championTeamName={championTeamName}
                onClick={() => onSelectMatch(gf, 'GF')}
              />
              {hasBronzeMatch && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-barlow font-bold uppercase tracking-wider text-amber-400">
                    <Medal className="w-4 h-4" />
                    <span>Perebutan Juara 3</span>
                  </div>
                  <InteractiveBracketCard
                    match={bronze}
                    onClick={() => onSelectMatch(bronze, 'BRONZE' as BracketStageKey)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

