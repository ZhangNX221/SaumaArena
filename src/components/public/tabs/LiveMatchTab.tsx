'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Layers, ChevronDown, Maximize, Minimize } from 'lucide-react';
import { initialMatches } from '@/mocks/tournamentData';
import { MatchEvent, SportCode, Match } from '@/types';
import { usePersistentState } from '@/hooks/usePersistentState';
import { SportRuleSettings, DEFAULT_SPORT_RULES } from '@/config/sportRules';
import { LiveMatchHeader } from './live/LiveMatchHeader';
import { LiveMatchScoreboard } from './live/LiveMatchScoreboard';
import { LiveMatchGoalHistory } from './live/LiveMatchGoalHistory';
import { LiveMatchInactiveView } from './live/LiveMatchInactiveView';

interface LiveMatchTabProps {
  sportCode?: SportCode;
  onTabChange?: (tab: string) => void;
}

export const LiveMatchTab: React.FC<LiveMatchTabProps> = ({
  sportCode = 'FUTSAL',
  onTabChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  const [matches] = usePersistentState<Match[]>('sauma_arena_matches', initialMatches);
  const [matchRules] = usePersistentState<Record<string, SportRuleSettings>>(
    'sauma_arena_match_rules',
    DEFAULT_SPORT_RULES
  );

  const adminDurationMinutes = matchRules[sportCode]?.durationPerPeriod || 20;
  const adminInitialSeconds = adminDurationMinutes * 60;

  const availableMatches = matches.filter(
    (m) => m.stage === 'GROUP' || m.status === 'LIVE' || m.status === 'COMPLETED'
  );
  const [selectedMatchId, setSelectedMatchId] = useState<string>('match-1');

  const selectedMatch =
    availableMatches.find((m) => m.id === selectedMatchId) ||
    availableMatches[0] ||
    matches[0];

  // Periksa apakah ada pertandingan yang sedang berstatus LIVE
  const hasLiveMatch = matches.some((m) => m.status === 'LIVE') || selectedMatch.status === 'LIVE';
  const isLiveActive = hasLiveMatch || isPreviewMode;

  // State skor & timer live real-time (default durasi dari pengaturan admin)
  const [scoreA, setScoreA] = useState<number>(selectedMatch.scoreA ?? 0);
  const [scoreB, setScoreB] = useState<number>(selectedMatch.scoreB ?? 0);
  const [timerSeconds, setTimerSeconds] = useState<number>(adminInitialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(selectedMatch.status === 'LIVE');
  const [currentPeriod, setCurrentPeriod] = useState<string>(
    selectedMatch.status === 'LIVE' ? 'Babak 1' : 'Pemanasan / Menunggu Kickoff'
  );

  // Fouls & Timeouts data (live feed)
  const [foulsA, setFoulsA] = useState<number>(0);
  const [foulsB, setFoulsB] = useState<number>(0);
  const [timeoutsA, setTimeoutsA] = useState<number>(0);
  const [timeoutsB, setTimeoutsB] = useState<number>(0);

  // Events riwayat gol
  const [events, setEvents] = useState<MatchEvent[]>(selectedMatch.events || []);

  // Sinkronisasi saat match berganti
  useEffect(() => {
    setScoreA(selectedMatch.scoreA ?? 0);
    setScoreB(selectedMatch.scoreB ?? 0);
    setEvents(selectedMatch.events || []);
    setIsTimerRunning(selectedMatch.status === 'LIVE');
    setCurrentPeriod(selectedMatch.status === 'LIVE' ? 'Babak 1' : 'Pemanasan / Menunggu Kickoff');
    setFoulsA(0);
    setFoulsB(0);
    setTimeoutsA(0);
    setTimeoutsB(0);
    setTimerSeconds(adminInitialSeconds);
  }, [selectedMatchId, selectedMatch, adminInitialSeconds]);

  // Simulasi pergerakan waktu live real-time (ticking down)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((s) => Math.max(0, s - 1)), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Listener fullscreen change dari browser (misal user tekan ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const yellowCardsA = events.filter(
    (e) => (e.teamId === selectedMatch.teamAId || e.teamId === 'team-sdi-kardina') && e.type === 'YELLOW_CARD'
  ).length;
  const redCardsA = events.filter(
    (e) => (e.teamId === selectedMatch.teamAId || e.teamId === 'team-sdi-kardina') && e.type === 'RED_CARD'
  ).length;
  const yellowCardsB = events.filter(
    (e) => (e.teamId === selectedMatch.teamBId || e.teamId === 'team-min7-blitar') && e.type === 'YELLOW_CARD'
  ).length;
  const redCardsB = events.filter(
    (e) => (e.teamId === selectedMatch.teamBId || e.teamId === 'team-min7-blitar') && e.type === 'RED_CARD'
  ).length;

  if (!isLiveActive) {
    return (
      <LiveMatchInactiveView
        nextMatch={matches[0]}
        onActivatePreview={() => setIsPreviewMode(true)}
        onTabChange={onTabChange}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`transition-colors duration-200 ${
        isFullscreen
          ? 'fixed inset-0 z-50 overflow-y-auto bg-[var(--bg-page)] text-[var(--text-main)] p-4 sm:p-8 flex flex-col justify-start space-y-4'
          : 'space-y-4 max-w-5xl mx-auto pb-10 animate-fadeIn'
      }`}
    >
      {/* Banner Mode Pratinjau Jika Diaktifkan */}
      {isPreviewMode && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span className="font-barlow font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Mode Pratinjau Papan Skor Digital (Simulasi Layar Meja Wasit)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsPreviewMode(false)}
            className="btn-tactile px-3.5 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-main)] font-barlow font-bold text-xs uppercase tracking-wider transition-all self-end sm:self-auto shrink-0 shadow-2xs active:scale-95"
          >
            Kembali ke Layar Standby
          </button>
        </div>
      )}

      {/* Selector Pertandingan & Fullscreen Bar */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs shadow-xs">
        <div className="flex items-center gap-2 text-[var(--text-muted)] font-medium">
          <Layers className="w-4 h-4 text-[var(--color-arena-primary)]" />
          <span>Pilih Laga Tayang:</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedMatchId}
              onChange={(e) => setSelectedMatchId(e.target.value)}
              className="appearance-none px-3 py-1.5 pr-8 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-main)] font-barlow font-bold text-xs cursor-pointer focus:outline-none"
            >
              {availableMatches.map((m) => (
                <option key={m.id} value={m.id} className="bg-[var(--bg-surface)] text-[var(--text-main)]">
                  Laga #{m.matchNumber}: {m.teamAName} vs {m.teamBName} ({m.scoreA} - {m.scoreB})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="btn-tactile px-3 py-1.5 rounded-lg bg-[var(--color-arena-primary)] hover:bg-[#1D4ED8] active:scale-95 text-white font-barlow font-bold uppercase text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0"
            title={isFullscreen ? 'Keluar Layar Penuh (ESC)' : 'Mode Layar Penuh (Jumbotron / TV)'}
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize className="w-3.5 h-3.5" />
                <span>Layar Penuh</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. Header Card Laga Siaran Langsung */}
      <LiveMatchHeader
        match={selectedMatch}
        scoreA={scoreA}
        scoreB={scoreB}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* 2. Papan Skor & Stopwatch Lapangan Publik Real-time */}
      <LiveMatchScoreboard
        match={selectedMatch}
        scoreA={scoreA}
        scoreB={scoreB}
        timerSeconds={timerSeconds}
        isTimerRunning={isTimerRunning}
        currentPeriod={currentPeriod}
        foulsA={foulsA}
        foulsB={foulsB}
        timeoutsA={timeoutsA}
        timeoutsB={timeoutsB}
        yellowCardsA={yellowCardsA}
        redCardsA={redCardsA}
        yellowCardsB={yellowCardsB}
        redCardsB={redCardsB}
        formatTime={formatTime}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* 3. Riwayat Gol Pertandingan (Tampilan Publik Murni) */}
      <LiveMatchGoalHistory
        match={selectedMatch}
        scoreA={scoreA}
        scoreB={scoreB}
        totalGoals={scoreA + scoreB}
        events={events}
      />
    </div>
  );
};
