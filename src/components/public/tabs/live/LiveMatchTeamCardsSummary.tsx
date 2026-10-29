'use client';

import React, { useState, useMemo } from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, UserX, Search } from 'lucide-react';
import { initialTeams } from '@/mocks/tournamentData';

interface TeamCardStats {
  id: string;
  name: string;
  shortName: string;
  schoolName: string;
  group: string;
  logoUrl: string;
  yellowCards: number;
  redCards: number;
  totalCards: number;
  suspendedCount: number;
  cardedPlayers: {
    name: string;
    number: number;
    yellowCards: number;
    redCards: number;
    isSuspended?: boolean;
    suspensionReason?: string;
  }[];
}

export const LiveMatchTeamCardsSummary: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Hitung agregat kartu tiap tim dari daftar roster pemain
  const teamsStats: TeamCardStats[] = useMemo(() => {
    return initialTeams.map((team) => {
      let yellow = 0;
      let red = 0;
      let suspended = 0;
      const carded: TeamCardStats['cardedPlayers'] = [];

      team.players.forEach((p) => {
        const pYellow = p.yellowCards || 0;
        const pRed = p.redCards || 0;
        yellow += pYellow;
        red += pRed;
        if (p.isSuspended) suspended++;

        if (pYellow > 0 || pRed > 0 || p.isSuspended) {
          carded.push({
            name: p.name,
            number: p.number,
            yellowCards: pYellow,
            redCards: pRed,
            isSuspended: p.isSuspended,
            suspensionReason: p.suspensionReason,
          });
        }
      });

      return {
        id: team.id,
        name: team.name,
        shortName: team.shortName,
        schoolName: team.schoolName,
        group: team.group,
        logoUrl: team.logoUrl,
        yellowCards: yellow,
        redCards: red,
        totalCards: yellow + red,
        suspendedCount: suspended,
        cardedPlayers: carded,
      };
    });
  }, []);

  // Filter berdasarkan grup & pencarian
  const filteredTeams = useMemo(() => {
    return teamsStats
      .filter((t) => {
        if (selectedGroup !== 'ALL' && t.group !== selectedGroup) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            t.name.toLowerCase().includes(q) ||
            t.schoolName.toLowerCase().includes(q) ||
            t.group.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        // Urutkan berdasarkan total kartu terbanyak, atau sanksi
        if (b.totalCards !== a.totalCards) return b.totalCards - a.totalCards;
        if (b.redCards !== a.redCards) return b.redCards - a.redCards;
        return a.name.localeCompare(b.name);
      });
  }, [teamsStats, selectedGroup, searchQuery]);

  // Statistik turnamen
  const totalYellow = teamsStats.reduce((sum, t) => sum + t.yellowCards, 0);
  const totalRed = teamsStats.reduce((sum, t) => sum + t.redCards, 0);
  const totalCleanTeams = teamsStats.filter((t) => t.totalCards === 0).length;
  const totalSuspendedPlayers = teamsStats.reduce((sum, t) => sum + t.suspendedCount, 0);

  return (
    <div className="rounded-2xl bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)] p-5 sm:p-6 shadow-sm space-y-5 animate-fadeIn">
      {/* Header & Regulasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h3 className="font-bebas text-xl sm:text-2xl text-[var(--text-main)] uppercase tracking-wide leading-none">
              Informasi Akumulasi Kartu Seluruh Tim
            </h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1 font-sans">
            Rekapitulasi sanksi kartu kuning &amp; merah seluruh 14 tim kontingen (Aturan Disiplin: Akumulasi 2 Kartu Kuning = Larangan 1 Laga).
          </p>
        </div>

        {/* Ringkasan Cepat */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-mono font-bold">
            <span className="w-2.5 h-3.5 bg-amber-400 rounded-2xs inline-block shadow-2xs" />
            <span>{totalYellow} Kartu Kuning</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/25 text-red-700 dark:text-red-400 text-xs font-mono font-bold">
            <span className="w-2.5 h-3.5 bg-red-500 rounded-2xs inline-block shadow-2xs" />
            <span>{totalRed} Kartu Merah</span>
          </span>
          {totalSuspendedPlayers > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-400 text-xs font-mono font-bold">
              <UserX className="w-3.5 h-3.5" />
              <span>{totalSuspendedPlayers} Sanksi</span>
            </span>
          )}
        </div>
      </div>

      {/* Bar Filter Grup & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold">
          {['ALL', 'A', 'B', 'C', 'D'].map((grp) => (
            <button
              key={grp}
              type="button"
              onClick={() => setSelectedGroup(grp)}
              className={`px-3 py-1.5 rounded-lg transition-all text-xs ${
                selectedGroup === grp
                  ? 'bg-[var(--color-arena-primary)] text-white font-bold shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {grp === 'ALL' ? `Semua Tim (${teamsStats.length})` : `Grup ${grp}`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tim atau sekolah..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-arena-primary)]"
          />
        </div>
      </div>

      {/* Tabel Rincian Kartu Per Tim */}
      <div className="rounded-xl border border-[var(--border-subtle)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[var(--bg-muted)] text-[var(--text-muted)] text-[10px] uppercase font-bold border-b border-[var(--border-subtle)]">
                <th className="py-3 px-3.5 text-center w-12">#</th>
                <th className="py-3 px-3.5">Tim Kontingen</th>
                <th className="py-3 px-3.5 text-center w-28">Kuning (KK)</th>
                <th className="py-3 px-3.5 text-center w-28">Merah (KM)</th>
                <th className="py-3 px-3.5 text-center w-24">Total</th>
                <th className="py-3 px-3.5 text-center w-36">Status Disiplin</th>
                <th className="py-3 px-3.5">Pemain Terkena Sanksi / Kartu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredTeams.map((team, idx) => {
                const hasCards = team.totalCards > 0;
                const hasRed = team.redCards > 0;
                const hasSuspension = team.suspendedCount > 0;

                return (
                  <tr
                    key={team.id}
                    className="hover:bg-[var(--bg-muted)]/50 transition-colors"
                  >
                    <td className="py-3 px-3.5 text-center font-mono text-[var(--text-muted)] font-semibold">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-center p-1 shrink-0 overflow-hidden">
                          <img
                            src={team.logoUrl}
                            alt={team.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-barlow font-bold text-sm text-[var(--text-main)]">
                              {team.name}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[var(--bg-muted)] text-[var(--color-arena-primary)] border border-[var(--border-subtle)]">
                              Grup {team.group}
                            </span>
                          </div>
                          <span className="text-[11px] text-[var(--text-muted)] block truncate max-w-xs">
                            {team.schoolName}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3.5 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/25 font-mono font-bold text-xs text-amber-700 dark:text-amber-400">
                        <span className="w-2.5 h-3 bg-amber-400 rounded-2xs inline-block" />
                        <span>{team.yellowCards}</span>
                      </span>
                    </td>

                    <td className="py-3 px-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-mono font-bold text-xs ${
                          team.redCards > 0
                            ? 'bg-red-500/15 border border-red-500/30 text-red-700 dark:text-red-400'
                            : 'bg-slate-500/10 border border-slate-500/20 text-[var(--text-muted)]'
                        }`}
                      >
                        <span className="w-2.5 h-3 bg-red-500 rounded-2xs inline-block" />
                        <span>{team.redCards}</span>
                      </span>
                    </td>

                    <td className="py-3 px-3.5 text-center font-mono font-extrabold text-sm text-[var(--text-main)]">
                      {team.totalCards}
                    </td>

                    <td className="py-3 px-3.5 text-center">
                      {hasSuspension || hasRed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Disanksi</span>
                        </span>
                      ) : team.yellowCards > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                          <span>Waspada</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Aman / Bersih</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3.5 text-xs">
                      {team.cardedPlayers.length === 0 ? (
                        <span className="text-[var(--text-muted)] text-[11px] italic">
                          Tidak ada catatan kartu (Bersih)
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {team.cardedPlayers.map((cp, cIdx) => (
                            <span
                              key={cIdx}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                                cp.isSuspended
                                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                                  : 'bg-[var(--bg-muted)] border-[var(--border-subtle)] text-[var(--text-main)]'
                              }`}
                              title={cp.suspensionReason || `${cp.yellowCards} Kartu Kuning`}
                            >
                              <span>{cp.name} #{cp.number}</span>
                              {cp.yellowCards > 0 && (
                                <span className="w-2 h-2.5 bg-amber-400 rounded-2xs inline-block" />
                              )}
                              {cp.redCards > 0 && (
                                <span className="w-2 h-2.5 bg-red-500 rounded-2xs inline-block" />
                              )}
                              {cp.isSuspended && (
                                <span className="text-[9px] font-bold text-rose-600 uppercase ml-0.5">
                                  [ABSEN]
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
