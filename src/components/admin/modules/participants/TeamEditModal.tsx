'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { OFFICIAL_PRESET_LOGOS } from '@/mocks/teamLogos';
import { Team } from '@/types';
import { ModalPortal } from '@/components/common/ModalPortal';

export interface TeamFormData {
  name: string;
  schoolName: string;
  city: string;
  coachName: string;
  group: 'A' | 'B' | 'C' | 'D';
  rosterCount: number;
  logoUrl: string;
}

interface TeamEditModalProps {
  isOpen: boolean;
  editingTeam: Team | null;
  onClose: () => void;
  onSave: (data: TeamFormData) => void;
}

export const TeamEditModal: React.FC<TeamEditModalProps> = ({
  isOpen,
  editingTeam,
  onClose,
  onSave,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<TeamFormData>({
    name: '',
    schoolName: '',
    city: 'Blitar',
    coachName: '',
    group: 'A',
    rosterCount: 12,
    logoUrl: '',
  });

  useEffect(() => {
    if (editingTeam) {
      setFormData({
        name: editingTeam.name,
        schoolName: editingTeam.schoolName,
        city: editingTeam.city,
        coachName: editingTeam.coachName,
        group: (editingTeam.group as 'A' | 'B' | 'C' | 'D') || 'A',
        rosterCount: editingTeam.players.length || 12,
        logoUrl: editingTeam.logoUrl || '',
      });
    } else {
      setFormData({
        name: '',
        schoolName: '',
        city: 'Blitar',
        coachName: '',
        group: 'A',
        rosterCount: 12,
        logoUrl: OFFICIAL_PRESET_LOGOS[0]?.url || '',
      });
    }
  }, [editingTeam, isOpen]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file logo maksimal 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setFormData((prev) => ({ ...prev, logoUrl: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.schoolName.trim()) return;
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <h3 className="font-bebas text-xl uppercase tracking-wide text-[var(--text-main)]">
              {editingTeam ? 'Edit Data Kontingen Tim' : 'Tambah Kontingen Tim Baru'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Upload & Pilih Logo Tim */}
            <div className="p-3 rounded-xl bg-[var(--bg-muted)]/70 border border-[var(--border-subtle)] space-y-2">
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block">
                Logo Resmi Kontingen / Tim
              </label>
              <div className="flex items-center gap-3.5">
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-[var(--border-subtle)] bg-transparent flex items-center justify-center overflow-hidden shrink-0">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt="Preview Logo"
                      className="w-full h-full object-contain filter drop-shadow-xs p-1"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-[var(--text-faint)]" />
                  )}
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-tactile px-3 py-1.5 rounded-lg bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white font-barlow font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File Logo</span>
                    </button>
                    {formData.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, logoUrl: '' }))}
                        className="px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-red-500 text-[11px] font-semibold transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Dropdown pilihan logo resmi dari src/Logo */}
                  <select
                    value={OFFICIAL_PRESET_LOGOS.some((l) => l.url === formData.logoUrl) ? formData.logoUrl : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        setFormData((prev) => ({ ...prev, logoUrl: e.target.value }));
                      }
                    }}
                    className="w-full px-2.5 py-1.5 text-[11px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] font-medium"
                  >
                    <option value="">-- Atau Pilih Logo Turnamen (src/Logo) --</option>
                    {OFFICIAL_PRESET_LOGOS.map((preset) => (
                      <option key={preset.url} value={preset.url}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                Nama Kontingen / Sekolah
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: MIN 1 Kota Blitar"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
              />
            </div>

            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                Nama Tim / Klub
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: SDI KARDINA MASSA"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Kota / Kabupaten
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>
              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Plotting Grup
                </label>
                <select
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value as 'A' | 'B' | 'C' | 'D' })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-barlow font-bold uppercase text-xs"
                >
                  <option value="A">Grup A</option>
                  <option value="B">Grup B</option>
                  <option value="C">Grup C</option>
                  <option value="D">Grup D</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Pelatih Kepala
                </label>
                <input
                  type="text"
                  required
                  value={formData.coachName}
                  onChange={(e) => setFormData({ ...formData, coachName: e.target.value })}
                  placeholder="Nama Pelatih"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>
              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Kapasitas Roster
                </label>
                <input
                  type="number"
                  min="3"
                  max="30"
                  value={formData.rosterCount}
                  onChange={(e) => setFormData({ ...formData, rosterCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-teko font-bold text-base"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="submit"
                className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white font-barlow font-bold uppercase tracking-wider text-xs"
              >
                {editingTeam ? 'Simpan Perubahan' : 'Tambahkan Tim'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-tactile px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider"
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

