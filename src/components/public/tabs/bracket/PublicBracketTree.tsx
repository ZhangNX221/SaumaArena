'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import { BracketMatch, BracketSize } from '@/mocks/bracketData';
import { PublicBracketMatchCard } from './PublicBracketMatchCard';
import { PublicGrandFinalCard } from './PublicGrandFinalCard';

interface PublicBracketTreeProps {
  bracketSize: BracketSize;
  qf: BracketMatch[];
  sf: BracketMatch[];
  gf: BracketMatch;
  championTeamName: string;
  bronzeMatch: BracketMatch;
  hasBronzeMatch?: boolean;
}

export const PublicBracketTree: React.FC<PublicBracketTreeProps> = ({
  bracketSize,
  qf,
  sf,
  gf,
  championTeamName,
  bronzeMatch,
  hasBronzeMatch = true,
}) => {
  const canvasWidth = bracketSize >= 8 ? 972 : 676;
  const canvasHeight = 600;

  // Nilai awal zoom: 70% di layar mobile agar seluruh bagan terlihat rapi, 100% di desktop
  const [zoom, setZoom] = useState<number>(1);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (mobile) {
        setZoom(0.68);
      }
    }
  }, []);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(1.4, Number((prev + 0.1).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.45, Number((prev - 0.1).toFixed(2))));
  };

  const handleReset = () => {
    setZoom(1);
  };

  const handleFitScreen = () => {
    if (typeof window !== 'undefined') {
      const containerWidth = Math.min(window.innerWidth - 32, 972);
      const calculated = Number((containerWidth / canvasWidth).toFixed(2));
      setZoom(Math.max(0.45, Math.min(1, calculated)));
    }
  };

  return (
    <div className="space-y-3">
      {/* Zoom & Fit Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-barlow font-bold text-xs uppercase tracking-wide text-[var(--text-main)] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span>Mode Bagan Interaktif</span>
          </span>
          {isMobile && (
            <span className="text-[10px] text-[var(--text-muted)] hidden xs:inline">
              (Bisa Digeser &amp; Dizoom)
            </span>
          )}
        </div>

        {/* Kontrol Zoom In - Zoom Out */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= 0.45}
            title="Perkecil Bagan (Zoom Out)"
            className="p-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--text-main)] border border-[var(--border-subtle)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4 text-sky-500" />
          </button>

          <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-[var(--bg-muted)] text-sky-600 dark:text-sky-400 border border-[var(--border-subtle)] min-w-[50px] text-center">
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= 1.4}
            title="Perbesar Bagan (Zoom In)"
            className="p-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--text-main)] border border-[var(--border-subtle)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4 text-sky-500" />
          </button>

          <button
            type="button"
            onClick={handleFitScreen}
            title="Sesuaikan dengan Lebar Layar"
            className="btn-tactile px-2.5 py-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--text-main)] border border-[var(--border-subtle)] text-[11px] font-barlow font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-sky-500" />
            <span className="hidden sm:inline">Fit Layar</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="Kembalikan ke Ukuran Penuh (100%)"
            className="btn-tactile px-2.5 py-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--text-main)] border border-[var(--border-subtle)] text-[11px] font-barlow font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">100%</span>
          </button>
        </div>
      </div>

      {/* Touch Pan / Scroll Viewport Container */}
      <div className="overflow-x-auto overflow-y-hidden touch-pan-x overscroll-x-contain rounded-2xl sm:rounded-3xl border border-sky-950/80 bg-[#060c18] p-3.5 sm:p-6 lg:p-8 shadow-2xl scrollbar-thin">
        {/* Dynamic Wrapper preserving layout bounding box at scale */}
        <div
          className="transition-all duration-150 origin-top-left mx-auto"
          style={{
            width: `${Math.round(canvasWidth * zoom)}px`,
            height: `${Math.round(canvasHeight * zoom)}px`,
          }}
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
            }}
            className="space-y-6"
          >
            {/* Header Kolom Bagan */}
            <div className="flex items-center gap-0">
              {bracketSize >= 8 && (
                <>
                  <div className="w-[260px] shrink-0 flex items-center gap-2">
                    <span className="font-barlow font-black text-sm uppercase tracking-wide text-white">
                      8 Besar (Perempat Final)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-700 bg-slate-900 text-slate-300 font-bold">
                      {qf.length} Laga
                    </span>
                  </div>
                  <div className="w-[36px] shrink-0" />
                </>
              )}

              {bracketSize >= 4 && (
                <>
                  <div className="w-[260px] shrink-0 flex items-center gap-2">
                    <span className="font-barlow font-black text-sm uppercase tracking-wide text-sky-400">
                      {bracketSize === 4 ? 'Semifinal (4 Besar)' : 'Babak Semifinal'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-sky-800 bg-sky-950/80 text-sky-300 font-bold">
                      {sf.length} Laga
                    </span>
                  </div>
                  <div className="w-[36px] shrink-0" />
                </>
              )}

              <div className="w-[380px] shrink-0 flex items-center justify-between">
                <span className="font-barlow font-black text-sm uppercase tracking-wide text-sky-400 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" />
                  <span>Grand Final</span>
                </span>
                <span className="text-[11px] font-barlow font-bold uppercase tracking-wider text-sky-400/80">
                  Perebutan Juara 1
                </span>
              </div>
            </div>

            {/* Kolom Pohon Bagan dengan Garis Konektor SVG */}
            <div className="flex items-start gap-0">
              {/* KOLOM 1: 8 BESAR (QF) */}
              {bracketSize >= 8 && (
                <>
                  <div className="w-[260px] shrink-0 space-y-0">
                    <div className="space-y-6">
                      {/* Pasangan Atas: QF 0 (Grup A) & QF 1 (Grup C) */}
                      <div className="space-y-6">
                        <PublicBracketMatchCard match={qf[0]} />
                        <PublicBracketMatchCard match={qf[1]} />
                      </div>

                      {/* Jeda antar pasangan */}
                      <div className="h-2" />

                      {/* Pasangan Bawah: QF 2 (Grup B) & QF 3 (Grup D) */}
                      <div className="space-y-6">
                        <PublicBracketMatchCard match={qf[2]} />
                        <PublicBracketMatchCard match={qf[3]} />
                      </div>
                    </div>
                  </div>

                  {/* KONEKTOR 1: QF -> SF */}
                  <div className="w-[36px] shrink-0 h-[528px] relative pointer-events-none">
                    <svg
                      className="w-full h-full text-sky-500"
                      viewBox="0 0 36 528"
                      preserveAspectRatio="none"
                    >
                      {/* Top pair connector -> SF 1 */}
                      <path
                        d="M 0,55 H 18 V 189 H 0 M 18,122 H 36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="36" cy="122" r="3" fill="currentColor" />

                      {/* Bottom pair connector -> SF 2 */}
                      <path
                        d="M 0,339 H 18 V 473 H 0 M 18,406 H 36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="36" cy="406" r="3" fill="currentColor" />
                    </svg>
                  </div>
                </>
              )}

              {/* KOLOM 2: SEMIFINAL (4 BESAR) */}
              {bracketSize >= 4 && (
                <>
                  <div className="w-[260px] shrink-0 h-[528px] relative">
                    {/* SF 1: Centered with Top Pair */}
                    <div className="absolute top-[67px] w-full">
                      <PublicBracketMatchCard match={sf[0]} isHighlighted={true} />
                    </div>

                    {/* SF 2: Centered with Bottom Pair */}
                    <div className="absolute top-[351px] w-full">
                      <PublicBracketMatchCard match={sf[1]} isHighlighted={true} />
                    </div>
                  </div>

                  {/* KONEKTOR 2: SF -> GRAND FINAL */}
                  <div className="w-[36px] shrink-0 h-[528px] relative pointer-events-none">
                    <svg
                      className="w-full h-full text-sky-400"
                      viewBox="0 0 36 528"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M 0,122 H 18 V 406 H 0 M 18,264 H 36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="36" cy="264" r="3.5" fill="currentColor" />
                    </svg>
                  </div>
                </>
              )}

              {/* KOLOM 3: GRAND FINAL & PEREBUTAN JUARA 3 */}
              <div className="w-[380px] shrink-0 h-[528px] flex flex-col justify-center space-y-6">
                <PublicGrandFinalCard gf={gf} championTeamName={championTeamName} />

                {/* Perebutan Juara 3 */}
                {hasBronzeMatch && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-barlow font-bold uppercase tracking-wider text-amber-400">
                      <Medal className="w-4 h-4" />
                      <span>Perebutan Juara 3</span>
                    </div>
                    <PublicBracketMatchCard match={bronzeMatch} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

