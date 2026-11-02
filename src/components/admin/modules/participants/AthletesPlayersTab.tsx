'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, UserCheck, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { initialTeams } from '@/mocks/tournamentData';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';
import { usePersistentState } from '@/hooks/usePersistentState';
import { AthleteEditModal, FlattenedAthlete } from './AthleteEditModal';

export const AthletesPlayersTab: React.FC = () => {
  const allAthletes: FlattenedAthlete[] = useMemo(
    () =>
      initialTeams.flatMap((t) =>
        t.players.map((p) => ({
          ...p,
          teamId: t.id,
          teamName: t.name,
          schoolName: t.schoolName,
          group: t.group,
        }))
      ),
    []
  );

  const [athletesList, setAthletesList] = usePersistentState<FlattenedAthlete[]>(
    'sauma_arena_master_athletes',
    allAthletes
  );

  // Self-healing: jika dalam localStorage masih ada data dummy lama ("Pemain 1"), reset ke allAthletes
  useEffect(() => {
    if (athletesList.length === 0 || athletesList.some((a) => a.name.startsWith('Pemain '))) {
      setAthletesList(allAthletes);
    }
  }, [allAthletes, athletesList, setAthletesList]);

  const [search, setSearch] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('ALL');
  const [selectedDocFilter, setSelectedDocFilter] = useState('ALL');
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingAthlete, setEditingAthlete] = useState<FlattenedAthlete | null>(null);

  const filteredAthletes = useMemo(() => {
    return athletesList.filter((ath) => {
      const matchSearch =
        ath.name.toLowerCase().includes(search.toLowerCase()) ||
        (ath.nisn && ath.nisn.includes(search)) ||
        ath.teamName.toLowerCase().includes(search.toLowerCase());
      const matchTeam = selectedTeamFilter === 'ALL' || ath.teamId === selectedTeamFilter;
      const matchDoc = selectedDocFilter === 'ALL' || ath.documentStatus === selectedDocFilter;
      return matchSearch && matchTeam && matchDoc;
    });
  }, [athletesList, search, selectedTeamFilter, selectedDocFilter]);

  // Reset ke halaman 1 jika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedTeamFilter, selectedDocFilter, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredAthletes.length / pageSize));
  const paginatedAthletes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAthletes.slice(start, start + pageSize);
  }, [filteredAthletes, currentPage, pageSize]);

  const handleSaveEdit = (updated: {
    id: string;
    teamId: string;
    name: string;
    targetTeamId: string;
    number: number;
    position: string;
  }) => {
    const targetTeam = initialTeams.find((t) => t.id === updated.targetTeamId);
    setAthletesList((prev) =>
      prev.map((a) =>
        a.id === updated.id && a.teamId === updated.teamId
          ? {
              ...a,
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
    setEditingAthlete(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <AdminPageHeaderCard
        icon={UserCheck}
        category="DATABASE PESERTA • KONTINGEN RESMI"
        title="Database Pemain &amp; Atlet"
        description="Pusat data induk seluruh atlet terdaftar, nomor punggung, posisi bermain, verifikasi dokumen NISN, dan catatan disiplin kartu."
        action={
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-right">
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">Total Atlet</span>
              <span className="text-xl font-teko font-bold text-[var(--text-main)] leading-none">{athletesList.length} Atlet</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-right">
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">Dokumen Sah</span>
              <span className="text-xl font-teko font-bold text-emerald-600 leading-none">
                {athletesList.filter((a) => a.documentStatus === 'APPROVED').length} Atlet
              </span>
            </div>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            type="text"
            placeholder="Cari nama pemain, NISN, atau sekolah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
          />
        </div>

        {/* Filter Tim */}
        <select
          value={selectedTeamFilter}
          onChange={(e) => setSelectedTeamFilter(e.target.value)}
          className="w-full md:w-52 px-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider"
        >
          <option value="ALL">Semua Tim ({initialTeams.length})</option>
          {initialTeams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* Filter Status Berkas */}
        <select
          value={selectedDocFilter}
          onChange={(e) => setSelectedDocFilter(e.target.value)}
          className="w-full md:w-44 px-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider"
        >
          <option value="ALL">Semua Status Berkas</option>
          <option value="APPROVED">Berkas Sah (Approved)</option>
          <option value="PENDING">Menunggu Verifikasi</option>
          <option value="REJECTED">Ditolak</option>
        </select>

        {/* Filter Jumlah Data Yang Ditampilkan (10, 25, 50, 100) */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] whitespace-nowrap">
            Tampil:
          </span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider cursor-pointer"
          >
            <option value={10}>10 Data</option>
            <option value={25}>25 Data</option>
            <option value={50}>50 Data</option>
            <option value={100}>100 Data</option>
          </select>
        </div>
      </div>

      {/* Athletes Master Table */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs">
        <table className="w-full text-xs text-left">
          <thead className="bg-[var(--bg-muted)] text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
            <tr>
              <th className="py-3 px-4">No. Punggung</th>
              <th className="py-3 px-4">Nama Lengkap Atlet</th>
              <th className="py-3 px-4">Tim &amp; Sekolah</th>
              <th className="py-3 px-4 text-center">Posisi</th>
              <th className="py-3 px-4 text-center">NISN</th>
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
              paginatedAthletes.map((ath) => (
                <tr key={`${ath.teamId}-${ath.id}`} className="hover:bg-[var(--bg-muted)]/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-sm text-[var(--text-main)]">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                      #{ath.number}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-[var(--text-main)] text-sm">{ath.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[var(--color-arena-primary)]">{ath.teamName}</div>
                    <div className="text-[10px] text-[var(--text-muted)] truncate max-w-xs">{ath.schoolName}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-subtle)]">
                      {ath.position}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-[11px] text-[var(--text-muted)]">
                    {ath.nisn || '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 font-mono text-[11px]">
                      <span className="text-emerald-600 font-bold" title="Gol">{ath.goals || 0}G</span>
                      <span className="text-[var(--text-muted)]">&bull;</span>
                      <span className="text-amber-600 font-bold" title="Kartu Kuning">{ath.yellowCards || 0}K</span>
                      <span className="text-[var(--text-muted)]">&bull;</span>
                      <span className="text-red-600 font-bold" title="Kartu Merah">{ath.redCards || 0}M</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider ${
                        ath.documentStatus === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20'
                      }`}
                    >
                      {ath.documentStatus === 'APPROVED' ? '✓ Sah' : 'Menunggu'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setEditingAthlete(ath)}
                      className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors"
                      title="Edit Nama, Tim, No. Punggung &amp; Posisi"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
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
                className="p-1.5 px-3 rounded-xl border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-muted)] flex items-center gap-1 transition-colors"
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
                className="p-1.5 px-3 rounded-xl border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-muted)] flex items-center gap-1 transition-colors"
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
    </div>
  );
};
