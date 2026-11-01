'use client';

import React from 'react';
import { ShieldAlert, Scale, Save } from 'lucide-react';

interface MatchProtocolsTabProps {
  woScoreA: number;
  setWoScoreA: (val: number) => void;
  woScoreB: number;
  lateToleranceMinutes: number;
  setLateToleranceMinutes: (val: number) => void;
  bapVerificationMode: 'MANUAL' | 'AUTO';
  setBapVerificationMode: (mode: 'MANUAL' | 'AUTO') => void;
  allowOvertimeInGroup: boolean;
  setAllowOvertimeInGroup: (val: boolean) => void;
  handleSave: () => void;
}

export const MatchProtocolsTab: React.FC<MatchProtocolsTabProps> = ({
  woScoreA,
  setWoScoreA,
  woScoreB,
  lateToleranceMinutes,
  setLateToleranceMinutes,
  bapVerificationMode,
  setBapVerificationMode,
  allowOvertimeInGroup,
  setAllowOvertimeInGroup,
  handleSave,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Walkover Settings */}
        <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h3 className="font-barlow font-bold uppercase tracking-wider text-base text-[var(--text-main)]">
              Ketentuan Walkover (WO)
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-[var(--text-main)] block mb-1">
                Skor Default Kemenangan WO
              </label>
              <p className="text-xs text-[var(--text-muted)] mb-3">
                Skor otomatis yang diberikan kepada tim lawan saat sebuah tim dinyatakan Walkover (WO)
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--text-muted)]">Pemenang:</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={woScoreA}
                    onChange={(e) => setWoScoreA(Number(e.target.value))}
                    className="w-16 px-3 py-1.5 text-center text-sm font-bold rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-main)]"
                  />
                </div>
                <span className="text-sm font-bold text-[var(--text-muted)]">-</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--text-muted)]">Kalah WO:</span>
                  <input
                    type="number"
                    min="0"
                    max="0"
                    value={woScoreB}
                    disabled
                    className="w-16 px-3 py-1.5 text-center text-sm font-bold rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]/50 text-[var(--text-muted)]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-[var(--text-main)] block">
                    Toleransi Waktu Keterlambatan Tim
                  </label>
                  <span className="text-xs text-[var(--text-muted)]">
                    Batas toleransi hadir di lapangan sebelum dinyatakan WO
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={lateToleranceMinutes}
                    onChange={(e) => setLateToleranceMinutes(Number(e.target.value))}
                    className="w-16 px-2.5 py-1.5 text-center text-sm font-bold rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-main)]"
                  />
                  <span className="text-xs text-[var(--text-muted)] font-medium">Menit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BAP & Match Verification Mode */}
        <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <Scale className="w-5 h-5 text-[var(--color-arena-primary)]" />
            <h3 className="font-barlow font-bold uppercase tracking-wider text-base text-[var(--text-main)]">
              Validasi Hasil &amp; Berita Acara (BAP)
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-[var(--text-main)] block mb-2">
                Metode Verifikasi Skor ke Publik
              </label>
              <div className="space-y-2.5">
                <label
                  onClick={() => setBapVerificationMode('MANUAL')}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    bapVerificationMode === 'MANUAL'
                      ? 'border-[var(--color-arena-primary)] bg-[var(--color-arena-primary)]/5'
                      : 'border-[var(--border-subtle)] hover:border-[var(--border-subtle)]'
                  }`}
                >
                  <input
                    type="radio"
                    name="bapMode"
                    checked={bapVerificationMode === 'MANUAL'}
                    onChange={() => setBapVerificationMode('MANUAL')}
                    className="mt-1"
                  />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block text-[var(--text-main)]">
                      Verifikasi Pengawas Manual (Disarankan)
                    </span>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Hasil skor dari juri lapangan harus divalidasi dan ditandatangani Pengawas Pertandingan sebelum resmi masuk ke klasemen publik.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setBapVerificationMode('AUTO')}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    bapVerificationMode === 'AUTO'
                      ? 'border-[var(--color-arena-primary)] bg-[var(--color-arena-primary)]/5'
                      : 'border-[var(--border-subtle)] hover:border-[var(--border-subtle)]'
                  }`}
                >
                  <input
                    type="radio"
                    name="bapMode"
                    checked={bapVerificationMode === 'AUTO'}
                    onChange={() => setBapVerificationMode('AUTO')}
                    className="mt-1"
                  />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block text-[var(--text-main)]">
                      Publikasi Otomatis (Instant Publish)
                    </span>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Skor langsung terverifikasi begitu juri menekan tombol &apos;Finalisasi BAP&apos; di konsol juri tanpa antrean moderasi.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-[var(--text-main)] block">
                  Babak Tambahan di Fase Grup
                </label>
                <span className="text-xs text-[var(--text-muted)]">
                  Perpanjangan waktu (Extra Time) jika skor imbang di babak grup
                </span>
              </div>
              <input
                type="checkbox"
                checked={allowOvertimeInGroup}
                onChange={(e) => setAllowOvertimeInGroup(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--color-arena-primary)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          className="btn-tactile px-6 py-2.5 rounded-xl bg-[var(--color-arena-primary)] text-white font-barlow font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Protokol &amp; Kebijakan</span>
        </button>
      </div>
    </div>
  );
};

