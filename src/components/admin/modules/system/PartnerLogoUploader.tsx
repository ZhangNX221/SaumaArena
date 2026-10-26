'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Trash2,
  CheckCircle2,
  Link as LinkIcon,
} from 'lucide-react';
import { PartnerIconType } from '@/types';

export interface PartnerLogoUploaderProps {
  iconType?: PartnerIconType;
  setIconType?: (type: PartnerIconType) => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
}

export const PartnerLogoUploader: React.FC<PartnerLogoUploaderProps> = ({
  setIconType,
  logoUrl,
  setLogoUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const processFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (PNG, JPG, WebP, SVG).');
      return;
    }

    // Handle SVG directly
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl((e.target?.result as string) || '');
        setIconType?.('custom');
      };
      reader.readAsDataURL(file);
      return;
    }

    // Resize raster images to max 400px using canvas for lightweight local storage
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 400;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setLogoUrl(canvas.toDataURL('image/png'));
        } else {
          setLogoUrl((e.target?.result as string) || '');
        }
        setIconType?.('custom');
      };
      img.src = (e.target?.result as string) || '';
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIconType?.('custom');
  };

  const hasUploadedLogo = Boolean(logoUrl && logoUrl.trim());

  return (
    <div className="space-y-2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload logo mitra"
      />

      <div className="flex items-center justify-between">
        <label className="block font-bold text-[var(--text-main)] text-xs">
          Logo Mitra <span className="text-[10px] text-[var(--text-muted)] font-normal">(Opsional)</span>
        </label>
        {hasUploadedLogo && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3 h-3" />
            Logo Aktif
          </span>
        )}
      </div>

      {hasUploadedLogo ? (
        /* Tampilan jika sudah ada logo */
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)]">
          <div className="w-11 h-11 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shrink-0 shadow-2xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Logo Mitra"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-[var(--text-main)] truncate">
              Logo Tersimpan
            </div>
            <div className="text-[10px] text-[var(--text-muted)] truncate">
              Format siap ditampilkan pada kartu mitra publik
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-tactile px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition-colors flex items-center gap-1"
            >
              <Upload className="w-3 h-3" />
              Ganti
            </button>
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="btn-tactile p-1.5 rounded-lg border border-red-500/20 text-red-600 hover:bg-red-500/10 transition-colors"
              title="Hapus logo"
              aria-label="Hapus logo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Tampilan ringkas & minimal jika belum ada logo */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-xl border border-dashed p-3 text-center transition-all flex items-center justify-center gap-2.5 ${
            isDragging
              ? 'border-[var(--color-arena-primary)] bg-[var(--color-arena-primary)]/10 scale-[0.99]'
              : 'border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)] bg-[var(--bg-muted)]/40 hover:bg-[var(--bg-muted)]'
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] flex items-center justify-center shrink-0">
            <Upload className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <div className="font-bold text-[11px] text-[var(--text-main)]">
              Pilih file logo atau seret ke sini
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">
              PNG, JPG, WebP, SVG (Maks. 2MB)
            </div>
          </div>
        </div>
      )}

      {/* Opsi URL gambar langsung */}
      <div className="flex items-center justify-between text-[10px] pt-0.5">
        <button
          type="button"
          onClick={() => setShowUrlInput((prev) => !prev)}
          className="text-[var(--color-arena-primary)] hover:underline flex items-center gap-1 font-semibold"
        >
          <LinkIcon className="w-2.5 h-2.5" />
          <span>{showUrlInput ? 'Tutup input URL' : 'Atau gunakan tautan URL web'}</span>
        </button>
        {hasUploadedLogo && (
          <button
            type="button"
            onClick={handleRemoveLogo}
            className="text-red-500 hover:underline"
          >
            Hapus Logo
          </button>
        )}
      </div>

      {showUrlInput && (
        <div className="pt-1">
          <input
            type="url"
            value={logoUrl}
            onChange={(e) => {
              setLogoUrl(e.target.value);
              setIconType?.('custom');
            }}
            placeholder="https://example.com/logo.png"
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
          />
        </div>
      )}
    </div>
  );
};
