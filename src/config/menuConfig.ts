import { FEATURES } from './features';

export type MenuBadgeType = 'text' | 'count' | 'live';

export interface MenuItemConfig {
  id: string;
  label: string;
  subtitle?: string;
  icon: string;
  href?: string;
  badge?: {
    type: MenuBadgeType;
    text?: string;
    count?: number;
    isHot?: boolean;
  };
  status: 'active' | 'coming_soon';
  tooltip?: string;
}

export interface AdminMenuGroupConfig {
  id: string;
  title: string;
  icon: string;
  items: MenuItemConfig[];
}

/**
 * Public Navigation Tabs Configuration.
 * Ordered per specification:
 * 1. Informasi
 * 2. Jadwal & Hasil (LIVE badge if matches are live)
 * 3. Klasemen
 * 4. Bagan
 * 5. Tim & Pemain
 * 6. Statistik
 * 7. Suporter (HOT badge)
 */
export const PUBLIC_MENU_CONFIG: MenuItemConfig[] = [
  {
    id: 'info',
    label: 'Informasi',
    subtitle: 'Aturan, durasi & venue',
    icon: 'Info',
    href: '#info',
    status: 'active',
  },
  {
    id: 'live',
    label: 'Live',
    subtitle: 'Papan skor & live match',
    icon: 'Radio',
    badge: { type: 'live', text: 'LIVE' },
    href: '#live',
    status: 'active',
  },
  {
    id: 'schedule',
    label: 'Jadwal',
    subtitle: 'Agenda laga & hasil',
    icon: 'Calendar',
    href: '#schedule',
    status: 'active',
  },
  {
    id: 'standings',
    label: 'Grup',
    subtitle: 'Peringkat grup & kualifikasi',
    icon: 'ListOrdered',
    href: '#standings',
    status: 'active',
  },
  {
    id: 'bracket',
    label: 'Bracket',
    subtitle: 'Bagan babak gugur',
    icon: 'GitBranch',
    href: '#bracket',
    status: 'active',
  },
  {
    id: 'teams',
    label: 'Tim',
    subtitle: 'Daftar kontingen & skuad',
    icon: 'Users',
    href: '#teams',
    status: 'active',
  },
  {
    id: 'stats',
    label: 'Statistik',
    subtitle: 'Top skor & kartu',
    icon: 'Activity',
    href: '#stats',
    status: 'active',
  },
  {
    id: 'supporter',
    label: 'Suporter',
    subtitle: 'Voting suporter madrasah',
    icon: 'Megaphone',
    badge: { type: 'text', text: 'HOT', isHot: true },
    href: '#supporter',
    status: 'active',
  },
];

/**
 * Admin Sidebar Menu Groups Configuration.
 * Grouped into:
 * - BERANDA
 * - PERSIAPAN KOMPETISI
 * - PESERTA
 * - PERTANDINGAN
 * - PETUGAS
 * - PENGATURAN
 * - TIKET MASUK (conditional on FEATURES.ticketing)
 */
export const getAdminMenuConfig = (counts?: {
  pendingTeams?: number;
  unverifiedMatches?: number;
}): AdminMenuGroupConfig[] => {
  const groups: AdminMenuGroupConfig[] = [
    {
      id: 'sec_beranda',
      title: 'BERANDA',
      icon: 'BarChart3',
      items: [
        {
          id: 'overview_stats',
          label: 'Ringkasan Utama',
          icon: 'BarChart3',
          status: 'active',
        },
      ],
    },
    {
      id: 'sec_persiapan',
      title: 'PERSIAPAN KOMPETISI',
      icon: 'CalendarDays',
      items: [
        {
          id: 'competitions_list',
          label: 'Daftar Kompetisi',
          icon: 'Trophy',
          status: 'active',
        },
        {
          id: 'sports_list',
          label: 'Cabang Olahraga',
          icon: 'Boxes',
          status: 'active',
        },
        {
          id: 'categories_numbers',
          label: 'Kategori Kelas',
          icon: 'Layers',
          tooltip: 'Contoh: Putra U-15, kelas 55 kg',
          status: 'active',
        },
        {
          id: 'venues_courts',
          label: 'Lokasi Lapangan',
          icon: 'MapPin',
          status: 'active',
        },
      ],
    },
    {
      id: 'sec_peserta',
      title: 'PESERTA',
      icon: 'Users',
      items: [
        {
          id: 'registration_verify',
          label: 'Verifikasi Berkas',
          icon: 'CheckSquare',
          badge: counts?.pendingTeams && counts.pendingTeams > 0
            ? { type: 'count', text: `${counts.pendingTeams} menunggu`, count: counts.pendingTeams }
            : undefined,
          status: 'active',
        },
        {
          id: 'contingents_teams',
          label: 'Daftar Tim',
          icon: 'Users',
          status: 'active',
        },
        {
          id: 'athletes_players',
          label: 'Daftar Atlet',
          icon: 'UserCheck',
          status: 'active',
        },
      ],
    },
        {
      id: 'sec_pertandingan',
      title: 'PERTANDINGAN',
      icon: 'Swords',
      items: [
        {
          id: 'schedule_plotting',
          label: 'Jadwal & Hasil Laga',
          subtitle: 'Plotting jadwal, input skor & status pertandingan',
          icon: 'Calendar',
          status: 'active',
        },
        {
          id: 'live_score_override',
          label: 'Live Score Lapangan',
          subtitle: 'Kontrol skor real-time & override darurat meja juri',
          icon: 'Radio',
          status: 'active',
        },
        {
          id: 'group_standings',
          label: 'Klasemen Grup',
          subtitle: 'Perolehan poin grup & status kualifikasi',
          icon: 'ListOrdered',
          status: 'active',
        },
        {
          id: 'drawing_bracket',
          label: 'Bagan Babak Gugur',
          subtitle: 'Bracket perempat, semifinal & final',
          icon: 'GitBranch',
          status: 'active',
        },
      ],
    },
{
      id: 'sec_pengaturan',
      title: 'PENGATURAN',
      icon: 'Settings',
      items: [
        {
          id: 'event_settings',
          label: 'Pengaturan Publik',
          subtitle: 'Identitas turnamen, banner & tampilan publik',
          icon: 'Globe',
          status: 'active',
        },
        {
          id: 'match_settings',
          label: 'Pengaturan Pertandingan',
          subtitle: 'Aturan cabor, durasi waktu babak, skema poin & penugasan wasit',
          icon: 'Swords',
          status: 'active',
        },
        {
          id: 'account_settings',
          label: 'Pengaturan Akun',
          subtitle: 'Profil admin & akun petugas lapangan',
          icon: 'UserCog',
          status: 'active',
        },
        {
          id: 'backup_restore',
          label: 'Pengaturan Database',
          subtitle: 'Cadangan database, impor & ekspor CSV/JSON',
          icon: 'Database',
          status: 'active',
        },
      ],
    },
  ];

  // Conditional ticketing menu group
  if (FEATURES.ticketing) {
    groups.push({
      id: 'sec_ticketing',
      title: 'TIKET MASUK',
      icon: 'Ticket',
      items: [
        {
          id: 'ticket_management',
          label: 'Kuota Tiket',
          icon: 'Ticket',
          status: 'active',
        },
        {
          id: 'transaction_history',
          label: 'Riwayat Transaksi',
          icon: 'Receipt',
          status: 'active',
        },
        {
          id: 'qr_scanner_gate',
          label: 'Pindai Tiket',
          icon: 'QrCode',
          badge: { type: 'text', text: 'SCAN' },
          status: 'active',
        },
      ],
    });
  }

  return groups;
};

/**
 * Referee (Juri) Menu Configuration.
 * Ordered per specification:
 * 1. Tugas Saya (sub: "Hari ini, mendatang, riwayat", badge: "{n} AKTIF")
 * 2. Catat Skor (sub: "Pertandingan yang sedang berjalan", badge: LIVE)
 * 3. Laporan & Catatan (BARU, Segera, sub: "Catatan wasit dan kejadian khusus")
 * 4. Buku Aturan (sub: "Aturan tiap cabang olahraga")
 * 5. Profil & Kesiapan (sub: "Akun dan status siap bertugas")
 */
export const getRefereeMenuConfig = (activeDutyCount: number = 1): MenuItemConfig[] => [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    status: 'active',
  },
  {
    id: 'duty',
    label: 'Laga',
    icon: 'ClipboardList',
    badge: { type: 'count', text: `${activeDutyCount} AKTIF`, count: activeDutyCount },
    status: 'active',
  },
  {
    id: 'match_center',
    label: 'Skor',
    icon: 'Activity',
    badge: { type: 'live', text: 'LIVE' },
    status: 'active',
  },
  {
    id: 'standings',
    label: 'Klasemen & Bagan',
    icon: 'ListOrdered',
    status: 'active',
  },
  {
    id: 'supporter_scoring',
    label: 'Skor Suporter',
    icon: 'Megaphone',
    status: 'active',
  },
  {
    id: 'reports',
    label: 'Laporan',
    icon: 'FileText',
    status: 'active',
  },
  {
    id: 'rulebook',
    label: 'Aturan',
    icon: 'BookOpen',
    status: 'active',
  },
  {
    id: 'profile',
    label: 'Profil',
    icon: 'User',
    status: 'active',
  },
];
