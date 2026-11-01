'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  ShieldAlert,
  Save,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Plus,
} from 'lucide-react';
import { usePersistentState } from '@/hooks/usePersistentState';
import {
  AssessmentCriterionItem,
  SupporterAssessmentConfig,
  DEFAULT_ASSESSMENT_CONFIG,
  STORAGE_KEY_SUPPORTER_WEIGHTS,
  normalizeAssessmentConfig,
} from '@/config/supporterRules';
import { AssessmentCriterionEditorCard } from './AssessmentCriterionEditorCard';
import { AssessmentRubricPreviewCard } from './AssessmentRubricPreviewCard';

export const MatchAssessmentSettingsTab: React.FC = () => {
  const [persistedConfig, setPersistedConfig] = usePersistentState<any>(
    STORAGE_KEY_SUPPORTER_WEIGHTS,
    DEFAULT_ASSESSMENT_CONFIG
  );

  const [formConfig, setFormConfig] = useState<SupporterAssessmentConfig>(() =>
    normalizeAssessmentConfig(persistedConfig)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Muat settingan dari backend jika tersedia
  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.supporterWeights && isMounted) {
            const normalized = normalizeAssessmentConfig(json.data.supporterWeights);
            setPersistedConfig(normalized);
            setFormConfig(normalized);
          }
        }
      } catch (err) {
        console.warn('Gagal memuat bobot dari backend:', err);
      }
    };
    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setFormConfig(normalizeAssessmentConfig(persistedConfig));
  }, [persistedConfig]);

  // Handler Apresiasi (Positif)
  const handleAddPositive = () => {
    const newNum = formConfig.positiveCriteria.length + 1;
    const newItem: AssessmentCriterionItem = {
      id: `crit_pos_${Date.now()}`,
      badge: `APRESIASI ${newNum}`,
      label: 'Kriteria apresiasi suporter baru',
      points: 10,
    };
    setFormConfig((prev) => ({
      ...prev,
      positiveCriteria: [...prev.positiveCriteria, newItem],
    }));
  };

  const handleUpdatePositive = (index: number, updated: AssessmentCriterionItem) => {
    setFormConfig((prev) => {
      const next = [...prev.positiveCriteria];
      next[index] = updated;
      return { ...prev, positiveCriteria: next };
    });
  };

  const handleDeletePositive = (index: number) => {
    setFormConfig((prev) => ({
      ...prev,
      positiveCriteria: prev.positiveCriteria.filter((_, idx) => idx !== index),
    }));
  };

  // Handler Sanksi (Pengurangan)
  const handleAddPenalty = () => {
    const newNum = formConfig.penaltyCriteria.length + 1;
    const newItem: AssessmentCriterionItem = {
      id: `crit_neg_${Date.now()}`,
      badge: `SANKSI ${newNum}`,
      label: 'Pelanggaran ketertiban tribun baru',
      points: 10,
    };
    setFormConfig((prev) => ({
      ...prev,
      penaltyCriteria: [...prev.penaltyCriteria, newItem],
    }));
  };

  const handleUpdatePenalty = (index: number, updated: AssessmentCriterionItem) => {
    setFormConfig((prev) => {
      const next = [...prev.penaltyCriteria];
      next[index] = updated;
      return { ...prev, penaltyCriteria: next };
    });
  };

  const handleDeletePenalty = (index: number) => {
    setFormConfig((prev) => ({
      ...prev,
      penaltyCriteria: prev.penaltyCriteria.filter((_, idx) => idx !== index),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setPersistedConfig(formConfig);

    try {
      let token: string | null = null;
      try {
        token = localStorage.getItem('sauma_auth_token');
      } catch {}

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          supporterWeights: formConfig,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menyimpan ke database');
      }

      setToastMessage('Ketentuan & Bobot Penilaian berhasil disimpan permanen ke database SQLite!');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      setToastMessage(err.message || 'Gagal menyimpan bobot ke database.');
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormConfig(DEFAULT_ASSESSMENT_CONFIG);
    setPersistedConfig(DEFAULT_ASSESSMENT_CONFIG);
    setToastMessage('Bobot penilaian dikembalikan ke pengaturan standar (4 Apresiasi & 4 Sanksi).');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notifikasi */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header Pengantar & Kontrol Judul */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#1D63B8] dark:text-sky-400 shrink-0" />
            <h3 className="font-barlow font-bold text-sm uppercase tracking-wider text-[var(--text-main)]">
              Pengaturan Bobot &amp; Jenis Rubrik Penilaian Pertandingan
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-500/10 text-[#1D63B8] dark:text-sky-300 border border-blue-500/20">
              {formConfig.positiveCriteria.length} Jenis Apresiasi
            </span>
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-300 border border-red-500/20">
              {formConfig.penaltyCriteria.length} Jenis Sanksi
            </span>
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Kelola kriteria apresiasi kreativitas tribun dan sanksi pelanggaran ketertiban. Anda dapat
          menambah jenis baru, mengedit nama badge/deskripsi/bobot poin, serta menghapus kriteria sesuai
          kebutuhan kompetisi.
        </p>

        <div>
          <label className="block text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
            Judul Rubrik Penilaian (Ditampilkan di Kartu Publik)
          </label>
          <input
            type="text"
            value={formConfig.title}
            onChange={(e) => setFormConfig((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Form Input 2 Kolom: Jenis Apresiasi & Jenis Sanksi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom 1: Poin Apresiasi Kreativitas (Biru) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-blue-500/30 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-[#1D63B8] dark:text-sky-400 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <span className="font-barlow font-bold text-xs uppercase tracking-wider text-[#1D63B8] dark:text-sky-400">
                Jenis Apresiasi Kreativitas Tribun
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddPositive}
              className="btn-tactile px-2.5 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500 text-[#1D63B8] dark:text-sky-300 hover:text-white transition-all text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </div>

          <div className="space-y-3">
            {formConfig.positiveCriteria.map((item, idx) => (
              <AssessmentCriterionEditorCard
                key={item.id}
                item={item}
                index={idx}
                theme="positive"
                onChange={(updated) => handleUpdatePositive(idx, updated)}
                onDelete={() => handleDeletePositive(idx)}
                canDelete={formConfig.positiveCriteria.length > 1}
              />
            ))}
          </div>
        </div>

        {/* Kolom 2: Sanksi Pelanggaran Ketertiban (Merah) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-red-500/30 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="font-barlow font-bold text-xs uppercase tracking-wider text-red-600 dark:text-red-400">
                Jenis Sanksi Pelanggaran Tribun
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddPenalty}
              className="btn-tactile px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500 text-red-600 dark:text-red-300 hover:text-white transition-all text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </div>

          <div className="space-y-3">
            {formConfig.penaltyCriteria.map((item, idx) => (
              <AssessmentCriterionEditorCard
                key={item.id}
                item={item}
                index={idx}
                theme="penalty"
                onChange={(updated) => handleUpdatePenalty(idx, updated)}
                onDelete={() => handleDeletePenalty(idx)}
                canDelete={formConfig.penaltyCriteria.length > 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tombol Aksi: Simpan & Reset */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="btn-tactile px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
          <span>Kembalikan Default</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="btn-tactile px-5 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-blue-600 text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Ketentuan & Bobot'}</span>
        </button>
      </div>

      {/* Live Preview Pratinjau Langsung */}
      <AssessmentRubricPreviewCard config={formConfig} />
    </div>
  );
};
