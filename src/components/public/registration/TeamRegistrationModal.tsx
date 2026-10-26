'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { RegistrationStep, TeamRegistrationData } from '@/types/registration';
import { StepTeamProfile } from './StepTeamProfile';
import { StepOfficials } from './StepOfficials';
import { StepRoster } from './StepRoster';
import { StepDocuments } from './StepDocuments';
import { StepRegistrationSlip } from './StepRegistrationSlip';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';
import { ModalPortal } from '@/components/common/ModalPortal';

interface TeamRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (registeredTeam: TeamRegistrationData) => void;
}

const INITIAL_FORM_DATA: TeamRegistrationData = {
  sportCode: 'FUTSAL',
  category: 'Pelajar SD/MI (Usia 10-12 Tahun)',
  teamName: '',
  shortName: '',
  schoolName: '',
  city: 'Kota Malang',
  jerseyHomeColor: '',
  jerseyAwayColor: '',
  managerName: '',
  managerPhone: '',
  managerEmail: '',
  headCoachName: '',
  headCoachPhone: '',
  players: [],
  hasRecommendationLetter: false,
  dapodikVerified: false,
  fairPlayAgreed: false,
};

const STEPS_CONFIG: { key: RegistrationStep; label: string; number: number }[] = [
  { key: 'team', label: 'Identitas Tim', number: 1 },
  { key: 'officials', label: 'Official', number: 2 },
  { key: 'roster', label: 'Roster Atlet', number: 3 },
  { key: 'documents', label: 'Berkas', number: 4 },
  { key: 'success', label: 'Bukti Pendaftaran', number: 5 },
];

export const TeamRegistrationModal: React.FC<TeamRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('team');
  const [formData, setFormData] = useState<TeamRegistrationData>(INITIAL_FORM_DATA);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const updateFormData = (fields: Partial<TeamRegistrationData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    setErrorMessage(null);
  };

  const currentStepIndex = STEPS_CONFIG.findIndex((s) => s.key === currentStep);

  const validateStep = (): boolean => {
    setErrorMessage(null);
    if (currentStep === 'team') {
      if (!formData.teamName.trim()) {
        setErrorMessage('Nama tim kontingen wajib diisi.');
        return false;
      }
      if (!formData.schoolName.trim()) {
        setErrorMessage('Asal sekolah atau madrasah wajib diisi.');
        return false;
      }
      if (!formData.shortName.trim()) {
        setErrorMessage('Nama singkat papan skor wajib diisi (maks. 6 huruf).');
        return false;
      }
      if (!formData.city.trim()) {
        setErrorMessage('Kota atau kabupaten asal kontingen wajib diisi.');
        return false;
      }
      if (!formData.jerseyHomeColor.trim()) {
        setErrorMessage('Warna seragam utama tim wajib diisi.');
        return false;
      }
    }

    if (currentStep === 'officials') {
      if (!formData.managerName.trim()) {
        setErrorMessage('Nama lengkap manajer tim wajib diisi.');
        return false;
      }
      if (!formData.managerPhone.trim() || formData.managerPhone.length < 9) {
        setErrorMessage('Nomor WhatsApp manajer yang aktif wajib diisi (minimal 9 digit).');
        return false;
      }
      if (!formData.managerEmail.trim() || !formData.managerEmail.includes('@')) {
        setErrorMessage('Alamat email manajer wajib valid.');
        return false;
      }
      if (!formData.headCoachName.trim()) {
        setErrorMessage('Nama pelatih kepala tim wajib diisi.');
        return false;
      }
    }

    if (currentStep === 'roster') {
      if (formData.players.length < 5) {
        setErrorMessage(`Skuad tim futsal minimal harus memiliki 5 pemain terdaftar (saat ini ${formData.players.length} pemain).`);
        return false;
      }
    }

    if (currentStep === 'documents') {
      if (!formData.hasRecommendationLetter) {
        setErrorMessage('Harap lampirkan surat tugas/rekomendasi resmi dari kepala sekolah.');
        return false;
      }
      if (!formData.dapodikVerified) {
        setErrorMessage('Harap setujui pernyataan keabsahan data pokok siswa (Dapodik/EMIS).');
        return false;
      }
      if (!formData.fairPlayAgreed) {
        setErrorMessage('Harap setujui komitmen kepatuhan regulasi fair play dan suporter turnamen.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (currentStep === 'team') setCurrentStep('officials');
    else if (currentStep === 'officials') setCurrentStep('roster');
    else if (currentStep === 'roster') setCurrentStep('documents');
    else if (currentStep === 'documents') {
      // Submit registration
      const regCode = `MMFC1-REG-2026-${Math.floor(100 + Math.random() * 900)}`;
      const completedData: TeamRegistrationData = {
        ...formData,
        regCode,
        submittedAt: new Date().toLocaleString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'PENDING_VERIFICATION',
      };
      setFormData(completedData);
      if (onSuccess) onSuccess(completedData);
      setCurrentStep('success');
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (currentStep === 'officials') setCurrentStep('team');
    else if (currentStep === 'roster') setCurrentStep('officials');
    else if (currentStep === 'documents') setCurrentStep('roster');
  };

  const handleResetAndClose = () => {
    setCurrentStep('team');
    setFormData(INITIAL_FORM_DATA);
    setErrorMessage(null);
    onClose();
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] max-w-3xl w-full p-5 sm:p-8 shadow-2xl space-y-6 my-auto animate-modalEnter">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <SaumaArenaLogo size="sm" variant="auto" />
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[var(--text-main)] font-[var(--font-display)] tracking-tight leading-tight">
                Pendaftaran Kontingen Tim
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">
                Milad Matsanega Futsal Competition I (MMFC I 2026)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="btn-tactile p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors"
            aria-label="Tutup formulir pendaftaran"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Wizard Indicator */}
        {currentStep !== 'success' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              {STEPS_CONFIG.filter((s) => s.key !== 'success').map((step, idx) => {
                const isActive = step.key === currentStep;
                const isPassed = currentStepIndex > idx;
                return (
                  <div key={step.key} className="flex-1 flex flex-col items-center relative">
                    {/* Step Circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all z-10 ${
                        isPassed
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isActive
                          ? 'bg-[var(--color-arena-primary)] text-white ring-4 ring-[var(--color-arena-primary-light)]'
                          : 'bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
                    </div>
                    {/* Step Label */}
                    <span
                      className={`text-[10px] font-bold mt-1 text-center hidden sm:block ${
                        isActive
                          ? 'text-[var(--color-arena-primary)]'
                          : isPassed
                          ? 'text-[var(--text-main)]'
                          : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Progress Track */}
            <div className="w-full bg-[var(--bg-muted)] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[var(--color-arena-primary)] h-full transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step Content Container */}
        <div className="py-1">
          {currentStep === 'team' && (
            <StepTeamProfile data={formData} onChange={updateFormData} />
          )}
          {currentStep === 'officials' && (
            <StepOfficials data={formData} onChange={updateFormData} />
          )}
          {currentStep === 'roster' && (
            <StepRoster data={formData} onChange={updateFormData} />
          )}
          {currentStep === 'documents' && (
            <StepDocuments data={formData} onChange={updateFormData} />
          )}
          {currentStep === 'success' && (
            <StepRegistrationSlip data={formData} onDone={handleResetAndClose} />
          )}
        </div>

        {/* Footer Actions (Next / Back Navigation) */}
        {currentStep !== 'success' && (
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--border-subtle)]">
            {currentStepIndex > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="btn-tactile px-4 py-2.5 rounded-xl text-xs font-bold border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors flex items-center gap-1.5 min-h-[42px]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResetAndClose}
                className="btn-tactile px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-muted)] transition-colors min-h-[42px]"
              >
                Batal
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="btn-tactile px-6 py-2.5 rounded-xl text-xs font-extrabold bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white shadow-xs transition-colors flex items-center gap-1.5 min-h-[42px]"
            >
              <span>{currentStep === 'documents' ? 'Kirim Pendaftaran Resmi' : 'Langkah Selanjutnya'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  </ModalPortal>
);
};
