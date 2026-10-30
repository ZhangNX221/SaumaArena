'use client';

import React, { useState } from 'react';
import {
  Megaphone,
  CheckCircle2,
  RotateCcw,
  Trash2,
  Save,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react';
import { Match, AppUser, SupporterAssessment, Team } from '@/types';
import { initialTeams, initialSupporterAssessments } from '@/mocks/tournamentData';
import { getTeamLogoUrl } from '@/mocks/teamLogos';
import { usePersistentState } from '@/hooks/usePersistentState';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';
import { pushSupporterScoreToBackend } from '@/lib/apiSync';

interface RefereeSupporterScoringViewProps {
  user?: AppUser;
  currentMatch?: Match;
}

export const RefereeSupporterScoringView: React.FC<RefereeSupporterScoringViewProps> = ({
  user,
}) => {
  const [assessments, setAssessments] = usePersistentState<SupporterAssessment[]>('sauma_arena_supporter_scores', initialSupporterAssessments);
  const [teams] = usePersistentState<Team[]>('sauma_arena_teams', initialTeams);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || 'team-sdi-kardina');
  const [notice, setNotice] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

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

  // Tim suporter terpilih
  const selectedTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];

  // Kalkulasi Skor Real-Time
  const positiveScore =
    (choreography ? 25 : 0) +
    (schoolMascot ? 20 : 0) +
    (supporterUniform ? 15 : 0) +
    (cheerMin3Chants ? 10 : 0) +
    (checkedInTickets > 0 ? 1 : 0); // Aturan Penilaian Suporter: +1 / match

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

  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    const teamMeta = selectedTeam;

    const newAssessment: SupporterAssessment = {
      id: `SUP-${Date.now()}`,
      matchId: 'TRIBUN',
      teamId: selectedTeamId,
      schoolName: teamMeta.schoolName || teamMeta.name,
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
      juryName: user?.name || 'Juri Meja Lapangan',
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };

    setAssessments((prev) => [newAssessment, ...prev]);
    initialSupporterAssessments.unshift(newAssessment);
    pushSupporterScoreToBackend(newAssessment);

    setNotice(`Skor suporter untuk ${teamMeta.name} berhasil disimpan (${totalScore} Poin)!`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleDeleteAssessment = (id: string) => {
    setAssessments((prev) => prev.filter((a) => a.id !== id));
    const idx = initialSupporterAssessments.findIndex((a) => a.id === id);
    if (idx !== -1) initialSupporterAssessments.splice(idx, 1);
  };

  const filteredAssessments = assessments.filter((a) =>
    a.schoolName.toLowerCase().includes(searchFilter.toLowerCase())
  );

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
          <button type="button" onClick={() => setNotice(null)} className="text-xs underline hover:no-underline cursor-pointer">
            Tutup
          </button>
        </div>
      )}

      {/* 2. Form Penilaian Grid */}
      <form onSubmit={handleSaveAssessment} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
              <label className="text-[11px] font-barlow font-bold uppercase text-[var(--text-muted)] block mb-1">
                Pilih Suporter Sekolah / Madrasah:
              </label>
              <select
                value={selectedTeamId}
                onChange={(e) => { setSelectedTeamId(e.target.value); handleResetForm(); }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-main)] cursor-pointer focus:outline-none focus:border-[var(--color-arena-primary)]"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.schoolName} ({t.city})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-[var(--text-muted)] mt-1">
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
                    {assessments.filter((a) => a.teamId === selectedTeam.id).length} Sesi Masuk
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Kriteria Positif (Bonus Poin) */}
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-barlow font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>2. Kriteria Positif &amp; Kreativitas (Bonus)</span>
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Total Positif: +{positiveScore}</span>
            </div>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] cursor-pointer transition-all">
                <div className="space-y-0.5">
                  <span className="font-barlow font-bold text-xs uppercase text-[var(--text-main)] block">
                    Koreografi Tribun
                  </span>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Kreativitas visual, mozaik kertas/kain, formasi banner terkoordinasi rapi.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-emerald-600">+25</span>
                  <input
                    type="checkbox"
                    checked={choreography}
                    onChange={(e) => setChoreography(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--color-arena-primary)] focus:ring-0 cursor-pointer"
                  />
                </div>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] cursor-pointer transition-all">
                <div className="space-y-0.5">
                  <span className="font-barlow font-bold text-xs uppercase text-[var(--text-main)] block">
                    Maskot Sekolah
                  </span>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Kehadiran maskot berkostum aktif memandu dan menyemangati suporter di tribun.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-emerald-600">+20</span>
                  <input
                    type="checkbox"
                    checked={schoolMascot}
                    onChange={(e) => setSchoolMascot(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--color-arena-primary)] focus:ring-0 cursor-pointer"
                  />
                </div>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] cursor-pointer transition-all">
                <div className="space-y-0.5">
                  <span className="font-barlow font-bold text-xs uppercase text-[var(--text-main)] block">
                    Keseragaman Seragam / Atribut
                  </span>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Suporter mengenakan pakaian, kaos sekolah, atau atribut warna serasi.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-emerald-600">+15</span>
                  <input
                    type="checkbox"
                    checked={supporterUniform}
                    onChange={(e) => setSupporterUniform(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--color-arena-primary)] focus:ring-0 cursor-pointer"
                  />
                </div>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] cursor-pointer transition-all">
                <div className="space-y-0.5">
                  <span className="font-barlow font-bold text-xs uppercase text-[var(--text-main)] block">
                    Yel-Yel Semangat Positif (Min. 3 Lagu)
                  </span>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Bernyanyi teratur sepanjang laga tanpa kata kasar atau provokasi.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-emerald-600">+10</span>
                  <input
                    type="checkbox"
                    checked={cheerMin3Chants}
                    onChange={(e) => setCheerMin3Chants(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--color-arena-primary)] focus:ring-0 cursor-pointer"
                  />
                </div>
              </label>

              {/* Aturan Penilaian Suporter: Kehadiran (+1 / match) */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)]">
                <div className="space-y-0.5">
                  <span className="font-barlow font-bold text-xs uppercase text-[var(--text-main)] block">
                    Penilaian Kehadiran Suporter (+1 / match)
                  </span>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Diberikan +1 poin per pertandingan (match) yang dihadiri oleh rombongan suporter madrasah.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-emerald-600">+1 / match</span>
                  <input
                    type="checkbox"
                    checked={checkedInTickets > 0}
                    onChange={(e) => setCheckedInTickets(e.target.checked ? 1 : 0)}
                    className="w-4 h-4 rounded text-[var(--color-arena-primary)] focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kriteria Pelanggaran / Sanksi (Pengurangan Poin) */}
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-red-500/20 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-barlow font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>3. Sanksi &amp; Pelanggaran Suporter (Penalti)</span>
              </span>
              <span className="text-[10px] text-red-600 font-mono font-bold">Total Sanksi: -{penaltyScore}</span>
            </div>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 cursor-pointer transition-all">
                <span className="text-xs font-barlow font-bold uppercase text-red-700 dark:text-red-300">
                  Kericuhan / Perkelahian Fisik Anarkis
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-red-600">-50</span>
                  <input
                    type="checkbox"
                    checked={incidentViolentChaos}
                    onChange={(e) => setIncidentViolentChaos(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-0 cursor-pointer"
                  />
                </div>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 cursor-pointer transition-all">
                <span className="text-xs font-barlow font-bold uppercase text-red-700 dark:text-red-300">
                  Melempar Benda ke Arah Lapangan
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-red-600">-25</span>
                  <input
                    type="checkbox"
                    checked={incidentThrowObjects}
                    onChange={(e) => setIncidentThrowObjects(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-0 cursor-pointer"
                  />
                </div>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 cursor-pointer transition-all">
                <span className="text-xs font-barlow font-bold uppercase text-red-700 dark:text-red-300">
                  Ujaran Rasisme / Provokasi Anarkis
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-red-600">-15</span>
                  <input
                    type="checkbox"
                    checked={incidentRacismProvocation}
                    onChange={(e) => setIncidentRacismProvocation(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-0 cursor-pointer"
                  />
                </div>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 cursor-pointer transition-all">
                <span className="text-xs font-barlow font-bold uppercase text-red-700 dark:text-red-300">
                  Penyelundupan Flare / Smoke Bomb
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-red-600">-5</span>
                  <input
                    type="checkbox"
                    checked={incidentSmuggleContraband}
                    onChange={(e) => setIncidentSmuggleContraband(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-0 cursor-pointer"
                  />
                </div>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 cursor-pointer transition-all">
                <span className="text-xs font-barlow font-bold uppercase text-red-700 dark:text-red-300">
                  Membuang Sampah Sembarangan di Tribun
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-red-600">-1</span>
                  <input
                    type="checkbox"
                    checked={incidentLitteringTribun}
                    onChange={(e) => setIncidentLitteringTribun(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-0 cursor-pointer"
                  />
                </div>
              </label>
            </div>
          </div>

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
                <span className="font-mono font-bold text-[var(--text-main)]">{choreography ? '+25' : '0'}</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Maskot Sekolah</span>
                <span className="font-mono font-bold text-[var(--text-main)]">{schoolMascot ? '+20' : '0'}</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Seragam / Atribut</span>
                <span className="font-mono font-bold text-[var(--text-main)]">{supporterUniform ? '+15' : '0'}</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Yel-yel (Min. 3)</span>
                <span className="font-mono font-bold text-[var(--text-main)]">{cheerMin3Chants ? '+10' : '0'}</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Kehadiran (+1 / match)</span>
                <span className="font-mono font-bold text-[var(--text-main)]">+{checkedInTickets > 0 ? 1 : 0}</span>
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

      {/* 3. Tabel Riwayat Penilaian Suporter */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-primary)] block">
              Rekapitulasi Input Lapangan
            </span>
            <h3 className="font-bebas text-lg sm:text-xl text-[var(--text-main)] uppercase tracking-wide">
              Riwayat Penilaian Suporter oleh Juri
            </h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Cari nama madrasah / tim..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none"
            />
          </div>
        </div>

        {filteredAssessments.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-[var(--bg-muted)]/40 border border-dashed border-[var(--border-subtle)] text-[var(--text-muted)] space-y-1">
            <Megaphone className="w-8 h-8 text-[var(--text-faint)] mx-auto mb-2" />
            <span className="font-barlow font-bold text-xs uppercase block">Belum Ada Penilaian Suporter Masuk</span>
            <p className="text-[11px]">Gunakan formulir di atas untuk mencatat poin suporter kontingen madrasah.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="py-2.5 px-3">Madrasah / Tim Suporter</th>
                  <th className="py-2.5 px-3 text-center">Bonus (+Poin)</th>
                  <th className="py-2.5 px-3 text-center">Sanksi (-Poin)</th>
                  <th className="py-2.5 px-3 text-center">Total Skor</th>
                  <th className="py-2.5 px-3">Waktu &amp; Juri</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredAssessments.map((a) => {
                  const bonus =
                    (a.choreography ? 25 : 0) +
                    (a.schoolMascot ? 20 : 0) +
                    (a.supporterUniform ? 15 : 0) +
                    (a.cheerMin3Chants ? 10 : 0) +
                    (a.checkedInTickets ? 1 : 0);

                  const pen =
                    (a.incidentViolentChaos ? 50 : 0) +
                    (a.incidentThrowObjects ? 25 : 0) +
                    (a.incidentRacismProvocation ? 15 : 0) +
                    (a.incidentSmuggleContraband ? 5 : 0) +
                    (a.incidentLitteringTribun ? 1 : 0);

                  const total = bonus - pen;

                  return (
                    <tr key={a.id} className="hover:bg-[var(--bg-muted)]/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={getTeamLogoUrl(a.teamId)}
                            alt={a.schoolName}
                            className="w-5 h-5 rounded-xs object-contain shrink-0"
                          />
                          <span className="font-barlow font-bold text-xs text-[var(--text-main)]">
                            {a.schoolName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">
                        +{bonus}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-red-600">
                        {pen > 0 ? `-${pen}` : '0'}
                      </td>
                      <td className="py-3 px-3 text-center font-teko font-bold text-xl text-[var(--color-arena-primary)] leading-none">
                        {total}
                      </td>
                      <td className="py-3 px-3 text-[11px] text-[var(--text-muted)]">
                        <div>{a.createdAt}</div>
                        <div className="text-[10px] text-[var(--text-faint)] font-mono">{a.juryName}</div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteAssessment(a.id)}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-500/10 active:scale-90 transition-all cursor-pointer"
                          title="Hapus penilaian"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
