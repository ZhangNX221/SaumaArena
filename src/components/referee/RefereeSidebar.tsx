'use client';

import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Activity,
  UserCheck,
  FileText,
  BookOpen,
  User,
  X,
  ListOrdered,
  Megaphone,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { AppUser } from '@/types';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';
import { getRefereeMenuConfig, MenuItemConfig } from '@/config/menuConfig';

export type RefereeTabKey =
  | 'dashboard'
  | 'duty'
  | 'match_center'
  | 'standings'
  | 'supporter_scoring'
  | 'roster'
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
  onGoToAdmin?: () => void;
  onLogout?: () => void;
}

const REFEREE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  ClipboardList,
  Activity,
  UserCheck,
  FileText,
  BookOpen,
  User,
  ListOrdered,
  Megaphone,
};

export const RefereeSidebar: React.FC<RefereeSidebarProps> = ({
  activeTab,
  onSelectTab,
  user,
  isOpenMobile = false,
  onCloseMobile = () => {},
  onBackToPublic,
  onGoToAdmin,
}) => {
  const menuItems: MenuItemConfig[] = getRefereeMenuConfig(1);

  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[var(--bg-surface)] text-[var(--text-main)] flex flex-col border-r border-[var(--border-subtle)] transition-transform duration-200 shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Minimalist Header */}
        <div className="h-16 px-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SaumaArenaLogo size="sm" variant="dark" />
            <div>
              <div className="font-bebas text-base tracking-wider uppercase text-[var(--text-main)]">
                JURI CENTER
              </div>
              <p className="text-[10px] text-[var(--color-arena-primary)] font-barlow font-semibold uppercase tracking-wider">
                Meja Lapangan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden cursor-pointer"
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
                className={`btn-tactile w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                  isActive
                    ? 'bg-[var(--color-arena-primary)] text-white font-bold shadow-xs'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-main)] font-medium'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[var(--text-muted)]'}`} />
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

        {/* Bottom Quick Switchers */}
        <div className="p-3 border-t border-[var(--border-subtle)] space-y-1.5 bg-[var(--bg-muted)]/50 shrink-0">
          {user?.role === 'ADMIN' && onGoToAdmin && (
            <button
              type="button"
              onClick={() => {
                onGoToAdmin();
                onCloseMobile();
              }}
              className="btn-tactile w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-barlow font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all active:scale-[0.98] cursor-pointer"
              title="Kembali ke Meja Kerja Administrator"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">Kembali ke Admin</span>
            </button>
          )}

          {onBackToPublic && (
            <button
              type="button"
              onClick={() => {
                onBackToPublic();
                onCloseMobile();
              }}
              className="btn-tactile w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] transition-all active:scale-[0.98] cursor-pointer"
              title="Lihat Tampilan Portal Publik"
            >
              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">Portal Publik</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
