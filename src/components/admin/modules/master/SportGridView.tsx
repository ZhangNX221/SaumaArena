'use client';

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { SportConfig } from '@/types';

interface SportGridViewProps {
  sports: SportConfig[];
  onEdit: (sport: SportConfig) => void;
  onDelete: (sport: SportConfig) => void;
}

export const SportGridView: React.FC<SportGridViewProps> = ({ sports, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sports.map((sport) => (
        <div
          key={sport.code}
          className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-4 hover:border-[var(--color-arena-primary)]/40 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] font-bold">
                {sport.code}
              </span>
              <h3 className="font-bebas text-2xl uppercase tracking-wide text-[var(--text-main)] mt-1">
                {sport.name}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
              {sport.scoringType === 'TIME_BASED'
                ? 'Waktu / Babak'
                : sport.scoringType === 'SET_POINTS'
                ? 'Set / Reli Poin'
                : 'Battle Royale / Rank'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-muted)]/60 border border-[var(--border-subtle)] space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Format Penilaian:</span>
              <span className="font-bold text-[var(--text-main)]">{sport.scoringLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Durasi Standar:</span>
              <span className="font-mono font-semibold text-[var(--text-main)]">
                {sport.durationMinutes} Menit ({sport.periodCount} Babak/Set)
              </span>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs">
            <span className="text-[11px] text-[var(--text-muted)] font-medium" title="Contoh: Putra U-15, kelas 55 kg">
              {sport.categories.length} Kategori &amp; Kelas Aktif
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(sport)}
                className="btn-tactile px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)] text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
                <span>Ubah Regulasi</span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(sport)}
                className="btn-tactile p-1.5 rounded-lg border border-[var(--border-subtle)] hover:border-red-500/40 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Hapus cabor"
                aria-label={`Hapus ${sport.name}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
