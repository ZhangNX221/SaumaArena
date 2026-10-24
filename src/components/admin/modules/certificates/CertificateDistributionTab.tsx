'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Download, QrCode, CheckCircle2, Send } from 'lucide-react';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';
import { CertificateIssueModal, CertificateFormData } from './CertificateIssueModal';

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
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<IssuedCertificate | null>(null);

  const handleOpenAdd = () => {
    setEditingCert(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: IssuedCertificate) => {
    setEditingCert(cert);
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
    setSentNotice(`E-Sertifikat ${cert.serialNumber} berhasil dikirimkan ke email resmi ${cert.recipientName}.`);
    setTimeout(() => setSentNotice(null), 3500);
    setCertificates((prev) =>
      prev.map((c) => (c.id === cert.id ? { ...c, status: 'SENT' } : c))
    );
  };

  const handleSubmit = (formData: CertificateFormData) => {
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
          <h3 className="font-bebas text-xl sm:text-2xl uppercase tracking-wide text-[var(--text-main)]">
            Distribusi &amp; Penerbitan Piagam Digital
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Kirim sertifikat ber-QR ke kontingen sekolah pemenang, atlet peraih medali, dan suporter terbaik.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-tactile px-4 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Terbitkan Sertifikat</span>
        </button>
      </div>

      {sentNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{sentNotice}</span>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            type="text"
            placeholder="Cari penerima, kontingen, no. seri QR, atau kategori..."
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
          <option value="SENT">Terkirim ke Email</option>
          <option value="READY">Siap Diunduh</option>
        </select>
      </div>

      {/* Table CRUD */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
        <table className="w-full text-xs text-left">
          <thead className="bg-[var(--bg-muted)]/70 text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
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
                <td colSpan={6} className="text-center py-10 text-[var(--text-muted)]">
                  Tidak ada sertifikat yang ditemukan.
                </td>
              </tr>
            ) : (
              filtered.map((cert) => (
                <tr key={cert.id} className="hover:bg-[var(--bg-muted)]/30 transition-colors">
                  <td className="py-4 px-4 font-mono tabular-nums font-bold text-[var(--color-arena-primary)]">
                    <span className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 shrink-0 text-[var(--color-arena-primary)]" />
                      <span>{cert.serialNumber}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-[var(--text-main)]">{cert.recipientName}</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-medium">{cert.contingent}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-barlow font-bold uppercase tracking-wide text-xs text-[var(--text-main)] block">
                      {cert.awardTitle}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[var(--text-muted)] font-mono tabular-nums text-xs font-medium">
                    {cert.issueDate}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-barlow font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
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
      <CertificateIssueModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCert(null);
        }}
        onSubmit={handleSubmit}
        editingCert={editingCert}
      />

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
