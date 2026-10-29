'use client';

import React, { useState } from 'react';
import { GitBranch, ListOrdered } from 'lucide-react';
import { GroupStandingsTab } from '@/components/admin/modules/matches/GroupStandingsTab';
import { DrawingBracketTab } from '@/components/admin/modules/matches/DrawingBracketTab';

export const RefereeStandingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STANDINGS' | 'BRACKET'>('STANDINGS');

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* Header Banner Juri */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#071F14] text-white border border-emerald-900/40 shadow-xs transition-all duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <h1 className="font-bebas text-3xl sm:text-4xl tracking-wide uppercase text-white leading-none">
              PERTANDINGAN &amp; BAGAN TURNAMEN
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-sans">
              Pengaturan bagan fase gugur manual, penentuan tim pemenang turnamen, dan perolehan klasemen grup.
            </p>
          </div>

          {/* Segmented Mode Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#04120C] border border-[#143D28] shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('STANDINGS')}
              className={`btn-tactile px-4 py-2 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs transition-all duration-150 active:scale-[0.98] flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'STANDINGS'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>Klasemen Grup</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('BRACKET')}
              className={`btn-tactile px-4 py-2 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs transition-all duration-150 active:scale-[0.98] flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'BRACKET'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>Bagan Gugur</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-4 sm:p-6 shadow-xs">
        {activeTab === 'STANDINGS' ? <GroupStandingsTab /> : <DrawingBracketTab />}
      </div>
    </div>
  );
};
