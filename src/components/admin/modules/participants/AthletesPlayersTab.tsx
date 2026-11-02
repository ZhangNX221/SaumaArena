'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { UserCheck, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { initialTeams } from '@/mocks/tournamentData';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';
import { usePersistentState } from '@/hooks/usePersistentState';
import { AthleteEditModal } from './AthleteEditModal';
import { AthleteMasterTableRow } from './AthleteMasterTableRow';
import { AthleteFilterToolbar } from './AthleteFilterToolbar';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';
import { fetchAthletesFromBackend, pushAthleteToBackend, deleteAthleteFromBackend } from '@/lib/athleteSync';
import { Team, FlattenedAthlete, STORAGE_KEY_TEAMS, STORAGE_KEY_MASTER_ATHLETES } from '@/types';

export const AthletesPlayersTab: React.FC = () => {
  const allAthletesFallback: FlattenedAthlete[] = useMemo(() => {
    let counter = 1;
    return initialTeams.flatMap((t) =>
      t.players.map((p) => ({
        ...p,
        athleteCode: p.athleteCode || `ATL-${String(counter++).padStart(3, '0')}`,
        teamId: t.id,
        teamName: t.name,
        schoolName: t.schoolName,
        group: t.group,
      }))
    );
  }, []);

  const [athletesList, setAthletesList] = usePersistentState<FlattenedAthlete[]>(
    STORAGE_KEY_MASTER_ATHLETES,
    allAthletesFallback
  );
  const [, setTeams] = usePersistentState<Team[]>(STORAGE_KEY_TEAMS, initialTeams);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [editingAthlete, setEditingAthlete] = useState<FlattenedAthlete | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FlattenedAthlete | null>(null);

  // 1. Sinkronisasi Data Atlet dari SQLite Database Backend saat pertama kali dimuat
  useEffect(() => {
    let isMounted = true;
    fetchAthletesFromBackend().then((backendAthletes) => {
      if (!isMounted) return;
      if (backendAthletes && Array.isArray(backendAthletes) && backendAthletes.length > 0) {
        setAthletesList((prev) => {
          const prevMap = new Map(prev.map((a) => [a.id, a]));
          return backendAthletes.map((remote) => {
            const local = prevMap.get(remote.id);
            return {
              ...remote,
              // Pertahankan statistik kartu & gol dari juri / remote
              goals: Math.max(Number(local?.goals || 0), Number(remote.goals || 0)),
              yellowCards: Math.max(Number(local?.yellowCards || 0), Number(remote.yellowCards || 0)),
              redCards: Math.max(Number(local?.redCards || 0), Number(remote.redCards || 0)),
              assists: Math.max(Number(local?.assists || 0), Number(remote.assists || 0)),
            };
          });
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [setAthletesList]);

  // 2. Isi ID Khusus (athleteCode) hanya bagi atlet yang belum memiliki kode
  useEffect(() => {
    let hasMissingCode = false;
    let codeIndex = 1;

    const sanitized = athletesList.map((a) => {
      if (!a.athleteCode || a.athleteCode.trim() === '') {
        hasMissingCode = true;
        return {
          ...a,
          athleteCode: `ATL-${String(codeIndex++).padStart(3, '0')}`,
        };
      }
      codeIndex++;
      return a;
    });

    if (hasMissingCode) {
      setAthletesList(sanitized);
    }
  }, [athletesList, setAthletesList]);

  const [search, setSearch] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('ALL');
  const [selectedDocFilter, setSelectedDocFilter] = useState('ALL');
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredAthletes = useMemo(() => {
    return athletesList.filter((ath) => {
      const matchSearch =
        (ath.athleteCode && ath.athleteCode.toLowerCase().includes(search.toLowerCase())) ||
        ath.name.toLowerCase().includes(search.toLowerCase()) ||
        ath.teamName.toLowerCase().includes(search.toLowerCase()) ||
        (ath.schoolName && ath.schoolName.toLowerCase().includes(search.toLowerCase()));
      const matchTeam = selectedTeamFilter === 'ALL' || ath.teamId === selectedTeamFilter;
      const matchDoc = selectedDocFilter === 'ALL' || ath.documentStatus === selectedDocFilter;
      return matchSearch && matchTeam && matchDoc;
    });
  }, [athletesList, search, selectedTeamFilter, selectedDocFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedTeamFilter, selectedDocFilter, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredAthletes.length / pageSize));
  const paginatedAthletes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAthletes.slice(start, start + pageSize);
  }, [filteredAthletes, currentPage, pageSize]);

  // 3. Simpan perubahan ke State Lokal & Simpan Permanen ke SQLite Database
  const handleSaveEdit = async (updated: {
    id: string;
    teamId: string;
    name: string;
    targetTeamId: string;
    number: number;
    position: string;
    athleteCode: string;
  }) => {
    const targetTeam = initialTeams.find((t) => t.id === updated.targetTeamId);

    setAthletesList((prev) =>
      prev.map((a) =>
        a.id === updated.id
          ? {
              ...a,
              athleteCode: updated.athleteCode,
              name: updated.name,
              teamId: updated.targetTeamId,
              teamName: targetTeam ? targetTeam.name : a.teamName,
              schoolName: targetTeam ? targetTeam.schoolName : a.schoolName,
              group: targetTeam ? targetTeam.group : a.group,
              number: updated.number,
              position: updated.position,
            }
          : a
      )
    );

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === updated.teamId || t.id === updated.targetTeamId) {
          const newPlayers = t.players.map((p) => {
            if (p.id === updated.id) {
              return {
                ...p,
                name: updated.name,
                number: updated.number,
                position: updated.position,
                athleteCode: updated.athleteCode,
              };
            }
            return p;
          });
          return { ...t, players: newPlayers };
        }
        return t;
      })
    );

    await pushAthleteToBackend({
      id: updated.id,
      name: updated.name,
      teamId: updated.targetTeamId,
      number: updated.number,
      position: updated.position,
      athleteCode: updated.athleteCode,
    });

    setToastMsg(`✓ Data atlet ${updated.name} (${updated.athleteCode}) berhasil tersimpan di database.`);
    setTimeout(() => setToastMsg(null), 3500);
    setEditingAthlete(null);
  };

  // 4. Hapus Atlet dari Master Data & SQLite Database
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;

    setAthletesList((prev) =>
      prev.filter((a) => a.id !== target.id)
    );

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === target.teamId) {
          return { ...t, players: t.players.filter((p) => p.id !== target.id) };
        }
        return t;
      })
    );

    await deleteAthleteFromBackend(target.id);

    setToastMsg(`✓ Atlet ${target.name} (${target.athleteCode}) berhasil dihapus dari database.`);
    setTimeout(() => setToastMsg(null), 3500);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-2 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <AdminPageHeaderCard
        icon={UserCheck}
        category="DATABASE PESERTA • KONTINGEN RESMI"
        title="Database Pemain & Atlet"
        description="Pusat data induk seluruh atlet terdaftar, ID khusus atlet, nomor punggung, posisi bermain, dan riwayat disiplin kartu."
        action={
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-right">
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Total Atlet
              </span>
              <span className="text-xl font-teko font-bold text-[var(--text-main)] leading-none">
                {athletesList.length} Atlet
              </span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-right">
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
                Dokumen Sah
              </span>
              <span className="text-xl font-teko font-bold text-emerald-600 leading-none">
                {athletesList.filter((a) => a.documentStatus === 'APPROVED').length} Atlet
              </span>
            </div>
          </div>
        }
      />

      {/* Filter Toolbar Subcomponent */}
      <AthleteFilterToolbar
        search={search}
        onSearchChange={setSearch}
        selectedTeamFilter={selectedTeamFilter}
        onTeamFilterChange={setSelectedTeamFilter}
        selectedDocFilter={selectedDocFilter}
        onDocFilterChange={setSelectedDocFilter}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      {/* Athletes Master Table */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs">
        <table className="w-full text-xs text-left">
          <thead className="bg-[var(--bg-muted)] text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
            <tr>
              <th className="py-3 px-4 font-mono">ID Atlet</th>
              <th className="py-3 px-4 text-center">No. Jersey</th>
              <th className="py-3 px-4">Nama Lengkap Atlet</th>
              <th className="py-3 px-4">Tim &amp; Sekolah</th>
              <th className="py-3 px-4 text-center">Posisi</th>
              <th className="py-3 px-4 text-center">Gol / Kartu</th>
              <th className="py-3 px-4 text-center">Status Berkas</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] font-medium">
            {paginatedAthletes.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-[var(--text-muted)]">
                  Tidak ada atlet yang cocok dengan filter pencarian.
                </td>
              </tr>
            ) : (
              paginatedAthletes.map((ath, idx) => (
                <AthleteMasterTableRow
                  key={`${ath.teamId}-${ath.id}`}
                  ath={ath}
                  idx={idx}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onEdit={setEditingAthlete}
                  onDelete={setDeleteTarget}
                />
              ))
            )}
          </tbody>
        </table>

        {/* Table Footer with Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-muted)]/30">
          <div className="text-xs text-[var(--text-muted)]">
            Menampilkan{' '}
            <span className="font-bold text-[var(--text-main)]">
              {filteredAthletes.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>
            {' '}-{' '}
            <span className="font-bold text-[var(--text-main)]">
              {Math.min(currentPage * pageSize, filteredAthletes.length)}
            </span>
            {' '}dari{' '}
            <span className="font-bold text-[var(--text-main)]">{filteredAthletes.length}</span> total atlet
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 px-3 rounded-xl border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-muted)] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>
              <span className="text-xs font-mono px-2 text-[var(--text-muted)]">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 px-3 rounded-xl border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-muted)] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal Component */}
      {editingAthlete && (
        <AthleteEditModal
          athlete={editingAthlete}
          onClose={() => setEditingAthlete(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Hapus Data Atlet"
        message={`Apakah Anda yakin ingin menghapus atlet "${deleteTarget?.name}" (${deleteTarget?.athleteCode || ''}) dari kontingen ${deleteTarget?.teamName || ''}? Data yang dihapus akan terhapus dari daftar pemain dan database.`}
        confirmLabel="Ya, Hapus Atlet"
        cancelLabel="Batal"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
