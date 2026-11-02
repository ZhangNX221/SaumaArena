import { Player } from '@/types';

export const makePlayers = (
  prefix: string,
  playersData: Array<[name: string, num: number, pos?: string, goals?: number]>
): Player[] =>
  playersData.map(([name, num, pos, goals], idx) => ({
    id: `p-${prefix}-${idx + 1}`,
    name,
    number: num,
    position: pos || (idx === 0 ? 'Kiper' : idx === 1 ? 'Anchor' : idx === 2 || idx === 3 ? 'Flank' : 'Pivot'),
    photoUrl: '',
    nisn: `013${String(num).padStart(2, '0')}${String(idx + 1).padStart(2, '0')}`,
    documentStatus: 'APPROVED' as const,
    yellowCards: 0,
    redCards: 0,
    goals: goals || 0,
    assists: 0,
  }));

export const createDefaultPlayers = (prefix: string, teamIndex: number): Player[] => [
  { id: `p-${prefix}-1`, name: 'Pemain 1', number: 1, position: 'Kiper', photoUrl: '', nisn: `013${String(teamIndex).padStart(2, '0')}0101`, documentStatus: 'APPROVED', yellowCards: 0, redCards: 0, goals: 0, assists: 0 },
  { id: `p-${prefix}-2`, name: 'Pemain 2', number: 2, position: 'Anchor', photoUrl: '', nisn: `013${String(teamIndex).padStart(2, '0')}0102`, documentStatus: 'APPROVED', yellowCards: 0, redCards: 0, goals: 0, assists: 0 },
  { id: `p-${prefix}-3`, name: 'Pemain 3', number: 3, position: 'Flank', photoUrl: '', nisn: `013${String(teamIndex).padStart(2, '0')}0103`, documentStatus: 'APPROVED', yellowCards: 0, redCards: 0, goals: 0, assists: 0 },
  { id: `p-${prefix}-4`, name: 'Pemain 4', number: 4, position: 'Flank', photoUrl: '', nisn: `013${String(teamIndex).padStart(2, '0')}0104`, documentStatus: 'APPROVED', yellowCards: 0, redCards: 0, goals: 0, assists: 0 },
  { id: `p-${prefix}-5`, name: 'Pemain 5', number: 5, position: 'Pivot', photoUrl: '', nisn: `013${String(teamIndex).padStart(2, '0')}0105`, documentStatus: 'APPROVED', yellowCards: 0, redCards: 0, goals: 0, assists: 0 },
];

export const KARDINA_PLAYERS = makePlayers('km', [
  ['Exel', 15, 'Kiper'],
  ['Dude', 10, 'Anchor'],
  ['Faris', 11, 'Flank'],
  ['Noval', 12, 'Flank'],
  ['Fahreza', 13, 'Pivot'],
  ['Marvel', 14, 'Pemain'],
  ['Igor Kenzi', 4, 'Pemain'],
  ['Athalla', 2, 'Pemain'],
  ['Afnan', 6, 'Pemain'],
  ['Alfin', 8, 'Pemain'],
  ['Rido', 10, 'Pemain'],
  ['Fiofal', 12, 'Pemain'],
]);
export const KARDINA_A_PLAYERS = KARDINA_PLAYERS;
export const KARDINA_B_PLAYERS = KARDINA_PLAYERS;

export const MIN7_PLAYERS = makePlayers('m7', [
  ['Vika', 8, 'Flank', 1], ['Arka', 4, 'Anchor'], ['Danil', 6, 'Flank'],
  ['Dara Adi', 9, 'Pivot', 1], ['Facil', 18, 'Pemain'], ['Rafiul', 14, 'Pemain'],
  ['Azzam', 31, 'Pemain'], ['Zidan', 7, 'Pemain'], ['Putra', 22, 'Pemain'],
  ['Mirzano', 1, 'Kiper'], ['Firas', 10, 'Pemain'], ['Ali', 21, 'Pemain'],
]);

export const MIN8_PLAYERS = makePlayers('m8', [
  ['Anggara', 5, 'Anchor'], ['Mikenzo', 7, 'Flank'], ['M. Agam', 27, 'Pemain'],
  ['M. Faris', 2, 'Pemain'], ['Nayotama', 4, 'Pemain'], ['M. Albar', 8, 'Flank'],
  ['Abdigan Zaki', 20, 'Pemain'], ['Adam Wistara', 9, 'Pivot', 2], ['M. Satria', 13, 'Pemain'],
  ['Mizaluna', 12, 'Pemain'], ['Firza', 1, 'Kiper'], ['Azrat Zahir', 30, 'Pemain'],
]);

export const SDN1_SRENGAT_PLAYERS = makePlayers('s1', [
  ['Yodha', 4, 'Kiper'], ['Abyan', 9, 'Pivot', 2], ['Nanda Arsya', 3, 'Anchor'],
  ['Eghy', 10, 'Flank', 1], ['Muzafy', 7, 'Flank', 1], ['Yoko', 5, 'Pemain'],
  ['Arsya', 14, 'Pemain'], ['Abinaya', 19, 'Pemain'], ['Zidane', 17, 'Pemain'], ['Adit', 21, 'Kiper'],
]);

export const MIN14_PLAYERS = makePlayers('m14', [
  ['Fahri', 12, 'Kiper'],
  ['Atha', 10, 'Pivot'],
  ['Wafi', 8, 'Anchor'],
  ['Farel', 11, 'Flank'],
  ['Rafi', 5, 'Flank'],
  ['Krisna', 6, 'Pemain'],
  ['Fahri', 7, 'Pemain'],
  ['Arya', 3, 'Pemain'],
  ['Andika', 9, 'Pemain'],
  ['Syailendra', 2, 'Pemain'],
  ['Fahmi', 13, 'Pemain'],
  ['Hilmi', 14, 'Pemain'],
]);
export const MIN14_A_PLAYERS = MIN14_PLAYERS;
export const MIN14_B_PLAYERS = MIN14_PLAYERS;

export const MAMBAUL_ULUM_PLAYERS = makePlayers('mu', [
  ['Fahmi', 14, 'Kiper'], ['Vino', 9, 'Anchor'], ['Rafa', 11, 'Flank', 1],
  ['Kenzie', 10, 'Flank', 2], ['Mirza', 5, 'Pivot', 3], ['Ardani', 6, 'Pemain'],
  ['Arsen', 12, 'Pemain'], ['Rafa', 7, 'Pemain'], ['Abid', 8, 'Pemain'],
  ['Azka', 4, 'Pemain'], ['Shifari', 2, 'Pemain'], ['Abdan', 3, 'Pemain'],
]);

export const MIN2_PLAYERS = makePlayers('m2', [
  ['Sobik', 16, 'Kiper'], ['Rafael', 12, 'Anchor'], ['Abi', 18, 'Flank', 1],
  ['Nio', 7, 'Flank'], ['Hobibi', 14, 'Pivot', 2], ['Raka', 19, 'Pemain'],
  ['Lintang', 4, 'Pemain'], ['Nizam', 7, 'Pemain'], ['Nevan', 26, 'Pemain'],
  ['Zidan', 18, 'Pemain'], ['Andika', 9, 'Pemain'],
]);

export const WAHID_HASYIM_PLAYERS = makePlayers('wh', [
  ['Nora', 45, 'Kiper'], ['Raffi', 99, 'Anchor'], ['Brilian', 78, 'Flank'],
  ['Fatih', 11, 'Flank', 2], ['Farhan', 55, 'Pivot', 3], ['Baim K.', 11, 'Pemain'],
  ['Baim B.', 10, 'Pemain'], ['Arif', 56, 'Pemain'], ['Fariq', 28, 'Pemain'],
  ['Zafran', 12, 'Pemain'], ['Ippo', 46, 'Pemain'], ['Idris', 33, 'Pemain'],
]);

export const PLOSO_PLAYERS = makePlayers('pl', [
  ['Fahmi', 20, 'Kiper'], ['Fathan', 15, 'Anchor'], ['Zaka', 18, 'Flank'],
  ['Fathir', 7, 'Flank'], ['Alivin', 9, 'Pivot', 1], ['Athaya', 1, 'Pemain'],
  ['Farel', 16, 'Pemain'], ['Davin', 5, 'Pemain'], ['Ridho', 6, 'Pemain'], ['Zidan', 23, 'Pemain'],
]);

export const MIN5_TA_PLAYERS = makePlayers('m5', [
  ['Adam', 1, 'Kiper'], ['Tegar', 6, 'Anchor'], ['Nazril', 7, 'Flank'],
  ['Ilham', 8, 'Flank', 2], ['Fatih', 10, 'Pivot', 3], ['Abid', 9, 'Pemain'],
  ['Kevin', 9, 'Pemain'], ['Zidan', 11, 'Pemain'], ['Rizky', 2, 'Pemain'], ['David', 3, 'Pemain'],
]);

export const MIN13_A_PLAYERS = makePlayers('m13b', [
  ['Dias', 12, 'Kiper'],
  ['Hafiz', 40, 'Anchor'],
  ['Asraf', 8, 'Flank'],
  ['Rehan', 17, 'Flank'],
  ['Ridho', 5, 'Pivot'],
  ['Azka', 11, 'Pemain'],
  ['Moas', 24, 'Pemain'],
  ['Wilhan', 21, 'Pemain'],
  ['Bagas', 16, 'Pemain'],
  ['Zico', 19, 'Pemain'],
  ['Arvino', 9, 'Pemain'],
  ['Dafi', 23, 'Pemain'],
]);

export const MIN13_B_PLAYERS = makePlayers('m13c', [
  ['Aqila Yusuf', 1, 'Kiper'],
  ['Jofin', 32, 'Anchor'],
  ['Andro', 7, 'Flank'],
  ['Rayhan', 30, 'Flank'],
  ['Rifawi', 37, 'Pivot', 1],
  ['Alianto', 4, 'Pemain'],
  ['Arjuna', 12, 'Pemain'],
  ['Gesang', 27, 'Pemain'],
  ['Akhtor', 22, 'Pemain'],
  ['M.S. Rajendra', 6, 'Pemain'],
  ['Khorisma K.', 18, 'Pemain'],
  ['Ferman', 2, 'Pemain'],
]);

export const DARUSSALAM_PLAYERS = makePlayers('ds', [
  ['Keynis', 23, 'Kiper'],
  ['Aby', 6, 'Anchor'],
  ['Fauzan', 12, 'Flank'],
  ['Ziko', 6, 'Flank', 2],
  ['Ilham', 7, 'Pivot', 3],
  ['Elang', 5, 'Pemain', 2],
  ['Faiz', 3, 'Pemain'],
  ['Asraf', 17, 'Pemain'],
  ['Nanda', 7, 'Pemain'],
  ['Hilmy', 2, 'Pemain'],
  ['Habibi', 10, 'Pemain'],
  ['Nizar', 21, 'Pemain'],
]);

export const YABUNAYYA_PLAYERS = makePlayers('yb', [
  ['Rrichard', 1, 'Kiper'],
  ['Abbiyu', 10, 'Anchor'],
  ['Pahrera', 5, 'Flank'],
  ['Panji', 7, 'Flank'],
  ['Raihan', 11, 'Pivot', 1],
  ['Gian', 3, 'Pemain'],
  ['Arjuna', 2, 'Pemain'],
  ['Rheyhan', 8, 'Pemain'],
  ['Rossaul', 4, 'Pemain'],
  ['Moura', 9, 'Pemain'],
  ['Gilang', 12, 'Pemain'],
]);




