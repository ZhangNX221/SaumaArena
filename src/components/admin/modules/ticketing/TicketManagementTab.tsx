'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Ticket, CheckCircle2 } from 'lucide-react';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';

export interface TicketCategory {
  id: string;
  name: string;
  price: number;
  quota: number;
  sold: number;
  session: string;
  status: 'ACTIVE' | 'SOLDOUT';
}

const INITIAL_CATEGORIES: TicketCategory[] = [
  { id: 'cat-1', name: 'Tribun Reguler', price: 10000, quota: 800, sold: 620, session: 'Seluruh Laga Hari Ini', status: 'ACTIVE' },
  { id: 'cat-2', name: 'Pelajar Berseragam', price: 5000, quota: 600, sold: 450, session: 'Tarif Khusus Siswa Berseragam', status: 'ACTIVE' },
  { id: 'cat-3', name: 'Paket Suporter (5 Tiket)', price: 40000, quota: 300, sold: 210, session: 'Rombongan Suporter Madrasah', status: 'ACTIVE' },
  { id: 'cat-4', name: 'Tribun VIP Utama', price: 25000, quota: 150, sold: 125, session: 'Tribun Tengah Beratap Khusus', status: 'ACTIVE' },
];

export const TicketManagementTab: React.FC = () => {
  const [categories, setCategories] = useState<TicketCategory[]>(INITIAL_CATEGORIES);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TicketCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 10000,
    quota: 500,
    sold: 0,
    session: 'Seluruh Laga Hari Ini',
    status: 'ACTIVE' as 'ACTIVE' | 'SOLDOUT',
  });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      price: 10000,
      quota: 500,
      sold: 0,
      session: 'Seluruh Laga Hari Ini',
      status: 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: TicketCategory) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      price: cat.price,
      quota: cat.quota,
      sold: cat.sold,
      session: cat.session,
      status: cat.status,
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

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: formData.name,
                price: Number(formData.price),
                quota: Number(formData.quota),
                sold: Number(formData.sold),
                session: formData.session,
                status: formData.sold >= formData.quota ? 'SOLDOUT' : formData.status,
              }
            : c
        )
      );
    } else {
      const newCat: TicketCategory = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        price: Number(formData.price),
        quota: Number(formData.quota),
        sold: Number(formData.sold) || 0,
        session: formData.session,
        status: formData.status,
      };
      setCategories((prev) => [...prev, newCat]);
    }

    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
        <div>
          <h3 className="font-black text-lg text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
            Manajemen Kuota &amp; Kategori Tiket
          </h3>
          <p className="text-xs text-[var(--text-muted)] font-[var(--font-sans)] mt-1">
            Atur kuota penjualan tiket, tarif presale/reguler, sesi tribun, dan batas penjualan.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-tactile px-4 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-bold font-[var(--font-display)] flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori Tiket</span>
        </button>
      </div>

      {/* Grid of Ticket Categories with CRUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat) => {
          const pct = Math.round((cat.sold / cat.quota) * 100);
          return (
            <div
              key={cat.id}
              className="p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-sm font-black text-[var(--text-main)] font-[var(--font-display)] block tracking-tight">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] font-medium font-[var(--font-sans)] block mt-0.5">
                    {cat.session}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[10px] font-bold font-[var(--font-display)] px-2.5 py-1 rounded-lg ${
                      cat.status === 'SOLDOUT'
                        ? 'bg-red-500/15 text-red-700 dark:text-red-400'
                        : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {cat.status === 'SOLDOUT' ? 'HABIS' : 'TERSEDIA'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    title="Hapus Tiket"
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black font-[var(--font-mono)] tabular-nums text-[var(--color-arena-primary)] tracking-tight">
                  Rp {cat.price.toLocaleString('id-ID')}
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium mt-3">
                  <span>Kuota: <strong className="font-[var(--font-mono)] tabular-nums text-[var(--text-main)]">{cat.sold}</strong> / {cat.quota}</span>
                  <span className="font-bold font-[var(--font-mono)] tabular-nums text-[var(--color-arena-primary)]">{pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--bg-muted)] overflow-hidden mt-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${pct >= 100 ? 'bg-red-500' : 'bg-[var(--color-arena-primary)]'}`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenEdit(cat)}
                className="btn-tactile w-full py-2 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-xs font-bold font-[var(--font-display)] text-[var(--text-main)] flex items-center justify-center gap-2 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
                <span>Edit Sesi &amp; Kuota</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal CRUD (Create & Update) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-black text-base text-[var(--text-main)]">
                {editingCategory ? 'Edit Kategori Tiket' : 'Tambah Kategori Tiket Baru'}
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
                <label className="font-bold text-[var(--text-main)] block mb-1">Nama Kategori Tiket</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Reguler Tribun Timur / VIP Utama"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Harga Tiket (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Total Kuota Seat</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quota}
                    onChange={(e) => setFormData({ ...formData, quota: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Tiket Terjual</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sold}
                    onChange={(e) => setFormData({ ...formData, sold: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Status Penjualan</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'SOLDOUT' })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-semibold"
                  >
                    <option value="ACTIVE">TERSEDIA (Buka)</option>
                    <option value="SOLDOUT">HABIS (Tutup)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--text-main)] block mb-1">Sesi / Keterangan Masuk</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Penyisihan Grup (Pagi-Sore)"
                  value={formData.session}
                  onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-bold text-xs"
                >
                  {editingCategory ? 'Simpan Perubahan' : 'Tambahkan Tiket'}
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
        title="Hapus Kategori Tiket"
        message={`Apakah Anda yakin ingin menghapus kategori tiket "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Tiket"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
