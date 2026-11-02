import { Match, SupporterAssessment, StandingRow, MatchLiveTelemetry } from '@/types';
import { TicketOrderData } from '@/types/ticket';
import { initialTeams } from '@/mocks/tournamentData';

/**
 * Service sinkronisasi data dua arah antara Local State (usePersistentState)
 * dan SQLite Database Backend (/api/*).
 */

/**
 * 1. Kirim pembaruan status / skor pertandingan ke SQLite database.
 */
export async function pushMatchToBackend(
  match: Partial<Match> & { id: string },
  telemetry?: MatchLiveTelemetry
) {
  try {
    const payload: Record<string, any> = {};
    if (match.scoreA !== undefined) {
      payload.scoreA = match.scoreA;
      payload.scoreHome = match.scoreA;
    }
    if (match.scoreB !== undefined) {
      payload.scoreB = match.scoreB;
      payload.scoreAway = match.scoreB;
    }
    if (match.status !== undefined) payload.status = match.status;
    if (match.courtName !== undefined) payload.courtName = match.courtName;
    if (match.scheduledTime !== undefined) payload.scheduledAt = match.scheduledTime;
    if (match.winnerTeamId !== undefined) payload.winnerTeamId = match.winnerTeamId;

    const token = typeof window !== 'undefined' ? localStorage.getItem('sauma_auth_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // 1. Push ke /api/matches/[id]
    await fetch(`/api/matches/${match.id}`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify(payload),
    }).catch(() => {});

    // 2. Push ke /api/live untuk sinkronisasi real-time instan ke Konsol Juri & Publik
    await fetch('/api/live', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        matchId: match.id,
        scoreA: match.scoreA,
        scoreB: match.scoreB,
        status: match.status,
        telemetry,
        events: match.events,
      }),
    }).catch(() => {});
  } catch (error) {
    console.warn(`[apiSync] Error jaringan push match ${match.id}:`, error);
  }
}

export interface LiveStateResponse {
  activeMatchId: string;
  telemetryMap: Record<string, MatchLiveTelemetry>;
  matches: Match[];
  serverTime: number;
}

/**
 * Ambil status real-time live match, live scores, dan telemetri dari backend.
 */
export async function fetchLiveStateFromBackend(): Promise<LiveStateResponse | null> {
  try {
    const res = await fetch('/api/live');
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (error) {
    console.warn('[apiSync] Error fetchLiveStateFromBackend:', error);
  }
  return null;
}

/**
 * Kirim update telemetri real-time (stopwatch, foul, babak, timeout) dari Konsol Juri ke server.
 */
export async function pushLiveTelemetryToBackend(
  matchId: string,
  telemetry: MatchLiveTelemetry,
  extra?: { activeMatchId?: string; status?: string; scoreA?: number; scoreB?: number }
) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sauma_auth_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    await fetch('/api/live', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        matchId,
        telemetry,
        ...extra,
      }),
    });
  } catch (error) {
    console.warn(`[apiSync] Gagal push live telemetry:`, error);
  }
}

/**
 * 2. Ambil seluruh data pertandingan resmi dari SQLite backend.
 */
export async function fetchMatchesFromBackend(): Promise<Match[] | null> {
  try {
    const res = await fetch('/api/matches');
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (error) {
    console.warn('[apiSync] Error fetchMatchesFromBackend:', error);
  }
  return null;
}

/**
 * 3. Kirim sesi penilaian suporter madrasah dari Juri Meja ke SQLite backend.
 */
export async function pushSupporterScoreToBackend(assessment: SupporterAssessment) {
  try {
    const positivePoints =
      (assessment.schoolMascot ? 20 : 0) +
      (assessment.supporterUniform ? 15 : 0) +
      (assessment.cheerMin3Chants ? 10 : 0) +
      Math.max(0, assessment.checkedInTickets);

    const penaltyPoints =
      (assessment.incidentViolentChaos ? 50 : 0) +
      (assessment.incidentThrowObjects ? 25 : 0) +
      (assessment.incidentRacismProvocation ? 15 : 0) +
      (assessment.incidentSmuggleContraband ? 5 : 0);

    const payload = {
      teamId: assessment.teamId,
      matchId: assessment.matchId || null,
      positivePoints,
      penaltyPoints,
      notes: assessment.notes || '',
      details: {
        choreography: assessment.choreography,
        schoolMascot: assessment.schoolMascot,
        supporterUniform: assessment.supporterUniform,
        cheerMin3Chants: assessment.cheerMin3Chants,
        checkedInTickets: assessment.checkedInTickets,
        incidentViolentChaos: assessment.incidentViolentChaos,
        incidentThrowObjects: assessment.incidentThrowObjects,
        incidentRacismProvocation: assessment.incidentRacismProvocation,
        incidentSmuggleContraband: assessment.incidentSmuggleContraband,
        incidentLitteringTribun: assessment.incidentLitteringTribun,
      },
    };

    const token = typeof window !== 'undefined' ? localStorage.getItem('sauma_auth_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('/api/supporter-scores', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn('[apiSync] Gagal push supporter score ke backend:', res.statusText);
    }
  } catch (error) {
    console.warn('[apiSync] Error jaringan push supporter score:', error);
  }
}

/**
 * 4. Simpan pesanan tiket baru dari Publik ke SQLite backend.
 */
export async function pushTicketOrderToBackend(order: TicketOrderData, bookingCode?: string) {
  try {
    const payload = {
      buyerName: order.buyerName,
      buyerPhone: order.buyerPhone,
      teamId: order.supportedTeamId || null,
      category: order.category,
      quantity: order.quantity,
      bookingCode,
    };

    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn('[apiSync] Gagal push ticket order ke backend:', res.statusText);
    }
  } catch (error) {
    console.warn('[apiSync] Error jaringan push ticket order:', error);
  }
}

/**
 * 5. Kalkulasi otomatis klasemen grup (Grup A, B, C, D) berdasarkan riwayat laga aktual.
 */
export function recalculateGroupStandingsFromMatches(
  matches: Match[],
  currentGroups: { A: StandingRow[]; B: StandingRow[]; C: StandingRow[]; D: StandingRow[] }
): { A: StandingRow[]; B: StandingRow[]; C: StandingRow[]; D: StandingRow[] } {
  const result: { A: StandingRow[]; B: StandingRow[]; C: StandingRow[]; D: StandingRow[] } = {
    A: currentGroups.A.map((r) => ({ ...r, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 })),
    B: currentGroups.B.map((r) => ({ ...r, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 })),
    C: currentGroups.C.map((r) => ({ ...r, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 })),
    D: currentGroups.D.map((r) => ({ ...r, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 })),
  };

  const groupMatches = matches.filter(
    (m) => (m.stage === 'GROUP' || !m.stage) && (m.status === 'COMPLETED' || m.status === 'LIVE')
  );

  for (const match of groupMatches) {
    const groupKey = (match.group || 'A').toUpperCase() as 'A' | 'B' | 'C' | 'D';
    const groupList = result[groupKey];
    if (!groupList) continue;

    const rowA = groupList.find((r) => r.teamId === match.teamAId || r.teamName.includes(match.teamAName));
    const rowB = groupList.find((r) => r.teamId === match.teamBId || r.teamName.includes(match.teamBName));

    if (rowA && rowB) {
      rowA.played += 1;
      rowB.played += 1;
      rowA.goalsFor += match.scoreA;
      rowA.goalsAgainst += match.scoreB;
      rowB.goalsFor += match.scoreB;
      rowB.goalsAgainst += match.scoreA;

      if (match.scoreA > match.scoreB) {
        rowA.won += 1;
        rowA.points += 3;
        rowB.lost += 1;
      } else if (match.scoreA < match.scoreB) {
        rowB.won += 1;
        rowB.points += 3;
        rowA.lost += 1;
      } else {
        rowA.drawn += 1;
        rowB.drawn += 1;
        rowA.points += 1;
        rowB.points += 1;
      }

      rowA.goalDifference = rowA.goalsFor - rowA.goalsAgainst;
      rowB.goalDifference = rowB.goalsFor - rowB.goalsAgainst;
    }
  }

  // Sort each group: Points -> Goal Difference -> Goals For -> Supporter Points
  const sortFn = (a: StandingRow, b: StandingRow) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return (b.supporterPoints ?? 0) - (a.supporterPoints ?? 0);
  };

  result.A.sort(sortFn).forEach((r, idx) => { r.rank = idx + 1; });
  result.B.sort(sortFn).forEach((r, idx) => { r.rank = idx + 1; });
  result.C.sort(sortFn).forEach((r, idx) => { r.rank = idx + 1; });
  result.D.sort(sortFn).forEach((r, idx) => { r.rank = idx + 1; });

  return result;
}

/**
 * 6. Simpan seluruh klasemen grup ke backend SQLite.
 */
export async function pushGroupStandingsToBackend(groups: {
  A?: StandingRow[];
  B?: StandingRow[];
  C?: StandingRow[];
  D?: StandingRow[];
}): Promise<boolean> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sauma_auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('/api/standings', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ groups }),
    });

    if (token) {
      fetch('/api/settings', {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({ standingsSnapshot: groups }),
      }).catch(() => {});
    }

    if (!res.ok) {
      console.warn('[apiSync] Gagal push group standings:', res.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('[apiSync] Error jaringan push group standings:', error);
    return false;
  }
}

/**
 * 7. Ambil snapshot klasemen grup yang tersimpan di backend SQLite.
 */
export async function fetchGroupStandingsFromBackend(): Promise<{
  A: StandingRow[];
  B: StandingRow[];
  C: StandingRow[];
  D: StandingRow[];
} | null> {
  try {
    const res = await fetch('/api/standings');
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data?.groupStandingsSnapshot) {
      return json.data.groupStandingsSnapshot;
    }
  } catch (error) {
    console.warn('[apiSync] Error fetchGroupStandingsFromBackend:', error);
  }
  return null;
}


