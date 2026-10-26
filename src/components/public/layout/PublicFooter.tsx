'use client';

import React from 'react';
import {
  Ticket,
  Users,
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
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Top Section: Brand & Quick Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
          {/* Brand & Independent Statement */}
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-3">
              <SaumaArenaLogo size="md" />
              <div>
                <span className="font-extrabold text-[var(--text-main)] font-[var(--font-display)] text-base tracking-tight block">
                  Sauma Arena
                </span>
                <span className="text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-subtle)] inline-block mt-0.5">
                  Platform Independen &bull; Multi-Sport
                </span>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Platform independen pengelolaan turnamen olahraga, pembaruan skor langsung, bagan pertandingan, dan informasi kompetisi secara digital serta real-time.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenTicketModal}
              className="btn-tactile inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--color-arena-primary)] hover:text-white text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider border border-[var(--border-subtle)] transition-all"
            >
              <Ticket className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
              <span>Tiket Masuk</span>
            </button>
            <button
              type="button"
              onClick={onOpenRegModal}
              className="btn-tactile inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--color-arena-primary)] hover:opacity-90 text-white text-xs font-barlow font-bold uppercase tracking-wider shadow-sm transition-all"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Pendaftaran Tim</span>
            </button>
          </div>
        </div>

        {/* Middle Section: Navigation & Realtime Status */}
        <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          {/* Quick Tab Navigators */}
          <nav aria-label="Navigasi Menu Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {[
              { label: 'Jadwal & Hasil', tab: 'schedule' },
              { label: 'Klasemen', tab: 'standings' },
              { label: 'Bagan Gugur', tab: 'bracket' },
              { label: 'Daftar Tim', tab: 'teams' },
              { label: 'Statistik', tab: 'stats' },
              { label: 'Adu Suporter', tab: 'supporter' },
            ].map((item) => (
              <button
                key={item.tab}
                type="button"
                onClick={() => {
                  onTabChange(item.tab);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="hover:text-[var(--color-arena-primary)] transition-colors focus-visible:outline-none focus-visible:underline"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Live Status Indicator */}
          <div className="flex items-center gap-2 text-[11px] font-barlow font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Skor Langsung Terhubung</span>
          </div>
        </div>

        {/* Bottom Section: Disclaimer & Copyright */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[var(--text-faint)] text-center sm:text-left">
          <p>
            &copy; {currentYear} Sauma Arena. Aplikasi independen &bull; Tidak berafiliasi dengan sekolah atau instansi mana pun.
          </p>
          <div className="flex items-center gap-3">
            <span>Platform Digital Terbuka</span>
            <span>&bull;</span>
            <span>Semua Hak Dilindungi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

