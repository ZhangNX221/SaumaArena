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
      {/* Segmented Switcher & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
            Sertifikat &amp; Piagam Digital Resmi
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-[var(--font-sans)] mt-1">
            Desain template penghargaan ber-QR dan distribusi penerbitan piagam digital otomatis.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-[var(--bg-muted)]/80 border border-[var(--border-subtle)] text-xs font-bold font-[var(--font-display)] w-fit">
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
