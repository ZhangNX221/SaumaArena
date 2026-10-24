'use client';

import React, { useState } from 'react';
import { Radio, Play, Pause, RotateCcw, Plus, Minus, AlertTriangle, Undo2, Flag, Clock } from 'lucide-react';
import { Match, MatchEvent, EventType } from '@/types';

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
}) => {
  const [foulsA, setFoulsA] = useState(3);
  const [foulsB, setFoulsB] = useState(5);
  const [timeoutsA, setTimeoutsA] = useState(1);
  const [timeoutsB, setTimeoutsB] = useState(0);

  const handleFoulChange = (team: 'A' | 'B', delta: number) => {
    if (team === 'A') {
      const next = Math.max(0, foulsA + delta);
      setFoulsA(next);
      if (delta > 0 && onQuickIncident) {
        onQuickIncident('FOUL', 'A', `Foul ke-${next}`);
      }
    } else {
      const next = Math.max(0, foulsB + delta);
      setFoulsB(next);
      if (delta > 0 && onQuickIncident) {
        onQuickIncident('FOUL', 'B', `Foul ke-${next}`);
      }
    }
  };

  const handleTimeout = (team: 'A' | 'B') => {
    if (team === 'A' && timeoutsA > 0) {
      setTimeoutsA((prev) => prev - 1);
      if (onQuickIncident) onQuickIncident('TIMEOUT', 'A', 'Time Out Babak Ini');
    } else if (team === 'B' && timeoutsB > 0) {
      setTimeoutsB((prev) => prev - 1);
      if (onQuickIncident) onQuickIncident('TIMEOUT', 'B', 'Time Out Babak Ini');
    }
  };

  const renderFoulDots = (count: number) => {
    const dots = [];
    for (let i = 1; i <= 5; i++) {
      dots.push(
        <span
          key={i}
          className={`w-3 h-3 rounded-full border transition-all ${
            i <= count
              ? count >= 5
                ? 'bg-red-500 border-red-400 shadow-xs'
                : 'bg-amber-400 border-amber-300'
              : 'bg-slate-800 border-slate-700'
          }`}
        />
      );
    }
    return dots;
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0b1a28] text-white border border-[#1f374f] space-y-5">
        {/* Top Status Bar */}
        <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600/20 text-red-400 font-barlow font-bold uppercase tracking-wider border border-red-500/30 text-[11px]">
              <Radio className="w-3.5 h-3.5 text-red-500" />
              <span>LIVE LAPANGAN 1</span>
            </span>
            <span className="text-slate-400 font-barlow font-bold uppercase tracking-wider text-xs">
              Laga #{currentMatch.matchNumber} &bull; Futsal Putra
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-[#f6ae2d] font-barlow font-bold uppercase tracking-wider text-xs">
            {currentPeriod}
          </span>
        </div>

        {/* Stopwatch Controller */}
        <div className="flex flex-col items-center justify-center space-y-1.5 py-1">
          <span className="text-[11px] font-barlow font-bold tracking-widest text-slate-400 uppercase">
            Waktu Pertandingan
          </span>
          <div className="text-6xl sm:text-8xl font-scoreboard font-bold tracking-wider text-white tabular-nums leading-none">
            {formatTime(timerSeconds)}
          </div>
          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={onToggleTimer}
              className={`btn-tactile px-5 py-2.5 rounded-xl font-barlow font-bold uppercase tracking-wider text-xs flex items-center gap-2 min-h-[44px] active:scale-95 transition-all duration-100 ${
                isTimerRunning ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isTimerRunning ? 'Jeda Waktu' : 'Jalankan Timer'}</span>
            </button>
            {onAddMinute && (
              <button
                type="button"
                onClick={onAddMinute}
                className="btn-tactile px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-barlow font-bold uppercase tracking-wider text-xs min-h-[44px] active:scale-95 transition-all duration-100"
                title="Tambah 1 menit"
              >
                +1 Menit
              </button>
            )}
            <button
              type="button"
              onClick={onResetTimer}
              className="btn-tactile p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 min-h-[44px] active:scale-95 transition-all duration-100"
              aria-label="Reset Timer"
              title="Reset waktu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Big Scoreboard & Foul Trackers */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
          {/* Team A */}
          <div className="p-3.5 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-3">
            <div className="font-bebas text-2xl sm:text-3xl text-slate-100 tracking-wide uppercase truncate">
              {currentMatch.teamAName}
            </div>
            <div className="text-6xl sm:text-8xl font-scoreboard font-bold text-[#f6ae2d] tabular-nums leading-none tracking-wide">
              {currentMatch.scoreA}
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onUpdateScore('A', -1)}
                className="btn-tactile w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-90 text-white text-lg font-black flex items-center justify-center shrink-0 min-h-[44px] transition-all duration-100"
                aria-label="Kurangi Skor Tim A"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateScore('A', 1);
                  if (onQuickIncident) onQuickIncident('GOAL', 'A', 'Gol Tim A');
                }}
                className="btn-tactile flex-1 py-2.5 px-3 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] active:scale-95 text-white text-sm font-bold flex items-center justify-center gap-1.5 min-h-[44px] transition-all duration-100"
              >
                <Plus className="w-4 h-4" />
                <span className="font-bebas tracking-wider text-base uppercase">Gol (+1)</span>
              </button>
            </div>

            {/* Foul Counter A */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-barlow font-bold uppercase text-slate-300">
                <span>Foul Babak: {foulsA}/5</span>
                {foulsA >= 5 && (
                  <span className="text-red-400 font-extrabold flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    Penalti 10m
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center gap-1.5 py-1">
                {renderFoulDots(foulsA)}
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFoulChange('A', -1)}
                  className="px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-[11px] font-mono"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => handleFoulChange('A', 1)}
                  className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[11px] font-barlow font-bold uppercase"
                >
                  +1 Foul
                </button>
              </div>
            </div>
          </div>

          {/* Team B */}
          <div className="p-3.5 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-3">
            <div className="font-bebas text-2xl sm:text-3xl text-slate-100 tracking-wide uppercase truncate">
              {currentMatch.teamBName}
            </div>
            <div className="text-6xl sm:text-8xl font-scoreboard font-bold text-[#f6ae2d] tabular-nums leading-none tracking-wide">
              {currentMatch.scoreB}
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onUpdateScore('B', -1)}
                className="btn-tactile w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-90 text-white text-lg font-black flex items-center justify-center shrink-0 min-h-[44px] transition-all duration-100"
                aria-label="Kurangi Skor Tim B"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateScore('B', 1);
                  if (onQuickIncident) onQuickIncident('GOAL', 'B', 'Gol Tim B');
                }}
                className="btn-tactile flex-1 py-2.5 px-3 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] active:scale-95 text-white text-sm font-bold flex items-center justify-center gap-1.5 min-h-[44px] transition-all duration-100"
              >
                <Plus className="w-4 h-4" />
                <span className="font-bebas tracking-wider text-base uppercase">Gol (+1)</span>
              </button>
            </div>

            {/* Foul Counter B */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-barlow font-bold uppercase text-slate-300">
                <span>Foul Babak: {foulsB}/5</span>
                {foulsB >= 5 && (
                  <span className="text-red-400 font-extrabold flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    Penalti 10m
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center gap-1.5 py-1">
                {renderFoulDots(foulsB)}
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFoulChange('B', -1)}
                  className="px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-[11px] font-mono"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => handleFoulChange('B', 1)}
                  className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[11px] font-barlow font-bold uppercase"
                >
                  +1 Foul
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rapid Actions Grid - Insiden & Pelanggaran Terintegrasi */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-barlow font-bold uppercase tracking-wider text-slate-400">
            <span>Aksi Cepat Insiden &amp; Pelanggaran</span>
            <span className="text-[10px] text-slate-500 font-sans normal-case">Tercatat langsung ke lembar laga</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Team A Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => onQuickIncident && onQuickIncident('YELLOW_CARD', 'A', 'Kartu Kuning')}
                className="btn-tactile flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-barlow font-bold uppercase tracking-wide border border-amber-500/30 min-h-[40px]"
              >
                <span className="w-2 h-3 rounded-[2px] bg-amber-400 border border-amber-300 shadow-xs shrink-0 inline-block" />
                <span>Kuning</span>
              </button>
              <button
                type="button"
                onClick={() => onQuickIncident && onQuickIncident('RED_CARD', 'A', 'Kartu Merah')}
                className="btn-tactile flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[11px] font-barlow font-bold uppercase tracking-wide border border-red-500/30 min-h-[40px]"
              >
                <span className="w-2 h-3 rounded-[2px] bg-rose-500 border border-rose-400 shadow-xs shrink-0 inline-block" />
                <span>Merah</span>
              </button>
              <button
                type="button"
                onClick={() => handleFoulChange('A', 1)}
                className="btn-tactile flex items-center justify-center gap-1 py-2 px-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-barlow font-bold uppercase tracking-wide border border-slate-700 min-h-[40px]"
              >
                <span>+ Foul</span>
              </button>
              <button
                type="button"
                onClick={() => handleTimeout('A')}
                disabled={timeoutsA === 0}
                className="btn-tactile flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[11px] font-barlow font-bold uppercase tracking-wide border border-blue-500/30 disabled:opacity-40 min-h-[40px]"
              >
                <Clock className="w-3 h-3 text-sky-400 shrink-0" />
                <span>TO ({timeoutsA})</span>
              </button>
            </div>

            {/* Team B Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => onQuickIncident && onQuickIncident('YELLOW_CARD', 'B', 'Kartu Kuning')}
                className="btn-tactile flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-barlow font-bold uppercase tracking-wide border border-amber-500/30 min-h-[40px]"
              >
                <span className="w-2 h-3 rounded-[2px] bg-amber-400 border border-amber-300 shadow-xs shrink-0 inline-block" />
                <span>Kuning</span>
              </button>
              <button
                type="button"
                onClick={() => onQuickIncident && onQuickIncident('RED_CARD', 'B', 'Kartu Merah')}
                className="btn-tactile flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[11px] font-barlow font-bold uppercase tracking-wide border border-red-500/30 min-h-[40px]"
              >
                <span className="w-2 h-3 rounded-[2px] bg-rose-500 border border-rose-400 shadow-xs shrink-0 inline-block" />
                <span>Merah</span>
              </button>
              <button
                type="button"
                onClick={() => handleFoulChange('B', 1)}
                className="btn-tactile flex items-center justify-center gap-1 py-2 px-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-barlow font-bold uppercase tracking-wide border border-slate-700 min-h-[40px]"
              >
                <span>+ Foul</span>
              </button>
              <button
                type="button"
                onClick={() => handleTimeout('B')}
                disabled={timeoutsB === 0}
                className="btn-tactile flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[11px] font-barlow font-bold uppercase tracking-wide border border-blue-500/30 disabled:opacity-40 min-h-[40px]"
              >
                <Clock className="w-3 h-3 text-sky-400 shrink-0" />
                <span>TO ({timeoutsB})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Peristiwa Cepat & Undo */}
        {events.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-barlow font-bold uppercase tracking-wider text-slate-400">
                Log Peristiwa Terbaru ({events.length})
              </span>
              {onUndoLastEvent && (
                <button
                  type="button"
                  onClick={onUndoLastEvent}
                  className="btn-tactile flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600/20 hover:bg-rose-600/30 active:scale-95 text-rose-300 text-[11px] font-barlow font-bold uppercase tracking-wider border border-rose-500/30 transition-all duration-100"
                >
                  <Undo2 className="w-3 h-3" />
                  <span>Batalkan Aksi Terakhir</span>
                </button>
              )}
            </div>
            <div className="max-h-24 overflow-y-auto space-y-1.5 text-xs text-slate-300 pr-1">
              {events.slice(0, 4).map((ev) => (
                <div key={ev.id} className="flex items-center justify-between px-2.5 py-1 rounded bg-slate-900/60 border border-slate-800 text-[11px]">
                  <span className="font-mono text-amber-400">{ev.minute}&apos;</span>
                  <span className="font-semibold text-slate-200">{ev.playerName}</span>
                  <span className="text-slate-400 uppercase text-[10px]">{ev.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
