'use client';

import React, { useState } from 'react';
import { 
  Radio, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Minus, 
  AlertTriangle, 
  Clock 
} from 'lucide-react';
import { Match, MatchEvent, EventType } from '@/types';
import { MatchGoalsTable } from './MatchGoalsTable';

interface ScoringTimedGoalsProps {
  currentMatch: Match;
  timerSeconds: number;
  isTimerRunning: boolean;
  currentPeriod: string;
  formatTime: (secs: number) => string;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onAddMinute?: () => void;
  onUpdateScore: (team: 'A' | 'B', delta: number) => void;
  onQuickIncident?: (type: EventType, team: 'A' | 'B', label: string) => void;
  events?: MatchEvent[];
  onUndoLastEvent?: () => void;
  onUndoTeamGoal?: (team: 'A' | 'B', eventId?: string) => void;
}

export const ScoringTimedGoals: React.FC<ScoringTimedGoalsProps> = ({
  currentMatch,
  timerSeconds,
  isTimerRunning,
  currentPeriod,
  formatTime,
  onToggleTimer,
  onResetTimer,
  onAddMinute,
  onUpdateScore,
  onQuickIncident,
  events = [],
  onUndoLastEvent,
  onUndoTeamGoal,
}) => {
  const [foulsA, setFoulsA] = useState(3);
  const [foulsB, setFoulsB] = useState(5);
  const [timeoutsA, setTimeoutsA] = useState(1);
  const [timeoutsB, setTimeoutsB] = useState(0);

  const handleFoulChange = (team: 'A' | 'B', delta: number) => {
    const isA = team === 'A';
    const current = isA ? foulsA : foulsB;
    const next = Math.max(0, current + delta);
    if (isA) setFoulsA(next);
    else setFoulsB(next);
    if (delta > 0 && onQuickIncident) {
      onQuickIncident('FOUL', team, `Foul ke-${next}`);
    }
  };

  const handleTimeout = (team: 'A' | 'B') => {
    if (team === 'A' && timeoutsA > 0) {
      setTimeoutsA((prev) => prev - 1);
      onQuickIncident?.('TIMEOUT', 'A', 'Time Out Babak Ini');
    } else if (team === 'B' && timeoutsB > 0) {
      setTimeoutsB((prev) => prev - 1);
      onQuickIncident?.('TIMEOUT', 'B', 'Time Out Babak Ini');
    }
  };

  const renderFoulDots = (count: number) => (
    [1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        className={`w-2.5 h-2.5 rounded-full border transition-all ${
          i <= count
            ? count >= 5
              ? 'bg-red-500 border-red-400 shadow-xs'
              : 'bg-amber-400 border-amber-300'
            : 'bg-slate-800 border-slate-700'
        }`}
      />
    ))
  );

  return (
    <div className="rounded-2xl bg-[#0D1E30] text-white border border-[#1C3B5B] p-4 sm:p-5 shadow-xs space-y-3.5 animate-fadeIn">
      {/* 1. Top Compact Meta Bar */}
      <div className="flex items-center justify-between text-xs pb-2.5 border-b border-[#1C3B5B]">
        <div className="flex items-center gap-2">
          <span className="font-bebas text-base sm:text-lg uppercase tracking-wider text-white leading-none">
            Papan Skor &amp; Stopwatch Lapangan
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-md bg-[#07131F] text-[#F6AE2D] font-barlow font-bold uppercase tracking-wider text-xs border border-[#1C3B5B]">
          {currentPeriod}
        </span>
      </div>

      {/* 2. Cockpit Terpadu 1 Halaman (Tim A, Timer Pusat, Tim B) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
        {/* TIM A (Kiri) */}
        <div className="md:col-span-5 rounded-xl bg-[#07131F] border border-[#1C3B5B] p-3.5 flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-bebas text-xl sm:text-2xl text-white uppercase tracking-wide truncate leading-tight">
              {currentMatch.teamAName}
            </h2>
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10 shrink-0">
              Tim A
            </span>
          </div>

          {/* Skor & Tombol Gol */}
          <div className="flex items-center justify-between gap-3 bg-[#0D1E30]/70 p-2.5 rounded-xl border border-[#1C3B5B]">
            <div className="text-5xl sm:text-6xl font-scoreboard font-bold text-[#F6AE2D] tabular-nums leading-none pl-1">
              {currentMatch.scoreA}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onUpdateScore('A', -1)}
                className="btn-tactile w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 text-sm font-bold flex items-center justify-center border border-white/10 transition-colors"
                aria-label="Kurangi Skor Tim A"
                title="Kurangi 1 Gol"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateScore('A', 1);
                  if (onQuickIncident) onQuickIncident('GOAL', 'A', 'Gol Tim A');
                }}
                className="btn-tactile px-3.5 py-2 rounded-lg bg-[var(--color-arena-primary)] hover:bg-[#1D4ED8] active:scale-95 text-white font-barlow font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+1 Gol</span>
              </button>
            </div>
          </div>

          {/* Foul Counter & Time Out Tim A */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1C3B5B]/60">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-barlow font-bold uppercase text-slate-400">
                Foul {foulsA}/5:
              </span>
              <div className="flex items-center gap-1">{renderFoulDots(foulsA)}</div>
              <div className="flex items-center gap-0.5 ml-1">
                <button
                  type="button"
                  onClick={() => handleFoulChange('A', -1)}
                  className="w-5 h-5 rounded bg-white/5 text-slate-400 hover:text-white text-[10px] font-mono flex items-center justify-center"
                  title="Kurang foul"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => handleFoulChange('A', 1)}
                  className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[10px] font-mono flex items-center justify-center"
                  title="Tambah foul"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleTimeout('A')}
              disabled={timeoutsA === 0}
              className="btn-tactile px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[10px] font-barlow font-bold uppercase disabled:opacity-40 flex items-center gap-1"
            >
              <Clock className="w-2.5 h-2.5" />
              <span>TO ({timeoutsA})</span>
            </button>
          </div>

          {/* Sanksi Kartu Tim A */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={() => onQuickIncident && onQuickIncident('YELLOW_CARD', 'A', 'Kartu Kuning Tim A')}
              className="btn-tactile py-1.5 px-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-[10px] font-barlow font-bold uppercase tracking-wider border border-amber-500/30 flex items-center justify-center gap-1.5"
            >
              <span className="w-2 h-3 rounded-[2px] bg-amber-400 shadow-xs inline-block" />
              <span>Kuning</span>
            </button>
            <button
              type="button"
              onClick={() => onQuickIncident && onQuickIncident('RED_CARD', 'A', 'Kartu Merah Tim A')}
              className="btn-tactile py-1.5 px-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 text-[10px] font-barlow font-bold uppercase tracking-wider border border-red-500/30 flex items-center justify-center gap-1.5"
            >
              <span className="w-2 h-3 rounded-[2px] bg-rose-500 shadow-xs inline-block" />
              <span>Merah</span>
            </button>
          </div>
        </div>

        {/* TIMER & PUSAT KENDALI (Tengah) */}
        <div className="md:col-span-2 rounded-xl bg-[#07131F] border border-[#1C3B5B] p-3 flex flex-col items-center justify-center space-y-2 text-center">
          <span className="text-[10px] font-barlow font-bold tracking-widest text-slate-400 uppercase">
            Waktu Pertandingan
          </span>
          <div className="text-4xl sm:text-5xl font-scoreboard font-bold tracking-wider text-white tabular-nums leading-none">
            {formatTime(timerSeconds)}
          </div>

          <div className="flex flex-col gap-1.5 w-full pt-1">
            <button
              type="button"
              onClick={onToggleTimer}
              className={`btn-tactile w-full py-2 px-2.5 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                isTimerRunning
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isTimerRunning ? 'Jeda' : 'Jalankan'}</span>
            </button>

            <div className="flex items-center gap-1.5 w-full">
              {onAddMinute && (
                <button
                  type="button"
                  onClick={onAddMinute}
                  className="btn-tactile flex-1 py-1 px-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 font-barlow font-bold uppercase text-[10px] border border-white/10"
                  title="Tambah 1 Menit"
                >
                  +1m
                </button>
              )}
              <button
                type="button"
                onClick={onResetTimer}
                className="btn-tactile p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10"
                aria-label="Reset Timer"
                title="Reset Stopwatch"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* TIM B (Kanan) */}
        <div className="md:col-span-5 rounded-xl bg-[#07131F] border border-[#1C3B5B] p-3.5 flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10 shrink-0">
              Tim B
            </span>
            <h2 className="font-bebas text-xl sm:text-2xl text-white uppercase tracking-wide truncate leading-tight text-right">
              {currentMatch.teamBName}
            </h2>
          </div>

          {/* Skor & Tombol Gol */}
          <div className="flex items-center justify-between gap-3 bg-[#0D1E30]/70 p-2.5 rounded-xl border border-[#1C3B5B]">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onUpdateScore('B', -1)}
                className="btn-tactile w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 text-sm font-bold flex items-center justify-center border border-white/10 transition-colors"
                aria-label="Kurangi Skor Tim B"
                title="Kurangi 1 Gol"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateScore('B', 1);
                  if (onQuickIncident) onQuickIncident('GOAL', 'B', 'Gol Tim B');
                }}
                className="btn-tactile px-3.5 py-2 rounded-lg bg-[var(--color-arena-primary)] hover:bg-[#1D4ED8] active:scale-95 text-white font-barlow font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+1 Gol</span>
              </button>
            </div>
            <div className="text-5xl sm:text-6xl font-scoreboard font-bold text-[#F6AE2D] tabular-nums leading-none pr-1">
              {currentMatch.scoreB}
            </div>
          </div>

          {/* Foul Counter & Time Out Tim B */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1C3B5B]/60">
            <button
              type="button"
              onClick={() => handleTimeout('B')}
              disabled={timeoutsB === 0}
              className="btn-tactile px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[10px] font-barlow font-bold uppercase disabled:opacity-40 flex items-center gap-1"
            >
              <Clock className="w-2.5 h-2.5" />
              <span>TO ({timeoutsB})</span>
            </button>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 mr-1">
                <button
                  type="button"
                  onClick={() => handleFoulChange('B', -1)}
                  className="w-5 h-5 rounded bg-white/5 text-slate-400 hover:text-white text-[10px] font-mono flex items-center justify-center"
                  title="Kurang foul"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => handleFoulChange('B', 1)}
                  className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[10px] font-mono flex items-center justify-center"
                  title="Tambah foul"
                >
                  +
                </button>
              </div>
              <div className="flex items-center gap-1">{renderFoulDots(foulsB)}</div>
              <span className="text-[10px] font-barlow font-bold uppercase text-slate-400">
                :Foul {foulsB}/5
              </span>
            </div>
          </div>

          {/* Sanksi Kartu Tim B */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={() => onQuickIncident && onQuickIncident('YELLOW_CARD', 'B', 'Kartu Kuning Tim B')}
              className="btn-tactile py-1.5 px-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-[10px] font-barlow font-bold uppercase tracking-wider border border-amber-500/30 flex items-center justify-center gap-1.5"
            >
              <span className="w-2 h-3 rounded-[2px] bg-amber-400 shadow-xs inline-block" />
              <span>Kuning</span>
            </button>
            <button
              type="button"
              onClick={() => onQuickIncident && onQuickIncident('RED_CARD', 'B', 'Kartu Merah Tim B')}
              className="btn-tactile py-1.5 px-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 text-[10px] font-barlow font-bold uppercase tracking-wider border border-red-500/30 flex items-center justify-center gap-1.5"
            >
              <span className="w-2 h-3 rounded-[2px] bg-rose-500 shadow-xs inline-block" />
              <span>Merah</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Riwayat Gol Per Tim Dalam Bentuk Tabel */}
      <MatchGoalsTable
        teamAName={currentMatch.teamAName}
        teamBName={currentMatch.teamBName}
        teamAId={currentMatch.teamAId}
        teamBId={currentMatch.teamBId}
        events={events}
        onUndoLastEvent={onUndoLastEvent}
        onUndoTeamGoal={onUndoTeamGoal}
      />
    </div>
  );
};
