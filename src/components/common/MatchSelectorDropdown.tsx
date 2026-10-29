'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, X, Trophy } from 'lucide-react';
import { Match } from '@/types';

interface MatchSelectorDropdownProps {
  matches: Match[];
  selectedMatchId: string;
  onSelectMatch: (matchId: string) => void;
  className?: string;
  variant?: 'default' | 'arena';
}

export const MatchSelectorDropdown: React.FC<MatchSelectorDropdownProps> = ({
  matches,
  selectedMatchId,
  onSelectMatch,
  className = '',
  variant = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'COMPLETED'>('ALL');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  // Tutup dropdown saat klik di luar area pada mode desktop
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Tutup dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Fokuskan input pencarian saat dropdown dibuka
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery('');
      setStatusFilter('ALL');
    }
  }, [isOpen]);

  // Kunci scroll halaman saat sheet mobile terbuka
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Filter daftar pertandingan
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      // Filter status tab
      if (statusFilter === 'LIVE' && m.status !== 'LIVE') return false;
      if (statusFilter === 'COMPLETED' && m.status !== 'COMPLETED') return false;
      if (statusFilter === 'UPCOMING' && m.status !== 'UPCOMING' && m.status !== 'POSTPONED') return false;

      // Pencarian kata kunci
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchNumStr = `laga #${m.matchNumber}`.toLowerCase();
      const numOnly = `${m.matchNumber}`;
      const teamA = (m.teamAName || '').toLowerCase();
      const teamB = (m.teamBName || '').toLowerCase();
      const stage = (m.stage || '').toLowerCase();
      const court = (m.courtName || '').toLowerCase();

      return (
        matchNumStr.includes(q) ||
        numOnly === q ||
        teamA.includes(q) ||
        teamB.includes(q) ||
        stage.includes(q) ||
        court.includes(q)
      );
    });
  }, [matches, statusFilter, searchQuery]);

  const liveCount = matches.filter((m) => m.status === 'LIVE').length;
  const completedCount = matches.filter((m) => m.status === 'COMPLETED').length;
  const upcomingCount = matches.filter((m) => m.status === 'UPCOMING' || m.status === 'POSTPONED').length;

  const isArena = variant === 'arena';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 1. Trigger Button Ringkas & Ramah Layar Sempit */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title="Klik untuk memilih pertandingan yang ditampilkan"
        className={`btn-tactile w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left font-barlow text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer min-h-[38px] ${
          isArena
            ? 'bg-slate-900/95 hover:bg-slate-800 border-2 border-slate-700 text-white shadow-md'
            : 'bg-[var(--bg-muted)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Status Dot Indikator */}
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              selectedMatch?.status === 'LIVE'
                ? 'bg-red-500 animate-pulse ring-2 ring-red-400/40'
                : selectedMatch?.status === 'COMPLETED'
                ? 'bg-emerald-500'
                : 'bg-amber-500'
            }`}
          />

          {/* Badge Nomor Laga */}
          <span className="font-bold shrink-0 text-[11px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)]">
            #{selectedMatch?.matchNumber || 1}
          </span>

          {/* Nama Kedua Tim (Otomatis Truncate pada Layar Sempit) */}
          <span className="truncate font-semibold flex-1 min-w-0 text-[11px] sm:text-xs text-[var(--text-main)]">
            {selectedMatch
              ? `${selectedMatch.teamAName} vs ${selectedMatch.teamBName}`
              : 'Pilih Laga'}
          </span>

          {/* Skor Terkini */}
          {selectedMatch && (
            <span className="shrink-0 font-mono font-bold text-[11px] px-1.5 py-0.5 rounded bg-[var(--color-arena-primary)]/15 text-[var(--color-arena-primary)] border border-[var(--color-arena-primary)]/30">
              {selectedMatch.scoreA} - {selectedMatch.scoreB}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-[var(--text-muted)] shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 2. Modal Bottom Sheet (Mobile) & Floating Popover (Desktop) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-start justify-center sm:justify-end bg-black/60 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none animate-fadeIn sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[460px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            className={`w-full max-h-[85vh] sm:max-h-[480px] flex flex-col rounded-t-3xl sm:rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] shadow-2xl overflow-hidden animate-slideUp sm:animate-fadeIn z-50 ${
              isArena ? 'bg-slate-900 border-slate-700 text-white' : ''
            }`}
          >
            {/* Mobile Drag Bar */}
            <div className="w-10 h-1 rounded-full bg-slate-400/30 mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

            {/* Header Popover / Sheet */}
            <div className="p-3.5 sm:p-4 border-b border-[var(--border-subtle)] flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[var(--color-arena-primary)]/15 text-[var(--color-arena-primary)] flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bebas text-base uppercase tracking-wider text-[var(--text-main)] leading-none truncate">
                    Pilih Pertandingan
                  </h4>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">
                    Total {matches.length} Laga MMFC I Terdaftar
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)]/80 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                title="Tutup pilihan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 shrink-0 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari sekolah, tim, atau nomor laga (cth: Kardina, Laga #2)..."
                  className="w-full pl-8.5 pr-8 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] text-xs placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--color-arena-primary)]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-[11px] font-barlow font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg border transition-all shrink-0 cursor-pointer ${
                    statusFilter === 'ALL'
                      ? 'bg-[var(--color-arena-primary)] text-white border-[var(--color-arena-primary)]'
                      : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
                  }`}
                >
                  Semua ({matches.length})
                </button>

                {liveCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setStatusFilter('LIVE')}
                    className={`px-2.5 py-1 rounded-lg border transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      statusFilter === 'LIVE'
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-[var(--bg-surface)] text-red-600 dark:text-red-400 border-[var(--border-subtle)] hover:bg-red-500/10'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    <span>Live ({liveCount})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setStatusFilter('UPCOMING')}
                  className={`px-2.5 py-1 rounded-lg border transition-all shrink-0 cursor-pointer ${
                    statusFilter === 'UPCOMING'
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-[var(--bg-surface)] text-amber-600 dark:text-amber-400 border-[var(--border-subtle)] hover:bg-amber-500/10'
                  }`}
                >
                  Jadwal ({upcomingCount})
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('COMPLETED')}
                  className={`px-2.5 py-1 rounded-lg border transition-all shrink-0 cursor-pointer ${
                    statusFilter === 'COMPLETED'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-[var(--bg-surface)] text-emerald-600 dark:text-emerald-400 border-[var(--border-subtle)] hover:bg-emerald-500/10'
                  }`}
                >
                  Selesai ({completedCount})
                </button>
              </div>
            </div>

            {/* Match Cards List */}
            <div className="overflow-y-auto p-2 sm:p-2.5 space-y-1.5 flex-1 min-h-[160px] divide-y divide-transparent">
              {filteredMatches.length === 0 ? (
                <div className="p-8 text-center space-y-1 text-xs text-[var(--text-muted)]">
                  <p className="font-semibold text-[var(--text-main)]">Tidak ada pertandingan yang cocok.</p>
                  <p>Coba gunakan kata kunci pencarian yang berbeda.</p>
                </div>
              ) : (
                filteredMatches.map((m) => {
                  const isSelected = m.id === selectedMatchId;
                  const isLive = m.status === 'LIVE';
                  const isDone = m.status === 'COMPLETED';

                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        onSelectMatch(m.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--color-arena-primary)]/12 border-[var(--color-arena-primary)]/40 shadow-xs'
                          : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] border-[var(--border-subtle)]'
                      }`}
                    >
                      <div className="flex-1 min-w-0 space-y-1">
                        {/* Meta Atas: Nomor Laga + Fase / Lapangan + Status Badge */}
                        <div className="flex items-center gap-2 flex-wrap text-[10px]">
                          <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-subtle)]">
                            Laga #{m.matchNumber}
                          </span>

                          <span className="text-[var(--text-muted)] truncate">
                            {m.courtName || 'Lap. Futsal'} &bull; {m.stage || 'Fase Grup'}
                          </span>

                          <span className="ml-auto">
                            {isLive ? (
                              <span className="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 font-bold flex items-center gap-1 animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                LIVE
                              </span>
                            ) : isDone ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold">
                                SELESAI
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold">
                                {m.scheduledTime || 'JADWAL'}
                              </span>
                            )}
                          </span>
                        </div>

                        {/* Pertandingan: Tim A vs Tim B & Skor */}
                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <span className="font-barlow font-bold text-xs uppercase tracking-wide text-[var(--text-main)] truncate">
                              {m.teamAName}
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)] font-medium shrink-0">vs</span>
                            <span className="font-barlow font-bold text-xs uppercase tracking-wide text-[var(--text-main)] truncate">
                              {m.teamBName}
                            </span>
                          </div>

                          {/* Papan Skor Digital Mini */}
                          <div className="font-mono font-extrabold text-xs px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--color-arena-accent)] border border-[var(--border-subtle)] shrink-0">
                            {m.scoreA} - {m.scoreB}
                          </div>
                        </div>
                      </div>

                      {/* Icon Indikator Laga Terpilih */}
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[var(--color-arena-primary)] text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Popover */}
            <div className="p-2.5 px-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-muted)]/30 text-[10px] text-[var(--text-muted)] flex items-center justify-between shrink-0">
              <span>Menampilkan {filteredMatches.length} dari {matches.length} pertandingan</span>
              <span className="hidden sm:inline font-mono">ESC untuk menutup</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
