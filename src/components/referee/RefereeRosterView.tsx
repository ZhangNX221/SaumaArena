'use client';

import React, { useState, useMemo } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  QrCode, 
  Check, 
  Search, 
  X, 
  RotateCcw, 
  ArrowRight,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { AthleteIdCard, Match, AppUser } from '@/types';
import { ATHLETE_ID_CARDS } from '@/mocks/multiSportData';

interface RefereeRosterViewProps {
  user?: AppUser;
  currentMatch?: Match;
  onGoToScoring?: () => void;
}

export const RefereeRosterView: React.FC<RefereeRosterViewProps> = ({
  user,
  currentMatch,
  onGoToScoring,
}) => {
  const [roster, setRoster] = useState<AthleteIdCard[]>(ATHLETE_ID_CARDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CHECKED' | 'UNCHECKED'>('ALL');
  const [scanNotice, setScanNotice] = useState<string | null>(null);

  // Hitungan kehadiran
  const checkedCount = roster.filter((r) => r.checkedIn).length;
  const uncheckCount = roster.length - checkedCount;

  // Toggle satu pemain
  const handleToggleCheckIn = (id: string, name: string) => {
    setRoster((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const next = !a.checkedIn;
          setScanNotice(
            next
              ? `Pemain diverifikasi hadir: ${name}`
              : `Status kehadiran dibatalkan: ${name}`
          );
          return { ...a, checkedIn: next };
        }
        return a;
      })
    );
    setTimeout(() => setScanNotice(null), 3000);
  };

  // Tandai semua hadir
  const handleCheckAll = () => {
    setRoster((prev) => prev.map((a) => ({ ...a, checkedIn: true })));
    setScanNotice('Semua pemain (10 orang) berhasil ditandai hadir.');
    setTimeout(() => setScanNotice(null), 3000);
  };

  // Reset semua kehadiran
  const handleResetAll = () => {
    setRoster((prev) => prev.map((a) => ({ ...a, checkedIn: false })));
    setScanNotice('Daftar kehadiran di-reset. Semua pemain belum hadir.');
    setTimeout(() => setScanNotice(null), 3000);
  };

  // Filter daftar pemain
  const filteredRoster = useMemo(() => {
    return roster.filter((athlete) => {
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'CHECKED' && athlete.checkedIn) ||
        (statusFilter === 'UNCHECKED' && !athlete.checkedIn);

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchStatus;

      const matchQuery =
        athlete.name.toLowerCase().includes(q) ||
        athlete.contingent.toLowerCase().includes(q) ||
        athlete.qrCode.toLowerCase().includes(q) ||
        athlete.athleteId.toLowerCase().includes(q);

      return matchStatus && matchQuery;
    });
  }, [roster, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#0D1E30] text-white border border-[#1C3B5B] transition-all duration-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#13273D] border border-[#1C3B5B] text-[#F6AE2D] text-[10px] font-barlow font-bold uppercase tracking-wider">
                <UserCheck className="w-3 h-3 text-[#F6AE2D]" />
                <span>Pemeriksaan Meja Wasit</span>
              </span>
              {currentMatch && (
                <span className="text-xs font-mono font-bold text-white/80 px-2.5 py-0.5 rounded-md bg-[#07131F] border border-[#1C3B5B]">
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
            <div className="px-4 py-2 rounded-xl bg-[#07131F] border border-[#1C3B5B] text-left min-w-[140px]">
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
                className="btn-tactile px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs"
              >
                <span>Catat Skor Laga</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Feedback Toast Notification */}
      {scanNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5 animate-fadeIn font-sans">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{scanNotice}</span>
        </div>
      )}

      {/* 3. Toolbar: Search, Status Filter & Mass Action Buttons */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama pemain, madrasah / tim, atau kode ID..."
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--color-arena-primary)] transition-all font-sans shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)]"
                aria-label="Bersihkan pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mass Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCheckAll}
              className="btn-tactile px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Semua Hadir</span>
            </button>
            <button
              type="button"
              onClick={handleResetAll}
              className="btn-tactile px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-red-500 text-xs font-barlow font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { key: 'ALL' as const, label: `Semua Pemain (${roster.length})` },
            { key: 'CHECKED' as const, label: `Hadir (${checkedCount})` },
            { key: 'UNCHECKED' as const, label: `Belum Hadir (${uncheckCount})` },
          ].map((pill) => {
            const isActive = statusFilter === pill.key;
            return (
              <button
                key={pill.key}
                type="button"
                onClick={() => setStatusFilter(pill.key)}
                className={`btn-tactile px-3.5 py-1.5 rounded-xl text-xs font-barlow font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-150 active:scale-95 shadow-xs ${
                  isActive
                    ? 'bg-[var(--color-arena-primary)] text-white'
                    : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Tabel Susunan Pemain Resmi */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1">
          <span className="font-sans">
            Menampilkan <strong className="text-[var(--text-main)]">{filteredRoster.length}</strong> dari {roster.length} pemain
          </span>
        </div>

        {filteredRoster.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <Filter className="w-7 h-7 text-[var(--text-faint)] mx-auto" />
            <h3 className="font-bebas text-lg text-[var(--text-main)] uppercase tracking-wide">
              Tidak Ada Pemain yang Cocok
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto font-sans">
              Coba gunakan kata kunci pencarian lain atau pilih filter status &quot;Semua Pemain&quot;.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs min-w-[680px]">
              <thead className="bg-[var(--bg-muted)]/70 text-[var(--text-muted)] uppercase text-[11px] font-barlow font-bold tracking-wider border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">Nama Pemain &amp; Kategori</th>
                  <th className="py-3.5 px-4">Tim / Madrasah</th>
                  <th className="py-3.5 px-4">Kode ID &amp; QR</th>
                  <th className="py-3.5 px-4 text-center w-36">Status Kehadiran</th>
                  <th className="py-3.5 px-4 text-right w-36">Aksi Wasit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] font-medium text-[var(--text-main)]">
                {filteredRoster.map((athlete, index) => (
                  <tr
                    key={athlete.id}
                    className="hover:bg-[var(--bg-muted)]/40 transition-colors group"
                  >
                    {/* No */}
                    <td className="py-3.5 px-4 text-center font-mono text-[var(--text-muted)]">
                      {index + 1}
                    </td>

                    {/* Atlet */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#07131F] text-[#F6AE2D] border border-[#1C3B5B] flex items-center justify-center font-bebas text-sm shrink-0">
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
                        className={`btn-tactile px-3.5 py-1.5 rounded-xl text-xs font-barlow font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all shadow-xs ${
                          athlete.checkedIn
                            ? 'bg-[var(--bg-muted)] hover:bg-red-500/10 hover:text-red-500 border border-[var(--border-subtle)] text-[var(--text-muted)]'
                            : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
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
