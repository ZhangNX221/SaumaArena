'use client';

import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Activity,
  ListOrdered,
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
  GitBranch,
  Award,
} from 'lucide-react';
import { RefereeTabKey } from '../RefereeSidebar';
import { AppUser } from '@/types';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';

export interface DrawerMenuItem {
  key: RefereeTabKey;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isHot?: boolean;
}

export const ALL_REFEREE_MENU_ITEMS: DrawerMenuItem[] = [
  {
    key: 'dashboard',
    label: 'Beranda',
    desc: 'Dashboard kerja & ringkasan tugas lapangan',
    icon: LayoutDashboard,
  },
  {
    key: 'duty',
    label: 'Daftar Laga',
    desc: 'Alokasi meja pertandingan & jadwal tanding',
    icon: ClipboardList,
  },
  {
    key: 'match_center',
    label: 'Papan Skor',
    desc: 'Live timer, papan skor, gol, pelanggaran & time out',
    icon: Activity,
    badge: 'LIVE',
  },
  {
    key: 'standings',
    label: 'Klasemen Grub',
    desc: 'Peringkat klasemen, poin & selisih gol grup',
    icon: ListOrdered,
  },
  {
    key: 'bracket',
    label: 'Atur Bracket',
    desc: 'Pengaturan bagan fase gugur & penetapan juara',
    icon: GitBranch,
  },
  {
    key: 'player_performance',
    label: 'Performa Pemain',
    desc: 'Catat gol, kartu kuning, kartu merah & kedisiplinan pemain',
    icon: Award,
  },
  {
    key: 'supporter_scoring',
    label: 'Skor Suporter',
    desc: 'Input nilai suporter madrasah terbaik',
    icon: Megaphone,
    badge: 'HOT',
    isHot: true,
  },
  {
    key: 'reports',
    label: 'Laporan Pertandingan',
    desc: 'Berita Acara (BAP) & pengesahan skor resmi',
    icon: FileText,
  },
  {
    key: 'rulebook',
    label: 'Peraturan Pertandingan',
    desc: 'Regulasi resmi cabor futsal & teknis wasit',
    icon: BookOpen,
  },
  {
    key: 'profile',
    label: 'Pengaturan Profil',
    desc: 'Biodata wasit, lisensi resmi & keamanan kata sandi',
    icon: User,
  },
];

interface RefereeMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: RefereeTabKey;
  onSelectTab: (tab: RefereeTabKey) => void;
  isLagaActive: boolean;
  user?: AppUser;
  onBackToPublic?: () => void;
  onGoToAdmin?: () => void;
  onLogout?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const RefereeMenuDrawer: React.FC<RefereeMenuDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  isLagaActive,
  user,
  onBackToPublic,
  onGoToAdmin,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Overlay klik untuk menutup */}
      <div className="flex-1" onClick={onClose} aria-hidden="true" />

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
              onClick={onClose}
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
                onClick={() => onSelectTab(item.key)}
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
                    <div className={`text-[10px] ${isActive ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
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

        {/* Quick Action Buttons */}
        <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
          <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block px-1">
            Akses Portal &amp; Pengaturan
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {onBackToPublic && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBackToPublic();
                }}
                className="btn-tactile flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)]/80 border border-[var(--border-subtle)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-sky-500" />
                <span>Portal Publik</span>
              </button>
            )}

            {user?.role === 'ADMIN' && onGoToAdmin && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToAdmin();
                }}
                className="btn-tactile flex items-center justify-center gap-2 p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-barlow font-bold uppercase tracking-wider cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Panel Admin</span>
              </button>
            )}

            {onToggleDarkMode && (
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="btn-tactile flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)]/80 border border-[var(--border-subtle)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider cursor-pointer"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-sky-400" />}
                <span>{darkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
              </button>
            )}

            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="btn-tactile flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 font-barlow font-bold uppercase tracking-wider cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Akun</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

