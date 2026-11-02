'use client';

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { StandingRow } from '@/types';

interface StandingsTableProps {
  sortedStandings: StandingRow[];
  onEdit: (row: StandingRow) => void;
  onDelete: (teamId: string, teamName: string) => void;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({
  sortedStandings,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
      <table className="w-full text-xs text-left">
        <thead className="bg-[var(--bg-muted)]/70 text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
          <tr>
            <th className="py-3.5 px-3.5 text-center" title="Peringkat">Pos</th>
            <th className="py-3.5 px-3.5">Klub / Sekolah</th>
            <th className="py-3.5 px-3 text-center" title="Berapa kali Main">MN</th>
            <th className="py-3.5 px-3 text-center text-emerald-600 dark:text-emerald-400" title="Poin Menang (+3)">M</th>
            <th className="py-3.5 px-3 text-center text-amber-600 dark:text-amber-400" title="Seri">S</th>
            <th className="py-3.5 px-3 text-center text-red-600 dark:text-red-400" title="Kalah">K</th>
            <th className="py-3.5 px-3 text-center" title="Gol Memasukkan">GM</th>
            <th className="py-3.5 px-3 text-center" title="Gol Kemasukan">GK</th>
            <th className="py-3.5 px-3 text-center" title="Selisih Gol (GM - GK)">SG</th>
            <th className="py-3.5 px-3 text-center font-bold text-amber-600 dark:text-amber-400" title="Point Supporter (+1)">PS</th>
            <th className="py-3.5 px-3.5 text-center font-bold text-sm text-[var(--color-arena-primary)]" title="Total Poin (Menang + PS)">PTS</th>
            <th className="py-3.5 px-3.5 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-subtle)] font-medium">
          {sortedStandings.length === 0 && (
            <tr>
              <td colSpan={12} className="py-12 text-center text-xs text-[var(--text-muted)]">
                <div className="space-y-1.5">
                  <p className="font-bold text-[var(--text-main)] text-sm">Belum ada tim di klasemen grup ini</p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Klik tombol &quot;+ Tambah Tim&quot; atau &quot;Sinkron dari Laga&quot; untuk memuat data tim.
                  </p>
                </div>
              </td>
            </tr>
          )}
          {sortedStandings.map((row, idx) => (
            <tr key={row.teamId} className="hover:bg-[var(--bg-muted)]/30 transition-colors">
              <td className="py-4 px-3.5 text-center font-barlow font-bold tabular-nums">
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-teko font-bold tabular-nums ${
                    idx < 1 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-sm' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {idx + 1}
                </span>
              </td>
              <td className="py-4 px-3.5 font-bold text-[var(--text-main)]">
                <div>{row.teamName.replace(/\s*\([A-D][1-4]\)\s*$/i, '').trim()}</div>
                <div className="text-[11px] text-[var(--text-muted)] font-normal">{row.schoolName}</div>
              </td>
              <td className="py-4 px-3 text-center font-mono tabular-nums text-xs">{row.played}</td>
              <td className="py-4 px-3 text-center font-mono tabular-nums text-xs font-bold text-emerald-600 dark:text-emerald-400">{row.won}</td>
              <td className="py-4 px-3 text-center font-mono tabular-nums text-xs text-amber-600 dark:text-amber-400">{row.drawn}</td>
              <td className="py-4 px-3 text-center font-mono tabular-nums text-xs text-red-600 dark:text-red-400">{row.lost}</td>
              <td className="py-4 px-3 text-center font-mono tabular-nums text-xs">{row.goalsFor}</td>
              <td className="py-4 px-3 text-center font-mono tabular-nums text-xs">{row.goalsAgainst}</td>
              <td className="py-4 px-3 text-center font-mono tabular-nums text-xs font-bold">
                {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
              </td>
              <td className="py-4 px-3 text-center font-mono tabular-nums text-xs font-bold text-amber-600 dark:text-amber-400">
                {row.supporterPoints ?? 0}
              </td>
              <td className="py-4 px-3.5 text-center font-teko font-bold text-lg tabular-nums text-[var(--color-arena-primary)]">
                {row.points}
              </td>
              <td className="py-4 px-3.5 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEdit(row)}
                    title="Koreksi Skor & Poin"
                    className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(row.teamId, row.teamName)}
                    title="Hapus dari Klasemen"
                    className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-2 bg-[var(--bg-muted)]/50 border-t border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-muted)] flex items-center justify-between flex-wrap gap-2">
        <span>MN: Berapa kali Main • M: Poin Menang (+3) • S: Seri • K: Kalah • PS: Point Supporter (+1)</span>
        <span className="font-bold text-[var(--color-arena-primary)]">PTS = Menang + PS</span>
      </div>
    </div>
  );
};

