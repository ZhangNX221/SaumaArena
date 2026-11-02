'use client';

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { FlattenedAthlete } from '@/types';

interface AthleteMasterTableRowProps {
  ath: FlattenedAthlete;
  idx: number;
  currentPage: number;
  pageSize: number;
  onEdit: (ath: FlattenedAthlete) => void;
  onDelete: (ath: FlattenedAthlete) => void;
}

export const AthleteMasterTableRow: React.FC<AthleteMasterTableRowProps> = ({
  ath,
  idx,
  currentPage,
  pageSize,
  onEdit,
  onDelete,
}) => {
  const fallbackCode = `ATL-${String((currentPage - 1) * pageSize + idx + 1).padStart(3, '0')}`;

  return (
    <tr className="hover:bg-[var(--bg-muted)]/40 transition-colors">
      <td className="py-3 px-4 font-mono whitespace-nowrap">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] font-bold text-xs">
          {ath.athleteCode || fallbackCode}
        </span>
      </td>
      <td className="py-3 px-4 font-mono font-bold text-sm text-[var(--text-main)] text-center whitespace-nowrap">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
          #{ath.number}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="font-bold text-[var(--text-main)] text-sm">{ath.name}</div>
      </td>
      <td className="py-3 px-4">
        <div className="font-semibold text-[var(--color-arena-primary)]">{ath.teamName}</div>
        <div className="text-[10px] text-[var(--text-muted)] truncate max-w-xs">{ath.schoolName}</div>
      </td>
      <td className="py-3 px-4 text-center whitespace-nowrap">
        <span className="px-2 py-0.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-subtle)]">
          {ath.position}
        </span>
      </td>
      <td className="py-3 px-4 text-center whitespace-nowrap">
        <div className="flex items-center justify-center gap-1.5 font-mono text-[11px]">
          <span className="text-emerald-600 font-bold" title="Gol">{ath.goals || 0}G</span>
          <span className="text-[var(--text-muted)]">&bull;</span>
          <span className="text-amber-600 font-bold" title="Kartu Kuning">{ath.yellowCards || 0}K</span>
          <span className="text-[var(--text-muted)]">&bull;</span>
          <span className="text-red-600 font-bold" title="Kartu Merah">{ath.redCards || 0}M</span>
        </div>
      </td>
      <td className="py-3 px-4 text-center whitespace-nowrap">
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider ${
            ath.documentStatus === 'APPROVED'
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20'
          }`}
        >
          {ath.documentStatus === 'APPROVED' ? '✓ Sah' : 'Menunggu'}
        </span>
      </td>
      <td className="py-3 px-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(ath)}
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
            title="Edit ID Atlet, Nama, Tim, No. Punggung & Posisi"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(ath)}
            className="p-1.5 rounded-lg border border-rose-500/20 text-rose-500 hover:text-white hover:bg-rose-500 transition-colors cursor-pointer"
            title="Hapus Data Atlet"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

