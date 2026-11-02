'use client';

import React from 'react';
import { Radio } from 'lucide-react';

interface LiveBroadcastDisabledBannerProps {
  onEnable: () => void;
}

export const LiveBroadcastDisabledBanner: React.FC<LiveBroadcastDisabledBannerProps> = ({ onEnable }) => (
  <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-900 dark:text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn shadow-xs">
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
        <Radio className="w-4 h-4" />
      </div>
      <div>
        <span className="font-barlow font-bold uppercase tracking-wider block">
          Siaran Live Skor Publik Sedang Dinonaktifkan
        </span>
        <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
          Penonton di layar publik saat ini melihat pemberitahuan jeda dan jadwal pertandingan berikutnya.
        </span>
      </div>
    </div>
    <button
      type="button"
      onClick={onEnable}
      className="btn-tactile px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-barlow font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto cursor-pointer shadow-xs whitespace-nowrap"
    >
      Nyalakan Kembali
    </button>
  </div>
);

