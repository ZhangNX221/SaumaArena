'use client';

import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  CheckCircle2,
  Search,
  Filter,
  Check,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import { AppUser, Match, AthleteIdCard } from '@/types';
import { ATHLETE_ID_CARDS } from '@/mocks/multiSportData';
import { usePersistentState } from '@/hooks/usePersistentState';

interface RefereeRosterViewProps {
  user: AppUser;
  currentMatch?: Match;
  onGoToScoring?: () => void;
}

export const RefereeRosterView: React.FC<RefereeRosterViewProps> = ({
  user,
  currentMatch,
  onGoToScoring,
}) => {
  const [roster, setRoster] = usePersistentState<AthleteIdCard[]>(
    'sauma_arena_athletes_roster',
    ATHLETE_ID_CARDS
  );

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CHECKED_IN' | 'NOT_YET'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const handleToggleCheckIn = (id: string, name: string) => {
    setRoster((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = !a.checkedIn;
          setFeedbackNotice(
            updated
              ? `✓ Atlet ${name} terverifikasi hadir.`
              : `Status kehadiran ${name} dibatalkan.`
          );
          setTimeout(() => setFeedbackNotice(null), 3000);
          return { ...a, checkedIn: updated };
        }
        return a;
      })
    );
  };

  const handleMarkAllMatchAthletes = () => {
    setRoster((prev) =>
      prev.map((a) => ({
        ...a,
        checkedIn: true,
      }))
    );
    setFeedbackNotice('Semua atlet dalam daftar telah ditandai hadir.');
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  const checkedCount = useMemo(() => roster.filter((a) => a.checkedIn).length, [roster]);

  const filteredRoster = useMemo(() => {
    return roster.filter((a) => {
      const matchStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'CHECKED_IN'
          ? a.checkedIn
          : !a.checkedIn;

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.contingent.toLowerCase().includes(q) ||
        a.athleteId.toLowerCase().includes(q);

      return matchStatus && matchQuery;
    });
  }, [roster, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#071F14] text-white border border-emerald-900/40 shadow-xs transition-all duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#04120C] border border-[#143D28] text-[var(--color-arena-accent)] text-[10px] font-barlow font-bold uppercase tracking-wider">
                <UserCheck className="w-3 h-3 text-[var(--color-arena-accent)]" />
                <span>Pemeriksaan Meja Wasit</span>
              </span>
              {currentMatch && (
                <span className="text-xs font-mono font-bold text-white/80 px-2.5 py-0.5 rounded-md bg-[#04120C] border border-[#143D28]">
                  Laga #{currentMatch.matchNumber} &bull; {currentMatch.courtName || 'Lapangan Utama'}
                </span>
              )}
            </div>

            <h1 className="font-bebas text-3xl sm:text-4xl tracking-wide uppercase text-white leading-none">
              SUSUNAN PEMAIN &amp; VERIFIKASI KEHADIRAN
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-sans">
              Verifikasi kelayakan berkas, kartu identitas, dan kehadiran fisik pemain sebelum peluit sepak mula dibunyikan oleh wasit meja.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-xl bg-[#04120C] border border-[#143D28] text-left min-w-[140px]">
              <div className="text-[10px] font-barlow font-bold uppercase tracking-wider text-slate-400">
                Total Kehadiran
              </div>
              <div className="text-2xl font-scoreboard font-bold text-emerald-400 leading-tight">
                {checkedCount} <span className="text-sm font-sans text-slate-400 font-normal">/ {roster.length} Hadir</span>
              </div>
            </div>

            {onGoToScoring && (
              <button
                type="button"
                onClick={onGoToScoring}
                className="btn-tactile px-4 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] active:scale-95 text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <span>Catat Skor Laga</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackNotice && (
        <div className="p-3.5 rounded-xl bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] border border-[var(--color-arena-primary)]/20 font-semibold text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[var(--color-arena-primary)]" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* 2. Control Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama atlet, tim, atau ID berkas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:border-[var(--color-arena-primary)] transition-colors min-h-[42px]"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`btn-tactile px-3 py-1.5 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Semua ({roster.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('CHECKED_IN')}
              className={`btn-tactile px-3 py-1.5 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                statusFilter === 'CHECKED_IN'
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Hadir ({checkedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('NOT_YET')}
              className={`btn-tactile px-3 py-1.5 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                statusFilter === 'NOT_YET'
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Belum ({roster.length - checkedCount})
            </button>
          </div>

          <button
            type="button"
            onClick={handleMarkAllMatchAthletes}
            className="btn-tactile px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 min-h-[42px] cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Tandai Semua Hadir</span>
          </button>
        </div>
      </div>

      {/* 3. Athletes Roster Table */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
        {filteredRoster.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Filter className="w-8 h-8 text-[var(--text-faint)] mx-auto opacity-50" />
            <h4 className="font-bebas text-lg text-[var(--text-main)] uppercase tracking-wide">
              Tidak Ada Atlet Ditemukan
            </h4>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto font-sans">
              Tidak ada atlet yang cocok dengan filter atau kata kunci pencarian yang dimasukkan.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-[var(--bg-muted)]/70 text-[var(--text-muted)] uppercase text-[11px] font-barlow font-bold tracking-wider border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">Nama Atlet &amp; Cabor</th>
                  <th className="py-3.5 px-4">Kontingen / Sekolah</th>
                  <th className="py-3.5 px-4">Kode QR ID</th>
                  <th className="py-3.5 px-4 text-center">Status Verifikasi</th>
                  <th className="py-3.5 px-4 text-right">Aksi Meja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] font-medium text-[var(--text-main)]">
                {filteredRoster.map((athlete, index) => (
                  <tr
                    key={athlete.id}
                    className={`hover:bg-[var(--bg-muted)]/30 transition-colors ${
                      athlete.checkedIn ? 'bg-emerald-500/5' : ''
                    }`}
                  >
                    {/* No */}
                    <td className="py-3.5 px-4 text-center font-mono text-[var(--text-muted)]">
                      {index + 1}
                    </td>

                    {/* Atlet */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#04120C] text-[var(--color-arena-accent)] border border-[#143D28] flex items-center justify-center font-bebas text-sm shrink-0">
                          {athlete.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-barlow font-bold text-sm text-[var(--text-main)] truncate leading-tight">
                            {athlete.name}
                          </div>
                          <span className="text-[10px] text-[var(--text-muted)] font-sans">
                            {athlete.category} &bull; {athlete.sport}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Tim */}
                    <td className="py-3.5 px-4">
                      <div className="font-barlow font-semibold text-xs text-[var(--text-main)]">
                        {athlete.contingent}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono">
                        {athlete.athleteId}
                      </div>
                    </td>

                    {/* QR Code */}
                    <td className="py-3.5 px-4 font-mono text-xs">
                      <span className="px-2 py-0.5 rounded bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                        {athlete.qrCode}
                      </span>
                    </td>

                    {/* Status Kehadiran */}
                    <td className="py-3.5 px-4 text-center">
                      {athlete.checkedIn ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 text-[11px] font-barlow font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>Hadir</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 text-[11px] font-barlow font-bold uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          <span>Belum Hadir</span>
                        </span>
                      )}
                    </td>

                    {/* Aksi Verifikasi */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleCheckIn(athlete.id, athlete.name)}
                        className={`btn-tactile px-3.5 py-1.5 rounded-xl text-xs font-barlow font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                          athlete.checkedIn
                            ? 'bg-[var(--bg-muted)] hover:bg-red-500/10 hover:text-red-500 border border-[var(--border-subtle)] text-[var(--text-muted)]'
                            : 'bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white'
                        }`}
                        aria-label={`Ubah kehadiran ${athlete.name}`}
                      >
                        {athlete.checkedIn ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Batal</span>
                          </>
                        ) : (
                          <>
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Scan QR</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
