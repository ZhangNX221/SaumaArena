'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Trophy,
  RefreshCw,
  CheckCircle2,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { StandingRow, Match } from '@/types';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';
import { StandingFormModal, StandingFormData } from './StandingFormModal';
import { usePersistentState } from '@/hooks/usePersistentState';
import { initialMatches } from '@/mocks/tournamentData';
import { recalculateGroupStandingsFromMatches, pushGroupStandingsToBackend } from '@/lib/apiSync';

const DEFAULT_GROUP_A_STANDINGS: StandingRow[] = [
  { rank: 1, teamId: 'team-sdi-kardina', teamName: 'SDI KARDINA MASSA (A1)', schoolName: 'SD Islam Kardina Massa Blitar', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 2, teamId: 'team-min7-blitar', teamName: 'MIN 7 BLITAR (A2)', schoolName: 'Madrasah Ibtidaiyah Negeri 7 Blitar', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 3, teamId: 'team-min8-blitar', teamName: 'MIN 8 BLITAR (A3)', schoolName: 'Madrasah Ibtidaiyah Negeri 8 Blitar', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
];

const DEFAULT_GROUP_B_STANDINGS: StandingRow[] = [
  { rank: 1, teamId: 'team-sdn1-srengat', teamName: 'UPT SDN 1 SRENGAT (B1)', schoolName: 'UPT SD Negeri 1 Srengat Blitar', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 2, teamId: 'team-min14-blitar', teamName: 'MIN 14 BLITAR (B2)', schoolName: 'Madrasah Ibtidaiyah Negeri 14 Blitar', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 3, teamId: 'team-mi-mambaululum', teamName: 'MI MAMBAUL ULUM BUNTARAN TULUNGAGUNG (B3)', schoolName: 'Madrasah Ibtidaiyah Mambaul Ulum Buntaran Tulungagung', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 4, teamId: 'team-min13-b', teamName: 'MIN 13 BLITAR A (B4)', schoolName: 'Madrasah Ibtidaiyah Negeri 13 Blitar', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
];

const DEFAULT_GROUP_C_STANDINGS: StandingRow[] = [
  { rank: 1, teamId: 'team-min2-blitar', teamName: 'MIN 2 BLITAR (C1)', schoolName: 'Madrasah Ibtidaiyah Negeri 2 Blitar', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 2, teamId: 'team-mi-wahidhasyim', teamName: 'MI WAHID HASYIM BAKUNG (C2)', schoolName: 'Madrasah Ibtidaiyah Wahid Hasyim Bakung', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 3, teamId: 'team-min13-c', teamName: 'MIN 13 BLITAR B (C3)', schoolName: 'Madrasah Ibtidaiyah Negeri 13 Blitar', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
];

const DEFAULT_GROUP_D_STANDINGS: StandingRow[] = [
  { rank: 1, teamId: 'team-min5-tulungagung', teamName: 'MIN 5 TULUNGAGUNG (D4)', schoolName: 'Madrasah Ibtidaiyah Negeri 5 Tulungagung', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 2, teamId: 'team-mi-ploso', teamName: 'MI PLOSO KEDIRI (D1)', schoolName: 'Madrasah Ibtidaiyah Ploso Kediri', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 3, teamId: 'team-mi-darussalam', teamName: 'MI UNGGULAN DARUSSALAM (D2)', schoolName: 'Madrasah Ibtidaiyah Unggulan Darussalam', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
  { rank: 4, teamId: 'team-mi-yabunaya', teamName: 'MI YAA BUNAYYA SRENGAT (D3)', schoolName: 'Madrasah Ibtidaiyah Yaa Bunayya Srengat Blitar', logoUrl: '/teams/default.png', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, supporterPoints: 100, points: 0, fairPlayScore: 10 },
];

export const GroupStandingsTab: React.FC = () => {
  const [groupA, setGroupA] = usePersistentState<StandingRow[]>('sauma_arena_standings_a', DEFAULT_GROUP_A_STANDINGS);
  const [groupB, setGroupB] = usePersistentState<StandingRow[]>('sauma_arena_standings_b', DEFAULT_GROUP_B_STANDINGS);
  const [groupC, setGroupC] = usePersistentState<StandingRow[]>('sauma_arena_standings_c', DEFAULT_GROUP_C_STANDINGS);
  const [groupD, setGroupD] = usePersistentState<StandingRow[]>('sauma_arena_standings_d', DEFAULT_GROUP_D_STANDINGS);
  const [matches] = usePersistentState<Match[]>('sauma_arena_matches', initialMatches);

  const [selectedGroup, setSelectedGroup] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [deleteTarget, setDeleteTarget] = useState<{ teamId: string; teamName: string } | null>(null);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const currentList =
    selectedGroup === 'A'
      ? groupA
      : selectedGroup === 'B'
      ? groupB
      : selectedGroup === 'C'
      ? groupC
      : groupD;

  const setCurrentList = (updater: React.SetStateAction<StandingRow[]>) => {
    if (selectedGroup === 'A') setGroupA(updater);
    else if (selectedGroup === 'B') setGroupB(updater);
    else if (selectedGroup === 'C') setGroupC(updater);
    else setGroupD(updater);
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<StandingRow | null>(null);

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

  // Sort standings by points desc, goalDiff desc, goalsFor desc, supporterPoints desc
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

        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Info Petunjuk Praktis untuk Orang Awam */}
      <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-[11px] text-[var(--text-muted)] flex items-start gap-2.5 leading-relaxed">
        <Info className="w-4 h-4 text-[var(--color-arena-primary)] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[var(--text-main)] block mb-0.5">
            Panduan Pengisian Nilai & Sinkronisasi Klasemen Real-Time:
          </span>
          Klik tombol pensil <Edit2 className="w-3 h-3 inline text-[var(--color-arena-primary)] mx-0.5" /> pada kolom <b>Aksi</b> untuk mengoreksi kemenangan atau gol tim. Sistem otomatis menghitung <b>Total Main (MN)</b>, <b>Selisih Gol (SG)</b>, dan <b>Total Poin (PTS)</b>. Perubahan langsung tampil di halaman publik seketika.
        </div>
      </div>

      {/* Table Standings CRUD */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
        <table className="w-full text-xs text-left">
          <thead className="bg-[var(--bg-muted)]/70 text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
            <tr>
              <th className="py-3.5 px-3.5 text-center" title="Peringkat">Pos</th>
              <th className="py-3.5 px-3.5">Klub / Sekolah</th>
              <th className="py-3.5 px-3 text-center" title="Main / Pertandingan Dimainkan">MN</th>
              <th className="py-3.5 px-3 text-center text-emerald-600 dark:text-emerald-400" title="Menang (+3 Poin)">M</th>
              <th className="py-3.5 px-3 text-center text-amber-600 dark:text-amber-400" title="Seri (+1 Poin)">S</th>
              <th className="py-3.5 px-3 text-center text-red-600 dark:text-red-400" title="Kalah (0 Poin)">K</th>
              <th className="py-3.5 px-3 text-center" title="Gol Memasukkan">GM</th>
              <th className="py-3.5 px-3 text-center" title="Gol Kemasukan">GK</th>
              <th className="py-3.5 px-3 text-center" title="Selisih Gol (GM - GK)">SG</th>
              <th className="py-3.5 px-3 text-center font-bold text-amber-600 dark:text-amber-400" title="Point Supporter">PS</th>
              <th className="py-3.5 px-3.5 text-center font-bold text-sm text-[var(--color-arena-primary)]" title="Total Poin Klasemen">PTS</th>
              <th className="py-3.5 px-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] font-medium">
            {sortedStandings.map((row, idx) => (
              <tr key={row.teamId} className="hover:bg-[var(--bg-muted)]/30 transition-colors">
                <td className="py-4 px-3.5 text-center font-barlow font-bold tabular-nums">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-teko font-bold tabular-nums ${
                      idx < 2 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-sm' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                </td>
                <td className="py-4 px-3.5 font-bold text-[var(--text-main)]">
                  <div>{row.teamName}</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-normal">{row.schoolName}</div>
                </td>
                <td className="py-4 px-3 text-center font-mono tabular-nums text-xs">{row.played}</td>
                <td className="py-4 px-3 text-center font-mono tabular-nums text-xs font-bold text-emerald-600 dark:text-emerald-400">{row.won}</td>
                <td className="py-4 px-3 text-center font-mono tabular-nums text-xs text-amber-600 dark:text-amber-400">{row.drawn}</td>
                <td className="py-4 px-3 text-center font-mono tabular-nums text-xs text-red-600 dark:text-red-400">{row.lost}</td>
                <td className="py-4 px-3 text-center font-mono tabular-nums text-xs">{row.goalsFor}</td>
                <td className="py-4 px-3 text-center font-mono tabular-nums text-xs">{row.goalsAgainst}</td>
                <td className="py-4 px-3 text-center font-mono tabular-nums text-xs font-bold">
                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                </td>
                <td className="py-4 px-3 text-center font-mono tabular-nums text-xs font-bold text-amber-600 dark:text-amber-400">
                  {row.supporterPoints ?? 0}
                </td>
                <td className="py-4 px-3.5 text-center font-teko font-bold text-lg tabular-nums text-[var(--color-arena-primary)]">
                  {row.points}
                </td>
                <td className="py-4 px-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(row)}
                      title="Koreksi Skor & Poin"
                      className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(row.teamId, row.teamName)}
                      title="Hapus dari Klasemen"
                      className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-600 transition-colors cursor-pointer"
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
