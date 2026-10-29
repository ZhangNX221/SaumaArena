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
            : 'bg-slate-300 dark:bg-slate-800 border-slate-400 dark:border-slate-700'
        }`}
      />
    ));

  return (
    <div className="md:col-span-5 rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 p-3.5 flex flex-col justify-between space-y-2.5 transition-colors shadow-xs">
      {/* Header Tim & Badge */}
      <div className={`flex items-center justify-between gap-2 ${isA ? '' : 'flex-row-reverse'}`}>
        <h2 className={`font-bebas text-xl sm:text-2xl text-[var(--text-main)] uppercase tracking-wide truncate leading-tight ${isA ? 'text-left' : 'text-right'}`}>
          {teamName}
        </h2>
        <span className="text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800 shrink-0">
          Tim {team}
        </span>
      </div>

      {/* Skor & Tombol Gol */}
      <div className={`flex items-center justify-between gap-3 bg-[var(--bg-muted)] p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 ${isA ? '' : 'flex-row-reverse'}`}>
        <div className={`text-5xl sm:text-6xl font-teko font-bold text-[var(--color-arena-accent)] tabular-nums leading-none ${isA ? 'pl-1' : 'pr-1'}`}>
          {score}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onUpdateScore(-1)}
            className="btn-tactile w-9 h-9 rounded-lg bg-[var(--bg-surface)] hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 text-[var(--text-main)] text-sm font-bold flex items-center justify-center border border-slate-300 dark:border-slate-600 transition-colors cursor-pointer"
            aria-label={`Kurangi Skor Tim ${team}`}
            title="Kurangi 1 Gol"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onUpdateScore(1)}
            className="btn-tactile px-3.5 py-2 rounded-lg bg-[#1D63B8] hover:bg-[#154D92] active:scale-95 text-white font-barlow font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer min-h-[38px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+1 Gol</span>
          </button>
        </div>
      </div>

      {/* Foul Counter & Time Out */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
        {isA ? (
          <>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-barlow font-bold uppercase text-[var(--text-muted)]">
                Foul {fouls}/5:
              </span>
              <div className="flex items-center gap-1">{renderFoulDots(fouls)}</div>
              <div className="flex items-center gap-0.5 ml-1">
                <button
                  type="button"
                  onClick={() => onFoulChange(-1)}
                  className="w-5 h-5 rounded bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-[10px] font-mono flex items-center justify-center border border-slate-200 dark:border-slate-700 cursor-pointer"
                  title="Kurang foul"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => onFoulChange(1)}
                  className="w-5 h-5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30 text-[10px] font-mono flex items-center justify-center border border-amber-500/30 cursor-pointer"
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
              className="btn-tactile px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-[10px] font-barlow font-bold uppercase disabled:opacity-40 flex items-center gap-1 cursor-pointer"
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
              className="btn-tactile px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-[10px] font-barlow font-bold uppercase disabled:opacity-40 flex items-center gap-1 cursor-pointer"
            >
              <Clock className="w-2.5 h-2.5" />
              <span>TO ({timeouts})</span>
            </button>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 mr-1">
                <button
                  type="button"
                  onClick={() => onFoulChange(-1)}
                  className="w-5 h-5 rounded bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-[10px] font-mono flex items-center justify-center border border-slate-200 dark:border-slate-700 cursor-pointer"
                  title="Kurang foul"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => onFoulChange(1)}
                  className="w-5 h-5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30 text-[10px] font-mono flex items-center justify-center border border-amber-500/30 cursor-pointer"
                  title="Tambah foul"
                >
                  +
                </button>
              </div>
              <div className="flex items-center gap-1">{renderFoulDots(fouls)}</div>
              <span className="text-[10px] font-barlow font-bold uppercase text-[var(--text-muted)]">
                :Foul {fouls}/5
              </span>
            </div>
          </>
        )}
      </div>

      {/* Disiplin Kartu & Tombol Cepat Juri */}
      <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-barlow font-bold uppercase text-[var(--text-muted)]">
          <span>Akumulasi Kartu Laga:</span>
          <div className="flex items-center gap-2">
            <span className="text-amber-600 dark:text-amber-400 font-mono font-bold flex items-center gap-1">
              <span className="w-2 h-2.5 bg-amber-400 rounded-2xs inline-block" />
              <span>{yellowCards} KK</span>
            </span>
            <span className="text-red-600 dark:text-red-400 font-mono font-bold flex items-center gap-1">
              <span className="w-2 h-2.5 bg-red-500 rounded-2xs inline-block" />
              <span>{redCards} KM</span>
            </span>
          </div>
        </div>

        {/* Action Buttons: Berikan Kartu Kuning & Kartu Merah */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onCardIncident('YELLOW_CARD')}
            className="btn-tactile py-1.5 px-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[10px] font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer min-h-[34px]"
            title={`Beri Kartu Kuning ${teamName}`}
          >
            <span className="w-2.5 h-3 bg-amber-400 rounded-2xs border border-amber-500 shadow-2xs inline-block" />
            <span>Kuning</span>
            <span className="font-mono text-[9px] font-black opacity-80">({yellowCards})</span>
          </button>

          <button
            type="button"
            onClick={() => onCardIncident('RED_CARD')}
            className="btn-tactile py-1.5 px-2 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800 text-[10px] font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer min-h-[34px]"
            title={`Beri Kartu Merah Langsung ${teamName}`}
          >
            <span className="w-2.5 h-3 bg-red-500 rounded-2xs border border-red-600 shadow-2xs inline-block" />
            <span>Merah</span>
            <span className="font-mono text-[9px] font-black opacity-80">({redCards})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
