'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Match, MatchEvent, SportCode, EventType, MatchLiveTelemetry, RefereeMatchDuty } from '@/types';
import { RefereeScoringStep } from './steps/RefereeScoringStep';
import { usePersistentState } from '@/hooks/usePersistentState';
import { SportRuleSettings, DEFAULT_SPORT_RULES } from '@/config/sportRules';
import { RefereeMatchCenterHeader } from './RefereeMatchCenterHeader';
import { ResetMatchConfirmModal } from './dialogs/ResetMatchConfirmModal';
import { SaveMatchConfirmModal } from './dialogs/SaveMatchConfirmModal';
import { initialMatches } from '@/mocks/tournamentData';
import { REFEREE_DUTIES } from '@/mocks/multiSportData';
import { pushMatchToBackend, pushLiveTelemetryToBackend } from '@/lib/apiSync';
import { playTimerStartSound, playTimerEndSound } from '@/utils/arenaSound';

interface RefereeMatchCenterProps {
  currentMatch: Match;
  selectedSport?: SportCode;
  onUpdateScore: (team: 'A' | 'B', delta: number) => void;
  onAddIncident: (event: Omit<MatchEvent, 'id'>) => void;
  onFinalizeBAP?: (bapData: { winner: string; notes: string }) => void;
  matches?: Match[];
  onSelectMatch?: (matchId: string) => void;
  onResetMatch?: (matchId: string) => void;
}

export const RefereeMatchCenter: React.FC<RefereeMatchCenterProps> = ({
  currentMatch: initialMatchProp,
  selectedSport = 'FUTSAL',
  onUpdateScore,
  onAddIncident,
  onSelectMatch: onSelectMatchProp,
  onResetMatch: onResetMatchProp,
}) => {
  const [matches, setMatches] = usePersistentState<Match[]>('sauma_arena_matches', initialMatches);
  const [, setDuties] = usePersistentState<RefereeMatchDuty[]>('sauma_arena_duties', REFEREE_DUTIES);
  const [telemetryMap, setTelemetryMap] = usePersistentState<Record<string, MatchLiveTelemetry>>('sauma_arena_live_telemetry', {});
  const [matchRules] = usePersistentState<Record<string, SportRuleSettings>>('sauma_arena_match_rules', DEFAULT_SPORT_RULES);

  const [selectedMatchId, setSelectedMatchId] = useState<string>(initialMatchProp.id);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  useEffect(() => {
    setSelectedMatchId(initialMatchProp.id);
  }, [initialMatchProp.id]);

  const currentMatch = matches.find((m) => m.id === selectedMatchId) || initialMatchProp;
  const currentSportRules = matchRules[selectedSport] || DEFAULT_SPORT_RULES.FUTSAL;
  const adminDurationMinutes = currentSportRules?.durationPerPeriod || 20;
  const adminInitialSeconds = adminDurationMinutes * 60;

  const defaultTelemetry: MatchLiveTelemetry = {
    timerSeconds: adminInitialSeconds,
    isTimerRunning: false,
    currentPeriod: 'Babak 1',
    foulsA: 0,
    foulsB: 0,
    timeoutsA: 1,
    timeoutsB: 1,
    updatedAt: Date.now(),
  };

  const currentTelemetry = telemetryMap[currentMatch.id] || defaultTelemetry;
  const timerSeconds = currentTelemetry.timerSeconds ?? adminInitialSeconds;
  const isTimerRunning = currentTelemetry.isTimerRunning ?? false;
  const currentPeriod = currentTelemetry.currentPeriod ?? 'Babak 1';
  const foulsA = currentTelemetry.foulsA ?? 0;
  const foulsB = currentTelemetry.foulsB ?? 0;
  const timeoutsA = currentTelemetry.timeoutsA ?? 1;
  const timeoutsB = currentTelemetry.timeoutsB ?? 1;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTelemetryMap((prev) => {
          const cur = prev[currentMatch.id] || defaultTelemetry;
          if (!cur.isTimerRunning || cur.timerSeconds <= 0) return prev;
          const nextSecs = Math.max(0, cur.timerSeconds - 1);
          return {
            ...prev,
            [currentMatch.id]: { ...cur, timerSeconds: nextSecs, isTimerRunning: nextSecs > 0, updatedAt: Date.now() },
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, currentMatch.id]);

  const prevRefereeSecondsRef = useRef<number>(timerSeconds);
  const hasTriggeredRefereeEndSoundRef = useRef<boolean>(false);

  useEffect(() => {
    if (prevRefereeSecondsRef.current > 0 && timerSeconds === 0) {
      if (!hasTriggeredRefereeEndSoundRef.current) {
        playTimerEndSound();
        hasTriggeredRefereeEndSoundRef.current = true;
      }
    } else if (timerSeconds > 0) {
      hasTriggeredRefereeEndSoundRef.current = false;
    }
    prevRefereeSecondsRef.current = timerSeconds;
  }, [timerSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
    pushLiveTelemetryToBackend(matchId, telemetryMap[matchId] || defaultTelemetry, { activeMatchId: matchId });
    if (onSelectMatchProp) onSelectMatchProp(matchId);
  };

  const handleConfirmReset = () => {
    setIsResetConfirmOpen(false);
    setMatches((prev) =>
      prev.map((m) => (m.id === currentMatch.id ? { ...m, scoreA: 0, scoreB: 0, status: 'UPCOMING', events: [] } : m))
    );
    setDuties((prev) =>
      prev.map((d) =>
        d.matchId === currentMatch.id || String(d.matchNumber) === String(currentMatch.matchNumber)
          ? { ...d, status: 'UPCOMING' }
          : d
      )
    );
    const resetTelem: MatchLiveTelemetry = { ...defaultTelemetry, updatedAt: Date.now() };
    setTelemetryMap((prev) => ({ ...prev, [currentMatch.id]: resetTelem }));
    pushMatchToBackend({ id: currentMatch.id, scoreA: 0, scoreB: 0, status: 'UPCOMING', events: [] }, resetTelem);
    if (onResetMatchProp) onResetMatchProp(currentMatch.id);
  };

  const handleConfirmSaveMatch = async () => {
    setIsSaving(true);
    setIsSaveConfirmOpen(false);

    const stopTelem: MatchLiveTelemetry = {
      ...(telemetryMap[currentMatch.id] || defaultTelemetry),
      isTimerRunning: false,
      updatedAt: Date.now(),
    };
    setTelemetryMap((prev) => ({ ...prev, [currentMatch.id]: stopTelem }));

    const completedMatch: Match = {
      ...currentMatch,
      status: 'COMPLETED',
      bapSigned: true,
      bapSigner: 'Ust. Ahmad Syarif, S.Pd',
    };

    setMatches((prev) => prev.map((m) => (m.id === currentMatch.id ? completedMatch : m)));
    setDuties((prev) =>
      prev.map((d) =>
        d.matchId === currentMatch.id || String(d.matchNumber) === String(currentMatch.matchNumber)
          ? { ...d, status: 'COMPLETED' }
          : d
      )
    );
    await pushMatchToBackend(completedMatch, stopTelem);
    await pushLiveTelemetryToBackend(currentMatch.id, stopTelem, {
      status: 'COMPLETED',
      scoreA: currentMatch.scoreA,
      scoreB: currentMatch.scoreB,
    });

    setIsSaving(false);
    setSaveToast(`Laga #${currentMatch.matchNumber} (${currentMatch.teamAName} vs ${currentMatch.teamBName}) berhasil disimpan sebagai SELESAI dan BAP resmi telah disahkan!`);
    setTimeout(() => setSaveToast(null), 4000);
  };

  const handleToggleTimer = () => {
    const nextIsRunning = !isTimerRunning;
    if (nextIsRunning && timerSeconds > 0) playTimerStartSound();

    const nextStatus = nextIsRunning && currentMatch.status !== 'COMPLETED' ? 'LIVE' : currentMatch.status;
    if (nextStatus !== currentMatch.status) {
      setMatches((prev) => prev.map((m) => (m.id === currentMatch.id ? { ...m, status: nextStatus } : m)));
    }

    const nextTelem: MatchLiveTelemetry = {
      ...(telemetryMap[currentMatch.id] || defaultTelemetry),
      isTimerRunning: nextIsRunning,
      timerSeconds,
      updatedAt: Date.now(),
    };
    setTelemetryMap((prev) => ({ ...prev, [currentMatch.id]: nextTelem }));
    pushLiveTelemetryToBackend(currentMatch.id, nextTelem, {
      status: nextStatus,
      scoreA: currentMatch.scoreA,
      scoreB: currentMatch.scoreB,
    });
  };

  const handleResetTimer = () => {
    const nextTelem: MatchLiveTelemetry = {
      ...(telemetryMap[currentMatch.id] || defaultTelemetry),
      isTimerRunning: false,
      timerSeconds: adminInitialSeconds,
      updatedAt: Date.now(),
    };
    setTelemetryMap((prev) => ({ ...prev, [currentMatch.id]: nextTelem }));
    pushLiveTelemetryToBackend(currentMatch.id, nextTelem);
  };

  const handleAdjustMinute = (deltaSecs: number) => {
    const cur = telemetryMap[currentMatch.id] || defaultTelemetry;
    const nextSecs = Math.max(0, cur.timerSeconds + deltaSecs);
    const nextTelem: MatchLiveTelemetry = { ...cur, timerSeconds: nextSecs, updatedAt: Date.now() };
    setTelemetryMap((prev) => ({ ...prev, [currentMatch.id]: nextTelem }));
    pushLiveTelemetryToBackend(currentMatch.id, nextTelem);
  };

  const handleChangePeriod = (period: string) => {
    const nextTelem: MatchLiveTelemetry = { ...(telemetryMap[currentMatch.id] || defaultTelemetry), currentPeriod: period, updatedAt: Date.now() };
    setTelemetryMap((prev) => ({ ...prev, [currentMatch.id]: nextTelem }));
    pushLiveTelemetryToBackend(currentMatch.id, nextTelem);
  };

  const handleUpdateFouls = (team: 'A' | 'B', delta: number) => {
    const cur = telemetryMap[currentMatch.id] || defaultTelemetry;
    const count = team === 'A' ? cur.foulsA : cur.foulsB;
    const nextTelem: MatchLiveTelemetry = { ...cur, [team === 'A' ? 'foulsA' : 'foulsB']: Math.max(0, count + delta), updatedAt: Date.now() };
    setTelemetryMap((prev) => ({ ...prev, [currentMatch.id]: nextTelem }));
    pushLiveTelemetryToBackend(currentMatch.id, nextTelem);
  };

  const handleUpdateTimeouts = (team: 'A' | 'B', delta: number) => {
    const cur = telemetryMap[currentMatch.id] || defaultTelemetry;
    const count = team === 'A' ? cur.timeoutsA : cur.timeoutsB;
    const nextTelem: MatchLiveTelemetry = { ...cur, [team === 'A' ? 'timeoutsA' : 'timeoutsB']: Math.max(0, count + delta), updatedAt: Date.now() };
    setTelemetryMap((prev) => ({ ...prev, [currentMatch.id]: nextTelem }));
    pushLiveTelemetryToBackend(currentMatch.id, nextTelem);
  };

  const handleSetTimerSeconds = (secs: number) => {
    const nextTelem: MatchLiveTelemetry = { ...(telemetryMap[currentMatch.id] || defaultTelemetry), isTimerRunning: false, timerSeconds: Math.max(0, secs), updatedAt: Date.now() };
    setTelemetryMap((prev) => ({ ...prev, [currentMatch.id]: nextTelem }));
    pushLiveTelemetryToBackend(currentMatch.id, nextTelem);
  };

  const handleAddIncidentItem = (type: EventType, team: 'A' | 'B', label: string) => {
    const teamId = team === 'A' ? currentMatch.teamAId : currentMatch.teamBId;
    const teamName = team === 'A' ? currentMatch.teamAName : currentMatch.teamBName;
    const elapsedSecs = Math.max(0, adminInitialSeconds - timerSeconds);
    const minute = Math.max(1, Math.floor(elapsedSecs / 60) + 1);

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
    if (!currentMatch.events || currentMatch.events.length === 0) return;
    const lastEvent = currentMatch.events[0];
    const isGoal = lastEvent.type === 'GOAL';
    const isGoalA = isGoal && (lastEvent.teamId === currentMatch.teamAId || (lastEvent.playerName || '').toLowerCase().includes('tim a'));
    const isGoalB = isGoal && !isGoalA;

    const newScoreA = isGoalA ? Math.max(0, currentMatch.scoreA - 1) : currentMatch.scoreA;
    const newScoreB = isGoalB ? Math.max(0, currentMatch.scoreB - 1) : currentMatch.scoreB;
    const newEvents = currentMatch.events.slice(1);

    const updatedMatch: Match = {
      ...currentMatch,
      scoreA: newScoreA,
      scoreB: newScoreB,
      events: newEvents,
      status: 'LIVE',
    };

    setMatches((prev) => prev.map((m) => (m.id === currentMatch.id ? updatedMatch : m)));
    pushMatchToBackend(updatedMatch, telemetryMap[currentMatch.id]);
    pushLiveTelemetryToBackend(currentMatch.id, telemetryMap[currentMatch.id] || defaultTelemetry, {
      scoreA: newScoreA,
      scoreB: newScoreB,
      status: 'LIVE',
    });
  };

  const handleUndoTeamGoal = (team: 'A' | 'B', eventId?: string) => {
    const targetTeamId = team === 'A' ? currentMatch.teamAId : currentMatch.teamBId;
    const oppTeamId = team === 'A' ? currentMatch.teamBId : currentMatch.teamAId;
    const firstWord = (team === 'A' ? currentMatch.teamAName : currentMatch.teamBName).split(' ')[0].toLowerCase().trim();

    const events = currentMatch.events || [];
    const idx = events.findIndex((e) => {
      if (e.type !== 'GOAL') return false;
      if (eventId) return e.id === eventId;
      if (e.teamId === targetTeamId) return true;
      if (e.teamId === oppTeamId) return false;
      const name = (e.playerName || '').toLowerCase();
      if (name.includes(team === 'A' ? 'tim a' : 'tim b')) return true;
      if (name.includes(team === 'A' ? 'tim b' : 'tim a')) return false;
      if (firstWord && firstWord.length >= 2 && new RegExp(`\\b${firstWord}\\b`, 'i').test(name)) return true;
      return false;
    });

    const newEvents = idx !== -1 ? events.filter((_, i) => i !== idx) : events;
    const newScoreA = team === 'A' ? Math.max(0, currentMatch.scoreA - 1) : currentMatch.scoreA;
    const newScoreB = team === 'B' ? Math.max(0, currentMatch.scoreB - 1) : currentMatch.scoreB;

    const updatedMatch: Match = {
      ...currentMatch,
      scoreA: newScoreA,
      scoreB: newScoreB,
      events: newEvents,
      status: 'LIVE',
    };

    setMatches((prev) => prev.map((m) => (m.id === currentMatch.id ? updatedMatch : m)));
    pushMatchToBackend(updatedMatch, telemetryMap[currentMatch.id]);
    pushLiveTelemetryToBackend(currentMatch.id, telemetryMap[currentMatch.id] || defaultTelemetry, {
      scoreA: newScoreA,
      scoreB: newScoreB,
      status: 'LIVE',
    });
  };

  return (
    <div className="space-y-4 w-full pb-6 animate-fadeIn">
      {saveToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-2 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* 1. Header Card Seragam Meja Wasit dengan Tombol Simpan & Reset Laga */}
      <RefereeMatchCenterHeader
        currentMatch={currentMatch}
        onResetMatch={() => setIsResetConfirmOpen(true)}
        onSaveMatch={() => setIsSaveConfirmOpen(true)}
        isSaving={isSaving}
      />

      {/* 2. Dek Konsol Skor & Stopwatch Lengkap */}
      <RefereeScoringStep
        currentMatch={currentMatch}
        selectedSport={selectedSport}
        timerSeconds={timerSeconds}
        isTimerRunning={isTimerRunning}
        currentPeriod={currentPeriod}
        formatTime={formatTime}
        onToggleTimer={handleToggleTimer}
        onResetTimer={handleResetTimer}
        onAddMinute={() => handleAdjustMinute(60)}
        onSubtractMinute={() => handleAdjustMinute(-60)}
        onSetTimerSeconds={handleSetTimerSeconds}
        onChangePeriod={handleChangePeriod}
        adminDurationMinutes={adminDurationMinutes}
        onUpdateScore={onUpdateScore}
        onQuickIncident={handleAddIncidentItem}
        events={currentMatch.events}
        onUndoLastEvent={handleUndoLastEvent}
        onUndoTeamGoal={handleUndoTeamGoal}
        foulsA={foulsA}
        foulsB={foulsB}
        timeoutsA={timeoutsA}
        timeoutsB={timeoutsB}
        onUpdateFouls={handleUpdateFouls}
        onUpdateTimeouts={handleUpdateTimeouts}
        matches={matches}
        onSelectMatch={handleSelectMatch}
        onResetMatch={() => setIsResetConfirmOpen(true)}
        onSaveMatch={() => setIsSaveConfirmOpen(true)}
      />

      <ResetMatchConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        currentMatch={currentMatch}
        adminDurationMinutes={adminDurationMinutes}
      />

      <SaveMatchConfirmModal
        isOpen={isSaveConfirmOpen}
        onClose={() => setIsSaveConfirmOpen(false)}
        onConfirm={handleConfirmSaveMatch}
        currentMatch={currentMatch}
        isSaving={isSaving}
      />
    </div>
  );
};
