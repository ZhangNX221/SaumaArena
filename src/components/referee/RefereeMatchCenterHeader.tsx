'use client';

import React from 'react';
import { Radio, RotateCcw, CheckCircle2, Save, EyeOff } from 'lucide-react';
import { Match } from '@/types';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';

interface RefereeMatchCenterHeaderProps {
  currentMatch: Match;
  onResetMatch: () => void;
  onSaveMatch?: () => void;
  isSaving?: boolean;
  isLiveBroadcastActive?: boolean;
  onToggleLiveBroadcast?: (active: boolean) => void;
}

export const RefereeMatchCenterHeader: React.FC<RefereeMatchCenterHeaderProps> = ({
  currentMatch,
  onResetMatch,
  onSaveMatch,
  isSaving = false,
  isLiveBroadcastActive = true,
  onToggleLiveBroadcast,
}) => {
  const isCompleted = currentMatch.status === 'COMPLETED' || currentMatch.bapSigned;

  return (
    <AdminPageHeaderCard
      icon={Radio}
      category="MEJA LAPANGAN • PENCATATAN SKOR & WAKTU"
      badge={
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono font-bold text-[var(--text-main)] px-2 py-0.5 rounded-md bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
            Laga #{currentMatch.matchNumber} &bull; {currentMatch.courtName || 'Lapangan Utama'} &bull;{' '}
            {currentMatch.stage || 'Babak Penyisihan'}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
              isLiveBroadcastActive
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                : 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLiveBroadcastActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{isLiveBroadcastActive ? 'Siaran Publik: AKTIF' : 'Siaran Publik: MATI'}</span>
          </span>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-[10px] font-barlow font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3 h-3" />
              <span>Selesai (BAP Sah)</span>
            </span>
          )}
        </div>
      }
      title={
        <>
          {currentMatch.teamAName} <span className="text-[var(--color-arena-accent)]">VS</span>{' '}
          {currentMatch.teamBName}
        </>
      }
      description="Pusat kendali meja wasit: catat timer pertandingan, perolehan skor, dan insiden pelanggaran secara langsung."
      action={
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Tombol Sakelar Matikan / Aktifkan Live Skor Publik */}
          {onToggleLiveBroadcast && (
            <button
              type="button"
              onClick={() => onToggleLiveBroadcast(!isLiveBroadcastActive)}
              className={`btn-tactile px-3.5 py-2 rounded-xl text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer min-h-[38px] shadow-xs ${
                isLiveBroadcastActive
                  ? 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-500/50'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/50'
              }`}
              title={
                isLiveBroadcastActive
                  ? 'Siaran Live Skor sedang AKTIF ke publik. Klik untuk mematikan tampilan live skor.'
                  : 'Siaran Live Skor sedang MATI (penonton melihat pengumuman & jadwal laga berikutnya). Klik untuk menyalakan kembali.'
              }
            >
              {isLiveBroadcastActive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
                  <Radio className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Matikan Live Skor</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                  <span className="whitespace-nowrap">Aktifkan Live Skor</span>
                </>
              )}
            </button>
          )}

          {/* Tombol Simpan Riwayat Pertandingan (Selesai) */}
          {onSaveMatch && (
            <button
              type="button"
              onClick={onSaveMatch}
              disabled={isSaving}
              className={`btn-tactile px-3.5 py-2 rounded-xl text-white font-barlow font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50 min-h-[38px] ${
                isCompleted
                  ? 'bg-emerald-700 hover:bg-emerald-600 border border-emerald-500/40'
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
              title="Simpan riwayat pertandingan ini ke database dan tandai sebagai selesai"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Menyimpan...' : isCompleted ? 'Simpan Ulang' : 'Simpan Laga'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onResetMatch}
            className="btn-tactile px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-barlow font-bold uppercase tracking-wider text-xs border border-red-500/30 flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
            title="Reset Seluruh Skor & Waktu Laga Ini ke 0-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Laga</span>
          </button>

          <div className="px-4 py-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-center min-w-[110px]">
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              Skor Saat Ini
            </span>
            <span className="font-teko font-bold text-3xl text-[var(--color-arena-accent)] tabular-nums leading-none">
              {currentMatch.scoreA} - {currentMatch.scoreB}
            </span>
          </div>
        </div>
      }
    />
  );
};
