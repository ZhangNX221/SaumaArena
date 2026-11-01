'use client';

import React from 'react';
import { Trophy, Crown, Medal } from 'lucide-react';
import { initialTeams } from '@/mocks/tournamentData';
import { TeamDropdown } from './BracketMatchCard';

interface BracketPodiumCardProps {
  championId: string;
  setChampionId: (id: string) => void;
  runnerUpId: string;
  setRunnerUpId: (id: string) => void;
  thirdPlaceId: string;
  setThirdPlaceId: (id: string) => void;
}

export const BracketPodiumCard: React.FC<BracketPodiumCardProps> = ({
  championId,
  setChampionId,
  runnerUpId,
  setRunnerUpId,
  thirdPlaceId,
  setThirdPlaceId,
}) => {
  return (
    <div className="p-4 rounded-xl border-2 border-amber-500/40 bg-amber-500/5 shadow-xs space-y-3">
      <div className="text-xs font-barlow font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
        <Crown className="w-4 h-4 text-amber-500" />
        <span>Podium Pemenang Turnamen</span>
      </div>

      {/* Juara 1 */}
      <div className="space-y-1">
        <div className="text-[10px] font-barlow font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>🥇 Juara 1</span>
        </div>
        <TeamDropdown
          currentId={championId}
          currentName={championId ? initialTeams.find((t) => t.id === championId)?.name || 'Pilih Juara 1' : '-- Pilih Juara 1 --'}
          onSelect={setChampionId}
        />
      </div>

      {/* Juara 2 */}
      <div className="space-y-1">
        <div className="text-[10px] font-barlow font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1">
          <Medal className="w-3.5 h-3.5 text-slate-400" />
          <span>🥈 Juara 2 (Runner-Up)</span>
        </div>
        <TeamDropdown
          currentId={runnerUpId}
          currentName={runnerUpId ? initialTeams.find((t) => t.id === runnerUpId)?.name || 'Pilih Juara 2' : '-- Pilih Juara 2 --'}
          onSelect={setRunnerUpId}
        />
      </div>

      {/* Juara 3 Bersama */}
      <div className="space-y-1">
        <div className="text-[10px] font-barlow font-bold uppercase tracking-wider text-amber-900 dark:text-amber-600 flex items-center gap-1">
          <Medal className="w-3.5 h-3.5 text-amber-700" />
          <span>🥉 Juara 3 Bersama</span>
        </div>
        <TeamDropdown
          currentId={thirdPlaceId}
          currentName={thirdPlaceId ? initialTeams.find((t) => t.id === thirdPlaceId)?.name || 'Pilih Juara 3' : '-- Pilih Juara 3 --'}
          onSelect={setThirdPlaceId}
        />
      </div>
    </div>
  );
};

