'use client';

import React from 'react';
import { Trophy, Shield, MapPin, Palette } from 'lucide-react';
import { TeamRegistrationData } from '@/types/registration';

interface StepTeamProfileProps {
  data: TeamRegistrationData;
  onChange: (fields: Partial<TeamRegistrationData>) => void;
}

export const StepTeamProfile: React.FC<StepTeamProfileProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h4 className="font-extrabold text-base text-[var(--text-main)] font-[var(--font-display)] flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[var(--color-arena-primary)]" />
          <span>Langkah 1: Identitas Tim &amp; Kontingen</span>
        </h4>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Masukkan informasi resmi kontingen sekolah atau madrasah yang mewakili tim pada turnamen.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cabang Olahraga & Kategori */}
        <div>
          <label htmlFor="reg-sport" className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
            Cabang Olahraga Turnamen
          </label>
          <input
            id="reg-sport"
            type="text"
            readOnly
            value="Futsal (MMFC I)"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-main)] font-semibold text-xs cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="reg-category" className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
            Kategori Kompetisi
          </label>
          <input
            id="reg-category"
            type="text"
            readOnly
            value="Pelajar SD/MI (Usia 10-12 Tahun)"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-main)] font-semibold text-xs cursor-not-allowed"
          />
        </div>

        {/* Nama Tim Lengkap */}
        <div className="sm:col-span-2">
          <label htmlFor="reg-team-name" className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
            Nama Tim Kontingen <span className="text-red-500">*</span>
          </label>
          <input
            id="reg-team-name"
            type="text"
            required
            placeholder="Contoh: MIN 1 Kota Malang A"
            value={data.teamName}
            onChange={(e) => onChange({ teamName: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)] text-xs sm:text-sm font-medium transition-all"
          />
        </div>

        {/* Asal Sekolah / Madrasah */}
        <div>
          <label htmlFor="reg-school" className="block text-xs font-bold text-[var(--text-main)] mb-1.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
            <span>Asal Sekolah / Madrasah</span> <span className="text-red-500">*</span>
          </label>
          <input
            id="reg-school"
            type="text"
            required
            placeholder="Contoh: MIN 1 Kota Malang"
            value={data.schoolName}
            onChange={(e) => onChange({ schoolName: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)] text-xs sm:text-sm font-medium transition-all"
          />
        </div>

        {/* Singkatan Tim di Scoreboard */}
        <div>
          <label htmlFor="reg-short" className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
            Nama Singkat / Akronim Papan Skor (Maks 6 Huruf) <span className="text-red-500">*</span>
          </label>
          <input
            id="reg-short"
            type="text"
            maxLength={6}
            required
            placeholder="Contoh: MIN 1"
            value={data.shortName}
            onChange={(e) => onChange({ shortName: e.target.value.toUpperCase() })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)] text-xs sm:text-sm font-mono font-bold tracking-wider uppercase transition-all"
          />
        </div>

        {/* Kota / Kabupaten */}
        <div>
          <label htmlFor="reg-city" className="block text-xs font-bold text-[var(--text-main)] mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
            <span>Kota / Kabupaten</span> <span className="text-red-500">*</span>
          </label>
          <input
            id="reg-city"
            type="text"
            required
            placeholder="Contoh: Kota Malang"
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)] text-xs sm:text-sm font-medium transition-all"
          />
        </div>

        {/* Warna Jersey Tanding */}
        <div>
          <label htmlFor="reg-jersey-home" className="block text-xs font-bold text-[var(--text-main)] mb-1.5 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
            <span>Warna Jersey Utama (Kandang)</span> <span className="text-red-500">*</span>
          </label>
          <input
            id="reg-jersey-home"
            type="text"
            required
            placeholder="Contoh: Biru Dongker"
            value={data.jerseyHomeColor}
            onChange={(e) => onChange({ jerseyHomeColor: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)] text-xs sm:text-sm font-medium transition-all"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="reg-jersey-away" className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
            Warna Jersey Cadangan (Tandang)
          </label>
          <input
            id="reg-jersey-away"
            type="text"
            placeholder="Contoh: Putih - Kuning"
            value={data.jerseyAwayColor}
            onChange={(e) => onChange({ jerseyAwayColor: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)] text-xs sm:text-sm font-medium transition-all"
          />
          <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
            Warna cadangan digunakan saat terjadi benturan warna seragam pertandingan antar kedua tim.
          </span>
        </div>
      </div>
    </div>
  );
};
