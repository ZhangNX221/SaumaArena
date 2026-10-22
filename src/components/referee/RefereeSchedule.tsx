'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import { REFEREE_DUTIES } from '@/mocks/multiSportData';
import { RefereeMatchDuty, AppUser } from '@/types';

interface RefereeScheduleProps {
  onSelectDutyMatch: (duty: RefereeMatchDuty) => void;
  user?: AppUser;
}

export const RefereeSchedule: React.FC<RefereeScheduleProps> = ({ onSelectDutyMatch, user }) => {
  const [filter, setFilter] = useState<'UPCOMING' | 'COMPLETED'>('UPCOMING');

  const myDuties = user
    ? REFEREE_DUTIES.filter(
        (d) => d.refereeId === user.id || user.assignedMatchIds?.includes(d.matchId)
      )
    : REFEREE_DUTIES;

  const activeDuties = myDuties.length > 0 ? myDuties : REFEREE_DUTIES;

  const filteredDuties = activeDuties.filter((d) =>
    filter === 'UPCOMING' ? d.status !== 'COMPLETED' : d.status === 'COMPLETED'
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] font-[var(--font-display)]">
            Jadwal Pertandingan Saya
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Daftar tugas resmi juri lapangan beserta alokasi waktu dan venue GOR Matsanega Futsal Court Indoor.
          </p>
        </div>

        {/* Segmented Filter */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold w-fit">
          <button
            type="button"
            onClick={() => setFilter('UPCOMING')}
            className={`btn-tactile px-4 py-2 rounded-lg transition-all min-h-[38px] ${
              filter === 'UPCOMING'
                ? 'bg-[#33658a] text-white shadow-xs font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Akan Datang ({REFEREE_DUTIES.filter((d) => d.status !== 'COMPLETED').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('COMPLETED')}
            className={`btn-tactile px-4 py-2 rounded-lg transition-all min-h-[38px] ${
              filter === 'COMPLETED'
                ? 'bg-[#33658a] text-white shadow-xs font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Riwayat Selesai ({REFEREE_DUTIES.filter((d) => d.status === 'COMPLETED').length})
          </button>
        </div>
      </div>

      {/* Duty Cards List */}
      <div className="space-y-3">
        {filteredDuties.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)]">
            Tidak ada pertandingan pada daftar ini.
          </div>
        ) : (
          filteredDuties.map((duty) => (
            <div
              key={duty.id}
              className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#33658a]/40 shadow-xs transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      duty.status === 'LIVE'
                        ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                        : duty.status === 'COMPLETED'
                        ? 'bg-slate-500/15 text-slate-700 dark:text-slate-300'
                        : 'bg-[#33658a]/10 text-[#33658a] dark:text-sky-300'
                    }`}
                  >
                    {duty.status === 'LIVE' ? 'Sedang Berjalan' : duty.status === 'COMPLETED' ? 'Selesai & BAP Sah' : 'Mendatang'}
                  </span>
                  <span className="font-bold text-[var(--text-main)]">Laga #{duty.matchNumber}</span>
                  <span className="text-[var(--text-faint)]">&bull;</span>
                  <span className="text-[var(--text-muted)] uppercase font-semibold text-[11px]">{duty.sport}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#33658a]" />
                    <span>{duty.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#33658a]" />
                    <span>{duty.courtName}</span>
                  </div>
                </div>
              </div>

              {/* Matchup Header */}
              <div className="flex items-center justify-between pt-1">
                <div className="text-sm sm:text-base font-extrabold text-[var(--text-main)]">
                  <span>{duty.teamA}</span>
                  <span className="text-xs text-[var(--text-muted)] font-normal mx-2.5">vs</span>
                  <span>{duty.teamB}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectDutyMatch(duty)}
                  className="btn-tactile px-4 py-2 rounded-xl bg-[#33658a] hover:bg-[#264e6b] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Buka Match Center</span>
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
