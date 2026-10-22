'use client';

import React, { useState } from 'react';
import { initialTeams } from '@/mocks/tournamentData';
import { ShieldCheck, Lock, Unlock, FileCheck } from 'lucide-react';

export const TeamVerificationTab: React.FC = () => {
  const [rosterLockState, setRosterLockState] = useState(true);

  return (
    <div className="p-5 sm:p-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-[var(--text-main)] font-[var(--font-display)]">
            Verifikasi Berkas Siswa &amp; Roster Pemain
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Pemeriksaan keabsahan kartu pelajar, NISN Kemendikbud, dan surat rekomendasi sekolah oleh Panitia Pelaksana.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRosterLockState(!rosterLockState)}
          className={`btn-tactile px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 min-h-[38px] ${
            rosterLockState
              ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
              : 'bg-amber-100 text-amber-950 border border-amber-400 dark:bg-amber-950 dark:text-amber-200'
          }`}
        >
          {rosterLockState ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          <span>{rosterLockState ? 'Roster Terkunci Resmi' : 'Mode Perubahan Roster'}</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-[var(--bg-muted)] text-[var(--text-muted)] text-[11px] uppercase tracking-wider font-bold border-b border-[var(--border-subtle)]">
              <th className="py-3 px-4">Kontingen Sekolah</th>
              <th className="py-3 px-4">Kota &amp; Pelatih</th>
              <th className="py-3 px-4 text-center">Roster Siswa</th>
              <th className="py-3 px-4 text-center">Status Verifikasi</th>
              <th className="py-3 px-4 text-right">Aksi Panitia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] font-medium">
            {initialTeams.map((team) => (
              <tr key={team.id} className="hover:bg-[var(--bg-muted)]/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-xs text-[var(--color-arena-primary)] shrink-0 shadow-2xs">
                      {team.shortName}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[var(--text-main)]">{team.schoolName}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{team.name} &bull; Grup {team.group}</div>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-xs">
                  <div className="font-semibold text-[var(--text-main)]">{team.coachName}</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono">{team.city}</div>
                </td>

                <td className="py-3.5 px-4 text-center font-mono font-bold text-xs text-[var(--text-main)]">
                  {team.players.length} Pemain
                </td>

                <td className="py-3.5 px-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      team.registrationStatus === 'VERIFIED'
                        ? 'bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)]'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {team.registrationStatus === 'VERIFIED' && <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>{team.registrationStatus === 'VERIFIED' ? 'Terverifikasi Sah' : 'Menunggu Berkas'}</span>
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => alert(`Berkas delegasi ${team.schoolName} telah lengkap (Kartu Pelajar, NISN, Surat Tugas Kepala Sekolah).`)}
                    className="btn-tactile px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs font-semibold hover:bg-[var(--bg-muted)] transition-colors min-h-[34px]"
                  >
                    Tinjau Berkas
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
