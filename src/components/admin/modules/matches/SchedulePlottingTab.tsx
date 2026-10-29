'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Play, CheckCircle2, RotateCcw, Radio } from 'lucide-react';
import { initialMatches } from '@/mocks/tournamentData';
import { PRESET_USERS } from '@/mocks/multiSportData';
import { Match, MatchStatus } from '@/types';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';
import { SchedulePlottingModal, ScheduleFormData } from './SchedulePlottingModal';
import { usePersistentState } from '@/hooks/usePersistentState';
import { pushMatchToBackend, fetchMatchesFromBackend } from '@/lib/apiSync';

export const SchedulePlottingTab: React.FC = () => {
  // Gunakan state tersinkronisasi terpusat dengan Meja Juri & Publik
  const [matches, setMatches] = usePersistentState<Match[]>('sauma_arena_matches', initialMatches);

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | MatchStatus>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; matchNumber: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const referees = PRESET_USERS.filter((u) => u.role === 'REFEREE');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  // Ambil data terbaru dari backend jika tersedia saat pertama kali dibuka
  useEffect(() => {
    fetchMatchesFromBackend().then((backendMatches) => {
      if (backendMatches && backendMatches.length > 0) {
        setMatches((prev) => {
          // Merge status dan skor terbaru dari database
          return prev.map((m) => {
            const be = backendMatches.find((b) => b.id === m.id);
            if (!be) return m;
            return {
              ...m,
              scoreA: be.scoreA ?? m.scoreA,
              scoreB: be.scoreB ?? m.scoreB,
              status: be.status ?? m.status,
            };
          });
        });
      }
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 1-Tap Quick Status Cycle: UPCOMING -> LIVE -> COMPLETED -> UPCOMING
  const handleQuickStatusCycle = (id: string, currentStatus: Match['status'], matchNum: number) => {
    const nextStatus: Match['status'] =
      currentStatus === 'UPCOMING' ? 'LIVE' : currentStatus === 'LIVE' ? 'COMPLETED' : 'UPCOMING';

    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const updated = { ...m, status: nextStatus };
        pushMatchToBackend(updated);
        return updated;
      })
    );

    const labelMap: Record<MatchStatus, string> = {
      LIVE: '🔴 LIVE (Sedang Berlangsung)',
      COMPLETED: '✓ Selesai',
      UPCOMING: 'Terjadwal',
      POSTPONED: 'Ditunda',
    };
    showToast(`Laga #${matchNum} dialihkan ke: ${labelMap[nextStatus]} & tersinkron ke Database`);
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
      fetch(`/api/matches/${deleteTarget.id}`, { method: 'DELETE' }).catch(() => {});
      showToast(`Laga #${deleteTarget.matchNumber} berhasil dihapus dari jadwal & database.`);
      setDeleteTarget(null);
    }
  };

  const handleSubmit = (formData: ScheduleFormData) => {
    if (editingMatch) {
      const updatedMatch: Match = {
        ...editingMatch,
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
      };

      setMatches((prev) =>
        prev.map((m) => (m.id === editingMatch.id ? updatedMatch : m))
      );
      pushMatchToBackend(updatedMatch);
      showToast(`Plotting Laga #${formData.matchNumber} diperbarui & tersinkron`);
    } else {
      const matchNum = Number(formData.matchNumber);
      const newMatch: Match = {
        id: `match-${matchNum || Date.now()}`,
        tournamentId: 'tourney-1',
        matchNumber: matchNum,
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
        venueName: 'Lapangan Futsal Seabless',
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
      fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchNo: matchNum,
          homeTeamId: newMatch.teamAId,
          awayTeamId: newMatch.teamBId,
          courtName: newMatch.courtName,
          scheduledAt: newMatch.scheduledTime,
          status: newMatch.status,
        }),
      }).catch(() => {});

      showToast(`Jadwal Laga #${formData.matchNumber} berhasil dibuat & tersimpan ke Database`);
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
    <div className="space-y-5 animate-fadeIn">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Tersinkron Database
          </span>
        </div>
      )}

      {/* Action & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Cari tim, no. laga, lapangan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 focus:bg-[var(--bg-surface)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-arena-primary)] transition-all font-sans"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--color-arena-primary)] font-barlow font-bold uppercase tracking-wider"
            >
              <option value="ALL">Semua Babak</option>
              <option value="GROUP">Penyisihan Grup</option>
              <option value="QUARTER">Perempat Final</option>
              <option value="SEMI">Semifinal</option>
              <option value="FINAL">Final</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--color-arena-primary)] font-barlow font-bold uppercase tracking-wider"
            >
              <option value="ALL">Semua Status</option>
              <option value="UPCOMING">Terjadwal</option>
              <option value="LIVE">Live</option>
              <option value="COMPLETED">Selesai</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-tactile px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] active:scale-[0.98] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all duration-150 cursor-pointer min-h-[38px]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal Laga</span>
        </button>
      </div>

      {/* Table Data */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/60 text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
              <th className="py-3 px-4 w-14">#Laga</th>
              <th className="py-3 px-4">Pertandingan Tim</th>
              <th className="py-3 px-4">Fase / Babak</th>
              <th className="py-3 px-4">Waktu &amp; Lapangan</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Skor</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] font-sans">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[var(--text-muted)]">
                  Tidak ada data pertandingan yang sesuai filter.
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-[var(--bg-muted)]/40 transition-colors duration-150"
                >
                  <td className="py-3 px-4 font-mono font-bold text-[var(--color-arena-primary)]">
                    #{m.matchNumber}
                  </td>
                  <td className="py-3 px-4 font-medium text-[var(--text-main)]">
                    <div className="font-bebas text-base uppercase tracking-wide">
                      {m.teamAName} <span className="text-[var(--color-arena-accent)]">vs</span> {m.teamBName}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] font-mono">
                      Wasit: {m.assignedReferees?.[0]?.refereeName || 'Belum diplot'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-[var(--bg-muted)] text-[var(--text-muted)] font-barlow font-bold uppercase text-[10px]">
                      {m.stage}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[var(--text-muted)]">
                    <div className="font-semibold text-[var(--text-main)]">{m.courtName}</div>
                    <div className="text-[11px] font-mono">{m.scheduledTime}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleQuickStatusCycle(m.id, m.status, m.matchNumber)}
                      title="Klik untuk ubah status secara cepat"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-barlow font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                        m.status === 'LIVE'
                          ? 'bg-red-500/15 text-red-600 dark:text-red-400 animate-pulse border border-red-500/30'
                          : m.status === 'COMPLETED'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                      }`}
                    >
                      {m.status === 'LIVE' ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                          <span>LIVE</span>
                        </>
                      ) : m.status === 'COMPLETED' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>SELESAI</span>
                        </>
                      ) : (
                        <span>TERJADWAL</span>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center font-scoreboard font-bold text-base text-[var(--text-main)]">
                    {m.scoreA} - {m.scoreB}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(m)}
                        title="Edit Detail Plotting"
                        className="p-2 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id, m.matchNumber)}
                        title="Hapus Pertandingan"
                        className="p-2 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-600 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
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
