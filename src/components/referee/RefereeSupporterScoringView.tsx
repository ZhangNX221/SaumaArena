'use client';

import React, { useState } from 'react';
import { Megaphone, CheckCircle2 } from 'lucide-react';
import { Match, AppUser, SupporterAssessment, Team, STORAGE_KEY_TEAMS } from '@/types';
import { initialTeams, initialSupporterAssessments } from '@/mocks/tournamentData';
import { usePersistentState } from '@/hooks/usePersistentState';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';
import { pushSupporterScoreToBackend } from '@/lib/apiSync';
import { SupporterScoringForm } from './supporter/SupporterScoringForm';
import { SupporterScoringHistoryTable } from './supporter/SupporterScoringHistoryTable';

interface RefereeSupporterScoringViewProps {
  user?: AppUser;
  currentMatch?: Match;
}

export const RefereeSupporterScoringView: React.FC<RefereeSupporterScoringViewProps> = ({
  user,
}) => {
  const [assessments, setAssessments] = usePersistentState<SupporterAssessment[]>(
    'sauma_arena_supporter_scores',
    initialSupporterAssessments
  );
  const [teams] = usePersistentState<Team[]>(STORAGE_KEY_TEAMS, initialTeams);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || 'team-sdi-kardina');
  const [notice, setNotice] = useState<string | null>(null);

  // Sinkronkan data skor suporter dengan rekapitulasi data kriteria resmi turnamen MMFC I
  React.useEffect(() => {
    if (!assessments || assessments.length === 0 || !assessments.some((a) => a.teamId === 'team-min14-blitar')) {
      setAssessments(initialSupporterAssessments);
    }
  }, [assessments, setAssessments]);

  const handleSaveAssessment = (data: Omit<SupporterAssessment, 'id' | 'createdAt'>) => {
    const newAssessment: SupporterAssessment = {
      ...data,
      id: `SUP-${Date.now()}`,
      createdAt:
        new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };

    setAssessments((prev) => [newAssessment, ...prev]);
    initialSupporterAssessments.unshift(newAssessment);
    pushSupporterScoreToBackend(newAssessment);

    setNotice(`Skor suporter untuk ${data.schoolName} berhasil disimpan!`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleDeleteAssessment = (id: string) => {
    setAssessments((prev) => prev.filter((a) => a.id !== id));
    const idx = initialSupporterAssessments.findIndex((a) => a.id === id);
    if (idx !== -1) initialSupporterAssessments.splice(idx, 1);
  };

  const recordedCount = assessments.filter((a) => a.teamId === selectedTeamId).length;

  return (
    <div className="space-y-6 w-full pb-16 animate-fadeIn select-none">
      {/* 1. Header Card Seragam */}
      <AdminPageHeaderCard
        icon={Megaphone}
        category="MEJA LAPANGAN • PENILAIAN TRIBUN SUPORTER"
        title="Form Penilaian & Skor Suporter Madrasah"
        description="Catat poin sportivitas, maskot, atribut, yel-yel, dan sanksi pelanggaran suporter tiap tim sekolah untuk menentukan predikat Best Supporter MMFC I."
        action={
          <div className="p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-center min-w-[100px]">
            <span className="text-[10px] text-[var(--text-muted)] font-barlow font-bold uppercase block">
              Total Penilaian
            </span>
            <span className="font-teko text-2xl font-bold text-[var(--color-arena-primary)] leading-none">
              {assessments.length} <span className="text-xs font-sans font-normal text-[var(--text-muted)]">Data</span>
            </span>
          </div>
        }
      />

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-barlow font-bold uppercase tracking-wide flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{notice}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-xs underline hover:no-underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 2. Form Penilaian Grid */}
      <SupporterScoringForm
        teams={teams}
        selectedTeamId={selectedTeamId}
        onSelectTeamId={setSelectedTeamId}
        juryName={user?.name || 'Juri Meja Lapangan'}
        onSubmit={handleSaveAssessment}
        recordedSessionsCount={recordedCount}
      />

      {/* 3. Tabel Riwayat Penilaian Suporter */}
      <SupporterScoringHistoryTable
        assessments={assessments}
        onDeleteAssessment={handleDeleteAssessment}
      />
    </div>
  );
};
