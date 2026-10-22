'use client';

import React from 'react';
import { FileCheck, UploadCloud, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { TeamRegistrationData } from '@/types/registration';

interface StepDocumentsProps {
  data: TeamRegistrationData;
  onChange: (fields: Partial<TeamRegistrationData>) => void;
}

export const StepDocuments: React.FC<StepDocumentsProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h4 className="font-extrabold text-base text-[var(--text-main)] font-[var(--font-display)] flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[var(--color-arena-primary)]" />
          <span>Langkah 4: Berkas Persyaratan &amp; Pernyataan Fair Play</span>
        </h4>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Tahap akhir verifikasi kelayakan administratif sebelum formulir didelegasikan ke panitia seleksi turnamen.
        </p>
      </div>

      {/* Upload Berkas Surat Rekomendasi Sekolah */}
      <div className="p-4 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-3">
        <label className="block text-xs font-bold text-[var(--text-main)]">
          Surat Tugas / Rekomendasi Kepala Sekolah (PDF / Gambar) <span className="text-red-500">*</span>
        </label>
        <div
          onClick={() => onChange({ hasRecommendationLetter: !data.hasRecommendationLetter })}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            data.hasRecommendationLetter
              ? 'border-emerald-500 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300'
              : 'border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)] bg-[var(--bg-surface)] text-[var(--text-muted)]'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            {data.hasRecommendationLetter ? (
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[var(--bg-muted)] text-[var(--color-arena-primary)] flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
            )}
            <div className="font-bold text-xs text-[var(--text-main)]">
              {data.hasRecommendationLetter
                ? 'Surat Tugas Resmi Sekolah Terlampir (Sah)'
                : 'Klik untuk melampirkan file surat rekomendasi sekolah'}
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Format yang didukung: PDF, JPG, atau PNG (Maks 3 MB).
            </p>
          </div>
        </div>
      </div>

      {/* Lembar Pernyataan & Kepatuhan Turnamen */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-[var(--text-main)] block">
          Pakta Integritas &amp; Verifikasi Keabsahan Atlet
        </span>

        <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)]/50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={data.dapodikVerified}
            onChange={(e) => onChange({ dapodikVerified: e.target.checked })}
            className="mt-0.5 w-4 h-4 rounded text-[var(--color-arena-primary)] focus:ring-[var(--color-arena-primary)] border-[var(--border-subtle)]"
          />
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-[var(--text-main)] block">
              Keabsahan Data Pokok Siswa (Dapodik / EMIS)
            </span>
            <span className="text-[var(--text-muted)] text-[11px]">
              Saya menyatakan bahwa seluruh atlet yang didaftarkan berstatus siswa aktif sekolah bersangkutan dan berusia sesuai batasan kategori kompetisi (10-12 tahun).
            </span>
          </div>
        </label>

        <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)]/50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={data.fairPlayAgreed}
            onChange={(e) => onChange({ fairPlayAgreed: e.target.checked })}
            className="mt-0.5 w-4 h-4 rounded text-[var(--color-arena-primary)] focus:ring-[var(--color-arena-primary)] border-[var(--border-subtle)]"
          />
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-[var(--text-main)] block">
              Kepatuhan Fair Play &amp; Disiplin Suporter Tribun
            </span>
            <span className="text-[var(--text-muted)] text-[11px]">
              Kontingen bersedia mematuhi aturan pertandingan, menghormati keputusan wasit/juri FFI, serta bertanggung jawab menjaga ketertiban suporter sekolah di tribun arena.
            </span>
          </div>
        </label>
      </div>

      {/* Catatan Khusus Delegasi */}
      <div>
        <label htmlFor="reg-notes" className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
          Catatan Tambahan untuk Panitia Pelaksana (Opsional)
        </label>
        <textarea
          id="reg-notes"
          rows={3}
          placeholder="Tuliskan catatan khusus kontingen (misal: jadwal kedatangan delegasi luar kota atau permintaan khusus kostum)..."
          value={data.notes || ''}
          onChange={(e) => onChange({ notes: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)] text-xs sm:text-sm font-medium transition-all"
        />
      </div>
    </div>
  );
};
