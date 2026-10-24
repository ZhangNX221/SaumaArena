'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  RotateCcw,
  Plus,
  Minus,
  Edit3,
  CheckCircle2,
} from 'lucide-react';
import { initialMatches } from '@/mocks/tournamentData';
import { Match, MatchStatus, SportCode } from '@/types';
import { LiveScoreOverrideModal } from './LiveScoreOverrideModal';

interface LiveScoreOverrideTabProps {
  selectedSport?: SportCode;
  onOpenLiveScoreControl?: (match: Match) => void;
}

const STORAGE_KEY = 'sauma_arena_live_matches';

export const LiveScoreOverrideTab: React.FC<LiveScoreOverrideTabProps> = ({
  onOpenLiveScoreControl,
}) => {
  // Offline-first initial state
  const [matches, setMatches] = useState<Match[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) return JSON.parse(cached);
      } catch {
        // Fallback to default
      }
    }
    return initialMatches;
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | MatchStatus>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scoreFlashId, setScoreFlashId] = useState<string | null>(null);
  const [overrideModalMatch, setOverrideModalMatch] = useState<Match | null>(null);

  // Sync to localStorage
  const saveMatches = (newMatches: Match[], feedbackMessage?: string) => {
    setMatches(newMatches);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMatches));
    } catch {
      // Storage quota or private mode fallback
    }
    if (feedbackMessage) {
      setToastMessage(feedbackMessage);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  // 1-Tap Quick Stepper for Fast Court Operation (Under 1 second click)
  const handleQuickScore = (matchId: string, team: 'A' | 'B', delta: number) => {
    setScoreFlashId(`${matchId}-${team}`);
    setTimeout(() => setScoreFlashId(null), 400);

    const updated = matches.map((m) => {
      if (m.id !== matchId) return m;
      const newScoreA = team === 'A' ? Math.max(0, m.scoreA + delta) : m.scoreA;
      const newScoreB = team === 'B' ? Math.max(0, m.scoreB + delta) : m.scoreB;
      return {
        ...m,
        scoreA: newScoreA,
        scoreB: newScoreB,
        status: m.status === 'UPCOMING' ? ('LIVE' as MatchStatus) : m.status,
      };
    });

    const targetMatch = matches.find((m) => m.id === matchId);
    const teamName = team === 'A' ? targetMatch?.teamAName : targetMatch?.teamBName;
    saveMatches(updated, `Skor ${teamName} diperbarui (${delta > 0 ? '+1' : '-1'})`);
  };

  // 1-Click Quick Status Switcher
  const handleQuickStatus = (matchId: string, nextStatus: MatchStatus) => {
    const updated = matches.map((m) => (m.id === matchId ? { ...m, status: nextStatus } : m));
    saveMatches(updated, `Status laga #${matches.find((m) => m.id === matchId)?.matchNumber} diubah ke ${nextStatus}`);
  };

  // Quick reset to initial mock
  const handleResetData = () => {
    if (confirm('Kembalikan semua skor dan status ke data awal turnamen?')) {
      saveMatches(initialMatches, 'Data laga dikembalikan ke pengaturan awal');
    }
  };

  const handleSaveModalOverride = (newScoreA: number, newScoreB: number) => {
    if (!overrideModalMatch) return;
    const updated = matches.map((m) =>
      m.id === overrideModalMatch.id
        ? { ...m, scoreA: newScoreA, scoreB: newScoreB }
        : m
    );
    saveMatches(updated, `Skor Laga #${overrideModalMatch.matchNumber} disesuaikan`);
    setOverrideModalMatch(null);
  };

  const filtered = matches.filter((m) => {
    const matchesSearch =
      m.teamAName.toLowerCase().includes(search.toLowerCase()) ||
      m.teamBName.toLowerCase().includes(search.toLowerCase()) ||
      String(m.matchNumber).includes(search) ||
      m.courtName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const liveCount = matches.filter((m) => m.status === 'LIVE').length;
  const upcomingCount = matches.filter((m) => m.status === 'UPCOMING').length;
  const completedCount = matches.filter((m) => m.status === 'COMPLETED').length;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Tersimpan Offline
          </span>
        </div>
      )}

      {/* Control Bar: Fast Filters & Search */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-barlow font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`btn-tactile px-3 py-1.5 rounded-xl border transition-all ${
              statusFilter === 'ALL'
                ? 'bg-[var(--color-arena-primary)] text-white border-transparent shadow-xs'
                : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)]'
            }`}
          >
            Semua ({matches.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('LIVE')}
            className={`btn-tactile px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
              statusFilter === 'LIVE'
                ? 'bg-red-600 text-white border-transparent shadow-xs'
                : 'border-[var(--border-subtle)] text-red-600 hover:bg-red-500/10'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span>Live ({liveCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('UPCOMING')}
            className={`btn-tactile px-3 py-1.5 rounded-xl border transition-all ${
              statusFilter === 'UPCOMING'
                ? 'bg-[var(--color-arena-primary)] text-white border-transparent shadow-xs'
                : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)]'
            }`}
          >
            Jadwal ({upcomingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('COMPLETED')}
            className={`btn-tactile px-3 py-1.5 rounded-xl border transition-all ${
              statusFilter === 'COMPLETED'
                ? 'bg-[var(--color-arena-primary)] text-white border-transparent shadow-xs'
                : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)]'
            }`}
          >
            Selesai ({completedCount})
          </button>
        </div>

        {/* Search & Reset */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
            <input
              type="text"
              placeholder="Cari tim, no. laga, lapangan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
            />
          </div>
          <button
            type="button"
            onClick={handleResetData}
            title="Reset ke data default"
            className="p-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Dense Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full p-8 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] text-xs">
            Tidak ada pertandingan ditemukan pada filter ini.
          </div>
        ) : (
          filtered.map((m) => {
            const isLive = m.status === 'LIVE';
            const isCompleted = m.status === 'COMPLETED';

            return (
              <div
                key={m.id}
                className={`p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border transition-all space-y-4 shadow-xs ${
                  isLive
                    ? 'border-red-500/50 shadow-red-500/5 ring-1 ring-red-500/20'
                    : 'border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)]/40'
                }`}
              >
                {/* Header Card: Match Info & Status Pill */}
                <div className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[var(--bg-muted)] text-[var(--color-arena-primary)]">
                      #{m.matchNumber}
                    </span>
                    <span className="text-xs font-semibold text-[var(--text-muted)] truncate">
                      {m.stage} • {m.courtName}
                    </span>
                  </div>

                  {/* Live / Status Indicator */}
                  {isLive ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-barlow font-bold uppercase tracking-wider animate-pulse shadow-xs">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      <span>LIVE</span>
                    </div>
                  ) : isCompleted ? (
                    <span className="px-2.5 py-1 rounded-full bg-slate-500/15 text-slate-600 dark:text-slate-400 text-[11px] font-barlow font-bold uppercase tracking-wider">
                      SELESAI
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-[var(--bg-muted)] text-[var(--text-muted)] text-[11px] font-barlow font-bold uppercase tracking-wider">
                      TERJADWAL
                    </span>
                  )}
                </div>

                {/* Score Section with Rapid 1-Tap Steppers */}
                <div className="grid grid-cols-7 items-center gap-2 py-1">
                  {/* Team A */}
                  <div className="col-span-3 space-y-2">
                    <div className="font-bold text-sm sm:text-base text-[var(--text-main)] truncate" title={m.teamAName}>
                      {m.teamAName}
                    </div>
                    {/* Stepper Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleQuickScore(m.id, 'A', -1)}
                        title="Kurangi 1 Poin"
                        className="w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-muted)] hover:bg-red-500/10 hover:border-red-500/30 text-[var(--text-muted)] hover:text-red-600 flex items-center justify-center transition-colors active:scale-95"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickScore(m.id, 'A', 1)}
                        title="Tambah 1 Poin"
                        className="flex-1 h-8 rounded-lg bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors active:scale-95 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Poin</span>
                      </button>
                    </div>
                  </div>

                  {/* Big Score Board */}
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="flex items-center gap-1 font-teko font-bold text-3xl sm:text-4xl tabular-nums leading-none">
                      <span
                        className={`transition-all duration-200 ${
                          scoreFlashId === `${m.id}-A` ? 'text-emerald-500 scale-125' : 'text-[var(--text-main)]'
                        }`}
                      >
                        {m.scoreA}
                      </span>
                      <span className="text-[var(--text-faint)] text-2xl font-light">-</span>
                      <span
                        className={`transition-all duration-200 ${
                          scoreFlashId === `${m.id}-B` ? 'text-emerald-500 scale-125' : 'text-[var(--text-main)]'
                        }`}
                      >
                        {m.scoreB}
                      </span>
                    </div>
                  </div>

                  {/* Team B */}
                  <div className="col-span-3 space-y-2 text-right">
                    <div className="font-bold text-sm sm:text-base text-[var(--text-main)] truncate" title={m.teamBName}>
                      {m.teamBName}
                    </div>
                    {/* Stepper Buttons */}
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleQuickScore(m.id, 'B', 1)}
                        title="Tambah 1 Poin"
                        className="flex-1 h-8 rounded-lg bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors active:scale-95 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Poin</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickScore(m.id, 'B', -1)}
                        title="Kurangi 1 Poin"
                        className="w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-muted)] hover:bg-red-500/10 hover:border-red-500/30 text-[var(--text-muted)] hover:text-red-600 flex items-center justify-center transition-colors active:scale-95"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Controls: Quick Status Cycle & Manual Override */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs">
                  {/* Status Toggle in 1-Click */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleQuickStatus(m.id, isLive ? 'COMPLETED' : 'LIVE')}
                      className={`btn-tactile px-3 py-1.5 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                        isLive
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isLive ? 'Set Selesai' : 'Set Live'}</span>
                    </button>
                  </div>

                  {/* Actions: Open Judge / Manual Override */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenLiveScoreControl) onOpenLiveScoreControl(m);
                        else alert(`Membuka monitor juri laga #${m.matchNumber}`);
                      }}
                      className="btn-tactile px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider"
                    >
                      Monitor Juri
                    </button>
                    <button
                      type="button"
                      onClick={() => setOverrideModalMatch(m)}
                      title="Edit skor angka spesifik"
                      className="btn-tactile px-2.5 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Kustom</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Manual Override Modal Component */}
      <LiveScoreOverrideModal
        isOpen={Boolean(overrideModalMatch)}
        match={overrideModalMatch}
        onClose={() => setOverrideModalMatch(null)}
        onSave={handleSaveModalOverride}
      />
    </div>
  );
};
