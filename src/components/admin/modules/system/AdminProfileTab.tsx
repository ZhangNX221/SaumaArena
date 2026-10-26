'use client';

import React, { useState } from 'react';
import {
  User,
  Shield,
  Mail,
  Phone,
  CheckCircle2,
  Bell,
  Smartphone,
  Save,
  Clock,
  Sparkles,
  Camera,
  Check,
} from 'lucide-react';
import { AppUser } from '@/types';
import { AdminSecurityCard } from './AdminSecurityCard';

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
  const [name, setName] = useState(user?.name || 'Ahmad Taufiq');
  const [email, setEmail] = useState(user?.email || 'admin@sauma.arena.id');
  const [username, setUsername] = useState('admin_sauma');
  const [phone, setPhone] = useState('+62 812-3456-7890');
  const [avatarInitials, setAvatarInitials] = useState('AT');
  const [avatarColor, setAvatarColor] = useState('from-blue-600 to-indigo-700');

  // Preference state
  const [soundNotification, setSoundNotification] = useState(true);
  const [autoVerifyBAP, setAutoVerifyBAP] = useState(false);
  const [defaultSport, setDefaultSport] = useState('ALL');

  // Feedback states
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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

              {savedSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Profil dan kontak admin berhasil diperbarui!</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="btn-tactile flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold uppercase tracking-wider shadow-xs hover:bg-[var(--color-arena-primary-hover)]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan Profil</span>
                </button>
              </div>
            </form>
          </div>

          {/* Form Keamanan: Kata Sandi & PIN Cepat */}
          <AdminSecurityCard />
        </div>

        {/* Kolom 3: Hak Akses & Preferensi Kerja */}
        <div className="space-y-6">
          {/* Ringkasan Hak Akses */}
          <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
              <Shield className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-barlow font-bold uppercase tracking-wider text-[var(--text-main)]">
                Hak Akses &amp; Otoritas
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-muted)]">
                <span className="text-[var(--text-muted)]">Tingkat Izin:</span>
                <span className="font-bold text-[var(--text-main)]">Super Admin (Tingkat 1)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-muted)]">
                <span className="text-[var(--text-muted)]">Verifikasi Berkas:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Penuh
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-muted)]">
                <span className="text-[var(--text-muted)]">Override Skor Langsung:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Diizinkan
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-muted)]">
                <span className="text-[var(--text-muted)]">Backup / Restore DB:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Otoritas Penuh
                </span>
              </div>
            </div>
          </div>

          {/* Preferensi Kerja Admin */}
          <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
              <Bell className="w-4 h-4 text-[var(--color-arena-primary)]" />
              <h3 className="text-sm font-barlow font-bold uppercase tracking-wider text-[var(--text-main)]">
                Preferensi Kerja
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-muted)] cursor-pointer">
                <div>
                  <div className="font-semibold text-[var(--text-main)]">Suara Notifikasi Gol / Poin</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Audio cue saat skor live terupdate</div>
                </div>
                <input
                  type="checkbox"
                  checked={soundNotification}
                  onChange={(e) => setSoundNotification(e.target.checked)}
                  className="w-4 h-4 rounded text-[var(--color-arena-primary)] focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-muted)] cursor-pointer">
                <div>
                  <div className="font-semibold text-[var(--text-main)]">Persetujuan BAP Otomatis</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Bila kedua wasit sudah ttd digital</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoVerifyBAP}
                  onChange={(e) => setAutoVerifyBAP(e.target.checked)}
                  className="w-4 h-4 rounded text-[var(--color-arena-primary)] focus:ring-0"
                />
              </label>

              <div className="p-2.5 rounded-xl bg-[var(--bg-muted)] space-y-1.5">
                <div className="font-semibold text-[var(--text-main)]">Filter Cabor Default</div>
                <select
                  value={defaultSport}
                  onChange={(e) => setDefaultSport(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] text-xs"
                >
                  <option value="ALL">Semua Cabang Olahraga</option>
                  <option value="FUTSAL">Futsal Putra/Putri</option>
                  <option value="VOLLEY">Bola Voli</option>
                  <option value="ESPORT">E-Sport MLBB</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
