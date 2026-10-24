'use client';

import React, { useState } from 'react';
import { UserCheck, CheckCircle2, QrCode, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { AthleteIdCard } from '@/types';

interface RefereeCheckInStepProps {
  roster: AthleteIdCard[];
  scanNotice: string | null;
  onSimulateScanAthlete: (id: string, name: string) => void;
}

export const RefereeCheckInStep: React.FC<RefereeCheckInStepProps> = ({
  roster,
  scanNotice,
  onSimulateScanAthlete,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3.5 shadow-xs animate-fadeIn">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div className="space-y-0.5">
          <h3 className="font-bebas text-lg sm:text-xl uppercase tracking-wide text-[var(--text-main)] flex items-center gap-2 leading-none">
            <UserCheck className="w-4 h-4 text-[#33658a]" />
            <span>Susunan Pemain</span>
          </h3>
          <p className="text-xs text-[var(--text-muted)] font-sans">
            Verifikasi identitas dan kehadiran pemain sebelum pertandingan dimulai.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            {roster.filter((r) => r.checkedIn).length} / {roster.length} Hadir
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-tactile flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors"
          >
            <span>{isExpanded ? 'Tutup' : 'Buka'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {scanNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fadeIn font-sans">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{scanNotice}</span>
        </div>
      )}

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 animate-fadeIn">
          {roster.map((athlete) => (
            <div
              key={athlete.id}
              className="p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 hover:bg-[var(--bg-muted)] transition-colors flex items-center justify-between gap-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bebas text-xs shrink-0">
                  {athlete.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-barlow font-bold text-xs truncate text-[var(--text-main)] leading-tight">{athlete.name}</div>
                  <div className="text-[10px] text-[var(--text-muted)] truncate">{athlete.contingent}</div>
                  <div className="text-[9px] font-mono text-[var(--text-faint)]">{athlete.qrCode}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSimulateScanAthlete(athlete.id, athlete.name)}
                className={`btn-tactile px-2.5 py-1.5 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors ${
                  athlete.checkedIn
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#33658a] hover:bg-[#264e6b] text-white'
                }`}
              >
                {athlete.checkedIn ? <Check className="w-3.5 h-3.5" /> : <QrCode className="w-3.5 h-3.5" />}
                <span>{athlete.checkedIn ? 'Hadir' : 'Scan QR'}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
