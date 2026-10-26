'use client';

import React from 'react';
import {
  Award,
  ShieldCheck,
  Building2,
  Flame,
  Trophy,
  Landmark,
  ExternalLink,
} from 'lucide-react';
import { TournamentPartner } from '@/types';

export interface PartnerCardProps {
  partner: TournamentPartner;
  isInteractive?: boolean;
  variant?: 'compact' | 'showcase';
}

export const PartnerCard: React.FC<PartnerCardProps> = ({
  partner,
  isInteractive = true,
  variant = 'compact',
}) => {
  const isShowcase = variant === 'showcase';

  const renderIcon = () => {
    if (partner.logoUrl) {
      return (
        <div
          className={`${
            isShowcase
              ? 'w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2.5 shadow-2xs mb-2.5 group-hover:scale-105 transition-transform duration-200'
              : 'w-10 h-10 aspect-square rounded-xl bg-white dark:bg-slate-800 border border-[var(--border-subtle)] p-1 shadow-2xs'
          } flex items-center justify-center shrink-0 overflow-hidden`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={partner.logoUrl}
            alt={partner.name}
            className="w-full h-full object-contain aspect-square"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      );
    }

    const iconBoxClass = isShowcase
      ? 'w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-2xl p-4 mb-2.5 shadow-2xs'
      : 'w-10 h-10 aspect-square rounded-xl p-2 shadow-2xs';

    const iconSizeClass = isShowcase ? 'w-8 h-8' : 'w-5 h-5';

    switch (partner.iconType) {
      case 'award':
        return (
          <div className={`${iconBoxClass} bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0`}>
            <Award className={`${iconSizeClass} text-emerald-600 dark:text-emerald-400`} />
          </div>
        );
      case 'shield':
        return (
          <div className={`${iconBoxClass} bg-green-600/10 border border-green-600/20 flex items-center justify-center shrink-0`}>
            <ShieldCheck className={`${iconSizeClass} text-green-700 dark:text-green-400`} />
          </div>
        );
      case 'building':
        return (
          <div className={`${iconBoxClass} bg-blue-600/10 border border-blue-600/20 flex items-center justify-center shrink-0`}>
            <Building2 className={`${iconSizeClass} text-blue-600 dark:text-blue-400`} />
          </div>
        );
      case 'flame':
        return (
          <div className={`${iconBoxClass} bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0`}>
            <Flame className={`${iconSizeClass} text-amber-600 dark:text-amber-400`} />
          </div>
        );
      case 'futsal':
        return (
          <div className={`${iconBoxClass} bg-sky-600/10 border border-sky-600/20 flex items-center justify-center shrink-0`}>
            <svg
              className={`${iconSizeClass} text-sky-600 dark:text-sky-400`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m4.93 4.93 4.24 4.24m5.66 0 4.24-4.24M4.93 19.07l4.24-4.24m5.66 0 4.24 4.24" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
        );
      case 'trophy':
        return (
          <div className={`${iconBoxClass} bg-rose-600/10 border border-rose-600/20 flex items-center justify-center shrink-0`}>
            <Trophy className={`${iconSizeClass} text-rose-600 dark:text-rose-400`} />
          </div>
        );
      case 'bank':
        return (
          <div className={`${iconBoxClass} bg-teal-600/10 border border-teal-600/20 flex items-center justify-center shrink-0`}>
            <Landmark className={`${iconSizeClass} text-teal-600 dark:text-teal-400`} />
          </div>
        );
      case 'custom':
      case 'logo':
      default:
        return null;
    }
  };

  const cardContent = isShowcase ? (
    <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col items-center justify-between text-center transition-all hover:border-[var(--color-arena-primary)]/50 hover:shadow-md group relative h-full w-full">
      {renderIcon()}
      <div className="w-full min-w-0">
        <div className="text-xs font-bold text-[var(--text-main)] truncate max-w-full text-center group-hover:text-[var(--color-arena-primary)] transition-colors flex items-center justify-center gap-1">
          <span className="truncate">{partner.name}</span>
          {partner.websiteUrl && isInteractive && (
            <ExternalLink className="w-2.5 h-2.5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          )}
        </div>
        <div className="text-[10px] text-[var(--text-muted)] truncate max-w-full text-center mt-0.5">
          {partner.role}
        </div>
      </div>
    </div>
  ) : (
    <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2.5 transition-all hover:border-[var(--color-arena-primary)]/40 shadow-2xs group relative w-full">
      {renderIcon()}
      <div className="min-w-0 text-left flex-1">
        <div className="text-xs font-bold text-[var(--text-main)] truncate group-hover:text-[var(--color-arena-primary)] transition-colors flex items-center gap-1">
          <span className="truncate">{partner.name}</span>
          {partner.websiteUrl && isInteractive && (
            <ExternalLink className="w-2.5 h-2.5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          )}
        </div>
        <div className="text-[10px] text-[var(--text-muted)] truncate">{partner.role}</div>
      </div>
    </div>
  );

  if (partner.websiteUrl && isInteractive) {
    return (
      <a
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${partner.name} (${partner.role})`}
        className="block focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)] rounded-2xl h-full"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};
