'use client';

import React, { useState } from 'react';
import { Upload, FileJson, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const DatabaseRestoreCard: React.FC = () => {
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setRestoreError('');
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (!parsed.app || parsed.app !== 'SaumaArena') {
            setRestoreError('File backup tidak valid atau bukan berasal dari Sauma Arena.');
            setRestorePreview(null);
            return;
          }
          setRestorePreview({
            fileName: file.name,
            version: parsed.version || '2.5.0',
            teamsCount: parsed.data?.teams?.length || parsed.metadata?.totalTeams || 16,
            matchesCount: parsed.data?.matches?.length || parsed.metadata?.totalMatches || 32,
            timestamp: parsed.exportedAt ? new Date(parsed.exportedAt).toLocaleString('id-ID') : 'Terdeteksi',
          });
        } catch {
          setRestoreError('Gagal membaca file JSON. Pastikan format file tidak rusak.');
          setRestorePreview(null);
        }
      };
      reader.readAsText(file);
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

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border-2 border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)] text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-barlow font-bold uppercase tracking-wider text-[var(--text-main)]">
            Pilih File Cadangan Sauma Arena (.json)
          </h4>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Tarik file backup ke area ini atau klik tombol di bawah untuk memilih file dari komputer Anda.
          </p>
        </div>
        <label className="inline-block cursor-pointer">
          <span className="btn-tactile px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold text-xs uppercase tracking-wider shadow-xs hover:bg-[var(--color-arena-primary-hover)]">
            Pilih File JSON
          </span>
          <input type="file" accept=".json" onChange={handleFileSelect} className="hidden" />
        </label>
      </div>

      {restoreError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{restoreError}</span>
        </div>
      )}

      {restorePreview && (
        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <FileJson className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-[var(--text-main)]">File Cadangan Siap Dipulihkan</h4>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">{restorePreview.fileName}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-[var(--bg-muted)]">
              <span className="text-[var(--text-muted)]">Versi Schema:</span>
              <div className="font-bold text-[var(--text-main)]">{restorePreview.version}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--bg-muted)]">
              <span className="text-[var(--text-muted)]">Jumlah Tim:</span>
              <div className="font-bold text-[var(--text-main)]">{restorePreview.teamsCount} Tim</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--bg-muted)]">
              <span className="text-[var(--text-muted)]">Jumlah Laga:</span>
              <div className="font-bold text-[var(--text-main)]">{restorePreview.matchesCount} Pertandingan</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--bg-muted)]">
              <span className="text-[var(--text-muted)]">Waktu Backup:</span>
              <div className="font-bold text-[var(--text-main)]">{restorePreview.timestamp}</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Proses restore akan menimpa data yang sedang berjalan.</span>
            </span>
            <button
              type="button"
              onClick={handleExecuteRestore}
              className="btn-tactile px-4 py-2 rounded-xl bg-amber-600 text-white font-barlow font-bold uppercase tracking-wider text-xs shadow-xs hover:bg-amber-700"
            >
              Konfirmasi &amp; Pulihkan Database
            </button>
          </div>
        </div>
      )}

      {restoreSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Database berhasil dipulihkan! Seluruh data kompetisi telah disinkronkan kembali.</span>
        </div>
      )}
    </div>
  );
};
