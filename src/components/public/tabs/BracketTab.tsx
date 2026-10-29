'use client';

import React, { useState } from 'react';
import { Trophy, ShieldCheck, Crown, Medal, Check, GitBranch } from 'lucide-react';
import { getTeamLogoUrl } from '@/mocks/teamLogos';
import {
  BracketMatch,
  QUARTER_FINALS,
  SEMI_FINALS,
  GRAND_FINAL,
  BRONZE_MATCH,
} from '@/mocks/bracketData';
import { initialTeams } from '@/mocks/tournamentData';
import { SportCode } from '@/types';
import { PublicPageHeader } from '../layout/PublicPageHeader';
import { usePersistentState } from '@/hooks/usePersistentState';

interface BracketTabProps {
  sportCode?: SportCode;
}

type StageFilter = 'ALL' | 'QF' | 'SF' | 'FINAL';

export const BracketTab: React.FC<BracketTabProps> = ({ sportCode = 'FUTSAL' }) => {
  const [activeStageFilter, setActiveStageFilter] = useState<StageFilter>('ALL');

  // Akses state tersinkronisasi bagan dari Admin & Meja Juri
  const [qf] = usePersistentState<BracketMatch[]>('sauma_arena_bracket_qf', QUARTER_FINALS);
  const [sf] = usePersistentState<BracketMatch[]>('sauma_arena_bracket_sf', SEMI_FINALS);
  const [gf] = usePersistentState<BracketMatch>('sauma_arena_bracket_gf', GRAND_FINAL);
  const [championId] = usePersistentState<string>('sauma_arena_bracket_champ', '');

  const caborLabel = 'Futsal';

  const championTeam = initialTeams.find((t) => t.id === championId);
  const championTeamName = championTeam
    ? `${championTeam.name} (${championTeam.schoolName || ''})`
    : gf.teamA.isWinner
    ? gf.teamA.name
    : gf.teamB.isWinner
    ? gf.teamB.name
    : 'Menunggu Pemenang Laga Final (P17)';

  const renderMatchCard = (m: BracketMatch, isHighlighted = false) => (
    <div
      key={m.id}
      className={`w-full rounded-lg border-2 transition-all duration-150 shadow-xs overflow-hidden ${
        isHighlighted
          ? 'bg-[var(--bg-surface)] border-[var(--color-arena-accent)] ring-1 ring-[var(--color-arena-accent)]/30'
          : 'bg-[var(--bg-surface)] border-slate-300 dark:border-slate-800 hover:border-[#1D63B8]/60'
      }`}
    >
      <div className="px-3 py-1.5 bg-[var(--bg-muted)]/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono">
        <span className="font-bold text-[#1D63B8] dark:text-sky-300">
          {m.stageCode}
        </span>
        <span className="text-[var(--text-muted)] truncate max-w-[140px]">{m.schedule}</span>
      </div>

      <div className="p-2 space-y-1 text-xs">
        <div
          className={`flex items-center justify-between px-2 py-1.5 rounded-md transition-colors ${
            m.teamA.isWinner
              ? 'bg-emerald-500/10 text-[var(--text-main)] font-extrabold'
              : 'text-[var(--text-muted)] font-medium'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {m.teamA.id.startsWith('tbd') ? (
              <div className="w-5 h-5 rounded-xs bg-[var(--bg-muted)] border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] text-[var(--text-muted)] shrink-0 font-mono font-bold">
                -
              </div>
            ) : (
              <img
                src={getTeamLogoUrl(m.teamA.id)}
                alt={m.teamA.name}
                className="w-5 h-5 object-contain shrink-0 rounded-xs"
              />
            )}
            <span className="truncate">{m.teamA.name}</span>
          </div>
          <span
            className={`font-teko font-bold text-lg tabular-nums leading-none ${
              m.teamA.isWinner ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[var(--text-muted)]'
            }`}
          >
            {m.status === 'COMPLETED' ? m.teamA.score : '-'}
          </span>
        </div>

        <div
          className={`flex items-center justify-between px-2 py-1.5 rounded-md transition-colors ${
            m.teamB.isWinner
              ? 'bg-emerald-500/10 text-[var(--text-main)] font-extrabold'
              : 'text-[var(--text-muted)] font-medium'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {m.teamB.id.startsWith('tbd') ? (
              <div className="w-5 h-5 rounded-xs bg-[var(--bg-muted)] border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] text-[var(--text-muted)] shrink-0 font-mono font-bold">
                -
              </div>
            ) : (
              <img
                src={getTeamLogoUrl(m.teamB.id)}
                alt={m.teamB.name}
                className="w-5 h-5 object-contain shrink-0 rounded-xs"
              />
            )}
            <span className="truncate">{m.teamB.name}</span>
          </div>
          <span
            className={`font-teko font-bold text-lg tabular-nums leading-none ${
              m.teamB.isWinner ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[var(--text-muted)]'
            }`}
          >
            {m.status === 'COMPLETED' ? m.teamB.score : '-'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-6">
      {/* Public Page Header */}
      <PublicPageHeader
        icon={GitBranch}
        category={`FASE GUGUR • ${caborLabel.toUpperCase()}`}
        title="Bagan Gugur &amp; Fase Eliminasi"
        description={`Alur gugur tunggal babak perempat final, semifinal, hingga laga penentuan juara utama turnamen ${caborLabel}.`}
      />

      {/* Notice Bagan Tersinkronisasi */}
      <div className="p-4 rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 flex items-start sm:items-center gap-3 text-xs shadow-xs">
        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <GitBranch className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <span className="font-barlow font-bold uppercase tracking-wide text-[var(--text-main)] block">
            Bagan Fase Eliminasi &bull; Tersinkron Real-Time dengan Meja Wasit &amp; Panitia
          </span>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed font-sans">
            Slot babak perempat final (8 besar), semifinal (4 besar), dan partai final diperbarui langsung oleh panitia &amp; juri turnamen MMFC I.
          </p>
        </div>
      </div>

      {/* Stage Selector Filter */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-muted)] border-2 border-slate-300 dark:border-slate-800 text-xs font-semibold w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'Semua Babak' },
            { id: 'QF', label: '8 Besar (QF)' },
            { id: 'SF', label: 'Semifinal (SF)' },
            { id: 'FINAL', label: 'Grand Final & Bronze' },
          ].map((stage) => {
            const isActive = activeStageFilter === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStageFilter(stage.id as StageFilter)}
                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-md font-barlow font-bold uppercase tracking-wider text-xs transition-all cursor-pointer min-h-[38px] ${
                  isActive
                    ? stage.id === 'FINAL'
                      ? 'bg-[var(--color-arena-accent)] text-slate-950 shadow-xs'
                      : 'bg-[#1D63B8] text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/50 dark:hover:bg-slate-800'
                }`}
              >
                {stage.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. ADAPTIVE MOBILE ROUND VIEW */}
      <div className="block sm:hidden space-y-6">
        {/* QF Section */}
        {(activeStageFilter === 'ALL' || activeStageFilter === 'QF') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bebas text-base uppercase tracking-wider text-[var(--text-main)]">
                Babak 8 Besar (Quarter Finals)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-muted)]">
                {qf.length} Pertandingan
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {qf.map((m) => renderMatchCard(m))}
            </div>
          </div>
        )}

        {/* SF Section */}
        {(activeStageFilter === 'ALL' || activeStageFilter === 'SF') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bebas text-base uppercase tracking-wider text-[#1D63B8] dark:text-sky-400">
                Babak Semifinal (4 Besar)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300">
                {sf.length} Pertandingan
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {sf.map((m) => renderMatchCard(m, true))}
            </div>
          </div>
        )}

        {/* FINAL & BRONZE Section */}
        {(activeStageFilter === 'ALL' || activeStageFilter === 'FINAL') && (
          <div className="space-y-4">
            {/* Grand Final Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bebas text-base uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" />
                  <span>Grand Final (Perebutan Juara 1)</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-arena-accent)] text-slate-950 font-bold">
                  Kampiun MMFC I
                </span>
              </div>
              <div className="rounded-xl border-2 border-[var(--color-arena-accent)] bg-[var(--bg-surface)] p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span>{gf.schedule}</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">CHAMPION MATCH</span>
                </div>
                <div className="space-y-2">
                  <div className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${
                    gf.teamA.isWinner
                      ? 'bg-amber-500/10 border-amber-500/30 font-bold text-[var(--text-main)]'
                      : 'bg-[var(--bg-muted)] border-slate-200 dark:border-slate-700 text-[var(--text-muted)]'
                  }`}>
                    <div className="flex items-center gap-2">
                      <img src={getTeamLogoUrl(gf.teamA.id)} alt={gf.teamA.name} className="w-5 h-5 rounded-xs object-contain" />
                      <span className="font-barlow font-bold text-sm text-[var(--text-main)]">{gf.teamA.name}</span>
                    </div>
                    <span className="font-teko font-bold text-xl text-[var(--color-arena-accent)]">{gf.status === 'COMPLETED' ? gf.teamA.score : '-'}</span>
                  </div>
                  <div className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${
                    gf.teamB.isWinner
                      ? 'bg-amber-500/10 border-amber-500/30 font-bold text-[var(--text-main)]'
                      : 'bg-[var(--bg-muted)] border-slate-200 dark:border-slate-700 text-[var(--text-muted)]'
                  }`}>
                    <div className="flex items-center gap-2">
                      <img src={getTeamLogoUrl(gf.teamB.id)} alt={gf.teamB.name} className="w-5 h-5 rounded-xs object-contain" />
                      <span className="font-barlow font-bold text-sm text-[var(--text-main)]">{gf.teamB.name}</span>
                    </div>
                    <span className="font-teko font-bold text-xl text-[var(--color-arena-accent)]">{gf.status === 'COMPLETED' ? gf.teamB.score : '-'}</span>
                  </div>
                </div>
                {/* Winner Callout */}
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Kampiun Juara MMFC I</span>
                  </div>
                  <div className="font-teko text-lg uppercase font-bold text-[var(--text-main)]">
                    {championTeamName}
                  </div>
                </div>
              </div>
            </div>

            {/* Bronze Match Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bebas text-base uppercase tracking-wider text-amber-700 dark:text-amber-500 flex items-center gap-1.5">
                  <Medal className="w-4 h-4" />
                  <span>Perebutan Juara 3 (Bronze Final)</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300">
                  Podium 3
                </span>
              </div>
              {renderMatchCard(BRONZE_MATCH)}
            </div>
          </div>
        )}
      </div>

      {/* 2. DESKTOP INTERACTIVE BRACKET (hidden sm:block) */}
      <div className="hidden sm:block overflow-x-auto pb-4">
        <div className="min-w-[960px] flex items-stretch gap-0">
          {/* KOLOM 1: BABAK 8 BESAR (QUARTER FINALS) */}
          <div
            className={`w-[240px] shrink-0 flex flex-col transition-opacity ${
              activeStageFilter !== 'ALL' && activeStageFilter !== 'QF' ? 'opacity-30' : ''
            }`}
          >
            <div className="h-[42px] flex items-center justify-between pb-3 mb-4 border-b-2 border-slate-200 dark:border-slate-800 text-xs font-black uppercase tracking-wider text-[var(--text-main)]">
              <span>8 Besar (Perempat Final)</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-muted)] border border-slate-200 dark:border-slate-800">
                {qf.length} Laga
              </span>
            </div>
            <div className="h-[480px] flex flex-col justify-between py-1">
              {qf.map((m) => (
                <div key={m.id} className="h-[90px] w-full">
                  {renderMatchCard(m)}
                </div>
              ))}
            </div>
          </div>

          {/* CONNECTOR 1: QF -> SF */}
          <div className="w-[60px] shrink-0 flex flex-col pointer-events-none">
            <div className="h-[42px] pb-3 mb-4 border-b-2 border-slate-200 dark:border-slate-800" aria-hidden="true" />
            <div className="h-[480px] relative">
              <svg
                className="w-full h-full text-[#1D63B8]/60 dark:text-sky-400/50"
                viewBox="0 0 60 480"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0,45 H 30 V 175 H 0 M 30,110 H 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="60" cy="110" r="3.5" fill="currentColor" />
                <path
                  d="M 0,305 H 30 V 435 H 0 M 30,370 H 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="60" cy="370" r="3.5" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* KOLOM 2: BABAK SEMIFINAL */}
          <div
            className={`w-[240px] shrink-0 flex flex-col transition-opacity ${
              activeStageFilter !== 'ALL' && activeStageFilter !== 'SF' ? 'opacity-30' : ''
            }`}
          >
            <div className="h-[42px] flex items-center justify-between pb-3 mb-4 border-b-2 border-slate-200 dark:border-slate-800 text-xs font-black uppercase tracking-wider text-[#1D63B8] dark:text-sky-300">
              <span>Babak Semifinal</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800">
                {sf.length} Laga
              </span>
            </div>
            <div className="h-[480px] relative">
              <div className="absolute top-[65px] w-full h-[90px]">
                {sf[0] && renderMatchCard(sf[0], true)}
              </div>
              <div className="absolute top-[325px] w-full h-[90px]">
                {sf[1] && renderMatchCard(sf[1], true)}
              </div>
            </div>
          </div>

          {/* CONNECTOR 2: SF -> GRAND FINAL */}
          <div className="w-[60px] shrink-0 flex flex-col pointer-events-none">
            <div className="h-[42px] pb-3 mb-4 border-b-2 border-slate-200 dark:border-slate-800" aria-hidden="true" />
            <div className="h-[480px] relative">
              <svg
                className="w-full h-full text-[var(--color-arena-accent)]/80"
                viewBox="0 0 60 480"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0,110 H 30 V 370 H 0 M 30,240 H 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="60" cy="240" r="4" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* KOLOM 3: GRAND FINAL */}
          <div
            className={`w-[360px] shrink-0 flex flex-col transition-opacity ${
              activeStageFilter !== 'ALL' && activeStageFilter !== 'FINAL' ? 'opacity-30' : ''
            }`}
          >
            <div className="h-[42px] flex items-center justify-between pb-3 mb-4 border-b-2 border-slate-200 dark:border-slate-800 text-xs font-black uppercase tracking-wider text-[var(--color-arena-accent)]">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>Grand Final</span>
              </span>
              <span className="text-[10px] font-mono text-[var(--color-arena-accent)]">
                Perebutan Juara 1
              </span>
            </div>
            <div className="h-[480px] relative">
              <div className="absolute top-[135px] w-full rounded-xl bg-[var(--bg-surface)] border-2 border-[var(--color-arena-accent)] shadow-md overflow-hidden space-y-3 p-4">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-700 dark:text-amber-300 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span>{gf.schedule}</span>
                  <span className="px-2 py-0.5 rounded-sm bg-[var(--color-arena-accent)] text-slate-950 font-black text-[9px] flex items-center gap-1 shadow-2xs">
                    <Trophy className="w-3 h-3" />
                    <span>CHAMPION MATCH</span>
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                    gf.teamA.isWinner
                      ? 'bg-amber-500/10 border-amber-500/30 text-[var(--text-main)] font-bold'
                      : 'bg-[var(--bg-muted)]/60 text-[var(--text-muted)] border-slate-200 dark:border-slate-700'
                  }`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        {gf.teamA.id.startsWith('tbd') ? (
                          <div className="w-6 h-6 rounded-md bg-[var(--bg-surface)] border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-[var(--text-muted)]">
                            -
                          </div>
                        ) : (
                          <img
                            src={getTeamLogoUrl(gf.teamA.id)}
                            alt={gf.teamA.name}
                            className="w-6 h-6 rounded-xs object-contain"
                          />
                        )}
                        {gf.teamA.isWinner && (
                          <Crown className="w-3.5 h-3.5 text-amber-500 absolute -top-2 -right-1.5" />
                        )}
                      </div>
                      <div className="truncate">
                        <span className="font-barlow font-bold text-sm text-[var(--text-main)] block truncate">
                          {gf.teamA.name}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {gf.teamA.isWinner ? 'Juara 1 Turnamen' : 'Finalis 1 (Pemenang P15)'}
                        </span>
                      </div>
                    </div>
                    <span className="font-teko font-bold text-xl tabular-nums leading-none text-[var(--color-arena-accent)]">
                      {gf.status === 'COMPLETED' ? gf.teamA.score : '-'}
                    </span>
                  </div>

                  <div className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                    gf.teamB.isWinner
                      ? 'bg-amber-500/10 border-amber-500/30 text-[var(--text-main)] font-bold'
                      : 'bg-[var(--bg-muted)]/60 text-[var(--text-muted)] border-slate-200 dark:border-slate-700'
                  }`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        {gf.teamB.id.startsWith('tbd') ? (
                          <div className="w-6 h-6 rounded-md bg-[var(--bg-surface)] border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-[var(--text-muted)]">
                            -
                          </div>
                        ) : (
                          <img
                            src={getTeamLogoUrl(gf.teamB.id)}
                            alt={gf.teamB.name}
                            className="w-6 h-6 rounded-xs object-contain"
                          />
                        )}
                        {gf.teamB.isWinner && (
                          <Crown className="w-3.5 h-3.5 text-amber-500 absolute -top-2 -right-1.5" />
                        )}
                      </div>
                      <div className="truncate">
                        <span className="font-barlow font-bold text-sm text-[var(--text-main)] block truncate">
                          {gf.teamB.name}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {gf.teamB.isWinner ? 'Juara 1 Turnamen' : 'Finalis 2 (Pemenang P16)'}
                        </span>
                      </div>
                    </div>
                    <span className="font-teko font-bold text-xl tabular-nums leading-none text-[var(--text-muted)]">
                      {gf.status === 'COMPLETED' ? gf.teamB.score : '-'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-center space-y-0.5">
                  <div className="text-[10px] uppercase font-barlow font-bold tracking-widest text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                    <Trophy className="w-3 h-3" />
                    <span>Kampiun Trofi Bergilir Arena</span>
                  </div>
                  <div className="text-sm font-teko font-bold uppercase tracking-wider text-[var(--text-main)] truncate">
                    {championTeamName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bronze Match Section */}
        <div className="mt-8 pt-5 border-t-2 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
              <Medal className="w-4 h-4" />
              <span>Laga Perebutan Tempat Ketiga (Bronze Final)</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-sans">
              Pertandingan penentuan medali perunggu antar semifinalis.
            </p>
          </div>

          <div className="w-full sm:w-[320px] shrink-0">
            {renderMatchCard(BRONZE_MATCH)}
          </div>
        </div>
      </div>
    </div>
  );
};
