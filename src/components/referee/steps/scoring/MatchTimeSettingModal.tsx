'use client';

import React, { useState, useEffect } from 'react';
import { Clock, X, Check } from 'lucide-react';

interface MatchTimeSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSeconds: number;
  adminDurationMinutes?: number;
  onApplyTime: (seconds: number) => void;
}

export const MatchTimeSettingModal: React.FC<MatchTimeSettingModalProps> = ({
  isOpen,
  onClose,
  initialSeconds,
  adminDurationMinutes = 20,
  onApplyTime,
}) => {
  const [inputMinutes, setInputMinutes] = useState(Math.floor(initialSeconds / 60));
  const [inputSeconds, setInputSeconds] = useState(initialSeconds % 60);

  useEffect(() => {
    if (isOpen) {
      setInputMinutes(Math.floor(initialSeconds / 60));
      setInputSeconds(initialSeconds % 60);
    }
  }, [isOpen, initialSeconds]);

  if (!isOpen) return null;

  const handleApplyCustomTime = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSecs = Math.max(0, Number(inputMinutes) * 60 + Number(inputSeconds));
    onApplyTime(totalSecs);
    onClose();
  };

  const handleQuickPreset = (minutes: number) => {
    setInputMinutes(minutes);
    setInputSeconds(0);
    onApplyTime(minutes * 60);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-[var(--bg-surface)] border-2 border-slate-300 dark:border-slate-800 p-5 space-y-4 text-[var(--text-main)] shadow-2xl animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1D63B8] dark:text-sky-400" />
            <h4 className="font-bebas text-lg uppercase tracking-wide text-[var(--text-main)]">
              Atur Waktu Pertandingan
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleApplyCustomTime} className="space-y-4">
          {/* Preset Cepat */}
          <div>
            <label className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">
              Preset Cepat (Menit):
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[10, 12, 15, adminDurationMinutes].map((mins, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickPreset(mins)}
                  className={`btn-tactile py-2 px-2 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                    inputMinutes === mins && inputSeconds === 0
                      ? 'bg-[#1D63B8] text-white border-transparent shadow-xs'
                      : 'bg-[var(--bg-muted)] hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--text-main)] border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Input Manual Menit & Detik */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              Set Waktu Manual:
            </label>
            <div className="flex items-center justify-center gap-2 bg-[var(--bg-muted)] p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Menit
                </span>
                <input
                  type="number"
                  min={0}
                  max={90}
                  value={inputMinutes}
                  onChange={(e) => setInputMinutes(Math.max(0, Number(e.target.value)))}
                  className="w-16 text-center text-3xl font-teko font-bold bg-[var(--bg-surface)] border border-slate-300 dark:border-slate-600 rounded-lg py-1 text-[var(--text-main)] focus:outline-none focus:border-[#1D63B8]"
                />
              </div>
              <span className="text-2xl font-bold text-[#1D63B8] dark:text-sky-400 pt-3">:</span>
              <div className="text-center">
                <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Detik
                </span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={inputSeconds}
                  onChange={(e) => setInputSeconds(Math.max(0, Math.min(59, Number(e.target.value))))}
                  className="w-16 text-center text-3xl font-teko font-bold bg-[var(--bg-surface)] border border-slate-300 dark:border-slate-600 rounded-lg py-1 text-[var(--text-main)] focus:outline-none focus:border-[#1D63B8]"
                />
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-sky-950/40 border border-blue-200 dark:border-sky-800 text-[11px] text-[#1D63B8] dark:text-sky-300 flex items-center justify-between">
            <span>Default Pengaturan Admin:</span>
            <span className="font-mono font-bold text-[var(--text-main)]">{adminDurationMinutes} Menit</span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickPreset(adminDurationMinutes)}
              className="btn-tactile flex-1 py-2.5 rounded-lg bg-[var(--bg-muted)] hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer min-h-[42px]"
            >
              Reset ke Admin
            </button>
            <button
              type="submit"
              className="btn-tactile flex-1 py-2.5 rounded-lg bg-[#1D63B8] hover:bg-[#154D92] text-white text-xs font-barlow font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer min-h-[42px]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Terapkan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

