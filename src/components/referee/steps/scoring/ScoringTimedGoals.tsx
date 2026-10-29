'use client';

import React, { useState } from 'react';
import { Play, Pause, RotateCcw, BellRing } from 'lucide-react';
import { Match, MatchEvent, EventType } from '@/types';
import { MatchGoalsTable } from './MatchGoalsTable';
import { TeamScoreFoulCard } from './TeamScoreFoulCard';
import { playMatchStartBell } from '@/utils/arenaSound';

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
  currentMatch, timerSeconds, isTimerRunning, currentPeriod, formatTime,
  onToggleTimer, onResetTimer, onAddMinute, onUpdateScore, onQuickIncident,
  events = [], onUndoLastEvent, onUndoTeamGoal,
}) => {
  const [foulsA, setFoulsA] = useState(3);
  const [foulsB, setFoulsB] = useState(5);
  const [timeoutsA, setTimeoutsA] = useState(1);
  const [timeoutsB, setTimeoutsB] = useState(0);
  const [isBellRinging, setIsBellRinging] = useState(false);

  // Hitung jumlah kartu Tim A dan Tim B dari events laga
  const yellowCardsA = (events || []).filter(
    (e) => (e.teamId === currentMatch.teamAId || e.teamId === 'team-sdi-kardina' || e.playerName?.includes('Tim A')) && e.type === 'YELLOW_CARD'
  ).length;
  const redCardsA = (events || []).filter(
    (e) => (e.teamId === currentMatch.teamAId || e.teamId === 'team-sdi-kardina' || e.playerName?.includes('Tim A')) && e.type === 'RED_CARD'
  ).length;
  const yellowCardsB = (events || []).filter(
    (e) => (e.teamId === currentMatch.teamBId || e.teamId === 'team-min7-blitar' || e.playerName?.includes('Tim B')) && e.type === 'YELLOW_CARD'
  ).length;
  const redCardsB = (events || []).filter(
    (e) => (e.teamId === currentMatch.teamBId || e.teamId === 'team-min7-blitar' || e.playerName?.includes('Tim B')) && e.type === 'RED_CARD'
  ).length;

  const handleRingBell = () => {
    setIsBellRinging(true);
    playMatchStartBell(1.4);
    setTimeout(() => setIsBellRinging(false), 2400);
  };

  const handleFoulChange = (team: 'A' | 'B', delta: number) => {
    const isA = team === 'A';
    const current = isA ? foulsA : foulsB;
    const next = Math.max(0, current + delta);
    if (isA) setFoulsA(next);
    else setFoulsB(next);
    if (delta > 0 && onQuickIncident) onQuickIncident('FOUL', team, `Foul ke-${next}`);
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

  return (
    <div className="rounded-2xl bg-[#0D1E30] text-white border border-[#1C3B5B] p-4 sm:p-5 shadow-xs space-y-3.5 animate-fadeIn">
      {/* 1. Top Compact Meta Bar */}
      <div className="flex items-center justify-between text-xs pb-2.5 border-b border-[#1C3B5B]">
        <div className="flex items-center gap-2">
          <span className="font-bebas text-base sm:text-lg uppercase tracking-wider text-white leading-none">
            Papan Skor &amp; Stopwatch Lapangan
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRingBell}
            className={`px-2.5 py-1 rounded-md font-barlow font-bold uppercase text-[11px] border flex items-center gap-1.5 transition-all shadow-xs ${
              isBellRinging
                ? 'bg-red-600 text-white border-red-400 animate-pulse ring-2 ring-red-400'
                : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30'
            }`}
            title="Bunyikan Bel Kick-off / Mulai Pertandingan"
          >
            <BellRing className={`w-3.5 h-3.5 ${isBellRinging ? 'animate-bounce text-white' : 'text-amber-400'}`} />
            <span>{isBellRinging ? 'Bel Berbunyi!' : 'Bel Kick-off'}</span>
          </button>
          <span className="px-2.5 py-0.5 rounded-md bg-[#07131F] text-[#F6AE2D] font-barlow font-bold uppercase tracking-wider text-xs border border-[#1C3B5B]">
            {currentPeriod}
          </span>
        </div>
      </div>

      {/* Visual Kickoff Banner when Bell Rings */}
      {isBellRinging && (
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white font-barlow font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg animate-pulse border border-amber-300">
          <BellRing className="w-4 h-4 animate-bounce" />
          <span>🚨 BEL PERTANDINGAN DIBUNYIKAN: KICK-OFF / PERTANDINGAN DIMULAI!</span>
        </div>
      )}

      {/* 2. Cockpit Terpadu 1 Halaman (Tim A, Timer Pusat, Tim B) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
        {/* TIM A (Kiri) */}
        <TeamScoreFoulCard
          team="A"
          teamName={currentMatch.teamAName}
          score={currentMatch.scoreA}
          fouls={foulsA}
          timeouts={timeoutsA}
          yellowCards={yellowCardsA}
          redCards={redCardsA}
          onUpdateScore={(delta) => {
            onUpdateScore('A', delta);
            if (delta > 0 && onQuickIncident) onQuickIncident('GOAL', 'A', 'Gol Tim A');
          }}
          onFoulChange={(delta) => handleFoulChange('A', delta)}
          onTimeout={() => handleTimeout('A')}
          onCardIncident={(type) =>
            onQuickIncident &&
            onQuickIncident(type, 'A', type === 'YELLOW_CARD' ? 'Kartu Kuning Tim A' : 'Kartu Merah Tim A')
          }
        />

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
              onClick={() => {
                if (!isTimerRunning) handleRingBell();
                onToggleTimer();
              }}
              className={`btn-tactile w-full py-2 px-2.5 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                isTimerRunning
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isTimerRunning ? 'Jeda' : 'Jalankan'}</span>
            </button>

            <button
              type="button"
              onClick={handleRingBell}
              className={`btn-tactile w-full py-1 px-1.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-1 border transition-all ${
                isBellRinging
                  ? 'bg-red-600 text-white border-red-400 animate-pulse'
                  : 'bg-white/5 hover:bg-white/10 text-amber-300 border-amber-500/30'
              }`}
              title="Bunyikan Bel / Buzzer Kick-off"
            >
              <BellRing className="w-3 h-3 text-amber-400" />
              <span>Bunyikan Bel</span>
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
        <TeamScoreFoulCard
          team="B"
          teamName={currentMatch.teamBName}
          score={currentMatch.scoreB}
          fouls={foulsB}
          timeouts={timeoutsB}
          yellowCards={yellowCardsB}
          redCards={redCardsB}
          onUpdateScore={(delta) => {
            onUpdateScore('B', delta);
            if (delta > 0 && onQuickIncident) onQuickIncident('GOAL', 'B', 'Gol Tim B');
          }}
          onFoulChange={(delta) => handleFoulChange('B', delta)}
          onTimeout={() => handleTimeout('B')}
          onCardIncident={(type) =>
            onQuickIncident &&
            onQuickIncident(type, 'B', type === 'YELLOW_CARD' ? 'Kartu Kuning Tim B' : 'Kartu Merah Tim B')
          }
        />
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
