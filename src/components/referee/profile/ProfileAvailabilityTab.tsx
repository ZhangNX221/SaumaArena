'use client';

import React from 'react';
import { Clock, CheckCircle2, ToggleLeft } from 'lucide-react';

interface ProfileAvailabilityTabProps {
  isAvailable: boolean;
  setIsAvailable: (v: boolean) => void;
  onUpdateAvailability?: (status: boolean) => void;
  preferredRoles: string[];
  toggleRolePreference: (role: string) => void;
  availabilityNotes: string;
  setAvailabilityNotes: (v: string) => void;
}

export const ProfileAvailabilityTab: React.FC<ProfileAvailabilityTabProps> = ({
  isAvailable,
  setIsAvailable,
  onUpdateAvailability,
  preferredRoles,
  toggleRolePreference,
  availabilityNotes,
  setAvailabilityNotes,
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-5 animate-fadeIn">
      <h3 className="font-bebas text-lg sm:text-xl uppercase tracking-wide text-[var(--text-main)] flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
        <Clock className="w-4 h-4 text-[#33658a]" />
        <span>Status Ketersediaan &amp; Preferensi Penugasan Meja</span>
      </h3>

      {/* Availability Radio Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          onClick={() => {
            setIsAvailable(true);
            onUpdateAvailability?.(true);
          }}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            isAvailable
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200'
              : 'border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-muted)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-barlow font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Siap Bertugas (Aktif)
            </span>
            <input type="radio" checked={isAvailable} readOnly className="accent-emerald-600" />
          </div>
          <p className="text-[11px] mt-1.5 opacity-80 leading-relaxed">
            Komisioner dapat melakukan plotting jadwal pertandingan untuk Anda.
          </p>
        </div>

        <div
          onClick={() => {
            setIsAvailable(false);
            onUpdateAvailability?.(false);
          }}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            !isAvailable
              ? 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200'
              : 'border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-muted)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-barlow font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <ToggleLeft className="w-4 h-4 text-amber-600" />
              Sedang Istirahat / Izin
            </span>
            <input type="radio" checked={!isAvailable} readOnly className="accent-amber-600" />
          </div>
          <p className="text-[11px] mt-1.5 opacity-80 leading-relaxed">
            Nama Anda ditandai berhalangan sementara dari tugas lapangan mendadak.
          </p>
        </div>
      </div>

      {/* Preferensi Peran */}
      <div className="space-y-2">
        <label className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Preferensi Posisi / Peran Pertandingan
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            'Wasit 1 (Utama)',
            'Wasit 2 (Garis)',
            'Wasit 3 (Meja/Waktu)',
          ].map((role) => (
            <label
              key={role}
              className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] flex items-center gap-3 cursor-pointer text-xs font-medium text-[var(--text-main)] hover:bg-[var(--bg-muted)]"
            >
              <input
                type="checkbox"
                checked={preferredRoles.includes(role)}
                onChange={() => toggleRolePreference(role)}
                className="rounded accent-[#33658a]"
              />
              <span>{role}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Catatan Ketersediaan Waktu (Opsional)
        </label>
        <textarea
          rows={3}
          value={availabilityNotes}
          onChange={(e) => setAvailabilityNotes(e.target.value)}
          placeholder="Contoh: Hanya bisa bertugas pada sesi sore setelah pukul 14.00 WIB..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[#33658a]"
        />
      </div>
    </div>
  );
};
