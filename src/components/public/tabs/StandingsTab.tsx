'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronLeft, ChevronRight, ListOrdered, ShieldCheck } from 'lucide-react';
import { getTeamLogoUrl } from '@/mocks/teamLogos';
import { SportCode } from '@/types';
import { PublicPageHeader } from '../layout/PublicPageHeader';

interface StandingRow {
  rank: number;
  teamId: string;
  teamName: string;
  logoUrl: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  sp: number; // Supporter Points (Poin Suporter)
  points: number;
  isQualified: boolean;
}

interface GroupStandingData {
  groupName: string;
  rows: StandingRow[];
}

interface StandingsTabProps {
  sportCode?: SportCode;
}

export const StandingsTab: React.FC<StandingsTabProps> = ({ sportCode = 'FUTSAL' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const TABLES_PER_PAGE = 10;

  // Data klasemen Futsal Resmi (Grup A, B, C, D)
  const standingsA: GroupStandingData = {
    groupName: 'Grup A',
    rows: [
      { rank: 1, teamId: 'team-sdi-kardina', teamName: 'SDI KARDINA MASSA (A1)', logoUrl: getTeamLogoUrl('team-sdi-kardina'), played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, sp: 100, points: 0, isQualified: false },
      { rank: 2, teamId: 'team-min7-blitar', teamName: 'MIN 7 BLITAR (A2)', logoUrl: getTeamLogoUrl('team-min7-blitar'), played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, sp: 100, points: 0, isQualified: false },
      { rank: 3, teamId: 'team-min8-blitar', teamName: 'MIN 8 BLITAR (A3)', logoUrl: getTeamLogoUrl('team-min8-blitar'), played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, sp: 100, points: 0, isQualified: false },
    ],
  };

  const standingsB: GroupStandingData = {
    groupName: 'Grup B',
    rows: [
      { rank: 1, teamId: 'team-sdn1-srengat', teamName: 'UPT SDN 1 SRENGAT (B1)', logoUrl: getTeamLogoUrl('team-sdn1-srengat'), played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, sp: 100, points: 0, isQualified: false },
      { rank: 2, teamId: 'team-min14-blitar', teamName: 'MIN 14 BLITAR (B2)', logoUrl: getTeamLogoUrl('team-min14-blitar'), played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, sp: 100, points: 0, isQualified: false },
      { rank: 3, teamId: 'team-mi-mambaululum', teamName: 'MI MAMBAUL ULUM BUNTARAN (B3)', logoUrl: getTeamLogoUrl('team-mi-mambaululum'), played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, sp: 100, points: 0, isQualified: false },
      { rank: 4, teamId: 'team-min13-b', teamName: 'MIN 13 BLITAR (B4)', logoUrl: getTeamLogoUrl('team-min13-b'), played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, sp: 100, points: 0, isQualified: false },
    ],
  };

  const standingsC: GroupStandingData = {
    groupName: 'Grup C',
    rows: [
      { rank: 1, teamId: 'team-min2-blitar', teamName: 'MIN 2 BLITAR (C1)', logoUrl: getTeamLogoUrl('team-min2-blitar'), played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, sp: 100, points: 0, isQualified: false },
      { rank: 2, teamId: 'team-mi-wahidhasyim', teamName: 'MI WAHID HASYIM BAKUNG (C2)', logoUrl: getTeamLogoUrl('team-mi-wahidhasyim'), played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, sp: 100, points: 0, isQualified: false },
      { rank: 3, teamId: 'team-min13-c', teamName: 'MIN 13 BLITAR (C3)', logoUrl: getTeamLogoUrl('team-min13-c'), played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, sp: 100, points: 0, isQualified: false },
    ],
  };

  const standingsD: GroupStandingData = {
    groupName: 'Grup D',
    rows: [
      { rank: 1, teamId: 'team-mi-ploso', teamName: 'MI PLOSO KEDIRI (D1)', logoUrl: getTeamLogoUrl('team-mi-ploso'), played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, sp: 100, points: 0, isQualified: false },
      { rank: 2, teamId: 'team-mi-darussalam', teamName: 'MI UNGGULAN DARUSSALAM (D2)', logoUrl: getTeamLogoUrl('team-mi-darussalam'), played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, sp: 100, points: 0, isQualified: false },
      { rank: 3, teamId: 'team-mi-yabunaya', teamName: 'MI YA BUNAYA SRENGAT (D3)', logoUrl: getTeamLogoUrl('team-mi-yabunaya'), played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, sp: 100, points: 0, isQualified: false },
      { rank: 4, teamId: 'team-min5-tulungagung', teamName: 'MIN 5 TULUNGAGUNG (D4)', logoUrl: getTeamLogoUrl('team-min5-tulungagung'), played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, sp: 100, points: 0, isQualified: false },
    ],
  };

  const allFutsalGroups = [standingsA, standingsB, standingsC, standingsD];
  const totalTables = allFutsalGroups.length;
  const totalPages = Math.ceil(totalTables / TABLES_PER_PAGE);

  const paginatedFutsalGroups = allFutsalGroups.slice(
    (currentPage - 1) * TABLES_PER_PAGE,
    currentPage * TABLES_PER_PAGE
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Public Page Header */}
      <PublicPageHeader
        icon={ListOrdered}
        category={`PERINGKAT FASE GRUP • ${sportCode}`}
        title="Klasemen &amp; Kualifikasi"
        description="Perolehan poin, selisih gol, rekor kemenangan, dan penentuan dua tim teratas yang melaju ke babak gugur."
      />

      {/* Two-Stage Verification Notice */}
      <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-950 dark:text-blue-200 text-xs flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-[var(--color-arena-primary)] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-barlow font-bold uppercase tracking-wider block text-xs">
            Regulasi Klasemen Resmi &bull; Verifikasi Dua Tahap
          </span>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            Klasemen resmi hanya mengakumulasi pertandingan yang telah berstatus <strong>✓ Terverifikasi Resmi</strong> oleh Admin turnamen. Hasil skor yang masih menunggu verifikasi juri lapangan tidak akan mengubah poin sebelum disahkan.
          </p>
        </div>
      </div>

      {/* Render Futsal Standings (Grup A, B, C, D) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {paginatedFutsalGroups.map((grp) => (
          <div
            key={grp.groupName}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xs"
          >
            <div className="px-5 py-3.5 bg-[var(--bg-muted)]/80 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <h3 className="font-bebas text-base text-[var(--text-main)] uppercase tracking-wider">
                Klasemen {grp.groupName} &bull; Turnamen
              </h3>
              <span className="text-[11px] text-[var(--text-muted)] font-medium">Juara Grup Lolos ke 4 Besar (Semifinal)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-xs uppercase font-bold text-[var(--text-muted)] border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 font-barlow tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-8">#</th>
                    <th className="py-2.5 px-3">Klub / Sekolah</th>
                    <th className="py-2.5 px-2 text-center">Mn</th>
                    <th className="py-2.5 px-2 text-center">M</th>
                    <th className="py-2.5 px-2 text-center">S</th>
                    <th className="py-2.5 px-2 text-center">K</th>
                    <th className="py-2.5 px-2 text-center font-bold">SG</th>
                    <th className="py-2.5 px-2 text-center font-bold text-amber-600 dark:text-amber-400" title="Poin Suporter">SP</th>
                    <th className="py-2.5 px-3 text-center font-bold text-[var(--color-arena-primary)]">Poin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {grp.rows.map((row) => (
                    <tr
                      key={row.teamId}
                      className={`hover:bg-[var(--bg-muted)]/40 transition-colors ${
                        row.isQualified ? 'bg-emerald-500/5' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center font-bold relative font-mono tabular-nums">
                        {row.isQualified && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r" />
                        )}
                        <span className={row.isQualified ? 'text-emerald-700 dark:text-emerald-400 font-black' : 'text-[var(--text-muted)]'}>
                          {row.rank}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[var(--text-main)]">
                        <div className="flex items-center gap-2">
                          <img src={row.logoUrl} alt={row.teamName} className="w-6 h-6 object-contain shrink-0" />
                          <span className="truncate max-w-[130px] font-barlow font-bold text-sm tracking-wide">{row.teamName}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono tabular-nums text-[var(--text-muted)]">{row.played}</td>
                      <td className="py-2.5 px-2 text-center font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-bold">{row.won}</td>
                      <td className="py-2.5 px-2 text-center font-mono tabular-nums text-[var(--text-muted)]">{row.drawn}</td>
                      <td className="py-2.5 px-2 text-center font-mono tabular-nums text-red-600 font-medium">{row.lost}</td>
                      <td className="py-2.5 px-2 text-center font-mono tabular-nums font-bold">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                      <td className="py-2.5 px-2 text-center font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400">{row.sp}</td>
                      <td className="py-2.5 px-3 text-center font-teko tabular-nums font-bold text-lg text-[var(--color-arena-primary)] leading-none">
                        {row.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Tombol Melanjutkan Halaman (Hanya Muncul Jika Total Tabel Lebih dari 10) */}
      {totalTables > 10 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-semibold shadow-xs">
          <div className="text-[var(--text-muted)]">
            Menampilkan tabel{' '}
            <strong className="text-[var(--text-main)] font-mono">
              {(currentPage - 1) * TABLES_PER_PAGE + 1} - {Math.min(currentPage * TABLES_PER_PAGE, totalTables)}
            </strong>{' '}
            dari <strong className="text-[var(--text-main)] font-mono">{totalTables}</strong> grup
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
              className="btn-tactile px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--bg-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Halaman Sebelumnya</span>
            </button>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
              className="btn-tactile px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] text-white hover:bg-[var(--color-arena-primary-hover)] font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Lanjutkan Halaman</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Keterangan Singkatan Kolom & Regulasi Klasemen (Selalu Muncul) */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2.5 text-sm font-barlow font-bold uppercase tracking-wider text-[var(--text-main)] pb-2.5 border-b border-[var(--border-subtle)]">
          <HelpCircle className="w-4 h-4 text-[var(--color-arena-primary)] shrink-0" />
          <span>
            Keterangan Singkatan Kolom &amp; Regulasi Klasemen {sportCode === 'FUTSAL' ? 'FFI' : sportCode}
          </span>
        </div>

        <div className="space-y-3 text-xs text-[var(--text-muted)] leading-relaxed">
          <div>
            <span className="font-bold text-[var(--text-main)] block mb-1">Singkatan Kolom:</span>
            <p>
              <strong className="text-[var(--text-main)]">#:</strong> Peringkat &bull;{' '}
              <strong className="text-[var(--text-main)]">TIM:</strong> Nama Kontingen &bull;{' '}
              <strong className="text-[var(--text-main)]">Mn:</strong> Main &bull;{' '}
              <strong className="text-[var(--text-main)]">M:</strong> Menang (3 Poin) &bull;{' '}
              <strong className="text-[var(--text-main)]">S:</strong> Seri (1 Poin) &bull;{' '}
              <strong className="text-[var(--text-main)]">K:</strong> Kalah (0 Poin) &bull;{' '}
              <strong className="text-[var(--text-main)]">SG:</strong> Selisih Gol &bull;{' '}
              <strong className="text-amber-600 dark:text-amber-400">SP:</strong> Poin Suporter (Supporter Points) &bull;{' '}
              <strong className="text-[var(--text-main)]">POIN:</strong> Akumulasi Poin Klasemen &bull;{' '}
              <strong className="text-[var(--text-main)]">GM:</strong> Gol Memasukkan &bull;{' '}
              <strong className="text-[var(--text-main)]">GK:</strong> Gol Kemasukan.
            </p>
          </div>

          <div>
            <span className="font-bold text-[var(--text-main)] block mb-1">
              Kriteria Tiebreaker (Penentu Peringkat Sama Poin):
            </span>
            <p>
              Apabila dua atau lebih tim memiliki poin akhir yang sama, urutan klasemen ditentukan melalui:{' '}
              <strong className="text-[var(--text-main)]">1. Selisih Gol / Selisih Skor (SG)</strong> di seluruh laga grup &rarr;{' '}
              <strong className="text-[var(--text-main)]">2. Produktivitas Gol Memasukkan (GM)</strong> &rarr;{' '}
              <strong className="text-[var(--text-main)]">3. Head-to-Head</strong> hasil pertemuan langsung antar tim terkait &rarr;{' '}
              <strong className="text-[var(--text-main)]">4. Nilai Fair Play</strong> berdasarkan akumulasi kartu wasit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
