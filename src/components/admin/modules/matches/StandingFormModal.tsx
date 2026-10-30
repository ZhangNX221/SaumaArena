'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Minus,
  Trophy,
  Calculator,
  ShieldCheck,
  Sparkles,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import { StandingRow } from '@/types';
import { ModalPortal } from '@/components/common/ModalPortal';

export interface StandingFormData {
  teamName: string;
  schoolName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  supporterPoints: number;
  points: number;
  fairPlayScore: number;
}

interface StandingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StandingFormData) => void;
  editingRow: StandingRow | null;
  selectedGroup: 'A' | 'B' | 'C' | 'D';
}

export const StandingFormModal: React.FC<StandingFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingRow,
  selectedGroup,
}) => {
  const [teamName, setTeamName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [won, setWon] = useState(0);
  const [drawn, setDrawn] = useState(0);
  const [lost, setLost] = useState(0);
  const [goalsFor, setGoalsFor] = useState(0);
  const [goalsAgainst, setGoalsAgainst] = useState(0);
  const [supporterPoints, setSupporterPoints] = useState(100);
  const [fairPlayScore, setFairPlayScore] = useState(10);

  // Manual points override mode
  const [isManualPoints, setIsManualPoints] = useState(false);
  const [manualPoints, setManualPoints] = useState(0);

  // Manual played override mode
  const [isManualPlayed, setIsManualPlayed] = useState(false);
  const [manualPlayed, setManualPlayed] = useState(0);

  // Auto-calculated values
  const autoPlayed = Math.max(0, won + drawn + lost);
  const finalPlayed = isManualPlayed ? manualPlayed : autoPlayed;

  const autoPoints = Math.max(0, won * 3 + drawn * 1);
  const finalPoints = isManualPoints ? manualPoints : autoPoints;

  const goalDifference = goalsFor - goalsAgainst;

  useEffect(() => {
    if (editingRow) {
      setTeamName(editingRow.teamName || '');
      setSchoolName(editingRow.schoolName || '');
      setWon(Math.max(0, editingRow.won || 0));
      setDrawn(Math.max(0, editingRow.drawn || 0));
      setLost(Math.max(0, editingRow.lost || 0));
      setGoalsFor(Math.max(0, editingRow.goalsFor || 0));
      setGoalsAgainst(Math.max(0, editingRow.goalsAgainst || 0));
      setSupporterPoints(editingRow.supporterPoints ?? 100);
      setFairPlayScore(editingRow.fairPlayScore ?? 10);

      // Cek apakah poin atau main sebelumnya tidak cocok dengan rumus standar
      const expectedPts = (editingRow.won || 0) * 3 + (editingRow.drawn || 0);
      if (editingRow.points !== undefined && editingRow.points !== expectedPts) {
        setIsManualPoints(true);
        setManualPoints(editingRow.points);
      } else {
        setIsManualPoints(false);
        setManualPoints(expectedPts);
      }

      const expectedPlayed = (editingRow.won || 0) + (editingRow.drawn || 0) + (editingRow.lost || 0);
      if (editingRow.played !== undefined && editingRow.played !== expectedPlayed) {
        setIsManualPlayed(true);
        setManualPlayed(editingRow.played);
      } else {
        setIsManualPlayed(false);
        setManualPlayed(expectedPlayed);
      }
    } else {
      setTeamName('');
      setSchoolName('');
      setWon(0);
      setDrawn(0);
      setLost(0);
      setGoalsFor(0);
      setGoalsAgainst(0);
      setSupporterPoints(100);
      setFairPlayScore(10);
      setIsManualPoints(false);
      setManualPoints(0);
      setIsManualPlayed(false);
      setManualPlayed(0);
    }
  }, [editingRow, isOpen]);

  // Keyboard accessibility: Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    onSubmit({
      teamName: teamName.trim(),
      schoolName: schoolName.trim() || teamName.trim(),
      played: finalPlayed,
      won,
      drawn,
      lost,
      goalsFor,
      goalsAgainst,
      supporterPoints,
      points: finalPoints,
      fairPlayScore,
    });
  };

  return (
    <ModalPortal>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="standing-modal-title"
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-5 my-auto max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Modal */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] shrink-0">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono tracking-wider text-[var(--color-arena-primary)] uppercase block font-bold">
                GRUP {selectedGroup} • FORM SKOR KLASEMEN
              </span>
              <h3 id="standing-modal-title" className="font-bebas text-xl sm:text-2xl tracking-wide text-[var(--text-main)]">
                {editingRow ? `Edit Poin: ${editingRow.teamName}` : `Tambah Tim ke Grup ${selectedGroup}`}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup jendela"
              className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content - Scrollable if screen is small */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs overflow-y-auto pr-1">
            {/* 1. Identitas Tim */}
            <div className="space-y-2.5 p-3.5 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)]">
              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Nama Tim & Kode Grup
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SDI KARDINA MASSA (A1)"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
                />
              </div>
              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Nama Resmi Sekolah / Madrasah
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SD Islam Kardina Massa Blitar"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
                />
              </div>
            </div>

            {/* 2. Hasil Laga (Menang, Seri, Kalah) dengan Stepper Interaktif */}
            <div className="space-y-2 p-3.5 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <span className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  Rekor Pertandingan
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  Total Laga: <b className="text-[var(--text-main)] font-mono">{finalPlayed}</b>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {/* Menang */}
                <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-emerald-500/30 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    Menang (M)
                  </span>
                  <div className="flex items-center gap-1 w-full justify-center">
                    <button
                      type="button"
                      onClick={() => setWon((prev) => Math.max(0, prev - 1))}
                      className="w-7 h-7 rounded-lg bg-[var(--bg-muted)] hover:bg-emerald-500/20 text-[var(--text-main)] flex items-center justify-center font-bold active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={won}
                      onChange={(e) => setWon(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-12 py-1 text-center font-teko font-bold text-xl text-emerald-600 dark:text-emerald-400 bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setWon((prev) => prev + 1)}
                      className="w-7 h-7 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 flex items-center justify-center font-bold active:scale-95 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[9px] text-emerald-600/80 font-mono">+3 Poin</span>
                </div>

                {/* Seri */}
                <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-amber-500/30 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                    Seri (S)
                  </span>
                  <div className="flex items-center gap-1 w-full justify-center">
                    <button
                      type="button"
                      onClick={() => setDrawn((prev) => Math.max(0, prev - 1))}
                      className="w-7 h-7 rounded-lg bg-[var(--bg-muted)] hover:bg-amber-500/20 text-[var(--text-main)] flex items-center justify-center font-bold active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={drawn}
                      onChange={(e) => setDrawn(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-12 py-1 text-center font-teko font-bold text-xl text-amber-600 dark:text-amber-400 bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setDrawn((prev) => prev + 1)}
                      className="w-7 h-7 rounded-lg bg-amber-500 text-white hover:bg-amber-600 flex items-center justify-center font-bold active:scale-95 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[9px] text-amber-600/80 font-mono">+1 Poin</span>
                </div>

                {/* Kalah */}
                <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-red-500/30 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
                    Kalah (K)
                  </span>
                  <div className="flex items-center gap-1 w-full justify-center">
                    <button
                      type="button"
                      onClick={() => setLost((prev) => Math.max(0, prev - 1))}
                      className="w-7 h-7 rounded-lg bg-[var(--bg-muted)] hover:bg-red-500/20 text-[var(--text-main)] flex items-center justify-center font-bold active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={lost}
                      onChange={(e) => setLost(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-12 py-1 text-center font-teko font-bold text-xl text-red-600 dark:text-red-400 bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setLost((prev) => prev + 1)}
                      className="w-7 h-7 rounded-lg bg-red-500 text-white hover:bg-red-600 flex items-center justify-center font-bold active:scale-95 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[9px] text-red-600/80 font-mono">0 Poin</span>
                </div>
              </div>
            </div>

            {/* 3. Produktivitas Gol (Gol Dicetak & Kebobolan) */}
            <div className="space-y-2 p-3.5 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <span className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)]">
                  Produktivitas Gol
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${goalDifference > 0
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : goalDifference < 0
                        ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                        : 'bg-slate-500/15 text-[var(--text-muted)]'
                    }`}
                >
                  Selisih Gol (SG): {goalDifference > 0 ? `+${goalDifference}` : goalDifference}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Gol Memasukkan (GM) */}
                <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-bold text-[var(--text-main)] block uppercase">
                    Gol Dicetak (GM)
                  </span>
                  <div className="flex items-center gap-1 justify-between">
                    <button
                      type="button"
                      onClick={() => setGoalsFor((prev) => Math.max(0, prev - 1))}
                      className="w-7 h-7 rounded-lg bg-[var(--bg-muted)] text-[var(--text-main)] flex items-center justify-center font-bold active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={goalsFor}
                      onChange={(e) => setGoalsFor(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-14 py-1 text-center font-teko font-bold text-xl text-[var(--text-main)] bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setGoalsFor((prev) => prev + 1)}
                      className="w-7 h-7 rounded-lg bg-[var(--color-arena-primary)] text-white flex items-center justify-center font-bold active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[9px] text-[var(--text-muted)] block text-center">
                    Total gol dimasukkan
                  </span>
                </div>

                {/* Gol Kebobolan (GK) */}
                <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-bold text-[var(--text-main)] block uppercase">
                    Gol Kebobolan (GK)
                  </span>
                  <div className="flex items-center gap-1 justify-between">
                    <button
                      type="button"
                      onClick={() => setGoalsAgainst((prev) => Math.max(0, prev - 1))}
                      className="w-7 h-7 rounded-lg bg-[var(--bg-muted)] text-[var(--text-main)] flex items-center justify-center font-bold active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={goalsAgainst}
                      onChange={(e) => setGoalsAgainst(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-14 py-1 text-center font-teko font-bold text-xl text-[var(--text-main)] bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setGoalsAgainst((prev) => prev + 1)}
                      className="w-7 h-7 rounded-lg bg-[var(--bg-muted)] hover:bg-red-500/20 text-[var(--text-main)] flex items-center justify-center font-bold active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[9px] text-[var(--text-muted)] block text-center">
                    Total gol kemasukan
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Point Supporter (PS) */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] flex items-center gap-1.5" title="Point Supporter">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Point Supporter (PS)
                </span>
                <span className="text-[10px] text-amber-600 font-mono font-bold">
                  {supporterPoints} Poin
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSupporterPoints((prev) => Math.max(0, prev - 10))}
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[10px] font-bold font-mono active:scale-95"
                >
                  -10
                </button>
                <button
                  type="button"
                  onClick={() => setSupporterPoints((prev) => Math.max(0, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="0"
                  value={supporterPoints}
                  onChange={(e) => setSupporterPoints(Math.max(0, parseInt(e.target.value) || 0))}
                  className="flex-1 py-1.5 text-center font-teko font-bold text-xl text-amber-600 dark:text-amber-400 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSupporterPoints((prev) => prev + 1)}
                  className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSupporterPoints((prev) => prev + 10)}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold font-mono active:scale-95"
                >
                  +10
                </button>
              </div>
            </div>

            {/* 5. Total Poin Klasemen (PTS) Otomatis dengan opsi override manual */}
            <div className="p-3.5 rounded-xl bg-blue-500/10 border-2 border-[var(--color-arena-primary)]/40 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--color-arena-primary)] block">
                    Total Poin Klasemen (PTS)
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    {isManualPoints
                      ? 'Nilai ditentukan manual (koreksi komite)'
                      : `(${won} Menang × 3) + (${drawn} Seri × 1) = ${finalPoints} Poin`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-teko font-bold text-3xl text-[var(--color-arena-primary)] leading-none block">
                    {finalPoints}
                  </span>
                  <span className="text-[9px] font-mono text-[var(--text-muted)]">POIN RESMI</span>
                </div>
              </div>

              {/* Toggle manual poin */}
              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isManualPoints}
                    onChange={(e) => {
                      setIsManualPoints(e.target.checked);
                      if (e.target.checked) setManualPoints(autoPoints);
                    }}
                    className="w-3.5 h-3.5 rounded text-[var(--color-arena-primary)]"
                  />
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Koreksi Poin Manual (Opsional)
                  </span>
                </label>

                {isManualPoints && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[var(--text-muted)]">Poin:</span>
                    <input
                      type="number"
                      min="0"
                      value={manualPoints}
                      onChange={(e) => setManualPoints(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-14 px-2 py-0.5 rounded-lg border border-[var(--color-arena-primary)] bg-[var(--bg-surface)] text-center font-bold font-mono text-xs text-[var(--color-arena-primary)]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 6. Live Preview Card - Menjamin orang awam langsung tahu hasilnya */}
            <div className="p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[11px] space-y-1">
              <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider block font-bold">
                Pratinjau di Tabel Klasemen Publik & Juri:
              </span>
              <div className="flex items-center justify-between font-mono bg-[var(--bg-surface)] p-2 rounded-lg border border-[var(--border-subtle)]">
                <div className="truncate max-w-[200px] sm:max-w-[280px]">
                  <span className="font-bold text-[var(--text-main)] block truncate">
                    {teamName || 'Nama Tim'}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] block truncate">
                    MN: {finalPlayed} | M: {won} | S: {drawn} | K: {lost} | Gol: {goalsFor}-{goalsAgainst} (SG: {goalDifference > 0 ? `+${goalDifference}` : goalDifference})
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-teko font-bold text-lg text-[var(--color-arena-primary)] leading-none block">
                    {finalPoints} PTS
                  </span>
                  <span className="text-[9px] text-amber-600 font-bold" title="Point Supporter">PS: {supporterPoints}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 shrink-0">
              <button
                type="submit"
                className="btn-tactile flex-1 py-3 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white font-barlow font-bold uppercase tracking-wider text-xs shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{editingRow ? 'Simpan Perubahan Tim' : 'Tambahkan Tim ke Klasemen'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-tactile px-5 py-3 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};
