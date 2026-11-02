'use client';

import React, { useState } from 'react';
import { Search, Megaphone, Trash2 } from 'lucide-react';
import { SupporterAssessment } from '@/types';
import { getTeamCode, initialSupporterAssessments } from '@/mocks/tournamentData';
import { getTeamLogoUrl } from '@/mocks/teamLogos';

interface SupporterScoringHistoryTableProps {
  assessments: SupporterAssessment[];
  onDeleteAssessment: (id: string) => void;
}

export const SupporterScoringHistoryTable: React.FC<SupporterScoringHistoryTableProps> = ({
  assessments,
  onDeleteAssessment,
}) => {
  const [searchFilter, setSearchFilter] = useState('');

  const filteredAssessments = assessments.filter((a) => {
    const q = searchFilter.toLowerCase();
    const code = getTeamCode({ id: a.teamId }).toLowerCase();
    return a.schoolName.toLowerCase().includes(q) || code.includes(q);
  });

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-primary)] block">
            Rekapitulasi Input Lapangan
          </span>
          <h3 className="font-bebas text-lg sm:text-xl text-[var(--text-main)] uppercase tracking-wide">
            Riwayat Penilaian Suporter oleh Juri
          </h3>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Cari nama madrasah / tim..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-arena-primary)]"
          />
        </div>
      </div>

      {filteredAssessments.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-[var(--bg-muted)]/40 border border-dashed border-[var(--border-subtle)] text-[var(--text-muted)] space-y-1">
          <Megaphone className="w-8 h-8 text-[var(--text-faint)] mx-auto mb-2" />
          <span className="font-barlow font-bold text-xs uppercase block">Belum Ada Penilaian Suporter Masuk</span>
          <p className="text-[11px]">Gunakan formulir di atas untuk mencatat poin suporter kontingen madrasah.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
                <th className="py-2.5 px-3">Madrasah / Tim Suporter</th>
                <th className="py-2.5 px-3 text-center">Bonus (+Poin)</th>
                <th className="py-2.5 px-3 text-center">Sanksi (-Poin)</th>
                <th className="py-2.5 px-3 text-center">Total Skor</th>
                <th className="py-2.5 px-3">Waktu &amp; Juri</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredAssessments.map((a) => {
                const bonus =
                  (a.schoolMascot ? 20 : 0) +
                  (a.supporterUniform ? 15 : 0) +
                  (a.cheerMin3Chants ? 10 : 0) +
                  (a.checkedInTickets ? 1 : 0);

                const pen =
                  (a.incidentViolentChaos ? 50 : 0) +
                  (a.incidentThrowObjects ? 25 : 0) +
                  (a.incidentRacismProvocation ? 15 : 0) +
                  (a.incidentSmuggleContraband ? 5 : 0);

                const total = bonus - pen;

                return (
                  <tr key={a.id} className="hover:bg-[var(--bg-muted)]/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] font-mono text-[10px] font-bold">
                          {getTeamCode({ id: a.teamId })}
                        </span>
                        <img
                          src={getTeamLogoUrl(a.teamId)}
                          alt={a.schoolName}
                          className="w-5 h-5 rounded-xs object-contain shrink-0"
                        />
                        <span className="font-barlow font-bold text-xs text-[var(--text-main)]">
                          {a.schoolName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">
                      +{bonus}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-red-600">
                      {pen > 0 ? `-${pen}` : '0'}
                    </td>
                    <td className="py-3 px-3 text-center font-teko font-bold text-xl text-[var(--color-arena-primary)] leading-none">
                      {total}
                    </td>
                    <td className="py-3 px-3 text-[11px] text-[var(--text-muted)]">
                      <div>{a.createdAt}</div>
                      <div className="text-[10px] text-[var(--text-faint)] font-mono">{a.juryName}</div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteAssessment(a.id)}
                        className="p-1 rounded-lg text-red-500 hover:bg-red-500/10 active:scale-90 transition-all cursor-pointer"
                        title="Hapus penilaian"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

