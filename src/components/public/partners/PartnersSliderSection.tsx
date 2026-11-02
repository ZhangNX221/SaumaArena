'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TournamentPartner } from '@/types';
import { PartnerCard } from '@/components/public/PartnerCard';

interface PartnersSliderSectionProps {
  partners: TournamentPartner[];
}

export const PartnersSliderSection: React.FC<PartnersSliderSectionProps> = ({ partners }) => {
  const activePartners = partners.filter((p) => p.isActive);
  const totalItems = activePartners.length;

  const [visibleCount, setVisibleCount] = useState<number>(5);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive visible count: 2 on mobile, 3 on tablet, 5 on desktop
  useEffect(() => {
    if (totalItems === 0) return;
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(3);
      } else {
        setVisibleCount(5);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shouldSlide = totalItems > 5;

  // Next slide function
  const handleNext = useCallback(() => {
    if (!shouldSlide) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [shouldSlide]);

  // Prev slide function
  const handlePrev = useCallback(() => {
    if (!shouldSlide) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
  }, [shouldSlide, totalItems]);

  // Reset index to start after slide animation ends
  const handleTransitionEnd = () => {
    if (currentIndex >= totalItems) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (!shouldSlide || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [shouldSlide, isPaused, handleNext]);

  if (totalItems === 0) return null;

  // Clone array for smooth infinite sliding
  const displayPartners = shouldSlide
    ? [...activePartners, ...activePartners]
    : activePartners;

  // Compute item width percentage
  const itemWidthPercent = 100 / visibleCount;

  return (
    <div className="space-y-4 pb-6 border-b border-[var(--border-subtle)]">
      {/* Centered Section Header with Navigation Controls */}
      <div className="flex flex-col items-center justify-center text-center relative w-full">
        <span className="text-xs font-barlow uppercase font-bold tracking-wider text-[var(--text-faint)]">
          PENYELENGGARA &amp; MITRA RESMI TURNAMEN
        </span>

        {shouldSlide && (
          <div className="flex items-center gap-1.5 absolute right-0 top-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Logo sebelumnya"
              className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Logo berikutnya"
              className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors shadow-2xs"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Slider Track */}
      {shouldSlide ? (
        <div
          className="relative overflow-hidden w-full select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div
            onTransitionEnd={handleTransitionEnd}
            className="flex justify-center"
            style={{
              transform: `translateX(-${currentIndex * itemWidthPercent}%)`,
              transition: isTransitioning ? 'transform 500ms ease-in-out' : 'none',
            }}
          >
            {displayPartners.map((partner, idx) => (
              <div
                key={`${partner.id}-${idx}`}
                className="shrink-0 px-1.5"
                style={{ width: `${itemWidthPercent}%` }}
              >
                <PartnerCard partner={partner} variant="showcase" isInteractive={true} />
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-3">
            {activePartners.map((p, idx) => {
              const isActive = (currentIndex % totalItems) === idx;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setIsTransitioning(true);
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Slide ${idx + 1}: ${p.name}`}
                  className={`h-1.5 rounded-full transition-all ${
                    isActive
                      ? 'w-6 bg-[var(--color-arena-primary)]'
                      : 'w-1.5 bg-[var(--border-subtle)] hover:bg-[var(--text-muted)]/40'
                  }`}
                />
              );
            })}
          </div>
        </div>
      ) : (
        /* Perfectly Centered Cards if total items <= 5 */
        <div className="flex flex-wrap items-stretch justify-center gap-3 sm:gap-4 max-w-4xl mx-auto w-full">
          {activePartners.map((partner) => (
            <div key={partner.id} className="w-full sm:w-60 md:w-64 max-w-xs flex">
              <PartnerCard partner={partner} variant="showcase" isInteractive={true} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
