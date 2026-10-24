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

  // Admin View: Back-office and full control
  if (currentView === 'admin') {
    if (!isAuthenticated || currentUser?.role !== 'ADMIN') {
      return (
        <AdminLogin
          initialRole="ADMIN"
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsAuthenticated(true);
            setCurrentView(user.role === 'REFEREE' ? 'referee' : 'admin');
          }}
          onBackToPublic={() => setCurrentView('public')}
        />
      );
    }

    return (
      <AdminDashboard
        user={currentUser}
        onLogout={() => {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }}
        onBackToPublic={() => setCurrentView('public')}
        onGoToReferee={() => setCurrentView('referee')}
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
    if (!isAuthenticated || currentUser?.role !== 'REFEREE') {
      return (
        <AdminLogin
          initialRole="REFEREE"
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsAuthenticated(true);
            setCurrentView(user.role === 'ADMIN' ? 'admin' : 'referee');
          }}
          onBackToPublic={() => setCurrentView('public')}
        />
      );
    }

    return (
      <RefereeDashboard
        user={currentUser}
        onLogout={() => {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }}
        onBackToPublic={() => setCurrentView('public')}
        onGoToAdmin={() => setCurrentView('admin')}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  // Public View: Spectator portal
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-150">
      {/* Top Universal Navigation with 3-Way Switcher */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <main className="flex-1 pb-24 md:pb-16">
        <PublicTournamentHeader
          banners={banners}
          activeIndex={activeBannerIndex}
          onSelectBanner={(idx) => setActiveBannerIndex(idx)}
          onOpenTicketModal={() => setIsTicketModalOpen(true)}
          onOpenRegModal={() => setIsRegModalOpen(true)}
        />

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

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-20">
          {activeTab === 'info' && <InfoTab sportCode={activeSportCode} />}
          {activeTab === 'teams' && <TeamsTab sportCode={activeSportCode} />}
          {activeTab === 'schedule' && <ScheduleTab sportCode={activeSportCode} />}
          {activeTab === 'standings' && <StandingsTab sportCode={activeSportCode} />}
          {activeTab === 'bracket' && <BracketTab sportCode={activeSportCode} />}
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
