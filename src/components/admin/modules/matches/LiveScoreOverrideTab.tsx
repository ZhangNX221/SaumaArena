'use client';

import React, { useState } from 'react';
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
import { Match, MatchStatus, SportCode, MatchLiveTelemetry } from '@/types';
import { LiveScoreOverrideModal } from './LiveScoreOverrideModal';
import { usePersistentState } from '@/hooks/usePersistentState';
import { pushMatchToBackend } from '@/lib/apiSync';

interface LiveScoreOverrideTabProps {
  selectedSport?: SportCode;
  onOpenLiveScoreControl?: (match: Match) => void;
}

export const LiveScoreOverrideTab: React.FC<LiveScoreOverrideTabProps> = ({
  onOpenLiveScoreControl,
}) => {
  // Tersinkronisasi penuh dengan Meja Juri dan Halaman Publik
  const [matches, setMatches] = usePersistentState<Match[]>('sauma_arena_matches', initialMatches);
  const [telemetryMap, setTelemetryMap] = usePersistentState<Record<string, MatchLiveTelemetry>>(
    'sauma_arena_live_telemetry',
    {}
  );

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | MatchStatus>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scoreFlashId, setScoreFlashId] = useState<string | null>(null);
  const [overrideModalMatch, setOverrideModalMatch] = useState<Match | null>(null);

  const saveMatches = (newMatches: Match[], feedbackMessage?: string, updatedMatch?: Match) => {
    setMatches(newMatches);
    if (updatedMatch) {
      pushMatchToBackend(updatedMatch);
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

    let updatedTarget: Match | undefined;
    const updated = matches.map((m) => {
      if (m.id !== matchId) return m;
      const newScoreA = team === 'A' ? Math.max(0, m.scoreA + delta) : m.scoreA;
      const newScoreB = team === 'B' ? Math.max(0, m.scoreB + delta) : m.scoreB;
      updatedTarget = {
        ...m,
        scoreA: newScoreA,
        scoreB: newScoreB,
        status: m.status === 'UPCOMING' ? ('LIVE' as MatchStatus) : m.status,
      };
      return updatedTarget;
    });

    const targetMatch = matches.find((m) => m.id === matchId);
    const teamName = team === 'A' ? targetMatch?.teamAName : targetMatch?.teamBName;
    saveMatches(updated, `Skor ${teamName} diperbarui (${delta > 0 ? '+1' : '-1'}) & tersinkron`, updatedTarget);
  };

  // 1-Click Quick Status Switcher
  const handleQuickStatus = (matchId: string, nextStatus: MatchStatus) => {
    let updatedTarget: Match | undefined;
    const updated = matches.map((m) => {
      if (m.id !== matchId) return m;
      updatedTarget = { ...m, status: nextStatus };
      return updatedTarget;
    });
    saveMatches(
      updated,
      `Status laga #${matches.find((m) => m.id === matchId)?.matchNumber} diubah ke ${nextStatus} & tersinkron ke Database`,
      updatedTarget
    );
  };

  // Quick reset to initial mock
  const handleResetData = () => {
    if (confirm('Kembalikan semua skor dan status ke data awal turnamen?')) {
      saveMatches(initialMatches, 'Data laga dikembalikan ke pengaturan awal');
    }
  };

  const handleSaveModalOverride = (newScoreA: number, newScoreB: number) => {
    if (!overrideModalMatch) return;
    let updatedTarget: Match | undefined;
    const updated = matches.map((m) => {
      if (m.id !== overrideModalMatch.id) return m;
      updatedTarget = { ...m, scoreA: newScoreA, scoreB: newScoreB };
      return updatedTarget;
    });
    saveMatches(updated, `Skor Laga #${overrideModalMatch.matchNumber} disesuaikan & tersinkron`, updatedTarget);
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
            Tersinkron Database &amp; Juri
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
            className={`btn-tactile px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-[var(--color-arena-primary)] text-white'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)]'
            }`}
          >
            Semua ({matches.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('LIVE')}
            className={`btn-tactile px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              statusFilter === 'LIVE'
                ? 'bg-red-500 text-white'
                : 'text-red-500 hover:bg-red-500/10'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>Live ({liveCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('UPCOMING')}
            className={`btn-tactile px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'UPCOMING'
                ? 'bg-slate-700 text-white'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)]'
            }`}
          >
            Terjadwal ({upcomingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('COMPLETED')}
            className={`btn-tactile px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'COMPLETED'
                ? 'bg-emerald-600 text-white'
                : 'text-emerald-600 hover:bg-emerald-500/10'
            }`}
          >
            Selesai ({completedCount})
          </button>
        </div>

        {/* Right Search & Quick Actions */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Cari tim, no. laga..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 focus:bg-[var(--bg-surface)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-arena-primary)] transition-all font-sans"
            />
          </div>

          <button
            type="button"
            onClick={handleResetData}
            title="Reset ke data awal"
            className="p-2 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-red-500 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Matches Grid Cards (Designed for Rapid Touch Operations) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full p-8 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] font-sans">
            Tidak ada pertandingan yang cocok dengan filter aktif.
          </div>
        ) : (
          filtered.map((m) => {
            const isLive = m.status === 'LIVE';
            const telemetry = telemetryMap[m.id];
            const livePeriod = telemetry?.currentPeriod || 'Babak 1';

            return (
              <div
                key={m.id}
                className={`p-4 rounded-2xl border transition-all duration-150 space-y-3.5 relative overflow-hidden bg-[var(--bg-surface)] ${
                  isLive
                    ? 'border-red-500/40 ring-1 ring-red-500/20 shadow-md shadow-red-500/5'
                    : 'border-[var(--border-subtle)] hover:border-[var(--border-subtle)]/80 shadow-xs'
                }`}
              >
                {/* Header: Match ID, Phase & Live Badge */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-muted)]">
                    <span className="font-bold text-[var(--color-arena-primary)]">#{m.matchNumber}</span>
                    <span>&bull;</span>
                    <span className="truncate max-w-[120px]">{m.courtName}</span>
                  </div>

                  {isLive ? (
                    <span className="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 font-barlow font-bold uppercase text-[9px] tracking-wider animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span>{livePeriod}</span>
                    </span>
                  ) : m.status === 'COMPLETED' ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-barlow font-bold uppercase text-[9px] tracking-wider">
                      Selesai
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-600 dark:text-slate-400 font-barlow font-bold uppercase text-[9px] tracking-wider">
                      Terjadwal
                    </span>
                  )}
                </div>

                {/* Score & Stepper Display */}
                <div className="grid grid-cols-7 items-center gap-2 py-1">
                  {/* Team A */}
                  <div className="col-span-3 space-y-2 text-left">
                    <div className="font-bold text-sm sm:text-base text-[var(--text-main)] truncate" title={m.teamAName}>
                      {m.teamAName}
                    </div>
                    {/* Stepper Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleQuickScore(m.id, 'A', 1)}
                        title="Tambah 1 Poin"
                        className="flex-1 h-8 rounded-lg bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors active:scale-95 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Poin</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickScore(m.id, 'A', -1)}
                        title="Kurangi 1 Poin"
                        className="w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-muted)] hover:bg-red-500/10 hover:border-red-500/30 text-[var(--text-muted)] hover:text-red-600 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Score Center Board */}
                  <div className="col-span-1 flex flex-col items-center justify-center">
                    <div className="font-scoreboard text-2xl sm:text-3xl font-bold flex items-center justify-center gap-1">
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
                        className="flex-1 h-8 rounded-lg bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors active:scale-95 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Poin</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickScore(m.id, 'B', -1)}
                        title="Kurangi 1 Poin"
                        className="w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-muted)] hover:bg-red-500/10 hover:border-red-500/30 text-[var(--text-muted)] hover:text-red-600 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
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
                      className={`btn-tactile px-3 py-1.5 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
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
                      className="btn-tactile px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Monitor Juri
                    </button>
                    <button
                      type="button"
                      onClick={() => setOverrideModalMatch(m)}
                      title="Edit skor angka spesifik"
                      className="btn-tactile px-2.5 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
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
