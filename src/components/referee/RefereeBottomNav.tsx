'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Activity,
  ListOrdered,
  Menu,
  X,
  FileText,
  Megaphone,
  BookOpen,
  User,
  ChevronRight,
  Globe,
  ShieldCheck,
  Moon,
  Sun,
  LogOut,
} from 'lucide-react';
import { RefereeTabKey } from './RefereeSidebar';
import { AppUser } from '@/types';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';

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

interface DrawerMenuItem {
  key: RefereeTabKey;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isHot?: boolean;
}

const ALL_REFEREE_MENU_ITEMS: DrawerMenuItem[] = [
  {
    key: 'dashboard',
    label: 'Beranda / Ringkasan',
    desc: 'Dashboard kerja & ringkasan tugas lapangan',
    icon: LayoutDashboard,
  },
  {
    key: 'match_center',
    label: 'Catat Skor & Papan Skor',
    desc: 'Live timer, papan skor, gol, pelanggaran & time out',
    icon: Activity,
    badge: 'LIVE',
  },
  {
    key: 'duty',
    label: 'Jadwal & Tugas Laga',
    desc: 'Alokasi meja pertandingan & jadwal tanding',
    icon: ClipboardList,
  },
  {
    key: 'standings',
    label: 'Klasemen & Bagan Grup',
    desc: 'Peringkat grup, klasemen & bagan kualifikasi',
    icon: ListOrdered,
  },
  {
    key: 'supporter_scoring',
    label: 'Penilaian Suporter',
    desc: 'Input nilai suporter madrasah terbaik',
    icon: Megaphone,
    badge: 'HOT',
    isHot: true,
  },
  {
    key: 'reports',
    label: 'Berita Acara (BAP)',
    desc: 'Tanda tangan digital & pengesahan skor resmi',
    icon: FileText,
  },
  {
    key: 'rulebook',
    label: 'Buku Aturan Cabor',
    desc: 'Regulasi resmi cabor futsal & teknis wasit',
    icon: BookOpen,
  },
  {
    key: 'profile',
    label: 'Profil & Kesiapan Juri',
    desc: 'Biodata wasit, lisensi resmi & keamanan kata sandi',
    icon: User,
  },
];

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

  // Kunci scroll body saat drawer modal terbuka
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  // Tutup drawer dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  const handleSelectTab = (tab: RefereeTabKey) => {
    onSelectTab(tab);
    setIsDrawerOpen(false);
  };

  const isLagaActive = activeTab === 'duty' || activeTab === 'schedule';

  return (
    <>
      {/* 1. Fixed Bottom Navigation Bar (5 Menu: Beranda, Skor, Menu, Laga, Klasemen) */}
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
            <span className="text-[10px] leading-tight font-medium">Skor</span>
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

          {/* 4. Laga */}
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
            <span className="text-[10px] leading-tight font-medium">Laga</span>
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

      {/* 2. Full Menu Drawer Modal (Pop-up Semua Menu Sidebar seperti Halaman Publik) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
          {/* Overlay klik untuk menutup */}
          <div
            className="flex-1"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sheet Container */}
          <div className="bg-[var(--bg-surface)] border-t-2 border-slate-300 dark:border-slate-800 rounded-t-2xl max-h-[85vh] overflow-y-auto p-4 sm:p-5 pb-8 shadow-2xl space-y-4 animate-slideUp text-[var(--text-main)]">
            {/* Sheet Handle & Header */}
            <div className="space-y-3">
              <div className="w-12 h-1 bg-[var(--border-subtle)] rounded-full mx-auto" />
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <SaumaArenaLogo size="sm" />
                  <div>
                    <h3 className="font-bebas text-base sm:text-lg uppercase tracking-wider text-[var(--text-main)] leading-none">
                      Semua Menu Meja Juri
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono">
                      {user?.name || 'Juri Resmi Lapangan'} &bull; <strong className="text-[#1D63B8] dark:text-sky-400">MMFC I</strong>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] cursor-pointer"
                  aria-label="Tutup menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* List Menu Lengkap Sidebar Juri */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block px-1">
                Navigasi Meja &amp; Pertandingan
              </span>

              {ALL_REFEREE_MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key || (item.key === 'duty' && isLagaActive);

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleSelectTab(item.key)}
                    className={`btn-tactile w-full flex items-center justify-between p-3 rounded-xl transition-all border cursor-pointer ${
                      isActive
                        ? 'bg-[#1D63B8] dark:bg-sky-600 text-white border-transparent shadow-xs font-bold'
                        : 'bg-[var(--bg-muted)]/70 text-[var(--text-main)] border-slate-200 dark:border-slate-800 hover:bg-[var(--bg-muted)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[var(--bg-surface)] text-[#1D63B8] dark:text-sky-400 border border-[var(--border-subtle)]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold font-barlow uppercase tracking-wider">{item.label}</div>
                        <div
                          className={`text-[10px] ${
                            isActive ? 'text-white/80' : 'text-[var(--text-muted)]'
                          }`}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                            isActive
                              ? 'bg-white/30 text-white'
                              : item.isHot
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[var(--text-muted)]'}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Action Buttons (Portal Publik, Panel Admin, Tema, Logout) */}
            <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block px-1">
                Akses Portal &amp; Pengaturan
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {onBackToPublic && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onBackToPublic();
                    }}
                    className="btn-tactile flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)]/80 border border-[var(--border-subtle)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider"
                  >
                    <Globe className="w-3.5 h-3.5 text-sky-500" />
                    <span>Portal Publik</span>
                  </button>
                )}

                {user?.role === 'ADMIN' && onGoToAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onGoToAdmin();
                    }}
                    className="btn-tactile flex items-center justify-center gap-2 p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-barlow font-bold uppercase tracking-wider"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span>Panel Admin</span>
                  </button>
                )}

                {onToggleDarkMode && (
                  <button
                    type="button"
                    onClick={() => {
                      onToggleDarkMode();
                    }}
                    className="btn-tactile flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)]/80 border border-[var(--border-subtle)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider"
                  >
                    {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-sky-400" />}
                    <span>{darkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
                  </button>
                )}

                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onLogout();
                    }}
                    className="btn-tactile flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 font-barlow font-bold uppercase tracking-wider"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Akun</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
