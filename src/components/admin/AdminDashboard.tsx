'use client';

import React, { useState, useEffect } from 'react';
import { SportCode, AppUser, PublicHeaderConfig } from '@/types';
import { AdminSidebar, AdminSubmenuId } from './AdminSidebar';
import { AdminHeader } from './layout/AdminHeader';
import { AdminOverviewModule } from './modules/AdminOverviewModule';
import { AdminMasterDataModule } from './modules/AdminMasterDataModule';
import { AdminParticipantsModule } from './modules/AdminParticipantsModule';
import { AdminMatchOpsModule } from './modules/AdminMatchOpsModule';
import { AdminTicketingModule } from './modules/AdminTicketingModule';
import { AdminSystemModule } from './modules/AdminSystemModule';
import { CompetitionsManagementView } from './modules/master/CompetitionsManagementView';
import { AthletesPlayersTab } from './modules/participants/AthletesPlayersTab';
import { ResultsVerificationTab } from './modules/matches/ResultsVerificationTab';
import { MatchAssignmentsTab } from './modules/officials/MatchAssignmentsTab';
import { AuditLogsTab } from './modules/system/AuditLogsTab';
import { ReportsExportTab } from './modules/system/ReportsExportTab';
import { AccountSettingsView } from './modules/system/AccountSettingsView';
import { BackupRestoreTab } from './modules/system/BackupRestoreTab';
import { FEATURES } from '@/config/features';

interface AdminDashboardProps {
  user?: AppUser | null;
  onLogout?: () => void;
  onBackToPublic?: () => void;
  onGoToReferee?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  headerConfig?: PublicHeaderConfig;
  onSaveHeaderConfig?: (config: PublicHeaderConfig) => void;
  banners?: PublicHeaderConfig[];
  onSaveBanners?: (banners: PublicHeaderConfig[]) => void;
}

const MENU_LABELS: Record<AdminSubmenuId, { category: string; title: string }> = {
  overview_stats: { category: 'BERANDA', title: 'Ringkasan Hari Ini' },
  medal_tally: { category: 'BERANDA', title: 'Klasemen Medali' },
  competitions_list: { category: 'PERSIAPAN KOMPETISI', title: 'Daftar Kompetisi' },
  sports_list: { category: 'PERSIAPAN KOMPETISI', title: 'Cabang Olahraga & Aturan' },
  categories_numbers: { category: 'PERSIAPAN KOMPETISI', title: 'Kategori & Kelas' },
  venues_courts: { category: 'PERSIAPAN KOMPETISI', title: 'Lokasi & Lapangan' },
  registration_verify: { category: 'PESERTA', title: 'Verifikasi Berkas' },
  contingents_teams: { category: 'PESERTA', title: 'Tim' },
  athletes_players: { category: 'PESERTA', title: 'Pemain & Atlet' },
  athletes_id_cards: { category: 'PESERTA', title: 'Kartu Atlet' },
  schedule_plotting: { category: 'PERTANDINGAN', title: 'Jadwal & Bagan' },
  drawing_bracket: { category: 'PERTANDINGAN', title: 'Bagan Turnamen' },
  live_score_control: { category: 'PERTANDINGAN', title: 'Skor Langsung' },
  results_verification: { category: 'PERTANDINGAN', title: 'Verifikasi Hasil & Sanksi' },
  group_standings: { category: 'PERTANDINGAN', title: 'Klasemen' },
  protests_sanctions: { category: 'PERTANDINGAN', title: 'Protes & Sanksi' },
  referee_staff_accounts: { category: 'PENGATURAN', title: 'Akun Petugas' },
  match_assignments: { category: 'PERTANDINGAN', title: 'Penugasan Pertandingan' },
  event_settings: { category: 'PENGATURAN', title: 'Pengaturan Publik' },
  account_settings: { category: 'PENGATURAN', title: 'Pengaturan Akun' },
  backup_restore: { category: 'PENGATURAN', title: 'Backup & Restore' },
  audit_logs: { category: 'PENGATURAN', title: 'Riwayat Perubahan' },
  reports_export: { category: 'PENGATURAN', title: 'Laporan & Ekspor' },
  ticket_management: { category: 'TIKET MASUK', title: 'Kuota Tiket' },
  transaction_history: { category: 'TIKET MASUK', title: 'Riwayat Transaksi' },
  qr_scanner_gate: { category: 'TIKET MASUK', title: 'Pindai Tiket' },
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout,
  onBackToPublic,
  onGoToReferee,
  darkMode,
  onToggleDarkMode,
  headerConfig,
  onSaveHeaderConfig,
  banners,
  onSaveBanners,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<AdminSubmenuId>('overview_stats');
  const [selectedSport, setSelectedSport] = useState<SportCode>('ALL');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeCompetition, setActiveCompetition] = useState(
    'Milad Matsanega Futsal Competition I (MMFC I)'
  );

  // Redirect to home if ticketing is disabled but user hits ticketing route
  useEffect(() => {
    if (!FEATURES.ticketing) {
      if (
        activeSubmenu === 'ticket_management' ||
        activeSubmenu === 'transaction_history' ||
        activeSubmenu === 'qr_scanner_gate'
      ) {
        setActiveSubmenu('overview_stats');
      }
    }
  }, [activeSubmenu]);

  const currentMeta = MENU_LABELS[activeSubmenu] || {
    category: 'Admin Arena',
    title: 'Manajemen Turnamen',
  };

  return (
    <div className="w-full min-h-screen h-screen flex bg-[var(--bg-page)] text-[var(--text-main)] overflow-hidden">
      {/* Collapsible Left Sidebar */}
      <AdminSidebar
        activeSubmenu={activeSubmenu}
        onSelectSubmenu={setActiveSubmenu}
        selectedSport={selectedSport}
        onSelectSport={setSelectedSport}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        user={user}
        onLogout={onLogout}
        onBackToPublic={onBackToPublic}
        onGoToReferee={onGoToReferee}
        activeCompetition={activeCompetition}
        onSelectCompetition={setActiveCompetition}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminHeader
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          selectedSport={selectedSport}
          onSelectSubmenu={setActiveSubmenu}
          user={user}
          onLogout={onLogout}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
          currentMeta={currentMeta}
        />

        {/* Viewport Content */}
        <div className="flex-1 overflow-y-auto">
          <main className="px-6 sm:px-10 lg:px-12 pt-7 pb-24 max-w-7xl">
            {/* 1. Beranda */}
            {activeSubmenu === 'overview_stats' && (
              <AdminOverviewModule
                subTab="stats"
                onSelectSubTab={(t) => setActiveSubmenu(t === 'stats' ? 'overview_stats' : 'medal_tally')}
                selectedSport={selectedSport}
              />
            )}
            {activeSubmenu === 'medal_tally' && (
              <AdminOverviewModule
                subTab="medals"
                onSelectSubTab={(t) => setActiveSubmenu(t === 'stats' ? 'overview_stats' : 'medal_tally')}
                selectedSport={selectedSport}
              />
            )}

            {/* 2. Persiapan Kompetisi */}
            {activeSubmenu === 'competitions_list' && (
              <CompetitionsManagementView />
            )}
            {activeSubmenu === 'sports_list' && (
              <AdminMasterDataModule
                subTab="sports"
                onSelectSubTab={(t) =>
                  setActiveSubmenu(t === 'sports' ? 'sports_list' : t === 'categories' ? 'categories_numbers' : 'venues_courts')
                }
              />
            )}
            {activeSubmenu === 'categories_numbers' && (
              <AdminMasterDataModule
                subTab="categories"
                onSelectSubTab={(t) =>
                  setActiveSubmenu(t === 'sports' ? 'sports_list' : t === 'categories' ? 'categories_numbers' : 'venues_courts')
                }
              />
            )}
            {activeSubmenu === 'venues_courts' && (
              <AdminMasterDataModule
                subTab="venues"
                onSelectSubTab={(t) =>
                  setActiveSubmenu(t === 'sports' ? 'sports_list' : t === 'categories' ? 'categories_numbers' : 'venues_courts')
                }
              />
            )}

            {/* 3. Peserta */}
            {activeSubmenu === 'registration_verify' && (
              <AdminParticipantsModule
                subTab="verification"
                onSelectSubTab={(t) =>
                  setActiveSubmenu(t === 'verification' ? 'registration_verify' : t === 'contingents' ? 'contingents_teams' : 'athletes_id_cards')
                }
                selectedSport={selectedSport}
              />
            )}
            {activeSubmenu === 'contingents_teams' && (
              <AdminParticipantsModule
                subTab="contingents"
                onSelectSubTab={(t) =>
                  setActiveSubmenu(t === 'verification' ? 'registration_verify' : t === 'contingents' ? 'contingents_teams' : 'athletes_id_cards')
                }
                selectedSport={selectedSport}
              />
            )}
            {activeSubmenu === 'athletes_players' && (
              <AthletesPlayersTab />
            )}
            {activeSubmenu === 'athletes_id_cards' && (
              <AdminParticipantsModule
                subTab="id_cards"
                onSelectSubTab={(t) =>
                  setActiveSubmenu(t === 'verification' ? 'registration_verify' : t === 'contingents' ? 'contingents_teams' : 'athletes_id_cards')
                }
                selectedSport={selectedSport}
              />
            )}

            {/* 4. Pertandingan */}
            {activeSubmenu === 'schedule_plotting' && (
              <AdminMatchOpsModule
                subTab="schedule"
                onSelectSubTab={(t) =>
                  setActiveSubmenu(t === 'brackets' ? 'drawing_bracket' : t === 'schedule' ? 'schedule_plotting' : t === 'override' ? 'live_score_control' : 'group_standings')
                }
                selectedSport={selectedSport}
              />
            )}
            {activeSubmenu === 'drawing_bracket' && (
              <AdminMatchOpsModule
                subTab="brackets"
                onSelectSubTab={(t) =>
                  setActiveSubmenu(t === 'brackets' ? 'drawing_bracket' : t === 'schedule' ? 'schedule_plotting' : t === 'override' ? 'live_score_control' : 'group_standings')
                }
                selectedSport={selectedSport}
              />
            )}
            {activeSubmenu === 'live_score_control' && (
              <AdminMatchOpsModule
                subTab="override"
                onSelectSubTab={(t) =>
                  setActiveSubmenu(t === 'brackets' ? 'drawing_bracket' : t === 'schedule' ? 'schedule_plotting' : t === 'override' ? 'live_score_control' : 'group_standings')
                }
                selectedSport={selectedSport}
              />
            )}
            {(activeSubmenu === 'results_verification' || activeSubmenu === 'protests_sanctions') && (
              <ResultsVerificationTab
                activeSubTab={activeSubmenu === 'protests_sanctions' ? 'SANCTIONS' : 'VERIFICATION'}
              />
            )}
            {activeSubmenu === 'group_standings' && (
              <AdminMatchOpsModule
                subTab="standings"
                onSelectSubTab={(t) =>
                  setActiveSubmenu(t === 'brackets' ? 'drawing_bracket' : t === 'schedule' ? 'schedule_plotting' : t === 'override' ? 'live_score_control' : 'group_standings')
                }
                selectedSport={selectedSport}
              />
            )}

            {/* 5. Pengaturan & Akun */}
            {(activeSubmenu === 'account_settings' || activeSubmenu === 'referee_staff_accounts') && (
              <AccountSettingsView
                initialSubTab={activeSubmenu === 'referee_staff_accounts' ? 'referee_staff_accounts' : 'admin_profile'}
                user={user}
                darkMode={darkMode}
                onToggleDarkMode={onToggleDarkMode}
              />
            )}
            {activeSubmenu === 'backup_restore' && (
              <BackupRestoreTab />
            )}
            {activeSubmenu === 'event_settings' && (
              <AdminSystemModule
                subTab="event_settings"
                onSelectSubTab={(t) => setActiveSubmenu(t)}
                headerConfig={headerConfig}
                onSaveHeaderConfig={onSaveHeaderConfig}
                banners={banners}
                onSaveBanners={onSaveBanners}
              />
            )}
            {activeSubmenu === 'match_assignments' && (
              <MatchAssignmentsTab />
            )}
            {activeSubmenu === 'audit_logs' && (
              <AuditLogsTab />
            )}
            {activeSubmenu === 'reports_export' && (
              <ReportsExportTab />
            )}

            {/* 7. Tiket Masuk (Only when enabled) */}
            {FEATURES.ticketing && (
              <>
                {activeSubmenu === 'ticket_management' && (
                  <AdminTicketingModule
                    subTab="ticket_management"
                    onSelectSubTab={(t) => setActiveSubmenu(t)}
                  />
                )}
                {activeSubmenu === 'transaction_history' && (
                  <AdminTicketingModule
                    subTab="transaction_history"
                    onSelectSubTab={(t) => setActiveSubmenu(t)}
                  />
                )}
                {activeSubmenu === 'qr_scanner_gate' && (
                  <AdminTicketingModule
                    subTab="qr_scanner_gate"
                    onSelectSubTab={(t) => setActiveSubmenu(t)}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
