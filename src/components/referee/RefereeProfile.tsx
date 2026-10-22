'use client';

import React, { useState } from 'react';
import { User, Award, ShieldCheck, CheckCircle2, Moon, Sun, ToggleLeft, ToggleRight, DollarSign } from 'lucide-react';
import { AppUser } from '@/types';

interface RefereeProfileProps {
  user: AppUser;
  onUpdateAvailability?: (status: boolean) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const RefereeProfile: React.FC<RefereeProfileProps> = ({
  user,
  onUpdateAvailability,
  darkMode,
  onToggleDarkMode,
}) => {
  const [isAvailable, setIsAvailable] = useState(user.isAvailable ?? true);

  const toggleAvailability = () => {
    const next = !isAvailable;
    setIsAvailable(next);
    onUpdateAvailability?.(next);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] font-[var(--font-display)]">
          Profil Juri &amp; Status Ketersediaan
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Atur kesiapan bertugas Anda agar komisioner pertandingan dapat melakukan plotting jadwal dadakan secara akurat.
        </p>
      </div>

      {/* Main Status Toggle Card */}
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0b1a28] text-[#f6ae2d] flex items-center justify-center font-black text-xl shadow-xs">
            {user.avatarText || 'RH'}
          </div>
          <div>
            <h3 className="font-black text-base text-[var(--text-main)]">{user.name}</h3>
            <p className="text-xs text-[var(--text-muted)]">{user.roleLabel}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-muted)]">
                {user.licenseLevel || 'Lisensi 2 Nasional FFI'}
              </span>
            </div>
          </div>
        </div>

        {/* Big Availability Toggle Button */}
        <button
          type="button"
          onClick={toggleAvailability}
          className={`btn-tactile px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-3 transition-all min-h-[50px] shadow-xs ${
            isAvailable
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          {isAvailable ? <CheckCircle2 className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
          <span>{isAvailable ? 'Status: Siap Bertugas' : 'Status: Sedang Istirahat'}</span>
        </button>
      </div>

      {/* Statistics and Duty History Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-[var(--text-muted)]">Total Laga Dipimpin</span>
          <div className="text-2xl font-black font-mono text-[var(--text-main)]">12 Laga</div>
          <span className="text-[10px] text-[#33658a] font-bold">MMFC I Matsanega 2026</span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-[var(--text-muted)]">Akurasi BAP Disahkan</span>
          <div className="text-2xl font-black font-mono text-emerald-600">100%</div>
          <span className="text-[10px] text-[var(--text-muted)]">12 / 12 Laga Ditandatangani</span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-[var(--text-muted)]">Honorarium Tugas</span>
          <div className="text-2xl font-black font-mono text-[#f6ae2d]">Rp 3.600.000</div>
          <span className="text-[10px] text-[var(--text-muted)]">Panitia MMFC I Official</span>
        </div>
      </div>

      {/* High Contrast / Outdoor Display Setting */}
      {onToggleDarkMode && (
        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex items-center justify-between">
          <div>
            <div className="font-bold text-xs sm:text-sm text-[var(--text-main)]">
              Mode Tampilan Layar Lapangan
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Aktifkan mode kontras tinggi saat memimpin di bawah sinar matahari atau lampu sorot malam hari.
            </p>
          </div>
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="btn-tactile px-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-xs font-bold flex items-center gap-2"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span>{darkMode ? 'Mode Siang' : 'Mode Malam'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
