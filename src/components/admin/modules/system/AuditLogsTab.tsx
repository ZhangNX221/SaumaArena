'use client';

import React, { useState } from 'react';
import { History, ShieldCheck, Filter, Search, CheckCircle2, Clock, UserCheck, AlertTriangle } from 'lucide-react';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  target: string;
  category: 'MATCH' | 'PARTICIPANTS' | 'SYSTEM' | 'SECURITY';
  details: string;
}

const INITIAL_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-01',
    timestamp: '24 Okt 2026, 11:45 WIB',
    userName: 'Ust. H. Syamsul Arifin, M.Pd',
    userRole: 'Superadmin',
    action: 'Pengesahan BAP',
    target: 'Pertandingan #1 (MIN 1 Kota vs MIS Al-Hidayah)',
    category: 'MATCH',
    details: 'Berita acara resmi disahkan dengan skor akhir 4 - 2.',
  },
  {
    id: 'LOG-02',
    timestamp: '24 Okt 2026, 11:15 WIB',
    userName: 'Juri M. Irfan, S.Pd',
    userRole: 'Wasit FFI',
    action: 'Tanda Tangan Berita Acara',
    target: 'Pertandingan #1',
    category: 'MATCH',
    details: 'Penutupan skor dan pencatatan 2 kartu kuning.',
  },
  {
    id: 'LOG-03',
    timestamp: '24 Okt 2026, 10:30 WIB',
    userName: 'Ust. H. Syamsul Arifin, M.Pd',
    userRole: 'Superadmin',
    action: 'Verifikasi Berkas Kontingen',
    target: 'Tim SDN Percobaan 1',
    category: 'PARTICIPANTS',
    details: 'Semua dokumen NISN 5 atlet utama disetujui.',
  },
  {
    id: 'LOG-04',
    timestamp: '24 Okt 2026, 09:00 WIB',
    userName: 'Ust. H. Syamsul Arifin, M.Pd',
    userRole: 'Superadmin',
    action: 'Perubahan Jadwal',
    target: 'Pertandingan #4',
    category: 'MATCH',
    details: 'Jadwal disesuaikan menjadi pukul 14:00 WIB di Court 1.',
  },
  {
    id: 'LOG-05',
    timestamp: '23 Okt 2026, 16:20 WIB',
    userName: 'Tim Panitia Turnamen',
    userRole: 'Staff Admin',
    action: 'Pembaruan Banner & Regulasi',
    target: 'Profil Event',
    category: 'SYSTEM',
    details: 'Pembaruan deskripsi dan tanggal pelaksanaan turnamen.',
  },
];

export const AuditLogsTab: React.FC = () => {
  const [logs] = useState<AuditLogEntry[]>(INITIAL_LOGS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase()) ||
      log.userName.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || log.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <AdminPageHeaderCard
        icon={History}
        category="PENGATURAN SISTEM • AUDIT TRAIL"
        title="Riwayat Perubahan &amp; Log Aktivitas"
        description="Catatan kronologis seluruh tindakan operator dan wasit: verifikasi berkas, pengesahan skor, perubahan jadwal, dan aturan turnamen."
        action={
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-mono font-bold text-[var(--text-muted)]">
              Total {logs.length} Aktivitas
            </span>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            type="text"
            placeholder="Cari aktivitas, nama pengguna, atau objek perubahan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-barlow font-bold uppercase tracking-wider"
        >
          <option value="ALL">Semua Kategori</option>
          <option value="MATCH">Pertandingan &amp; BAP</option>
          <option value="PARTICIPANTS">Peserta &amp; Berkas</option>
          <option value="SYSTEM">Sistem &amp; Banner</option>
        </select>
      </div>

      {/* Timeline List */}
      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
                  <span>{log.timestamp}</span>
                </span>
                <span className="text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] border border-[var(--border-subtle)]">
                  {log.action}
                </span>
              </div>

              <div className="text-sm font-bold text-[var(--text-main)]">
                {log.target}
              </div>

              <p className="text-xs text-[var(--text-muted)]">
                {log.details}
              </p>
            </div>

            <div className="text-right sm:border-l sm:border-[var(--border-subtle)] sm:pl-4 shrink-0">
              <div className="font-barlow font-bold text-xs text-[var(--text-main)]">
                {log.userName}
              </div>
              <div className="text-[11px] text-[var(--color-arena-primary)] font-mono">
                {log.userRole}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
