'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Trophy } from 'lucide-react';
import { StandingRow } from '@/types';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';

const DEFAULT_GROUP_A_STANDINGS: StandingRow[] = [
  { rank: 1, teamId: 'team-min1', teamName: 'MIN 1 KOTA', schoolName: 'Madrasah Ibtidaiyah Negeri 1 Kota', logoUrl: '/teams/default.png', played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 15, goalsAgainst: 14, goalDifference: 1, points: 6, fairPlayScore: 10 },
  { rank: 2, teamId: 'team-sdn-percobaan', teamName: 'SDN PERCOBAAN 1', schoolName: 'SD Negeri Percobaan 1', logoUrl: '/teams/default.png', played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 16, goalsAgainst: 12, goalDifference: 4, points: 4, fairPlayScore: 9 },
  { rank: 3, teamId: 'team-alhidayah', teamName: 'MIS AL-HIDAYAH', schoolName: 'Madrasah Ibtidaiyah Swasta Al-Hidayah', logoUrl: '/teams/default.png', played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 12, goalsAgainst: 10, goalDifference: 2, points: 4, fairPlayScore: 8 },
  { rank: 4, teamId: 'team-bina-insani', teamName: 'SDIT BINA INSANI', schoolName: 'SDIT Bina Insani', logoUrl: '/teams/default.png', played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 6, goalsAgainst: 13, goalDifference: -7, points: 3, fairPlayScore: 10 },
];

const DEFAULT_GROUP_B_STANDINGS: StandingRow[] = [
  { rank: 1, teamId: 'team-min2', teamName: 'MIN 2 UNGGULAN', schoolName: 'Madrasah Ibtidaiyah Negeri 2 Unggulan', logoUrl: '/teams/default.png', played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 15, goalsAgainst: 4, goalDifference: 11, points: 9, fairPlayScore: 10 },
  { rank: 2, teamId: 'team-sdn-harapan', teamName: 'SDN 2 HARAPAN', schoolName: 'SD Negeri 2 Harapan Bangsa', logoUrl: '/teams/default.png', played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 8, goalsAgainst: 9, goalDifference: -1, points: 4, fairPlayScore: 9 },
  { rank: 3, teamId: 'team-darussalam', teamName: 'MIS DARUSSALAM', schoolName: 'Madrasah Ibtidaiyah Swasta Darussalam', logoUrl: '/teams/default.png', played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 14, goalsAgainst: 13, goalDifference: 1, points: 3, fairPlayScore: 8 },
  { rank: 4, teamId: 'team-harum', teamName: 'SDIT HARAPAN UMAT', schoolName: 'SDIT Harapan Umat', logoUrl: '/teams/default.png', played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 7, goalsAgainst: 18, goalDifference: -11, points: 1, fairPlayScore: 7 },
];

export const GroupStandingsTab: React.FC = () => {
  const [groupA, setGroupA] = useState<StandingRow[]>(DEFAULT_GROUP_A_STANDINGS);
  const [groupB, setGroupB] = useState<StandingRow[]>(DEFAULT_GROUP_B_STANDINGS);
  const [selectedGroup, setSelectedGroup] = useState<'A' | 'B'>('A');
  const [deleteTarget, setDeleteTarget] = useState<{ teamId: string; teamName: string } | null>(null);

  const currentList = selectedGroup === 'A' ? groupA : groupB;
  const setCurrentList = selectedGroup === 'A' ? setGroupA : setGroupB;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<StandingRow | null>(null);
  const [formData, setFormData] = useState({
    teamName: '',
    schoolName: '',
    played: 3,
    won: 2,
    drawn: 1,
    lost: 0,
    goalsFor: 8,
    goalsAgainst: 2,
    points: 7,
    fairPlayScore: 10,
  });

  const handleOpenAdd = () => {
    setEditingRow(null);
    setFormData({
      teamName: '',
      schoolName: '',
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      fairPlayScore: 10,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: StandingRow) => {
    setEditingRow(row);
    setFormData({
      teamName: row.teamName,
      schoolName: row.schoolName,
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      points: row.points,
      fairPlayScore: row.fairPlayScore,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (teamId: string, teamName: string) => {
    setDeleteTarget({ teamId, teamName });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setCurrentList((prev) => prev.filter((r) => r.teamId !== deleteTarget.teamId));
      setDeleteTarget(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teamName.trim()) return;

    const gf = Number(formData.goalsFor) || 0;
    const ga = Number(formData.goalsAgainst) || 0;
    const gd = gf - ga;
    const pts = Number(formData.points) || (formData.won * 3 + formData.drawn);

    if (editingRow) {
      setCurrentList((prev) =>
        prev.map((r) =>
          r.teamId === editingRow.teamId
            ? {
                ...r,
                teamName: formData.teamName,
                schoolName: formData.schoolName,
                played: Number(formData.played),
                won: Number(formData.won),
                drawn: Number(formData.drawn),
                lost: Number(formData.lost),
                goalsFor: gf,
                goalsAgainst: ga,
                goalDifference: gd,
                points: pts,
                fairPlayScore: Number(formData.fairPlayScore),
              }
            : r
        )
      );
    } else {
      const newRow: StandingRow = {
        rank: currentList.length + 1,
        teamId: `team-${Date.now()}`,
        teamName: formData.teamName,
        schoolName: formData.schoolName || formData.teamName,
        logoUrl: '/teams/default.png',
        played: Number(formData.played),
        won: Number(formData.won),
        drawn: Number(formData.drawn),
        lost: Number(formData.lost),
        goalsFor: gf,
        goalsAgainst: ga,
        goalDifference: gd,
        points: pts,
        fairPlayScore: Number(formData.fairPlayScore),
      };
      setCurrentList((prev) => [...prev, newRow]);
    }

    setIsModalOpen(false);
    setEditingRow(null);
  };

  // Sort standings by points desc, goalDiff desc
  const sortedStandings = [...currentList].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.goalDifference - a.goalDifference;
  });

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h3 className="font-black text-lg text-[var(--text-main)] font-[var(--font-display)] tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Klasemen Poin Babak Grup</span>
          </h3>
          <p className="text-xs text-[var(--text-muted)] font-[var(--font-sans)] mt-1">
            Perhitungan otomatis menang (3 poin), seri (1 poin), kalah (0 poin), selisih gol, dan fair-play.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-2xl bg-[var(--bg-muted)]/80 p-1.5 border border-[var(--border-subtle)] text-xs font-bold font-[var(--font-display)]">
            <button
              type="button"
              onClick={() => setSelectedGroup('A')}
              className={`px-4 py-1.5 rounded-xl transition-all ${
                selectedGroup === 'A' ? 'bg-[var(--color-arena-primary)] text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Grup A ({groupA.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedGroup('B')}
              className={`px-4 py-1.5 rounded-xl transition-all ${
                selectedGroup === 'B' ? 'bg-[var(--color-arena-primary)] text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Grup B ({groupB.length})
            </button>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="btn-tactile px-4 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-bold font-[var(--font-display)] flex items-center gap-2 shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tim Grup {selectedGroup}</span>
          </button>
        </div>
      </div>

      {/* Table Standings CRUD */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
        <table className="w-full text-xs text-left">
          <thead className="bg-[var(--bg-muted)]/70 text-[11px] font-black uppercase tracking-wider font-[var(--font-display)] text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
            <tr>
              <th className="py-3.5 px-3.5 text-center">Pos</th>
              <th className="py-3.5 px-3.5">Klub / Sekolah</th>
              <th className="py-3.5 px-3 text-center">MN</th>
              <th className="py-3.5 px-3 text-center text-emerald-600 dark:text-emerald-400">M</th>
              <th className="py-3.5 px-3 text-center text-amber-600 dark:text-amber-400">S</th>
              <th className="py-3.5 px-3 text-center text-red-600 dark:text-red-400">K</th>
              <th className="py-3.5 px-3 text-center">GM</th>
              <th className="py-3.5 px-3 text-center">GK</th>
              <th className="py-3.5 px-3 text-center">SG</th>
              <th className="py-3.5 px-3.5 text-center font-black text-sm text-[var(--color-arena-primary)]">PTS</th>
              <th className="py-3.5 px-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] font-medium">
            {sortedStandings.map((row, idx) => (
              <tr key={row.teamId} className="hover:bg-[var(--bg-muted)]/30 transition-colors">
                <td className="py-4 px-3.5 text-center font-bold font-[var(--font-mono)] tabular-nums">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-[var(--font-mono)] tabular-nums ${
                      idx < 2 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-black' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                </td>
                <td className="py-4 px-3.5 font-bold text-[var(--text-main)]">
                  <div className="font-[var(--font-display)]">{row.teamName}</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-normal">{row.schoolName}</div>
                </td>
                <td className="py-4 px-3 text-center font-[var(--font-mono)] tabular-nums text-xs">{row.played}</td>
                <td className="py-4 px-3 text-center font-[var(--font-mono)] tabular-nums text-xs font-bold text-emerald-600 dark:text-emerald-400">{row.won}</td>
                <td className="py-4 px-3 text-center font-[var(--font-mono)] tabular-nums text-xs text-amber-600 dark:text-amber-400">{row.drawn}</td>
                <td className="py-4 px-3 text-center font-[var(--font-mono)] tabular-nums text-xs text-red-600 dark:text-red-400">{row.lost}</td>
                <td className="py-4 px-3 text-center font-[var(--font-mono)] tabular-nums text-xs">{row.goalsFor}</td>
                <td className="py-4 px-3 text-center font-[var(--font-mono)] tabular-nums text-xs">{row.goalsAgainst}</td>
                <td className="py-4 px-3 text-center font-[var(--font-mono)] tabular-nums text-xs font-bold">
                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                </td>
                <td className="py-4 px-3.5 text-center font-[var(--font-mono)] tabular-nums font-black text-sm text-[var(--color-arena-primary)]">
                  {row.points}
                </td>
                <td className="py-4 px-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(row)}
                      title="Koreksi Skor & Poin"
                      className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(row.teamId, row.teamName)}
                      title="Hapus dari Klasemen"
                      className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal CRUD (Create & Update) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-black text-base text-[var(--text-main)]">
                {editingRow ? `Koreksi Poin: ${editingRow.teamName}` : `Tambah Tim ke Klasemen Grup ${selectedGroup}`}
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
                <label className="font-bold text-[var(--text-main)] block mb-1">Nama Tim / Sekolah</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: MIN 1 Kota Malang"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Main (MN)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.played}
                    onChange={(e) => setFormData({ ...formData, played: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono text-center"
                  />
                </div>
                <div>
                  <label className="font-bold text-emerald-600 block mb-1">Menang (M)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.won}
                    onChange={(e) => setFormData({ ...formData, won: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono text-center font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-amber-600 block mb-1">Seri (S)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.drawn}
                    onChange={(e) => setFormData({ ...formData, drawn: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono text-center"
                  />
                </div>
                <div>
                  <label className="font-bold text-red-600 block mb-1">Kalah (K)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.lost}
                    onChange={(e) => setFormData({ ...formData, lost: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Gol Memasukkan (GM)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.goalsFor}
                    onChange={(e) => setFormData({ ...formData, goalsFor: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono text-center"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Gol Kemasukan (GK)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.goalsAgainst}
                    onChange={(e) => setFormData({ ...formData, goalsAgainst: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono text-center"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--color-arena-primary)] block mb-1">Poin Total (PTS)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono text-center font-black"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-bold text-xs"
                >
                  {editingRow ? 'Simpan Koreksi' : 'Tambahkan ke Klasemen'}
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
        title="Hapus Dari Klasemen Grup"
        message={`Apakah Anda yakin ingin menghapus tim "${deleteTarget?.teamName}" dari klasemen Grup ${selectedGroup}? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Tim"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
