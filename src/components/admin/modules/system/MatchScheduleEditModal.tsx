'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Match, MatchStatus } from '@/types';
import { TOURNAMENT_RUNDOWN } from '@/mocks/tournamentData';
import { ModalPortal } from '@/components/common/ModalPortal';

interface MatchScheduleEditModalProps {
  match: Match;
  onClose: () => void;
  onSave: (updated: Match) => void;
}

export const MatchScheduleEditModal: React.FC<MatchScheduleEditModalProps> = ({
  match,
  onClose,
  onSave,
}) => {
  const parts = (match.scheduledTime || '').split('•').map((s) => s.trim());
  const initialDate = parts[0] || (match.matchNumber <= 10 ? 'Senin, 2 Nov 2026' : 'Selasa, 3 Nov 2026');

  const timeMatch = (match.scheduledTime || '').match(/(\d{1,2}[:.]\d{2}\s*-\s*\d{1,2}[:.]\d{2}(?:\s*WIB)?)/i);
  const rd = TOURNAMENT_RUNDOWN.find((r) => r.matchCode === `P${match.matchNumber}`);
  const defaultTime = rd ? `${rd.time.replace(/\./g, ':')} WIB` : '07:30 - 08:00 WIB';

  const [editDateStr, setEditDateStr] = useState(initialDate);
  const [editTimeStr, setEditTimeStr] = useState(timeMatch ? timeMatch[1].replace(/\./g, ':') : defaultTime);
  const [editCourt, setEditCourt] = useState(match.courtName || 'Lapangan Futsal Seabless');
  const [editTeamA, setEditTeamA] = useState(match.teamAName);
  const [editTeamB, setEditTeamB] = useState(match.teamBName);
  const [editStatus, setEditStatus] = useState<MatchStatus>(match.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const codePart = rd ? `(${rd.matchCode} • ${rd.agendaCode})` : `(P${match.matchNumber})`;
    const updatedScheduled = `${editDateStr} • ${editTimeStr.includes('WIB') ? editTimeStr : `${editTimeStr} WIB`} ${codePart}`;

    onSave({
      ...match,
      scheduledTime: updatedScheduled,
      courtName: editCourt,
      teamAName: editTeamA,
      teamBName: editTeamB,
      status: editStatus,
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
                Edit Jadwal Laga #{match.matchNumber} (Partai P{match.matchNumber})
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Sesuaikan waktu kick-off, hari pertandingan, dan lapangan.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                Waktu Pertandingan (Jam Kick-off s/d Selesai)
              </label>
              <input
                type="text"
                required
                value={editTimeStr}
                onChange={(e) => setEditTimeStr(e.target.value)}
                placeholder="Contoh: 12:00 - 12:30 WIB"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono font-bold focus:outline-none focus:border-[var(--color-arena-primary)]"
              />
            </div>

            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                Hari &amp; Tanggal Pelaksanaan
              </label>
              <input
                type="text"
                required
                value={editDateStr}
                onChange={(e) => setEditDateStr(e.target.value)}
                placeholder="Contoh: Senin, 2 November 2026"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-semibold focus:outline-none focus:border-[var(--color-arena-primary)]"
              />
            </div>

            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                Lapangan / Venue
              </label>
              <input
                type="text"
                required
                value={editCourt}
                onChange={(e) => setEditCourt(e.target.value)}
                placeholder="Lapangan Futsal Seabless"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Tim A (Kandang)
                </label>
                <input
                  type="text"
                  required
                  value={editTeamA}
                  onChange={(e) => setEditTeamA(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-bold focus:outline-none focus:border-[var(--color-arena-primary)]"
                />
              </div>

              <div>
                <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                  Tim B (Tandang)
                </label>
                <input
                  type="text"
                  required
                  value={editTeamB}
                  onChange={(e) => setEditTeamB(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-bold focus:outline-none focus:border-[var(--color-arena-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                Status Laga
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as MatchStatus)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-semibold focus:outline-none focus:border-[var(--color-arena-primary)]"
              >
                <option value="UPCOMING">Terjadwal</option>
                <option value="LIVE">Live (Sedang Berlangsung)</option>
                <option value="COMPLETED">Selesai</option>
              </select>
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
                className="btn-tactile px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold uppercase tracking-wider text-xs cursor-pointer"
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

