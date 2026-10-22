'use client';

import React, { useState } from 'react';
import { initialMatches, initialTeams } from '@/mocks/tournamentData';
import { Award, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const SupporterJuryTab: React.FC = () => {
  const [selectedJuriMatch, setSelectedJuriMatch] = useState('match-103');
  const [selectedJuriSchool, setSelectedJuriSchool] = useState(initialTeams[0].id);
  const [juriKoreo, setJuriKoreo] = useState(true);
  const [juriMaskot, setJuriMaskot] = useState(false);
  const [juriSeragam, setJuriSeragam] = useState(true);
  const [juriYelyel, setJuriYelyel] = useState(true);
  const [juriPenaltiRusuh, setJuriPenaltiRusuh] = useState(false);
  const [juriPenaltiLempar, setJuriPenaltiLempar] = useState(false);
  const [juriPenaltiRasis, setJuriPenaltiRasis] = useState(false);
  const [juriPenaltiBarang, setJuriPenaltiBarang] = useState(false);
  const [juriNotes, setJuriNotes] = useState('');
  const [juriSavedNotice, setJuriSavedNotice] = useState(false);

  // Live dynamic calculation of net points
  const positiveScore =
    (juriKoreo ? 25 : 0) +
    (juriMaskot ? 20 : 0) +
    (juriSeragam ? 15 : 0) +
    (juriYelyel ? 10 : 0);

  const penaltyScore =
    (juriPenaltiRusuh ? 50 : 0) +
    (juriPenaltiLempar ? 25 : 0) +
    (juriPenaltiRasis ? 15 : 0) +
    (juriPenaltiBarang ? 5 : 0);

  const netScore = positiveScore - penaltyScore;

  const handleSaveJuri = (e: React.FormEvent) => {
    e.preventDefault();
    setJuriSavedNotice(true);
    setTimeout(() => setJuriSavedNotice(false), 3000);
  };

  return (
    <form onSubmit={handleSaveJuri} className="p-5 sm:p-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-[var(--text-main)] font-[var(--font-display)]">
            Penilaian Suporter Tribun oleh Dewan Juri
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Catat penilaian aksi koreografi, atribut, yel-yel sekolah, serta sanksi pelanggaran ketertiban penonton.
          </p>
        </div>
        {juriSavedNotice && (
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] animate-fadeIn flex items-center gap-1.5 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[var(--color-arena-primary)]" />
            <span>Nilai suporter berhasil disimpan &amp; diterbitkan!</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
            Pilih Pertandingan
          </label>
          <select
            value={selectedJuriMatch}
            onChange={(e) => setSelectedJuriMatch(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
          >
            {initialMatches.map((m) => (
              <option key={m.id} value={m.id}>
                #{m.matchNumber} {m.teamAName} vs {m.teamBName} ({m.courtName})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
            Pilih Kontingen Sekolah Suporter
          </label>
          <select
            value={selectedJuriSchool}
            onChange={(e) => setSelectedJuriSchool(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
          >
            {initialTeams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.schoolName} ({t.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Checklist Kriteria Apresiasi (+) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-arena-primary)] flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>Kriteria Apresiasi &amp; Kreativitas Suporter (+)</span>
          </h4>
          <span className="text-xs font-mono font-bold text-[var(--color-arena-primary)]">
            +{positiveScore} Poin
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] cursor-pointer hover:border-[var(--color-arena-primary)]/40 transition-colors">
            <input
              type="checkbox"
              checked={juriKoreo}
              onChange={(e) => setJuriKoreo(e.target.checked)}
              className="w-4 h-4 rounded text-[var(--color-arena-primary)]"
            />
            <span className="font-semibold text-[var(--text-main)]">Menampilkan koreografi tribun (+25)</span>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] cursor-pointer hover:border-[var(--color-arena-primary)]/40 transition-colors">
            <input
              type="checkbox"
              checked={juriMaskot}
              onChange={(e) => setJuriMaskot(e.target.checked)}
              className="w-4 h-4 rounded text-[var(--color-arena-primary)]"
            />
            <span className="font-semibold text-[var(--text-main)]">Menghadirkan maskot resmi sekolah (+20)</span>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] cursor-pointer hover:border-[var(--color-arena-primary)]/40 transition-colors">
            <input
              type="checkbox"
              checked={juriSeragam}
              onChange={(e) => setJuriSeragam(e.target.checked)}
              className="w-4 h-4 rounded text-[var(--color-arena-primary)]"
            />
            <span className="font-semibold text-[var(--text-main)]">Kekompakan seragam suporter (+15)</span>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] cursor-pointer hover:border-[var(--color-arena-primary)]/40 transition-colors">
            <input
              type="checkbox"
              checked={juriYelyel}
              onChange={(e) => setJuriYelyel(e.target.checked)}
              className="w-4 h-4 rounded text-[var(--color-arena-primary)]"
            />
            <span className="font-semibold text-[var(--text-main)]">Menyanyikan minimal 3 yel-yel sportif (+10)</span>
          </label>
        </div>
      </div>

      {/* Checklist Sanksi Pelanggaran (-) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Sanksi Pelanggaran Ketertiban &amp; Disiplin (-)</span>
          </h4>
          <span className="text-xs font-mono font-bold text-red-600">
            -{penaltyScore} Poin
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 cursor-pointer text-red-900 dark:text-red-300">
            <input
              type="checkbox"
              checked={juriPenaltiRusuh}
              onChange={(e) => setJuriPenaltiRusuh(e.target.checked)}
              className="w-4 h-4 rounded text-red-600"
            />
            <span className="font-semibold">Memicu kericuhan atau tindakan anarkis (-50)</span>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 cursor-pointer text-red-900 dark:text-red-300">
            <input
              type="checkbox"
              checked={juriPenaltiLempar}
              onChange={(e) => setJuriPenaltiLempar(e.target.checked)}
              className="w-4 h-4 rounded text-red-600"
            />
            <span className="font-semibold">Melempar botol/benda ke lapangan (-25)</span>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 cursor-pointer text-red-900 dark:text-red-300">
            <input
              type="checkbox"
              checked={juriPenaltiRasis}
              onChange={(e) => setJuriPenaltiRasis(e.target.checked)}
              className="w-4 h-4 rounded text-red-600"
            />
            <span className="font-semibold">Ujaran kebencian, rasisme, atau provokasi (-15)</span>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 cursor-pointer text-red-900 dark:text-red-300">
            <input
              type="checkbox"
              checked={juriPenaltiBarang}
              onChange={(e) => setJuriPenaltiBarang(e.target.checked)}
              className="w-4 h-4 rounded text-red-600"
            />
            <span className="font-semibold">Membawa petasan, flare, atau benda terlarang (-5)</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
          Catatan Evaluasi Juri Tribun
        </label>
        <textarea
          rows={2}
          value={juriNotes}
          onChange={(e) => setJuriNotes(e.target.value)}
          placeholder="Tuliskan catatan apresiasi kekompakan suporter atau kronologi jika ada pelanggaran..."
          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
        />
      </div>

      {/* Footer Submission with Live Score Tally */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[var(--text-muted)]">Hasil Kalkulasi Poin Laga Ini:</span>
          <span
            className={`font-mono font-black text-sm px-2.5 py-1 rounded-lg ${
              netScore > 0
                ? 'bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)]'
                : netScore < 0
                ? 'bg-red-500/10 text-red-600'
                : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            {netScore > 0 ? `+${netScore}` : netScore} Poin
          </span>
        </div>

        <button
          type="submit"
          className="btn-tactile px-6 py-2.5 rounded-xl bg-[var(--color-arena-accent)] hover:bg-[var(--color-arena-accent-hover)] text-slate-950 font-black text-xs sm:text-sm shadow-xs transition-all min-h-[42px]"
        >
          Simpan Nilai Pertandingan
        </button>
      </div>
    </form>
  );
};
