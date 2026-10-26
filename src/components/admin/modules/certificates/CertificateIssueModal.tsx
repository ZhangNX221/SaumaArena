'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { IssuedCertificate } from './CertificateDistributionTab';
import { ModalPortal } from '@/components/common/ModalPortal';

export interface CertificateFormData {
  recipientName: string;
  contingent: string;
  awardTitle: string;
  issueDate: string;
  status: 'SENT' | 'READY';
}

interface CertificateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CertificateFormData) => void;
  editingCert: IssuedCertificate | null;
}

export const CertificateIssueModal: React.FC<CertificateIssueModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingCert,
}) => {
  const [formData, setFormData] = useState<CertificateFormData>({
    recipientName: '',
    contingent: 'MIN 1 Kota',
    awardTitle: 'Juara 1 Futsal Pelajar SD/MI',
    issueDate: '28 Okt 2026',
    status: 'READY',
  });

  useEffect(() => {
    if (editingCert) {
      setFormData({
        recipientName: editingCert.recipientName,
        contingent: editingCert.contingent,
        awardTitle: editingCert.awardTitle,
        issueDate: editingCert.issueDate,
        status: editingCert.status,
      });
    } else {
      setFormData({
        recipientName: '',
        contingent: 'MIN 1 Kota',
        awardTitle: 'Juara 1 Futsal Pelajar SD/MI',
        issueDate: '28 Okt 2026',
        status: 'READY',
      });
    }
  }, [editingCert, isOpen]);

  // Keyboard accessibility: Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientName.trim()) return;
    onSubmit(formData);
  };

  return (
    <ModalPortal>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cert-modal-title"
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
          <h3 id="cert-modal-title" className="font-bebas text-xl uppercase tracking-wide text-[var(--text-main)]">
            {editingCert ? 'Edit Data Sertifikat' : 'Terbitkan Sertifikat Baru'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela"
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
              Nama Lengkap Penerima
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Muhammad Faiz / MIN 1 Kota"
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
            />
          </div>

          <div>
            <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
              Kontingen / Sekolah Asal
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: MIN 1 Kota Malang"
              value={formData.contingent}
              onChange={(e) => setFormData({ ...formData, contingent: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
            />
          </div>

          <div>
            <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
              Gelar / Kategori Penghargaan
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Juara 1 Futsal Pelajar Putra"
              value={formData.awardTitle}
              onChange={(e) => setFormData({ ...formData, awardTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                Tanggal Terbit
              </label>
              <input
                type="text"
                required
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono tabular-nums focus:outline-none focus:border-[var(--color-arena-primary)]"
              />
            </div>
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                Status Distribusi
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'SENT' | 'READY' })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider focus:outline-none focus:border-[var(--color-arena-primary)]"
              >
                <option value="READY">Siap Terbit</option>
                <option value="SENT">Terkirim ke Email</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="submit"
              className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white font-barlow font-bold uppercase tracking-wider text-xs shadow-xs"
            >
              {editingCert ? 'Simpan Perubahan' : 'Terbitkan Sertifikat'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-tactile px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  </ModalPortal>
  );
};
