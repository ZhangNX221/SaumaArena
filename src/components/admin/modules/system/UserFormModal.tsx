'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AppUser, SportCode } from '@/types';

export interface UserFormData {
  name: string;
  email: string;
  role: 'ADMIN' | 'REFEREE';
  specialization: SportCode;
  licenseLevel: string;
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserFormData) => void;
  editingUser: AppUser | null;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingUser,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'REFEREE'>('REFEREE');
  const [sport, setSport] = useState<SportCode>('FUTSAL');
  const [license, setLicense] = useState('Lisensi Daerah Level 2');

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
      setRole(editingUser.role);
      setSport((editingUser.specialization as SportCode) || 'FUTSAL');
      setLicense(editingUser.licenseLevel || 'Lisensi Daerah Level 2');
    } else {
      setName('');
      setEmail('');
      setRole('REFEREE');
      setSport('FUTSAL');
      setLicense('Lisensi Daerah Level 2');
    }
  }, [editingUser, isOpen]);

  // Keyboard accessibility: Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSave({
      name,
      email,
      role,
      specialization: sport,
      licenseLevel: license,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
          <h3 id="user-modal-title" className="font-bebas text-xl uppercase tracking-wide text-[var(--text-main)]">
            {editingUser ? 'Edit Akun Wasit / Juri' : 'Tambah Akun Wasit / Juri'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela"
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Nama Lengkap &amp; Gelar</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: M. Irfan, S.Pd (Wasit Futsal FFI)"
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
            />
          </div>

          <div>
            <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Email Masuk Akun</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juri@sauma.arena"
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Spesialisasi Cabor</label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value as SportCode)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-medium"
              >
                <option value="FUTSAL">Futsal</option>
                <option value="BADMINTON">Badminton</option>
                <option value="BASKET">Bola Basket</option>
                <option value="ESPORT">E-Sport</option>
              </select>
            </div>
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Tingkat Lisensi</label>
              <input
                type="text"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                placeholder="FFI Level 1 / PBSI"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-tactile px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] font-barlow font-bold uppercase tracking-wider text-xs text-[var(--text-muted)]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-tactile px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold uppercase tracking-wider text-xs"
            >
              {editingUser ? 'Simpan Perubahan' : 'Simpan Akun Juri'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
