'use client';

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { SportConfig } from '@/types';

interface SportTableViewProps {
  sports: SportConfig[];
  onEdit: (sport: SportConfig) => void;
  onDelete: (sport: SportConfig) => void;
}

export const SportTableView: React.FC<SportTableViewProps> = ({ sports, onEdit, onDelete }) => {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-x-auto shadow-xs">
      <table className="w-full text-xs text-left">
        <thead className="bg-[var(--bg-muted)]/70 text-[var(--text-muted)] uppercase text-[11px] font-black tracking-wider font-[var(--font-display)] border-b border-[var(--border-subtle)]">
          <tr>
            <th className="py-3.5 px-4">Cabang Olahraga</th>
            <th className="py-3.5 px-4">Format Penilaian</th>
            <th className="py-3.5 px-4">Durasi &amp; Babak</th>
            <th className="py-3.5 px-4">Nomor Tanding</th>
            <th className="py-3.5 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-subtle)] font-medium text-[var(--text-main)]">
          {sports.map((sport) => (
            <tr key={sport.code} className="hover:bg-[var(--bg-muted)]/30 transition-colors">
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm font-[var(--font-display)]">{sport.name}</span>
                  <span className="text-[10px] font-[var(--font-mono)] px-2 py-0.5 rounded bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] font-bold">
                    {sport.code}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4">
                <div>
                  <span className="font-semibold block font-[var(--font-display)]">{sport.scoringLabel}</span>
                  <span className="text-[11px] text-[var(--text-muted)] font-[var(--font-sans)]">
                    {sport.scoringType === 'TIME_BASED'
                      ? 'Waktu/Babak'
                      : sport.scoringType === 'SET_POINTS'
                      ? 'Set & Poin'
                      : 'Battle Royale'}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4 font-[var(--font-mono)] tabular-nums">
                <span className="font-bold">{sport.durationMinutes} Menit</span>
                <span className="text-[var(--text-muted)] text-[11px] block font-[var(--font-sans)]">
                  {sport.periodCount} Babak/Set
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-main)] font-[var(--font-display)]">
                  {sport.categories.length} Nomor
                </span>
              </td>
              <td className="py-4 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEdit(sport)}
                    className="btn-tactile px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)] text-[var(--text-main)] text-xs font-bold font-[var(--font-display)] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
                    <span>Ubah</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(sport)}
                    className="btn-tactile p-1.5 rounded-xl border border-red-500/20 hover:border-red-500/40 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Hapus cabor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
