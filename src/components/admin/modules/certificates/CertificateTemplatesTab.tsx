'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Award, Download, QrCode } from 'lucide-react';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';

export interface CertificateTemplate {
  id: string;
  title: string;
  category: string;
  issuerOrg: string;
  tournamentName: string;
  signatory: string;
  accentColor: string;
}

const INITIAL_TEMPLATES: CertificateTemplate[] = [
  {
    id: 'tmpl-1',
    title: 'Piagam Juara Turnamen & Medali',
    category: 'Juara 1 / 2 / 3 & Peringkat',
    issuerOrg: 'PANITIA MILAD MATSANEGA I & MTsN 1 MALANG',
    tournamentName: 'Milad Matsanega Futsal Competition I (MMFC I)',
    signatory: 'Dra. Hj. Erni Qomariyah, M.Pd (Kepala MTsN 1 Kota Malang)',
    accentColor: '#f6ae2d',
  },
  {
    id: 'tmpl-2',
    title: 'Penghargaan Suporter Teladan Madrasah',
    category: 'Best Supporter Tribun',
    issuerOrg: 'PANITIA MILAD MATSANEGA I & KEMENAG',
    tournamentName: 'Milad Matsanega Futsal Competition I (MMFC I)',
    signatory: 'Ust. H. Syamsul Arifin, M.Pd (Ketua Panitia MMFC I)',
    accentColor: '#1d63b8',
  },
  {
    id: 'tmpl-3',
    title: 'Penghargaan Individu (Top Scorer / MVP)',
    category: 'Sepatu Emas & Pemain Terbaik',
    issuerOrg: 'KOMISI WASIT FFI & PANITIA MILAD',
    tournamentName: 'Piala Bergilir MMFC I & Medali Pelajar SD/MI',
    signatory: 'M. Irfan, S.Pd (Komisioner Wasit FFI)',
    accentColor: '#10b981',
  },
];

export const CertificateTemplatesTab: React.FC = () => {
  const [templates, setTemplates] = useState<CertificateTemplate[]>(INITIAL_TEMPLATES);
  const [activeTemplate, setActiveTemplate] = useState<CertificateTemplate>(INITIAL_TEMPLATES[0]);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    issuerOrg: '',
    tournamentName: '',
    signatory: '',
    accentColor: '#1d63b8',
  });

  const handleOpenAdd = () => {
    setEditingTemplate(null);
    setFormData({
      title: '',
      category: 'Kategori Khusus / Peserta',
      issuerOrg: 'PANITIA MILAD MATSANEGA I',
      tournamentName: 'Milad Matsanega Futsal Competition I (MMFC I)',
      signatory: 'Ketua Panitia Pelaksana MMFC I',
      accentColor: '#1d63b8',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tmpl: CertificateTemplate) => {
    setEditingTemplate(tmpl);
    setFormData({
      title: tmpl.title,
      category: tmpl.category,
      issuerOrg: tmpl.issuerOrg,
      tournamentName: tmpl.tournamentName,
      signatory: tmpl.signatory,
      accentColor: tmpl.accentColor,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteTarget({ id, title });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      const remaining = templates.filter((t) => t.id !== deleteTarget.id);
      setTemplates(remaining);
      if (activeTemplate.id === deleteTarget.id && remaining.length > 0) {
        setActiveTemplate(remaining[0]);
      }
      setDeleteTarget(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplate.id ? { ...t, ...formData } : t
        )
      );
      if (activeTemplate.id === editingTemplate.id) {
        setActiveTemplate({ ...activeTemplate, ...formData });
      }
    } else {
      const newTmpl: CertificateTemplate = {
        id: `tmpl-${Date.now()}`,
        ...formData,
      };
      setTemplates((prev) => [newTmpl, ...prev]);
      setActiveTemplate(newTmpl);
    }

    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bebas text-xl sm:text-2xl uppercase tracking-wide text-[var(--text-main)]">
            Desain &amp; Template E-Sertifikat Digital
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Konfigurasi template piagam penghargaan resmi ber-QR, tanda tangan digital, dan kop instansi.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-tactile px-4 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Template Desain</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Template List with Edit/Delete */}
        <div className="space-y-3">
          <div className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Template Tersedia ({templates.length})
          </div>
          <div className="space-y-3">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => setActiveTemplate(tmpl)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer bg-[var(--bg-surface)] ${
                  activeTemplate.id === tmpl.id
                    ? 'border-[var(--color-arena-primary)] ring-2 ring-[var(--color-arena-primary)]/15 shadow-xs'
                    : 'border-[var(--border-subtle)] hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-primary)]">
                    {tmpl.category}
                  </span>
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(tmpl)}
                      title="Edit Desain"
                      className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(tmpl.id, tmpl.title)}
                      title="Hapus Desain"
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h4 className="font-bebas text-lg uppercase tracking-wide text-[var(--text-main)] truncate">
                  {tmpl.title}
                </h4>
                <p className="text-xs text-[var(--text-muted)] font-medium truncate mt-1">
                  {tmpl.signatory}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Canvas Preview */}
        <div className="lg:col-span-2">
          <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <span className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Pratinjau Desain Template Aktif
                </span>
                <h3 className="font-bebas text-xl sm:text-2xl uppercase tracking-wide text-[var(--text-main)] mt-0.5">
                  {activeTemplate.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => alert(`Mengunduh sampel PDF untuk: ${activeTemplate.title}`)}
                className="btn-tactile inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Sampel PDF</span>
              </button>
            </div>

            {/* Official Certificate Border Frame */}
            <div className="p-8 sm:p-10 rounded-xl bg-amber-50/40 dark:bg-amber-950/10 border-2 border-dashed border-[var(--color-arena-accent)]/80 text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 text-[var(--color-arena-accent)] flex items-center justify-center mx-auto shadow-2xs">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-barlow font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  {activeTemplate.issuerOrg}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bebas text-[var(--text-main)] uppercase tracking-wide">
                  {activeTemplate.category}
                </h2>
                <div className="text-xs text-[var(--text-muted)]">
                  {activeTemplate.tournamentName}
                </div>
              </div>

              <div className="py-2">
                <span className="text-xs text-[var(--text-muted)] block">Dengan bangga dianugerahkan kepada:</span>
                <div className="text-2xl sm:text-3xl font-bebas text-[var(--text-main)] uppercase tracking-wide mt-1">
                  Nama Penerima / Kontingen
                </div>
                <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto mt-1 leading-relaxed">
                  Atas prestasi luar biasa, sportivitas tinggi, dan dedikasi penuh kehormatan dalam turnamen.
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 font-mono text-[var(--text-muted)]">
                  <QrCode className="w-4 h-4 text-[var(--color-arena-primary)]" />
                  <span>CERT-SAMPLE-QR-VERIFIED</span>
                </div>
                <div className="text-[var(--text-faint)] text-right">
                  <div>Tertanda Komisioner:</div>
                  <strong className="text-[var(--text-main)] font-semibold">{activeTemplate.signatory}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal CRUD (Create & Update) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-bebas text-xl uppercase tracking-wide text-[var(--text-main)]">
                {editingTemplate ? 'Edit Template Desain' : 'Buat Template Desain Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Judul Template
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Piagam Juara Futsal Putra"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
                />
              </div>

              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Kategori Penghargaan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Juara 1 / Top Scorer / Best Supporter"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
                />
              </div>

              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Kop Lembaga / Penerbit
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PANITIA MILAD MATSANEGA I & MTsN 1 KOTA MALANG"
                  value={formData.issuerOrg}
                  onChange={(e) => setFormData({ ...formData, issuerOrg: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] uppercase font-semibold focus:outline-none focus:border-[var(--color-arena-primary)]"
                />
              </div>

              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Nama Turnamen Resmi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Milad Matsanega Futsal Competition I (MMFC I)"
                  value={formData.tournamentName}
                  onChange={(e) => setFormData({ ...formData, tournamentName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
                />
              </div>

              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Pejabat Penandatangan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dra. Hj. Erni Qomariyah, M.Pd (Kepala MTsN 1 Malang)"
                  value={formData.signatory}
                  onChange={(e) => setFormData({ ...formData, signatory: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white font-barlow font-bold uppercase tracking-wider text-xs shadow-xs"
                >
                  {editingTemplate ? 'Simpan Perubahan' : 'Simpan Template'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-tactile px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider"
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
        title="Hapus Template Desain"
        message={`Apakah Anda yakin ingin menghapus template desain "${deleteTarget?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Template"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
