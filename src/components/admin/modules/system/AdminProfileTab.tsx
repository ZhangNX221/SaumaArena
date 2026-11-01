'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Save,
  Clock,
  Sparkles,
  Camera,
  Loader2,
} from 'lucide-react';
import { AppUser } from '@/types';
import { AdminSecurityCard } from './AdminSecurityCard';
import { AdminAccessPreferencesCard } from './AdminAccessPreferencesCard';

interface AdminProfileTabProps {
  user?: AppUser | null;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const AdminProfileTab: React.FC<AdminProfileTabProps> = ({
  user,
  darkMode,
  onToggleDarkMode,
}) => {
  // Form profile state
  const [name, setName] = useState(user?.name || 'Administrator');
  const [email, setEmail] = useState(user?.email || 'admin@sauma.arena.id');
  const [username, setUsername] = useState(user?.username || 'admin');
  const [phone, setPhone] = useState('+62 812-3456-7890');
  const [avatarInitials, setAvatarInitials] = useState(
    user?.avatarText || user?.name?.slice(0, 2).toUpperCase() || 'AD'
  );
  const [avatarColor, setAvatarColor] = useState('from-blue-600 to-indigo-700');

  // Feedback & Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('Profil dan username berhasil disimpan ke database!');

  // Sync state ketika data user prop dimuat atau diperbarui
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.username) setUsername(user.username);
      if (user.avatarText) setAvatarInitials(user.avatarText);
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSavedSuccess(false);

    if (!username.trim()) {
      setErrorMessage('Username login tidak boleh kosong.');
      return;
    }
    if (!name.trim()) {
      setErrorMessage('Nama penanggung jawab tidak boleh kosong.');
      return;
    }

    setIsLoading(true);

    try {
      let token: string | null = null;
      try {
        token = localStorage.getItem('sauma_auth_token');
      } catch {
        // ignore
      }

      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          username: username.trim(),
          name: name.trim(),
          email: email.trim(),
          userId: user?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Gagal menyimpan perubahan profil ke database.');
        return;
      }

      if (data.token) {
        try {
          localStorage.setItem('sauma_auth_token', data.token);
          if (data.user) {
            localStorage.setItem('sauma_auth_user', JSON.stringify(data.user));
          }
        } catch {
          // ignore
        }
      }

      setSuccessMessage(data.message || 'Profil dan username berhasil disimpan ke database!');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4500);
    } catch (err: any) {
      console.error('Save profile error:', err);
      setErrorMessage('Gagal menghubungi server untuk menyimpan data.');
    } finally {
      setIsLoading(false);
    }
  };

  const AVATAR_PALETTES = [
    { label: 'Biru Samudera', color: 'from-blue-600 to-indigo-700' },
    { label: 'Emas Arena', color: 'from-amber-500 to-orange-600' },
    { label: 'Zamrud', color: 'from-emerald-600 to-teal-700' },
    { label: 'Ungu Royal', color: 'from-purple-600 to-indigo-800' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner Profil */}
      <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${avatarColor} text-white flex items-center justify-center font-bebas text-3xl shadow-md tracking-wider`}
            >
              {avatarInitials}
            </div>
            <button
              type="button"
              title="Ganti tema avatar"
              onClick={() => {
                const nextIndex =
                  (AVATAR_PALETTES.findIndex((p) => p.color === avatarColor) + 1) %
                  AVATAR_PALETTES.length;
                setAvatarColor(AVATAR_PALETTES[nextIndex].color);
              }}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-[var(--color-arena-primary)] text-white shadow-xs hover:scale-105 transition-transform"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-barlow font-bold text-[var(--text-main)]">{name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-barlow font-bold uppercase tracking-wider bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                Super Administrator
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] flex items-center gap-2">
              <span>@{username}</span>
              <span>•</span>
              <span>{email}</span>
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sesi Aktif di Mac OS (Chrome 124)</span>
            </div>
          </div>
        </div>

        {/* Pilihan Palet Avatar */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-[var(--bg-muted)]/70 border border-[var(--border-subtle)]">
          <span className="text-[11px] text-[var(--text-muted)] font-barlow font-semibold uppercase px-1">
            Tema Avatar:
          </span>
          {AVATAR_PALETTES.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setAvatarColor(p.color)}
              title={p.label}
              className={`w-6 h-6 rounded-lg bg-gradient-to-br ${p.color} transition-transform ${
                avatarColor === p.color ? 'ring-2 ring-[var(--color-arena-primary)] scale-110' : 'opacity-70 hover:opacity-100'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1 & 2: Informasi Pribadi & Otorisasi */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form Biodata */}
          <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--color-arena-primary)]" />
                <h3 className="text-sm font-barlow font-bold uppercase tracking-wider text-[var(--text-main)]">
                  Data Akun &amp; Kontak Panitia
                </h3>
              </div>
              <span className="text-[11px] text-[var(--text-muted)]">ID Akun: ADM-2026-001</span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--text-main)]">Nama Lengkap Penanggung Jawab</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      const parts = e.target.value.trim().split(' ');
                      if (parts.length >= 2) {
                        setAvatarInitials((parts[0][0] + parts[1][0]).toUpperCase());
                      } else if (parts[0]) {
                        setAvatarInitials(parts[0].slice(0, 2).toUpperCase());
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--text-main)]">Username Login</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--text-main)] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span>Email Resmi Panitia</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--text-main)] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span>WhatsApp / No. HP Darurat</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {savedSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-tactile flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold uppercase tracking-wider shadow-xs hover:bg-[var(--color-arena-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan ke Database...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan Profil</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Form Keamanan: Kata Sandi & PIN Cepat */}
          <AdminSecurityCard />
        </div>

        {/* Kolom 3: Hak Akses & Preferensi Kerja */}
        <AdminAccessPreferencesCard />
      </div>
    </div>
  );
};
