'use client';

import React from 'react';
import { Database, ShieldCheck } from 'lucide-react';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';
import { DatabaseBackupCard } from './backup/DatabaseBackupCard';
import { DatabaseRestoreCard } from './backup/DatabaseRestoreCard';
import { DatabaseExportImportCard } from './backup/DatabaseExportImportCard';

export const BackupRestoreTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Card tanpa tab switcher */}
      <AdminPageHeaderCard
        icon={Database}
        category="PENGATURAN SISTEM • BASIS DATA"
        title="Pengaturan Database"
        description="Pusat pencadangan data turnamen, pemulihan snapshot basis data, serta ekspor dan impor berkas CSV/JSON dalam satu halaman terpadu."
        action={
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-barlow font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Basis Data Aktif &amp; Terlindungi</span>
          </div>
        }
      />

      {/* 1. Card Cadangkan Seluruh Basis Data */}
      <DatabaseBackupCard />

      {/* 2. Card Pemulihan Basis Data (Restore Snapshot) */}
      <DatabaseRestoreCard />

      {/* 3. Card Ekspor dan Impor Data Terpilah */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DatabaseExportImportCard mode="EXPORT" />
        <DatabaseExportImportCard mode="IMPORT" />
      </div>
    </div>
  );
};
