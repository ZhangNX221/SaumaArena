'use client';

import React from 'react';
import { TicketManagementTab } from './ticketing/TicketManagementTab';
import { TransactionHistoryTab } from './ticketing/TransactionHistoryTab';
import { GateScannerTab } from '../tabs/GateScannerTab';

interface AdminTicketingModuleProps {
  subTab: 'ticket_management' | 'transaction_history' | 'qr_scanner_gate';
  onSelectSubTab: (tab: 'ticket_management' | 'transaction_history' | 'qr_scanner_gate') => void;
}

export const AdminTicketingModule: React.FC<AdminTicketingModuleProps> = ({ subTab, onSelectSubTab }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Header & Segmented Pill Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
            Tiket &amp; Akses Gate Masuk
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-[var(--font-sans)] mt-1">
            Kelola alokasi kuota tiket per kategori, pantau riwayat transaksi riil, dan validasi tiket QR di gate masuk.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-[var(--bg-muted)]/80 border border-[var(--border-subtle)] text-xs font-bold font-[var(--font-display)] w-fit">
          <button
            type="button"
            onClick={() => onSelectSubTab('ticket_management')}
            className={`btn-tactile px-4 py-2 rounded-xl transition-all ${
              subTab === 'ticket_management'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Kuota Tiket
          </button>
          <button
            type="button"
            onClick={() => onSelectSubTab('transaction_history')}
            className={`btn-tactile px-4 py-2 rounded-xl transition-all ${
              subTab === 'transaction_history'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Riwayat Transaksi
          </button>
          <button
            type="button"
            onClick={() => onSelectSubTab('qr_scanner_gate')}
            className={`btn-tactile px-4 py-2 rounded-xl transition-all ${
              subTab === 'qr_scanner_gate'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Scanner Gate
          </button>
        </div>
      </div>

      {/* View 1: Ticket Management */}
      {subTab === 'ticket_management' && <TicketManagementTab />}

      {/* View 2: Transaction History */}
      {subTab === 'transaction_history' && <TransactionHistoryTab />}

      {/* View 3: QR Scanner Gate */}
      {subTab === 'qr_scanner_gate' && <GateScannerTab />}
    </div>
  );
};

