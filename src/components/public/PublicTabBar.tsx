'use client';

import React from 'react';
import {
  Info,
  Radio,
  Users,
  Calendar,
  ListOrdered,
  GitBranch,
  Activity,
  Megaphone,
} from 'lucide-react';
import { PUBLIC_MENU_CONFIG } from '@/config/menuConfig';
import { initialMatches } from '@/mocks/tournamentData';

export type PublicTabKey =
  | 'info'
  | 'live'
  | 'schedule'
  | 'standings'
  | 'bracket'
  | 'teams'
  | 'stats'
  | 'supporter';

const TAB_ICONS: Record<PublicTabKey, React.ComponentType<{ className?: string }>> = {
  info: Info,
  live: Radio,
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
}) => {
  const hasLiveMatch = initialMatches.some((m) => m.status === 'LIVE');
  const standardTabs = PUBLIC_MENU_CONFIG.filter((item) => item.id !== 'live');

  return (
    <nav
      aria-label="Navigasi Turnamen Publik"
      className="sticky top-14 sm:top-18 z-30 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b-2 border-slate-200 dark:border-slate-800 transition-colors shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Docked Sub-Header Navigation: Seluruh Tab Tersusun Rapi Termasuk Tombol LIVE Minimalis Berdampingan dengan Suporter */}
        <div className="flex items-center justify-start lg:justify-center overflow-x-auto scrollbar-none touch-pan-x gap-1 sm:gap-1.5 py-0.5">
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-max lg:mx-auto">
            {standardTabs.map((item) => {
              const tabKey = item.id as PublicTabKey;
              const Icon = TAB_ICONS[tabKey] || Info;
              const isActive = activeTab === tabKey;
              const isScheduleLive = item.id === 'schedule' && hasLiveMatch;
              const isHot = item.id === 'supporter';

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(tabKey)}
                  className={`btn-tactile group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-barlow uppercase font-bold tracking-wider transition-all duration-150 border-b-2 shrink-0 cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'border-[#1D63B8] dark:border-sky-400 text-[#1D63B8] dark:text-sky-400 bg-blue-50/70 dark:bg-sky-950/40 font-bold'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                  aria-selected={isActive}
                  role="tab"
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive
                        ? 'text-[#1D63B8] dark:text-sky-400'
                        : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'
                    }`}
                  />
                  <span>{item.label}</span>

                  {/* Athletic indicator dots */}
                  {isScheduleLive && (
                    <span className="relative flex h-2 w-2 ml-0.5" title="Pertandingan Sedang Berlangsung">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                  )}

                  {isHot && (
                    <span className="relative flex h-2 w-2 ml-0.5" title="Penghargaan Suporter Tribun Terkreatif">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1D63B8] shadow-2xs" />
                    </span>
                  )}
                </button>
              );
            })}

            {/* Tombol LIVE Minimalis (Dipepetkan langsung dengan tombol Suporter) */}
            <button
              type="button"
              onClick={() => onTabChange('live')}
              className={`btn-tactile group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider transition-all duration-150 shrink-0 cursor-pointer min-h-[34px] ml-1 select-none ${
                activeTab === 'live'
                  ? 'bg-red-600 text-white shadow-xs ring-1 ring-red-500'
                  : 'text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30'
              }`}
              aria-selected={activeTab === 'live'}
              role="tab"
              title="Siaran Langsung & Papan Skor Live"
            >
              <Radio className="w-3.5 h-3.5 shrink-0" />
              <span>LIVE</span>
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span
                  className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                    activeTab === 'live' ? 'bg-white' : 'bg-red-500'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
