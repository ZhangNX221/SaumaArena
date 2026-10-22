'use client';

import React from 'react';
import { QrCode, CheckCircle2, Download, Printer, ShieldCheck, Calendar, Users, MapPin } from 'lucide-react';
import { TeamRegistrationData } from '@/types/registration';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';

interface StepRegistrationSlipProps {
  data: TeamRegistrationData;
  onDone: () => void;
}

export const StepRegistrationSlip: React.FC<StepRegistrationSlipProps> = ({ data, onDone }) => {
  const regCode = data.regCode || `MMFC1-REG-2026-${Math.floor(100 + Math.random() * 900)}`;
  const submittedTime = data.submittedAt || new Date().toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSlip = () => {
    alert(`File bukti pendaftaran digital ${regCode} berhasil diunduh. Simpan dan bawa saat Technical Meeting di MTsN 1 Kota Malang.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner Notifikasi Pendaftaran Berhasil */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h4 className="font-extrabold text-sm sm:text-base font-[var(--font-display)] text-emerald-950 dark:text-emerald-100">
            Formulir Pendaftaran Berhasil Dikirimkan!
          </h4>
          <p className="text-xs text-emerald-800/90 dark:text-emerald-300 mt-0.5 leading-relaxed">
            Data delegasi <strong>{data.teamName}</strong> telah diterima sistem dan masuk antrean verifikasi administratif panitia pelaksana.
          </p>
        </div>
      </div>

      {/* Kartu Slip Registrasi Resmi Turnamen */}
      <div className="rounded-2xl border-2 border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-7 shadow-lg space-y-6 relative overflow-hidden">
        {/* Watermark / Header Accent */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <SaumaArenaLogo size="md" variant="auto" />
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--color-arena-primary)] block">
                SLIP REGISTRASI RESMI &bull; MMFC I 2026
              </span>
              <h3 className="font-black text-lg text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
                {data.teamName}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                {data.schoolName} &bull; {data.city}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase font-bold">
              Kode Registrasi
            </span>
            <span className="text-base sm:text-lg font-black font-mono tracking-wider text-[var(--color-arena-primary)] bg-[var(--color-arena-primary-light)] px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] inline-block mt-0.5">
              {regCode}
            </span>
          </div>
        </div>

        {/* Ringkasan Delegasi Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
              <span>Waktu Pengajuan</span>
            </span>
            <div className="font-bold text-[var(--text-main)]">{submittedTime} WIB</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Status: Menunggu Verifikasi</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5 font-mono">
              <Users className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
              <span>Manajer &amp; Pelatih</span>
            </span>
            <div className="font-bold text-[var(--text-main)] truncate">{data.managerName}</div>
            <div className="text-[11px] text-[var(--text-muted)] font-mono">{data.managerPhone}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5 font-mono">
              <MapPin className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
              <span>Skuad &amp; Seragam</span>
            </span>
            <div className="font-bold text-[var(--text-main)]">{data.players.length} Pemain Sah</div>
            <div className="text-[11px] text-[var(--text-muted)] truncate">Jersey: {data.jerseyHomeColor}</div>
          </div>
        </div>

        {/* QR Code & Instruksi Technical Meeting */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-[var(--color-arena-primary-light)]/60 border border-[var(--color-arena-primary)]/20">
          <div className="w-24 h-24 rounded-xl bg-white p-2 border border-[var(--border-subtle)] flex items-center justify-center shrink-0 shadow-xs">
            <QrCode className="w-full h-full text-slate-900" />
          </div>
          <div className="text-xs space-y-1 text-center sm:text-left leading-relaxed">
            <div className="font-extrabold text-[var(--text-main)] font-[var(--font-display)]">
              Instruksi Selanjutnya untuk Manajer Tim:
            </div>
            <p className="text-[var(--text-muted)]">
              1. Simpan tangkapan layar atau unduh slip pendaftaran ini sebagai bukti pendaftaran resmi.
            </p>
            <p className="text-[var(--text-muted)]">
              2. Bawa berkas fisik (surat tugas kepala sekolah dan fotokopi kartu pelajar) pada saat Technical Meeting di Aula MTsN 1 Kota Malang.
            </p>
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadSlip}
            className="btn-tactile px-4 py-2.5 rounded-xl text-xs font-bold border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors flex items-center gap-2 min-h-[42px]"
          >
            <Download className="w-4 h-4 text-[var(--color-arena-primary)]" />
            <span>Unduh Slip Digital</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="btn-tactile px-4 py-2.5 rounded-xl text-xs font-bold border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors flex items-center gap-2 min-h-[42px]"
          >
            <Printer className="w-4 h-4 text-[var(--color-arena-primary)]" />
            <span>Cetak Slip</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onDone}
          className="btn-tactile px-6 py-2.5 rounded-xl text-xs font-extrabold bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white shadow-xs transition-colors min-h-[42px]"
        >
          Selesai &amp; Kembali ke Halaman Utama
        </button>
      </div>
    </div>
  );
};
