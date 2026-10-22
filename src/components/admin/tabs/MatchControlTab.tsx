'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Match, MatchEvent } from '@/types';

interface MatchControlTabProps {
  liveMatch: Match;
  recentEvents: MatchEvent[];
  onScoreChange: (team: 'A' | 'B', delta: number) => void;
  onAddCard: (teamId: string, playerName: string, type: 'YELLOW_CARD' | 'RED_CARD') => void;
  onLockBAP: () => void;
}

export const MatchControlTab: React.FC<MatchControlTabProps> = ({
  liveMatch,
  recentEvents,
  onScoreChange,
  onAddCard,
  onLockBAP,
}) => {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <div className="text-xs font-bold text-red-600 uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>Pertandingan Sedang Berlangsung (LIVE)</span>
            </div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">
              {liveMatch.teamAName} vs {liveMatch.teamBName}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              {liveMatch.venueName} &bull; {liveMatch.courtName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLockBAP}
              className="btn-tactile px-4 py-2 rounded-lg bg-[var(--color-arena-dark)] text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs min-h-[38px]"
            >
              Kunci Hasil &amp; Sahkan BAP Juri
            </button>
          </div>
        </div>

        {/* Big Touch Score Controller */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Team A Box */}
          <div className="p-5 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-center space-y-4">
            <h4 className="font-extrabold text-base text-[var(--text-main)]">
              {liveMatch.teamAName}
            </h4>
            <div className="text-5xl sm:text-6xl font-black font-mono text-[var(--color-arena-primary)] tabular-nums">
              {liveMatch.scoreA}
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onScoreChange('A', -1)}
                className="btn-tactile w-12 h-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/20 text-xl font-bold shadow-2xs"
                title="Kurangi Skor Tim A"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onScoreChange('A', 1)}
                className="btn-tactile flex-1 py-3 px-4 rounded-xl bg-[var(--color-arena-primary)] text-white flex items-center justify-center gap-2 hover:bg-[var(--color-arena-primary-hover)] text-base font-bold shadow-xs transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Gol Tim A (+1)</span>
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => onAddCard(liveMatch.teamAId, 'Pemain SMAN 2', 'YELLOW_CARD')}
                className="btn-tactile px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 font-bold text-[11px]"
              >
                + Kartu Kuning
              </button>
              <button
                type="button"
                onClick={() => onAddCard(liveMatch.teamAId, 'Pemain SMAN 2', 'RED_CARD')}
                className="btn-tactile px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-900 dark:text-red-200 font-bold text-[11px]"
              >
                + Kartu Merah
              </button>
            </div>
          </div>

          {/* Team B Box */}
          <div className="p-5 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-center space-y-4">
            <h4 className="font-extrabold text-base text-[var(--text-main)]">
              {liveMatch.teamBName}
            </h4>
            <div className="text-5xl sm:text-6xl font-black font-mono text-[var(--color-arena-primary)] tabular-nums">
              {liveMatch.scoreB}
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onScoreChange('B', -1)}
                className="btn-tactile w-12 h-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/20 text-xl font-bold shadow-2xs"
                title="Kurangi Skor Tim B"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onScoreChange('B', 1)}
                className="btn-tactile flex-1 py-3 px-4 rounded-xl bg-[var(--color-arena-primary)] text-white flex items-center justify-center gap-2 hover:bg-[var(--color-arena-primary-hover)] text-base font-bold shadow-xs transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Gol Tim B (+1)</span>
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => onAddCard(liveMatch.teamBId, 'Pemain SMAN 5', 'YELLOW_CARD')}
                className="btn-tactile px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 font-bold text-[11px]"
              >
                + Kartu Kuning
              </button>
              <button
                type="button"
                onClick={() => onAddCard(liveMatch.teamBId, 'Pemain SMAN 5', 'RED_CARD')}
                className="btn-tactile px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-900 dark:text-red-200 font-bold text-[11px]"
              >
                + Kartu Merah
              </button>
            </div>
          </div>
        </div>

        {/* Live Peristiwa Terakhir */}
        <div className="space-y-2 pt-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Linimasa Peristiwa Pertandingan (Tersinkronisasi Real-Time ke Layar Publik)
          </h5>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {recentEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[var(--color-arena-primary)]">{ev.minute}&apos;</span>
                  <span className="font-semibold">{ev.playerName}</span>
                  <span className="text-[11px] text-[var(--text-muted)]">({ev.detail || 'Gol resmi disahkan'})</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg-surface)]">
                  {ev.type === 'GOAL' ? 'Gol' : ev.type === 'YELLOW_CARD' ? 'Kartu Kuning' : 'Kartu Merah'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
