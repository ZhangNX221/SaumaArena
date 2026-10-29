'use client';

import React, { useState, useEffect } from 'react';
import { Radio, RotateCcw } from 'lucide-react';
import { Match, MatchEvent, SportCode, EventType, MatchLiveTelemetry } from '@/types';
import { RefereeScoringStep } from './steps/RefereeScoringStep';
import { usePersistentState } from '@/hooks/usePersistentState';
import { SportRuleSettings, DEFAULT_SPORT_RULES } from '@/config/sportRules';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';
import { initialMatches } from '@/mocks/tournamentData';
import { pushMatchToBackend } from '@/lib/apiSync';

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
  // Ambil state sinkronisasi pertandingan dan telemetri live
  const [matches, setMatches] = usePersistentState<Match[]>('sauma_arena_matches', initialMatches);
  const [telemetryMap, setTelemetryMap] = usePersistentState<Record<string, MatchLiveTelemetry>>(
    'sauma_arena_live_telemetry',
    {}
  );

  // Ambil konfigurasi aturan & durasi babak dari pengaturan admin
  const [matchRules] = usePersistentState<Record<string, SportRuleSettings>>(
    'sauma_arena_match_rules',
    DEFAULT_SPORT_RULES
  );

  // State ID laga yang dipilih (bisa dari luar atau diganti langsung via dropdown)
  const [selectedMatchId, setSelectedMatchId] = useState<string>(initialMatchProp.id);

  // Perbarui jika prop berganti dari induk
  useEffect(() => {
    setSelectedMatchId(initialMatchProp.id);
  }, [initialMatchProp.id]);

  // Instance laga aktif dari daftar matches bersama
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

  // Jalankan timer saat pertandingan berstatus aktif berjalan
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTelemetryMap((prev) => {
          const cur = prev[currentMatch.id] || defaultTelemetry;
          if (!cur.isTimerRunning || cur.timerSeconds <= 0) return prev;
          return {
            ...prev,
            [currentMatch.id]: {
              ...cur,
              timerSeconds: Math.max(0, cur.timerSeconds - 1),
              updatedAt: Date.now(),
            },
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, currentMatch.id]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
    if (onSelectMatchProp) {
      onSelectMatchProp(matchId);
    }
  };

  const handleResetMatch = () => {
    const isConfirmed = typeof window !== 'undefined'
      ? window.confirm(
          `Apakah Anda yakin ingin me-reset Laga #${currentMatch.matchNumber} (${currentMatch.teamAName} vs ${currentMatch.teamBName})?\nSkor akan kembali ke 0 - 0, timer ke ${adminDurationMinutes} menit, dan seluruh catatan babak ini dikembalikan ke awal.`
        )
      : true;
    if (!isConfirmed) return;

    // 1. Reset skor, status, dan riwayat gol di daftar pertandingan
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== currentMatch.id) return m;
        return {
          ...m,
          scoreA: 0,
          scoreB: 0,
          status: 'UPCOMING' as const,
          events: [],
        };
      })
    );
    pushMatchToBackend({ id: currentMatch.id, scoreA: 0, scoreB: 0, status: 'UPCOMING' });

    // 2. Reset telemetri live
    setTelemetryMap((prev) => ({
      ...prev,
      [currentMatch.id]: {
        timerSeconds: adminInitialSeconds,
        isTimerRunning: false,
        currentPeriod: 'Babak 1',
        foulsA: 0,
        foulsB: 0,
        timeoutsA: 1,
        timeoutsB: 1,
        updatedAt: Date.now(),
      },
    }));

    if (onResetMatchProp) {
      onResetMatchProp(currentMatch.id);
    }
  };

  const handleToggleTimer = () => {
    const nextIsRunning = !isTimerRunning;

    // Jika juri menjalankan timer, pastikan status match berubah ke LIVE di seluruh sistem
    if (nextIsRunning && currentMatch.status !== 'LIVE' && currentMatch.status !== 'COMPLETED') {
      setMatches((prev) =>
        prev.map((m) => (m.id === currentMatch.id ? { ...m, status: 'LIVE' } : m))
      );
      pushMatchToBackend({ id: currentMatch.id, status: 'LIVE' });
    }

    setTelemetryMap((prev) => {
      const cur = prev[currentMatch.id] || defaultTelemetry;
      return {
        ...prev,
        [currentMatch.id]: {
          ...cur,
          isTimerRunning: nextIsRunning,
          updatedAt: Date.now(),
        },
      };
    });
  };

  const handleResetTimer = () => {
    setTelemetryMap((prev) => ({
      ...prev,
      [currentMatch.id]: {
        ...(prev[currentMatch.id] || defaultTelemetry),
        isTimerRunning: false,
        timerSeconds: adminInitialSeconds,
        updatedAt: Date.now(),
      },
    }));
  };

  const handleAddMinute = () => {
    setTelemetryMap((prev) => {
      const cur = prev[currentMatch.id] || defaultTelemetry;
      return {
        ...prev,
        [currentMatch.id]: {
          ...cur,
          timerSeconds: cur.timerSeconds + 60,
          updatedAt: Date.now(),
        },
      };
    });
  };

  const handleSubtractMinute = () => {
    setTelemetryMap((prev) => {
      const cur = prev[currentMatch.id] || defaultTelemetry;
      return {
        ...prev,
        [currentMatch.id]: {
          ...cur,
          timerSeconds: Math.max(0, cur.timerSeconds - 60),
          updatedAt: Date.now(),
        },
      };
    });
  };

  const handleSetTimerSeconds = (secs: number) => {
    setTelemetryMap((prev) => ({
      ...prev,
      [currentMatch.id]: {
        ...(prev[currentMatch.id] || defaultTelemetry),
        isTimerRunning: false,
        timerSeconds: Math.max(0, secs),
        updatedAt: Date.now(),
      },
    }));
  };

  const handleChangePeriod = (period: string) => {
    setTelemetryMap((prev) => ({
      ...prev,
      [currentMatch.id]: {
        ...(prev[currentMatch.id] || defaultTelemetry),
        currentPeriod: period,
        updatedAt: Date.now(),
      },
    }));
  };

  const handleUpdateFouls = (team: 'A' | 'B', delta: number) => {
    setTelemetryMap((prev) => {
      const cur = prev[currentMatch.id] || defaultTelemetry;
      const count = team === 'A' ? cur.foulsA : cur.foulsB;
      const next = Math.max(0, count + delta);
      return {
        ...prev,
        [currentMatch.id]: {
          ...cur,
          [team === 'A' ? 'foulsA' : 'foulsB']: next,
          updatedAt: Date.now(),
        },
      };
    });
  };

  const handleUpdateTimeouts = (team: 'A' | 'B', delta: number) => {
    setTelemetryMap((prev) => {
      const cur = prev[currentMatch.id] || defaultTelemetry;
      const count = team === 'A' ? cur.timeoutsA : cur.timeoutsB;
      const next = Math.max(0, count + delta);
      return {
        ...prev,
        [currentMatch.id]: {
          ...cur,
          [team === 'A' ? 'timeoutsA' : 'timeoutsB']: next,
          updatedAt: Date.now(),
        },
      };
    });
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
    <div className="space-y-4 w-full pb-6 animate-fadeIn">
      {/* 1. Header Card Seragam Meja Wasit dengan Tombol Reset Laga */}
      <AdminPageHeaderCard
        icon={Radio}
        category="MEJA LAPANGAN • PENCATATAN SKOR & WAKTU"
        badge={
          <span className="text-[11px] font-mono font-bold text-[var(--text-main)] px-2 py-0.5 rounded-md bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
            Laga #{currentMatch.matchNumber} &bull; {currentMatch.courtName || 'Lapangan Utama'} &bull; {currentMatch.stage || 'Babak Penyisihan'}
          </span>
        }
        title={
          <>
            {currentMatch.teamAName} <span className="text-[var(--color-arena-accent)]">VS</span> {currentMatch.teamBName}
          </>
        }
        description="Pusat kendali meja wasit: catat timer pertandingan, perolehan skor, dan insiden pelanggaran secara langsung."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetMatch}
              className="btn-tactile px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-barlow font-bold uppercase tracking-wider text-xs border border-red-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset Seluruh Skor & Waktu Laga Ini ke 0-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Laga</span>
            </button>
            <div className="px-4 py-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-center min-w-[110px]">
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Skor Saat Ini
              </span>
              <span className="font-teko font-bold text-3xl text-[var(--color-arena-accent)] tabular-nums leading-none">
                {currentMatch.scoreA} - {currentMatch.scoreB}
              </span>
            </div>
          </div>
        }
      />

      {/* 2. Dek Konsol Skor & Stopwatch Lengkap (Dengan Selector Laga, Babak, dan Tombol Reset) */}
      <RefereeScoringStep
        currentMatch={currentMatch}
        selectedSport={selectedSport}
        timerSeconds={timerSeconds}
        isTimerRunning={isTimerRunning}
        currentPeriod={currentPeriod}
        formatTime={formatTime}
        onToggleTimer={handleToggleTimer}
        onResetTimer={handleResetTimer}
        onAddMinute={handleAddMinute}
        onSubtractMinute={handleSubtractMinute}
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
        onResetMatch={handleResetMatch}
      />
    </div>
  );
};
