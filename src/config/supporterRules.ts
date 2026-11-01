export interface AssessmentCriterionItem {
  id: string;
  badge: string;
  label: string;
  points: number;
  suffix?: string;
}

export interface SupporterAssessmentConfig {
  title: string;
  positiveCriteria: AssessmentCriterionItem[];
  penaltyCriteria: AssessmentCriterionItem[];
}

// Model legacy untuk kompatibilitas ke belakang
export interface SupporterScoringWeights {
  koreo: number;
  maskot: number;
  seragam: number;
  yelYel: number;
  tiket: number;
  ricuh: number;
  lempar: number;
  rasis: number;
  flare: number;
  sampah: number;
}

export const DEFAULT_POSITIVE_CRITERIA: AssessmentCriterionItem[] = [
  { id: 'crit_pos_1', badge: 'KOREO', label: 'Membentang Koreografi 3D / Kertas', points: 25 },
  { id: 'crit_pos_2', badge: 'MASKOT', label: 'Membawa Maskot Sekolah / Kostum Unik', points: 20 },
  { id: 'crit_pos_3', badge: 'SERAGAM', label: 'Menggunakan Seragam Kompak Kontingen', points: 15 },
  { id: 'crit_pos_4', badge: 'YEL-YEL', label: 'Menyanyikan Yel-Yel Minimal 3 Lagu', points: 10 },
  { id: 'crit_pos_5', badge: 'TIKET', label: 'Kehadiran Suporter Terverifikasi', points: 1, suffix: ' / Match' },
];

export const DEFAULT_PENALTY_CRITERIA: AssessmentCriterionItem[] = [
  { id: 'crit_neg_1', badge: 'RICUH', label: 'Kericuhan atau Kekerasan Fisik', points: 50 },
  { id: 'crit_neg_2', badge: 'LEMPAR', label: 'Melempar Benda ke Lapangan Pertandingan', points: 25 },
  { id: 'crit_neg_3', badge: 'RASIS', label: 'Tindakan Rasisme atau Provokasi Negatif', points: 15 },
  { id: 'crit_neg_4', badge: 'FLARE', label: 'Membawa Barang Terlarang / Flare / Petasan', points: 5 },
  { id: 'crit_neg_5', badge: 'SAMPAH', label: 'Membuang Sampah Sembarangan / Mengotori Tribun', points: 1 },
];

export const DEFAULT_ASSESSMENT_CONFIG: SupporterAssessmentConfig = {
  title: 'Ketentuan & Bobot Penilaian Best Supporter MMFC I',
  positiveCriteria: DEFAULT_POSITIVE_CRITERIA,
  penaltyCriteria: DEFAULT_PENALTY_CRITERIA,
};

export const DEFAULT_SUPPORTER_WEIGHTS: SupporterScoringWeights = {
  koreo: 25,
  maskot: 20,
  seragam: 15,
  yelYel: 10,
  tiket: 1,
  ricuh: 50,
  lempar: 25,
  rasis: 15,
  flare: 5,
  sampah: 1,
};

export const STORAGE_KEY_SUPPORTER_WEIGHTS = 'sauma_arena_supporter_weights';

/**
 * Normalisasi konfigurasi bobot penilaian suporter agar kompatibel
 * baik dengan struktur baru (SupporterAssessmentConfig) maupun model lama (SupporterScoringWeights).
 */
export function normalizeAssessmentConfig(raw: any): SupporterAssessmentConfig {
  if (
    raw &&
    typeof raw === 'object' &&
    Array.isArray(raw.positiveCriteria) &&
    Array.isArray(raw.penaltyCriteria)
  ) {
    return {
      title: raw.title || DEFAULT_ASSESSMENT_CONFIG.title,
      positiveCriteria: raw.positiveCriteria.map((item: any, idx: number) => ({
        id: item.id || `crit_pos_${idx + 1}`,
        badge: String(item.badge || 'ITEM').toUpperCase(),
        label: String(item.label || ''),
        points: Math.max(0, Number(item.points) || 0),
        suffix: item.suffix || undefined,
      })),
      penaltyCriteria: raw.penaltyCriteria.map((item: any, idx: number) => ({
        id: item.id || `crit_neg_${idx + 1}`,
        badge: String(item.badge || 'ITEM').toUpperCase(),
        label: String(item.label || ''),
        points: Math.max(0, Number(item.points) || 0),
        suffix: item.suffix || undefined,
      })),
    };
  }

  // Jika berupa object flat bobot lama (koreo, ricuh, dll)
  if (raw && typeof raw === 'object' && ('koreo' in raw || 'ricuh' in raw)) {
    return {
      title: DEFAULT_ASSESSMENT_CONFIG.title,
      positiveCriteria: [
        { id: 'crit_pos_1', badge: 'KOREO', label: 'Membentang Koreografi 3D / Kertas', points: Number(raw.koreo) || 25 },
        { id: 'crit_pos_2', badge: 'MASKOT', label: 'Membawa Maskot Sekolah / Kostum Unik', points: Number(raw.maskot) || 20 },
        { id: 'crit_pos_3', badge: 'SERAGAM', label: 'Menggunakan Seragam Kompak Kontingen', points: Number(raw.seragam) || 15 },
        { id: 'crit_pos_4', badge: 'YEL-YEL', label: 'Menyanyikan Yel-Yel Minimal 3 Lagu', points: Number(raw.yelYel) || 10 },
        { id: 'crit_pos_5', badge: 'TIKET', label: 'Kehadiran Suporter Terverifikasi', points: Number(raw.tiket) || 1, suffix: ' / Match' },
      ],
      penaltyCriteria: [
        { id: 'crit_neg_1', badge: 'RICUH', label: 'Kericuhan atau Kekerasan Fisik', points: Number(raw.ricuh) || 50 },
        { id: 'crit_neg_2', badge: 'LEMPAR', label: 'Melempar Benda ke Lapangan Pertandingan', points: Number(raw.lempar) || 25 },
        { id: 'crit_neg_3', badge: 'RASIS', label: 'Tindakan Rasisme atau Provokasi Negatif', points: Number(raw.rasis) || 15 },
        { id: 'crit_neg_4', badge: 'FLARE', label: 'Membawa Barang Terlarang / Flare / Petasan', points: Number(raw.flare) || 5 },
        { id: 'crit_neg_5', badge: 'SAMPAH', label: 'Membuang Sampah Sembarangan / Mengotori Tribun', points: Number(raw.sampah) || 1 },
      ],
    };
  }

  return DEFAULT_ASSESSMENT_CONFIG;
}
