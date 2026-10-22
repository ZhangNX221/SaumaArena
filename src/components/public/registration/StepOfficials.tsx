'use client';

import React from 'react';
import { UserCheck, Phone, Mail, User, ShieldAlert } from 'lucide-react';
import { TeamRegistrationData } from '@/types/registration';

interface StepOfficialsProps {
  data: TeamRegistrationData;
  onChange: (fields: Partial<TeamRegistrationData>) => void;
}

export const StepOfficials: React.FC<StepOfficialsProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h4 className="font-extrabold text-base text-[var(--text-main)] font-[var(--font-display)] flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[var(--color-arena-primary)]" />
          <span>Langkah 2: Data Manajer &amp; Pelatih Tim</span>
        </h4>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Kontak manajer digunakan panitia untuk koordinasi Technical Meeting (TM), jadwal tanding, dan verifikasi berkas.
        </p>
      </div>

      <div className="p-3.5 rounded-xl bg-[var(--color-arena-primary-light)] border border-[var(--color-arena-primary)]/20 text-xs text-[var(--text-main)] flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-[var(--color-arena-primary)] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Penting:</strong> Pastikan nomor WhatsApp manajer aktif untuk menerima tautan grup resmi manajer tim dan pengumuman technical meeting turnamen.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nama Manajer Tim */}
        <div className="sm:col-span-2">
          <label htmlFor="reg-manager-name" className="block text-xs font-bold text-[var(--text-main)] mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
            <span>Nama Lengkap Manajer Tim</span> <span className="text-red-500">*</span>
          </label>
          <input
            id="reg-manager-name"
            type="text"
            required
            placeholder="Contoh: Ahmad Fauzan, S.Pd"
            value={data.managerName}
            onChange={(e) => onChange({ managerName: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)] text-xs sm:text-sm font-medium transition-all"
          />
        </div>

        {/* WhatsApp Manajer */}
        <div>
          <label htmlFor="reg-manager-phone" className="block text-xs font-bold text-[var(--text-main)] mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
            <span>Nomor WhatsApp Manajer</span> <span className="text-red-500">*</span>
          </label>
          <input
            id="reg-manager-phone"
            type="tel"
            required
            placeholder="Contoh: 081234567890"
            value={data.managerPhone}
            onChange={(e) => onChange({ managerPhone: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)] text-xs sm:text-sm font-mono font-medium transition-all"
          />
        </div>

        {/* Email Manajer */}
        <div>
          <label htmlFor="reg-manager-email" className="block text-xs font-bold text-[var(--text-main)] mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
            <span>Alamat Email Manajer</span> <span className="text-red-500">*</span>
          </label>
          <input
            id="reg-manager-email"
            type="email"
            required
            placeholder="Contoh: official.min1@gmail.com"
            value={data.managerEmail}
            onChange={(e) => onChange({ managerEmail: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)] text-xs sm:text-sm font-medium transition-all"
          />
        </div>

        {/* Pelatih Kepala */}
        <div>
          <label htmlFor="reg-coach-name" className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
            Nama Pelatih Kepala (Head Coach) <span className="text-red-500">*</span>
          </label>
          <input
            id="reg-coach-name"
            type="text"
            required
            placeholder="Contoh: Coach Hendra Wijaya"
            value={data.headCoachName}
            onChange={(e) => onChange({ headCoachName: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)] text-xs sm:text-sm font-medium transition-all"
          />
        </div>

        {/* Kontak Pelatih */}
        <div>
          <label htmlFor="reg-coach-phone" className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
            Nomor Telepon / WA Pelatih
          </label>
          <input
            id="reg-coach-phone"
            type="tel"
            placeholder="Contoh: 081298765432"
            value={data.headCoachPhone}
            onChange={(e) => onChange({ headCoachPhone: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)] text-xs sm:text-sm font-mono font-medium transition-all"
          />
        </div>
      </div>
    </div>
  );
};
