'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, FileJson, Download, CheckCircle2 } from 'lucide-react';
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
  const [importPreviewRows, setImportPreviewRows] = useState<string[][]>([]);
  const [importSuccess, setImportSuccess] = useState(false);

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
    if (e.target.files?.[0]) {
      setImportPreviewRows([
        ['NISN/ID', 'Nama Atlet', 'Kontingen / Tim', 'Posisi', 'No. Punggung'],
        ['0082910291', 'Muhammad Rizky', 'MIN 1 Kota', 'Pivot', '10'],
        ['0083918273', 'Fajar Ramadhan', 'SMP Negeri 3 Batu', 'Anchor', '4'],
        ['0071829381', 'Alifian Bagas', 'MTs Surya Buana', 'Kiper', '1'],
      ]);
    }
  };

  if (mode === 'EXPORT') {
    return (
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
    );
  }

  // IMPORT mode
  return (
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
  );
};
