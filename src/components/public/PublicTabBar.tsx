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
        {/* Docked Broadcast Sub-Header Navigation Bar: Centered Main Tabs & Distinct Right LIVE Button */}
        <div className="relative flex items-center justify-between gap-2 py-0.5">
          {/* Spacer kiri di layar besar untuk menjaga tab tengah tepat di titik tengah absolut */}
          <div className="hidden lg:flex items-center w-28 xl:w-36 shrink-0" aria-hidden="true" />

          {/* Tab Navigasi Utama (Centered di tengah navbar) */}
          <div className="flex-1 flex items-center justify-start lg:justify-center overflow-x-auto scrollbar-none touch-pan-x gap-1 sm:gap-1.5 min-w-0">
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
            </div>
          </div>

          {/* Tombol Khusus LIVE di sebelah paling kanan (menggantikan teks Futsal SD/MI) */}
          <div className="shrink-0 flex items-center justify-end pl-2 bg-[var(--bg-surface)] w-auto lg:w-28 xl:w-36">
            <button
              type="button"
              onClick={() => onTabChange('live')}
              className={`btn-tactile group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-barlow font-bold uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer min-h-[38px] sm:min-h-[42px] select-none ${
                activeTab === 'live'
                  ? 'bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-400 dark:ring-red-400 scale-[1.02]'
                  : 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-2 border-red-500/30 dark:border-red-500/40 hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-md hover:shadow-red-500/20'
              }`}
              aria-selected={activeTab === 'live'}
              role="tab"
            >
              {/* Pulsing Beacon Dot */}
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    activeTab === 'live' ? 'bg-white' : 'bg-red-500'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    activeTab === 'live' ? 'bg-white' : 'bg-red-600'
                  }`}
                />
              </span>

              <Radio
                className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  activeTab === 'live'
                    ? 'text-white stroke-[2.5]'
                    : 'text-red-600 dark:text-red-400 group-hover:text-white stroke-[2.5]'
                }`}
              />

              <span className="font-extrabold tracking-wide">LIVE</span>

              {hasLiveMatch && (
                <span
                  className={`text-[9px] font-extrabold tracking-widest px-1.5 py-0.5 rounded uppercase leading-none transition-colors ${
                    activeTab === 'live'
                      ? 'bg-black/25 text-white'
                      : 'bg-red-600 text-white group-hover:bg-white group-hover:text-red-600'
                  }`}
                >
                  ON AIR
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
