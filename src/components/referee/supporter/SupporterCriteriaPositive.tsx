'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface SupporterCriteriaPositiveProps {
  choreography: boolean;
  setChoreography: (val: boolean) => void;
  schoolMascot: boolean;
  setSchoolMascot: (val: boolean) => void;
  supporterUniform: boolean;
  setSupporterUniform: (val: boolean) => void;
  cheerMin3Chants: boolean;
  setCheerMin3Chants: (val: boolean) => void;
  checkedInTickets: number;
  setCheckedInTickets: (val: number) => void;
  positiveScore: number;
}

export const SupporterCriteriaPositive: React.FC<SupporterCriteriaPositiveProps> = ({
  choreography,
  setChoreography,
  schoolMascot,
  setSchoolMascot,
  supporterUniform,
  setSupporterUniform,
  cheerMin3Chants,
  setCheerMin3Chants,
  checkedInTickets,
  setCheckedInTickets,
  positiveScore,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
        <span className="text-xs font-barlow font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>2. Kriteria Positif &amp; Kreativitas (Bonus)</span>
        </span>
        <span className="text-[10px] text-[var(--text-muted)] font-mono">
          Total Positif: +{positiveScore}
        </span>
      </div>

      <div className="space-y-2.5">
        <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] cursor-pointer transition-all">
          <div className="space-y-0.5">
            <span className="font-barlow font-bold text-xs uppercase text-[var(--text-main)] block">
              Koreografi Tribun
            </span>
            <p className="text-[11px] text-[var(--text-muted)]">
              Kreativitas visual, mozaik kertas/kain, formasi banner terkoordinasi rapi.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-emerald-600">+25</span>
            <input
              type="checkbox"
              checked={choreography}
              onChange={(e) => setChoreography(e.target.checked)}
              className="w-4 h-4 rounded text-[var(--color-arena-primary)] focus:ring-0 cursor-pointer"
            />
          </div>
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] cursor-pointer transition-all">
          <div className="space-y-0.5">
            <span className="font-barlow font-bold text-xs uppercase text-[var(--text-main)] block">
              Maskot Sekolah
            </span>
            <p className="text-[11px] text-[var(--text-muted)]">
              Kehadiran maskot berkostum aktif memandu dan menyemangati suporter di tribun.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-emerald-600">+20</span>
            <input
              type="checkbox"
              checked={schoolMascot}
              onChange={(e) => setSchoolMascot(e.target.checked)}
              className="w-4 h-4 rounded text-[var(--color-arena-primary)] focus:ring-0 cursor-pointer"
            />
          </div>
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] cursor-pointer transition-all">
          <div className="space-y-0.5">
            <span className="font-barlow font-bold text-xs uppercase text-[var(--text-main)] block">
              Keseragaman Seragam / Atribut
            </span>
            <p className="text-[11px] text-[var(--text-muted)]">
              Suporter mengenakan pakaian, kaos sekolah, atau atribut warna serasi.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-emerald-600">+15</span>
            <input
              type="checkbox"
              checked={supporterUniform}
              onChange={(e) => setSupporterUniform(e.target.checked)}
              className="w-4 h-4 rounded text-[var(--color-arena-primary)] focus:ring-0 cursor-pointer"
            />
          </div>
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] cursor-pointer transition-all">
          <div className="space-y-0.5">
            <span className="font-barlow font-bold text-xs uppercase text-[var(--text-main)] block">
              Yel-Yel Semangat Positif (Min. 3 Lagu)
            </span>
            <p className="text-[11px] text-[var(--text-muted)]">
              Bernyanyi teratur sepanjang laga tanpa kata kasar atau provokasi.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-emerald-600">+10</span>
            <input
              type="checkbox"
              checked={cheerMin3Chants}
              onChange={(e) => setCheerMin3Chants(e.target.checked)}
              className="w-4 h-4 rounded text-[var(--color-arena-primary)] focus:ring-0 cursor-pointer"
            />
          </div>
        </label>

        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)]">
          <div className="space-y-0.5">
            <span className="font-barlow font-bold text-xs uppercase text-[var(--text-main)] block">
              Penilaian Kehadiran Suporter (+1 / match)
            </span>
            <p className="text-[11px] text-[var(--text-muted)]">
              Diberikan +1 poin per pertandingan (match) yang dihadiri oleh rombongan suporter madrasah.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-emerald-600">+1 / match</span>
            <input
              type="checkbox"
              checked={checkedInTickets > 0}
              onChange={(e) => setCheckedInTickets(e.target.checked ? 1 : 0)}
              className="w-4 h-4 rounded text-[var(--color-arena-primary)] focus:ring-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

