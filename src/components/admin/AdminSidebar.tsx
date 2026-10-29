'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Trophy,
  CalendarDays,
  Boxes,
  Layers,
  MapPin,
  Users,
  CheckSquare,
  UserCheck,
  CreditCard,
  Swords,
  Calendar,
  GitBranch,
  Activity,
  FileCheck2,
  ListOrdered,
  AlertOctagon,
  ShieldCheck,
  UserCog,
  Settings,
  History,
  FileSpreadsheet,
  Ticket,
  Receipt,
  QrCode,
  Globe,
  Database,
  Tablet,
  ChevronDown,
  ChevronRight,
  Filter,
  X,
  ArrowLeft,
} from 'lucide-react';
import { SportCode, AppUser } from '@/types';
import { SPORTS_CONFIG } from '@/mocks/multiSportData';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';
import { getAdminMenuConfig } from '@/config/menuConfig';
import { initialTeams } from '@/mocks/mockTeams';
import { initialMatches } from '@/mocks/tournamentData';

export type AdminSubmenuId =
  | 'overview_stats'
  | 'medal_tally'
  | 'competitions_list'
  | 'sports_list'
  | 'categories_numbers'
  | 'venues_courts'
  | 'registration_verify'
  | 'contingents_teams'
  | 'athletes_players'
  | 'referee_staff_accounts'
  | 'event_settings'
  | 'match_settings'
  | 'account_settings'
  | 'backup_restore'
  | 'reports_export'
  | 'ticket_management'
  | 'transaction_history'
  | 'qr_scanner_gate';

export type AdminTab = AdminSubmenuId;

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BarChart3,
  Trophy,
  CalendarDays,
  Boxes,
  Layers,
  MapPin,
  Users,
  CheckSquare,
  UserCheck,
  CreditCard,
  Swords,
  Calendar,
  GitBranch,
  Activity,
  FileCheck2,
  ListOrdered,
  AlertOctagon,
  ShieldCheck,
  UserCog,
  Settings,
  History,
  FileSpreadsheet,
  Ticket,
  Receipt,
  QrCode,
  Globe,
  Database,
  Tablet,
};

interface AdminSidebarProps {
  activeTab?: AdminSubmenuId;
  activeSubmenu?: AdminSubmenuId;
  onSelectTab?: (id: AdminSubmenuId) => void;
  onSelectSubmenu?: (id: AdminSubmenuId) => void;
  selectedSport: SportCode;
  onSelectSport: (sport: SportCode) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  user?: AppUser | null;
  onLogout?: () => void;
  onBackToPublic?: () => void;
  onGoToReferee?: () => void;
  activeCompetition?: string;
  onSelectCompetition?: (comp: string) => void;
}

const AVAILABLE_COMPETITIONS = [
  'Milad Matsanega Futsal Competition I (MMFC I)',
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  activeSubmenu,
  onSelectTab,
  onSelectSubmenu,
  selectedSport,
  onSelectSport,
  isOpenMobile,
  onCloseMobile,
  onBackToPublic,
  onGoToReferee,
  activeCompetition = AVAILABLE_COMPETITIONS[0],
  onSelectCompetition,
}) => {
  const currentSubmenu = activeSubmenu || activeTab || 'overview_stats';
  const handleSelect = onSelectSubmenu || onSelectTab || (() => {});

  // Compute pending items for badge counts
  const pendingTeamsCount = initialTeams.filter((t) => t.registrationStatus === 'PENDING').length;
  const unverifiedMatchesCount = initialMatches.filter(
    (m) => m.status === 'COMPLETED' && m.isVerified === false
  ).length;

  const menuGroups = getAdminMenuConfig({
    pendingTeams: pendingTeamsCount,
    unverifiedMatches: unverifiedMatchesCount,
  });

  // Track expanded menu sections: default only group with active item is open
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    menuGroups.forEach((grp) => {
      initial[grp.id] = grp.items.some((it) => it.id === currentSubmenu);
    });
    return initial;
  });

  // Ensure active section is open when activeSubmenu changes
  useEffect(() => {
    const activeGroup = menuGroups.find((grp) =>
      grp.items.some((it) => it.id === currentSubmenu)
    );
    if (activeGroup && !expandedSections[activeGroup.id]) {
      setExpandedSections((prev) => ({ ...prev, [activeGroup.id]: true }));
    }
  }, [currentSubmenu, menuGroups]);

  const toggleSection = (secId: string) => {
    setExpandedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  const [currentComp, setCurrentComp] = useState(activeCompetition);

  const handleCompChange = (comp: string) => {
    setCurrentComp(comp);
    if (onSelectCompetition) onSelectCompetition(comp);
  };

  return (
    <>
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fadeIn"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex flex-col transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0 box-border">
          <div className="flex items-center gap-3">
            <SaumaArenaLogo size="sm" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bebas text-lg tracking-wider text-[var(--text-main)] uppercase">
                  ADMIN ARENA
                </span>
                <span className="w-2 h-2 rounded-full bg-[var(--color-arena-primary)] shadow-2xs" />
              </div>
              <p className="text-[10px] text-[var(--text-muted)] font-barlow font-bold uppercase tracking-wider">
                Panel Panitia Pelaksana
              </p>
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

        {/* Paling Atas Sidebar: Dropdown Kompetisi Aktif */}
        <div className="p-3 bg-[var(--bg-muted)]/60 border-b border-[var(--border-subtle)] space-y-1">
          <label className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-primary)] flex items-center gap-1">
            <Trophy className="w-3 h-3 text-[var(--color-arena-primary)]" />
            <span>Kompetisi Aktif:</span>
          </label>
          <div className="relative">
            <select
              value={currentComp}
              onChange={(e) => handleCompChange(e.target.value)}
              className="w-full pl-2.5 pr-7 py-1.5 text-xs font-barlow font-bold tracking-wide rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)] shadow-2xs appearance-none truncate"
            >
              {AVAILABLE_COMPETITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>


        {/* Collapsible Main Menu Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
          {menuGroups.map((section) => {
            const SectionIcon = ICON_MAP[section.icon] || BarChart3;
            const isExpanded = expandedSections[section.id] ?? false;
            const hasActiveChild = section.items.some((item) => item.id === currentSubmenu);

            return (
              <div key={section.id} className="rounded-xl transition-colors">
                {/* Section Header Button */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className={`btn-tactile w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${
                    hasActiveChild
                      ? 'text-[var(--color-arena-primary)] font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <SectionIcon
                      className={`w-[18px] h-[18px] shrink-0 ${
                        hasActiveChild ? 'text-[var(--color-arena-primary)]' : 'text-[var(--text-muted)]'
                      }`}
                    />
                    <span className="text-[13px] truncate font-barlow font-extrabold uppercase tracking-wider">
                      {section.title}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-[var(--text-faint)] shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[var(--text-faint)] shrink-0" />
                  )}
                </button>

                {/* Submenu Items */}
                {isExpanded && (
                  <div className="pl-5 pr-1 py-1 space-y-1 mt-0.5">
                    {section.items.map((sub) => {
                      const isActive = currentSubmenu === sub.id;
                      const isComingSoon = sub.status === 'coming_soon';

                      return (
                        <button
                          key={sub.id}
                          type="button"
                          disabled={isComingSoon}
                          title={sub.tooltip || (isComingSoon ? 'Fitur ini segera hadir' : sub.label)}
                          onClick={() => {
                            if (!isComingSoon) {
                              handleSelect(sub.id as AdminSubmenuId);
                              onCloseMobile();
                            }
                          }}
                          className={`btn-tactile w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                            isComingSoon
                              ? 'opacity-40 cursor-not-allowed text-[var(--text-muted)]'
                              : isActive
                              ? 'bg-[var(--color-arena-primary)] text-white font-bold shadow-xs'
                              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] font-semibold'
                          }`}
                        >
                          <span className="text-sm font-barlow font-bold tracking-wide truncate">
                            {sub.label}
                          </span>

                          {sub.badge && (
                            <span
                              className={`text-[10px] font-barlow font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                                isActive
                                  ? 'bg-white/25 text-white'
                                  : sub.badge.type === 'live'
                                  ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 font-black animate-pulse'
                                  : isComingSoon
                                  ? 'bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                                  : 'bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] dark:bg-sky-950/40 dark:text-sky-300'
                              }`}
                            >
                              {sub.badge.text}
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
