'use client';

import React, { useState } from 'react';
import { Trophy, Calendar, MapPin, Users, Plus, CheckCircle2, AlertCircle, Edit2, X, Sparkles } from 'lucide-react';

export interface CompetitionItem {
  id: string;
  name: string;
  edition: string;
  sportLabel: string;
  dates: string;
  venue: string;
  registeredTeamsCount: number;
  maxTeamsCount: number;
  status: 'ACTIVE' | 'OPEN_REGISTRATION' | 'UPCOMING' | 'COMPLETED';
  organizer: string;
  description: string;
}

const INITIAL_COMPETITIONS: CompetitionItem[] = [
  {
    id: 'comp-1',
    name: 'Milad Matsanega Futsal Competition I (MMFC I)',
    edition: 'Edisi 2026 (Utama)',
    sportLabel: 'Futsal FFI',
    dates: '24 - 28 Oktober 2026',
    venue: 'Matsanega Futsal Court (Indoor Vinyl)',
    registeredTeamsCount: 10,
    maxTeamsCount: 16,
    status: 'ACTIVE',
    organizer: 'Panitia Milad Matsanega & Ekstrakurikuler Futsal',
    description: 'Kejuaraan futsal antarmadrasah tingkat SD/MI memperebutkan Piala Bergilir Matsanega I.',
  },
  {
    id: 'comp-2',
    name: 'Matsanega E-Sport Arena Cup 2026 (MLBB)',
    edition: 'Seri Pelajar I',
    sportLabel: 'E-Sport MLBB',
    dates: '10 - 12 November 2026',
    venue: 'Matsanega ICT Center / Aula Utama',
    registeredTeamsCount: 8,
    maxTeamsCount: 16,
    status: 'OPEN_REGISTRATION',
    organizer: 'Divisi E-Sport Matsanega Arena',
    description: 'Turnamen Mobile Legends Bang Bang tingkat pelajar SD/MI se-derajat.',
  },
  {
    id: 'comp-3',
    name: 'Piala Rektor Bola Voli Antar-Pelajar 2026',
    edition: 'Invitasi Tahunan',
    sportLabel: 'Bola Voli',
    dates: '01 - 04 Desember 2026',
    venue: 'Gelanggang Olahraga Outdoor Arena',
    registeredTeamsCount: 6,
    maxTeamsCount: 12,
    status: 'UPCOMING',
    organizer: 'PBVSI Wilayah & Pengurus Matsanega',
    description: 'Kompetisi bola voli putra dan putri jenjang madrasah se-Jawa Timur.',
  },
];

export const CompetitionsManagementView: React.FC = () => {
  const [competitions, setCompetitions] = useState<CompetitionItem[]>(INITIAL_COMPETITIONS);
  const [activeCompId, setActiveCompId] = useState<string>('comp-1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<CompetitionItem | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<CompetitionItem, 'id' | 'registeredTeamsCount'>>({
    name: '',
    edition: '',
    sportLabel: 'Futsal',
    dates: '',
    venue: '',
    maxTeamsCount: 16,
    status: 'OPEN_REGISTRATION',
    organizer: '',
    description: '',
  });

  const handleOpenAdd = () => {
    setEditingComp(null);
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
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comp: CompetitionItem) => {
    setEditingComp(comp);
    setFormData({
      name: comp.name,
      edition: comp.edition,
      sportLabel: comp.sportLabel,
      dates: comp.dates,
      venue: comp.venue,
      maxTeamsCount: comp.maxTeamsCount,
      status: comp.status,
      organizer: comp.organizer,
      description: comp.description,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingComp) {
      setCompetitions((prev) =>
        prev.map((c) =>
          c.id === editingComp.id
            ? { ...c, ...formData }
            : c
        )
      );
    } else {
      const newComp: CompetitionItem = {
        ...formData,
        id: `comp-${Date.now()}`,
        registeredTeamsCount: 0,
      };
      setCompetitions((prev) => [newComp, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      {/* Header and Toolbar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[var(--color-arena-primary)]">
            <Trophy className="w-4 h-4 shrink-0" />
            <span className="text-xs font-barlow font-bold uppercase tracking-wider">
              PERSIAPAN KOMPETISI &bull; MULTI-EVENT
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bebas text-[var(--text-main)] uppercase tracking-wide mt-1">
            Daftar Kompetisi &amp; Turnamen
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 max-w-xl">
            Kelola edisi kejuaraan aktif, status pendaftaran kuota tim, venue pelaksanaan, dan ganti kompetisi aktif kerja panitia.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-tactile px-4 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kompetisi Baru</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
          <span className="text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
            Total Kompetisi
          </span>
          <div className="text-3xl font-teko font-bold text-[var(--text-main)] tabular-nums leading-none pt-1">
            {competitions.length} Turnamen
          </div>
          <span className="text-[10px] text-[var(--color-arena-primary)] font-semibold">Tersimpan dalam database</span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
          <span className="text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
            Sedang Berjalan (Active)
          </span>
          <div className="text-3xl font-teko font-bold text-red-600 tabular-nums leading-none pt-1">
            {competitions.filter((c) => c.status === 'ACTIVE').length} Kompetisi
          </div>
          <span className="text-[10px] text-red-500 font-semibold">Sedang berlangsung di arena</span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
          <span className="text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
            Pendaftaran Dibuka
          </span>
          <div className="text-3xl font-teko font-bold text-emerald-600 tabular-nums leading-none pt-1">
            {competitions.filter((c) => c.status === 'OPEN_REGISTRATION').length} Kompetisi
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Terbuka untuk kontingen sekolah</span>
        </div>
      </div>

      {/* Competitions Cards List */}
      <div className="space-y-4">
        {competitions.map((comp) => {
          const isSelected = activeCompId === comp.id;
          return (
            <div
              key={comp.id}
              className={`p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border transition-all shadow-xs ${
                isSelected
                  ? 'border-[var(--color-arena-primary)] ring-2 ring-[var(--color-arena-primary)]/15'
                  : 'border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)]/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-barlow font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] border border-[var(--border-subtle)]">
                      {comp.sportLabel}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] font-mono">
                      {comp.edition}
                    </span>
                    {comp.status === 'ACTIVE' && (
                      <span className="text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 border border-red-500/20">
                        ● Sedang Berjalan
                      </span>
                    )}
                    {comp.status === 'OPEN_REGISTRATION' && (
                      <span className="text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        ✓ Pendaftaran Terbuka
                      </span>
                    )}
                    {comp.status === 'UPCOMING' && (
                      <span className="text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                        Akan Datang
                      </span>
                    )}
                  </div>
                  <h3 className="font-bebas text-xl sm:text-2xl uppercase tracking-wide text-[var(--text-main)]">
                    {comp.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isSelected ? (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-barlow font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Kompetisi Aktif</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveCompId(comp.id)}
                      className="btn-tactile px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)]"
                    >
                      Pilih Sebagai Aktif
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(comp)}
                    className="p-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors"
                    title="Edit Informasi Kompetisi"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Detail Facts */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--color-arena-primary)] shrink-0" />
                  <span>{comp.dates}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--color-arena-primary)] shrink-0" />
                  <span className="truncate">{comp.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--color-arena-primary)] shrink-0" />
                  <span>
                    Kuota: <strong className="text-[var(--text-main)]">{comp.registeredTeamsCount}</strong> / {comp.maxTeamsCount} Tim
                  </span>
                </div>
              </div>

              {comp.description && (
                <p className="text-xs text-[var(--text-muted)] pt-3 leading-relaxed border-t border-[var(--border-subtle)] mt-3">
                  {comp.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-bebas text-xl uppercase tracking-wide text-[var(--text-main)]">
                {editingComp ? 'Edit Detail Kompetisi' : 'Tambah Kompetisi Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
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
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
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
                  onClick={() => setIsModalOpen(false)}
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
      )}
    </div>
  );
};
