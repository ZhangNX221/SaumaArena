'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface PublicPageHeaderProps {
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  category: string;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}

export const PublicPageHeader: React.FC<PublicPageHeaderProps> = ({
  icon: Icon,
  category,
  title,
  description,
  className = '',
  children,
}) => {
  return (
    <div className={`space-y-1.5 pb-2 ${className}`}>
      <div className="flex items-center gap-2 text-[var(--color-arena-primary)]">
        {Icon && <Icon className="w-4 h-4 shrink-0" />}
        <span className="text-xs font-barlow font-bold uppercase tracking-wider">
          {category}
        </span>
      </div>
      <h2 className="text-3xl sm:text-4xl font-bebas text-[var(--text-main)] uppercase tracking-wide">
        {title}
      </h2>
      <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
        {description}
      </p>
      {children}
    </div>
  );
};
