'use client';

import React from 'react';
import { Sparkles, Plus, Minus, Edit3 } from 'lucide-react';
import { Match, MatchStatus, MatchLiveTelemetry } from '@/types';

interface LiveScoreCardProps {
  match: Match;
  telemetry?: MatchLiveTelemetry;
  scoreFlashId: string | null;
  onQuickScore: (matchId: string, team: 'A' | 'B', delta: number) => void;
  onQuickStatus: (matchId: string, nextStatus: MatchStatus) => void;
  onOpenLiveScoreControl?: (match: Match) => void;
  onOpenOverrideModal: (match: Match) => void;
}

export const LiveScoreCard: React.FC<LiveScoreCardProps> = ({
  match: m,
  telemetry,
  scoreFlashId,
  onQuickScore,
  onQuickStatus,
  onOpenLiveScoreControl,
  onOpenOverrideModal,
}) => {
  const isLive = m.status === 'LIVE';
  const livePeriod = telemetry?.currentPeriod || 'Babak 1';

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-150 space-y-3.5 relative overflow-hidden bg-[var(--bg-surface)] ${
        isLive
          ? 'border-red-500/40 ring-1 ring-red-500/20 shadow-md shadow-red-500/5'
          : 'border-[var(--border-subtle)] hover:border-[var(--border-subtle)]/80 shadow-xs'
      }`}
    >
      {/* Header: Match ID, Phase & Live Badge */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-muted)]">
          <span className="font-bold text-[var(--color-arena-primary)]">#{m.matchNumber}</span>
          <span>&bull;</span>
          <span className="truncate max-w-[120px]">{m.courtName}</span>
        </div>

        {isLive ? (
          <span className="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 font-barlow font-bold uppercase text-[9px] tracking-wider animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span>{livePeriod}</span>
          </span>
        ) : m.status === 'COMPLETED' ? (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-barlow font-bold uppercase text-[9px] tracking-wider">
            Selesai
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-600 dark:text-slate-400 font-barlow font-bold uppercase text-[9px] tracking-wider">
            Terjadwal
          </span>
        )}
      </div>

      {/* Score & Stepper Display */}
      <div className="grid grid-cols-7 items-center gap-2 py-1">
        {/* Team A */}
        <div className="col-span-3 space-y-2 text-left">
          <div className="font-bold text-sm sm:text-base text-[var(--text-main)] truncate" title={m.teamAName}>
            {m.teamAName}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onQuickScore(m.id, 'A', 1)}
              title="Tambah 1 Poin"
              className="flex-1 h-8 rounded-lg bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors active:scale-95 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Poin</span>
            </button>
            <button
              type="button"
              onClick={() => onQuickScore(m.id, 'A', -1)}
              title="Kurangi 1 Poin"
              className="w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-muted)] hover:bg-red-500/10 hover:border-red-500/30 text-[var(--text-muted)] hover:text-red-600 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Score Center Board */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          <div className="font-scoreboard text-2xl sm:text-3xl font-bold flex items-center justify-center gap-1">
            <span
              className={`transition-all duration-200 ${
                scoreFlashId === `${m.id}-A` ? 'text-emerald-500 scale-125' : 'text-[var(--text-main)]'
              }`}
            >
              {m.scoreA}
            </span>
            <span className="text-[var(--text-faint)] text-2xl font-light">-</span>
            <span
              className={`transition-all duration-200 ${
                scoreFlashId === `${m.id}-B` ? 'text-emerald-500 scale-125' : 'text-[var(--text-main)]'
              }`}
            >
              {m.scoreB}
            </span>
          </div>
        </div>

        {/* Team B */}
        <div className="col-span-3 space-y-2 text-right">
          <div className="font-bold text-sm sm:text-base text-[var(--text-main)] truncate" title={m.teamBName}>
            {m.teamBName}
          </div>
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onQuickScore(m.id, 'B', 1)}
              title="Tambah 1 Poin"
              className="flex-1 h-8 rounded-lg bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors active:scale-95 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Poin</span>
            </button>
            <button
              type="button"
              onClick={() => onQuickScore(m.id, 'B', -1)}
              title="Kurangi 1 Poin"
              className="w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-muted)] hover:bg-red-500/10 hover:border-red-500/30 text-[var(--text-muted)] hover:text-red-600 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Controls: Quick Status Cycle & Manual Override */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onQuickStatus(m.id, isLive ? 'COMPLETED' : 'LIVE')}
            className={`btn-tactile px-3 py-1.5 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
              isLive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLive ? 'Set Selesai' : 'Set Live'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (onOpenLiveScoreControl) onOpenLiveScoreControl(m);
              else alert(`Membuka monitor juri laga #${m.matchNumber}`);
            }}
            className="btn-tactile px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider cursor-pointer"
          >
            Monitor Juri
          </button>
          <button
            type="button"
            onClick={() => onOpenOverrideModal(m)}
            title="Edit skor angka spesifik"
            className="btn-tactile px-2.5 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kustom</span>
          </button>
        </div>
      </div>
    </div>
  );
};

