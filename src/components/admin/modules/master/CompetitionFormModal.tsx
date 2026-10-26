'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ModalPortal } from '@/components/common/ModalPortal';
import { CompetitionItem } from './CompetitionsManagementView';

export interface CompetitionFormModalProps {
  isOpen: boolean;
  editingComp: CompetitionItem | null;
  onClose: () => void;
  onSave: (formData: Omit<CompetitionItem, 'id' | 'registeredTeamsCount'>) => void;
}

export const CompetitionFormModal: React.FC<CompetitionFormModalProps> = ({
  isOpen,
  editingComp,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Omit<CompetitionItem, 'id' | 'registeredTeamsCount'>>({
    name: '',
    edition: 'Tahun 2026',
    sportLabel: 'Futsal',
    dates: '2026',
    venue: 'Matsanega Arena Court',
    maxTeamsCount: 16,
    status: 'OPEN_REGISTRATION',
    organizer: 'Panitia Pelaksana',
    description: '',
  });

  useEffect(() => {
    if (editingComp) {
      setFormData({
        name: editingComp.name,
        edition: editingComp.edition,
        sportLabel: editingComp.sportLabel,
        dates: editingComp.dates,
        venue: editingComp.venue,
        maxTeamsCount: editingComp.maxTeamsCount,
        status: editingComp.status,
        organizer: editingComp.organizer,
        description: editingComp.description,
      });
    } else {
      setFormData({
        name: '',
        edition: 'Tahun 2026',
        sportLabel: 'Futsal',
        dates: '2026',
        venue: 'Matsanega Arena Court',
        maxTeamsCount: 16,
        status: 'OPEN_REGISTRATION',
        organizer: 'Panitia Pelaksana',
        description: '',
      });
    }
  }, [editingComp, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <h3 className="font-bebas text-xl uppercase tracking-wide text-[var(--text-main)]">
              {editingComp ? 'Edit Detail Kompetisi' : 'Tambah Kompetisi Baru'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                Nama Kompetisi / Turnamen
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Piala Bergilir Matsanega 2026"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Edisi / Seri
                </label>
                <input
                  type="text"
                  value={formData.edition}
                  onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>
              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Cabang Olahraga
                </label>
                <input
                  type="text"
                  value={formData.sportLabel}
                  onChange={(e) => setFormData({ ...formData, sportLabel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Tanggal Pelaksanaan
                </label>
                <input
                  type="text"
                  value={formData.dates}
                  onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>
              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Status Kompetisi
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'ACTIVE' | 'OPEN_REGISTRATION' | 'UPCOMING' | 'COMPLETED',
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                >
                  <option value="ACTIVE">Sedang Berjalan (Active)</option>
                  <option value="OPEN_REGISTRATION">Pendaftaran Terbuka</option>
                  <option value="UPCOMING">Akan Datang</option>
                  <option value="COMPLETED">Selesai</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                Venue / Lapangan Utama
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
              />
            </div>

            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                Deskripsi / Keterangan
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-tactile px-4 py-2 rounded-xl border border-[var(--border-subtle)] font-barlow font-bold uppercase tracking-wider text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn-tactile px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold uppercase tracking-wider text-xs"
              >
                Simpan Kompetisi
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};
