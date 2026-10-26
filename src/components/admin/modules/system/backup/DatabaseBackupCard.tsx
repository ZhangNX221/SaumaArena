'use client';

import React, { useState } from 'react';
import { Database, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { initialTeams } from '@/mocks/mockTeams';
import { initialMatches } from '@/mocks/tournamentData';
import { PRESET_USERS, SPORTS_CONFIG } from '@/mocks/multiSportData';

export const DatabaseBackupCard: React.FC = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState<string>('24 Okt 2026, 09:15 WIB');
  const [backupSuccess, setBackupSuccess] = useState(false);

  const handleDownloadBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const backupData = {
        app: 'SaumaArena',
        version: '2.5.0',
        schemaVersion: '2026.1',
        exportedAt: new Date().toISOString(),
        metadata: {
          tournament: 'Sauma Arena Multi-Sport Championship',
          totalSports: SPORTS_CONFIG.length,
          totalTeams: initialTeams.length,
          totalMatches: initialMatches.length,
          totalUsers: PRESET_USERS.length,
        },
        data: {
          sports: SPORTS_CONFIG,
          teams: initialTeams,
          matches: initialMatches,
          users: PRESET_USERS,
        },
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = url;
      downloadAnchor.download = `sauma_arena_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);

      setIsBackingUp(false);
      setBackupSuccess(true);
      setLastBackupTime(
        new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      );
      setTimeout(() => setBackupSuccess(false), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-[var(--color-arena-primary)] flex items-center justify-center shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-barlow font-bold text-base text-[var(--text-main)]">
              Cadangkan Seluruh Basis Data Sauma Arena
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-xl">
              Mengunduh file JSON lengkap mencakup semua cabang olahraga, daftar tim, data atlet terverifikasi, bagan pertandingan, catatan skor live, dan akun panitia.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[11px] text-[var(--text-muted)]">
              <span>Backup Terakhir: <strong className="text-[var(--text-main)]">{lastBackupTime}</strong></span>
              <span>•</span>
              <span>Ukuran Estimasi: <strong className="text-[var(--text-main)]">1.4 MB</strong></span>
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={isBackingUp}
          onClick={handleDownloadBackup}
          className="btn-tactile flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold uppercase tracking-wider text-xs shadow-md hover:bg-[var(--color-arena-primary-hover)] shrink-0 disabled:opacity-50"
        >
          {isBackingUp ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Membuat Backup...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Backup Database (.json)</span>
            </>
          )}
        </button>
      </div>

      {backupSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>File cadangan basis data berhasil diunduh ke perangkat Anda.</span>
        </div>
      )}

      {/* Rincian Entitas Data */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-center">
          <div className="text-2xl font-bebas text-[var(--color-arena-primary)]">{SPORTS_CONFIG.length}</div>
          <div className="text-[11px] text-[var(--text-muted)] font-semibold">Cabang Olahraga</div>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-center">
          <div className="text-2xl font-bebas text-[var(--color-arena-accent)]">{initialTeams.length}</div>
          <div className="text-[11px] text-[var(--text-muted)] font-semibold">Tim &amp; Kontingen</div>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-center">
          <div className="text-2xl font-bebas text-emerald-600">{initialMatches.length}</div>
          <div className="text-[11px] text-[var(--text-muted)] font-semibold">Jadwal Pertandingan</div>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-center">
          <div className="text-2xl font-bebas text-purple-600">{PRESET_USERS.length}</div>
          <div className="text-[11px] text-[var(--text-muted)] font-semibold">Akun Panitia &amp; Juri</div>
        </div>
      </div>
    </div>
  );
};
