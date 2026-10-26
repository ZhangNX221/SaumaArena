'use client';

import React, { useState } from 'react';
import { User, ShieldCheck, Plus, Search, UserCog } from 'lucide-react';
import { AppUser } from '@/types';
import { PRESET_USERS } from '@/mocks/multiSportData';
import { AdminProfileTab } from './AdminProfileTab';
import { UserFormModal, UserFormData } from './UserFormModal';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';

interface AccountSettingsViewProps {
  initialSubTab?: 'admin_profile' | 'referee_staff_accounts';
  user?: AppUser | null;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const AccountSettingsView: React.FC<AccountSettingsViewProps> = ({
  initialSubTab = 'admin_profile',
  user,
  darkMode,
  onToggleDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'ADMIN' | 'OFFICIALS'>(
    initialSubTab === 'referee_staff_accounts' ? 'OFFICIALS' : 'ADMIN'
  );

  // Referee / Officials State
  const [officials, setOfficials] = useState<AppUser[]>(PRESET_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<AppUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleOpenAdd = () => {
    setEditingOfficial(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (off: AppUser) => {
    setEditingOfficial(off);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setOfficials((prev) => prev.filter((o) => o.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleSaveOfficial = (data: UserFormData) => {
    if (editingOfficial) {
      setOfficials((prev) =>
        prev.map((o) =>
          o.id === editingOfficial.id
            ? {
                ...o,
                name: data.name,
                email: data.email,
                role: data.role,
                roleLabel: data.role === 'ADMIN' ? 'Panitia Pertandingan' : `Juri Resmi ${data.specialization}`,
                specialization: data.specialization,
                licenseLevel: data.licenseLevel,
                avatarText: data.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase(),
              }
            : o
        )
      );
    } else {
      const created: AppUser = {
        id: `usr-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role,
        roleLabel: data.role === 'ADMIN' ? 'Panitia Pertandingan' : `Juri Resmi ${data.specialization}`,
        specialization: data.specialization,
        licenseLevel: data.licenseLevel,
        avatarText: data.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
        isAvailable: true,
      };
      setOfficials((prev) => [...prev, created]);
    }
    setIsAddModalOpen(false);
    setEditingOfficial(null);
  };

  const filteredOfficials = officials.filter(
    (o) =>
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.specialization && o.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Card */}
      <AdminPageHeaderCard
        icon={UserCog}
        category={activeTab === 'ADMIN' ? 'PENGATURAN • PROFIL ADMIN' : 'PENGATURAN • AKUN PETUGAS'}
        title={activeTab === 'ADMIN' ? 'Pengaturan Akun & Profil Admin' : 'Akun Petugas & Juri Lapangan'}
        description={
          activeTab === 'ADMIN'
            ? 'Kelola kredensial administrator, kata sandi, preferensi tampilan gelap/terang, dan identitas panitia.'
            : 'Kelola akun wasit dan pencatat meja, spesialisasi cabang olahraga, serta lisensi penugasan pertandingan.'
        }
        action={
          <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-[var(--bg-muted)]/80 border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('ADMIN')}
              className={`btn-tactile flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'ADMIN'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profil Admin</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('OFFICIALS')}
              className={`btn-tactile flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'OFFICIALS'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Akun Petugas &amp; Juri ({officials.length})</span>
            </button>
          </div>
        }
      />

      {/* Sub-tab 1: Profil Admin */}
      {activeTab === 'ADMIN' && (
        <AdminProfileTab
          user={user}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
        />
      )}

      {/* Sub-tab 2: Akun Petugas & Juri */}
      {activeTab === 'OFFICIALS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-barlow font-bold uppercase tracking-wide text-[var(--text-main)]">
                Daftar Akun Juri &amp; Wasit Lapangan
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Akun juri digunakan untuk login di tablet juri guna mencatat skor langsung dan menandatangani BAP digital.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Cari juri / cabor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
                />
              </div>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-arena-primary)] text-white text-xs font-barlow font-bold uppercase tracking-wider shadow-xs hover:bg-[var(--color-arena-primary-hover)] shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Juri</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOfficials.map((u) => (
              <div
                key={u.id}
                className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-arena-dark)] text-[var(--color-arena-accent)] flex items-center justify-center font-bebas text-base">
                      {u.avatarText}
                    </div>
                    <div>
                      <div className="font-barlow font-bold text-xs text-[var(--text-main)] tracking-wide">{u.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{u.email}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      u.role === 'ADMIN'
                        ? 'bg-purple-500/15 text-purple-700 dark:text-purple-400'
                        : 'bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] dark:bg-sky-950/40 dark:text-sky-300'
                    }`}
                  >
                    {u.role === 'ADMIN' ? 'PANITIA' : 'JURI'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[var(--bg-muted)] text-[11px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Peran:</span>
                    <span className="font-semibold text-[var(--text-main)]">{u.roleLabel}</span>
                  </div>
                  {u.assignedMatchLabel && (
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-muted)]">Tugas Laga:</span>
                      <span className="font-bold text-[var(--color-arena-accent)]">{u.assignedMatchLabel}</span>
                    </div>
                  )}
                  {u.specialization && (
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-muted)]">Spesialisasi:</span>
                      <span className="font-bold text-[var(--color-arena-primary)]">{u.specialization}</span>
                    </div>
                  )}
                  {u.licenseLevel && (
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-muted)]">Sertifikasi:</span>
                      <span className="font-mono text-[var(--text-main)]">{u.licenseLevel}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{u.isAvailable !== false ? 'Aktif Bertugas' : 'Istirahat'}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(u)}
                      className="text-[var(--color-arena-primary)] hover:underline font-bold"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(u.id, u.name)}
                      className="text-red-600 hover:underline font-bold"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Form Tambah / Edit */}
          <UserFormModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setEditingOfficial(null);
            }}
            onSave={handleSaveOfficial}
            editingUser={editingOfficial}
          />

          {/* Modal Konfirmasi Hapus */}
          <ConfirmModal
            isOpen={Boolean(deleteTarget)}
            title="Hapus Akun Petugas"
            message={`Apakah Anda yakin ingin menghapus akun juri "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
            confirmLabel="Ya, Hapus Akun"
            cancelLabel="Batal"
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        </div>
      )}
    </div>
  );
};
