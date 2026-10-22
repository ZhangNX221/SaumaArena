'use client';

import React, { useState } from 'react';
import { RegistrationVerificationTab } from './participants/RegistrationVerificationTab';
import { TeamsManagementTab } from './participants/TeamsManagementTab';
import { AthletesManagementTab } from './participants/AthletesManagementTab';
import { SportCode } from '@/types';

export interface AdminParticipantsModuleProps {
  selectedSport?: SportCode;
  subTab?: 'verification' | 'contingents' | 'id_cards';
  onSelectSubTab?: (tab: 'verification' | 'contingents' | 'id_cards') => void;
}

export const AdminParticipantsModule: React.FC<AdminParticipantsModuleProps> = ({
  selectedSport = 'ALL',
  subTab: externalSubTab,
  onSelectSubTab,
}) => {
  const [internalSubTab, setInternalSubTab] = useState<'VERIFICATION' | 'TEAMS' | 'ATHLETES'>('ATHLETES');

  const currentTab =
    externalSubTab === 'verification'
      ? 'VERIFICATION'
      : externalSubTab === 'contingents'
      ? 'TEAMS'
      : externalSubTab === 'id_cards'
      ? 'ATHLETES'
      : internalSubTab;

  const handleTabChange = (t: 'VERIFICATION' | 'TEAMS' | 'ATHLETES') => {
    setInternalSubTab(t);
    if (onSelectSubTab) {
      onSelectSubTab(t === 'VERIFICATION' ? 'verification' : t === 'TEAMS' ? 'contingents' : 'id_cards');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Segmented Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
            Registrasi &amp; Database Peserta
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-[var(--font-sans)] mt-1">
            Verifikasi berkas legalitas pendaftaran, basis data kontingen, dan ID pass QR resmi atlet.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-[var(--bg-muted)]/80 border border-[var(--border-subtle)] text-xs font-bold font-[var(--font-display)] w-fit">
          <button
            type="button"
            onClick={() => handleTabChange('ATHLETES')}
            className={`btn-tactile px-4 py-2 rounded-xl transition-all ${
              currentTab === 'ATHLETES'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            ID Card Atlet QR
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('TEAMS')}
            className={`btn-tactile px-4 py-2 rounded-xl transition-all ${
              currentTab === 'TEAMS'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Data Kontingen Tim
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('VERIFICATION')}
            className={`btn-tactile px-4 py-2 rounded-xl transition-all ${
              currentTab === 'VERIFICATION'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Verifikasi Berkas
          </button>
        </div>
      </div>

      {currentTab === 'ATHLETES' && <AthletesManagementTab selectedSport={selectedSport} />}
      {currentTab === 'TEAMS' && <TeamsManagementTab />}
      {currentTab === 'VERIFICATION' && <RegistrationVerificationTab selectedSport={selectedSport} />}
    </div>
  );
};
