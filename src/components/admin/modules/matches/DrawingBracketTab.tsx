'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, RotateCcw, Save, Crown, Sparkles } from 'lucide-react';
import {
  QUARTER_FINALS,
  SEMI_FINALS,
  GRAND_FINAL,
  ROUND_OF_16,
  ROUND_OF_24,
  BRONZE_MATCH,
  BracketMatch,
  BracketSize,
  STORAGE_KEY_BRACKET_SIZE,
  STORAGE_KEY_HAS_BRONZE_MATCH,
} from '@/mocks/bracketData';
import { initialTeams, initialMatches } from '@/mocks/tournamentData';
import { REFEREE_DUTIES } from '@/mocks/multiSportData';
import { Match, RefereeMatchDuty } from '@/types';
import { usePersistentState } from '@/hooks/usePersistentState';
import { BracketStageKey } from './BracketMatchCard';
import { BracketPodiumCard } from './BracketPodiumCard';
import { BracketMatchEditModal } from './BracketMatchEditModal';
import { DrawingBracketTree } from './DrawingBracketTree';
import {
  getAutoFillSemifinals,
  syncBracketToMatchesAndDuties,
  reconcileMatchesToBracket,
} from '@/lib/bracketSync';

type StageFilter = 'ALL' | 'R24' | 'R16' | 'QF' | 'SF' | 'FINAL';

export const DrawingBracketTab: React.FC = () => {
  const [bracketSize] = usePersistentState<BracketSize>(STORAGE_KEY_BRACKET_SIZE, 4);
  const [hasBronzeMatch] = usePersistentState<boolean>(STORAGE_KEY_HAS_BRONZE_MATCH, true);
  const [r24, setR24] = usePersistentState<BracketMatch[]>('sauma_arena_bracket_r24', ROUND_OF_24);
  const [r16, setR16] = usePersistentState<BracketMatch[]>('sauma_arena_bracket_r16', ROUND_OF_16);
  const [qf, setQf] = usePersistentState<BracketMatch[]>('sauma_arena_bracket_qf', QUARTER_FINALS);
  const [sf, setSf] = usePersistentState<BracketMatch[]>('sauma_arena_bracket_sf', SEMI_FINALS);
  const [gf, setGf] = usePersistentState<BracketMatch>('sauma_arena_bracket_gf', GRAND_FINAL);
  const [bronze, setBronze] = usePersistentState<BracketMatch>('sauma_arena_bracket_bronze', BRONZE_MATCH);

  // Status Sinkronisasi Jadwal Pertandingan & Meja Juri
  const [matches, setMatches] = usePersistentState<Match[]>('sauma_arena_matches', initialMatches);
  const [duties, setDuties] = usePersistentState<RefereeMatchDuty[]>('sauma_arena_duties', REFEREE_DUTIES);

  // Status Podium Juara & Filter
  const [championId, setChampionId] = usePersistentState<string>('sauma_arena_bracket_champ', '');
  const [runnerUpId, setRunnerUpId] = usePersistentState<string>('sauma_arena_bracket_runner', '');
  const [thirdPlaceId, setThirdPlaceId] = usePersistentState<string>('sauma_arena_bracket_third', '');
  const [notice, setNotice] = useState<string | null>(null);
  const [activeStageFilter, setActiveStageFilter] = useState<StageFilter>('ALL');
  const [editModalMatch, setEditModalMatch] = useState<{ node: BracketMatch; stage: BracketStageKey } | null>(null);

  // Rekonsiliasi dua arah dari matches (data juri / hasil laga) ke bagan
  useEffect(() => {
    const { updatedSf, updatedGf, hasDiff, championId: newChamp } = reconcileMatchesToBracket(matches, sf, gf);
    if (hasDiff) {
      setSf(updatedSf);
      setGf(updatedGf);
      if (newChamp && !championId) setChampionId(newChamp);
    }
  }, [matches]);

  const championTeam = initialTeams.find((t) => t.id === championId);
  const championTeamName = championTeam
    ? `${championTeam.name} (${championTeam.schoolName || ''})`
    : gf.teamA.isWinner
    ? gf.teamA.name
    : gf.teamB.isWinner
    ? gf.teamB.name
    : 'MENUNGGU PEMENANG LAGA FINAL (P17)';

  const handleTeamChange = (stage: BracketStageKey, matchId: string, slot: 'teamA' | 'teamB', teamId: string) => {
    const selected = initialTeams.find((t) => t.id === teamId);
    const newTeam = selected
      ? { id: selected.id, name: selected.name, score: 0, isWinner: false }
      : { id: `tbd-${matchId}-${slot}`, name: `Menunggu Pemenang (${slot.toUpperCase()})`, score: 0, isWinner: false };

    if (stage === 'SF') {
      const idx = sf.findIndex((m) => m.id === matchId);
      const updatedSf = sf.map((m) => (m.id === matchId ? { ...m, [slot]: newTeam, status: 'SCHEDULED' as const } : m));
      setSf(updatedSf);
      if (idx !== -1) {
        const res = syncBracketToMatchesAndDuties(idx === 0 ? 15 : 16, updatedSf[idx].teamA, updatedSf[idx].teamB, matches, duties);
        setMatches(res.updatedMatches); setDuties(res.updatedDuties);
      }
    } else if (stage === 'GF') {
      const nextGf = { ...gf, [slot]: newTeam, status: 'SCHEDULED' as const };
      setGf(nextGf);
      const res = syncBracketToMatchesAndDuties(17, nextGf.teamA, nextGf.teamB, matches, duties);
      setMatches(res.updatedMatches); setDuties(res.updatedDuties);
    } else if (stage === 'QF') {
      setQf((prev) => prev.map((m) => (m.id === matchId ? { ...m, [slot]: newTeam, status: 'SCHEDULED' } : m)));
    } else if (stage === 'R16') {
      setR16((prev) => prev.map((m) => (m.id === matchId ? { ...m, [slot]: newTeam, status: 'SCHEDULED' } : m)));
    } else if (stage === 'R24') {
      setR24((prev) => prev.map((m) => (m.id === matchId ? { ...m, [slot]: newTeam, status: 'SCHEDULED' } : m)));
    } else {
      setBronze((prev) => ({ ...prev, [slot]: newTeam, status: 'SCHEDULED' }));
    }
  };

  const handleScoreChange = (stage: BracketStageKey, matchId: string, slot: 'teamA' | 'teamB', score: number) => {
    const safeScore = Math.max(0, score);
    if (stage === 'SF') {
      const idx = sf.findIndex((m) => m.id === matchId);
      const updatedSf = sf.map((m) => (m.id === matchId ? { ...m, [slot]: { ...m[slot], score: safeScore } } : m));
      setSf(updatedSf);
      if (idx !== -1) {
        const res = syncBracketToMatchesAndDuties(idx === 0 ? 15 : 16, updatedSf[idx].teamA, updatedSf[idx].teamB, matches, duties);
        setMatches(res.updatedMatches); setDuties(res.updatedDuties);
      }
    } else if (stage === 'GF') {
      const nextGf = { ...gf, [slot]: { ...gf[slot], score: safeScore } };
      setGf(nextGf);
      const res = syncBracketToMatchesAndDuties(17, nextGf.teamA, nextGf.teamB, matches, duties);
      setMatches(res.updatedMatches); setDuties(res.updatedDuties);
    } else if (stage === 'QF') {
      setQf((prev) => prev.map((m) => (m.id === matchId ? { ...m, [slot]: { ...m[slot], score: safeScore } } : m)));
    } else if (stage === 'R16') {
      setR16((prev) => prev.map((m) => (m.id === matchId ? { ...m, [slot]: { ...m[slot], score: safeScore } } : m)));
    } else if (stage === 'R24') {
      setR24((prev) => prev.map((m) => (m.id === matchId ? { ...m, [slot]: { ...m[slot], score: safeScore } } : m)));
    } else {
      setBronze((prev) => ({ ...prev, [slot]: { ...prev[slot], score: safeScore } }));
    }
  };

  const handleSetWinner = (stage: BracketStageKey, matchId: string, winnerSlot: 'teamA' | 'teamB') => {
    if (stage === 'SF') {
      const idx = sf.findIndex((m) => m.id === matchId);
      if (idx === -1) return;
      const winner = winnerSlot === 'teamA' ? sf[idx].teamA : sf[idx].teamB;
      const loser = winnerSlot === 'teamA' ? sf[idx].teamB : sf[idx].teamA;
      const updatedSf = sf.map((m, i) => (i === idx ? { ...m, status: 'COMPLETED' as const, teamA: { ...m.teamA, isWinner: winnerSlot === 'teamA' }, teamB: { ...m.teamB, isWinner: winnerSlot === 'teamB' } } : m));
      setSf(updatedSf);

      let syncRes = syncBracketToMatchesAndDuties(idx === 0 ? 15 : 16, updatedSf[idx].teamA, updatedSf[idx].teamB, matches, duties, { status: 'COMPLETED', winnerSlot });
      const nextGf: BracketMatch = { ...gf, [idx === 0 ? 'teamA' : 'teamB']: { ...winner, isWinner: false, score: 0 } };
      setGf(nextGf);

      syncRes = syncBracketToMatchesAndDuties(17, nextGf.teamA, nextGf.teamB, syncRes.updatedMatches, syncRes.updatedDuties);
      setMatches(syncRes.updatedMatches); setDuties(syncRes.updatedDuties);
      setBronze((prev) => ({ ...prev, [idx === 0 ? 'teamA' : 'teamB']: { ...loser, isWinner: false, score: 0 } }));
      if (!thirdPlaceId && loser.id && !loser.id.startsWith('tbd')) setThirdPlaceId(loser.id);
      setNotice(`Pemenang ${sf[idx].stageName} lolos ke Grand Final: ${winner.name}! Data tersinkron ke jadwal.`);
    } else if (stage === 'GF') {
      const winner = winnerSlot === 'teamA' ? gf.teamA : gf.teamB;
      const runnerUp = winnerSlot === 'teamA' ? gf.teamB : gf.teamA;
      const completedGf: BracketMatch = { ...gf, status: 'COMPLETED' as const, teamA: { ...gf.teamA, isWinner: winnerSlot === 'teamA' }, teamB: { ...gf.teamB, isWinner: winnerSlot === 'teamB' } };
      setGf(completedGf);

      const syncRes = syncBracketToMatchesAndDuties(17, completedGf.teamA, completedGf.teamB, matches, duties, { status: 'COMPLETED', winnerSlot });
      setMatches(syncRes.updatedMatches); setDuties(syncRes.updatedDuties);
      if (winner.id && !winner.id.startsWith('tbd')) setChampionId(winner.id);
      if (runnerUp.id && !runnerUp.id.startsWith('tbd')) setRunnerUpId(runnerUp.id);
      setNotice(`Selamat! ${winner.name} resmi ditetapkan sebagai JUARA 1 turnamen! 🏆 Hasil tersinkron ke publik.`);
    } else if (stage === 'QF') {
      const idx = qf.findIndex((m) => m.id === matchId);
      if (idx === -1) return;
      const winner = winnerSlot === 'teamA' ? qf[idx].teamA : qf[idx].teamB;
      setQf((prev) => prev.map((m, i) => (i === idx ? { ...m, status: 'COMPLETED', teamA: { ...m.teamA, isWinner: winnerSlot === 'teamA' }, teamB: { ...m.teamB, isWinner: winnerSlot === 'teamB' } } : m)));
      setSf((prev) => {
        const next = [...prev];
        if (idx === 0 && next[0]) next[0] = { ...next[0], teamA: { ...winner, isWinner: false, score: 0 } };
        if (idx === 1 && next[0]) next[0] = { ...next[0], teamB: { ...winner, isWinner: false, score: 0 } };
        if (idx === 2 && next[1]) next[1] = { ...next[1], teamA: { ...winner, isWinner: false, score: 0 } };
        if (idx === 3 && next[1]) next[1] = { ...next[1], teamB: { ...winner, isWinner: false, score: 0 } };
        return next;
      });
      setNotice(`Pemenang ${qf[idx].stageName} lolos ke Semifinal: ${winner.name}!`);
    } else {
      const winner = winnerSlot === 'teamA' ? bronze.teamA : bronze.teamB;
      setBronze((prev) => ({ ...prev, status: 'COMPLETED' as const, teamA: { ...prev.teamA, isWinner: winnerSlot === 'teamA' }, teamB: { ...prev.teamB, isWinner: winnerSlot === 'teamB' } }));
      if (winner.id && !winner.id.startsWith('tbd')) setThirdPlaceId(winner.id);
      setNotice(`${winner.name} meraih Juara 3 bersama turnamen!`);
    }
  };

  const handleReset = () => {
    setR24(ROUND_OF_24); setR16(ROUND_OF_16); setQf(QUARTER_FINALS);
    setSf(SEMI_FINALS); setGf(GRAND_FINAL); setBronze(BRONZE_MATCH);
    setChampionId(''); setRunnerUpId(''); setThirdPlaceId('');
    setNotice('Bagan dan podium berhasil dikembalikan ke status awal.');
  };

  const handleAutoFillGroups = () => {
    if (bracketSize === 4) {
      const autoSf = getAutoFillSemifinals();
      setSf(autoSf);
      let res = syncBracketToMatchesAndDuties(15, autoSf[0].teamA, autoSf[0].teamB, matches, duties);
      res = syncBracketToMatchesAndDuties(16, autoSf[1].teamA, autoSf[1].teamB, res.updatedMatches, res.updatedDuties);
      setMatches(res.updatedMatches); setDuties(res.updatedDuties);
      setNotice('Slot Semifinal (4 Besar) berhasil diisi dari juara grup A, B, C, D dan tersinkron ke jadwal!');
    } else {
      const t = (id: string) => initialTeams.find((item) => item.id === id)!;
      setQf([
        { ...QUARTER_FINALS[0], teamA: { id: t('team-sdi-kardina').id, name: t('team-sdi-kardina').name, score: 0 }, teamB: { id: t('team-min7-blitar').id, name: t('team-min7-blitar').name, score: 0 } },
        { ...QUARTER_FINALS[1], teamA: { id: t('team-min2-blitar').id, name: t('team-min2-blitar').name, score: 0 }, teamB: { id: t('team-mi-wahidhasyim').id, name: t('team-mi-wahidhasyim').name, score: 0 } },
        { ...QUARTER_FINALS[2], teamA: { id: t('team-sdn1-srengat').id, name: t('team-sdn1-srengat').name, score: 0 }, teamB: { id: t('team-min14-blitar').id, name: t('team-min14-blitar').name, score: 0 } },
        { ...QUARTER_FINALS[3], teamA: { id: t('team-mi-ploso').id, name: t('team-mi-ploso').name, score: 0 }, teamB: { id: t('team-mi-darussalam').id, name: t('team-mi-darussalam').name, score: 0 } },
      ]);
      setNotice('Slot Perempat Final berhasil diisi otomatis berdasarkan tim unggulan fase grup!');
    }
  };

  const handleSaveAll = () => {
    let res = syncBracketToMatchesAndDuties(15, sf[0].teamA, sf[0].teamB, matches, duties);
    res = syncBracketToMatchesAndDuties(16, sf[1].teamA, sf[1].teamB, res.updatedMatches, res.updatedDuties);
    res = syncBracketToMatchesAndDuties(17, gf.teamA, gf.teamB, res.updatedMatches, res.updatedDuties);
    setMatches(res.updatedMatches); setDuties(res.updatedDuties);
    setNotice('Seluruh data bagan & pertandingan berhasil disinkronkan ke server dan jadwal juri!');
  };

  const stageFilters: { id: StageFilter; label: string }[] = [
    ...(bracketSize > 2 ? [{ id: 'ALL' as StageFilter, label: 'Semua Babak' }] : []),
    ...(bracketSize >= 24 ? [{ id: 'R24' as StageFilter, label: 'Playoff 24' }] : []),
    ...(bracketSize >= 16 ? [{ id: 'R16' as StageFilter, label: '16 Besar' }] : []),
    ...(bracketSize >= 8 ? [{ id: 'QF' as StageFilter, label: '8 Besar (QF)' }] : []),
    ...(bracketSize >= 4 ? [{ id: 'SF' as StageFilter, label: 'Semifinal (SF)' }] : []),
    { id: 'FINAL' as StageFilter, label: hasBronzeMatch ? 'Grand Final & Bronze' : 'Grand Final' },
  ];

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
      {/* Top Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <span className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-primary)] flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>Pengaturan Bagan &amp; Penentuan Pemenang Juri</span>
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded-md bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] text-[10px] font-mono font-bold uppercase">
              Format: {bracketSize} Besar
            </span>
            <p className="text-[11px] text-[var(--text-muted)]">
              Klik pada laga untuk membuka dialog pemilihan pemenang &amp; pengisian skor.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAutoFillGroups}
            className="btn-tactile px-3 py-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--bg-surface)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider text-[11px] border border-[var(--border-subtle)] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Isi Otomatis Grup</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn-tactile px-3 py-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-red-500/10 text-red-600 dark:text-red-400 font-barlow font-bold uppercase tracking-wider text-[11px] border border-[var(--border-subtle)] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bagan</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="btn-tactile px-3.5 py-1.5 rounded-lg bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white font-barlow font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-barlow font-bold uppercase tracking-wide flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notice}</span>
          </div>
          <button type="button" onClick={() => setNotice(null)} className="text-xs hover:underline shrink-0">
            Tutup
          </button>
        </div>
      )}

      {/* Stage Selector Filter */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold w-full sm:w-auto">
          {stageFilters.map((stage) => {
            const isActive = activeStageFilter === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStageFilter(stage.id)}
                className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs transition-all cursor-pointer min-h-[36px] whitespace-nowrap ${
                  isActive
                    ? stage.id === 'FINAL'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'bg-[#0284c7] text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/50 dark:hover:bg-slate-800'
                }`}
              >
                {stage.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Centered Bracket Container with Dark Frame & Connecting Lines */}
      <DrawingBracketTree
        bracketSize={bracketSize}
        qf={qf}
        sf={sf}
        gf={gf}
        bronze={bronze}
        championTeamName={championTeamName}
        hasBronzeMatch={hasBronzeMatch}
        onSelectMatch={(node, stage) => setEditModalMatch({ node, stage })}
      />

      {/* Podium Pemenang Resmi Turnamen */}
      <div className="pt-2">
        <BracketPodiumCard
          championId={championId}
          setChampionId={setChampionId}
          runnerUpId={runnerUpId}
          setRunnerUpId={setRunnerUpId}
          thirdPlaceId={thirdPlaceId}
          setThirdPlaceId={setThirdPlaceId}
        />
      </div>

      {/* Modal Interaktif Pengaturan Laga Juri */}
      {editModalMatch && (
        <BracketMatchEditModal
          isOpen={true}
          node={
            editModalMatch.stage === 'SF'
              ? sf.find((m) => m.id === editModalMatch.node.id) || editModalMatch.node
              : editModalMatch.stage === 'GF'
              ? gf
              : editModalMatch.stage === 'QF'
              ? qf.find((m) => m.id === editModalMatch.node.id) || editModalMatch.node
              : bronze
          }
          stage={editModalMatch.stage}
          onClose={() => setEditModalMatch(null)}
          onTeamChange={handleTeamChange}
          onScoreChange={handleScoreChange}
          onSetWinner={handleSetWinner}
        />
      )}
    </div>
  );
};
