'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ModalPortal } from '@/components/common/ModalPortal';
import { initialTeams } from '@/mocks/tournamentData';
import { FlattenedAthlete } from '@/types';
export type { FlattenedAthlete };

interface AthleteEditModalProps {
  athlete: FlattenedAthlete;
  onClose: () => void;
  onSave: (updated: {
    id: string;
    teamId: string;
    name: string;
    targetTeamId: string;
    number: number;
    position: string;
    athleteCode: string;
  }) => void;
}

export const AthleteEditModal: React.FC<AthleteEditModalProps> = ({ athlete, onClose, onSave }) => {
  const [editAthleteCode, setEditAthleteCode] = useState(athlete.athleteCode || 'ATL-001');
  const [editName, setEditName] = useState(athlete.name);
  const [editTeamId, setEditTeamId] = useState(athlete.teamId);
  const [editNumber, setEditNumber] = useState(athlete.number);
  const [editPosition, setEditPosition] = useState(athlete.position);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: athlete.id,
      teamId: athlete.teamId,
      name: editName.trim() || athlete.name,
      targetTeamId: editTeamId,
      number: editNumber,
      position: editPosition.trim() || athlete.position,
      athleteCode: editAthleteCode.trim() || athlete.athleteCode || 'ATL-001',
    });
  };

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <div>
              <h3 className="font-bebas text-xl uppercase tracking-wide text-[var(--text-main)]">
                Edit Data Pemain
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Perbarui ID khusus atlet, nama lengkap, tim, nomor punggung, dan posisi.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* 1. Form Edit ID Khusus Atlet */}
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                ID Khusus Pemain Atlet
              </label>
              <input
                type="text"
                required
                value={editAthleteCode}
                onChange={(e) => setEditAthleteCode(e.target.value.toUpperCase())}
                placeholder="Contoh: ATL-001"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--color-arena-primary)] font-mono font-bold focus:outline-none focus:border-[var(--color-arena-primary)]"
              />
              <span className="text-[10px] text-[var(--text-muted)] font-sans mt-0.5 block">
                Identitas unik resmi atlet untuk turnamen dan pencatatan statistik juri.
              </span>
            </div>

            {/* 2. Form Edit Nama Pemain */}
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                Nama Lengkap Atlet / Pemain
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Contoh: Exel Pratama"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-semibold focus:outline-none focus:border-[var(--color-arena-primary)]"
              />
            </div>

            {/* 3. Form Edit Tim & Sekolah */}
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                Kontingen Tim &amp; Sekolah
              </label>
              <select
                value={editTeamId}
                onChange={(e) => setEditTeamId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-semibold focus:outline-none focus:border-[var(--color-arena-primary)]"
              >
                {initialTeams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.schoolName})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* 4. Nomor Punggung */}
              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Nomor Punggung (Jersey)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={99}
                  value={editNumber}
                  onChange={(e) => setEditNumber(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono font-bold focus:outline-none focus:border-[var(--color-arena-primary)]"
                />
              </div>

              {/* 5. Posisi Bermain */}
              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Posisi Bermain
                </label>
                <input
                  type="text"
                  required
                  value={editPosition}
                  onChange={(e) => setEditPosition(e.target.value)}
                  placeholder="Kiper / Anchor / Flank / Pivot"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-tactile px-4 py-2 rounded-xl border border-[var(--border-subtle)] font-barlow font-bold uppercase tracking-wider text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn-tactile px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold uppercase tracking-wider text-xs cursor-pointer shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};
