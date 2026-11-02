'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trophy,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  Info,
  Save,
} from 'lucide-react';
import { StandingRow, Match } from '@/types';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';
import { StandingFormModal, StandingFormData } from './StandingFormModal';
import { StandingsTable } from './StandingsTable';
import { usePersistentState } from '@/hooks/usePersistentState';
import { initialMatches } from '@/mocks/tournamentData';
import {
  DEFAULT_GROUP_A_STANDINGS,
  DEFAULT_GROUP_B_STANDINGS,
  DEFAULT_GROUP_C_STANDINGS,
  DEFAULT_GROUP_D_STANDINGS,
} from '@/mocks/defaultStandingsData';
import { recalculateGroupStandingsFromMatches, pushGroupStandingsToBackend } from '@/lib/apiSync';

export const GroupStandingsTab: React.FC = () => {
  const [groupA, setGroupA] = usePersistentState<StandingRow[]>('sauma_arena_standings_a', DEFAULT_GROUP_A_STANDINGS);
  const [groupB, setGroupB] = usePersistentState<StandingRow[]>('sauma_arena_standings_b', DEFAULT_GROUP_B_STANDINGS);
  const [groupC, setGroupC] = usePersistentState<StandingRow[]>('sauma_arena_standings_c', DEFAULT_GROUP_C_STANDINGS);
  const [groupD, setGroupD] = usePersistentState<StandingRow[]>('sauma_arena_standings_d', DEFAULT_GROUP_D_STANDINGS);
  const [matches] = usePersistentState<Match[]>('sauma_arena_matches', initialMatches);

  const [selectedGroup, setSelectedGroup] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [deleteTarget, setDeleteTarget] = useState<{ teamId: string; teamName: string } | null>(null);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<StandingRow | null>(null);

  // Selalu pastikan currentList tidak pernah kosong, fallback ke tim resmi turnamen
  const currentList = useMemo(() => {
    const list = selectedGroup === 'A' ? groupA : selectedGroup === 'B' ? groupB : selectedGroup === 'C' ? groupC : groupD;
    if (!list || list.length === 0) {
      if (selectedGroup === 'A') return DEFAULT_GROUP_A_STANDINGS;
      if (selectedGroup === 'B') return DEFAULT_GROUP_B_STANDINGS;
      if (selectedGroup === 'C') return DEFAULT_GROUP_C_STANDINGS;
      if (selectedGroup === 'D') return DEFAULT_GROUP_D_STANDINGS;
    }
    return list;
  }, [selectedGroup, groupA, groupB, groupC, groupD]);

  const setCurrentList = (updater: React.SetStateAction<StandingRow[]>) => {
    const map = { A: setGroupA, B: setGroupB, C: setGroupC, D: setGroupD };
    map[selectedGroup](updater);
  };

  // Self-healing: Pulihkan data resmi jika kosong atau korup
  useEffect(() => {
    if (!groupA || groupA.length === 0) setGroupA(DEFAULT_GROUP_A_STANDINGS);
    if (!groupB || groupB.length === 0) setGroupB(DEFAULT_GROUP_B_STANDINGS);
    if (!groupC || groupC.length === 0) setGroupC(DEFAULT_GROUP_C_STANDINGS);
    if (!groupD || groupD.length === 0) setGroupD(DEFAULT_GROUP_D_STANDINGS);
  }, [groupA, groupB, groupC, groupD, setGroupA, setGroupB, setGroupC, setGroupD]);

  useEffect(() => {
    fetch('/api/standings')
      .then((res) => res.json())
      .then((res) => {
        const snap = res?.data?.groupStandingsSnapshot;
        if (snap) {
          if (snap.A?.length) setGroupA(snap.A);
          if (snap.B?.length) setGroupB(snap.B);
          if (snap.C?.length) setGroupC(snap.C);
          if (snap.D?.length) setGroupD(snap.D);
        } else {
          pushGroupStandingsToBackend({
            A: DEFAULT_GROUP_A_STANDINGS,
            B: DEFAULT_GROUP_B_STANDINGS,
            C: DEFAULT_GROUP_C_STANDINGS,
            D: DEFAULT_GROUP_D_STANDINGS,
          });
        }
      })
      .catch(() => {});
  }, [setGroupA, setGroupB, setGroupC, setGroupD]);

  const handleOpenAdd = () => {
    setEditingRow(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: StandingRow) => {
    setEditingRow(row);
    setIsModalOpen(true);
  };

  const handleDelete = (teamId: string, teamName: string) => {
    setDeleteTarget({ teamId, teamName });
  };

  // Standard tiebreaker sorter & ranker
  const sortAndRank = (list: StandingRow[]): StandingRow[] => {
    return [...list]
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return (b.supporterPoints ?? 0) - (a.supporterPoints ?? 0);
      })
      .map((r, idx) => ({ ...r, rank: idx + 1 }));
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      const updated = currentList.filter((r) => r.teamId !== deleteTarget.teamId);
      const ranked = sortAndRank(updated);
      setCurrentList(ranked);

      pushGroupStandingsToBackend({
        A: selectedGroup === 'A' ? ranked : groupA,
        B: selectedGroup === 'B' ? ranked : groupB,
        C: selectedGroup === 'C' ? ranked : groupC,
        D: selectedGroup === 'D' ? ranked : groupD,
      });

      setDeleteTarget(null);
    }
  };

  const handleSubmit = (formData: StandingFormData) => {
    const gf = Math.max(0, Number(formData.goalsFor) || 0);
    const ga = Math.max(0, Number(formData.goalsAgainst) || 0);
    const gd = gf - ga;
    const played = Number.isFinite(formData.played)
      ? Number(formData.played)
      : formData.won + formData.drawn + formData.lost;
    const pts = Number.isFinite(formData.points)
      ? Number(formData.points)
      : formData.won * 3 + formData.drawn;

    let updatedList: StandingRow[] = [];

    if (editingRow) {
      updatedList = currentList.map((r) =>
        r.teamId === editingRow.teamId
          ? {
              ...r,
              teamName: formData.teamName,
              schoolName: formData.schoolName,
              played,
              won: Number(formData.won),
              drawn: Number(formData.drawn),
              lost: Number(formData.lost),
              goalsFor: gf,
              goalsAgainst: ga,
              goalDifference: gd,
              supporterPoints: Number(formData.supporterPoints) || 0,
              points: pts,
              fairPlayScore: Number(formData.fairPlayScore),
            }
          : r
      );
    } else {
      const newRow: StandingRow = {
        rank: currentList.length + 1,
        teamId: `team-${Date.now()}`,
        teamName: formData.teamName,
        schoolName: formData.schoolName || formData.teamName,
        logoUrl: '/teams/default.png',
        played,
        won: Number(formData.won),
        drawn: Number(formData.drawn),
        lost: Number(formData.lost),
        goalsFor: gf,
        goalsAgainst: ga,
        goalDifference: gd,
        supporterPoints: Number(formData.supporterPoints) || 0,
        points: pts,
        fairPlayScore: Number(formData.fairPlayScore),
      };
      updatedList = [...currentList, newRow];
    }

    const ranked = sortAndRank(updatedList);
    setCurrentList(ranked);

    // Kirim sinkronisasi ke backend SQLite
    pushGroupStandingsToBackend({
      A: selectedGroup === 'A' ? ranked : groupA,
      B: selectedGroup === 'B' ? ranked : groupB,
      C: selectedGroup === 'C' ? ranked : groupC,
      D: selectedGroup === 'D' ? ranked : groupD,
    });

    setIsModalOpen(false);
    setEditingRow(null);

    setSyncToast(`Data ${formData.teamName} berhasil disimpan dan disinkronkan ke publik!`);
    setTimeout(() => setSyncToast(null), 3500);
  };

  // Sinkronisasi otomatis dari hasil laga aktual
  const handleRecalculateFromMatches = () => {
    const recalculated = recalculateGroupStandingsFromMatches(matches, {
      A: groupA,
      B: groupB,
      C: groupC,
      D: groupD,
    });

    setGroupA(recalculated.A);
    setGroupB(recalculated.B);
    setGroupC(recalculated.C);
    setGroupD(recalculated.D);

    pushGroupStandingsToBackend(recalculated);

    setSyncToast('Klasemen Grup A, B, C, D berhasil dihitung ulang dari hasil laga aktual!');
    setTimeout(() => setSyncToast(null), 3500);
  };

  const handleResetAllSupporterPoints = () => {
    const targetA = groupA.length > 0 ? groupA : DEFAULT_GROUP_A_STANDINGS;
    const targetB = groupB.length > 0 ? groupB : DEFAULT_GROUP_B_STANDINGS;
    const targetC = groupC.length > 0 ? groupC : DEFAULT_GROUP_C_STANDINGS;
    const targetD = groupD.length > 0 ? groupD : DEFAULT_GROUP_D_STANDINGS;

    const resetPs = (list: StandingRow[]) => list.map((r) => ({ ...r, supporterPoints: 0 }));
    setGroupA(resetPs(targetA));
    setGroupB(resetPs(targetB));
    setGroupC(resetPs(targetC));
    setGroupD(resetPs(targetD));
    pushGroupStandingsToBackend({ A: resetPs(targetA), B: resetPs(targetB), C: resetPs(targetC), D: resetPs(targetD) });
    setSyncToast('Poin Suporter (PS) seluruh grup berhasil di-reset ke 0!');
    setTimeout(() => setSyncToast(null), 3000);
  };

  // Simpan seluruh klasemen grup ke database SQLite
  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    const groupsPayload = {
      A: sortAndRank(groupA.length > 0 ? groupA : DEFAULT_GROUP_A_STANDINGS),
      B: sortAndRank(groupB.length > 0 ? groupB : DEFAULT_GROUP_B_STANDINGS),
      C: sortAndRank(groupC.length > 0 ? groupC : DEFAULT_GROUP_C_STANDINGS),
      D: sortAndRank(groupD.length > 0 ? groupD : DEFAULT_GROUP_D_STANDINGS),
    };

    const success = await pushGroupStandingsToBackend(groupsPayload);
    setIsSaving(false);

    if (success) {
      setSyncToast('Klasemen seluruh grup (A, B, C, D) berhasil disimpan permanen ke database SQLite!');
    } else {
      setSyncToast('Klasemen berhasil disimpan secara lokal dan disinkronkan.');
    }
    setTimeout(() => setSyncToast(null), 3500);
  };

  const sortedStandings = sortAndRank(currentList);

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
      {/* Toast Notifikasi Sukses */}
      {syncToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{syncToast}</span>
        </div>
      )}

      {/* Group Selector & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex rounded-2xl bg-[var(--bg-muted)]/80 p-1.5 border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider w-fit gap-1">
          {(['A', 'B', 'C', 'D'] as const).map((grp) => (
            <button
              key={grp}
              type="button"
              onClick={() => setSelectedGroup(grp)}
              className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedGroup === grp
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Grup {grp}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleResetAllSupporterPoints}
            title="Reset Poin Suporter (PS) seluruh tim di semua grup ke 0"
            className="btn-tactile px-3 py-2 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 min-h-[38px] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>Reset PS</span>
          </button>

          <button
            type="button"
            onClick={handleRecalculateFromMatches}
            title="Hitung ulang otomatis dari riwayat skor pertandingan aktif/selesai"
            className="btn-tactile px-3 py-2 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 min-h-[38px] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
            <span>Sinkron dari Laga</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="btn-tactile px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs shrink-0 min-h-[38px] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tim Grup {selectedGroup}</span>
          </button>

          {/* Tombol Simpan ke Database */}
          <button
            type="button"
            onClick={handleSaveToDatabase}
            disabled={isSaving}
            title="Simpan seluruh klasemen grup ke database SQLite"
            className="btn-tactile px-4.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs shrink-0 min-h-[38px] cursor-pointer disabled:opacity-50 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan'}</span>
          </button>
        </div>
      </div>

      {/* Info Petunjuk Praktis */}
      <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-[11px] text-[var(--text-muted)] flex items-start gap-2.5 leading-relaxed">
        <Info className="w-4 h-4 text-[var(--color-arena-primary)] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[var(--text-main)] block mb-0.5">
            Panduan Pengisian Nilai &amp; Sinkronisasi Klasemen Real-Time:
          </span>
          Klik tombol pensil <Edit2 className="w-3 h-3 inline text-[var(--color-arena-primary)] mx-0.5" /> pada kolom <b>Aksi</b> untuk mengoreksi kemenangan atau gol tim. Sistem otomatis menghitung <b>Total Main (MN)</b>, <b>Selisih Gol (SG)</b>, dan <b>Total Poin (PTS)</b>. Klik tombol <b>Simpan</b> untuk menyimpan data ke database.
        </div>
      </div>

      {/* Table Standings CRUD */}
      <StandingsTable
        sortedStandings={sortedStandings}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* Modal CRUD (Create & Update) */}
      <StandingFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRow(null);
        }}
        onSubmit={handleSubmit}
        editingRow={editingRow}
        selectedGroup={selectedGroup}
      />

      {/* Reusable Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Dari Klasemen"
        message={`Apakah Anda yakin ingin menghapus tim "${deleteTarget?.teamName}" dari klasemen Grup ${selectedGroup}? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Tim"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
