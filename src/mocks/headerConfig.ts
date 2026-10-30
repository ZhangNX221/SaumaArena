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
    name: 'Lapangan Futsal Seabless Srengat',
    category: 'Arena Futsal',
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1920&q=80',
    previewThumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=300&q=60',
  },
  {
    id: 'preset-stadium-lights',
    name: 'Lampu Sorot Stadion Futsal',
    category: 'Stadion Malam',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&q=80',
    previewThumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=300&q=60',
  },
];

export const DEFAULT_HEADER_CONFIG: PublicHeaderConfig = {
  id: 'banner-futsal',
  sportCode: 'FUTSAL',
  sportLabel: 'Futsal',
  bannerImageUrl: BANNER_PRESETS[0].url,
  bannerOverlayOpacity: 0.85,
  statusBadge: 'HARI-1: SENIN, 2 NOVEMBER 2026',
  categoryBadge: 'FUTSAL PELAJAR TINGKAT SD/MI',
  organizer: '',
  logoUrl: '/brand/matsanega-futsal-logo.png',
  logoSize: 260,
  logoOffsetX: -40,
  logoVisible: true,
  title: 'Milad Matsanega Futsal Competition I (MMFC I)',
  description: 'Kompetisi futsal antarpelajar tingkat SD/MI se-derajat (14 Tim dalam 4 Grup), memperebutkan Piala Bergilir MMFC I dan predikat Best Supporter Madrasah.',
  dates: '2 - 3 November 2026',
  venue: 'Lapangan Futsal Seabless Srengat, Blitar',
  contingentInfo: '14 Tim Kontingen SD/MI (4 Grup)',
  ticketButtonText: 'Ambil Tiket Masuk',
  registerButtonText: 'Daftar Tim',
};

export const DEFAULT_CABOR_BANNERS: PublicHeaderConfig[] = [
  DEFAULT_HEADER_CONFIG,
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

export const TEMPLATE_CABOR: CaborTemplate[] = [];
