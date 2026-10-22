'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Match, EventType } from '@/types';

interface RefereeIncidentStepProps {
  currentMatch: Match;
  onAddIncidentItem: (type: EventType, team: 'A' | 'B', label: string) => void;
}

export const RefereeIncidentStep: React.FC<RefereeIncidentStepProps> = ({
  currentMatch,
  onAddIncidentItem,
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5 animate-fadeIn">
      <div className="pb-3 border-b border-[var(--border-subtle)]">
        <h3 className="font-black text-base text-[var(--text-main)] font-[var(--font-display)] flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>Input Cepat Insiden &amp; Pelanggaran Pertandingan</span>
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Satu sentuhan langsung tercatat ke lembar berita acara pertandingan resmi.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Team A Incidents */}
        <div className="p-4 rounded-xl bg-[var(--bg-muted)]/60 border border-[var(--border-subtle)] space-y-3">
          <div className="font-bold text-xs text-[var(--text-main)] truncate">
            {currentMatch.teamAName} (Tim A)
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => onAddIncidentItem('YELLOW_CARD', 'A', 'Kartu Kuning')}
              className="btn-tactile py-2.5 px-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 font-bold"
            >
              + Kartu Kuning
            </button>
            <button
              type="button"
              onClick={() => onAddIncidentItem('RED_CARD', 'A', 'Kartu Merah')}
              className="btn-tactile py-2.5 px-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-900 dark:text-red-300 font-bold"
            >
              + Kartu Merah
            </button>
            <button
              type="button"
              onClick={() => onAddIncidentItem('FOUL', 'A', 'Foul Tim')}
              className="btn-tactile py-2.5 px-3 rounded-xl bg-slate-500/15 border border-slate-500/30 text-[var(--text-main)] font-semibold"
            >
              + Foul
            </button>
            <button
              type="button"
              onClick={() => onAddIncidentItem('TIMEOUT', 'A', 'Time Out')}
              className="btn-tactile py-2.5 px-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-800 dark:text-blue-300 font-semibold"
            >
              + Time Out
            </button>
          </div>
        </div>

        {/* Team B Incidents */}
        <div className="p-4 rounded-xl bg-[var(--bg-muted)]/60 border border-[var(--border-subtle)] space-y-3">
          <div className="font-bold text-xs text-[var(--text-main)] truncate">
            {currentMatch.teamBName} (Tim B)
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => onAddIncidentItem('YELLOW_CARD', 'B', 'Kartu Kuning')}
              className="btn-tactile py-2.5 px-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 font-bold"
            >
              + Kartu Kuning
            </button>
            <button
              type="button"
              onClick={() => onAddIncidentItem('RED_CARD', 'B', 'Kartu Merah')}
              className="btn-tactile py-2.5 px-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-900 dark:text-red-300 font-bold"
            >
              + Kartu Merah
            </button>
            <button
              type="button"
              onClick={() => onAddIncidentItem('FOUL', 'B', 'Foul Tim')}
              className="btn-tactile py-2.5 px-3 rounded-xl bg-slate-500/15 border border-slate-500/30 text-[var(--text-main)] font-semibold"
            >
              + Foul
            </button>
            <button
              type="button"
              onClick={() => onAddIncidentItem('TIMEOUT', 'B', 'Time Out')}
              className="btn-tactile py-2.5 px-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-800 dark:text-blue-300 font-semibold"
            >
              + Time Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
