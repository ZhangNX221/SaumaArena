'use client';

import React, { useEffect } from 'react';
import { X, Award, ShieldAlert, Ticket } from 'lucide-react';
import { Team, SupporterAssessment } from '@/types';
import { getTeamLogoUrl } from '@/mocks/teamLogos';

interface SupporterDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | undefined;
  assessments: SupporterAssessment[];
}

export const SupporterDetailModal: React.FC<SupporterDetailModalProps> = ({
  isOpen,
  onClose,
  team,
  assessments,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !team) return null;

  const teamAssessments = assessments.filter((a) => a.teamId === team.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl relative space-y-6 animate-modalEnter">
        <button
          onClick={onClose}
          className="btn-tactile absolute top-4 right-4 p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors"
          aria-label="Tutup detail suporter"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-xs">
            <img
              src={team.logoUrl || getTeamLogoUrl(team.id)}
              alt={team.schoolName}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-[var(--text-main)] font-[var(--font-display)]">
              {team.schoolName}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Rincian Penilaian Juri & Catatan Disiplin per Pertandingan
            </p>
          </div>
        </div>

        {/* Assessment Log per Match */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Log Pertandingan & Penilaian Juri
          </h4>

          {teamAssessments.length === 0 ? (
            <div className="p-4 rounded-xl bg-[var(--bg-muted)] text-center text-xs text-[var(--text-muted)]">
              Belum ada penilaian juri untuk kontingen sekolah ini.
            </div>
          ) : (
            teamAssessments.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--text-main)]">
                    Laga ke-{idx + 1} &middot; Match #{item.matchId}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    Juri: {item.juryName} &middot; {new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className={`p-2 rounded-lg border ${item.choreography ? 'bg-[var(--color-arena-primary-light)] border-[var(--color-arena-primary)]/30 text-[var(--color-arena-primary)] dark:bg-[#102235] dark:border-blue-800 dark:text-sky-300' : 'bg-[var(--bg-muted)] border-[var(--border-subtle)] text-[var(--text-muted)]'}`}>
                    <div className="font-semibold text-[10px]">1. Koreografi (+25)</div>
                    <div className="font-bold">{item.choreography ? 'Terlaksana (+25)' : 'Tidak Ada (0)'}</div>
                  </div>
                  <div className={`p-2 rounded-lg border ${item.schoolMascot ? 'bg-[var(--color-arena-primary-light)] border-[var(--color-arena-primary)]/30 text-[var(--color-arena-primary)] dark:bg-[#102235] dark:border-blue-800 dark:text-sky-300' : 'bg-[var(--bg-muted)] border-[var(--border-subtle)] text-[var(--text-muted)]'}`}>
                    <div className="font-semibold text-[10px]">2. Maskot (+20)</div>
                    <div className="font-bold">{item.schoolMascot ? 'Hadir (+20)' : 'Tidak Ada (0)'}</div>
                  </div>
                  <div className={`p-2 rounded-lg border ${item.supporterUniform ? 'bg-[var(--color-arena-primary-light)] border-[var(--color-arena-primary)]/30 text-[var(--color-arena-primary)] dark:bg-[#102235] dark:border-blue-800 dark:text-sky-300' : 'bg-[var(--bg-muted)] border-[var(--border-subtle)] text-[var(--text-muted)]'}`}>
                    <div className="font-semibold text-[10px]">3. Seragam (+15)</div>
                    <div className="font-bold">{item.supporterUniform ? 'Kompak (+15)' : 'Bebas (0)'}</div>
                  </div>
                  <div className={`p-2 rounded-lg border ${item.cheerMin3Chants ? 'bg-[var(--color-arena-primary-light)] border-[var(--color-arena-primary)]/30 text-[var(--color-arena-primary)] dark:bg-[#102235] dark:border-blue-800 dark:text-sky-300' : 'bg-[var(--bg-muted)] border-[var(--border-subtle)] text-[var(--text-muted)]'}`}>
                    <div className="font-semibold text-[10px]">4. Yel-Yel (+10)</div>
                    <div className="font-bold">{item.cheerMin3Chants ? '≥ 3 Lagu (+10)' : '< 3 Lagu (0)'}</div>
                  </div>
                </div>

                {/* Sanksi Disiplin Jika Ada */}
                {(item.incidentViolentChaos || item.incidentThrowObjects || item.incidentRacismProvocation || item.incidentSmuggleContraband || item.incidentLitteringTribun) && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Catatan Sanksi Pelanggaran:</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] space-y-0.5">
                      {item.incidentViolentChaos && <li>Kericuhan / Kekerasan Fisik (-50)</li>}
                      {item.incidentThrowObjects && <li>Melempar Benda ke Lapangan (-25)</li>}
                      {item.incidentRacismProvocation && <li>Tindakan Rasis / Provokasi Negatif (-15)</li>}
                      {item.incidentSmuggleContraband && <li>Membawa Barang Terlarang (-5)</li>}
                      {item.incidentLitteringTribun && <li>Membuang Sampah / Mengotori Tribun (-1)</li>}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
                  <div className="flex items-center gap-1.5 text-[var(--color-arena-primary)] font-semibold">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>5. Tiket Terverifikasi Gate: +{item.checkedInTickets} poin</span>
                  </div>
                  <div className="text-[11px] font-medium text-[var(--text-muted)]">
                    Catatan Juri: &ldquo;{item.notes || 'Penonton kondusif dan tertib.'}&rdquo;
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-tactile py-2.5 px-6 rounded-xl font-bold text-xs bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white shadow-xs transition-colors"
          >
            Tutup Rincian
          </button>
        </div>
      </div>
    </div>
  );
};
