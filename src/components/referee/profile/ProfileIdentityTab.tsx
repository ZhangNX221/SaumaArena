'use client';

import React from 'react';
import { User } from 'lucide-react';

interface ProfileIdentityTabProps {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  roleLabel: string;
  setRoleLabel: (v: string) => void;
  licenseLevel: string;
  setLicenseLevel: (v: string) => void;
  licenseId: string;
  setLicenseId: (v: string) => void;
  association: string;
  setAssociation: (v: string) => void;
}

export const ProfileIdentityTab: React.FC<ProfileIdentityTabProps> = ({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  roleLabel,
  setRoleLabel,
  licenseLevel,
  setLicenseLevel,
  licenseId,
  setLicenseId,
  association,
  setAssociation,
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-4 animate-fadeIn">
      <h3 className="font-bebas text-lg sm:text-xl uppercase tracking-wide text-[var(--text-main)] flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
        <User className="w-4 h-4 text-[#33658a]" />
        <span>Informasi Personal &amp; Sertifikasi Wasit</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Nama Lengkap (dengan Gelar) *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[#33658a]"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Alamat Email Akun *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[#33658a]"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Nomor WhatsApp / HP Lapangan *
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[#33658a]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Role Label Penugasan
          </label>
          <input
            type="text"
            value={roleLabel}
            onChange={(e) => setRoleLabel(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[#33658a]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Tingkat Lisensi Wasit
          </label>
          <select
            value={licenseLevel}
            onChange={(e) => setLicenseLevel(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[#33658a]"
          >
            <option value="Lisensi 1 Nasional FFI">Lisensi 1 Nasional FFI / PSSI</option>
            <option value="Lisensi 2 Daerah FFI">Lisensi 2 Daerah (Provinsi) FFI</option>
            <option value="Lisensi 3 Kabupaten/Kota">Lisensi 3 Cabang (Kab/Kota)</option>
            <option value="Wasit Magang / Sertifikasi Khusus">Wasit Magang / Pengcab</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Nomor Registrasi Wasit (ID Lisensi)
          </label>
          <input
            type="text"
            value={licenseId}
            onChange={(e) => setLicenseId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs font-mono text-[var(--text-main)] focus:outline-none focus:border-[#33658a]"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Asosiasi / Pengcab Afiliasi
          </label>
          <input
            type="text"
            value={association}
            onChange={(e) => setAssociation(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[#33658a]"
          />
        </div>
      </div>
    </div>
  );
};
