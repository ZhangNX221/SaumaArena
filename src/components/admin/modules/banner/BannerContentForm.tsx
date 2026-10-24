'use client';

import React from 'react';
import { Layers, Trash2 } from 'lucide-react';
import { PublicHeaderConfig } from '@/types';

interface BannerContentFormProps {
  activeDraft: PublicHeaderConfig;
  updateActiveDraft: (patch: Partial<PublicHeaderConfig>) => void;
  canDelete: boolean;
  onDelete: () => void;
  onSave: () => void;
}

export const BannerContentForm: React.FC<BannerContentFormProps> = ({
  activeDraft,
  updateActiveDraft,
  canDelete,
  onDelete,
  onSave,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <h4 className="font-barlow font-bold text-xs uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--color-arena-accent)]" />
          <span>Informasi &amp; Teks Cabor: {activeDraft.sportLabel}</span>
        </h4>

        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="btn-tactile text-red-600 hover:text-red-700 flex items-center gap-1 font-barlow font-bold uppercase tracking-wider text-[11px]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Cabor Ini</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Label Tab Cabor (Singkat)</label>
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
          onClick={onSave}
          className="btn-tactile px-5 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold uppercase tracking-wider text-xs hover:bg-[var(--color-arena-primary-hover)] shadow-xs"
        >
          Terapkan &amp; Simpan ke Halaman Publik
        </button>
      </div>
    </div>
  );
};
