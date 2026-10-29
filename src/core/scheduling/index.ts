export interface ScheduledPair {
  roundNo: number;
  matchNo: number;
  homeTeamId: string;
  awayTeamId: string;
}

/**
 * Generate Round Robin pairings using standard Circle Method (Berger Tables).
 * If odd number of teams, a dummy 'BYE' is added and filtered out.
 */
export function generateRoundRobin(teamIds: string[]): ScheduledPair[] {
  if (teamIds.length < 2) return [];

  const teams = [...teamIds];
  const hasBye = teams.length % 2 !== 0;
  if (hasBye) {
    teams.push('__BYE__');
  }

  const n = teams.length;
  const rounds = n - 1;
  const matchesPerRound = n / 2;
  const schedule: ScheduledPair[] = [];
  let matchNo = 1;

  for (let r = 0; r < rounds; r++) {
    for (let m = 0; m < matchesPerRound; m++) {
      const home = teams[m];
      const away = teams[n - 1 - m];

      if (home !== '__BYE__' && away !== '__BYE__') {
        schedule.push({
          roundNo: r + 1,
          matchNo: matchNo++,
          homeTeamId: r % 2 === 0 ? home : away,
          awayTeamId: r % 2 === 0 ? away : home,
        });
      }
    }

    // Rotate teams: keep teams[0] fixed, rotate the rest clockwise
    const last = teams.pop()!;
    teams.splice(1, 0, last);
  }

  return schedule;
}

export interface KnockoutNode {
  nodeId: string;
  roundTitle: string;
  roundIndex: number;
  matchNo: number;
  homeTeamId?: string;
  awayTeamId?: string;
  nextMatchId?: string;
  nextSlot?: 'home' | 'away';
}

/**
 * Generate single-elimination tournament bracket structure.
 */
export function generateSingleElimination(teamIds: string[]): KnockoutNode[] {
  const count = teamIds.length;
  if (count < 2) return [];

  // Determine power of 2
  let power = 2;
  while (power < count) {
    power *= 2;
  }

  const totalRounds = Math.log2(power);
  const nodes: KnockoutNode[] = [];
  let matchCounter = 1;

  const roundNames: Record<number, string> = {
    1: 'Final',
    2: 'Semifinal',
    4: 'Perempat Final',
    8: 'Babak 16 Besar',
  };

  // Build rounds from final (round totalRounds) down to round 1
  let matchesInRound = 1;
  const roundNodes: KnockoutNode[][] = [];

  for (let r = totalRounds; r >= 1; r--) {
    const currentList: KnockoutNode[] = [];
    const title = roundNames[matchesInRound] || `Babak ${matchesInRound * 2} Besar`;

    for (let m = 0; m < matchesInRound; m++) {
      const node: KnockoutNode = {
        nodeId: `KO_R${r}_M${m + 1}`,
        roundTitle: title,
        roundIndex: r,
        matchNo: matchCounter++,
      };
      currentList.push(node);
      nodes.push(node);
    }

    roundNodes.push(currentList);
    matchesInRound *= 2;
  }

  // Link children to nextMatchId
  for (let i = roundNodes.length - 1; i > 0; i--) {
    const currentRound = roundNodes[i];
    const parentRound = roundNodes[i - 1];

    for (let j = 0; j < currentRound.length; j++) {
      const parent = parentRound[Math.floor(j / 2)];
      currentRound[j].nextMatchId = parent.nodeId;
      currentRound[j].nextSlot = j % 2 === 0 ? 'home' : 'away';
    }
  }

  // Assign teams to first round
  const firstRound = roundNodes[roundNodes.length - 1];
  for (let i = 0; i < firstRound.length; i++) {
    const homeIdx = i * 2;
    const awayIdx = i * 2 + 1;
    if (homeIdx < teamIds.length) firstRound[i].homeTeamId = teamIds[homeIdx];
    if (awayIdx < teamIds.length) firstRound[i].awayTeamId = teamIds[awayIdx];
  }

  return nodes;
}
