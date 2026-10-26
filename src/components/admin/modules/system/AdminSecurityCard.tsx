'use client';

import React, { useState } from 'react';
import { Key, Lock, CheckCircle2 } from 'lucide-react';

export const AdminSecurityCard: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authPin, setAuthPin] = useState('882910');
  const [isPinVisible, setIsPinVisible] = useState(false);

  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!currentPassword) {
      setPasswordError('Masukkan kata sandi saat ini untuk konfirmasi');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Kata sandi baru minimal 6 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi tidak cocok');
      return;
    }

    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-[var(--color-arena-accent)]" />
          <h3 className="text-sm font-barlow font-bold uppercase tracking-wider text-[var(--text-main)]">
            Keamanan &amp; Kata Sandi
          </h3>
        </div>
        <span className="text-[11px] text-[var(--text-muted)]">Diperbarui 14 hari yang lalu</span>
      </div>

      <form onSubmit={handleSavePassword} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="font-semibold text-[var(--text-main)]">Kata Sandi Saat Ini</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-[var(--text-main)]">Kata Sandi Baru</label>
            <input
              type="password"
              placeholder="Min. 6 karakter"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-[var(--text-main)]">Konfirmasi Sandi Baru</label>
            <input
              type="password"
              placeholder="Ulangi kata sandi"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
            />
          </div>
        </div>

        {passwordError && (
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-bold">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Kata sandi baru berhasil disimpan!</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span className="text-[11px] text-[var(--text-muted)]">
              Disarankan menggabungkan huruf, angka, dan simbol.
            </span>
          </div>
          <button
            type="submit"
            className="btn-tactile px-4 py-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider hover:bg-[var(--bg-surface)]"
          >
            Ganti Kata Sandi
          </button>
        </div>
      </form>

      {/* PIN Otorisasi Cepat */}
      <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <div className="font-semibold text-[var(--text-main)]">PIN Otorisasi 6-Digit</div>
          <p className="text-[11px] text-[var(--text-muted)]">
            Digunakan untuk konfirmasi cepat pembatalan laga, override skor, atau sanksi diskualifikasi.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type={isPinVisible ? 'text' : 'password'}
            maxLength={6}
            value={authPin}
            onChange={(e) => setAuthPin(e.target.value.replace(/\D/g, ''))}
            className="w-24 px-3 py-1.5 text-center font-mono font-bold tracking-widest rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
          />
          <button
            type="button"
            onClick={() => setIsPinVisible(!isPinVisible)}
            className="px-2.5 py-1.5 text-[11px] rounded-lg bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] font-semibold"
          >
            {isPinVisible ? 'Sembunyikan' : 'Lihat'}
          </button>
        </div>
      </div>
    </div>
  );
};
