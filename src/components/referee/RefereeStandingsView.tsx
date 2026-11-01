'use client';

import React from 'react';
import { ListOrdered } from 'lucide-react';
import { GroupStandingsTab } from '@/components/admin/modules/matches/GroupStandingsTab';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';

export const RefereeStandingsView: React.FC = () => {
  return (
    <div className="space-y-6 w-full pb-16 animate-fadeIn">
      {/* 1. Header Card Seragam */}
      <AdminPageHeaderCard
        icon={ListOrdered}
        category="MEJA LAPANGAN • KLASEMEN GRUB"
        title="Klasemen Grub Turnamen"
        description="Perolehan poin, selisih gol, total main, dan peringkat klasemen grup secara real-time."
      />

      {/* Content */}
      <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-4 sm:p-6 shadow-xs">
        <GroupStandingsTab />
      </div>
    </div>
  );
};
