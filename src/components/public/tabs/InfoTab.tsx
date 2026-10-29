'use client';

import React, { useState, useEffect } from 'react';
import {
  Download,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  ExternalLink,
  Info,
  FileText,
  AlertTriangle,
  Trophy,
} from 'lucide-react';
import { tournamentMeta } from '@/mocks/tournamentData';
import { CABOR_INFO_DATA } from '@/mocks/caborContentData';
import { SportCode, TournamentPartner } from '@/types';
import { getStoredPartners } from '@/mocks/partnersData';
import { PartnersSliderSection } from '@/components/public/partners/PartnersSliderSection';
import { PublicPageHeader } from '../layout/PublicPageHeader';

interface InfoTabProps {
  sportCode?: SportCode;
}

export const InfoTab: React.FC<InfoTabProps> = ({ sportCode = 'FUTSAL' }) => {
  const caborMeta = CABOR_INFO_DATA[sportCode] || CABOR_INFO_DATA.FUTSAL;
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [partners, setPartners] = useState<TournamentPartner[]>([]);

  useEffect(() => {
    setPartners(getStoredPartners());

    const handlePartnersUpdate = () => {
      setPartners(getStoredPartners());
    };

    window.addEventListener('sauma_partners_updated', handlePartnersUpdate);
    window.addEventListener('storage', handlePartnersUpdate);

    return () => {
      window.removeEventListener('sauma_partners_updated', handlePartnersUpdate);
      window.removeEventListener('storage', handlePartnersUpdate);
    };
  }, []);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadNotice(
        `Berkas regulasi ${caborMeta.juknisFileName || 'Juknis-MMFC-I-2026.pdf'} (2.4 MB) berhasil diunduh.`
      );
      setTimeout(() => setDownloadNotice(null), 4000);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-6">
      {/* Public Page Header */}
      <PublicPageHeader
        icon={Info}
        category={`PANDUAN & REGULASI RESMI • ${caborMeta.sportName.toUpperCase()}`}
        title="Informasi & Petunjuk Teknis"
        description="Format kompetisi, durasi waktu pertandingan, regulasi disiplin kartu wasit, jadwal verifikasi berkas kontingen, serta alur akses stadion."
      />

      {/* Download Alert Notice */}
      {downloadNotice && (
        <div className="p-4 rounded-xl bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 border-2 border-blue-200 dark:border-blue-800 text-xs font-semibold flex items-center justify-between gap-3 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#1D63B8] dark:text-sky-400 shrink-0" />
            <span>{downloadNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setDownloadNotice(null)}
            className="text-blue-700 dark:text-blue-300 hover:text-[#1D63B8] text-xs font-bold underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* HIGH-CONTRAST SPORT BENTO GRID: Format Pertandingan & Regulasi MMFC I */}
      <div className="space-y-5">
        {/* Top Bento Action Bar: Juknis Futsal Headline & Primary CTA */}
        <div className="relative rounded-2xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-700/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all overflow-hidden tactical-pitch-pattern">
          {/* Subtle brand glow in dark mode */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 dark:bg-blue-950/50 dark:border-blue-800 text-[#1D63B8] dark:text-sky-400 text-[11px] font-barlow font-bold uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-[#1D63B8] dark:text-sky-400" />
                <span>Buku Panduan Pertandingan Resmi (Dispora &amp; Asosiasi Futsal)</span>
              </div>
              <h3 className="text-2xl sm:text-3xl text-[var(--text-main)] font-bebas uppercase tracking-wide leading-tight">
                {caborMeta.formatTitle || 'Format Turnamen & Regulasi Futsal MMFC I'}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-sans">
                {caborMeta.formatSubtitle ||
                  '14 Tim Kontingen SD/MI dibagi ke dalam 4 Grup (A, B, C, D) dengan sistem setengah kompetisi. Juara grup otomatis melaju ke Babak 4 Besar (Semifinal) dan Grand Final.'}
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2.5">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#0C2340] hover:bg-[#154D92] text-white text-xs sm:text-sm font-barlow font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all min-h-[46px] group cursor-pointer border border-blue-400/30"
              >
                <Download
                  className={`w-4 h-4 text-sky-400 transition-transform duration-200 ${
                    isDownloading ? 'animate-bounce' : 'group-hover:translate-y-0.5'
                  }`}
                />
                <span>
                  {isDownloading
                    ? 'Menyiapkan Unduhan...'
                    : `Unduh Juknis ${caborMeta.sportName} (PDF) • 2.4 MB`}
                </span>
              </button>
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                Edisi Revisi Technical Meeting Resmi • Dokumen Terverifikasi
              </span>
            </div>
          </div>
        </div>

        {/* 3 High-Impact Sport Rule Cards with Giant Watermarks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Durasi Waktu (Watermark "30") */}
          <div className="relative rounded-2xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-700/80 hover:border-[#1D63B8] transition-all p-6 sm:p-7 shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between space-y-5 group">
            {/* Giant Background Numeric Watermark */}
            <span
              className="watermark-num text-slate-200 dark:text-slate-800 group-hover:text-blue-500/10 group-hover:scale-105"
              aria-hidden="true"
            >
              30
            </span>

            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-barlow font-bold text-[#1D63B8] dark:text-sky-400 uppercase tracking-wider">
                <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/50 dark:border-blue-800">
                  <Clock className="w-4 h-4 text-[#1D63B8] dark:text-sky-400" />
                </div>
                <span>Durasi &amp; Sistem Waktu</span>
              </div>

              <div>
                <h4 className="text-3xl sm:text-4xl font-teko font-bold text-[var(--text-main)] tracking-wide leading-none uppercase">
                  2 × 15 Menit
                </h4>
                <p className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400 mt-1">
                  Kotor di Fase Grup &bull; Bersih di Babak Gugur
                </p>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                Waktu kotor (running clock) berlaku di babak penyisihan grup. Pada partai semifinal dan grand final, waktu bersih (stop clock) diberlakukan saat bola keluar. Bila imbang di babak gugur, penentuan langsung adu penalti 3 penendang.
              </p>
            </div>

            <div className="relative z-10 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-1.5 text-[10px] font-mono font-bold">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[var(--text-main)] border border-slate-300 dark:border-slate-700">
                GRUP: 2×15M KOTOR
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                FINAL: BERSIH
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                IMBANG: 3 PENALTI
              </span>
            </div>
          </div>

          {/* Card 2: Akumulasi Kartu (Watermark "2" + Realistic Slanted Overlapping Cards Graphic) */}
          <div className="relative rounded-2xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-700/80 hover:border-red-500/60 transition-all p-6 sm:p-7 shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between space-y-5 group">
            {/* Giant Background Numeric Watermark */}
            <span
              className="watermark-num text-slate-200 dark:text-slate-800 group-hover:text-red-500/10 group-hover:scale-105"
              aria-hidden="true"
            >
              2
            </span>

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-barlow font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                  <div className="p-1.5 rounded-lg bg-sky-50 border border-sky-200 dark:bg-sky-950/50 dark:border-sky-800">
                    <AlertTriangle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  </div>
                  <span>Disiplin &amp; Kartu Wasit</span>
                </div>

                {/* VISUAL DELIGHT: Dua kartu wasit bertumpuk miring (Kuning & Merah) */}
                <div className="flex items-center -space-x-2 pl-2" title="Kartu Kuning dan Kartu Merah Wasit">
                  <div
                    className="w-5 h-7.5 rounded-xs bg-[#FACC15] border border-amber-500/50 shadow-md transform -rotate-12 transition-transform group-hover:-rotate-16"
                    aria-label="Kartu Kuning"
                  />
                  <div
                    className="w-5 h-7.5 rounded-xs bg-[#EF4444] border border-red-600/50 shadow-md transform rotate-12 transition-transform group-hover:rotate-16"
                    aria-label="Kartu Merah"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-3xl sm:text-4xl font-teko font-bold text-[var(--text-main)] tracking-wide leading-none uppercase">
                  Akumulasi 2 Kartu
                </h4>
                <p className="text-xs font-mono font-bold text-red-600 dark:text-red-400 mt-1">
                  Larangan Tampil 1 Pertandingan Berikutnya
                </p>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                Pemain yang mengumpulkan 2 kartu kuning pada laga berbeda otomatis terkena larangan bertanding 1 laga. Kartu merah langsung (KKM) dilarang bermain 1 laga berikutnya dan dikenakan denda administrasi komisi disiplin turnamen.
              </p>
            </div>

            <div className="relative z-10 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-1.5 text-[10px] font-mono font-bold">
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                2 KUNING = SKORSING
              </span>
              <span className="px-2 py-0.5 rounded bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-300 dark:border-red-800">
                MERAH = SKORSING + KOMDIS
              </span>
            </div>
          </div>

          {/* Card 3: Penghargaan (Watermark "1·2·3" + Championship Trophy Silhouette) */}
          <div className="relative rounded-2xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-700/80 hover:border-sky-500/60 transition-all p-6 sm:p-7 shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between space-y-5 group">
            {/* Giant Background Numeric Watermark */}
            <span
              className="watermark-num text-slate-200 dark:text-slate-800 group-hover:text-blue-500/10 group-hover:scale-105"
              aria-hidden="true"
            >
              1·2·3
            </span>

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-barlow font-bold text-[#1D63B8] dark:text-sky-400 uppercase tracking-wider">
                  <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/50 dark:border-blue-800">
                    <Award className="w-4 h-4 text-[#1D63B8] dark:text-sky-400" />
                  </div>
                  <span>Kategori Penghargaan</span>
                </div>

                {/* Trophy Silhouette Icon */}
                <Trophy className="w-5 h-5 text-amber-500 fill-amber-500/20 group-hover:scale-110 transition-transform" />
              </div>

              <div>
                <h4 className="text-3xl sm:text-4xl font-teko font-bold text-[var(--text-main)] tracking-wide leading-none uppercase">
                  Piala Bergilir &amp; Sertifikat
                </h4>
                <p className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400 mt-1">
                  Juara 1, 2, 3 &bull; Sepatu Emas &bull; Best Supporter
                </p>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                Memperebutkan Piala Bergilir MMFC I dan piala tetap Juara 1, 2, 3. Penghargaan individu meliputi Best Player (MVP) dan Top Scorer (Sepatu Emas). Seluruh peserta dan suporter terdaftar menerima E-Sertifikat resmi ber-QR.
              </p>
            </div>

            <div className="relative z-10 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-1.5 text-[10px] font-mono font-bold">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                PIALA BERGILIR MMFC I
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                E-SERTIFIKAT BER-QR
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[var(--text-main)] border border-slate-300 dark:border-slate-700">
                BEST SUPPORTER
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Venue & Gate Access Guide */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-700/80 space-y-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-blue-50 text-[#1D63B8] border border-blue-200 dark:bg-blue-950/50 dark:border-blue-800 shrink-0">
              <MapPin className="w-5 h-5 text-[#1D63B8] dark:text-sky-400" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl text-[var(--text-main)] font-bebas uppercase tracking-wide">
                Informasi Venue &amp; Akses Stadion: {caborMeta.venueName}
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                {caborMeta.venueAddress} &bull; Kapasitas Tribun: {caborMeta.venueCapacity}
              </p>
            </div>
          </div>

          <a
            href={caborMeta.googleMapsUrl || tournamentMeta.venueDetail?.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-tactile inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1D63B8] hover:bg-[#154D92] text-white text-xs font-barlow font-bold uppercase tracking-wider shadow-sm transition-colors shrink-0 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-sky-200" />
            <span>Petunjuk Lokasi Maps</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[var(--text-muted)]">
          <div className="p-5 rounded-xl bg-[var(--bg-muted)]/60 border border-slate-300 dark:border-slate-700/80 space-y-3 shadow-2xs">
            <h4 className="font-barlow font-bold text-base text-[var(--text-main)] uppercase tracking-wide flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1D63B8] dark:text-sky-400" />
              <span>Fasilitas Arena Lapangan Futsal</span>
            </h4>
            <ul className="space-y-2.5 pt-1">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1D63B8] dark:text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[var(--text-main)]">{caborMeta.venueCourt}</strong> dengan pencahayaan LED standar kompetisi dan garis lapangan resmi.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1D63B8] dark:text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[var(--text-main)]">Ruang Medis &amp; Tim Dokter</strong> siaga di pinggir lapangan sepanjang seluruh partai turnamen futsal.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1D63B8] dark:text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[var(--text-main)]">Layar LED Papan Skor</strong> tersinkronisasi langsung dengan konsol juri meja dan live score web.
                </span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-[var(--bg-muted)]/60 border border-slate-300 dark:border-slate-700/80 space-y-3 shadow-2xs">
            <h4 className="font-barlow font-bold text-base text-[var(--text-main)] uppercase tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1D63B8] dark:text-sky-400" />
              <span>Alur Pintu Masuk (Gate Access)</span>
            </h4>
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <strong className="text-[var(--text-main)] font-barlow text-sm block">Gate Barat (VIP &amp; Atlet)</strong>
                  <span className="text-[11px] text-[var(--text-muted)]">Pintu khusus kontingen atlet, pelatih, wasit &amp; panitia</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--bg-surface)] border border-slate-300 dark:border-slate-700 text-[var(--text-main)]">
                  ID CARD
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <strong className="text-[var(--text-main)] font-barlow text-sm block">Gate Timur 1 (Suporter Madrasah)</strong>
                  <span className="text-[11px] text-[#1D63B8] dark:text-sky-400 font-semibold font-mono">
                    Scan QR Rombongan (+1 Poin Tiket Suporter)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  SCAN TIKET
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <strong className="text-[var(--text-main)] font-barlow text-sm block">Gate Timur 2 (Penonton Umum)</strong>
                  <span className="text-[11px] text-[var(--text-muted)]">Akses penonton umum, wali murid, dan simpatisan</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--bg-surface)] border border-slate-300 dark:border-slate-700 text-[var(--text-muted)]">
                  REGULER
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Penyelenggara & Mitra Resmi Turnamen */}
      <PartnersSliderSection partners={partners} />
    </div>
  );
};
