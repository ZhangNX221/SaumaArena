'use client';

import React from 'react';
import { GitBranch } from 'lucide-react';
import { DrawingBracketTab } from '@/components/admin/modules/matches/DrawingBracketTab';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';

export const RefereeBracketView: React.FC = () => {
  return (
    <div className="space-y-6 w-full pb-16 animate-fadeIn">
      {/* 1. Header Card Seragam */}
      <AdminPageHeaderCard
        icon={GitBranch}
        category="MEJA LAPANGAN • BRACKET & BAGAN"
        title="Bracket Babak Gugur"
        description="Pengaturan bagan fase gugur manual, penentuan tim pemenang turnamen, dan penetapan juara turnamen."
      />

      {/* Content */}
      <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-4 sm:p-6 shadow-xs">
        <DrawingBracketTab />
      </div>
    </div>
  );
};

