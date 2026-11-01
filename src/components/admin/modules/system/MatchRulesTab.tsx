'use client';

import React from 'react';
import { Timer, Trophy, RotateCcw, Save } from 'lucide-react';
import { SPORTS_CONFIG } from '@/mocks/multiSportData';
import { SportRuleSettings } from '@/config/sportRules';

interface MatchRulesTabProps {
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
  currentRules: SportRuleSettings;
  handleUpdateRule: <K extends keyof SportRuleSettings>(field: K, value: SportRuleSettings[K]) => void;
  handleResetToDefault: () => void;
  handleSave: () => void;
}

export const MatchRulesTab: React.FC<MatchRulesTabProps> = ({
  selectedSport,
  setSelectedSport,
  currentRules,
  handleUpdateRule,
  handleResetToDefault,
  handleSave,
}) => {
  return (
    <div className="space-y-6">
      {/* Sport Selector Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {SPORTS_CONFIG.map((sp) => (
          <button
            key={sp.code}
            type="button"
            onClick={() => setSelectedSport(sp.code)}
            className={`btn-tactile px-4 py-2 rounded-xl font-barlow font-bold text-xs uppercase tracking-wider border transition-all ${
              selectedSport === sp.code
                ? 'bg-[var(--color-arena-primary)] text-white border-[var(--color-arena-primary)] shadow-sm'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-subtle)]'
            }`}
          >
            {sp.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Durasi & Waktu Babak */}
        <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <Timer className="w-5 h-5 text-[var(--color-arena-primary)]" />
            <h3 className="font-barlow font-bold uppercase tracking-wider text-base text-[var(--text-main)]">
              Format Durasi &amp; Waktu ({selectedSport})
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-[var(--text-main)] block">Durasi Babak (Menit)</label>
                <span className="text-xs text-[var(--text-muted)]">Panjang waktu tiap periode pertandingan</span>
              </div>
              <input
                type="number"
                min="1"
                max="90"
                value={currentRules.durationPerPeriod}
                onChange={(e) => handleUpdateRule('durationPerPeriod', Number(e.target.value))}
                className="w-20 px-3 py-1.5 text-center text-sm font-bold rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-[var(--text-main)] block">Jumlah Babak / Set</label>
                <span className="text-xs text-[var(--text-muted)]">Jumlah periode waktu resmi</span>
              </div>
              <input
                type="number"
                min="1"
                max="6"
                value={currentRules.periodCount}
                onChange={(e) => handleUpdateRule('periodCount', Number(e.target.value))}
                className="w-20 px-3 py-1.5 text-center text-sm font-bold rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-[var(--text-main)] block">Waktu Istirahat (Menit)</label>
                <span className="text-xs text-[var(--text-muted)]">Jeda paruh waktu (Half-Time Interval)</span>
              </div>
              <input
                type="number"
                min="1"
                max="30"
                value={currentRules.breakDuration}
                onChange={(e) => handleUpdateRule('breakDuration', Number(e.target.value))}
                className="w-20 px-3 py-1.5 text-center text-sm font-bold rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-[var(--text-main)] block">Jatah Time-out per Babak</label>
                <span className="text-xs text-[var(--text-muted)]">Hak jeda taktis tiap tim per periode</span>
              </div>
              <input
                type="number"
                min="0"
                max="5"
                value={currentRules.timeoutPerPeriod}
                onChange={(e) => handleUpdateRule('timeoutPerPeriod', Number(e.target.value))}
                className="w-20 px-3 py-1.5 text-center text-sm font-bold rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Skema Poin & Klasemen */}
        <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-barlow font-bold uppercase tracking-wider text-base text-[var(--text-main)]">
              Perhitungan Poin Klasemen
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-[var(--text-main)] block">Poin Menang (Win)</label>
                <span className="text-xs text-[var(--text-muted)]">Poin klasemen saat menang tanding</span>
              </div>
              <input
                type="number"
                min="0"
                max="10"
                value={currentRules.winPoints}
                onChange={(e) => handleUpdateRule('winPoints', Number(e.target.value))}
                className="w-20 px-3 py-1.5 text-center text-sm font-bold rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-[var(--text-main)] block">Poin Seri (Draw)</label>
                <span className="text-xs text-[var(--text-muted)]">Poin klasemen saat skor imbang</span>
              </div>
              <input
                type="number"
                min="0"
                max="10"
                value={currentRules.drawPoints}
                onChange={(e) => handleUpdateRule('drawPoints', Number(e.target.value))}
                className="w-20 px-3 py-1.5 text-center text-sm font-bold rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-[var(--text-main)] block">Poin Kalah (Loss)</label>
                <span className="text-xs text-[var(--text-muted)]">Poin klasemen saat kalah tanding</span>
              </div>
              <input
                type="number"
                min="0"
                max="10"
                value={currentRules.lossPoints}
                onChange={(e) => handleUpdateRule('lossPoints', Number(e.target.value))}
                className="w-20 px-3 py-1.5 text-center text-sm font-bold rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-[var(--text-main)] block">Batas Foul Akumulasi</label>
                <span className="text-xs text-[var(--text-muted)]">Pemicu penalti 10 meter (Futsal/Basket)</span>
              </div>
              <input
                type="number"
                min="0"
                max="10"
                value={currentRules.foulLimit}
                onChange={(e) => handleUpdateRule('foulLimit', Number(e.target.value))}
                className="w-20 px-3 py-1.5 text-center text-sm font-bold rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handleResetToDefault}
          className="btn-tactile px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] font-barlow font-bold text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Default</span>
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="btn-tactile px-6 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Aturan Pertandingan</span>
        </button>
      </div>
    </div>
  );
};

