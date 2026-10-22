'use client';

import React from 'react';
import { TicketOrderData } from '@/types/ticket';
import { QrCode, Download, Share2, Printer, CheckCircle2, MapPin, Calendar, Users, Award } from 'lucide-react';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';

interface TicketSuccessPassProps {
  order: TicketOrderData;
  ticketCode: string;
  onReset: () => void;
  onClose: () => void;
}

export const TicketSuccessPass: React.FC<TicketSuccessPassProps> = ({
  order,
  ticketCode,
  onReset,
  onClose,
}) => {
  const handleDownload = () => {
    alert(`E-Tiket ${ticketCode} berhasil disimpan ke memori perangkat. Tunjukkan barcode saat tiba di pintu masuk.`);
  };

  const handleShareWA = () => {
    const text = `Halo, ini E-Tiket Masuk resmi Milad Matsanega Futsal Competition I (MMFC I 2026). Kode Tiket: ${ticketCode} atas nama ${order.buyerName} (${order.quantity} orang). Venue: Matsanega Futsal Court, MTsN 1 Kota Malang.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner Selamat */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h4 className="font-extrabold text-sm sm:text-base font-[var(--font-display)] text-emerald-950 dark:text-emerald-100">
            E-Tiket Pertandingan Resmi Diterbitkan!
          </h4>
          <p className="text-xs text-emerald-800 dark:text-emerald-300">
            Bukti akses masuk otomatis siap dipakai. Tidak perlu ditukar tiket fisik.
          </p>
        </div>
      </div>

      {/* Kartu Fisik E-Tiket Visual Modern Stadion Pass */}
      <div className="rounded-3xl border-2 border-[var(--border-subtle)] bg-white text-slate-950 shadow-xl overflow-hidden relative">
        {/* Top Strip */}
        <div className="bg-[var(--color-arena-primary)] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SaumaArenaLogo size="sm" variant="light" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-200 font-bold block">
                E-TIKET RESMI PERTANDINGAN
              </span>
              <h3 className="font-black text-base sm:text-lg font-[var(--font-display)] tracking-tight">
                Milad Matsanega I (MMFC I)
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-blue-200 block uppercase font-bold">
              Kategori
            </span>
            <span className="text-xs sm:text-sm font-extrabold bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-xs font-mono">
              {order.categoryName}
            </span>
          </div>
        </div>

        {/* Body Tiket */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* QR Code Barcode Area */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-36 h-36 bg-[#0c2340] rounded-2xl p-2 flex items-center justify-center text-white shrink-0 shadow-sm">
              <QrCode className="w-32 h-32 text-white" />
            </div>

            <div className="space-y-2 text-center sm:text-left min-w-0 flex-1">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
                  Kode Akses Pintu Masuk
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono tracking-wider text-[var(--color-arena-primary)]">
                  {ticketCode}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-0.5">
                <div>Pemegang Tiket: <strong className="text-slate-900 font-bold">{order.buyerName}</strong></div>
                <div>Jumlah Masuk: <strong className="text-slate-900 font-bold font-mono">{order.quantity} Orang</strong></div>
                <div>Dukungan Suporter: <strong className="text-[var(--color-arena-primary)] font-bold">{order.supportedTeamName}</strong></div>
              </div>

              <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 inline-block">
                Status: {order.paymentChannel === 'CASH_GATE' ? 'Bayar Tunai di Pintu' : 'Lunas & Sah (Verified)'}
              </div>
            </div>
          </div>

          {/* Venue & Informasi Jadwal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-dashed border-slate-200">
            <div className="flex items-start gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-[var(--color-arena-primary)] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">Matsanega Futsal Court</div>
                <div className="text-[11px] text-slate-500">Kampus MTsN 1 Kota Malang, Jawa Timur</div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-700">
              <Calendar className="w-4 h-4 text-[var(--color-arena-primary)] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">24 - 28 Oktober 2026</div>
                <div className="text-[11px] text-slate-500">Buka Gate Pukul 07:30 WIB s/d Selesai Laga</div>
              </div>
            </div>
          </div>

          {/* Catatan Penting */}
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 leading-relaxed">
            Tunjukkan kode QR di atas kepada petugas scan tiket di pintu masuk stadion. Setiap scan akan otomatis menambah <strong>+{order.quantity} poin kehadiran</strong> untuk sekolah pilihan Anda di Klasemen Suporter Terbaik!
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="btn-tactile px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--border-subtle)] transition-colors flex items-center gap-1.5 min-h-[42px]"
          >
            <Download className="w-4 h-4 text-[var(--color-arena-primary)]" />
            <span>Simpan Gambar</span>
          </button>

          <button
            type="button"
            onClick={handleShareWA}
            className="btn-tactile px-3.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 min-h-[42px] shadow-2xs"
          >
            <Share2 className="w-4 h-4" />
            <span>Kirim ke WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="btn-tactile px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--border-subtle)] transition-colors flex items-center gap-1.5 min-h-[42px]"
          >
            <Printer className="w-4 h-4 text-[var(--color-arena-primary)]" />
            <span>Cetak Tiket</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="btn-tactile px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-muted)] transition-colors min-h-[42px]"
          >
            Pesan Tiket Lain
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn-tactile px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white shadow-xs transition-colors min-h-[42px]"
          >
            Tutup &amp; Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
