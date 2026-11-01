'use client';

import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Trophy,
  Medal,
  CheckCircle2,
  RotateCcw,
  Save,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import {
  BracketSize,
  BRACKET_SIZE_OPTIONS,
  STORAGE_KEY_BRACKET_SIZE,
  STORAGE_KEY_HAS_BRONZE_MATCH,
  getStoredBracketSize,
  saveStoredBracketSize,
  getStoredHasBronzeMatch,
  saveStoredHasBronzeMatch,
} from '@/mocks/bracketData';

interface BracketSettingsTabProps {
  onSaved?: (size: BracketSize) => void;
}

export const BracketSettingsTab: React.FC<BracketSettingsTabProps> = ({ onSaved }) => {
  const [selectedSize, setSelectedSize] = useState<BracketSize>(8);
  const [activeSize, setActiveSize] = useState<BracketSize>(8);
  const [hasBronzeMatch, setHasBronzeMatch] = useState<boolean>(true);
  const [activeHasBronzeMatch, setActiveHasBronzeMatch] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const currentSize = getStoredBracketSize();
    const currentBronze = getStoredHasBronzeMatch();
    setSelectedSize(currentSize);
    setActiveSize(currentSize);
    setHasBronzeMatch(currentBronze);
    setActiveHasBronzeMatch(currentBronze);

    // Ambil dari database jika ada
    fetch('/api/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && isMounted) {
          if (json.data?.bracketSize !== undefined) {
            setSelectedSize(json.data.bracketSize);
            setActiveSize(json.data.bracketSize);
            saveStoredBracketSize(json.data.bracketSize);
          }
          if (json.data?.hasBronzeMatch !== undefined) {
            const bronzeVal = Boolean(json.data.hasBronzeMatch);
            setHasBronzeMatch(bronzeVal);
            setActiveHasBronzeMatch(bronzeVal);
            saveStoredHasBronzeMatch(bronzeVal);
          }
        }
      })
      .catch((e) => console.warn('Gagal memuat pengaturan bagan:', e));
    return () => { isMounted = false; };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      let token: string | null = null;
      try { token = localStorage.getItem('sauma_auth_token'); } catch {}
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          bracketSize: selectedSize,
          hasBronzeMatch,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyimpan pengaturan bagan ke database.');
      }
      saveStoredBracketSize(selectedSize);
      saveStoredHasBronzeMatch(hasBronzeMatch);
      setActiveSize(selectedSize);
      setActiveHasBronzeMatch(hasBronzeMatch);
      setSavedSuccess(true);
      onSaved?.(selectedSize);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      console.error('Gagal sinkron pengaturan bagan ke database:', err);
      setErrorMessage(err.message || 'Gagal menyimpan ke database.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    saveStoredBracketSize(8);
    saveStoredHasBronzeMatch(true);
    setSelectedSize(8);
    setActiveSize(8);
    setHasBronzeMatch(true);
    setActiveHasBronzeMatch(true);
    setSavedSuccess(true);
    onSaved?.(8);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const selectedConfig =
    BRACKET_SIZE_OPTIONS.find((opt) => opt.value === selectedSize) ||
    BRACKET_SIZE_OPTIONS[2];

  return (
    <div className="space-y-6">
      {/* Save Success Alert */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-xs sm:text-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">
              Format bagan ({selectedConfig.title}) &amp; Laga Juara 3 ({hasBronzeMatch ? 'Diadakan' : 'Ditiadakan'}) berhasil diperbarui!
            </span>
          </div>
          <span className="text-[11px] font-mono opacity-80">Tersinkron Otomatis</span>
        </div>
      )}

      {/* Main Setting Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] flex items-center justify-center shrink-0 mt-0.5">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-barlow font-bold uppercase tracking-wider text-base text-[var(--text-main)]">
                Format &amp; Jumlah Slot Bagan Eliminasi
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Tentukan format jumlah babak sistem gugur yang aktif di halaman publik dan meja juri (24, 16, 8, 4, atau 2 besar).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            <span className="text-[11px] text-[var(--text-muted)]">Status Aktif:</span>
            <span className="px-2.5 py-1 rounded-lg bg-[var(--color-arena-primary)]/15 border border-[var(--color-arena-primary)]/30 text-[var(--color-arena-primary)] font-barlow font-black text-xs uppercase tracking-wider">
              {activeSize} Besar
            </span>
            <span className={`px-2.5 py-1 rounded-lg border font-barlow font-black text-xs uppercase tracking-wider ${
              activeHasBronzeMatch
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                : 'bg-slate-500/15 border-slate-500/30 text-slate-500 dark:text-slate-400'
            }`}>
              {activeHasBronzeMatch ? 'Juara 3: Ada' : 'Juara 3: Nonaktif'}
            </span>
          </div>
        </div>

        {/* Toggle Opsi Perebutan Juara 3 */}
        <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                <Medal className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-barlow font-bold uppercase tracking-wider text-sm text-[var(--text-main)]">
                    Laga Perebutan Juara Ke-3 (Bronze Match)
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-barlow font-bold uppercase tracking-wider border ${
                      hasBronzeMatch
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                        : 'bg-slate-500/15 border-slate-500/30 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {hasBronzeMatch ? 'Diadakan (Aktif)' : 'Ditiadakan (Nonaktif)'}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-2xl">
                  {hasBronzeMatch
                    ? 'Laga perebutan juara 3 diadakan antara 2 tim yang kalah di semifinal. Card pertandingan akan ditampilkan di bagan eliminasi publik & meja juri.'
                    : 'Laga perebutan juara 3 ditiadakan. Card pertandingan perebutan juara 3 dihilangkan dari bagan eliminasi publik & meja juri.'}
                </p>
              </div>
            </div>

            {/* Switch Toggle */}
            <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
              <span className="text-xs font-semibold text-[var(--text-muted)] hidden sm:inline">
                {hasBronzeMatch ? 'Aktif' : 'Nonaktif'}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={hasBronzeMatch}
                onClick={() => setHasBronzeMatch((prev) => !prev)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  hasBronzeMatch ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    hasBronzeMatch ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 5 Bracket Size Choice Cards */}
        <div className="space-y-3">
          <label className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-main)] block">
            Pilih Skema Jumlah Bagan:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {BRACKET_SIZE_OPTIONS.map((opt) => {
              const isSelected = selectedSize === opt.value;
              const isCurrentlyActive = activeSize === opt.value;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedSize(opt.value)}
                  className={`text-left p-4 rounded-xl border-2 transition-all flex flex-col justify-between relative cursor-pointer ${
                    isSelected
                      ? 'border-[var(--color-arena-primary)] bg-[var(--color-arena-primary)]/5 shadow-sm ring-1 ring-[var(--color-arena-primary)]/30'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-[var(--bg-muted)]'
                  }`}
                >
                  {isCurrentlyActive && (
                    <span className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-barlow font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Aktif
                    </span>
                  )}

                  <div className="space-y-1.5">
                    <div className="font-bebas text-2xl text-[var(--text-main)] tracking-wide">
                      {opt.value} BESAR
                    </div>
                    <div className="text-[11px] font-barlow font-bold uppercase text-[var(--color-arena-primary)]">
                      {opt.badge}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-3 leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                    <span className="font-mono">{opt.stages.length} Babak</span>
                    <span className="font-bold text-[var(--text-main)]">{opt.value === 2 ? '1 Laga' : `${opt.value - 1} Laga`}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Format Detail Breakdown */}
        <div className="p-4 sm:p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--color-arena-primary)]" />
              <span className="font-barlow font-bold uppercase text-xs tracking-wider text-[var(--text-main)]">
                Alur Tahapan Bagan: {selectedConfig.title}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              Total Kuota: <strong>{selectedConfig.matchCountText}</strong>
            </span>
          </div>

          {/* Visual Flow Pipeline */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {selectedConfig.stages.map((stageName, idx) => {
              const isLast = idx === selectedConfig.stages.length - 1;
              return (
                <React.Fragment key={stageName}>
                  <div
                    className={`px-3 py-1.5 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs ${
                      isLast
                        ? 'bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300'
                        : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)]'
                    }`}
                  >
                    {isLast ? (
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-[var(--color-arena-primary)]/15 text-[var(--color-arena-primary)] text-[10px] flex items-center justify-center font-mono font-bold">
                        {idx + 1}
                      </span>
                    )}
                    <span>{stageName}</span>
                  </div>
                  {!isLast && <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>

          {/* Sync Information */}
          <div className="flex items-start gap-2.5 pt-2 text-xs text-[var(--text-muted)]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Pengaturan ini akan langsung menyesuaikan visual bagan eliminasi di halaman publik (Tab Bagan)
              serta urutan pengelolaan skor di Meja Juri &amp; Admin.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={handleReset}
            className="btn-tactile px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] font-barlow font-bold text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset ke 8 Besar</span>
          </button>

          <div className="flex items-center gap-2">
            {errorMessage && (
              <span className="text-xs text-red-500 font-bold px-3 py-1.5 rounded-xl bg-red-500/10">
                {errorMessage}
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="btn-tactile px-6 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm hover:bg-[var(--color-arena-primary-hover)] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Terapkan Pengaturan Bagan'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

