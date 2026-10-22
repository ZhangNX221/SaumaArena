'use client';

import React from 'react';
import { UserCheck, CheckCircle2, QrCode, Check } from 'lucide-react';
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
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h3 className="font-black text-base sm:text-lg text-[var(--text-main)] font-[var(--font-display)] flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#33658a]" />
            <span>Validasi Identitas Pemain (Cegah Joki &amp; Atlet Ilegal)</span>
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Pindai QR ID Card sebelum kick-off untuk mencocokkan wajah &amp; keaslian dokumen resmi Dispora.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#33658a]/10 text-[#33658a] border border-[#33658a]/20 w-fit">
          {roster.filter((r) => r.checkedIn).length} / {roster.length} Atlet Hadir Sah
        </span>
      </div>

      {scanNotice && (
        <div className="p-3.5 rounded-xl bg-[#33658a]/10 border border-[#33658a]/30 text-xs font-bold text-[#1e4563] dark:text-sky-200 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#33658a] shrink-0" />
          <span>{scanNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {roster.map((athlete) => (
          <div
            key={athlete.id}
            className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                {athlete.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs truncate text-[var(--text-main)]">{athlete.name}</div>
                <div className="text-[10px] text-[var(--text-muted)] truncate">{athlete.contingent}</div>
                <div className="text-[9px] font-mono text-[#33658a]">{athlete.qrCode}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSimulateScanAthlete(athlete.id, athlete.name)}
              className={`btn-tactile px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors ${
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
    </div>
  );
};
