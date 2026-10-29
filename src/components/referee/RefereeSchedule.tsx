'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Play,
} from 'lucide-react';
import { AppUser, RefereeMatchDuty } from '@/types';
import { REFEREE_DUTIES } from '@/mocks/multiSportData';
import { usePersistentState } from '@/hooks/usePersistentState';

interface RefereeScheduleProps {
  user: AppUser;
  initialTab?: 'TODAY' | 'UPCOMING' | 'HISTORY' | string;
  onSelectDutyMatch: (match: RefereeMatchDuty) => void;
}

export const RefereeSchedule: React.FC<RefereeScheduleProps> = ({
  user,
  initialTab = 'TODAY',
  onSelectDutyMatch,
}) => {
  const [duties] = usePersistentState<RefereeMatchDuty[]>('sauma_arena_duties', REFEREE_DUTIES);
  const [activeSegment, setActiveSegment] = useState<'TODAY' | 'UPCOMING' | 'HISTORY'>(
    initialTab === 'UPCOMING' ? 'UPCOMING' : initialTab === 'HISTORY' ? 'HISTORY' : 'TODAY'
  );

  const todayDuties = duties.filter(
    (d) => d.time.includes('Hari Ini') || (d.status as string) === 'LIVE' || d.matchNumber <= 10
  );
  const upcomingDuties = duties.filter((d) => d.status === 'UPCOMING');
  const historyDuties = duties.filter((d) => d.status === 'COMPLETED');

  const displayedDuties =
    activeSegment === 'TODAY'
      ? todayDuties
      : activeSegment === 'UPCOMING'
      ? upcomingDuties
      : historyDuties;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* 1. Header Banner - Crisp border, athletic dark pitch broadcast header */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#071F14] text-white border border-emerald-900/40 shadow-xs transition-all duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <h1 className="font-bebas text-3xl sm:text-4xl tracking-wide uppercase text-white leading-none">
              JADWAL PENUGASAN WASIT
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-sans">
              Daftar seluruh pertandingan yang ditugaskan kepada Anda pada kompetisi ini.
            </p>
          </div>

          {/* 3-Tab Segmented Filter: Hari Ini | Mendatang | Selesai */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#04120C] border border-[#143D28] shrink-0">
            <button
              type="button"
              onClick={() => setActiveSegment('TODAY')}
              className={`btn-tactile px-4 py-2 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                activeSegment === 'TODAY'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hari Ini ({todayDuties.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSegment('UPCOMING')}
              className={`btn-tactile px-4 py-2 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                activeSegment === 'UPCOMING'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mendatang ({upcomingDuties.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSegment('HISTORY')}
              className={`btn-tactile px-4 py-2 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                activeSegment === 'HISTORY'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Selesai ({historyDuties.length})
            </button>
          </div>
        </div>
      </div>

      {/* 2. Duty Match List */}
      <div className="space-y-3">
        {displayedDuties.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <Calendar className="w-7 h-7 text-[var(--text-faint)] mx-auto" />
            <h3 className="font-bebas text-lg text-[var(--text-main)] uppercase tracking-wide">
              Tidak Ada Penugasan
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto font-sans">
              Tidak ada jadwal pertandingan pada kategori {activeSegment === 'TODAY' ? 'hari ini' : activeSegment === 'UPCOMING' ? 'mendatang' : 'selesai'}.
            </p>
          </div>
        ) : (
          displayedDuties.map((duty) => (
            <div
              key={duty.id}
              className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)]/40 hover:-translate-y-0.5 transition-all duration-200 space-y-3.5"
            >
              {/* Meta Row */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider ${
                      (duty.status as string) === 'LIVE'
                        ? 'bg-red-500/15 text-red-600 dark:text-red-400 font-bold'
                        : duty.status === 'COMPLETED'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold'
                        : 'bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)]'
                    }`}
                  >
                    {(duty.status as string) === 'LIVE' ? 'Sedang Berjalan' : duty.status === 'COMPLETED' ? 'Selesai & BAP Sah' : 'Terjadwal'}
                  </span>
                  <span className="font-mono font-bold text-xs text-[var(--color-arena-primary)]">
                    Laga #{duty.matchNumber}
                  </span>
                  <span className="text-[var(--text-faint)]">&bull;</span>
                  <span className="text-[var(--text-muted)] uppercase font-barlow font-bold text-xs tracking-wider">
                    {duty.sport}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)] font-sans">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
                    <span className="font-mono text-xs">{duty.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-arena-accent)]" />
                    <span>{duty.courtName}</span>
                  </div>
                </div>
              </div>

              {/* Matchup & CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-[var(--border-subtle)]/60">
                <div className="space-y-0.5">
                  <h3 className="font-bebas text-2xl text-[var(--text-main)] uppercase tracking-wide">
                    {duty.teamA} <span className="text-[var(--color-arena-accent)] text-lg">VS</span> {duty.teamB}
                  </h3>
                  <div className="text-xs text-[var(--text-muted)] font-sans">
                    Penugasan: <strong className="text-[var(--text-main)]">{duty.roleInMatch || 'Wasit Utama'}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectDutyMatch(duty)}
                  className="btn-tactile px-4 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] active:scale-[0.98] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-150 shrink-0 min-h-[42px] cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Buka Meja Laga</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
