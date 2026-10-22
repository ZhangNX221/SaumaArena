'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, CheckCircle2, Clock } from 'lucide-react';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';

export interface Transaction {
  id: string;
  orderCode: string;
  customerName: string;
  schoolAffiliation: string;
  category: string;
  qty: number;
  total: number;
  date: string;
  status: 'PAID' | 'PENDING';
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'trx-1', orderCode: 'ORD-20261024-001', customerName: 'Ust. Rahmat Hidayat', schoolAffiliation: 'MIN 1 Kota', category: 'Tribun Reguler', qty: 3, total: 30000, date: '24 Okt 2026, 08:30', status: 'PAID' },
  { id: 'trx-2', orderCode: 'ORD-20261024-002', customerName: 'Bambang Sutrisno', schoolAffiliation: 'SDN Percobaan 1', category: 'Tribun VIP Utama', qty: 2, total: 50000, date: '24 Okt 2026, 09:15', status: 'PAID' },
  { id: 'trx-3', orderCode: 'ORD-20261024-003', customerName: 'Kolektif Suporter Al-Hidayah', schoolAffiliation: 'MIS Al-Hidayah', category: 'Paket Suporter (5 Tiket)', qty: 8, total: 320000, date: '24 Okt 2026, 09:45', status: 'PAID' },
  { id: 'trx-4', orderCode: 'ORD-20261024-004', customerName: 'Dwi Cahyono', schoolAffiliation: 'SDIT Bina Insani', category: 'Pelajar Berseragam', qty: 5, total: 25000, date: '24 Okt 2026, 10:10', status: 'PAID' },
];

export const TransactionHistoryTab: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; orderCode: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrx, setEditingTrx] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    schoolAffiliation: '',
    category: 'Tribun Reguler',
    qty: 1,
    pricePerTicket: 10000,
    status: 'PAID' as 'PAID' | 'PENDING',
  });

  const handleOpenAdd = () => {
    setEditingTrx(null);
    setFormData({
      customerName: '',
      schoolAffiliation: 'Loket Matsanega Court',
      category: 'Tribun Reguler',
      qty: 1,
      pricePerTicket: 10000,
      status: 'PAID',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (trx: Transaction) => {
    setEditingTrx(trx);
    const unitPrice = trx.qty > 0 ? Math.round(trx.total / trx.qty) : 10000;
    setFormData({
      customerName: trx.customerName,
      schoolAffiliation: trx.schoolAffiliation,
      category: trx.category,
      qty: trx.qty,
      pricePerTicket: unitPrice,
      status: trx.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, orderCode: string) => {
    setDeleteTarget({ id, orderCode });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setTransactions((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim()) return;

    const total = formData.qty * formData.pricePerTicket;

    if (editingTrx) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingTrx.id
            ? {
                ...t,
                customerName: formData.customerName,
                schoolAffiliation: formData.schoolAffiliation,
                category: formData.category,
                qty: formData.qty,
                total,
                status: formData.status,
              }
            : t
        )
      );
    } else {
      const newTrx: Transaction = {
        id: `trx-${Date.now()}`,
        orderCode: `ORD-${Date.now().toString().slice(-6)}`,
        customerName: formData.customerName,
        schoolAffiliation: formData.schoolAffiliation,
        category: formData.category,
        qty: formData.qty,
        total,
        date: 'Hari ini, Baru',
        status: formData.status,
      };
      setTransactions((prev) => [newTrx, ...prev]);
    }

    setIsModalOpen(false);
    setEditingTrx(null);
  };

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.orderCode.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.schoolAffiliation.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h3 className="font-black text-lg text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
            Data Transaksi Penjualan Tiket
          </h3>
          <p className="text-xs text-[var(--text-muted)] font-[var(--font-sans)] mt-1">
            Log riwayat pembelian tiket online dan cetak manual di loket pintu arena.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-tactile px-4 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-bold font-[var(--font-display)] flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Transaksi Loket Baru</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            type="text"
            placeholder="Cari no. order, nama pembeli, atau sekolah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)] font-[var(--font-sans)]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-44 px-3.5 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] font-bold font-[var(--font-display)]"
        >
          <option value="ALL">Semua Status</option>
          <option value="PAID">LUNAS</option>
          <option value="PENDING">PENDING</option>
        </select>
      </div>

      {/* Table CRUD */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
        <table className="w-full text-xs text-left">
          <thead className="bg-[var(--bg-muted)]/70 text-[11px] font-black uppercase tracking-wider font-[var(--font-display)] text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
            <tr>
              <th className="py-3.5 px-4">No. Order</th>
              <th className="py-3.5 px-4">Pembeli &amp; Afiliasi</th>
              <th className="py-3.5 px-4">Kategori Tiket</th>
              <th className="py-3.5 px-4 text-center">Jumlah</th>
              <th className="py-3.5 px-4 text-right">Total Bayar</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-[var(--text-muted)] font-[var(--font-sans)]">
                  Tidak ada transaksi yang sesuai.
                </td>
              </tr>
            ) : (
              filtered.map((trx) => (
                <tr key={trx.id} className="hover:bg-[var(--bg-muted)]/30 transition-colors">
                  <td className="py-4 px-4 font-[var(--font-mono)] tabular-nums font-bold text-[var(--text-main)]">
                    {trx.orderCode}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-[var(--text-main)] font-[var(--font-display)]">{trx.customerName}</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-medium">{trx.schoolAffiliation}</div>
                  </td>
                  <td className="py-4 px-4 text-[var(--text-muted)] font-medium">{trx.category}</td>
                  <td className="py-4 px-4 text-center font-bold font-[var(--font-mono)] tabular-nums">{trx.qty} tiket</td>
                  <td className="py-4 px-4 text-right font-[var(--font-mono)] tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
                    Rp {trx.total.toLocaleString('id-ID')}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold font-[var(--font-display)] px-2.5 py-1 rounded-lg ${
                        trx.status === 'PAID'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {trx.status === 'PAID' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>LUNAS</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          <span>MENUNGGU</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(trx)}
                        title="Edit Transaksi"
                        className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(trx.id, trx.orderCode)}
                        title="Hapus Transaksi"
                        className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
                {editingTrx ? `Edit Transaksi: ${editingTrx.orderCode}` : 'Transaksi Loket Baru'}
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
                <label className="font-bold text-[var(--text-main)] block mb-1">Nama Pembeli</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Marselino Radja"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--text-main)] block mb-1">Sekolah / Afiliasi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: MIN 1 Kota Malang / Suporter Umum"
                  value={formData.schoolAffiliation}
                  onChange={(e) => setFormData({ ...formData, schoolAffiliation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--text-main)] block mb-1">Kategori Tiket</label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const cat = e.target.value;
                    const price = cat.includes('VIP') ? 50000 : cat.includes('Rombongan') ? 10000 : 25000;
                    setFormData({ ...formData, category: cat, pricePerTicket: price });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-semibold"
                >
                  <option value="Reguler Tribun Barat">Reguler Tribun Barat (Rp 25.000)</option>
                  <option value="VIP Tribun Utama AC">VIP Tribun Utama AC (Rp 50.000)</option>
                  <option value="Presale Tribun Timur">Presale Tribun Timur (Rp 15.000)</option>
                  <option value="Rombongan Suporter">Rombongan Suporter (Rp 10.000)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Jumlah Tiket</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.qty}
                    onChange={(e) => setFormData({ ...formData, qty: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Status Pembayaran</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'PAID' | 'PENDING' })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-semibold"
                  >
                    <option value="PAID">LUNAS (Cetak QR)</option>
                    <option value="PENDING">PENDING (Menunggu)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-muted)] text-xs flex justify-between items-center">
                <span className="text-[var(--text-muted)]">Estimasi Total Tagihan:</span>
                <span className="font-black text-sm font-mono text-emerald-700 dark:text-emerald-400">
                  Rp {(formData.qty * formData.pricePerTicket).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-bold text-xs"
                >
                  {editingTrx ? 'Simpan Perubahan' : 'Proses Tiket Loket'}
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
        title="Hapus Data Transaksi"
        message={`Apakah Anda yakin ingin menghapus data transaksi "${deleteTarget?.orderCode}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Transaksi"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
