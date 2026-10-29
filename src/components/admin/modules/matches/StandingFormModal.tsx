'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { StandingRow } from '@/types';
import { ModalPortal } from '@/components/common/ModalPortal';

export interface StandingFormData {
  teamName: string;
  schoolName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  supporterPoints: number;
  points: number;
  fairPlayScore: number;
}

interface StandingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StandingFormData) => void;
  editingRow: StandingRow | null;
  selectedGroup: 'A' | 'B' | 'C' | 'D';
}

export const StandingFormModal: React.FC<StandingFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingRow,
  selectedGroup,
}) => {
  const [formData, setFormData] = useState<StandingFormData>({
    teamName: '',
    schoolName: '',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    supporterPoints: 0,
    points: 0,
    fairPlayScore: 10,
  });

  useEffect(() => {
    if (editingRow) {
      setFormData({
        teamName: editingRow.teamName,
        schoolName: editingRow.schoolName,
        played: editingRow.played,
        won: editingRow.won,
        drawn: editingRow.drawn,
        lost: editingRow.lost,
        goalsFor: editingRow.goalsFor,
        goalsAgainst: editingRow.goalsAgainst,
        supporterPoints: editingRow.supporterPoints ?? 0,
        points: editingRow.points,
        fairPlayScore: editingRow.fairPlayScore,
      });
    } else {
      setFormData({
        teamName: '',
        schoolName: '',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        supporterPoints: 0,
        points: 0,
        fairPlayScore: 10,
      });
    }
  }, [editingRow, isOpen]);

  // Keyboard accessibility: Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teamName.trim()) return;
    onSubmit(formData);
  };

  return (
    <ModalPortal>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="standing-modal-title"
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
          <h3 id="standing-modal-title" className="font-bebas text-xl uppercase tracking-wide text-[var(--text-main)]">
            {editingRow ? `Koreksi Poin: ${editingRow.teamName}` : `Tambah Tim Klasemen (${selectedGroup})`}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela"
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Nama Tim / Sekolah</label>
            <input
              type="text"
              required
              placeholder="Contoh: MIN 1 Kota Malang"
              value={formData.teamName}
              onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Main (MN)</label>
              <input
                type="number"
                min="0"
                value={formData.played}
                onChange={(e) => setFormData({ ...formData, played: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-teko font-bold text-base text-center"
              />
            </div>
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-emerald-600 block mb-1">Menang (M)</label>
              <input
                type="number"
                min="0"
                value={formData.won}
                onChange={(e) => setFormData({ ...formData, won: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-teko font-bold text-base text-center text-emerald-600"
              />
            </div>
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-amber-600 block mb-1">Seri (S)</label>
              <input
                type="number"
                min="0"
                value={formData.drawn}
                onChange={(e) => setFormData({ ...formData, drawn: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-teko font-bold text-base text-center text-amber-600"
              />
            </div>
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-red-600 block mb-1">Kalah (K)</label>
              <input
                type="number"
                min="0"
                value={formData.lost}
                onChange={(e) => setFormData({ ...formData, lost: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-teko font-bold text-base text-center text-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">GM</label>
              <input
                type="number"
                min="0"
                value={formData.goalsFor}
                onChange={(e) => setFormData({ ...formData, goalsFor: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-teko font-bold text-base text-center"
              />
            </div>
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">GK</label>
              <input
                type="number"
                min="0"
                value={formData.goalsAgainst}
                onChange={(e) => setFormData({ ...formData, goalsAgainst: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-teko font-bold text-base text-center"
              />
            </div>
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-amber-600 block mb-1" title="Poin Suporter">Poin SP</label>
              <input
                type="number"
                min="0"
                value={formData.supporterPoints}
                onChange={(e) => setFormData({ ...formData, supporterPoints: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-amber-600 font-teko font-bold text-base text-center"
              />
            </div>
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--color-arena-primary)] block mb-1">Total PTS</label>
              <input
                type="number"
                min="0"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--color-arena-primary)] font-teko font-bold text-lg text-center"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="submit"
              className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold uppercase tracking-wider text-xs"
            >
              {editingRow ? 'Simpan Koreksi' : 'Tambahkan ke Klasemen'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-tactile px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  </ModalPortal>
  );
};
