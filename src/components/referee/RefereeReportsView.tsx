'use client';

import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  Download,
  Eye,
} from 'lucide-react';
import { AppUser } from '@/types';
import { BAPRecord, IncidentReport, INITIAL_BAPS, INITIAL_INCIDENTS } from '@/mocks/refereeReportsData';
import { usePersistentState } from '@/hooks/usePersistentState';
import { BAPPreviewModal } from './reports/BAPPreviewModal';

interface RefereeReportsViewProps {
  user: AppUser;
}

export const RefereeReportsView: React.FC<RefereeReportsViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'BAP_LIST' | 'INCIDENT_FORM'>('BAP_LIST');
  const [bapList] = usePersistentState<BAPRecord[]>('sauma_arena_baps', INITIAL_BAPS);
  const [incidentReports, setIncidentReports] = usePersistentState<IncidentReport[]>('sauma_arena_incidents', INITIAL_INCIDENTS);

  // Form states
  const [selectedMatch, setSelectedMatch] = useState('match-101');
  const [incidentMinute, setIncidentMinute] = useState('18');
  const [incidentType, setIncidentType] = useState('PROTES_OFFICIAL');
  const [incidentDetails, setIncidentDetails] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [previewBapModal, setPreviewBapModal] = useState<BAPRecord | null>(null);

  const handleSubmitIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentDetails.trim()) return;

    const newReport: IncidentReport = {
      id: `inc-${Date.now()}`,
      matchTitle: selectedMatch === 'match-101' ? 'MIN 1 Kota vs MIS Al-Hidayah (Laga #1)' : 'SDN Percobaan 1 vs SDIT Bina Insani (Laga #2)',
      minute: Number(incidentMinute) || 0,
      incidentType:
        incidentType === 'PROTES_OFFICIAL'
          ? 'Protes Pelatih / Ofisial'
          : incidentType === 'CEDERA_PARAH'
          ? 'Cedera Pemain / Medis'
          : incidentType === 'KERIBUTAN'
          ? 'Kericuhan Penonton / Suporter'
          : 'Pelanggaran Disiplin Khusus',
      details: incidentDetails,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      status: 'SUBMITTED',
    };

    setIncidentReports((prev) => [newReport, ...prev]);
    setIncidentDetails('');
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#071F14] text-white border border-emerald-900/40 shadow-xs transition-all duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <h1 className="font-bebas text-3xl sm:text-4xl tracking-wide uppercase text-white leading-none">
              BERITA ACARA &amp; INSIDEN
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-sans">
              Arsip Berita Acara Pertandingan (BAP) yang telah sah serta formulir pelaporan kejadian khusus ke komisi disiplin.
            </p>
          </div>

          {/* Segmented Mode Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#04120C] border border-[#143D28] shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('BAP_LIST')}
              className={`btn-tactile px-4 py-2 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                activeTab === 'BAP_LIST'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Rekap BAP ({bapList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('INCIDENT_FORM')}
              className={`btn-tactile px-4 py-2 rounded-lg font-barlow font-bold uppercase tracking-wider text-xs transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                activeTab === 'INCIDENT_FORM'
                  ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lapor Insiden
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sub-tab 1: Rekap BAP Selesai - Card Tabel */}
      {activeTab === 'BAP_LIST' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-bebas text-xl sm:text-2xl text-[var(--text-main)] uppercase tracking-wide">
              Daftar Berita Acara Sah
            </h2>
            <span className="text-xs text-[var(--text-muted)] font-barlow font-bold uppercase tracking-wider">
              Tersinkron Otomatis
            </span>
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
                    <th className="py-3.5 px-4 text-center">Skor Akhir</th>
                    <th className="py-3.5 px-4">Tanggal &amp; Waktu</th>
                    <th className="py-3.5 px-4 text-center">Status BAP</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] font-medium text-[var(--text-main)]">
                  {bapList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 px-4 text-center">
                        <div className="max-w-md mx-auto space-y-3 flex flex-col items-center">
                          <div className="w-14 h-14 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)]">
                            <FileCheck className="w-7 h-7 text-[var(--color-arena-primary)]" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bebas text-xl text-[var(--text-main)] uppercase tracking-wide">
                              Belum Ada Berita Acara Pertandingan
                            </h4>
                            <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
                              Tabel Berita Acara Pertandingan (BAP) masih kosong. Dokumen sah akan tercatat dan tersinkronisasi otomatis di sini setelah pertandingan disahkan oleh wasit.
                            </p>
                          </div>
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] text-[11px] font-barlow font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-arena-primary)] animate-pulse" />
                            <span>Menunggu Pengesahan Laga Wasit</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    bapList.map((b) => (
                      <tr key={b.id} className="hover:bg-[var(--bg-muted)]/30 transition-colors">
                        <td className="py-4 px-4 font-mono">
                          <span className="font-mono text-xs font-bold text-[var(--color-arena-primary)] px-2.5 py-1 rounded-md bg-[var(--color-arena-primary-light)]">
                            #{b.matchNumber}
                          </span>
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
                            Wasit: {b.referee1} {b.referee2 ? `& ${b.referee2}` : ''}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-scoreboard text-lg text-[var(--color-arena-accent)] font-bold">
                            {b.score}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs text-[var(--text-muted)] font-mono">{b.date}</div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>BAP Sah</span>
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewBapModal(b)}
                              className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider hover:bg-[var(--bg-surface)] active:scale-[0.98] transition-all cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
                              <span>Salinan</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => alert(`Mengunduh dokumen BAP resmi ${b.id}.pdf`)}
                              className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] active:scale-[0.98] text-white text-xs font-barlow font-bold uppercase tracking-wider transition-all cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>PDF</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Input */}
          <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
            <div className="border-b border-[var(--border-subtle)] pb-3">
              <h2 className="font-bebas text-xl sm:text-2xl text-[var(--text-main)] uppercase tracking-wide">
                Laporan Insiden Khusus
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
                Gunakan formulir ini untuk mencatat kejadian luar biasa yang membutuhkan tindak lanjut Komisi Disiplin.
              </p>
            </div>

            <form onSubmit={handleSubmitIncident} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--text-main)]">
                    Pilih Laga Pertandingan
                  </label>
                  <select
                    value={selectedMatch}
                    onChange={(e) => setSelectedMatch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] transition-colors focus:border-[var(--color-arena-primary)] cursor-pointer"
                  >
                    <option value="match-101">Laga #1: SDI KARDINA MASSA vs MIN 7 BLITAR</option>
                    <option value="match-102">Laga #2: UPT SDN 1 SRENGAT vs MIN 14 BLITAR</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--text-main)]">
                    Klasifikasi Kejadian
                  </label>
                  <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] transition-colors focus:border-[var(--color-arena-primary)] cursor-pointer"
                  >
                    <option value="PROTES_OFFICIAL">Protes Keras Pelatih / Ofisial</option>
                    <option value="CEDERA_PARAH">Cedera Berat Pemain (Rujuk Medis)</option>
                    <option value="KERIBUTAN">Kericuhan Penonton / Suporter</option>
                    <option value="PELANGGARAN_KODE_ETIK">Pelanggaran Kode Etik Lapangan</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--text-main)]">
                  Menit Terjadinya Kejadian
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={incidentMinute}
                    onChange={(e) => setIncidentMinute(e.target.value)}
                    className="w-20 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] font-mono font-bold text-center"
                  />
                  <span className="text-xs text-[var(--text-muted)]">Menit pertandingan berjalan</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--text-main)]">
                  Kronologi &amp; Tindakan yang Diambil
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Contoh: Menit 14 pelatih meminta klarifikasi terkait pelanggaran handsball di area penalti. Wasit memberikan penjelasan dan pertandingan dilanjutkan tanpa sanksi tambahan..."
                  value={incidentDetails}
                  onChange={(e) => setIncidentDetails(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] leading-relaxed placeholder:text-[var(--text-faint)] focus:border-[var(--color-arena-primary)] transition-colors"
                />
              </div>

              {submitSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Laporan insiden berhasil dikirimkan ke panitia pengawas pertandingan.</span>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="btn-tactile flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] active:scale-[0.98] text-white font-barlow font-bold uppercase tracking-wider text-xs transition-all duration-150 min-h-[44px] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim ke Panitia</span>
                </button>
              </div>
            </form>
          </div>

          {/* Riwayat Catatan Insiden */}
          <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3.5">
            <div className="border-b border-[var(--border-subtle)] pb-2.5">
              <h3 className="font-bebas text-lg text-[var(--text-main)] uppercase tracking-wide">
                Laporan Terkirim ({incidentReports.length})
              </h3>
            </div>

            <div className="space-y-2.5">
              {incidentReports.length === 0 ? (
                <div className="py-8 px-4 text-center rounded-xl bg-[var(--bg-muted)]/50 border border-dashed border-[var(--border-subtle)]">
                  <AlertTriangle className="w-6 h-6 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-[var(--text-muted)] font-medium">
                    Belum ada laporan insiden khusus yang dikirimkan.
                  </p>
                </div>
              ) : (
                incidentReports.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl bg-[var(--bg-muted)] text-xs space-y-1.5 border border-[var(--border-subtle)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-barlow font-bold uppercase tracking-wider text-red-500">
                        {r.incidentType}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--text-muted)]">
                        Menit ke-{r.minute}
                      </span>
                    </div>
                    <div className="font-semibold text-[var(--text-main)] text-xs">{r.matchTitle}</div>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-3 leading-relaxed font-sans">
                      {r.details}
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-[var(--text-muted)]">
                      <span className="font-mono">{r.timestamp}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                        {r.status === 'REVIEWED' ? 'Ditinjau Panitia' : 'Terkirim'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview Salinan BAP */}
      <BAPPreviewModal bap={previewBapModal} onClose={() => setPreviewBapModal(null)} />
    </div>
  );
};
