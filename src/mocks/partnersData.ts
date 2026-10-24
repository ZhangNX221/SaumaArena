import { TournamentPartner, PartnerCategory } from '@/types';

export const DEFAULT_TOURNAMENT_PARTNERS: TournamentPartner[] = [
  {
    id: 'partner-1',
    name: 'Panitia Milad Matsanega',
    role: 'Penyelenggara Utama',
    category: 'ORGANIZER',
    iconType: 'award',
    websiteUrl: '',
    isActive: true,
    order: 1,
    description: 'Komite panitia pelaksana Milad Matsanega Futsal Competition',
  },
  {
    id: 'partner-2',
    name: 'Kemenag Kota Malang',
    role: 'Pelindung & Pembina',
    category: 'GOVERNMENT',
    iconType: 'shield',
    websiteUrl: '',
    isActive: true,
    order: 2,
    description: 'Kantor Kementerian Agama Kota Malang selaku instansi pembina madrasah',
  },
  {
    id: 'partner-3',
    name: 'Komite MTsN 1 Malang',
    role: 'Dewan Komite Sekolah',
    category: 'COMMUNITY',
    iconType: 'building',
    websiteUrl: '',
    isActive: true,
    order: 3,
    description: 'Dewan Komite Madrasah Tsanawiyah Negeri 1 Kota Malang',
  },
  {
    id: 'partner-4',
    name: 'OSIS Matsanega',
    role: 'Organisasi Siswa',
    category: 'COMMUNITY',
    iconType: 'flame',
    websiteUrl: '',
    isActive: true,
    order: 4,
    description: 'Organisasi Siswa Intra Sekolah MTsN 1 Kota Malang',
  },
  {
    id: 'partner-5',
    name: 'Asosiasi Futsal / AFK',
    role: 'Federasi & Juri Resmi',
    category: 'FEDERATION',
    iconType: 'futsal',
    websiteUrl: '',
    isActive: true,
    order: 5,
    description: 'Asosiasi Futsal Kota Malang - Pengawas & Wasit Berlisensi Resmi',
  },
  {
    id: 'partner-6',
    name: 'Dispora Kota Malang',
    role: 'Dinas Olahraga Kota',
    category: 'GOVERNMENT',
    iconType: 'trophy',
    websiteUrl: '',
    isActive: true,
    order: 6,
    description: 'Dinas Kepemudaan, Olahraga, dan Pariwisata Pemerintah Kota Malang',
  },
  {
    id: 'partner-7',
    name: 'Sauma Arena Ecosystem',
    role: 'Official Multi-Sport Platform',
    category: 'SPONSOR',
    iconType: 'logo',
    websiteUrl: 'https://sauma.id',
    isActive: true,
    order: 7,
    description: 'Platform digital manajemen kompetisi olahraga, bagan & live score',
  },
  {
    id: 'partner-8',
    name: 'Bank Jatim Syariah',
    role: 'Mitra Perbankan & Tiket',
    category: 'SPONSOR',
    iconType: 'bank',
    websiteUrl: 'https://bankjatim.co.id',
    isActive: true,
    order: 8,
    description: 'Mitra perbankan resmi dan gerbang pembayaran tiket masuk turnamen',
  },
];

export const STORAGE_KEY_PARTNERS = 'sauma_arena_tournament_partners';

export const PARTNER_CATEGORY_LABELS: Record<PartnerCategory, { label: string; badgeClass: string }> = {
  ORGANIZER: {
    label: 'Penyelenggara',
    badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30',
  },
  GOVERNMENT: {
    label: 'Instansi / Pembina',
    badgeClass: 'bg-green-600/15 text-green-700 dark:text-green-400 border border-green-600/30',
  },
  FEDERATION: {
    label: 'Federasi Olahraga',
    badgeClass: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30',
  },
  SPONSOR: {
    label: 'Sponsor & Finansial',
    badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30',
  },
  COMMUNITY: {
    label: 'Komite & Siswa',
    badgeClass: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30',
  },
  MEDIA: {
    label: 'Media Partner',
    badgeClass: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30',
  },
};

export function getStoredPartners(): TournamentPartner[] {
  if (typeof window === 'undefined') return DEFAULT_TOURNAMENT_PARTNERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PARTNERS);
    if (!raw) return DEFAULT_TOURNAMENT_PARTNERS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return [...parsed].sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  } catch {
    // fallback to default
  }
  return DEFAULT_TOURNAMENT_PARTNERS;
}

export function saveStoredPartners(partners: TournamentPartner[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PARTNERS, JSON.stringify(partners));
    window.dispatchEvent(new CustomEvent('sauma_partners_updated', { detail: partners }));
  } catch (e) {
    console.error('Gagal menyimpan data mitra ke storage:', e);
  }
}

export function resetStoredPartners(): TournamentPartner[] {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY_PARTNERS);
      window.dispatchEvent(new CustomEvent('sauma_partners_updated', { detail: DEFAULT_TOURNAMENT_PARTNERS }));
    } catch (e) {
      console.error('Gagal mereset data mitra:', e);
    }
  }
  return DEFAULT_TOURNAMENT_PARTNERS;
}
