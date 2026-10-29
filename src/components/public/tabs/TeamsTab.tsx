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
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-6">
      {/* Public Page Header */}
      <PublicPageHeader
        icon={Users}
        category="KONTINGEN & TIM • FUTSAL"
        title="Daftar Tim &amp; Skuad Atlet"
        description="Daftar kontingen dan tim terverifikasi, komposisi pemain resmi, serta susunan ofisial pelatih turnamen."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-[var(--bg-muted)] border-2 border-slate-300 dark:border-slate-800 text-xs font-semibold w-fit">
          <button
            type="button"
            onClick={() => setSelectedGroup('ALL')}
            className={`btn-tactile px-3.5 py-2 rounded-md font-barlow font-bold uppercase tracking-wider text-xs transition-all min-h-[38px] cursor-pointer ${
              selectedGroup === 'ALL'
                ? 'bg-[#1D63B8] text-white shadow-xs'
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
              className={`btn-tactile px-3.5 py-2 rounded-md font-barlow font-bold uppercase tracking-wider text-xs transition-all min-h-[38px] cursor-pointer ${
                selectedGroup === grp
                  ? 'bg-[#1D63B8] text-white shadow-xs'
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
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-slate-300 dark:border-slate-800 bg-[var(--bg-surface)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[#1D63B8] min-h-[42px] transition-all"
          />
        </div>
      </div>

      {/* Render Futsal Teams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFutsalTeams.map((team) => (
          <div
            key={team.id}
            className="p-5 sm:p-6 rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 shadow-sm hover:border-[#1D63B8]/60 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[var(--bg-muted)] border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-2xs">
                    <img
                      src={team.logoUrl || getTeamLogoUrl(team.id)}
                      alt={team.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3 className="font-barlow font-bold text-base sm:text-lg text-[var(--text-main)] leading-tight tracking-wide">
                      {team.name}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">{team.schoolName}</p>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800 shrink-0">
                  Grup {team.group}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-800 font-sans">
                <div className="p-2 rounded-lg bg-[var(--bg-muted)] border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-[var(--text-muted)] font-barlow font-bold uppercase block">
                    Total Atlet
                  </span>
                  <span className="font-mono font-bold text-sm text-[var(--text-main)]">
                    {team.players.length} Pemain
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[var(--bg-muted)] border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-[var(--text-muted)] font-barlow font-bold uppercase block">
                    Pelatih / Ofisial
                  </span>
                  <span className="font-mono font-bold text-xs text-[var(--text-main)] truncate block">
                    {team.coachName || 'Ofisial Tim'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTeam(team)}
              className="btn-tactile w-full py-2.5 px-3 rounded-lg bg-[var(--bg-muted)] hover:bg-[#1D63B8] hover:text-white border border-slate-300 dark:border-slate-700 text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-main)] transition-colors min-h-[44px] cursor-pointer"
            >
              Lihat Skuad Atlet
            </button>
          </div>
        ))}
      </div>

      {/* Skuad Detail Modal */}
      {selectedTeam && (
        <ModalPortal>
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setSelectedTeam(null)}
          >
            <div
              className="w-full max-w-lg rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 p-6 space-y-5 text-[var(--text-main)] shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-muted)] border border-slate-300 dark:border-slate-700 p-1 flex items-center justify-center">
                    <img
                      src={selectedTeam.logoUrl || getTeamLogoUrl(selectedTeam.id)}
                      alt={selectedTeam.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-bebas text-lg sm:text-xl text-[var(--text-main)] uppercase tracking-wide leading-none">
                      {selectedTeam.name}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] font-sans">
                      {selectedTeam.schoolName} &bull; Grup {selectedTeam.group}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTeam(null)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Rincian Ofisial */}
              <div className="p-3 rounded-lg bg-[var(--bg-muted)] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] font-barlow font-bold uppercase block">
                    Pelatih Kepala
                  </span>
                  <span className="font-bold text-[var(--text-main)]">{selectedTeam.coachName || 'Ofisial Tim'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[var(--text-muted)] font-barlow font-bold uppercase block">
                    Kota / Asal
                  </span>
                  <span className="font-bold text-[var(--text-main)]">{selectedTeam.city}</span>
                </div>
              </div>

              {/* Daftar Pemain */}
              <div className="space-y-2">
                <span className="font-barlow font-bold uppercase tracking-wider text-xs text-[var(--text-muted)] block">
                  Daftar Atlet Resmi ({selectedTeam.players.length} Pemain)
                </span>
                <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  {selectedTeam.players.map((player) => (
                    <div
                      key={player.id}
                      className="p-2.5 flex items-center justify-between text-xs bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)]/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded bg-[var(--bg-muted)] border border-slate-300 dark:border-slate-700 font-mono font-bold text-xs flex items-center justify-center text-[var(--text-main)]">
                          {player.number}
                        </span>
                        <div>
                          <span className="font-bold text-[var(--text-main)] block">{player.name}</span>
                          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-mono">
                            {player.position}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-[var(--text-main)]">
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
