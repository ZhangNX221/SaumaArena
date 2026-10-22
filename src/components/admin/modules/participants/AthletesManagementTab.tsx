'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, QrCode, ShieldCheck, Printer, Download } from 'lucide-react';
import { ATHLETE_ID_CARDS } from '@/mocks/multiSportData';
import { SportCode } from '@/types';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';

export interface AthleteRecord {
  id: string;
  name: string;
  sport: string;
  contingent: string;
  category: string;
  qrCode: string;
  nisn?: string;
}

interface AthletesManagementTabProps {
  selectedSport?: SportCode;
}

export const AthletesManagementTab: React.FC<AthletesManagementTabProps> = ({ selectedSport = 'ALL' }) => {
  const [athletes, setAthletes] = useState<AthleteRecord[]>(ATHLETE_ID_CARDS);
  const [search, setSearch] = useState('');
  const [selectedIdCard, setSelectedIdCard] = useState<AthleteRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<AthleteRecord | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sport: 'FUTSAL',
    contingent: '',
    category: 'SD/MI Putra',
    nisn: '0134567801',
  });

  const handleOpenAdd = () => {
    setEditingAthlete(null);
    setFormData({
      name: '',
      sport: selectedSport !== 'ALL' ? selectedSport : 'FUTSAL',
      contingent: 'MIN 1 Kota',
      category: 'SD/MI Putra',
      nisn: '0134567801',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: AthleteRecord) => {
    setEditingAthlete(a);
    setFormData({
      name: a.name,
      sport: a.sport,
      contingent: a.contingent,
      category: a.category,
      nisn: a.nisn || '0134567801',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setAthletes((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contingent.trim()) return;

    if (editingAthlete) {
      setAthletes((prev) =>
        prev.map((a) =>
          a.id === editingAthlete.id
            ? { ...a, ...formData }
            : a
        )
      );
    } else {
      const newAthlete: AthleteRecord = {
        id: `ath-${Date.now()}`,
        name: formData.name,
        sport: formData.sport,
        contingent: formData.contingent,
        category: formData.category,
        qrCode: `SAUMA-ATH-${Date.now().toString().slice(-6)}`,
        nisn: formData.nisn,
      };
      setAthletes((prev) => [newAthlete, ...prev]);
    }

    setIsModalOpen(false);
    setEditingAthlete(null);
  };

  const filtered = athletes.filter((a) => {
    const matchSport = selectedSport === 'ALL' || a.sport === selectedSport;
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.contingent.toLowerCase().includes(search.toLowerCase()) ||
      a.qrCode.toLowerCase().includes(search.toLowerCase());
    return matchSport && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <h3 className="font-black text-lg text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
              Database Kartu Atlet Resmi &amp; ID Pass QR
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-[var(--font-sans)] mt-1">
              Penerbitan kartu identitas resmi atlet, validasi QR gate tanding, dan cetak massal.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="btn-tactile px-4 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-bold font-[var(--font-display)] flex items-center gap-2 shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Atlet</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Mencetak seluruh ID Card atlet ber-QR massal (A4 Sheet)...')}
              className="btn-tactile px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-main)] text-xs font-bold font-[var(--font-display)] flex items-center gap-2 shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak Massal</span>
            </button>
          </div>
        </div>

        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            type="text"
            placeholder="Cari nama atlet, kontingen, atau nomor QR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)] font-[var(--font-sans)]"
          />
        </div>
      </div>

      {/* Grid of Athlete Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((athlete) => (
          <div
            key={athlete.id}
            className="p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-[var(--font-mono)] px-2.5 py-1 rounded-lg bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] font-bold">
                  {athlete.sport}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold font-[var(--font-display)]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Lolos Berkas</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(athlete)}
                    title="Edit Atlet"
                    className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(athlete.id, athlete.name)}
                    title="Hapus Atlet"
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-bold font-[var(--font-display)] text-base shrink-0 shadow-2xs">
                  {athlete.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-base text-[var(--text-main)] font-[var(--font-display)] truncate tracking-tight">{athlete.name}</h4>
                  <p className="text-xs text-[var(--text-muted)] font-medium font-[var(--font-sans)] truncate">{athlete.contingent}</p>
                  <span className="text-[11px] text-[var(--text-faint)] font-medium">{athlete.category}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <span className="font-[var(--font-mono)] text-xs text-[var(--text-faint)] tabular-nums">{athlete.qrCode}</span>
              <button
                type="button"
                onClick={() => setSelectedIdCard(athlete)}
                className="btn-tactile px-3.5 py-1.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)] text-xs font-bold font-[var(--font-display)] flex items-center gap-2 transition-colors"
              >
                <QrCode className="w-4 h-4 text-[var(--color-arena-primary)]" />
                <span>Lihat ID Card</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ID Card Modal Preview */}
      {selectedIdCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white text-slate-900 border border-slate-300 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between text-[11px] font-black tracking-widest text-[var(--color-arena-primary)] pb-2 border-b border-slate-200 font-[var(--font-display)]">
              <span>OFFICIAL ATHLETE PASS</span>
              <span>MMFC I MATSANEGA 2026</span>
            </div>

            <div className="w-20 h-20 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-sm font-[var(--font-display)]">
              {selectedIdCard.name.charAt(0)}
            </div>

            <div>
              <h3 className="font-black text-lg font-[var(--font-display)] text-slate-900">{selectedIdCard.name}</h3>
              <div className="text-xs font-bold text-slate-600 font-[var(--font-display)]">{selectedIdCard.contingent}</div>
              <div className="text-[11px] text-slate-500 font-medium font-[var(--font-sans)] mt-0.5">
                {selectedIdCard.sport} &bull; {selectedIdCard.category}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center">
              <div className="w-28 h-28 bg-[var(--arena-dark)] rounded-xl flex items-center justify-center text-white">
                <QrCode className="w-20 h-20 text-white" />
              </div>
              <span className="font-[var(--font-mono)] text-xs font-bold mt-2 text-slate-800 tabular-nums">
                {selectedIdCard.qrCode}
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  alert(`ID Card ${selectedIdCard.name} berhasil diunduh.`);
                  setSelectedIdCard(null);
                }}
                className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-bold text-xs font-[var(--font-display)] flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedIdCard(null)}
                className="btn-tactile px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs font-[var(--font-display)]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal CRUD (Create & Update) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-black text-base text-[var(--text-main)]">
                {editingAthlete ? 'Edit Data Atlet' : 'Tambah Atlet Baru'}
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
                <label className="font-bold text-[var(--text-main)] block mb-1">Nama Lengkap Atlet</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Christian Ronaldo Manek"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--text-main)] block mb-1">Asal Sekolah / Kontingen</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: MIN 1 Kota"
                  value={formData.contingent}
                  onChange={(e) => setFormData({ ...formData, contingent: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Cabor</label>
                  <input
                    type="text"
                    required
                    value={formData.sport}
                    onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Nomor / Kategori</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--text-main)] block mb-1">Nomor Induk Siswa Nasional (NISN)</label>
                <input
                  type="text"
                  required
                  value={formData.nisn}
                  onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-bold text-xs"
                >
                  {editingAthlete ? 'Simpan Perubahan' : 'Terbitkan Kartu Atlet'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-tactile px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reusable Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Data Atlet"
        message={`Apakah Anda yakin ingin menghapus atlet "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Atlet"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
