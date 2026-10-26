export type SportCode =
  | 'ALL'
  | 'FUTSAL'
  | 'BADMINTON'
  | 'BASKET'
  | 'ESPORT'
  | 'SEPAK_BOLA'
  | 'VOLI'
  | 'SEPAK_TAKRAW'
  | 'TENIS_MEJA'
  | (string & {});

export type UserRole = 'ADMIN' | 'REFEREE';

export type ScoringType = 'TIME_BASED' | 'SET_POINTS' | 'PLACEMENT';

export type MatchStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'POSTPONED';

export type EventType = 
  | 'GOAL' 
  | 'POINT'
  | 'ASSIST' 
  | 'YELLOW_CARD' 
  | 'RED_CARD' 
  | 'FOUL' 
  | 'TIMEOUT' 
  | 'SUBSTITUTION' 
  | 'MEDICAL';

export interface SportConfig {
  code: SportCode;
  name: string;
  scoringType: ScoringType;
  scoringLabel: string;
  categories: string[];
  durationMinutes: number;
  periodCount: number;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  photoUrl: string;
  nisn: string;
  documentStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
  isSuspended?: boolean;
  suspensionReason?: string;
  yellowCards: number;
  redCards: number;
  goals: number;
  assists: number;
}

export interface Official {
  id: string;
  name: string;
  role: 'Pelatih Kepala' | 'Asisten Pelatih' | 'Manajer' | 'Medis';
  phone: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  schoolName: string;
  city: string;
  logoUrl: string;
  coachName: string;
  group: 'A' | 'B';
  rosterLocked: boolean;
  registrationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  rejectionNote?: string;
  players: Player[];
  officials: Official[];
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: EventType;
  teamId: string;
  playerId: string;
  playerName: string;
  detail?: string;
}

export interface MatchRefereeAssignment {
  refereeId: string;
  refereeName: string;
  role: 'WASIT_1' | 'WASIT_2' | 'WASIT_3' | 'PENCATAT_WAKTU';
  licenseLevel?: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  matchNumber: number;
  stage: 'GROUP' | 'QUARTER_FINAL' | 'SEMI_FINAL' | 'BRONZE' | 'FINAL';
  group?: 'A' | 'B';
  bracketNodeId?: string;
  teamAId: string;
  teamBId: string;
  teamAName: string;
  teamBName: string;
  teamALogo: string;
  teamBLogo: string;
  scoreA: number;
  scoreB: number;
  penaltyScoreA?: number;
  penaltyScoreB?: number;
  status: MatchStatus;
  currentPeriod?: 'BABAK_1' | 'JEDA' | 'BABAK_2' | 'ADU_PENALTI' | 'SELESAI';
  timeDisplay?: string;
  venueName: string;
  courtName: string;
  scheduledTime: string; // ISO string or readable
  events: MatchEvent[];
  bapSigned?: boolean;
  bapSigner?: string;
  isVerified?: boolean;
  refereeIds?: string[];
  assignedReferees?: MatchRefereeAssignment[];
}

export interface StandingRow {
  rank: number;
  teamId: string;
  teamName: string;
  logoUrl: string;
  schoolName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  fairPlayScore: number;
  qualificationStatus?: 'QUALIFIED' | 'ELIMINATED' | 'IN_CONTENTION';
}

export interface SupporterAssessment {
  id: string;
  matchId: string;
  teamId: string;
  schoolName: string;
  // Kriteria Positif
  choreography: boolean;     // +25
  schoolMascot: boolean;     // +20
  supporterUniform: boolean; // +15
  cheerMin3Chants: boolean;  // +10
  checkedInTickets: number;  // +1 per tiket
  // Kriteria Penalti
  incidentViolentChaos: boolean;      // -50
  incidentThrowObjects: boolean;      // -25
  incidentRacismProvocation: boolean; // -15
  incidentSmuggleContraband: boolean; // -5
  incidentLitteringTribun?: boolean;  // -1
  notes?: string;
  juryName: string;
  createdAt: string;
}

export interface SupporterLeaderboardRow {
  rank: number;
  teamId: string;
  schoolName: string;
  logoUrl: string;
  totalCreativityPoints: number;
  totalTicketPoints: number;
  totalPenaltyPoints: number;
  totalScore: number;
  isLeader?: boolean;
}

export interface BracketNode {
  id: string;
  roundTitle: string; // 'Perempat Final', 'Semifinal', 'Final', 'Juara 3'
  matchId: string;
  teamAId?: string;
  teamBId?: string;
  teamAName: string;
  teamBName: string;
  scoreA?: number;
  scoreB?: number;
  winnerId?: string;
  nextMatchId?: string;
  nextSlot?: 'A' | 'B';
}

export interface Ticket {
  id: string;
  code: string;
  tournamentId: string;
  buyerName: string;
  buyerPhone: string;
  ticketType: 'REGULER' | 'ROMBONGAN';
  quantity: number;
  supportedTeamId?: string;
  supportedSchoolName?: string;
  status: 'ISSUED' | 'CHECKED_IN' | 'EXPIRED';
  scannedAt?: string;
  scannedBy?: string;
}

export interface Certificate {
  id: string;
  serialNumber: string;
  recipientName: string;
  teamName: string;
  awardTitle: string; // Juara 1, Best Player, Best Supporter, Peserta
  issueDate: string;
  qrVerifyUrl: string;
  signatory: string;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  courts: string[]; // e.g. ['Court 1', 'Court 2', 'Lapangan A']
}

export interface MedalTallyRow {
  rank: number;
  contingentName: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export interface AthleteIdCard {
  id: string;
  athleteId: string;
  name: string;
  contingent: string;
  sport: SportCode;
  category: string;
  qrCode: string;
  photoUrl: string;
  verified: boolean;
  checkedIn: boolean;
}

export interface RefereeMatchDuty {
  id: string;
  refereeId: string;
  refereeName?: string;
  matchId: string;
  matchNumber: number;
  sport: SportCode;
  courtName: string;
  time: string;
  teamA: string;
  teamB: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
  roleInMatch?: string; // e.g. 'Wasit 1 (Utama)'
}

export interface MatchBAP {
  matchId: string;
  winnerTeamId: string;
  finalScoreA: number;
  finalScoreB: number;
  refereeNotes: string;
  captainASignature: string;
  captainBSignature: string;
  refereeSignature: string;
  signedAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: 'ADMIN' | 'REFEREE';
  roleLabel: string;
  specialization?: SportCode | string;
  licenseLevel?: string;
  avatarText: string;
  isAvailable?: boolean; // For referee availability toggle
  assignedMatchIds?: string[]; // ID pertandingan yang dinilai oleh juri ini
  assignedMatchNumber?: number; // Nomor laga contoh yang dipimpin
  assignedMatchLabel?: string; // Label laga: "Laga #1: MIN 1 Kota vs MIS Al-Hidayah"
}

export type AdminUser = AppUser;

export interface PublicHeaderConfig {
  id: string;
  sportCode: SportCode;
  sportLabel: string;
  bannerImageUrl: string;
  bannerOverlayOpacity: number; // 0.5 to 0.95
  statusBadge: string;
  categoryBadge: string;
  organizer: string;
  logoUrl?: string;
  logoSize?: number; // Size in px (e.g. 160 to 380, default 260)
  logoOffsetX?: number; // Offset horizontal in px (e.g. -120 to 60, default -40)
  logoVisible?: boolean; // Show or hide banner logo
  title: string;
  description: string;
  dates: string;
  venue: string;
  contingentInfo: string;
  ticketButtonText: string;
  registerButtonText: string;
}

export * from './partner';
