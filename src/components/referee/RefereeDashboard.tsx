'use client';

import React, { useState } from 'react';
import { 
  Menu, 
  Radio, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  ChevronRight, 
  Moon, 
  Sun,
  ShieldCheck,
  Bell,
  WifiOff,
  LogOut,
  User,
} from 'lucide-react';
import { AppUser, Match, MatchEvent } from '@/types';
import { initialMatches } from '@/mocks/tournamentData';
import { REFEREE_DUTIES } from '@/mocks/multiSportData';
import { RefereeSidebar, RefereeTabKey } from './RefereeSidebar';
import { RefereeBottomNav } from './RefereeBottomNav';
import { RefereeMatchCenter } from './RefereeMatchCenter';
import { RefereeSchedule } from './RefereeSchedule';
import { RefereeRulebook } from './RefereeRulebook';
import { RefereeProfile } from './RefereeProfile';
import { RefereeDashboardHome } from './RefereeDashboardHome';
import { RefereeReportsView } from './RefereeReportsView';
import { RefereeRosterView } from './RefereeRosterView';

interface RefereeDashboardProps {
  user: AppUser;
  onLogout?: () => void;
  onBackToPublic?: () => void;
  onGoToAdmin?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const RefereeDashboard: React.FC<RefereeDashboardProps> = ({
  user: initialUser,
  onLogout,
  onBackToPublic,
  onGoToAdmin,
  darkMode = false,
  onToggleDarkMode,
}) => {
  const [currentUser, setCurrentUser] = useState<AppUser>(initialUser);
  const [activeTab, setActiveTab] = useState<RefereeTabKey>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Real match state: automatically linked to the match assigned to this referee
  const assignedMatch =
    initialMatches.find((m) => m.refereeIds?.includes(currentUser.id)) ||
    (currentUser.assignedMatchIds && initialMatches.find((m) => currentUser.assignedMatchIds?.includes(m.id))) ||
    initialMatches[0];

  const [liveMatch, setLiveMatch] = useState<Match>(assignedMatch);
  const [recentEvents, setRecentEvents] = useState<MatchEvent[]>(assignedMatch.events);
  const [notificationDismissed, setNotificationDismissed] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const handleUpdateProfile = (updated: Partial<AppUser>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  React.useEffect(() => {
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleUpdateScore = (team: 'A' | 'B', delta: number) => {
    setLiveMatch((prev) => ({
      ...prev,
      scoreA: team === 'A' ? Math.max(0, prev.scoreA + delta) : prev.scoreA,
      scoreB: team === 'B' ? Math.max(0, prev.scoreB + delta) : prev.scoreB,
    }));
  };

  const handleAddIncident = (event: Omit<MatchEvent, 'id'>) => {
    const newEv: MatchEvent = { ...event, id: `EV-${Date.now()}` };
    setRecentEvents((prev) => [newEv, ...prev]);
    setLiveMatch((prev) => ({ ...prev, events: [newEv, ...prev.events] }));
  };

  const handleFinalizeBAP = (bapData: { winner: string; notes: string }) => {
    setLiveMatch((prev) => ({
      ...prev,
      status: 'COMPLETED',
      bapSigned: true,
      bapSigner: currentUser.name,
    }));
  };

  return (
    <div className="w-full min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] flex overflow-hidden">
      {/* Sidebar for Desktop / Tablet */}
      <RefereeSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={currentUser}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onBackToPublic={onBackToPublic}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] h-16 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-muted)] lg:hidden"
              aria-label="Buka menu juri"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bebas text-lg sm:text-xl text-[var(--text-main)] tracking-wide uppercase">
                  Konsol Juri
                </h1>
                <span className="flex items-center gap-1 text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Tersinkron
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] hidden sm:block font-sans">
                {currentUser.name} &bull; {currentUser.roleLabel || 'Wasit Lapangan'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Connection Pill */}
            <div
              title={isOnline ? 'Terhubung ke server turnamen - Skor tersinkron otomatis' : 'Jaringan terputus - Mode offline aktif, skor tersimpan di perangkat'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-barlow font-bold uppercase tracking-wider border transition-colors duration-150 ${
                isOnline
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
              }`}
            >
              {isOnline ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="hidden sm:inline">Online &bull; Sinkron</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Mode Offline &bull; Tersimpan</span>
                </>
              )}
            </div>

            {onToggleDarkMode && (
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="btn-tactile p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--bg-muted)] active:scale-95 transition-all duration-150 min-h-[38px] min-w-[38px] flex items-center justify-center"
                title={darkMode ? 'Beralih ke mode siang' : 'Beralih ke mode malam'}
                aria-label="Mode tampilan"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* Profile Section in Topbar Right */}
            <div className="flex items-center gap-2 sm:gap-2.5 pl-2 sm:pl-3 border-l border-[var(--border-subtle)] shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`btn-tactile flex items-center gap-2 sm:gap-2.5 p-1 -m-1 rounded-xl transition-all duration-150 active:scale-[0.98] text-left ${
                  activeTab === 'profile'
                    ? 'ring-2 ring-[var(--color-arena-primary)] bg-[var(--bg-muted)]'
                    : 'hover:bg-[var(--bg-muted)]'
                }`}
                title="Buka Profil & Kesiapan Juri"
                aria-label="Profil juri"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--color-arena-dark)] text-[var(--color-arena-accent)] flex items-center justify-center font-bebas text-base shrink-0 border border-[var(--border-subtle)]">
                  {currentUser.avatarText || 'RH'}
                </div>
                <div className="hidden md:block text-left max-w-[170px] lg:max-w-[220px]">
                  <div className="text-xs font-barlow font-bold text-[var(--text-main)] truncate leading-tight tracking-wide">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] truncate font-medium mt-0.5">
                    {currentUser.roleLabel || 'Juri Resmi Lapangan'}
                  </div>
                </div>
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="btn-tactile p-1.5 sm:p-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-500/10 active:scale-90 transition-all duration-150"
                  title="Keluar dari akun juri"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Juri Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* TAB 0: DASHBOARD JURI */}
          {activeTab === 'dashboard' && (
            <RefereeDashboardHome
              user={currentUser}
              liveMatch={liveMatch}
              onGoToMatchCenter={() => setActiveTab('match_center')}
              onGoToSchedule={() => setActiveTab('duty')}
              onGoToReports={() => setActiveTab('reports')}
            />
          )}

          {/* TAB 1: TUGAS SAYA (DASHBOARD JURI - 3 TABS: HARI INI | MENDATANG | RIWAYAT) */}
          {activeTab === 'duty' && (
            <RefereeSchedule
              user={currentUser}
              initialTab="TODAY"
              onSelectDutyMatch={(duty) => {
                const found = initialMatches.find((m) => m.id === duty.matchId) || initialMatches[0];
                setLiveMatch(found);
                setActiveTab('match_center');
              }}
            />
          )}

          {/* TAB 2: JADWAL SAYA (MENDATANG) */}
          {activeTab === 'schedule' && (
            <RefereeSchedule
              user={currentUser}
              initialTab="UPCOMING"
              onSelectDutyMatch={(duty) => {
                const found = initialMatches.find((m) => m.id === duty.matchId) || initialMatches[0];
                setLiveMatch(found);
                setActiveTab('match_center');
              }}
            />
          )}

          {/* TAB 3: CATAT SKOR (DULU MATCH CENTER - 4-STEP WORKFLOW) */}
          {activeTab === 'match_center' && (
            <RefereeMatchCenter
              currentMatch={liveMatch}
              selectedSport="FUTSAL"
              onUpdateScore={handleUpdateScore}
              onAddIncident={handleAddIncident}
              onFinalizeBAP={handleFinalizeBAP}
            />
          )}

          {/* TAB 4: SUSUNAN PEMAIN & VERIFIKASI KEHADIRAN (TABEL TERPISAH) */}
          {activeTab === 'roster' && (
            <RefereeRosterView
              user={currentUser}
              currentMatch={liveMatch}
              onGoToScoring={() => setActiveTab('match_center')}
            />
          )}

          {/* TAB 4: LAPORAN & CATATAN WASIT */}
          {activeTab === 'reports' && (
            <RefereeReportsView user={currentUser} />
          )}

          {/* TAB 5: BUKU ATURAN (DULU BUKU REGULASI) */}
          {activeTab === 'rulebook' && <RefereeRulebook user={currentUser} />}

          {/* TAB 6: PROFIL & KESIAPAN */}
          {activeTab === 'profile' && (
            <RefereeProfile
              user={currentUser}
              onUpdateProfile={handleUpdateProfile}
              onUpdateAvailability={(status) => handleUpdateProfile({ isAvailable: status })}
              darkMode={darkMode}
              onToggleDarkMode={onToggleDarkMode}
            />
          )}
        </main>

        {/* Bottom Navigation for Mobile / Smartphone Field Access */}
        <RefereeBottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
      </div>
    </div>
  );
};
