'use client';

import React, { useState } from 'react';
import { UserCog, Calendar, MapPin, CheckCircle2, AlertCircle, Edit2, X, Plus, ShieldCheck } from 'lucide-react';
import { initialMatches } from '@/mocks/tournamentData';
import { PRESET_USERS, REFEREE_DUTIES } from '@/mocks/multiSportData';
import { Match, RefereeMatchDuty } from '@/types';
import { ModalPortal } from '@/components/common/ModalPortal';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';
import { usePersistentState } from '@/hooks/usePersistentState';

export interface MatchAssignmentsTabProps {
  hideHeader?: boolean;
}

export const MatchAssignmentsTab: React.FC<MatchAssignmentsTabProps> = ({ hideHeader = false }) => {
  const [duties, setDuties] = usePersistentState<RefereeMatchDuty[]>('sauma_arena_duties', REFEREE_DUTIES);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState<RefereeMatchDuty | null>(null);
  const [selectedRefereeId, setSelectedRefereeId] = useState<string>('USR-JURI-1');
  const [selectedRole, setSelectedRole] = useState<string>('Wasit Utama (Wasit 1)');

  const refereeUsers = PRESET_USERS.filter((u) => u.role === 'REFEREE');

  const handleOpenAssign = (duty: RefereeMatchDuty) => {
    setSelectedDuty(duty);
    setSelectedRefereeId(duty.refereeId);
    setSelectedRole(duty.roleInMatch || 'Wasit Utama (Wasit 1)');
    setIsAssignModalOpen(true);
  };

  const handleSaveAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDuty) return;
    const refUser = refereeUsers.find((r) => r.id === selectedRefereeId);
    setDuties((prev) =>
      prev.map((d) =>
        d.id === selectedDuty.id
          ? {
              ...d,
              refereeId: selectedRefereeId,
              refereeName: refUser ? refUser.name : d.refereeName,
              roleInMatch: selectedRole,
            }
          : d
      )
    );
    setIsAssignModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      {!hideHeader && (
        <AdminPageHeaderCard
          icon={UserCog}
          category="PERANGKAT PERTANDINGAN • PENUGASAN JURI"
          title="Penugasan Wasit &amp; Juri Lapangan"
          description="Plotting wasit utama, asisten wasit, dan pencatat meja untuk seluruh pertandingan turnamen sesuai jadwal &amp; lisensi resmi."
          action={
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-barlow font-bold uppercase tracking-wider">
                {refereeUsers.length} Wasit Bersertifikat
              </span>
            </div>
          }
        />
      )}

      {/* Duty Assignment Cards */}
      <div className="space-y-3">
        {duties.map((duty) => (
          <div
            key={duty.id}
            className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)]/40 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-subtle)]">
                  Pertandingan #{duty.matchNumber}
                </span>
                <span className="text-xs font-semibold text-[var(--color-arena-primary)]">
                  {duty.sport}
                </span>
                <span className="text-xs text-[var(--text-muted)]">&bull;</span>
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{duty.courtName}</span>
                </span>
              </div>

              <div className="font-barlow font-bold text-base text-[var(--text-main)]">
                {duty.teamA} <span className="text-xs font-normal text-[var(--text-muted)]">vs</span> {duty.teamB}
              </div>

              <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
                <span>{duty.time}</span>
              </div>
            </div>

            {/* Assigned Referee Badge & Change Action */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-left min-w-[200px]">
                <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  {duty.roleInMatch || 'Wasit Utama'}
                </span>
                <div className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5 pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{duty.refereeName}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenAssign(duty)}
                className="btn-tactile px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-1.5 transition-colors"
                title="Ganti atau Plot Wasit"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Plot Ulang</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Modal */}
      {isAssignModalOpen && selectedDuty && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn" onClick={() => setIsAssignModalOpen(false)}>
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <div>
                  <h3 className="font-bebas text-xl uppercase tracking-wide text-[var(--text-main)]">
                    Plotting Perangkat Wasit
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Pertandingan #{selectedDuty.matchNumber}: {selectedDuty.teamA} vs {selectedDuty.teamB}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveAssign} className="space-y-3 text-xs">
                <div>
                  <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                    Pilih Petugas / Wasit
                  </label>
                  <select
                    value={selectedRefereeId}
                    onChange={(e) => setSelectedRefereeId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-semibold"
                  >
                    {refereeUsers.map((ref) => (
                      <option key={ref.id} value={ref.id}>
                        {ref.name} ({ref.licenseLevel || 'Lisensi Daerah'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                    Peran Penugasan di Lapangan
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                  >
                    <option value="Wasit Utama (Wasit 1)">Wasit Utama (Wasit 1)</option>
                    <option value="Asisten Wasit (Wasit 2)">Asisten Wasit (Wasit 2)</option>
                    <option value="Pencatat Meja / Timer">Pencatat Meja / Timer</option>
                    <option value="Hakim Garis">Hakim Garis</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(false)}
                    className="btn-tactile px-4 py-2 rounded-xl border border-[var(--border-subtle)] font-barlow font-bold uppercase tracking-wider text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn-tactile px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold uppercase tracking-wider text-xs"
                  >
                    Simpan Penugasan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
};
