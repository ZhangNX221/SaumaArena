'use client';

import React, { useState } from 'react';
import { GitBranch, RefreshCw, Trophy } from 'lucide-react';
import { QUARTER_FINALS, SEMI_FINALS, GRAND_FINAL } from '@/mocks/bracketData';

export const DrawingBracketTab: React.FC = () => {
  const [qf, setQf] = useState(QUARTER_FINALS);
  const [sf, setSf] = useState(SEMI_FINALS);
  const [gf, setGf] = useState(GRAND_FINAL);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  const handleRandomize = () => {
    setSeedNotice('Pengundian bracket berhasil! Slot perempat final telah diacak ulang sesuai regulasi.');
    setTimeout(() => setSeedNotice(null), 4000);
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <h3 className="font-black text-base text-[var(--text-main)] font-[var(--font-display)] flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-[var(--color-arena-primary)]" />
            <span>Generator Bagan &amp; Drawing Otomatis</span>
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Sistem Gugur Tunggal (Single Elimination) &amp; Pembagian Bagan Babak Gugur Resmi.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRandomize}
          className="btn-tactile px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Acak Drawing Ulang</span>
        </button>
      </div>

      {seedNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-fadeIn">
          {seedNotice}
        </div>
      )}

      {/* Bracket Tree Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: Perempat Final */}
        <div className="space-y-3">
          <div className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)]">
            Perempat Final ({qf.length} Laga)
          </div>
          <div className="space-y-2.5">
            {qf.map((node) => (
              <div
                key={node.id}
                className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 space-y-1.5"
              >
                <div className="text-[10px] text-[var(--text-faint)] font-mono">{node.stageName}</div>
                <div className="flex justify-between items-center text-xs font-bold text-[var(--text-main)]">
                  <span className="truncate max-w-[120px]">{node.teamA.name || 'TBD'}</span>
                  <span className="font-mono text-[var(--color-arena-accent)]">{node.teamA.score}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-[var(--text-main)]">
                  <span className="truncate max-w-[120px]">{node.teamB.name || 'TBD'}</span>
                  <span className="font-mono text-[var(--color-arena-accent)]">{node.teamB.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Semifinal */}
        <div className="space-y-3">
          <div className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)]">
            Babak Semifinal ({sf.length} Laga)
          </div>
          <div className="space-y-2.5">
            {sf.map((node) => (
              <div
                key={node.id}
                className="p-3 rounded-xl border border-[var(--color-arena-primary)]/40 bg-[var(--bg-surface)] shadow-xs space-y-1.5"
              >
                <div className="text-[10px] text-[var(--color-arena-primary)] font-bold">{node.stageName}</div>
                <div className="flex justify-between items-center text-xs font-bold text-[var(--text-main)]">
                  <span className="truncate max-w-[120px]">{node.teamA.name || 'Pemenang QF'}</span>
                  <span className="font-mono text-[var(--color-arena-accent)]">{node.teamA.score}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-[var(--text-main)]">
                  <span className="truncate max-w-[120px]">{node.teamB.name || 'Pemenang QF'}</span>
                  <span className="font-mono text-[var(--color-arena-accent)]">{node.teamB.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Grand Final */}
        <div className="space-y-3">
          <div className="text-[11px] font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>Grand Final &amp; Juara</span>
          </div>
          <div className="p-4 rounded-xl border-2 border-amber-500/50 bg-amber-500/5 shadow-xs space-y-2 text-center">
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400 font-mono">
              PENENTUAN JUARA 1
            </div>
            <div className="py-2 text-sm font-black text-[var(--text-main)]">
              {gf.teamA.name || 'Finalis 1'} vs {gf.teamB.name || 'Finalis 2'}
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">
              {gf.court} &bull; {gf.schedule}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
