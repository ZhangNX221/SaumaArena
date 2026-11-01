'use client';

import React, { useState } from 'react';
import { Trophy, Medal, GitBranch, Layers } from 'lucide-react';
import {
  BracketMatch,
  BracketSize,
  STORAGE_KEY_BRACKET_SIZE,
  ROUND_OF_24,
  ROUND_OF_16,
  QUARTER_FINALS,
  SEMI_FINALS,
  GRAND_FINAL,
  BRONZE_MATCH,
} from '@/mocks/bracketData';
import { initialTeams } from '@/mocks/tournamentData';
import { SportCode } from '@/types';
import { PublicPageHeader } from '../layout/PublicPageHeader';
import { usePersistentState } from '@/hooks/usePersistentState';
import { PublicBracketMatchCard } from './bracket/PublicBracketMatchCard';
import { PublicGrandFinalCard } from './bracket/PublicGrandFinalCard';
import { PublicBracketTree } from './bracket/PublicBracketTree';

interface BracketTabProps {
  sportCode?: SportCode;
}

type StageFilter = 'ALL' | 'R24' | 'R16' | 'QF' | 'SF' | 'FINAL';
type ViewMode = 'TREE' | 'LIST';

export const BracketTab: React.FC<BracketTabProps> = ({ sportCode = 'FUTSAL' }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('TREE');
  const [activeStageFilter, setActiveStageFilter] = useState<StageFilter>('ALL');

  // Akses state tersinkronisasi bagan dari Admin & Meja Juri
  const [bracketSize] = usePersistentState<BracketSize>(STORAGE_KEY_BRACKET_SIZE, 8);
  const [r24] = usePersistentState<BracketMatch[]>('sauma_arena_bracket_r24', ROUND_OF_24);
  const [r16] = usePersistentState<BracketMatch[]>('sauma_arena_bracket_r16', ROUND_OF_16);
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
    : 'MENUNGGU PEMENANG LAGA FINAL (P17)';

  // Stage filters matching current bracket size (untuk mode Daftar)
  const stageFilters: { id: StageFilter; label: string }[] = [
    ...(bracketSize > 2 ? [{ id: 'ALL' as StageFilter, label: 'Semua Babak' }] : []),
    ...(bracketSize >= 24 ? [{ id: 'R24' as StageFilter, label: 'Playoff 24' }] : []),
    ...(bracketSize >= 16 ? [{ id: 'R16' as StageFilter, label: '16 Besar' }] : []),
    ...(bracketSize >= 8 ? [{ id: 'QF' as StageFilter, label: '8 Besar (QF)' }] : []),
    ...(bracketSize >= 4 ? [{ id: 'SF' as StageFilter, label: 'Semifinal (SF)' }] : []),
    { id: 'FINAL' as StageFilter, label: 'Grand Final & Bronze' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-6">
      {/* Public Page Header */}
      <PublicPageHeader
        icon={GitBranch}
        category={`FASE GUGUR • ${caborLabel.toUpperCase()}`}
        title="Bagan Gugur &amp; Fase Eliminasi"
        description={`Alur gugur eliminasi babak ${bracketSize} besar, semifinal, hingga partai puncak turnamen ${caborLabel}.`}
      />

      {/* Notice Bagan Tersinkronisasi */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <GitBranch className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="font-barlow font-bold uppercase tracking-wide text-[var(--text-main)] block">
              Bagan Fase Eliminasi &bull; Tersinkron Real-Time dengan Meja Wasit &amp; Panitia
            </span>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed font-sans">
              Format bagan aktif: <strong>{bracketSize} Besar</strong>. Diperbarui langsung oleh panitia &amp; juri turnamen.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex px-2.5 py-1 rounded-lg bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] font-barlow font-bold text-xs uppercase tracking-wider shrink-0">
          {bracketSize} Besar
        </span>
      </div>

      {/* View Mode Toggle: Bagan Pohon (Interaktif + Zoom) vs Daftar Babak */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('TREE')}
            className={`btn-tactile px-3.5 sm:px-4 py-2 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs transition-all cursor-pointer flex items-center gap-1.5 min-h-[36px] ${
              viewMode === 'TREE'
                ? 'bg-[#0284c7] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Bagan Pohon (Tree)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('LIST')}
            className={`btn-tactile px-3.5 sm:px-4 py-2 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs transition-all cursor-pointer flex items-center gap-1.5 min-h-[36px] ${
              viewMode === 'LIST'
                ? 'bg-[#0284c7] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Daftar Babak</span>
          </button>
        </div>

        {/* Filter Babak (khusus jika memilih mode Daftar Babak) */}
        {viewMode === 'LIST' && (
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold overflow-x-auto w-full sm:w-auto">
            {stageFilters.map((stage) => {
              const isActive = activeStageFilter === stage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStageFilter(stage.id)}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs transition-all cursor-pointer min-h-[32px] whitespace-nowrap ${
                    isActive
                      ? stage.id === 'FINAL'
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-[#0284c7] text-white shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {stage.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 1. MODE BAGAN POHON INTERAKTIF (Tampilan Penuh dengan Fitur Zoom In/Out - Mobile & Desktop) */}
      {viewMode === 'TREE' && (
        <PublicBracketTree
          bracketSize={bracketSize}
          qf={qf}
          sf={sf}
          gf={gf}
          championTeamName={championTeamName}
          bronzeMatch={BRONZE_MATCH}
        />
      )}

      {/* 2. MODE DAFTAR BABAK (Opsional / Card List View) */}
      {viewMode === 'LIST' && (
        <div className="bg-[#060c18] border border-sky-950/90 rounded-2xl p-4 sm:p-6 space-y-6 shadow-xl">
          {/* R24 */}
          {bracketSize >= 24 && (activeStageFilter === 'ALL' || activeStageFilter === 'R24') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-barlow font-black text-sm uppercase tracking-wide text-white">
                  Playoff 24 Besar
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-700 bg-slate-900 text-slate-300">
                  {r24.length} Laga
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {r24.map((m) => (
                  <PublicBracketMatchCard key={m.id} match={m} />
                ))}
              </div>
            </div>
          )}

          {/* R16 */}
          {bracketSize >= 16 && (activeStageFilter === 'ALL' || activeStageFilter === 'R16') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-barlow font-black text-sm uppercase tracking-wide text-white">
                  16 Besar (Perdelapan Final)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-700 bg-slate-900 text-slate-300">
                  {r16.length} Laga
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {r16.map((m) => (
                  <PublicBracketMatchCard key={m.id} match={m} />
                ))}
              </div>
            </div>
          )}

          {/* QF */}
          {bracketSize >= 8 && (activeStageFilter === 'ALL' || activeStageFilter === 'QF') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-barlow font-black text-sm uppercase tracking-wide text-white">
                  8 Besar (Perempat Final)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-700 bg-slate-900 text-slate-300">
                  {qf.length} Laga
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {qf.map((m) => (
                  <PublicBracketMatchCard key={m.id} match={m} />
                ))}
              </div>
            </div>
          )}

          {/* SF */}
          {bracketSize >= 4 && (activeStageFilter === 'ALL' || activeStageFilter === 'SF') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-barlow font-black text-sm uppercase tracking-wide text-sky-400">
                  Babak Semifinal
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-sky-800 bg-sky-950/80 text-sky-300">
                  {sf.length} Laga
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sf.map((m) => (
                  <PublicBracketMatchCard key={m.id} match={m} isHighlighted={true} />
                ))}
              </div>
            </div>
          )}

          {/* Final & Bronze */}
          {(activeStageFilter === 'ALL' || activeStageFilter === 'FINAL') && (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-barlow font-black text-sm uppercase tracking-wide text-sky-400 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4" />
                    <span>Grand Final</span>
                  </span>
                  <span className="text-[11px] font-barlow font-bold uppercase tracking-wider text-sky-400/80">
                    Perebutan Juara 1
                  </span>
                </div>
                <div className="max-w-xl mx-auto">
                  <PublicGrandFinalCard gf={gf} championTeamName={championTeamName} />
                </div>
              </div>

              {/* Bronze */}
              <div className="space-y-2 pt-2 max-w-xl mx-auto">
                <div className="flex items-center gap-1.5 text-xs font-barlow font-bold uppercase tracking-wider text-amber-400">
                  <Medal className="w-4 h-4" />
                  <span>Perebutan Juara 3</span>
                </div>
                <PublicBracketMatchCard match={BRONZE_MATCH} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
