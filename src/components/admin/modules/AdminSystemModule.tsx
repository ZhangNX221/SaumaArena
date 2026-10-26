'use client';

import React, { useState } from 'react';
import { Users, Settings, Plus, ShieldCheck, Mail, Phone, Award, Megaphone, CheckCircle2, Save, Globe } from 'lucide-react';
import { PRESET_USERS } from '@/mocks/multiSportData';
import { AppUser, SportCode, PublicHeaderConfig } from '@/types';
import { DEFAULT_HEADER_CONFIG } from '@/mocks/headerConfig';
import { AdminBannerConfig } from './AdminBannerConfig';
import { ConfirmModal } from '@/components/admin/common/ConfirmModal';
import { UserFormModal, UserFormData } from './system/UserFormModal';
import { PublicPartnersTab } from './system/PublicPartnersTab';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';

interface AdminSystemModuleProps {
  subTab: 'referee_staff_accounts' | 'event_settings';
  onSelectSubTab: (tab: 'referee_staff_accounts' | 'event_settings') => void;
  headerConfig?: PublicHeaderConfig;
  onSaveHeaderConfig?: (config: PublicHeaderConfig) => void;
  banners?: PublicHeaderConfig[];
  onSaveBanners?: (banners: PublicHeaderConfig[]) => void;
}

export const AdminSystemModule: React.FC<AdminSystemModuleProps> = ({
  subTab,
  onSelectSubTab,
  headerConfig,
  onSaveHeaderConfig,
  banners,
  onSaveBanners,
}) => {
  const [users, setUsers] = useState<AppUser[]>(PRESET_USERS);
  const [userSearch, setUserSearch] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const [broadcastMessage, setBroadcastMessage] = useState('Pemberitahuan: Seluruh juri cabor Futsal harap berkumpul di Meja Pengawas pukul 14:00 WIB untuk briefing babak gugur.');
  const [isBroadcastSaved, setIsBroadcastSaved] = useState(false);
  const [publicSection, setPublicSection] = useState<'partners' | 'banners' | 'broadcast'>('partners');

  const handleOpenAddUser = () => {
    setEditingUser(null);
    setIsAddUserModalOpen(true);
  };

  const handleOpenEditUser = (u: AppUser) => {
    setEditingUser(u);
    setIsAddUserModalOpen(true);
  };

  const handleDeleteUser = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmDeleteUser = () => {
    if (deleteTarget) {
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleSaveUser = (data: UserFormData) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: data.name,
                email: data.email,
                role: data.role,
                roleLabel: data.role === 'ADMIN' ? 'Panitia Pertandingan' : `Juri Resmi ${data.specialization}`,
                specialization: data.specialization,
                licenseLevel: data.licenseLevel,
                avatarText: data.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
              }
            : u
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
        avatarText: data.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
        isAvailable: true,
      };
      setUsers((prev) => [...prev, created]);
    }

    setIsAddUserModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveBroadcast = () => {
    setIsBroadcastSaved(true);
    setTimeout(() => setIsBroadcastSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title Card */}
      <AdminPageHeaderCard
        icon={subTab === 'event_settings' ? Globe : Users}
        category={
          subTab === 'event_settings'
            ? 'PENGATURAN SISTEM • INFORMASI PUBLIK'
            : 'PENGATURAN SISTEM • AKUN PETUGAS'
        }
        title={
          subTab === 'event_settings'
            ? 'Pengaturan Portal & Informasi Publik'
            : 'Akun Juri & Panitia Turnamen'
        }
        description={
          subTab === 'event_settings'
            ? 'Kustomisasi identitas publik turnamen, banner carousel, mitra pendukung, serta siaran pengumuman ke meja lapangan.'
            : 'Kelola akun wasit dan pencatat meja, spesialisasi cabang olahraga, serta lisensi penugasan pertandingan.'
        }
        action={
          <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-[var(--bg-muted)]/80 border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider w-fit">
            <button
              type="button"
              onClick={() => onSelectSubTab('event_settings')}
              className={`btn-tactile px-3.5 py-2 rounded-xl transition-all ${
                subTab === 'event_settings'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Pengaturan Publik
            </button>
            <button
              type="button"
              onClick={() => onSelectSubTab('referee_staff_accounts')}
              className={`btn-tactile px-3.5 py-2 rounded-xl transition-all ${
                subTab === 'referee_staff_accounts'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Akun Juri &amp; Panitia ({users.length})
            </button>
          </div>
        }
      />

      {/* Sub-tab 1: Referee & Staff Accounts */}
      {subTab === 'referee_staff_accounts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-barlow font-bold uppercase tracking-wide text-[var(--text-main)]">
                Daftar Akun Juri &amp; Panitia Terdaftar
              </h3>
              <p className="text-xs text-[var(--text-muted)]">Juri hanya dapat melihat jadwal dan menginput skor pada cabor yang ditugaskan.</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Cari juri / petugas..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
              />
              <button
                type="button"
                onClick={handleOpenAddUser}
                className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-arena-primary)] text-white text-xs font-barlow font-bold uppercase tracking-wider shadow-xs hover:bg-[var(--color-arena-primary-hover)] shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Juri</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users
              .filter(
                (u) =>
                  u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                  u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                  (u.specialization && u.specialization.toLowerCase().includes(userSearch.toLowerCase()))
              )
              .map((u) => (
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
                    {u.role === 'ADMIN' ? 'ADMIN' : 'JURI'}
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
                      onClick={() => handleOpenEditUser(u)}
                      className="text-[var(--color-arena-primary)] hover:underline font-bold"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(u.id, u.name)}
                      className="text-red-600 hover:underline font-bold"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Tambah / Edit Juri */}
          <UserFormModal
            isOpen={isAddUserModalOpen}
            onClose={() => {
              setIsAddUserModalOpen(false);
              setEditingUser(null);
            }}
            onSave={handleSaveUser}
            editingUser={editingUser}
          />
        </div>
      )}

      {/* Sub-tab 2: Event Settings & Public Configurations */}
      {subTab === 'event_settings' && (
        <div className="space-y-6">
          {/* Title Card */}
          <AdminPageHeaderCard
            icon={Globe}
            category="PENGATURAN • KONFIGURASI PUBLIK"
            title="Pengaturan Portal & Informasi Publik"
            description="Kelola mitra dan sponsor resmi turnamen, konfigurasi banner header cabor, serta siaran pengumuman digital."
            action={
              <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-2xl bg-[var(--bg-muted)]/80 border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider w-fit">
                <button
                  type="button"
                  onClick={() => setPublicSection('partners')}
                  className={`btn-tactile flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                    publicSection === 'partners'
                      ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Mitra &amp; Sponsor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPublicSection('banners')}
                  className={`btn-tactile flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                    publicSection === 'banners'
                      ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Banner Turnamen</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPublicSection('broadcast')}
                  className={`btn-tactile flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                    publicSection === 'broadcast'
                      ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Siaran Meja</span>
                </button>
              </div>
            }
          />

          {/* 1. Mitra & Sponsor Turnamen */}
          {publicSection === 'partners' && <PublicPartnersTab />}

          {/* 2. Banner & Header Cabor */}
          {publicSection === 'banners' && (
            <AdminBannerConfig
              banners={banners}
              onSaveBanners={onSaveBanners}
              config={headerConfig || DEFAULT_HEADER_CONFIG}
              onSaveConfig={onSaveHeaderConfig || (() => {})}
            />
          )}

          {/* 3. Pesan Broadcast Meja */}
          {publicSection === 'broadcast' && (
            <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[var(--color-arena-accent)]" />
                <span>Pesan Broadcast ke Seluruh Meja Lapangan &amp; Juri</span>
              </h3>
              <div className="space-y-2 text-xs">
                <textarea
                  rows={3}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] leading-relaxed"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-muted)]">
                    Notifikasi ini akan langsung muncul di panel atas tablet/smartphone juri.
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveBroadcast}
                    className="btn-tactile flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] text-white font-bold text-xs shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Kirim Pengumuman Juri</span>
                  </button>
                </div>
                {isBroadcastSaved && (
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pengumuman berhasil disiarkan ke semua juri aktif.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reusable Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Akun Petugas"
        message={`Apakah Anda yakin ingin menghapus akun petugas "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Akun"
        cancelLabel="Batal"
        onConfirm={confirmDeleteUser}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
