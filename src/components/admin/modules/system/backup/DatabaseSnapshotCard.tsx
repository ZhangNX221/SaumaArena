'use client';

import React, { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  X,
} from 'lucide-react';
import { initialTeams } from '@/mocks/mockTeams';
import { initialMatches } from '@/mocks/tournamentData';
import { PRESET_USERS, SPORTS_CONFIG } from '@/mocks/multiSportData';

export const DatabaseSnapshotCard: React.FC = () => {
  // Backup states
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState<string>('24 Okt 2026, 09:15 WIB');
  const [backupSuccess, setBackupSuccess] = useState(false);

  // Restore states
  const [, setUploadedFile] = useState<File | null>(null);
  const [restorePreview, setRestorePreview] = useState<{
    fileName: string;
    version: string;
    teamsCount: number;
    matchesCount: number;
    timestamp: string;
  } | null>(null);
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [restoreError, setRestoreError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Handle Download Backup (.json)
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
    }, 500);
  };

  // Handle Restore File Selection
  const processFile = (file: File) => {
    setUploadedFile(file);
    setRestoreError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.app || parsed.app !== 'SaumaArena') {
          setRestoreError('File cadangan tidak valid atau bukan dari Sauma Arena.');
          setRestorePreview(null);
          return;
        }
        setRestorePreview({
          fileName: file.name,
          version: parsed.version || '2.5.0',
          teamsCount: parsed.data?.teams?.length || parsed.metadata?.totalTeams || initialTeams.length,
          matchesCount: parsed.data?.matches?.length || parsed.metadata?.totalMatches || initialMatches.length,
          timestamp: parsed.exportedAt ? new Date(parsed.exportedAt).toLocaleString('id-ID') : 'Terdeteksi',
        });
      } catch {
        setRestoreError('Gagal membaca berkas JSON. Pastikan struktur berkas valid.');
        setRestorePreview(null);
      }
    };
    reader.readAsText(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.json')) {
      processFile(file);
    } else if (file) {
      setRestoreError('Format berkas harus berupa file .json');
    }
  };

  const handleExecuteRestore = () => {
    if (!restorePreview) return;
    setRestoreSuccess(true);
    setTimeout(() => {
      setRestoreSuccess(false);
      setUploadedFile(null);
      setRestorePreview(null);
    }, 4000);
  };

  const handleCancelRestore = () => {
    setUploadedFile(null);
    setRestorePreview(null);
    setRestoreError('');
  };

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-6 shadow-xs transition-colors">
      {/* Header & Compact Metric Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="font-barlow font-bold text-base text-[var(--text-main)]">
              Snapshot Basis Data
            </h3>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Cadangkan status seluruh turnamen ke satu berkas JSON atau pulihkan data dari snapshot sebelumnya.
          </p>
        </div>

        {/* Minimalist entity summary pills (Clean, cohesive, replaces rainbow box clutter) */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-subtle)]">
            <strong className="font-mono text-[var(--color-arena-primary)] font-bold">{SPORTS_CONFIG.length}</strong>{' '}
            <span className="text-[var(--text-muted)]">Cabor</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-subtle)]">
            <strong className="font-mono text-[var(--color-arena-primary)] font-bold">{initialTeams.length}</strong>{' '}
            <span className="text-[var(--text-muted)]">Tim</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-subtle)]">
            <strong className="font-mono text-[var(--color-arena-primary)] font-bold">{initialMatches.length}</strong>{' '}
            <span className="text-[var(--text-muted)]">Jadwal</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-subtle)]">
            <strong className="font-mono text-[var(--color-arena-primary)] font-bold">{PRESET_USERS.length}</strong>{' '}
            <span className="text-[var(--text-muted)]">Akun</span>
          </span>
        </div>
      </div>

      {/* Symmetrical Action Panels: Backup & Restore */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Left: Cadangkan Basis Data */}
        <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-muted)]/40 border border-[var(--border-subtle)] flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-barlow font-bold text-xs uppercase tracking-wider text-[var(--text-main)] flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
                <span>Cadangkan Data (.JSON)</span>
              </span>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">~1.4 MB</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Unduh snapshot lengkap mencakup cabang olahraga, daftar kontingen, roster atlet, jadwal tanding, dan akun petugas.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[var(--border-subtle)]/60">
            <div className="text-[11px] text-[var(--text-muted)]">
              Terakhir: <strong className="text-[var(--text-main)] font-medium">{lastBackupTime}</strong>
            </div>

            <button
              type="button"
              disabled={isBackingUp}
              onClick={handleDownloadBackup}
              className="btn-tactile flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white font-barlow font-bold uppercase tracking-wider text-xs shadow-2xs shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isBackingUp ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Membuat Berkas...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Snapshot</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Pulihkan Basis Data */}
        <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-muted)]/40 border border-[var(--border-subtle)] flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-barlow font-bold text-xs uppercase tracking-wider text-[var(--text-main)] flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-amber-500" />
                <span>Pulihkan Snapshot (.JSON)</span>
              </span>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">Restore</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Pilih berkas cadangan JSON untuk memulihkan seluruh data turnamen ke kondisi snapshot.
            </p>
          </div>

          {/* Upload Drop Trigger (Compact, non-bloated) */}
          {!restorePreview && (
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-dashed cursor-pointer transition-all ${
                isDragging
                  ? 'border-[var(--color-arena-primary)] bg-[var(--color-arena-primary-light)]/20'
                  : 'border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)] bg-[var(--bg-surface)]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileJson className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs text-[var(--text-muted)] truncate">
                  Pilih atau seret berkas <strong className="text-[var(--text-main)]">.json</strong>
                </span>
              </div>
              <span className="btn-tactile px-3 py-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)] text-[11px] font-barlow font-bold uppercase tracking-wider shrink-0">
                Jelajahi
              </span>
              <input type="file" accept=".json" onChange={handleFileSelect} className="hidden" />
            </label>
          )}

          {/* Active Preview & Confirm Trigger */}
          {restorePreview && (
            <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <FileJson className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="text-xs font-bold text-[var(--text-main)] truncate max-w-[200px]">
                    {restorePreview.fileName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCancelRestore}
                  className="p-1 rounded-lg text-[var(--text-muted)] hover:text-red-500 transition-colors"
                  title="Batalkan"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px] text-[var(--text-muted)] font-mono">
                <div className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-center">
                  <span className="block font-bold text-[var(--text-main)]">{restorePreview.teamsCount}</span> Tim
                </div>
                <div className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-center">
                  <span className="block font-bold text-[var(--text-main)]">{restorePreview.matchesCount}</span> Laga
                </div>
                <div className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-center">
                  <span className="block font-bold text-[var(--text-main)]">{restorePreview.version}</span> Versi
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>Akan menimpa data aktif.</span>
                </span>
                <button
                  type="button"
                  onClick={handleExecuteRestore}
                  className="btn-tactile px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-barlow font-bold uppercase tracking-wider text-[11px] shadow-2xs"
                >
                  Pulihkan Sekarang
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Alerts: Backup Success */}
      {backupSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Berkas cadangan basis data berhasil diunduh ke komputer Anda.</span>
        </div>
      )}

      {/* Global Alerts: Restore Error */}
      {restoreError && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{restoreError}</span>
          </div>
          <button
            type="button"
            onClick={() => setRestoreError('')}
            className="text-xs underline hover:no-underline"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Global Alerts: Restore Success */}
      {restoreSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Database berhasil dipulihkan! Seluruh data kompetisi telah disinkronkan kembali.</span>
        </div>
      )}
    </div>
  );
};
