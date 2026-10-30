'use client';

import React, { useState } from 'react';
import {
  Play,
  ArrowRight,
  Shield,
  UserCheck,
} from 'lucide-react';
import { AppUser, Match, RefereeMatchDuty, MatchLiveTelemetry } from '@/types';
import { REFEREE_DUTIES } from '@/mocks/multiSportData';
import { initialMatches } from '@/mocks/tournamentData';
import { usePersistentState } from '@/hooks/usePersistentState';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';
import { formatIndonesianFullDate } from '@/lib/calendar';

interface RefereeDashboardHomeProps {
  user: AppUser;
  liveMatch: Match;
  onGoToMatchCenter: (matchId?: string) => void;
  onGoToSchedule: () => void;
  onGoToReports: () => void;
}

export const RefereeDashboardHome: React.FC<RefereeDashboardHomeProps> = ({
  user,
  onGoToMatchCenter,
  onGoToSchedule,
}) => {
  const [isReady, setIsReady] = useState(user.isAvailable !== false);

  const [duties] = usePersistentState<RefereeMatchDuty[]>('sauma_arena_duties', REFEREE_DUTIES);
  const [matches] = usePersistentState<Match[]>('sauma_arena_matches', initialMatches);
  const [telemetryMap] = usePersistentState<Record<string, MatchLiveTelemetry>>(
    'sauma_arena_live_telemetry',
    {}
  );

  // 1. Identifikasi tanggal dan hari saat ini secara dinamis
  const now = new Date();
  const daysId = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthsLong = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const currentDayName = daysId[now.getDay()];
  const currentDateNum = now.getDate();
  const currentMonthShort = monthsShort[now.getMonth()];
  const currentMonthLong = monthsLong[now.getMonth()];
  const currentYear = now.getFullYear();
  const todayFormattedStr = formatIndonesianFullDate(now);

  const isDutyToday = (timeStr: string): boolean => {
    if (!timeStr) return false;
    if (timeStr.toLowerCase().includes('hari ini')) return true;
    const hasDay = timeStr.includes(currentDayName);
    const hasDate = timeStr.includes(String(currentDateNum));
    const hasMonth = timeStr.includes(currentMonthShort) || timeStr.includes(currentMonthLong);
    const hasYear = timeStr.includes(String(currentYear));
    return hasDay && hasDate && hasMonth && hasYear;
  };

  const userDuties = duties.filter(
    (d) => d.refereeId === user.id || user.assignedMatchIds?.includes(d.matchId)
  );
  const activeDuties = userDuties.length > 0 ? userDuties : duties.slice(0, 3);

  // Penugasan hari ini milik wasit (hanya jika tanggal sesuai atau timer sedang berjalan aktif)
  const todayDuties = activeDuties.filter((d) => {
    const isLive = Boolean(telemetryMap[d.matchId]?.isTimerRunning);
    return isDutyToday(d.time) || isLive;
  });

  const displayDuties = todayDuties.length > 0 ? todayDuties : activeDuties;

  const assignmentCards = displayDuties.map((d) => {
    const linkedMatch = matches.find((m) => m.id === d.matchId);
    const telemetry = telemetryMap[d.matchId];

    // Status hanya benar-benar LIVE jika timer sedang aktif berjalan oleh juri
    const isLive = linkedMatch?.status === 'LIVE' && Boolean(telemetry?.isTimerRunning);
    const isCompleted = linkedMatch?.status === 'COMPLETED' || d.status === 'COMPLETED';
    const computedStatus: Match['status'] = isLive ? 'LIVE' : isCompleted ? 'COMPLETED' : 'UPCOMING';

    return {
      id: d.matchId,
      matchNumber: d.matchNumber,
      stage: linkedMatch?.stage || 'GROUP',
      group: linkedMatch?.group || 'A',
      court: d.courtName,
      time: d.time,
      teamA: d.teamA,
      teamB: d.teamB,
      role: d.roleInMatch || 'Wasit Utama (Wasit 1)',
      status: computedStatus,
      scoreA: linkedMatch?.scoreA ?? 0,
      scoreB: linkedMatch?.scoreB ?? 0,
    };
  });

  return (
    <div className="space-y-6 w-full pb-16 animate-fadeIn">
      {/* 1. Header Card Seragam */}
      <AdminPageHeaderCard
        icon={Shield}
        category="MEJA LAPANGAN • KONSOL PETUGAS"
        title="Konsol Juri Lapangan"
        description="Pantau jadwal laga Anda, catat skor langsung di meja lapangan, dan sahkan Berita Acara Pertandingan (BAP)."
        action={
          <button
            type="button"
            onClick={() => onGoToMatchCenter()}
            className="btn-tactile flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] active:scale-[0.98] text-white font-barlow font-bold text-xs uppercase tracking-wider transition-all duration-150 min-h-[42px] cursor-pointer shadow-xs"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Buka Catat Skor</span>
          </button>
        }
      />

      {/* 2. Matchday Telemetry Strip */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-[var(--border-subtle)]">
          <div className="px-2 py-0.5 space-y-0.5">
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              Laga Hari Ini
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-scoreboard font-bold text-[var(--color-arena-primary)] leading-none">
                {todayDuties.length}
              </span>
              <span className="text-xs text-[var(--text-muted)] font-sans">
                {todayDuties.length > 0 ? 'Pertandingan' : 'Laga (Berikutnya: 3 Nov)'}
              </span>
            </div>
          </div>

          <div className="px-2 py-0.5 pt-2.5 md:pt-0.5 space-y-0.5">
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              BAP Disahkan
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-scoreboard font-bold text-emerald-500 leading-none">
                0
              </span>
              <span className="text-xs text-[var(--text-muted)] font-sans">Dokumen Sah</span>
            </div>
          </div>

          <div className="px-2 py-0.5 pt-2.5 md:pt-0.5 space-y-0.5">
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              Sanksi Kartu
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-scoreboard font-bold text-[var(--color-arena-accent)] leading-none">
                0 / 0
              </span>
              <span className="text-xs text-[var(--text-muted)] font-sans">Kuning / Merah</span>
            </div>
          </div>

          <div className="px-2 py-0.5 pt-2.5 md:pt-0.5 space-y-0.5">
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              Status Sertifikasi
            </span>
            <div className="text-base sm:text-lg font-bebas text-[var(--text-main)] leading-none pt-1 truncate">
              {user.licenseLevel || 'FFI Level 2 Nasional'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Asymmetrical Layout: Jadwal Tugas vs Kesiapan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1 & 2: Penugasan Laga */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div>
              <h2 className="font-bebas text-xl sm:text-2xl text-[var(--text-main)] uppercase tracking-wide">
                {todayDuties.length > 0 ? 'Jadwal Laga Hari Ini' : 'Jadwal Laga Terdekat'}
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-sans">
                Hari ini: <strong className="text-[var(--text-main)]">{todayFormattedStr}</strong>
                {todayDuties.length === 0 && ' • Kickoff Laga: Senin, 2 November 2026'}
              </p>
            </div>
            <button
              type="button"
              onClick={onGoToSchedule}
              className="text-xs text-[var(--color-arena-primary)] hover:underline font-barlow font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Semua Jadwal Laga</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {assignmentCards.map((m) => (
              <div
                key={m.id}
                className="p-4 sm:p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 hover:bg-[var(--bg-muted)] hover:border-[var(--color-arena-primary)]/30 transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--color-arena-primary)]">
                      Laga #{m.matchNumber}
                    </span>
                    <span className="text-[var(--text-faint)]">&bull;</span>
                    <span className="text-xs text-[var(--text-muted)]">{m.court}</span>
                    {m.status === 'LIVE' ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 text-[9px] font-barlow font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span>Sedang Berjalan</span>
                      </span>
                    ) : m.status === 'COMPLETED' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-barlow font-bold uppercase tracking-wider">
                        Selesai ({m.scoreA} - {m.scoreB})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-600 dark:text-slate-400 text-[9px] font-barlow font-bold uppercase tracking-wider">
                        Terjadwal (3 Nov 2026)
                      </span>
                    )}
                  </div>
                  <h3 className="font-bebas text-xl text-[var(--text-main)] uppercase tracking-wide">
                    {m.teamA} vs {m.teamB}
                  </h3>
                  <div className="text-xs text-[var(--text-muted)] flex items-center gap-3 font-sans">
                    <span>Mulai: <strong className="text-[var(--text-main)]">{m.time}</strong></span>
                    <span>&bull;</span>
                    <span>Peran: <strong className="text-[var(--text-main)]">{m.role}</strong></span>
                  </div>
                </div>

                <div className="shrink-0 pt-1 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => onGoToMatchCenter(m.id)}
                    className="btn-tactile px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] active:scale-[0.98] text-white text-xs font-barlow font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title={`Buka Meja Lapangan Laga #${m.matchNumber}`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Buka Meja Laga</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom 3: Kesiapan Juri & Hotline Pengawas */}
        <div className="space-y-5">
          {/* Card Kesiapan Tugas */}
          <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bebas text-lg uppercase tracking-wide text-[var(--text-main)]">
                  Kesiapan Bertugas
                </h3>
              </div>
              <span className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${isReady ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            </div>

            <div className="space-y-3 text-xs font-sans">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)]/80 transition-colors duration-150 cursor-pointer">
                <div>
                  <div className="font-semibold text-[var(--text-main)]">
                    {isReady ? 'Siap di Lapangan' : 'Sedang Istirahat'}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {isReady ? 'Tersedia untuk memimpin laga turnamen' : 'Off-duty sementara'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isReady}
                  onChange={(e) => setIsReady(e.target.checked)}
                  className="w-4 h-4 rounded text-[var(--color-arena-primary)] focus:ring-0 cursor-pointer transition-transform active:scale-90"
                />
              </label>

              <div className="p-3 rounded-xl bg-[var(--bg-muted)] space-y-0.5">
                <div className="text-[var(--text-muted)] text-[10px] uppercase font-barlow font-bold tracking-wider">
                  Spesialisasi Cabang Olahraga
                </div>
                <div className="font-barlow font-bold text-sm uppercase text-[var(--text-main)]">
                  {user.specialization || 'Futsal & Bola Voli'}
                </div>
              </div>
            </div>
          </div>

          {/* Hotline Pengawas Pertandingan */}
          <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2.5">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--color-arena-primary)]" />
              <h3 className="font-bebas text-lg uppercase tracking-wide text-[var(--text-main)]">
                Bantuan Meja Pengawas
              </h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
              Jika membutuhkan klarifikasi regulasi teknis atau bantuan pengawas komisi disiplin, hubungi frekuensi radio berikut.
            </p>
            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-sans">
              <span className="text-[var(--text-muted)]">Saluran Radio Handy Talkie:</span>
              <span className="font-mono font-bold text-[var(--color-arena-primary)]">Ch. 4 (Ext. 102)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
