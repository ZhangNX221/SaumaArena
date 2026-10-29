'use client';

import React, { useState } from 'react';
import { RefreshCw, Trophy, CheckCircle2, RotateCcw, Save, Crown, Sparkles, Medal } from 'lucide-react';
import { QUARTER_FINALS, SEMI_FINALS, GRAND_FINAL, BracketMatch } from '@/mocks/bracketData';
import { initialTeams } from '@/mocks/tournamentData';
import { usePersistentState } from '@/hooks/usePersistentState';
import { BracketMatchCard, TeamDropdown } from './BracketMatchCard';

export const DrawingBracketTab: React.FC = () => {
  const [qf, setQf] = usePersistentState<BracketMatch[]>('sauma_arena_bracket_qf', QUARTER_FINALS);
  const [sf, setSf] = usePersistentState<BracketMatch[]>('sauma_arena_bracket_sf', SEMI_FINALS);
  const [gf, setGf] = usePersistentState<BracketMatch>('sauma_arena_bracket_gf', GRAND_FINAL);

  // Status Podium Juara (Persisted)
  const [championId, setChampionId] = usePersistentState<string>('sauma_arena_bracket_champ', '');
  const [runnerUpId, setRunnerUpId] = usePersistentState<string>('sauma_arena_bracket_runner', '');
  const [thirdPlaceId, setThirdPlaceId] = usePersistentState<string>('sauma_arena_bracket_third', '');
  const [notice, setNotice] = useState<string | null>(null);

  // Helper ganti tim pada slot laga
  const handleTeamChange = (
    stage: 'QF' | 'SF' | 'GF',
    matchId: string,
    slot: 'teamA' | 'teamB',
    teamId: string
  ) => {
    const selected = initialTeams.find((t) => t.id === teamId);
    const newTeam = selected
      ? { id: selected.id, name: selected.name, score: 0, isWinner: false }
      : { id: `tbd-${matchId}-${slot}`, name: `Menunggu Pemenang (${slot.toUpperCase()})`, score: 0, isWinner: false };

    if (stage === 'QF') {
      setQf((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, [slot]: newTeam, status: 'SCHEDULED' } : m))
      );
    } else if (stage === 'SF') {
      setSf((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, [slot]: newTeam, status: 'SCHEDULED' } : m))
      );
    } else {
      setGf((prev) => ({ ...prev, [slot]: newTeam, status: 'SCHEDULED' }));
    }
  };

  // Helper ganti skor
  const handleScoreChange = (
    stage: 'QF' | 'SF' | 'GF',
    matchId: string,
    slot: 'teamA' | 'teamB',
    score: number
  ) => {
    const safeScore = Math.max(0, score);
    if (stage === 'QF') {
      setQf((prev) =>
        prev.map((m) =>
          m.id === matchId ? { ...m, [slot]: { ...m[slot], score: safeScore } } : m
        )
      );
    } else if (stage === 'SF') {
      setSf((prev) =>
        prev.map((m) =>
          m.id === matchId ? { ...m, [slot]: { ...m[slot], score: safeScore } } : m
        )
      );
    } else {
      setGf((prev) => ({ ...prev, [slot]: { ...prev[slot], score: safeScore } }));
    }
  };

  // Helper tandai pemenang laga & otomatis usulkan ke babak berikutnya
  const handleSetWinner = (
    stage: 'QF' | 'SF' | 'GF',
    matchId: string,
    winnerSlot: 'teamA' | 'teamB'
  ) => {
    if (stage === 'QF') {
      const matchIndex = qf.findIndex((m) => m.id === matchId);
      if (matchIndex === -1) return;

      const current = qf[matchIndex];
      const winningTeam = winnerSlot === 'teamA' ? current.teamA : current.teamB;
      const updatedQf = qf.map((m, idx) =>
        idx === matchIndex
          ? {
              ...m,
              status: 'COMPLETED' as const,
              teamA: { ...m.teamA, isWinner: winnerSlot === 'teamA' },
              teamB: { ...m.teamB, isWinner: winnerSlot === 'teamB' },
            }
          : m
      );
      setQf(updatedQf);

      // Otomatis teruskan tim pemenang ke Semifinal (SF1 / SF2)
      setSf((prev) => {
        const next = [...prev];
        if (matchIndex === 0) next[0] = { ...next[0], teamA: { ...winningTeam, isWinner: false, score: 0 } };
        if (matchIndex === 1) next[0] = { ...next[0], teamB: { ...winningTeam, isWinner: false, score: 0 } };
        if (matchIndex === 2) next[1] = { ...next[1], teamA: { ...winningTeam, isWinner: false, score: 0 } };
        if (matchIndex === 3) next[1] = { ...next[1], teamB: { ...winningTeam, isWinner: false, score: 0 } };
        return next;
      });
      setNotice(`Pemenang ${current.stageName} diatur ke ${winningTeam.name}. Slot Semifinal diperbarui!`);
    } else if (stage === 'SF') {
      const matchIndex = sf.findIndex((m) => m.id === matchId);
      if (matchIndex === -1) return;

      const current = sf[matchIndex];
      const winningTeam = winnerSlot === 'teamA' ? current.teamA : current.teamB;
      const losingTeam = winnerSlot === 'teamA' ? current.teamB : current.teamA;

      setSf((prev) =>
        prev.map((m, idx) =>
          idx === matchIndex
            ? {
                ...m,
                status: 'COMPLETED' as const,
                teamA: { ...m.teamA, isWinner: winnerSlot === 'teamA' },
                teamB: { ...m.teamB, isWinner: winnerSlot === 'teamB' },
              }
            : m
        )
      );

      // Teruskan pemenang ke Grand Final (P17)
      setGf((prev) => {
        if (matchIndex === 0) return { ...prev, teamA: { ...winningTeam, isWinner: false, score: 0 } };
        return { ...prev, teamB: { ...winningTeam, isWinner: false, score: 0 } };
      });
      if (!thirdPlaceId && losingTeam.id && !losingTeam.id.startsWith('tbd')) {
        setThirdPlaceId(losingTeam.id);
      }
      setNotice(`Pemenang ${current.stageName} lolos ke Grand Final: ${winningTeam.name}!`);
    } else {
      // Grand Final
      const winningTeam = winnerSlot === 'teamA' ? gf.teamA : gf.teamB;
      const runnerUpTeam = winnerSlot === 'teamA' ? gf.teamB : gf.teamA;

      setGf((prev) => ({
        ...prev,
        status: 'COMPLETED' as const,
        teamA: { ...prev.teamA, isWinner: winnerSlot === 'teamA' },
        teamB: { ...prev.teamB, isWinner: winnerSlot === 'teamB' },
      }));

      if (winningTeam.id && !winningTeam.id.startsWith('tbd')) {
        setChampionId(winningTeam.id);
      }
      if (runnerUpTeam.id && !runnerUpTeam.id.startsWith('tbd')) {
        setRunnerUpId(runnerUpTeam.id);
      }
      setNotice(`Selamat! ${winningTeam.name} resmi ditetapkan sebagai JUARA 1 MMFC I! 🏆`);
    }
  };

  // Reset ke default
  const handleReset = () => {
    setQf(QUARTER_FINALS);
    setSf(SEMI_FINALS);
    setGf(GRAND_FINAL);
    setChampionId('');
    setRunnerUpId('');
    setThirdPlaceId('');
    setNotice('Bagan dan podium berhasil dikembalikan ke status kosong default.');
  };

  // Otomatis isi perempat final dari juara dan runner-up grup turnamen
  const handleAutoFillGroups = () => {
    const teamA1 = initialTeams.find((t) => t.id === 'team-sdi-kardina')!;
    const teamA2 = initialTeams.find((t) => t.id === 'team-min7-blitar')!;
    const teamC1 = initialTeams.find((t) => t.id === 'team-min2-blitar')!;
    const teamC2 = initialTeams.find((t) => t.id === 'team-mi-wahidhasyim')!;
    const teamB1 = initialTeams.find((t) => t.id === 'team-sdn1-srengat')!;
    const teamB2 = initialTeams.find((t) => t.id === 'team-min14-blitar')!;
    const teamD1 = initialTeams.find((t) => t.id === 'team-mi-ploso')!;
    const teamD2 = initialTeams.find((t) => t.id === 'team-mi-darussalam')!;

    setQf([
      { ...QUARTER_FINALS[0], teamA: { id: teamA1.id, name: teamA1.name, score: 0 }, teamB: { id: teamA2.id, name: teamA2.name, score: 0 } },
      { ...QUARTER_FINALS[1], teamA: { id: teamC1.id, name: teamC1.name, score: 0 }, teamB: { id: teamC2.id, name: teamC2.name, score: 0 } },
      { ...QUARTER_FINALS[2], teamA: { id: teamB1.id, name: teamB1.name, score: 0 }, teamB: { id: teamB2.id, name: teamB2.name, score: 0 } },
      { ...QUARTER_FINALS[3], teamA: { id: teamD1.id, name: teamD1.name, score: 0 }, teamB: { id: teamD2.id, name: teamD2.name, score: 0 } },
    ]);
    setNotice('Slot Perempat Final berhasil diisi otomatis berdasarkan tim unggulan fase grup!');
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <span className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-primary)] flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>Pengaturan Bagan &amp; Penentuan Pemenang Manual Juri</span>
          </span>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            Gunakan dropdown pada setiap card untuk memilih tim yang bertanding dan tombol &apos;Menang&apos; untuk meloloskan tim.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAutoFillGroups}
            className="btn-tactile px-3 py-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--bg-surface)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider text-[11px] border border-[var(--border-subtle)] flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Isi Otomatis Grup</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn-tactile px-3 py-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-red-500/10 text-red-600 dark:text-red-400 font-barlow font-bold uppercase tracking-wider text-[11px] border border-[var(--border-subtle)] flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bagan</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setNotice('Konfigurasi bagan dan status pemenang berhasil disimpan ke sistem juri!');
            }}
            className="btn-tactile px-3.5 py-1.5 rounded-lg bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white font-barlow font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 shadow-xs transition-colors"
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
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-xs hover:underline shrink-0"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Bracket Tree Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Kolom 1: Perempat Final (4 Laga) */}
        <div className="space-y-3">
          <div className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
            <span>1. Perempat Final (4 Laga)</span>
            <span className="text-[10px] font-mono text-[var(--color-arena-primary)]">Fase QF</span>
          </div>
          <div className="space-y-3">
            {qf.map((node) => (
              <BracketMatchCard
                key={node.id}
                node={node}
                stage="QF"
                accentColor="text-[var(--text-muted)]"
                onTeamChange={handleTeamChange}
                onScoreChange={handleScoreChange}
                onSetWinner={handleSetWinner}
              />
            ))}
          </div>
        </div>

        {/* Kolom 2: Semifinal (2 Laga) */}
        <div className="space-y-3">
          <div className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
            <span>2. Semifinal 4 Besar (2 Laga)</span>
            <span className="text-[10px] font-mono text-[var(--color-arena-primary)]">Fase SF</span>
          </div>
          <div className="space-y-3">
            {sf.map((node) => (
              <BracketMatchCard
                key={node.id}
                node={node}
                stage="SF"
                accentColor="text-[var(--color-arena-primary)]"
                onTeamChange={handleTeamChange}
                onScoreChange={handleScoreChange}
                onSetWinner={handleSetWinner}
              />
            ))}
          </div>
        </div>

        {/* Kolom 3: Grand Final & Podium Juara */}
        <div className="space-y-4">
          <div className="text-xs font-barlow font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
            <Trophy className="w-4 h-4" />
            <span>3. Grand Final &amp; Penentuan Juara</span>
          </div>

          {/* Laga Grand Final (P17) */}
          <BracketMatchCard
            node={gf}
            stage="GF"
            accentColor="text-amber-500 font-black"
            onTeamChange={handleTeamChange}
            onScoreChange={handleScoreChange}
            onSetWinner={handleSetWinner}
          />

          {/* Podium Juara Resmi */}
          <div className="p-4 rounded-xl border-2 border-amber-500/40 bg-amber-500/5 shadow-xs space-y-3">
            <div className="text-xs font-barlow font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Podium Pemenang Turnamen</span>
            </div>

            {/* Juara 1 */}
            <div className="space-y-1">
              <div className="text-[10px] font-barlow font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>🥇 Juara 1 (Piala Bergilir MMFC I)</span>
              </div>
              <TeamDropdown
                currentId={championId}
                currentName={championId ? initialTeams.find((t) => t.id === championId)?.name || 'Pilih Juara 1' : '-- Pilih Juara 1 --'}
                onSelect={setChampionId}
              />
            </div>

            {/* Juara 2 */}
            <div className="space-y-1">
              <div className="text-[10px] font-barlow font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Medal className="w-3.5 h-3.5 text-slate-400" />
                <span>🥈 Juara 2 (Runner-Up)</span>
              </div>
              <TeamDropdown
                currentId={runnerUpId}
                currentName={runnerUpId ? initialTeams.find((t) => t.id === runnerUpId)?.name || 'Pilih Juara 2' : '-- Pilih Juara 2 --'}
                onSelect={setRunnerUpId}
              />
            </div>

            {/* Juara 3 Bersama */}
            <div className="space-y-1">
              <div className="text-[10px] font-barlow font-bold uppercase tracking-wider text-amber-900 dark:text-amber-600 flex items-center gap-1">
                <Medal className="w-3.5 h-3.5 text-amber-700" />
                <span>🥉 Juara 3 Bersama</span>
              </div>
              <TeamDropdown
                currentId={thirdPlaceId}
                currentName={thirdPlaceId ? initialTeams.find((t) => t.id === thirdPlaceId)?.name || 'Pilih Juara 3' : '-- Pilih Juara 3 --'}
                onSelect={setThirdPlaceId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
