'use client';

import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  FileJson,
  Download,
  Upload,
  CheckCircle2,
  FileText,
  X,
} from 'lucide-react';
import { initialTeams } from '@/mocks/mockTeams';
import { initialMatches } from '@/mocks/tournamentData';

interface DatabaseExportImportCardProps {
  mode: 'EXPORT' | 'IMPORT';
}

const MOCK_STANDINGS_DATA = [
  { rank: 1, group: 'A', team: 'MIN 1 KOTA', played: 3, won: 2, drawn: 0, lost: 1, points: 6 },
  { rank: 2, group: 'A', team: 'SDN PERCOBAAN 1', played: 3, won: 1, drawn: 1, lost: 1, points: 4 },
  { rank: 1, group: 'B', team: 'MIN 2 UNGGULAN', played: 3, won: 3, drawn: 0, lost: 0, points: 9 },
  { rank: 2, group: 'B', team: 'SDN 2 HARAPAN', played: 3, won: 1, drawn: 1, lost: 1, points: 4 },
];

export const DatabaseExportImportCard: React.FC<DatabaseExportImportCardProps> = ({ mode }) => {
  // Export states
  const [exportEntity, setExportEntity] = useState<'athletes' | 'teams' | 'matches' | 'standings'>('athletes');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [exportSuccess, setExportSuccess] = useState(false);

  // Import states
  const [importTarget, setImportTarget] = useState<'athletes' | 'teams' | 'matches'>('athletes');
  const [importFileName, setImportFileName] = useState('');
  const [importPreviewRows, setImportPreviewRows] = useState<string[][]>([]);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Export CSV / JSON with native Blob
  const handleDownloadExport = () => {
    let blob: Blob;
    const filename = `sauma_${exportEntity}_export.${exportFormat}`;

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
      blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    } else {
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
      blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    }

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleImportFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFileName(file.name);
      setImportPreviewRows([
        ['NISN/ID', 'Nama Atlet', 'Kontingen / Tim', 'Posisi', 'No. Punggung'],
        ['0082910291', 'Muhammad Rizky', 'MIN 1 Kota', 'Pivot', '10'],
        ['0083918273', 'Fajar Ramadhan', 'SMP Negeri 3 Batu', 'Anchor', '4'],
        ['0071829381', 'Alifian Bagas', 'MTs Surya Buana', 'Kiper', '1'],
      ]);
    }
  };

  const handleClearImport = () => {
    setImportFileName('');
    setImportPreviewRows([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (mode === 'EXPORT') {
    return (
      <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between space-y-5 shadow-xs transition-colors">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border-subtle)]">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-barlow font-bold text-sm uppercase tracking-wider text-[var(--text-main)]">
                Ekspor Data Terpilah
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Unduh subset data turnamen dalam format Excel spreadsheet atau JSON.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--text-main)] block">Entitas Data</label>
              <select
                value={exportEntity}
                onChange={(e) => setExportEntity(e.target.value as 'athletes' | 'teams' | 'matches' | 'standings')}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
              >
                <option value="athletes">Data Pemain &amp; Atlet</option>
                <option value="teams">Data Tim Kontingen</option>
                <option value="matches">Jadwal &amp; Hasil Laga</option>
                <option value="standings">Klasemen Grup</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--text-main)] block">Format Berkas</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setExportFormat('csv')}
                  className={`btn-tactile px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    exportFormat === 'csv'
                      ? 'border-[var(--color-arena-primary)] bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] dark:bg-sky-950/40'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>CSV (Excel)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExportFormat('json')}
                  className={`btn-tactile px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    exportFormat === 'json'
                      ? 'border-[var(--color-arena-primary)] bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] dark:bg-sky-950/40'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <FileJson className="w-3.5 h-3.5" />
                  <span>JSON (Raw)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-[var(--border-subtle)]/60">
          <span className="text-[11px] text-[var(--text-muted)]">
            Format: <strong className="uppercase font-mono text-[var(--text-main)]">{exportFormat}</strong>
          </span>

          <button
            type="button"
            onClick={handleDownloadExport}
            className="btn-tactile flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold uppercase tracking-wider text-xs shadow-2xs hover:bg-[var(--color-arena-primary-hover)] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Berkas</span>
          </button>
        </div>

        {exportSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Data {exportEntity} berhasil diekspor (.{(exportFormat).toUpperCase()}).</span>
          </div>
        )}
      </div>
    );
  }

  // IMPORT mode
  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between space-y-5 shadow-xs transition-colors">
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border-subtle)]">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-barlow font-bold text-sm uppercase tracking-wider text-[var(--text-main)]">
              Impor Data Masal
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Unggah berkas spreadsheet CSV atau JSON untuk memasukkan data sekaligus.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-[var(--text-main)] block">Target Entitas</label>
            <select
              value={importTarget}
              onChange={(e) => setImportTarget(e.target.value as 'athletes' | 'teams' | 'matches')}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
            >
              <option value="athletes">Data Atlet &amp; Pemain</option>
              <option value="teams">Data Tim Peserta</option>
              <option value="matches">Jadwal Pertandingan</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-[var(--text-main)] block">Pilih Berkas</label>
            {/* Custom styled file picker replacing raw browser input */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .json"
                onChange={handleImportFileSelect}
                className="hidden"
                id="database-import-file-input"
              />
              {importFileName ? (
                <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/5 text-xs text-[var(--text-main)]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate font-medium">{importFileName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearImport}
                    className="p-0.5 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                    title="Hapus berkas"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="database-import-file-input"
                  className="btn-tactile flex items-center justify-between px-3 py-2 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)] bg-[var(--bg-muted)] cursor-pointer text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                >
                  <span className="truncate">Pilih file .csv / .json</span>
                  <span className="font-barlow font-bold text-[11px] uppercase tracking-wider text-[var(--color-arena-primary)] shrink-0">
                    Jelajahi
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>

        {importPreviewRows.length > 0 && (
          <div className="space-y-2 pt-1 animate-fadeIn">
            <span className="text-[11px] font-semibold text-[var(--text-muted)] block">
              Pratinjau {importPreviewRows.length - 1} baris pertama:
            </span>
            <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-[var(--bg-muted)] font-bold text-[var(--text-main)]">
                  <tr>
                    {importPreviewRows[0].map((h, i) => (
                      <th key={i} className="p-2 border-b border-[var(--border-subtle)] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {importPreviewRows.slice(1).map((row, i) => (
                    <tr key={i} className="border-b border-[var(--border-subtle)] last:border-0">
                      {row.map((col, j) => (
                        <td key={j} className="p-2 text-[var(--text-muted)] whitespace-nowrap">{col}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-[var(--border-subtle)]/60">
        <span className="text-[11px] text-[var(--text-muted)]">
          {importFileName ? 'Berkas siap diproses' : 'Belum ada berkas dipilih'}
        </span>

        <button
          type="button"
          disabled={!importFileName}
          onClick={() => {
            setImportSuccess(true);
            setTimeout(() => {
              setImportSuccess(false);
              handleClearImport();
            }, 3500);
          }}
          className="btn-tactile px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-barlow font-bold uppercase tracking-wider text-xs shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Proses &amp; Simpan
        </button>
      </div>

      {importSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Data {importTarget} berhasil diimpor ke database!</span>
        </div>
      )}
    </div>
  );
};
