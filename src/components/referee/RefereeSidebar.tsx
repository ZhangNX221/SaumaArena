'use client';

import React from 'react';
import { 
  ClipboardList, 
  Calendar, 
  Activity, 
  BookOpen, 
  User, 
  ArrowLeft, 
  LogOut, 
  Radio, 
  X,
  ShieldAlert
} from 'lucide-react';
import { AppUser } from '@/types';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';

export type RefereeTabKey = 'duty' | 'schedule' | 'match_center' | 'rulebook' | 'profile';

interface RefereeSidebarProps {
  activeTab: RefereeTabKey;
  onSelectTab: (tab: RefereeTabKey) => void;
  user: AppUser;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onBackToPublic?: () => void;
  onLogout?: () => void;
}

export const RefereeSidebar: React.FC<RefereeSidebarProps> = ({
  activeTab,
  onSelectTab,
  user,
  isOpenMobile = false,
  onCloseMobile = () => {},
  onBackToPublic,
  onLogout,
}) => {
  const MENU_ITEMS = [
    { id: 'duty' as RefereeTabKey, label: 'Tugas Harian', sub: 'Panggilan Lapangan', icon: ClipboardList, badge: '1 AKTIF' },
    { id: 'schedule' as RefereeTabKey, label: 'Jadwal Laga', sub: 'Jadwal Bertugas', icon: Calendar },
    { id: 'match_center' as RefereeTabKey, label: 'Match Center', sub: 'Skor Langsung', icon: Activity, badge: 'LIVE' },
    { id: 'rulebook' as RefereeTabKey, label: 'Buku Regulasi', sub: 'Aturan Cabor', icon: BookOpen },
    { id: 'profile' as RefereeTabKey, label: 'Status Kesiapan', sub: 'Profil Juri', icon: User },
  ];

  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#0b1a28] text-white flex flex-col border-r border-[#1f374f] transition-transform duration-200 shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="h-16 px-5 border-b border-[#1f374f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SaumaArenaLogo size="sm" variant="dark" />
            <div>
              <div className="font-black text-sm tracking-tight font-[var(--font-display)] flex items-center gap-1.5">
                <span>JURI CENTER</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[10px] text-slate-400">Panel Lapangan Resmi</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Assignment Quick Widget */}
        <div className="m-3 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-red-400">
            <span className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-red-500 animate-pulse" />
              <span>Panggilan Lapangan</span>
            </span>
            <span>Court 1</span>
          </div>
          <div className="text-xs font-bold text-slate-200 truncate">
            MIN 1 Kota vs MIS Al-Hidayah
          </div>
          <div className="text-[10px] text-slate-400">
            Pukul 14:00 WIB &bull; Wajib Check-in 15 Menit
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`btn-tactile w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-[#33658a] text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <div className="min-w-0">
                    <div className="text-xs truncate">{item.label}</div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-sky-200' : 'text-slate-500'}`}>
                      {item.sub}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                      item.badge === 'LIVE' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-white/20 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-[#1f374f] bg-slate-950/40 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#33658a] text-white flex items-center justify-center font-black text-xs shrink-0">
              {user.avatarText || 'RH'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold truncate text-slate-200">{user.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{user.roleLabel}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-slate-800 text-xs">
            {onBackToPublic && (
              <button
                type="button"
                onClick={onBackToPublic}
                className="btn-tactile flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-slate-300 hover:bg-slate-800 flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Publik</span>
              </button>
            )}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="btn-tactile py-1.5 px-2.5 rounded-lg text-[11px] font-bold text-red-400 hover:bg-red-950/40 flex items-center justify-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
