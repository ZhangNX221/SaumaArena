'use client';

import React, { useState } from 'react';
import { ShieldAlert, Edit3 } from 'lucide-react';
import { initialMatches } from '@/mocks/tournamentData';
import { Match } from '@/types';

interface LiveScoreOverrideTabProps {
  onOpenLiveScoreControl?: (match: Match) => void;
}

export const LiveScoreOverrideTab: React.FC<LiveScoreOverrideTabProps> = ({ onOpenLiveScoreControl }) => {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [overrideModalMatch, setOverrideModalMatch] = useState<Match | null>(null);
  const [overrideScoreA, setOverrideScoreA] = useState(0);
  const [overrideScoreB, setOverrideScoreB] = useState(0);

  const handleOpenOverride = (m: Match) => {
    setOverrideModalMatch(m);
    setOverrideScoreA(m.scoreA);
    setOverrideScoreB(m.scoreB);
  };

  const handleSaveOverride = () => {
    if (!overrideModalMatch) return;
    setMatches((prev) =>
      prev.map((m) =>
        m.id === overrideModalMatch.id
          ? { ...m, scoreA: overrideScoreA, scoreB: overrideScoreB }
          : m
      )
    );
    alert(`Admin Override Berhasil: Skor laga #${overrideModalMatch.matchNumber} diperbarui menjadi ${overrideScoreA} - ${overrideScoreB}`);
    setOverrideModalMatch(null);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Hak Override Admin:</strong> Gunakan fitur ini jika tablet juri di lapangan mengalami gangguan koneksi, kehabisan baterai, atau terjadi sanksi diskualifikasi darurat.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((m) => (
          <div
            key={m.id}
            className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--color-arena-primary)]">Laga #{m.matchNumber} &bull; {m.courtName}</span>
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${m.status === 'LIVE' ? 'bg-red-500/20 text-red-600' : 'bg-slate-100 text-slate-700'}`}>
                {m.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-base font-black text-[var(--text-main)] py-2">
              <div className="truncate max-w-[140px]">{m.teamAName}</div>
              <div className="font-mono text-2xl text-[#f6ae2d] px-3">
                {m.scoreA} : {m.scoreB}
              </div>
              <div className="truncate max-w-[140px] text-right">{m.teamBName}</div>
            </div>

            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (onOpenLiveScoreControl) onOpenLiveScoreControl(m);
                  else alert(`Membuka monitor meja juri laga #${m.matchNumber}`);
                }}
                className="btn-tactile text-xs font-bold text-[var(--color-arena-primary)] hover:underline"
              >
                Buka Papan Meja Juri
              </button>
              <button
                type="button"
                onClick={() => handleOpenOverride(m)}
                className="btn-tactile px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Admin Override Skor</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Override Modal */}
      {overrideModalMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-black text-base text-red-600 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                <span>Admin Override Skor Laga #{overrideModalMatch.matchNumber}</span>
              </h3>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Perubahan paksa skor ini akan langsung menggantikan data di perangkat juri dan memicu pembaruan klasemen publik secara instan.
            </p>

            <div className="grid grid-cols-2 gap-4 py-2 text-center">
              <div className="space-y-1.5">
                <span className="font-bold text-xs truncate block">{overrideModalMatch.teamAName}</span>
                <input
                  type="number"
                  min="0"
                  value={overrideScoreA}
                  onChange={(e) => setOverrideScoreA(parseInt(e.target.value) || 0)}
                  className="w-full text-center text-3xl font-black font-mono p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]"
                />
              </div>
              <div className="space-y-1.5">
                <span className="font-bold text-xs truncate block">{overrideModalMatch.teamBName}</span>
                <input
                  type="number"
                  min="0"
                  value={overrideScoreB}
                  onChange={(e) => setOverrideScoreB(parseInt(e.target.value) || 0)}
                  className="w-full text-center text-3xl font-black font-mono p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                onClick={handleSaveOverride}
                className="btn-tactile flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs"
              >
                Simpan Override
              </button>
              <button
                type="button"
                onClick={() => setOverrideModalMatch(null)}
                className="btn-tactile px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-semibold"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
