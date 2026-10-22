'use client';

import React, { useState } from 'react';
import { SchedulePlottingTab } from './matches/SchedulePlottingTab';
import { LiveScoreOverrideTab } from './matches/LiveScoreOverrideTab';
import { DrawingBracketTab } from './matches/DrawingBracketTab';
import { GroupStandingsTab } from './matches/GroupStandingsTab';
import { Match, SportCode } from '@/types';

export interface AdminMatchOpsModuleProps {
  selectedSport?: SportCode;
  onOpenLiveScoreControl?: (match: Match) => void;
  subTab?: 'brackets' | 'schedule' | 'override' | 'standings';
  onSelectSubTab?: (tab: 'brackets' | 'schedule' | 'override' | 'standings') => void;
}

export const AdminMatchOpsModule: React.FC<AdminMatchOpsModuleProps> = ({
  selectedSport = 'ALL',
  onOpenLiveScoreControl,
  subTab: externalSubTab,
  onSelectSubTab,
}) => {
  const [internalSubTab, setInternalSubTab] = useState<'DRAWING' | 'SCHEDULE' | 'OVERRIDE' | 'STANDINGS'>('SCHEDULE');

  const currentTab =
    externalSubTab === 'brackets'
      ? 'DRAWING'
      : externalSubTab === 'schedule'
      ? 'SCHEDULE'
      : externalSubTab === 'override'
      ? 'OVERRIDE'
      : externalSubTab === 'standings'
      ? 'STANDINGS'
      : internalSubTab;

  const handleTabChange = (t: 'DRAWING' | 'SCHEDULE' | 'OVERRIDE' | 'STANDINGS') => {
    setInternalSubTab(t);
    if (onSelectSubTab) {
      onSelectSubTab(
        t === 'DRAWING' ? 'brackets' : t === 'SCHEDULE' ? 'schedule' : t === 'OVERRIDE' ? 'override' : 'standings'
      );
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Segmented Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
            Manajemen Pertandingan
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-[var(--font-sans)] mt-1">
            Drawing bagan turnamen, plotting jadwal laga &amp; penugasan juri, pantauan live score, serta klasemen grup.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-2xl bg-[var(--bg-muted)]/80 border border-[var(--border-subtle)] text-xs font-bold font-[var(--font-display)] w-fit">
          <button
            type="button"
            onClick={() => handleTabChange('SCHEDULE')}
            className={`btn-tactile px-4 py-2 rounded-xl transition-all ${
              currentTab === 'SCHEDULE'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Plotting Jadwal &amp; Juri
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('OVERRIDE')}
            className={`btn-tactile px-4 py-2 rounded-xl transition-all ${
              currentTab === 'OVERRIDE'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Live Monitor &amp; Override
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('DRAWING')}
            className={`btn-tactile px-4 py-2 rounded-xl transition-all ${
              currentTab === 'DRAWING'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Bagan Turnamen
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('STANDINGS')}
            className={`btn-tactile px-4 py-2 rounded-xl transition-all ${
              currentTab === 'STANDINGS'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Klasemen Grup
          </button>
        </div>
      </div>

      {currentTab === 'SCHEDULE' && <SchedulePlottingTab />}
      {currentTab === 'OVERRIDE' && <LiveScoreOverrideTab onOpenLiveScoreControl={onOpenLiveScoreControl} />}
      {currentTab === 'DRAWING' && <DrawingBracketTab />}
      {currentTab === 'STANDINGS' && <GroupStandingsTab />}
    </div>
  );
};
