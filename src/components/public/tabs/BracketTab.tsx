'use client';

import React, { useState } from 'react';
import { Trophy, ShieldCheck, Crown, Medal, Check, Sparkles, GitBranch } from 'lucide-react';
import { getTeamLogoUrl } from '@/mocks/teamLogos';
import {
  BracketMatch,
  QUARTER_FINALS,
  SEMI_FINALS,
  GRAND_FINAL,
  BRONZE_MATCH,
} from '@/mocks/bracketData';
import { SportCode } from '@/types';

interface BracketTabProps {
  sportCode?: SportCode;
}

type StageFilter = 'ALL' | 'QF' | 'SF' | 'FINAL';

export const BracketTab: React.FC<BracketTabProps> = ({ sportCode = 'FUTSAL' }) => {
  const [activeStageFilter, setActiveStageFilter] = useState<StageFilter>('ALL');

  const caborLabel =
    sportCode === 'VOLI' ? 'Bola Voli' : sportCode === 'ESPORT' ? 'E-Sport MLBB' : 'Futsal';

  const championTeamName =
    sportCode === 'VOLI'
      ? 'Rajawali Spikers (MIN 1)'
      : sportCode === 'ESPORT'
      ? 'MIN 1 Cyber Knights'
      : 'Madrasah Ibtidaiyah Negeri 1 Kota';

  const renderMatchCard = (m: BracketMatch, isHighlighted = false) => (
    <div
      key={m.id}
      className={`w-full rounded-xl border transition-all duration-150 shadow-2xs overflow-hidden ${
        isHighlighted
          ? 'bg-[var(--bg-surface)] border-[var(--color-arena-accent)]/80 ring-1 ring-[var(--color-arena-accent)]/20'
          : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)]/50'
      }`}
    >
      <div className="px-3 py-1.5 bg-[var(--bg-muted)]/70 border-b border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono">
        <span className="font-bold text-[var(--color-arena-primary)] dark:text-sky-300">
          {m.stageCode}
        </span>
        <span className="text-[var(--text-muted)] truncate max-w-[130px]">{m.schedule}</span>
      </div>

      <div className="p-2 space-y-1 text-xs">
        <div
          className={`flex items-center justify-between px-2 py-1 rounded-lg transition-colors ${
            m.teamA.isWinner
              ? 'bg-emerald-500/10 text-[var(--text-main)] font-extrabold'
              : 'text-[var(--text-muted)] font-medium'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <img
              src={getTeamLogoUrl(m.teamA.id)}
              alt={m.teamA.name}
              className="w-4 h-4 rounded-sm object-contain shrink-0"
              loading="lazy"
            />
            <span className="truncate">{m.teamA.name}</span>
            {m.teamA.isWinner && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
          </div>
          <span
            className={`font-mono tabular-nums text-xs ${
              m.teamA.isWinner ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''
            }`}
          >
            {m.teamA.score}
          </span>
        </div>

        <div
          className={`flex items-center justify-between px-2 py-1 rounded-lg transition-colors ${
            m.teamB.isWinner
              ? 'bg-emerald-500/10 text-[var(--text-main)] font-extrabold'
              : 'text-[var(--text-muted)] font-medium'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <img
              src={getTeamLogoUrl(m.teamB.id)}
              alt={m.teamB.name}
              className="w-4 h-4 rounded-sm object-contain shrink-0"
              loading="lazy"
            />
            <span className="truncate">{m.teamB.name}</span>
            {m.teamB.isWinner && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
          </div>
          <span
            className={`font-mono tabular-nums text-xs ${
              m.teamB.isWinner ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''
            }`}
          >
            {m.teamB.score}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-6">
      {/* Public Page Header */}
      <div className="space-y-1.5 pb-2">
        <div className="flex items-center gap-2 text-[var(--color-arena-primary)]">
          <GitBranch className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[11px] font-black uppercase tracking-widest">
            FASE GUGUR &bull; {caborLabel.toUpperCase()}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
          Bagan Eliminasi Turnamen MMFC I
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Alur gugur tunggal babak perempat final, semifinal, hingga laga penentuan juara utama MMFC I {caborLabel}.
        </p>
      </div>

      {/* Mobile Stage Selector Filter */}
      <div className="sm:hidden flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold w-full">
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 'QF', label: '8 Besar' },
            { id: 'SF', label: 'Semifinal' },
            { id: 'FINAL', label: 'Final' },
          ].map((stage) => {
            const isActive = activeStageFilter === stage.id;
            const activeClass =
              stage.id === 'FINAL'
                ? 'bg-[var(--color-arena-accent)] text-slate-950 font-black shadow-2xs'
                : 'bg-[var(--bg-surface)] text-[var(--text-main)] font-bold shadow-2xs';
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStageFilter(stage.id as StageFilter)}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                  isActive ? activeClass : 'text-[var(--text-muted)]'
                }`}
              >
                {stage.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Bracket Board Container */}
      <div className="p-4 sm:p-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-x-auto shadow-xs">
        <div className="text-[11px] text-[var(--text-muted)] flex items-center justify-between pb-3 sm:hidden font-mono">
          <span>Geser horizontal untuk menelusuri bagan &rarr;</span>
        </div>

        {/* Diagram-Design Tree Board: Robust Flex Column Structure */}
        <div className="min-w-[960px] flex items-stretch select-none">
          {/* KOLOM 1: PEREMPAT FINAL */}
          <div
            className={`w-[240px] shrink-0 flex flex-col transition-opacity ${
              activeStageFilter !== 'ALL' && activeStageFilter !== 'QF' ? 'opacity-30' : ''
            }`}
          >
            {/* Stage Header 1 */}
            <div className="h-[42px] flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)] text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
              <span>Perempat Final</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-muted)]">
                4 Laga
              </span>
            </div>
            {/* 4 Quarter Final Cards (height 480px, evenly spaced) */}
            <div className="h-[480px] flex flex-col justify-between">
              <div className="h-[90px]">{renderMatchCard(QUARTER_FINALS[0])}</div>
              <div className="h-[90px]">{renderMatchCard(QUARTER_FINALS[1])}</div>
              <div className="h-[90px]">{renderMatchCard(QUARTER_FINALS[2])}</div>
              <div className="h-[90px]">{renderMatchCard(QUARTER_FINALS[3])}</div>
            </div>
          </div>

          {/* CONNECTOR 1: QF -> SF (Orthogonal Elbow Lines) */}
          <div className="w-[60px] shrink-0 flex flex-col pointer-events-none">
            {/* Continuous Header Border Spacer */}
            <div className="h-[42px] pb-3 mb-4 border-b border-[var(--border-subtle)]" aria-hidden="true" />
            {/* Full Height Connector SVG */}
            <div className="h-[480px] relative">
              <svg
                className="w-full h-full text-[var(--color-arena-primary)]/45 dark:text-sky-400/40"
                viewBox="0 0 60 480"
                preserveAspectRatio="none"
              >
                {/* Upper Fork (QF1 y=45, QF2 y=175 -> SF1 y=110) */}
                <path
                  d="M 0,45 H 30 V 175 H 0 M 30,110 H 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="60" cy="110" r="3.5" fill="currentColor" />

                {/* Lower Fork (QF3 y=305, QF4 y=435 -> SF2 y=370) */}
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
            {/* Stage Header 2 */}
            <div className="h-[42px] flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)] text-xs font-black uppercase tracking-wider text-[var(--color-arena-primary)] dark:text-sky-300">
              <span>Babak Semifinal</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] border border-[var(--border-subtle)]">
                2 Laga
              </span>
            </div>
            {/* 2 Semifinal Cards centered between QF pairs */}
            <div className="h-[480px] relative">
              <div className="absolute top-[65px] w-full h-[90px]">
                {renderMatchCard(SEMI_FINALS[0], true)}
              </div>
              <div className="absolute top-[325px] w-full h-[90px]">
                {renderMatchCard(SEMI_FINALS[1], true)}
              </div>
            </div>
          </div>

          {/* CONNECTOR 2: SF -> GRAND FINAL (Orthogonal Gold Elbow) */}
          <div className="w-[60px] shrink-0 flex flex-col pointer-events-none">
            {/* Continuous Header Border Spacer */}
            <div className="h-[42px] pb-3 mb-4 border-b border-[var(--border-subtle)]" aria-hidden="true" />
            {/* Full Height Connector SVG */}
            <div className="h-[480px] relative">
              <svg
                className="w-full h-full text-[var(--color-arena-accent)]/80"
                viewBox="0 0 60 480"
                preserveAspectRatio="none"
              >
                {/* Merging Fork (SF1 y=110, SF2 y=370 -> Final y=240) */}
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
            {/* Stage Header 3 */}
            <div className="h-[42px] flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)] text-xs font-black uppercase tracking-wider text-[var(--color-arena-accent)]">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>Grand Final</span>
              </span>
              <span className="text-[10px] font-mono text-[var(--color-arena-accent)]">
                Perebutan Juara 1
              </span>
            </div>
            {/* Grand Final Champion Card (Centered at Y=240, top=135px) */}
            <div className="h-[480px] relative">
              <div className="absolute top-[135px] w-full rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--color-arena-accent)] shadow-md overflow-hidden space-y-3 p-4">
                {/* Champion Match Badge Header */}
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-700 dark:text-amber-300 pb-2 border-b border-[var(--border-subtle)]">
                  <span>{GRAND_FINAL.schedule}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--color-arena-accent)] text-slate-950 font-black text-[9px] flex items-center gap-1 shadow-2xs">
                    <Sparkles className="w-3 h-3" />
                    <span>CHAMPION MATCH</span>
                  </span>
                </div>

                {/* Finalists Rows */}
                <div className="space-y-2 text-xs">
                  {/* Champion (Winner) */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[var(--text-main)]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={getTeamLogoUrl(GRAND_FINAL.teamA.id)}
                          alt={GRAND_FINAL.teamA.name}
                          className="w-6 h-6 rounded-md object-contain"
                        />
                        <Crown className="w-3.5 h-3.5 text-amber-500 absolute -top-2 -right-1.5" />
                      </div>
                      <div className="truncate">
                        <span className="font-black text-xs block truncate">
                          {GRAND_FINAL.teamA.name}
                        </span>
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                          Juara 1 Turnamen
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-black text-base text-amber-600 dark:text-amber-400 tabular-nums">
                      {GRAND_FINAL.teamA.score}
                    </span>
                  </div>

                  {/* Runner Up */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-muted)]/60 text-[var(--text-muted)] border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={getTeamLogoUrl(GRAND_FINAL.teamB.id)}
                        alt={GRAND_FINAL.teamB.name}
                        className="w-5 h-5 rounded-md object-contain shrink-0"
                      />
                      <div className="truncate">
                        <span className="font-bold text-xs text-[var(--text-main)] block truncate">
                          {GRAND_FINAL.teamB.name}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          Runner-Up (Juara 2)
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-sm tabular-nums">
                      {GRAND_FINAL.teamB.score}
                    </span>
                  </div>
                </div>

                {/* Trophy Winner Callout Banner */}
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-0.5">
                  <div className="text-[10px] uppercase font-black tracking-widest text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                    <Trophy className="w-3 h-3" />
                    <span>Kampiun Trofi Bergilir MMFC I</span>
                  </div>
                  <div className="text-xs font-black text-[var(--text-main)] font-[var(--font-display)] truncate">
                    {championTeamName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bronze Match Section (Perebutan Juara 3) */}
        <div className="mt-8 pt-5 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
              <Medal className="w-4 h-4" />
              <span>Laga Perebutan Tempat Ketiga (Bronze Final)</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
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
