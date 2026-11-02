'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { initialTeams } from '@/mocks/tournamentData';

interface AthleteFilterToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedTeamFilter: string;
  onTeamFilterChange: (val: string) => void;
  selectedDocFilter: string;
  onDocFilterChange: (val: string) => void;
  pageSize: number;
  onPageSizeChange: (val: number) => void;
}

export const AthleteFilterToolbar: React.FC<AthleteFilterToolbarProps> = ({
  search,
  onSearchChange,
  selectedTeamFilter,
  onTeamFilterChange,
  selectedDocFilter,
  onDocFilterChange,
  pageSize,
  onPageSizeChange,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
      <div className="relative flex-1 w-full">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
        <input
          type="text"
          placeholder="Cari ID atlet (ATL-xxx), nama pemain, atau sekolah..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
        />
      </div>

      <select
        value={selectedTeamFilter}
        onChange={(e) => onTeamFilterChange(e.target.value)}
        className="w-full md:w-52 px-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider cursor-pointer"
      >
        <option value="ALL">Semua Tim ({initialTeams.length})</option>
        {initialTeams.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <select
        value={selectedDocFilter}
        onChange={(e) => onDocFilterChange(e.target.value)}
        className="w-full md:w-44 px-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider cursor-pointer"
      >
        <option value="ALL">Semua Status Berkas</option>
        <option value="APPROVED">Berkas Sah (Approved)</option>
        <option value="PENDING">Menunggu Verifikasi</option>
        <option value="REJECTED">Ditolak</option>
      </select>

      <div className="flex items-center gap-2">
        <span className="text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] whitespace-nowrap">
          Tampil:
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider cursor-pointer"
        >
          <option value={10}>10 Data</option>
          <option value={25}>25 Data</option>
          <option value={50}>50 Data</option>
          <option value={100}>100 Data</option>
        </select>
      </div>
    </div>
  );
};

