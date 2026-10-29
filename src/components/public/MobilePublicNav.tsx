'use client';

import React, { useState } from 'react';
import {
  Info,
  Radio,
  Calendar,
  Menu,
  Ticket,
  UserPlus,
  X,
  Users,
  ListOrdered,
  GitBranch,
  Activity,
  Megaphone,
  ChevronRight,
} from 'lucide-react';
import { PublicTabKey } from './PublicTabBar';
import { SportCode } from '@/types';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';
import { FEATURES } from '@/config/features';

interface MobilePublicNavProps {
  activeTab: PublicTabKey;
  onTabChange: (tab: PublicTabKey) => void;
  onOpenTicketModal: () => void;
  onOpenRegModal: () => void;
  sportCode?: SportCode;
}

interface MenuItem {
  key: PublicTabKey;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isHot?: boolean;
}

const ALL_MENU_ITEMS: MenuItem[] = [
  { key: 'info', label: 'Informasi', desc: 'Aturan, durasi & venue', icon: Info },
  { key: 'live', label: 'Live', desc: 'Papan skor & live match', icon: Radio, badge: 'LIVE' },
  { key: 'schedule', label: 'Jadwal', desc: 'Agenda laga & hasil pertandingan', icon: Calendar },
  { key: 'standings', label: 'Grup', desc: 'Peringkat grup & klasemen', icon: ListOrdered },
  { key: 'bracket', label: 'Bracket', desc: 'Bagan turnamen eliminasi', icon: GitBranch },
  { key: 'teams', label: 'Tim', desc: 'Daftar kontingen & skuad', icon: Users },
  { key: 'stats', label: 'Statistik', desc: 'Top scorer & disiplin kartu', icon: Activity },
  { key: 'supporter', label: 'Suporter', desc: 'Voting suporter turnamen', icon: Megaphone, badge: 'HOT', isHot: true },
];

export const MobilePublicNav: React.FC<MobilePublicNavProps> = ({
  activeTab,
  onTabChange,
  onOpenTicketModal,
  onOpenRegModal,
  sportCode = 'FUTSAL',
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSelectTab = (tab: PublicTabKey) => {
    onTabChange(tab);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav
        aria-label="Navigasi Bawah Mobile"
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--bg-surface)]/95 backdrop-blur-md border-t-2 border-slate-200 dark:border-slate-800 px-2 py-1 shadow-2xl transition-colors safe-area-pb"
      >
        <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
          {/* 1. Menu Live */}
          <button
            type="button"
            onClick={() => handleSelectTab('live')}
            className={`btn-tactile flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-all duration-150 min-h-[48px] relative ${
              activeTab === 'live' && !isDrawerOpen
                ? 'text-red-500 font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <div className="relative">
              <Radio className={`w-5 h-5 mb-0.5 ${activeTab === 'live' && !isDrawerOpen ? 'stroke-[2.5]' : ''}`} />
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <span className="text-[10px] leading-tight font-medium">Live</span>
            {activeTab === 'live' && !isDrawerOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-0.5" />
            )}
          </button>

          {/* 2. Menu Jadwal */}
          <button
            type="button"
            onClick={() => handleSelectTab('schedule')}
            className={`btn-tactile flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-all duration-150 min-h-[48px] relative ${
              activeTab === 'schedule' && !isDrawerOpen
                ? 'text-[#1D63B8] dark:text-sky-400 font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Calendar className={`w-5 h-5 mb-0.5 ${activeTab === 'schedule' && !isDrawerOpen ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] leading-tight font-medium">Jadwal</span>
            {activeTab === 'schedule' && !isDrawerOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D63B8] dark:bg-sky-400 mt-0.5" />
            )}
          </button>

          {/* 3. Menu Utama (Drawer Switcher di Tengah) */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`btn-tactile flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-all duration-150 min-h-[48px] ${
              isDrawerOpen
                ? 'text-white bg-[#1D63B8] dark:bg-sky-600 font-bold shadow-md'
                : 'text-[var(--text-main)] hover:text-[#1D63B8] dark:hover:text-sky-400 font-semibold'
            }`}
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

          {/* 4. Menu Grup */}
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
            <span className="text-[10px] leading-tight font-medium">Grup</span>
            {activeTab === 'standings' && !isDrawerOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D63B8] dark:bg-sky-400 mt-0.5" />
            )}
          </button>

          {/* 5. Menu Statistik */}
          <button
            type="button"
            onClick={() => handleSelectTab('stats')}
            className={`btn-tactile flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-all duration-150 min-h-[48px] relative ${
              activeTab === 'stats' && !isDrawerOpen
                ? 'text-[#1D63B8] dark:text-sky-400 font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Activity className={`w-5 h-5 mb-0.5 ${activeTab === 'stats' && !isDrawerOpen ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] leading-tight font-medium">Statistik</span>
            {activeTab === 'stats' && !isDrawerOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D63B8] dark:bg-sky-400 mt-0.5" />
            )}
          </button>
        </div>
      </nav>

      {/* Full Menu Drawer (Sidebar Replacement on Mobile) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
          {/* Overlay Click to close */}
          <div
            className="flex-1"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="bg-[var(--bg-surface)] border-t-2 border-slate-300 dark:border-slate-800 rounded-t-xl max-h-[85vh] overflow-y-auto p-5 pb-8 shadow-2xl space-y-4 animate-slideUp">
            {/* Sheet Handle & Header */}
            <div className="space-y-3">
              <div className="w-12 h-1 bg-[var(--border-subtle)] rounded-full mx-auto" />
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <SaumaArenaLogo size="sm" />
                  <div>
                    <h3 className="font-bebas text-base sm:text-lg uppercase tracking-wider text-[var(--text-main)] leading-none">
                      Semua Menu Turnamen
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono">
                      Cabang Olahraga: <strong className="text-[#1D63B8] dark:text-sky-400">{sportCode}</strong>
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

            {/* List of Navigation Tabs */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block px-1">
                Menu Tab &amp; Pertandingan
              </span>
              {ALL_MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleSelectTab(item.key)}
                    className={`btn-tactile w-full flex items-center justify-between p-3 rounded-lg transition-all border cursor-pointer ${
                      isActive
                        ? 'bg-[#1D63B8] dark:bg-sky-600 text-white border-transparent shadow-xs font-bold'
                        : 'bg-[var(--bg-muted)]/70 text-[var(--text-main)] border-slate-200 dark:border-slate-800 hover:bg-[var(--bg-muted)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-md ${
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

            {/* Quick Action Buttons inside Drawer */}
            <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block px-1">
                Pendaftaran &amp; Partisipasi Tim
              </span>
              <div className={`grid gap-2 ${FEATURES.ticketing ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {FEATURES.ticketing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onOpenTicketModal();
                    }}
                    className="btn-tactile flex items-center justify-center gap-2 p-3 rounded-lg bg-[#1D63B8] hover:bg-[#154D92] text-white font-barlow font-bold uppercase tracking-wider text-xs shadow-xs min-h-[44px]"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Beli Tiket</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onOpenRegModal();
                  }}
                  className="btn-tactile flex items-center justify-center gap-2 p-3 rounded-lg bg-[var(--color-arena-accent)] hover:bg-amber-400 text-slate-950 font-barlow font-bold uppercase tracking-wider text-xs shadow-xs min-h-[44px]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Pendaftaran Tim</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
