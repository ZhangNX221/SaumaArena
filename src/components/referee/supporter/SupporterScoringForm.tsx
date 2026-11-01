'use client';

import React, { useState } from 'react';
import {
  Users,
  Save,
  RotateCcw,
} from 'lucide-react';
import { Team, SupporterAssessment } from '@/types';
import { getTeamCode } from '@/mocks/tournamentData';
import { getTeamLogoUrl } from '@/mocks/teamLogos';
import { SupporterCriteriaPositive } from './SupporterCriteriaPositive';
import { SupporterCriteriaPenalty } from './SupporterCriteriaPenalty';

interface SupporterScoringFormProps {
  teams: Team[];
  selectedTeamId: string;
  onSelectTeamId: (id: string) => void;
  juryName: string;
  onSubmit: (assessment: Omit<SupporterAssessment, 'id' | 'createdAt'>) => void;
  recordedSessionsCount: number;
}

export const SupporterScoringForm: React.FC<SupporterScoringFormProps> = ({
  teams,
  selectedTeamId,
  onSelectTeamId,
  juryName,
  onSubmit,
  recordedSessionsCount,
}) => {
  // Form Kriteria Positif
  const [choreography, setChoreography] = useState<boolean>(false);
  const [schoolMascot, setSchoolMascot] = useState<boolean>(false);
  const [supporterUniform, setSupporterUniform] = useState<boolean>(false);
  const [cheerMin3Chants, setCheerMin3Chants] = useState<boolean>(false);
  const [checkedInTickets, setCheckedInTickets] = useState<number>(0);

  // Form Kriteria Penalti
  const [incidentViolentChaos, setIncidentViolentChaos] = useState<boolean>(false);
  const [incidentThrowObjects, setIncidentThrowObjects] = useState<boolean>(false);
  const [incidentRacismProvocation, setIncidentRacismProvocation] = useState<boolean>(false);
  const [incidentSmuggleContraband, setIncidentSmuggleContraband] = useState<boolean>(false);
  const [incidentLitteringTribun, setIncidentLitteringTribun] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  const selectedTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];

  // Kalkulasi Skor Real-Time
  const positiveScore =
    (choreography ? 25 : 0) +
    (schoolMascot ? 20 : 0) +
    (supporterUniform ? 15 : 0) +
    (cheerMin3Chants ? 10 : 0) +
    (checkedInTickets > 0 ? 1 : 0);

  const penaltyScore =
    (incidentViolentChaos ? 50 : 0) +
    (incidentThrowObjects ? 25 : 0) +
    (incidentRacismProvocation ? 15 : 0) +
    (incidentSmuggleContraband ? 5 : 0) +
    (incidentLitteringTribun ? 1 : 0);

  const totalScore = positiveScore - penaltyScore;

  const handleResetForm = () => {
    setChoreography(false);
    setSchoolMascot(false);
    setSupporterUniform(false);
    setCheerMin3Chants(false);
    setCheckedInTickets(0);
    setIncidentViolentChaos(false);
    setIncidentThrowObjects(false);
    setIncidentRacismProvocation(false);
    setIncidentSmuggleContraband(false);
    setIncidentLitteringTribun(false);
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      matchId: 'TRIBUN',
      teamId: selectedTeamId,
      schoolName: selectedTeam.schoolName || selectedTeam.name,
      choreography,
      schoolMascot,
      supporterUniform,
      cheerMin3Chants,
      checkedInTickets: Math.max(0, checkedInTickets),
      incidentViolentChaos,
      incidentThrowObjects,
      incidentRacismProvocation,
      incidentSmuggleContraband,
      incidentLitteringTribun,
      notes: notes.trim(),
      juryName,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Kolom Kiri: Form Input Kriteria (8 cols) */}
      <div className="lg:col-span-8 space-y-5">
        {/* Selector Suporter Madrasah */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--color-arena-primary)]" />
              <span>1. Pilih Kontingen Suporter Madrasah</span>
            </div>
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] border border-[var(--color-arena-primary)]/20">
              Penilaian Mandiri Berbasis Kontingen
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-barlow font-bold uppercase text-[var(--text-muted)] block">
                Pilih Suporter Sekolah / Madrasah:
              </label>
              <span className="text-[10px] font-mono text-[var(--color-arena-primary)] font-bold">
                Kode ID: TM-01 s/d TM-14
              </span>
            </div>
            <select
              value={selectedTeamId}
              onChange={(e) => {
                onSelectTeamId(e.target.value);
                handleResetForm();
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-main)] cursor-pointer focus:outline-none focus:border-[var(--color-arena-primary)] font-mono"
            >
              {teams.map((t, idx) => {
                const code = getTeamCode(t, idx);
                return (
                  <option key={t.id} value={t.id}>
                    [{code}] {t.name} — {t.schoolName} ({t.city})
                  </option>
                );
              })}
            </select>

            {/* Quick Select ID Khusus Chips */}
            <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] mr-1">
                Pilih Cepat ID:
              </span>
              {teams.map((t, idx) => {
                const code = getTeamCode(t, idx);
                const isSelected = t.id === selectedTeamId;
                return (
                  <button
                    key={`btn-chip-${t.id}`}
                    type="button"
                    onClick={() => {
                      onSelectTeamId(t.id);
                      handleResetForm();
                    }}
                    className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--color-arena-primary)] text-white shadow-xs ring-2 ring-[var(--color-arena-primary)]/40 scale-105'
                        : 'bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--color-arena-primary)]'
                    }`}
                    title={`${t.name} (${t.schoolName})`}
                  >
                    {code}
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] text-[var(--text-muted)] mt-1.5">
              Poin dinilai dan diakumulasikan langsung untuk kontingen suporter madrasah ini.
            </p>
          </div>

          {/* Kartu Profil Suporter Terpilih */}
          {selectedTeam && (
            <div className="p-3.5 rounded-xl bg-[var(--bg-muted)]/70 border border-[var(--border-subtle)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={selectedTeam.logoUrl || getTeamLogoUrl(selectedTeam.id)}
                    alt={selectedTeam.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--color-arena-primary)] text-white font-black shadow-2xs">
                      {getTeamCode(selectedTeam)}
                    </span>
                    <span className="font-barlow font-bold text-sm uppercase text-[var(--text-main)]">
                      {selectedTeam.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] font-bold">
                      Grup {selectedTeam.group || '-'}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {selectedTeam.schoolName} &bull; {selectedTeam.city}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 hidden sm:block">
                <span className="text-[10px] font-barlow font-bold uppercase text-[var(--text-muted)] block">
                  Penilaian Tercatat
                </span>
                <span className="font-mono text-xs font-bold text-[var(--text-main)]">
                  {recordedSessionsCount} Sesi Masuk
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Kriteria Positif (Bonus Poin) */}
        <SupporterCriteriaPositive
          choreography={choreography}
          setChoreography={setChoreography}
          schoolMascot={schoolMascot}
          setSchoolMascot={setSchoolMascot}
          supporterUniform={supporterUniform}
          setSupporterUniform={setSupporterUniform}
          cheerMin3Chants={cheerMin3Chants}
          setCheerMin3Chants={setCheerMin3Chants}
          checkedInTickets={checkedInTickets}
          setCheckedInTickets={setCheckedInTickets}
          positiveScore={positiveScore}
        />

        {/* Kriteria Pelanggaran / Sanksi (Pengurangan Poin) */}
        <SupporterCriteriaPenalty
          incidentViolentChaos={incidentViolentChaos}
          setIncidentViolentChaos={setIncidentViolentChaos}
          incidentThrowObjects={incidentThrowObjects}
          setIncidentThrowObjects={setIncidentThrowObjects}
          incidentRacismProvocation={incidentRacismProvocation}
          setIncidentRacismProvocation={setIncidentRacismProvocation}
          incidentSmuggleContraband={incidentSmuggleContraband}
          setIncidentSmuggleContraband={setIncidentSmuggleContraband}
          incidentLitteringTribun={incidentLitteringTribun}
          setIncidentLitteringTribun={setIncidentLitteringTribun}
          penaltyScore={penaltyScore}
        />

        {/* Catatan Khusus Juri */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2 shadow-xs">
          <label className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
            Catatan Khusus Juri (Opsional):
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan tambahan mengenai perilaku suporter, koreografi, atau kejadian di tribun..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Kolom Kanan: Rangkuman Skor & Tombol Simpan (4 cols) */}
      <div className="lg:col-span-4 space-y-5">
        <div className="sticky top-20 p-5 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--color-arena-primary)]/40 space-y-4 shadow-md">
          <div>
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-primary)] block">
              Kalkulasi Poin Suporter
            </span>
            <h3 className="font-bebas text-xl text-[var(--text-main)] uppercase tracking-wide">
              Total Perolehan Skor
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-center space-y-1">
            <span className="text-[11px] font-barlow font-bold uppercase text-[var(--text-muted)]">
              Skor Sesi Suporter
            </span>
            <div className="font-teko text-5xl font-bold text-[var(--color-arena-primary)] leading-none">
              {totalScore}
            </div>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">
              +{positiveScore} (Positif) - {penaltyScore} (Sanksi)
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-[var(--text-muted)]">
              <span>Koreografi</span>
              <span className="font-mono font-bold text-[var(--text-main)]">
                {choreography ? '+25' : '0'}
              </span>
            </div>
            <div className="flex justify-between text-[var(--text-muted)]">
              <span>Maskot Sekolah</span>
              <span className="font-mono font-bold text-[var(--text-main)]">
                {schoolMascot ? '+20' : '0'}
              </span>
            </div>
            <div className="flex justify-between text-[var(--text-muted)]">
              <span>Seragam / Atribut</span>
              <span className="font-mono font-bold text-[var(--text-main)]">
                {supporterUniform ? '+15' : '0'}
              </span>
            </div>
            <div className="flex justify-between text-[var(--text-muted)]">
              <span>Yel-yel (Min. 3)</span>
              <span className="font-mono font-bold text-[var(--text-main)]">
                {cheerMin3Chants ? '+10' : '0'}
              </span>
            </div>
            <div className="flex justify-between text-[var(--text-muted)]">
              <span>Kehadiran (+1 / match)</span>
              <span className="font-mono font-bold text-[var(--text-main)]">
                +{checkedInTickets > 0 ? 1 : 0}
              </span>
            </div>
            <div className="flex justify-between text-red-600 pt-1 border-t border-[var(--border-subtle)] font-bold">
              <span>Total Penalti</span>
              <span className="font-mono">-{penaltyScore}</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="btn-tactile w-full py-3 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] active:scale-95 text-white font-barlow font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Skor Suporter</span>
            </button>
            <button
              type="button"
              onClick={handleResetForm}
              className="btn-tactile w-full py-2 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)] font-barlow font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Isian Form</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
