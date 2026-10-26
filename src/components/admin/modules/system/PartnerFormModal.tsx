'use client';

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { ModalPortal } from '@/components/common/ModalPortal';
import { TournamentPartner, PartnerCategory, PartnerIconType } from '@/types';
import { PartnerLogoUploader } from './PartnerLogoUploader';
import { PartnerCard } from '@/components/public/PartnerCard';

interface PartnerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partner: TournamentPartner) => void;
  editingPartner: TournamentPartner | null;
  totalPartnersCount: number;
}

export const PartnerFormModal: React.FC<PartnerFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPartner,
  totalPartnersCount,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState<PartnerCategory>('SPONSOR');
  const [iconType, setIconType] = useState<PartnerIconType>('custom');
  const [logoUrl, setLogoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [description, setDescription] = useState('');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  useEffect(() => {
    if (editingPartner) {
      setName(editingPartner.name);
      setRole(editingPartner.role);
      setCategory(editingPartner.category);
      setIconType(editingPartner.iconType || 'custom');
      setLogoUrl(editingPartner.logoUrl || '');
      setWebsiteUrl(editingPartner.websiteUrl || '');
      setOrder(editingPartner.order || 1);
      setIsActive(editingPartner.isActive !== false);
      setDescription(editingPartner.description || '');
    } else {
      setName('');
      setRole('');
      setCategory('SPONSOR');
      setIconType('custom');
      setLogoUrl('');
      setWebsiteUrl('');
      setOrder(totalPartnersCount + 1);
      setIsActive(true);
      setDescription('');
    }
    setErrorNotice(null);
  }, [editingPartner, totalPartnersCount, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorNotice('Nama mitra atau instansi wajib diisi.');
      return;
    }
    if (!role.trim()) {
      setErrorNotice('Peran atau jabatan resmi turnamen wajib diisi.');
      return;
    }

    const trimmedLogo = logoUrl.trim();
    const payload: TournamentPartner = {
      id: editingPartner ? editingPartner.id : `partner-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      category,
      iconType: trimmedLogo ? 'custom' : iconType,
      logoUrl: trimmedLogo || undefined,
      websiteUrl: websiteUrl.trim() || undefined,
      order: Number(order) || 1,
      isActive,
      description: description.trim() || undefined,
    };

    onSave(payload);
  };

  return (
    <ModalPortal>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner-modal-title"
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="w-full max-w-lg rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/50">
          <div>
            <h3 id="partner-modal-title" className="text-base font-barlow font-bold uppercase tracking-wider text-[var(--text-main)]">
              {editingPartner ? 'Edit Mitra Turnamen' : 'Tambah Mitra Baru'}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Atur institusi, federasi, atau sponsor yang ditampilkan pada kartu mitra halaman publik.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {errorNotice && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-bold">
              {errorNotice}
            </div>
          )}

          {/* Nama & Peran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[var(--text-main)] mb-1">
                Nama Mitra / Instansi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth. Bank Jatim Syariah"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--text-main)] mb-1">
                Peran Turnamen <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="cth. Mitra Perbankan & Tiket"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
              />
            </div>
          </div>

          {/* Kategori & Nomor Urutan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[var(--text-main)] mb-1">Kategori Mitra</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PartnerCategory)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
              >
                <option value="ORGANIZER">Penyelenggara Utama</option>
                <option value="GOVERNMENT">Instansi / Pembina</option>
                <option value="FEDERATION">Federasi Olahraga / Juri</option>
                <option value="SPONSOR">Sponsor &amp; Finansial</option>
                <option value="COMMUNITY">Komite / Siswa</option>
                <option value="MEDIA">Media Partner</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[var(--text-main)] mb-1">Urutan Tampilan</label>
              <input
                type="number"
                min={1}
                max={99}
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
              />
            </div>
          </div>

          {/* Atur Logo / Badge Mitra yang Diupload */}
          <PartnerLogoUploader
            iconType={iconType}
            setIconType={setIconType}
            logoUrl={logoUrl}
            setLogoUrl={setLogoUrl}
          />

          {/* Pratinjau Langsung Kartu Mitra Publik */}
          <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 space-y-1.5">
            <div className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
              <span>Pratinjau Kartu Publik</span>
              <span className="text-[9px] text-[var(--text-muted)]">Otomatis Terbarui</span>
            </div>
            <PartnerCard
              partner={{
                id: 'preview',
                name: name.trim() || 'Nama Mitra / Instansi',
                role: role.trim() || 'Peran Resmi Turnamen',
                category,
                iconType,
                logoUrl: logoUrl.trim() || undefined,
                websiteUrl: websiteUrl.trim() || undefined,
                isActive,
                order: Number(order) || 1,
              }}
              isInteractive={false}
            />
          </div>

          {/* Website / Tautan URL */}
          <div>
            <label className="block font-bold text-[var(--text-main)] mb-1">
              Tautan Website / Sosmed <span className="text-[10px] text-[var(--text-muted)] font-normal">(Opsional)</span>
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://www.nama-mitra.com"
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
            />
          </div>

          {/* Status Aktif Publik */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/60">
            <div>
              <div className="font-bold text-[var(--text-main)]">Tampilkan di Halaman Publik</div>
              <div className="text-[10px] text-[var(--text-muted)]">
                Jika dinonaktifkan, kartu mitra ini akan disembunyikan dari penonton publik.
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Deskripsi Tambahan */}
          <div>
            <label className="block font-bold text-[var(--text-main)] mb-1">
              Catatan / Deskripsi Internal <span className="text-[10px] text-[var(--text-muted)] font-normal">(Opsional)</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Catatan kerja sama, kontak person atau rincian kontribusi..."
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="btn-tactile px-4 py-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-tactile flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] text-white font-bold text-xs shadow-xs hover:bg-[var(--color-arena-primary-hover)]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editingPartner ? 'Simpan Perubahan' : 'Tambah Mitra'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </ModalPortal>
  );
};
