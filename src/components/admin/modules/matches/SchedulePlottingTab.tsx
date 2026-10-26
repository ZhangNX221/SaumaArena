'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Play, CheckCircle2, RotateCcw, Radio } from 'lucide-react';
import { initialMatches } from '@/mocks/tournamentData';
import { PRESET_USERS } from '@/mocks/multiSportData';
import { Match, MatchStatus } from '@/types';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';
import { SchedulePlottingModal, ScheduleFormData } from './SchedulePlottingModal';

const STORAGE_KEY = 'sauma_arena_schedule_matches';

export const SchedulePlottingTab: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) return JSON.parse(cached);
      } catch {
        // Fallback to default
      }
    }
    return initialMatches;
  });

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | MatchStatus>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; matchNumber: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const referees = PRESET_USERS.filter((u) => u.role === 'REFEREE');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
    } catch {
      // Storage quota or private mode fallback
    }
  }, [matches]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 1-Tap Quick Status Cycle: UPCOMING -> LIVE -> COMPLETED -> UPCOMING
  const handleQuickStatusCycle = (id: string, currentStatus: Match['status'], matchNum: number) => {
    const nextStatus: Match['status'] =
      currentStatus === 'UPCOMING' ? 'LIVE' : currentStatus === 'LIVE' ? 'COMPLETED' : 'UPCOMING';

    setMatches((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m))
    );

    const labelMap: Record<MatchStatus, string> = {
      LIVE: '🔴 LIVE (Sedang Berlangsung)',
      COMPLETED: '✓ Selesai',
      UPCOMING: 'Terjadwal',
      POSTPONED: 'Ditunda',
    };
    showToast(`Laga #${matchNum} dialihkan ke: ${labelMap[nextStatus]}`);
  };

  const handleOpenAdd = () => {
    setEditingMatch(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: Match) => {
    setEditingMatch(m);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, matchNumber: number) => {
    setDeleteTarget({ id, matchNumber });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setMatches((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      showToast(`Laga #${deleteTarget.matchNumber} berhasil dihapus.`);
      setDeleteTarget(null);
    }
  };

  const handleSubmit = (formData: ScheduleFormData) => {
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
      showToast(`Plotting Laga #${formData.matchNumber} diperbarui`);
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
      showToast(`Jadwal Laga #${formData.matchNumber} berhasil dibuat`);
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
    const matchStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchSearch && matchStage && matchStatus;
  });

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-5">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-medium flex items-center justify-between animate-fadeIn">
          <span>{toastMessage}</span>
          <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 font-barlow tracking-wider">Tersimpan Lokal</span>
        </div>
      )}

      {/* Filter and Actions Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            type="text"
            placeholder="Cari tim, no. laga, atau nama lapangan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
          />
        </div>

        {/* Quick Status Pill Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'LIVE', 'UPCOMING', 'COMPLETED'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-barlow font-bold uppercase tracking-wider transition-colors shrink-0 ${
                statusFilter === st
                  ? 'bg-[var(--color-arena-primary)] text-white'
                  : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {st === 'ALL' ? 'Semua' : st === 'LIVE' ? '🔴 Live' : st === 'UPCOMING' ? 'Terjadwal' : 'Selesai'}
            </button>
          ))}
        </div>

        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="px-3.5 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider"
        >
          <option value="ALL">Semua Babak</option>
          <option value="GROUP">Penyisihan Grup</option>
          <option value="QUARTER_FINAL">Perempat Final</option>
          <option value="SEMI_FINAL">Semifinal</option>
          <option value="FINAL">Grand Final</option>
        </select>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-tactile px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs shrink-0 min-h-[38px]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal</span>
        </button>
      </div>

      {/* Table CRUD with 1-Tap Status Switcher */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
        <table className="w-full text-xs text-left">
          <thead className="bg-[var(--bg-muted)]/70 text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
            <tr>
              <th className="py-3 px-4">Laga</th>
              <th className="py-3 px-4">Pertandingan</th>
              <th className="py-3 px-4">Lapangan &amp; Jam</th>
              <th className="py-3 px-4">Wasit / Juri</th>
              <th className="py-3 px-4 text-center">Status Cepat (1-Tap)</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-[var(--text-muted)]">
                  Tidak ada pertandingan yang sesuai kriteria pencarian.
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id} className="hover:bg-[var(--bg-muted)]/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-xs text-[var(--color-arena-primary)]">
                    #{m.matchNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[var(--text-main)]">{m.teamAName} vs {m.teamBName}</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-normal">{m.stage}</div>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <div className="font-semibold text-[var(--text-main)]">{m.courtName}</div>
                    <div className="font-mono tabular-nums text-[11px] text-[var(--text-muted)]">{m.scheduledTime} WITA</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[var(--text-main)]">
                    {m.assignedReferees?.[0]?.refereeName || referees[0]?.name}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {/* 1-Tap Quick Action Button */}
                    <button
                      type="button"
                      onClick={() => handleQuickStatusCycle(m.id, m.status, m.matchNumber)}
                      title="Klik 1 kali untuk ganti status: Terjadwal -> Live -> Selesai"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider transition-all shadow-xs ${
                        m.status === 'LIVE'
                          ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-400/50'
                          : m.status === 'COMPLETED'
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {m.status === 'LIVE' ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </span>
                          <span>LIVE</span>
                        </>
                      ) : m.status === 'COMPLETED' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>SELESAI</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>MULAI LAGA</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(m)}
                        title="Edit Detail Plotting"
                        className="p-2 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id, m.matchNumber)}
                        title="Hapus Pertandingan"
                        className="p-2 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-600 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
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
      <SchedulePlottingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMatch(null);
        }}
        onSubmit={handleSubmit}
        editingMatch={editingMatch}
        matchCount={matches.length}
        referees={referees}
      />

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

