'use client';

import React, { useState } from 'react';
import {
  Menu,
  ChevronRight,
  Wifi,
  Search,
  ArrowLeft,
  LogOut,
  Moon,
  Sun,
  Filter,
  Whistle,
  X,
} from 'lucide-react';
import { SportCode, AppUser, PublicHeaderConfig } from '@/types';
import { AdminSidebar, AdminSubmenuId } from './AdminSidebar';
import { AdminOverviewModule } from './modules/AdminOverviewModule';
import { AdminMasterDataModule } from './modules/AdminMasterDataModule';
import { AdminParticipantsModule } from './modules/AdminParticipantsModule';
import { AdminMatchOpsModule } from './modules/AdminMatchOpsModule';
import { AdminTicketingModule } from './modules/AdminTicketingModule';
import { AdminSystemModule } from './modules/AdminSystemModule';
import { AdminCertificatesModule } from './modules/AdminCertificatesModule';
import { tournamentMeta, initialMatches, initialTickets } from '@/mocks/tournamentData';
import { ATHLETE_ID_CARDS } from '@/mocks/multiSportData';

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
  overview_stats: { category: 'Dashboard Utama', title: 'Ringkasan Statistik' },
  medal_tally: { category: 'Dashboard Utama', title: 'Klasemen Medali' },
  sports_list: { category: 'Data Lapangan', title: 'Daftar Cabor' },
  categories_numbers: { category: 'Data Lapangan', title: 'Nomor Tanding' },
  venues_courts: { category: 'Data Lapangan', title: 'Data Lapangan' },
  registration_verify: { category: 'Data Peserta', title: 'Verifikasi Berkas' },
  contingents_teams: { category: 'Data Peserta', title: 'Data Tim' },
  athletes_id_cards: { category: 'Data Peserta', title: 'Kartu Atlet' },
  drawing_bracket: { category: 'Kelola Laga', title: 'Bagan Turnamen' },
  schedule_plotting: { category: 'Kelola Laga', title: 'Jadwal Laga' },
  live_score_control: { category: 'Kelola Laga', title: 'Kontrol Skor' },
  group_standings: { category: 'Kelola Laga', title: 'Klasemen Grup' },
  ticket_management: { category: 'Tiket Masuk', title: 'Kuota Tiket' },
  transaction_history: { category: 'Tiket Masuk', title: 'Riwayat Transaksi' },
  qr_scanner_gate: { category: 'Tiket Masuk', title: 'Pindai Tiket' },
  cert_templates: { category: 'Sertifikat Digital', title: 'Desain Sertifikat' },
  cert_distribution: { category: 'Sertifikat Digital', title: 'Kirim Sertifikat' },
  referee_staff_accounts: { category: 'Pengaturan Sistem', title: 'Akun Petugas' },
  event_settings: { category: 'Pengaturan Sistem', title: 'Profil Event' },
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
  const [searchQuery, setSearchQuery] = useState('');

  const currentMeta = MENU_LABELS[activeSubmenu] || {
    category: 'Admin Console',
    title: 'Manajemen Turnamen',
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchResults =
    normalizedQuery.length > 1
      ? [
          ...ATHLETE_ID_CARDS.filter(
            (a) =>
              a.name.toLowerCase().includes(normalizedQuery) ||
              a.contingent.toLowerCase().includes(normalizedQuery)
          )
            .slice(0, 3)
            .map((a) => ({
              type: 'Atlet',
              label: a.name,
              desc: `${a.contingent} • ${a.sport}`,
              targetSubmenu: 'athletes_id_cards' as AdminSubmenuId,
            })),
          ...initialMatches
            .filter(
              (m) =>
                m.teamAName.toLowerCase().includes(normalizedQuery) ||
                m.teamBName.toLowerCase().includes(normalizedQuery)
            )
            .slice(0, 3)
            .map((m) => ({
              type: 'Laga',
              label: `${m.teamAName} vs ${m.teamBName}`,
              desc: `${m.courtName} • ${m.scheduledTime}`,
              targetSubmenu: 'schedule_plotting' as AdminSubmenuId,
            })),
          ...initialTickets
            .filter(
              (t) =>
                t.code.toLowerCase().includes(normalizedQuery) ||
                t.buyerName.toLowerCase().includes(normalizedQuery)
            )
            .slice(0, 3)
            .map((t) => ({
              type: 'Tiket',
              label: t.code,
              desc: `${t.buyerName} (${t.quantity} tiket)`,
              targetSubmenu: 'ticket_management' as AdminSubmenuId,
            })),
        ]
      : [];

  return (
    <div className="w-full min-h-screen h-screen flex bg-[var(--bg-page)] text-[var(--text-main)] overflow-hidden">
      {/* Collapsible Left Sidebar with Global Filter Cabor */}
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
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] flex items-center justify-between gap-3 sm:gap-4 sticky top-0 z-30 shrink-0 box-border">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="btn-tactile p-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] lg:hidden shrink-0"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative max-w-sm w-full hidden md:block">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
              <input
                type="text"
                placeholder="Cari atlet, jadwal, tiket, atau cabor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Cari data turnamen"
                className="w-full pl-10 pr-9 py-2 text-xs font-medium rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/70 text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)] focus:bg-[var(--bg-surface)] transition-all font-[var(--font-sans)]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus pencarian"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-[var(--text-main)] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Spotlight Live Search Dropdown */}
              {normalizedQuery.length > 1 && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xl p-1.5 z-50 divide-y divide-[var(--border-subtle)] max-h-80 overflow-y-auto animate-fadeIn">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)] font-[var(--font-display)]">
                    Hasil Pencarian ({searchResults.length})
                  </div>
                  {searchResults.map((res, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveSubmenu(res.targetSubmenu);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[var(--bg-muted)] rounded-xl transition-colors flex items-center justify-between gap-2 group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] font-[var(--font-display)]">
                            {res.type}
                          </span>
                          <span className="text-xs font-bold text-[var(--text-main)] truncate font-[var(--font-display)]">
                            {res.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5 font-[var(--font-sans)]">
                          {res.desc}
                        </p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--text-faint)] group-hover:text-[var(--text-main)] shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              )}

              {normalizedQuery.length > 1 && searchResults.length === 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xl p-3 z-50 text-center animate-fadeIn">
                  <p className="text-xs text-[var(--text-muted)] font-[var(--font-sans)]">
                    Tidak ditemukan hasil untuk &ldquo;{searchQuery}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {selectedSport !== 'ALL' && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] text-xs font-bold font-[var(--font-display)] border border-[var(--color-arena-primary)]/20 shadow-2xs">
                <Filter className="w-3.5 h-3.5" />
                <span>Cabor: {selectedSport}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold font-[var(--font-display)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>Realtime Matchday</span>
            </div>

            {onGoToReferee && (
              <button
                type="button"
                onClick={onGoToReferee}
                className="btn-tactile flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--color-arena-accent)] text-slate-900 font-extrabold text-xs shadow-xs hover:brightness-105 transition-all font-[var(--font-display)] tracking-wide"
                title="Buka panel juri lapangan"
              >
                <span>Panel Juri</span>
              </button>
            )}

            {onToggleDarkMode && (
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="btn-tactile p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)]"
                title={darkMode ? 'Mode terang' : 'Mode gelap'}
                aria-label="Ganti mode tampilan"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {onBackToPublic && (
              <button
                type="button"
                onClick={onBackToPublic}
                className="btn-tactile hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] text-xs font-semibold font-[var(--font-display)]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Halaman Publik</span>
              </button>
            )}

            {/* User Profile Section */}
            <div className="flex items-center gap-2 sm:gap-2.5 pl-2 sm:pl-3 border-l border-[var(--border-subtle)] shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--color-arena-dark)] text-[var(--color-arena-accent)] flex items-center justify-center font-black text-xs shrink-0 shadow-2xs border border-[var(--border-subtle)] font-[var(--font-display)]">
                {user?.avatarText || 'SA'}
              </div>
              <div className="hidden sm:block text-left max-w-[170px] lg:max-w-[240px]">
                <div className="text-xs font-bold text-[var(--text-main)] truncate leading-tight font-[var(--font-display)]">
                  {user?.name || 'Ust. H. Syamsul Arifin, M.Pd'}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] truncate font-medium mt-0.5 font-[var(--font-sans)]">
                  {user?.roleLabel || 'Komisioner & Superadmin MMFC I'}
                </div>
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="btn-tactile p-1.5 sm:p-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-500/10 transition-colors"
                  title="Keluar"
                  aria-label="Logout dari sesi admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Viewport Content with Generous Breathing Room */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 sm:px-10 lg:px-12 pt-7 pb-4">
            <div className="pb-5 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-medium font-[var(--font-sans)]">
                <span className="font-semibold text-[var(--text-faint)]">Sauma Arena Back-Office</span>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                <span className="font-bold text-[var(--color-arena-primary)] font-[var(--font-display)]">{currentMeta.category}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                <span className="text-[var(--text-main)] font-semibold">{currentMeta.title}</span>
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
                  {currentMeta.title}
                </h1>
                <span className="text-xs font-mono tabular-nums text-[var(--text-muted)]">
                  Turnamen: {tournamentMeta.shortTitle}
                </span>
              </div>
            </div>
          </div>

          <main className="px-6 sm:px-10 lg:px-12 pt-4 pb-24 max-w-7xl">
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

            {/* 2. Master Data & Venue */}
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

            {/* 3. Registrasi & Peserta */}
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
            {activeSubmenu === 'athletes_id_cards' && (
              <AdminParticipantsModule
                subTab="id_cards"
                onSelectSubTab={(t) =>
                  setActiveSubmenu(t === 'verification' ? 'registration_verify' : t === 'contingents' ? 'contingents_teams' : 'athletes_id_cards')
                }
                selectedSport={selectedSport}
              />
            )}

            {/* 4. Manajemen Pertandingan */}
            {activeSubmenu === 'drawing_bracket' && (
              <AdminMatchOpsModule
                subTab="brackets"
                onSelectSubTab={(t) =>
                  setActiveSubmenu(t === 'brackets' ? 'drawing_bracket' : t === 'schedule' ? 'schedule_plotting' : t === 'override' ? 'live_score_control' : 'group_standings')
                }
                selectedSport={selectedSport}
              />
            )}
            {activeSubmenu === 'schedule_plotting' && (
              <AdminMatchOpsModule
                subTab="schedule"
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
            {activeSubmenu === 'group_standings' && (
              <AdminMatchOpsModule
                subTab="standings"
                onSelectSubTab={(t) =>
                  setActiveSubmenu(t === 'brackets' ? 'drawing_bracket' : t === 'schedule' ? 'schedule_plotting' : t === 'override' ? 'live_score_control' : 'group_standings')
                }
                selectedSport={selectedSport}
              />
            )}

            {/* 5. Tiket & Akses Gate */}
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

            {/* 6. E-Sertifikat */}
            {(activeSubmenu === 'cert_templates' || activeSubmenu === 'cert_distribution') && (
              <AdminCertificatesModule
                subTab={activeSubmenu}
                onSelectSubTab={(t) => setActiveSubmenu(t)}
              />
            )}

            {/* 7. Pengguna & Sistem */}
            {activeSubmenu === 'referee_staff_accounts' && (
              <AdminSystemModule
                subTab="referee_staff_accounts"
                onSelectSubTab={(t) => setActiveSubmenu(t)}
                headerConfig={headerConfig}
                onSaveHeaderConfig={onSaveHeaderConfig}
                banners={banners}
                onSaveBanners={onSaveBanners}
              />
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
          </main>
        </div>
      </div>
    </div>
  );
};
