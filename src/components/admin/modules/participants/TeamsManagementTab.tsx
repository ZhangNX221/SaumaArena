'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { initialTeams } from '@/mocks/tournamentData';
import { Team } from '@/types';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';
import { TeamEditModal, TeamFormData } from './TeamEditModal';
import { usePersistentState } from '@/hooks/usePersistentState';

export const TeamsManagementTab: React.FC = () => {
  const [teams, setTeams] = usePersistentState<Team[]>('sauma_arena_teams', initialTeams);
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('ALL');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const handleOpenAdd = () => {
    setEditingTeam(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (team: Team) => {
    setEditingTeam(team);
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

  const handleSaveTeam = (formData: TeamFormData) => {
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
                logoUrl: formData.logoUrl || t.logoUrl,
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
        logoUrl: formData.logoUrl || '/logos/sdi-kardina-massa.jpeg',
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
      {/* Filter and Search Bar with Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            type="text"
            placeholder="Cari nama tim, asal kontingen, kota, atau pelatih..."
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
          <option value="C">Grup C</option>
          <option value="D">Grup D</option>
        </select>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-tactile px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs shrink-0 min-h-[38px]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kontingen Tim</span>
        </button>
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
                  <td className="py-3.5 px-4 font-bold text-[var(--text-main)]">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.logoUrl}
                        alt={t.name}
                        className="w-12 h-12 object-contain shrink-0 filter drop-shadow-2xs"
                      />
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-[var(--text-main)]">{t.schoolName}</div>
                        <div className="text-[11px] text-[var(--text-muted)] font-normal">{t.city}</div>
                      </div>
                    </div>
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
      <TeamEditModal
        isOpen={isModalOpen}
        editingTeam={editingTeam}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTeam(null);
        }}
        onSave={handleSaveTeam}
      />

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
