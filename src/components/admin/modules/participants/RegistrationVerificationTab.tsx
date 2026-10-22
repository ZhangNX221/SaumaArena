'use client';

import React, { useState } from 'react';
import { Plus, Search, CheckCircle2, XCircle, Trash2, Edit2, ShieldCheck, X } from 'lucide-react';
import { SportCode } from '@/types';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';

export interface RegistrationDossier {
  id: string;
  regNumber: string;
  schoolName: string;
  teamName: string;
  sport: string;
  category: string;
  coachName: string;
  coachPhone: string;
  athleteCount: number;
  nisnStatus: 'VALID' | 'NEED_REVISION';
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  rejectionReason?: string;
  submittedAt: string;
}

const INITIAL_REGISTRATIONS: RegistrationDossier[] = [
  {
    id: 'reg-001',
    regNumber: 'REG-MMFC-2026-001',
    schoolName: 'MIN 1 Kota',
    teamName: 'MIN 1 Kota Futsal',
    sport: 'FUTSAL',
    category: 'SD/MI Putra (Usia 10-12)',
    coachName: 'Ust. Rahmat Hidayat, S.Pd',
    coachPhone: '0812-3456-7801',
    athleteCount: 12,
    nisnStatus: 'VALID',
    status: 'APPROVED',
    submittedAt: '17 Okt 2026',
  },
  {
    id: 'reg-002',
    regNumber: 'REG-MMFC-2026-002',
    schoolName: 'SDN Percobaan 1',
    teamName: 'Percobaan 1 Squad',
    sport: 'FUTSAL',
    category: 'SD/MI Putra (Usia 10-12)',
    coachName: 'Bambang Sutrisno, S.Pd',
    coachPhone: '0812-3456-7803',
    athleteCount: 10,
    nisnStatus: 'VALID',
    status: 'APPROVED',
    submittedAt: '17 Okt 2026',
  },
  {
    id: 'reg-003',
    regNumber: 'REG-MMFC-2026-003',
    schoolName: 'MIS Al-Hidayah',
    teamName: 'Al-Hidayah Futsal',
    sport: 'FUTSAL',
    category: 'SD/MI Putra (Usia 10-12)',
    coachName: 'Ahmad Zaki, S.Pd.I',
    coachPhone: '0812-3456-7804',
    athleteCount: 10,
    nisnStatus: 'VALID',
    status: 'APPROVED',
    submittedAt: '18 Okt 2026',
  },
  {
    id: 'reg-004',
    regNumber: 'REG-MMFC-2026-004',
    schoolName: 'SDIT Bina Insani',
    teamName: 'Bina Insani FC',
    sport: 'FUTSAL',
    category: 'SD/MI Putra (Usia 10-12)',
    coachName: 'Dwi Cahyono, S.Or',
    coachPhone: '0812-3456-7805',
    athleteCount: 10,
    nisnStatus: 'VALID',
    status: 'APPROVED',
    submittedAt: '18 Okt 2026',
  },
  {
    id: 'reg-005',
    regNumber: 'REG-MMFC-2026-005',
    schoolName: 'MI Tarbiyatul Islam',
    teamName: 'Tarbiyah Warrior',
    sport: 'FUTSAL',
    category: 'SD/MI Putra (Usia 10-12)',
    coachName: 'Wahyu Kurniawan, S.Pd',
    coachPhone: '0812-3456-7811',
    athleteCount: 10,
    nisnStatus: 'NEED_REVISION',
    status: 'PENDING',
    rejectionReason: 'Surat rekomendasi kepala madrasah dan NISN pemain nomor 11 sedang diverifikasi.',
    submittedAt: '19 Okt 2026',
  },
];

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
  const [formData, setFormData] = useState({
    schoolName: '',
    teamName: '',
    sport: 'FUTSAL',
    category: 'SD/MI Putra (Usia 10-12)',
    coachName: '',
    coachPhone: '',
    athleteCount: 12,
    nisnStatus: 'VALID' as 'VALID' | 'NEED_REVISION',
    status: 'PENDING' as 'APPROVED' | 'PENDING' | 'REJECTED',
    rejectionReason: '',
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      schoolName: '',
      teamName: '',
      sport: selectedSport !== 'ALL' ? selectedSport : 'FUTSAL',
      category: 'SD/MI Putra (Usia 10-12)',
      coachName: '',
      coachPhone: '',
      athleteCount: 12,
      nisnStatus: 'VALID',
      status: 'PENDING',
      rejectionReason: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: RegistrationDossier) => {
    setEditingItem(item);
    setFormData({
      schoolName: item.schoolName,
      teamName: item.teamName,
      sport: item.sport,
      category: item.category,
      coachName: item.coachName,
      coachPhone: item.coachPhone,
      athleteCount: item.athleteCount,
      nisnStatus: item.nisnStatus,
      status: item.status,
      rejectionReason: item.rejectionReason || '',
    });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.schoolName.trim() || !formData.teamName.trim()) return;

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
          <h3 className="font-black text-lg text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
            Verifikasi Berkas &amp; Dokumen Usia Siswa (NISN)
          </h3>
          <p className="text-xs text-[var(--text-muted)] font-[var(--font-sans)] mt-1">
            Pemeriksaan keabsahan surat rekomendasi sekolah, NISN Kemdikbud, dan legalitas roster atlet.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-tactile px-4 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-bold font-[var(--font-display)] flex items-center gap-2 shadow-xs shrink-0"
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
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)] font-[var(--font-sans)]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 px-3.5 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] font-bold font-[var(--font-display)]"
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
          <thead className="bg-[var(--bg-muted)]/70 text-[11px] font-black uppercase tracking-wider font-[var(--font-display)] text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
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
                <td colSpan={7} className="text-center py-10 text-[var(--text-muted)] font-[var(--font-sans)]">
                  Tidak ada berkas pendaftaran yang ditemukan.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--bg-muted)]/30 transition-colors">
                  <td className="py-4 px-4 font-[var(--font-mono)] tabular-nums font-bold text-[var(--color-arena-primary)]">
                    {item.regNumber}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-[var(--text-main)] font-[var(--font-display)]">{item.schoolName}</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-medium">{item.teamName}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-[var(--text-main)] font-[var(--font-display)] block">{item.sport}</span>
                    <span className="text-[11px] text-[var(--text-muted)]">{item.category}</span>
                  </td>
                  <td className="py-4 px-4 text-[var(--text-muted)]">
                    <div className="text-[var(--text-main)] font-semibold">{item.coachName}</div>
                    <div className="text-[11px] font-[var(--font-mono)] tabular-nums">{item.coachPhone}</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-[var(--font-display)] ${
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
                      className={`px-3 py-1 rounded-full text-[10px] font-bold font-[var(--font-display)] inline-flex items-center gap-1.5 ${
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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-black text-base text-[var(--text-main)]">
                {editingItem ? 'Edit Status & Berkas Pendaftaran' : 'Tambah Pendaftaran Tim Baru'}
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
                <label className="font-bold text-[var(--text-main)] block mb-1">Nama Sekolah / Kontingen</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: MIN 1 Kota Malang"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--text-main)] block mb-1">Nama Tim / Julukan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Elang Matsanega"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Cabor</label>
                  <input
                    type="text"
                    required
                    value={formData.sport}
                    onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Kategori</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Nama Pelatih</label>
                  <input
                    type="text"
                    required
                    value={formData.coachName}
                    onChange={(e) => setFormData({ ...formData, coachName: e.target.value })}
                    placeholder="Bram Ndolu"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">No. WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={formData.coachPhone}
                    onChange={(e) => setFormData({ ...formData, coachPhone: e.target.value })}
                    placeholder="0812-xxxx"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Status Verifikasi</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'APPROVED' | 'PENDING' | 'REJECTED' })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-semibold"
                  >
                    <option value="APPROVED">Lolos Verifikasi</option>
                    <option value="PENDING">Menunggu Antrean</option>
                    <option value="REJECTED">Tolak / Revisi</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Status NISN</label>
                  <select
                    value={formData.nisnStatus}
                    onChange={(e) => setFormData({ ...formData, nisnStatus: e.target.value as 'VALID' | 'NEED_REVISION' })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-semibold"
                  >
                    <option value="VALID">NISN Sah Kemdikbud</option>
                    <option value="NEED_REVISION">Perlu Perbaikan</option>
                  </select>
                </div>
              </div>

              {formData.status === 'REJECTED' && (
                <div>
                  <label className="font-bold text-red-600 block mb-1">Catatan Penolakan / Revisi</label>
                  <textarea
                    rows={2}
                    value={formData.rejectionReason}
                    onChange={(e) => setFormData({ ...formData, rejectionReason: e.target.value })}
                    placeholder="Sebutkan berkas yang perlu dilengkapi..."
                    className="w-full px-3 py-2 rounded-xl border border-red-500/30 bg-[var(--bg-muted)] text-[var(--text-main)]"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-bold text-xs"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan Berkas'}
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
