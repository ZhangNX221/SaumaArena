'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
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
  const [email, setEmail] = useState('admin@sauma.arena');
  const [password, setPassword] = useState('pass1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectRoleTab = (role: UserRole) => {
    setActiveRoleTab(role);
    setErrorMessage(null);
    if (role === 'ADMIN') {
      setEmail('admin@sauma.arena');
    } else {
      setEmail('juri.laga1@sauma.arena');
    }
  };

  const refereePresets = PRESET_USERS.filter((u) => u.role === 'REFEREE');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Mohon masukkan email dinas dan kata sandi Anda.');
      return;
    }

    const matched = PRESET_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    const user: AppUser = matched
      ? { ...matched, role: activeRoleTab }
      : {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0],
          email: email.trim(),
          role: activeRoleTab,
          roleLabel: activeRoleTab === 'ADMIN' ? 'Komisioner Pertandingan' : 'Juri Resmi Lapangan',
          specialization: activeRoleTab === 'REFEREE' ? 'FUTSAL' : undefined,
          avatarText: email.slice(0, 2).toUpperCase(),
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
                <span className="font-black text-base sm:text-lg tracking-tight font-[var(--font-display)] block text-white">
                  SAUMA ARENA
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-arena-accent)]">
                  Multi-Sport OS
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-arena-accent)] block">
                PORTAL ADMIN & KOMISIONER
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-[var(--font-display)] leading-tight text-white">
                Pusat Komando & Jadwal Multi-Cabor
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                Atur bagan bracket, plotting lapangan, verifikasi data atlet ber-QR, dan pengesahan BAP resmi.
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-arena-accent)] shrink-0" />
                <span>Global Filter Cabor (Futsal, Badminton, Basket, Esport)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-arena-accent)] shrink-0" />
                <span>Cetak massal ID Card atlet &amp; validasi tiket QR</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-arena-accent)] shrink-0" />
                <span>Hak override live score saat juri offline</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 mt-6 relative z-10 flex items-center justify-between text-[11px] text-slate-400">
            <span>MMFC I Matsanega 2026</span>
            <span className="font-mono text-[var(--color-arena-accent)] font-bold">
              Multi-Sport OS
            </span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-7 sm:p-9 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[var(--text-main)] font-[var(--font-display)]">
                  Masuk Kredensial
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Pilih peran tugas Anda untuk membuka akses sistem.
                </p>
              </div>

              <button
                type="button"
                onClick={onBackToPublic}
                className="btn-tactile inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Publik</span>
              </button>
            </div>

            {/* Role Segmented Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] mb-5">
              <button
                type="button"
                onClick={() => handleSelectRoleTab('ADMIN')}
                className={`btn-tactile flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeRoleTab === 'ADMIN'
                    ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin / Panitia</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectRoleTab('REFEREE')}
                className={`btn-tactile flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeRoleTab === 'REFEREE'
                    ? 'bg-[var(--color-arena-accent)] text-slate-900 shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Whistle className="w-4 h-4" />
                <span>Juri Lapangan</span>
              </button>
            </div>

            {/* Match-Based Referee Account Selector (1 Pertandingan 1 Juri) */}
            {activeRoleTab === 'REFEREE' && (
              <div className="mb-5 p-3.5 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-main)] font-[var(--font-display)]">
                    Pilih Juri Penilai Laga (1 Pertandingan 1 Juri):
                  </span>
                  <span className="text-[10px] font-mono text-[var(--color-arena-accent)] font-bold">
                    MMFC I Futsal
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {refereePresets.map((r) => {
                    const isSelected = email.toLowerCase() === r.email.toLowerCase();
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setEmail(r.email);
                          setPassword('pass1234');
                          if (errorMessage) setErrorMessage(null);
                        }}
                        className={`btn-tactile p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'border-[var(--color-arena-accent)] bg-amber-500/10 ring-1 ring-[var(--color-arena-accent)]/50 shadow-xs'
                            : 'border-[var(--border-subtle)] hover:border-slate-400 bg-[var(--bg-surface)]'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-[var(--color-arena-dark)] text-[var(--color-arena-accent)] flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-2xs">
                          {r.avatarText}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-[var(--text-main)] truncate">
                            {r.name}
                          </div>
                          <div className="text-[11px] text-[var(--color-arena-primary)] dark:text-sky-300 font-bold truncate">
                            {r.assignedMatchLabel || r.roleLabel}
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                            {r.email}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-900 dark:text-red-300 text-xs flex items-center gap-2.5 mb-4 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--text-main)]">
                  {activeRoleTab === 'ADMIN' ? 'Email Akun Admin / Panitia' : 'Email Akun Juri Resmi'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="nama@sauma.arena"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)] transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[var(--text-main)]">Kata Sandi</label>
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
                  <span>Ingat sesi perangkat ini</span>
                </label>
                <span className="text-[11px] text-[var(--color-arena-primary)] font-semibold cursor-pointer hover:underline">
                  Bantuan Sandi
                </span>
              </div>

              <button
                type="submit"
                className={`btn-tactile w-full py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors min-h-[44px] flex items-center justify-center gap-2 ${
                  activeRoleTab === 'ADMIN'
                    ? 'bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white'
                    : 'bg-[var(--color-arena-accent)] hover:brightness-105 text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {activeRoleTab === 'ADMIN' ? 'Buka Panel Admin Back-Office' : 'Buka Match Center Juri'}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
