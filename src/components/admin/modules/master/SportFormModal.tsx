'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2, Trophy, Clock, Layers } from 'lucide-react';
import { SportConfig, ScoringType, SportCode } from '@/types';

import { SPORT_TEMPLATES, SportTemplate } from './sportTemplates';
import { ModalPortal } from '@/components/common/ModalPortal';

interface SportFormModalProps {
  isOpen: boolean;
  initialData: SportConfig | null;
  onClose: () => void;
  onSave: (sport: SportConfig) => void;
}

export const SportFormModal: React.FC<SportFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [scoringType, setScoringType] = useState<ScoringType>('TIME_BASED');
  const [scoringLabel, setScoringLabel] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(40);
  const [periodCount, setPeriodCount] = useState(2);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCatInput, setNewCatInput] = useState('');
  const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCode(initialData.code);
      setScoringType(initialData.scoringType);
      setScoringLabel(initialData.scoringLabel);
      setDurationMinutes(initialData.durationMinutes);
      setPeriodCount(initialData.periodCount);
      setCategories([...initialData.categories]);
      setSelectedTemplateName(null);
    } else {
      // Default initial state
      applyTemplate(SPORT_TEMPLATES[0]);
    }
  }, [initialData, isOpen]);

  const applyTemplate = (tpl: SportTemplate) => {
    setName(tpl.name);
    setCode(tpl.code);
    setScoringType(tpl.scoringType);
    setScoringLabel(tpl.scoringLabel);
    setDurationMinutes(tpl.durationMinutes);
    setPeriodCount(tpl.periodCount);
    setCategories([...tpl.defaultCategories]);
    setSelectedTemplateName(tpl.name);
  };

  const handleAddCategory = () => {
    if (!newCatInput.trim()) return;
    if (!categories.includes(newCatInput.trim())) {
      setCategories([...categories, newCatInput.trim()]);
    }
    setNewCatInput('');
  };

  const handleRemoveCategory = (catToRemove: string) => {
    setCategories(categories.filter((c) => c !== catToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    const saved: SportConfig = {
      code: code.trim().toUpperCase() as SportCode,
      name: name.trim(),
      scoringType,
      scoringLabel: scoringLabel.trim() || 'Standar Turnamen',
      durationMinutes: Number(durationMinutes) || 40,
      periodCount: Number(periodCount) || 2,
      categories: categories.length > 0 ? categories : ['Kategori Terbuka'],
    };

    onSave(saved);
  };

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative space-y-6 my-8 animate-modalEnter max-h-[92vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bebas text-xl sm:text-2xl uppercase tracking-wide text-[var(--text-main)]">
                {initialData ? 'Ubah Regulasi Cabang Olahraga' : 'Tambah Cabang Olahraga Baru'}
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Atur format penilaian, durasi pertandingan, dan kategori &amp; kelas resmi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Sport Regulation Templates */}
        <div className="space-y-2.5 p-4 rounded-xl bg-[var(--bg-muted)]/60 border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-xs font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-primary)]">
            <Layers className="w-4 h-4 text-[var(--color-arena-accent)]" />
            <span>Rekomendasi Template Peraturan Cabor (Pilih Cepat):</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SPORT_TEMPLATES.map((tpl) => {
              const isSelected = selectedTemplateName === tpl.name || (initialData?.code === tpl.code && !selectedTemplateName);
              return (
                <button
                  key={tpl.code}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className={`btn-tactile p-2 rounded-xl text-left border transition-all text-xs flex flex-col justify-between min-h-[58px] ${
                    isSelected
                      ? 'border-[var(--color-arena-primary)] bg-[var(--bg-surface)] ring-2 ring-[var(--color-arena-primary)]/30 font-bold shadow-2xs'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]/70 hover:bg-[var(--bg-surface)] hover:border-[var(--color-arena-primary)]/40 text-[var(--text-muted)]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[var(--text-main)]">
                    <span className="text-sm">{tpl.icon}</span>
                    <span className="truncate">{tpl.name}</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono truncate">{tpl.badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)]">Nama Cabang Olahraga</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Sepak Bola"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] font-semibold focus:outline-none focus:border-[var(--color-arena-primary)] min-h-[40px]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)]">Kode Singkat Cabor</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Contoh: SEPAK_BOLA"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] font-mono font-bold focus:outline-none focus:border-[var(--color-arena-primary)] min-h-[40px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)]">Format Penilaian</label>
              <select
                value={scoringType}
                onChange={(e) => setScoringType(e.target.value as ScoringType)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] font-semibold focus:outline-none focus:border-[var(--color-arena-primary)] min-h-[40px]"
              >
                <option value="TIME_BASED">Waktu / Babak</option>
                <option value="SET_POINTS">Set / Reli Poin</option>
                <option value="PLACEMENT">Battle Royale / Rank</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)]">Durasi Laga (Menit)</label>
              <input
                type="number"
                min={5}
                max={180}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] font-mono font-semibold focus:outline-none focus:border-[var(--color-arena-primary)] min-h-[40px]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)]">Jumlah Babak / Set</label>
              <input
                type="number"
                min={1}
                max={10}
                value={periodCount}
                onChange={(e) => setPeriodCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] font-mono font-semibold focus:outline-none focus:border-[var(--color-arena-primary)] min-h-[40px]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)]">Label Format Penilaian Resmi</label>
            <input
              type="text"
              value={scoringLabel}
              onChange={(e) => setScoringLabel(e.target.value)}
              placeholder="Contoh: Gol (2 × 45 Menit Bersih)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)] min-h-[40px]"
            />
          </div>

          {/* Kategori & Kelas Tags */}
          <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
            <label 
              title="Contoh: Putra U-15, kelas 55 kg"
              className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block"
            >
              Kategori &amp; Kelas ({categories.length} Kelas) <span className="text-[10px] font-normal text-[var(--text-muted)] lowercase">(contoh: Putra U-15, kelas 55 kg)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-main)]"
                >
                  <span>{cat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(cat)}
                    className="p-0.5 rounded text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                    aria-label={`Hapus ${cat}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Tambah kategori/kelas baru (contoh: Putra U-15, kelas 55 kg)..."
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] text-xs focus:outline-none focus:border-[var(--color-arena-primary)] min-h-[38px]"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="btn-tactile px-3.5 py-2 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 min-h-[38px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-tactile px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-muted)] font-barlow font-bold uppercase tracking-wider text-xs min-h-[40px]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-tactile px-5 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white font-barlow font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 shadow-xs min-h-[40px]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{initialData ? 'Perbarui Cabor' : 'Simpan Cabor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </ModalPortal>
  );
};
