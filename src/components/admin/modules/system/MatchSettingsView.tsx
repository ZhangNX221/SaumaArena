'use client';

import React, { useState } from 'react';
import {
  Swords,
  Timer,
  Trophy,
  ShieldAlert,
  CheckCircle2,
  UserCog,
  Save,
  RotateCcw,
  Sliders,
  Scale,
} from 'lucide-react';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';
import { MatchAssignmentsTab } from '../officials/MatchAssignmentsTab';
import { SPORTS_CONFIG } from '@/mocks/multiSportData';

type SettingSubTab = 'RULES' | 'OFFICIALS' | 'PROTOCOLS';

interface SportRuleSettings {
  durationPerPeriod: number; // minutes
  periodCount: number;
  breakDuration: number; // minutes
  winPoints: number;
  drawPoints: number;
  lossPoints: number;
  foulLimit: number;
  timeoutPerPeriod: number;
  extraTimeDuration: number;
  penaltyKicksCount: number;
}

const DEFAULT_SPORT_RULES: Record<string, SportRuleSettings> = {
  FUTSAL: {
    durationPerPeriod: 20,
    periodCount: 2,
    breakDuration: 5,
    winPoints: 3,
    drawPoints: 1,
    lossPoints: 0,
    foulLimit: 5,
    timeoutPerPeriod: 1,
    extraTimeDuration: 5,
    penaltyKicksCount: 5,
  },
};

export const MatchSettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingSubTab>('RULES');
  const [selectedSport, setSelectedSport] = useState<string>('FUTSAL');
  const [rulesState, setRulesState] = useState<Record<string, SportRuleSettings>>(DEFAULT_SPORT_RULES);
  
  // Protocol State
  const [woScoreA, setWoScoreA] = useState<number>(3);
  const [woScoreB] = useState<number>(0);
  const [lateToleranceMinutes, setLateToleranceMinutes] = useState<number>(15);
  const [bapVerificationMode, setBapVerificationMode] = useState<'MANUAL' | 'AUTO'>('MANUAL');
  const [allowOvertimeInGroup, setAllowOvertimeInGroup] = useState<boolean>(false);
  
  // Feedback toast
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentRules = rulesState[selectedSport] || DEFAULT_SPORT_RULES.FUTSAL;

  const handleUpdateRule = <K extends keyof SportRuleSettings>(field: K, value: SportRuleSettings[K]) => {
    setRulesState((prev) => ({
      ...prev,
      [selectedSport]: {
        ...prev[selectedSport],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetToDefault = () => {
    setRulesState(DEFAULT_SPORT_RULES);
    setWoScoreA(3);
    setLateToleranceMinutes(15);
    setBapVerificationMode('MANUAL');
    setAllowOvertimeInGroup(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Page Header */}
      <AdminPageHeaderCard
        icon={Swords}
        category="PENGATURAN • OPERASIONAL PERTANDINGAN"
        title="Pengaturan Pertandingan & Regulasi"
        description="Konfigurasi teknis cabang olahraga, durasi babak, skema perhitungan poin klasemen, penugasan perangkat wasit, serta protokol sanksi laga."
      />

      {/* Sub-tab Navigation Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-muted)]/80 border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('RULES')}
          className={`btn-tactile px-3.5 py-2 rounded-xl transition-all duration-150 flex items-center gap-1.5 ${
            activeTab === 'RULES'
              ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Aturan Cabor</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('OFFICIALS')}
          className={`btn-tactile px-3.5 py-2 rounded-xl transition-all duration-150 flex items-center gap-1.5 ${
            activeTab === 'OFFICIALS'
              ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <UserCog className="w-3.5 h-3.5" />
          <span>Penugasan Wasit</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('PROTOCOLS')}
          className={`btn-tactile px-3.5 py-2 rounded-xl transition-all duration-150 flex items-center gap-1.5 ${
            activeTab === 'PROTOCOLS'
              ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Protokol & WO</span>
        </button>
      </div>

      {/* Save Success Banner */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">Pengaturan pertandingan berhasil disimpan ke sistem arena!</span>
          </div>
        </div>
      )}

      {/* TAB 1: RULES & DURATION */}
      {activeTab === 'RULES' && (
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
      )}

      {/* TAB 2: REFEREE & OFFICIAL ASSIGNMENTS */}
      {activeTab === 'OFFICIALS' && (
        <div className="space-y-4">
          <MatchAssignmentsTab hideHeader />
        </div>
      )}

      {/* TAB 3: PROTOCOL & SANCTIONS */}
      {activeTab === 'PROTOCOLS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Walkover Settings */}
            <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <h3 className="font-barlow font-bold uppercase tracking-wider text-base text-[var(--text-main)]">
                  Ketentuan Walkover (WO)
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[var(--text-main)] block mb-1">
                    Skor Default Kemenangan WO
                  </label>
                  <p className="text-xs text-[var(--text-muted)] mb-3">
                    Skor otomatis yang diberikan kepada tim lawan saat sebuah tim dinyatakan Walkover (WO)
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--text-muted)]">Pemenang:</span>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={woScoreA}
                        onChange={(e) => setWoScoreA(Number(e.target.value))}
                        className="w-16 px-3 py-1.5 text-center text-sm font-bold rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-main)]"
                      />
                    </div>
                    <span className="text-sm font-bold text-[var(--text-muted)]">-</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--text-muted)]">Kalah WO:</span>
                      <input
                        type="number"
                        min="0"
                        max="0"
                        value={woScoreB}
                        disabled
                        className="w-16 px-3 py-1.5 text-center text-sm font-bold rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]/50 text-[var(--text-muted)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-semibold text-[var(--text-main)] block">
                        Toleransi Waktu Keterlambatan Tim
                      </label>
                      <span className="text-xs text-[var(--text-muted)]">
                        Batas toleransi hadir di lapangan sebelum dinyatakan WO
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="5"
                        max="60"
                        value={lateToleranceMinutes}
                        onChange={(e) => setLateToleranceMinutes(Number(e.target.value))}
                        className="w-16 px-2.5 py-1.5 text-center text-sm font-bold rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-main)]"
                      />
                      <span className="text-xs text-[var(--text-muted)] font-medium">Menit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BAP & Match Verification Mode */}
            <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
                <Scale className="w-5 h-5 text-[var(--color-arena-primary)]" />
                <h3 className="font-barlow font-bold uppercase tracking-wider text-base text-[var(--text-main)]">
                  Validasi Hasil &amp; Berita Acara (BAP)
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[var(--text-main)] block mb-2">
                    Metode Verifikasi Skor ke Publik
                  </label>
                  <div className="space-y-2.5">
                    <label
                      onClick={() => setBapVerificationMode('MANUAL')}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        bapVerificationMode === 'MANUAL'
                          ? 'border-[var(--color-arena-primary)] bg-[var(--color-arena-primary)]/5'
                          : 'border-[var(--border-subtle)] hover:border-[var(--border-subtle)]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="bapMode"
                        checked={bapVerificationMode === 'MANUAL'}
                        onChange={() => setBapVerificationMode('MANUAL')}
                        className="mt-1"
                      />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider block text-[var(--text-main)]">
                          Verifikasi Pengawas Manual (Disarankan)
                        </span>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          Hasil skor dari juri lapangan harus divalidasi dan ditandatangani Pengawas Pertandingan sebelum resmi masuk ke klasemen publik.
                        </p>
                      </div>
                    </label>

                    <label
                      onClick={() => setBapVerificationMode('AUTO')}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        bapVerificationMode === 'AUTO'
                          ? 'border-[var(--color-arena-primary)] bg-[var(--color-arena-primary)]/5'
                          : 'border-[var(--border-subtle)] hover:border-[var(--border-subtle)]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="bapMode"
                        checked={bapVerificationMode === 'AUTO'}
                        onChange={() => setBapVerificationMode('AUTO')}
                        className="mt-1"
                      />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider block text-[var(--text-main)]">
                          Publikasi Otomatis (Instant Publish)
                        </span>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          Skor langsung terverifikasi begitu juri menekan tombol &apos;Finalisasi BAP&apos; di konsol juri tanpa antrean moderasi.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-[var(--text-main)] block">
                      Babak Tambahan di Fase Grup
                    </label>
                    <span className="text-xs text-[var(--text-muted)]">
                      Perpanjangan waktu (Extra Time) jika skor imbang di babak grup
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowOvertimeInGroup}
                    onChange={(e) => setAllowOvertimeInGroup(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--color-arena-primary)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="btn-tactile px-6 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Protokol &amp; Kebijakan</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
