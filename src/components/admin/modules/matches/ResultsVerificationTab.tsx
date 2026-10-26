'use client';

import React, { useState } from 'react';
import { FileCheck2, CheckCircle2, AlertOctagon, Clock, ShieldCheck, Check, AlertCircle, Plus, X } from 'lucide-react';
import { initialMatches } from '@/mocks/tournamentData';
import { Match } from '@/types';
import { ModalPortal } from '@/components/common/ModalPortal';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';

interface SanctionItem {
  id: string;
  matchNumber: number;
  teamName: string;
  party: string;
  type: 'RED_CARD_SUSPENSION' | 'WALKOVER' | 'DISCIPLINE_FINE' | 'PROTEST';
  details: string;
  status: 'PENDING_REVIEW' | 'APPLIED' | 'REJECTED';
  date: string;
}

const INITIAL_SANCTIONS: SanctionItem[] = [
  {
    id: 'SANC-01',
    matchNumber: 1,
    teamName: 'MIS Al-Hidayah',
    party: 'Pelatih Kepala',
    type: 'PROTEST',
    details: 'Pengajuan protes keputusan tendangan penalti menit 18. Ditolak setelah tinjauan rekaman video panitia.',
    status: 'REJECTED',
    date: '24 Okt 2026',
  },
  {
    id: 'SANC-02',
    matchNumber: 3,
    teamName: 'SDN 2 Harapan',
    party: 'Pemain #8 (Ahmad Rifqi)',
    type: 'RED_CARD_SUSPENSION',
    details: 'Kartu merah langsung (foul keras berisiko cedera). Skorsing otomatis 1 pertandingan ke depan.',
    status: 'APPLIED',
    date: 'Hari Ini',
  },
];

interface ResultsVerificationTabProps {
  activeSubTab?: 'VERIFICATION' | 'SANCTIONS';
}

export const ResultsVerificationTab: React.FC<ResultsVerificationTabProps> = ({
  activeSubTab = 'VERIFICATION',
}) => {
  const [currentTab, setCurrentTab] = useState<'VERIFICATION' | 'SANCTIONS'>(activeSubTab);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [sanctions, setSanctions] = useState<SanctionItem[]>(INITIAL_SANCTIONS);
  const [isSanctionModalOpen, setIsSanctionModalOpen] = useState(false);

  // New sanction state
  const [newSanction, setNewSanction] = useState({
    matchNumber: 1,
    teamName: 'MIN 1 Kota',
    party: '',
    type: 'RED_CARD_SUSPENSION' as const,
    details: '',
  });

  const completedMatches = matches.filter((m) => m.status === 'COMPLETED');
  const pendingVerificationMatches = completedMatches.filter((m) => m.isVerified === false);
  const verifiedMatches = completedMatches.filter((m) => m.isVerified !== false);

  const handleVerifyMatch = (matchId: string) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? { ...m, isVerified: true, bapSigned: true }
          : m
      )
    );
  };

  const handleCreateSanction = (e: React.FormEvent) => {
    e.preventDefault();
    const item: SanctionItem = {
      ...newSanction,
      id: `SANC-${Date.now()}`,
      status: 'APPLIED',
      date: 'Hari Ini',
    };
    setSanctions((prev) => [item, ...prev]);
    setIsSanctionModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header and Segmented Sub-Tab Bar */}
      <AdminPageHeaderCard
        icon={FileCheck2}
        category="OPERASIONAL PERTANDINGAN • PENGESAHAN HASIL"
        title="Verifikasi Hasil &amp; Sanksi Pertandingan"
        description="Verifikasi resmi Berita Acara Pertandingan (BAP) dari wasit lapangan, pengesahan poin klasemen, serta pencatatan sanksi &amp; protes."
        action={
          <div className="flex items-center gap-1 p-1.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-barlow font-bold uppercase tracking-wider w-fit shrink-0">
            <button
              type="button"
              onClick={() => setCurrentTab('VERIFICATION')}
              className={`btn-tactile px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                currentTab === 'VERIFICATION'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <span>Verifikasi BAP</span>
              {pendingVerificationMatches.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px]">
                  {pendingVerificationMatches.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('SANCTIONS')}
              className={`btn-tactile px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                currentTab === 'SANCTIONS'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Protes &amp; Sanksi ({sanctions.length})</span>
            </button>
          </div>
        }
      />

      {/* TAB 1: VERIFIKASI BERITA ACARA (BAP) */}
      {currentTab === 'VERIFICATION' && (
        <div className="space-y-4">
          {completedMatches.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
              Belum ada pertandingan yang selesai hari ini.
            </div>
          ) : (
            completedMatches.map((match) => {
              const isVerified = match.isVerified !== false;
              return (
                <div
                  key={match.id}
                  className={`p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border transition-all shadow-xs space-y-4 ${
                    !isVerified
                      ? 'border-amber-500/50 ring-2 ring-amber-500/10'
                      : 'border-[var(--border-subtle)]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-subtle)]">
                        Pertandingan #{match.matchNumber}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-mono">
                        {match.courtName} &bull; {match.scheduledTime}
                      </span>
                    </div>

                    <div>
                      {isVerified ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-barlow font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>✓ Sah &amp; Terverifikasi Admin</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs font-barlow font-bold uppercase tracking-wider animate-pulse">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Menunggu Verifikasi Admin</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Match Teams & Score Summary */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-center p-1 overflow-hidden shrink-0">
                        {match.teamALogo ? (
                          <img src={match.teamALogo} alt={match.teamAName} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-xs font-bold">{match.teamAName.charAt(0)}</span>
                        )}
                      </div>
                      <div className="font-barlow font-bold text-base text-[var(--text-main)]">
                        {match.teamAName}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-teko font-bold text-3xl tabular-nums text-[var(--text-main)] leading-none px-4 py-1.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                      <span>{match.scoreA}</span>
                      <span className="text-[var(--text-muted)] text-xl font-normal">:</span>
                      <span>{match.scoreB}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="font-barlow font-bold text-base text-[var(--text-main)] text-right">
                        {match.teamBName}
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-center p-1 overflow-hidden shrink-0">
                        {match.teamBLogo ? (
                          <img src={match.teamBLogo} alt={match.teamBName} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-xs font-bold">{match.teamBName.charAt(0)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BAP Signer & Actions */}
                  <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="text-[var(--text-muted)]">
                      <span>Penandatangan BAP Wasit: </span>
                      <strong className="text-[var(--text-main)]">{match.bapSigner || 'Wasit Utama Lapangan'}</strong>
                    </div>

                    {!isVerified && (
                      <button
                        type="button"
                        onClick={() => handleVerifyMatch(match.id)}
                        className="btn-tactile px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-barlow font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 shadow-xs shrink-0"
                      >
                        <Check className="w-4 h-4" />
                        <span>Sahkan &amp; Verifikasi BAP</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: PROTES & SANKSI */}
      {currentTab === 'SANCTIONS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)] font-medium">
              Daftar insiden disiplin, sanksi akumulasi kartu, dan berita acara protes resmi kontingen.
            </span>
            <button
              type="button"
              onClick={() => setIsSanctionModalOpen(true)}
              className="btn-tactile px-3.5 py-1.5 rounded-xl bg-[var(--color-arena-primary)] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Sanksi / Protes</span>
            </button>
          </div>

          <div className="space-y-3">
            {sanctions.map((sanc) => (
              <div
                key={sanc.id}
                className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-subtle)]">
                      Pertandingan #{sanc.matchNumber}
                    </span>
                    <strong className="text-[var(--text-main)]">{sanc.teamName}</strong>
                    <span className="text-[var(--text-muted)]">&bull; {sanc.party}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider ${
                      sanc.status === 'APPLIED'
                        ? 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20'
                        : sanc.status === 'REJECTED'
                        ? 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20'
                        : 'bg-amber-500/10 text-amber-800 border border-amber-500/20'
                    }`}
                  >
                    {sanc.status === 'APPLIED' ? 'Sanksi Berlaku' : sanc.status === 'REJECTED' ? 'Protes Ditolak' : 'Meninjau'}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {sanc.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sanction Modal */}
      {isSanctionModalOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn" onClick={() => setIsSanctionModalOpen(false)}>
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <h3 className="font-bebas text-xl uppercase tracking-wide text-[var(--text-main)]">
                  Catat Protes / Sanksi Disiplin
                </h3>
                <button
                  type="button"
                  onClick={() => setIsSanctionModalOpen(false)}
                  className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSanction} className="space-y-3 text-xs">
                <div>
                  <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                    Pertandingan
                  </label>
                  <select
                    value={newSanction.matchNumber}
                    onChange={(e) => setNewSanction({ ...newSanction, matchNumber: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                  >
                    {initialMatches.map((m) => (
                      <option key={m.id} value={m.matchNumber}>
                        Pertandingan #{m.matchNumber}: {m.teamAName} vs {m.teamBName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                    Pihak / Nama Terlibat
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pemain #7 / Manajer Tim"
                    value={newSanction.party}
                    onChange={(e) => setNewSanction({ ...newSanction, party: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="font-barlow font-bold uppercase tracking-wider text-[11px] text-[var(--text-main)] block mb-1">
                    Uraian Sanksi / Protes
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Deskripsikan insiden, pasal regulasi, dan putusan panitia..."
                    value={newSanction.details}
                    onChange={(e) => setNewSanction({ ...newSanction, details: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSanctionModalOpen(false)}
                    className="btn-tactile px-4 py-2 rounded-xl border border-[var(--border-subtle)] font-barlow font-bold uppercase tracking-wider text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn-tactile px-4 py-2 rounded-xl bg-red-600 text-white font-barlow font-bold uppercase tracking-wider text-xs"
                  >
                    Simpan Catatan Sanksi
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
