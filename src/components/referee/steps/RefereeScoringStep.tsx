'use client';

import React from 'react';
import { Radio, Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { Match } from '@/types';

interface RefereeScoringStepProps {
  currentMatch: Match;
  timerSeconds: number;
  isTimerRunning: boolean;
  currentPeriod: string;
  formatTime: (secs: number) => string;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onUpdateScore: (team: 'A' | 'B', delta: number) => void;
}

export const RefereeScoringStep: React.FC<RefereeScoringStepProps> = ({
  currentMatch,
  timerSeconds,
  isTimerRunning,
  currentPeriod,
  formatTime,
  onToggleTimer,
  onResetTimer,
  onUpdateScore,
}) => {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="p-5 sm:p-7 rounded-2xl bg-[#0b1a28] text-white border border-[#1f374f] shadow-lg space-y-6">
        {/* Top Match Bar */}
        <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600/30 text-red-400 font-bold border border-red-500/40">
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>LIVE COURT 1</span>
            </span>
            <span className="text-slate-400 font-medium">Laga #{currentMatch.matchNumber}</span>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-[#f6ae2d] font-bold text-xs">
            {currentPeriod}
          </span>
        </div>

        {/* Stopwatch Controller */}
        <div className="flex flex-col items-center justify-center space-y-2 py-2">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Official Match Timer
          </span>
          <div className="text-5xl sm:text-7xl font-black font-mono tracking-tight text-white tabular-nums">
            {formatTime(timerSeconds)}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onToggleTimer}
              className={`btn-tactile px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 min-h-[44px] ${
                isTimerRunning ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isTimerRunning ? 'Jeda Waktu (Pause)' : 'Jalankan Timer (Play)'}</span>
            </button>
            <button
              type="button"
              onClick={onResetTimer}
              className="btn-tactile p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 min-h-[44px]"
              title="Reset 20 Menit"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Teams & Big Score Controls */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* Team A Box */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-4">
            <div className="font-extrabold text-sm sm:text-base text-slate-100 truncate">
              {currentMatch.teamAName}
            </div>
            <div className="text-6xl sm:text-7xl font-black font-mono text-[#f6ae2d] tabular-nums">
              {currentMatch.scoreA}
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onUpdateScore('A', -1)}
                className="btn-tactile w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xl font-black flex items-center justify-center"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onUpdateScore('A', 1)}
                className="btn-tactile flex-1 py-3 px-3 rounded-xl bg-[#33658a] hover:bg-[#264e6b] text-white text-base font-black flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Plus className="w-5 h-5" />
                <span>Poin (+1)</span>
              </button>
            </div>
          </div>

          {/* Team B Box */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-4">
            <div className="font-extrabold text-sm sm:text-base text-slate-100 truncate">
              {currentMatch.teamBName}
            </div>
            <div className="text-6xl sm:text-7xl font-black font-mono text-[#f6ae2d] tabular-nums">
              {currentMatch.scoreB}
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onUpdateScore('B', -1)}
                className="btn-tactile w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xl font-black flex items-center justify-center"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onUpdateScore('B', 1)}
                className="btn-tactile flex-1 py-3 px-3 rounded-xl bg-[#33658a] hover:bg-[#264e6b] text-white text-base font-black flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Plus className="w-5 h-5" />
                <span>Poin (+1)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
