'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Play,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { AppUser, RefereeMatchDuty } from '@/types';
import { REFEREE_DUTIES } from '@/mocks/multiSportData';
import { usePersistentState } from '@/hooks/usePersistentState';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';
import { formatIndonesianFullDate } from '@/lib/calendar';

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

  // 1. Identifikasi tanggal dan hari saat ini secara dinamis
  const now = new Date();
  const daysId = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthsLong = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const currentDayName = daysId[now.getDay()]; // Contoh: "Kamis"
  const currentDateNum = now.getDate(); // Contoh: 29
  const currentMonthShort = monthsShort[now.getMonth()]; // Contoh: "Okt"
  const currentMonthLong = monthsLong[now.getMonth()]; // Contoh: "Oktober"
  const currentYear = now.getFullYear(); // Contoh: 2026
  const todayFormattedStr = formatIndonesianFullDate(now);

  // 2. Fungsi komparasi apakah sebuah laga jatuh pada HARI INI
  const isDutyToday = (duty: RefereeMatchDuty): boolean => {
    if ((duty.status as string) === 'LIVE') return true;
    if (!duty.time) return false;
    if (duty.time.toLowerCase().includes('hari ini')) return true;

    const hasDay = duty.time.includes(currentDayName);
    const hasDate = duty.time.includes(String(currentDateNum));
    const hasMonth = duty.time.includes(currentMonthShort) || duty.time.includes(currentMonthLong);
    const hasYear = duty.time.includes(String(currentYear));

    return hasDay && hasDate && hasMonth && hasYear;
  };

  // 3. Filter data ke tempat yang benar sesuai tanggal dan status
  const historyDuties = duties.filter((d) => d.status === 'COMPLETED');
  const todayDuties = duties.filter((d) => isDutyToday(d) && d.status !== 'COMPLETED');
  const upcomingDuties = duties.filter((d) => !isDutyToday(d) && d.status !== 'COMPLETED');

  // 4. Tentukan segmen tab aktif: jika hari ini tidak ada laga, arahkan langsung ke tab MENDATANG
  const [activeSegment, setActiveSegment] = useState<'TODAY' | 'UPCOMING' | 'HISTORY'>(() => {
    if (initialTab === 'UPCOMING') return 'UPCOMING';
    if (initialTab === 'HISTORY') return 'HISTORY';
    if (todayDuties.length === 0 && upcomingDuties.length > 0) {
      return 'UPCOMING';
    }
    return 'TODAY';
  });

  const displayedDuties =
    activeSegment === 'TODAY'
      ? todayDuties
      : activeSegment === 'UPCOMING'
      ? upcomingDuties
      : historyDuties;

  return (
    <div className="space-y-6 w-full pb-16 animate-fadeIn">
      {/* 1. Header Card Seragam */}
      <AdminPageHeaderCard
        icon={Calendar}
        category="MEJA LAPANGAN • JADWAL LAGA"
        title="Jadwal Laga Wasit"
        description="Daftar seluruh laga dan pertandingan yang dipimpin oleh Anda pada kompetisi ini."
        action={
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] shrink-0">
            <button
              type="button"
              onClick={() => setActiveSegment('TODAY')}
              className={`btn-tactile px-3.5 py-1.5 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                activeSegment === 'TODAY'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Hari Ini ({todayDuties.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSegment('UPCOMING')}
              className={`btn-tactile px-3.5 py-1.5 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                activeSegment === 'UPCOMING'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Mendatang ({upcomingDuties.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSegment('HISTORY')}
              className={`btn-tactile px-3.5 py-1.5 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                activeSegment === 'HISTORY'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Selesai ({historyDuties.length})
            </button>
          </div>
        }
      />

      {/* 2. Status Kalender & Fase Kompetisi Terkini */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 px-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-sans">
        <div className="flex items-center gap-2.5 text-[var(--text-muted)]">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <span>
            Hari ini: <strong className="text-[var(--text-main)] font-semibold">{todayFormattedStr}</strong>
          </span>
          <span className="text-[var(--text-faint)] hidden sm:inline">&bull;</span>
          <span className="text-[var(--text-muted)] hidden sm:inline">
            Status: <strong className="text-[var(--color-arena-primary)]">Pra-Turnamen (H-5 Menuju Kickoff MMFC I)</strong>
          </span>
        </div>
        <div className="text-[11px] font-barlow font-bold text-[var(--color-arena-accent)] uppercase tracking-wider">
          Jadwal Laga: Selasa, 3 November 2026
        </div>
      </div>

      {/* 3. Match List (Daftar Laga) */}
      <div className="space-y-3">
        {displayedDuties.length === 0 ? (
          activeSegment === 'TODAY' ? (
            <div className="p-8 sm:p-12 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="font-bebas text-2xl text-[var(--text-main)] uppercase tracking-wide">
                  Tidak Ada Jadwal Laga Hari Ini
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
                  Hari ini (<strong className="text-[var(--text-main)]">{todayFormattedStr}</strong>) tidak ada jadwal laga wasit yang berlangsung. Seluruh laga babak penyisihan grup MMFC I dijadwalkan dimulai pada hari <strong className="text-[var(--text-main)]">Selasa, 3 November 2026</strong>.
                </p>
              </div>
              {upcomingDuties.length > 0 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveSegment('UPCOMING')}
                    className="btn-tactile inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] active:scale-[0.98] text-white font-barlow font-bold text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-xs"
                  >
                    <span>Buka Jadwal Laga Mendatang ({upcomingDuties.length})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : activeSegment === 'HISTORY' ? (
            <div className="p-8 sm:p-12 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-500/10 text-slate-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-bebas text-xl text-[var(--text-main)] uppercase tracking-wide">
                  Belum Ada Laga Selesai
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-sans">
                  Pertandingan yang telah selesai dan BAP yang telah disahkan akan tercatat di sini.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 sm:p-12 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
              <Calendar className="w-8 h-8 text-[var(--text-faint)] mx-auto" />
              <h3 className="font-bebas text-xl text-[var(--text-main)] uppercase tracking-wide">
                Tidak Ada Jadwal Laga Mendatang
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-sans">
                Tidak ada jadwal laga mendatang untuk Anda.
              </p>
            </div>
          )
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
                    Peran Laga: <strong className="text-[var(--text-main)]">{duty.roleInMatch || 'Wasit Utama'}</strong>
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
