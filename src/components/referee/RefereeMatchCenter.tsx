'use client';

import React, { useState, useEffect } from 'react';
import { Radio } from 'lucide-react';
import { Match, MatchEvent, SportCode, EventType } from '@/types';
import { RefereeScoringStep } from './steps/RefereeScoringStep';

interface RefereeMatchCenterProps {
  currentMatch: Match;
  selectedSport?: SportCode;
  onUpdateScore: (team: 'A' | 'B', delta: number) => void;
  onAddIncident: (event: Omit<MatchEvent, 'id'>) => void;
  onFinalizeBAP?: (bapData: { winner: string; notes: string }) => void;
}

export const RefereeMatchCenter: React.FC<RefereeMatchCenterProps> = ({
  currentMatch,
  selectedSport = 'FUTSAL',
  onUpdateScore,
  onAddIncident,
}) => {
  const [timerSeconds, setTimerSeconds] = useState(1140); // 19:00 remaining
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentPeriod] = useState('Babak 2');

  // Timer simulation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((s) => s - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddIncidentItem = (type: EventType, team: 'A' | 'B', label: string) => {
    const teamId = team === 'A' ? currentMatch.teamAId : currentMatch.teamBId;
    const teamName = team === 'A' ? currentMatch.teamAName : currentMatch.teamBName;
    const minute = Math.max(1, Math.floor((1200 - timerSeconds) / 60));

    onAddIncident({
      minute,
      type,
      teamId,
      playerId: 'P-AUTO',
      playerName: `${label} (${teamName.split(' ')[0]})`,
      detail: `Pencatatan juri menit ke-${minute}`,
    });
  };

  const handleUndoLastEvent = () => {
    if (currentMatch.events && currentMatch.events.length > 0) {
      const lastEvent = currentMatch.events[0];
      if (lastEvent.type === 'GOAL') {
        const team = lastEvent.teamId === currentMatch.teamAId ? 'A' : 'B';
        onUpdateScore(team, -1);
      }
      currentMatch.events.shift();
    }
  };

  const handleUndoTeamGoal = (team: 'A' | 'B', eventId?: string) => {
    if (!currentMatch.events || currentMatch.events.length === 0) return;
    const targetTeamId = team === 'A' ? currentMatch.teamAId : currentMatch.teamBId;
    const firstWord = (team === 'A' ? currentMatch.teamAName : currentMatch.teamBName).split(' ')[0].toLowerCase();

    const idx = currentMatch.events.findIndex((e) => {
      if (e.type !== 'GOAL') return false;
      if (eventId) return e.id === eventId;
      return (
        e.teamId === targetTeamId ||
        (e.playerName || '').toLowerCase().includes(team === 'A' ? 'tim a' : 'tim b') ||
        (e.playerName || '').toLowerCase().includes(firstWord)
      );
    });

    if (idx !== -1) {
      onUpdateScore(team, -1);
      currentMatch.events.splice(idx, 1);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-6 animate-fadeIn">
      {/* 1. Card Judul Header Laga Resmi */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1E30] text-white border border-[#1C3B5B] transition-all duration-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#13273D] border border-[#1C3B5B] text-[#F6AE2D] text-[10px] font-barlow font-bold uppercase tracking-wider">
                <Radio className="w-3 h-3 text-red-400 animate-pulse" />
                <span>Pencatatan Skor &amp; Waktu</span>
              </span>
              <span className="text-xs font-mono font-bold text-white/80 px-2.5 py-0.5 rounded-md bg-[#07131F] border border-[#1C3B5B]">
                Laga #{currentMatch.matchNumber} &bull; {currentMatch.courtName || 'Lapangan Utama'} &bull; {currentMatch.stage || 'Babak Penyisihan'}
              </span>
            </div>

            <h1 className="font-bebas text-2xl sm:text-3xl uppercase tracking-wide text-white leading-none">
              {currentMatch.teamAName} <span className="text-[#F6AE2D] text-xl sm:text-2xl">VS</span> {currentMatch.teamBName}
            </h1>
            <p className="text-xs text-slate-300 font-sans">
              Pusat kendali meja wasit: catat timer pertandingan, perolehan skor, dan insiden pelanggaran secara langsung.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="px-4 py-2 rounded-xl bg-[#07131F] border border-[#1C3B5B] text-center min-w-[100px]">
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-slate-400 block">
                Skor Saat Ini
              </span>
              <span className="font-scoreboard font-bold text-2xl text-[#F6AE2D] tabular-nums leading-none">
                {currentMatch.scoreA} - {currentMatch.scoreB}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dek Konsol Skor & Stopwatch */}
      <RefereeScoringStep
        currentMatch={currentMatch}
        selectedSport={selectedSport}
        timerSeconds={timerSeconds}
        isTimerRunning={isTimerRunning}
        currentPeriod={currentPeriod}
        formatTime={formatTime}
        onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
        onResetTimer={() => {
          setIsTimerRunning(false);
          setTimerSeconds(1200);
        }}
        onAddMinute={() => setTimerSeconds((s) => s + 60)}
        onUpdateScore={onUpdateScore}
        onQuickIncident={handleAddIncidentItem}
        events={currentMatch.events}
        onUndoLastEvent={handleUndoLastEvent}
        onUndoTeamGoal={handleUndoTeamGoal}
      />
    </div>
  );
};
