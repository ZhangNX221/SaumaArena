'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MedalTallyRow } from '@/types';

export interface MedalFormData {
  contingentName: string;
  gold: number;
  silver: number;
  bronze: number;
}

interface MedalTallyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MedalFormData) => void;
  editingRow: MedalTallyRow | null;
}

export const MedalTallyModal: React.FC<MedalTallyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingRow,
}) => {
  const [formData, setFormData] = useState<MedalFormData>({
    contingentName: '',
    gold: 0,
    silver: 0,
    bronze: 0,
  });

  useEffect(() => {
    if (editingRow) {
      setFormData({
        contingentName: editingRow.contingentName,
        gold: editingRow.gold,
        silver: editingRow.silver,
        bronze: editingRow.bronze,
      });
    } else {
      setFormData({
        contingentName: '',
        gold: 0,
        silver: 0,
        bronze: 0,
      });
    }
  }, [editingRow, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contingentName.trim()) return;
    onSubmit(formData);
  };

  const totalCalculated =
    (Number(formData.gold) || 0) +
    (Number(formData.silver) || 0) +
    (Number(formData.bronze) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
          <h3 className="font-bebas text-xl uppercase tracking-wide text-[var(--text-main)]">
            {editingRow ? `Edit Medali: ${editingRow.contingentName}` : 'Tambah Kontingen Medali'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-barlow font-bold uppercase tracking-wider text-[var(--text-main)] block mb-1">
              Nama Kontingen
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: MIN 1 Kota Malang"
              value={formData.contingentName}
              onChange={(e) => setFormData({ ...formData, contingentName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-amber-500 block mb-1">
                Emas
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.gold}
                onChange={(e) => setFormData({ ...formData, gold: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-teko text-center font-bold text-lg"
              />
            </div>
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Perak
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.silver}
                onChange={(e) => setFormData({ ...formData, silver: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-teko text-center font-bold text-lg"
              />
            </div>
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-amber-700 block mb-1">
                Perunggu
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.bronze}
                onChange={(e) => setFormData({ ...formData, bronze: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-teko text-center font-bold text-lg"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-muted)] text-xs flex justify-between items-center">
            <span className="text-[var(--text-muted)] font-medium">Total Medali Dihitung:</span>
            <span className="font-teko font-bold text-xl tabular-nums text-[var(--color-arena-primary)]">
              {totalCalculated} Medali
            </span>
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="submit"
              className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold uppercase tracking-wider text-xs"
            >
              {editingRow ? 'Simpan Perubahan' : 'Tambahkan ke Klasemen'}
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
  );
};
