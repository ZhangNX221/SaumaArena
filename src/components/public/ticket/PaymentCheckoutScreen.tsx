'use client';

import React, { useState, useEffect } from 'react';
import { TicketOrderData } from '@/types/ticket';
import { QrCode, Copy, Check, Clock, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface PaymentCheckoutScreenProps {
  order: TicketOrderData;
  onPaymentSuccess: () => void;
  onCancel: () => void;
}

export const PaymentCheckoutScreen: React.FC<PaymentCheckoutScreenProps> = ({
  order,
  onPaymentSuccess,
  onCancel,
}) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 menit countdown
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const vaNumber = order.vaNumber || `8808${order.buyerPhone.replace(/\D/g, '').slice(-8)}99`;

  const handleCopyVA = () => {
    navigator.clipboard?.writeText(vaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1200);
  };

  const isQris = order.paymentChannel === 'QRIS';
  const isVA = order.paymentChannel.startsWith('VA_');
  const isCash = order.paymentChannel === 'CASH_GATE';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Info Tagihan */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--color-arena-primary)]">
            Total Pembayaran Tiket
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[var(--text-main)] font-mono tabular-nums tracking-tight">
            Rp {order.totalAmount.toLocaleString('id-ID')}
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {order.quantity}x {order.categoryName} &bull; {order.supportedTeamName}
          </p>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] self-start sm:self-auto text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
          <Clock className="w-4 h-4 animate-spin text-amber-500" style={{ animationDuration: '6s' }} />
          <span>Sisa Waktu: {timerDisplay}</span>
        </div>
      </div>

      {/* Screen QRIS */}
      {isQris && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>QRIS Standar Nasional Bank Indonesia (ASPI)</span>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-sm max-w-[260px] mx-auto">
            <div className="text-[10px] font-black text-slate-800 tracking-widest font-mono mb-2">
              QRIS PEMBAYARAN INSTAN
            </div>
            <div className="w-48 h-48 bg-slate-950 rounded-xl p-2.5 flex items-center justify-center text-white">
              <QrCode className="w-full h-full text-white" />
            </div>
            <div className="text-[10px] text-slate-600 font-bold mt-2">
              NMID: ID1026002948192
            </div>
          </div>

          <div className="max-w-md mx-auto text-xs text-[var(--text-muted)] space-y-1.5 leading-relaxed">
            <div className="font-extrabold text-[var(--text-main)] font-[var(--font-display)]">
              Cara Pembayaran Super Mudah:
            </div>
            <p>1. Buka m-banking (BCA, Mandiri, BRI, BNI) atau e-wallet (GoPay, OVO, DANA, ShopeePay).</p>
            <p>2. Arahkan kamera ke kode QR di atas dan konfirmasi nama: <strong>Sauma Arena - MMFC I</strong>.</p>
            <p>3. Setelah bayar di ponsel Anda, klik tombol konfirmasi di bawah ini.</p>
          </div>
        </div>
      )}

      {/* Screen Virtual Account */}
      {isVA && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-4">
          <div className="text-xs font-bold text-[var(--text-main)] font-[var(--font-display)]">
            Nomor Virtual Account {order.paymentChannelName}
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
            <div>
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono font-bold block">
                Nomor Pembayaran VA
              </span>
              <span className="text-lg sm:text-xl font-mono font-black text-[var(--color-arena-primary)] tracking-wider">
                {vaNumber}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyVA}
              className="btn-tactile px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-main)] hover:bg-[var(--color-arena-primary)] hover:text-white transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Nomor'}</span>
            </button>
          </div>

          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Transfer tepat sesuai nominal <strong>Rp {order.totalAmount.toLocaleString('id-ID')}</strong>. Verifikasi pembayaran berjalan otomatis dalam hitungan detik.
          </p>
        </div>
      )}

      {/* Screen Tunai di Loket Pintu Masuk */}
      {isCash && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div className="leading-relaxed">
              <strong>Pembayaran Tunai di Pintu Masuk:</strong> Anda akan mendapatkan E-Tiket berstatus <em>Reservasi Loket</em>. Siapkan uang pas <strong>Rp {order.totalAmount.toLocaleString('id-ID')}</strong> saat tiba di gerbang stadion MTsN 1 Malang.
            </div>
          </div>
        </div>
      )}

      {/* Tombol Aksi Verifikasi Pembayaran */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn-tactile w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-muted)] transition-colors min-h-[42px]"
        >
          Ganti Metode / Batal
        </button>

        <button
          type="button"
          disabled={isProcessing}
          onClick={handleSimulatePayment}
          className="btn-tactile w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-extrabold bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[42px]"
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {isProcessing
              ? 'Memverifikasi Pembayaran...'
              : isCash
              ? 'Konfirmasi & Terbitkan E-Tiket'
              : 'Saya Sudah Bayar (Cek Otomatis)'}
          </span>
        </button>
      </div>
    </div>
  );
};
