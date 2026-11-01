'use client';

import React from 'react';
import { Award, ShieldAlert, Info } from 'lucide-react';

export const SupporterRulesInfo: React.FC = () => {
  return (
    <div className="rounded-xl border-2 border-slate-300 dark:border-slate-800 bg-[var(--bg-surface)] p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
        <Info className="w-4 h-4 text-[#1D63B8] dark:text-sky-400 shrink-0" />
        <h3 className="font-bebas text-base sm:text-lg text-[var(--text-main)] tracking-wider">
          Ketentuan &amp; Bobot Penilaian Best Supporter MMFC I
        </h3>
      </div>

      {/* Rubric Details Grid: Sejajar, Selaras, & Identik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Poin Positif (Tema Biru) */}
        <div className="space-y-2 text-xs">
          <div className="font-barlow font-bold uppercase tracking-wider text-[#1D63B8] dark:text-sky-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            <span>Poin Apresiasi Kreativitas Tribun</span>
          </div>
          <div className="space-y-1.5">
            {/* 1. Koreo */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[var(--text-main)]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-md bg-[#1D63B8] text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono shadow-2xs">
                  1
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#1D63B8] text-white font-black text-[10px] font-barlow uppercase shrink-0">
                  KOREO
                </span>
                <span className="font-medium truncate">Membentang Koreografi 3D / Kertas</span>
              </div>
              <span className="stadium-badge-positive font-mono tabular-nums shrink-0">+25</span>
            </div>

            {/* 2. Maskot */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[var(--text-main)]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-md bg-[#1D63B8] text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono shadow-2xs">
                  2
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#1D63B8] text-white font-black text-[10px] font-barlow uppercase shrink-0">
                  MASKOT
                </span>
                <span className="font-medium truncate">Membawa Maskot Sekolah / Kostum Unik</span>
              </div>
              <span className="stadium-badge-positive font-mono tabular-nums shrink-0">+20</span>
            </div>

            {/* 3. Seragam */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[var(--text-main)]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-md bg-[#1D63B8] text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono shadow-2xs">
                  3
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#1D63B8] text-white font-black text-[10px] font-barlow uppercase shrink-0">
                  SERAGAM
                </span>
                <span className="font-medium truncate">Menggunakan Seragam Kompak Kontingen</span>
              </div>
              <span className="stadium-badge-positive font-mono tabular-nums shrink-0">+15</span>
            </div>

            {/* 4. Yel-yel */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[var(--text-main)]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-md bg-[#1D63B8] text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono shadow-2xs">
                  4
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#1D63B8] text-white font-black text-[10px] font-barlow uppercase shrink-0">
                  YEL-YEL
                </span>
                <span className="font-medium truncate">Menyanyikan Yel-Yel Minimal 3 Lagu</span>
              </div>
              <span className="stadium-badge-positive font-mono tabular-nums shrink-0">+10</span>
            </div>

            {/* 5. Tiket / Kehadiran */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[var(--text-main)]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-md bg-[#1D63B8] text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono shadow-2xs">
                  5
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#1D63B8] text-white font-black text-[10px] font-barlow uppercase shrink-0">
                  TIKET
                </span>
                <span className="font-medium truncate">Kehadiran Suporter Terverifikasi</span>
              </div>
              <span className="stadium-badge-positive font-mono tabular-nums shrink-0">+1 / Match</span>
            </div>
          </div>
        </div>

        {/* Sanksi Pengurangan (Tema Merah) */}
        <div className="space-y-2 text-xs">
          <div className="font-barlow font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Sanksi Pelanggaran Ketertiban Tribun</span>
          </div>
          <div className="space-y-1.5">
            {/* 1. Ricuh */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--text-main)]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-md bg-red-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono shadow-2xs">
                  1
                </span>
                <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[10px] font-barlow uppercase shrink-0">
                  RICUH
                </span>
                <span className="font-medium truncate">Kericuhan atau Kekerasan Fisik</span>
              </div>
              <span className="stadium-badge-penalty font-mono tabular-nums shrink-0">-50</span>
            </div>

            {/* 2. Lempar */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--text-main)]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-md bg-red-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono shadow-2xs">
                  2
                </span>
                <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[10px] font-barlow uppercase shrink-0">
                  LEMPAR
                </span>
                <span className="font-medium truncate">Melempar Benda ke Lapangan Pertandingan</span>
              </div>
              <span className="stadium-badge-penalty font-mono tabular-nums shrink-0">-25</span>
            </div>

            {/* 3. Rasis */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--text-main)]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-md bg-red-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono shadow-2xs">
                  3
                </span>
                <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[10px] font-barlow uppercase shrink-0">
                  RASIS
                </span>
                <span className="font-medium truncate">Tindakan Rasisme atau Provokasi Negatif</span>
              </div>
              <span className="stadium-badge-penalty font-mono tabular-nums shrink-0">-15</span>
            </div>

            {/* 4. Flare */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--text-main)]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-md bg-red-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono shadow-2xs">
                  4
                </span>
                <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[10px] font-barlow uppercase shrink-0">
                  FLARE
                </span>
                <span className="font-medium truncate">Membawa Barang Terlarang / Flare / Petasan</span>
              </div>
              <span className="stadium-badge-penalty font-mono tabular-nums shrink-0">-5</span>
            </div>

            {/* 5. Sampah */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--text-main)]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-md bg-red-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono shadow-2xs">
                  5
                </span>
                <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[10px] font-barlow uppercase shrink-0">
                  SAMPAH
                </span>
                <span className="font-medium truncate">Membuang Sampah Sembarangan / Mengotori Tribun</span>
              </div>
              <span className="stadium-badge-penalty font-mono tabular-nums shrink-0">-1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
