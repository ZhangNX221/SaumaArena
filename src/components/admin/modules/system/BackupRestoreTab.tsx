'use client';

import React, { useState } from 'react';
import { Database, ShieldCheck, Sliders } from 'lucide-react';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';
import { DatabaseSnapshotCard } from './backup/DatabaseSnapshotCard';
import { DatabaseExportImportCard } from './backup/DatabaseExportImportCard';
import { SettingsBackupRestoreModal } from './SettingsBackupRestoreModal';

export const BackupRestoreTab: React.FC = () => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Card */}
      <AdminPageHeaderCard
        icon={Database}
        category="PENGATURAN SISTEM • BASIS DATA"
        title="Pengaturan Database"
        description="Pusat pencadangan snapshot sistem serta ekspor dan impor data turnamen."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              className="btn-tactile inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--color-arena-primary-light)] border border-[var(--color-arena-primary)]/30 text-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary)] hover:text-white transition-all text-xs font-barlow font-bold uppercase tracking-wider cursor-pointer shadow-xs"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Backup Settingan Laga</span>
            </button>
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-barlow font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Basis Data Aktif</span>
            </div>
          </div>
        }
      />

      {/* 1. Card Snapshot Basis Data (Cadangkan & Pulihkan Terpadu) */}
      <DatabaseSnapshotCard />

      {/* 2. Card Ekspor dan Impor Data Terpilah */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DatabaseExportImportCard mode="EXPORT" />
        <DatabaseExportImportCard mode="IMPORT" />
      </div>

      {/* Modal Backup & Restore Settingan */}
      <SettingsBackupRestoreModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};
