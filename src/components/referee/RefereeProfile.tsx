'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Save, 
  ToggleLeft, 
} from 'lucide-react';
import { AppUser } from '@/types';
import { PRESET_USERS } from '@/mocks/multiSportData';
import { usePersistentState } from '@/hooks/usePersistentState';
import { ProfileIdentityTab } from './profile/ProfileIdentityTab';
import { ProfileAvailabilityTab } from './profile/ProfileAvailabilityTab';
import { ProfileSecurityTab } from './profile/ProfileSecurityTab';

interface RefereeProfileProps {
  user: AppUser;
  onUpdateProfile?: (updated: Partial<AppUser>) => void;
  onUpdateAvailability?: (status: boolean) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const RefereeProfile: React.FC<RefereeProfileProps> = ({
  user,
  onUpdateProfile,
  onUpdateAvailability,
}) => {
  const [officials, setOfficials] = usePersistentState<AppUser[]>('sauma_arena_officials', PRESET_USERS);
  const [isAvailable, setIsAvailable] = useState<boolean>(user.isAvailable ?? true);

  // Form Fields State
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState('0812-3456-7890');
  const [roleLabel, setRoleLabel] = useState(user.roleLabel || 'Wasit Utama FFI MMFC I');
  const [licenseLevel, setLicenseLevel] = useState(user.licenseLevel || 'Lisensi 2 Nasional FFI');
  const [licenseId, setLicenseId] = useState('FFI-WASIT-2026-089');
  const [association, setAssociation] = useState('Asosiasi Futsal Kota (AFK) Malang');

  // Duty Preference State
  const [preferredRoles, setPreferredRoles] = useState<string[]>([
    'Wasit 1 (Utama)',
    'Wasit 2 (Garis)',
    'Wasit 3 (Meja/Waktu)',
  ]);
  const [availabilityNotes, setAvailabilityNotes] = useState(
    'Tersedia memimpin sesi pagi (08:00 - 12:00) dan sesi sore (14:00 - 18:00 WIB).'
  );

  // Security State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deskPin, setDeskPin] = useState('2026');

  // Toast / Save State
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const toggleAvailability = () => {
    const next = !isAvailable;
    setIsAvailable(next);
    onUpdateAvailability?.(next);
    onUpdateProfile?.({ isAvailable: next });
    setOfficials((prev) =>
      prev.map((off) => (off.id === user.id ? { ...off, isAvailable: next } : off))
    );
    showToast(`Status ketersediaan diubah ke: ${next ? 'Siap Bertugas' : 'Sedang Istirahat'}`);
  };

  const showToast = (msg: string) => {
    setSaveMessage(msg);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const avatarInitials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('') || 'RH';

    onUpdateProfile?.({
      name,
      email,
      roleLabel,
      licenseLevel,
      avatarText: avatarInitials,
      isAvailable,
    });

    setOfficials((prev) =>
      prev.map((off) =>
        off.id === user.id
          ? {
              ...off,
              name,
              email,
              roleLabel,
              licenseLevel,
              avatarText: avatarInitials,
              isAvailable,
            }
          : off
      )
    );

    showToast('Perubahan profil berhasil disimpan dan langsung aktif.');
  };

  const toggleRolePreference = (role: string) => {
    setPreferredRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  return (
    <form onSubmit={handleSaveProfile} className="space-y-6 max-w-5xl mx-auto pb-24 animate-fadeIn">
      {/* 1. Header Banner Ringkas & Minimalis */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#071F14] text-white border border-[#143D28] transition-all duration-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-bebas text-2xl sm:text-3xl tracking-wide uppercase text-white leading-none">
              PROFIL &amp; PENGATURAN WASIT
            </h1>
            <p className="text-xs text-slate-300 max-w-xl font-sans">
              Semua pengaturan akun wasit dalam 1 halaman: biodata &amp; lisensi, kesiapan penugasan, dan keamanan akun.
            </p>
          </div>

          <button
            type="submit"
            className="btn-tactile px-5 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] active:scale-[0.98] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-150 shrink-0 self-start sm:self-auto min-h-[42px]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Profil</span>
          </button>
        </div>
      </div>

      {/* Toast Notification - Animate */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-fadeIn font-sans">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* 2. Official Accreditation ID Card - Ringkas & Minimalis */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#04120C] text-[var(--color-arena-accent)] flex items-center justify-center font-bebas text-2xl border border-[#143D28] shrink-0">
            {user.avatarText || 'MI'}
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bebas text-xl sm:text-2xl uppercase tracking-wide text-[var(--text-main)] leading-none truncate">
                {name || user.name || 'Juri M. Irfan, S.Pd'}
              </h2>
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                Terverifikasi
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-sans truncate">{roleLabel}</p>
            <div className="flex flex-wrap items-center gap-2 pt-0.5 font-sans">
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                {licenseLevel}
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                No: {licenseId}
              </span>
            </div>
          </div>
        </div>

        {/* Big Availability Toggle Button */}
        <button
          type="button"
          onClick={toggleAvailability}
          className={`btn-tactile px-4 py-2.5 rounded-xl font-barlow font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] min-h-[44px] shrink-0 ${
            isAvailable
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          {isAvailable ? <CheckCircle2 className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          <span>{isAvailable ? 'Status: Siap Bertugas' : 'Status: Sedang Istirahat'}</span>
        </button>
      </div>

      {/* 3. Section 1: Biodata & Lisensi Resmi */}
      <section id="section-identity" className="scroll-mt-20">
        <ProfileIdentityTab
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          phone={phone}
          setPhone={setPhone}
          roleLabel={roleLabel}
          setRoleLabel={setRoleLabel}
          licenseLevel={licenseLevel}
          setLicenseLevel={setLicenseLevel}
          licenseId={licenseId}
          setLicenseId={setLicenseId}
          association={association}
          setAssociation={setAssociation}
        />
      </section>

      {/* 5. Section 2: Kesiapan Bertugas & Preferensi Meja */}
      <section id="section-availability" className="scroll-mt-20">
        <ProfileAvailabilityTab
          isAvailable={isAvailable}
          setIsAvailable={setIsAvailable}
          onUpdateAvailability={onUpdateAvailability}
          preferredRoles={preferredRoles}
          toggleRolePreference={toggleRolePreference}
          availabilityNotes={availabilityNotes}
          setAvailabilityNotes={setAvailabilityNotes}
        />
      </section>

      {/* 6. Section 3: Keamanan Akun & PIN Meja Skor */}
      <section id="section-security" className="scroll-mt-20">
        <ProfileSecurityTab
          deskPin={deskPin}
          setDeskPin={setDeskPin}
          oldPassword={oldPassword}
          setOldPassword={setOldPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
        />
      </section>

      {/* 7. Bottom Unified Save Action Bar */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="btn-tactile w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] active:scale-[0.98] text-white font-barlow font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2.5 shadow-sm transition-all duration-150 min-h-[48px]"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Seluruh Perubahan Profil</span>
        </button>
      </div>
    </form>
  );
};
