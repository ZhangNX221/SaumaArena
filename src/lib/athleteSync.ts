import { FlattenedAthlete } from '@/types';

/**
 * Service sinkronisasi data master atlet ke SQLite Database Backend (/api/athletes)
 */

export async function fetchAthletesFromBackend(): Promise<FlattenedAthlete[] | null> {
  try {
    const res = await fetch('/api/athletes');
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }
  } catch (error) {
    console.warn('[athleteSync] Error fetching athletes:', error);
  }
  return null;
}

export async function pushAthleteToBackend(athlete: {
  id: string;
  name: string;
  teamId: string;
  number: number;
  position: string;
  athleteCode?: string;
}): Promise<boolean> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sauma_auth_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch('/api/athletes', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(athlete),
    });
    return res.ok;
  } catch (error) {
    console.warn('[athleteSync] Error saving athlete to database:', error);
    return false;
  }
}

export async function pushAllAthletesToBackend(athletes: FlattenedAthlete[]): Promise<boolean> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sauma_auth_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch('/api/athletes', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ athletes }),
    });
    return res.ok;
  } catch (error) {
    console.warn('[athleteSync] Error syncing all athletes to database:', error);
    return false;
  }
}

export async function deleteAthleteFromBackend(id: string): Promise<boolean> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sauma_auth_token') : null;
    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch(`/api/athletes?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });
    return res.ok;
  } catch (error) {
    console.warn('[athleteSync] Error deleting athlete from backend:', error);
    return false;
  }
}

export async function pushAthleteStatToBackend(
  athleteId: string,
  field: 'goals' | 'yellowCards' | 'redCards',
  value: number
): Promise<boolean> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sauma_auth_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch('/api/athletes', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ athleteId, field, value }),
    });
    return res.ok;
  } catch (error) {
    console.warn('[athleteSync] Error pushing athlete stat to database:', error);
    return false;
  }
}

