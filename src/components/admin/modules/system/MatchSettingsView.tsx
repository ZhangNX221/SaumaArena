'use client';

import React, { useState, useEffect } from 'react';
import {
  Swords,
  ShieldAlert,
  CheckCircle2,
  UserCog,
  Sliders,
  GitBranch,
  Database,
  Award,
  Calendar,
} from 'lucide-react';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';
import { MatchAssignmentsTab } from '../officials/MatchAssignmentsTab';
import { usePersistentState } from '@/hooks/usePersistentState';
import { SportRuleSettings, DEFAULT_SPORT_RULES } from '@/config/sportRules';
import { MatchRulesTab } from './MatchRulesTab';
import { MatchProtocolsTab } from './MatchProtocolsTab';
import { BracketSettingsTab } from './BracketSettingsTab';
import { MatchAssessmentSettingsTab } from './MatchAssessmentSettingsTab';
import { MatchScheduleSettingsTab } from './MatchScheduleSettingsTab';
import { SettingsBackupRestoreModal } from './SettingsBackupRestoreModal';

type SettingSubTab = 'RULES' | 'SCHEDULE' | 'BRACKET' | 'OFFICIALS' | 'PROTOCOLS' | 'ASSESSMENT';

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

  // Feedback toast & modal state
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState('Pengaturan pertandingan berhasil disimpan ke database SQLite!');
  const [isBackupRestoreOpen, setIsBackupRestoreOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Muat pengaturan dari database SQLite saat pertama kali dibuka
  useEffect(() => {
    let isMounted = true;
    const loadDbSettings = async () => {
      try {
        const res = await fetch(`/api/settings?sport=${selectedSport}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            if (json.data.sportRules) {
              setRulesState((prev) => ({ ...prev, ...json.data.sportRules }));
            }
            if (json.data.protocols) {
              setWoScoreA(json.data.protocols.woScoreA ?? 3);
              setLateToleranceMinutes(json.data.protocols.lateToleranceMinutes ?? 15);
              setBapVerificationMode(json.data.protocols.bapVerificationMode ?? 'MANUAL');
              setAllowOvertimeInGroup(Boolean(json.data.protocols.allowOvertimeInGroup));
            }
          }
        }
      } catch (e) {
        console.warn('Gagal memuat pengaturan database:', e);
      }
    };
    loadDbSettings();
    return () => { isMounted = false; };
  }, [selectedSport]);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let token: string | null = null;
      try { token = localStorage.getItem('sauma_auth_token'); } catch {}

      const protocols = {
        woScoreA,
        woScoreB,
        lateToleranceMinutes,
        bapVerificationMode,
        allowOvertimeInGroup,
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          sportCode: selectedSport.toLowerCase(),
          sportRules: rulesState,
          protocols,
          matchSettings: {
            periodCount: currentRules.periodCount,
            periodMinutesGroup: currentRules.durationPerPeriod,
            periodMinutesKnockout: currentRules.durationPerPeriod,
            halfTimeMinutes: currentRules.breakDuration,
            foulsLimit: currentRules.foulLimit,
            timeoutDurationSeconds: (currentRules.timeoutPerPeriod || 1) * 60,
            penaltyShootoutKicks: currentRules.penaltyKicksCount,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menyimpan ke database');
      }

      setToastMessage('Pengaturan pertandingan & aturan cabor berhasil disimpan permanen ke database SQLite!');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: any) {
      setToastMessage(err.message || 'Gagal menyimpan pengaturan ke database.');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setRulesState(DEFAULT_SPORT_RULES);
    setWoScoreA(3);
    setLateToleranceMinutes(15);
    setBapVerificationMode('MANUAL');
    setAllowOvertimeInGroup(false);
    handleSave();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Page Header */}
      <AdminPageHeaderCard
        icon={Swords}
        category="PENGATURAN • OPERASIONAL PERTANDINGAN"
        title="Pengaturan Pertandingan & Regulasi"
        description="Konfigurasi teknis cabang olahraga, skema jumlah bagan eliminasi, durasi babak, perhitungan poin, penugasan wasit, serta protokol sanksi laga."
        action={
          <button
            type="button"
            onClick={() => setIsBackupRestoreOpen(true)}
            className="btn-tactile px-3.5 py-2 rounded-xl bg-[var(--color-arena-primary-light)] border border-[var(--color-arena-primary)]/30 text-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary)] hover:text-white transition-all text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Cadangkan &amp; Pulihkan Settingan</span>
          </button>
        }
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
          onClick={() => setActiveTab('SCHEDULE')}
          className={`btn-tactile px-3.5 py-2 rounded-xl transition-all duration-150 flex items-center gap-1.5 ${
            activeTab === 'SCHEDULE'
              ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Jadwal Pertandingan</span>
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

        <button
          type="button"
          onClick={() => setActiveTab('ASSESSMENT')}
          className={`btn-tactile px-3.5 py-2 rounded-xl transition-all duration-150 flex items-center gap-1.5 ${
            activeTab === 'ASSESSMENT'
              ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Bobot Penilaian</span>
        </button>
      </div>

      {/* Save Success Banner */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
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

      {/* TAB: JADWAL PERTANDINGAN & RUNDOWN */}
      {activeTab === 'SCHEDULE' && <MatchScheduleSettingsTab />}

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

      {/* TAB 5: ASSESSMENT & SUPPORTER WEIGHTS */}
      {activeTab === 'ASSESSMENT' && <MatchAssessmentSettingsTab />}

      {/* Modal Backup & Restore Settingan */}
      <SettingsBackupRestoreModal
        isOpen={isBackupRestoreOpen}
        onClose={() => setIsBackupRestoreOpen(false)}
        onSettingsRestored={(data) => {
          if (data?.sportRules) {
            setRulesState(data.sportRules);
          }
          if (data?.protocols) {
            setWoScoreA(data.protocols.woScoreA ?? 3);
            setLateToleranceMinutes(data.protocols.lateToleranceMinutes ?? 15);
            setBapVerificationMode(data.protocols.bapVerificationMode ?? 'MANUAL');
            setAllowOvertimeInGroup(Boolean(data.protocols.allowOvertimeInGroup));
          }
        }}
      />
    </div>
  );
};
