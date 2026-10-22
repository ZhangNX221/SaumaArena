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
    formatSubtitle: 'Diselenggarakan berpedoman pada regulasi resmi FFI untuk kategori usia SD/MI.',
    durationLabel: 'Durasi & Waktu Laga',
    durationValue: '2 Babak × 15 Menit',
    durationDesc: 'Waktu kotor standar futsal usia SD/MI dengan jeda istirahat 5 menit antar babak. Pada babak gugur jika skor imbang, langsung dilanjutkan adu penalti 3 penendang utama.',
    disciplineLabel: 'Disiplin Kartu & Sanksi',
    disciplineValue: 'Akumulasi 2 Kartu Kuning',
    disciplineDesc: 'Pemain yang menerima 2 kartu kuning dalam laga berbeda terkena larangan bertanding 1 laga berikutnya. Kartu merah langsung denda disiplin panitia dan sanksi 1 laga.',
    venueName: 'Matsanega Futsal Court (Indoor Arena)',
    venueAddress: 'Jl. Bandung No. 7, Penanggungan, Kec. Klojen, Kota Malang, Jawa Timur 65113',
    venueCourt: 'Lapangan Utama (Vinyl Standar FFI)',
    venueCapacity: '2.500 Penonton',
    googleMapsUrl: 'https://maps.google.com/?q=MTsN+1+Kota+Malang',
    juknisFileName: 'Juknis_MMFC_I_Matsanega.pdf',
  },
  VOLI: {
    sportCode: 'VOLI',
    sportName: 'Bola Voli',
    category: 'Bola Voli Pelajar SD/MI & SMP',
    organizer: 'Pengurus PBVSI Cabang & OSIM Matsanega',
    formatTitle: 'Format Pertandingan Bola Voli (Rally Point)',
    formatSubtitle: 'Mengacu pada aturan resmi PBVSI dan FIVB dengan adaptasi tinggi net pelajar (2,24 m).',
    durationLabel: 'Sistem Set & Kemenangan',
    durationValue: 'Best of 3 Sets (25 Poin)',
    durationDesc: 'Set 1 & 2 dimainkan hingga 25 poin (deuce batas selisih 2 poin). Jika terjadi rubber set ke-3, penentuan dimainkan hingga 15 poin.',
    disciplineLabel: 'Regulasi Pergantian & Libero',
    disciplineValue: 'Maks 6 Pergantian per Set',
    disciplineDesc: 'Setiap tim berhak menggunakan 1 libero terdaftar. Pelanggaran posisi (rotasi salah) langsung menghasilkan reli poin untuk tim lawan.',
    venueName: 'Gelanggang Voli Indoor Matsanega Arena',
    venueAddress: 'Jl. Bandung No. 7, Kampus MTsN, Kota Malang',
    venueCourt: 'Court Voli Utama (Lantai Kayu Parket)',
    venueCapacity: '1.800 Penonton',
    googleMapsUrl: 'https://maps.google.com/?q=MTsN+1+Kota+Malang',
    juknisFileName: 'Juknis_Matsanega_Volleyball_Championship_2026.pdf',
  },
  ESPORT: {
    sportCode: 'ESPORT',
    sportName: 'E-Sport Gaming',
    category: 'Mobile Legends: Bang Bang (MLBB 5v5)',
    organizer: 'Komunitas E-Sport Matsanega & IESPA',
    formatTitle: 'Regulasi Kompetisi E-Sport MLBB Pelajar',
    formatSubtitle: 'Sistem Tournament Mode Resmi Moonton dengan pengawasan juri server & stream referee.',
    durationLabel: 'Format Match & Draft Pick',
    durationValue: 'BO3 Grup & BO5 Grand Final',
    durationDesc: 'Menggunakan mode Custom Draft Pick dengan 10 Banned Hero (5 ban tiap tim). Waktu pause teknis maksimal 3 menit per game per tim.',
    disciplineLabel: 'Integritas & Fair Play',
    disciplineValue: 'Zero Tolerance Toksisitas',
    disciplineDesc: 'Chat all yang bersifat provokatif/taunting dilarang keras. Penggunaan script atau aplikasi pihak ketiga berakibat diskualifikasi instan.',
    venueName: 'Matsanega Gaming Stage & Amphitheater',
    venueAddress: 'Aula Utama Multimedia MTsN, Kota Malang',
    venueCourt: 'Main Stage Gaming Deck & Live Caster Booth',
    venueCapacity: '1.200 Penonton & Live Stream',
    googleMapsUrl: 'https://maps.google.com/?q=MTsN+1+Kota+Malang',
    juknisFileName: 'Rulebook_MLBB_Matsanega_Cup_2026.pdf',
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

export const CABOR_TEAMS_DATA: Record<string, CaborSimpleTeam[]> = {
  VOLI: [
    { id: 'v-team-1', name: 'Rajawali Spikers', schoolName: 'MIN 1 Kota', group: 'A', logoUrl: getTeamLogoUrl('team-min1'), captain: 'Faris Pratama', contact: '0812-3344-1122' },
    { id: 'v-team-2', name: 'Garuda Volley Club', schoolName: 'SDN Percobaan 1', group: 'A', logoUrl: getTeamLogoUrl('team-sdn-percobaan'), captain: 'Bagas Aditya', contact: '0813-9988-2233' },
    { id: 'v-team-3', name: 'Sukun Smashers', schoolName: 'SDN Kauman 1', group: 'A', logoUrl: getTeamLogoUrl('team-sdn-kauman'), captain: 'Dimas Setiawan', contact: '0812-7766-3344' },
    { id: 'v-team-4', name: 'Bromo Spike Club', schoolName: 'MIS Al-Hidayah', group: 'A', logoUrl: getTeamLogoUrl('team-alhidayah'), captain: 'Alif Kurniawan', contact: '0815-5544-7788' },
    { id: 'v-team-5', name: 'Merpati Spikers', schoolName: 'SDIT Bina Insani', group: 'B', logoUrl: getTeamLogoUrl('team-bina-insani'), captain: 'Rizky Ramadhan', contact: '0819-2233-4455' },
    { id: 'v-team-6', name: 'Harapan Volley', schoolName: 'SDIT Permata Hati', group: 'B', logoUrl: getTeamLogoUrl('team-permata-hati'), captain: 'Haidar Ali', contact: '0812-4455-6677' },
    { id: 'v-team-7', name: 'Angkasa Spiker', schoolName: 'SD Model Malang', group: 'B', logoUrl: getTeamLogoUrl('team-sd-model'), captain: 'Kevin Pratama', contact: '0813-1122-3344' },
    { id: 'v-team-8', name: 'Kencana Spikers', schoolName: 'MI Nurul Huda', group: 'B', logoUrl: getTeamLogoUrl('team-nurul-huda'), captain: 'Ahmad Danial', contact: '0812-9988-7766' },
  ],
  ESPORT: [
    { id: 'e-team-1', name: 'MIN 1 Cyber Knights', schoolName: 'MIN 1 Kota', group: 'A', logoUrl: getTeamLogoUrl('team-min1'), captain: 'Rafi "SkyFall" Pratama', contact: '0812-3344-0011' },
    { id: 'e-team-2', name: 'Percobaan Esports', schoolName: 'SDN Percobaan 1', group: 'A', logoUrl: getTeamLogoUrl('team-sdn-percobaan'), captain: 'Zidan "Apex" Ali', contact: '0813-5566-7788' },
    { id: 'e-team-3', name: 'Kauman Phoenix', schoolName: 'SDN Kauman 1', group: 'A', logoUrl: getTeamLogoUrl('team-sdn-kauman'), captain: 'Reza "Blaze" Saputra', contact: '0812-9900-1122' },
    { id: 'e-team-4', name: 'Mythic Al-Hidayah', schoolName: 'MIS Al-Hidayah', group: 'A', logoUrl: getTeamLogoUrl('team-alhidayah'), captain: 'Farhan "Ghost" Hidayat', contact: '0815-4433-2211' },
    { id: 'e-team-5', name: 'Bina Insani Cyber', schoolName: 'SDIT Bina Insani', group: 'B', logoUrl: getTeamLogoUrl('team-bina-insani'), captain: 'Syamil "Viper" Robbani', contact: '0819-8877-6655' },
    { id: 'e-team-6', name: 'Vanguard Permata', schoolName: 'SDIT Permata Hati', group: 'B', logoUrl: getTeamLogoUrl('team-permata-hati'), captain: 'Ilyas "Phantom" Hakim', contact: '0812-6655-4433' },
    { id: 'e-team-7', name: 'Model Titans', schoolName: 'SD Model Malang', group: 'B', logoUrl: getTeamLogoUrl('team-sd-model'), captain: 'Arga "Titan" Maulana', contact: '0813-7788-9900' },
    { id: 'e-team-8', name: 'Nurul Huda Legion', schoolName: 'MI Nurul Huda', group: 'B', logoUrl: getTeamLogoUrl('team-nurul-huda'), captain: 'Fahmi "Echo" Nur', contact: '0812-0011-2233' },
  ],
};

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
  scoreDetail?: string; // misal "(25-21, 23-25, 15-11)"
  status: 'LIVE' | 'COMPLETED' | 'UPCOMING';
  scheduledTime: string;
  courtName: string;
}

export const CABOR_MATCHES_DATA: Record<string, CaborSimpleMatch[]> = {
  VOLI: [
    {
      id: 'vm-101',
      matchNumber: 1,
      stage: 'Penyisihan Grup A',
      teamAName: 'Rajawali Spikers (MIN 1)',
      teamBName: 'Bromo Spike (MIS Al-Hidayah)',
      teamALogo: getTeamLogoUrl('team-min1'),
      teamBLogo: getTeamLogoUrl('team-alhidayah'),
      scoreA: 2,
      scoreB: 0,
      scoreDetail: 'Set 1: 25-19, Set 2: 25-21',
      status: 'COMPLETED',
      scheduledTime: '29 Okt 2026, 08:30 WIB',
      courtName: 'Court Voli Utama',
    },
    {
      id: 'vm-102',
      matchNumber: 2,
      stage: 'Penyisihan Grup A',
      teamAName: 'Garuda Volley (SDN Percobaan)',
      teamBName: 'Sukun Smashers (SDN Kauman 1)',
      teamALogo: getTeamLogoUrl('team-sdn-percobaan'),
      teamBLogo: getTeamLogoUrl('team-sdn-kauman'),
      scoreA: 2,
      scoreB: 1,
      scoreDetail: 'Set 1: 25-22, Set 2: 21-25, Set 3: 15-12',
      status: 'LIVE',
      scheduledTime: '29 Okt 2026, 10:15 WIB',
      courtName: 'Court Voli Utama',
    },
    {
      id: 'vm-103',
      matchNumber: 3,
      stage: 'Penyisihan Grup B',
      teamAName: 'Merpati Spikers (SDIT Bina Insani)',
      teamBName: 'Angkasa Spiker (SD Model)',
      teamALogo: getTeamLogoUrl('team-bina-insani'),
      teamBLogo: getTeamLogoUrl('team-sd-model'),
      scoreA: 0,
      scoreB: 0,
      scoreDetail: 'Pemanasan Tim',
      status: 'UPCOMING',
      scheduledTime: '29 Okt 2026, 13:30 WIB',
      courtName: 'Court Voli Utama',
    },
  ],
  ESPORT: [
    {
      id: 'em-101',
      matchNumber: 1,
      stage: 'Group Stage Game 1 (BO3)',
      teamAName: 'MIN 1 Cyber Knights',
      teamBName: 'Mythic Al-Hidayah',
      teamALogo: getTeamLogoUrl('team-min1'),
      teamBLogo: getTeamLogoUrl('team-alhidayah'),
      scoreA: 2,
      scoreB: 0,
      scoreDetail: 'Game 1: 18-9 (12m), Game 2: 21-14 (15m)',
      status: 'COMPLETED',
      scheduledTime: '03 Nov 2026, 09:00 WIB',
      courtName: 'Main Gaming Deck A',
    },
    {
      id: 'em-102',
      matchNumber: 2,
      stage: 'Group Stage Game 2 (BO3)',
      teamAName: 'Percobaan Esports',
      teamBName: 'Kauman Phoenix',
      teamALogo: getTeamLogoUrl('team-sdn-percobaan'),
      teamBLogo: getTeamLogoUrl('team-sdn-kauman'),
      scoreA: 1,
      scoreB: 1,
      scoreDetail: 'Game 3 Sedang Berlangsung (13m)',
      status: 'LIVE',
      scheduledTime: '03 Nov 2026, 11:00 WIB',
      courtName: 'Main Gaming Deck A',
    },
    {
      id: 'em-103',
      matchNumber: 3,
      stage: 'Group Stage Game 3 (BO3)',
      teamAName: 'Bina Insani Cyber',
      teamBName: 'Model Titans',
      teamALogo: getTeamLogoUrl('team-bina-insani'),
      teamBLogo: getTeamLogoUrl('team-sd-model'),
      scoreA: 0,
      scoreB: 0,
      scoreDetail: 'Menunggu Drafting Hero',
      status: 'UPCOMING',
      scheduledTime: '03 Nov 2026, 14:00 WIB',
      courtName: 'Main Gaming Deck B',
    },
  ],
};
