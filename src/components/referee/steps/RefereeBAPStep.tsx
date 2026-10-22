'use client';

import React from 'react';
import { FileCheck, PenTool, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Match } from '@/types';

interface RefereeBAPStepProps {
  currentMatch: Match;
  captainASigned: boolean;
  captainBSigned: boolean;
  refereeSigned: boolean;
  refereeNotes: string;
  bapSubmitted: boolean;
  onSetCaptainASigned: (val: boolean) => void;
  onSetCaptainBSigned: (val: boolean) => void;
  onSetRefereeSigned: (val: boolean) => void;
  onSetRefereeNotes: (val: string) => void;
  onSaveBAP: () => void;
}

export const RefereeBAPStep: React.FC<RefereeBAPStepProps> = ({
  currentMatch,
  captainASigned,
  captainBSigned,
  refereeSigned,
  refereeNotes,
  bapSubmitted,
  onSetCaptainASigned,
  onSetCaptainBSigned,
  onSetRefereeSigned,
  onSetRefereeNotes,
  onSaveBAP,
}) => {
  const winner =
    currentMatch.scoreA > currentMatch.scoreB
      ? currentMatch.teamAName
      : currentMatch.scoreB > currentMatch.scoreA
      ? currentMatch.teamBName
      : 'Hasil Imbang (Seri)';

  return (
    <div className="p-5 sm:p-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h3 className="font-black text-base sm:text-lg text-[var(--text-main)] font-[var(--font-display)] flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-600" />
            <span>Pengesahan Berita Acara Pertandingan (BAP)</span>
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Langkah final: tanda tangan digital di layar oleh kedua kapten dan juri sebelum diserahkan ke meja panitia.
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900 text-white text-center font-mono text-sm px-4">
          Skor Akhir: <strong>{currentMatch.scoreA} - {currentMatch.scoreB}</strong>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[var(--bg-muted)]/70 border border-[var(--border-subtle)] space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-[var(--text-muted)]">Pemenang Resmi:</span>
          <span className="font-bold text-[var(--text-main)]">{winner}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--text-muted)]">Status BAP:</span>
          <span className="font-bold text-emerald-600">
            {bapSubmitted ? 'Sah & Dikunci Komisioner' : 'Menunggu Tanda Tangan Lapangan'}
          </span>
        </div>
      </div>

      {/* Catatan Khusus Juri */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[var(--text-main)] block">Catatan Khusus Juri Lapangan</label>
        <textarea
          rows={3}
          value={refereeNotes}
          onChange={(e) => onSetRefereeNotes(e.target.value)}
          placeholder="Tuliskan catatan kejadian penting atau insiden..."
          className="w-full p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 text-xs text-[var(--text-main)] leading-relaxed focus:outline-none focus:border-[#33658a]"
        />
      </div>

      {/* Digital Signature Pads */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {/* Kapten A Signature */}
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 text-center space-y-3">
          <span className="text-xs font-bold text-[var(--text-main)] block truncate">
            Kapten {currentMatch.teamAName}
          </span>
          <div
            onClick={() => onSetCaptainASigned(!captainASigned)}
            className={`h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
              captainASigned
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold'
                : 'border-[var(--border-subtle)] hover:border-[#33658a] text-[var(--text-muted)] text-[11px]'
            }`}
          >
            {captainASigned ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Sah: Ditandatangani</span>
              </span>
            ) : (
              <span className="flex flex-col items-center gap-1">
                <PenTool className="w-4 h-4 opacity-50" />
                <span>Tap untuk Tanda Tangan</span>
              </span>
            )}
          </div>
        </div>

        {/* Kapten B Signature */}
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 text-center space-y-3">
          <span className="text-xs font-bold text-[var(--text-main)] block truncate">
            Kapten {currentMatch.teamBName}
          </span>
          <div
            onClick={() => onSetCaptainBSigned(!captainBSigned)}
            className={`h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
              captainBSigned
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold'
                : 'border-[var(--border-subtle)] hover:border-[#33658a] text-[var(--text-muted)] text-[11px]'
            }`}
          >
            {captainBSigned ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Sah: Ditandatangani</span>
              </span>
            ) : (
              <span className="flex flex-col items-center gap-1">
                <PenTool className="w-4 h-4 opacity-50" />
                <span>Tap untuk Tanda Tangan</span>
              </span>
            )}
          </div>
        </div>

        {/* Juri Signature */}
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 text-center space-y-3">
          <span className="text-xs font-bold text-[var(--text-main)] block truncate">Juri Utama (FFI)</span>
          <div
            onClick={() => onSetRefereeSigned(!refereeSigned)}
            className={`h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
              refereeSigned
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold'
                : 'border-[var(--border-subtle)] hover:border-[#33658a] text-[var(--text-muted)] text-[11px]'
            }`}
          >
            {refereeSigned ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Sah: Ditandatangani</span>
              </span>
            ) : (
              <span className="flex flex-col items-center gap-1">
                <PenTool className="w-4 h-4 opacity-50" />
                <span>Tap untuk Tanda Tangan</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Finalize Button */}
      <button
        type="button"
        disabled={bapSubmitted || (!captainASigned && !refereeSigned)}
        onClick={onSaveBAP}
        className={`btn-tactile w-full py-3.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-xs transition-all ${
          bapSubmitted
            ? 'bg-emerald-600 text-white cursor-default'
            : 'bg-[#33658a] hover:bg-[#264e6b] text-white'
        }`}
      >
        <ShieldCheck className="w-4 h-4" />
        <span>{bapSubmitted ? 'BAP Resmi Telah Disahkan & Dikirim ke Komisioner' : 'Sahkan & Kunci Berita Acara (BAP)'}</span>
      </button>
    </div>
  );
};
