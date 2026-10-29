'use client';

import React from 'react';
import { Clock, Minimize, ChevronDown, Trophy, Shield, Activity, Flame } from 'lucide-react';
import { Match } from '@/types';
import { getTeamLogoUrl } from '@/mocks/teamLogos';

interface LiveMatchFullscreenArenaProps {
  match: Match;
  scoreA: number;
  scoreB: number;
  timerSeconds: number;
  isTimerRunning: boolean;
  currentPeriod: string;
  foulsA: number;
  foulsB: number;
  timeoutsA: number;
  timeoutsB: number;
  yellowCardsA?: number;
  redCardsA?: number;
  yellowCardsB?: number;
  redCardsB?: number;
  formatTime: (secs: number) => string;
  onExitFullscreen: () => void;
  matches?: Match[];
  selectedMatchId?: string;
  onSelectMatch?: (id: string) => void;
}

export const LiveMatchFullscreenArena: React.FC<LiveMatchFullscreenArenaProps> = ({
  match,
  scoreA,
  scoreB,
  timerSeconds,
  isTimerRunning,
  currentPeriod,
  foulsA,
  foulsB,
  timeoutsA,
  timeoutsB,
  yellowCardsA = 0,
  redCardsA = 0,
  yellowCardsB = 0,
  redCardsB = 0,
  formatTime,
  onExitFullscreen,
  matches,
  selectedMatchId,
  onSelectMatch,
}) => {
  const isMatchLive = match.status === 'LIVE';
  const isMatchCompleted = match.status === 'COMPLETED';
  const isMatchUpcoming = match.status === 'UPCOMING' || (!isMatchLive && !isMatchCompleted);

  // Big, vivid foul indicators clearly visible from stadium distance (10-20m)
  const renderFoulDots = (count: number) =>
    [1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 rounded-full border-2 transition-all ${
          i <= count
            ? count >= 5
              ? 'bg-red-500 border-red-300 shadow-[0_0_16px_rgba(239,68,68,1)] ring-2 ring-red-400/60'
              : 'bg-amber-400 border-amber-200 shadow-[0_0_14px_rgba(251,191,36,0.95)]'
            : 'bg-slate-800/90 border-slate-700'
        }`}
      />
    ));

  const events = match.events || [];
  const goalsA = events.filter((e) => e.type === 'GOAL' && (e.teamId === match.teamAId || e.teamId === 'team-sdi-kardina'));
  const goalsB = events.filter((e) => e.type === 'GOAL' && (e.teamId === match.teamBId || e.teamId === 'team-min7-blitar'));

  return (
    <div className="w-full h-full max-w-[177.78vh] mx-auto flex flex-col justify-between p-3 sm:p-5 lg:p-7 xl:p-8 select-none text-white overflow-hidden animate-fadeIn">
      {/* 1. TOP ARENA HEADER (Proportionate 10-12% Height) */}
      <header className="flex items-center justify-between gap-4 pb-3 border-b-2 border-slate-800/80 shrink-0">
        {/* Left: Tournament Branding */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-[#1D63B8] to-[#0284C7] p-2 flex items-center justify-center shadow-lg border border-sky-400/30 shrink-0">
            <Trophy className="w-full h-full text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bebas text-lg sm:text-xl lg:text-2xl xl:text-3xl uppercase tracking-wider text-white truncate">
                MILAD MATSANEGA FUTSAL COMPETITION I (MMFC I)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-[10px] sm:text-xs font-mono font-bold text-sky-300 shrink-0 uppercase">
                {match.stage || 'FASE GRUP'}
              </span>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-slate-300 font-medium truncate flex items-center gap-2">
              <span>{match.courtName || 'Lapangan Futsal Seabless'}</span>
              <span>&bull;</span>
              <span className="font-bold text-white">Laga #{match.matchNumber}</span>
            </p>
          </div>
        </div>

        {/* Center / Right Controls: Selector Laga & Tombol Keluar Fullscreen */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Match Selector Dropdown */}
          {matches && matches.length > 0 && onSelectMatch && (
            <div className="relative">
              <select
                value={selectedMatchId || match.id}
                onChange={(e) => onSelectMatch(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 sm:py-2.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 border-2 border-slate-700 text-white font-barlow font-bold text-xs sm:text-sm uppercase tracking-wider cursor-pointer focus:outline-none transition-colors shadow-md"
                aria-label="Pilih laga tayang jumbotron"
              >
                {matches.map((m) => (
                  <option key={m.id} value={m.id} className="bg-slate-950 text-white">
                    Laga #{m.matchNumber}: {m.teamAName} vs {m.teamBName} ({m.scoreA} - {m.scoreB})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Period Badge */}
          <div className="px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900/95 border-2 border-slate-700 text-sky-400 font-barlow font-extrabold uppercase tracking-wider text-xs sm:text-sm shadow-md">
            {currentPeriod}
          </div>

          {/* Exit Fullscreen Button */}
          <button
            type="button"
            onClick={onExitFullscreen}
            className="btn-tactile px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-barlow font-bold uppercase text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-lg shrink-0 cursor-pointer min-h-[38px] border border-red-400/30"
            title="Keluar dari Mode Layar Penuh (ESC)"
          >
            <Minimize className="w-4 h-4" />
            <span>Keluar (ESC)</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN 16:9 SCOREBOARD STAGE (Proportionate 75-80% Height) */}
      <main className="flex-1 grid grid-cols-12 gap-3.5 sm:gap-5 lg:gap-7 items-stretch my-3 sm:my-4 min-h-0">
        {/* === TIM A (Kiri - 4 Kolom Penuh) === */}
        <div className="col-span-4 rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950/95 border-2 border-slate-700/70 p-4 sm:p-5 lg:p-6 xl:p-7 flex flex-col justify-between shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-md">
          {/* Header Tim A */}
          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src={getTeamLogoUrl(match.teamAId || 'team-sdi-kardina')}
              alt={match.teamAName}
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 object-contain rounded-2xl bg-slate-950/60 p-1.5 border border-slate-700/60 shrink-0 shadow-md"
            />
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-barlow font-black uppercase tracking-widest text-sky-400 block mb-0.5">
                KONTINGEN TIM A
              </span>
              <h2 className="font-bebas text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white uppercase tracking-wide truncate leading-tight drop-shadow-md">
                {match.teamAName}
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-slate-300 font-medium truncate">
                {match.teamAName}
              </p>
            </div>
          </div>

          {/* Massive Score Box Tim A */}
          <div className="flex-1 flex items-center justify-center my-3 sm:my-4 rounded-2xl bg-black/65 border-2 border-slate-800 shadow-inner p-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial from-sky-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="font-scoreboard font-black text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] 2xl:text-[15rem] text-[#38bdf8] drop-shadow-[0_0_40px_rgba(56,189,248,0.5)] tabular-nums leading-none select-none">
              {scoreA}
            </div>
          </div>

          {/* Stats Footer Tim A: Foul, Kartu, Timeout - BESAR & JELAS DARI JARAK JAUH */}
          <div className="flex items-center justify-between gap-3 pt-3.5 sm:pt-4 border-t-2 border-slate-800/80">
            {/* Foul Indicators */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="text-xs sm:text-sm lg:text-lg font-barlow font-black uppercase tracking-wider text-slate-100">
                FOUL:
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2">{renderFoulDots(foulsA)}</div>
            </div>

            {/* Kartu Kuning & Merah */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-amber-500/25 border-2 border-amber-400/60 text-sm sm:text-base lg:text-xl font-mono font-bold text-amber-300 shadow-md">
                <span className="w-3.5 h-4.5 bg-amber-400 rounded-xs inline-block shadow-sm" />
                <span>{yellowCardsA}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-red-500/25 border-2 border-red-500/60 text-sm sm:text-base lg:text-xl font-mono font-bold text-red-300 shadow-md">
                <span className="w-3.5 h-4.5 bg-red-500 rounded-xs inline-block shadow-sm" />
                <span>{redCardsA}</span>
              </span>
            </div>

            {/* Timeout */}
            <div className="px-3.5 sm:px-4 py-1.5 rounded-xl bg-sky-500/25 border-2 border-sky-400/60 text-xs sm:text-sm lg:text-base font-barlow font-black uppercase tracking-wider text-sky-200 flex items-center gap-1.5 shadow-md">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>TO ({timeoutsA})</span>
            </div>
          </div>
        </div>

        {/* === CENTER WING (Stopwatch & Status Pertandingan - 4 Kolom) === */}
        <div className="col-span-4 rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-950/85 to-black/95 border-2 border-slate-700/70 p-4 sm:p-5 lg:p-6 xl:p-7 flex flex-col justify-between items-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.7)] backdrop-blur-md">
          {/* Top Label */}
          <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-slate-800/90 border-2 border-slate-700 text-sky-400 font-barlow font-black uppercase tracking-widest text-xs sm:text-sm lg:text-base shadow-md">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>WAKTU PERTANDINGAN</span>
          </div>

          {/* Huge Digital Stopwatch Display */}
          <div
            className={`w-full flex-1 flex items-center justify-center my-3 sm:my-4 rounded-2xl bg-black/85 border-2 shadow-2xl p-4 relative overflow-hidden ring-1 ${
              timerSeconds === 0
                ? 'border-red-500 ring-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                : 'border-slate-800 ring-white/10'
            }`}
          >
            <div className="absolute inset-0 bg-radial from-white/5 via-transparent to-transparent pointer-events-none" />
            <div
              className={`font-scoreboard font-black text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] xl:text-[10.5rem] 2xl:text-[12rem] tracking-widest tabular-nums leading-none select-none ${
                timerSeconds === 0
                  ? 'text-red-400 drop-shadow-[0_0_35px_rgba(239,68,68,0.8)]'
                  : 'text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.45)]'
              }`}
            >
              {formatTime(timerSeconds)}
            </div>
          </div>

          {/* High-Contrast Match Status Pill - BESAR & JELAS */}
          <div className="w-full flex flex-col items-center gap-2.5 sm:gap-3">
            {timerSeconds === 0 ? (
              <div className="flex items-center gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-red-600/30 border-2 border-red-500 text-red-200 text-sm sm:text-base lg:text-xl font-barlow font-black uppercase tracking-wider shadow-[0_0_25px_rgba(239,68,68,0.7)] animate-pulse">
                <span className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,1)]" />
                <span>WAKTU HABIS &bull; INTERVAL / SELESAI</span>
              </div>
            ) : isMatchUpcoming ? (
              <div className="flex items-center gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-amber-500/25 border-2 border-amber-500/60 text-amber-300 text-sm sm:text-base lg:text-xl font-barlow font-black uppercase tracking-wider shadow-2xl">
                <span className="w-4 h-4 rounded-full bg-amber-400 animate-pulse shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
                <span>BELUM DIMULAI &bull; MENUNGGU KICK-OFF</span>
              </div>
            ) : isMatchCompleted ? (
              <div className="flex items-center gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-emerald-500/25 border-2 border-emerald-500/60 text-emerald-300 text-sm sm:text-base lg:text-xl font-barlow font-black uppercase tracking-wider shadow-2xl">
                <span className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                <span>PERTANDINGAN SELESAI</span>
              </div>
            ) : (
              <div
                className={`flex items-center gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full text-sm sm:text-base lg:text-xl font-barlow font-black uppercase tracking-wider shadow-2xl border-2 ${
                  isTimerRunning
                    ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-300'
                    : 'bg-amber-500/25 border-amber-500/60 text-amber-300'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full ${
                    isTimerRunning
                      ? 'bg-emerald-400 animate-ping shadow-[0_0_14px_rgba(52,211,153,1)]'
                      : 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]'
                  }`}
                />
                <span>{isTimerRunning ? 'PERTANDINGAN BERJALAN' : 'WAKTU BERHENTI (TIMEOUT / JEDA)'}</span>
              </div>
            )}

            <span className="text-xs sm:text-sm lg:text-lg text-slate-300 font-barlow font-bold uppercase tracking-wider">
              {currentPeriod} &bull; Waktu Bersih Lapangan
            </span>
          </div>
        </div>

        {/* === TIM B (Kanan - 4 Kolom Penuh) === */}
        <div className="col-span-4 rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950/95 border-2 border-slate-700/70 p-4 sm:p-5 lg:p-6 xl:p-7 flex flex-col justify-between shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-md">
          {/* Header Tim B */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 text-right">
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-barlow font-black uppercase tracking-widest text-amber-400 block mb-0.5">
                KONTINGEN TIM B
              </span>
              <h2 className="font-bebas text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white uppercase tracking-wide truncate leading-tight drop-shadow-md">
                {match.teamBName}
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-slate-300 font-medium truncate">
                {match.teamBName}
              </p>
            </div>
            <img
              src={getTeamLogoUrl(match.teamBId || 'team-min7-blitar')}
              alt={match.teamBName}
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 object-contain rounded-2xl bg-slate-950/60 p-1.5 border border-slate-700/60 shrink-0 shadow-md"
            />
          </div>

          {/* Massive Score Box Tim B */}
          <div className="flex-1 flex items-center justify-center my-3 sm:my-4 rounded-2xl bg-black/65 border-2 border-slate-800 shadow-inner p-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="font-scoreboard font-black text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] 2xl:text-[15rem] text-[#38bdf8] drop-shadow-[0_0_40px_rgba(56,189,248,0.5)] tabular-nums leading-none select-none">
              {scoreB}
            </div>
          </div>

          {/* Stats Footer Tim B: Timeout, Kartu, Foul - BESAR & JELAS */}
          <div className="flex items-center justify-between gap-3 pt-3.5 sm:pt-4 border-t-2 border-slate-800/80">
            {/* Timeout */}
            <div className="px-3.5 sm:px-4 py-1.5 rounded-xl bg-sky-500/25 border-2 border-sky-400/60 text-xs sm:text-sm lg:text-base font-barlow font-black uppercase tracking-wider text-sky-200 flex items-center gap-1.5 shadow-md">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>TO ({timeoutsB})</span>
            </div>

            {/* Kartu Kuning & Merah */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-amber-500/25 border-2 border-amber-400/60 text-sm sm:text-base lg:text-xl font-mono font-bold text-amber-300 shadow-md">
                <span className="w-3.5 h-4.5 bg-amber-400 rounded-xs inline-block shadow-sm" />
                <span>{yellowCardsB}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-red-500/25 border-2 border-red-500/60 text-sm sm:text-base lg:text-xl font-mono font-bold text-red-300 shadow-md">
                <span className="w-3.5 h-4.5 bg-red-500 rounded-xs inline-block shadow-sm" />
                <span>{redCardsB}</span>
              </span>
            </div>

            {/* Foul Indicators */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="flex items-center gap-1.5 sm:gap-2">{renderFoulDots(foulsB)}</div>
              <span className="text-xs sm:text-sm lg:text-lg font-barlow font-black uppercase tracking-wider text-slate-100">
                :FOUL
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* 3. BOTTOM ARENA TICKER (BESAR, JELAS, & SANGAT MUDAH DILIHAT DARI JARAK JAUH / TV) */}
      <footer className="pt-3.5 sm:pt-4 lg:pt-5 border-t-2 border-slate-700/80 flex items-center justify-between gap-4 shrink-0">
        {/* Recent Goal Info Tim A */}
        <div className="flex items-center gap-3 truncate flex-1">
          <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-sky-400 shrink-0 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
          <span className="text-white font-barlow font-bold text-sm sm:text-base lg:text-xl tracking-wide truncate">
            {goalsA.length > 0
              ? `Gol: ${goalsA.map((g) => `${g.minute || 0}' ${g.playerName || 'Pemain'}`).join(', ')}`
              : 'Belum ada gol tercatat'}
          </span>
        </div>

        {/* Center Arena Status Pill */}
        <div className="px-6 sm:px-8 py-2 sm:py-2.5 rounded-full bg-slate-900/95 border-2 border-slate-600 text-sky-300 text-xs sm:text-sm lg:text-base xl:text-lg font-barlow font-black uppercase tracking-widest shrink-0 shadow-2xl">
          PAPAN SKOR RESMI LAPANGAN MMFC I &bull; TOTAL GOL: {scoreA + scoreB}
        </div>

        {/* Recent Goal Info Tim B */}
        <div className="flex items-center justify-end gap-3 truncate flex-1 text-right">
          <span className="text-white font-barlow font-bold text-sm sm:text-base lg:text-xl tracking-wide truncate">
            {goalsB.length > 0
              ? `Gol: ${goalsB.map((g) => `${g.minute || 0}' ${g.playerName || 'Pemain'}`).join(', ')}`
              : 'Belum ada gol tercatat'}
          </span>
          <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-400 shrink-0 shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
        </div>
      </footer>
    </div>
  );
};
