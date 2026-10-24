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
  Globe,
} from 'lucide-react';
import { TournamentPartner } from '@/types';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';

interface PartnerCardProps {
  partner: TournamentPartner;
  isInteractive?: boolean;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({
  partner,
  isInteractive = true,
}) => {
  const renderIcon = () => {
    switch (partner.iconType) {
      case 'award':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        );
      case 'shield':
        return (
          <div className="w-8 h-8 rounded-lg bg-green-600/10 border border-green-600/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-green-700 dark:text-green-400" />
          </div>
        );
      case 'building':
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
        );
      case 'flame':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
        );
      case 'futsal':
        return (
          <div className="w-8 h-8 rounded-lg bg-sky-600/10 border border-sky-600/20 flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 text-sky-600 dark:text-sky-400"
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
          <div className="w-8 h-8 rounded-lg bg-rose-600/10 border border-rose-600/20 flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
        );
      case 'logo':
        return (
          <div className="shrink-0 flex items-center justify-center">
            <SaumaArenaLogo size="xs" variant="auto" />
          </div>
        );
      case 'bank':
        return (
          <div className="w-8 h-8 rounded-lg bg-teal-600/10 border border-teal-600/20 flex items-center justify-center shrink-0">
            <Landmark className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
        );
      case 'custom':
        if (partner.logoUrl) {
          return (
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 overflow-hidden p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={partner.logoUrl}
                alt={partner.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          );
        }
        return (
          <div className="w-8 h-8 rounded-lg bg-slate-500/10 border border-slate-500/20 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
        );
    }
  };

  const cardContent = (
    <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2.5 transition-all hover:border-[var(--color-arena-primary)]/40 shadow-2xs group relative">
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
        className="block focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)] rounded-xl"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};
