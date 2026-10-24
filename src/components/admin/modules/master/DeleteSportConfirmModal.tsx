'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { SportConfig } from '@/types';

interface DeleteSportConfirmModalProps {
  isOpen: boolean;
  sport: SportConfig | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteSportConfirmModal: React.FC<DeleteSportConfirmModalProps> = ({
  isOpen,
  sport,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !sport) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-modalEnter">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bebas text-xl uppercase tracking-wide text-[var(--text-main)]">
              Hapus Cabang Olahraga?
            </h3>
            <p className="text-xs text-[var(--text-muted)]">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] space-y-1.5">
          <p>
            Anda akan menghapus cabor <strong className="text-[var(--color-arena-primary)] font-bold">{sport.name}</strong> ({sport.code}) dengan{' '}
            <strong className="font-bold">{sport.categories.length} nomor tanding</strong>.
          </p>
          <p className="text-[11px] text-[var(--text-muted)]">
            Pastikan tidak ada bagan turnamen aktif atau data pertandingan yang sedang berjalan pada cabor ini.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="btn-tactile px-4 py-2 rounded-xl text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] transition-colors min-h-[38px]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-tactile px-4 py-2 rounded-xl text-xs font-barlow font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-xs flex items-center gap-1.5 transition-colors min-h-[38px]"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Cabor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
