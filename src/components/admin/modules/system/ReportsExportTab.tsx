'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Download, FileText, CheckCircle2, Table, Sparkles } from 'lucide-react';

interface ExportCardItem {
  id: string;
  title: string;
  category: string;
  description: string;
  format: 'EXCEL (.XLSX)' | 'PDF RESMI' | 'CSV DATA';
  lastGenerated: string;
  recordCount: string;
}

const EXPORT_ITEMS: ExportCardItem[] = [
  {
    id: 'exp-1',
    title: 'Rekap Berita Acara Pertandingan (BAP)',
    category: 'Pertandingan & Hasil',
    description: 'Seluruh skor pertandingan, tanda tangan wasit, pencetak gol, dan kartu pelanggaran terverifikasi.',
    format: 'PDF RESMI',
    lastGenerated: 'Hari ini, 11:50 WIB',
    recordCount: '5 Pertandingan',
  },
  {
    id: 'exp-2',
    title: 'Klasemen Lengkap & Perolehan Medali',
    category: 'Klasemen & Prestasi',
    description: 'Klasemen fase grup, poin, selisih gol, dan rekap perolehan medali emas, perak, perunggu kontingen.',
    format: 'EXCEL (.XLSX)',
    lastGenerated: 'Hari ini, 10:00 WIB',
    recordCount: '10 Tim / 2 Grup',
  },
  {
    id: 'exp-3',
    title: 'Data Induk Kontingen & Atlet (Roster)',
    category: 'Database Peserta',
    description: 'Database lengkap seluruh atlet, nomor punggung, nomor NISN terverifikasi, dan ofisial tim.',
    format: 'EXCEL (.XLSX)',
    lastGenerated: '24 Okt 2026',
    recordCount: '50 Atlet Terdaftar',
  },
  {
    id: 'exp-4',
    title: 'Laporan Disiplin, Kartu & Sanksi',
    category: 'Disiplin Pertandingan',
    description: 'Catatan kartu kuning, kartu merah, denda disiplin, dan riwayat putusan protes panitia.',
    format: 'PDF RESMI',
    lastGenerated: '24 Okt 2026',
    recordCount: '2 Catatan Insiden',
  },
];

export const ReportsExportTab: React.FC = () => {
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  const handleExport = (item: ExportCardItem) => {
    // Simulate export generation
    setDownloadSuccessMessage(`File "${item.title} (${item.format})" berhasil disiapkan dan diunduh.`);
    setTimeout(() => {
      setDownloadSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[var(--color-arena-primary)]">
            <FileSpreadsheet className="w-4 h-4 shrink-0" />
            <span className="text-xs font-barlow font-bold uppercase tracking-wider">
              PENGATURAN &bull; REKAPITULASI DOKUMEN
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bebas text-[var(--text-main)] uppercase tracking-wide mt-1">
            Laporan &amp; Ekspor Turnamen
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 max-w-xl">
            Unduh rekapitulasi data resmi turnamen dalam format Excel (.xlsx) dan dokumen Berita Acara siap cetak (PDF).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-barlow font-bold uppercase tracking-wider">
            Format Standar FFI &amp; PBSI
          </span>
        </div>
      </div>

      {/* Success Download Alert Banner */}
      {downloadSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadSuccessMessage}</span>
        </div>
      )}

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {EXPORT_ITEMS.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)]/40 transition-all shadow-xs flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--bg-muted)] text-[var(--color-arena-primary)] border border-[var(--border-subtle)]">
                  {item.category}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-muted)]">
                  {item.format}
                </span>
              </div>

              <h3 className="font-bebas text-xl uppercase tracking-wide text-[var(--text-main)]">
                {item.title}
              </h3>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                {item.recordCount}
              </span>

              <button
                type="button"
                onClick={() => handleExport(item)}
                className="btn-tactile px-3.5 py-1.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white font-barlow font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
