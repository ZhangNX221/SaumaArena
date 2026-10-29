'use client';

import React, { useState } from 'react';
import { Play, Pause, RotateCcw, BellRing, Sliders, Clock, X, Check, ChevronDown } from 'lucide-react';
import { Match, MatchEvent, EventType } from '@/types';
import { MatchGoalsTable } from './MatchGoalsTable';
import { TeamScoreFoulCard } from './TeamScoreFoulCard';
import { playTimerStartSound } from '@/utils/arenaSound';
import { MatchSelectorDropdown } from '@/components/common/MatchSelectorDropdown';

interface ScoringTimedGoalsProps {
  currentMatch: Match;
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

export const ScoringTimedGoals: React.FC<ScoringTimedGoalsProps> = ({
  currentMatch,
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
  events = [],
  onUndoLastEvent,
  onUndoTeamGoal,
  foulsA: foulsAProp,
  foulsB: foulsBProp,
  timeoutsA: timeoutsAProp,
  timeoutsB: timeoutsBProp,
  onUpdateFouls,
  onUpdateTimeouts,
  matches,
  onSelectMatch,
  onResetMatch,
}) => {
  const [localFoulsA, setLocalFoulsA] = useState(0);
  const [localFoulsB, setLocalFoulsB] = useState(0);
  const [localTimeoutsA, setLocalTimeoutsA] = useState(1);
  const [localTimeoutsB, setLocalTimeoutsB] = useState(1);

  const foulsA = foulsAProp !== undefined ? foulsAProp : localFoulsA;
  const foulsB = foulsBProp !== undefined ? foulsBProp : localFoulsB;
  const timeoutsA = timeoutsAProp !== undefined ? timeoutsAProp : localTimeoutsA;
  const timeoutsB = timeoutsBProp !== undefined ? timeoutsBProp : localTimeoutsB;

  const [isBellRinging, setIsBellRinging] = useState(false);

  // Modal Atur Waktu
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(Math.floor(timerSeconds / 60));
  const [inputSeconds, setInputSeconds] = useState(timerSeconds % 60);

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
    playTimerStartSound();
    setTimeout(() => setIsBellRinging(false), 2400);
  };

  const handleFoulChange = (team: 'A' | 'B', delta: number) => {
    if (onUpdateFouls) {
      onUpdateFouls(team, delta);
    } else {
      if (team === 'A') setLocalFoulsA((prev) => Math.max(0, prev + delta));
      else setLocalFoulsB((prev) => Math.max(0, prev + delta));
    }
    const current = team === 'A' ? foulsA : foulsB;
    const next = Math.max(0, current + delta);
    if (delta > 0 && onQuickIncident) onQuickIncident('FOUL', team, `Foul ke-${next}`);
  };

  const handleTimeout = (team: 'A' | 'B') => {
    if (team === 'A' && timeoutsA > 0) {
      if (onUpdateTimeouts) onUpdateTimeouts('A', -1);
      else setLocalTimeoutsA((prev) => prev - 1);
      onQuickIncident?.('TIMEOUT', 'A', 'Time Out Babak Ini');
    } else if (team === 'B' && timeoutsB > 0) {
      if (onUpdateTimeouts) onUpdateTimeouts('B', -1);
      else setLocalTimeoutsB((prev) => prev - 1);
      onQuickIncident?.('TIMEOUT', 'B', 'Time Out Babak Ini');
    }
  };

  const handleOpenTimeModal = () => {
    setInputMinutes(Math.floor(timerSeconds / 60));
    setInputSeconds(timerSeconds % 60);
    setShowTimeModal(true);
  };

  const handleApplyCustomTime = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSecs = Math.max(0, Number(inputMinutes) * 60 + Number(inputSeconds));
    if (onSetTimerSeconds) {
      onSetTimerSeconds(totalSecs);
    }
    setShowTimeModal(false);
  };

  const handleQuickPreset = (minutes: number) => {
    setInputMinutes(minutes);
    setInputSeconds(0);
    if (onSetTimerSeconds) {
      onSetTimerSeconds(minutes * 60);
    }
    setShowTimeModal(false);
  };

  const handleCyclePeriod = () => {
    if (!onChangePeriod) return;
    const next =
      currentPeriod === 'Babak 1'
        ? 'Babak 2'
        : currentPeriod === 'Babak 2'
        ? 'Perpanjangan'
        : 'Babak 1';
    onChangePeriod(next);
  };

  return (
    <div className="rounded-xl bg-[var(--bg-surface)] text-[var(--text-main)] border-2 border-slate-300 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-3.5 animate-fadeIn max-w-full overflow-hidden">
      {/* 1. Top Meta Bar: Papan Skor & Stopwatch Lapangan + Selector Laga Dropdown + Babak + Tombol Reset + Bel */}
      <div className="flex flex-col gap-3 text-xs pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="font-bebas text-base sm:text-xl uppercase tracking-wider text-[var(--text-main)] leading-none truncate">
              Papan Skor &amp; Stopwatch Lapangan
            </span>
          </div>
          <span className="hidden sm:inline-flex text-[10px] text-[var(--text-muted)] font-mono px-2 py-0.5 rounded bg-[var(--bg-muted)] border border-slate-300 dark:border-slate-700 shrink-0">
            Admin: {adminDurationMinutes} Menit
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 w-full">
          {/* Selector Laga Meja Wasit Dropdown */}
          {matches && matches.length > 0 && onSelectMatch && (
            <div className="flex-1 min-w-0 max-w-full">
              <MatchSelectorDropdown
                matches={matches}
                selectedMatchId={currentMatch.id}
                onSelectMatch={onSelectMatch}
              />
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto flex-wrap">
            {/* Tombol Babak (Clickable untuk ganti babak) */}
            <button
              type="button"
              onClick={handleCyclePeriod}
              className="btn-tactile px-3 py-2 rounded-xl bg-[var(--bg-muted)] hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--color-arena-accent)] font-barlow font-bold uppercase tracking-wider text-xs border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer min-h-[38px] flex items-center"
              title="Klik untuk Ganti Babak Pertandingan"
            >
              {currentPeriod}
            </button>

            {/* Tombol Reset Pertandingan Laga Ini */}
            {onResetMatch && (
              <button
                type="button"
                onClick={onResetMatch}
                className="btn-tactile px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-barlow font-bold uppercase tracking-wider text-xs border border-red-500/30 flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
                title="Reset Skor, Waktu, dan Pelanggaran Laga Ini ke 0-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            {/* Tombol Bel Kick-off */}
            <button
              type="button"
              onClick={handleRingBell}
              className={`btn-tactile px-2.5 py-2 rounded-xl font-barlow font-bold uppercase text-xs border flex items-center gap-1.5 transition-all shadow-xs cursor-pointer min-h-[38px] ${
                isBellRinging
                  ? 'bg-red-600 text-white border-red-400 animate-pulse ring-2 ring-red-400'
                  : 'bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
              }`}
              title="Bunyikan Bel Kick-off / Mulai Pertandingan"
            >
              <BellRing className={`w-3.5 h-3.5 ${isBellRinging ? 'animate-bounce text-white' : 'text-amber-500'}`} />
              <span className="hidden sm:inline">{isBellRinging ? 'Bel Berbunyi!' : 'Bel Kick-off'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Kickoff Banner when Bell Rings */}
      {isBellRinging && (
        <div className="p-2.5 rounded-lg bg-red-600 text-white font-barlow font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg animate-pulse border border-amber-300">
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
        <div className="md:col-span-2 rounded-xl bg-[var(--bg-muted)] border-2 border-slate-300 dark:border-slate-800 p-3 flex flex-col items-center justify-center space-y-2 text-center relative shadow-xs">
          <div className="flex items-center justify-between w-full px-0.5">
            <span className="text-[10px] font-barlow font-bold tracking-widest text-[var(--text-muted)] uppercase">
              Waktu Laga
            </span>
            <button
              type="button"
              onClick={handleOpenTimeModal}
              className="p-1 rounded text-[var(--text-muted)] hover:text-amber-500 transition-all text-[10px] flex items-center gap-0.5 font-bold uppercase cursor-pointer"
              title="Atur Waktu Pertandingan"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Atur</span>
            </button>
          </div>

          {/* Display Timer (Clickable to edit) */}
          <div
            onClick={handleOpenTimeModal}
            className="text-4xl sm:text-5xl font-teko font-bold tracking-wider text-[var(--text-main)] tabular-nums leading-none cursor-pointer hover:text-amber-500 transition-colors py-0.5 select-none"
            title="Klik untuk Mengatur Waktu Pertandingan"
          >
            {formatTime(timerSeconds)}
          </div>

          <div className="flex flex-col gap-1.5 w-full pt-1">
            <button
              type="button"
              onClick={() => {
                onToggleTimer();
              }}
              className={`btn-tactile w-full py-2 px-2.5 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer min-h-[38px] ${
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
              className={`btn-tactile w-full py-1.5 px-1.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                isBellRinging
                  ? 'bg-red-600 text-white border-red-400 animate-pulse'
                  : 'bg-[var(--bg-surface)] hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-700 dark:text-amber-300 border-slate-300 dark:border-slate-700'
              }`}
              title="Bunyikan Bel / Buzzer Kick-off"
            >
              <BellRing className="w-3 h-3 text-amber-500" />
              <span>Bunyikan Bel</span>
            </button>

            {/* Tombol Pengatur Waktu Cepat */}
            <div className="grid grid-cols-4 gap-1 w-full pt-0.5">
              <button
                type="button"
                onClick={onSubtractMinute}
                className="btn-tactile py-1 px-1 rounded-md bg-[var(--bg-surface)] hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--text-main)] font-barlow font-bold uppercase text-[10px] border border-slate-300 dark:border-slate-600 cursor-pointer"
                title="Kurangi 1 Menit (-1m)"
              >
                -1m
              </button>
              <button
                type="button"
                onClick={onAddMinute}
                className="btn-tactile py-1 px-1 rounded-md bg-[var(--bg-surface)] hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--text-main)] font-barlow font-bold uppercase text-[10px] border border-slate-300 dark:border-slate-600 cursor-pointer"
                title="Tambah 1 Menit (+1m)"
              >
                +1m
              </button>
              <button
                type="button"
                onClick={handleOpenTimeModal}
                className="btn-tactile py-1 px-1 rounded-md bg-[var(--bg-surface)] hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 font-barlow font-bold uppercase text-[10px] border border-slate-300 dark:border-slate-600 flex items-center justify-center cursor-pointer"
                title="Set Waktu Manual"
              >
                Set
              </button>
              <button
                type="button"
                onClick={onResetTimer}
                className="btn-tactile py-1 px-1 rounded-md bg-[var(--bg-surface)] hover:bg-slate-200 dark:hover:bg-slate-700 text-red-600 dark:text-red-400 font-barlow font-bold uppercase text-[10px] border border-slate-300 dark:border-slate-600 flex items-center justify-center cursor-pointer"
                title="Reset Waktu ke Default"
              >
                <RotateCcw className="w-2.5 h-2.5" />
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

      {/* MODAL ATUR WAKTU PERTANDINGAN */}
      {showTimeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowTimeModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 p-5 space-y-4 text-[var(--text-main)] shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1D63B8] dark:text-sky-400" />
                <h4 className="font-bebas text-lg uppercase tracking-wide text-[var(--text-main)]">
                  Atur Waktu Pertandingan
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowTimeModal(false)}
                className="p-1 rounded-lg hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyCustomTime} className="space-y-4">
              {/* Preset Cepat */}
              <div>
                <label className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">
                  Preset Cepat (Menit):
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[10, 12, 15, adminDurationMinutes || 20].map((mins, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickPreset(mins)}
                      className={`btn-tactile py-2 px-2 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                        inputMinutes === mins && inputSeconds === 0
                          ? 'bg-[#1D63B8] text-white border-transparent shadow-xs'
                          : 'bg-[var(--bg-muted)] hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--text-main)] border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Manual Menit & Detik */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  Set Waktu Manual:
                </label>
                <div className="flex items-center justify-center gap-2 bg-[var(--bg-muted)] p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-center">
                    <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                      Menit
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={90}
                      value={inputMinutes}
                      onChange={(e) => setInputMinutes(Math.max(0, Number(e.target.value)))}
                      className="w-16 text-center text-3xl font-teko font-bold bg-[var(--bg-surface)] border border-slate-300 dark:border-slate-600 rounded-lg py-1 text-[var(--text-main)] focus:outline-none focus:border-[#1D63B8]"
                    />
                  </div>
                  <span className="text-2xl font-bold text-[#1D63B8] dark:text-sky-400 pt-3">:</span>
                  <div className="text-center">
                    <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                      Detik
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={inputSeconds}
                      onChange={(e) => setInputSeconds(Math.max(0, Math.min(59, Number(e.target.value))))}
                      className="w-16 text-center text-3xl font-teko font-bold bg-[var(--bg-surface)] border border-slate-300 dark:border-slate-600 rounded-lg py-1 text-[var(--text-main)] focus:outline-none focus:border-[#1D63B8]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-sky-950/40 border border-blue-200 dark:border-sky-800 text-[11px] text-[#1D63B8] dark:text-sky-300 flex items-center justify-between">
                <span>Default Pengaturan Admin:</span>
                <span className="font-mono font-bold text-[var(--text-main)]">{adminDurationMinutes} Menit</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    handleQuickPreset(adminDurationMinutes);
                  }}
                  className="btn-tactile flex-1 py-2.5 rounded-lg bg-[var(--bg-muted)] hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer min-h-[42px]"
                >
                  Reset ke Admin
                </button>
                <button
                  type="submit"
                  className="btn-tactile flex-1 py-2.5 rounded-lg bg-[#1D63B8] hover:bg-[#154D92] text-white text-xs font-barlow font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer min-h-[42px]"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Terapkan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
