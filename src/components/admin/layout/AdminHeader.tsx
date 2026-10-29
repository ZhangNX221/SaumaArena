'use client';

import React from 'react';
import {
  Menu,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { SportCode, AppUser } from '@/types';
import { AdminSubmenuId } from '../AdminSidebar';

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
  selectedSport: SportCode;
  onSelectSubmenu: (submenu: AdminSubmenuId) => void;
  user?: AppUser | null;
  onLogout?: () => void;
  onBackToPublic?: () => void;
  onGoToReferee?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  currentMeta?: { category: string; title: string };
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileSidebar,
  user,
  onLogout,
  onBackToPublic,
  onGoToReferee,
  darkMode,
  onToggleDarkMode,
  currentMeta,
}) => {
  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] flex items-center justify-between gap-3 sm:gap-4 sticky top-0 z-30 shrink-0 box-border">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="btn-tactile p-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] lg:hidden shrink-0"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Single Page Title in Topbar */}
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="font-bebas text-xl sm:text-2xl text-[var(--text-main)] tracking-wide uppercase truncate">
            {currentMeta?.title || 'Dashboard'}
          </h1>
        </div>
      </div>

      {/* Right Actions: Switch to Referee, Switch to Public, Dark Mode Toggle & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {onToggleDarkMode && (
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="btn-tactile p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            title={darkMode ? 'Mode terang' : 'Mode gelap'}
            aria-label="Ganti mode tampilan"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        )}

        {/* User Profile Section */}
        <div className="flex items-center gap-2 sm:gap-2.5 pl-2 sm:pl-3 border-l border-[var(--border-subtle)] shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--color-arena-dark)] text-[var(--color-arena-accent)] flex items-center justify-center font-bebas text-base shrink-0 shadow-2xs border border-[var(--border-subtle)]">
            {user?.avatarText || 'SA'}
          </div>
          <div className="hidden md:block text-left max-w-[170px] lg:max-w-[240px]">
            <div className="text-xs font-barlow font-bold text-[var(--text-main)] truncate leading-tight tracking-wide">
              {user?.name || 'Ust. H. Syamsul Arifin, M.Pd'}
            </div>
            <div className="text-[10px] text-[var(--text-muted)] truncate font-medium mt-0.5">
              {user?.roleLabel || 'Komisioner & Superadmin MMFC I'}
            </div>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="btn-tactile p-1.5 sm:p-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-500/10 transition-colors"
              title="Keluar"
              aria-label="Logout dari sesi admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
