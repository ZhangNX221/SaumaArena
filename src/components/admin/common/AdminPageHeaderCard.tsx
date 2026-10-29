'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface AdminPageHeaderCardProps {
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  category: string;
  badge?: React.ReactNode;
  title: React.ReactNode;
  description: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const AdminPageHeaderCard: React.FC<AdminPageHeaderCardProps> = ({
  icon: Icon,
  category,
  badge,
  title,
  description,
  action,
  children,
  className = '',
}) => {
  return (
    <div
      className={`p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${className}`}
    >
      <div>
        <div className="flex items-center gap-2 text-[var(--color-arena-primary)] flex-wrap">
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          <span className="text-xs font-barlow font-bold uppercase tracking-wider">
            {category}
          </span>
          {badge}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bebas text-[var(--text-main)] uppercase tracking-wide mt-1 leading-tight">
          {title}
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-0.5 max-w-2xl font-sans">
          {description}
        </p>
      </div>

      {(action || children) && (
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          {action}
          {children}
        </div>
      )}
    </div>
  );
};
