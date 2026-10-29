import { ScoringType } from '@/types';

export interface SportTemplate {
  name: string;
  code: string;
  scoringType: ScoringType;
  scoringLabel: string;
  durationMinutes: number;
  periodCount: number;
  defaultCategories: string[];
  icon: string;
  badge: string;
}

export const SPORT_TEMPLATES: SportTemplate[] = [
  {
    name: 'Futsal',
    code: 'FUTSAL',
    scoringType: 'TIME_BASED',
    scoringLabel: 'Gol (2 × 20 Menit Bersih FFI)',
    durationMinutes: 40,
    periodCount: 2,
    defaultCategories: ['Pelajar SMA/SMK', 'Pelajar SD/MI', 'U-18 Terbuka'],
    icon: '👟',
    badge: '2 × 20 Menit',
  },
  {
    name: 'Sepak Bola',
    code: 'SEPAK_BOLA',
    scoringType: 'TIME_BASED',
    scoringLabel: 'Gol (2 × 45 Menit PSSI/FIFA)',
    durationMinutes: 90,
    periodCount: 2,
    defaultCategories: ['Putra U-18', 'Putra U-15', 'Putri Terbuka'],
    icon: '⚽',
    badge: '2 × 45 Menit',
  },
  {
    name: 'Bulutangkis',
    code: 'BADMINTON',
    scoringType: 'SET_POINTS',
    scoringLabel: 'Set & Reli Poin (Best of 3, 21 Poin BWF)',
    durationMinutes: 45,
    periodCount: 3,
    defaultCategories: ['Tunggal Putra', 'Tunggal Putri', 'Ganda Putra', 'Ganda Campuran'],
    icon: '🏸',
    badge: 'Best of 3 (21 Poin)',
  },
  {
    name: 'Bola Voli',
    code: 'VOLI',
    scoringType: 'SET_POINTS',
    scoringLabel: 'Set & Reli Poin (Best of 5, 25 Poin PBVSI)',
    durationMinutes: 60,
    periodCount: 5,
    defaultCategories: ['Beregu Putra', 'Beregu Putri'],
    icon: '🏐',
    badge: 'Best of 5 (25 Poin)',
  },
  {
    name: 'Sepak Takraw',
    code: 'SEPAK_TAKRAW',
    scoringType: 'SET_POINTS',
    scoringLabel: 'Set & Reli Poin (Best of 3, 21 Poin ISTAF)',
    durationMinutes: 45,
    periodCount: 3,
    defaultCategories: ['Regu Putra', 'Double Event Putra'],
    icon: '🎯',
    badge: 'Best of 3 (21 Poin)',
  },
  {
    name: 'Bola Basket',
    code: 'BASKET',
    scoringType: 'TIME_BASED',
    scoringLabel: 'Poin (4 × 10 Menit FIBA)',
    durationMinutes: 40,
    periodCount: 4,
    defaultCategories: ['5v5 Putra', '5v5 Putri', '3x3 Challenge'],
    icon: '🏀',
    badge: '4 × 10 Menit',
  },
  {
    name: 'Esport Gaming',
    code: 'ESPORT',
    scoringType: 'PLACEMENT',
    scoringLabel: 'Kill & Placement Point (BO3 / BO5)',
    durationMinutes: 30,
    periodCount: 3,
    defaultCategories: ['Mobile Legends: Bang Bang (5v5)', 'Free Fire Squad', 'PUBG Mobile Squad'],
    icon: '🎮',
    badge: 'Kill & Placement',
  },
  {
    name: 'Tenis Meja',
    code: 'TENIS_MEJA',
    scoringType: 'SET_POINTS',
    scoringLabel: 'Set & Poin (Best of 5, 11 Poin ITTF)',
    durationMinutes: 30,
    periodCount: 5,
    defaultCategories: ['Tunggal Putra', 'Tunggal Putri', 'Ganda Campuran'],
    icon: '🏓',
    badge: 'Best of 5 (11 Poin)',
  },
];
