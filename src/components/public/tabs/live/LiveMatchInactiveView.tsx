'use client';

import React, { useState, useEffect } from 'react';
import {
  Radio,
  Clock,
  Calendar,
  MapPin,
  CalendarDays,
  ListOrdered,
  Users,
  Eye,
  Activity,
  CheckCircle2,
  Tv,
} from 'lucide-react';
import Image from 'next/image';
import { Match } from '@/types';
import { tournamentMeta } from '@/mocks/tournamentData';

interface LiveMatchInactiveViewProps {
  nextMatch?: Match;
  onActivatePreview?: () => void;
  onTabChange?: (tab: string) => void;
}

export const LiveMatchInactiveView: React.FC<LiveMatchInactiveViewProps> = ({
  nextMatch,
  onActivatePreview,
  onTabChange,
}) => {
  // Hitung mundur menuju kick-off laga pembuka (Senin, 2 November 2026 07:30 WIB)
  const targetDate = new Date('2026-11-02T07:30:00+07:00').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const teamAName = nextMatch?.teamAName || 'SDI KARDINA MASSA';
  const teamBName = nextMatch?.teamBName || 'MIN 7 BLITAR';
  const teamALogo = nextMatch?.teamALogo || '/teams/default.png';
  const teamBLogo = nextMatch?.teamBLogo || '/teams/default.png';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 animate-fadeIn select-none">
      {/* 1. Hero Standby Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-[var(--color-arena-primary)]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-barlow font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
              <Radio className="w-3.5 h-3.5 text-amber-500" />
              <span>Papan Skor Standby &bull; Belum Ada Laga Berlangsung</span>
            </div>

            <h1 className="font-bebas text-3xl sm:text-4xl text-[var(--text-main)] uppercase tracking-wide leading-tight">
              Live Score Digital Belum Aktif
            </h1>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-sans">
              Papan skor dan stopwatch digital terhubung langsung secara real-time dengan konsol juri meja lapangan.
              Siaran langsung skor akan dimulai otomatis saat peluit kick-off laga pertama ditiup oleh wasit.
            </p>
          </div>

          {/* Quick Preview Toggle Button */}
          {onActivatePreview && (
            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
              <button
                type="button"
                onClick={onActivatePreview}
                className="btn-tactile px-4 py-2.5 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95"
                title="Buka simulasi papan skor lapangan"
              >
                <Eye className="w-4 h-4 text-[var(--color-arena-primary)]" />
                <span>Pratinjau Papan Skor Digital</span>
              </button>
              <span className="text-[10px] text-[var(--text-muted)] text-center font-mono">
                Simulasi tampilan jumbotron wasit
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Opening Match Showcase Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-primary)] block">
              Laga Perdana Pembuka Turnamen &bull; Hari-1
            </span>
            <h3 className="font-bebas text-xl sm:text-2xl text-[var(--text-main)] uppercase tracking-wide flex items-center gap-2 mt-0.5">
              <Tv className="w-5 h-5 text-[var(--color-arena-accent)] shrink-0" />
              <span>Pertandingan Berikutnya di Lapangan</span>
            </h3>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] font-mono">
            <Clock className="w-3.5 h-3.5 text-[var(--color-arena-accent)]" />
            <span>Senin, 2 Nov 2026 &bull; 07:30 WIB</span>
          </div>
        </div>

        {/* Matchup Banner: Team A vs Team B */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center p-5 sm:p-6 rounded-xl bg-[var(--bg-muted)]/40 border border-[var(--border-subtle)]">
          {/* Team A */}
          <div className="md:col-span-5 flex items-center gap-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-2 flex items-center justify-center shrink-0 shadow-xs">
              <Image
                src={teamALogo}
                alt={teamAName}
                width={48}
                height={48}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded-md bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] text-[10px] font-barlow font-bold uppercase tracking-wider">
                Tim A &bull; Grup A
              </span>
              <h4 className="font-bebas text-xl sm:text-2xl text-[var(--text-main)] uppercase tracking-wide leading-none">
                {teamAName}
              </h4>
              <p className="text-[11px] text-[var(--text-muted)] font-sans">
                SD Islam Kardina Massa Blitar
              </p>
            </div>
          </div>

          {/* VS & Badge Center */}
          <div className="md:col-span-1 flex flex-col items-center justify-center py-2 md:py-0">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center shadow-xs">
              <span className="font-bebas text-lg text-[var(--color-arena-accent)] font-bold">VS</span>
            </div>
            <span className="text-[9px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1">
              Laga #1
            </span>
          </div>

          {/* Team B */}
          <div className="md:col-span-5 flex items-center justify-start md:justify-end gap-3.5 md:text-right">
            <div className="space-y-1 order-2 md:order-1">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-barlow font-bold uppercase tracking-wider">
                Tim B &bull; Grup A
              </span>
              <h4 className="font-bebas text-xl sm:text-2xl text-[var(--text-main)] uppercase tracking-wide leading-none">
                {teamBName}
              </h4>
              <p className="text-[11px] text-[var(--text-muted)] font-sans">
                Madrasah Ibtidaiyah Negeri 7 Blitar
              </p>
            </div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-2 flex items-center justify-center shrink-0 shadow-xs order-1 md:order-2">
              <Image
                src={teamBLogo}
                alt={teamBName}
                width={48}
                height={48}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Countdown Cards */}
        <div className="space-y-2 pt-2">
          <div className="text-center">
            <span className="text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Hitung Mundur Menuju Kickoff Turnamen
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-xl mx-auto">
            <div className="p-3 sm:p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-center">
              <div className="font-teko text-3xl sm:text-4xl font-bold text-[var(--text-main)] leading-none">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <span className="text-[10px] sm:text-xs text-[var(--text-muted)] font-barlow uppercase font-medium">
                Hari
              </span>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-center">
              <div className="font-teko text-3xl sm:text-4xl font-bold text-[var(--text-main)] leading-none">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="text-[10px] sm:text-xs text-[var(--text-muted)] font-barlow uppercase font-medium">
                Jam
              </span>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-center">
              <div className="font-teko text-3xl sm:text-4xl font-bold text-[var(--text-main)] leading-none">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="text-[10px] sm:text-xs text-[var(--text-muted)] font-barlow uppercase font-medium">
                Menit
              </span>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-center">
              <div className="font-teko text-3xl sm:text-4xl font-bold text-[var(--color-arena-primary)] leading-none">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <span className="text-[10px] sm:text-xs text-[var(--text-muted)] font-barlow uppercase font-medium">
                Detik
              </span>
            </div>
          </div>
        </div>

        {/* Venue Info Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-red-500 shrink-0" />
            <span>{tournamentMeta.venueDetail.name} &bull; {tournamentMeta.venueDetail.courtName}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-[var(--color-arena-primary)] shrink-0" />
            <span>{tournamentMeta.dates}</span>
          </div>
        </div>
      </div>

      {/* 3. System Readiness Telemetry Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              Papan Skor Digital
            </span>
            <span className="text-xs font-bold text-[var(--text-main)]">Sistem Online &bull; Siap Operasi</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              Konsol Wasit &amp; Juri
            </span>
            <span className="text-xs font-bold text-[var(--text-main)]">Standby di Meja Lapangan</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              Siaran Skor Real-time
            </span>
            <span className="text-xs font-bold text-[var(--text-main)]">Otomatis Aktif saat Kickoff</span>
          </div>
        </div>
      </div>

      {/* 4. Quick Navigation Cards while Waiting */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3.5 shadow-xs">
        <div>
          <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-primary)] block">
            Jelajahi Informasi Turnamen
          </span>
          <h4 className="font-bebas text-lg text-[var(--text-main)] uppercase tracking-wide">
            Menu Publik Selagi Menunggu Pertandingan
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onTabChange?.('schedule')}
            className="p-4 rounded-xl bg-[var(--bg-muted)]/50 hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)]/40 text-left transition-all group flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] text-[var(--color-arena-primary)] group-hover:scale-105 transition-transform shadow-2xs shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="font-barlow font-bold text-xs uppercase tracking-wide text-[var(--text-main)] block">
                Jadwal 17 Pertandingan
              </span>
              <p className="text-[11px] text-[var(--text-muted)] leading-snug">
                Rundown lengkap Hari-1 dan Hari-2 turnamen futsal.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onTabChange?.('standings')}
            className="p-4 rounded-xl bg-[var(--bg-muted)]/50 hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)]/40 text-left transition-all group flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] text-amber-500 group-hover:scale-105 transition-transform shadow-2xs shrink-0">
              <ListOrdered className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="font-barlow font-bold text-xs uppercase tracking-wide text-[var(--text-main)] block">
                Klasemen &amp; Bagan Gugur
              </span>
              <p className="text-[11px] text-[var(--text-muted)] leading-snug">
                Persaingan 14 tim sekolah di Grup A, B, C, dan D.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onTabChange?.('teams')}
            className="p-4 rounded-xl bg-[var(--bg-muted)]/50 hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)]/40 text-left transition-all group flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] text-emerald-500 group-hover:scale-105 transition-transform shadow-2xs shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="font-barlow font-bold text-xs uppercase tracking-wide text-[var(--text-main)] block">
                Daftar Kontingen Tim
              </span>
              <p className="text-[11px] text-[var(--text-muted)] leading-snug">
                Profil sekolah, roster atlet, dan nomor punggung pemain.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
