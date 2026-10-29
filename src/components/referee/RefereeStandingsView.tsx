'use client';

import React, { useState } from 'react';
import { GitBranch, ListOrdered } from 'lucide-react';
import { GroupStandingsTab } from '@/components/admin/modules/matches/GroupStandingsTab';
import { DrawingBracketTab } from '@/components/admin/modules/matches/DrawingBracketTab';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';

export const RefereeStandingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STANDINGS' | 'BRACKET'>('STANDINGS');

  return (
    <div className="space-y-6 w-full pb-16 animate-fadeIn">
      {/* 1. Header Card Seragam */}
      <AdminPageHeaderCard
        icon={ListOrdered}
        category="MEJA LAPANGAN • PERTANDINGAN & BAGAN"
        title="Pertandingan & Bagan Turnamen"
        description="Pengaturan bagan fase gugur manual, penentuan tim pemenang turnamen, dan perolehan klasemen grup."
        action={
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('STANDINGS')}
              className={`btn-tactile px-3.5 py-1.5 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs transition-all duration-150 active:scale-[0.98] flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'STANDINGS'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Klasemen Grup</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('BRACKET')}
              className={`btn-tactile px-3.5 py-1.5 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs transition-all duration-150 active:scale-[0.98] flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'BRACKET'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Bagan Gugur</span>
            </button>
          </div>
        }
      />

      {/* Content */}
      <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-4 sm:p-6 shadow-xs">
        {activeTab === 'STANDINGS' ? <GroupStandingsTab /> : <DrawingBracketTab />}
      </div>
    </div>
  );
};
