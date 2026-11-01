'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Match } from '@/types';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';

interface ResetMatchConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentMatch: Match;
  adminDurationMinutes: number;
}

export const ResetMatchConfirmModal: React.FC<ResetMatchConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentMatch,
  adminDurationMinutes,
}) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Konfirmasi Reset Laga"
      confirmLabel="Ya, Reset Laga"
      cancelLabel="Batal"
      isDanger={true}
      icon={<RotateCcw className="w-5 h-5 text-red-600 dark:text-red-400" />}
      onConfirm={onConfirm}
      onCancel={onClose}
    >
      <div className="space-y-3 mt-2.5">
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
          <div className="font-barlow font-bold uppercase tracking-wider text-red-700 dark:text-red-400 text-[11px] flex items-center gap-1.5">
            <span>Laga #{currentMatch.matchNumber}</span>
            <span>&bull;</span>
            <span>{currentMatch.courtName || 'Lapangan Futsal Seabless'}</span>
          </div>
          <div className="text-sm font-bebas tracking-wide uppercase text-[var(--text-main)] mt-0.5">
            {currentMatch.teamAName} <span className="text-[var(--color-arena-accent)]">VS</span> {currentMatch.teamBName}
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Apakah Anda yakin ingin me-reset Laga ini? Seluruh data pertandingan babak ini akan dikembalikan ke kondisi awal:
        </p>

        <ul className="text-xs text-[var(--text-muted)] space-y-1.5 pl-0.5">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <span>
              Skor kembali ke <strong className="text-[var(--text-main)] font-mono font-bold">0 - 0</strong>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <span>
              Timer kembali ke{' '}
              <strong className="text-[var(--text-main)] font-mono font-bold">{adminDurationMinutes} Menit</strong>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <span>Seluruh riwayat gol, kartu, dan pelanggaran dibersihkan</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <span>
              Status laga dikembalikan ke{' '}
              <strong className="text-[var(--text-main)] font-bold">BELUM DIMULAI (UPCOMING)</strong>
            </span>
          </li>
        </ul>
      </div>
    </ConfirmModal>
  );
};

