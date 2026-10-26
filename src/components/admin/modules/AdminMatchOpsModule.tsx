'use client';

import React, { useState } from 'react';
import { SchedulePlottingTab } from './matches/SchedulePlottingTab';
import { LiveScoreOverrideTab } from './matches/LiveScoreOverrideTab';
import { DrawingBracketTab } from './matches/DrawingBracketTab';
import { GroupStandingsTab } from './matches/GroupStandingsTab';
import { Match, SportCode } from '@/types';
import { Calendar, Radio, GitBranch, Trophy } from 'lucide-react';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';

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
      {/* Title Card */}
      <AdminPageHeaderCard
        icon={
          currentTab === 'SCHEDULE'
            ? Calendar
            : currentTab === 'OVERRIDE'
            ? Radio
            : currentTab === 'DRAWING'
            ? GitBranch
            : Trophy
        }
        category={
          currentTab === 'SCHEDULE'
            ? 'PERTANDINGAN • PLOTTING JADWAL'
            : currentTab === 'OVERRIDE'
            ? 'PERTANDINGAN • SKOR LANGSUNG'
            : currentTab === 'DRAWING'
            ? 'PERTANDINGAN • BAGAN TURNAMEN'
            : 'PERTANDINGAN • KLASEMEN GRUP'
        }
        title={
          currentTab === 'SCHEDULE'
            ? 'Plotting Jadwal & Penugasan Lapangan'
            : currentTab === 'OVERRIDE'
            ? 'Panel Kontrol Skor Langsung & Status Laga'
            : currentTab === 'DRAWING'
            ? 'Generator Bagan & Drawing Turnamen'
            : 'Klasemen Poin Babak Grup'
        }
        description={
          currentTab === 'SCHEDULE'
            ? 'Atur jadwal sepak mula pertandingan, alokasi lapangan arena, dan penetapan status live laga.'
            : currentTab === 'OVERRIDE'
            ? 'Pembaruan skor cepat satu-ketukan di lapangan, koreksi skor manual wasit, dan pergantian status pertandingan.'
            : currentTab === 'DRAWING'
            ? 'Sistem gugur tunggal (Single Elimination) & pembagian bagan babak gugur resmi kejuaraan.'
            : 'Perhitungan otomatis poin kemenangan, selisih gol, rekor tanding, dan peringkat grup turnamen.'
        }
        action={
          <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-2xl bg-[var(--bg-muted)]/80 border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider w-fit">
            <button
              type="button"
              onClick={() => handleTabChange('SCHEDULE')}
              className={`btn-tactile px-3.5 py-1.5 rounded-xl transition-all ${
                currentTab === 'SCHEDULE'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Jadwal Pertandingan
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('OVERRIDE')}
              className={`btn-tactile px-3.5 py-1.5 rounded-xl transition-all ${
                currentTab === 'OVERRIDE'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Skor Langsung
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('DRAWING')}
              className={`btn-tactile px-3.5 py-1.5 rounded-xl transition-all ${
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
              className={`btn-tactile px-3.5 py-1.5 rounded-xl transition-all ${
                currentTab === 'STANDINGS'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Klasemen
            </button>
          </div>
        }
      />

      {currentTab === 'SCHEDULE' && <SchedulePlottingTab />}
      {currentTab === 'OVERRIDE' && <LiveScoreOverrideTab onOpenLiveScoreControl={onOpenLiveScoreControl} />}
      {currentTab === 'DRAWING' && <DrawingBracketTab />}
      {currentTab === 'STANDINGS' && <GroupStandingsTab />}
    </div>
  );
};
