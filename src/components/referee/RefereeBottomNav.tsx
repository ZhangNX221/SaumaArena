'use client';

import React from 'react';
import { LayoutDashboard, ClipboardList, Activity, FileText, User, ListOrdered } from 'lucide-react';
import { RefereeTabKey } from './RefereeSidebar';

interface RefereeBottomNavProps {
  activeTab: RefereeTabKey;
  onSelectTab: (tab: RefereeTabKey) => void;
}

export const RefereeBottomNav: React.FC<RefereeBottomNavProps> = ({ activeTab, onSelectTab }) => {
  const ITEMS = [
    { id: 'dashboard' as RefereeTabKey, label: 'Beranda', icon: LayoutDashboard },
    { id: 'duty' as RefereeTabKey, label: 'Tugas', icon: ClipboardList },
    { id: 'match_center' as RefereeTabKey, label: 'Skor', icon: Activity, isCenter: true },
    { id: 'standings' as RefereeTabKey, label: 'Bagan', icon: ListOrdered },
    { id: 'reports' as RefereeTabKey, label: 'BAP', icon: FileText },
    { id: 'profile' as RefereeTabKey, label: 'Profil', icon: User },
  ];

  return (
    <nav
      aria-label="Navigasi Bawah Juri"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#071F14] border-t border-emerald-900/40 px-2 py-1.5 flex items-center justify-around lg:hidden text-white shadow-lg"
    >
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id || (item.id === 'duty' && activeTab === 'schedule');

        if (item.isCenter) {
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`btn-tactile flex flex-col items-center justify-center -mt-5 px-3.5 py-1.5 rounded-2xl transition-all shadow-md cursor-pointer ${
                isActive
                  ? 'bg-[var(--color-arena-accent)] text-slate-950 scale-105 shadow-amber-500/20'
                  : 'bg-[var(--color-arena-primary)] text-white hover:bg-[var(--color-arena-primary-hover)]'
              }`}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider -mt-1">{item.label}</span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={`btn-tactile flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-center transition-colors min-w-[50px] cursor-pointer ${
              isActive ? 'text-[var(--color-arena-accent)] font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
