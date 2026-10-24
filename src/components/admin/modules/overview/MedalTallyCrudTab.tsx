'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Medal, Minus } from 'lucide-react';
import { MEDAL_TALLY } from '@/mocks/multiSportData';
import { MedalTallyRow, SportCode } from '@/types';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';
import { MedalTallyModal, MedalFormData } from './MedalTallyModal';

interface MedalTallyCrudTabProps {
  selectedSport?: SportCode;
}

const STORAGE_KEY = 'sauma_arena_medal_tally';

export const MedalTallyCrudTab: React.FC<MedalTallyCrudTabProps> = ({ selectedSport = 'ALL' }) => {
  const [tally, setTally] = useState<MedalTallyRow[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) return JSON.parse(cached);
      } catch {
        // Fallback to default
      }
    }
    return MEDAL_TALLY;
  });

  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<MedalTallyRow | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tally));
    } catch {
      // Storage quota or private mode fallback
    }
  }, [tally]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  // 1-Tap Fast Inline Medal Stepper (Under 1 second click)
  const handleQuickMedal = (contingentName: string, type: 'gold' | 'silver' | 'bronze', delta: number) => {
    setTally((prev) =>
      prev.map((r) => {
        if (r.contingentName !== contingentName) return r;
        const currentVal = r[type];
        const nextVal = Math.max(0, currentVal + delta);
        const updated = { ...r, [type]: nextVal };
        updated.total = updated.gold + updated.silver + updated.bronze;
        return updated;
      })
    );

    const typeLabel = type === 'gold' ? 'Emas' : type === 'silver' ? 'Perak' : 'Perunggu';
    showToast(`${delta > 0 ? '+1' : '-1'} Medali ${typeLabel} (${contingentName})`);
  };

  const handleOpenAdd = () => {
    setEditingRow(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: MedalTallyRow) => {
    setEditingRow(row);
    setIsModalOpen(true);
  };

  const handleDelete = (contingentName: string) => {
    setDeleteTarget(contingentName);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setTally((prev) => prev.filter((r) => r.contingentName !== deleteTarget));
      showToast(`Kontingen ${deleteTarget} dihapus.`);
      setDeleteTarget(null);
    }
  };

  const handleSubmit = (formData: MedalFormData) => {
    const gold = Number(formData.gold) || 0;
    const silver = Number(formData.silver) || 0;
    const bronze = Number(formData.bronze) || 0;
    const total = gold + silver + bronze;

    if (editingRow) {
      setTally((prev) =>
        prev.map((r) =>
          r.contingentName === editingRow.contingentName
            ? { ...r, contingentName: formData.contingentName, gold, silver, bronze, total }
            : r
        )
      );
      showToast(`Data medali ${formData.contingentName} diperbarui`);
    } else {
      const newRow: MedalTallyRow = {
        rank: tally.length + 1,
        contingentName: formData.contingentName,
        gold,
        silver,
        bronze,
        total,
      };
      setTally((prev) => [...prev, newRow]);
      showToast(`Kontingen ${formData.contingentName} ditambahkan`);
    }

    setIsModalOpen(false);
    setEditingRow(null);
  };

  // Sort by Gold desc, Silver desc, Bronze desc
  const sorted = [...tally]
    .filter((r) => r.contingentName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (b.gold !== a.gold) return b.gold - a.gold;
      if (b.silver !== a.silver) return b.silver - a.silver;
      return b.bronze - a.bronze;
    });

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-4">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-medium flex items-center justify-between animate-fadeIn">
          <span>{toastMessage}</span>
          <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 font-barlow tracking-wider">Tersimpan Cache</span>
        </div>
      )}

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <h3 className="font-bebas text-xl sm:text-2xl uppercase tracking-wide text-[var(--text-main)] flex items-center gap-2">
            <Medal className="w-5 h-5 text-amber-500" />
            <span>Klasemen Perolehan Medali Kontingen</span>
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Gunakan tombol steper cepat [ + ] / [ - ] untuk mencatat medali podium tanpa perlu membuka modal.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-tactile px-3.5 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kontingen</span>
        </button>
      </div>

      {/* Search and Sport Filter Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            type="text"
            placeholder="Cari kontingen sekolah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
          />
        </div>
        <span className="px-3 py-1 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] shrink-0">
          Cabor: {selectedSport === 'ALL' ? 'Semua Cabor' : selectedSport}
        </span>
      </div>

      {/* Table CRUD with 1-Tap Steppers */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
        <table className="w-full text-xs text-left">
          <thead className="bg-[var(--bg-muted)] text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
            <tr>
              <th className="py-2.5 px-3 text-center">Rank</th>
              <th className="py-2.5 px-3">Kontingen Sekolah / Klub</th>
              <th className="py-2.5 px-3 text-center text-amber-500 font-bold">Emas (1-Tap)</th>
              <th className="py-2.5 px-3 text-center text-slate-400 font-bold">Perak (1-Tap)</th>
              <th className="py-2.5 px-3 text-center text-amber-700 font-bold">Perunggu (1-Tap)</th>
              <th className="py-2.5 px-3 text-center font-bold">Total</th>
              <th className="py-2.5 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] font-medium">
            {sorted.map((row, idx) => (
              <tr key={row.contingentName} className="hover:bg-[var(--bg-muted)]/40 transition-colors">
                <td className="py-3 px-3 text-center font-barlow font-bold">
                  {idx === 0 ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-teko font-bold text-sm shadow-xs">
                      1
                    </span>
                  ) : (
                    <span className="font-mono text-xs">{idx + 1}</span>
                  )}
                </td>
                <td className="py-3 px-3 font-bold text-[var(--text-main)]">
                  {row.contingentName}
                </td>

                {/* Emas Stepper */}
                <td className="py-3 px-3 text-center">
                  <div className="inline-flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                    <button
                      type="button"
                      onClick={() => handleQuickMedal(row.contingentName, 'gold', -1)}
                      title="Kurang 1 Emas"
                      className="w-5 h-5 rounded flex items-center justify-center hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-teko font-bold text-amber-500 text-lg w-6 text-center tabular-nums">
                      {row.gold}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuickMedal(row.contingentName, 'gold', 1)}
                      title="Tambah 1 Emas"
                      className="w-5 h-5 rounded flex items-center justify-center hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </td>

                {/* Perak Stepper */}
                <td className="py-3 px-3 text-center">
                  <div className="inline-flex items-center gap-1 bg-slate-500/10 px-2 py-1 rounded-lg border border-slate-500/20">
                    <button
                      type="button"
                      onClick={() => handleQuickMedal(row.contingentName, 'silver', -1)}
                      title="Kurang 1 Perak"
                      className="w-5 h-5 rounded flex items-center justify-center hover:bg-slate-500/20 text-slate-600 dark:text-slate-300 text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-teko font-bold text-slate-600 dark:text-slate-300 text-lg w-6 text-center tabular-nums">
                      {row.silver}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuickMedal(row.contingentName, 'silver', 1)}
                      title="Tambah 1 Perak"
                      className="w-5 h-5 rounded flex items-center justify-center hover:bg-slate-500/20 text-slate-600 dark:text-slate-300 text-xs font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </td>

                {/* Perunggu Stepper */}
                <td className="py-3 px-3 text-center">
                  <div className="inline-flex items-center gap-1 bg-amber-800/10 px-2 py-1 rounded-lg border border-amber-800/20">
                    <button
                      type="button"
                      onClick={() => handleQuickMedal(row.contingentName, 'bronze', -1)}
                      title="Kurang 1 Perunggu"
                      className="w-5 h-5 rounded flex items-center justify-center hover:bg-amber-800/20 text-amber-800 dark:text-amber-500 text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-teko font-bold text-amber-800 dark:text-amber-500 text-lg w-6 text-center tabular-nums">
                      {row.bronze}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuickMedal(row.contingentName, 'bronze', 1)}
                      title="Tambah 1 Perunggu"
                      className="w-5 h-5 rounded flex items-center justify-center hover:bg-amber-800/20 text-amber-800 dark:text-amber-500 text-xs font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </td>

                {/* Total */}
                <td className="py-3 px-3 text-center tabular-nums font-teko font-bold text-xl text-[var(--color-arena-primary)]">
                  {row.total}
                </td>

                {/* Aksi */}
                <td className="py-3 px-3 text-right space-x-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(row)}
                    title="Edit Nama / Manual"
                    className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(row.contingentName)}
                    title="Hapus dari Klasemen"
                    className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Decoupled Modal Component */}
      <MedalTallyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRow(null);
        }}
        onSubmit={handleSubmit}
        editingRow={editingRow}
      />

      {/* Reusable Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Dari Klasemen Medali"
        message={`Apakah Anda yakin ingin menghapus "${deleteTarget}" dari klasemen medali? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
