'use client';

import React, { useState } from 'react';
import { RegistrationVerificationTab } from './participants/RegistrationVerificationTab';
import { TeamsManagementTab } from './participants/TeamsManagementTab';
import { SportCode } from '@/types';
import { Users, ShieldCheck } from 'lucide-react';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';

export interface AdminParticipantsModuleProps {
  selectedSport?: SportCode;
  subTab?: 'verification' | 'contingents';
  onSelectSubTab?: (tab: 'verification' | 'contingents') => void;
}

export const AdminParticipantsModule: React.FC<AdminParticipantsModuleProps> = ({
  selectedSport = 'ALL',
  subTab: externalSubTab,
  onSelectSubTab,
}) => {
  const [internalSubTab, setInternalSubTab] = useState<'VERIFICATION' | 'TEAMS'>('TEAMS');

  const currentTab =
    externalSubTab === 'verification'
      ? 'VERIFICATION'
      : externalSubTab === 'contingents'
      ? 'TEAMS'
      : internalSubTab;

  const handleTabChange = (t: 'VERIFICATION' | 'TEAMS') => {
    setInternalSubTab(t);
    if (onSelectSubTab) {
      onSelectSubTab(t === 'VERIFICATION' ? 'verification' : 'contingents');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title Card */}
      <AdminPageHeaderCard
        icon={currentTab === 'TEAMS' ? Users : ShieldCheck}
        category={currentTab === 'TEAMS' ? 'PESERTA • TIM RESMI' : 'PESERTA • VERIFIKASI BERKAS'}
        title={currentTab === 'TEAMS' ? 'Data Kontingen & Tim Peserta' : 'Verifikasi Berkas & Dokumen Peserta'}
        description={
          currentTab === 'TEAMS'
            ? 'Daftar resmi kontingen tim dan klub peserta yang berhak bertanding di arena turnamen.'
            : 'Pemeriksaan keabsahan berkas pendaftaran, verifikasi dokumen atlet, dan status roster kontingen.'
        }
      />

      {currentTab === 'TEAMS' && <TeamsManagementTab />}
      {currentTab === 'VERIFICATION' && <RegistrationVerificationTab selectedSport={selectedSport} />}
    </div>
  );
};
