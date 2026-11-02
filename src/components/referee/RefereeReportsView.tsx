'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileCheck,
  CheckCircle2,
  Download,
  Eye,
  Clock,
  Filter,
} from 'lucide-react';
import { AppUser, Match } from '@/types';
import { BAPRecord, IncidentReport, INITIAL_INCIDENTS } from '@/mocks/refereeReportsData';
import { initialMatches } from '@/mocks/tournamentData';
import { usePersistentState } from '@/hooks/usePersistentState';
import { fetchLiveStateFromBackend } from '@/lib/apiSync';
import { BAPPreviewModal } from './reports/BAPPreviewModal';
import { IncidentReportSection } from './reports/IncidentReportSection';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';

interface RefereeReportsViewProps {
  user: AppUser;
}

export const RefereeReportsView: React.FC<RefereeReportsViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'BAP_LIST' | 'INCIDENT_FORM'>('BAP_LIST');
  const [bapFilter, setBapFilter] = useState<'ALL' | 'COMPLETED' | 'LIVE'>('ALL');
  const [matches, setMatches] = usePersistentState<Match[]>('sauma_arena_matches', initialMatches);
  const [incidentReports, setIncidentReports] = usePersistentState<IncidentReport[]>(
    'sauma_arena_incidents',
    INITIAL_INCIDENTS
  );
  const [previewBapModal, setPreviewBapModal] = useState<BAPRecord | null>(null);

  // Sinkronisasi riwayat pertandingan dari konsol juri & backend
  useEffect(() => {
    fetchLiveStateFromBackend().then((state) => {
      if (state && Array.isArray(state.matches) && state.matches.length > 0) {
        setMatches(state.matches);
      }
    });
  }, [setMatches]);

  // Turunkan Berita Acara Pertandingan (BAP) dari riwayat konsol juri
  const dynamicBaps: BAPRecord[] = useMemo(() => {
    return matches.map((m, idx) => {
      const yellowCount = (m.events || []).filter((e) => e.type === 'YELLOW_CARD').length;
      const redCount = (m.events || []).filter((e) => e.type === 'RED_CARD').length;
      const foulsCount = (m.events || []).filter((e) => e.type === 'FOUL').length;
      const matchNum = m.matchNumber || Number(m.id.replace(/\D/g, '')) || idx + 1;
      const isSigned = m.bapSigned || m.status === 'COMPLETED';

      return {
        id: `BAP-M${matchNum}`,
        matchNumber: matchNum,
        teams: `${m.teamAName} vs ${m.teamBName}`,
        court: m.courtName || 'Lapangan Futsal Seabless',
        score: `${m.scoreA} - ${m.scoreB}`,
        date: m.scheduledTime
          ? new Date(m.scheduledTime).toLocaleDateString('id-ID', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : 'Senin, 2 Nov 2026',
        referee1: m.bapSigner || user?.name || 'Ust. Ahmad Syarif, S.Pd',
        referee2: 'Wasit Meja Pencatat',
        yellowCards: yellowCount,
        redCards: redCount,
        foulsCount,
        isFullySigned: isSigned,
        sport: 'Futsal',
        matchId: m.id,
        status: m.status,
        group: m.group,
        scoreA: m.scoreA,
        scoreB: m.scoreB,
        teamAName: m.teamAName,
        teamBName: m.teamBName,
        events: m.events || [],
      };
    });
  }, [matches, user?.name]);

  const filteredBaps = useMemo(() => {
    if (bapFilter === 'COMPLETED') {
      return dynamicBaps.filter((b) => b.isFullySigned || b.status === 'COMPLETED');
    }
    if (bapFilter === 'LIVE') {
      return dynamicBaps.filter((b) => b.status === 'LIVE');
    }
    return dynamicBaps;
  }, [dynamicBaps, bapFilter]);

  const completedCount = dynamicBaps.filter((b) => b.isFullySigned || b.status === 'COMPLETED').length;
  const liveCount = dynamicBaps.filter((b) => b.status === 'LIVE').length;

  const handleAddIncident = (newReport: IncidentReport) => {
    setIncidentReports((prev) => [newReport, ...prev]);
  };

  return (
    <div className="space-y-6 w-full pb-16 animate-fadeIn">
      {/* 1. Header Card Seragam */}
      <AdminPageHeaderCard
        icon={FileCheck}
        category="MEJA LAPANGAN • BERITA ACARA & INSIDEN"
        title="Laporan Pertandingan & BAP"
        description="Rekapitulasi resmi Berita Acara Pertandingan (BAP) dari konsol juri meja, statistik kedisiplinan, serta pelaporan insiden pertandingan."
        action={
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('BAP_LIST')}
              className={`btn-tactile px-3.5 py-1.5 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                activeTab === 'BAP_LIST'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Rekap BAP ({dynamicBaps.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('INCIDENT_FORM')}
              className={`btn-tactile px-3.5 py-1.5 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                activeTab === 'INCIDENT_FORM'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Lapor Insiden
            </button>
          </div>
        }
      />

      {/* 2. Sub-tab 1: Rekap BAP Selesai - Card Tabel */}
      {activeTab === 'BAP_LIST' && (
        <div className="space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <div className="space-y-0.5">
              <h2 className="font-bebas text-xl sm:text-2xl text-[var(--text-main)] uppercase tracking-wide">
                Daftar Laporan &amp; Berita Acara Pertandingan
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Data otomatis diperbarui dari konsol pencatat wasit meja ({completedCount} BAP Sah, {liveCount} Sedang Berlangsung)
              </p>
            </div>

            {/* Filter Pill */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-subtle)]">
              <Filter className="w-3.5 h-3.5 text-[var(--text-muted)] ml-1" />
              <button
                type="button"
                onClick={() => setBapFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-barlow font-bold uppercase transition-colors cursor-pointer ${
                  bapFilter === 'ALL'
                    ? 'bg-[var(--color-arena-primary)] text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Semua ({dynamicBaps.length})
              </button>
              <button
                type="button"
                onClick={() => setBapFilter('COMPLETED')}
                className={`px-2.5 py-1 rounded-lg text-xs font-barlow font-bold uppercase transition-colors cursor-pointer ${
                  bapFilter === 'COMPLETED'
                    ? 'bg-[var(--color-arena-primary)] text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                BAP Sah ({completedCount})
              </button>
              <button
                type="button"
                onClick={() => setBapFilter('LIVE')}
                className={`px-2.5 py-1 rounded-lg text-xs font-barlow font-bold uppercase transition-colors cursor-pointer ${
                  bapFilter === 'LIVE'
                    ? 'bg-rose-500 text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Live ({liveCount})
              </button>
            </div>
          </div>

          {/* Card Tabel BAP */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[var(--bg-muted)]/70 text-[var(--text-muted)] uppercase text-[11px] font-barlow font-bold tracking-wider border-b border-[var(--border-subtle)]">
                  <tr>
                    <th className="py-3.5 px-4">Laga</th>
                    <th className="py-3.5 px-4">Cabang &amp; Lapangan</th>
                    <th className="py-3.5 px-4">Pertandingan / Tim</th>
                    <th className="py-3.5 px-4 text-center">Skor</th>
                    <th className="py-3.5 px-4 text-center">Disiplin</th>
                    <th className="py-3.5 px-4">Jadwal &amp; Waktu</th>
                    <th className="py-3.5 px-4 text-center">Status Laporan</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] font-medium text-[var(--text-main)]">
                  {filteredBaps.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 px-4 text-center">
                        <div className="max-w-md mx-auto space-y-3 flex flex-col items-center">
                          <div className="w-14 h-14 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)]">
                            <FileCheck className="w-7 h-7 text-[var(--color-arena-primary)]" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bebas text-xl text-[var(--text-main)] uppercase tracking-wide">
                              Tidak Ada Laporan yang Cocok
                            </h4>
                            <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
                              Tidak ada pertandingan yang sesuai dengan filter yang dipilih. Laporan otomatis terbarui seiring jalannya konsol wasit.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBaps.map((b) => (
                      <tr key={b.id} className="hover:bg-[var(--bg-muted)]/30 transition-colors">
                        <td className="py-4 px-4 font-mono">
                          <span className="font-mono text-xs font-bold text-[var(--color-arena-primary)] px-2.5 py-1 rounded-md bg-[var(--color-arena-primary-light)]">
                            #{b.matchNumber}
                          </span>
                          {b.group && (
                            <span className="block text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                              Grup {b.group}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-barlow font-bold uppercase tracking-wider text-xs text-[var(--text-main)]">
                            {b.sport}
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)]">{b.court}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bebas text-lg text-[var(--text-main)] uppercase tracking-wide">
                            {b.teams}
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)]">
                            Pengawas: {b.referee1}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-scoreboard text-xl text-[var(--color-arena-accent)] font-bold">
                            {b.score}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5 font-bold text-[11px]">
                            <span className="text-amber-500" title="Kartu Kuning">{b.yellowCards} 🟨</span>
                            <span className="text-red-500" title="Kartu Merah">{b.redCards} 🟥</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs text-[var(--text-muted)] font-mono">{b.date}</div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {b.isFullySigned || b.status === 'COMPLETED' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>BAP Sah</span>
                            </span>
                          ) : b.status === 'LIVE' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                              <span>Live Tanding</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-500 text-[10px] font-bold">
                              <Clock className="w-3 h-3" />
                              <span>Tercatat</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewBapModal(b)}
                              className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider hover:bg-[var(--bg-surface)] active:scale-[0.98] transition-all cursor-pointer"
                              title="Tinjau salinan berita acara"
                            >
                              <Eye className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
                              <span>Salinan BAP</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewBapModal(b)}
                              className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] active:scale-[0.98] text-white text-xs font-barlow font-bold uppercase tracking-wider transition-all cursor-pointer"
                              title="Cetak atau unduh dokumen BAP resmi"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Cetak</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. Sub-tab 2: Form Catatan Insiden Khusus */}
      {activeTab === 'INCIDENT_FORM' && (
        <IncidentReportSection
          matches={matches}
          incidentReports={incidentReports}
          onAddIncident={handleAddIncident}
        />
      )}

      {/* Modal Preview Salinan BAP */}
      <BAPPreviewModal bap={previewBapModal} onClose={() => setPreviewBapModal(null)} />
    </div>
  );
};
