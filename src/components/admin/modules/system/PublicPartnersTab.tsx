'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  RotateCcw,
  CheckCircle2,
  Eye,
  EyeOff,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { TournamentPartner } from '@/types';
import {
  getStoredPartners,
  saveStoredPartners,
  resetStoredPartners,
} from '@/mocks/partnersData';
import { PartnerFormModal } from './PartnerFormModal';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';
import { PartnerCard } from '@/components/public/PartnerCard';
import { PartnerTableRow } from './PartnerTableRow';

export const PublicPartnersTab: React.FC = () => {
  const [partners, setPartners] = useState<TournamentPartner[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<TournamentPartner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TournamentPartner | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setPartners(getStoredPartners());
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingPartner(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (partner: TournamentPartner) => {
    setEditingPartner(partner);
    setIsModalOpen(true);
  };

  const handleSavePartner = (saved: TournamentPartner) => {
    let updated: TournamentPartner[];
    const exists = partners.some((p) => p.id === saved.id);

    if (exists) {
      updated = partners.map((p) => (p.id === saved.id ? saved : p));
      triggerToast(`Mitra "${saved.name}" berhasil diperbarui.`);
    } else {
      updated = [...partners, saved];
      triggerToast(`Mitra baru "${saved.name}" berhasil ditambahkan.`);
    }

    updated.sort((a, b) => (a.order || 0) - (b.order || 0));
    setPartners(updated);
    saveStoredPartners(updated);
    setIsModalOpen(false);
    setEditingPartner(null);
  };

  const handleDeletePartner = () => {
    if (!deleteTarget) return;
    const updated = partners.filter((p) => p.id !== deleteTarget.id);
    setPartners(updated);
    saveStoredPartners(updated);
    triggerToast(`Mitra "${deleteTarget.name}" berhasil dihapus.`);
    setDeleteTarget(null);
  };

  const handleToggleActive = (id: string) => {
    const updated = partners.map((p) =>
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    setPartners(updated);
    saveStoredPartners(updated);
    const target = updated.find((p) => p.id === id);
    triggerToast(
      `Status publik ${target?.name} diubah menjadi: ${target?.isActive ? 'Aktif' : 'Disembunyikan'}.`
    );
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= partners.length) return;

    const reordered = [...partners];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    // Re-assign order sequence
    const normalized = reordered.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setPartners(normalized);
    saveStoredPartners(normalized);
    triggerToast('Urutan tampilan mitra berhasil diperbarui.');
  };

  const handleReset = () => {
    const restored = resetStoredPartners();
    setPartners(restored);
    setIsResetModalOpen(false);
    triggerToast('Daftar mitra berhasil direset ke 8 mitra resmi default.');
  };

  const filteredPartners = partners.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const activePublicPartners = partners.filter((p) => p.isActive);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Quick Action */}
      <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-barlow font-bold uppercase tracking-wide text-[var(--text-main)]">
              Mitra &amp; Penyelenggara Resmi Turnamen
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Kelola daftar institusi, federasi juri, dan sponsor resmi yang tampil pada kartu mitra di halaman publik.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowLivePreview((prev) => !prev)}
              className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                showLivePreview
                  ? 'border-[var(--color-arena-primary)] bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] dark:bg-sky-950/40 dark:text-sky-300'
                  : 'border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--bg-surface)]'
              }`}
            >
              {showLivePreview ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showLivePreview ? 'Tutup Pratinjau' : 'Lihat Pratinjau'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="btn-tactile flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--color-arena-primary)] text-white text-xs font-barlow font-bold uppercase tracking-wider shadow-xs hover:bg-[var(--color-arena-primary-hover)] shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Mitra</span>
            </button>
          </div>
        </div>

        {/* Counter Stats Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
          <div className="p-2.5 rounded-xl bg-[var(--bg-muted)]/70">
            <span className="text-[10px] text-[var(--text-muted)] block">Total Mitra</span>
            <span className="font-bebas text-lg text-[var(--text-main)]">{partners.length} Mitra</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--bg-muted)]/70">
            <span className="text-[10px] text-[var(--text-muted)] block">Tampil di Publik</span>
            <span className="font-bebas text-lg text-emerald-600 dark:text-emerald-400">
              {activePublicPartners.length} Aktif
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--bg-muted)]/70">
            <span className="text-[10px] text-[var(--text-muted)] block">Disembunyikan</span>
            <span className="font-bebas text-lg text-amber-600 dark:text-amber-400">
              {partners.length - activePublicPartners.length} Nonaktif
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--bg-muted)]/70">
            <span className="text-[10px] text-[var(--text-muted)] block">Sinkronisasi</span>
            <span className="font-barlow font-bold text-xs text-[var(--color-arena-primary)] block mt-1">
              Otomatis Real-Time
            </span>
          </div>
        </div>
      </div>

      {/* Live Preview Box */}
      {showLivePreview && (
        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-main)]">
                Pratinjau Live: Tampilan Kartu di Halaman Publik
              </h4>
            </div>
            <span className="text-[11px] text-[var(--text-muted)]">
              {activePublicPartners.length} kartu aktif terlihat oleh penonton
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-muted)]/40 border border-[var(--border-subtle)]">
            <div className="text-center mb-4">
              <span className="text-[11px] font-barlow uppercase font-bold tracking-wider text-[var(--text-faint)]">
                PENYELENGGARA &amp; MITRA RESMI TURNAMEN
              </span>
            </div>

            {activePublicPartners.length === 0 ? (
              <div className="text-center py-6 text-xs text-[var(--text-muted)]">
                Belum ada mitra yang diaktifkan. Aktifkan minimal satu mitra agar tampil di halaman publik.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {activePublicPartners.map((partner) => (
                  <PartnerCard key={partner.id} partner={partner} isInteractive={false} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Cari nama mitra atau peran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="ORGANIZER">Penyelenggara</option>
            <option value="GOVERNMENT">Instansi / Pembina</option>
            <option value="FEDERATION">Federasi Olahraga</option>
            <option value="SPONSOR">Sponsor &amp; Finansial</option>
            <option value="COMMUNITY">Komite &amp; Siswa</option>
            <option value="MEDIA">Media Partner</option>
          </select>
        </div>
      </div>

      {/* Partners List / Table */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-muted)]/70 text-[var(--text-muted)] font-barlow font-bold uppercase tracking-wider text-[11px] border-b border-[var(--border-subtle)]">
              <tr>
                <th className="py-3 px-3 w-16 text-center">Urutan</th>
                <th className="py-3 px-4">Mitra &amp; Peran Turnamen</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Tautan</th>
                <th className="py-3 px-3 text-center">Status Publik</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[var(--text-muted)] text-xs">
                    Tidak ada mitra yang sesuai dengan pencarian atau filter kategori.
                  </td>
                </tr>
              ) : (
                filteredPartners.map((partner, idx) => (
                  <PartnerTableRow
                    key={partner.id}
                    partner={partner}
                    index={idx}
                    totalCount={partners.length}
                    onMoveOrder={handleMoveOrder}
                    onToggleActive={handleToggleActive}
                    onOpenEdit={handleOpenEdit}
                    onDelete={(p) => setDeleteTarget(p)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah / Edit */}
      <PartnerFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPartner(null);
        }}
        onSave={handleSavePartner}
        editingPartner={editingPartner}
        totalPartnersCount={partners.length}
      />

      {/* Modal Konfirmasi Hapus */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Mitra Turnamen"
        message={`Apakah Anda yakin ingin menghapus mitra "${deleteTarget?.name}"? Kartu ini tidak akan ditampilkan lagi di halaman publik.`}
        confirmLabel="Ya, Hapus Mitra"
        cancelLabel="Batal"
        onConfirm={handleDeletePartner}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Modal Konfirmasi Reset Default */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset ke 8 Mitra Default"
        message="Daftar mitra akan dikembalikan ke konfigurasi 8 mitra resmi awal turnamen (Panitia, Kemenag, Komite, OSIS, AFK, Dispora, Sauma Arena, dan Bank Jatim Syariah). Lanjutkan?"
        confirmLabel="Ya, Reset Default"
        cancelLabel="Batal"
        onConfirm={handleReset}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
