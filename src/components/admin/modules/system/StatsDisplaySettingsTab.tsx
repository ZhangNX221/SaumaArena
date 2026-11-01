'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Activity,
  ShieldAlert,
  Trophy,
  ShieldCheck,
  PieChart,
  CheckCircle2,
  Save,
  Sparkles,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { usePersistentState } from '@/hooks/usePersistentState';
import {
  PublicStatsDisplayConfig,
  STORAGE_KEY_STATS_CONFIG,
  DEFAULT_PUBLIC_STATS_CONFIG,
} from '@/types';

interface StatCardOption {
  key: keyof PublicStatsDisplayConfig;
  title: string;
  category: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgColor: string;
}

const STAT_OPTIONS: StatCardOption[] = [
  {
    key: 'showQuickMetrics',
    title: 'Kartu Ringkasan Metrik Laga (KPI)',
    category: 'METRIK CEPAT',
    desc: 'Menampilkan 4 kotak indikator: Total gol tercipta, laga selesai, rekapitulasi kartu kuning, dan kartu merah.',
    icon: Activity,
    accentColor: 'text-sky-500',
    bgColor: 'bg-sky-500/10 border-sky-500/20',
  },
  {
    key: 'showTeamGoalsChart',
    title: 'Grafik Produktivitas Gol Tim (Bar Chart)',
    category: 'GRAFIK BATANG',
    desc: 'Diagram batang vertikal interaktif yang memvisualisasikan perolehan total gol masing-masing kontingen sekolah.',
    icon: BarChart3,
    accentColor: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    key: 'showDisciplineChart',
    title: 'Grafik Fair Play & Disiplin Kartu (Horizontal Bar)',
    category: 'GRAFIK FAIR PLAY',
    desc: 'Diagram horizontal indeks sportivitas tim, rekapitulasi akumulasi kartu kuning/merah, serta predikat tim paling tertib.',
    icon: ShieldAlert,
    accentColor: 'text-amber-500',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
  },
  {
    key: 'showTopScorers',
    title: 'Papan Peringkat Top Scorer (Sepatu Emas)',
    category: 'LEADERBOARD ATLET',
    desc: 'Daftar 5 atlet pencetak gol terbanyak turnamen lengkap dengan asal tim kontingen, sekolah, dan jumlah gol.',
    icon: Trophy,
    accentColor: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10 border-yellow-500/20',
  },
  {
    key: 'showCleanSheet',
    title: 'Peringkat Pertahanan Terbaik & Clean Sheet',
    category: 'STATISTIK DEFENSE',
    desc: 'Rekapitulasi kontingen tim dengan pertahanan terkokoh, minim kebobolan, serta torehan nirbobol (clean sheet).',
    icon: ShieldCheck,
    accentColor: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10 border-indigo-500/20',
  },
  {
    key: 'showGoalDistribution',
    title: 'Grafik Sebaran Waktu Gol (Babak 1 vs Babak 2)',
    category: 'ANALISIS TIMELINE',
    desc: 'Visualisasi persentase waktu terjadinya gol turnamen antara babak pertama, babak kedua, dan fase krusial laga.',
    icon: PieChart,
    accentColor: 'text-rose-500',
    bgColor: 'bg-rose-500/10 border-rose-500/20',
  },
];

export const StatsDisplaySettingsTab: React.FC = () => {
  const [config, setConfig] = usePersistentState<PublicStatsDisplayConfig>(
    STORAGE_KEY_STATS_CONFIG,
    DEFAULT_PUBLIC_STATS_CONFIG
  );
  const [draft, setDraft] = useState<PublicStatsDisplayConfig>(config);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && json?.data?.statsConfig && isMounted) {
          setConfig(json.data.statsConfig);
          setDraft(json.data.statsConfig);
        }
      })
      .catch((e) => console.warn('Gagal memuat pengaturan statistik:', e));
    return () => { isMounted = false; };
  }, []);

  const toggleOption = (key: keyof PublicStatsDisplayConfig) => {
    setDraft((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const applyPreset = (preset: 'ALL' | 'STANDARD' | 'COMPACT') => {
    if (preset === 'ALL') {
      setDraft({
        showQuickMetrics: true,
        showTeamGoalsChart: true,
        showDisciplineChart: true,
        showTopScorers: true,
        showCleanSheet: true,
        showGoalDistribution: true,
      });
    } else if (preset === 'STANDARD') {
      setDraft(DEFAULT_PUBLIC_STATS_CONFIG);
    } else {
      setDraft({
        showQuickMetrics: true,
        showTeamGoalsChart: false,
        showDisciplineChart: false,
        showTopScorers: true,
        showCleanSheet: false,
        showGoalDistribution: false,
      });
    }
  };

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
        body: JSON.stringify({ statsConfig: draft }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyimpan konfigurasi grafik statistik.');
      }
      setConfig(draft);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e: any) {
      console.error('Gagal sinkron statsConfig ke database:', e);
      setErrorMessage(e.message || 'Gagal menyimpan ke database.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const activeCount = Object.values(draft).filter(Boolean).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Information Header & Preset Bar */}
      <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bebas text-lg sm:text-xl uppercase tracking-wider text-[var(--text-main)]">
                Pengaturan Tampilan Grafik Statistik &amp; Performa
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Tentukan card metrik dan grafik apa saja yang ditampilkan kepada publik pada menu <strong>Statistik</strong>.
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] w-fit shrink-0">
            <button
              type="button"
              onClick={() => applyPreset('ALL')}
              className="btn-tactile px-2.5 py-1 rounded-lg text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              Semua Aktif
            </button>
            <button
              type="button"
              onClick={() => applyPreset('STANDARD')}
              className="btn-tactile px-2.5 py-1 rounded-lg text-[11px] font-barlow font-bold uppercase tracking-wider bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)]"
            >
              Standar Turnamen
            </button>
            <button
              type="button"
              onClick={() => applyPreset('COMPACT')}
              className="btn-tactile px-2.5 py-1 rounded-lg text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              Mode Ringkas
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Toggleable Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STAT_OPTIONS.map((opt) => {
          const isEnabled = Boolean(draft[opt.key]);
          const Icon = opt.icon;

          return (
            <div
              key={opt.key}
              onClick={() => toggleOption(opt.key)}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-4 select-none ${
                isEnabled
                  ? 'border-[var(--color-arena-primary)] bg-[var(--bg-surface)] shadow-xs ring-1 ring-[var(--color-arena-primary)]/20'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 opacity-60 hover:opacity-100 hover:border-slate-400 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${opt.bgColor} ${opt.accentColor}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      {opt.category}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isEnabled
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-500/15 text-slate-500 border border-slate-500/30'
                      }`}
                    >
                      {isEnabled ? 'TAMPIL' : 'SEMBUNYI'}
                    </span>
                  </div>
                  <h4 className="font-barlow font-bold text-sm sm:text-base text-[var(--text-main)] leading-snug">
                    {opt.title}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="shrink-0 pt-1">
                <div
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                    isEnabled ? 'bg-[var(--color-arena-primary)]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Action Bar */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="text-xs text-[var(--text-muted)] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            Status konfigurasi: <strong>{activeCount} dari {STAT_OPTIONS.length} card grafik</strong> aktif ditampilkan di publik.
          </span>
        </div>

        <div className="flex items-center gap-2">
          {errorMessage && (
            <div className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-1.5 animate-fadeIn">
              <span>{errorMessage}</span>
            </div>
          )}
          {isSaved && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>Pengaturan card grafik berhasil disimpan!</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="btn-tactile px-5 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white font-barlow font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Pengaturan Grafik'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

