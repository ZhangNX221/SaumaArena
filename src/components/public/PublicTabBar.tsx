'use client';

import React from 'react';
import {
  Info,
  Users,
  Calendar,
  ListOrdered,
  GitBranch,
  Activity,
  Megaphone,
  UserPlus,
  Ticket,
} from 'lucide-react';

import { PUBLIC_MENU_CONFIG } from '@/config/menuConfig';
import { FEATURES } from '@/config/features';
import { initialMatches } from '@/mocks/tournamentData';

export type PublicTabKey =
  | 'info'
  | 'teams'
  | 'schedule'
  | 'standings'
  | 'bracket'
  | 'stats'
  | 'supporter';

const TAB_ICONS: Record<PublicTabKey, React.ComponentType<{ className?: string }>> = {
  info: Info,
  schedule: Calendar,
  standings: ListOrdered,
  bracket: GitBranch,
  teams: Users,
  stats: Activity,
  supporter: Megaphone,
};

interface PublicTabBarProps {
  activeTab: PublicTabKey;
  onTabChange: (tab: PublicTabKey) => void;
  onOpenTicketModal?: () => void;
  onOpenRegModal?: () => void;
}

export const PublicTabBar: React.FC<PublicTabBarProps> = ({
  activeTab,
  onTabChange,
  onOpenTicketModal,
  onOpenRegModal,
}) => {
  const hasLiveMatch = initialMatches.some((m) => m.status === 'LIVE');

  return (
    <nav
      aria-label="Navigasi Turnamen Publik"
      className="hidden md:block sticky top-16 sm:top-18 z-40 bg-[var(--bg-page)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] py-3 px-4 sm:px-6 transition-colors shadow-2xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        {/* Floating Capsule Bar Container (Centered) */}
        <div className="inline-flex items-center p-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs max-w-full overflow-x-auto scrollbar-none mx-auto">
          <div className="flex items-center gap-1 min-w-max">
            {PUBLIC_MENU_CONFIG.map((item) => {
              const tabKey = item.id as PublicTabKey;
              const Icon = TAB_ICONS[tabKey] || Info;
              const isActive = activeTab === tabKey;
              const showLiveBadge = item.id === 'schedule' ? hasLiveMatch : !!item.badge;
              const isHot = item.id === 'supporter';

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(tabKey)}
                  className={`btn-tactile group relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-barlow tracking-wide transition-all duration-150 min-h-[42px] focus-visible:outline-2 ${
                    isActive
                      ? 'bg-[var(--color-arena-primary)] text-white shadow-xs font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] font-semibold'
                  }`}
                  aria-selected={isActive}
                  role="tab"
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'
                    }`}
                  />
                  <span>{item.label}</span>

                  {showLiveBadge && item.badge && (
                    <span
                      className={`text-[9px] font-barlow font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : isHot
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                          : 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 border border-red-200 dark:border-red-800 animate-pulse'
                      }`}
                    >
                      {item.badge.text}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Divider */}
            <div className="w-px h-6 bg-[var(--border-subtle)] mx-1 shrink-0" />

            {/* Tombol Pendaftaran Tim */}
            <button
              type="button"
              onClick={onOpenRegModal}
              className="btn-tactile flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-full text-sm font-bebas tracking-wider uppercase text-[var(--color-arena-primary)] bg-[var(--color-arena-primary-light)] hover:bg-[var(--color-arena-primary)] hover:text-white border border-[var(--color-arena-primary)]/40 dark:bg-blue-950/60 dark:text-sky-300 dark:border-blue-700 transition-all duration-150 min-h-[42px] shrink-0 shadow-2xs"
            >
              <UserPlus className="w-4 h-4 shrink-0" />
              <span>Pendaftaran Tim</span>
            </button>

            {/* Tombol Beli Tiket (Hanya tampil saat FEATURES.ticketing = true) */}
            {FEATURES.ticketing && (
              <button
                type="button"
                onClick={onOpenTicketModal}
                className="btn-tactile flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-full text-sm font-bebas tracking-wider uppercase text-slate-950 bg-[var(--color-arena-accent)] hover:brightness-105 shadow-xs transition-all duration-150 min-h-[42px] shrink-0"
              >
                <Ticket className="w-4 h-4 shrink-0" />
                <span>Beli Tiket</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
