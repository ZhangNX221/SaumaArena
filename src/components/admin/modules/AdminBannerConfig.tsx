'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Save,
  Sliders,
  Eye,
  Plus,
  Trash2,
  Trophy,
} from 'lucide-react';
import { PublicHeaderConfig, SportCode } from '@/types';
import { BANNER_PRESETS, DEFAULT_CABOR_BANNERS, DEFAULT_HEADER_CONFIG } from '@/mocks/headerConfig';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';

interface AdminBannerConfigProps {
  banners?: PublicHeaderConfig[];
  onSaveBanners?: (updated: PublicHeaderConfig[]) => void;
  config?: PublicHeaderConfig;
  onSaveConfig?: (updated: PublicHeaderConfig) => void;
}

const TEMPLATE_CABOR: Array<{
  sportCode: SportCode;
  sportLabel: string;
  title: string;
  categoryBadge: string;
  description: string;
  presetIndex: number;
  venue: string;
  contingentInfo: string;
}> = [
  {
    sportCode: 'BASKET',
    sportLabel: 'Bola Basket',
    title: 'Matsanega Basketball Challenge 2026',
    categoryBadge: 'BASKETBALL 5v5 PELAJAR',
    description: 'Kompetisi bola basket antarpelajar tingkat SD/MI & SMP se-derajat. Menampilkan skill dribbling, 3-point shoot, dan pertahanan solid.',
    presetIndex: 2,
    venue: 'Matsanega Indoor Basketball Court',
    contingentInfo: '8 Tim Kontingen Basket',
  },
  {
    sportCode: 'BADMINTON',
    sportLabel: 'Bulutangkis',
    title: 'Matsanega Badminton Junior Open 2026',
    categoryBadge: 'BULUTANGKIS TUNGGAL & GANDA',
    description: 'Turnamen bulutangkis junior memperebutkan Piala Bergilir Kepala Madrasah. Reli-reli sengit dan smash menyilang di lapangan standar PBSI.',
    presetIndex: 2,
    venue: 'GOR Bulutangkis Matsanega',
    contingentInfo: '16 Kontingen Atlet Bulutangkis',
  },
  {
    sportCode: 'SEPAK_TAKRAW',
    sportLabel: 'Sepak Takraw',
    title: 'Matsanega Takraw Invitation Cup 2026',
    categoryBadge: 'SEPAK TAKRAW INTER-REGU PELAJAR',
    description: 'Adu kelincahan akrobatik, smash roll, dan kontrol bola rotan antarsekolah dasar dan madrasah se-Jawa Timur.',
    presetIndex: 0,
    venue: 'Lapangan Outdoor Matsanega',
    contingentInfo: '8 Regu Kontingen Takraw',
  },
];

export const AdminBannerConfig: React.FC<AdminBannerConfigProps> = ({
  banners,
  onSaveBanners,
  config,
  onSaveConfig,
}) => {
  const [bannerList, setBannerList] = useState<PublicHeaderConfig[]>(
    banners && banners.length > 0 ? banners : DEFAULT_CABOR_BANNERS
  );
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const activeDraft = bannerList[selectedIdx] || bannerList[0] || (config || DEFAULT_HEADER_CONFIG);

  const updateActiveDraft = (patch: Partial<PublicHeaderConfig>) => {
    setBannerList((prev) => {
      const next = [...prev];
      if (next[selectedIdx]) {
        next[selectedIdx] = { ...next[selectedIdx], ...patch };
      }
      return next;
    });
  };

  const handleSave = () => {
    if (onSaveBanners) {
      onSaveBanners(bannerList);
    }
    if (onSaveConfig && bannerList[selectedIdx]) {
      onSaveConfig(bannerList[selectedIdx]);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetToDefault = () => {
    setBannerList(DEFAULT_CABOR_BANNERS);
    setSelectedIdx(0);
    if (onSaveBanners) onSaveBanners(DEFAULT_CABOR_BANNERS);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDeleteCurrent = () => {
    if (bannerList.length <= 1) {
      alert('Minimal harus ada 1 banner cabor yang aktif.');
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCurrent = () => {
    const next = bannerList.filter((_, i) => i !== selectedIdx);
    setBannerList(next);
    setSelectedIdx(0);
    if (onSaveBanners) onSaveBanners(next);
    setIsDeleteModalOpen(false);
  };

  const handleAddTemplate = (tpl: typeof TEMPLATE_CABOR[0]) => {
    const newBanner: PublicHeaderConfig = {
      id: `banner-${Date.now()}`,
      sportCode: tpl.sportCode,
      sportLabel: tpl.sportLabel,
      bannerImageUrl: BANNER_PRESETS[tpl.presetIndex]?.url || BANNER_PRESETS[0].url,
      bannerOverlayOpacity: 0.85,
      statusBadge: 'SEGERA DIBUKA',
      categoryBadge: tpl.categoryBadge,
      organizer: 'Penyelenggara: Panitia Milad Matsanega',
      title: tpl.title,
      description: tpl.description,
      dates: '08 - 12 November 2026',
      venue: tpl.venue,
      contingentInfo: tpl.contingentInfo,
      ticketButtonText: 'Ambil Tiket',
      registerButtonText: 'Daftar Kontingen',
    };

    const next = [...bannerList, newBanner];
    setBannerList(next);
    setSelectedIdx(next.length - 1);
    setIsAddingNew(false);
    if (onSaveBanners) onSaveBanners(next);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-xs">
      {/* Top Banner Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
        <div>
          <h3 className="font-black text-sm text-[var(--text-main)] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--color-arena-primary)]" />
            <span>Kustomisasi Multi-Banner Cabor (Slider Publik)</span>
          </h3>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            Kelola banner untuk setiap cabang olahraga (Futsal, Voli, E-Sport, dll.). Ketika pengunjung menggeser banner di beranda, seluruh informasi di bawahnya otomatis menyesuaikan.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-muted)]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standar</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-tactile flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[var(--color-arena-primary)] text-white text-xs font-bold hover:bg-[var(--color-arena-primary-hover)] shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Semua Cabor</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pengaturan banner seluruh cabor berhasil disimpan dan disinkronkan ke beranda publik!</span>
        </div>
      )}

      {/* Cabor Tabs Selector */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[var(--text-main)] uppercase tracking-wider text-[11px]">
            Daftar Banner Cabor Aktif ({bannerList.length})
          </span>
          <button
            type="button"
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="btn-tactile flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--color-arena-accent)] text-slate-950 font-bold text-[11px] shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Banner Cabor</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {bannerList.map((b, idx) => {
            const isCurrent = idx === selectedIdx;
            return (
              <button
                key={b.id || idx}
                type="button"
                onClick={() => {
                  setSelectedIdx(idx);
                  setIsAddingNew(false);
                }}
                className={`btn-tactile px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isCurrent
                    ? 'bg-[var(--color-arena-primary)] text-white shadow-xs ring-2 ring-[var(--color-arena-primary)]/30'
                    : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <span>{b.sportLabel || `Cabor ${idx + 1}`}</span>
                <span className="text-[10px] opacity-75">({b.dates.split('-')[0].trim()})</span>
              </button>
            );
          })}
        </div>

        {/* Add New Cabor Template Options */}
        {isAddingNew && (
          <div className="p-4 rounded-xl bg-[var(--bg-muted)]/70 border border-[var(--border-subtle)] space-y-3 animate-fadeIn">
            <h4 className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[var(--color-arena-accent)]" />
              <span>Pilih Template Cabor Baru:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TEMPLATE_CABOR.map((tpl) => (
                <button
                  key={tpl.sportCode}
                  type="button"
                  onClick={() => handleAddTemplate(tpl)}
                  className="btn-tactile p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--color-arena-primary)] text-left space-y-1 transition-all"
                >
                  <div className="font-bold text-[var(--text-main)]">{tpl.sportLabel}</div>
                  <div className="text-[10px] text-[var(--text-muted)] line-clamp-2">
                    {tpl.title}
                  </div>
                  <div className="text-[9px] text-[var(--color-arena-primary)] font-bold pt-1">
                    + Tambahkan Sekarang
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Preview of Selected Cabor Banner */}
      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
          <span>Pratinjau Banner Publik: {activeDraft.sportLabel}</span>
        </label>
        <div className="relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] p-6 sm:p-8 text-white min-h-[220px] flex flex-col justify-between shadow-md">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-300"
            style={{ backgroundImage: `url('${activeDraft.bannerImageUrl}')` }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#0b1a28] via-[#0b1a28]/95 to-[#0b1a28]/80 transition-opacity"
            style={{ opacity: activeDraft.bannerOverlayOpacity }}
          />
          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded bg-[var(--color-arena-primary)]/40 text-sky-200 font-bold border border-[var(--color-arena-primary)]/50">
                {activeDraft.statusBadge}
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-slate-200 font-semibold border border-white/15">
                {activeDraft.categoryBadge}
              </span>
              <span className="text-[11px] text-slate-300 ml-auto">
                {activeDraft.organizer}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-[var(--font-display)] leading-tight text-white max-w-2xl">
              {activeDraft.title}
            </h2>
            <p className="text-xs text-slate-300 line-clamp-2 max-w-xl">
              {activeDraft.description}
            </p>
          </div>
          <div className="relative z-10 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-white/15 text-slate-200">
            <div className="flex gap-4">
              <span>📅 {activeDraft.dates}</span>
              <span>📍 {activeDraft.venue}</span>
              <span>🏆 {activeDraft.contingentInfo}</span>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-lg bg-[var(--color-arena-primary)] font-bold text-xs">{activeDraft.ticketButtonText}</span>
              <span className="px-3 py-1 rounded-lg bg-white/10 text-xs">{activeDraft.registerButtonText}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Banner Backgrounds */}
      <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[var(--color-arena-primary)]" />
          <span>Latar Gambar untuk Cabor: {activeDraft.sportLabel}</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BANNER_PRESETS.map((preset) => {
            const isSelected = activeDraft.bannerImageUrl === preset.url;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => updateActiveDraft({ bannerImageUrl: preset.url })}
                className={`btn-tactile rounded-xl overflow-hidden border text-left p-1.5 transition-all ${
                  isSelected
                    ? 'border-[var(--color-arena-primary)] ring-2 ring-[var(--color-arena-primary)]/30'
                    : 'border-[var(--border-subtle)] hover:border-slate-400 bg-[var(--bg-muted)]/40'
                }`}
              >
                <div
                  className="h-20 w-full rounded-lg bg-cover bg-center mb-1.5"
                  style={{ backgroundImage: `url('${preset.previewThumbnail}')` }}
                />
                <div className="text-[11px] font-bold text-[var(--text-main)] truncate px-0.5">
                  {preset.name}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] px-0.5">{preset.category}</div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
          <div className="md:col-span-8 space-y-1">
            <label className="font-bold text-[var(--text-main)] block">URL Gambar Latar Kustom</label>
            <input
              type="url"
              value={activeDraft.bannerImageUrl}
              onChange={(e) => updateActiveDraft({ bannerImageUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 text-[var(--text-main)] font-mono text-xs focus:outline-none focus:border-[var(--color-arena-primary)]"
            />
          </div>

          <div className="md:col-span-4 space-y-1">
            <div className="flex items-center justify-between font-bold text-[var(--text-main)]">
              <span>Kepekatan Gelap (Overlay):</span>
              <span className="font-mono text-[var(--color-arena-primary)]">
                {Math.round(activeDraft.bannerOverlayOpacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.95"
              step="0.05"
              value={activeDraft.bannerOverlayOpacity}
              onChange={(e) => updateActiveDraft({ bannerOverlayOpacity: parseFloat(e.target.value) })}
              className="w-full h-2 rounded-lg bg-[var(--bg-muted)] cursor-pointer accent-[var(--color-arena-primary)]"
            />
          </div>
        </div>
      </div>

      {/* Form Edit Konten Cabor */}
      <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <h4 className="font-black text-xs uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--color-arena-accent)]" />
            <span>Informasi &amp; Teks Cabor: {activeDraft.sportLabel}</span>
          </h4>

          {bannerList.length > 1 && (
            <button
              type="button"
              onClick={handleDeleteCurrent}
              className="btn-tactile text-red-600 hover:text-red-700 flex items-center gap-1 font-bold text-[11px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Cabor Ini</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-[var(--text-main)] block mb-1">Label Tab Cabor (Singkat)</label>
            <input
              type="text"
              value={activeDraft.sportLabel}
              onChange={(e) => updateActiveDraft({ sportLabel: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 text-[var(--text-main)] font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-[var(--text-main)] block mb-1">Status Badge (Kiri)</label>
            <input
              type="text"
              value={activeDraft.statusBadge}
              onChange={(e) => updateActiveDraft({ statusBadge: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 text-[var(--text-main)] font-semibold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-[var(--text-main)] block mb-1">Kategori / Badge Detail</label>
            <input
              type="text"
              value={activeDraft.categoryBadge}
              onChange={(e) => updateActiveDraft({ categoryBadge: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 text-[var(--text-main)] font-semibold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-[var(--text-main)] block mb-1">Penyelenggara Resmi</label>
            <input
              type="text"
              value={activeDraft.organizer}
              onChange={(e) => updateActiveDraft({ organizer: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 text-[var(--text-main)]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-[var(--text-main)] block mb-1">Judul Utama Turnamen Cabor</label>
            <input
              type="text"
              value={activeDraft.title}
              onChange={(e) => updateActiveDraft({ title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 text-[var(--text-main)] font-bold text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-[var(--text-main)] block mb-1">Deskripsi Turnamen Cabor</label>
            <textarea
              rows={2}
              value={activeDraft.description}
              onChange={(e) => updateActiveDraft({ description: e.target.value })}
              className="w-full p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 text-[var(--text-main)] leading-relaxed"
            />
          </div>

          <div>
            <label className="font-bold text-[var(--text-main)] block mb-1">Tanggal Pelaksanaan</label>
            <input
              type="text"
              value={activeDraft.dates}
              onChange={(e) => updateActiveDraft({ dates: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 text-[var(--text-main)]"
            />
          </div>

          <div>
            <label className="font-bold text-[var(--text-main)] block mb-1">Lokasi Gedung / Lapangan</label>
            <input
              type="text"
              value={activeDraft.venue}
              onChange={(e) => updateActiveDraft({ venue: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 text-[var(--text-main)]"
            />
          </div>

          <div>
            <label className="font-bold text-[var(--text-main)] block mb-1">Keterangan Kuota Tim</label>
            <input
              type="text"
              value={activeDraft.contingentInfo}
              onChange={(e) => updateActiveDraft({ contingentInfo: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 text-[var(--text-main)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-[var(--text-main)] block mb-1">Teks Tombol Tiket</label>
              <input
                type="text"
                value={activeDraft.ticketButtonText}
                onChange={(e) => updateActiveDraft({ ticketButtonText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 text-[var(--text-main)]"
              />
            </div>
            <div>
              <label className="font-bold text-[var(--text-main)] block mb-1">Teks Tombol Registrasi</label>
              <input
                type="text"
                value={activeDraft.registerButtonText}
                onChange={(e) => updateActiveDraft({ registerButtonText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 text-[var(--text-main)]"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="btn-tactile px-5 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-bold text-xs hover:bg-[var(--color-arena-primary-hover)] shadow-xs"
          >
            Terapkan &amp; Simpan ke Halaman Publik
          </button>
        </div>
      </div>

      {/* Reusable Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Hapus Banner Cabor"
        message={`Apakah Anda yakin ingin menghapus banner cabor "${activeDraft.sportLabel || activeDraft.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Banner"
        cancelLabel="Batal"
        onConfirm={confirmDeleteCurrent}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
