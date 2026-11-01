'use client';

import React from 'react';
import { Award, ShieldAlert, Eye, Info } from 'lucide-react';
import { SupporterAssessmentConfig } from '@/config/supporterRules';

interface AssessmentRubricPreviewCardProps {
  config: SupporterAssessmentConfig;
}

export const AssessmentRubricPreviewCard: React.FC<AssessmentRubricPreviewCardProps> = ({
  config,
}) => {
  const totalCriteria = config.positiveCriteria.length + config.penaltyCriteria.length;

  return (
    <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
          <Eye className="w-4 h-4 text-sky-400" />
          <span>Pratinjau Langsung Tampilan Portal &amp; Rubrik Lapangan</span>
        </div>
        <span className="text-[11px] font-mono text-[var(--text-muted)]">
          Total {totalCriteria} Kriteria
        </span>
      </div>

      <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-[var(--bg-surface)] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <Info className="w-4 h-4 text-[#1D63B8] dark:text-sky-400 shrink-0" />
          <h3 className="font-bebas text-base sm:text-lg text-[var(--text-main)] tracking-wider">
            {config.title || 'Ketentuan & Bobot Penilaian Best Supporter MMFC I'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Poin Apresiasi (Tema Biru) */}
          <div className="space-y-2 text-xs">
            <div className="font-barlow font-bold uppercase tracking-wider text-[#1D63B8] dark:text-sky-400 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Poin Apresiasi Kreativitas Tribun</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/15 text-[#1D63B8] dark:text-sky-300">
                {config.positiveCriteria.length} Kategori
              </span>
            </div>
            <div className="space-y-1.5">
              {config.positiveCriteria.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[var(--text-main)]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-[#1D63B8] text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono shadow-2xs">
                      {idx + 1}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#1D63B8] text-white font-black text-[10px] font-barlow uppercase shrink-0">
                      {item.badge}
                    </span>
                    <span className="font-medium truncate">{item.label}</span>
                  </div>
                  <span className="stadium-badge-positive font-mono tabular-nums shrink-0">
                    +{item.points}
                    {item.suffix || ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sanksi Pengurangan (Tema Merah) */}
          <div className="space-y-2 text-xs">
            <div className="font-barlow font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Sanksi Pelanggaran Ketertiban Tribun</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/15 text-red-600 dark:text-red-300">
                {config.penaltyCriteria.length} Kategori
              </span>
            </div>
            <div className="space-y-1.5">
              {config.penaltyCriteria.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--text-main)]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-red-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 font-mono shadow-2xs">
                      {idx + 1}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[10px] font-barlow uppercase shrink-0">
                      {item.badge}
                    </span>
                    <span className="font-medium truncate">{item.label}</span>
                  </div>
                  <span className="stadium-badge-penalty font-mono tabular-nums shrink-0">
                    -{item.points}
                    {item.suffix || ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

