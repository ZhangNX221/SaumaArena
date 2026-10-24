'use client';

import React, { useState } from 'react';
import { CertificateTemplatesTab } from './certificates/CertificateTemplatesTab';
import { CertificateDistributionTab } from './certificates/CertificateDistributionTab';

export interface AdminCertificatesModuleProps {
  subTab?: 'cert_templates' | 'cert_distribution';
  onSelectSubTab?: (tab: 'cert_templates' | 'cert_distribution') => void;
}

export const AdminCertificatesModule: React.FC<AdminCertificatesModuleProps> = ({
  subTab: externalSubTab,
  onSelectSubTab,
}) => {
  const [internalSubTab, setInternalSubTab] = useState<'TEMPLATES' | 'DISTRIBUTION'>('TEMPLATES');

  const currentTab =
    externalSubTab === 'cert_distribution'
      ? 'DISTRIBUTION'
      : externalSubTab === 'cert_templates'
      ? 'TEMPLATES'
      : internalSubTab;

  const handleTabChange = (t: 'TEMPLATES' | 'DISTRIBUTION') => {
    setInternalSubTab(t);
    if (onSelectSubTab) {
      onSelectSubTab(t === 'TEMPLATES' ? 'cert_templates' : 'cert_distribution');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Sub-Tab Navigation & Module Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Desain template penghargaan ber-QR dan distribusi penerbitan piagam digital otomatis.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-[var(--bg-muted)]/80 border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider w-fit">
          <button
            type="button"
            onClick={() => handleTabChange('TEMPLATES')}
            className={`btn-tactile px-4 py-2 rounded-xl transition-all ${
              currentTab === 'TEMPLATES'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Desain Sertifikat
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('DISTRIBUTION')}
            className={`btn-tactile px-4 py-2 rounded-xl transition-all ${
              currentTab === 'DISTRIBUTION'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Kirim &amp; Terbitkan Sertifikat
          </button>
        </div>
      </div>

      {/* Dynamic Sub-tabs */}
      {currentTab === 'TEMPLATES' && <CertificateTemplatesTab />}
      {currentTab === 'DISTRIBUTION' && <CertificateDistributionTab />}
    </div>
  );
};
