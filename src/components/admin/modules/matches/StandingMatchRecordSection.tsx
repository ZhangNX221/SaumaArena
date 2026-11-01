'use client';

import React from 'react';
import { Plus, Minus, Trophy } from 'lucide-react';

interface StandingMatchRecordSectionProps {
  finalPlayed: number;
  won: number;
  setWon: React.Dispatch<React.SetStateAction<number>>;
  drawn: number;
  setDrawn: React.Dispatch<React.SetStateAction<number>>;
  lost: number;
  setLost: React.Dispatch<React.SetStateAction<number>>;
  goalsFor: number;
  setGoalsFor: React.Dispatch<React.SetStateAction<number>>;
  goalsAgainst: number;
  setGoalsAgainst: React.Dispatch<React.SetStateAction<number>>;
  goalDifference: number;
}

export const StandingMatchRecordSection: React.FC<StandingMatchRecordSectionProps> = ({
  finalPlayed,
  won,
  setWon,
  drawn,
  setDrawn,
  lost,
  setLost,
  goalsFor,
  setGoalsFor,
  goalsAgainst,
  setGoalsAgainst,
  goalDifference,
}) => {
  return (
    <>
      {/* 2. Hasil Laga (Menang, Seri, Kalah) dengan Stepper Interaktif */}
      <div className="space-y-2 p-3.5 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)]">
        <div className="flex items-center justify-between">
          <span className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Rekor Pertandingan
          </span>
          <span className="text-[10px] text-[var(--text-muted)]">
            Total Laga: <b className="text-[var(--text-main)] font-mono">{finalPlayed}</b>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {/* Menang */}
          <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-emerald-500/30 flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
              Menang (M)
            </span>
            <div className="flex items-center gap-1 w-full justify-center">
              <button
                type="button"
                onClick={() => setWon((prev) => Math.max(0, prev - 1))}
                className="w-7 h-7 rounded-lg bg-[var(--bg-muted)] hover:bg-emerald-500/20 text-[var(--text-main)] flex items-center justify-center font-bold active:scale-95"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                min="0"
                value={won}
                onChange={(e) => setWon(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-12 py-1 text-center font-teko font-bold text-xl text-emerald-600 dark:text-emerald-400 bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setWon((prev) => prev + 1)}
                className="w-7 h-7 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 flex items-center justify-center font-bold active:scale-95 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-[9px] text-emerald-600/80 font-mono">+3 Poin</span>
          </div>

          {/* Seri */}
          <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-amber-500/30 flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
              Seri (S)
            </span>
            <div className="flex items-center gap-1 w-full justify-center">
              <button
                type="button"
                onClick={() => setDrawn((prev) => Math.max(0, prev - 1))}
                className="w-7 h-7 rounded-lg bg-[var(--bg-muted)] hover:bg-amber-500/20 text-[var(--text-main)] flex items-center justify-center font-bold active:scale-95"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                min="0"
                value={drawn}
                onChange={(e) => setDrawn(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-12 py-1 text-center font-teko font-bold text-xl text-amber-600 dark:text-amber-400 bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setDrawn((prev) => prev + 1)}
                className="w-7 h-7 rounded-lg bg-amber-500 text-white hover:bg-amber-600 flex items-center justify-center font-bold active:scale-95 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-[9px] text-amber-600/80 font-mono">+1 Poin</span>
          </div>

          {/* Kalah */}
          <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-red-500/30 flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
              Kalah (K)
            </span>
            <div className="flex items-center gap-1 w-full justify-center">
              <button
                type="button"
                onClick={() => setLost((prev) => Math.max(0, prev - 1))}
                className="w-7 h-7 rounded-lg bg-[var(--bg-muted)] hover:bg-red-500/20 text-[var(--text-main)] flex items-center justify-center font-bold active:scale-95"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                min="0"
                value={lost}
                onChange={(e) => setLost(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-12 py-1 text-center font-teko font-bold text-xl text-red-600 dark:text-red-400 bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setLost((prev) => prev + 1)}
                className="w-7 h-7 rounded-lg bg-red-500 text-white hover:bg-red-600 flex items-center justify-center font-bold active:scale-95 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-[9px] text-red-600/80 font-mono">0 Poin</span>
          </div>
        </div>
      </div>

      {/* 3. Produktivitas Gol (Gol Dicetak & Kebobolan) */}
      <div className="space-y-2 p-3.5 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)]">
        <div className="flex items-center justify-between">
          <span className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)]">
            Produktivitas Gol
          </span>
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
              goalDifference > 0
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                : goalDifference < 0
                ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                : 'bg-slate-500/15 text-[var(--text-muted)]'
            }`}
          >
            Selisih Gol (SG): {goalDifference > 0 ? `+${goalDifference}` : goalDifference}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Gol Memasukkan (GM) */}
          <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] font-bold text-[var(--text-main)] block uppercase">
              Gol Dicetak (GM)
            </span>
            <div className="flex items-center gap-1 justify-between">
              <button
                type="button"
                onClick={() => setGoalsFor((prev) => Math.max(0, prev - 1))}
                className="w-7 h-7 rounded-lg bg-[var(--bg-muted)] text-[var(--text-main)] flex items-center justify-center font-bold active:scale-95"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                min="0"
                value={goalsFor}
                onChange={(e) => setGoalsFor(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-14 py-1 text-center font-teko font-bold text-xl text-[var(--text-main)] bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setGoalsFor((prev) => prev + 1)}
                className="w-7 h-7 rounded-lg bg-[var(--color-arena-primary)] text-white flex items-center justify-center font-bold active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-[9px] text-[var(--text-muted)] block text-center">
              Total gol dimasukkan
            </span>
          </div>

          {/* Gol Kebobolan (GK) */}
          <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] font-bold text-[var(--text-main)] block uppercase">
              Gol Kebobolan (GK)
            </span>
            <div className="flex items-center gap-1 justify-between">
              <button
                type="button"
                onClick={() => setGoalsAgainst((prev) => Math.max(0, prev - 1))}
                className="w-7 h-7 rounded-lg bg-[var(--bg-muted)] text-[var(--text-main)] flex items-center justify-center font-bold active:scale-95"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                min="0"
                value={goalsAgainst}
                onChange={(e) => setGoalsAgainst(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-14 py-1 text-center font-teko font-bold text-xl text-[var(--text-main)] bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setGoalsAgainst((prev) => prev + 1)}
                className="w-7 h-7 rounded-lg bg-[var(--bg-muted)] hover:bg-red-500/20 text-[var(--text-main)] flex items-center justify-center font-bold active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-[9px] text-[var(--text-muted)] block text-center">
              Total gol kemasukan
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

