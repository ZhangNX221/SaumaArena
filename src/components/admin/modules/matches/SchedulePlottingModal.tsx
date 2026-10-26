'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Match, MatchStatus, AppUser } from '@/types';
import { initialTeams } from '@/mocks/tournamentData';
import { ModalPortal } from '@/components/common/ModalPortal';

export interface ScheduleFormData {
  matchNumber: number;
  stage: Match['stage'];
  teamAName: string;
  teamBName: string;
  courtName: string;
  scheduledTime: string;
  refereeName: string;
  status: MatchStatus;
}

interface SchedulePlottingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleFormData) => void;
  editingMatch: Match | null;
  matchCount: number;
  referees: AppUser[];
}

export const SchedulePlottingModal: React.FC<SchedulePlottingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingMatch,
  matchCount,
  referees,
}) => {
  const [formData, setFormData] = useState<ScheduleFormData>({
    matchNumber: 1,
    stage: 'GROUP',
    teamAName: initialTeams[0]?.name || 'Tim A',
    teamBName: initialTeams[1]?.name || 'Tim B',
    courtName: 'Lapangan Utama (Vinyl Standar FFI)',
    scheduledTime: '2026-10-24 09:00',
    refereeName: referees[0]?.name || 'Wasit Utama',
    status: 'UPCOMING',
  });

  useEffect(() => {
    if (editingMatch) {
      setFormData({
        matchNumber: editingMatch.matchNumber,
        stage: editingMatch.stage,
        teamAName: editingMatch.teamAName,
        teamBName: editingMatch.teamBName,
        courtName: editingMatch.courtName,
        scheduledTime: editingMatch.scheduledTime,
        refereeName: editingMatch.assignedReferees?.[0]?.refereeName || referees[0]?.name || 'Wasit Utama',
        status: editingMatch.status,
      });
    } else {
      setFormData({
        matchNumber: matchCount + 1,
        stage: 'GROUP',
        teamAName: initialTeams[0]?.name || 'Tim A',
        teamBName: initialTeams[1]?.name || 'Tim B',
        courtName: 'Lapangan Utama (Vinyl Standar FFI)',
        scheduledTime: '2026-10-24 09:00',
        refereeName: referees[0]?.name || 'Wasit Utama',
        status: 'UPCOMING',
      });
    }
  }, [editingMatch, matchCount, referees, isOpen]);

  // Keyboard accessibility: Close modal on Escape
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
    if (!formData.teamAName.trim() || !formData.teamBName.trim()) return;
    onSubmit(formData);
  };

  return (
    <ModalPortal>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-modal-title"
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
          <h3 id="schedule-modal-title" className="font-bebas text-xl uppercase tracking-wide text-[var(--text-main)]">
            {editingMatch ? `Ubah Jadwal Laga #${editingMatch.matchNumber}` : 'Tambah Jadwal Laga Baru'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela"
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Nomor Laga</label>
              <input
                type="number"
                min="1"
                required
                value={formData.matchNumber}
                onChange={(e) => setFormData({ ...formData, matchNumber: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Babak Pertandingan</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as Match['stage'] })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-semibold"
              >
                <option value="GROUP">Penyisihan Grup</option>
                <option value="QUARTER_FINAL">Perempat Final</option>
                <option value="SEMI_FINAL">Semifinal</option>
                <option value="FINAL">Grand Final</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Tim A</label>
              <input
                type="text"
                required
                value={formData.teamAName}
                onChange={(e) => setFormData({ ...formData, teamAName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
              />
            </div>
            <div>
              <label className="font-bold text-[var(--text-main)] block mb-1">Tim B</label>
              <input
                type="text"
                required
                value={formData.teamBName}
                onChange={(e) => setFormData({ ...formData, teamBName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Titik Lapangan</label>
              <input
                type="text"
                required
                value={formData.courtName}
                onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
              />
            </div>
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Waktu / Jadwal</label>
              <input
                type="text"
                required
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                placeholder="2026-10-20 09:00"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Penugasan Juri</label>
              <select
                value={formData.refereeName}
                onChange={(e) => setFormData({ ...formData, refereeName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
              >
                {referees.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">Status Laga</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as MatchStatus })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-barlow font-bold uppercase text-xs"
              >
                <option value="UPCOMING">UPCOMING</option>
                <option value="LIVE">LIVE</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="POSTPONED">POSTPONED</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="submit"
              className="btn-tactile flex-1 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold uppercase tracking-wider text-xs"
            >
              {editingMatch ? 'Simpan Perubahan' : 'Jadwalkan Laga'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-tactile px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider"
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
