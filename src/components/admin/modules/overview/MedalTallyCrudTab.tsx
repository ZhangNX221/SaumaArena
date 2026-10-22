'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Medal, Trophy } from 'lucide-react';
import { MEDAL_TALLY } from '@/mocks/multiSportData';
import { MedalTallyRow, SportCode } from '@/types';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';

interface MedalTallyCrudTabProps {
  selectedSport?: SportCode;
}

export const MedalTallyCrudTab: React.FC<MedalTallyCrudTabProps> = ({ selectedSport = 'ALL' }) => {
  const [tally, setTally] = useState<MedalTallyRow[]>(MEDAL_TALLY);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<MedalTallyRow | null>(null);
  const [formData, setFormData] = useState({
    contingentName: '',
    gold: 0,
    silver: 0,
    bronze: 0,
  });

  const handleOpenAdd = () => {
    setEditingRow(null);
    setFormData({
      contingentName: '',
      gold: 0,
      silver: 0,
      bronze: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: MedalTallyRow) => {
    setEditingRow(row);
    setFormData({
      contingentName: row.contingentName,
      gold: row.gold,
      silver: row.silver,
      bronze: row.bronze,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (contingentName: string) => {
    setDeleteTarget(contingentName);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setTally((prev) => prev.filter((r) => r.contingentName !== deleteTarget));
      setDeleteTarget(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contingentName.trim()) return;

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
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-4">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <h3 className="font-black text-base text-[var(--text-main)] font-[var(--font-display)] flex items-center gap-2">
            <Medal className="w-5 h-5 text-amber-500" />
            <span>Klasemen Perolehan Medali Kontingen (Medal Tally Resmi)</span>
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Rekap medali emas, perak, dan perunggu kontingen sekolah berdasarkan BAP kejuaraan.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-tactile px-3.5 py-2 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kontingen Medali</span>
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
        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] shrink-0">
          Filter Cabor: {selectedSport === 'ALL' ? 'Semua Cabor' : selectedSport}
        </span>
      </div>

      {/* Table CRUD */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
        <table className="w-full text-xs text-left">
          <thead className="bg-[var(--bg-muted)] text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
            <tr>
              <th className="py-2.5 px-3 text-center">Rank</th>
              <th className="py-2.5 px-3">Kontingen Sekolah / Klub</th>
              <th className="py-2.5 px-3 text-center text-amber-500 font-extrabold">Emas</th>
              <th className="py-2.5 px-3 text-center text-slate-400 font-extrabold">Perak</th>
              <th className="py-2.5 px-3 text-center text-amber-700 font-extrabold">Perunggu</th>
              <th className="py-2.5 px-3 text-center font-black">Total</th>
              <th className="py-2.5 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] font-medium">
            {sorted.map((row, idx) => (
              <tr key={row.contingentName} className="hover:bg-[var(--bg-muted)]/40 transition-colors">
                <td className="py-3 px-3 text-center font-mono font-bold">
                  {idx === 0 ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs">
                      1
                    </span>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </td>
                <td className="py-3 px-3 font-bold text-[var(--text-main)]">
                  {row.contingentName}
                </td>
                <td className="py-3 px-3 text-center tabular-nums font-mono font-black text-amber-500 text-sm">
                  {row.gold}
                </td>
                <td className="py-3 px-3 text-center tabular-nums font-mono font-bold text-slate-500 dark:text-slate-400 text-sm">
                  {row.silver}
                </td>
                <td className="py-3 px-3 text-center tabular-nums font-mono font-bold text-amber-700 dark:text-amber-600 text-sm">
                  {row.bronze}
                </td>
                <td className="py-3 px-3 text-center tabular-nums font-mono font-black text-sm text-[var(--color-arena-primary)]">
                  {row.total}
                </td>
                <td className="py-3 px-3 text-right space-x-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(row)}
                    title="Edit Medali"
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

      {/* Modal CRUD (Create & Update) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-black text-base text-[var(--text-main)]">
                {editingRow ? `Edit Medali: ${editingRow.contingentName}` : 'Tambah Kontingen ke Klasemen Medali'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[var(--text-main)] block mb-1">Nama Kontingen Sekolah</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: MIN 1 Kota Malang"
                  value={formData.contingentName}
                  onChange={(e) => setFormData({ ...formData, contingentName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-amber-500 block mb-1">Emas (Gold)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.gold}
                    onChange={(e) => setFormData({ ...formData, gold: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono text-center font-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Perak (Silver)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.silver}
                    onChange={(e) => setFormData({ ...formData, silver: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono text-center font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-amber-700 block mb-1">Perunggu</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.bronze}
                    onChange={(e) => setFormData({ ...formData, bronze: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono text-center font-bold"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-muted)] text-xs flex justify-between items-center">
                <span className="text-[var(--text-muted)]">Total Medali Dihitung:</span>
                <span className="font-black text-sm font-mono text-[var(--color-arena-primary)]">
                  {(Number(formData.gold) || 0) + (Number(formData.silver) || 0) + (Number(formData.bronze) || 0)} Medali
                </span>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-bold text-xs"
                >
                  {editingRow ? 'Simpan Perubahan' : 'Tambahkan ke Klasemen'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-tactile px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
