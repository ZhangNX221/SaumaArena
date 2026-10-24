'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Activity, Radio, Clock } from 'lucide-react';
import { ATHLETE_ID_CARDS } from '@/mocks/multiSportData';
import { Match, MatchEvent, SportCode, EventType } from '@/types';
import { RefereeCheckInStep } from './steps/RefereeCheckInStep';
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
  const [activeSection, setActiveSection] = useState<'checkin' | 'scoring'>('scoring');
  const [timerSeconds, setTimerSeconds] = useState(1140); // 19:00 remaining
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentPeriod] = useState('Babak 2');

  // Check-in state
  const [roster, setRoster] = useState(ATHLETE_ID_CARDS);
  const [scanNotice, setScanNotice] = useState<string | null>(null);

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

  const handleSimulateScanAthlete = (id: string, name: string) => {
    setRoster((prev) =>
      prev.map((a) => (a.id === id ? { ...a, checkedIn: true } : a))
    );
    setScanNotice(`QR Terverifikasi: ${name}`);
    setTimeout(() => setScanNotice(null), 3000);
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

  const scrollToSection = (sectionId: string, key: 'checkin' | 'scoring') => {
    setActiveSection(key);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const checkedCount = roster.filter((r) => r.checkedIn).length;

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-20 animate-fadeIn">
      {/* 1. Header Banner Ringkas & Minimalis */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1E30] text-white border border-[#1C3B5B] transition-all duration-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 text-[10px] font-barlow font-bold uppercase tracking-wider">
                <Radio className="w-3 h-3 text-red-400 animate-pulse" />
                <span>Laga Aktif</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#F6AE2D] px-2 py-0.5 rounded-md bg-[#13273D] border border-[#1C3B5B]">
                {currentMatch.courtName || 'Lapangan Utama'} &bull; {currentMatch.stage || 'Babak Penyisihan'}
              </span>
            </div>

            <h1 className="font-bebas text-2xl sm:text-3xl uppercase tracking-wide text-white leading-none">
              {currentMatch.teamAName} <span className="text-[#F6AE2D] text-xl sm:text-2xl">VS</span> {currentMatch.teamBName}
            </h1>
            <p className="text-[11px] text-slate-300 font-sans">
              Pusat kendali meja wasit: periksa susunan pemain serta catat timer, skor, dan insiden laga langsung.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="px-3.5 py-1.5 rounded-xl bg-[#07131F] border border-[#1C3B5B] flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#F6AE2D]" />
              <div className="text-right">
                <span className="text-[9px] font-barlow font-bold uppercase tracking-wider text-slate-400 block">
                  {currentPeriod}
                </span>
                <span className="font-scoreboard font-bold text-lg sm:text-xl text-white tabular-nums leading-none">
                  {formatTime(timerSeconds)}
                </span>
              </div>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-[#07131F] border border-[#1C3B5B] text-center">
              <span className="text-[9px] font-barlow font-bold uppercase tracking-wider text-slate-400 block">
                Skor Laga
              </span>
              <span className="font-scoreboard font-bold text-lg sm:text-xl text-[#F6AE2D] tabular-nums leading-none">
                {currentMatch.scoreA} - {currentMatch.scoreB}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sticky Quick-Jump Navigation Bar - Simpel & Minimalis */}
      <div className="sticky top-2 z-20 p-1.5 rounded-2xl bg-[var(--bg-surface)]/95 backdrop-blur-md border border-[var(--border-subtle)] shadow-sm">
        <div className="grid grid-cols-2 gap-1.5">
          {[
            {
              key: 'checkin' as const,
              id: 'section-checkin',
              label: '1. Susunan Pemain',
              badge: `${checkedCount}/${roster.length} Hadir`,
              icon: UserCheck,
            },
            {
              key: 'scoring' as const,
              id: 'section-scoring',
              label: '2. Papan Skor & Waktu',
              badge: `${currentMatch.scoreA} - ${currentMatch.scoreB}`,
              icon: Activity,
            },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => scrollToSection(item.id, item.key)}
                className={`btn-tactile flex items-center justify-between gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-barlow font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] ${
                  isActive
                    ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                    isActive
                      ? 'bg-black/25 text-white'
                      : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Section 1: Susunan Pemain */}
      <section id="section-checkin" className="scroll-mt-20">
        <RefereeCheckInStep
          roster={roster}
          scanNotice={scanNotice}
          onSimulateScanAthlete={handleSimulateScanAthlete}
        />
      </section>

      {/* 4. Section 2: Catat Skor, Timer & Insiden Terintegrasi */}
      <section id="section-scoring" className="scroll-mt-20">
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
        />
      </section>
    </div>
  );
};

