'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Trophy,
  Users,
  Swords,
  Ticket,
  Award,
  Settings,
  ChevronDown,
  ChevronRight,
  Filter,
  X,
} from 'lucide-react';
import { SportCode, AppUser, AdminUser } from '@/types';
import { SPORTS_CONFIG } from '@/mocks/multiSportData';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';

export type AdminSubmenuId =
  | 'overview_stats'
  | 'medal_tally'
  | 'sports_list'
  | 'categories_numbers'
  | 'venues_courts'
  | 'registration_verify'
  | 'contingents_teams'
  | 'athletes_id_cards'
  | 'drawing_bracket'
  | 'schedule_plotting'
  | 'live_score_control'
  | 'group_standings'
  | 'ticket_management'
  | 'transaction_history'
  | 'qr_scanner_gate'
  | 'cert_templates'
  | 'cert_distribution'
  | 'referee_staff_accounts'
  | 'event_settings';

// Aliased for compatibility
export type AdminTab = AdminSubmenuId;

interface SidebarSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: Array<{
    id: AdminSubmenuId;
    label: string;
    badge?: string;
  }>;
}

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    id: 'sec_dashboard',
    title: 'Dashboard Utama',
    icon: BarChart3,
    items: [
      { id: 'overview_stats', label: 'Ringkasan Statistik' },
      { id: 'medal_tally', label: 'Klasemen Medali', badge: 'RESMI' },
    ],
  },
  {
    id: 'sec_master',
    title: 'Data Lapangan',
    icon: Trophy,
    items: [
      { id: 'sports_list', label: 'Daftar Cabor' },
      { id: 'categories_numbers', label: 'Nomor Tanding' },
      { id: 'venues_courts', label: 'Data Lapangan' },
    ],
  },
  {
    id: 'sec_participants',
    title: 'Data Peserta',
    icon: Users,
    items: [
      { id: 'registration_verify', label: 'Verifikasi Berkas', badge: '12 Tim' },
      { id: 'contingents_teams', label: 'Data Tim' },
      { id: 'athletes_id_cards', label: 'Kartu Atlet', badge: 'ID PASS' },
    ],
  },
  {
    id: 'sec_matches',
    title: 'Kelola Laga',
    icon: Swords,
    items: [
      { id: 'drawing_bracket', label: 'Bagan Turnamen' },
      { id: 'schedule_plotting', label: 'Jadwal Laga' },
      { id: 'live_score_control', label: 'Kontrol Skor', badge: 'LIVE' },
      { id: 'group_standings', label: 'Klasemen Grup' },
    ],
  },
  {
    id: 'sec_ticketing',
    title: 'Tiket Masuk',
    icon: Ticket,
    items: [
      { id: 'ticket_management', label: 'Kuota Tiket' },
      { id: 'transaction_history', label: 'Riwayat Transaksi' },
      { id: 'qr_scanner_gate', label: 'Pindai Tiket', badge: 'SCAN' },
    ],
  },
  {
    id: 'sec_certificates',
    title: 'Sertifikat Digital',
    icon: Award,
    items: [
      { id: 'cert_templates', label: 'Desain Sertifikat' },
      { id: 'cert_distribution', label: 'Kirim Sertifikat' },
    ],
  },
  {
    id: 'sec_system',
    title: 'Pengaturan Sistem',
    icon: Settings,
    items: [
      { id: 'referee_staff_accounts', label: 'Akun Petugas' },
      { id: 'event_settings', label: 'Profil Event' },
    ],
  },
];

interface AdminSidebarProps {
  activeTab?: AdminSubmenuId; // Backward-compatibility
  activeSubmenu?: AdminSubmenuId;
  onSelectTab?: (id: AdminSubmenuId) => void; // Backward-compatibility
  onSelectSubmenu?: (id: AdminSubmenuId) => void;
  selectedSport: SportCode;
  onSelectSport: (sport: SportCode) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  user?: AppUser | null;
  onLogout?: () => void;
  onBackToPublic?: () => void;
  onGoToReferee?: () => void;
  liveMatchInfo?: unknown;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  activeSubmenu,
  onSelectTab,
  onSelectSubmenu,
  selectedSport,
  onSelectSport,
  isOpenMobile,
  onCloseMobile,
  user,
  onLogout,
  onBackToPublic,
  onGoToReferee,
}) => {
  const currentSubmenu = activeSubmenu || activeTab || 'overview_stats';
  const handleSelect = onSelectSubmenu || onSelectTab || (() => {});

  // Track expanded menu sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    sec_dashboard: true,
    sec_master: true,
    sec_participants: true,
    sec_matches: true,
    sec_ticketing: false,
    sec_certificates: false,
    sec_system: false,
  });

  const toggleSection = (secId: string) => {
    setExpandedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  return (
    <>
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-fadeIn"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex flex-col transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'
        }`}
      >
        {/* Brand Header (h-16 to match topbar height and align border line) */}
        <div className="h-16 px-4 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0 box-border">
          <div className="flex items-center gap-3">
            <SaumaArenaLogo size="sm" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-[var(--text-main)] font-[var(--font-display)]">
                  ADMIN ARENA
                </span>
                <span className="w-2 h-2 rounded-full bg-[var(--color-arena-primary)] shadow-2xs" />
              </div>
              <p className="text-[10px] text-[var(--text-muted)] font-medium">Panel Admin Back-Office</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="btn-tactile p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] lg:hidden"
            aria-label="Tutup navigasi sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Filter Cabor Dropdown */}
        <div className="p-3 bg-[var(--bg-muted)]/40 border-b border-[var(--border-subtle)]">
          <label className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5 mb-1.5">
            <Filter className="w-3 h-3 text-[var(--color-arena-primary)]" />
            <span>Pilih Cabor:</span>
          </label>
          <div className="relative">
            <select
              value={selectedSport}
              onChange={(e) => onSelectSport(e.target.value as SportCode)}
              className="w-full pl-3 pr-8 py-2 text-xs font-bold rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)] shadow-xs appearance-none"
            >
              <option value="ALL">Semua Cabor</option>
              {SPORTS_CONFIG.map((sp) => (
                <option key={sp.code} value={sp.code}>
                  {sp.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[var(--text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Collapsible Main Menu Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {SIDEBAR_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSections[section.id] ?? false;
            const hasActiveChild = section.items.some((item) => item.id === currentSubmenu);

            return (
              <div key={section.id} className="rounded-xl transition-colors">
                {/* Section Header Button */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className={`btn-tactile w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                    hasActiveChild ? 'text-[var(--color-arena-primary)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${hasActiveChild ? 'text-[var(--color-arena-primary)]' : 'text-[var(--text-muted)]'}`} />
                    <span className="text-xs truncate font-bold">{section.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                  )}
                </button>

                {/* Submenu Accordion Items without left border */}
                {isExpanded && (
                  <div className="pl-6 pr-1 py-1 space-y-0.5 mt-0.5">
                    {section.items.map((sub) => {
                      const isActive = currentSubmenu === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            handleSelect(sub.id);
                            onCloseMobile();
                          }}
                          className={`btn-tactile w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all ${
                            isActive
                              ? 'bg-[var(--color-arena-primary)] text-white font-bold shadow-2xs'
                              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)]'
                          }`}
                        >
                          <span className="text-[11px] truncate">{sub.label}</span>
                          {sub.badge && (
                            <span
                              className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase shrink-0 ${
                                isActive ? 'bg-white/25 text-white' : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
                              }`}
                            >
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};
