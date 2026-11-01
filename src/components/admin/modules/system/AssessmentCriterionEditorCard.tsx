'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { AssessmentCriterionItem } from '@/config/supporterRules';

interface AssessmentCriterionEditorCardProps {
  item: AssessmentCriterionItem;
  index: number;
  theme: 'positive' | 'penalty';
  onChange: (updated: AssessmentCriterionItem) => void;
  onDelete: () => void;
  canDelete?: boolean;
}

export const AssessmentCriterionEditorCard: React.FC<AssessmentCriterionEditorCardProps> = ({
  item,
  index,
  theme,
  onChange,
  onDelete,
  canDelete = true,
}) => {
  const isPositive = theme === 'positive';

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all duration-150 space-y-2.5 ${
        isPositive
          ? 'bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40'
          : 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
      }`}
    >
      {/* Baris Atas: Nomor, Badge Preview, & Hapus */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-5 h-5 rounded-md font-mono text-[10px] font-black flex items-center justify-center text-white shadow-2xs ${
              isPositive ? 'bg-[#1D63B8]' : 'bg-red-600'
            }`}
          >
            {index + 1}
          </span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-barlow font-bold uppercase tracking-wider ${
              isPositive
                ? 'bg-blue-500/20 text-[#1D63B8] dark:text-sky-300'
                : 'bg-red-500/20 text-red-600 dark:text-red-300'
            }`}
          >
            {item.badge || 'KODE'}
          </span>
        </div>

        <button
          type="button"
          onClick={onDelete}
          disabled={!canDelete}
          title={canDelete ? 'Hapus jenis kriteria ini' : 'Minimal harus ada 1 kriteria'}
          className="p-1 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Baris Input: Kode Singkatan, Bobot Poin, dan Satuan */}
      <div className="grid grid-cols-12 gap-2 text-xs">
        {/* Kode Badge */}
        <div className="col-span-4">
          <label className="block text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
            Kode/Badge
          </label>
          <input
            type="text"
            value={item.badge}
            onChange={(e) => onChange({ ...item, badge: e.target.value.toUpperCase() })}
            placeholder="KOREO"
            maxLength={10}
            className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)] font-mono font-bold text-[var(--text-main)] text-xs uppercase focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Nilai Poin */}
        <div className="col-span-4">
          <label className="block text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
            {isPositive ? 'Poin (+)' : 'Sanksi (-)'}
          </label>
          <div className="relative">
            <span
              className={`absolute left-2.5 top-1.5 font-mono font-bold text-xs ${
                isPositive ? 'text-emerald-500' : 'text-red-500'
              }`}
            >
              {isPositive ? '+' : '-'}
            </span>
            <input
              type="number"
              min={0}
              max={200}
              value={item.points}
              onChange={(e) =>
                onChange({ ...item, points: Math.max(0, Number(e.target.value) || 0) })
              }
              className="w-full pl-6 pr-2 py-1.5 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)] font-mono font-bold text-[var(--text-main)] text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Satuan/Suffix (Opsional, misal / Match) */}
        <div className="col-span-4">
          <label className="block text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
            Keterangan Poin
          </label>
          <input
            type="text"
            value={item.suffix || ''}
            onChange={(e) => onChange({ ...item, suffix: e.target.value })}
            placeholder="Opsional (cth: / Match)"
            className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-main)] text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Baris Input Deskripsi / Nama Kriteria */}
      <div>
        <label className="block text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
          Deskripsi Kriteria / Pelanggaran
        </label>
        <input
          type="text"
          value={item.label}
          onChange={(e) => onChange({ ...item, label: e.target.value })}
          placeholder="Membentang Koreografi 3D / Kertas"
          className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-main)] text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>
    </div>
  );
};

