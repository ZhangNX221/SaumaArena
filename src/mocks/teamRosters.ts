import { Player } from '@/types';

export const makePlayers = (
  prefix: string,
  playersData: Array<[name: string, num: number, pos?: string]>
): Player[] =>
  playersData.map(([name, num, pos], idx) => ({
    id: `p-${prefix}-${idx + 1}`,
    name,
    number: num,
    position: pos || (idx === 0 ? 'Kiper' : idx === 1 ? 'Anchor' : idx === 2 || idx === 3 ? 'Flank' : 'Pivot'),
    photoUrl: '',
    nisn: `013${String(num).padStart(2, '0')}${String(idx + 1).padStart(2, '0')}`,
    documentStatus: 'APPROVED' as const,
    yellowCards: 0,
    redCards: 0,
    goals: 0,
    assists: 0,
  }));

export const createDefaultPlayers = (prefix: string, teamIndex: number): Player[] => [
  { id: `p-${prefix}-1`, name: 'Pemain 1', number: 1, position: 'Kiper', photoUrl: '', nisn: `013${String(teamIndex).padStart(2, '0')}0101`, documentStatus: 'APPROVED', yellowCards: 0, redCards: 0, goals: 0, assists: 0 },
  { id: `p-${prefix}-2`, name: 'Pemain 2', number: 2, position: 'Anchor', photoUrl: '', nisn: `013${String(teamIndex).padStart(2, '0')}0102`, documentStatus: 'APPROVED', yellowCards: 0, redCards: 0, goals: 0, assists: 0 },
  { id: `p-${prefix}-3`, name: 'Pemain 3', number: 3, position: 'Flank', photoUrl: '', nisn: `013${String(teamIndex).padStart(2, '0')}0103`, documentStatus: 'APPROVED', yellowCards: 0, redCards: 0, goals: 0, assists: 0 },
  { id: `p-${prefix}-4`, name: 'Pemain 4', number: 4, position: 'Flank', photoUrl: '', nisn: `013${String(teamIndex).padStart(2, '0')}0104`, documentStatus: 'APPROVED', yellowCards: 0, redCards: 0, goals: 0, assists: 0 },
  { id: `p-${prefix}-5`, name: 'Pemain 5', number: 5, position: 'Pivot', photoUrl: '', nisn: `013${String(teamIndex).padStart(2, '0')}0105`, documentStatus: 'APPROVED', yellowCards: 0, redCards: 0, goals: 0, assists: 0 },
];

export const KARDINA_A_PLAYERS = makePlayers('km', [
  ['Exel', 15, 'Kiper'], ['Farris', 11, 'Anchor'], ['Reza', 13, 'Flank'],
  ['Rido', 10, 'Flank'], ['Fiofal', 12, 'Pivot'], ['Alfin', 8, 'Pemain'],
  ['Afnan', 6, 'Pemain'], ['Loor', 4, 'Pemain'], ['Atha', 2, 'Pemain'], ['Marun', 14, 'Pemain'],
]);

export const KARDINA_B_PLAYERS = makePlayers('kmb', [
  ['Exele', 15, 'Kiper'], ['Dude', 10, 'Anchor'], ['Marvel', 14, 'Flank'],
  ['Noval', 12, 'Flank'], ['Fahreza', 13, 'Pivot'], ['Igor Kenzi', 4, 'Pemain'],
  ['Athalla', 2, 'Pemain'], ['Afnan', 6, 'Pemain'], ['Alfin', 8, 'Pemain'], ['Faris', 11, 'Pemain'],
]);

export const MIN7_PLAYERS = makePlayers('m7', [
  ['Vika', 8, 'Flank'], ['Arka', 4, 'Anchor'], ['Danil', 6, 'Flank'],
  ['Dara Adi', 9, 'Pivot'], ['Facil', 18, 'Pemain'], ['Rafiul', 14, 'Pemain'],
  ['Azzam', 31, 'Pemain'], ['Zidan', 7, 'Pemain'], ['Putra', 22, 'Pemain'],
  ['Mirzano', 1, 'Kiper'], ['Firas', 10, 'Pemain'], ['Ali', 21, 'Pemain'],
]);

export const MIN8_PLAYERS = makePlayers('m8', [
  ['Anggara', 5, 'Anchor'], ['Mikenzo', 7, 'Flank'], ['M. Agam', 27, 'Pemain'],
  ['M. Faris', 2, 'Pemain'], ['Nayotama', 4, 'Pemain'], ['M. Albar', 8, 'Flank'],
  ['Abdigan Zaki', 20, 'Pemain'], ['Adam Wistara', 9, 'Pivot'], ['M. Satria', 13, 'Pemain'],
  ['Mizaluna', 12, 'Pemain'], ['Firza', 1, 'Kiper'], ['Azrat Zahir', 30, 'Pemain'],
]);

export const SDN1_SRENGAT_PLAYERS = makePlayers('s1', [
  ['Yodha', 4, 'Kiper'], ['Abyan', 9, 'Pivot'], ['Nanda Arsya', 3, 'Anchor'],
  ['Eghy', 10, 'Flank'], ['Muzafy', 7, 'Flank'], ['Yoko', 5, 'Pemain'],
  ['Arsya', 14, 'Pemain'], ['Abinaya', 19, 'Pemain'], ['Zidane', 17, 'Pemain'], ['Adit', 21, 'Kiper'],
]);

export const MIN14_A_PLAYERS = makePlayers('m14', [
  ['Atha', 10, 'Pivot'], ['Fahri', 12, 'Kiper'], ['Wafi', 8, 'Anchor'],
  ['Farel', 11, 'Flank'], ['Rafi', 5, 'Flank'], ['Krisna', 6, 'Pemain'],
  ['Fahri', 7, 'Pemain'], ['Arya', 3, 'Pemain'], ['Andika', 9, 'Pemain'],
  ['Syailendra', 2, 'Pemain'], ['Fahmi', 13, 'Pemain'], ['Hilmi', 14, 'Pemain'],
]);

export const MIN14_B_PLAYERS = makePlayers('m14b', [
  ['Fahri', 12, 'Kiper'], ['Krisna', 6, 'Anchor'], ['Atha', 10, 'Pivot'],
  ['Farel', 11, 'Flank'], ['Fahri', 7, 'Flank'], ['Wafi', 8, 'Pemain'],
  ['Andika', 9, 'Pemain'], ['Rafi', 5, 'Pemain'], ['Fahmi', 13, 'Pemain'],
  ['Hilmi', 14, 'Pemain'], ['Rendra', 2, 'Pemain'], ['Ruko Arya', 13, 'Pemain'],
]);

export const MAMBAUL_ULUM_PLAYERS = makePlayers('mu', [
  ['Fahmi', 14, 'Kiper'], ['Vino', 9, 'Anchor'], ['Rafa', 11, 'Flank'],
  ['Kenzie', 10, 'Flank'], ['Mirza', 5, 'Pivot'], ['Ardani', 6, 'Pemain'],
  ['Arsen', 12, 'Pemain'], ['Rafa', 7, 'Pemain'], ['Abid', 8, 'Pemain'],
  ['Azka', 4, 'Pemain'], ['Shifari', 2, 'Pemain'], ['Abdan', 3, 'Pemain'],
]);

export const MIN2_PLAYERS = makePlayers('m2', [
  ['Sobik', 16, 'Kiper'], ['Rafael', 12, 'Anchor'], ['Abi', 18, 'Flank'],
  ['Nio', 7, 'Flank'], ['Hobibi', 14, 'Pivot'], ['Raka', 19, 'Pemain'],
  ['Lintang', 4, 'Pemain'], ['Nizam', 7, 'Pemain'], ['Nevan', 26, 'Pemain'],
  ['Zidan', 18, 'Pemain'], ['Andika', 9, 'Pemain'],
]);

export const WAHID_HASYIM_PLAYERS = makePlayers('wh', [
  ['Nora', 45, 'Kiper'], ['Raffi', 99, 'Anchor'], ['Brilian', 78, 'Flank'],
  ['Fatih', 11, 'Flank'], ['Farhan', 55, 'Pivot'], ['Baim K.', 11, 'Pemain'],
  ['Baim B.', 10, 'Pemain'], ['Arif', 56, 'Pemain'], ['Fariq', 28, 'Pemain'],
  ['Zafran', 12, 'Pemain'], ['Ippo', 46, 'Pemain'], ['Idris', 33, 'Pemain'],
]);

export const PLOSO_PLAYERS = makePlayers('pl', [
  ['Fahmi', 20, 'Kiper'], ['Fathan', 15, 'Anchor'], ['Zaka', 18, 'Flank'],
  ['Fathir', 7, 'Flank'], ['Alivin', 9, 'Pivot'], ['Athaya', 1, 'Pemain'],
  ['Farel', 16, 'Pemain'], ['Davin', 5, 'Pemain'], ['Ridho', 6, 'Pemain'], ['Zidan', 23, 'Pemain'],
]);

export const MIN5_TA_PLAYERS = makePlayers('m5', [
  ['Adam', 1, 'Kiper'], ['Tegar', 6, 'Anchor'], ['Nazril', 7, 'Flank'],
  ['Ilham', 8, 'Flank'], ['Fatih', 10, 'Pivot'], ['Abid', 9, 'Pemain'],
  ['Kevin', 9, 'Pemain'], ['Zidan', 11, 'Pemain'], ['Rizky', 2, 'Pemain'], ['David', 3, 'Pemain'],
]);

