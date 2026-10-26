'use client';

import React, { useState } from 'react';
import { Crown, Award, Ticket, ShieldAlert, ChevronRight, ChevronDown, ChevronUp, Search, Info } from 'lucide-react';
import { initialSupporterAssessments, initialTeams } from '@/mocks/tournamentData';
import { getTeamLogoUrl } from '@/mocks/teamLogos';
import { SupporterAssessment } from '@/types';
import { SupporterDetailModal } from './SupporterDetailModal';
import { PublicPageHeader } from '../layout/PublicPageHeader';

export const SupporterTab: React.FC = () => {
  const [assessments] = useState<SupporterAssessment[]>(initialSupporterAssessments);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Agregasi skor suporter per sekolah/tim (Poin 1 s/d 5 & Sanksi)
  const leaderboard = initialTeams
    .map((team) => {
      const teamAssessments = assessments.filter((a) => a.teamId === team.id);

      let p1Points = 0; // 1. Koreografi (+25)
      let p2Points = 0; // 2. Maskot (+20)
      let p3Points = 0; // 3. Seragam (+15)
      let p4Points = 0; // 4. Yel-yel (+10)
      let p5Points = 0; // 5. Tiket (+1)
      let penaltyPoints = 0;

      teamAssessments.forEach((a) => {
        if (a.choreography) p1Points += 25;
        if (a.schoolMascot) p2Points += 20;
        if (a.supporterUniform) p3Points += 15;
        if (a.cheerMin3Chants) p4Points += 10;
        p5Points += a.checkedInTickets * 1;

        if (a.incidentViolentChaos) penaltyPoints += 50;
        if (a.incidentThrowObjects) penaltyPoints += 25;
        if (a.incidentRacismProvocation) penaltyPoints += 15;
        if (a.incidentSmuggleContraband) penaltyPoints += 5;
        if (a.incidentLitteringTribun) penaltyPoints += 1;
      });

      const totalScore = p1Points + p2Points + p3Points + p4Points + p5Points - penaltyPoints;

      return {
        teamId: team.id,
        schoolName: team.schoolName,
        shortName: team.shortName,
        logoUrl: team.logoUrl,
        p1Points,
        p2Points,
        p3Points,
        p4Points,
        p5Points,
        penaltyPoints,
        totalScore,
        matchCount: teamAssessments.length,
      };
    })
    .filter((row) => row.schoolName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.totalScore - a.totalScore);

  const selectedTeam = initialTeams.find((t) => t.id === selectedSchool);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Public Page Header */}
      <PublicPageHeader
        icon={Award}
        category="PENGHARGAAN TRIBUN • SUPORTER KONTINGEN"
        title="Klasemen Suporter Terbaik"
        description="Peringkat kreativitas dan ketertiban suporter tim berdasarkan koreografi, yel-yel, tiket resmi, serta sportivitas di tribun."
      />

      {/* Ketentuan Penilaian */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
          <Info className="w-4 h-4 text-[var(--color-arena-primary)] shrink-0" />
          <h3 className="font-bebas text-base text-[var(--text-main)] tracking-wider">
            Ketentuan Penilaian
          </h3>
        </div>

        {/* Rubric Details Grid (Selalu Tampil) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Poin Positif Berdasarkan Nomor Urut */}
          <div className="space-y-2 text-xs">
            <div className="font-extrabold uppercase tracking-wider text-[var(--color-arena-primary)] font-[var(--font-display)] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Poin Apresiasi Kreativitas</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[var(--color-arena-primary)] text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono">
                    1
                  </span>
                  <span className="font-medium text-[var(--text-main)]">Membentang Koreografi</span>
                </div>
                <span className="stadium-badge-positive">+25</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[var(--color-arena-primary)] text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono">
                    2
                  </span>
                  <span className="font-medium text-[var(--text-main)]">Membawa Maskot Sekolah</span>
                </div>
                <span className="stadium-badge-positive">+20</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[var(--color-arena-primary)] text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono">
                    3
                  </span>
                  <span className="font-medium text-[var(--text-main)]">Menggunakan Seragam Kompak</span>
                </div>
                <span className="stadium-badge-positive">+15</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[var(--color-arena-primary)] text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono">
                    4
                  </span>
                  <span className="font-medium text-[var(--text-main)]">Menyanyikan Yel-Yel Minimal 3 Lagu</span>
                </div>
                <span className="stadium-badge-positive">+10</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] font-bold border border-[var(--color-arena-primary)]/20">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[var(--color-arena-primary)] text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono">
                    5
                  </span>
                  <span className="text-[var(--text-main)] font-semibold">Tiket Penonton Ter-scan di Gate</span>
                </div>
                <span className="stadium-badge-positive">+1 / Tiket</span>
              </div>
            </div>
          </div>

          {/* Sanksi Pengurangan */}
          <div className="space-y-2 text-xs">
            <div className="font-extrabold uppercase tracking-wider text-red-600 font-[var(--font-display)] flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Sanksi Pelanggaran Ketertiban</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--text-main)]">
                <span className="font-medium">Kericuhan atau Kekerasan Fisik</span>
                <span className="stadium-badge-penalty font-mono tabular-nums">-50</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--text-main)]">
                <span className="font-medium">Melempar Benda ke Lapangan</span>
                <span className="stadium-badge-penalty font-mono tabular-nums">-25</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--text-main)]">
                <span className="font-medium">Tindakan Rasis atau Provokasi Negatif</span>
                <span className="stadium-badge-penalty font-mono tabular-nums">-15</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--text-main)]">
                <span className="font-medium">Membawa Barang Terlarang</span>
                <span className="stadium-badge-penalty font-mono tabular-nums">-5</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--text-main)]">
                <span className="font-medium">Membuang Sampah Sembarangan / Mengotori Tribun</span>
                <span className="stadium-badge-penalty font-mono tabular-nums">-1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Table Area */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Cari sekolah atau kontingen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)] min-h-[42px] transition-all"
            />
          </div>
          <div className="text-xs font-semibold text-[var(--text-muted)]">
            Menampilkan <span className="text-[var(--text-main)] font-black font-mono tabular-nums">{leaderboard.length}</span> kontingen sekolah
          </div>
        </div>

        {/* Tabel Klasemen Suporter dengan Kolom Responsif Fluid */}
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-muted)] font-bold uppercase tracking-wider text-xs font-barlow">
                <th className="py-3 px-3 w-12 text-center">Pos</th>
                <th className="py-3 px-4 min-w-[180px] sticky left-0 bg-[var(--bg-muted)] sm:static">Sekolah Suporter</th>
                <th className="py-3 px-2 text-center">Laga</th>
                <th className="py-3 px-2 text-center">
                  <div className="flex flex-col items-center">
                    <span className="w-5 h-5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--color-arena-primary)] font-black text-[11px] flex items-center justify-center shadow-2xs font-mono">1</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold mt-0.5 hidden sm:inline font-barlow uppercase">Koreo</span>
                  </div>
                </th>
                <th className="py-3 px-2 text-center">
                  <div className="flex flex-col items-center">
                    <span className="w-5 h-5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--color-arena-primary)] font-black text-[11px] flex items-center justify-center shadow-2xs font-mono">2</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold mt-0.5 hidden sm:inline font-barlow uppercase">Maskot</span>
                  </div>
                </th>
                <th className="py-3 px-2 text-center">
                  <div className="flex flex-col items-center">
                    <span className="w-5 h-5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--color-arena-primary)] font-black text-[11px] flex items-center justify-center shadow-2xs font-mono">3</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold mt-0.5 hidden sm:inline font-barlow uppercase">Seragam</span>
                  </div>
                </th>
                <th className="py-3 px-2 text-center">
                  <div className="flex flex-col items-center">
                    <span className="w-5 h-5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--color-arena-primary)] font-black text-[11px] flex items-center justify-center shadow-2xs font-mono">4</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold mt-0.5 hidden sm:inline font-barlow uppercase">Yel-yel</span>
                  </div>
                </th>
                <th className="py-3 px-2 text-center">
                  <div className="flex flex-col items-center">
                    <span className="w-5 h-5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-blue-600 dark:text-blue-400 font-black text-[11px] flex items-center justify-center shadow-2xs font-mono">5</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold mt-0.5 hidden sm:inline font-barlow uppercase">Tiket</span>
                  </div>
                </th>
                <th className="py-3 px-2.5 text-center text-red-600 dark:text-red-400">Sanksi</th>
                <th className="py-3 px-4 text-right font-bold text-[var(--text-main)]">Total Skor</th>
                <th className="py-3 px-3 text-center w-14">Rincian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {leaderboard.map((row, index) => {
                const rank = index + 1;
                const isTop1 = rank === 1;

                return (
                  <tr
                    key={row.teamId}
                    className={`hover:bg-[var(--bg-muted)]/60 transition-colors ${
                      isTop1 ? 'bg-amber-500/5 dark:bg-amber-500/10' : ''
                    }`}
                  >
                    <td className="py-4 px-4 text-center">
                      {isTop1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--color-arena-accent)] text-slate-950 font-black text-xs shadow-xs font-mono">
                          1
                        </span>
                      ) : (
                        <span className="font-extrabold text-sm text-[var(--text-muted)] font-mono">{rank}</span>
                      )}
                    </td>

                    <td className="py-4 px-4 font-medium text-[var(--text-main)] sticky left-0 bg-[var(--bg-surface)] sm:static">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-2xs">
                          <img
                            src={row.logoUrl || getTeamLogoUrl(row.teamId)}
                            alt={row.schoolName}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-barlow font-bold text-sm sm:text-base tracking-wide text-[var(--text-main)] truncate max-w-[200px] sm:max-w-none">
                            {row.schoolName}
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] font-medium">
                            Basis Suporter Terdaftar
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3 text-center tabular-nums font-mono text-[var(--text-muted)] font-semibold">
                      {row.matchCount}
                    </td>

                    <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-[var(--text-main)]">
                      +{row.p1Points}
                    </td>

                    <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-[var(--text-main)]">
                      +{row.p2Points}
                    </td>

                    <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-[var(--text-main)]">
                      +{row.p3Points}
                    </td>

                    <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-[var(--text-main)]">
                      +{row.p4Points}
                    </td>

                    <td className="py-4 px-2 text-center tabular-nums font-mono font-bold text-blue-600 dark:text-blue-400">
                      +{row.p5Points}
                    </td>

                    <td className="py-4 px-2.5 text-center tabular-nums font-mono font-bold text-red-600 dark:text-red-400">
                      {row.penaltyPoints > 0 ? `-${row.penaltyPoints}` : '0'}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <span className="text-xl sm:text-2xl font-teko font-bold tabular-nums text-[var(--color-arena-primary)] leading-none tracking-wide">
                        {row.totalScore}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedSchool(row.teamId)}
                        className="btn-tactile inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors"
                        aria-label={`Rincian nilai ${row.schoolName}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* School Detail Modal Subcomponent */}
      <SupporterDetailModal
        isOpen={Boolean(selectedSchool)}
        onClose={() => setSelectedSchool(null)}
        team={selectedTeam}
        assessments={assessments}
      />
    </div>
  );
};
