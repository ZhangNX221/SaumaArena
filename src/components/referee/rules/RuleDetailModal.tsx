'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Scale, AlertTriangle, BookOpen, CheckCircle } from 'lucide-react';
import { RuleArticle } from '@/mocks/refereeRulebookData';

interface RuleDetailModalProps {
  rule: RuleArticle | null;
  sportDisplayName: string;
  onClose: () => void;
}

export const RuleDetailModal: React.FC<RuleDetailModalProps> = ({
  rule,
  sportDisplayName,
  onClose,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tutup dengan tombol ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!rule) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [rule]);

  if (!rule || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto transition-all duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rule-modal-title"
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] shadow-2xl animate-scaleUp overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/30 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] text-xs font-barlow font-bold uppercase tracking-wider border border-[var(--color-arena-primary)]/20">
                Pasal {rule.number}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-[var(--bg-muted)] text-[var(--text-muted)] text-xs font-barlow font-bold uppercase tracking-wider border border-[var(--border-subtle)]">
                {rule.category}
              </span>
            </div>
            <h2
              id="rule-modal-title"
              className="font-bebas text-2xl sm:text-3xl text-[var(--text-main)] uppercase tracking-wide leading-tight pt-1"
            >
              {rule.title}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-sans leading-relaxed">
              {rule.summary}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all duration-150 active:scale-95 shrink-0"
            aria-label="Tutup detail regulasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto font-sans flex-1">
          {/* Klausul Regulasi Resmi */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
              <Scale className="w-4 h-4 text-[var(--color-arena-primary)]" />
              <span>Klausul &amp; Ketentuan Resmi:</span>
            </div>

            <div className="space-y-2.5">
              {rule.points.map((pt, pIdx) => (
                <div
                  key={pIdx}
                  className="p-3.5 rounded-xl bg-[var(--bg-muted)]/40 border border-[var(--border-subtle)]/70 flex items-start gap-3 text-xs sm:text-sm text-[var(--text-main)] leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[var(--color-arena-primary)]/20">
                    {pIdx + 1}
                  </span>
                  <div className="flex-1">{pt}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Panduan Keputusan Wasit (Callout Highlight) */}
          <div className="p-4 sm:p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-barlow font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Panduan Wasit &amp; Catatan Meja Juri:</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed pl-6 font-medium">
              {rule.refereeTip}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[var(--border-subtle)] bg-[var(--bg-muted)]/20 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-sans">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Rujukan Resmi Laws of the Game {sportDisplayName} 2026</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-tactile w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:opacity-90 active:scale-95 text-white text-xs font-barlow font-bold uppercase tracking-wider transition-all duration-150 shadow-xs"
          >
            Tutup Regulasi
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
