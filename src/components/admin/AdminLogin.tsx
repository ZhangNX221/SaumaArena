'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Whistle,
} from 'lucide-react';
import { AppUser, UserRole } from '@/types';
import { PRESET_USERS } from '@/mocks/multiSportData';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';

interface AdminLoginProps {
  onLoginSuccess: (user: AppUser) => void;
  onBackToPublic: () => void;
  initialRole?: UserRole;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToPublic,
  initialRole = 'ADMIN',
}) => {
  const [activeRoleTab, setActiveRoleTab] = useState<UserRole>(initialRole);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('pass1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectRoleTab = (role: UserRole) => {
    setActiveRoleTab(role);
    setErrorMessage(null);
    if (role === 'ADMIN') {
      setUsername('admin');
    } else {
      setUsername('juri1');
    }
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Masukkan username dan kata sandi Anda untuk melanjutkan.');
      return;
    }

    const input = username.trim().toLowerCase();
    const matched = PRESET_USERS.find(
      (u) =>
        (u.username && u.username.toLowerCase() === input) ||
        u.email.toLowerCase() === input ||
        u.email.toLowerCase().startsWith(input) ||
        u.name.toLowerCase().includes(input)
    );

    const user: AppUser = matched
      ? { ...matched, role: activeRoleTab }
      : {
          id: `usr-${Date.now()}`,
          name: username.trim(),
          username: username.trim(),
          email: `${username.trim()}@sauma.arena`,
          role: activeRoleTab,
          roleLabel: activeRoleTab === 'ADMIN' ? 'Admin Turnamen' : 'Panitia / Juri Lapangan',
          specialization: activeRoleTab === 'REFEREE' ? 'FUTSAL' : undefined,
          avatarText: username.trim().slice(0, 2).toUpperCase(),
          isAvailable: true,
        };

    setErrorMessage(null);
    onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12 animate-fadeIn">
        {/* Left Brand Showcase Column */}
        <div className="md:col-span-5 bg-[var(--color-arena-dark)] text-white p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <SaumaArenaLogo size="lg" variant="dark" />
              <div>
                <span className="font-bebas text-xl sm:text-2xl tracking-wider block text-white uppercase">
                  SAUMA ARENA
                </span>
                <span className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-accent)]">
                  Sistem Turnamen Resmi
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-accent)] block">
                PANEL ADMIN &amp; PANITIA / JURI
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bebas uppercase tracking-wide leading-tight text-white">
                Kelola Jadwal &amp; Hasil Pertandingan
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                Bagan kejuaraan, alokasi lapangan, data atlet, dan Berita Acara Pertandingan (BAP) resmi dalam satu meja kerja.
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-arena-accent)] shrink-0" />
                <span>Mendukung multi-cabor: Futsal, Badminton, Basket, dan E-Sport</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-arena-accent)] shrink-0" />
                <span>ID Card atlet resmi dengan QR check-in sebelum tanding</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-arena-accent)] shrink-0" />
                <span>Pembaruan skor langsung dan penandatanganan BAP digital</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 mt-6 relative z-10 flex items-center justify-between text-xs text-slate-400">
            <span className="font-barlow font-bold uppercase tracking-wider">MMFC I Matsanega 2026</span>
            <span className="font-barlow text-[var(--color-arena-accent)] font-bold uppercase tracking-wider">
              Edisi Resmi
            </span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-7 sm:p-9 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bebas uppercase tracking-wide text-[var(--text-main)]">
                  Masuk Akun Petugas
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Pilih peran Anda untuk melanjutkan ke meja tugas pertandingan.
                </p>
              </div>

              <button
                type="button"
                onClick={onBackToPublic}
                className="btn-tactile inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Portal Publik</span>
              </button>
            </div>

            {/* Role Segmented Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] mb-5">
              <button
                type="button"
                onClick={() => handleSelectRoleTab('ADMIN')}
                className={`btn-tactile flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider transition-all ${
                  activeRoleTab === 'ADMIN'
                    ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectRoleTab('REFEREE')}
                className={`btn-tactile flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider transition-all ${
                  activeRoleTab === 'REFEREE'
                    ? 'bg-[var(--color-arena-accent)] text-slate-900 shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Whistle className="w-4 h-4" />
                <span>Panitia / Juri</span>
              </button>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-900 dark:text-red-300 text-xs flex items-center gap-2.5 mb-4 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="block text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-main)]">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Masukkan username..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)] transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-main)]">Kata Sandi</label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)] transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-[var(--text-main)]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--text-muted)]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--color-arena-primary)]"
                  />
                  <span>Ingat saya di perangkat ini</span>
                </label>
                <span className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-primary)] cursor-pointer hover:underline">
                  Lupa kata sandi?
                </span>
              </div>

              <button
                type="submit"
                className={`btn-tactile w-full py-3.5 rounded-xl font-bebas text-lg uppercase tracking-wider shadow-xs transition-colors min-h-[48px] flex items-center justify-center gap-2 ${
                  activeRoleTab === 'ADMIN'
                    ? 'bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white'
                    : 'bg-[var(--color-arena-accent)] hover:brightness-105 text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {activeRoleTab === 'ADMIN' ? 'Masuk sebagai Admin' : 'Masuk sebagai Panitia / Juri'}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
