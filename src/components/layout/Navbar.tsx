'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Eye, Moon, Sun, Search, X } from 'lucide-react';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';
import { initialTeams } from '@/mocks/tournamentData';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredTeams = searchQuery.trim().length > 0
    ? initialTeams.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.schoolName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.city?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-surface)]/95 backdrop-blur-xs border-b border-[var(--border-subtle)] transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3.5 shrink-0">
            <SaumaArenaLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-teko font-bold text-2xl sm:text-3xl tracking-wide text-[var(--text-main)] leading-none">
                  SAUMA ARENA
                </span>
                <span className="font-barlow text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] dark:bg-[#102235] dark:text-sky-300 border border-[var(--border-subtle)]">
                  Turnamen Olahraga
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-medium hidden sm:block">
                Manajemen Turnamen &amp; Match Center Terpadu
              </p>
            </div>
          </div>

          {/* Client-side Team Search (Public View Only) */}
          {currentView === 'public' && (
            <div ref={searchRef} className="relative flex-1 max-w-xs sm:max-w-sm hidden md:block">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchActive(true)}
                  placeholder="Cari tim peserta turnamen..."
                  className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-[var(--color-arena-primary)] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    aria-label="Hapus pencarian"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {isSearchActive && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto p-1.5 space-y-1 animate-fadeIn">
                  <div className="px-2.5 py-1 text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Hasil Pencarian Tim ({filteredTeams.length})
                  </div>
                  {filteredTeams.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-[var(--text-muted)] text-center">
                      Tidak ada tim yang cocok dengan &quot;{searchQuery}&quot;
                    </div>
                  ) : (
                    filteredTeams.map((team) => (
                      <div
                        key={team.id}
                        onClick={() => {
                          setIsSearchActive(false);
                          setSearchQuery('');
                        }}
                        className="px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-muted)] flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {team.logoUrl ? (
                            <img
                              src={team.logoUrl}
                              alt={team.name}
                              className="w-5 h-5 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] flex items-center justify-center text-[10px] font-bold">
                              {team.name.charAt(0)}
                            </div>
                          )}
                          <div className="truncate">
                            <span className="text-xs font-bold text-[var(--text-main)] block truncate">
                              {team.name}
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)] block truncate">
                              {team.schoolName || team.city}
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[var(--bg-muted)] text-[var(--text-muted)] shrink-0 border border-[var(--border-subtle)]">
                          Grup {team.group}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Right Controls: 3-Way Segmented View Switcher & Theme Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              role="tablist"
              aria-label="Mode Tampilan"
              className="flex items-center p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-barlow font-bold tracking-wide"
            >
              <button
                type="button"
                role="tab"
                aria-selected={currentView === 'public'}
                onClick={() => onViewChange('public')}
                className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 min-h-[40px] ${
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
                className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 min-h-[40px] ${
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
                className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 min-h-[40px] ${
                  currentView === 'referee'
                    ? 'bg-[var(--color-arena-accent)] text-slate-900 shadow-xs font-black'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
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
