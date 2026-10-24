'use client';

import React, { useState } from 'react';
import {
  Clock,
  Play,
  ArrowRight,
  Shield,
  UserCheck,
} from 'lucide-react';
import { AppUser, Match } from '@/types';

interface RefereeDashboardHomeProps {
  user: AppUser;
  liveMatch: Match;
  onGoToMatchCenter: () => void;
  onGoToSchedule: () => void;
  onGoToReports: () => void;
}

export const RefereeDashboardHome: React.FC<RefereeDashboardHomeProps> = ({
  user,
  liveMatch,
  onGoToMatchCenter,
  onGoToSchedule,
}) => {
  const [isReady, setIsReady] = useState(user.isAvailable !== false);

  const TODAY_ASSIGNMENTS = [
    {
      id: 'match-101',
      matchNumber: 1,
      court: 'Lapangan Utama (Vinyl)',
      time: '08:30 WIB',
      teamA: 'MIN 1 Kota',
      teamB: 'MIS Al-Hidayah',
      role: 'Wasit Utama (Wasit 1)',
      status: 'LIVE' as const,
    },
    {
      id: 'match-103',
      matchNumber: 3,
      court: 'Lapangan 2 (Semen)',
      time: '14:00 WIB',
      teamA: 'SDN 2 Harapan',
      teamB: 'MIS Darussalam',
      role: 'Wasit Cadangan / Meja',
      status: 'UPCOMING' as const,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* 1. Header Banner - Quieter: Subtle 1px border, no loud gradient or blobs */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#0D1E30] text-white border border-[#1C3B5B] relative overflow-hidden transition-all duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1">
            <h1 className="font-bebas text-3xl sm:text-4xl tracking-wide uppercase text-white leading-none">
              KONSOL JURI LAPANGAN
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-sans">
              Pantau jadwal laga Anda, catat skor langsung di meja lapangan, dan sahkan Berita Acara Pertandingan (BAP).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onGoToMatchCenter}
              className="btn-tactile flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white font-barlow font-bold text-xs uppercase tracking-wider transition-all duration-150 min-h-[46px]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Buka Catat Skor</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Matchday Telemetry Strip - Quieter & Distilled: Clean horizontal data bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-[var(--border-subtle)]">
          <div className="px-2 py-0.5 space-y-0.5">
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              Tugas Hari Ini
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-scoreboard font-bold text-[var(--color-arena-primary)] leading-none">
                2
              </span>
              <span className="text-xs text-[var(--text-muted)] font-sans">Pertandingan</span>
            </div>
          </div>

          <div className="px-2 py-0.5 pt-2.5 md:pt-0.5 space-y-0.5">
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              BAP Disahkan
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-scoreboard font-bold text-emerald-500 leading-none">
                3
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
                6 / 1
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

      {/* 4. Asymmetrical Layout: Jadwal Hari Ini (2/3) vs Kesiapan & Pengawas (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1 & 2: Penugasan Hari Ini */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div>
              <h2 className="font-bebas text-xl sm:text-2xl text-[var(--text-main)] uppercase tracking-wide">
                Jadwal Tugas Hari Ini
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-sans">Sabtu, 24 Oktober 2026</p>
            </div>
            <button
              type="button"
              onClick={onGoToSchedule}
              className="text-xs text-[var(--color-arena-primary)] hover:underline font-barlow font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <span>Semua Jadwal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {TODAY_ASSIGNMENTS.map((m) => (
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
                      <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 text-[9px] font-barlow font-bold uppercase tracking-wider">
                        Sedang Berjalan
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-600 dark:text-slate-400 text-[9px] font-barlow font-bold uppercase tracking-wider">
                        Terjadwal
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
                  {m.status === 'LIVE' ? (
                    <button
                      type="button"
                      onClick={onGoToMatchCenter}
                      className="btn-tactile px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] active:scale-[0.98] text-white text-xs font-barlow font-bold uppercase tracking-wider transition-all duration-150"
                    >
                      Buka Meja Laga
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onGoToSchedule}
                      className="btn-tactile px-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider hover:bg-[var(--bg-muted)] active:scale-[0.98] transition-all duration-150"
                    >
                      Rincian Laga
                    </button>
                  )}
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
                    {isReady ? 'Tersedia untuk memimpin laga hari ini' : 'Off-duty sementara'}
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

          {/* Hotline Pengawas Pertandingan - Clarified copy */}
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
