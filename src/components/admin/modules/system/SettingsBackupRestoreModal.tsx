'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileJson,
  Layers,
  Sliders,
  Check,
} from 'lucide-react';

interface SettingsBackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsRestored?: (restoredData?: any) => void;
}

export const SettingsBackupRestoreModal: React.FC<SettingsBackupRestoreModalProps> = ({
  isOpen,
  onClose,
  onSettingsRestored,
}) => {
  const [activeTab, setActiveTab] = useState<'PRESETS' | 'FILE'>('PRESETS');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    if (type === 'success') {
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // 1. Terapkan Preset Cepat Laga Baru
  const handleApplyPreset = async (presetCode: string, presetName: string) => {
    setIsLoading(true);
    setFeedback(null);
    try {
      let token: string | null = null;
      try {
        token = localStorage.getItem('sauma_auth_token');
      } catch {}

      const res = await fetch('/api/settings/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ presetCode }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menerapkan preset pengaturan.');
      }

      // Sinkronkan ke localStorage
      if (data.restoredSettings?.sportRules) {
        localStorage.setItem('sauma_arena_match_rules', JSON.stringify(data.restoredSettings.sportRules));
      }
      if (data.restoredSettings?.bracketSize) {
        localStorage.setItem('sauma_arena_bracket_size', String(data.restoredSettings.bracketSize));
      }

      // Beritahu komponen lain via event
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('sauma_state_sync', { detail: { key: 'sauma_arena_match_rules' } }));

      showFeedback('success', `Preset '${presetName}' berhasil disimpan ke database dan diterapkan!`);
      onSettingsRestored?.(data.restoredSettings);
    } catch (err: any) {
      showFeedback('error', err.message || 'Terjadi kesalahan saat memulihkan preset.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Unduh Berkas JSON Cadangan
  const handleExportBackup = async () => {
    setIsLoading(true);
    try {
      let token: string | null = null;
      try {
        token = localStorage.getItem('sauma_auth_token');
      } catch {}

      const res = await fetch('/api/settings/backup', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Gagal mengunduh cadangan pengaturan.');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sauma_settings_backup_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showFeedback('success', 'Berkas cadangan pengaturan (.json) berhasil diunduh!');
    } catch (err: any) {
      showFeedback('error', err.message || 'Gagal mengekspor berkas.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Unggah Berkas JSON Cadangan
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setFeedback(null);

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      let token: string | null = null;
      try {
        token = localStorage.getItem('sauma_auth_token');
      } catch {}

      const res = await fetch('/api/settings/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal memulihkan pengaturan dari berkas.');
      }

      // Sinkronkan ke localStorage
      if (data.restoredSettings?.rulesOverrides?.sport_rules) {
        localStorage.setItem(
          'sauma_arena_match_rules',
          JSON.stringify(data.restoredSettings.rulesOverrides.sport_rules)
        );
      }
      if (data.restoredSettings?.rulesOverrides?.bracket_size) {
        localStorage.setItem(
          'sauma_arena_bracket_size',
          String(data.restoredSettings.rulesOverrides.bracket_size)
        );
      }
      if (data.restoredSettings?.rulesOverrides?.team_card_layout) {
        localStorage.setItem(
          'sauma_arena_team_card_layout',
          data.restoredSettings.rulesOverrides.team_card_layout
        );
      }
      if (data.restoredSettings?.rulesOverrides?.supporter_weights) {
        localStorage.setItem(
          'sauma_arena_supporter_weights',
          JSON.stringify(data.restoredSettings.rulesOverrides.supporter_weights)
        );
      }

      window.dispatchEvent(new Event('storage'));
      showFeedback('success', 'Seluruh pengaturan dari berkas cadangan berhasil diterapkan ke database!');
      onSettingsRestored?.(data.restoredSettings);
    } catch (err: any) {
      showFeedback('error', err.message || 'Gagal membaca berkas JSON pengaturan.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 space-y-5 text-[var(--text-main)] shadow-2xl animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bebas text-xl uppercase tracking-wider text-[var(--text-main)]">
                Cadangkan &amp; Pulihkan Pengaturan Turnamen
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Simpan atau pulihkan konfigurasi durasi babak, format bagan, dan regulasi laga.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-xl bg-[var(--bg-muted)]/80 p-1 border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('PRESETS')}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === 'PRESETS'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Preset Cepat Laga Baru
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('FILE')}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === 'FILE'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Berkas Cadangan (JSON)
          </button>
        </div>

        {/* Alert Feedback */}
        {feedback && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 animate-fadeIn ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span className="font-medium">{feedback.message}</span>
          </div>
        )}

        {/* Tab 1: Presets */}
        {activeTab === 'PRESETS' && (
          <div className="space-y-3">
            <p className="text-xs text-[var(--text-muted)]">
              Pilih template bawaan untuk memulai pertandingan atau turnamen baru tanpa perlu menyetel ulang satu per satu:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Preset 1: MMFC Official */}
              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--color-arena-primary)]/50 transition-all flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[var(--text-main)]">Turnamen Resmi MMFC I</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">Resmi</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    Futsal 2 × 15 Menit, Bagan 8 Besar, Limit 5 Foul, Waktu Bersih, Toleransi 15 Mnt.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleApplyPreset('mmfc_official', 'Turnamen Resmi MMFC I')}
                  className="btn-tactile w-full py-1.5 rounded-lg bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Terapkan Preset</span>
                </button>
              </div>

              {/* Preset 2: Futsal Quick */}
              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--color-arena-primary)]/50 transition-all flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[var(--text-main)]">Futsal Kilat (Fast-Track)</span>
                    <span className="text-[10px] font-mono text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded">Cepat</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    Futsal 2 × 10 Menit, Bagan 4 Besar, Running Clock, Penalti 3 Penendang.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleApplyPreset('futsal_quick', 'Futsal Kilat')}
                  className="btn-tactile w-full py-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Terapkan Preset</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: File JSON */}
        {activeTab === 'FILE' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
                <Download className="w-4 h-4 text-[var(--color-arena-primary)]" />
                <span>Ekspor Pengaturan ke Berkas JSON</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Unduh seluruh konfigurasi aturan pertandingan, durasi, bagan, dan protokol sebagai berkas cadangan offline.
              </p>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleExportBackup}
                className="btn-tactile px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Cadangan (.json)</span>
              </button>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
                <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Pulihkan Pengaturan dari Berkas JSON</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Unggah berkas cadangan JSON yang sebelumnya diunduh untuk mengembalikan semua settingan secara instan ke database SQLite.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => fileInputRef.current?.click()}
                className="btn-tactile px-4 py-2 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih &amp; Pulihkan Berkas (.json)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

