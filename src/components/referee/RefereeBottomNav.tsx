'use client';

import React from 'react';
import { ClipboardList, Calendar, Activity, BookOpen, User } from 'lucide-react';
import { RefereeTabKey } from './RefereeSidebar';

interface RefereeBottomNavProps {
  activeTab: RefereeTabKey;
  onSelectTab: (tab: RefereeTabKey) => void;
}

export const RefereeBottomNav: React.FC<RefereeBottomNavProps> = ({ activeTab, onSelectTab }) => {
  const ITEMS = [
    { id: 'duty' as RefereeTabKey, label: 'Tugas', icon: ClipboardList },
    { id: 'schedule' as RefereeTabKey, label: 'Jadwal', icon: Calendar },
    { id: 'match_center' as RefereeTabKey, label: 'Match Center', icon: Activity, isCenter: true },
    { id: 'rulebook' as RefereeTabKey, label: 'Regulasi', icon: BookOpen },
    { id: 'profile' as RefereeTabKey, label: 'Kesiapan', icon: User },
  ];

  return (
    <nav
      aria-label="Navigasi Bawah Juri"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0b1a28] border-t border-[#1f374f] px-2 py-1.5 flex items-center justify-around lg:hidden text-white shadow-lg"
    >
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        if (item.isCenter) {
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`btn-tactile flex flex-col items-center justify-center -mt-5 px-3 py-1.5 rounded-2xl transition-all shadow-md ${
                isActive ? 'bg-[#f6ae2d] text-slate-950 scale-105' : 'bg-[#33658a] text-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black -mt-1">{item.label}</span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={`btn-tactile flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-center transition-colors min-w-[56px] ${
              isActive ? 'text-[#f6ae2d] font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
