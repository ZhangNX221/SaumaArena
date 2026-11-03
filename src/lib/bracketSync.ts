import { BracketMatch, MatchTeam, SEMI_FINALS, GRAND_FINAL } from '@/mocks/bracketData';
import { Match, RefereeMatchDuty } from '@/types';
import { getTeamLogoUrl } from '@/mocks/teamLogos';
import { pushMatchToBackend } from './apiSync';

export const OFFICIAL_SEMIFINAL_TEAMS = {
  sf1: {
    teamA: { id: 'team-min7-blitar', name: 'MIN 7 BLITAR', score: 0, isWinner: false },
    teamB: { id: 'team-min13-c', name: 'MIN 13 BLITAR B', score: 0, isWinner: false },
  },
  sf2: {
    teamA: { id: 'team-mi-mambaululum', name: 'MI MAMBAUL ULUM BUNTARAN', score: 0, isWinner: false },
    teamB: { id: 'team-min5-tulungagung', name: 'MIN 5 TULUNGAGUNG', score: 0, isWinner: false },
  },
};

export function getAutoFillSemifinals(): [BracketMatch, BracketMatch] {
  return [
    {
      ...SEMI_FINALS[0],
      teamA: { ...OFFICIAL_SEMIFINAL_TEAMS.sf1.teamA },
      teamB: { ...OFFICIAL_SEMIFINAL_TEAMS.sf1.teamB },
      status: 'SCHEDULED',
    },
    {
      ...SEMI_FINALS[1],
      teamA: { ...OFFICIAL_SEMIFINAL_TEAMS.sf2.teamA },
      teamB: { ...OFFICIAL_SEMIFINAL_TEAMS.sf2.teamB },
      status: 'SCHEDULED',
    },
  ];
}

export function syncBracketToMatchesAndDuties(
  matchNumber: number,
  teamA: MatchTeam,
  teamB: MatchTeam,
  currentMatches: Match[],
  currentDuties: RefereeMatchDuty[],
  options?: { status?: Match['status']; winnerSlot?: 'teamA' | 'teamB' }
): { updatedMatches: Match[]; updatedDuties: RefereeMatchDuty[] } {
  const isRealA = Boolean(teamA.id && !teamA.id.startsWith('tbd') && !teamA.id.startsWith('placeholder'));
  const isRealB = Boolean(teamB.id && !teamB.id.startsWith('tbd') && !teamB.id.startsWith('placeholder'));

  let targetMatch: Match | undefined;

  const updatedMatches = currentMatches.map((m) => {
    if (m.matchNumber !== matchNumber) return m;

    const winnerTeamId =
      options?.winnerSlot === 'teamA'
        ? teamA.id
        : options?.winnerSlot === 'teamB'
        ? teamB.id
        : teamA.isWinner
        ? teamA.id
        : teamB.isWinner
        ? teamB.id
        : m.winnerTeamId;

    const newStatus =
      options?.status ||
      (options?.winnerSlot || teamA.isWinner || teamB.isWinner ? 'COMPLETED' : m.status);

    const updated: Match = {
      ...m,
      teamAId: isRealA ? teamA.id : m.teamAId,
      teamAName: isRealA ? teamA.name : (teamA.name || m.teamAName),
      teamALogo: isRealA ? getTeamLogoUrl(teamA.id) : m.teamALogo,
      teamBId: isRealB ? teamB.id : m.teamBId,
      teamBName: isRealB ? teamB.name : (teamB.name || m.teamBName),
      teamBLogo: isRealB ? getTeamLogoUrl(teamB.id) : m.teamBLogo,
      scoreA: typeof teamA.score === 'number' ? teamA.score : m.scoreA,
      scoreB: typeof teamB.score === 'number' ? teamB.score : m.scoreB,
      status: newStatus,
      bapSigned: newStatus === 'COMPLETED' ? true : m.bapSigned,
      winnerTeamId,
    };
    targetMatch = updated;
    return updated;
  });

  const updatedDuties = currentDuties.map((d) => {
    if (d.matchNumber !== matchNumber) return d;
    return {
      ...d,
      teamA: isRealA ? teamA.name : d.teamA,
      teamB: isRealB ? teamB.name : d.teamB,
      status: targetMatch?.status === 'COMPLETED' ? ('COMPLETED' as const) : d.status,
    };
  });

  if (targetMatch) {
    pushMatchToBackend(targetMatch);
  }

  return { updatedMatches, updatedDuties };
}

export function reconcileMatchesToBracket(
  matches: Match[],
  currentSf: BracketMatch[],
  currentGf: BracketMatch
): { updatedSf: BracketMatch[]; updatedGf: BracketMatch; hasDiff: boolean; championId?: string } {
  let hasDiff = false;
  let championId: string | undefined;

  const m15 = matches.find((m) => m.matchNumber === 15);
  const m16 = matches.find((m) => m.matchNumber === 16);
  const m17 = matches.find((m) => m.matchNumber === 17);

  const updatedSf = currentSf.map((node, idx) => {
    const m = idx === 0 ? m15 : m16;
    if (!m) return node;

    const isAValid = Boolean(m.teamAId && !m.teamAId.startsWith('placeholder') && m.teamAName);
    const isBValid = Boolean(m.teamBId && !m.teamBId.startsWith('placeholder') && m.teamBName);

    const isMatchDone =
      m.status === 'COMPLETED' ||
      (m.status as string)?.toLowerCase() === 'finished' ||
      (m.status as string)?.toLowerCase() === 'verified' ||
      Boolean(m.bapSigned);

    const isAWinner = isMatchDone && (m.winnerTeamId === m.teamAId || m.scoreA > m.scoreB);
    const isBWinner = isMatchDone && (m.winnerTeamId === m.teamBId || m.scoreB > m.scoreA);

    const nextTeamA = isAValid
      ? { id: m.teamAId, name: m.teamAName, score: m.scoreA, isWinner: isAWinner }
      : node.teamA;
    const nextTeamB = isBValid
      ? { id: m.teamBId, name: m.teamBName, score: m.scoreB, isWinner: isBWinner }
      : node.teamB;

    const nextStatus = isMatchDone ? 'COMPLETED' : m.status === 'LIVE' ? 'LIVE' : node.status;

    if (
      nextTeamA.id !== node.teamA.id ||
      nextTeamA.score !== node.teamA.score ||
      nextTeamA.isWinner !== node.teamA.isWinner ||
      nextTeamB.id !== node.teamB.id ||
      nextTeamB.score !== node.teamB.score ||
      nextTeamB.isWinner !== node.teamB.isWinner ||
      nextStatus !== node.status
    ) {
      hasDiff = true;
      return {
        ...node,
        teamA: nextTeamA,
        teamB: nextTeamB,
        status: nextStatus as any,
      };
    }
    return node;
  });

  let nextGf = { ...currentGf };

  // Winner of SF 1 advances to GF Team A
  const sf1Winner = updatedSf[0]?.teamA.isWinner ? updatedSf[0].teamA : updatedSf[0]?.teamB.isWinner ? updatedSf[0].teamB : null;
  if (sf1Winner && sf1Winner.id && !sf1Winner.id.startsWith('tbd')) {
    if (nextGf.teamA.id !== sf1Winner.id) {
      nextGf.teamA = { id: sf1Winner.id, name: sf1Winner.name, score: 0, isWinner: false };
      hasDiff = true;
    }
  }

  // Winner of SF 2 advances to GF Team B
  const sf2Winner = updatedSf[1]?.teamA.isWinner ? updatedSf[1].teamA : updatedSf[1]?.teamB.isWinner ? updatedSf[1].teamB : null;
  if (sf2Winner && sf2Winner.id && !sf2Winner.id.startsWith('tbd')) {
    if (nextGf.teamB.id !== sf2Winner.id) {
      nextGf.teamB = { id: sf2Winner.id, name: sf2Winner.name, score: 0, isWinner: false };
      hasDiff = true;
    }
  }

  // Check Match 17 in matches
  if (m17) {
    const isAValid = Boolean(m17.teamAId && !m17.teamAId.startsWith('placeholder') && m17.teamAName);
    const isBValid = Boolean(m17.teamBId && !m17.teamBId.startsWith('placeholder') && m17.teamBName);
    const isMatchDone =
      m17.status === 'COMPLETED' ||
      (m17.status as string)?.toLowerCase() === 'finished' ||
      (m17.status as string)?.toLowerCase() === 'verified' ||
      Boolean(m17.bapSigned);

    const isAWinner = isMatchDone && (m17.winnerTeamId === m17.teamAId || m17.scoreA > m17.scoreB);
    const isBWinner = isMatchDone && (m17.winnerTeamId === m17.teamBId || m17.scoreB > m17.scoreA);

    if (isAValid && nextGf.teamA.id !== m17.teamAId) {
      nextGf.teamA = { id: m17.teamAId, name: m17.teamAName, score: m17.scoreA, isWinner: isAWinner };
      hasDiff = true;
    } else if (nextGf.teamA.score !== m17.scoreA || nextGf.teamA.isWinner !== isAWinner) {
      nextGf.teamA = { ...nextGf.teamA, score: m17.scoreA, isWinner: isAWinner };
      hasDiff = true;
    }

    if (isBValid && nextGf.teamB.id !== m17.teamBId) {
      nextGf.teamB = { id: m17.teamBId, name: m17.teamBName, score: m17.scoreB, isWinner: isBWinner };
      hasDiff = true;
    } else if (nextGf.teamB.score !== m17.scoreB || nextGf.teamB.isWinner !== isBWinner) {
      nextGf.teamB = { ...nextGf.teamB, score: m17.scoreB, isWinner: isBWinner };
      hasDiff = true;
    }

    if (isMatchDone) {
      if (nextGf.status !== 'COMPLETED') {
        nextGf.status = 'COMPLETED';
        hasDiff = true;
      }
      championId = isAWinner ? nextGf.teamA.id : isBWinner ? nextGf.teamB.id : m17.winnerTeamId;
    }
  }

  return { updatedSf, updatedGf: nextGf, hasDiff, championId };
}

