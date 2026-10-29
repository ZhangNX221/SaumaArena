'use client';

import React from 'react';
import { Match, MatchEvent, EventType, SportCode } from '@/types';
import { ScoringTimedGoals } from './scoring/ScoringTimedGoals';
import { ScoringRallySet } from './scoring/ScoringRallySet';
import { ScoringMapSeries } from './scoring/ScoringMapSeries';

interface RefereeScoringStepProps {
  currentMatch: Match;
  selectedSport?: SportCode;
  timerSeconds: number;
  isTimerRunning: boolean;
  currentPeriod: string;
  formatTime: (secs: number) => string;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onAddMinute?: () => void;
  onSubtractMinute?: () => void;
  onSetTimerSeconds?: (seconds: number) => void;
  onChangePeriod?: (period: string) => void;
  adminDurationMinutes?: number;
  onUpdateScore: (team: 'A' | 'B', delta: number) => void;
  onQuickIncident?: (type: EventType, team: 'A' | 'B', label: string) => void;
  events?: MatchEvent[];
  onUndoLastEvent?: () => void;
  onUndoTeamGoal?: (team: 'A' | 'B', eventId?: string) => void;
  foulsA?: number;
  foulsB?: number;
  timeoutsA?: number;
  timeoutsB?: number;
  onUpdateFouls?: (team: 'A' | 'B', delta: number) => void;
  onUpdateTimeouts?: (team: 'A' | 'B', delta: number) => void;
  matches?: Match[];
  onSelectMatch?: (matchId: string) => void;
  onResetMatch?: () => void;
}

export const RefereeScoringStep: React.FC<RefereeScoringStepProps> = ({
  currentMatch,
  selectedSport = 'FUTSAL',
  timerSeconds,
  isTimerRunning,
  currentPeriod,
  formatTime,
  onToggleTimer,
  onResetTimer,
  onAddMinute,
  onSubtractMinute,
  onSetTimerSeconds,
  onChangePeriod,
  adminDurationMinutes = 20,
  onUpdateScore,
  onQuickIncident,
  events,
  onUndoLastEvent,
  onUndoTeamGoal,
  foulsA,
  foulsB,
  timeoutsA,
  timeoutsB,
  onUpdateFouls,
  onUpdateTimeouts,
  matches,
  onSelectMatch,
  onResetMatch,
}) => {
  // Model skor ditentukan otomatis berdasarkan cabor penugasan juri
  const sport = selectedSport || 'FUTSAL';
  const isRally = sport === 'VOLI' || sport === 'BADMINTON' || sport === 'TENIS_MEJA';
  const isMapSeries = sport === 'ESPORT';

  return (
    <div className="space-y-4 animate-fadeIn">
      {isRally ? (
        <ScoringRallySet
          currentMatch={currentMatch}
          onUpdateScore={onUpdateScore}
        />
      ) : isMapSeries ? (
        <ScoringMapSeries
          currentMatch={currentMatch}
        />
      ) : (
        <ScoringTimedGoals
          currentMatch={currentMatch}
          timerSeconds={timerSeconds}
          isTimerRunning={isTimerRunning}
          currentPeriod={currentPeriod}
          formatTime={formatTime}
          onToggleTimer={onToggleTimer}
          onResetTimer={onResetTimer}
          onAddMinute={onAddMinute}
          onSubtractMinute={onSubtractMinute}
          onSetTimerSeconds={onSetTimerSeconds}
          onChangePeriod={onChangePeriod}
          adminDurationMinutes={adminDurationMinutes}
          onUpdateScore={onUpdateScore}
          onQuickIncident={onQuickIncident}
          events={events}
          onUndoLastEvent={onUndoLastEvent}
          onUndoTeamGoal={onUndoTeamGoal}
          foulsA={foulsA}
          foulsB={foulsB}
          timeoutsA={timeoutsA}
          timeoutsB={timeoutsB}
          onUpdateFouls={onUpdateFouls}
          onUpdateTimeouts={onUpdateTimeouts}
          matches={matches}
          onSelectMatch={onSelectMatch}
          onResetMatch={onResetMatch}
        />
      )}
    </div>
  );
};
