'use client';

import React from 'react';

interface SaumaArenaLogoProps {
  variant?: 'light' | 'dark' | 'auto';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  withText?: boolean;
  subtitle?: string;
}

const SIZE_MAP: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', { box: string; img: number }> = {
  xs: { box: 'w-6 h-6', img: 24 },
  sm: { box: 'w-8 h-8', img: 32 },
  md: { box: 'w-10 h-10', img: 40 },
  lg: { box: 'w-12 h-12', img: 48 },
  xl: { box: 'w-16 h-16', img: 64 },
};

export const SaumaArenaLogo: React.FC<SaumaArenaLogoProps> = ({
  variant = 'auto',
  size = 'md',
  className = '',
  withText = false,
  subtitle = 'Multi-Sport OS',
}) => {
  const isNamedSize = typeof size === 'string' && size in SIZE_MAP;
  const namedConfig = isNamedSize ? SIZE_MAP[size as keyof typeof SIZE_MAP] : SIZE_MAP.md;
  const customStyle = typeof size === 'number' ? { width: `${size}px`, height: `${size}px` } : undefined;

  // Responsive image selection based on theme variant
  const logoLightSrc = '/brand/sauma-arena-logo-light.jpg';
  const logoDarkSrc = '/brand/sauma-arena-logo-dark.jpg';

  const renderLogoImage = () => {
    if (variant === 'light') {
      return (
        <img
          src={logoLightSrc}
          alt="SaumaArena Logo"
          className="w-full h-full object-cover rounded-xl"
          loading="lazy"
        />
      );
    }

    if (variant === 'dark') {
      return (
        <img
          src={logoDarkSrc}
          alt="SaumaArena Logo"
          className="w-full h-full object-cover rounded-xl"
          loading="lazy"
        />
      );
    }

    // Auto variant: Switch via CSS classes
    return (
      <>
        <img
          src={logoLightSrc}
          alt="SaumaArena Logo"
          className="w-full h-full object-cover rounded-xl dark:hidden"
          loading="lazy"
        />
        <img
          src={logoDarkSrc}
          alt="SaumaArena Logo"
          className="w-full h-full object-cover rounded-xl hidden dark:block"
          loading="lazy"
        />
      </>
    );
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        style={customStyle}
        className={`relative ${namedConfig.box} shrink-0 rounded-xl overflow-hidden shadow-xs border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-center transition-transform hover:scale-105`}
      >
        {renderLogoImage()}
      </div>

      {withText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-black text-base sm:text-lg tracking-tight text-[var(--text-main)] font-[var(--font-display)] leading-tight">
              SAUMA ARENA
            </span>
          </div>
          {subtitle && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-arena-accent)] leading-tight">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
