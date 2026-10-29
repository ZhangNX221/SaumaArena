'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Undo2, Timer, CheckCircle, Radio } from 'lucide-react';
import { Match } from '@/types';

interface ScoringRallySetProps {
  currentMatch: Match;
  onUpdateScore: (team: 'A' | 'B', delta: number) => void;
}

interface SetRecord {
  game: number;
  scoreA: number;
  scoreB: number;
  winner: string;
  duration: string;
}

export const ScoringRallySet: React.FC<ScoringRallySetProps> = ({
  currentMatch,
}) => {
  const [scoreA, setScoreA] = useState(19);
  const [scoreB, setScoreB] = useState(20);
  const [history, setHistory] = useState<Array<{ a: number; b: number }>>([]);
  const [currentGame, setCurrentGame] = useState(2);
  const [completedSets, setCompletedSets] = useState<SetRecord[]>([
    { game: 1, scoreA: 21, scoreB: 18, winner: currentMatch.teamAName, duration: '22 menit' },
  ]);
  const [isSwapped, setIsSwapped] = useState(false);
  const [intervalRemaining, setIntervalRemaining] = useState<number | null>(null);

  // Interval countdown
  useEffect(() => {
    let t: ReturnType<typeof setInterval>;
    if (intervalRemaining !== null && intervalRemaining > 0) {
      t = setInterval(() => setIntervalRemaining((prev) => (prev !== null ? prev - 1 : null)), 1000);
    } else if (intervalRemaining === 0) {
      setIntervalRemaining(null);
    }
    return () => clearInterval(t);
  }, [intervalRemaining]);

  const handleAddPoint = (team: 'A' | 'B') => {
    setHistory((prev) => [...prev, { a: scoreA, b: scoreB }]);
    if (team === 'A') {
      setScoreA((prev) => prev + 1);
    } else {
      setScoreB((prev) => prev + 1);
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setScoreA(last.a);
    setScoreB(last.b);
    setHistory((prev) => prev.slice(0, -1));
  };

  const handleStartInterval = () => {
    setIntervalRemaining(60);
  };

  const handleCloseGame = () => {
    const winner = scoreA > scoreB ? currentMatch.teamAName : currentMatch.teamBName;
    setCompletedSets((prev) => [
      ...prev,
      { game: currentGame, scoreA, scoreB, winner, duration: '18 menit' },
    ]);
    setCurrentGame((g) => g + 1);
    setScoreA(0);
    setScoreB(0);
    setHistory([]);
  };

  // Rally badges check (Standard badminton/volleyball rules)
  const isDeuce = scoreA >= 20 && scoreB >= 20 && scoreA === scoreB;
  const isMatchPoint = (scoreA >= 20 || scoreB >= 20) && Math.abs(scoreA - scoreB) >= 1;

  const leftTeamName = isSwapped ? currentMatch.teamBName : currentMatch.teamAName;
  const rightTeamName = isSwapped ? currentMatch.teamAName : currentMatch.teamBName;
  const leftScore = isSwapped ? scoreB : scoreA;
  const rightScore = isSwapped ? scoreA : scoreB;
  const leftTeamKey: 'A' | 'B' = isSwapped ? 'B' : 'A';
  const rightTeamKey: 'A' | 'B' = isSwapped ? 'A' : 'B';

  return (
    <div className="space-y-3 animate-fadeIn">
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)] shadow-xs space-y-3.5">
        {/* Top Court Header */}
        <div className="flex items-center justify-between text-xs pb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600/30 text-emerald-400 font-barlow font-bold uppercase tracking-wider border border-emerald-500/40 text-[10px]">
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>Court 3 &bull; Reli Poin</span>
            </span>
            <span className="text-slate-400 font-barlow font-bold uppercase tracking-wider text-xs">
              Laga #{currentMatch.matchNumber}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-[var(--color-arena-accent)] font-barlow font-bold uppercase tracking-wider text-xs">
            GAME KE-{currentGame}
          </span>
        </div>

        {/* Interval Banner */}
        {intervalRemaining !== null && (
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-between text-amber-200">
            <span className="font-barlow font-bold uppercase text-xs flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Interval Resmi 60 Detik</span>
            </span>
            <span className="text-lg font-scoreboard font-bold tabular-nums text-white">
              {intervalRemaining}s
            </span>
            <button
              type="button"
              onClick={() => setIntervalRemaining(null)}
              className="px-2 py-0.5 rounded bg-amber-600 text-white font-barlow font-bold text-xs"
            >
              Lanjutkan
            </button>
          </div>
        )}

        {/* Large Rally Scoreboard */}
        <div className="text-center space-y-1.5">
          {/* Status Indicators */}
          <div className="flex items-center justify-center gap-2">
            {isMatchPoint && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 text-red-400 border border-red-500/40 text-[10px] font-barlow font-extrabold uppercase tracking-widest animate-pulse">
                Game / Match Point
              </span>
            )}
            {isDeuce && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-barlow font-extrabold uppercase tracking-widest">
                Deuce (Selisih 2 Poin)
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div className="space-y-0.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="font-bebas text-lg sm:text-xl uppercase tracking-wide text-slate-300 block truncate">
                {leftTeamName}
              </span>
              <div className="text-5xl sm:text-6xl font-scoreboard font-bold text-[var(--color-arena-accent)] tabular-nums leading-none">
                {leftScore}
              </div>
            </div>
            <div className="space-y-0.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="font-bebas text-lg sm:text-xl uppercase tracking-wide text-slate-300 block truncate">
                {rightTeamName}
              </span>
              <div className="text-5xl sm:text-6xl font-scoreboard font-bold text-[var(--color-arena-accent)] tabular-nums leading-none">
                {rightScore}
              </div>
            </div>
          </div>
        </div>

        {/* Giant Tactile Point Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleAddPoint(leftTeamKey)}
            className="btn-tactile py-2.5 px-3 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[#1D4ED8] text-white shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span className="text-xl sm:text-2xl font-scoreboard font-bold leading-none tracking-wider">
              +1 POIN
            </span>
            <span className="font-barlow font-bold text-xs uppercase tracking-wider text-white/90 truncate">
              ({leftTeamName.split(' ')[0]})
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleAddPoint(rightTeamKey)}
            className="btn-tactile py-2.5 px-3 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[#1D4ED8] text-white shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span className="text-xl sm:text-2xl font-scoreboard font-bold leading-none tracking-wider">
              +1 POIN
            </span>
            <span className="font-barlow font-bold text-xs uppercase tracking-wider text-white/90 truncate">
              ({rightTeamName.split(' ')[0]})
            </span>
          </button>
        </div>

        {/* Sub-Actions: Undo, Interval, Swap */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            className="btn-tactile flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-barlow font-bold uppercase tracking-wider disabled:opacity-40 min-h-[44px]"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo Poin</span>
          </button>

          <button
            type="button"
            onClick={handleStartInterval}
            className="btn-tactile flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-barlow font-bold uppercase tracking-wider min-h-[44px]"
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Interval 60s</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSwapped(!isSwapped)}
            className="btn-tactile flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-barlow font-bold uppercase tracking-wider min-h-[44px]"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Pindah Sisi</span>
          </button>
        </div>

        {/* Set History & Closure */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-barlow font-bold uppercase tracking-wider text-slate-400">
              Riwayat Game Selesai
            </span>
            <button
              type="button"
              onClick={handleCloseGame}
              className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-barlow font-bold uppercase tracking-wider min-h-[44px]"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Tutup Game &amp; Lanjut</span>
            </button>
          </div>

          <div className="space-y-1.5">
            {completedSets.map((s) => (
              <div
                key={s.game}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300"
              >
                <span className="font-barlow font-bold uppercase">Game {s.game}:</span>
                <span className="font-scoreboard font-bold text-amber-400 text-base">
                  {s.scoreA} - {s.scoreB}
                </span>
                <span className="text-[11px] text-slate-400">({s.duration})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
