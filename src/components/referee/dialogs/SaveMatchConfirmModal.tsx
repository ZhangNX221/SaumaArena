'use client';

import React from 'react';
import { CheckCircle2, Trophy, Clock, AlertCircle } from 'lucide-react';
import { Match } from '@/types';
import { ModalPortal } from '@/components/common/ModalPortal';

interface SaveMatchConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentMatch: Match;
  isSaving?: boolean;
}

export const SaveMatchConfirmModal: React.FC<SaveMatchConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentMatch,
  isSaving = false,
}) => {
  if (!isOpen) return null;

  const totalGoals = (currentMatch.events || []).filter((e) => e.type === 'GOAL').length;
  const totalCards = (currentMatch.events || []).filter(
    (e) => e.type === 'YELLOW_CARD' || e.type === 'RED_CARD'
  ).length;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
        <div
          className="w-full max-w-md rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 space-y-5 text-[var(--text-main)] shadow-2xl animate-scaleUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Icon & Title */}
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-bebas text-xl sm:text-2xl uppercase tracking-wide text-[var(--text-main)]">
                Simpan &amp; Selesaikan Pertandingan
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-sans">
                Laga #{currentMatch.matchNumber} &bull; {currentMatch.courtName || 'Lapangan Utama'}
              </p>
            </div>
          </div>

          {/* Rincian Skor Akhir */}
          <div className="p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-2 text-center">
            <div className="font-barlow font-bold text-sm text-[var(--text-main)] uppercase">
              {currentMatch.teamAName} <span className="text-[var(--color-arena-accent)]">VS</span> {currentMatch.teamBName}
            </div>
            <div className="text-4xl font-scoreboard font-bold text-[var(--color-arena-accent)] tabular-nums">
              {currentMatch.scoreA} - {currentMatch.scoreB}
            </div>
            <div className="flex items-center justify-center gap-4 text-[11px] text-[var(--text-muted)] pt-1 font-mono">
              <span>⚽ {totalGoals} Gol</span>
              <span>🟨🟥 {totalCards} Kartu</span>
              <span>Peristiwa: {currentMatch.events?.length || 0}</span>
            </div>
          </div>

          {/* Informasi Keputusan */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5 leading-relaxed font-sans">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
            <div>
              Dengan menyimpan riwayat ini, pertandingan akan resmi ditandai sebagai <b>SELESAI (COMPLETED)</b>, Berita Acara Pertandingan (BAP) disahkan, dan hasil skor langsung tercatat di database dan klasemen.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="btn-tactile px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSaving}
              className="btn-tactile px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Menyimpan...' : 'Ya, Simpan & Selesaikan'}</span>
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

