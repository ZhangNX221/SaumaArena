import { TicketCategoryItem, PaymentChannelItem } from '@/types/ticket';

export const TICKET_CATEGORIES: TicketCategoryItem[] = [
  {
    id: 'REGULER',
    name: 'Tribun Reguler',
    badge: 'Populer',
    pricePerPerson: 10000,
    minQty: 1,
    defaultQty: 1,
    description: 'Akses masuk bebas ke seluruh laga turnamen futsal hari ini di tribun umum.',
    benefits: ['Bebas pilih tempat duduk tribun', 'Akses masuk 1 hari penuh', '+1 Poin Dukungan Suporter'],
  },
  {
    id: 'PELAJAR',
    name: 'Pelajar Berseragam',
    badge: 'Diskon 50%',
    pricePerPerson: 5000,
    minQty: 1,
    defaultQty: 1,
    description: 'Tarif khusus pelajar SD/MI/SMP/MTs mengenakan seragam sekolah/almamater.',
    benefits: ['Tarif subsidi Milad Matsanega I', 'Wajib menunjukkan kartu pelajar / seragam', '+1 Poin Suporter'],
  },
  {
    id: 'ROMBONGAN',
    name: 'Paket Suporter (5 Tiket)',
    badge: 'Hemat Rp 10.000',
    pricePerPerson: 8000, // 5 * 8000 = 40.000 (normal 50.000)
    minQty: 5,
    defaultQty: 5,
    description: 'Paket hemat rombongan suporter madrasah minimal 5 orang dalam 1 rombongan.',
    benefits: ['1 E-Tiket untuk 5 orang rombongan', 'Langsung +5 poin suporter sekolah', 'Area tribun kompak'],
  },
  {
    id: 'VIP',
    name: 'Tribun VIP Utama',
    badge: 'Kenyamanan Maksimal',
    pricePerPerson: 25000,
    minQty: 1,
    defaultQty: 1,
    description: 'Tribun tengah beratap teduh dengan kursi individu dan akses air mineral gratis.',
    benefits: ['Kursi tribun tengah terbaik', 'Akses jalur masuk khusus tanpa antre', 'Air mineral & snack cup'],
  },
];

export const PAYMENT_CHANNELS: PaymentChannelItem[] = [
  // 1. QRIS
  {
    id: 'QRIS',
    name: 'QRIS (Semua Bank & E-Wallet)',
    group: 'QRIS',
    desc: 'Scan instan via GoPay, OVO, DANA, BCA Mobile, Livin, BRImo, LinkAja',
    badge: 'Instan & Otomatis',
    fee: 0,
  },
  // 2. Virtual Account Bank
  {
    id: 'VA_BCA',
    name: 'BCA Virtual Account',
    group: 'VA',
    desc: 'Verifikasi instan 24 jam via myBCA, BCA mobile, KlikBCA, ATM',
    fee: 0,
  },
  {
    id: 'VA_MANDIRI',
    name: 'Mandiri Virtual Account',
    group: 'VA',
    desc: 'Pembayaran via Livin by Mandiri & ATM Mandiri',
    fee: 0,
  },
  {
    id: 'VA_BRI',
    name: 'BRIVA (BRI Virtual Account)',
    group: 'VA',
    desc: 'Pembayaran via aplikasi BRImo, ATM BRI, dan Agen BRILink',
    fee: 0,
  },
  {
    id: 'VA_BNI',
    name: 'BNI Virtual Account',
    group: 'VA',
    desc: 'Pembayaran via BNI Mobile Banking dan ATM BNI',
    fee: 0,
  },
  // 3. E-Wallet
  {
    id: 'GOPAY',
    name: 'GoPay',
    group: 'EWALLET',
    desc: 'Buka aplikasi GoPay atau Tokopedia untuk bayar',
    fee: 0,
  },
  {
    id: 'DANA',
    name: 'DANA Dompet Digital',
    group: 'EWALLET',
    desc: 'Pembayaran langsung terhubung dengan akun DANA',
    fee: 0,
  },
  {
    id: 'OVO',
    name: 'OVO',
    group: 'EWALLET',
    desc: 'Notifikasi pembayaran langsung ke aplikasi OVO',
    fee: 0,
  },
  {
    id: 'SHOPEEPAY',
    name: 'ShopeePay',
    group: 'EWALLET',
    desc: 'Pembayaran via aplikasi Shopee & ShopeePay',
    fee: 0,
  },
  // 4. Tunai di Loket
  {
    id: 'CASH_GATE',
    name: 'Bayar Tunai di Pintu Masuk (Loket Venue)',
    group: 'CASH',
    desc: 'Dapatkan kode booking, bayar uang pas saat tiba di loket MTsN 1 Malang',
    badge: 'Tanpa M-Banking',
    fee: 0,
  },
];
