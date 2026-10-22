'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Activity, AlertTriangle, FileCheck } from 'lucide-react';
import { ATHLETE_ID_CARDS } from '@/mocks/multiSportData';
import { Match, MatchEvent, SportCode, EventType } from '@/types';
import { RefereeCheckInStep } from './steps/RefereeCheckInStep';
import { RefereeScoringStep } from './steps/RefereeScoringStep';
import { RefereeIncidentStep } from './steps/RefereeIncidentStep';
import { RefereeBAPStep } from './steps/RefereeBAPStep';

interface RefereeMatchCenterProps {
  currentMatch: Match;
  selectedSport?: SportCode;
  onUpdateScore: (team: 'A' | 'B', delta: number) => void;
  onAddIncident: (event: Omit<MatchEvent, 'id'>) => void;
  onFinalizeBAP: (bapData: { winner: string; notes: string }) => void;
}

type MatchStep = 'CHECKIN' | 'SCORING' | 'INCIDENT' | 'BAP';

export const RefereeMatchCenter: React.FC<RefereeMatchCenterProps> = ({
  currentMatch,
  onUpdateScore,
  onAddIncident,
  onFinalizeBAP,
}) => {
  const [activeStep, setActiveStep] = useState<MatchStep>('SCORING');
  const [timerSeconds, setTimerSeconds] = useState(1140); // 19:00 remaining
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentPeriod] = useState('Babak 2');

  // Check-in state
  const [roster, setRoster] = useState(ATHLETE_ID_CARDS);
  const [scanNotice, setScanNotice] = useState<string | null>(null);

  // BAP Signatures State
  const [captainASigned, setCaptainASigned] = useState(false);
  const [captainBSigned, setCaptainBSigned] = useState(false);
  const [refereeSigned, setRefereeSigned] = useState(false);
  const [refereeNotes, setRefereeNotes] = useState('Pertandingan berlangsung sportif dan tertib.');
  const [bapSubmitted, setBapSubmitted] = useState(false);

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
    setScanNotice(`QR Terverifikasi: ${name} (ID Sah & Bebas Joki)`);
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
      detail: `Pencatatan resmi juri menit ${minute}`,
    });
  };

  const handleSaveBAP = () => {
    const winner = currentMatch.scoreA > currentMatch.scoreB ? currentMatch.teamAName : currentMatch.teamBName;
    onFinalizeBAP({ winner, notes: refereeNotes });
    setBapSubmitted(true);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-16">
      {/* 4-Step Action Tabs (Touch-First for Tablet / Mobile) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
        {[
          { key: 'CHECKIN', label: '1. Check-In Atlet', icon: UserCheck },
          { key: 'SCORING', label: '2. Skor Langsung', icon: Activity },
          { key: 'INCIDENT', label: '3. Catat Insiden', icon: AlertTriangle },
          { key: 'BAP', label: '4. Berita Acara (BAP)', icon: FileCheck },
        ].map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.key;
          return (
            <button
              key={step.key}
              type="button"
              onClick={() => setActiveStep(step.key as MatchStep)}
              className={`btn-tactile flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[48px] ${
                isActive
                  ? 'bg-[#33658a] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step 1: Pre-Match QR Check-In */}
      {activeStep === 'CHECKIN' && (
        <RefereeCheckInStep
          roster={roster}
          scanNotice={scanNotice}
          onSimulateScanAthlete={handleSimulateScanAthlete}
        />
      )}

      {/* Step 2: Live Scoring & Timer */}
      {activeStep === 'SCORING' && (
        <RefereeScoringStep
          currentMatch={currentMatch}
          timerSeconds={timerSeconds}
          isTimerRunning={isTimerRunning}
          currentPeriod={currentPeriod}
          formatTime={formatTime}
          onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
          onResetTimer={() => {
            setIsTimerRunning(false);
            setTimerSeconds(1200);
          }}
          onUpdateScore={onUpdateScore}
        />
      )}

      {/* Step 3: Fast Incident Logger */}
      {activeStep === 'INCIDENT' && (
        <RefereeIncidentStep
          currentMatch={currentMatch}
          onAddIncidentItem={handleAddIncidentItem}
        />
      )}

      {/* Step 4: Digital BAP & Signatures */}
      {activeStep === 'BAP' && (
        <RefereeBAPStep
          currentMatch={currentMatch}
          captainASigned={captainASigned}
          captainBSigned={captainBSigned}
          refereeSigned={refereeSigned}
          refereeNotes={refereeNotes}
          bapSubmitted={bapSubmitted}
          onSetCaptainASigned={setCaptainASigned}
          onSetCaptainBSigned={setCaptainBSigned}
          onSetRefereeSigned={setRefereeSigned}
          onSetRefereeNotes={setRefereeNotes}
          onSaveBAP={handleSaveBAP}
        />
      )}
    </div>
  );
};
