'use client';

import React, { useState } from 'react';
import { QrCode, CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react';

export const GateScannerTab: React.FC = () => {
  const [scanCodeInput, setScanCodeInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanFeedback, setScanFeedback] = useState<{
    status: 'SUCCESS' | 'REPLAY' | 'INVALID';
    msg: string;
  } | null>(null);

  const handleScanTicket = async (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();
    const targetCode = (customCode || scanCodeInput).trim().toUpperCase();
    if (!targetCode) return;

    setIsLoading(true);
    setScanFeedback(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('sauma_auth_token') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/tickets/scan', {
        method: 'POST',
        headers,
        body: JSON.stringify({ bookingCode: targetCode, gateName: 'Gate Masuk Utama (Turnstile 1)' }),
      });

      const data = await res.json();

      if (data.success) {
        const t = data.ticket || {};
        const teamInfo = t.teamName ? ` (Suporter ${t.teamName})` : '';
        setScanFeedback({
          status: 'SUCCESS',
          msg: `Tiket terverifikasi atas nama ${t.buyerName || 'Penonton'}${teamInfo}. Akses pintu masuk dibuka dan kehadiran tercatat dalam database turnamen!`,
        });
      } else if (data.alreadyCheckedIn) {
        setScanFeedback({
          status: 'REPLAY',
          msg: data.error || 'PERINGATAN: Tiket sudah pernah digunakan sebelumnya. Akses ditolak!',
        });
      } else {
        setScanFeedback({
          status: 'INVALID',
          msg: data.error || `Kode tiket '${targetCode}' tidak ditemukan dalam database turnamen MMFC I.`,
        });
      }
    } catch {
      setScanFeedback({
        status: 'INVALID',
        msg: 'Gagal menghubungi server database scanner tiket. Periksa koneksi lokal.',
      });
    } finally {
      setIsLoading(false);
      setScanCodeInput('');
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6 shadow-xs max-w-xl mx-auto">
      <div className="aspect-video bg-[var(--arena-dark)] rounded-2xl relative flex flex-col items-center justify-center p-6 overflow-hidden border-2 border-dashed border-[var(--color-arena-primary)]/70 shadow-inner">
        <div className="w-36 h-36 sm:w-40 sm:h-40 border-2 border-[var(--color-arena-primary)] rounded-2xl relative flex items-center justify-center shadow-lg">
          <QrCode className="w-20 h-20 sm:w-24 sm:h-24 text-[var(--color-arena-primary)]/80" />
        </div>
        <span className="text-xs text-sky-200 font-barlow font-bold uppercase tracking-wider mt-3.5">
          Kamera Pemindai Siap &bull; Arahkan QR Code Tiket
        </span>
      </div>

      <form onSubmit={(e) => handleScanTicket(e)} className="space-y-4">
        <div>
          <label className="block text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
            Atau Masukkan Kode Tiket Manual:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={scanCodeInput}
              onChange={(e) => setScanCodeInput(e.target.value)}
              placeholder="Contoh: MMFC-REG-0941 atau SA-TIK-SDIKARDINA-1024"
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] font-mono text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
            />
            <button
              type="submit"
              disabled={isLoading || !scanCodeInput.trim()}
              className="btn-tactile px-5 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] active:scale-[0.98] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verifikasi'}
            </button>
          </div>
        </div>
      </form>

      {scanFeedback && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 animate-fadeIn ${
            scanFeedback.status === 'SUCCESS'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
              : scanFeedback.status === 'REPLAY'
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-300'
              : 'bg-red-500/15 border-red-500/30 text-red-800 dark:text-red-300'
          }`}
        >
          {scanFeedback.status === 'SUCCESS' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          ) : scanFeedback.status === 'REPLAY' ? (
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <span className="font-barlow font-bold uppercase tracking-wider text-xs block">
              {scanFeedback.status === 'SUCCESS'
                ? 'AKSES DIBERIKAN (BERHASIL CHECK-IN)'
                : scanFeedback.status === 'REPLAY'
                ? 'PERINGATAN: TIKET GANDA / SUDAH DIGUNAKAN'
                : 'TIKET TIDAK VALID'}
            </span>
            <p className="text-xs leading-relaxed font-sans">{scanFeedback.msg}</p>
          </div>
        </div>
      )}
    </div>
  );
};
