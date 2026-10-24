'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { Match } from '@/types';

interface LiveScoreOverrideModalProps {
  isOpen: boolean;
  match: Match | null;
  onClose: () => void;
  onSave: (scoreA: number, scoreB: number) => void;
}

export const LiveScoreOverrideModal: React.FC<LiveScoreOverrideModalProps> = ({
  isOpen,
  match,
  onClose,
  onSave,
}) => {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  useEffect(() => {
    if (match) {
      setScoreA(match.scoreA);
      setScoreB(match.scoreB);
    }
  }, [match, isOpen]);

  if (!isOpen || !match) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(scoreA, scoreB);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
          <h3 className="font-bebas text-xl uppercase tracking-wide text-red-600 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            <span>Override Skor Laga #{match.matchNumber}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Ubah skor langsung untuk pertandingan {match.teamAName} vs {match.teamBName}.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 py-2 text-center">
            <div className="space-y-1.5">
              <span className="font-bold text-xs truncate block">{match.teamAName}</span>
              <input
                type="number"
                min="0"
                value={scoreA}
                onChange={(e) => setScoreA(parseInt(e.target.value) || 0)}
                className="w-full text-center text-4xl font-teko font-bold tabular-nums p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="space-y-1.5">
              <span className="font-bold text-xs truncate block">{match.teamBName}</span>
              <input
                type="number"
                min="0"
                value={scoreB}
                onChange={(e) => setScoreB(parseInt(e.target.value) || 0)}
                className="w-full text-center text-4xl font-teko font-bold tabular-nums p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="btn-tactile flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-barlow font-bold uppercase tracking-wider text-xs shadow-xs"
            >
              Simpan Skor
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-tactile px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
