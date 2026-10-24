import { PublicHeaderConfig } from '@/types';

export interface BannerPreset {
  id: string;
  name: string;
  category: string;
  url: string;
  previewThumbnail: string;
}

export const BANNER_PRESETS: BannerPreset[] = [
  {
    id: 'preset-matsanega-court',
    name: 'Matsanega Futsal Court (Indoor Arena)',
    category: 'Arena Futsal',
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1920&q=80',
    previewThumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=300&q=60',
  },
  {
    id: 'preset-stadium-lights',
    name: 'Lampu Sorot Stadion Megah',
    category: 'Stadion Malam',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&q=80',
    previewThumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=300&q=60',
  },
  {
    id: 'preset-wood-court',
    name: 'Lantai Parket Basket & Badminton',
    category: 'Indoor Court',
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1920&q=80',
    previewThumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=300&q=60',
  },
  {
    id: 'preset-esport-stage',
    name: 'Panggung Lampu Esport Arena',
    category: 'Esport & Gaming',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1920&q=80',
    previewThumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=300&q=60',
  },
];

export const DEFAULT_HEADER_CONFIG: PublicHeaderConfig = {
  id: 'banner-futsal',
  sportCode: 'FUTSAL',
  sportLabel: 'Futsal',
  bannerImageUrl: BANNER_PRESETS[0].url,
  bannerOverlayOpacity: 0.85,
  statusBadge: 'SEDANG BERLANGSUNG (HARI KE-2)',
  categoryBadge: 'FUTSAL PELAJAR TINGKAT SD/MI',
  organizer: 'Penyelenggara: Panitia Milad Matsanega & Ekstrakurikuler Futsal',
  title: 'Milad Matsanega Futsal Competition I (MMFC I)',
  description: 'Kompetisi futsal antarpelajar tingkat SD/MI se-derajat dalam rangka memeriahkan Milad Matsanega I, memperebutkan Piala Bergilir MMFC I dan predikat Best Supporter Madrasah.',
  dates: '24 - 28 Oktober 2026',
  venue: 'Matsanega Futsal Court, Kampus MTsN',
  contingentInfo: '10 Tim Kontingen SD/MI',
  ticketButtonText: 'Ambil Tiket Masuk',
  registerButtonText: 'Daftar Tim',
};

export const DEFAULT_CABOR_BANNERS: PublicHeaderConfig[] = [
  DEFAULT_HEADER_CONFIG,
  {
    id: 'banner-voli',
    sportCode: 'VOLI',
    sportLabel: 'Bola Voli',
    bannerImageUrl: BANNER_PRESETS[2].url, // Parket / indoor court
    bannerOverlayOpacity: 0.85,
    statusBadge: 'SEGERA DIMULAI (FASE GRUP)',
    categoryBadge: 'BOLA VOLI PUTRA & PUTRI SD/MI',
    organizer: 'Penyelenggara: Pengurus PBVSI & OSIM Matsanega',
    title: 'Matsanega Volleyball Championship 2026 (MVC 2026)',
    description: 'Turnamen bola voli antarpelajar memperebutkan Trofi Bergilir Kemenag. Menampilkan smash tajam, blok kokoh, dan sportivitas tinggi antar madrasah & sekolah dasar se-derajat.',
    dates: '29 Oktober - 02 November 2026',
    venue: 'Gelanggang Voli Indoor Matsanega Arena',
    contingentInfo: '8 Tim Kontingen Voli',
    ticketButtonText: 'Ambil Tiket Nonton Voli',
    registerButtonText: 'Daftar Tim Voli',
  },
  {
    id: 'banner-esport',
    sportCode: 'ESPORT',
    sportLabel: 'E-Sport MLBB',
    bannerImageUrl: BANNER_PRESETS[3].url, // Panggung esport stage
    bannerOverlayOpacity: 0.85,
    statusBadge: 'FASE REGISTRASI & TECHNICAL MEETING',
    categoryBadge: 'E-SPORT GAMING MLBB 5V5 PELAJAR',
    organizer: 'Penyelenggara: Komunitas E-Sport Matsanega & IESPA',
    title: 'Matsanega E-Sport Arena Cup 2026 (MLBB Pelajar)',
    description: 'Adu taktik macro-micro, drafting hero, dan kekompakan tim Mobile Legends: Bang Bang tingkat pelajar. Dilengkapi panggung gaming megah, lighting spektakuler, dan live caster.',
    dates: '03 - 05 November 2026',
    venue: 'Matsanega Gaming Stage & Amphitheater',
    contingentInfo: '12 Squad Tim E-Sport',
    ticketButtonText: 'Tiket Stage Arena',
    registerButtonText: 'Registrasi Squad',
  },
];

export interface CaborTemplate {
  sportCode: import('@/types').SportCode;
  sportLabel: string;
  title: string;
  categoryBadge: string;
  description: string;
  presetIndex: number;
  venue: string;
  contingentInfo: string;
}

export const TEMPLATE_CABOR: CaborTemplate[] = [
  {
    sportCode: 'BASKET',
    sportLabel: 'Bola Basket',
    title: 'Matsanega Basketball Challenge 2026',
    categoryBadge: 'BASKETBALL 5v5 PELAJAR',
    description: 'Kompetisi bola basket antarpelajar tingkat SD/MI & SMP se-derajat. Menampilkan skill dribbling, 3-point shoot, dan pertahanan solid.',
    presetIndex: 2,
    venue: 'Matsanega Indoor Basketball Court',
    contingentInfo: '8 Tim Kontingen Basket',
  },
  {
    sportCode: 'BADMINTON',
    sportLabel: 'Bulutangkis',
    title: 'Matsanega Badminton Junior Open 2026',
    categoryBadge: 'BULUTANGKIS TUNGGAL & GANDA',
    description: 'Turnamen bulutangkis junior memperebutkan Piala Bergilir Kepala Madrasah. Reli-reli sengit dan smash menyilang di lapangan standar PBSI.',
    presetIndex: 2,
    venue: 'GOR Bulutangkis Matsanega',
    contingentInfo: '16 Kontingen Atlet Bulutangkis',
  },
  {
    sportCode: 'SEPAK_TAKRAW',
    sportLabel: 'Sepak Takraw',
    title: 'Matsanega Takraw Invitation Cup 2026',
    categoryBadge: 'SEPAK TAKRAW INTER-REGU PELAJAR',
    description: 'Adu kelincahan akrobatik, smash roll, dan kontrol bola rotan antarsekolah dasar dan madrasah se-Jawa Timur.',
    presetIndex: 0,
    venue: 'Lapangan Outdoor Matsanega',
    contingentInfo: '8 Regu Kontingen Takraw',
  },
];
