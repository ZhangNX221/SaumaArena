'use client';

import React from 'react';
import { ShieldCheck, Eye, Moon, Sun } from 'lucide-react';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';

interface NavbarProps {
  currentView: 'public' | 'admin' | 'referee';
  onViewChange: (view: 'public' | 'admin' | 'referee') => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-surface)]/95 backdrop-blur-xs border-b border-[var(--border-subtle)] transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3.5">
            <SaumaArenaLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-[var(--text-main)] font-[var(--font-display)]">
                  SAUMA ARENA
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] dark:bg-[#102235] dark:text-sky-300 border border-[var(--border-subtle)]">
                  Multi-Sport OS
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-medium hidden sm:block">
                Manajemen Turnamen &amp; Match Center Terpadu
              </p>
            </div>
          </div>

          {/* Right Controls: 3-Way Segmented View Switcher & Theme Toggle */}
          <div className="flex items-center gap-3">
            <div
              role="tablist"
              aria-label="Mode Tampilan"
              className="flex items-center p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold"
            >
              <button
                type="button"
                role="tab"
                aria-selected={currentView === 'public'}
                onClick={() => onViewChange('public')}
                className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 min-h-[36px] ${
                  currentView === 'public'
                    ? 'bg-[var(--bg-surface)] text-[var(--color-arena-primary)] shadow-xs font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Publik</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={currentView === 'admin'}
                onClick={() => onViewChange('admin')}
                className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 min-h-[36px] ${
                  currentView === 'admin'
                    ? 'bg-[var(--color-arena-primary)] text-white shadow-xs font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-arena-accent)]" />
                <span className="hidden sm:inline">Admin</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={currentView === 'referee'}
                onClick={() => onViewChange('referee')}
                className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 min-h-[36px] ${
                  currentView === 'referee'
                    ? 'bg-[var(--color-arena-accent)] text-slate-900 shadow-xs font-black'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="hidden sm:inline">Juri</span>
              </button>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="btn-tactile flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors"
              title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              aria-label="Toggle tema gelap atau terang"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
