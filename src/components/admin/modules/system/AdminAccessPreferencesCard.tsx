'use client';

import React, { useState } from 'react';
import { Shield, Bell, Check } from 'lucide-react';

export const AdminAccessPreferencesCard: React.FC = () => {
  const [soundNotification, setSoundNotification] = useState(true);
  const [autoVerifyBAP, setAutoVerifyBAP] = useState(false);
  const [defaultSport, setDefaultSport] = useState('ALL');

  return (
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
  );
};

