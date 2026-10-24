'use client';

import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Activity,
  FileText,
  BookOpen,
  User,
  X,
} from 'lucide-react';
import { AppUser } from '@/types';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';
import { getRefereeMenuConfig, MenuItemConfig } from '@/config/menuConfig';

export type RefereeTabKey =
  | 'dashboard'
  | 'duty'
  | 'match_center'
  | 'reports'
  | 'rulebook'
  | 'profile'
  | 'schedule';

interface RefereeSidebarProps {
  activeTab: RefereeTabKey;
  onSelectTab: (tab: RefereeTabKey) => void;
  user: AppUser;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onBackToPublic?: () => void;
  onLogout?: () => void;
}

const REFEREE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  ClipboardList,
  Activity,
  FileText,
  BookOpen,
  User,
};

export const RefereeSidebar: React.FC<RefereeSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile = () => {},
}) => {
  const menuItems: MenuItemConfig[] = getRefereeMenuConfig(1);

  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-56 bg-[#0b1a28] text-white flex flex-col border-r border-[#1f374f] transition-transform duration-200 shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Minimalist Header */}
        <div className="h-16 px-4 border-b border-[#1f374f] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SaumaArenaLogo size="sm" variant="dark" />
            <div>
              <div className="font-bebas text-base tracking-wider uppercase text-white">
                JURI CENTER
              </div>
              <p className="text-[10px] text-slate-400 font-barlow font-semibold uppercase tracking-wider">
                Meja Lapangan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
            aria-label="Tutup menu juri"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Minimalist Single-Word Navigation Items */}
        <nav className="flex-1 px-2.5 py-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = REFEREE_ICON_MAP[item.icon] || ClipboardList;
            const isActive =
              activeTab === item.id ||
              (item.id === 'duty' && activeTab === 'schedule') ||
              (item.id === 'dashboard' && !activeTab);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id as RefereeTabKey);
                  onCloseMobile();
                }}
                className={`btn-tactile w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 active:scale-[0.98] ${
                  isActive
                    ? 'bg-[var(--color-arena-primary)] text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="font-barlow font-bold text-sm tracking-wide truncate">
                    {item.label}
                  </span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                      item.badge.type === 'live'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {item.badge.text}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
