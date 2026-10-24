'use client';

import React, { useState } from 'react';
import { Plus, Search, CheckCircle2, XCircle, Trash2, Edit2, ShieldCheck } from 'lucide-react';
import { SportCode } from '@/types';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';
import {
  RegistrationDossierModal,
  RegistrationDossier,
  RegistrationFormData,
} from './RegistrationDossierModal';
import { INITIAL_REGISTRATIONS } from '@/mocks/registrationMockData';

export type { RegistrationDossier };

interface RegistrationVerificationTabProps {
  selectedSport?: SportCode;
}

export const RegistrationVerificationTab: React.FC<RegistrationVerificationTabProps> = ({ selectedSport = 'ALL' }) => {
  const [registrations, setRegistrations] = useState<RegistrationDossier[]>(INITIAL_REGISTRATIONS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RegistrationDossier | null>(null);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: RegistrationDossier) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setRegistrations((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleQuickStatus = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const handleSubmit = (formData: RegistrationFormData) => {
    if (editingItem) {
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === editingItem.id
            ? { ...r, ...formData }
            : r
        )
      );
    } else {
      const newItem: RegistrationDossier = {
        id: `reg-${Date.now()}`,
        regNumber: `REG-MMFC-2026-${String(registrations.length + 1).padStart(3, '0')}`,
        ...formData,
        submittedAt: 'Hari ini',
      };
      setRegistrations((prev) => [newItem, ...prev]);
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const filtered = registrations.filter((r) => {
    const matchSearch =
      r.schoolName.toLowerCase().includes(search.toLowerCase()) ||
      r.teamName.toLowerCase().includes(search.toLowerCase()) ||
      r.regNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.coachName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchSport = selectedSport === 'ALL' || r.sport === selectedSport;
    return matchSearch && matchStatus && matchSport;
  });

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h3 className="font-bebas text-xl sm:text-2xl uppercase tracking-wide text-[var(--text-main)]">
            Verifikasi Berkas &amp; Dokumen Usia Siswa (NISN)
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Pemeriksaan keabsahan surat rekomendasi sekolah, NISN Kemdikbud, dan legalitas roster atlet.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-tactile px-4 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Berkas Pendaftaran</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            type="text"
            placeholder="Cari no. registrasi, sekolah, tim, atau pelatih..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 px-3.5 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider"
        >
          <option value="ALL">Semua Status</option>
          <option value="APPROVED">Lolos Berkas</option>
          <option value="PENDING">Menunggu Verifikasi</option>
          <option value="REJECTED">Perlu Perbaikan</option>
        </select>
      </div>

      {/* Table CRUD */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
        <table className="w-full text-xs text-left">
          <thead className="bg-[var(--bg-muted)]/70 text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
            <tr>
              <th className="py-3.5 px-4">No. Berkas</th>
              <th className="py-3.5 px-4">Kontingen &amp; Tim</th>
              <th className="py-3.5 px-4">Cabor &amp; Kategori</th>
              <th className="py-3.5 px-4">Pelatih / Kontak</th>
              <th className="py-3.5 px-4 text-center">Status NISN</th>
              <th className="py-3.5 px-4 text-center">Hasil Verifikasi</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-[var(--text-muted)]">
                  Tidak ada berkas pendaftaran yang ditemukan.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--bg-muted)]/30 transition-colors">
                  <td className="py-4 px-4 font-mono tabular-nums font-bold text-[var(--color-arena-primary)]">
                    {item.regNumber}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-[var(--text-main)]">{item.schoolName}</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-medium">{item.teamName}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-barlow font-bold uppercase tracking-wide text-xs text-[var(--text-main)] block">{item.sport}</span>
                    <span className="text-[11px] text-[var(--text-muted)]">{item.category}</span>
                  </td>
                  <td className="py-4 px-4 text-[var(--text-muted)]">
                    <div className="text-[var(--text-main)] font-semibold">{item.coachName}</div>
                    <div className="text-[11px] font-mono tabular-nums">{item.coachPhone}</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-barlow font-bold uppercase tracking-wider ${
                        item.nisnStatus === 'VALID'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {item.nisnStatus === 'VALID' ? 'NISN Sah' : 'Cek Manual'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-barlow font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                        item.status === 'APPROVED'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                          : item.status === 'REJECTED'
                          ? 'bg-red-500/15 text-red-700 dark:text-red-400'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {item.status === 'APPROVED' ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Lolos</span>
                        </>
                      ) : item.status === 'REJECTED' ? (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Tolak</span>
                        </>
                      ) : (
                        <span>Pending</span>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.status === 'PENDING' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleQuickStatus(item.id, 'APPROVED')}
                            title="Setujui Berkas"
                            className="p-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickStatus(item.id, 'REJECTED')}
                            title="Tolak Berkas"
                            className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        title="Edit Berkas"
                        className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.teamName)}
                        title="Hapus Berkas"
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
      <RegistrationDossierModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        editingItem={editingItem}
        defaultSport={selectedSport}
      />

      {/* Reusable Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Berkas Pendaftaran"
        message={`Apakah Anda yakin ingin menghapus berkas pendaftaran tim "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Berkas"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
