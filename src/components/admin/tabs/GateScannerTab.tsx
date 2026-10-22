'use client';

import React, { useState } from 'react';
import { QrCode, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export const GateScannerTab: React.FC = () => {
  const [scanCodeInput, setScanCodeInput] = useState('');
  const [scanFeedback, setScanFeedback] = useState<{
    status: 'SUCCESS' | 'REPLAY' | 'INVALID';
    msg: string;
  } | null>(null);

  const handleScanTicket = (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();
    const targetCode = (customCode || scanCodeInput).trim().toUpperCase();
    if (!targetCode) return;

    if (targetCode.includes('MIN1') || targetCode.includes('SMAN1') || targetCode.includes('0941')) {
      setScanFeedback({
        status: 'SUCCESS',
        msg: 'Tiket terverifikasi atas nama Budi Santoso (MIN 1 Kota Malang). Akses masuk Gate Utama dibuka dan 1 poin suporter resmi tercatat.',
      });
    } else if (targetCode.includes('USED') || targetCode.includes('1024')) {
      setScanFeedback({
        status: 'REPLAY',
        msg: 'Tiket ini telah digunakan sebelumnya pada pukul 09.30 WIB di Gate Masuk Matsanega. Silakan arahkan penonton ke meja bantuan panitia jika terjadi kekeliruan.',
      });
    } else {
      setScanFeedback({
        status: 'INVALID',
        msg: 'Kode tiket tidak ditemukan dalam database turnamen. Mohon periksa kembali kode pada e-tiket penonton atau hubungi panitia.',
      });
    }
    setScanCodeInput('');
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6 shadow-xs max-w-xl mx-auto">
      <div className="text-center space-y-2">
        <h3 className="font-extrabold text-lg sm:text-xl text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
          Pemindai Pintu Masuk Arena (Gate Scanner)
        </h3>
        <p className="text-xs text-[var(--text-muted)] font-[var(--font-sans)] max-w-md mx-auto leading-relaxed">
          Pindai QR code e-tiket penonton untuk memberikan izin masuk dan mencatat poin kehadiran suporter sekolah secara otomatis.
        </p>
      </div>

      {/* Scanner View Simulation Box */}
      <div className="aspect-video bg-[var(--arena-dark)] rounded-2xl relative flex flex-col items-center justify-center p-6 overflow-hidden border-2 border-dashed border-[var(--color-arena-primary)]/70 shadow-inner">
        <div className="w-36 h-36 sm:w-40 sm:h-40 border-2 border-[var(--color-arena-primary)] rounded-2xl relative flex items-center justify-center shadow-lg">
          <QrCode className="w-20 h-20 sm:w-24 sm:h-24 text-[var(--color-arena-primary)]/80" />
        </div>
        <span className="text-xs text-sky-200 font-[var(--font-mono)] mt-3.5 font-medium">
          Kamera Pemindai Siap &bull; Arahkan QR Code Tiket
        </span>
      </div>

      {/* Form Input Kode Manual */}
      <form onSubmit={(e) => handleScanTicket(e)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5 font-[var(--font-display)]">
            Atau Masukkan Kode Tiket Manual:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={scanCodeInput}
              onChange={(e) => setScanCodeInput(e.target.value)}
              placeholder="Contoh: SA-TIK-MIN1-0941"
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] font-[var(--font-mono)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
            />
            <button
              type="submit"
              className="btn-tactile px-5 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-bold text-xs font-[var(--font-display)] hover:bg-[var(--color-arena-primary-hover)] transition-colors min-h-[40px] shrink-0 shadow-xs"
            >
              Verifikasi
            </button>
          </div>
        </div>

        {/* Quick Sample Test Chips (Frictionless QA) */}
        <div className="flex items-center gap-2 pt-1 text-xs text-[var(--text-muted)] flex-wrap">
          <span className="font-bold text-[var(--text-faint)] font-[var(--font-display)]">Coba Cepat:</span>
          <button
            type="button"
            onClick={() => handleScanTicket(undefined, 'SA-TIK-MIN1-0941')}
            className="btn-tactile px-3 py-1.5 rounded-xl bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary)]/20 font-[var(--font-mono)] text-xs font-bold transition-colors"
          >
            MIN 1 (Sah)
          </button>
          <button
            type="button"
            onClick={() => handleScanTicket(undefined, 'SA-TIK-USED-1024')}
            className="btn-tactile px-3 py-1.5 rounded-xl bg-red-500/10 text-red-700 dark:text-red-300 hover:bg-red-500/20 font-[var(--font-mono)] text-xs font-bold transition-colors"
          >
            USED (Sudah Dipakai)
          </button>
          <button
            type="button"
            onClick={() => handleScanTicket(undefined, 'SA-TIK-UNKNOWN-0000')}
            className="btn-tactile px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 font-[var(--font-mono)] text-xs font-bold transition-colors"
          >
            TEST (Tidak Terdaftar)
          </button>
        </div>

        {/* Humanist Feedback Toast */}
        {scanFeedback && (
          <div
            className={`p-4 rounded-xl text-xs font-medium animate-fadeIn flex items-start gap-3 border ${
              scanFeedback.status === 'SUCCESS'
                ? 'bg-[var(--color-arena-primary)]/10 text-[var(--text-main)] border-[var(--color-arena-primary)]/30'
                : scanFeedback.status === 'REPLAY'
                ? 'bg-red-50 dark:bg-red-950/60 text-red-900 dark:text-red-200 border-red-300 dark:border-red-800'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
            }`}
          >
            {scanFeedback.status === 'SUCCESS' && <CheckCircle2 className="w-5 h-5 text-[var(--color-arena-primary)] shrink-0 mt-0.5" />}
            {scanFeedback.status === 'REPLAY' && <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />}
            {scanFeedback.status === 'INVALID' && <XCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
            <span className="leading-relaxed font-[var(--font-sans)]">{scanFeedback.msg}</span>
          </div>
        )}
      </form>
    </div>
  );
};
