'use client';

import React from 'react';
import { Download, ShieldCheck, MapPin, Clock, Award, Building2, CheckCircle2, ExternalLink, Info } from 'lucide-react';
import { tournamentMeta } from '@/mocks/tournamentData';
import { CABOR_INFO_DATA } from '@/mocks/caborContentData';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';
import { SportCode } from '@/types';

interface InfoTabProps {
  sportCode?: SportCode;
}

export const InfoTab: React.FC<InfoTabProps> = ({ sportCode = 'FUTSAL' }) => {
  const caborMeta = CABOR_INFO_DATA[sportCode] || CABOR_INFO_DATA.FUTSAL;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Public Page Header */}
      <div className="space-y-1.5 pb-2">
        <div className="flex items-center gap-2 text-[var(--color-arena-primary)]">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[11px] font-black uppercase tracking-widest">
            PANDUAN &amp; REGULASI RESMI &bull; {caborMeta.sportName.toUpperCase()}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
          Informasi &amp; Petunjuk Teknis
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Format kompetisi, durasi waktu pertandingan, jadwal verifikasi berkas kontingen, serta alur akses venue stadion.
        </p>
      </div>

      {/* Flagship Tournament Architecture Hero */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-black uppercase tracking-widest text-[var(--color-arena-primary)]">
                Struktur Kompetisi Resmi &bull; {caborMeta.sportName}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
              {caborMeta.formatTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
              {caborMeta.formatSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => alert(`Mengunduh berkas regulasi: ${caborMeta.juknisFileName}`)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-arena-dark)] text-white hover:bg-slate-800 text-xs sm:text-sm font-bold shadow-xs transition-colors min-h-[44px]"
            >
              <Download className="w-4 h-4 text-[var(--color-arena-accent)]" />
              <span>Unduh Juknis {caborMeta.sportName} (PDF)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Format Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--color-arena-primary)] uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>{caborMeta.durationLabel}</span>
            </div>
            <h3 className="font-extrabold text-base text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
              {caborMeta.durationValue}
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {caborMeta.durationDesc}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--color-arena-accent)] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{caborMeta.disciplineLabel}</span>
            </div>
            <h3 className="font-extrabold text-base text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
              {caborMeta.disciplineValue}
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {caborMeta.disciplineDesc}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Kategori Penghargaan</span>
            </div>
            <h3 className="font-extrabold text-base text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
              Piala Bergilir &amp; E-Sertifikat
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Juara 1, 2, 3, Best Player/MVP, dan Juara Best Supporter Tribun dengan sertifikat digital resmi ber-QR.
            </p>
          </div>
        </div>
      </div>

      {/* Venue & Gate Access Guide */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] border border-[var(--border-subtle)]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[var(--text-main)] font-[var(--font-display)]">
                Informasi Venue: {caborMeta.venueName}
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                {caborMeta.venueAddress} &bull; Kapasitas {caborMeta.venueCapacity}
              </p>
            </div>
          </div>

          <a
            href={caborMeta.googleMapsUrl || tournamentMeta.venueDetail?.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-tactile inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <MapPin className="w-4 h-4 text-[var(--color-arena-accent)]" />
            <span>Buka di Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[var(--text-muted)]">
          <div className="p-5 rounded-xl bg-[var(--bg-muted)]/60 border border-[var(--border-subtle)] space-y-3">
            <h4 className="font-extrabold text-sm text-[var(--text-main)] font-[var(--font-display)] tracking-tight">Fasilitas Arena Lapangan</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-arena-primary)] shrink-0 mt-0.5" />
                <span>{caborMeta.venueCourt} dengan pencahayaan LED standar turnamen.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-arena-primary)] shrink-0 mt-0.5" />
                <span>Ruang Medis &amp; Tim Dokter siaga sepanjang pertandingan cabor {caborMeta.sportName}.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-arena-primary)] shrink-0 mt-0.5" />
                <span>Layar LED Live Score real-time di atas meja juri dan tribun suporter.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-[var(--bg-muted)]/60 border border-[var(--border-subtle)] space-y-3">
            <h4 className="font-extrabold text-sm text-[var(--text-main)] font-[var(--font-display)] tracking-tight">Alur Pintu Masuk (Gate Access)</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-subtle)]">
                <strong className="text-[var(--text-main)]">Gate Barat (VIP &amp; Atlet)</strong>
                <span className="text-[11px] text-[var(--text-muted)]">Khusus Pemain, Pelatih &amp; Juri Meja</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-subtle)]">
                <strong className="text-[var(--text-main)]">Gate Timur 1 (Suporter)</strong>
                <span className="text-[11px] text-[var(--color-arena-primary)] font-semibold font-mono">Scan QR Rombongan (+1 Poin)</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <strong className="text-[var(--text-main)]">Gate Timur 2 (Umum)</strong>
                <span className="text-[11px] text-[var(--text-muted)]">Penonton Reguler Mandiri</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Penyelenggara & Mitra Resmi Turnamen */}
      <div className="pt-8 border-t border-[var(--border-subtle)] space-y-4">
        <div className="text-center">
          <span className="text-[11px] font-mono uppercase font-black tracking-widest text-[var(--text-faint)]">
            PENYELENGGARA &amp; MITRA RESMI TURNAMEN
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Panitia Milad */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2.5 transition-colors hover:border-[var(--color-arena-primary)]/40 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0 text-left">
              <div className="text-xs font-bold text-[var(--text-main)] truncate">Panitia Milad Matsanega</div>
              <div className="text-[10px] text-[var(--text-muted)] truncate">Penyelenggara Utama</div>
            </div>
          </div>

          {/* 2. Kemenag */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2.5 transition-colors hover:border-[var(--color-arena-primary)]/40 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-green-600/10 border border-green-600/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-green-700 dark:text-green-400" />
            </div>
            <div className="min-w-0 text-left">
              <div className="text-xs font-bold text-[var(--text-main)] truncate">Kemenag Kota Malang</div>
              <div className="text-[10px] text-[var(--text-muted)] truncate">Pelindung &amp; Pembina</div>
            </div>
          </div>

          {/* 3. Komite MTsN */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2.5 transition-colors hover:border-[var(--color-arena-primary)]/40 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0 text-left">
              <div className="text-xs font-bold text-[var(--text-main)] truncate">Komite MTsN 1 Malang</div>
              <div className="text-[10px] text-[var(--text-muted)] truncate">Dewan Komite Sekolah</div>
            </div>
          </div>

          {/* 4. OSIS / OSIM */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2.5 transition-colors hover:border-[var(--color-arena-primary)]/40 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
              </svg>
            </div>
            <div className="min-w-0 text-left">
              <div className="text-xs font-bold text-[var(--text-main)] truncate">OSIS Matsanega</div>
              <div className="text-[10px] text-[var(--text-muted)] truncate">Organisasi Siswa</div>
            </div>
          </div>

          {/* 5. Asosiasi Futsal */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2.5 transition-colors hover:border-[var(--color-arena-primary)]/40 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-sky-600/10 border border-sky-600/20 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-sky-600 dark:text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m4.93 4.93 4.24 4.24m5.66 0 4.24-4.24M4.93 19.07l4.24-4.24m5.66 0 4.24 4.24" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <div className="min-w-0 text-left">
              <div className="text-xs font-bold text-[var(--text-main)] truncate">Asosiasi Futsal / AFK</div>
              <div className="text-[10px] text-[var(--text-muted)] truncate">Federasi &amp; Juri Resmi</div>
            </div>
          </div>

          {/* 6. Dispora */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2.5 transition-colors hover:border-[var(--color-arena-primary)]/40 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-rose-600/10 border border-rose-600/20 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-rose-600 dark:text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>
            <div className="min-w-0 text-left">
              <div className="text-xs font-bold text-[var(--text-main)] truncate">Dispora Kota Malang</div>
              <div className="text-[10px] text-[var(--text-muted)] truncate">Dinas Olahraga Kota</div>
            </div>
          </div>

          {/* 7. Sauma Arena */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2.5 transition-colors hover:border-[var(--color-arena-primary)]/40 shadow-2xs">
            <SaumaArenaLogo size="xs" variant="auto" />
            <div className="min-w-0 text-left">
              <div className="text-xs font-bold text-[var(--text-main)] truncate">Sauma Arena Ecosystem</div>
              <div className="text-[10px] text-[var(--text-muted)] truncate">Official Multi-Sport Platform</div>
            </div>
          </div>

          {/* 8. Bank Jatim Syariah */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2.5 transition-colors hover:border-[var(--color-arena-primary)]/40 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-teal-600/10 border border-teal-600/20 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2 2 7h20L12 2z" />
              </svg>
            </div>
            <div className="min-w-0 text-left">
              <div className="text-xs font-bold text-[var(--text-main)] truncate">Bank Jatim Syariah</div>
              <div className="text-[10px] text-[var(--text-muted)] truncate">Mitra Perbankan &amp; Tiket</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
