'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronLeft, ChevronRight, ListOrdered } from 'lucide-react';
import { getTeamLogoUrl } from '@/mocks/teamLogos';
import { CABOR_STANDINGS_DATA } from '@/mocks/caborStandingsAndStats';
import { SportCode } from '@/types';

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
  const isCustomCabor = sportCode === 'VOLI' || sportCode === 'ESPORT';
  const customData = CABOR_STANDINGS_DATA[sportCode];

  const [currentPage, setCurrentPage] = useState(1);
  const TABLES_PER_PAGE = 10;

  // Data klasemen Futsal
  const standingsA: GroupStandingData = {
    groupName: 'Grup A',
    rows: [
      { rank: 1, teamId: 'team-min1', teamName: 'MIN 1 KOTA', logoUrl: getTeamLogoUrl('team-min1'), played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 15, goalsAgainst: 14, goalDifference: 1, points: 6, isQualified: true },
      { rank: 2, teamId: 'team-sdn-percobaan', teamName: 'SDN PERCOBAAN 1', logoUrl: getTeamLogoUrl('team-sdn-percobaan'), played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 16, goalsAgainst: 12, goalDifference: 4, points: 4, isQualified: true },
      { rank: 3, teamId: 'team-alhidayah', teamName: 'MIS AL-HIDAYAH', logoUrl: getTeamLogoUrl('team-alhidayah'), played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 12, goalsAgainst: 10, goalDifference: 2, points: 4, isQualified: false },
      { rank: 4, teamId: 'team-bina-insani', teamName: 'SDIT BINA INSANI', logoUrl: getTeamLogoUrl('team-bina-insani'), played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 6, goalsAgainst: 13, goalDifference: -7, points: 3, isQualified: false },
      { rank: 5, teamId: 'team-maarif', teamName: "MI MA'ARIF NURUL ULUM", logoUrl: getTeamLogoUrl('team-maarif'), played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 4, goalsAgainst: 16, goalDifference: -12, points: 0, isQualified: false },
    ],
  };

  const standingsB: GroupStandingData = {
    groupName: 'Grup B',
    rows: [
      { rank: 1, teamId: 'team-min2', teamName: 'MIN 2 UNGGULAN', logoUrl: getTeamLogoUrl('team-min2'), played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 15, goalsAgainst: 4, goalDifference: 11, points: 9, isQualified: true },
      { rank: 2, teamId: 'team-sdn-harapan', teamName: 'SDN 2 HARAPAN', logoUrl: getTeamLogoUrl('team-sdn-harapan'), played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 8, goalsAgainst: 9, goalDifference: -1, points: 4, isQualified: true },
      { rank: 3, teamId: 'team-darussalam', teamName: 'MIS DARUSSALAM', logoUrl: getTeamLogoUrl('team-darussalam'), played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 14, goalsAgainst: 13, goalDifference: 1, points: 3, isQualified: false },
      { rank: 4, teamId: 'team-harum', teamName: 'SDIT HARAPAN UMAT', logoUrl: getTeamLogoUrl('team-harum'), played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 7, goalsAgainst: 18, goalDifference: -11, points: 1, isQualified: false },
      { rank: 5, teamId: 'team-tarbiyah', teamName: 'MI TARBIYATUL ISLAM', logoUrl: getTeamLogoUrl('team-tarbiyah'), played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 3, goalsAgainst: 17, goalDifference: -14, points: 0, isQualified: false },
    ],
  };

  // Kumpulan seluruh grup tabel
  const allCustomGroups = customData
    ? [
        { name: 'Grup A', rows: customData.groupA },
        { name: 'Grup B', rows: customData.groupB },
      ]
    : [];
  const allFutsalGroups = [standingsA, standingsB];

  // Hitung paginasi jika tabel sudah mencapai lebih dari 10
  const totalTables = isCustomCabor ? allCustomGroups.length : allFutsalGroups.length;
  const totalPages = Math.ceil(totalTables / TABLES_PER_PAGE);

  const paginatedCustomGroups = allCustomGroups.slice(
    (currentPage - 1) * TABLES_PER_PAGE,
    currentPage * TABLES_PER_PAGE
  );

  const paginatedFutsalGroups = allFutsalGroups.slice(
    (currentPage - 1) * TABLES_PER_PAGE,
    currentPage * TABLES_PER_PAGE
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Public Page Header */}
      <div className="space-y-1.5 pb-2">
        <div className="flex items-center gap-2 text-[var(--color-arena-primary)]">
          <ListOrdered className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[11px] font-black uppercase tracking-widest">
            PERINGKAT FASE GRUP &bull; {sportCode}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
          Klasemen Grup &amp; Kualifikasi
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Perolehan poin, selisih gol, rekor kemenangan, dan penentuan dua tim teratas yang melaju ke babak gugur.
        </p>
      </div>

      {/* Render Custom Cabor Standings (Voli / Esport) */}
      {isCustomCabor && customData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {paginatedCustomGroups.map((grp) => (
              <div
                key={grp.name}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xs"
              >
                <div className="px-5 py-3.5 bg-[var(--bg-muted)]/80 border-b border-[var(--border-subtle)] flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-[var(--text-main)] uppercase tracking-wider font-[var(--font-display)]">
                    Klasemen {grp.name} &bull; {sportCode}
                  </h3>
                  <span className="text-[11px] text-[var(--text-muted)]">Top 2 Lolos Semifinal</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[10px] uppercase font-bold text-[var(--text-muted)] border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 font-mono">
                      <tr>
                        <th className="py-2.5 px-3 text-center w-8">#</th>
                        <th className="py-2.5 px-3 font-sans">Klub / Tim</th>
                        <th className="py-2.5 px-2 text-center">{customData.headers[0]}</th>
                        <th className="py-2.5 px-2 text-center">{customData.headers[1]}</th>
                        <th className="py-2.5 px-2 text-center">{customData.headers[2]}</th>
                        <th className="py-2.5 px-2 text-center">{customData.headers[3]}</th>
                        <th className="py-2.5 px-3 text-center font-black text-[var(--text-main)] font-sans">Poin</th>
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
                              <span className="truncate max-w-[140px] font-medium font-[var(--font-display)]">{row.teamName}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono tabular-nums text-[var(--text-muted)]">{row.col1}</td>
                          <td className="py-2.5 px-2 text-center font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-bold">{row.col2}</td>
                          <td className="py-2.5 px-2 text-center font-mono tabular-nums text-red-600 font-medium">{row.col3}</td>
                          <td className="py-2.5 px-2 text-center font-mono tabular-nums text-[var(--text-muted)]">{row.col4}</td>
                          <td className="py-2.5 px-3 text-center font-mono tabular-nums font-black text-sm text-[var(--color-arena-primary)]">
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
      ) : (
        /* Render Futsal Standings (Grup A & B) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {paginatedFutsalGroups.map((grp) => (
            <div
              key={grp.groupName}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xs"
            >
              <div className="px-5 py-3.5 bg-[var(--bg-muted)]/80 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-[var(--text-main)] uppercase tracking-wider font-[var(--font-display)]">
                  Klasemen {grp.groupName} &bull; MMFC I
                </h3>
                <span className="text-[11px] text-[var(--text-muted)]">Peringkat 1 &amp; 2 Lolos Gugur</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[10px] uppercase font-bold text-[var(--text-muted)] border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 font-mono">
                    <tr>
                      <th className="py-2.5 px-3 text-center w-8">#</th>
                      <th className="py-2.5 px-3 font-sans">Klub / Sekolah</th>
                      <th className="py-2.5 px-2 text-center" title="Pernah Main">Mn</th>
                      <th className="py-2.5 px-2 text-center" title="Menang">M</th>
                      <th className="py-2.5 px-2 text-center" title="Seri">S</th>
                      <th className="py-2.5 px-2 text-center" title="Kalah">K</th>
                      <th className="py-2.5 px-2 text-center font-bold" title="Selisih Gol">SG</th>
                      <th className="py-2.5 px-3 text-center font-black text-[var(--text-main)] font-sans">Poin</th>
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
                            <span className="truncate max-w-[130px] font-medium font-[var(--font-display)]">{row.teamName}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono tabular-nums text-[var(--text-muted)]">{row.played}</td>
                        <td className="py-2.5 px-2 text-center font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-bold">{row.won}</td>
                        <td className="py-2.5 px-2 text-center font-mono tabular-nums text-[var(--text-muted)]">{row.drawn}</td>
                        <td className="py-2.5 px-2 text-center font-mono tabular-nums text-red-600 font-medium">{row.lost}</td>
                        <td className="py-2.5 px-2 text-center font-mono tabular-nums font-bold">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                        <td className="py-2.5 px-3 text-center font-mono tabular-nums font-black text-sm text-[var(--color-arena-primary)]">
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
      )}

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
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-extrabold text-[var(--text-main)] font-[var(--font-display)] pb-2.5 border-b border-[var(--border-subtle)]">
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
              <strong className="text-[var(--text-main)]">M:</strong> Main &bull;{' '}
              <strong className="text-[var(--text-main)]">M:</strong> Menang (3 Poin) &bull;{' '}
              <strong className="text-[var(--text-main)]">S:</strong> Seri (1 Poin) &bull;{' '}
              <strong className="text-[var(--text-main)]">K:</strong> Kalah (0 Poin) &bull;{' '}
              <strong className="text-[var(--text-main)]">POIN:</strong> Akumulasi Poin &bull;{' '}
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
              <strong className="text-[var(--text-main)]">1. Head-to-Head</strong> pertemuan langsung &rarr;{' '}
              <strong className="text-[var(--text-main)]">2. Selisih Gol (SG)</strong> di seluruh laga grup &rarr;{' '}
              <strong className="text-[var(--text-main)]">3. Produktivitas Gol Memasukkan (GM)</strong> &rarr;{' '}
              <strong className="text-[var(--text-main)]">4. Nilai Fair Play</strong> berdasarkan akumulasi kartu juri.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
