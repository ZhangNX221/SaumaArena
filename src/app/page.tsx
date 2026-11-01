'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PublicTournamentHeader } from '@/components/public/PublicTournamentHeader';
import { PublicTabBar, PublicTabKey } from '@/components/public/PublicTabBar';
import { MobilePublicNav } from '@/components/public/MobilePublicNav';
import { InfoTab } from '@/components/public/tabs/InfoTab';
import { TeamsTab } from '@/components/public/tabs/TeamsTab';
import { ScheduleTab } from '@/components/public/tabs/ScheduleTab';
import { StandingsTab } from '@/components/public/tabs/StandingsTab';
import { BracketTab } from '@/components/public/tabs/BracketTab';
import { StatsTab } from '@/components/public/tabs/StatsTab';
import { SupporterTab } from '@/components/public/tabs/SupporterTab';
import { LiveMatchTab } from '@/components/public/tabs/LiveMatchTab';
import { TicketModal } from '@/components/public/TicketModal';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { RefereeDashboard } from '@/components/referee/RefereeDashboard';
import { AppUser, PublicHeaderConfig } from '@/types';
import { initialTeams } from '@/mocks/tournamentData';
import { PRESET_USERS } from '@/mocks/multiSportData';
import { DEFAULT_HEADER_CONFIG, DEFAULT_CABOR_BANNERS } from '@/mocks/headerConfig';
import { TeamRegistrationModal } from '@/components/public/registration/TeamRegistrationModal';
import { PublicFooter } from '@/components/public/layout/PublicFooter';
import { Trophy, X } from 'lucide-react';
import { FEATURES } from '@/config/features';

export default function Home() {
  const [currentView, setCurrentView] = useState<'public' | 'admin' | 'referee'>('public');
  const [activeTab, setActiveTab] = useState<PublicTabKey>('info');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [banners, setBanners] = useState<PublicHeaderConfig[]>(DEFAULT_CABOR_BANNERS);
  const [activeBannerIndex, setActiveBannerIndex] = useState<number>(0);

  // Load persisted theme and banners from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('sauma_theme');
      if (savedTheme) setDarkMode(savedTheme === 'dark');
      const savedBanners = localStorage.getItem('sauma_arena_cabor_banners');
      if (savedBanners) {
        const parsed = JSON.parse(savedBanners);
        if (Array.isArray(parsed) && parsed.length > 0) setBanners(parsed);
      }
      const savedTeams = localStorage.getItem('sauma_arena_teams');
      if (savedTeams) {
        const parsed = JSON.parse(savedTeams);
        const isOutdated =
          !Array.isArray(parsed) ||
          parsed.length !== initialTeams.length ||
          parsed.some(
            (t: any, i: number) =>
              !t.players ||
              t.players.length !== 5 ||
              t.players[0]?.name !== 'Pemain 1' ||
              t.coachName !== initialTeams[i]?.coachName
          );
        if (isOutdated) {
          localStorage.setItem('sauma_arena_teams', JSON.stringify(initialTeams));
          window.dispatchEvent(new CustomEvent('sauma_state_sync', { detail: { key: 'sauma_arena_teams', value: initialTeams } }));
        }
      }
    } catch {}
  }, []);

  // Sinkronisasi Universal: Muat konfigurasi resmi dari database SQLite ke state lokal
  useEffect(() => {
    const syncDatabaseState = () => {
      fetch('/api/settings?sport=futsal')
        .then((res) => res.json())
        .then((json) => {
          if (!json.success || !json.data) return;
          const { teamCardLayout, bracketSize, hasBronzeMatch, statsConfig, supporterWeights, sportRules, protocols, banners: dbBanners, standingsSnapshot } = json.data;

          const syncItem = (key: string, val: any) => {
            if (val === undefined || val === null) return;
            try {
              localStorage.setItem(key, JSON.stringify(val));
              window.dispatchEvent(new CustomEvent('sauma_state_sync', { detail: { key, value: val } }));
            } catch {}
          };

          if (teamCardLayout) syncItem('sauma_arena_team_card_layout', teamCardLayout);
          if (bracketSize !== undefined) syncItem('sauma_arena_bracket_size', bracketSize);
          if (hasBronzeMatch !== undefined) syncItem('sauma_arena_has_bronze_match', hasBronzeMatch);
          if (statsConfig) syncItem('sauma_arena_public_stats_config', statsConfig);
          if (supporterWeights) syncItem('sauma_supporter_rules_config', supporterWeights);
          if (sportRules) syncItem('sauma_arena_sport_rules', sportRules);
          if (protocols) syncItem('sauma_arena_protocols', protocols);
          if (dbBanners?.length) {
            setBanners(dbBanners);
            syncItem('sauma_arena_cabor_banners', dbBanners);
          }
          if (standingsSnapshot) {
            ['A', 'B', 'C', 'D'].forEach((g) => {
              if (standingsSnapshot[g]) syncItem(`sauma_arena_standings_${g.toLowerCase()}`, standingsSnapshot[g]);
            });
          }
          if (json.data.partners) {
            syncItem('sauma_arena_tournament_partners_v3', json.data.partners);
            window.dispatchEvent(new CustomEvent('sauma_partners_updated', { detail: json.data.partners }));
          }
        })
        .catch(() => {});
    };

    syncDatabaseState();
    window.addEventListener('focus', syncDatabaseState);
    return () => window.removeEventListener('focus', syncDatabaseState);
  }, []);

  const handleSaveBanners = (newBanners: PublicHeaderConfig[]) => {
    setBanners(newBanners);
    try {
      localStorage.setItem('sauma_arena_cabor_banners', JSON.stringify(newBanners));
    } catch {
      // ignore
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('sauma_auth_token') : null;
    if (token) {
      fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ banners: newBanners }),
      }).catch(() => {});
    }
  };

  const activeSportCode = banners[activeBannerIndex]?.sportCode || 'FUTSAL';

  // Sync dark mode class with root html element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      try { localStorage.setItem('sauma_theme', next ? 'dark' : 'light'); } catch {}
      return next;
    });
  };

  const handleViewChange = (view: 'public' | 'admin' | 'referee') => {
    setCurrentView(view);
    try { localStorage.setItem('sauma_current_view', view); } catch {}
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (view === 'public') url.searchParams.delete('view');
      else url.searchParams.set('view', view);
      window.history.pushState({}, '', url.toString());
    }
  };

  const handleLoginSuccess = (user: AppUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    let nextView: 'public' | 'admin' | 'referee' = user.role === 'REFEREE' ? 'referee' : 'admin';
    try {
      const savedView = localStorage.getItem('sauma_current_view');
      if (user.role === 'ADMIN' && savedView === 'referee') {
        nextView = 'referee';
      }
    } catch {
      // ignore
    }
    handleViewChange(nextView);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      localStorage.removeItem('sauma_auth_token');
      localStorage.removeItem('sauma_auth_user');
      localStorage.removeItem('sauma_current_view');
    } catch {
      // ignore
    }
    handleViewChange('public');
  };

  // Restore authenticated session and view on mount / refresh
  useEffect(() => {
    let savedView: 'public' | 'admin' | 'referee' | null = null;
    let savedUser: AppUser | null = null;
    let savedToken: string | null = null;

    try {
      savedView = (localStorage.getItem('sauma_current_view') as any) || null;
      savedToken = localStorage.getItem('sauma_auth_token');
      const savedUserStr = localStorage.getItem('sauma_auth_user');
      if (savedUserStr) {
        savedUser = JSON.parse(savedUserStr);
      }
    } catch {
      // ignore storage error
    }

    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view') as 'public' | 'admin' | 'referee' | null;

    const initialTargetView =
      viewParam === 'admin' || viewParam === 'referee' || viewParam === 'public'
        ? viewParam
        : savedView || 'public';

    if (savedUser && savedToken) {
      setCurrentUser(savedUser);
      setIsAuthenticated(true);
      setCurrentView(initialTargetView);

      // Verify token with backend
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setCurrentUser(data.user);
            setIsAuthenticated(true);
            try {
              localStorage.setItem('sauma_auth_user', JSON.stringify(data.user));
            } catch {}
          } else {
            // Token is invalid/expired
            setIsAuthenticated(false);
            setCurrentUser(null);
            try {
              localStorage.removeItem('sauma_auth_token');
              localStorage.removeItem('sauma_auth_user');
              localStorage.removeItem('sauma_current_view');
            } catch {}
            setCurrentView('public');
            if (typeof window !== 'undefined') {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }
        })
        .catch(() => {
          // If offline, keep local session
        });
    } else {
      if (initialTargetView !== 'public') {
        setCurrentView(initialTargetView);
      }
    }
  }, []);

  // Admin View: Back-office and full control
  if (currentView === 'admin') {
    if (!isAuthenticated || currentUser?.role !== 'ADMIN') {
      return (
        <AdminLogin
          initialRole="ADMIN"
          onLoginSuccess={handleLoginSuccess}
          onBackToPublic={() => handleViewChange('public')}
        />
      );
    }

    return (
      <AdminDashboard
        user={currentUser}
        onLogout={handleLogout}
        onBackToPublic={() => handleViewChange('public')}
        onGoToReferee={() => handleViewChange('referee')}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        banners={banners}
        onSaveBanners={handleSaveBanners}
        headerConfig={banners[activeBannerIndex] || DEFAULT_HEADER_CONFIG}
        onSaveHeaderConfig={(updated) => {
          const next = [...banners];
          next[activeBannerIndex] = updated;
          handleSaveBanners(next);
        }}
      />
    );
  }

  // Referee View: Field match execution on tablet/smartphone
  if (currentView === 'referee') {
    // Both REFEREE and ADMIN users are authorized to use the referee console
    if (!isAuthenticated || (currentUser?.role !== 'REFEREE' && currentUser?.role !== 'ADMIN')) {
      return (
        <AdminLogin
          initialRole="REFEREE"
          onLoginSuccess={handleLoginSuccess}
          onBackToPublic={() => handleViewChange('public')}
        />
      );
    }

    return (
      <RefereeDashboard
        user={currentUser}
        onLogout={handleLogout}
        onBackToPublic={() => handleViewChange('public')}
        onGoToAdmin={() => handleViewChange('admin')}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  // Public View: Spectator portal
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-150">
      {/* Top Universal Navigation with Login & Pendaftaran Buttons */}
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenRegModal={() => setIsRegModalOpen(true)}
      />

      <main className="flex-1 pb-24 md:pb-16">
        {/* Banner Turnamen: Pada mode mobile hanya ditampilkan saat berada di tab informasi */}
        <div className={activeTab === 'info' ? 'block' : 'hidden md:block'}>
          <PublicTournamentHeader
            banners={banners}
            activeIndex={activeBannerIndex}
            onSelectBanner={(idx) => setActiveBannerIndex(idx)}
            onOpenTicketModal={() => setIsTicketModalOpen(true)}
            onOpenRegModal={() => setIsRegModalOpen(true)}
          />
        </div>

        {/* Desktop Centered Tab Bar */}
        <PublicTabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenTicketModal={() => setIsTicketModalOpen(true)}
          onOpenRegModal={() => setIsRegModalOpen(true)}
        />

        {/* Mobile Navigation Bar */}
        <MobilePublicNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenTicketModal={() => setIsTicketModalOpen(true)}
          onOpenRegModal={() => setIsRegModalOpen(true)}
          sportCode={activeSportCode}
        />

        <section
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 transition-all ${
            activeTab === 'info' ? 'pt-8 sm:pt-10' : 'pt-3 sm:pt-10'
          }`}
        >
          {activeTab === 'info' && <InfoTab sportCode={activeSportCode} />}
          {activeTab === 'live' && <LiveMatchTab sportCode={activeSportCode} onTabChange={(tab) => setActiveTab(tab as PublicTabKey)} />}
          {activeTab === 'schedule' && <ScheduleTab sportCode={activeSportCode} />}
          {activeTab === 'standings' && <StandingsTab sportCode={activeSportCode} />}
          {activeTab === 'bracket' && <BracketTab sportCode={activeSportCode} />}
          {activeTab === 'teams' && <TeamsTab sportCode={activeSportCode} />}
          {activeTab === 'stats' && <StatsTab sportCode={activeSportCode} />}
          {activeTab === 'supporter' && <SupporterTab />}
        </section>
      </main>

      <TicketModal
        isOpen={FEATURES.ticketing && isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onTicketGenerated={(c, s) => console.log(`Tiket: ${c} - ${s}`)}
      />
      <TeamRegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        onSuccess={(d) => console.log('Pendaftaran:', d)}
      />

      <PublicFooter
        onOpenTicketModal={() => setIsTicketModalOpen(true)}
        onOpenRegModal={() => setIsRegModalOpen(true)}
        onTabChange={(tab) => setActiveTab(tab as PublicTabKey)}
        sportCode={activeSportCode}
      />
    </div>
  );
}
