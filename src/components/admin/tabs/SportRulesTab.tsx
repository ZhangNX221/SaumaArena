'use client';

import React, { useState } from 'react';
import { ShieldCheck, Check, Settings2, Sliders } from 'lucide-react';

export const SportRulesTab: React.FC = () => {
  const [activeSport, setActiveSport] = useState<'FUTSAL' | 'SOCCER'>('FUTSAL');

  return (
    <div className="space-y-6">
      {/* Cabor Selector Cards (FreeDash-lite Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Futsal */}
        <div
          onClick={() => setActiveSport('FUTSAL')}
          className={`p-5 rounded-xl border transition-all cursor-pointer bg-[var(--bg-surface)] ${
            activeSport === 'FUTSAL'
              ? 'border-[var(--color-arena-primary)] ring-2 ring-[var(--color-arena-primary)]/10 shadow-xs'
              : 'border-[var(--border-subtle)] hover:border-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-arena-primary)]">
              Cabor Prioritas
            </span>
            {activeSport === 'FUTSAL' && (
              <span className="w-5 h-5 rounded-full bg-[var(--color-arena-primary)] text-white flex items-center justify-center">
                <Check className="w-3 h-3" />
              </span>
            )}
          </div>
          <h4 className="font-extrabold text-base text-[var(--text-main)]">Futsal (Aktif)</h4>
          <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
            Format 5 vs 5, durasi 2 &times; 20 menit, akumulasi foul, dan 2 kartu kuning skorsing.
          </p>
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
            <span className="text-[var(--text-muted)]">Regulasi:</span>
            <span className="font-semibold text-[var(--color-arena-primary)]">Standar FFI 2026</span>
          </div>
        </div>

        {/* Sepak Bola */}
        <div
          onClick={() => setActiveSport('SOCCER')}
          className={`p-5 rounded-xl border transition-all cursor-pointer bg-[var(--bg-surface)] ${
            activeSport === 'SOCCER'
              ? 'border-[var(--color-arena-primary)] ring-2 ring-[var(--color-arena-primary)]/10 shadow-xs'
              : 'border-[var(--border-subtle)] hover:border-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Cabor Lapangan Besar
            </span>
            {activeSport === 'SOCCER' && (
              <span className="w-5 h-5 rounded-full bg-[var(--color-arena-primary)] text-white flex items-center justify-center">
                <Check className="w-3 h-3" />
              </span>
            )}
          </div>
          <h4 className="font-extrabold text-base text-[var(--text-main)]">Sepak Bola (Aktif)</h4>
          <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
            Format 11 vs 11, durasi 2 &times; 35-45 menit, hukum offside, dan adu penalti 5 penendang.
          </p>
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
            <span className="text-[var(--text-muted)]">Regulasi:</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">PSSI / IFAB</span>
          </div>
        </div>

        {/* Bola Voli */}
        <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] opacity-60">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Fase 2 Modular
            </span>
          </div>
          <h4 className="font-extrabold text-base text-[var(--text-main)]">Bola Voli</h4>
          <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
            Sistem rally point (25 poin per set, selisih 2 angka), rotasi pemain, dan best of 3/5 sets.
          </p>
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
            <span className="text-[var(--text-muted)]">Status:</span>
            <span className="font-medium text-[var(--text-muted)]">Dapat Diaktivasi</span>
          </div>
        </div>

        {/* Badminton */}
        <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] opacity-60">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Fase 2 Modular
            </span>
          </div>
          <h4 className="font-extrabold text-base text-[var(--text-main)]">Bulu Tangkis</h4>
          <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
            Format tunggal/ganda, 3 game &times; 21 poin standar BWF, interval 60 dan 120 detik.
          </p>
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
            <span className="text-[var(--text-muted)]">Status:</span>
            <span className="font-medium text-[var(--text-muted)]">Dapat Diaktivasi</span>
          </div>
        </div>
      </div>

      {/* Active Rule Engine Parameters Card (FreeDash-lite Style Form Groups) */}
      <div className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--text-main)]">
                Parameter Mesin Pertandingan ({activeSport === 'FUTSAL' ? 'Futsal' : 'Sepak Bola'})
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Pengaturan ini langsung memengaruhi validasi scorekeeper, form juri, dan perhitungan klasemen otomatis.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] border border-[var(--color-arena-primary)]/20">
            Engine Siap &bull; v2.4
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-[var(--bg-muted)]/70 border border-[var(--border-subtle)] space-y-1.5">
            <span className="font-semibold text-[var(--text-muted)] block">Durasi Babak</span>
            <div className="text-base font-black text-[var(--text-main)] font-mono">
              {activeSport === 'FUTSAL' ? '2 x 20 Menit' : '2 x 45 Menit'}
            </div>
            <span className="text-[11px] text-[var(--text-muted)]">Waktu istirahat jeda babak: 5 menit</span>
          </div>

          <div className="p-4 rounded-lg bg-[var(--bg-muted)]/70 border border-[var(--border-subtle)] space-y-1.5">
            <span className="font-semibold text-[var(--text-muted)] block">Aturan Akumulasi Kartu</span>
            <div className="text-base font-black text-[var(--text-main)] font-mono">
              2 Kartu Kuning = Skorsing
            </div>
            <span className="text-[11px] text-[var(--text-muted)]">Larangan bertanding otomatis di laga berikutnya</span>
          </div>

          <div className="p-4 rounded-lg bg-[var(--bg-muted)]/70 border border-[var(--border-subtle)] space-y-1.5">
            <span className="font-semibold text-[var(--text-muted)] block">Penentuan Seri Babak Gugur</span>
            <div className="text-base font-black text-[var(--text-main)] font-mono">
              {activeSport === 'FUTSAL' ? 'Adu Penalti (3 Penendang)' : 'Adu Penalti (5 Penendang)'}
            </div>
            <span className="text-[11px] text-[var(--text-muted)]">Sudden death jika skor penalti tetap imbang</span>
          </div>
        </div>
      </div>
    </div>
  );
};
