import test from 'node:test';
import assert from 'node:assert/strict';
import { footballModule } from '../../sports/football/module';
import { futsalModule } from '../../sports/futsal/module';
import { volleyballModule } from '../../sports/volleyball/module';
import { badmintonModule } from '../../sports/badminton/module';
import { esportModule } from '../../sports/esport/module';
import { sportRegistry } from '../registry';
import { reduceMatchEvents } from '../events';
import { validateMatchTransition } from '../statemachine';
import { calculateStandings } from '../standings';
import { generateRoundRobin, generateSingleElimination } from '../scheduling';
import { signToken, verifyToken, requireAuth, hashPassword, verifyPassword, changeUserPassword, authenticateUser } from '../../lib/auth';
import { NextResponse } from 'next/server';
import footballTemplate from '../../sports/football/template.json';
import futsalTemplate from '../../sports/futsal/template.json';
import volleyballTemplate from '../../sports/volleyball/template.json';
import badmintonTemplate from '../../sports/badminton/template.json';
import esportTemplate from '../../sports/esport/template.json';

test('SportRegistry registers all modules', () => {
  sportRegistry.register(footballModule);
  sportRegistry.register(futsalModule);
  sportRegistry.register(volleyballModule);
  sportRegistry.register(badmintonModule);
  sportRegistry.register(esportModule);

  assert.equal(sportRegistry.has('football'), true);
  assert.equal(sportRegistry.has('futsal'), true);
  assert.equal(sportRegistry.has('volleyball'), true);
  assert.equal(sportRegistry.has('badminton'), true);
  assert.equal(sportRegistry.has('esport'), true);
});

test('Football rules: goals, own goals, card discipline', () => {
  const rules = footballTemplate as any;
  let state = footballModule.initialState({
    rules,
    homeId: 'team_a',
    awayId: 'team_b',
    lineups: [
      {
        teamId: 'team_a',
        players: [
          { playerId: 'p1', playerName: 'Player 1', jerseyNumber: 10, isStarter: true },
          { playerId: 'p2', playerName: 'Player 2', jerseyNumber: 7, isStarter: true },
        ],
      },
    ],
  });

  // Goal for team A
  state = footballModule.applyEvent(state, {
    id: 'e1',
    matchId: 'm1',
    seq: 1,
    type: 'goal',
    teamId: 'team_a',
    playerId: 'p1',
  }, rules);
  assert.equal(state.scoreHome, 1);
  assert.equal(state.scoreAway, 0);

  // Own goal by team A awards point to team B
  state = footballModule.applyEvent(state, {
    id: 'e2',
    matchId: 'm1',
    seq: 2,
    type: 'own_goal',
    teamId: 'team_a',
    playerId: 'p2',
  }, rules);
  assert.equal(state.scoreHome, 1);
  assert.equal(state.scoreAway, 1);

  // First yellow card
  state = footballModule.applyEvent(state, {
    id: 'e3',
    matchId: 'm1',
    seq: 3,
    type: 'yellow_card',
    playerId: 'p1',
  }, rules);
  assert.equal(state.playerStates['p1'].yellowCards, 1);
  assert.equal(state.playerStates['p1'].redCards, 0);

  // Second yellow card converts to red card
  state = footballModule.applyEvent(state, {
    id: 'e4',
    matchId: 'm1',
    seq: 4,
    type: 'yellow_card',
    playerId: 'p1',
  }, rules);
  assert.equal(state.playerStates['p1'].yellowCards, 2);
  assert.equal(state.playerStates['p1'].redCards, 1);

  // Player with red card is rejected from scoring
  const invalidGoal = footballModule.validateEvent(state, {
    id: 'e5',
    matchId: 'm1',
    seq: 5,
    type: 'goal',
    teamId: 'team_a',
    playerId: 'p1',
  }, rules);
  assert.equal(invalidGoal.valid, false);
});

test('Event Sourcing: voided events are excluded from recalculation', () => {
  const rules = futsalTemplate as any;
  const events = [
    { id: 'ev1', matchId: 'm1', seq: 1, type: 'goal', teamId: 'team_a' },
    { id: 'ev2', matchId: 'm1', seq: 2, type: 'goal', teamId: 'team_b' },
    { id: 'ev3', matchId: 'm1', seq: 3, type: 'goal', teamId: 'team_a', voidedAt: '2026-10-27T10:00:00Z', voidReason: 'Offside' },
  ];

  const reduction = reduceMatchEvents(futsalModule, rules, 'team_a', 'team_b', events);
  assert.equal(reduction.result.scoreHome, 1);
  assert.equal(reduction.result.scoreAway, 1);
  assert.equal(reduction.appliedEventsCount, 2);
});

test('State Machine: match status transitions and permission checks', () => {
  // official can move scheduled -> lineup_confirmed -> live -> finished
  assert.equal(validateMatchTransition('scheduled', 'lineup_confirmed', 'official').valid, true);
  assert.equal(validateMatchTransition('lineup_confirmed', 'live', 'official').valid, true);
  assert.equal(validateMatchTransition('live', 'finished', 'official').valid, true);

  // official cannot verify match
  assert.equal(validateMatchTransition('finished', 'verified', 'official').valid, false);

  // admin can verify match
  assert.equal(validateMatchTransition('finished', 'verified', 'admin').valid, true);

  // illegal backward transition
  assert.equal(validateMatchTransition('live', 'scheduled', 'official').valid, false);
});

test('Standings calculation with tiebreakers', () => {
  const teams = [
    { id: 't1', name: 'Tim A', shortName: 'TA' },
    { id: 't2', name: 'Tim B', shortName: 'TB' },
    { id: 't3', name: 'Tim C', shortName: 'TC' },
  ];

  const matches = [
    {
      id: 'm1',
      homeTeamId: 't1',
      awayTeamId: 't2',
      scoreHome: 3,
      scoreAway: 1,
      pointsHome: 3,
      pointsAway: 0,
      homeYellowCards: 1,
      awayYellowCards: 0,
    },
    {
      id: 'm2',
      homeTeamId: 't2',
      awayTeamId: 't3',
      scoreHome: 2,
      scoreAway: 0,
      pointsHome: 3,
      pointsAway: 0,
    },
  ];

  const standings = calculateStandings(teams, matches);
  assert.equal(standings[0].teamId, 't1');
  assert.equal(standings[0].rank, 1);
  assert.equal(standings[0].points, 3);
  assert.equal(standings[0].goalDifference, 2);
});

test('Scheduling: circle method round robin and single elimination', () => {
  const roundRobin = generateRoundRobin(['t1', 't2', 't3', 't4']);
  // 4 teams = 3 rounds, 2 matches per round = 6 matches total
  assert.equal(roundRobin.length, 6);

  const bracket = generateSingleElimination(['t1', 't2', 't3', 't4']);
  // 4 teams = 2 semifinals + 1 final = 3 matches
  assert.equal(bracket.length, 3);
});

test('Security & Auth: JWT token creation, verification, alg:none bypass rejection', () => {
  const validToken = signToken({
    userId: 'USR-ADMIN',
    username: 'admin',
    role: 'ADMIN',
    name: 'Administrator',
  });

  // Valid token decodes correctly
  const payload = verifyToken(validToken);
  assert.notEqual(payload, null);
  assert.equal(payload?.userId, 'USR-ADMIN');
  assert.equal(payload?.role, 'ADMIN');

  // alg:none forgery attack rejection (hunt-auth-bypass / hunt-jwt-crypto)
  const noneHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const fakePayload = Buffer.from(JSON.stringify({ userId: 'USR-ADMIN', role: 'ADMIN', exp: Date.now() + 60000 })).toString('base64url');
  const forgedNoneToken = `${noneHeader}.${fakePayload}.`;
  assert.equal(verifyToken(forgedNoneToken), null);

  // Tampered signature rejection
  const tamperedToken = validToken.slice(0, -5) + 'xxxxx';
  assert.equal(verifyToken(tamperedToken), null);

  // Expired token rejection
  const expiredToken = signToken(
    { userId: 'USR-ADMIN', username: 'admin', role: 'ADMIN', name: 'Admin' },
    -1000 // already expired
  );
  assert.equal(verifyToken(expiredToken), null);
});

test('Security & Auth: requireAuth access control and role gating', () => {
  // 1. Unauthenticated request -> 401
  const reqNoAuth = new Request('http://localhost:3000/api/matches/m1/verify', { method: 'POST' });
  const resNoAuth = requireAuth(reqNoAuth, ['ADMIN']);
  assert.equal(resNoAuth instanceof NextResponse, true);
  if (resNoAuth instanceof NextResponse) {
    assert.equal(resNoAuth.status, 401);
  }

  // 2. Authenticated as REFEREE trying to access ADMIN endpoint -> 403
  const refToken = signToken({
    userId: 'USR-JURI-1',
    username: 'juri1',
    role: 'REFEREE',
    name: 'Juri 1',
  });
  const reqReferee = new Request('http://localhost:3000/api/matches/m1/verify', {
    method: 'POST',
    headers: { Authorization: `Bearer ${refToken}` },
  });
  const resReferee = requireAuth(reqReferee, ['ADMIN']);
  assert.equal(resReferee instanceof NextResponse, true);
  if (resReferee instanceof NextResponse) {
    assert.equal(resReferee.status, 403);
  }

  // 3. Authenticated as ADMIN -> Access Granted
  const adminToken = signToken({
    userId: 'USR-ADMIN',
    username: 'admin',
    role: 'ADMIN',
    name: 'Admin',
  });
  const reqAdmin = new Request('http://localhost:3000/api/matches/m1/verify', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const resAdmin = requireAuth(reqAdmin, ['ADMIN']);
  assert.equal(resAdmin instanceof NextResponse, false);
  if (!(resAdmin instanceof NextResponse)) {
    assert.equal(resAdmin.user.role, 'ADMIN');
    assert.equal(resAdmin.user.id, 'USR-ADMIN');
  }
});

test('Security & Auth: changeUserPassword verification and SQLite persistence', () => {
  // 1. Gagal jika kata sandi lama salah
  const failWrongOld = changeUserPassword('USR-ADMIN', 'salahPass', 'baru12345');
  assert.equal(failWrongOld.success, false);
  assert.equal(failWrongOld.statusCode, 400);

  // 2. Gagal jika kata sandi baru < 6 karakter
  const failShort = changeUserPassword('USR-ADMIN', 'pass1234', '123');
  assert.equal(failShort.success, false);
  assert.equal(failShort.statusCode, 400);

  // 3. Gagal jika kata sandi baru identik dengan kata sandi lama
  const failSame = changeUserPassword('USR-ADMIN', 'pass1234', 'pass1234');
  assert.equal(failSame.success, false);
  assert.equal(failSame.statusCode, 400);

  // 4. Sukses update kata sandi
  const successChange = changeUserPassword('USR-ADMIN', 'pass1234', 'rahasiaBaru2026');
  assert.equal(successChange.success, true);
  assert.equal(successChange.user?.id, 'USR-ADMIN');

  // Verifikasi login dengan kata sandi baru berhasil
  const authNew = authenticateUser('admin', 'rahasiaBaru2026');
  assert.equal(authNew.success, true);

  // Verifikasi login dengan kata sandi lama sekarang gagal
  const authOld = authenticateUser('admin', 'pass1234');
  assert.equal(authOld.success, false);

  // Kembalikan ke pass1234 agar konsisten untuk environment pengujian berikutnya
  const revert = changeUserPassword('USR-ADMIN', 'rahasiaBaru2026', 'pass1234');
  assert.equal(revert.success, true);
});
