import { SportCode } from '@/types';
import { getTeamLogoUrl } from './teamLogos';

export interface CaborInfoMeta {
  sportCode: SportCode;
  sportName: string;
  category: string;
  organizer: string;
  formatTitle: string;
  formatSubtitle: string;
  durationLabel: string;
  durationValue: string;
  durationDesc: string;
  disciplineLabel: string;
  disciplineValue: string;
  disciplineDesc: string;
  venueName: string;
  venueAddress: string;
  venueCourt: string;
  venueCapacity: string;
  googleMapsUrl: string;
  juknisFileName: string;
}

export const CABOR_INFO_DATA: Record<string, CaborInfoMeta> = {
  FUTSAL: {
    sportCode: 'FUTSAL',
    sportName: 'Futsal',
    category: 'Futsal Pelajar SD/MI (Usia 10-12 Tahun)',
    organizer: 'Panitia Milad Matsanega & Ekstrakurikuler Futsal',
    formatTitle: 'Format Pertandingan Futsal & Alur Turnamen',
    formatSubtitle: 'Fase Grup 4 Grup (A, B, C, D) diikuti Babak 4 Besar (Semifinal) dan Grand Final.',
    durationLabel: 'Durasi & Alokasi Waktu Laga',
    durationValue: '30 Menit per Partai',
    durationDesc: 'Alokasi 30 menit per slot jadwal partai (2 babak) dengan jeda istirahat. Pada babak gugur jika skor imbang, dilanjutkan penalti.',
    disciplineLabel: 'Disiplin Kartu & Sanksi',
    disciplineValue: 'Akumulasi 2 Kartu Kuning',
    disciplineDesc: 'Pemain yang menerima 2 kartu kuning dalam laga berbeda terkena larangan bertanding 1 laga berikutnya. Kartu merah langsung denda disiplin panitia dan sanksi 1 laga.',
    venueName: 'Lapangan Futsal Seabless Srengat',
    venueAddress: 'Kec. Srengat, Kabupaten Blitar, Jawa Timur 66152',
    venueCourt: 'Lapangan Futsal Seabless (Vinyl)',
    venueCapacity: '2.500 Penonton',
    googleMapsUrl: 'https://maps.app.goo.gl/71UwUT3czxJj5Mip7',
    juknisFileName: 'Juknis_MMFC_I_Matsanega.pdf',
  },
};

export interface CaborSimpleTeam {
  id: string;
  name: string;
  schoolName: string;
  group: 'A' | 'B';
  logoUrl: string;
  captain: string;
  contact: string;
}

export const CABOR_TEAMS_DATA: Record<string, CaborSimpleTeam[]> = {};

export interface CaborSimpleMatch {
  id: string;
  matchNumber: number;
  stage: string;
  teamAName: string;
  teamBName: string;
  teamALogo: string;
  teamBLogo: string;
  scoreA: string | number;
  scoreB: string | number;
  scoreDetail?: string;
  status: 'LIVE' | 'COMPLETED' | 'UPCOMING';
  scheduledTime: string;
  courtName: string;
}

export const CABOR_MATCHES_DATA: Record<string, CaborSimpleMatch[]> = {};
