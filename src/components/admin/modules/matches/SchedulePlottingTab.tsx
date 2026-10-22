'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Calendar, Clock, MapPin } from 'lucide-react';
import { initialMatches, initialTeams } from '@/mocks/tournamentData';
import { PRESET_USERS } from '@/mocks/multiSportData';
import { Match, MatchStatus } from '@/types';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';

export const SchedulePlottingTab: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; matchNumber: number } | null>(null);

  const referees = PRESET_USERS.filter((u) => u.role === 'REFEREE');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formData, setFormData] = useState({
    matchNumber: 1,
    stage: 'GROUP' as Match['stage'],
    teamAName: '',
    teamBName: '',
    courtName: 'Lapangan Utama (Vinyl Standar FFI)',
    scheduledTime: '2026-10-24 09:00',
    refereeName: referees[0]?.name || 'Wasit Utama',
    status: 'UPCOMING' as MatchStatus,
  });

  const handleOpenAdd = () => {
    setEditingMatch(null);
    setFormData({
      matchNumber: matches.length + 1,
      stage: 'GROUP',
      teamAName: initialTeams[0]?.name || 'Tim A',
      teamBName: initialTeams[1]?.name || 'Tim B',
      courtName: 'Lapangan Utama (Vinyl Standar FFI)',
      scheduledTime: '2026-10-24 09:00',
      refereeName: referees[0]?.name || 'Wasit Utama',
      status: 'UPCOMING',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: Match) => {
    setEditingMatch(m);
    setFormData({
      matchNumber: m.matchNumber,
      stage: m.stage,
      teamAName: m.teamAName,
      teamBName: m.teamBName,
      courtName: m.courtName,
      scheduledTime: m.scheduledTime,
      refereeName: m.assignedReferees?.[0]?.refereeName || referees[0]?.name || 'Wasit Utama',
      status: m.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, matchNumber: number) => {
    setDeleteTarget({ id, matchNumber });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setMatches((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teamAName.trim() || !formData.teamBName.trim()) return;

    if (editingMatch) {
      setMatches((prev) =>
        prev.map((m) =>
          m.id === editingMatch.id
            ? {
                ...m,
                matchNumber: Number(formData.matchNumber),
                stage: formData.stage,
                teamAName: formData.teamAName,
                teamBName: formData.teamBName,
                courtName: formData.courtName,
                scheduledTime: formData.scheduledTime,
                status: formData.status,
                assignedReferees: [
                  {
                    refereeId: 'ref-custom',
                    refereeName: formData.refereeName,
                    role: 'WASIT_1',
                  },
                ],
              }
            : m
        )
      );
    } else {
      const newMatch: Match = {
        id: `match-${Date.now()}`,
        tournamentId: 'tourney-1',
        matchNumber: Number(formData.matchNumber),
        stage: formData.stage,
        teamAId: `team-${Date.now()}-A`,
        teamBId: `team-${Date.now()}-B`,
        teamAName: formData.teamAName,
        teamBName: formData.teamBName,
        teamALogo: '',
        teamBLogo: '',
        scoreA: 0,
        scoreB: 0,
        status: formData.status,
        venueName: 'GOR Flobamora',
        courtName: formData.courtName,
        scheduledTime: formData.scheduledTime,
        events: [],
        assignedReferees: [
          {
            refereeId: 'ref-custom',
            refereeName: formData.refereeName,
            role: 'WASIT_1',
          },
        ],
      };
      setMatches((prev) => [...prev, newMatch]);
    }

    setIsModalOpen(false);
    setEditingMatch(null);
  };

  const filtered = matches.filter((m) => {
    const matchSearch =
      m.teamAName.toLowerCase().includes(search.toLowerCase()) ||
      m.teamBName.toLowerCase().includes(search.toLowerCase()) ||
      m.courtName.toLowerCase().includes(search.toLowerCase()) ||
      String(m.matchNumber).includes(search);
    const matchStage = stageFilter === 'ALL' || m.stage === stageFilter;
    return matchSearch && matchStage;
  });

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h3 className="font-black text-lg text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
            Plotting Jadwal &amp; Penugasan Juri
          </h3>
          <p className="text-xs text-[var(--text-muted)] font-[var(--font-sans)] mt-1">
            Atur jam tanding, titik lapangan, penugasan wasit/juri resmi, dan status laga.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-tactile px-4 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-bold font-[var(--font-display)] flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal Laga</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            type="text"
            placeholder="Cari tim, no. laga, atau nama lapangan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)] font-[var(--font-sans)]"
          />
        </div>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="w-full sm:w-48 px-3.5 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] font-bold font-[var(--font-display)]"
        >
          <option value="ALL">Semua Babak</option>
          <option value="GROUP">Penyisihan Grup</option>
          <option value="QUARTER_FINAL">Perempat Final</option>
          <option value="SEMI_FINAL">Semifinal</option>
          <option value="FINAL">Grand Final</option>
        </select>
      </div>

      {/* Table CRUD */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
        <table className="w-full text-xs text-left">
          <thead className="bg-[var(--bg-muted)]/70 text-[11px] font-black uppercase tracking-wider font-[var(--font-display)] text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
            <tr>
              <th className="py-3.5 px-4">Laga</th>
              <th className="py-3.5 px-4">Pertandingan</th>
              <th className="py-3.5 px-4">Venue &amp; Lapangan</th>
              <th className="py-3.5 px-4">Waktu Tanding</th>
              <th className="py-3.5 px-4">Juri Bertugas</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-[var(--text-muted)] font-[var(--font-sans)]">
                  Tidak ada pertandingan yang sesuai filter.
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id} className="hover:bg-[var(--bg-muted)]/30 transition-colors">
                  <td className="py-4 px-4 font-[var(--font-mono)] tabular-nums font-bold text-xs text-[var(--color-arena-primary)]">
                    #{m.matchNumber}
                  </td>
                  <td className="py-4 px-4 font-bold text-[var(--text-main)]">
                    <div className="font-[var(--font-display)]">{m.teamAName} vs {m.teamBName}</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-normal">{m.stage}</div>
                  </td>
                  <td className="py-4 px-4 text-xs font-[var(--font-sans)]">
                    <div className="font-semibold text-[var(--text-main)]">{m.courtName}</div>
                  </td>
                  <td className="py-4 px-4 font-[var(--font-mono)] tabular-nums text-xs text-[var(--text-muted)] font-medium">
                    {m.scheduledTime}
                  </td>
                  <td className="py-4 px-4 font-semibold text-[var(--text-main)] font-[var(--font-display)]">
                    {m.assignedReferees?.[0]?.refereeName || referees[0]?.name}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold font-[var(--font-display)] ${
                        m.status === 'LIVE'
                          ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                          : m.status === 'COMPLETED'
                          ? 'bg-slate-500/15 text-slate-700 dark:text-slate-300'
                          : 'bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)]'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(m)}
                        title="Edit Plotting Laga"
                        className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id, m.matchNumber)}
                        title="Hapus Pertandingan"
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
              <h3 className="font-black text-base text-[var(--text-main)]">
                {editingMatch ? `Ubah Jadwal Laga #${editingMatch.matchNumber}` : 'Tambah Jadwal Laga Baru'}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Nomor Laga</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.matchNumber}
                    onChange={(e) => setFormData({ ...formData, matchNumber: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Babak Pertandingan</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value as Match['stage'] })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-semibold"
                  >
                    <option value="GROUP">Penyisihan Grup</option>
                    <option value="QUARTER_FINAL">Perempat Final</option>
                    <option value="SEMI_FINAL">Semifinal</option>
                    <option value="FINAL">Grand Final</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Tim A</label>
                  <input
                    type="text"
                    required
                    value={formData.teamAName}
                    onChange={(e) => setFormData({ ...formData, teamAName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Tim B</label>
                  <input
                    type="text"
                    required
                    value={formData.teamBName}
                    onChange={(e) => setFormData({ ...formData, teamBName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Titik Lapangan</label>
                  <input
                    type="text"
                    required
                    value={formData.courtName}
                    onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Waktu / Jadwal</label>
                  <input
                    type="text"
                    required
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    placeholder="2026-10-20 09:00"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Penugasan Juri</label>
                  <select
                    value={formData.refereeName}
                    onChange={(e) => setFormData({ ...formData, refereeName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                  >
                    {referees.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[var(--text-main)] block mb-1">Status Laga</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as MatchStatus })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-semibold"
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="LIVE">LIVE</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="POSTPONED">POSTPONED</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-bold text-xs"
                >
                  {editingMatch ? 'Simpan Perubahan' : 'Jadwalkan Laga'}
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
        title="Hapus Jadwal Laga"
        message={`Apakah Anda yakin ingin menghapus Laga #${deleteTarget?.matchNumber}? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Laga"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
