'use client';

import React from 'react';
import { X, CheckCircle2, Download, Printer } from 'lucide-react';
import { BAPRecord } from '@/mocks/refereeReportsData';

interface BAPPreviewModalProps {
  bap: BAPRecord | null;
  onClose: () => void;
}

export const BAPPreviewModal: React.FC<BAPPreviewModalProps> = ({ bap, onClose }) => {
  if (!bap) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#0D1E30] border border-[#1C3B5B] p-6 sm:p-7 space-y-4 text-white animate-scaleUp">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1C3B5B] pb-3.5">
          <div className="space-y-0.5">
            <h3 className="font-bebas text-2xl text-white tracking-wide uppercase leading-none">
              Salinan Berita Acara Pertandingan
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Dokumen resmi tervalidasi &bull; {bap.id.toUpperCase()}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-150 active:scale-95"
            aria-label="Tutup salinan BAP"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Match Details */}
        <div className="p-4 rounded-xl bg-[#07131F] border border-[#1C3B5B] space-y-1.5 text-center">
          <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-slate-400 block">
            Laga #{bap.matchNumber} &bull; {bap.sport}
          </span>
          <div className="font-barlow font-bold text-lg text-white">{bap.teams}</div>
          <div className="text-4xl font-scoreboard font-bold text-[#F6AE2D] tabular-nums leading-none">
            {bap.score}
          </div>
          <div className="text-xs text-slate-400 font-sans pt-0.5">
            {bap.court} &bull; {bap.date}
          </div>
        </div>

        {/* Referee Certification Details */}
        <div className="grid grid-cols-2 gap-3 text-xs font-sans">
          <div className="p-3 rounded-xl bg-[#13273D] border border-[#1C3B5B] space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-barlow font-bold">Wasit 1 (Utama)</span>
            <div className="font-bold text-white truncate">{bap.referee1}</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium pt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Tanda Tangan Sah</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#13273D] border border-[#1C3B5B] space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-barlow font-bold">Wasit 2 (Meja)</span>
            <div className="font-bold text-white truncate">{bap.referee2}</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium pt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Tanda Tangan Sah</span>
            </div>
          </div>
        </div>

        {/* Discipline Summary */}
        <div className="p-3 rounded-xl bg-[#13273D] border border-[#1C3B5B] flex items-center justify-between text-xs font-sans">
          <span className="text-slate-300">Catatan Disiplin Lapangan:</span>
          <div className="flex items-center gap-3 font-bold">
            <span className="text-amber-400">{bap.yellowCards} Kuning</span>
            <span className="text-red-400">{bap.redCards} Merah</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-tactile px-4 py-2 rounded-xl border border-[#1C3B5B] bg-white/5 hover:bg-white/10 active:scale-[0.98] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-150"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak BAP</span>
          </button>
          <button
            type="button"
            onClick={() => {
              alert(`Mengunduh dokumen BAP ${bap.id}.pdf`);
              onClose();
            }}
            className="btn-tactile px-4.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-150"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
