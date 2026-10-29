'use client';

import React from 'react';
import { Plus, Minus, Clock } from 'lucide-react';

export interface TeamScoreFoulCardProps {
  team: 'A' | 'B';
  teamName: string;
  score: number;
  fouls: number;
  timeouts: number;
  yellowCards: number;
  redCards: number;
  onUpdateScore: (delta: number) => void;
  onFoulChange: (delta: number) => void;
  onTimeout: () => void;
  onCardIncident: (type: 'YELLOW_CARD' | 'RED_CARD') => void;
}

export const TeamScoreFoulCard: React.FC<TeamScoreFoulCardProps> = ({
  team,
  teamName,
  score,
  fouls,
  timeouts,
  yellowCards,
  redCards,
  onUpdateScore,
  onFoulChange,
  onTimeout,
  onCardIncident,
}) => {
  const isA = team === 'A';

  const renderFoulDots = (count: number) =>
    [1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        className={`w-2.5 h-2.5 rounded-full border transition-all ${
          i <= count
            ? count >= 5
              ? 'bg-red-500 border-red-400'
              : 'bg-amber-400 border-amber-300'
            : 'bg-slate-800 border-slate-700'
        }`}
      />
    ));

  return (
    <div className="md:col-span-5 rounded-xl bg-[#07131F] border border-[#1C3B5B] p-3.5 flex flex-col justify-between space-y-2.5 transition-colors">
      {/* Header Tim & Badge */}
      <div className={`flex items-center justify-between gap-2 ${isA ? '' : 'flex-row-reverse'}`}>
        <h2 className={`font-bebas text-xl sm:text-2xl text-white uppercase tracking-wide truncate leading-tight ${isA ? 'text-left' : 'text-right'}`}>
          {teamName}
        </h2>
        <span className="text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10 shrink-0">
          Tim {team}
        </span>
      </div>

      {/* Skor & Tombol Gol */}
      <div className={`flex items-center justify-between gap-3 bg-[#0D1E30]/70 p-2.5 rounded-xl border border-[#1C3B5B] ${isA ? '' : 'flex-row-reverse'}`}>
        <div className={`text-5xl sm:text-6xl font-scoreboard font-bold text-[#F6AE2D] tabular-nums leading-none ${isA ? 'pl-1' : 'pr-1'}`}>
          {score}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onUpdateScore(-1)}
            className="btn-tactile w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 text-sm font-bold flex items-center justify-center border border-white/10 transition-colors"
            aria-label={`Kurangi Skor Tim ${team}`}
            title="Kurangi 1 Gol"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onUpdateScore(1)}
            className="btn-tactile px-3.5 py-2 rounded-lg bg-[var(--color-arena-primary)] hover:bg-[#1D4ED8] active:scale-95 text-white font-barlow font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+1 Gol</span>
          </button>
        </div>
      </div>

      {/* Foul Counter & Time Out */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1C3B5B]/60">
        {isA ? (
          <>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-barlow font-bold uppercase text-slate-400">
                Foul {fouls}/5:
              </span>
              <div className="flex items-center gap-1">{renderFoulDots(fouls)}</div>
              <div className="flex items-center gap-0.5 ml-1">
                <button
                  type="button"
                  onClick={() => onFoulChange(-1)}
                  className="w-5 h-5 rounded bg-white/5 text-slate-400 hover:text-white text-[10px] font-mono flex items-center justify-center"
                  title="Kurang foul"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => onFoulChange(1)}
                  className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[10px] font-mono flex items-center justify-center"
                  title="Tambah foul"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={onTimeout}
              disabled={timeouts === 0}
              className="btn-tactile px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[10px] font-barlow font-bold uppercase disabled:opacity-40 flex items-center gap-1"
            >
              <Clock className="w-2.5 h-2.5" />
              <span>TO ({timeouts})</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onTimeout}
              disabled={timeouts === 0}
              className="btn-tactile px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[10px] font-barlow font-bold uppercase disabled:opacity-40 flex items-center gap-1"
            >
              <Clock className="w-2.5 h-2.5" />
              <span>TO ({timeouts})</span>
            </button>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 mr-1">
                <button
                  type="button"
                  onClick={() => onFoulChange(-1)}
                  className="w-5 h-5 rounded bg-white/5 text-slate-400 hover:text-white text-[10px] font-mono flex items-center justify-center"
                  title="Kurang foul"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => onFoulChange(1)}
                  className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[10px] font-mono flex items-center justify-center"
                  title="Tambah foul"
                >
                  +
                </button>
              </div>
              <div className="flex items-center gap-1">{renderFoulDots(fouls)}</div>
              <span className="text-[10px] font-barlow font-bold uppercase text-slate-400">
                :Foul {fouls}/5
              </span>
            </div>
          </>
        )}
      </div>

      {/* Indikator Akumulasi Kartu & Tombol Sanksi */}
      <div className="space-y-1.5 pt-1 border-t border-[#1C3B5B]/50">
        <div className="flex items-center justify-between text-[10px] font-barlow font-bold uppercase px-1">
          <span className="text-slate-400">Akumulasi Kartu Laga:</span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-amber-400 font-mono font-bold" title="Total Kartu Kuning Tim Ini">
              <span className="w-2 h-2.5 bg-amber-400 rounded-2xs inline-block shadow-2xs" />
              <span>{yellowCards} KK</span>
            </span>
            <span className="inline-flex items-center gap-1 text-rose-400 font-mono font-bold" title="Total Kartu Merah Tim Ini">
              <span className="w-2 h-2.5 bg-rose-500 rounded-2xs inline-block shadow-2xs" />
              <span>{redCards} KM</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onCardIncident('YELLOW_CARD')}
            className="btn-tactile py-1.5 px-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 active:scale-95 text-amber-300 text-[10px] font-barlow font-bold uppercase tracking-wider border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all"
            title={`Beri Kartu Kuning ke Tim ${team}`}
          >
            <span className="w-2 h-3 rounded-[2px] bg-amber-400 shadow-xs inline-block" />
            <span>Kuning</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[9px] font-black border border-amber-400/30">
              {yellowCards}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onCardIncident('RED_CARD')}
            className="btn-tactile py-1.5 px-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 active:scale-95 text-red-300 text-[10px] font-barlow font-bold uppercase tracking-wider border border-red-500/30 flex items-center justify-center gap-1.5 transition-all"
            title={`Beri Kartu Merah ke Tim ${team}`}
          >
            <span className="w-2 h-3 rounded-[2px] bg-rose-500 shadow-xs inline-block" />
            <span>Merah</span>
            <span className="px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-300 font-mono text-[9px] font-black border border-red-500/30">
              {redCards}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
