import { Match, SupporterAssessment, Ticket } from '@/types';
import { getTeamLogoUrl } from './teamLogos';
export { initialTeams } from './mockTeams';

export const tournamentMeta = {
  id: 'trn-mmfc-1-matsanega-2026',
  slug: 'milad-matsanega-futsal-competition-i-2026',
  title: 'Milad Matsanega Futsal Competition I (MMFC I)',
  shortTitle: 'MMFC I Matsanega',
  organizer: 'Panitia Milad Matsanega & Ekstrakurikuler Futsal',
  dates: '2 - 3 November 2026',
  venue: 'Lapangan Futsal Seabless Srengat, Blitar',
  venueDetail: {
    name: 'Lapangan Futsal Seabless Srengat',
    address: 'Kec. Srengat, Kabupaten Blitar, Jawa Timur 66152',
    googleMapsUrl: 'https://maps.app.goo.gl/71UwUT3czxJj5Mip7',
    courtName: 'Lapangan Futsal Seabless (Vinyl)',
    capacity: '1.500 Penonton',
    latitude: -8.0658777,
    longitude: 112.082688,
  },
  activeSport: 'FUTSAL' as const,
  category: 'Futsal Pelajar SD/MI (Usia 10-12 Tahun)',
  status: 'HARI-1: SENIN, 2 NOVEMBER 2026',
  description: 'Kompetisi futsal antarpelajar tingkat SD/MI se-derajat (14 Tim dalam 4 Grup), memperebutkan Piala Bergilir MMFC I dan predikat Best Supporter Madrasah.',
};

export interface RundownItem {
  id: string;
  day: 'H1' | 'H2';
  dayDate: string;
  matchCode: string;
  agendaCode: string;
  time: string;
  detail: string;
  category: 'MATCH' | 'CEREMONY' | 'BREAK' | 'RECAP';
  notes: string;
}

export const TOURNAMENT_RUNDOWN: RundownItem[] = [
  // HARI-1 (Senin, 2 November 2026)
  { id: 'rd-1', day: 'H1', dayDate: 'Senin, 2 November 2026', matchCode: 'P1', agendaCode: 'A1 vs A2', time: '07.30 - 08.00', detail: 'SDI KARDINA MASSA vs MIN 7 BLITAR', category: 'MATCH', notes: 'Penyisihan Grup A' },
  { id: 'rd-2', day: 'H1', dayDate: 'Senin, 2 November 2026', matchCode: 'P2', agendaCode: 'B1 vs B2', time: '08.00 - 08.30', detail: 'UPT SDN 1 SRENGAT vs MIN 14 BLITAR', category: 'MATCH', notes: 'Penyisihan Grup B' },
  { id: 'rd-3', day: 'H1', dayDate: 'Senin, 2 November 2026', matchCode: 'P3', agendaCode: 'C1 vs C2', time: '08.30 - 09.00', detail: 'MIN 2 BLITAR vs MI WAHID HASYIM BAKUNG', category: 'MATCH', notes: 'Penyisihan Grup C' },
  { id: 'rd-4', day: 'H1', dayDate: 'Senin, 2 November 2026', matchCode: 'P4', agendaCode: 'D4 vs D1', time: '09.00 - 09.30', detail: 'MIN 5 TULUNGAGUNG vs MI PLOSO KEDIRI', category: 'MATCH', notes: 'Penyisihan Grup D' },
  { id: 'rd-5', day: 'H1', dayDate: 'Senin, 2 November 2026', matchCode: 'P5', agendaCode: 'A3 vs A1', time: '09.30 - 10.00', detail: 'MIN 8 BLITAR vs SDI KARDINA MASSA', category: 'MATCH', notes: 'Penyisihan Grup A' },
  { id: 'rd-6', day: 'H1', dayDate: 'Senin, 2 November 2026', matchCode: 'P6', agendaCode: 'B2 vs B3', time: '10.00 - 10.30', detail: 'MIN 14 BLITAR vs MI MAMBAUL ULUM BUNTARAN TULUNGAGUNG', category: 'MATCH', notes: 'Penyisihan Grup B' },
  { id: 'rd-open', day: 'H1', dayDate: 'Senin, 2 November 2026', matchCode: '-', agendaCode: 'ACARA', time: '10.30 - 11.30', detail: 'PEMBUKAAN', category: 'CEREMONY', notes: 'Upacara Pembukaan' },
  { id: 'rd-ishoma1', day: 'H1', dayDate: 'Senin, 2 November 2026', matchCode: '-', agendaCode: 'JEDA', time: '11.30 - 12.00', detail: 'ISHOMA', category: 'BREAK', notes: 'Istirahat' },
  { id: 'rd-7', day: 'H1', dayDate: 'Senin, 2 November 2026', matchCode: 'P7', agendaCode: 'C2 vs C3', time: '12.00 - 12.30', detail: 'MI WAHID HASYIM BAKUNG vs MIN 13 BLITAR B', category: 'MATCH', notes: 'Penyisihan Grup C' },
  { id: 'rd-8', day: 'H1', dayDate: 'Senin, 2 November 2026', matchCode: 'P8', agendaCode: 'D3 vs D4', time: '12.30 - 13.00', detail: 'MI YAA BUNAYYA SRENGAT vs MIN 5 TULUNGAGUNG', category: 'MATCH', notes: 'Penyisihan Grup D' },
  { id: 'rd-9', day: 'H1', dayDate: 'Senin, 2 November 2026', matchCode: 'P9', agendaCode: 'D1 vs D2', time: '13.00 - 13.30', detail: 'MI PLOSO KEDIRI vs MI UNGGULAN DARUSSALAM', category: 'MATCH', notes: 'Penyisihan Grup D' },
  { id: 'rd-10', day: 'H1', dayDate: 'Senin, 2 November 2026', matchCode: 'P10', agendaCode: 'B3 vs B4', time: '13.30 - 14.00', detail: 'MI MAMBAUL ULUM BUNTARAN TULUNGAGUNG vs MIN 13 BLITAR A', category: 'MATCH', notes: 'Penyisihan Grup B' },

  // HARI-2 (Selasa, 3 November 2026)
  { id: 'rd-11', day: 'H2', dayDate: 'Selasa, 3 November 2026', matchCode: 'P11', agendaCode: 'A2 vs A3', time: '07.30 - 08.00', detail: 'MIN 7 BLITAR vs MIN 8 BLITAR', category: 'MATCH', notes: 'Penyisihan Grup A' },
  { id: 'rd-12', day: 'H2', dayDate: 'Selasa, 3 November 2026', matchCode: 'P12', agendaCode: 'C3 vs C1', time: '08.00 - 08.30', detail: 'MIN 13 BLITAR B vs MIN 2 BLITAR', category: 'MATCH', notes: 'Penyisihan Grup C' },
  { id: 'rd-13', day: 'H2', dayDate: 'Selasa, 3 November 2026', matchCode: 'P13', agendaCode: 'D2 vs D3', time: '08.30 - 09.00', detail: 'MI UNGGULAN DARUSSALAM vs MI YAA BUNAYYA SRENGAT', category: 'MATCH', notes: 'Penyisihan Grup D' },
  { id: 'rd-14', day: 'H2', dayDate: 'Selasa, 3 November 2026', matchCode: 'P14', agendaCode: 'B4 vs B1', time: '09.00 - 09.30', detail: 'MIN 13 BLITAR A vs UPT SDN 1 SRENGAT', category: 'MATCH', notes: 'Penyisihan Grup B' },
  { id: 'rd-rekap', day: 'H2', dayDate: 'Selasa, 3 November 2026', matchCode: '-', agendaCode: 'REKAP', time: '09.30 - 10.00', detail: 'REKAPITULASI', category: 'RECAP', notes: 'Penentuan Juara Grup A, B, C, D' },
  { id: 'rd-15', day: 'H2', dayDate: 'Selasa, 3 November 2026', matchCode: 'P15', agendaCode: '4 BESAR', time: '10.00 - 10.30', detail: 'JUARA GRUP A vs JUARA GRUP C', category: 'MATCH', notes: 'Semifinal 1' },
  { id: 'rd-16', day: 'H2', dayDate: 'Selasa, 3 November 2026', matchCode: 'P16', agendaCode: '4 BESAR', time: '10.30 - 11.00', detail: 'JUARA GRUP B vs JUARA GRUP D', category: 'MATCH', notes: 'Semifinal 2' },
  { id: 'rd-ishoma2', day: 'H2', dayDate: 'Selasa, 3 November 2026', matchCode: '-', agendaCode: 'JEDA', time: '11.00 - 11.30', detail: 'ISHOMA', category: 'BREAK', notes: 'Istirahat' },
  { id: 'rd-17', day: 'H2', dayDate: 'Selasa, 3 November 2026', matchCode: 'P17', agendaCode: 'FINAL', time: '11.30 - 12.00', detail: 'P15 vs P16', category: 'MATCH', notes: 'Grand Final' },
  { id: 'rd-close', day: 'H2', dayDate: 'Selasa, 3 November 2026', matchCode: '-', agendaCode: 'ACARA', time: '12.00 - 13.00', detail: 'PENUTUPAN', category: 'CEREMONY', notes: 'Penyerahan Trofi' },
];

const createMatch = (
  id: string,
  matchNumber: number,
  stage: Match['stage'],
  group: Match['group'],
  teamAId: string,
  teamAName: string,
  teamBId: string,
  teamBName: string,
  scheduledTime: string,
  extra: Partial<Match> = {}
): Match => ({
  id,
  tournamentId: 'trn-mmfc-1-matsanega-2026',
  matchNumber,
  stage,
  group,
  teamAId,
  teamBId,
  teamAName,
  teamBName,
  teamALogo: getTeamLogoUrl(teamAId),
  teamBLogo: getTeamLogoUrl(teamBId),
  scoreA: 0,
  scoreB: 0,
  status: 'UPCOMING',
  venueName: 'Lapangan Futsal Seabless Srengat',
  courtName: 'Lapangan Futsal Seabless',
  refereeIds: ['USR-JURI-1'],
  assignedReferees: [
    {
      refereeId: 'USR-JURI-1',
      refereeName: 'Juri M. Irfan, S.Pd',
      role: 'WASIT_1',
      licenseLevel: 'Lisensi 2 Nasional FFI',
    },
  ],
  scheduledTime,
  events: [],
  ...extra,
});

export const initialMatches: Match[] = [
  // --- HARI PERTAMA (H1): Senin, 2 November 2026 ---
  createMatch('match-1', 1, 'GROUP', 'A', 'team-sdi-kardina', 'SDI KARDINA MASSA', 'team-min7-blitar', 'MIN 7 BLITAR', 'Senin, 2 Nov 2026 • 07:30 - 08:00 WIB (P1 • A1 vs A2)'),
  createMatch('match-2', 2, 'GROUP', 'B', 'team-sdn1-srengat', 'UPT SDN 1 SRENGAT', 'team-min14-blitar', 'MIN 14 BLITAR', 'Senin, 2 Nov 2026 • 08:00 - 08:30 WIB (P2 • B1 vs B2)'),
  createMatch('match-3', 3, 'GROUP', 'C', 'team-min2-blitar', 'MIN 2 BLITAR', 'team-mi-wahidhasyim', 'MI WAHID HASYIM BAKUNG', 'Senin, 2 Nov 2026 • 08:30 - 09:00 WIB (P3 • C1 vs C2)'),
  createMatch('match-4', 4, 'GROUP', 'D', 'team-min5-tulungagung', 'MIN 5 TULUNGAGUNG', 'team-mi-ploso', 'MI PLOSO KEDIRI', 'Senin, 2 Nov 2026 • 09:00 - 09:30 WIB (P4 • D4 vs D1)'),
  createMatch('match-5', 5, 'GROUP', 'A', 'team-min8-blitar', 'MIN 8 BLITAR', 'team-sdi-kardina', 'SDI KARDINA MASSA', 'Senin, 2 Nov 2026 • 09:30 - 10:00 WIB (P5 • A3 vs A1)'),
  createMatch('match-6', 6, 'GROUP', 'B', 'team-min14-blitar', 'MIN 14 BLITAR', 'team-mi-mambaululum', 'MI MAMBAUL ULUM BUNTARAN TULUNGAGUNG', 'Senin, 2 Nov 2026 • 10:00 - 10:30 WIB (P6 • B2 vs B3)'),
  createMatch('match-7', 7, 'GROUP', 'C', 'team-mi-wahidhasyim', 'MI WAHID HASYIM BAKUNG', 'team-min13-c', 'MIN 13 BLITAR B', 'Senin, 2 Nov 2026 • 12:00 - 12:30 WIB (P7 • C2 vs C3)'),
  createMatch('match-8', 8, 'GROUP', 'D', 'team-mi-yabunaya', 'MI YAA BUNAYYA SRENGAT', 'team-min5-tulungagung', 'MIN 5 TULUNGAGUNG', 'Senin, 2 Nov 2026 • 12:30 - 13:00 WIB (P8 • D3 vs D4)'),
  createMatch('match-9', 9, 'GROUP', 'D', 'team-mi-ploso', 'MI PLOSO KEDIRI', 'team-mi-darussalam', 'MI UNGGULAN DARUSSALAM', 'Senin, 2 Nov 2026 • 13:00 - 13:30 WIB (P9 • D1 vs D2)'),
  createMatch('match-10', 10, 'GROUP', 'B', 'team-mi-mambaululum', 'MI MAMBAUL ULUM BUNTARAN TULUNGAGUNG', 'team-min13-b', 'MIN 13 BLITAR A', 'Senin, 2 Nov 2026 • 13:30 - 14:00 WIB (P10 • B3 vs B4)'),

  // --- HARI KEDUA (H2): Selasa, 3 November 2026 ---
  createMatch('match-11', 11, 'GROUP', 'A', 'team-min7-blitar', 'MIN 7 BLITAR', 'team-min8-blitar', 'MIN 8 BLITAR', 'Selasa, 3 Nov 2026 • 07:30 - 08:00 WIB (P11 • A2 vs A3)'),
  createMatch('match-12', 12, 'GROUP', 'C', 'team-min13-c', 'MIN 13 BLITAR B', 'team-min2-blitar', 'MIN 2 BLITAR', 'Selasa, 3 Nov 2026 • 08:00 - 08:30 WIB (P12 • C3 vs C1)'),
  createMatch('match-13', 13, 'GROUP', 'D', 'team-mi-darussalam', 'MI UNGGULAN DARUSSALAM', 'team-mi-yabunaya', 'MI YAA BUNAYYA SRENGAT', 'Selasa, 3 Nov 2026 • 08:30 - 09:00 WIB (P13 • D2 vs D3)'),
  createMatch('match-14', 14, 'GROUP', 'B', 'team-min13-b', 'MIN 13 BLITAR A', 'team-sdn1-srengat', 'UPT SDN 1 SRENGAT', 'Selasa, 3 Nov 2026 • 09:00 - 09:30 WIB (P14 • B4 vs B1)'),

  // --- BABAK 4 BESAR (SEMIFINAL) & FINAL ---
  createMatch('match-15', 15, 'SEMI_FINAL', undefined, 'team-sdi-kardina', 'JUARA GRUP A', 'team-min2-blitar', 'JUARA GRUP C', 'Selasa, 3 Nov 2026 • 10:00 - 10:30 WIB (P15 • 4 Besar 1)'),
  createMatch('match-16', 16, 'SEMI_FINAL', undefined, 'team-sdn1-srengat', 'JUARA GRUP B', 'team-mi-ploso', 'JUARA GRUP D', 'Selasa, 3 Nov 2026 • 10:30 - 11:00 WIB (P16 • 4 Besar 2)'),
  createMatch('match-17', 17, 'FINAL', undefined, 'fn-1', 'P15', 'fn-2', 'P16', 'Selasa, 3 Nov 2026 • 11:30 - 12:00 WIB (P17 • Grand Final)'),
];

export const initialSupporterAssessments: SupporterAssessment[] = [];

export const initialTickets: Ticket[] = [
  {
    id: 'tik-001',
    code: 'MMFC-TIK-MIN1-0192',
    tournamentId: 'trn-mmfc-1-matsanega-2026',
    buyerName: 'Ahmad Fauzi (Wali Murid)',
    buyerPhone: '081234567899',
    ticketType: 'REGULER',
    quantity: 2,
    supportedTeamId: 'team-sdi-kardina',
    supportedSchoolName: 'SDI KARDINA MASSA',
    status: 'ISSUED',
  },
  {
    id: 'tik-002',
    code: 'MMFC-TIK-HIDAYAH-0842',
    tournamentId: 'trn-mmfc-1-matsanega-2026',
    buyerName: 'Ustadzah Maryam (Guru Pendamping)',
    buyerPhone: '081398765432',
    ticketType: 'ROMBONGAN',
    quantity: 5,
    supportedTeamId: 'team-sdn1-srengat',
    supportedSchoolName: 'UPT SDN 1 SRENGAT',
    status: 'ISSUED',
  },
  {
    id: 'tik-003',
    code: 'MMFC-TIK-SDN1-0311',
    tournamentId: 'trn-mmfc-1-matsanega-2026',
    buyerName: 'Hendra Gunawan',
    buyerPhone: '082187654321',
    ticketType: 'REGULER',
    quantity: 1,
    supportedTeamId: 'team-min2-blitar',
    supportedSchoolName: 'MIN 2 BLITAR',
    status: 'ISSUED',
  },
];
