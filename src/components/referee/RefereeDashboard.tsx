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
  Bell
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

interface RefereeDashboardProps {
  user: AppUser;
  onLogout?: () => void;
  onBackToPublic?: () => void;
  onGoToAdmin?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const RefereeDashboard: React.FC<RefereeDashboardProps> = ({
  user,
  onLogout,
  onBackToPublic,
  onGoToAdmin,
  darkMode = false,
  onToggleDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<RefereeTabKey>('match_center');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Real match state: automatically linked to the match assigned to this referee
  const assignedMatch =
    initialMatches.find((m) => m.refereeIds?.includes(user.id)) ||
    (user.assignedMatchIds && initialMatches.find((m) => user.assignedMatchIds?.includes(m.id))) ||
    initialMatches[0];

  const [liveMatch, setLiveMatch] = useState<Match>(assignedMatch);
  const [recentEvents, setRecentEvents] = useState<MatchEvent[]>(assignedMatch.events);
  const [notificationDismissed, setNotificationDismissed] = useState(false);

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
      bapSigner: user.name,
    }));
  };

  return (
    <div className="w-full min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] flex overflow-hidden">
      {/* Sidebar for Desktop / Tablet */}
      <RefereeSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={user}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onBackToPublic={onBackToPublic}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Urgent Court Assignment Call Banner (Notice Rule 2) */}
        {!notificationDismissed && (
          <div className="bg-[#33658a] text-white px-4 py-2.5 sm:px-6 flex items-center justify-between text-xs font-semibold shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 shrink-0">
                <Bell className="w-3.5 h-3.5 text-[#f6ae2d]" />
              </span>
              <span className="truncate">
                <strong>Panggilan Tugas:</strong> Anda bertugas memimpin Laga #{liveMatch.matchNumber} ({liveMatch.teamAName} vs {liveMatch.teamBName}) di {liveMatch.courtName}.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('match_center')}
                className="btn-tactile px-2.5 py-1 rounded-md bg-[#f6ae2d] text-slate-950 font-black text-[11px]"
              >
                Masuk Lapangan
              </button>
              <button
                type="button"
                onClick={() => setNotificationDismissed(true)}
                className="text-white/70 hover:text-white px-1 text-[11px]"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

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
                <h1 className="font-black text-sm sm:text-base text-[var(--text-main)] font-[var(--font-display)]">
                  {user.name}
                </h1>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                  Siap Bertugas
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] hidden sm:block">
                {user.roleLabel} &bull; Spesialisasi: Futsal FFI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onToggleDarkMode && (
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="btn-tactile p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--bg-muted)] transition-colors"
                title={darkMode ? 'Beralih ke mode siang' : 'Beralih ke mode malam'}
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {onGoToAdmin && (
              <button
                type="button"
                onClick={onGoToAdmin}
                className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-arena-primary)] text-white text-xs font-bold hover:bg-[var(--color-arena-primary-hover)] shadow-xs"
                title="Buka panel admin"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Panel Admin</span>
              </button>
            )}

            {onBackToPublic && (
              <button
                type="button"
                onClick={onBackToPublic}
                className="btn-tactile hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-muted)]"
              >
                <span>Portal Publik</span>
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Juri Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* TAB 1: TUGAS HARI INI (DASHBOARD JURI) */}
          {activeTab === 'duty' && (
            <div className="space-y-6 max-w-4xl mx-auto pb-16">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] font-[var(--font-display)]">
                  Tugas Harian
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Ringkasan status tugas harian dan akses langsung ke kontrol pertandingan lapangan.
                </p>
              </div>

              {/* Duty Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-1">
                  <span className="text-[11px] font-semibold text-[var(--text-muted)]">Sudah Dipimpin</span>
                  <div className="text-2xl font-black font-mono text-[var(--text-main)]">1 Laga</div>
                  <span className="text-[10px] text-emerald-600 font-bold">BAP Selesai Sah</span>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-1">
                  <span className="text-[11px] font-semibold text-[var(--text-muted)]">Sedang Berjalan</span>
                  <div className="text-2xl font-black font-mono text-red-600">Laga #{liveMatch.matchNumber}</div>
                  <span className="text-[10px] text-red-500 font-bold">Court 1 (Futsal)</span>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-1">
                  <span className="text-[11px] font-semibold text-[var(--text-muted)]">Belum Dipimpin Hari Ini</span>
                  <div className="text-2xl font-black font-mono text-[#33658a]">1 Laga</div>
                  <span className="text-[10px] text-[var(--text-muted)]">Pukul 16:30 WITA</span>
                </div>
              </div>

              {/* Urgent Action Card */}
              <div className="p-6 rounded-2xl bg-[#0b1a28] text-white border border-[#1f374f] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    <span>Laga Berjalan Saat Ini</span>
                  </span>
                  <h3 className="text-lg font-black font-[var(--font-display)]">
                    {liveMatch.teamAName} vs {liveMatch.teamBName}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Court 1 &bull; Babak 2 &bull; Skor: {liveMatch.scoreA} - {liveMatch.scoreB}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('match_center')}
                  className="btn-tactile px-6 py-3 rounded-xl bg-[#33658a] hover:bg-[#264e6b] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs"
                >
                  <Play className="w-4 h-4" />
                  <span>Buka Match Center</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: JADWAL SAYA */}
          {activeTab === 'schedule' && (
            <RefereeSchedule
              user={user}
              onSelectDutyMatch={(duty) => {
                const found = initialMatches.find((m) => m.id === duty.matchId) || initialMatches[0];
                setLiveMatch(found);
                setActiveTab('match_center');
              }}
            />
          )}

          {/* TAB 3: MATCH CENTER (4-STEP WORKFLOW) */}
          {activeTab === 'match_center' && (
            <RefereeMatchCenter
              currentMatch={liveMatch}
              selectedSport="FUTSAL"
              onUpdateScore={handleUpdateScore}
              onAddIncident={handleAddIncident}
              onFinalizeBAP={handleFinalizeBAP}
            />
          )}

          {/* TAB 4: RULEBOOK */}
          {activeTab === 'rulebook' && <RefereeRulebook />}

          {/* TAB 5: PROFILE & KESIAPAN */}
          {activeTab === 'profile' && (
            <RefereeProfile
              user={user}
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
