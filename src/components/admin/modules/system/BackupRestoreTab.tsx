'use client';

import React, { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Users,
  Trophy,
  History,
  ShieldAlert,
} from 'lucide-react';
import { initialTeams } from '@/mocks/mockTeams';
import { initialMatches } from '@/mocks/tournamentData';
import { PRESET_USERS, SPORTS_CONFIG } from '@/mocks/multiSportData';

const MOCK_STANDINGS_DATA = [
  { rank: 1, group: 'A', team: 'MIN 1 KOTA', played: 3, won: 2, drawn: 0, lost: 1, points: 6 },
  { rank: 2, group: 'A', team: 'SDN PERCOBAAN 1', played: 3, won: 1, drawn: 1, lost: 1, points: 4 },
  { rank: 1, group: 'B', team: 'MIN 2 UNGGULAN', played: 3, won: 3, drawn: 0, lost: 0, points: 9 },
  { rank: 2, group: 'B', team: 'SDN 2 HARAPAN', played: 3, won: 1, drawn: 1, lost: 1, points: 4 },
];

export const BackupRestoreTab: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<'BACKUP' | 'RESTORE' | 'EXPORT' | 'IMPORT'>('BACKUP');

  // Backup states
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState<string>('24 Okt 2026, 09:15 WIB');
  const [backupSuccess, setBackupSuccess] = useState(false);

  // Restore states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [restorePreview, setRestorePreview] = useState<{
    fileName: string;
    version: string;
    teamsCount: number;
    matchesCount: number;
    timestamp: string;
  } | null>(null);
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [restoreError, setRestoreError] = useState('');

  // Export states
  const [exportEntity, setExportEntity] = useState<'athletes' | 'teams' | 'matches' | 'standings'>('athletes');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [exportSuccess, setExportSuccess] = useState(false);

  // Import states
  const [importTarget, setImportTarget] = useState<'athletes' | 'teams' | 'matches'>('athletes');
  const [importPreviewRows, setImportPreviewRows] = useState<string[][]>([]);
  const [importSuccess, setImportSuccess] = useState(false);

  // Handle Full Database Backup Download
  const handleDownloadBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const backupData = {
        app: 'SaumaArena',
        version: '2.5.0',
        schemaVersion: '2026.1',
        exportedAt: new Date().toISOString(),
        metadata: {
          tournament: 'Milad Matsanega Futsal Competition I (MMFC I)',
          totalSports: SPORTS_CONFIG.length,
          totalTeams: initialTeams.length,
          totalMatches: initialMatches.length,
          totalUsers: PRESET_USERS.length,
        },
        data: {
          sports: SPORTS_CONFIG,
          teams: initialTeams,
          matches: initialMatches,
          standings: MOCK_STANDINGS_DATA,
          users: PRESET_USERS,
        },
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `sauma_arena_backup_${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setIsBackingUp(false);
      setBackupSuccess(true);
      setLastBackupTime(
        new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      );
      setTimeout(() => setBackupSuccess(false), 4000);
    }, 600);
  };

  // Handle File Upload for Restore
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

  // Handle Execute Restore
  const handleExecuteRestore = () => {
    if (!restorePreview) return;
    setRestoreSuccess(true);
    setTimeout(() => {
      setRestoreSuccess(false);
      setUploadedFile(null);
      setRestorePreview(null);
    }, 4000);
  };

  // Handle Export CSV / JSON
  const handleDownloadExport = () => {
    if (exportFormat === 'json') {
      let exportObj: unknown = [];
      if (exportEntity === 'teams') exportObj = initialTeams;
      if (exportEntity === 'matches') exportObj = initialMatches;
      if (exportEntity === 'standings') exportObj = MOCK_STANDINGS_DATA;
      if (exportEntity === 'athletes') {
        exportObj = initialTeams.flatMap((t) =>
          (t.players || []).map((p) => ({
            id: p.id,
            team: t.name,
            number: p.number,
            name: p.name,
            position: p.position,
            status: p.documentStatus === 'APPROVED' ? 'VERIFIED' : 'PENDING',
          }))
        );
      }

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj, null, 2));
      const anchor = document.createElement('a');
      anchor.setAttribute('href', dataStr);
      anchor.setAttribute('download', `sauma_${exportEntity}_export.json`);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } else {
      // CSV format
      let csvContent = '';
      if (exportEntity === 'athletes') {
        csvContent = 'ID,Tim,Nomor,Nama Pemain,Posisi,Status\n';
        initialTeams.forEach((t) => {
          (t.players || []).forEach((p) => {
            csvContent += `"${p.id}","${t.name}","${p.number}","${p.name}","${p.position}","${
              p.documentStatus === 'APPROVED' ? 'Terverifikasi' : 'Menunggu'
            }"\n`;
          });
        });
      } else if (exportEntity === 'teams') {
        csvContent = 'ID,Nama Tim,Sekolah,Grup,Status,Total Pemain\n';
        initialTeams.forEach((t) => {
          csvContent += `"${t.id}","${t.name}","${t.schoolName}","Grup ${t.group}","${t.registrationStatus}","${t.players?.length || 0}"\n`;
        });
      } else {
        csvContent = 'ID,Tim A,Tim B,Skor,Waktu,Status\n';
        initialMatches.forEach((m) => {
          csvContent += `"${m.id}","${m.teamAName}","${m.teamBName}","${m.scoreA}-${m.scoreB}","${m.scheduledTime}","${m.status}"\n`;
        });
      }

      const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `sauma_${exportEntity}_export.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  // Fake Import Preview
  const handleImportFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImportPreviewRows([
        ['NISN/ID', 'Nama Atlet', 'Kontingen / Tim', 'Posisi', 'No. Punggung'],
        ['0082910291', 'Muhammad Rizky', 'MTsN 1 Kota Malang', 'Pivot', '10'],
        ['0083918273', 'Fajar Ramadhan', 'SMP Negeri 3 Batu', 'Anchor', '4'],
        ['0071829381', 'Alifian Bagas', 'MTs Surya Buana', 'Kiper', '1'],
      ]);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Segmented Tabs & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Cadangkan basis data turnamen, pulihkan snapshot, serta ekspor &amp; impor data atlet/tim dalam format CSV atau JSON.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-2xl bg-[var(--bg-muted)]/80 border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider w-fit">
          <button
            type="button"
            onClick={() => setActiveSegment('BACKUP')}
            className={`btn-tactile flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              activeSegment === 'BACKUP'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Backup Database</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSegment('RESTORE')}
            className={`btn-tactile flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              activeSegment === 'RESTORE'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Restore DB</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSegment('EXPORT')}
            className={`btn-tactile flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              activeSegment === 'EXPORT'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Data</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSegment('IMPORT')}
            className={`btn-tactile flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              activeSegment === 'IMPORT'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Impor Data</span>
          </button>
        </div>
      </div>

      {/* Segment 1: Backup Database */}
      {activeSegment === 'BACKUP' && (
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
      )}

      {/* Segment 2: Restore Database */}
      {activeSegment === 'RESTORE' && (
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
      )}

      {/* Segment 3: Ekspor Data CSV / JSON */}
      {activeSegment === 'EXPORT' && (
        <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-6">
          <div className="space-y-1">
            <h3 className="font-barlow font-bold text-sm uppercase tracking-wider text-[var(--text-main)]">
              Ekspor Data Terpilah (CSV &amp; JSON)
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Pilih entitas data turnamen yang ingin Anda simpan dalam format spreadsheet Excel (.csv) atau format pengembang (.json).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--text-main)]">Pilih Entitas Data</label>
              <select
                value={exportEntity}
                onChange={(e) => setExportEntity(e.target.value as 'athletes' | 'teams' | 'matches' | 'standings')}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
              >
                <option value="athletes">Data Pemain &amp; Atlet Lengkap</option>
                <option value="teams">Data Tim &amp; Kontingen</option>
                <option value="matches">Jadwal &amp; Hasil Skor Pertandingan</option>
                <option value="standings">Klasemen &amp; Perolehan Poin Grup</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--text-main)]">Format File Unduhan</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setExportFormat('csv')}
                  className={`btn-tactile p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                    exportFormat === 'csv'
                      ? 'border-[var(--color-arena-primary)] bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] dark:bg-sky-950/40'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-muted)]'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>CSV (Excel)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExportFormat('json')}
                  className={`btn-tactile p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                    exportFormat === 'json'
                      ? 'border-[var(--color-arena-primary)] bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] dark:bg-sky-950/40'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-muted)]'
                  }`}
                >
                  <FileJson className="w-4 h-4" />
                  <span>JSON (Raw Data)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleDownloadExport}
              className="btn-tactile flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold uppercase tracking-wider text-xs shadow-xs hover:bg-[var(--color-arena-primary-hover)]"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File {exportFormat.toUpperCase()}</span>
            </button>
          </div>

          {exportSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Data {exportEntity} berhasil diekspor dalam format {exportFormat.toUpperCase()}.</span>
            </div>
          )}
        </div>
      )}

      {/* Segment 4: Impor Data CSV / JSON */}
      {activeSegment === 'IMPORT' && (
        <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-6">
          <div className="space-y-1">
            <h3 className="font-barlow font-bold text-sm uppercase tracking-wider text-[var(--text-main)]">
              Impor Data Masal (CSV / JSON)
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Unggah file CSV daftar atlet atau tim baru untuk dimasukkan langsung ke dalam database turnamen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--text-main)]">Target Impor Data</label>
              <select
                value={importTarget}
                onChange={(e) => setImportTarget(e.target.value as 'athletes' | 'teams' | 'matches')}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
              >
                <option value="athletes">Data Atlet &amp; Pemain</option>
                <option value="teams">Data Tim Peserta</option>
                <option value="matches">Jadwal Pertandingan</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--text-main)]">Pilih File CSV / JSON</label>
              <input
                type="file"
                accept=".csv, .json"
                onChange={handleImportFileSelect}
                className="w-full text-xs text-[var(--text-muted)] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[var(--color-arena-primary)] file:text-white"
              />
            </div>
          </div>

          {importPreviewRows.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-[var(--text-main)]">Pratinjau 3 Baris Data Pertama:</h4>
              <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-muted)] font-bold text-[var(--text-main)]">
                    <tr>
                      {importPreviewRows[0].map((h, i) => (
                        <th key={i} className="p-2 border-b border-[var(--border-subtle)]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {importPreviewRows.slice(1).map((row, i) => (
                      <tr key={i} className="border-b border-[var(--border-subtle)]">
                        {row.map((col, j) => (
                          <td key={j} className="p-2 text-[var(--text-muted)]">{col}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setImportSuccess(true);
                    setTimeout(() => {
                      setImportSuccess(false);
                      setImportPreviewRows([]);
                    }, 4000);
                  }}
                  className="btn-tactile px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-barlow font-bold uppercase tracking-wider text-xs shadow-xs hover:bg-emerald-700"
                >
                  Proses &amp; Simpan Data Impor
                </button>
              </div>
            </div>
          )}

          {importSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Data {importTarget} berhasil diimpor dan disimpan ke database!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
