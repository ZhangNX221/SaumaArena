'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Activity,
  ListOrdered,
  Menu,
} from 'lucide-react';
import { RefereeTabKey } from './RefereeSidebar';
import { AppUser } from '@/types';
import { RefereeMenuDrawer } from './navigation/RefereeMenuDrawer';

interface RefereeBottomNavProps {
  activeTab: RefereeTabKey;
  onSelectTab: (tab: RefereeTabKey) => void;
  user?: AppUser;
  onBackToPublic?: () => void;
  onGoToAdmin?: () => void;
  onLogout?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const RefereeBottomNav: React.FC<RefereeBottomNavProps> = ({
  activeTab,
  onSelectTab,
  user,
  onBackToPublic,
  onGoToAdmin,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSelectTab = (tab: RefereeTabKey) => {
    onSelectTab(tab);
    setIsDrawerOpen(false);
  };

  const isLagaActive = activeTab === 'duty' || activeTab === 'schedule';

  return (
    <>
      {/* Fixed Bottom Navigation Bar (5 Menu: Beranda, Skor, Menu, Laga, Klasemen) */}
      <nav
        aria-label="Navigasi Bawah Meja Juri"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-md border-t-2 border-slate-200 dark:border-slate-800 px-2 py-1 lg:hidden text-[var(--text-main)] shadow-2xl safe-area-pb transition-colors"
      >
        <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
          {/* 1. Beranda */}
          <button
            type="button"
            onClick={() => handleSelectTab('dashboard')}
            className={`btn-tactile flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-all duration-150 min-h-[48px] relative ${
              activeTab === 'dashboard' && !isDrawerOpen
                ? 'text-[#1D63B8] dark:text-sky-400 font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 mb-0.5 ${activeTab === 'dashboard' && !isDrawerOpen ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] leading-tight font-medium">Beranda</span>
            {activeTab === 'dashboard' && !isDrawerOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D63B8] dark:bg-sky-400 mt-0.5" />
            )}
          </button>

          {/* 2. Skor */}
          <button
            type="button"
            onClick={() => handleSelectTab('match_center')}
            className={`btn-tactile flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-all duration-150 min-h-[48px] relative ${
              activeTab === 'match_center' && !isDrawerOpen
                ? 'text-red-500 font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <div className="relative">
              <Activity className={`w-5 h-5 mb-0.5 ${activeTab === 'match_center' && !isDrawerOpen ? 'stroke-[2.5]' : ''}`} />
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <span className="text-[10px] leading-tight font-medium truncate max-w-full">Papan Skor</span>
            {activeTab === 'match_center' && !isDrawerOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-0.5" />
            )}
          </button>

          {/* 3. Menu (Tengah - Drawer Pop-up Semua Menu Sidebar) */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`btn-tactile flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-all duration-150 min-h-[48px] ${
              isDrawerOpen
                ? 'text-white bg-[#1D63B8] dark:bg-sky-600 font-bold shadow-md'
                : 'text-[var(--text-main)] hover:text-[#1D63B8] dark:hover:text-sky-400 font-semibold'
            }`}
            title="Buka Semua Menu Meja Juri"
          >
            <div
              className={`p-1.5 rounded-md transition-colors ${
                isDrawerOpen
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--color-arena-accent)] text-slate-950 shadow-xs'
              }`}
            >
              <Menu className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-[10px] leading-tight font-bold mt-0.5">Menu</span>
          </button>

          {/* 4. Daftar Laga */}
          <button
            type="button"
            onClick={() => handleSelectTab('duty')}
            className={`btn-tactile flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-all duration-150 min-h-[48px] relative ${
              isLagaActive && !isDrawerOpen
                ? 'text-[#1D63B8] dark:text-sky-400 font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <ClipboardList className={`w-5 h-5 mb-0.5 ${isLagaActive && !isDrawerOpen ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] leading-tight font-medium truncate max-w-full">Daftar Laga</span>
            {isLagaActive && !isDrawerOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D63B8] dark:bg-sky-400 mt-0.5" />
            )}
          </button>

          {/* 5. Klasemen */}
          <button
            type="button"
            onClick={() => handleSelectTab('standings')}
            className={`btn-tactile flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-all duration-150 min-h-[48px] relative ${
              activeTab === 'standings' && !isDrawerOpen
                ? 'text-[#1D63B8] dark:text-sky-400 font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <ListOrdered className={`w-5 h-5 mb-0.5 ${activeTab === 'standings' && !isDrawerOpen ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] leading-tight font-medium">Klasemen</span>
            {activeTab === 'standings' && !isDrawerOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D63B8] dark:bg-sky-400 mt-0.5" />
            )}
          </button>
        </div>
      </nav>

      {/* Drawer Modal Pop-up */}
      <RefereeMenuDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isLagaActive={isLagaActive}
        user={user}
        onBackToPublic={onBackToPublic}
        onGoToAdmin={onGoToAdmin}
        onLogout={onLogout}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />
    </>
  );
};
