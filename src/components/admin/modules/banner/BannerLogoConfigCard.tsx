'use client';

import React, { useRef } from 'react';
import {
  Image as ImageIcon,
  Sliders,
  MoveHorizontal,
  Upload,
  RotateCcw,
  Eye,
  Check,
} from 'lucide-react';
import { PublicHeaderConfig } from '@/types';

interface BannerLogoConfigCardProps {
  activeDraft: PublicHeaderConfig;
  updateActiveDraft: (patch: Partial<PublicHeaderConfig>) => void;
}

export const BannerLogoConfigCard: React.FC<BannerLogoConfigCardProps> = ({
  activeDraft,
  updateActiveDraft,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentLogo = activeDraft.logoUrl || '/brand/matsanega-futsal-logo.png';
  const currentSize = activeDraft.logoSize ?? 260;
  const currentOffset = activeDraft.logoOffsetX ?? -40;
  const isVisible = activeDraft.logoVisible !== false;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateActiveDraft({ logoUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetDefaultLogo = () => {
    updateActiveDraft({
      logoUrl: '/brand/matsanega-futsal-logo.png',
      logoSize: 260,
      logoOffsetX: -40,
      logoVisible: true,
    });
  };

  return (
    <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5 shadow-xs text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div>
          <h4 className="font-barlow font-bold text-xs uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--color-arena-primary)]" />
            <span>Pengaturan Logo Banner ({activeDraft.sportLabel || 'Cabor'})</span>
          </h4>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            Atur ukuran logo, geser posisi horizontal ke kiri/kanan, atau ganti dengan logo transparan lainnya.
          </p>
        </div>

        {/* Toggle Tampilkan Logo */}
        <label className="flex items-center gap-2 cursor-pointer shrink-0 select-none">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(e) => updateActiveDraft({ logoVisible: e.target.checked })}
            className="w-4 h-4 rounded text-[var(--color-arena-primary)] focus:ring-[var(--color-arena-primary)]"
          />
          <span className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)]">
            Tampilkan Logo
          </span>
        </label>
      </div>

      {isVisible && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Kolom Kiri: Live Preview Logo Box */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3 relative overflow-hidden">
            <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Eye className="w-3 h-3 text-[var(--color-arena-accent)]" />
              <span>Pratinjau Logo</span>
            </div>

            <div className="relative py-4 group">
              <div
                className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl pointer-events-none"
                aria-hidden="true"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentLogo}
                alt="Logo Preview"
                style={{
                  width: `${Math.min(currentSize, 180)}px`,
                  height: `${Math.min(currentSize, 180)}px`,
                }}
                className="relative z-10 object-contain aspect-square drop-shadow-md mx-auto transition-transform"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono text-slate-300">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                Ukuran: <strong className="text-white">{currentSize}px</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                Posisi: <strong className="text-[var(--color-arena-accent)]">{currentOffset}px</strong>
              </span>
            </div>
          </div>

          {/* Kolom Kanan: Pengaturan Ukuran, Posisi, & Upload */}
          <div className="lg:col-span-8 space-y-4">
            {/* 1. Pengaturan Ukuran Logo */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between font-bold text-[var(--text-main)]">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
                  <span>Ukuran Logo (Besar / Kecil)</span>
                </span>
                <span className="font-mono text-sm text-[var(--color-arena-primary)] font-bold">
                  {currentSize} px
                </span>
              </div>

              <input
                type="range"
                min="140"
                max="360"
                step="10"
                value={currentSize}
                onChange={(e) => updateActiveDraft({ logoSize: parseInt(e.target.value, 10) })}
                className="w-full h-2 rounded-lg bg-[var(--bg-muted)] cursor-pointer accent-[var(--color-arena-primary)]"
              />

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-[var(--text-muted)] font-semibold mr-1">Preset:</span>
                {[
                  { label: 'Kecil', val: 180 },
                  { label: 'Sedang', val: 220 },
                  { label: 'Besar (Standar)', val: 260 },
                  { label: 'Ekstra Besar', val: 320 },
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => updateActiveDraft({ logoSize: p.val })}
                    className={`btn-tactile px-2.5 py-1 rounded-lg text-[10px] font-barlow font-bold uppercase tracking-wider ${
                      currentSize === p.val
                        ? 'bg-[var(--color-arena-primary)] text-white shadow-2xs'
                        : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Pengaturan Posisi Horizontal (Geser Kiri / Kanan) */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between font-bold text-[var(--text-main)]">
                <span className="flex items-center gap-1.5">
                  <MoveHorizontal className="w-3.5 h-3.5 text-[var(--color-arena-accent)]" />
                  <span>Posisi Geser Horizontal (Kiri / Kanan)</span>
                </span>
                <span className="font-mono text-xs text-[var(--color-arena-accent)] font-bold">
                  {currentOffset < 0 ? `${Math.abs(currentOffset)}px ke kiri` : currentOffset === 0 ? 'Tepi Kanan (0px)' : `${currentOffset}px ke kanan`}
                </span>
              </div>

              <input
                type="range"
                min="-120"
                max="40"
                step="5"
                value={currentOffset}
                onChange={(e) => updateActiveDraft({ logoOffsetX: parseInt(e.target.value, 10) })}
                className="w-full h-2 rounded-lg bg-[var(--bg-muted)] cursor-pointer accent-[var(--color-arena-accent)]"
              />

              <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)] px-0.5">
                <span>← Lebih ke Kiri (-120px)</span>
                <span>Tepi Kanan (0px) →</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-[var(--text-muted)] font-semibold mr-1">Preset:</span>
                {[
                  { label: 'Tepi Kanan (0px)', val: 0 },
                  { label: 'Agak Kiri (-40px)', val: -40 },
                  { label: 'Lebih Kiri (-70px)', val: -70 },
                  { label: 'Maksimal Kiri (-100px)', val: -100 },
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => updateActiveDraft({ logoOffsetX: p.val })}
                    className={`btn-tactile px-2.5 py-1 rounded-lg text-[10px] font-barlow font-bold uppercase tracking-wider ${
                      currentOffset === p.val
                        ? 'bg-[var(--color-arena-accent)] text-slate-950 shadow-2xs font-extrabold'
                        : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Upload & Ganti Gambar Logo */}
            <div className="space-y-2">
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block">
                Sumber Berkas Logo (Transparan / PNG / SVG)
              </label>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png,image/svg+xml,image/webp"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-tactile flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)]"
                >
                  <Upload className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
                  <span>Unggah Logo PNG/SVG Baru</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDefaultLogo}
                  className="btn-tactile flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-muted)]/60 hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider text-[11px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Kembalikan Logo Matsanega Asli</span>
                </button>
              </div>

              <div className="pt-1">
                <input
                  type="text"
                  placeholder="Atau masukkan URL gambar logo: https://..."
                  value={activeDraft.logoUrl || ''}
                  onChange={(e) => updateActiveDraft({ logoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 text-[var(--text-main)] font-mono text-xs focus:outline-none focus:border-[var(--color-arena-primary)]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
