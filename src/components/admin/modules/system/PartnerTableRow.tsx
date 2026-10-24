'use client';

import React from 'react';
import { ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { TournamentPartner } from '@/types';
import { PARTNER_CATEGORY_LABELS } from '@/mocks/partnersData';
import { PartnerCard } from '@/components/public/PartnerCard';

interface PartnerTableRowProps {
  partner: TournamentPartner;
  index: number;
  totalCount: number;
  onMoveOrder: (index: number, direction: 'up' | 'down') => void;
  onToggleActive: (id: string) => void;
  onOpenEdit: (partner: TournamentPartner) => void;
  onDelete: (partner: TournamentPartner) => void;
}

export const PartnerTableRow: React.FC<PartnerTableRowProps> = ({
  partner,
  index,
  totalCount,
  onMoveOrder,
  onToggleActive,
  onOpenEdit,
  onDelete,
}) => {
  return (
    <tr className="hover:bg-[var(--bg-muted)]/30 transition-colors">
      {/* Order Controls */}
      <td className="py-3 px-3 text-center">
        <div className="flex items-center justify-center gap-1">
          <span className="font-bebas text-sm text-[var(--text-muted)] w-4">
            {partner.order}
          </span>
          <div className="flex flex-col">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => onMoveOrder(index, 'up')}
              className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-20"
              aria-label="Pindah ke atas"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              type="button"
              disabled={index === totalCount - 1}
              onClick={() => onMoveOrder(index, 'down')}
              className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-20"
              aria-label="Pindah ke bawah"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </td>

      {/* Partner Preview Card */}
      <td className="py-3 px-4">
        <div className="max-w-xs">
          <PartnerCard partner={partner} isInteractive={false} />
        </div>
      </td>

      {/* Category Badge */}
      <td className="py-3 px-3">
        <span
          className={`text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
            PARTNER_CATEGORY_LABELS[partner.category]?.badgeClass || 'bg-slate-500/15 text-slate-700'
          }`}
        >
          {PARTNER_CATEGORY_LABELS[partner.category]?.label || partner.category}
        </span>
      </td>

      {/* Website Link */}
      <td className="py-3 px-3">
        {partner.websiteUrl ? (
          <a
            href={partner.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[var(--color-arena-primary)] hover:underline truncate max-w-[120px]"
          >
            <ExternalLink className="w-3 h-3 shrink-0" />
            <span className="truncate">{partner.websiteUrl.replace(/^https?:\/\//, '')}</span>
          </a>
        ) : (
          <span className="text-[var(--text-muted)]">-</span>
        )}
      </td>

      {/* Active Toggle Switch */}
      <td className="py-3 px-3 text-center">
        <button
          type="button"
          onClick={() => onToggleActive(partner.id)}
          className={`btn-tactile px-2.5 py-1 rounded-full text-[10px] font-barlow font-bold uppercase tracking-wider border transition-all ${
            partner.isActive
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
              : 'bg-slate-500/10 border-slate-500/20 text-slate-500'
          }`}
        >
          {partner.isActive ? 'Aktif' : 'Disembunyikan'}
        </button>
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenEdit(partner)}
            className="text-[var(--color-arena-primary)] hover:underline font-bold text-xs"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(partner)}
            className="text-red-600 hover:underline font-bold text-xs"
          >
            Hapus
          </button>
        </div>
      </td>
    </tr>
  );
};
