'use client';

import React, { useState } from 'react';
import { RegistrationVerificationTab } from './participants/RegistrationVerificationTab';
import { TeamsManagementTab } from './participants/TeamsManagementTab';
import { AthletesManagementTab } from './participants/AthletesManagementTab';
import { SportCode } from '@/types';
import { QrCode, Users, ShieldCheck } from 'lucide-react';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';

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
      {/* Title Card */}
      <AdminPageHeaderCard
        icon={currentTab === 'ATHLETES' ? QrCode : currentTab === 'TEAMS' ? Users : ShieldCheck}
        category={
          currentTab === 'ATHLETES'
            ? 'PESERTA • KARTU ATLET'
            : currentTab === 'TEAMS'
            ? 'PESERTA • TIM RESMI'
            : 'PESERTA • VERIFIKASI BERKAS'
        }
        title={
          currentTab === 'ATHLETES'
            ? 'Database Kartu Atlet Resmi & ID Pass QR'
            : currentTab === 'TEAMS'
            ? 'Data Kontingen & Tim Peserta'
            : 'Verifikasi Berkas & Dokumen Peserta'
        }
        description={
          currentTab === 'ATHLETES'
            ? 'Penerbitan kartu identitas resmi atlet, validasi QR gate tanding, dan cetak massal ID Pass.'
            : currentTab === 'TEAMS'
            ? 'Daftar resmi kontingen tim dan klub peserta yang berhak bertanding di arena turnamen.'
            : 'Pemeriksaan keabsahan berkas pendaftaran, verifikasi dokumen atlet, dan status roster kontingen.'
        }
        action={
          <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-[var(--bg-muted)]/80 border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider w-fit">
            <button
              type="button"
              onClick={() => handleTabChange('ATHLETES')}
              className={`btn-tactile px-3.5 py-2 rounded-xl transition-all ${
                currentTab === 'ATHLETES'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Kartu Atlet
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('TEAMS')}
              className={`btn-tactile px-3.5 py-2 rounded-xl transition-all ${
                currentTab === 'TEAMS'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Tim
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('VERIFICATION')}
              className={`btn-tactile px-3.5 py-2 rounded-xl transition-all ${
                currentTab === 'VERIFICATION'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Verifikasi Berkas
            </button>
          </div>
        }
      />

      {currentTab === 'ATHLETES' && <AthletesManagementTab selectedSport={selectedSport} />}
      {currentTab === 'TEAMS' && <TeamsManagementTab />}
      {currentTab === 'VERIFICATION' && <RegistrationVerificationTab selectedSport={selectedSport} />}
    </div>
  );
};
