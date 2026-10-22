import { SportCode } from './index';

export type RegistrationStep = 'team' | 'officials' | 'roster' | 'documents' | 'success';

export interface RegisteredPlayer {
  id: string;
  name: string;
  number: number;
  position: string;
  nisn: string;
  birthDate?: string;
  photoUrl?: string;
}

export interface TeamRegistrationData {
  // 1. Identitas Tim & Sekolah
  sportCode: SportCode;
  category: string;
  teamName: string;
  shortName: string;
  schoolName: string;
  city: string;
  jerseyHomeColor: string;
  jerseyAwayColor: string;
  logoUrl?: string;

  // 2. Data Manajer & Pelatih (Official)
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  headCoachName: string;
  headCoachPhone: string;
  assistantCoachName?: string;

  // 3. Roster Pemain
  players: RegisteredPlayer[];

  // 4. Berkas Persyaratan & Pernyataan
  hasRecommendationLetter: boolean;
  dapodikVerified: boolean;
  fairPlayAgreed: boolean;
  notes?: string;

  // 5. Informasi Registrasi Berhasil
  regCode?: string;
  submittedAt?: string;
  status?: 'PENDING_VERIFICATION' | 'APPROVED' | 'REVISION_NEEDED';
}
