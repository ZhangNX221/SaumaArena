'use client';

import React from 'react';
import { Plus, Minus, AlertTriangle, ShieldAlert } from 'lucide-react';
import { FlattenedAthlete } from '@/types';

interface PlayerPerformanceRowProps {
  athlete: FlattenedAthlete;
  onUpdateStat: (
    athleteId: string,
    teamId: string,
    field: 'goals' | 'yellowCards' | 'redCards',
    delta: number
  ) => void;
}

export const PlayerPerformanceRow: React.FC<PlayerPerformanceRowProps> = ({
  athlete,
  onUpdateStat,
}) => {
  const isSuspended = (athlete.redCards || 0) > 0 || (athlete.yellowCards || 0) >= 2;
  const hasYellowWarning = (athlete.yellowCards || 0) === 1 && (athlete.redCards || 0) === 0;

  return (
    <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
      {/* Kolom Informasi Atlet */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Nomor Punggung Badge */}
        <div
          className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0 font-teko font-bold leading-none border ${
            isSuspended
              ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
              : hasYellowWarning
              ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
              : 'bg-[var(--bg-muted)] text-[var(--color-arena-primary)] border-[var(--border-subtle)]'
          }`}
        >
          <span className="text-[9px] uppercase tracking-wider font-barlow text-[var(--text-muted)]">No</span>
          <span className="text-xl leading-none">#{athlete.number}</span>
        </div>

        {/* Detail Nama, Tim & Madrasah */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-barlow font-bold text-sm sm:text-base text-[var(--text-main)] truncate">
              {athlete.name}
            </h4>
            {athlete.athleteCode && (
              <span className="font-mono text-[10px] font-bold text-[var(--color-arena-primary)] px-1.5 py-0.5 rounded bg-[var(--color-arena-primary-light)]">
                {athlete.athleteCode}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-[var(--bg-muted)] text-[10px] font-mono font-bold text-[var(--text-muted)] border border-[var(--border-subtle)] uppercase">
              {athlete.position || 'PEMAIN'}
            </span>
            {isSuspended ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-500/30">
                <ShieldAlert className="w-3 h-3" />
                <span>Larangan Main / Suspensi</span>
              </span>
            ) : hasYellowWarning ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/30">
                <AlertTriangle className="w-3 h-3" />
                <span>1 KK (Waspada)</span>
              </span>
            ) : null}
          </div>

          <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5 truncate">
            <span className="font-semibold text-[var(--text-main)]">{athlete.teamName}</span>
            {athlete.group && <span>• Grup {athlete.group}</span>}
            {athlete.schoolName && athlete.schoolName !== athlete.teamName && (
              <span className="hidden sm:inline text-[var(--text-muted)]">• {athlete.schoolName}</span>
            )}
          </div>
        </div>
      </div>

      {/* Kolom Counter Aksi Meja Juri */}
      <div className="flex items-center justify-between md:justify-end gap-2.5 sm:gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)] shrink-0">
        {/* Kontrol Gol */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
            <span>Gol</span>
          </span>
          <div className="flex items-center bg-[var(--bg-muted)] rounded-lg p-0.5 border border-[var(--border-subtle)] shadow-2xs">
            <button
              type="button"
              disabled={(athlete.goals || 0) <= 0}
              onClick={() => onUpdateStat(athlete.id, athlete.teamId, 'goals', -1)}
              className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-muted)] hover:text-rose-500 hover:bg-[var(--bg-surface)] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
              aria-label={`Kurangi gol ${athlete.name}`}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-teko font-bold text-lg text-emerald-600 dark:text-emerald-400 leading-none">
              {athlete.goals || 0}
            </span>
            <button
              type="button"
              onClick={() => onUpdateStat(athlete.id, athlete.teamId, 'goals', 1)}
              className="w-7 h-7 flex items-center justify-center rounded-md text-emerald-600 hover:bg-emerald-500/20 active:scale-95 transition-all cursor-pointer font-bold"
              aria-label={`Tambah gol ${athlete.name}`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Kontrol Kartu Kuning */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-amber-500 mb-1 flex items-center gap-1">
            <span className="w-2 h-2.5 bg-amber-400 rounded-2xs inline-block shadow-2xs" />
            <span>Kuning</span>
          </span>
          <div className="flex items-center bg-[var(--bg-muted)] rounded-lg p-0.5 border border-[var(--border-subtle)] shadow-2xs">
            <button
              type="button"
              disabled={(athlete.yellowCards || 0) <= 0}
              onClick={() => onUpdateStat(athlete.id, athlete.teamId, 'yellowCards', -1)}
              className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-muted)] hover:text-rose-500 hover:bg-[var(--bg-surface)] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
              aria-label={`Kurangi kartu kuning ${athlete.name}`}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-teko font-bold text-lg text-amber-500 leading-none">
              {athlete.yellowCards || 0}
            </span>
            <button
              type="button"
              onClick={() => onUpdateStat(athlete.id, athlete.teamId, 'yellowCards', 1)}
              className="w-7 h-7 flex items-center justify-center rounded-md text-amber-500 hover:bg-amber-500/20 active:scale-95 transition-all cursor-pointer font-bold"
              aria-label={`Tambah kartu kuning ${athlete.name}`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Kontrol Kartu Merah */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1">
            <span className="w-2 h-2.5 bg-rose-500 rounded-2xs inline-block shadow-2xs" />
            <span>Merah</span>
          </span>
          <div className="flex items-center bg-[var(--bg-muted)] rounded-lg p-0.5 border border-[var(--border-subtle)] shadow-2xs">
            <button
              type="button"
              disabled={(athlete.redCards || 0) <= 0}
              onClick={() => onUpdateStat(athlete.id, athlete.teamId, 'redCards', -1)}
              className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-muted)] hover:text-rose-500 hover:bg-[var(--bg-surface)] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
              aria-label={`Kurangi kartu merah ${athlete.name}`}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-teko font-bold text-lg text-rose-600 dark:text-rose-400 leading-none">
              {athlete.redCards || 0}
            </span>
            <button
              type="button"
              onClick={() => onUpdateStat(athlete.id, athlete.teamId, 'redCards', 1)}
              className="w-7 h-7 flex items-center justify-center rounded-md text-rose-600 hover:bg-rose-500/20 active:scale-95 transition-all cursor-pointer font-bold"
              aria-label={`Tambah kartu merah ${athlete.name}`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

