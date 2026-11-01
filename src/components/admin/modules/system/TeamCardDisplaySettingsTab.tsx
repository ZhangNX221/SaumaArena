'use client';

import React, { useState } from 'react';
import { LayoutGrid, LayoutTemplate, CheckCircle2, Save, Sparkles, ChevronRight } from 'lucide-react';
import { usePersistentState } from '@/hooks/usePersistentState';
import { TeamCardLayout, STORAGE_KEY_TEAM_CARD_LAYOUT } from '@/types';
import { initialTeams } from '@/mocks/tournamentData';
import { getTeamLogoUrl } from '@/mocks/teamLogos';

export const TeamCardDisplaySettingsTab: React.FC = () => {
  const [layout, setLayout] = usePersistentState<TeamCardLayout>(STORAGE_KEY_TEAM_CARD_LAYOUT, 'STANDARD');
  const [draftLayout, setDraftLayout] = useState<TeamCardLayout>(layout);
  const [isSaved, setIsSaved] = useState(false);

  // Sample preview team
  const sampleTeam = initialTeams[0] || {
    id: 'team-sdi-kardina',
    code: 'TM-01',
    name: 'SDI KARDINA MASSA',
    schoolName: 'SD Islam Kardina Massa Blitar',
    city: 'Blitar',
    group: 'A',
    coachName: 'Ust. Bambang Wijayanto',
    players: [{}, {}, {}, {}],
  };

  const handleSave = () => {
    setLayout(draftLayout);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Information Header */}
      <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] flex items-center justify-center shrink-0">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bebas text-lg uppercase tracking-wider text-[var(--text-main)]">
              Format Tampilan Card Tim Publik
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Pilih format visual kartu tim yang ditampilkan kepada publik pada menu <strong>Daftar Tim &amp; Skuad Atlet</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Format Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Option Standar */}
        <div
          onClick={() => setDraftLayout('STANDARD')}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 select-none ${
            draftLayout === 'STANDARD'
              ? 'border-[var(--color-arena-primary)] bg-[var(--bg-surface)] shadow-md ring-2 ring-[var(--color-arena-primary)]/20'
              : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-slate-400 dark:hover:border-slate-700'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    draftLayout === 'STANDARD'
                      ? 'border-[var(--color-arena-primary)] bg-[var(--color-arena-primary)] text-white'
                      : 'border-slate-400 dark:border-slate-600'
                  }`}
                >
                  {draftLayout === 'STANDARD' && <span className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="font-barlow font-bold uppercase tracking-wider text-sm text-[var(--text-main)] flex items-center gap-1.5">
                  <LayoutTemplate className="w-4 h-4 text-sky-500" />
                  <span>Card Standar (Lengkap)</span>
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800 text-[10px] font-mono font-bold uppercase">
                Default
              </span>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Format lengkap: Menampilkan logo, nama tim, sekolah, badge grup, kotak statistik total atlet, nama pelatih ofisial, dan tombol &apos;Lihat Skuad Atlet&apos;.
            </p>

            {/* Visual Live Preview Standar */}
            <div className="pt-2">
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">
                Pratinjau Tampilan:
              </span>
              <div className="p-4 rounded-xl bg-[var(--bg-muted)]/70 border border-[var(--border-subtle)] space-y-3 pointer-events-none opacity-95">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface)] border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-2xs">
                      <img
                        src={getTeamLogoUrl(sampleTeam.id)}
                        alt={sampleTeam.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-barlow font-bold text-sm text-[var(--text-main)] leading-tight">
                        {sampleTeam.name}
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)] truncate max-w-[170px]">
                        {sampleTeam.schoolName}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800 shrink-0">
                    Grup {sampleTeam.group}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase block">Total Atlet</span>
                    <span className="font-mono font-bold text-xs text-[var(--text-main)]">4 Pemain</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] truncate">
                    <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase block">Pelatih</span>
                    <span className="font-mono font-bold text-xs text-[var(--text-main)] truncate block">Ust. Bambang</span>
                  </div>
                </div>

                <div className="w-full py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[10px] font-barlow font-bold uppercase text-center text-[var(--text-muted)]">
                  Lihat Skuad Atlet
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-primary)]">
            {draftLayout === 'STANDARD' ? '✓ Format Sedang Dipilih' : 'Klik untuk Memilih Format Ini'}
          </div>
        </div>

        {/* 2. Option Minimalis */}
        <div
          onClick={() => setDraftLayout('MINIMAL')}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 select-none ${
            draftLayout === 'MINIMAL'
              ? 'border-[var(--color-arena-primary)] bg-[var(--bg-surface)] shadow-md ring-2 ring-[var(--color-arena-primary)]/20'
              : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-slate-400 dark:hover:border-slate-700'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    draftLayout === 'MINIMAL'
                      ? 'border-[var(--color-arena-primary)] bg-[var(--color-arena-primary)] text-white'
                      : 'border-slate-400 dark:border-slate-600'
                  }`}
                >
                  {draftLayout === 'MINIMAL' && <span className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="font-barlow font-bold uppercase tracking-wider text-sm text-[var(--text-main)] flex items-center gap-1.5">
                  <LayoutGrid className="w-4 h-4 text-emerald-500" />
                  <span>Card Minimalis (Clean)</span>
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-mono font-bold uppercase">
                Minimalis
              </span>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Format ringkas &amp; bersih: Hanya menampilkan <strong>Nama Tim</strong>, <strong>Logo Resmi</strong>, dan <strong>Asal Sekolah</strong>. Seluruh kartu dapat diklik langsung untuk membuka rincian skuad atlet.
            </p>

            {/* Visual Live Preview Minimalis */}
            <div className="pt-2">
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">
                Pratinjau Tampilan:
              </span>
              <div className="p-4 rounded-xl bg-[var(--bg-muted)]/70 border border-[var(--border-subtle)] flex items-center justify-between gap-3 pointer-events-none opacity-95">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-2xs">
                    <img
                      src={getTeamLogoUrl(sampleTeam.id)}
                      alt={sampleTeam.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-sky-950/40 text-[#1D63B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800">
                        Grup {sampleTeam.group}
                      </span>
                    </div>
                    <h4 className="font-barlow font-bold text-sm text-[var(--text-main)] leading-tight truncate">
                      {sampleTeam.name}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] truncate max-w-[180px]">
                      {sampleTeam.schoolName}
                    </p>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] flex items-center justify-center shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-primary)]">
            {draftLayout === 'MINIMAL' ? '✓ Format Sedang Dipilih' : 'Klik untuk Memilih Format Ini'}
          </div>
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="text-xs text-[var(--text-muted)] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            Format aktif saat ini: <strong>{layout === 'MINIMAL' ? 'Minimalis (Nama, Logo, Sekolah)' : 'Standar (Lengkap dengan Ofisial/Atlet)'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>Gaya tampilan card tim berhasil disimpan!</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="btn-tactile px-5 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white font-barlow font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Tampilan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

