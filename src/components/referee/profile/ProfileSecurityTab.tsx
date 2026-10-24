'use client';

import React from 'react';
import { Lock } from 'lucide-react';

interface ProfileSecurityTabProps {
  deskPin: string;
  setDeskPin: (v: string) => void;
  oldPassword: string;
  setOldPassword: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
}

export const ProfileSecurityTab: React.FC<ProfileSecurityTabProps> = ({
  deskPin,
  setDeskPin,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-4 animate-fadeIn">
      <h3 className="font-bebas text-lg sm:text-xl uppercase tracking-wide text-[var(--text-main)] flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
        <Lock className="w-4 h-4 text-[#33658a]" />
        <span>Keamanan Kata Sandi &amp; Akses Meja Skor</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
            PIN Cepat Meja Juri (4 Digit)
          </label>
          <input
            type="password"
            maxLength={4}
            value={deskPin}
            onChange={(e) => setDeskPin(e.target.value)}
            placeholder="2026"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs font-mono tracking-widest text-[var(--text-main)] focus:outline-none focus:border-[#33658a]"
          />
          <p className="text-[10px] text-[var(--text-muted)]">
            Digunakan untuk konfirmasi cepat tanda tangan BAP di tablet lapangan.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Kata Sandi Saat Ini
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[#33658a]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Kata Sandi Baru
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimal 8 karakter"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[#33658a]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Konfirmasi Kata Sandi Baru
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi sandi baru"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[#33658a]"
          />
        </div>
      </div>
    </div>
  );
};
