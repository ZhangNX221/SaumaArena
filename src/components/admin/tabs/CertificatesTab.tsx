'use client';

import React, { useState } from 'react';
import { Award, Download, CheckCircle2, QrCode, FileText, Printer } from 'lucide-react';

interface CertificateItem {
  id: string;
  category: string;
  recipient: string;
  subtext: string;
  code: string;
  date: string;
  status: 'ISSUED' | 'READY';
}

const CERTIFICATES: CertificateItem[] = [
  {
    id: 'cert-1',
    category: 'Best Supporter Tribun MMFC I',
    recipient: 'Madrasah Ibtidaiyah Negeri 1 Kota',
    subtext: 'Basis suporter terkompak, koreo rebana terbaik & kehadiran tertinggi',
    code: 'CERT-MMFC-SUPP-001',
    date: '28 Okt 2026',
    status: 'ISSUED',
  },
  {
    id: 'cert-2',
    category: 'Juara 1 Futsal SD/MI',
    recipient: 'Madrasah Ibtidaiyah Negeri 1 Kota',
    subtext: 'Piala Bergilir MMFC I & Medali Emas Kejuaraan Pelajar',
    code: 'CERT-MMFC-CHAMP-001',
    date: '28 Okt 2026',
    status: 'READY',
  },
  {
    id: 'cert-3',
    category: 'Sepatu Emas (Top Scorer)',
    recipient: 'Muhammad Faiz (6 Gol)',
    subtext: 'Pemain Flank MIN 1 Kota',
    code: 'CERT-MMFC-TOP-001',
    date: '28 Okt 2026',
    status: 'READY',
  },
];

export const CertificatesTab: React.FC = () => {
  const [activeCert, setActiveCert] = useState<CertificateItem>(CERTIFICATES[0]);

  return (
    <div className="space-y-6">
      {/* List and Preview Split in FreeDash-lite Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Certificate List */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Daftar Piagam Penghargaan Resmi
          </div>
          <div className="space-y-2">
            {CERTIFICATES.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setActiveCert(cert)}
                className={`p-4 rounded-xl border transition-all cursor-pointer bg-[var(--bg-surface)] ${
                  activeCert.id === cert.id
                    ? 'border-[var(--color-arena-primary)] ring-2 ring-[var(--color-arena-primary)]/10 shadow-xs'
                    : 'border-[var(--border-subtle)] hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-[var(--color-arena-primary)]">
                    {cert.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)]">
                    Sah Ber-QR
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-[var(--text-main)] truncate">
                  {cert.recipient}
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                  {cert.code}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Live Certificate Preview Canvas */}
        <div className="lg:col-span-2">
          <div className="p-6 sm:p-8 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Pratinjau E-Sertifikat Digital
                </span>
                <h3 className="font-bold text-base text-[var(--text-main)] mt-0.5">
                  {activeCert.category}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Sertifikat ${activeCert.code} berhasil dicetak/diunduh!`)}
                  className="btn-tactile inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh PDF (300 DPI)</span>
                </button>
              </div>
            </div>

            {/* Official Certificate Box */}
            <div className="p-8 sm:p-10 rounded-xl bg-amber-50/40 dark:bg-amber-950/10 border-2 border-dashed border-[var(--color-arena-accent)]/80 text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 text-[var(--color-arena-accent)] flex items-center justify-center mx-auto shadow-2xs">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-800 dark:text-amber-300 font-mono">
                  PANITIA MILAD MATSANEGA I &bull; EKSTRAKURIKULER FUTSAL
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] font-[var(--font-display)] uppercase">
                  {activeCert.category}
                </h2>
                <div className="text-xs text-[var(--text-muted)]">
                  Turnamen Futsal Pelajar SD/MI Milad Matsanega Futsal Competition I (MMFC I)
                </div>
              </div>

              <div className="py-2">
                <span className="text-xs text-[var(--text-muted)] block">Dengan bangga dianugerahkan kepada:</span>
                <div className="text-xl sm:text-2xl font-black text-[var(--text-main)] font-[var(--font-display)] mt-1">
                  {activeCert.recipient}
                </div>
                <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto mt-1 leading-relaxed">
                  {activeCert.subtext}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 font-mono text-[var(--text-muted)]">
                  <QrCode className="w-4 h-4 text-[var(--color-arena-primary)]" />
                  <span>{activeCert.code}</span>
                </div>
                <div className="text-[var(--text-faint)]">
                  Diterbitkan di Malang: <strong>{activeCert.date}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
