'use client';

import React from 'react';
import { TicketCategoryItem } from '@/types/ticket';
import { Check, Ticket, Star, Users, GraduationCap } from 'lucide-react';

interface TicketCategoryCardProps {
  category: TicketCategoryItem;
  isSelected: boolean;
  onSelect: () => void;
}

export const TicketCategoryCard: React.FC<TicketCategoryCardProps> = ({
  category,
  isSelected,
  onSelect,
}) => {
  const getIcon = () => {
    switch (category.id) {
      case 'PELAJAR':
        return <GraduationCap className="w-5 h-5" />;
      case 'ROMBONGAN':
        return <Users className="w-5 h-5" />;
      case 'VIP':
        return <Star className="w-5 h-5 text-amber-500 fill-amber-500" />;
      default:
        return <Ticket className="w-5 h-5" />;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-3 ${
        isSelected
          ? 'border-[var(--color-arena-primary)] bg-[var(--color-arena-primary-light)]/40 shadow-sm ring-2 ring-[var(--color-arena-primary)]/20'
          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--color-arena-primary)]/50 hover:bg-[var(--bg-muted)]/30'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 pb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                isSelected
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'bg-[var(--bg-muted)] text-[var(--color-arena-primary)]'
              }`}
            >
              {getIcon()}
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[var(--text-main)] font-[var(--font-display)] leading-tight">
                {category.name}
              </h4>
              {category.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--color-arena-accent)] text-slate-950 inline-block mt-0.5 shadow-2xs">
                  {category.badge}
                </span>
              )}
            </div>
          </div>

          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
              isSelected
                ? 'border-[var(--color-arena-primary)] bg-[var(--color-arena-primary)] text-white'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
            }`}
          >
            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1">
          {category.description}
        </p>
      </div>

      <div className="pt-2 border-t border-[var(--border-subtle)]/70 flex items-baseline justify-between">
        <span className="text-[11px] text-[var(--text-muted)] font-medium">Harga Tiket:</span>
        <div className="text-right">
          <span className="font-extrabold text-base sm:text-lg text-[var(--color-arena-primary)] font-mono tabular-nums">
            Rp {category.pricePerPerson.toLocaleString('id-ID')}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] block">
            {category.id === 'ROMBONGAN' ? '/ 5 orang' : '/ orang'}
          </span>
        </div>
      </div>
    </div>
  );
};
