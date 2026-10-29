'use client';

import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Search, X } from 'lucide-react';
import { initialTeams } from '@/mocks/tournamentData';
import { getTeamLogoUrl } from '@/mocks/teamLogos';
import { usePersistentState } from '@/hooks/usePersistentState';
import { Team, SportCode } from '@/types';
import { ModalPortal } from '@/components/common/ModalPortal';
import { PublicPageHeader } from '../layout/PublicPageHeader';

interface TeamsTabProps {
  sportCode?: SportCode;
}

export const TeamsTab: React.FC<TeamsTabProps> = ({ sportCode = 'FUTSAL' }) => {
  const [teams] = usePersistentState<Team[]>('sauma_arena_teams', initialTeams);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<'ALL' | 'A' | 'B' | 'C' | 'D'>('ALL');

  useEffect(() => {
    if (!selectedTeam) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedTeam(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTeam]);

  // Filtered list based on active sport
  const filteredFutsalTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.schoolName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === 'ALL' || team.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Public Page Header */}
      <PublicPageHeader
        icon={Users}
        category="KONTINGEN & TIM • FUTSAL"
        title="Daftar Tim &amp; Skuad Atlet"
        description="Daftar kontingen dan tim terverifikasi, komposisi pemain resmi, serta susunan ofisial pelatih turnamen."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold w-fit">
          <button
            type="button"
            onClick={() => setSelectedGroup('ALL')}
            className={`px-3.5 py-2 rounded-lg transition-all min-h-[38px] ${
              selectedGroup === 'ALL'
                ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-xs font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Semua Tim ({teams.length})
          </button>
          {(['A', 'B', 'C', 'D'] as const).map((grp) => (
            <button
              key={grp}
              type="button"
              onClick={() => setSelectedGroup(grp)}
              className={`px-3.5 py-2 rounded-lg transition-all min-h-[38px] ${
                selectedGroup === grp
                  ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-xs font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Grup {grp}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama tim atau sekolah..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)] min-h-[40px]"
          />
        </div>
      </div>
      {/* Render Futsal Teams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFutsalTeams.map((team) => (
          <div
            key={team.id}
            className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs hover:border-[var(--color-arena-primary)] transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0">
                  <img
                    src={team.logoUrl || getTeamLogoUrl(team.id)}
                    alt={team.name}
                    className="w-full h-full object-contain filter drop-shadow-xs"
                    loading="lazy"
                  />
                </div>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] border border-[var(--border-subtle)]">
                  Grup {team.group}
                </span>
              </div>

                <div>
                  <h3 className="font-barlow font-bold text-lg text-[var(--text-main)] tracking-wide truncate">
                    {team.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-medium truncate mt-0.5">{team.schoolName}</p>
                  <p className="text-[11px] text-[var(--text-faint)] font-mono">{team.city}</p>
                </div>

                <div className="text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-subtle)] space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span>Pelatih Kepala:</span>
                    <strong className="text-[var(--text-main)] font-semibold truncate max-w-[130px]">
                      {team.coachName}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Roster Resmi:</span>
                    <strong className="text-[var(--text-main)] font-mono font-bold">{team.players.length} Pemain</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTeam(team)}
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--color-arena-primary-light)] hover:text-[var(--color-arena-primary)] text-xs font-bold text-[var(--text-main)] transition-colors flex items-center justify-center gap-2 min-h-[40px]"
              >
                <Users className="w-4 h-4" />
                <span>Lihat Skuad Pemain</span>
              </button>
            </div>
          ))}
        </div>

      {/* Team Roster Modal for Futsal */}
      {selectedTeam && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn" onClick={() => setSelectedTeam(null)}>
            <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] shrink-0">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                    <img
                      src={selectedTeam.logoUrl || getTeamLogoUrl(selectedTeam.id)}
                      alt={selectedTeam.name}
                      className="w-full h-full object-contain filter drop-shadow-xs"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[var(--text-main)] font-[var(--font-display)]">
                      {selectedTeam.schoolName}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] font-medium">
                      Pelatih: {selectedTeam.coachName} &bull; Grup {selectedTeam.group}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTeam(null)}
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors"
                  aria-label="Tutup roster modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto pr-1 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)]">
                  <span>Daftar Pemain Terverifikasi ({selectedTeam.players.length})</span>
                  <span className="flex items-center gap-1.5 text-[var(--color-arena-primary)] dark:text-sky-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Roster Terkunci (Dispora Sah)</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedTeam.players.map((player) => (
                    <div
                      key={player.id}
                      className="p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--color-arena-dark)] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {player.number}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-[var(--text-main)]">{player.name}</div>
                          <div className="text-[11px] text-[var(--text-muted)] font-medium">{player.position}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-[var(--color-arena-primary)]">
                          {player.goals} Gol
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
};
