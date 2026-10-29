export type MatchStatus =
  | 'scheduled'
  | 'lineup_confirmed'
  | 'live'
  | 'break'
  | 'finished'
  | 'verified'
  | 'postponed'
  | 'cancelled'
  | 'walkover'
  | 'abandoned';

export type UserRole = 'admin' | 'official';

export interface TransitionRule {
  allowedRoles: UserRole[];
  requiresReason?: boolean;
}

const TRANSITIONS: Record<MatchStatus, Partial<Record<MatchStatus, TransitionRule>>> = {
  scheduled: {
    lineup_confirmed: { allowedRoles: ['admin', 'official'] },
    postponed: { allowedRoles: ['admin'] },
    cancelled: { allowedRoles: ['admin'], requiresReason: true },
    walkover: { allowedRoles: ['admin', 'official'], requiresReason: true },
  },
  lineup_confirmed: {
    live: { allowedRoles: ['admin', 'official'] },
    scheduled: { allowedRoles: ['admin'] },
    postponed: { allowedRoles: ['admin'] },
    cancelled: { allowedRoles: ['admin'], requiresReason: true },
    walkover: { allowedRoles: ['admin', 'official'], requiresReason: true },
  },
  live: {
    break: { allowedRoles: ['admin', 'official'] },
    finished: { allowedRoles: ['admin', 'official'] },
    abandoned: { allowedRoles: ['admin', 'official'], requiresReason: true },
  },
  break: {
    live: { allowedRoles: ['admin', 'official'] },
    finished: { allowedRoles: ['admin', 'official'] },
    abandoned: { allowedRoles: ['admin', 'official'], requiresReason: true },
  },
  finished: {
    verified: { allowedRoles: ['admin'] },
    live: { allowedRoles: ['admin'], requiresReason: true }, // emergency reopen
  },
  verified: {
    finished: { allowedRoles: ['admin'], requiresReason: true }, // emergency unlock
  },
  postponed: {
    scheduled: { allowedRoles: ['admin'] },
  },
  cancelled: {},
  walkover: {
    verified: { allowedRoles: ['admin'] },
  },
  abandoned: {
    verified: { allowedRoles: ['admin'] },
  },
};

export function validateMatchTransition(
  currentStatus: MatchStatus,
  targetStatus: MatchStatus,
  role: UserRole,
  reason?: string
): { valid: boolean; error?: string } {
  if (currentStatus === targetStatus) {
    return { valid: true };
  }

  const allowedTarget = TRANSITIONS[currentStatus]?.[targetStatus];
  if (!allowedTarget) {
    return {
      valid: false,
      error: `Transisi status dari '${currentStatus}' ke '${targetStatus}' tidak diizinkan.`,
    };
  }

  if (!allowedTarget.allowedRoles.includes(role)) {
    return {
      valid: false,
      error: `Peran '${role}' tidak memiliki izin untuk mengubah status dari '${currentStatus}' ke '${targetStatus}'.`,
    };
  }

  if (allowedTarget.requiresReason && (!reason || reason.trim().length === 0)) {
    return {
      valid: false,
      error: `Transisi status ke '${targetStatus}' membutuhkan alasan yang valid.`,
    };
  }

  return { valid: true };
}
