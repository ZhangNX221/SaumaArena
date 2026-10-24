export type PartnerCategory =
  | 'ORGANIZER'
  | 'GOVERNMENT'
  | 'FEDERATION'
  | 'SPONSOR'
  | 'COMMUNITY'
  | 'MEDIA';

export type PartnerIconType =
  | 'award'      // Panitia / Penyelenggara Utama
  | 'shield'     // Kemenag / Pelindung & Pembina
  | 'building'   // Komite MTsN / Dewan Komite Sekolah
  | 'flame'      // OSIS Matsanega / Organisasi Siswa
  | 'futsal'     // Asosiasi Futsal / AFK
  | 'trophy'     // Dispora Kota Malang / Dinas Olahraga
  | 'logo'       // Sauma Arena Ecosystem
  | 'bank'       // Bank Jatim Syariah / Perbankan
  | 'custom';    // Logo URL kustom

export interface TournamentPartner {
  id: string;
  name: string;
  role: string;
  category: PartnerCategory;
  iconType: PartnerIconType;
  logoUrl?: string;
  websiteUrl?: string;
  isActive: boolean;
  order: number;
  description?: string;
}
