'use client';

import React from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  Ticket,
  Users,
  ShieldCheck,
  ExternalLink,
  Radio,
  FileText,
  Trophy,
  ChevronRight,
} from 'lucide-react';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';

interface PublicFooterProps {
  onOpenTicketModal: () => void;
  onOpenRegModal: () => void;
  onTabChange: (tab: string) => void;
  onNavigateToReferee?: () => void;
  sportCode?: string;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  onOpenTicketModal,
  onOpenRegModal,
  onTabChange,
  onNavigateToReferee,
  sportCode = 'FUTSAL',
}) => {
  return (
    <footer
      role="contentinfo"
      className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] transition-colors"
    >
      {/* Main Multi-Column Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Kolom 1: Identitas Turnamen & Penyelenggara */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SaumaArenaLogo size="md" />
              <div>
                <span className="font-extrabold text-[var(--text-main)] font-[var(--font-display)] text-base tracking-tight block">
                  Sauma Arena
                </span>
                <span className="text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] border border-[var(--border-subtle)] inline-block mt-0.5">
                  MMFC I &bull; 2026
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-sans">
              Portal resmi Milad Matsanega Futsal Competition I. Turnamen antarpelajar tingkat SD/MI se-Jawa Timur yang diselenggarakan oleh MTsN 1 Kota Malang untuk memupuk sportivitas sejak dini.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-barlow font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Skor Langsung Terhubung
              </span>
            </div>
          </div>

          {/* Kolom 2: Navigasi Laga & Klasemen */}
          <div className="space-y-3">
            <h3 className="font-bebas text-lg uppercase tracking-wide text-[var(--text-main)] border-b border-[var(--border-subtle)] pb-2">
              Informasi Pertandingan
            </h3>
            <nav aria-label="Navigasi Pertandingan Footer">
              <ul className="space-y-1 text-xs sm:text-sm font-sans">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('schedule');
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="w-full text-left py-1.5 text-[var(--text-muted)] hover:text-[var(--color-arena-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-arena-primary)] focus-visible:outline-none rounded transition-colors flex items-center justify-between group"
                  >
                    <span>Jadwal &amp; Hasil Laga</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('standings');
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="w-full text-left py-1.5 text-[var(--text-muted)] hover:text-[var(--color-arena-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-arena-primary)] focus-visible:outline-none rounded transition-colors flex items-center justify-between group"
                  >
                    <span>Klasemen Babak Grup</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('bracket');
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="w-full text-left py-1.5 text-[var(--text-muted)] hover:text-[var(--color-arena-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-arena-primary)] focus-visible:outline-none rounded transition-colors flex items-center justify-between group"
                  >
                    <span>Bagan Babak Gugur</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('teams');
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="w-full text-left py-1.5 text-[var(--text-muted)] hover:text-[var(--color-arena-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-arena-primary)] focus-visible:outline-none rounded transition-colors flex items-center justify-between group"
                  >
                    <span>Daftar Tim Kontingen</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('stats');
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="w-full text-left py-1.5 text-[var(--text-muted)] hover:text-[var(--color-arena-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-arena-primary)] focus-visible:outline-none rounded transition-colors flex items-center justify-between group"
                  >
                    <span>Statistik &amp; Top Skor</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('supporter');
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="w-full text-left py-1.5 text-[var(--text-muted)] hover:text-[var(--color-arena-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-arena-primary)] focus-visible:outline-none rounded transition-colors flex items-center justify-between group"
                  >
                    <span>Adu Yel-Yel Suporter</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Kolom 3: Layanan Penonton & Tiket */}
          <div className="space-y-3">
            <h3 className="font-bebas text-lg uppercase tracking-wide text-[var(--text-main)] border-b border-[var(--border-subtle)] pb-2">
              Layanan Penonton &amp; Tim
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm font-sans">
              <li>
                <button
                  type="button"
                  onClick={onOpenTicketModal}
                  className="btn-tactile w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--color-arena-primary)] hover:text-white text-[var(--text-main)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-arena-primary)] focus-visible:outline-none text-left"
                >
                  <Ticket className="w-4 h-4 text-[var(--color-arena-primary)] shrink-0" />
                  <div>
                    <div className="font-semibold text-xs">Ambil Tiket Masuk Gratis</div>
                    <div className="text-[10px] text-[var(--text-muted)]">QR Code untuk gerbang masuk GOR</div>
                  </div>
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={onOpenRegModal}
                  className="btn-tactile w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--color-arena-primary)] hover:text-white text-[var(--text-main)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-arena-primary)] focus-visible:outline-none text-left"
                >
                  <Users className="w-4 h-4 text-[#F6AE2D] shrink-0" />
                  <div>
                    <div className="font-semibold text-xs">Pendaftaran Tim Baru</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Formulir pendaftaran kontingen</div>
                  </div>
                </button>
              </li>

              <li className="pt-1 text-[11px] text-[var(--text-muted)] space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-[var(--text-main)]">
                  <Clock className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
                  <span>Gerbang Arena: 07.30 - 17.30 WIB</span>
                </div>
                <p className="leading-relaxed">
                  Penonton diimbau hadir 15 menit sebelum sepak mula pertandingan untuk pemeriksaan tiket.
                </p>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Lokasi Venue & Kontak Panitia */}
          <div className="space-y-3">
            <h3 className="font-bebas text-lg uppercase tracking-wide text-[var(--text-main)] border-b border-[var(--border-subtle)] pb-2">
              Lokasi &amp; Pusat Bantuan
            </h3>
            <address className="not-italic space-y-2.5 text-xs sm:text-sm font-sans text-[var(--text-muted)]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-arena-primary)] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[var(--text-main)] block">Matsanega Futsal Court (Indoor)</strong>
                  <span>Kampus MTsN 1 Kota Malang</span>
                  <span className="block text-[11px] text-[var(--text-faint)]">
                    Jl. Bandung No. 7, Penanggungan, Kec. Klojen, Kota Malang, Jawa Timur 65113
                  </span>
                  <a
                    href="https://maps.google.com/?q=MTsN+1+Kota+Malang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[var(--color-arena-primary)] hover:underline font-semibold mt-1 focus-visible:ring-2 focus-visible:ring-[var(--color-arena-primary)] focus-visible:outline-none rounded"
                    aria-label="Buka petunjuk arah Matsanega Futsal Court di Google Maps (terbuka di tab baru)"
                  >
                    <span>Buka Petunjuk Arah Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--color-arena-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-arena-primary)] focus-visible:outline-none rounded"
                  >
                    WhatsApp Panitia: <strong>0812-3456-7890</strong>
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[var(--color-arena-primary)] shrink-0" />
                  <a
                    href="mailto:panitia@matsanega.sch.id"
                    className="hover:text-[var(--color-arena-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-arena-primary)] focus-visible:outline-none rounded"
                  >
                    panitia@matsanega.sch.id
                  </a>
                </div>
              </div>
            </address>
          </div>
        </div>
      </div>

      {/* Sub-footer Bar: Hak Cipta & Keamanan Aksesibilitas */}
      <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 py-5 px-4 sm:px-6 lg:px-8 text-xs font-sans text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <div>
              &copy; 2026 Panitia Milad MTsN 1 Kota Malang &amp; Ekstrakurikuler Futsal.
            </div>
            <div className="text-[11px] text-[var(--text-faint)]">
              Dikembangkan dengan Sauma Arena &bull; Kompetisi Olahraga Pelajar Terbuka
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={() => {
                onTabChange('info');
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="hover:text-[var(--color-arena-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-arena-primary)] focus-visible:outline-none rounded"
            >
              Regulasi Teknis
            </button>
            <span>&bull;</span>
            <span className="text-[var(--text-faint)]">Standar Lapangan FFI 2026</span>
            <span>&bull;</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Akses Ramah Difabel &amp; Penonton Kursi Roda
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
