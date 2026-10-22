'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Download, QrCode, CheckCircle2, Send } from 'lucide-react';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';

export interface IssuedCertificate {
  id: string;
  serialNumber: string;
  recipientName: string;
  contingent: string;
  awardTitle: string;
  issueDate: string;
  status: 'SENT' | 'READY';
}

const INITIAL_ISSUED: IssuedCertificate[] = [
  {
    id: 'cert-1',
    serialNumber: 'CERT-MMFC-SUPP-001',
    recipientName: 'Madrasah Ibtidaiyah Negeri 1 Kota',
    contingent: 'MIN 1 Kota',
    awardTitle: 'Best Supporter Tribun MMFC I',
    issueDate: '28 Okt 2026',
    status: 'SENT',
  },
  {
    id: 'cert-2',
    serialNumber: 'CERT-MMFC-CHAMP-001',
    recipientName: 'MIN 1 Kota Futsal',
    contingent: 'MIN 1 Kota',
    awardTitle: 'Juara 1 Futsal Pelajar SD/MI',
    issueDate: '28 Okt 2026',
    status: 'READY',
  },
  {
    id: 'cert-3',
    serialNumber: 'CERT-MMFC-TOP-001',
    recipientName: 'Muhammad Faiz',
    contingent: 'MIN 1 Kota',
    awardTitle: 'Sepatu Emas (Top Scorer - 6 Gol)',
    issueDate: '28 Okt 2026',
    status: 'READY',
  },
  {
    id: 'cert-4',
    serialNumber: 'CERT-MMFC-MVP-001',
    recipientName: 'Aditya Pratama',
    contingent: 'SDN Percobaan 1',
    awardTitle: 'Pemain Terbaik (MVP MMFC I)',
    issueDate: '28 Okt 2026',
    status: 'SENT',
  },
];

export const CertificateDistributionTab: React.FC = () => {
  const [certificates, setCertificates] = useState<IssuedCertificate[]>(INITIAL_ISSUED);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<IssuedCertificate | null>(null);
  const [formData, setFormData] = useState({
    recipientName: '',
    contingent: '',
    awardTitle: 'Juara 1 Futsal Pelajar SD/MI',
    issueDate: '28 Okt 2026',
    status: 'READY' as 'SENT' | 'READY',
  });

  const handleOpenAdd = () => {
    setEditingCert(null);
    setFormData({
      recipientName: '',
      contingent: 'MIN 1 Kota',
      awardTitle: 'Juara 1 Futsal Pelajar SD/MI',
      issueDate: '28 Okt 2026',
      status: 'READY',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: IssuedCertificate) => {
    setEditingCert(cert);
    setFormData({
      recipientName: cert.recipientName,
      contingent: cert.contingent,
      awardTitle: cert.awardTitle,
      issueDate: cert.issueDate,
      status: cert.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setCertificates((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleSendEmail = (cert: IssuedCertificate) => {
    alert(`E-Sertifikat ${cert.serialNumber} berhasil dikirimkan ke email resmi ${cert.recipientName}.`);
    setCertificates((prev) =>
      prev.map((c) => (c.id === cert.id ? { ...c, status: 'SENT' } : c))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientName.trim()) return;

    if (editingCert) {
      setCertificates((prev) =>
        prev.map((c) =>
          c.id === editingCert.id ? { ...c, ...formData } : c
        )
      );
    } else {
      const newCert: IssuedCertificate = {
        id: `cert-${Date.now()}`,
        serialNumber: `CERT-MMFC-2026-${Date.now().toString().slice(-4)}`,
        ...formData,
      };
      setCertificates((prev) => [newCert, ...prev]);
    }

    setIsModalOpen(false);
    setEditingCert(null);
  };

  const filtered = certificates.filter((c) => {
    const matchSearch =
      c.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      c.contingent.toLowerCase().includes(search.toLowerCase()) ||
      c.awardTitle.toLowerCase().includes(search.toLowerCase()) ||
      c.serialNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h3 className="font-black text-lg text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
            Distribusi &amp; Penerbitan Piagam Digital
          </h3>
          <p className="text-xs text-[var(--text-muted)] font-[var(--font-sans)] mt-1">
            Kirim sertifikat ber-QR ke kontingen sekolah pemenang, atlet peraih medali, dan suporter terbaik.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-tactile px-4 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-bold font-[var(--font-display)] flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Terbitkan Sertifikat</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            type="text"
            placeholder="Cari penerima, kontingen, no. seri QR, atau kategori..."
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
          <option value="SENT">Terkirim ke Email</option>
          <option value="READY">Siap Diunduh</option>
        </select>
      </div>

      {/* Table CRUD */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
        <table className="w-full text-xs text-left">
          <thead className="bg-[var(--bg-muted)]/70 text-[11px] font-black uppercase tracking-wider font-[var(--font-display)] text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
            <tr>
              <th className="py-3.5 px-4">No. Seri Sertifikat</th>
              <th className="py-3.5 px-4">Nama Penerima &amp; Kontingen</th>
              <th className="py-3.5 px-4">Kategori Piagam</th>
              <th className="py-3.5 px-4">Tanggal Terbit</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-[var(--text-muted)] font-[var(--font-sans)]">
                  Tidak ada sertifikat yang ditemukan.
                </td>
              </tr>
            ) : (
              filtered.map((cert) => (
                <tr key={cert.id} className="hover:bg-[var(--bg-muted)]/30 transition-colors">
                  <td className="py-4 px-4 font-[var(--font-mono)] tabular-nums font-bold text-[var(--color-arena-primary)]">
                    <span className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 shrink-0 text-[var(--color-arena-primary)]" />
                      <span>{cert.serialNumber}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-[var(--text-main)] font-[var(--font-display)]">{cert.recipientName}</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-medium">{cert.contingent}</div>
                  </td>
                  <td className="py-4 px-4 font-bold text-[var(--text-main)] font-[var(--font-display)]">
                    {cert.awardTitle}
                  </td>
                  <td className="py-4 px-4 text-[var(--text-muted)] font-[var(--font-mono)] tabular-nums text-xs font-medium">
                    {cert.issueDate}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold font-[var(--font-display)] inline-flex items-center gap-1.5 ${
                        cert.status === 'SENT'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                          : 'bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)]'
                      }`}
                    >
                      {cert.status === 'SENT' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Terkirim</span>
                        </>
                      ) : (
                        <span>Siap Terbit</span>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSendEmail(cert)}
                        title="Kirim ke Email Penerima"
                        className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`Mengunduh PDF sertifikat ${cert.serialNumber}...`)}
                        title="Unduh PDF"
                        className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cert)}
                        title="Edit Penerima"
                        className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cert.id, cert.recipientName)}
                        title="Hapus Sertifikat"
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
                {editingCert ? 'Edit Data Sertifikat' : 'Terbitkan Sertifikat Baru'}
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
                <label className="font-bold text-[var(--text-main)] block mb-1">Nama Lengkap Penerima</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Faiz / MIN 1 Kota"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--text-main)] block mb-1">Kontingen / Sekolah Asal</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: MIN 1 Kota Malang"
                  value={formData.contingent}
                  onChange={(e) => setFormData({ ...formData, contingent: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--text-main)] block mb-1">Gelar / Kategori Penghargaan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Juara 1 Futsal Pelajar Putra"
                  value={formData.awardTitle}
                  onChange={(e) => setFormData({ ...formData, awardTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Tanggal Terbit</label>
                  <input
                    type="text"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Status Distribusi</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'SENT' | 'READY' })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-semibold"
                  >
                    <option value="READY">Siap Terbit</option>
                    <option value="SENT">Terkirim ke Email</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-bold text-xs"
                >
                  {editingCert ? 'Simpan Perubahan' : 'Terbitkan Sertifikat'}
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
        title="Batalkan Penerbitan Sertifikat"
        message={`Apakah Anda yakin ingin membatalkan/menghapus sertifikat untuk "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Batalkan Sertifikat"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
