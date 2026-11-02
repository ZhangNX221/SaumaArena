'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileCheck,
  CheckCircle2,
  Download,
  Eye,
  Clock,
  Filter,
  Printer,
} from 'lucide-react';
import { AppUser, Match, MatchLiveTelemetry, RefereeMatchDuty } from '@/types';
import { BAPRecord, IncidentReport, INITIAL_INCIDENTS } from '@/mocks/refereeReportsData';
import { initialMatches } from '@/mocks/tournamentData';
import { REFEREE_DUTIES } from '@/mocks/multiSportData';
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
  const [duties] = usePersistentState<RefereeMatchDuty[]>('sauma_arena_duties', REFEREE_DUTIES);
  const [telemetryMap] = usePersistentState<Record<string, MatchLiveTelemetry>>(
    'sauma_arena_live_telemetry',
    {}
  );
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
      const telemFouls =
        telemetryMap[m.id] ? (telemetryMap[m.id].foulsA || 0) + (telemetryMap[m.id].foulsB || 0) : 0;
      const foulsCount = Math.max((m.events || []).filter((e) => e.type === 'FOUL').length, telemFouls);
      const matchNum = m.matchNumber || Number(m.id.replace(/\D/g, '')) || idx + 1;
      const isSigned = m.bapSigned || m.status === 'COMPLETED';

      const assignedDuty = duties.find(
        (d) => d.matchId === m.id || String(d.matchNumber) === String(matchNum)
      );
      const referee1Name =
        m.bapSigner || assignedDuty?.refereeName || user?.name || 'Ust. Ahmad Syarif, S.Pd';
      const referee2Name = 'Wasit Meja Pencatat';

      // Parse tanggal & waktu pertandingan agar valid dan ringkas (hindari Invalid Date)
      let formattedDate = 'Senin, 2 Nov • 07:30 WIB';
      if (m.scheduledTime) {
        if (m.scheduledTime.includes('•')) {
          const parts = m.scheduledTime.split('•');
          const dayPart = parts[0]?.replace(' 2026', '').trim() || '';
          const timePart = parts[1]?.split('(')[0]?.trim() || '';
          const timeStart = timePart.split('-')[0]?.replace('WIB', '').trim();
          formattedDate = timeStart ? `${dayPart} • ${timeStart} WIB` : dayPart;
        } else {
          const d = new Date(m.scheduledTime);
          if (!isNaN(d.getTime())) {
            formattedDate = d.toLocaleDateString('id-ID', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            });
          } else {
            formattedDate = m.scheduledTime;
          }
        }
      }

      return {
        id: `BAP-M${matchNum}`,
        matchNumber: matchNum,
        teams: `${m.teamAName} vs ${m.teamBName}`,
        court: m.courtName || 'Lapangan Futsal Seabless',
        score: `${m.scoreA} - ${m.scoreB}`,
        date: formattedDate,
        referee1: referee1Name,
        referee2: referee2Name,
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
  }, [matches, user?.name, duties, telemetryMap]);

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
                    <th className="py-2.5 px-3">Laga</th>
                    <th className="py-2.5 px-3">Cabang &amp; Lapangan</th>
                    <th className="py-2.5 px-3">Pertandingan / Tim</th>
                    <th className="py-2.5 px-3 text-center">Skor</th>
                    <th className="py-2.5 px-3 text-center">Disiplin</th>
                    <th className="py-2.5 px-3">Jadwal &amp; Waktu</th>
                    <th className="py-2.5 px-3 text-center">Status Laporan</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] font-medium text-[var(--text-main)]">
                  {filteredBaps.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 px-4 text-center">
                        <div className="max-w-md mx-auto space-y-3 flex flex-col items-center">
                          <div className="w-12 h-12 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)]">
                            <FileCheck className="w-6 h-6 text-[var(--color-arena-primary)]" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bebas text-lg text-[var(--text-main)] uppercase tracking-wide">
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
                        <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-[var(--color-arena-primary)] px-2 py-0.5 rounded-md bg-[var(--color-arena-primary-light)]">
                              #{b.matchNumber}
                            </span>
                            {b.group && (
                              <span className="text-[10px] text-[var(--text-muted)] font-mono">
                                Grup {b.group}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="font-barlow font-bold uppercase text-[11px] text-[var(--text-main)] leading-tight">
                            {b.sport}
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] truncate max-w-[130px]">{b.court}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-barlow font-bold text-xs sm:text-sm text-[var(--text-main)] tracking-wide leading-tight">
                            {b.teams}
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                            Pengawas: {b.referee1}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span className="font-scoreboard text-lg sm:text-xl text-[var(--color-arena-accent)] font-bold whitespace-nowrap">
                            {b.score}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1 font-mono text-[11px]">
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20 text-[10px]" title="Kartu Kuning" aria-label={`${b.yellowCards} Kartu Kuning`}>
                              {b.yellowCards} 🟨
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 font-bold border border-red-500/20 text-[10px]" title="Kartu Merah" aria-label={`${b.redCards} Kartu Merah`}>
                              {b.redCards} 🟥
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="text-xs text-[var(--text-muted)] font-mono">{b.date}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          {b.isFullySigned || b.status === 'COMPLETED' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>BAP Sah</span>
                            </span>
                          ) : b.status === 'LIVE' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              <span>Live</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-500 text-[10px] font-bold">
                              <Clock className="w-3 h-3" />
                              <span>Tercatat</span>
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewBapModal(b)}
                              className="btn-tactile p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--color-arena-primary)] hover:bg-[var(--bg-surface)] hover:border-[var(--color-arena-primary)] active:scale-95 transition-all cursor-pointer shadow-2xs"
                              title="Salinan BAP"
                              aria-label="Salinan BAP"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewBapModal(b)}
                              className="btn-tactile p-2 rounded-lg bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] active:scale-95 text-white transition-all cursor-pointer shadow-xs"
                              title="Cetak Dokumen BAP"
                              aria-label="Cetak Dokumen BAP"
                            >
                              <Printer className="w-3.5 h-3.5" />
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
