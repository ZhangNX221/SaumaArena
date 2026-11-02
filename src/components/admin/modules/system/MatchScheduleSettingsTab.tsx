'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Save,
  Edit2,
  CheckCircle2,
  Search,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Match } from '@/types';
import { initialMatches, TOURNAMENT_RUNDOWN } from '@/mocks/tournamentData';
import { usePersistentState } from '@/hooks/usePersistentState';
import { pushMatchToBackend } from '@/lib/apiSync';
import { MatchScheduleEditModal } from './MatchScheduleEditModal';

export const MatchScheduleSettingsTab: React.FC = () => {
  const [matches, setMatches] = usePersistentState<Match[]>('sauma_arena_matches', initialMatches);
  const [search, setSearch] = useState('');
  const [dayFilter, setDayFilter] = useState<'ALL' | 'H1' | 'H2'>('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1-Klik Sinkronisasi Total dengan TABEL RUNDOWN
  const handleSyncFromRundown = async () => {
    setIsSyncing(true);
    let changedCount = 0;

    try {
      const synced = matches.map((m) => {
        const rd = TOURNAMENT_RUNDOWN.find((r) => r.matchCode === `P${m.matchNumber}`);
        if (!rd) return m;

        const formattedTime = rd.time.replace(/\./g, ':');
        const standardScheduled = `${rd.dayDate} • ${formattedTime} WIB (${rd.matchCode} • ${rd.agendaCode})`;

        const vsParts = rd.detail.includes(' vs ') ? rd.detail.split(/\s+vs\s+/i) : null;
        const teamAName = vsParts?.[0] || m.teamAName;
        const teamBName = vsParts?.[1] || m.teamBName;

        changedCount++;
        return {
          ...m,
          scheduledTime: standardScheduled,
          courtName: m.courtName || 'Lapangan Futsal Seabless',
          teamAName,
          teamBName,
        };
      });

      setMatches(synced);

      for (const sm of synced) {
        await pushMatchToBackend(sm);
      }

      showToast(`Sukses! ${changedCount} pertandingan (P1-P17) berhasil disamakan 100% dengan Tabel Rundown Resmi!`);
    } catch (err) {
      console.error('[handleSyncFromRundown] Error:', err);
      showToast('Terjadi kesalahan saat menyinkronkan jadwal pertandingan.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveModal = async (updated: Match) => {
    try {
      setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      await pushMatchToBackend(updated);
      showToast(`Jadwal Laga #${updated.matchNumber} (${updated.teamAName} vs ${updated.teamBName}) berhasil disimpan!`);
    } catch (err) {
      console.error('[handleSaveModal] Error:', err);
      showToast(`Gagal menyimpan jadwal Laga #${updated.matchNumber}.`);
    } finally {
      setEditingMatch(null);
    }
  };

  const handleSaveAllToDatabase = async () => {
    setIsSaving(true);
    try {
      for (const m of matches) {
        await pushMatchToBackend(m);
      }
      showToast('Seluruh jadwal pertandingan berhasil disimpan permanen ke database SQLite!');
    } catch (err) {
      console.error('[handleSaveAllToDatabase] Error:', err);
      showToast('Terjadi kendala saat menyimpan semua jadwal ke database.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const matchSearch =
        m.teamAName.toLowerCase().includes(search.toLowerCase()) ||
        m.teamBName.toLowerCase().includes(search.toLowerCase()) ||
        String(m.matchNumber).includes(search) ||
        (m.scheduledTime && m.scheduledTime.toLowerCase().includes(search.toLowerCase()));

      const matchDay =
        dayFilter === 'ALL'
          ? true
          : dayFilter === 'H1'
          ? m.matchNumber <= 10
          : m.matchNumber > 10;

      const matchStage = stageFilter === 'ALL' || m.stage === stageFilter;
      return matchSearch && matchDay && matchStage;
    });
  }, [matches, search, dayFilter, stageFilter]);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Tersinkron Database
          </span>
        </div>
      )}

      {/* Action Strip: Sinkronisasi Rundown & Simpan Database */}
      <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bebas text-xl sm:text-2xl text-[var(--text-main)] uppercase tracking-wide flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[var(--color-arena-primary)] shrink-0" />
            <span>Pengaturan Jadwal Pertandingan &amp; Rundown</span>
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 max-w-xl">
            Atur alokasi jam tanding, hari pelaksanaan, dan pastikan jam per pertandingan sama persis dengan Tabel Rundown Resmi Turnamen.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            disabled={isSyncing}
            onClick={handleSyncFromRundown}
            className="btn-tactile px-4 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] active:scale-[0.98] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 transition-all min-h-[40px]"
            title="Isi & samakan semua waktu tanding dengan TABEL RUNDOWN resmi"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Samakan Jadwal Dengan Rundown'}</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAllToDatabase}
            className="btn-tactile px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-barlow font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 transition-all min-h-[40px]"
            title="Simpan perubahan jadwal ke SQLite"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan ke Database'}</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Cari partai, tim, atau jam..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 focus:bg-[var(--bg-surface)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-arena-primary)] transition-all font-sans"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={dayFilter}
              onChange={(e) => setDayFilter(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--color-arena-primary)] font-barlow font-bold uppercase tracking-wider"
            >
              <option value="ALL">Semua Hari (H1 &amp; H2)</option>
              <option value="H1">HARI-1 (Senin, 2 Nov • P1-P10)</option>
              <option value="H2">HARI-2 (Selasa, 3 Nov • P11-P17)</option>
            </select>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--color-arena-primary)] font-barlow font-bold uppercase tracking-wider"
            >
              <option value="ALL">Semua Babak</option>
              <option value="GROUP">Penyisihan Grup</option>
              <option value="SEMI_FINAL">4 Besar (Semifinal)</option>
              <option value="FINAL">Grand Final</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-[var(--text-muted)] font-mono">
          Menampilkan <span className="font-bold text-[var(--text-main)]">{filteredMatches.length}</span> dari {matches.length} Laga
        </div>
      </div>

      {/* Tabel Pengaturan Jadwal */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/70 text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)]">
              <th className="py-3.5 px-4 w-16 text-center">Partai</th>
              <th className="py-3.5 px-4">Waktu Kick-Off (Rundown)</th>
              <th className="py-3.5 px-4">Pertandingan Tim</th>
              <th className="py-3.5 px-4">Fase / Babak</th>
              <th className="py-3.5 px-4">Lapangan / Venue</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] font-sans">
            {filteredMatches.map((m) => {
              const rd = TOURNAMENT_RUNDOWN.find((r) => r.matchCode === `P${m.matchNumber}`);
              const timeDisplay = rd ? `${rd.time.replace(/\./g, ':')} WIB` : '07:30 - 08:00 WIB';

              return (
                <tr key={m.id} className="hover:bg-[var(--bg-muted)]/40 transition-colors">
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-[var(--color-arena-dark)] text-white">
                      P{m.matchNumber}
                    </span>
                    <span className="block text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">
                      #{m.matchNumber}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <div className="flex items-center gap-1.5 font-bold text-[var(--color-arena-primary)] dark:text-sky-400">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{timeDisplay}</span>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      {rd ? rd.dayDate : 'Senin, 2 Nov 2026'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bebas text-base uppercase tracking-wide text-[var(--text-main)]">
                      {m.teamAName} <span className="text-[var(--color-arena-accent)]">vs</span> {m.teamBName}
                    </div>
                    {rd && (
                      <div className="text-[11px] font-mono text-[var(--text-muted)]">
                        Agenda: {rd.agendaCode} &bull; {rd.notes}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-[var(--bg-muted)] text-[var(--text-muted)] font-barlow font-bold uppercase text-[10px] border border-[var(--border-subtle)]">
                      {m.stage === 'GROUP' ? `Grup ${m.group}` : m.stage === 'SEMI_FINAL' ? '4 Besar' : m.stage}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)]">
                    <div className="flex items-center gap-1 font-semibold text-[var(--text-main)]">
                      <MapPin className="w-3.5 h-3.5 text-[var(--color-arena-accent)] shrink-0" />
                      <span>{m.courtName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-barlow font-bold uppercase tracking-wider ${
                        m.status === 'LIVE'
                          ? 'bg-red-500/15 text-red-600 dark:text-red-400 animate-pulse'
                          : m.status === 'COMPLETED'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {m.status === 'LIVE' ? 'Live' : m.status === 'COMPLETED' ? 'Selesai' : 'Terjadwal'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setEditingMatch(m)}
                      className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                      title="Edit Jadwal & Waktu Laga"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Edit Jadwal Individual */}
      {editingMatch && (
        <MatchScheduleEditModal
          match={editingMatch}
          onClose={() => setEditingMatch(null)}
          onSave={handleSaveModal}
        />
      )}
    </div>
  );
};
