'use client';

import React from 'react';
import {
  Calendar,
  MapPin,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PublicHeaderConfig } from '@/types';
import { DEFAULT_CABOR_BANNERS, DEFAULT_HEADER_CONFIG } from '@/mocks/headerConfig';

interface PublicTournamentHeaderProps {
  banners?: PublicHeaderConfig[];
  activeIndex?: number;
  onSelectBanner?: (index: number) => void;
  onOpenTicketModal: () => void;
  onOpenRegModal: () => void;
  config?: PublicHeaderConfig;
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
    <section className="relative overflow-hidden border-b border-[var(--border-subtle)] pt-6 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 text-white transition-colors bg-[#07131F]">
      {/* Background Banner Image with smooth cross-fade */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-500 transform scale-100 ease-out"
        style={{
          backgroundImage: `url('${activeBanner.bannerImageUrl}')`,
        }}
        aria-hidden="true"
      />

      {/* Dark Tactical Pitch Gradient Overlay (Guarantees WCAG AA Contrast) */}
      <div
        className="absolute inset-0 z-0 bg-gradient-to-r from-[#07131F] via-[#07131F]/95 to-[#0B1E32]/85 transition-opacity duration-500"
        style={{
          opacity: activeBanner.bannerOverlayOpacity || 0.9,
        }}
        aria-hidden="true"
      />

      {/* Stadium Spotlight & Championship Glow Accent */}
      <div
        className="absolute inset-0 z-0 bg-radial-[at_top_right] from-sky-500/20 via-[#1D63B8]/20 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Slider Left Arrow Navigation */}
      {currentList.length > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Cabang Olahraga Sebelumnya"
          className="btn-tactile absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-black/50 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-transform hover:scale-105"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Slider Right Arrow Navigation */}
      {currentList.length > 1 && (
        <button
          type="button"
          onClick={handleNext}
          aria-label="Cabang Olahraga Berikutnya"
          className="btn-tactile absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-black/50 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-transform hover:scale-105"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Main Header Content */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-4 px-4 sm:px-8">
        {/* Multi-Cabor Quick Selector */}
        {currentList.length > 1 && (() => {
          const enableScroll = currentList.length > 5;
          return (
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-white/10">
              <div
                className={`flex items-center gap-1.5 max-w-full ${
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
                      className={`btn-tactile px-3 py-1 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider transition-all shrink-0 flex items-center justify-center ${
                        isActive
                          ? 'bg-[var(--color-arena-accent)] text-slate-950 shadow-sm ring-1 ring-[var(--color-arena-accent)]/60'
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

                {/* Counter */}
                <div className="text-[11px] font-mono text-slate-300 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10 shrink-0">
                  <strong className="text-white">{currentList.length}</strong> Cabang Olahraga
                </div>
              </div>
            </div>
          );
        })()}

        {/* Eyebrow & Status Strip: Minimalist, crisp, no AI-slop stacked pills */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/15 text-xs font-barlow font-bold uppercase tracking-wider text-slate-200">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>{activeBanner.statusBadge || 'HARI-1 • SELASA, 3 NOVEMBER 2026'}</span>
            <span className="text-white/30">&bull;</span>
            <span className="text-[var(--color-arena-accent)]">{activeBanner.categoryBadge}</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-barlow font-bold uppercase tracking-wider text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Match Center MMFC I MTsN 3 Blitar</span>
          </div>
        </div>

        {/* Asymmetrical Hero Section: Dominant Title + Atmospheric Logo */}
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-6 lg:gap-10 pt-1">
          {/* Left Column: Hero Title, Line & Description */}
          <div className="flex-1 space-y-3 min-w-0">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold uppercase text-white tracking-wide font-teko leading-none drop-shadow-md">
              {activeBanner.title}
            </h1>

            {/* Midfield Double Line */}
            <div className="midfield-line pt-0.5 pb-0.5 opacity-80" aria-hidden="true" />

            {/* Description (Consolidated, no duplicate 14 Tim text) */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-normal">
              Turnamen futsal antarpelajar tingkat SD/MI se-derajat di Blitar Raya, memperebutkan Piala Bergilir MMFC I dan predikat Best Supporter Madrasah dengan live scoring terintegrasi.
            </p>
          </div>

          {/* Right Column: Prominent Logo with Stadium Spotlight illumination */}
          {bannerLogo && activeBanner.logoVisible !== false && (() => {
            const size = activeBanner.logoSize || 240;

            return (
              <div className="shrink-0 flex items-center justify-center relative">
                {/* Stadium Spotlight Glow */}
                <div
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500/30 via-[#1D63B8]/25 to-transparent blur-3xl opacity-80 pointer-events-none"
                  aria-hidden="true"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bannerLogo}
                  alt={activeBanner.title}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    maxWidth: '75vw',
                    maxHeight: '75vw',
                  }}
                  className="relative z-10 object-contain aspect-square filter drop-shadow-[0_16px_36px_rgba(0,0,0,0.8)] transition-transform duration-300 hover:scale-105"
                />
              </div>
            );
          })()}
        </div>

        {/* Consolidated Scoreboard Metadata Bar */}
        <div className="pt-4 sm:pt-6 border-t border-white/15">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-barlow text-slate-200">
            <div className="flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 hover:border-white/25 transition-all shadow-xs">
              <div className="w-9 sm:w-11 h-9 sm:h-11 rounded-lg sm:rounded-xl bg-sky-500/10 border border-sky-400/25 flex items-center justify-center shrink-0">
                <Calendar className="w-5 sm:w-5.5 h-5 sm:h-5.5 text-sky-400" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs text-slate-400 block uppercase font-bold tracking-wider leading-none mb-1">
                  Jadwal Turnamen
                </span>
                <span className="font-bold text-xs sm:text-sm lg:text-base text-white tracking-wide block truncate leading-tight">
                  {activeBanner.dates}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 hover:border-white/25 transition-all shadow-xs">
              <div className="w-9 sm:w-11 h-9 sm:h-11 rounded-lg sm:rounded-xl bg-sky-500/10 border border-sky-400/25 flex items-center justify-center shrink-0">
                <MapPin className="w-5 sm:w-5.5 h-5 sm:h-5.5 text-sky-400" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs text-slate-400 block uppercase font-bold tracking-wider leading-none mb-1">
                  Lokasi Pertandingan
                </span>
                <span className="font-bold text-xs sm:text-sm lg:text-base text-white tracking-wide block truncate leading-tight">
                  {activeBanner.venue}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 hover:border-white/25 transition-all shadow-xs">
              <div className="w-9 sm:w-11 h-9 sm:h-11 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-400/25 flex items-center justify-center shrink-0">
                <Trophy className="w-5 sm:w-5.5 h-5 sm:h-5.5 text-amber-400" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs text-slate-400 block uppercase font-bold tracking-wider leading-none mb-1">
                  Kontingen Sekolah
                </span>
                <span className="font-bold text-xs sm:text-sm lg:text-base text-white tracking-wide block truncate leading-tight">
                  {activeBanner.contingentInfo}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 hover:border-white/25 transition-all shadow-xs">
              <div className="w-9 sm:w-11 h-9 sm:h-11 rounded-lg sm:rounded-xl bg-sky-500/10 border border-sky-400/25 flex items-center justify-center shrink-0">
                <Clock className="w-5 sm:w-5.5 h-5 sm:h-5.5 text-sky-400" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs text-slate-400 block uppercase font-bold tracking-wider leading-none mb-1">
                  Format Waktu
                </span>
                <span className="font-bold text-xs sm:text-sm lg:text-base text-white tracking-wide block truncate leading-tight">
                  Durasi pertandingan 2 x 10 menit
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
