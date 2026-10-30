export interface ThreatPacket {
  id: number;
  x: number; // 0 to 100 percentage of arena width
  y: number; // 0 to 100 percentage of arena height
  speed: number;
  label: string;
  severity: 'LOW' | 'MED' | 'HIGH';
  points: number;
  hp: number;
}

export interface CountermeasurePulse {
  id: number;
  x: number;
  y: number;
  speed: number;
}

export interface ParticleBurst {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export type GameStatus = 'title' | 'playing' | 'paused' | 'victory' | 'gameover';

export const VICTORY_TARGET_SCORE = 120;

export interface FirewallGameState {
  status: GameStatus;
  endlessMode: boolean;
  playerX: number; // 8 to 92 percentage
  score: number;
  highScore: number;
  integrity: number; // 0 to 100
  wave: number;
  blockedCount: number;
  elapsedSeconds: number;
  threats: ThreatPacket[];
  pulses: CountermeasurePulse[];
  particles: ParticleBurst[];
  nextId: number;
  lastSpawnAt: number;
  lastShotAt: number;
}

export const THREAT_CATALOG: Array<{
  label: string;
  severity: 'LOW' | 'MED' | 'HIGH';
  points: number;
  baseSpeed: number;
  hp: number;
}> = [
  { label: 'PROMPT_INJECT', severity: 'HIGH', points: 30, baseSpeed: 16, hp: 1 },
  { label: 'UNAUTHORIZED_WIRE', severity: 'HIGH', points: 35, baseSpeed: 15, hp: 2 },
  { label: 'POLICY_BYPASS', severity: 'MED', points: 25, baseSpeed: 18, hp: 1 },
  { label: 'SQL_INJECTION', severity: 'MED', points: 20, baseSpeed: 19, hp: 1 },
  { label: 'SYN_FLOOD', severity: 'LOW', points: 15, baseSpeed: 22, hp: 1 },
  { label: 'TOKEN_SPOOF', severity: 'LOW', points: 15, baseSpeed: 20, hp: 1 },
];

export function createInitialGameState(highScore = 0): FirewallGameState {
  return {
    status: 'title',
    endlessMode: false,
    playerX: 50,
    score: 0,
    highScore,
    integrity: 100,
    wave: 1,
    blockedCount: 0,
    elapsedSeconds: 0,
    threats: [],
    pulses: [],
    particles: [],
    nextId: 1,
    lastSpawnAt: 0,
    lastShotAt: -1,
  };
}

export function clampPlayerX(x: number): number {
  return Math.max(8, Math.min(92, x));
}

export function calculateWaveFromScore(score: number): number {
  return Math.max(1, Math.floor(score / 120) + 1);
}

export function spawnPulse(state: FirewallGameState, nowSec: number): FirewallGameState {
  if (state.status !== 'playing') return state;
  if (nowSec - state.lastShotAt < 0.16) return state;

  const pulse: CountermeasurePulse = {
    id: state.nextId,
    x: state.playerX,
    y: 84,
    speed: 95,
  };

  return {
    ...state,
    pulses: [...state.pulses, pulse],
    nextId: state.nextId + 1,
    lastShotAt: nowSec,
  };
}

export function stepGameFrame(
  state: FirewallGameState,
  dtSec: number,
  inputDir: number, // -1 left, 0 none, +1 right
  randomFn: () => number = Math.random
): FirewallGameState {
  if (state.status !== 'playing') return state;

  const clampedDt = Math.min(dtSec, 0.1);
  const newElapsed = state.elapsedSeconds + clampedDt;
  const playerSpeed = 62;
  const nextPlayerX = clampPlayerX(state.playerX + inputDir * playerSpeed * clampedDt);

  const activePulses: CountermeasurePulse[] = [];
  for (const p of state.pulses) {
    const ny = p.y - p.speed * clampedDt;
    if (ny > 2) {
      activePulses.push({ ...p, y: ny });
    }
  }

  let integrity = state.integrity;
  let score = state.score;
  let blockedCount = state.blockedCount;
  const survivingThreats: ThreatPacket[] = [];
  const nextParticles: ParticleBurst[] = [];

  for (const pt of state.particles) {
    const nLife = pt.life - clampedDt;
    if (nLife > 0) {
      nextParticles.push({
        ...pt,
        x: pt.x + pt.vx * clampedDt,
        y: pt.y + pt.vy * clampedDt,
        life: nLife,
      });
    }
  }

  const consumedPulseIds = new Set<number>();

  for (const threat of state.threats) {
    let currentHp = threat.hp;
    const ny = threat.y + threat.speed * clampedDt;

    for (const pulse of activePulses) {
      if (consumedPulseIds.has(pulse.id)) continue;
      const dx = Math.abs(pulse.x - threat.x);
      const dy = Math.abs(pulse.y - ny);
      if (dx < 8.5 && dy < 7.5) {
        consumedPulseIds.add(pulse.id);
        currentHp -= 1;
        if (currentHp <= 0) break;
      }
    }

    if (currentHp <= 0) {
      score += threat.points;
      blockedCount += 1;
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        nextParticles.push({
          x: threat.x,
          y: ny,
          vx: Math.cos(angle) * 18,
          vy: Math.sin(angle) * 18,
          life: 0.35,
          maxLife: 0.35,
          color: threat.severity === 'HIGH' ? '#fbcfe8' : '#5eead4',
        });
      }
      continue;
    }

    if (ny >= 88) {
      const damage = threat.severity === 'HIGH' ? 25 : threat.severity === 'MED' ? 20 : 15;
      integrity = Math.max(0, integrity - damage);
      continue;
    }

    survivingThreats.push({
      ...threat,
      y: ny,
      hp: currentHp,
    });
  }

  const remainingPulses = activePulses.filter((p) => !consumedPulseIds.has(p.id));
  const wave = calculateWaveFromScore(score);

  const spawnInterval = Math.max(0.55, 1.55 - (wave - 1) * 0.12);
  let nextId = state.nextId;
  let lastSpawnAt = state.lastSpawnAt;

  if (newElapsed - lastSpawnAt >= spawnInterval && survivingThreats.length < 9) {
    const templateIndex = Math.floor(randomFn() * THREAT_CATALOG.length);
    const tpl = THREAT_CATALOG[templateIndex];
    const spawnX = 12 + randomFn() * 76;
    const speedMultiplier = 1 + (wave - 1) * 0.1;

    survivingThreats.push({
      id: nextId++,
      x: spawnX,
      y: 6,
      speed: tpl.baseSpeed * speedMultiplier,
      label: tpl.label,
      severity: tpl.severity,
      points: tpl.points,
      hp: tpl.hp,
    });
    lastSpawnAt = newElapsed;
  }

  const highScore = Math.max(state.highScore, score);
  let status: GameStatus = 'playing';
  if (integrity <= 0) {
    status = 'gameover';
  } else if (!state.endlessMode && score >= VICTORY_TARGET_SCORE) {
    status = 'victory';
  }

  return {
    ...state,
    status,
    playerX: nextPlayerX,
    score,
    highScore,
    integrity,
    wave,
    blockedCount,
    elapsedSeconds: newElapsed,
    threats: survivingThreats,
    pulses: remainingPulses,
    particles: nextParticles,
    nextId,
    lastSpawnAt,
  };
}
