'use client';

import React, { useState } from 'react';
import { Gamepad2, Trophy, Clock, Check, Send } from 'lucide-react';
import { Match } from '@/types';

interface ScoringMapSeriesProps {
  currentMatch: Match;
  onFinalizeSeries?: (winner: string) => void;
}

interface CompletedMap {
  mapNumber: number;
  winnerName: string;
  scoreA: number;
  scoreB: number;
  duration: string;
}

export const ScoringMapSeries: React.FC<ScoringMapSeriesProps> = ({
  currentMatch,
  onFinalizeSeries,
}) => {
  const [completedMaps, setCompletedMaps] = useState<CompletedMap[]>([
    { mapNumber: 1, winnerName: currentMatch.teamAName, scoreA: 18, scoreB: 11, duration: '14m 10s' },
    { mapNumber: 2, winnerName: currentMatch.teamBName, scoreA: 9, scoreB: 22, duration: '18m 45s' },
    { mapNumber: 3, winnerName: currentMatch.teamAName, scoreA: 15, scoreB: 13, duration: '21m 02s' },
  ]);

  // Current map in-progress form
  const [currentMapNumber, setCurrentMapNumber] = useState(4);
  const [selectedWinner, setSelectedWinner] = useState<'A' | 'B'>('A');
  const [killsA, setKillsA] = useState(12);
  const [killsB, setKillsB] = useState(14);
  const [durationMinutes, setDurationMinutes] = useState(16);
  const [seriesSubmitted, setSeriesSubmitted] = useState(false);

  // Compute series score
  const winsA = completedMaps.filter((m) => m.winnerName === currentMatch.teamAName).length;
  const winsB = completedMaps.filter((m) => m.winnerName === currentMatch.teamBName).length;

  const handleSaveMap = () => {
    const winnerName = selectedWinner === 'A' ? currentMatch.teamAName : currentMatch.teamBName;
    const newMap: CompletedMap = {
      mapNumber: currentMapNumber,
      winnerName,
      scoreA: killsA,
      scoreB: killsB,
      duration: `${durationMinutes}m 00s`,
    };

    setCompletedMaps((prev) => [...prev, newMap]);
    setCurrentMapNumber((prev) => prev + 1);
    setKillsA(0);
    setKillsB(0);
    setDurationMinutes(15);
  };

  const handleFinalize = () => {
    const winner = winsA > winsB ? currentMatch.teamAName : currentMatch.teamBName;
    if (onFinalizeSeries) onFinalizeSeries(winner);
    setSeriesSubmitted(true);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0b1a28] text-white border border-[#1f374f] shadow-lg space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-600/30 text-purple-300 font-barlow font-bold uppercase tracking-wider border border-purple-500/40 text-[11px]">
              <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
              <span>ESPORT &bull; GRAND FINAL (BO5)</span>
            </span>
            <span className="text-slate-400 font-barlow font-bold uppercase tracking-wider text-xs">
              Laga #{currentMatch.matchNumber}
            </span>
          </div>
          <span className="px-3 py-1 rounded-md bg-slate-800 text-[#f6ae2d] font-barlow font-bold uppercase tracking-wider text-xs">
            Butuh 3 Kemenangan
          </span>
        </div>

        {/* Series Scoreboard */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-2">
          <span className="text-[11px] font-barlow font-bold uppercase tracking-widest text-slate-400">
            Skor Seri Best-of-5
          </span>
          <div className="grid grid-cols-7 items-center gap-2">
            <div className="col-span-3 text-right">
              <h3 className="font-bebas text-xl sm:text-2xl text-slate-100 uppercase tracking-wide truncate">
                {currentMatch.teamAName}
              </h3>
            </div>
            <div className="col-span-1 flex items-center justify-center gap-2 font-scoreboard font-bold text-5xl sm:text-6xl text-[#f6ae2d] tabular-nums leading-none">
              <span>{winsA}</span>
              <span className="text-slate-600 text-3xl font-light">-</span>
              <span>{winsB}</span>
            </div>
            <div className="col-span-3 text-left">
              <h3 className="font-bebas text-xl sm:text-2xl text-slate-100 uppercase tracking-wide truncate">
                {currentMatch.teamBName}
              </h3>
            </div>
          </div>
        </div>

        {/* Completed Maps History */}
        <div className="space-y-2">
          <span className="text-xs font-barlow font-bold uppercase tracking-wider text-slate-400 block">
            Riwayat Map Selesai ({completedMaps.length})
          </span>
          <div className="space-y-1.5">
            {completedMaps.map((m) => (
              <div
                key={m.mapNumber}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 font-mono font-bold text-slate-300 text-[11px]">
                    MAP {m.mapNumber}
                  </span>
                  <span className="font-semibold text-slate-200">
                    Menang: <strong className="text-emerald-400 font-barlow uppercase">{m.winnerName}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-scoreboard font-bold text-amber-400 text-base tabular-nums">
                    {m.scoreA} - {m.scoreB} Kills
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{m.duration}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Map Logger Form */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-barlow font-bold text-xs uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-purple-400" />
              <span>Input Hasil Map #{currentMapNumber} (Sedang Berjalan)</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Winner selector */}
            <div className="space-y-1 sm:col-span-1">
              <label className="text-[11px] font-barlow font-bold uppercase text-slate-400 block">
                Pemenang Map
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedWinner('A')}
                  className={`btn-tactile py-2 px-2 rounded-lg text-xs font-barlow font-bold uppercase truncate transition-colors min-h-[44px] ${
                    selectedWinner === 'A'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {currentMatch.teamAName.split(' ')[0]}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedWinner('B')}
                  className={`btn-tactile py-2 px-2 rounded-lg text-xs font-barlow font-bold uppercase truncate transition-colors min-h-[44px] ${
                    selectedWinner === 'B'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {currentMatch.teamBName.split(' ')[0]}
                </button>
              </div>
            </div>

            {/* Kills Score */}
            <div className="space-y-1 sm:col-span-1">
              <label className="text-[11px] font-barlow font-bold uppercase text-slate-400 block">
                Skor Kills (A vs B)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={killsA}
                  onChange={(e) => setKillsA(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-center font-scoreboard text-xl min-h-[44px]"
                />
                <span className="text-slate-500 font-bold">:</span>
                <input
                  type="number"
                  min="0"
                  value={killsB}
                  onChange={(e) => setKillsB(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-center font-scoreboard text-xl min-h-[44px]"
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-1 sm:col-span-1">
              <label className="text-[11px] font-barlow font-bold uppercase text-slate-400 block">
                Durasi (Menit)
              </label>
              <input
                type="number"
                min="1"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-center font-scoreboard text-xl min-h-[44px]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveMap}
            className="btn-tactile w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs min-h-[44px]"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Hasil Map #{currentMapNumber}</span>
          </button>
        </div>

        {/* Finalize Series Button */}
        <div className="pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleFinalize}
            disabled={seriesSubmitted}
            className="btn-tactile w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 min-h-[44px]"
          >
            <Send className="w-4 h-4" />
            <span>{seriesSubmitted ? 'Hasil Seri Berhasil Disahkan' : 'Sahkan Hasil Seri ke Admin Turnamen'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
