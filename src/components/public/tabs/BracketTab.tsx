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
import { SportCode } from '@/types';
import { PublicPageHeader } from '../layout/PublicPageHeader';

interface BracketTabProps {
  sportCode?: SportCode;
}

type StageFilter = 'ALL' | 'QF' | 'SF' | 'FINAL';

export const BracketTab: React.FC<BracketTabProps> = ({ sportCode = 'FUTSAL' }) => {
  const [activeStageFilter, setActiveStageFilter] = useState<StageFilter>('ALL');

  const caborLabel = 'Futsal';
  const championTeamName = 'Menunggu Pemenang Laga Final (P17)';

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
            {m.teamA.id.startsWith('tbd') ? (
              <div className="w-4 h-4 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-center text-[9px] text-[var(--text-muted)] shrink-0 font-mono font-bold">
                -
              </div>
            ) : (
              <img
                src={getTeamLogoUrl(m.teamA.id)}
                alt={m.teamA.name}
                className="w-4 h-4 rounded-sm object-contain shrink-0"
                loading="lazy"
              />
            )}
            <span className="truncate font-barlow font-bold text-sm tracking-wide">{m.teamA.name}</span>
            {m.teamA.isWinner && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
          </div>
          <span
            className={`font-teko font-bold text-base tabular-nums leading-none ${
              m.teamA.isWinner ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[var(--text-muted)]'
            }`}
          >
            {m.status === 'COMPLETED' ? m.teamA.score : '-'}
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
            {m.teamB.id.startsWith('tbd') ? (
              <div className="w-4 h-4 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-center text-[9px] text-[var(--text-muted)] shrink-0 font-mono font-bold">
                -
              </div>
            ) : (
              <img
                src={getTeamLogoUrl(m.teamB.id)}
                alt={m.teamB.name}
                className="w-4 h-4 rounded-sm object-contain shrink-0"
                loading="lazy"
              />
            )}
            <span className="truncate font-barlow font-bold text-sm tracking-wide">{m.teamB.name}</span>
            {m.teamB.isWinner && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
          </div>
          <span
            className={`font-teko font-bold text-base tabular-nums leading-none ${
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

      {/* Notice Bagan Menunggu Rekapitulasi Grup */}
      <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-start sm:items-center gap-3 text-xs shadow-xs">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <GitBranch className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <span className="font-barlow font-bold uppercase tracking-wide text-[var(--text-main)] block">
            Bagan Fase Eliminasi &bull; Diisi Sesuai Rekapitulasi Klasemen Grup
          </span>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            Slot babak semifinal (4 besar) dan final saat ini dikosongkan dan akan diperbarui oleh juri/panitia setelah babak penyisihan 4 grup (A, B, C, D) selesai dipertandingkan pada Hari ke-2 turnamen.
          </p>
        </div>
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
              <span>Slot Juara Grup</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-muted)]">
                4 Grup (A-D)
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
                    <Trophy className="w-3 h-3" />
                    <span>CHAMPION MATCH</span>
                  </span>
                </div>

                {/* Finalists Rows */}
                <div className="space-y-2 text-xs">
                  {/* Finalist A */}
                  <div className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                    GRAND_FINAL.teamA.isWinner
                      ? 'bg-amber-500/10 border-amber-500/25 text-[var(--text-main)]'
                      : 'bg-[var(--bg-muted)]/60 text-[var(--text-muted)] border-[var(--border-subtle)]'
                  }`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        {GRAND_FINAL.teamA.id.startsWith('tbd') ? (
                          <div className="w-6 h-6 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-xs font-mono font-bold text-[var(--text-muted)]">
                            -
                          </div>
                        ) : (
                          <img
                            src={getTeamLogoUrl(GRAND_FINAL.teamA.id)}
                            alt={GRAND_FINAL.teamA.name}
                            className="w-6 h-6 rounded-md object-contain"
                          />
                        )}
                        {GRAND_FINAL.teamA.isWinner && (
                          <Crown className="w-3.5 h-3.5 text-amber-500 absolute -top-2 -right-1.5" />
                        )}
                      </div>
                      <div className="truncate">
                        <span className="font-barlow font-bold text-sm block truncate text-[var(--text-main)]">
                          {GRAND_FINAL.teamA.name}
                        </span>
                        <span className="text-[10px] font-bold text-[var(--text-muted)]">
                          {GRAND_FINAL.teamA.isWinner ? 'Juara 1 Turnamen' : 'Finalis 1 (Pemenang P15)'}
                        </span>
                      </div>
                    </div>
                    <span className="font-teko font-bold text-2xl text-[var(--color-arena-accent)] tabular-nums leading-none">
                      {GRAND_FINAL.status === 'COMPLETED' ? GRAND_FINAL.teamA.score : '-'}
                    </span>
                  </div>

                  {/* Finalist B */}
                  <div className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                    GRAND_FINAL.teamB.isWinner
                      ? 'bg-amber-500/10 border-amber-500/25 text-[var(--text-main)]'
                      : 'bg-[var(--bg-muted)]/60 text-[var(--text-muted)] border-[var(--border-subtle)]'
                  }`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        {GRAND_FINAL.teamB.id.startsWith('tbd') ? (
                          <div className="w-6 h-6 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-xs font-mono font-bold text-[var(--text-muted)]">
                            -
                          </div>
                        ) : (
                          <img
                            src={getTeamLogoUrl(GRAND_FINAL.teamB.id)}
                            alt={GRAND_FINAL.teamB.name}
                            className="w-5 h-5 rounded-md object-contain shrink-0"
                          />
                        )}
                        {GRAND_FINAL.teamB.isWinner && (
                          <Crown className="w-3.5 h-3.5 text-amber-500 absolute -top-2 -right-1.5" />
                        )}
                      </div>
                      <div className="truncate">
                        <span className="font-barlow font-bold text-sm text-[var(--text-main)] block truncate">
                          {GRAND_FINAL.teamB.name}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {GRAND_FINAL.teamB.isWinner ? 'Juara 1 Turnamen' : 'Finalis 2 (Pemenang P16)'}
                        </span>
                      </div>
                    </div>
                    <span className="font-teko font-bold text-xl tabular-nums leading-none text-[var(--text-muted)]">
                      {GRAND_FINAL.status === 'COMPLETED' ? GRAND_FINAL.teamB.score : '-'}
                    </span>
                  </div>
                </div>

                {/* Trophy Winner Callout Banner */}
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-0.5">
                  <div className="text-[10px] uppercase font-black tracking-widest text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
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
