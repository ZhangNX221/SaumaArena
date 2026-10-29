'use client';

import React, { useState, useEffect } from 'react';
import { SportCode, AppUser, PublicHeaderConfig } from '@/types';
import { AdminSidebar, AdminSubmenuId } from './AdminSidebar';
import { AdminHeader } from './layout/AdminHeader';
import { AdminOverviewModule } from './modules/AdminOverviewModule';
import { AdminMasterDataModule } from './modules/AdminMasterDataModule';
import { AdminParticipantsModule } from './modules/AdminParticipantsModule';
import { AdminTicketingModule } from './modules/AdminTicketingModule';
import { AdminSystemModule } from './modules/AdminSystemModule';
import { CompetitionsManagementView } from './modules/master/CompetitionsManagementView';
import { AthletesPlayersTab } from './modules/participants/AthletesPlayersTab';
import { ReportsExportTab } from './modules/system/ReportsExportTab';
import { AccountSettingsView } from './modules/system/AccountSettingsView';
import { BackupRestoreTab } from './modules/system/BackupRestoreTab';
import { MatchSettingsView } from './modules/system/MatchSettingsView';
import { AdminMatchOpsModule } from './modules/AdminMatchOpsModule';
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
  overview_stats: { category: 'BERANDA', title: 'Ringkasan Utama' },
  medal_tally: { category: 'BERANDA', title: 'Klasemen Medali' },
  competitions_list: { category: 'PERSIAPAN KOMPETISI', title: 'Daftar Kompetisi' },
  sports_list: { category: 'PERSIAPAN KOMPETISI', title: 'Cabang Olahraga' },
  categories_numbers: { category: 'PERSIAPAN KOMPETISI', title: 'Kategori Kelas' },
  venues_courts: { category: 'PERSIAPAN KOMPETISI', title: 'Lokasi Lapangan' },
  registration_verify: { category: 'PESERTA', title: 'Verifikasi Berkas' },
  contingents_teams: { category: 'PESERTA', title: 'Daftar Tim' },
  athletes_players: { category: 'PESERTA', title: 'Daftar Atlet' },
  referee_staff_accounts: { category: 'PENGATURAN', title: 'Akun Petugas' },
  event_settings: { category: 'PENGATURAN', title: 'Pengaturan Publik' },
  match_settings: { category: 'PENGATURAN', title: 'Pengaturan Pertandingan' },
  account_settings: { category: 'PENGATURAN', title: 'Pengaturan Akun' },
  backup_restore: { category: 'PENGATURAN', title: 'Pengaturan Database' },
  reports_export: { category: 'PENGATURAN', title: 'Laporan Ekspor' },
  ticket_management: { category: 'TIKET MASUK', title: 'Kuota Tiket' },
  transaction_history: { category: 'TIKET MASUK', title: 'Riwayat Transaksi' },
  qr_scanner_gate: { category: 'TIKET MASUK', title: 'Pindai Tiket' },
  schedule_plotting: { category: 'PERTANDINGAN', title: 'Jadwal & Hasil Laga' },
  live_score_override: { category: 'PERTANDINGAN', title: 'Live Score Lapangan' },
  group_standings: { category: 'PERTANDINGAN', title: 'Klasemen Grup' },
  drawing_bracket: { category: 'PERTANDINGAN', title: 'Bagan Babak Gugur' },

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
  const [selectedSport, setSelectedSport] = useState<SportCode>('FUTSAL');
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
          onBackToPublic={onBackToPublic}
          onGoToReferee={onGoToReferee}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
          currentMeta={currentMeta}
        />

        {/* Viewport Content */}
        <div className="flex-1 overflow-y-auto">
          <main className="w-full px-6 sm:px-10 lg:px-12 pt-7 pb-24 max-w-7xl mx-auto">
            {/* 1. Beranda */}
            {(activeSubmenu === 'overview_stats' || activeSubmenu === 'medal_tally') && (
              <AdminOverviewModule
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
                  setActiveSubmenu(t === 'verification' ? 'registration_verify' : 'contingents_teams')
                }
                selectedSport={selectedSport}
              />
            )}
            {activeSubmenu === 'contingents_teams' && (
              <AdminParticipantsModule
                subTab="contingents"
                onSelectSubTab={(t) =>
                  setActiveSubmenu(t === 'verification' ? 'registration_verify' : 'contingents_teams')
                }
                selectedSport={selectedSport}
              />
            )}
            {activeSubmenu === 'athletes_players' && (
              <AthletesPlayersTab />
            )}


            
            {/* 4. Pertandingan & Operasional Lapangan */}
            {activeSubmenu === 'schedule_plotting' && (
              <AdminMatchOpsModule
                selectedSport={selectedSport}
                subTab="schedule"
                onSelectSubTab={(t) =>
                  setActiveSubmenu(
                    t === 'schedule'
                      ? 'schedule_plotting'
                      : t === 'override'
                      ? 'live_score_override'
                      : t === 'standings'
                      ? 'group_standings'
                      : 'drawing_bracket'
                  )
                }
              />
            )}
            {activeSubmenu === 'live_score_override' && (
              <AdminMatchOpsModule
                selectedSport={selectedSport}
                subTab="override"
                onSelectSubTab={(t) =>
                  setActiveSubmenu(
                    t === 'schedule'
                      ? 'schedule_plotting'
                      : t === 'override'
                      ? 'live_score_override'
                      : t === 'standings'
                      ? 'group_standings'
                      : 'drawing_bracket'
                  )
                }
              />
            )}
            {activeSubmenu === 'group_standings' && (
              <AdminMatchOpsModule
                selectedSport={selectedSport}
                subTab="standings"
                onSelectSubTab={(t) =>
                  setActiveSubmenu(
                    t === 'schedule'
                      ? 'schedule_plotting'
                      : t === 'override'
                      ? 'live_score_override'
                      : t === 'standings'
                      ? 'group_standings'
                      : 'drawing_bracket'
                  )
                }
              />
            )}
            {activeSubmenu === 'drawing_bracket' && (
              <AdminMatchOpsModule
                selectedSport={selectedSport}
                subTab="brackets"
                onSelectSubTab={(t) =>
                  setActiveSubmenu(
                    t === 'schedule'
                      ? 'schedule_plotting'
                      : t === 'override'
                      ? 'live_score_override'
                      : t === 'standings'
                      ? 'group_standings'
                      : 'drawing_bracket'
                  )
                }
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
            {activeSubmenu === 'match_settings' && (
              <MatchSettingsView />
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
