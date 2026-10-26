'use client';

import React from 'react';
import { Download, ShieldCheck, MapPin, Clock, Award, CheckCircle2, ExternalLink, Info } from 'lucide-react';
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
  const [downloadNotice, setDownloadNotice] = React.useState<string | null>(null);
  const [partners, setPartners] = React.useState<TournamentPartner[]>([]);

  React.useEffect(() => {
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
    setDownloadNotice(`Berkas regulasi ${caborMeta.juknisFileName} berhasil disiapkan untuk diunduh.`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Public Page Header */}
      <PublicPageHeader
        icon={Info}
        category={`PANDUAN & REGULASI RESMI • ${caborMeta.sportName.toUpperCase()}`}
        title="Informasi &amp; Petunjuk Teknis"
        description="Format kompetisi, durasi waktu pertandingan, jadwal verifikasi berkas kontingen, serta alur akses venue stadion."
      />

      {downloadNotice && (
        <div className="p-3.5 rounded-xl bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] border border-[var(--color-arena-primary)]/20 text-xs font-semibold flex items-center justify-between gap-2 animate-fadeIn">
          <span>{downloadNotice}</span>
          <button
            type="button"
            onClick={() => setDownloadNotice(null)}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Flagship Tournament Architecture Hero */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
          <div className="space-y-1.5">
            <h3 className="text-2xl sm:text-3xl text-[var(--text-main)] font-bebas uppercase tracking-wide">
              {caborMeta.formatTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
              {caborMeta.formatSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="btn-tactile inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-arena-dark)] text-white hover:bg-slate-800 text-xs sm:text-sm font-barlow font-bold uppercase tracking-wider shadow-xs transition-colors min-h-[44px]"
            >
              <Download className="w-4 h-4 text-[var(--color-arena-accent)]" />
              <span>Unduh Juknis {caborMeta.sportName} (PDF)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Format Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-barlow font-bold text-[var(--color-arena-primary)] uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>{caborMeta.durationLabel}</span>
            </div>
            <h4 className="text-2xl sm:text-3xl font-teko font-bold text-[var(--text-main)] tracking-wide leading-none">
              {caborMeta.durationValue}
            </h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {caborMeta.durationDesc}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-barlow font-bold text-[var(--color-arena-accent)] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{caborMeta.disciplineLabel}</span>
            </div>
            <h4 className="text-2xl sm:text-3xl font-teko font-bold text-[var(--text-main)] tracking-wide leading-none">
              {caborMeta.disciplineValue}
            </h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {caborMeta.disciplineDesc}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-barlow font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Kategori Penghargaan</span>
            </div>
            <h4 className="text-2xl sm:text-3xl font-teko font-bold text-[var(--text-main)] tracking-wide leading-none">
              Piala Bergilir &amp; E-Sertifikat
            </h4>
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
              <h3 className="text-xl sm:text-2xl text-[var(--text-main)] font-bebas uppercase tracking-wide">
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
            className="btn-tactile inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider shadow-xs transition-colors shrink-0"
          >
            <MapPin className="w-4 h-4 text-[var(--color-arena-accent)]" />
            <span>Buka di Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[var(--text-muted)]">
          <div className="p-5 rounded-xl bg-[var(--bg-muted)]/60 border border-[var(--border-subtle)] space-y-3">
            <h4 className="font-barlow font-bold text-base text-[var(--text-main)] uppercase tracking-wide">Fasilitas Arena Lapangan</h4>
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
            <h4 className="font-barlow font-bold text-base text-[var(--text-main)] uppercase tracking-wide">Alur Pintu Masuk (Gate Access)</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-subtle)]">
                <strong className="text-[var(--text-main)] font-barlow text-sm">Gate Barat (VIP &amp; Atlet)</strong>
                <span className="text-[11px] text-[var(--text-muted)]">Khusus Pemain, Pelatih &amp; Juri Meja</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-subtle)]">
                <strong className="text-[var(--text-main)] font-barlow text-sm">Gate Timur 1 (Suporter)</strong>
                <span className="text-[11px] text-[var(--color-arena-primary)] font-semibold font-mono">Scan QR Rombongan (+1 Poin)</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <strong className="text-[var(--text-main)] font-barlow text-sm">Gate Timur 2 (Umum)</strong>
                <span className="text-[11px] text-[var(--text-muted)]">Penonton Reguler Mandiri</span>
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
