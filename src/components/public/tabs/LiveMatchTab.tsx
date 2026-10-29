'use client';

import React, { useState, useEffect, useRef } from 'react';
import { initialMatches } from '@/mocks/tournamentData';
import { SportCode, Match, MatchLiveTelemetry } from '@/types';
import { usePersistentState } from '@/hooks/usePersistentState';
import { SportRuleSettings, DEFAULT_SPORT_RULES } from '@/config/sportRules';
import { LiveMatchHeader } from './live/LiveMatchHeader';
import { LiveMatchScoreboard } from './live/LiveMatchScoreboard';
import { LiveMatchGoalHistory } from './live/LiveMatchGoalHistory';
import { LiveMatchFullscreenArena } from './live/LiveMatchFullscreenArena';

interface LiveMatchTabProps {
  sportCode?: SportCode;
  onTabChange?: (tab: string) => void;
}

export const LiveMatchTab: React.FC<LiveMatchTabProps> = ({
  sportCode = 'FUTSAL',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Akses state tersinkronisasi pertandingan, telemetri real-time, dan aturan cabor
  const [matches] = usePersistentState<Match[]>('sauma_arena_matches', initialMatches);
  const [telemetryMap] = usePersistentState<Record<string, MatchLiveTelemetry>>(
    'sauma_arena_live_telemetry',
    {}
  );
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

  // Data telemetri real-time langsung terhubung dengan meja wasit
  const matchTelemetry = telemetryMap[selectedMatch.id];
  const isMatchLive = selectedMatch.status === 'LIVE';
  const isTimerRunning = isMatchLive && (matchTelemetry?.isTimerRunning ?? false);
  const timerSeconds = matchTelemetry?.timerSeconds !== undefined ? matchTelemetry.timerSeconds : adminInitialSeconds;
  const currentPeriod = matchTelemetry?.currentPeriod || (isMatchLive ? 'Babak 1' : 'Pemanasan / Menunggu Kick-Off');
  const foulsA = matchTelemetry?.foulsA ?? 0;
  const foulsB = matchTelemetry?.foulsB ?? 0;
  const timeoutsA = matchTelemetry?.timeoutsA ?? 0;
  const timeoutsB = matchTelemetry?.timeoutsB ?? 0;

  // Skor dan peristiwa gol langsung dari state laga juri
  const scoreA = selectedMatch.scoreA ?? 0;
  const scoreB = selectedMatch.scoreB ?? 0;
  const events = selectedMatch.events || [];

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

  return (
    <div
      ref={containerRef}
      className={`transition-colors duration-200 ${
        isFullscreen
          ? 'fixed inset-0 z-[9999] bg-[#040812] w-screen h-screen overflow-hidden flex items-center justify-center p-0'
          : 'space-y-4 max-w-5xl mx-auto pb-10 animate-fadeIn'
      }`}
    >
      {isFullscreen ? (
        <LiveMatchFullscreenArena
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
          onExitFullscreen={handleToggleFullscreen}
          matches={availableMatches}
          selectedMatchId={selectedMatchId}
          onSelectMatch={setSelectedMatchId}
        />
      ) : (
        <>
          {/* 1. Header Card (Judul Laga, Informasi Lapangan & Skor Saat Ini) */}
          <LiveMatchHeader
            match={selectedMatch}
            scoreA={scoreA}
            scoreB={scoreB}
          />

          {/* 2. Papan Skor & Stopwatch Lapangan Publik Real-time (Dengan Selector Laga Tayang & Tombol Layar Penuh) */}
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
            isFullscreen={false}
            onToggleFullscreen={handleToggleFullscreen}
            matches={availableMatches}
            selectedMatchId={selectedMatchId}
            onSelectMatch={setSelectedMatchId}
          />

          {/* 3. Riwayat Gol Pertandingan (Tampilan Publik Murni) */}
          <LiveMatchGoalHistory
            match={selectedMatch}
            scoreA={scoreA}
            scoreB={scoreB}
            totalGoals={scoreA + scoreB}
            events={events}
          />
        </>
      )}
    </div>
  );
};
