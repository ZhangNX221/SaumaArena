'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { SportCode } from '@/types';
import { ModalPortal } from '@/components/common/ModalPortal';

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

export type RegistrationFormData = Omit<RegistrationDossier, 'id' | 'regNumber' | 'submittedAt'>;

interface RegistrationDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RegistrationFormData) => void;
  editingItem: RegistrationDossier | null;
  defaultSport?: SportCode;
}

export const RegistrationDossierModal: React.FC<RegistrationDossierModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
  defaultSport = 'ALL',
}) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    schoolName: '',
    teamName: '',
    sport: defaultSport !== 'ALL' ? defaultSport : 'FUTSAL',
    category: 'SD/MI Putra (Usia 10-12)',
    coachName: '',
    coachPhone: '',
    athleteCount: 12,
    nisnStatus: 'VALID',
    status: 'PENDING',
    rejectionReason: '',
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        schoolName: editingItem.schoolName,
        teamName: editingItem.teamName,
        sport: editingItem.sport,
        category: editingItem.category,
        coachName: editingItem.coachName,
        coachPhone: editingItem.coachPhone,
        athleteCount: editingItem.athleteCount,
        nisnStatus: editingItem.nisnStatus,
        status: editingItem.status,
        rejectionReason: editingItem.rejectionReason || '',
      });
    } else {
      setFormData({
        schoolName: '',
        teamName: '',
        sport: defaultSport !== 'ALL' ? defaultSport : 'FUTSAL',
        category: 'SD/MI Putra (Usia 10-12)',
        coachName: '',
        coachPhone: '',
        athleteCount: 12,
        nisnStatus: 'VALID',
        status: 'PENDING',
        rejectionReason: '',
      });
    }
  }, [editingItem, defaultSport, isOpen]);

  // Keyboard accessibility: Close modal on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.schoolName.trim() || !formData.teamName.trim()) return;
    onSubmit(formData);
  };

  return (
    <ModalPortal>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
          <h3 id="modal-title" className="font-bebas text-xl uppercase tracking-wide text-[var(--text-main)]">
            {editingItem ? 'Edit Status & Berkas Pendaftaran' : 'Tambah Pendaftaran Tim Baru'}
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
              Nama Sekolah / Kontingen
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: MIN 1 Kota Malang"
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
            />
          </div>

          <div>
            <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
              Nama Tim / Julukan
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Elang Matsanega"
              value={formData.teamName}
              onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                Cabang Olahraga
              </label>
              <input
                type="text"
                required
                value={formData.sport}
                onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wide focus:outline-none focus:border-[var(--color-arena-primary)]"
              />
            </div>
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                Kategori Pertandingan
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                Nama Pelatih
              </label>
              <input
                type="text"
                required
                value={formData.coachName}
                onChange={(e) => setFormData({ ...formData, coachName: e.target.value })}
                placeholder="Bram Ndolu"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
              />
            </div>
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                No. WhatsApp
              </label>
              <input
                type="text"
                required
                value={formData.coachPhone}
                onChange={(e) => setFormData({ ...formData, coachPhone: e.target.value })}
                placeholder="0812-xxxx"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--color-arena-primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                Status Verifikasi
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'APPROVED' | 'PENDING' | 'REJECTED' })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wide focus:outline-none focus:border-[var(--color-arena-primary)]"
              >
                <option value="APPROVED">Lolos Verifikasi</option>
                <option value="PENDING">Menunggu Antrean</option>
                <option value="REJECTED">Tolak / Revisi</option>
              </select>
            </div>
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                Status NISN
              </label>
              <select
                value={formData.nisnStatus}
                onChange={(e) => setFormData({ ...formData, nisnStatus: e.target.value as 'VALID' | 'NEED_REVISION' })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wide focus:outline-none focus:border-[var(--color-arena-primary)]"
              >
                <option value="VALID">NISN Sah Kemdikbud</option>
                <option value="NEED_REVISION">Perlu Perbaikan</option>
              </select>
            </div>
          </div>

          {formData.status === 'REJECTED' && (
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-red-600 block mb-1">
                Catatan Penolakan / Revisi
              </label>
              <textarea
                rows={2}
                value={formData.rejectionReason}
                onChange={(e) => setFormData({ ...formData, rejectionReason: e.target.value })}
                placeholder="Sebutkan berkas yang perlu dilengkapi..."
                className="w-full px-3 py-2 rounded-xl border border-red-500/30 bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          <div className="flex gap-2 pt-3">
            <button
              type="submit"
              className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white font-barlow font-bold uppercase tracking-wider text-xs shadow-xs"
            >
              {editingItem ? 'Simpan Perubahan' : 'Tambahkan Berkas'}
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
