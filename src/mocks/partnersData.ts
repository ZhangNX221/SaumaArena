import { TournamentPartner, PartnerCategory } from '@/types';

export const DEFAULT_TOURNAMENT_PARTNERS: TournamentPartner[] = [
  {
    id: 'partner-mtsn3',
    name: 'MTsN 3 Blitar',
    role: 'Penyelenggara Utama Turnamen',
    category: 'ORGANIZER',
    iconType: 'custom',
    logoUrl: '/partners/mtsn-3-blitar.jpg',
    websiteUrl: 'https://mtsn3blitar.sch.id',
    isActive: true,
    order: 1,
    description: 'Madrasah Tsanawiyah Negeri 3 Blitar (Matsanega) - Penyelenggara turnamen Matsanega Futsal Championship.',
  },
  {
    id: 'partner-ma-maarif',
    name: "MA Ma'arif Udanawu Blitar",
    role: 'Mitra Pendidikan & Sponsor',
    category: 'SPONSOR',
    iconType: 'custom',
    logoUrl: '/partners/ma-maarif-udanawu.jpg',
    websiteUrl: 'https://mamaarifudanawu.sch.id',
    isActive: true,
    order: 2,
    description: "Madrasah Aliyah Ma'arif Udanawu Blitar - Lembaga pendidikan dan mitra sponsor pendukung kejuaraan.",
  },
  {
    id: 'partner-koni',
    name: 'KONI',
    role: 'Komite Olahraga Nasional Indonesia',
    category: 'FEDERATION',
    iconType: 'custom',
    logoUrl: '/partners/koni.webp',
    websiteUrl: 'https://koni.or.id',
    isActive: true,
    order: 3,
    description: 'Komite Olahraga Nasional Indonesia - Otoritas koordinasi dan pembinaan prestasi induk organisasi cabang olahraga.',
  },
  {
    id: 'partner-1',
    name: 'Kemenpora RI',
    role: 'Kementerian Pemuda & Olahraga',
    category: 'GOVERNMENT',
    iconType: 'custom',
    logoUrl: '/partners/kemenpora.svg',
    websiteUrl: 'https://www.kemenpora.go.id',
    isActive: true,
    order: 4,
    description: 'Instansi pembina dan pengawas regulasi olahraga nasional Republik Indonesia',
  },
  {
    id: 'partner-3',
    name: 'FFI (Federasi Futsal Indonesia)',
    role: 'Federasi Futsal Resmi',
    category: 'FEDERATION',
    iconType: 'custom',
    logoUrl: '/partners/ffi.svg',
    websiteUrl: 'https://federasifutsal.id',
    isActive: true,
    order: 5,
    description: 'Badan federasi resmi pengawas teknis, regulasi pertandingan, dan wasit lisensi',
  },
  {
    id: 'partner-4',
    name: 'Dispora',
    role: 'Dinas Kepemudaan & Olahraga',
    category: 'GOVERNMENT',
    iconType: 'custom',
    logoUrl: '/partners/dispora.svg',
    websiteUrl: 'https://dispora.go.id',
    isActive: true,
    order: 6,
    description: 'Instansi pemerintah daerah fasilitator sarana arena dan pembinaan atlet muda',
  },
  {
    id: 'partner-5',
    name: 'Palang Merah Indonesia (PMI)',
    role: 'Tim Medis & Tanggap Darurat',
    category: 'COMMUNITY',
    iconType: 'custom',
    logoUrl: '/partners/pmi.svg',
    websiteUrl: 'https://pmi.or.id',
    isActive: true,
    order: 7,
    description: 'Lembaga pertolongan pertama dan tim medis siaga keselamatan atlet di arena',
  },
  {
    id: 'partner-6',
    name: 'Bank Mandiri',
    role: 'Mitra Perbankan & Ticketing',
    category: 'SPONSOR',
    iconType: 'custom',
    logoUrl: '/partners/mandiri.svg',
    websiteUrl: 'https://www.bankmandiri.co.id',
    isActive: true,
    order: 8,
    description: 'Mitra perbankan resmi dan gerbang pembayaran tiket turnamen digital terintegrasi',
  },
  {
    id: 'partner-7',
    name: 'Pocari Sweat',
    role: 'Official Hydration Partner',
    category: 'SPONSOR',
    iconType: 'custom',
    logoUrl: '/partners/pocari.svg',
    websiteUrl: 'https://pocarisweat.id',
    isActive: true,
    order: 9,
    description: 'Penyedia hidrasi ion resmi bagi seluruh atlet, wasit, dan perangkat pertandingan',
  },
  {
    id: 'partner-8',
    name: 'Specs Indonesia',
    role: 'Official Match Ball & Apparel',
    category: 'SPONSOR',
    iconType: 'custom',
    logoUrl: '/partners/specs.svg',
    websiteUrl: 'https://specs.id',
    isActive: true,
    order: 10,
    description: 'Penyedia bola pertandingan resmi bersertifikasi dan apparel resmi turnamen',
  },
];

export const STORAGE_KEY_PARTNERS = 'sauma_arena_tournament_partners_v3';

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
    label: 'Komite & Tim Medis',
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
    if (!raw) {
      // Clean legacy storage keys if exist and save new defaults
      localStorage.removeItem('sauma_arena_tournament_partners');
      localStorage.removeItem('sauma_arena_tournament_partners_v2');
      localStorage.setItem(STORAGE_KEY_PARTNERS, JSON.stringify(DEFAULT_TOURNAMENT_PARTNERS));
      return DEFAULT_TOURNAMENT_PARTNERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Auto-migrate if stored array is missing new partners or still holds old generic placeholders
      const hasMtsn = parsed.some((p) => p.name?.includes('MTsN 3') || p.id === 'partner-mtsn3');
      const hasOldGenericNames = parsed.some(
        (p) => p.name === 'Komite Pelaksana Turnamen' || p.name === 'Komite Disiplin & Etika'
      );
      if (!hasMtsn || hasOldGenericNames) {
        localStorage.setItem(STORAGE_KEY_PARTNERS, JSON.stringify(DEFAULT_TOURNAMENT_PARTNERS));
        return DEFAULT_TOURNAMENT_PARTNERS;
      }
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
      localStorage.removeItem('sauma_arena_tournament_partners_v2');
      localStorage.removeItem('sauma_arena_tournament_partners');
      window.dispatchEvent(new CustomEvent('sauma_partners_updated', { detail: DEFAULT_TOURNAMENT_PARTNERS }));
    } catch (e) {
      console.error('Gagal mereset data mitra:', e);
    }
  }
  return DEFAULT_TOURNAMENT_PARTNERS;
}
