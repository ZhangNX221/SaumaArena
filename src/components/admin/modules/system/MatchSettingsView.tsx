'use client';

import React, { useState } from 'react';
import {
  Swords,
  ShieldAlert,
  CheckCircle2,
  UserCog,
  Sliders,
  GitBranch,
} from 'lucide-react';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';
import { MatchAssignmentsTab } from '../officials/MatchAssignmentsTab';
import { usePersistentState } from '@/hooks/usePersistentState';
import { SportRuleSettings, DEFAULT_SPORT_RULES } from '@/config/sportRules';
import { MatchRulesTab } from './MatchRulesTab';
import { MatchProtocolsTab } from './MatchProtocolsTab';
import { BracketSettingsTab } from './BracketSettingsTab';

type SettingSubTab = 'RULES' | 'BRACKET' | 'OFFICIALS' | 'PROTOCOLS';

export const MatchSettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingSubTab>('RULES');
  const [selectedSport, setSelectedSport] = useState<string>('FUTSAL');
  const [rulesState, setRulesState] = usePersistentState<Record<string, SportRuleSettings>>(
    'sauma_arena_match_rules',
    DEFAULT_SPORT_RULES
  );

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
        description="Konfigurasi teknis cabang olahraga, skema jumlah bagan eliminasi, durasi babak, perhitungan poin, penugasan wasit, serta protokol sanksi laga."
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
          onClick={() => setActiveTab('BRACKET')}
          className={`btn-tactile px-3.5 py-2 rounded-xl transition-all duration-150 flex items-center gap-1.5 ${
            activeTab === 'BRACKET'
              ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>Pengaturan Bagan</span>
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
        <MatchRulesTab
          selectedSport={selectedSport}
          setSelectedSport={setSelectedSport}
          currentRules={currentRules}
          handleUpdateRule={handleUpdateRule}
          handleResetToDefault={handleResetToDefault}
          handleSave={handleSave}
        />
      )}

      {/* TAB 2: BRACKET SETTINGS (24, 16, 8, 4, 2 BESAR) */}
      {activeTab === 'BRACKET' && <BracketSettingsTab />}

      {/* TAB 3: REFEREE & OFFICIAL ASSIGNMENTS */}
      {activeTab === 'OFFICIALS' && (
        <div className="space-y-4">
          <MatchAssignmentsTab hideHeader />
        </div>
      )}

      {/* TAB 4: PROTOCOL & SANCTIONS */}
      {activeTab === 'PROTOCOLS' && (
        <MatchProtocolsTab
          woScoreA={woScoreA}
          setWoScoreA={setWoScoreA}
          woScoreB={woScoreB}
          lateToleranceMinutes={lateToleranceMinutes}
          setLateToleranceMinutes={setLateToleranceMinutes}
          bapVerificationMode={bapVerificationMode}
          setBapVerificationMode={setBapVerificationMode}
          allowOvertimeInGroup={allowOvertimeInGroup}
          setAllowOvertimeInGroup={setAllowOvertimeInGroup}
          handleSave={handleSave}
        />
      )}
    </div>
  );
};
