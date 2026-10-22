'use client';

import React from 'react';
import { PaymentChannelType } from '@/types/ticket';
import { PAYMENT_CHANNELS } from '@/mocks/ticketConfig';
import { QrCode, Building2, Wallet, Banknote, Check } from 'lucide-react';

interface PaymentMethodSelectorProps {
  selectedChannel: PaymentChannelType;
  onSelectChannel: (channel: PaymentChannelType) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedChannel,
  onSelectChannel,
}) => {
  const getGroupIcon = (group: string) => {
    switch (group) {
      case 'QRIS':
        return <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'VA':
        return <Building2 className="w-4 h-4 text-[var(--color-arena-primary)]" />;
      case 'EWALLET':
        return <Wallet className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      default:
        return <Banknote className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-[var(--text-main)] font-[var(--font-display)]">
          Pilih Metode Pembayaran
        </label>
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
          Gunakan QRIS untuk verifikasi instan dari seluruh aplikasi perbankan &amp; dompet digital di Indonesia.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {PAYMENT_CHANNELS.map((channel) => {
          const isSelected = selectedChannel === channel.id;
          return (
            <div
              key={channel.id}
              onClick={() => onSelectChannel(channel.id)}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'border-[var(--color-arena-primary)] bg-[var(--color-arena-primary-light)]/50 shadow-xs ring-1 ring-[var(--color-arena-primary)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--color-arena-primary)]/40 hover:bg-[var(--bg-muted)]/40'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-[var(--color-arena-primary)] text-white shadow-2xs'
                      : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
                  }`}
                >
                  {getGroupIcon(channel.group)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-xs text-[var(--text-main)] truncate">
                      {channel.name}
                    </span>
                    {channel.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {channel.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] truncate max-w-[220px]">
                    {channel.desc}
                  </p>
                </div>
              </div>

              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'border-[var(--color-arena-primary)] bg-[var(--color-arena-primary)] text-white'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
                }`}
              >
                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
