'use client';

import React, { useState } from 'react';
import { Search, UserCheck, ShieldCheck, Filter, AlertCircle, Edit2, X, Plus } from 'lucide-react';
import { initialTeams } from '@/mocks/tournamentData';
import { Player } from '@/types';
import { ModalPortal } from '@/components/common/ModalPortal';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';

interface FlattenedAthlete extends Player {
  teamId: string;
  teamName: string;
  schoolName?: string;
  group?: string;
}

export const AthletesPlayersTab: React.FC = () => {
  const allAthletes: FlattenedAthlete[] = initialTeams.flatMap((t) =>
    t.players.map((p) => ({
      ...p,
      teamId: t.id,
      teamName: t.name,
      schoolName: t.schoolName,
      group: t.group,
    }))
  );

  const [athletesList, setAthletesList] = useState<FlattenedAthlete[]>(allAthletes);
  const [search, setSearch] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('ALL');
  const [selectedDocFilter, setSelectedDocFilter] = useState('ALL');

  // Edit Player Modal state
  const [editingAthlete, setEditingAthlete] = useState<FlattenedAthlete | null>(null);
  const [editNumber, setEditNumber] = useState<number>(0);
  const [editPosition, setEditPosition] = useState<string>('');

  const filteredAthletes = athletesList.filter((ath) => {
    const matchSearch =
      ath.name.toLowerCase().includes(search.toLowerCase()) ||
      (ath.nisn && ath.nisn.includes(search)) ||
      ath.teamName.toLowerCase().includes(search.toLowerCase());
    const matchTeam = selectedTeamFilter === 'ALL' || ath.teamId === selectedTeamFilter;
    const matchDoc = selectedDocFilter === 'ALL' || ath.documentStatus === selectedDocFilter;
    return matchSearch && matchTeam && matchDoc;
  });

  const handleOpenEdit = (ath: FlattenedAthlete) => {
    setEditingAthlete(ath);
    setEditNumber(ath.number);
    setEditPosition(ath.position);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAthlete) return;
    setAthletesList((prev) =>
      prev.map((a) =>
        a.id === editingAthlete.id && a.teamId === editingAthlete.teamId
          ? { ...a, number: editNumber, position: editPosition }
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
              <span className="text-xl font-teko font-bold text-[var(--text-main)] leading-none">{allAthletes.length} Atlet</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-right">
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">Dokumen Sah</span>
              <span className="text-xl font-teko font-bold text-emerald-600 leading-none">
                {allAthletes.filter((a) => a.documentStatus === 'APPROVED').length} Atlet
              </span>
            </div>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col sm:flex-row items-center gap-3">
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

        <select
          value={selectedTeamFilter}
          onChange={(e) => setSelectedTeamFilter(e.target.value)}
          className="w-full sm:w-56 px-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider"
        >
          <option value="ALL">Semua Tim ({initialTeams.length})</option>
          {initialTeams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          value={selectedDocFilter}
          onChange={(e) => setSelectedDocFilter(e.target.value)}
          className="w-full sm:w-44 px-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider"
        >
          <option value="ALL">Semua Status Berkas</option>
          <option value="APPROVED">Berkas Sah (Approved)</option>
          <option value="PENDING">Menunggu Verifikasi</option>
          <option value="REJECTED">Ditolak</option>
        </select>
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
            {filteredAthletes.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-[var(--text-muted)]">
                  Tidak ada atlet yang cocok dengan filter pencarian.
                </td>
              </tr>
            ) : (
              filteredAthletes.map((ath) => (
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
                      onClick={() => handleOpenEdit(ath)}
                      className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors"
                      title="Edit No. Punggung & Posisi"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingAthlete && (
        <ModalPortal>
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
            onClick={() => setEditingAthlete(null)}
          >
            <div
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="font-bebas text-xl uppercase tracking-wide text-[var(--text-main)]">
                  Edit Data Pemain
                </h3>
                <p className="text-xs text-[var(--text-muted)]">{editingAthlete.name} &bull; {editingAthlete.teamName}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingAthlete(null)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Nomor Punggung (Jersey)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={99}
                  value={editNumber}
                  onChange={(e) => setEditNumber(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Posisi Bermain
                </label>
                <input
                  type="text"
                  required
                  value={editPosition}
                  onChange={(e) => setEditPosition(e.target.value)}
                  placeholder="Kiper / Flank / Pivot / Anchor / Striker"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAthlete(null)}
                  className="btn-tactile px-4 py-2 rounded-xl border border-[var(--border-subtle)] font-barlow font-bold uppercase tracking-wider text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-tactile px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold uppercase tracking-wider text-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      </ModalPortal>
    )}
    </div>
  );
};
