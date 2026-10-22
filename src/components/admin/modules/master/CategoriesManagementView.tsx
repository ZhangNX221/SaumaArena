'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, CheckCircle2, X } from 'lucide-react';
import { SportConfig } from '@/types';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';

export interface CategoryItem {
  id: string;
  sportCode: string;
  sportName: string;
  name: string;
  ageLimit: string;
  quotaTeams: number;
}

interface CategoriesManagementViewProps {
  sports: SportConfig[];
  onOpenAddSportModal?: () => void;
}

export const CategoriesManagementView: React.FC<CategoriesManagementViewProps> = ({ sports }) => {
  // Initialize flat categories from sports
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    const list: CategoryItem[] = [];
    sports.forEach((sp) => {
      sp.categories.forEach((cat, idx) => {
        list.push({
          id: `cat-${sp.code}-${idx + 1}`,
          sportCode: sp.code,
          sportName: sp.name,
          name: cat,
          ageLimit: 'SD/MI Usia 10-12 Tahun',
          quotaTeams: 16,
        });
      });
    });
    return list;
  });

  const [search, setSearch] = useState('');
  const [selectedSportFilter, setSelectedSportFilter] = useState('ALL');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null);
  const [formData, setFormData] = useState({
    sportCode: sports[0]?.code || 'FUTSAL',
    name: '',
    ageLimit: 'SD/MI Usia 10-12 Tahun',
    quotaTeams: 16,
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      sportCode: sports[0]?.code || 'FUTSAL',
      name: '',
      ageLimit: 'SD/MI Usia 10-12 Tahun',
      quotaTeams: 16,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CategoryItem) => {
    setEditingItem(item);
    setFormData({
      sportCode: item.sportCode,
      name: item.name,
      ageLimit: item.ageLimit,
      quotaTeams: item.quotaTeams,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const matchedSport = sports.find((s) => s.code === formData.sportCode);
    const sportName = matchedSport ? matchedSport.name : formData.sportCode;

    if (editingItem) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingItem.id
            ? { ...c, ...formData, sportName }
            : c
        )
      );
    } else {
      const newItem: CategoryItem = {
        id: `cat-${Date.now()}`,
        sportCode: formData.sportCode,
        sportName,
        name: formData.name,
        ageLimit: formData.ageLimit,
        quotaTeams: Number(formData.quotaTeams) || 16,
      };
      setCategories((prev) => [newItem, ...prev]);
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const filtered = categories.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.sportName.toLowerCase().includes(search.toLowerCase());
    const matchSport = selectedSportFilter === 'ALL' || c.sportCode === selectedSportFilter;
    return matchSearch && matchSport;
  });

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-4">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <h3 className="font-black text-base text-[var(--text-main)] font-[var(--font-display)]">
            Daftar Kategori &amp; Nomor Tanding Resmi
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Kelola nomor tanding resmi turnamen, batas usia atlet, dan kuota tim per kategori.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-tactile px-3.5 py-2 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Nomor Tanding</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            type="text"
            placeholder="Cari nama nomor tanding atau cabor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
          />
        </div>
        <select
          value={selectedSportFilter}
          onChange={(e) => setSelectedSportFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-1.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] font-semibold"
        >
          <option value="ALL">Semua Cabor ({categories.length})</option>
          {sports.map((sp) => (
            <option key={sp.code} value={sp.code}>
              {sp.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table CRUD */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
        <table className="w-full text-xs text-left">
          <thead className="bg-[var(--bg-muted)] text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
            <tr>
              <th className="py-2.5 px-3">Cabang Olahraga</th>
              <th className="py-2.5 px-3">Nomor / Kategori Tanding</th>
              <th className="py-2.5 px-3">Batas Usia / Jenjang</th>
              <th className="py-2.5 px-3 text-center">Kuota Tim</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-[var(--text-muted)]">
                  Tidak ada nomor tanding yang sesuai kriteria pencarian.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--bg-muted)]/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-[var(--color-arena-primary)]">
                    {item.sportName}
                  </td>
                  <td className="py-3 px-3 font-extrabold text-[var(--text-main)]">
                    {item.name}
                  </td>
                  <td className="py-3 px-3 text-[var(--text-muted)]">
                    {item.ageLimit}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[var(--text-main)]">
                    {item.quotaTeams} Tim
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                      Resmi
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      title="Edit Nomor Tanding"
                      className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.name)}
                      title="Hapus Nomor Tanding"
                      className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal CRUD (Create & Update) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-black text-base text-[var(--text-main)]">
                {editingItem ? 'Edit Nomor Tanding' : 'Tambah Nomor Tanding Baru'}
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
                <label className="font-bold text-[var(--text-main)] block mb-1">Cabang Olahraga</label>
                <select
                  value={formData.sportCode}
                  onChange={(e) => setFormData({ ...formData, sportCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                >
                  {sports.map((sp) => (
                    <option key={sp.code} value={sp.code}>
                      {sp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[var(--text-main)] block mb-1">Nama Kategori / Nomor Tanding</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ganda Putra U-15 / Futsal Putri"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Batas Usia / Jenjang</label>
                  <input
                    type="text"
                    value={formData.ageLimit}
                    onChange={(e) => setFormData({ ...formData, ageLimit: e.target.value })}
                    placeholder="Contoh: U-12 s.d U-17"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Kuota Tim Maksimal</label>
                  <input
                    type="number"
                    min="2"
                    max="128"
                    value={formData.quotaTeams}
                    onChange={(e) => setFormData({ ...formData, quotaTeams: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-bold text-xs"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan Kategori'}
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
        title="Hapus Kategori Tanding"
        message={`Apakah Anda yakin ingin menghapus nomor tanding "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Nomor"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
