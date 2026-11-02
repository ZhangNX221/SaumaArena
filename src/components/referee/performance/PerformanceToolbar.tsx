'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { FlattenedAthlete } from '@/types';
import { initialTeams } from '@/mocks/tournamentData';

export type FilterCategory = 'ALL' | 'GOALS' | 'YELLOW' | 'RED';
export type SortOption = 'GOALS_DESC' | 'CARDS_DESC' | 'NUMBER_ASC' | 'NAME_ASC';

interface PerformanceToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedTeamFilter: string;
  onSelectedTeamChange: (val: string) => void;
  sortOption: SortOption;
  onSortChange: (val: SortOption) => void;
  categoryFilter: FilterCategory;
  onCategoryFilterChange: (val: FilterCategory) => void;
  athletesList: FlattenedAthlete[];
}

export const PerformanceToolbar: React.FC<PerformanceToolbarProps> = ({
  search,
  onSearchChange,
  selectedTeamFilter,
  onSelectedTeamChange,
  sortOption,
  onSortChange,
  categoryFilter,
  onCategoryFilterChange,
  athletesList,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Input Pencarian */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama pemain, no punggung, atau tim..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-[var(--color-arena-primary)] transition-all font-medium"
          />
        </div>

        {/* Filter Tim Dropdown & Sort */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-[var(--text-muted)] shrink-0 hidden sm:block" />
          <select
            value={selectedTeamFilter}
            onChange={(e) => onSelectedTeamChange(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] font-semibold focus:outline-hidden focus:border-[var(--color-arena-primary)] transition-all cursor-pointer"
          >
            <option value="ALL">Semua Tim (14 Kontingen)</option>
            {initialTeams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} (Grup {t.group})
              </option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-2.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] font-semibold focus:outline-hidden focus:border-[var(--color-arena-primary)] transition-all cursor-pointer"
          >
            <option value="GOALS_DESC">Gol Terbanyak</option>
            <option value="CARDS_DESC">Kartu Terbanyak</option>
            <option value="NUMBER_ASC">No. Punggung</option>
            <option value="NAME_ASC">Nama Pemain (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Quick Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'ALL', label: 'Semua Pemain', count: athletesList.length },
          { id: 'GOALS', label: 'Pencetak Gol', count: athletesList.filter((a) => (a.goals || 0) > 0).length },
          { id: 'YELLOW', label: 'Kartu Kuning', count: athletesList.filter((a) => (a.yellowCards || 0) > 0).length },
          { id: 'RED', label: 'Kartu Merah', count: athletesList.filter((a) => (a.redCards || 0) > 0).length },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onCategoryFilterChange(tab.id as FilterCategory)}
            className={`px-3 py-1.5 rounded-lg font-barlow font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              categoryFilter === tab.id
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
    </div>
  );
};

