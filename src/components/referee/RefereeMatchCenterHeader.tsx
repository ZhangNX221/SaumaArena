'use client';

import React from 'react';
import { Radio, RotateCcw } from 'lucide-react';
import { Match } from '@/types';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';

interface RefereeMatchCenterHeaderProps {
  currentMatch: Match;
  onResetMatch: () => void;
}

export const RefereeMatchCenterHeader: React.FC<RefereeMatchCenterHeaderProps> = ({
  currentMatch,
  onResetMatch,
}) => {
  return (
    <AdminPageHeaderCard
      icon={Radio}
      category="MEJA LAPANGAN • PENCATATAN SKOR & WAKTU"
      badge={
        <span className="text-[11px] font-mono font-bold text-[var(--text-main)] px-2 py-0.5 rounded-md bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
          Laga #{currentMatch.matchNumber} &bull; {currentMatch.courtName || 'Lapangan Utama'} &bull;{' '}
          {currentMatch.stage || 'Babak Penyisihan'}
        </span>
      }
      title={
        <>
          {currentMatch.teamAName} <span className="text-[var(--color-arena-accent)]">VS</span>{' '}
          {currentMatch.teamBName}
        </>
      }
      description="Pusat kendali meja wasit: catat timer pertandingan, perolehan skor, dan insiden pelanggaran secara langsung."
      action={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetMatch}
            className="btn-tactile px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-barlow font-bold uppercase tracking-wider text-xs border border-red-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset Seluruh Skor & Waktu Laga Ini ke 0-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Laga</span>
          </button>
          <div className="px-4 py-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-center min-w-[110px]">
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              Skor Saat Ini
            </span>
            <span className="font-teko font-bold text-3xl text-[var(--color-arena-accent)] tabular-nums leading-none">
              {currentMatch.scoreA} - {currentMatch.scoreB}
            </span>
          </div>
        </div>
      }
    />
  );
};

