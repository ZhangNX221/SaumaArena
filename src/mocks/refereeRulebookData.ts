export interface RuleArticle {
  id: string;
  number: number;
  category: string;
  title: string;
  summary: string;
  points: string[];
  refereeTip: string;
}

export interface QuickMetric {
  label: string;
  value: string;
  detail: string;
}

// Data Regulasi Mendalam Khusus Futsal (FFI / FIFA Futsal Laws of the Game 2026)
export const FUTSAL_CHEAT_SHEET: QuickMetric[] = [
  { label: 'Durasi Laga', value: '2 x 10 Menit', detail: 'Durasi pertandingan 2 x 10 menit' },
  { label: 'Hak Time-Out', value: '1x / Babak (60s)', detail: 'Hanya saat bola mati & dikuasai tim pemohon' },
  { label: 'Akumulasi Foul', value: 'Maks. 5 Foul', detail: 'Foul ke-6 dst = Titik ke-2 (10m) tanpa pagar' },
  { label: 'Jarak Pagar Betis', value: '5 Meter', detail: 'Wajib dipatuhi pada kick-in, corner & free-kick' },
  { label: 'Batas Bola Mati', value: 'Maks. 4 Detik', detail: 'Hitungan visual wasit pada restart & kiper' },
  { label: 'Hukuman Kartu Merah', value: '2 Menit (4 Pemain)', detail: 'Boleh kembali 5 pemain jika lawan cetak gol' },
];

export const FUTSAL_ARTICLES: RuleArticle[] = [
  {
    id: 'pasal-1',
    number: 1,
    category: 'Waktu & Durasi',
    title: 'Durasi Pertandingan, Time-out & Penghentian Waktu Darurat',
    summary: 'Ketentuan durasi normal, mekanisme penghentian stopwatch resmi, serta tata cara permohonan time-out meja.',
    points: [
      'Durasi pertandingan 2 x 10 menit (waktu kotor pada fase penyisihan grup; waktu bersih efektif mulai fase semifinal & final).',
      'Setiap tim berhak atas 1 (satu) kali time-out berdurasi 60 detik di setiap babak. Time-out yang tidak diambil di babak pertama hangus dan tidak dapat diakumulasi.',
      'Permohonan time-out hanya dapat diajukan oleh Pelatih Kepala kepada Meja Pencatat Waktu (Wasit 3) menggunakan papan penanda time-out resmi.',
      'Time-out hanya diberikan saat bola keluar lapangan (dead ball) dan berada dalam penguasaan tim yang mengajukan.',
      'Jeda istirahat antarbabak berdurasi maksimal 10 menit.',
      'Stopwatch otomatis dihentikan sementara atas instruksi Wasit 1 saat penanganan cedera parah, pembersihan lantai basah, atau konsultasi insiden.',
    ],
    refereeTip: 'Sinyal wasit 3: Bunyikan klakson/buzzer meja juri segera saat bola keluar lapangan setelah papan time-out diserahkan pelatih. Waktu 60 detik dihitung sejak peluit ditiup.',
  },
  {
    id: 'pasal-2',
    number: 2,
    category: 'Akumulasi & Penalti',
    title: 'Akumulasi Pelanggaran (Foul) & Titik Penalti Kedua (10 Meter)',
    summary: 'Batas akumulasi 5 pelanggaran langsung per babak dan sanksi tendangan bebas langsung dari titik 10 meter.',
    points: [
      'Pelanggaran langsung (direct free kick foul) dihitung sebagai akumulasi foul tim. Pelanggaran tidak langsung tidak dihitung.',
      'Toleransi pelanggaran adalah maksimal 5 (lima) foul per tim dalam satu babak. Pada foul ke-1 hingga ke-5, tim bertahan berhak membentuk pagar betis berjarak 5 meter.',
      'Mulai pelanggaran ke-6 dan seterusnya dalam babak yang sama, tim lawan diberikan tendangan penalti dari Titik Kedua (jarak 10 meter dari gawang).',
      'Ketentuan Eksekusi Titik 10 Meter: (a) Dilarang membentuk pagar betis; (b) Kiper boleh maju maksimal hingga 5 meter dari bola; (c) Penendang harus berniat mencetak gol langsung (tidak boleh mengoper); (d) Pemain lain berada di belakang garis bola.',
      'Opsi Titik Pelanggaran: Jika pelanggaran ke-6 dst terjadi di antara titik 10 meter dan garis area D kiper, penendang berhak memilih menendang dari titik terjadinya foul atau dari titik tetap 10 meter.',
      'Akumulasi foul di-reset kembali ke angka 0 (nol) pada awal babak kedua. Pada babak perpanjangan waktu (extra time), akumulasi foul babak ke-2 tetap dilanjutkan.',
    ],
    refereeTip: 'Angkat 5 jari ke arah meja juri saat suatu tim mencapai foul ke-5, dan wasit meja wajib menyalakan indikator lampu merah/tanda akumulasi 5 foul di meja.',
  },
  {
    id: 'pasal-3',
    number: 3,
    category: 'Regulasi Kiper',
    title: 'Regulasi Penjaga Gawang, Batas 4 Detik & Larangan Backpass',
    summary: 'Pedoman penguasaan bola oleh kiper di daerah sendiri, larangan menerima bola balik (backpass), dan goal clearance.',
    points: [
      'Aturan 4 Detik: Kiper dilarang menguasai bola (baik dengan tangan maupun kaki) lebih dari 4 detik di daerah lapangannya sendiri. Di daerah lawan, kiper bebas bermain tanpa batas 4 detik.',
      'Larangan Backpass: Setelah melepaskan bola dari penguasaannya, kiper dilarang menyentuh kembali bola yang dioper oleh rekan setim di area sendiri KECUALI: (a) Bola telah disentuh/dimainkan oleh pemain lawan; ATAU (b) Bola telah melewati garis tengah lapangan.',
      'Sanksi Pelanggaran Backpass: Dikenakan Tendangan Bebas Tidak Langsung (Indirect Free Kick) untuk lawan di titik pelanggaran (atau di garis batas D-box terluar jika terjadi di dalam area penalti).',
      'Pembersihan Gawang (Goal Clearance): Harus dilempar langsung menggunakan tangan oleh kiper keluar dari area D dalam tempo 4 detik. Kiper dilarang menaruh bola ke lantai lalu menendangnya.',
      'Gol langsung dari lemparan kiper (tanpa menyentuh pemain manapun di lapangan) dinyatakan TIDAK SAH.',
    ],
    refereeTip: 'Hitung 4 detik dengan gerakan ayunan lengan visual yang jelas terlihat oleh pemain dan penonton. Jangan membatalkan hitungan jika kiper hanya menggiring bola di tempat.',
  },
  {
    id: 'pasal-4',
    number: 4,
    category: 'Kartu & Disiplin',
    title: 'Pelanggaran Disiplin, Kartu Kuning, Kartu Merah & Aturan 2 Menit',
    summary: 'Klasifikasi peringatan, kartu merah langsung, prosedur pengurangan pemain selama 2 menit, serta ketentuan kebobolan gol.',
    points: [
      'Kartu Kuning: Diberikan untuk pelanggaran taktis (SPA), memperlambat restart pertandingan (>4 detik), melanggar jarak 5 meter, atau salah prosedur pergantian pemain.',
      'Kartu Merah: Diberikan untuk perbuatan kasar (violent conduct), meludahi orang lain, menggagalkan peluang gol bersih lawan (DOGSO), atau mencaci maki perangkat pertandingan.',
      'Aturan Pengurangan Pemain (Hukuman 2 Menit): Pemain yang terkena kartu merah langsung meninggalkan lapangan menuju ruang ganti. Timnya harus bermain dengan 4 pemain selama 2 menit waktu pertandingan.',
      'Kondisi Khusus Kebobolan Gol saat 4 Pemain: Jika tim dengan 5 pemain mencetak gol ke gawang tim dengan 4 pemain, tim yang terkena kartu merah BERHAK langsung memasukkan 1 pemain pengganti untuk menggenapi kembali menjadi 5 pemain.',
      'Jika kedua tim sama-sama bermain dengan 4 pemain dan terjadi gol, kedua tim tetap melanjutkan dengan 4 pemain hingga durasi 2 menit masing-masing selesai.',
      'Akumulasi 2 kartu kuning dalam laga yang sama menghasilkan kartu merah otomatis.',
    ],
    refereeTip: 'Pastikan pencatat waktu di meja mencatat menit terjadinya kartu merah dan menghitung tepat 2 menit waktu bermain sebelum mengizinkan pemain pengganti masuk.',
  },
  {
    id: 'pasal-5',
    number: 5,
    category: 'Pergantian & Restart',
    title: 'Prosedur Pergantian Pemain Bebas (Flying Substitution) & Bola Mati',
    summary: 'Tata tertib pergantian pemain di area teknik meja serta regulasi tendangan ke dalam (kick-in) dan sepak pojok.',
    points: [
      'Pergantian pemain dapat dilakukan kapan saja tanpa perlu menghentikan laga dan tanpa izin wasit (kecuali pergantian penjaga gawang).',
      'Pemain pengganti WAJIB menunggu pemain yang digantikan keluar melintasi garis tepi sepenuhnya di Zona Pergantian Tim sendiri (panjang 5 meter di depan bench).',
      'Rompi cadangan harus diserahkan dengan benar di garis batas pergantian.',
      'Sanksi Pelanggaran Pergantian: Pemain pengganti yang masuk mendahului diberi Kartu Kuning, dan lawan mendapat tendangan bebas tidak langsung dari tempat bola berada saat laga disetop.',
      'Tendangan ke Dalam (Kick-in): Bola harus diam sempurna di atas garis tepi atau maksimal 25 cm di belakang garis. Harus dieksekusi dalam tempo 4 detik dengan posisi kaki tidak masuk penuh ke dalam lapangan.',
      'Gol langsung dari kick-in TIDAK SAH (harus menyentuh pemain lain sebelum masuk ke gawang).',
      'Sepak Pojok (Corner Kick): Bola diletakkan di dalam busur sudut, batas eksekusi 4 detik, dan gol langsung dari sepak pojok dinyatakan SAH.',
    ],
    refereeTip: 'Jika eksekusi kick-in melebihi 4 detik atau bola tidak diletakkan diam di atas garis, tiup peluit dan serahkan penguasaan kick-in kepada tim lawan.',
  },
  {
    id: 'pasal-6',
    number: 6,
    category: 'Adu Penalti',
    title: 'Prosedur Adu Tendangan Penalti Babak Gugur & Reduksi Pemain',
    summary: 'Mekanisme penentuan pemenang pada laga imbang fase gugur, urutan penendang, dan prinsip kesetaraan jumlah pemain.',
    points: [
      'Format Awal: 3 (tiga) penendang utama dari masing-masing tim secara bergantian.',
      'Sudden Death: Jika setelah 3 penendang skor tetap imbang, dilanjutkan 1 lawan 1 hingga salah satu tim unggul pada jumlah tendangan yang sama.',
      'Semua pemain yang terdaftar sah di DSP dan tidak terkena kartu merah berhak menjadi penendang penalti, termasuk kiper dan pemain cadangan.',
      'Prinsip Reduksi Pemain (Equality of Numbers): Jika pada akhir laga salah satu tim memiliki jumlah pemain lebih sedikit karena kartu merah, tim lawan yang beranggotakan lebih banyak WAJIB mereduksi jumlah pemainnya agar sama sebelum adu penalti dimulai.',
      'Kiper boleh digantikan oleh pemain lain yang memenuhi syarat adu penalti kapan saja saat sesi penalti berlangsung.',
    ],
    refereeTip: 'Wasit 1 berada di garis gawang untuk memantau apakah kiper bergerak maju sebelum bola ditendang. Wasit 2 memposisikan diri di titik penalti sejajar bola.',
  },
  {
    id: 'pasal-7',
    number: 7,
    category: 'Protes & Ofisial',
    title: 'Protokol Protes Resmi, Hak Bicara Kapten & Disiplin Area Teknis',
    summary: 'Batasan interaksi dengan perangkat pertandingan, etika pelatih di bangku cadangan, serta syarat pengajuan protes tertulis.',
    points: [
      'Hanya Kapten tim yang mengenakan ban kapten di lapangan yang berhak berbicara secara sopan dengan Wasit 1 mengenai klarifikasi keputusan.',
      'Pelatih dan ofisial wajib berada di dalam area teknis (technical area) masing-masing dan dilarang keluar mendekati meja wasit tanpa izin.',
      'Wasit berhak memberikan Kartu Kuning atau Kartu Merah kepada ofisial bangku cadangan yang memprotes secara agresif atau memprovokasi penonton.',
      'Pengajuan Protes Resmi: Protes terhadap keabsahan pertandingan wajib diajukan tertulis oleh Manajer Tim ke Meja Komisioner selambat-lambatnya 15 menit pasca laga usai, disertai bukti dan biaya administrasi banding.',
      'Keputusan faktual wasit di lapangan mengenai gol, foul, dan skor adalah MUTLAK dan tidak dapat diganggu gugat setelah laga diakhiri.',
    ],
    refereeTip: 'Beri peringatan verbal pertama kepada pelatih yang berdiri di luar area teknis. Jika berulang, jangan ragu mengangkat kartu kuning untuk ofisial.',
  },
];
