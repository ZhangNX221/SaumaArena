'use client';

import React from 'react';
import { Construction, Sparkles } from 'lucide-react';

interface AdminPlaceholderModuleProps {
  title: string;
  description: string;
  category?: string;
  isComingSoon?: boolean;
}

export const AdminPlaceholderModule: React.FC<AdminPlaceholderModuleProps> = ({
  title,
  description,
  category = 'Modul Baru',
  isComingSoon = false,
}) => {
  return (
    <div className="space-y-6 py-8 animate-fadeIn">
      <div className="p-8 sm:p-12 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center space-y-4 shadow-xs">
        <div className="inline-flex p-4 rounded-2xl bg-[var(--color-arena-primary-light)] dark:bg-sky-950/40 text-[var(--color-arena-primary)] mb-2 shadow-2xs">
          <Construction className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-primary)]">
              {category}
            </span>
            {isComingSoon && (
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                Segera
              </span>
            )}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bebas tracking-wide text-[var(--text-main)] uppercase">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Halaman ini sedang disiapkan</span>
          </div>
        </div>
      </div>
    </div>
  );
};
