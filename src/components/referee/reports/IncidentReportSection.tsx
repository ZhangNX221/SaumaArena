'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Match } from '@/types';
import { IncidentReport } from '@/mocks/refereeReportsData';

interface IncidentReportSectionProps {
  matches: Match[];
  incidentReports: IncidentReport[];
  onAddIncident: (report: IncidentReport) => void;
}

export const IncidentReportSection: React.FC<IncidentReportSectionProps> = ({
  matches,
  incidentReports,
  onAddIncident,
}) => {
  const [selectedMatch, setSelectedMatch] = useState<string>(matches[0]?.id || 'match-101');
  const [incidentMinute, setIncidentMinute] = useState('18');
  const [incidentType, setIncidentType] = useState('PROTES_OFFICIAL');
  const [incidentDetails, setIncidentDetails] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentDetails.trim()) return;

    const matchObj = matches.find((m) => m.id === selectedMatch) || matches[0];
    const matchTitle = matchObj
      ? `${matchObj.teamAName} vs ${matchObj.teamBName} (Laga #${matchObj.matchNumber || 1})`
      : selectedMatch;

    const newReport: IncidentReport = {
      id: `inc-${Date.now()}`,
      matchTitle,
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

    onAddIncident(newReport);
    setIncidentDetails('');
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3500);
  };

  return (
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--text-main)]">
                Pilih Laga Pertandingan ({matches.length} Laga Tersedia)
              </label>
              <select
                value={selectedMatch}
                onChange={(e) => setSelectedMatch(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-main)] transition-colors focus:border-[var(--color-arena-primary)] cursor-pointer"
              >
                {matches.map((m) => (
                  <option key={m.id} value={m.id}>
                    Laga #{m.matchNumber || m.id}: {m.teamAName} vs {m.teamBName} {m.group ? `(Grup ${m.group})` : ''} - Skor: {m.scoreA}-{m.scoreB}
                  </option>
                ))}
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
  );
};

