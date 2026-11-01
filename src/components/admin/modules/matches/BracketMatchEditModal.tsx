'use client';

import React from 'react';
import { X, Trophy, CheckCircle2, Crown, Sparkles } from 'lucide-react';
import { BracketMatch } from '@/mocks/bracketData';
import { BracketStageKey, TeamDropdown } from './BracketMatchCard';
import { ModalPortal } from '@/components/common/ModalPortal';
import { getTeamLogoUrl } from '@/mocks/teamLogos';

interface BracketMatchEditModalProps {
  isOpen: boolean;
  node: BracketMatch | null;
  stage: BracketStageKey;
  onClose: () => void;
  onTeamChange: (stage: BracketStageKey, matchId: string, slot: 'teamA' | 'teamB', teamId: string) => void;
  onScoreChange: (stage: BracketStageKey, matchId: string, slot: 'teamA' | 'teamB', score: number) => void;
  onSetWinner: (stage: BracketStageKey, matchId: string, winnerSlot: 'teamA' | 'teamB') => void;
}

export const BracketMatchEditModal: React.FC<BracketMatchEditModalProps> = ({
  isOpen,
  node,
  stage,
  onClose,
  onTeamChange,
  onScoreChange,
  onSetWinner,
}) => {
  if (!isOpen || !node) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scaleUp text-[var(--text-main)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bebas text-xl uppercase tracking-wider text-[var(--text-main)] leading-tight">
                  Kelola Laga: {node.stageName}
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] font-mono">
                  {node.schedule} &bull; {node.court}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Notice */}
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-sky-400" />
            <span>
              Pilih tim dari dropdown atau klik tombol <strong>&apos;Jadikan Pemenang&apos;</strong> untuk otomatis meloloskan tim ke bagan berikutnya.
            </span>
          </div>

          {/* Form Team A vs Team B */}
          <div className="space-y-4">
            {/* Slot Tim A */}
            <div
              className={`p-3.5 rounded-xl border transition-all ${
                node.teamA.isWinner
                  ? 'bg-emerald-500/15 border-emerald-500/50 shadow-xs'
                  : 'bg-[var(--bg-muted)]/70 border-[var(--border-subtle)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-primary)] flex items-center gap-1.5">
                  <span>Slot Tim A</span>
                  {node.teamA.isWinner && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px] uppercase flex items-center gap-1">
                      <Crown className="w-3 h-3" /> Pemenang
                    </span>
                  )}
                </span>
                <span className="text-xs font-mono text-[var(--text-muted)]">Skor Akhir</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex-1 min-w-0">
                  <TeamDropdown
                    currentId={node.teamA.id}
                    currentName={node.teamA.name}
                    onSelect={(id) => onTeamChange(stage, node.id, 'teamA', id)}
                  />
                </div>
                <input
                  type="number"
                  min={0}
                  value={node.teamA.score}
                  onChange={(e) =>
                    onScoreChange(stage, node.id, 'teamA', parseInt(e.target.value) || 0)
                  }
                  className="w-14 text-center font-teko font-bold text-xl px-2 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--color-arena-accent)] shrink-0"
                  title="Skor Tim A"
                />
                <button
                  type="button"
                  onClick={() => onSetWinner(stage, node.id, 'teamA')}
                  className={`px-3 py-2 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                    node.teamA.isWinner
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-xs ring-2 ring-emerald-400'
                      : 'bg-[var(--bg-surface)] hover:bg-emerald-500/20 text-[var(--text-muted)] hover:text-emerald-400 border border-[var(--border-subtle)]'
                  }`}
                >
                  {node.teamA.isWinner ? '✓ Menang' : 'Pilih Menang'}
                </button>
              </div>
            </div>

            {/* VS Badge */}
            <div className="flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest">
                VS
              </span>
            </div>

            {/* Slot Tim B */}
            <div
              className={`p-3.5 rounded-xl border transition-all ${
                node.teamB.isWinner
                  ? 'bg-emerald-500/15 border-emerald-500/50 shadow-xs'
                  : 'bg-[var(--bg-muted)]/70 border-[var(--border-subtle)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-barlow font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <span>Slot Tim B</span>
                  {node.teamB.isWinner && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px] uppercase flex items-center gap-1">
                      <Crown className="w-3 h-3" /> Pemenang
                    </span>
                  )}
                </span>
                <span className="text-xs font-mono text-[var(--text-muted)]">Skor Akhir</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex-1 min-w-0">
                  <TeamDropdown
                    currentId={node.teamB.id}
                    currentName={node.teamB.name}
                    onSelect={(id) => onTeamChange(stage, node.id, 'teamB', id)}
                  />
                </div>
                <input
                  type="number"
                  min={0}
                  value={node.teamB.score}
                  onChange={(e) =>
                    onScoreChange(stage, node.id, 'teamB', parseInt(e.target.value) || 0)
                  }
                  className="w-14 text-center font-teko font-bold text-xl px-2 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--color-arena-accent)] shrink-0"
                  title="Skor Tim B"
                />
                <button
                  type="button"
                  onClick={() => onSetWinner(stage, node.id, 'teamB')}
                  className={`px-3 py-2 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                    node.teamB.isWinner
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-xs ring-2 ring-emerald-400'
                      : 'bg-[var(--bg-surface)] hover:bg-emerald-500/20 text-[var(--text-muted)] hover:text-emerald-400 border border-[var(--border-subtle)]'
                  }`}
                >
                  {node.teamB.isWinner ? '✓ Menang' : 'Pilih Menang'}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn-tactile px-5 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white font-barlow font-bold uppercase tracking-wider text-xs shadow-xs"
            >
              Simpan &amp; Tutup
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

