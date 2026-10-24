'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Users, CheckCircle2 } from 'lucide-react';
import { initialTeams } from '@/mocks/tournamentData';
import { Team } from '@/types';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';

export const TeamsManagementTab: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('ALL');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    schoolName: '',
    city: 'Kota Malang',
    coachName: '',
    group: 'A' as 'A' | 'B',
    rosterCount: 12,
  });

  const handleOpenAdd = () => {
    setEditingTeam(null);
    setFormData({
      name: '',
      schoolName: '',
      city: 'Kota Malang',
      coachName: '',
      group: 'A',
      rosterCount: 12,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      schoolName: team.schoolName,
      city: team.city,
      coachName: team.coachName,
      group: team.group,
      rosterCount: team.players.length || 12,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setTeams((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.schoolName.trim()) return;

    if (editingTeam) {
      setTeams((prev) =>
        prev.map((t) =>
          t.id === editingTeam.id
            ? {
                ...t,
                name: formData.name,
                schoolName: formData.schoolName,
                city: formData.city,
                coachName: formData.coachName,
                group: formData.group,
              }
            : t
        )
      );
    } else {
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name: formData.name,
        shortName: formData.name.slice(0, 3).toUpperCase(),
        schoolName: formData.schoolName,
        city: formData.city,
        logoUrl: '/teams/default.png',
        coachName: formData.coachName,
        group: formData.group,
        rosterLocked: false,
        registrationStatus: 'VERIFIED',
        players: Array.from({ length: formData.rosterCount }, (_, i) => ({
          id: `p-${Date.now()}-${i}`,
          name: `Pemain ${i + 1}`,
          number: i + 1,
          position: 'Player',
          photoUrl: '',
          nisn: '0089123456',
          documentStatus: 'APPROVED',
          yellowCards: 0,
          redCards: 0,
          goals: 0,
          assists: 0,
        })),
        officials: [],
      };
      setTeams((prev) => [newTeam, ...prev]);
    }

    setIsModalOpen(false);
    setEditingTeam(null);
  };

  const filtered = teams.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.schoolName.toLowerCase().includes(search.toLowerCase()) ||
      t.city.toLowerCase().includes(search.toLowerCase()) ||
      t.coachName.toLowerCase().includes(search.toLowerCase());
    const matchGroup = groupFilter === 'ALL' || t.group === groupFilter;
    return matchSearch && matchGroup;
  });

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h3 className="font-bebas text-xl sm:text-2xl uppercase tracking-wide text-[var(--text-main)]">
            Data Kontingen &amp; Tim Sekolah
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Daftar resmi kontingen sekolah/klub terverifikasi yang berhak bertanding di arena.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-tactile px-4 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kontingen Tim</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            type="text"
            placeholder="Cari nama tim, sekolah, kota, atau pelatih..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
          />
        </div>
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="w-full sm:w-48 px-3.5 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider"
        >
          <option value="ALL">Semua Grup ({teams.length})</option>
          <option value="A">Grup A</option>
          <option value="B">Grup B</option>
        </select>
      </div>

      {/* Table CRUD */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
        <table className="w-full text-xs text-left">
          <thead className="bg-[var(--bg-muted)]/70 text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
            <tr>
              <th className="py-3.5 px-4">Kontingen / Sekolah</th>
              <th className="py-3.5 px-4">Nama Tim</th>
              <th className="py-3.5 px-4">Pelatih / Manajer</th>
              <th className="py-3.5 px-4 text-center">Grup</th>
              <th className="py-3.5 px-4 text-center">Roster Atlet</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-[var(--text-muted)]">
                  Tidak ada tim yang sesuai pencarian.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id} className="hover:bg-[var(--bg-muted)]/30 transition-colors">
                  <td className="py-4 px-4 font-bold text-[var(--text-main)]">
                    <div>{t.schoolName}</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-normal">{t.city}</div>
                  </td>
                  <td className="py-4 px-4 font-barlow font-bold uppercase tracking-wide text-sm text-[var(--color-arena-primary)]">
                    {t.name}
                  </td>
                  <td className="py-4 px-4 text-xs text-[var(--text-muted)] font-medium">
                    {t.coachName}
                  </td>
                  <td className="py-4 px-4 text-center font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-primary)]">
                    Grup {t.group}
                  </td>
                  <td className="py-4 px-4 text-center font-teko font-bold text-base tabular-nums">
                    {t.players.length} Pemain
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-barlow font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                      Terverifikasi
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(t)}
                        title="Edit Data Tim"
                        className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(t.id, t.name)}
                        title="Hapus Tim"
                        className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal CRUD (Create & Update) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-bebas text-xl uppercase tracking-wide text-[var(--text-main)]">
                {editingTeam ? 'Edit Data Kontingen Tim' : 'Tambah Kontingen Tim Baru'}
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
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Nama Kontingen / Sekolah</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: MIN 1 Kota Malang"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Nama Tim / Klub</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Elang Muda Matsanega"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Kota / Kabupaten</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                  />
                </div>
                <div>
                  <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Plotting Grup</label>
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value as 'A' | 'B' })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-barlow font-bold uppercase text-xs"
                  >
                    <option value="A">Grup A</option>
                    <option value="B">Grup B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Pelatih Kepala</label>
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
                  <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Kapasitas Roster</label>
                  <input
                    type="number"
                    min="5"
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
                  className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold uppercase tracking-wider text-xs"
                >
                  {editingTeam ? 'Simpan Perubahan' : 'Tambahkan Tim'}
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
      )}

      {/* Reusable Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Data Tim"
        message={`Apakah Anda yakin ingin menghapus tim "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Tim"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
