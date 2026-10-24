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
  onUpdateScore: (team: 'A' | 'B', delta: number) => void;
  onQuickIncident?: (type: EventType, team: 'A' | 'B', label: string) => void;
  events?: MatchEvent[];
  onUndoLastEvent?: () => void;
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
  onUpdateScore,
  onQuickIncident,
  events,
  onUndoLastEvent,
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
          onUpdateScore={onUpdateScore}
          onQuickIncident={onQuickIncident}
          events={events}
          onUndoLastEvent={onUndoLastEvent}
        />
      )}
    </div>
  );
};
