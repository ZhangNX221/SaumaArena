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
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [banners, setBanners] = useState<PublicHeaderConfig[]>(DEFAULT_CABOR_BANNERS);
  const [activeBannerIndex, setActiveBannerIndex] = useState<number>(0);

  // Load persisted banners from localStorage on mount
  useEffect(() => {
    try {
      const savedBanners = localStorage.getItem('sauma_arena_cabor_banners');
      if (savedBanners) {
        const parsed = JSON.parse(savedBanners);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBanners(parsed);
        }
      }
    } catch {
      // fallback to DEFAULT_CABOR_BANNERS
    }
  }, []);

  const handleSaveBanners = (newBanners: PublicHeaderConfig[]) => {
    setBanners(newBanners);
    try {
      localStorage.setItem('sauma_arena_cabor_banners', JSON.stringify(newBanners));
    } catch {
      // ignore
    }
  };

  const activeSportCode = banners[activeBannerIndex]?.sportCode || 'FUTSAL';

  // Sync dark mode class with root html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleViewChange = (view: 'public' | 'admin' | 'referee') => {
    setCurrentView(view);
    try {
      localStorage.setItem('sauma_current_view', view);
    } catch {
      // ignore
    }

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (view === 'public') {
        url.searchParams.delete('view');
      } else {
        url.searchParams.set('view', view);
      }
      window.history.replaceState(null, '', url.pathname + url.search);
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

        {/* Mobile Navigation Bar (Info, Jadwal, Menu Drawer, Tiket, Daftar Tim) */}
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
          {activeTab === 'live' && (
            <LiveMatchTab
              sportCode={activeSportCode}
              onTabChange={(tab) => setActiveTab(tab as PublicTabKey)}
            />
          )}
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
        onTicketGenerated={(code, school) => {
          console.log(`Tiket berhasil dibuat: ${code} untuk ${school}`);
        }}
      />

      <TeamRegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        onSuccess={(regData) => {
          console.log('Pendaftaran tim baru diterima:', regData);
        }}
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
