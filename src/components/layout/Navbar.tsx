'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LogIn, Users, Moon, Sun, Search, X } from 'lucide-react';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';
import { initialTeams } from '@/mocks/tournamentData';

interface NavbarProps {
  currentView: 'public' | 'admin' | 'referee';
  onViewChange: (view: 'public' | 'admin' | 'referee') => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenRegModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  darkMode,
  onToggleDarkMode,
  onOpenRegModal,
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
    <header className="sticky top-0 z-50 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b-2 border-slate-200 dark:border-slate-800 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18 gap-3">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <SaumaArenaLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-teko font-bold text-2xl sm:text-3xl tracking-wide text-[var(--text-main)] leading-none">
                  SAUMA ARENA
                </span>
                <span className="font-barlow text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D63B8] animate-pulse" />
                  <span>MMFC I</span>
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-medium hidden sm:block">
                Match Center &amp; Turnamen Futsal Terpadu
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
                  placeholder="Cari tim atau sekolah kontingen..."
                  className="w-full pl-8 pr-8 py-2 rounded-lg bg-[var(--bg-muted)] border border-slate-300 dark:border-slate-700 text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#1D63B8] transition-colors min-h-[40px]"
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
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto p-1.5 space-y-1 animate-fadeIn">
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
                        className="px-2.5 py-1.5 rounded-md hover:bg-[var(--bg-muted)] flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {team.logoUrl ? (
                            <img
                              src={team.logoUrl}
                              alt={team.name}
                              className="w-6 h-6 rounded-md object-contain shrink-0"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-md bg-blue-50 text-[#1D63B8] flex items-center justify-center text-[10px] font-bold">
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
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300 shrink-0 border border-blue-200 dark:border-sky-800">
                          Grup {team.group}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Right Controls: Tombol Login, Tombol Pendaftaran & Theme Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Tombol Login */}
            <button
              type="button"
              onClick={() => {
                if (currentView === 'public') {
                  onViewChange('admin');
                } else {
                  onViewChange('public');
                }
              }}
              className="btn-tactile flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs bg-[var(--bg-muted)] hover:bg-[var(--bg-surface)] active:scale-95 text-[var(--text-main)] border border-slate-300 dark:border-slate-700 transition-all min-h-[40px] shadow-2xs shrink-0 cursor-pointer"
              title={currentView === 'public' ? 'Login ke Portal Admin / Juri' : 'Kembali ke Tampilan Publik'}
            >
              <LogIn className="w-3.5 h-3.5 text-[#1D63B8] dark:text-sky-400 shrink-0" />
              <span>{currentView === 'public' ? 'Login Portal' : 'Tampilan Publik'}</span>
            </button>

            {/* Tombol Pendaftaran Tim */}
            <button
              type="button"
              onClick={onOpenRegModal}
              className="btn-tactile flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs bg-[#1D63B8] hover:bg-[#154D92] active:scale-95 text-white shadow-xs transition-all min-h-[40px] shrink-0 cursor-pointer"
              title="Daftarkan Tim Peserta Turnamen"
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>
                <span className="inline sm:hidden">Daftar</span>
                <span className="hidden sm:inline">Pendaftaran Tim</span>
              </span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="btn-tactile flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors shrink-0 cursor-pointer"
              title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              aria-label="Toggle tema gelap atau terang"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
