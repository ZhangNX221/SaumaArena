'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, X } from 'lucide-react';
import { Venue } from '@/types';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';
import { ModalPortal } from '@/components/common/ModalPortal';

interface VenuesManagementViewProps {
  venues: Venue[];
}

export const VenuesManagementView: React.FC<VenuesManagementViewProps> = ({ venues: initialVenues }) => {
  const [venues, setVenues] = useState<Venue[]>(initialVenues);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    location: '',
    courtsText: '',
  });

  const handleOpenAdd = () => {
    setEditingVenue(null);
    setFormData({
      id: `VENUE-${venues.length + 1}`,
      name: '',
      location: '',
      courtsText: 'Lapangan A, Lapangan B',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Venue) => {
    setEditingVenue(v);
    setFormData({
      id: v.id,
      name: v.name,
      location: v.location,
      courtsText: v.courts.join(', '),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setVenues((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.location.trim()) return;

    const courts = formData.courtsText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    if (editingVenue) {
      setVenues((prev) =>
        prev.map((v) =>
          v.id === editingVenue.id
            ? { ...v, name: formData.name, location: formData.location, courts }
            : v
        )
      );
    } else {
      const newVenue: Venue = {
        id: formData.id.trim() || `VENUE-${Date.now()}`,
        name: formData.name.trim(),
        location: formData.location.trim(),
        courts: courts.length > 0 ? courts : ['Lapangan 1'],
      };
      setVenues((prev) => [...prev, newVenue]);
    }

    setIsModalOpen(false);
    setEditingVenue(null);
  };

  const filtered = venues.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase()) ||
      v.courts.some((c) => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Action Toolbar: Search & Add Button */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            type="text"
            placeholder="Cari nama gedung atau lokasi lapangan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
          />
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-tactile px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs shrink-0 min-h-[38px]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Venue Baru</span>
        </button>
      </div>

      {/* Venues Grid / Cards with CRUD Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((venue) => (
          <div
            key={venue.id}
            className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] font-mono text-[var(--color-arena-primary)] font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{venue.id}</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(venue)}
                    title="Edit Venue"
                    className="p-1 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(venue.id, venue.name)}
                    title="Hapus Venue"
                    className="p-1 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-barlow font-bold text-base uppercase tracking-wide text-[var(--text-main)]">
                  {venue.name}
                </h4>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{venue.location}</p>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1.5">
                <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  Titik Tanding ({venue.courts.length} Lapangan Aktif):
                </span>
                <div className="space-y-1 text-xs">
                  {venue.courts.map((court, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-[var(--bg-muted)]/70 flex items-center justify-between font-medium"
                    >
                      <span>{court}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Siap Pakai" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
              <span>Status: <strong className="text-emerald-600 font-bold">Tersertifikasi</strong></span>
              <span className="font-barlow font-bold uppercase text-[11px]">{venue.courts.length} Titik</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal CRUD (Create & Update) */}
      {isModalOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn" onClick={() => setIsModalOpen(false)}>
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <h3 className="font-bebas text-xl uppercase tracking-wide text-[var(--text-main)]">
                  {editingVenue ? 'Edit Data Venue' : 'Tambah Venue / Lapangan Baru'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Kode / ID Venue</label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    disabled={!!editingVenue}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="Contoh: VENUE-01"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Nama Gedung / Arena</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: GOR Flobamora Oepoi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Alamat / Lokasi Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jl. Bandung No. 7, Penanggungan, Kec. Klojen, Kota Malang"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                    Daftar Titik Lapangan (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Court 1 Futsal, Court 2 Badminton, Lapangan C"
                    value={formData.courtsText}
                    onChange={(e) => setFormData({ ...formData, courtsText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                  />
                  <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                    Setiap nama yang dipisahkan koma akan menjadi nomor lapangan pertandingan.
                  </span>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="submit"
                    className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold uppercase tracking-wider text-xs"
                  >
                    {editingVenue ? 'Simpan Perubahan' : 'Tambahkan Venue'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-tactile px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Reusable Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Venue Gelanggang"
        message={`Apakah Anda yakin ingin menghapus venue "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Venue"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
