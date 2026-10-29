'use client';

import React from 'react';
import {
  Calendar,
  MapPin,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PublicHeaderConfig } from '@/types';
import { DEFAULT_CABOR_BANNERS, DEFAULT_HEADER_CONFIG } from '@/mocks/headerConfig';

interface PublicTournamentHeaderProps {
  banners?: PublicHeaderConfig[];
  activeIndex?: number;
  onSelectBanner?: (index: number) => void;
  onOpenTicketModal: () => void;
  onOpenRegModal: () => void;
  config?: PublicHeaderConfig; // Fallback backward compatibility
}

export const PublicTournamentHeader: React.FC<PublicTournamentHeaderProps> = ({
  banners = DEFAULT_CABOR_BANNERS,
  activeIndex = 0,
  onSelectBanner,
  onOpenTicketModal,
  onOpenRegModal,
  config,
}) => {
  const currentList = banners && banners.length > 0 ? banners : [config || DEFAULT_HEADER_CONFIG];
  const safeIndex = Math.min(Math.max(0, activeIndex), currentList.length - 1);
  const activeBanner = currentList[safeIndex] || DEFAULT_HEADER_CONFIG;
  const bannerLogo = activeBanner.logoUrl || '/brand/matsanega-futsal-logo.png';

  const handlePrev = () => {
    if (!onSelectBanner) return;
    const nextIdx = (safeIndex - 1 + currentList.length) % currentList.length;
    onSelectBanner(nextIdx);
  };

  const handleNext = () => {
    if (!onSelectBanner) return;
    const nextIdx = (safeIndex + 1) % currentList.length;
    onSelectBanner(nextIdx);
  };

  const [selectedCompBySport, setSelectedCompBySport] = React.useState<Record<string, string>>({});

  const sportKey = (activeBanner.sportLabel || activeBanner.categoryBadge || 'FUTSAL').toUpperCase();
  const SPORT_COMPETITIONS: Record<string, string[]> = {
    FUTSAL: ['Milad Matsanega Futsal Competition I (MMFC I)'],
  };

  const matchedCompetitions = 
    Object.entries(SPORT_COMPETITIONS).find(([key]) => sportKey.includes(key))?.[1] || [];

  const currentComp = selectedCompBySport[sportKey] || matchedCompetitions[0] || activeBanner.title;

  return (
    <section className="relative overflow-hidden border-b border-[var(--border-subtle)] pt-6 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-8 text-white transition-colors">
      {/* Background Banner Image with smooth cross-fade */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-500 transform scale-100 ease-out"
        style={{
          backgroundImage: `url('${activeBanner.bannerImageUrl}')`,
        }}
        aria-hidden="true"
      />

      {/* Dark Tactical Sport Gradient Overlay (Guarantees WCAG AA Contrast) */}
      <div
        className="absolute inset-0 z-0 bg-gradient-to-r from-[#0b1a28] via-[#0b1a28]/95 to-[#0b1a28]/80 transition-opacity duration-500"
        style={{
          opacity: activeBanner.bannerOverlayOpacity,
        }}
        aria-hidden="true"
      />

      {/* Subtle Gold / Royal Blue Stadium Glow Accent */}
      <div
        className="absolute inset-0 z-0 bg-radial-[at_top_right] from-[var(--color-arena-accent)]/25 via-[var(--color-arena-primary)]/15 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Slider Left Arrow Navigation */}
      {currentList.length > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Cabang Olahraga Sebelumnya"
          className="btn-tactile absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 border border-white/20 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-transform hover:scale-105"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      )}

      {/* Slider Right Arrow Navigation */}
      {currentList.length > 1 && (
        <button
          type="button"
          onClick={handleNext}
          aria-label="Cabang Olahraga Berikutnya"
          className="btn-tactile absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 border border-white/20 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-transform hover:scale-105"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      )}

      {/* Main Header Content */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-5 px-6 sm:px-10">
        {/* Multi-Cabor Quick Selector Pills */}
        {currentList.length > 1 && (() => {
          const enableScroll = currentList.length > 5;
          return (
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/10">
              <div
                className={`flex items-center gap-2 max-w-full ${
                  enableScroll
                    ? 'overflow-x-auto pb-1.5'
                    : 'flex-wrap overflow-visible'
                }`}
              >
                {currentList.map((cabor, idx) => {
                  const isActive = idx === safeIndex;
                  return (
                    <button
                      key={cabor.id || idx}
                      type="button"
                      onClick={() => onSelectBanner && onSelectBanner(idx)}
                      className={`btn-tactile px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center ${
                        isActive
                          ? 'bg-[var(--color-arena-accent)] text-slate-950 shadow-md ring-2 ring-[var(--color-arena-accent)]/50 scale-105'
                          : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10'
                      }`}
                    >
                      <span>{cabor.sportLabel || cabor.categoryBadge}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action bar: Ganti Kompetisi dropdown & Cabang Olahraga counter */}
              <div className="flex items-center gap-2 ml-auto shrink-0 flex-wrap">
                {matchedCompetitions.length > 1 && (
                  <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/15 text-xs text-slate-200">
                    <span className="text-[11px] text-slate-400">Ganti Kompetisi:</span>
                    <select
                      value={currentComp}
                      onChange={(e) =>
                        setSelectedCompBySport((prev) => ({
                          ...prev,
                          [sportKey]: e.target.value,
                        }))
                      }
                      aria-label="Pilih Kompetisi"
                      className="bg-transparent text-white font-semibold text-xs outline-none cursor-pointer border-none py-0.5"
                    >
                      {matchedCompetitions.map((comp) => (
                        <option key={comp} value={comp} className="bg-slate-900 text-white">
                          {comp}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Counter: {jumlah} Cabang Olahraga */}
                <div className="text-[11px] font-mono text-slate-300 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10 shrink-0">
                  <strong className="text-white">{currentList.length}</strong> Cabang Olahraga
                </div>
              </div>
            </div>
          );
        })()}

        {/* Eyebrow & Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-barlow font-bold uppercase tracking-wider bg-[var(--color-arena-accent)]/20 text-[var(--color-arena-accent)] border border-[var(--color-arena-accent)]/35 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>{activeBanner.statusBadge}</span>
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-barlow font-bold uppercase tracking-wider bg-white/10 text-slate-200 border border-white/15 backdrop-blur-xs">
              {activeBanner.categoryBadge}
            </span>
          </div>
        </div>

        {/* Tournament Hero Title & Right Logo */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 lg:gap-10 pt-1">
          {/* Left Column: Hero Title, Line & Description */}
          <div className="flex-1 space-y-3 min-w-0">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold uppercase text-white tracking-wide font-teko leading-tight sm:leading-snug max-w-3xl drop-shadow-sm">
              {activeBanner.title}
            </h1>

            {/* Midfield Double Line */}
            <div className="midfield-line pt-1 pb-1 opacity-70" aria-hidden="true" />

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed font-normal">
              {activeBanner.description}
            </p>
          </div>

          {/* Right Column: Logo Tanpa Background */}
          {bannerLogo && activeBanner.logoVisible !== false && (() => {
            const size = activeBanner.logoSize || 260;
            const offsetX = activeBanner.logoOffsetX !== undefined ? activeBanner.logoOffsetX : -40;

            return (
              <div
                className="shrink-0 flex items-center justify-center self-center md:self-start pt-1 md:pt-0 transition-transform duration-300"
                style={
                  {
                    '--logo-offset-x': `${offsetX}px`,
                  } as React.CSSProperties
                }
              >
                <div className="relative group md:[transform:translateX(var(--logo-offset-x))] transition-transform duration-300">
                  <div
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/25 to-[var(--color-arena-accent)]/25 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none"
                    aria-hidden="true"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bannerLogo}
                    alt={activeBanner.title}
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      maxWidth: '85vw',
                      maxHeight: '85vw',
                    }}
                    className="relative z-10 object-contain aspect-square drop-shadow-[0_16px_36px_rgba(0,0,0,0.7)] transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
            );
          })()}
        </div>

        {/* Tournament Facts */}
        <div className="pt-4 border-t border-white/15">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-barlow text-slate-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--color-arena-accent)] shrink-0" />
              <span className="font-bold text-white tracking-wide">{activeBanner.dates}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--color-arena-accent)] shrink-0" />
              <span className="font-bold text-white tracking-wide">{activeBanner.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[var(--color-arena-accent)] shrink-0" />
              <span className="font-bold text-white tracking-wide">{activeBanner.contingentInfo}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
