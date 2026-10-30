import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Volume2,
  VolumeX,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  LogOut,
  Play,
  Pause,
  ExternalLink,
  GitBranch,
} from 'lucide-react';
import {
  createInitialGameState,
  FirewallGameState,
  GameStatus,
  spawnPulse,
  stepGameFrame,
  VICTORY_TARGET_SCORE,
} from '../utils/arcadeEngine';
import { PROJECTS } from '../data/portfolioData';

interface SecretArcadeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecretArcadeModal: React.FC<SecretArcadeModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameStateRef = useRef<FirewallGameState>(createInitialGameState(0));
  const keysRef = useRef<{ left: boolean; right: boolean; fire: boolean }>({
    left: false,
    right: false,
    fire: false,
  });
  const soundEnabledRef = useRef<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [hudState, setHudState] = useState<{
    status: GameStatus;
    score: number;
    highScore: number;
    integrity: number;
    wave: number;
    blockedCount: number;
  }>({
    status: 'title',
    score: 0,
    highScore: 0,
    integrity: 100,
    wave: 1,
    blockedCount: 0,
  });

  const [soundEnabled, setSoundEnabled] = useState(false);

  const playBeep = useCallback((freq: number, durationMs: number, type: OscillatorType = 'square') => {
    if (!soundEnabledRef.current) return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // Ignore audio errors
    }
  }, []);

  const syncHudFromRef = useCallback(() => {
    const st = gameStateRef.current;
    document.body.dataset.state = st.status;
    setHudState((prev) => {
      if (
        prev.status === st.status &&
        prev.score === st.score &&
        prev.highScore === st.highScore &&
        prev.integrity === st.integrity &&
        prev.wave === st.wave &&
        prev.blockedCount === st.blockedCount
      ) {
        return prev;
      }
      return {
        status: st.status,
        score: st.score,
        highScore: st.highScore,
        integrity: st.integrity,
        wave: st.wave,
        blockedCount: st.blockedCount,
      };
    });
  }, []);

  const startGame = useCallback(() => {
    const prevHigh = gameStateRef.current.highScore;
    const fresh = createInitialGameState(prevHigh);
    fresh.status = 'playing';
    gameStateRef.current = fresh;
    document.body.dataset.state = 'playing';
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    playBeep(520, 120, 'square');
    syncHudFromRef();
  }, [playBeep, syncHudFromRef]);

  const continueEndless = useCallback(() => {
    const st = gameStateRef.current;
    st.status = 'playing';
    st.endlessMode = true;
    document.body.dataset.state = 'playing';
    playBeep(660, 120, 'triangle');
    syncHudFromRef();
  }, [playBeep, syncHudFromRef]);

  const togglePause = useCallback(() => {
    const st = gameStateRef.current;
    if (st.status === 'playing') {
      st.status = 'paused';
      syncHudFromRef();
    } else if (st.status === 'paused') {
      st.status = 'playing';
      syncHudFromRef();
    }
  }, [syncHudFromRef]);

  const firePulse = useCallback(() => {
    const st = gameStateRef.current;
    if (st.status !== 'playing') return;
    const next = spawnPulse(st, st.elapsedSeconds);
    if (next !== st) {
      gameStateRef.current = next;
      playBeep(760, 60, 'square');
    }
  }, [playBeep]);

  useEffect(() => {
    if (!isOpen) {
      delete document.body.dataset.state;
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' && gameStateRef.current.status === 'title') {
      startGame();
    } else {
      document.body.dataset.state = gameStateRef.current.status;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        togglePause();
        return;
      }

      const status = gameStateRef.current.status;
      if (status === 'title' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        startGame();
        return;
      }
      if ((status === 'gameover' || status === 'victory') && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        startGame();
        return;
      }

      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        keysRef.current.left = true;
      }
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        keysRef.current.right = true;
      }
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        e.preventDefault();
        keysRef.current.fire = true;
        firePulse();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        keysRef.current.left = false;
      }
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        keysRef.current.right = false;
      }
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        keysRef.current.fire = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, onClose, startGame, togglePause, firePulse]);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let lastTime = performance.now();

    const renderFrame = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      const st = gameStateRef.current;
      if (st.status === 'playing') {
        const dir = (keysRef.current.right ? 1 : 0) - (keysRef.current.left ? 1 : 0);
        let updated = stepGameFrame(st, dt, dir);
        if (keysRef.current.fire) {
          updated = spawnPulse(updated, updated.elapsedSeconds);
        }
        if (updated.score > st.score) {
          playBeep(880, 75, 'triangle');
        }
        if (updated.integrity < st.integrity) {
          playBeep(170, 180, 'sawtooth');
        }
        gameStateRef.current = updated;
        syncHudFromRef();
      }

      // Draw Canvas Arena in Cohesive Navy / Violet / Blush-Pink / Cyan Palette
      const width = canvas.width;
      const height = canvas.height;
      const current = gameStateRef.current;

      ctx.fillStyle = '#060c1a';
      ctx.fillRect(0, 0, width, height);

      // Subtle tactical grid in violet/blush-pink tint
      ctx.strokeStyle = 'rgba(251, 207, 232, 0.07)';
      ctx.lineWidth = 1;
      const gridStep = 40;
      for (let gx = 0; gx < width; gx += gridStep) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Draw Firewall Defense Line at y = 88%
      const perimeterY = height * 0.88;
      ctx.strokeStyle = current.integrity > 35 ? '#fbcfe8' : '#fb7185';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(0, perimeterY);
      ctx.lineTo(width, perimeterY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Countermeasure Pulses
      for (const pulse of current.pulses) {
        const px = (pulse.x / 100) * width;
        const py = (pulse.y / 100) * height;
        ctx.fillStyle = '#5eead4';
        ctx.fillRect(px - 3, py - 12, 6, 16);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px - 1, py - 12, 2, 8);
      }

      // Draw Threat Packets
      ctx.font = 'bold 11px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      for (const threat of current.threats) {
        const tx = (threat.x / 100) * width;
        const ty = (threat.y / 100) * height;
        const boxW = 122;
        const boxH = 28;

        const borderCol =
          threat.severity === 'HIGH'
            ? '#fb7185'
            : threat.severity === 'MED'
            ? '#c084fc'
            : '#5eead4';

        ctx.fillStyle = 'rgba(10, 18, 36, 0.94)';
        ctx.fillRect(tx - boxW / 2, ty - boxH / 2, boxW, boxH);
        ctx.strokeStyle = borderCol;
        ctx.lineWidth = 2;
        ctx.strokeRect(tx - boxW / 2, ty - boxH / 2, boxW, boxH);

        ctx.fillStyle = borderCol;
        ctx.fillText(threat.label, tx, ty + 4);
      }

      // Draw Particle Bursts
      for (const pt of current.particles) {
        const px = (pt.x / 100) * width;
        const py = (pt.y / 100) * height;
        ctx.fillStyle = pt.color;
        ctx.fillRect(px - 2, py - 2, 5, 5);
      }

      // Draw Player Bankism Firewall Shield Node Turret
      const playerPx = (current.playerX / 100) * width;
      const playerPy = height * 0.85;

      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.moveTo(playerPx, playerPy - 16);
      ctx.lineTo(playerPx - 20, playerPy + 10);
      ctx.lineTo(playerPx + 20, playerPy + 10);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.stroke();

      animId = requestAnimationFrame(renderFrame);
    };

    animId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animId);
  }, [isOpen, playBeep, syncHudFromRef]);

  if (!isOpen) return null;

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEnabledRef.current = next;
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameStateRef.current.status !== 'playing') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * 100;
    gameStateRef.current.playerX = Math.max(8, Math.min(92, relX));
    firePulse();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="FIREWALL DEFENDER: SYSTEM BREACH"
      className="fixed inset-0 z-50 bg-[#050b18] text-white flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Top Perimeter HUD Clusters */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-[#fbcfe8]/25 bg-[#081126]">
        <div className="flex items-center gap-5">
          <div>
            <div className="font-mono-code text-[10px] uppercase tracking-widest text-white/60">
              FIREWALL INTEGRITY
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`font-pixel text-xl sm:text-2xl tabular-nums ${
                  hudState.integrity > 35 ? 'text-[#fbcfe8]' : 'text-[#fb7185]'
                }`}
              >
                {Math.round(hudState.integrity)}%
              </span>
              <div className="flex gap-1" aria-hidden="true">
                {[20, 40, 60, 80, 100].map((threshold) => (
                  <span
                    key={threshold}
                    className={`w-2.5 h-3.5 rounded-xs border ${
                      hudState.integrity >= threshold
                        ? 'bg-[#fbcfe8] border-[#fbcfe8]'
                        : 'bg-transparent border-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="font-mono-code text-[10px] uppercase tracking-widest text-white/60">
              SCORE / {VICTORY_TARGET_SCORE}
            </div>
            <div
              data-testid="arcade-score"
              className="font-pixel text-xl sm:text-2xl text-[#5eead4] tabular-nums"
            >
              {Math.round(hudState.score)}
            </div>
          </div>

          <div className="hidden sm:block">
            <div className="font-mono-code text-[10px] uppercase tracking-widest text-white/60">
              WAVE
            </div>
            <div className="font-pixel text-xl sm:text-2xl text-[#c084fc] tabular-nums">
              {Math.round(hudState.wave)}
            </div>
          </div>
        </div>

        {/* Right Controls: Pause/Resume + Sound Toggle + Exit Arcade */}
        <div className="flex items-center gap-2">
          {(hudState.status === 'playing' || hudState.status === 'paused') && (
            <button
              type="button"
              onClick={togglePause}
              aria-label={hudState.status === 'paused' ? 'Resume game' : 'Pause game'}
              className="px-3 py-2 rounded-full border border-white/20 hover:border-[#fbcfe8] text-xs font-mono-code flex items-center gap-1.5 text-white/85 hover:text-white transition-colors cursor-pointer"
            >
              {hudState.status === 'paused' ? (
                <>
                  <Play className="w-3.5 h-3.5 text-[#5eead4]" />
                  <span>RESUME</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#fbcfe8]" />
                  <span>PAUSE</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute arcade sound' : 'Enable arcade sound'}
            className="px-3 py-2 rounded-full border border-white/20 hover:border-[#fbcfe8] text-xs font-mono-code flex items-center gap-1.5 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#fbcfe8]" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{soundEnabled ? 'SFX: ON' : 'SFX: OFF'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Exit Secret Arcade Mode and return to portfolio"
            className="px-4 py-2 rounded-full bg-[#fbcfe8] text-[#050b18] font-mono-code text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>EXIT ARCADE</span>
          </button>
        </div>
      </div>

      {/* Main Playfield Viewport */}
      <div className="relative flex-1 flex items-center justify-center bg-[#050b18] overflow-hidden">
        <canvas
          ref={canvasRef}
          width={900}
          height={540}
          onPointerDown={handleCanvasPointerDown}
          data-testid="firewall-canvas"
          className="w-full h-full max-w-5xl max-h-[76vh] object-contain border border-white/15 rounded-2xl cursor-crosshair"
        />

        {/* Title Screen Overlay */}
        {hudState.status === 'title' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-[#050b18]/92 backdrop-blur-md">
            <div className="max-w-lg w-full rounded-3xl border border-[#fbcfe8]/50 bg-[#0b162c] p-6 sm:p-8 text-center space-y-5 shadow-2xl">
              {/* Custom Shield SVG Emblem */}
              <div className="flex justify-center">
                <svg viewBox="0 0 120 56" className="w-32 h-14" aria-hidden="true">
                  <rect
                    x="4"
                    y="4"
                    width="112"
                    height="48"
                    rx="14"
                    fill="#060c1a"
                    stroke="#fbcfe8"
                    strokeWidth="2"
                  />
                  <path
                    d="M60 12 L78 20 V30 C78 39 70 45 60 48 C50 45 42 39 42 30 V20 Z"
                    fill="rgba(168,85,247,0.25)"
                    stroke="#5eead4"
                    strokeWidth="2"
                  />
                  <circle cx="60" cy="29" r="5" fill="#fbcfe8" />
                </svg>
              </div>

              <div className="space-y-2">
                <div className="font-mono-code text-xs uppercase tracking-widest text-[#5eead4]">
                  BANKISM SECURITY SIMULATION // SECRET ARCADE
                </div>
                <h2 className="font-pixel text-xl sm:text-2xl text-[#fbcfe8] tracking-wide">
                  FIREWALL DEFENDER: SYSTEM BREACH
                </h2>
                <p className="text-xs sm:text-sm text-white/80 font-mono-code leading-relaxed">
                  Intercept untrusted adversarial packets (PROMPT_INJECT, SQL_INJECTION, SYN_FLOOD)
                  before they breach the Bankism perimeter. Reach {VICTORY_TARGET_SCORE} pts to
                  complete the defense audit and unlock the verified repository dossier.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  data-start="true"
                  onClick={startGame}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#fbcfe8] text-[#050b18] font-pixel text-xs sm:text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>START MISSION</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-full border border-white/25 text-white/80 hover:text-white font-mono-code text-xs uppercase tracking-wider cursor-pointer"
                >
                  RETURN TO OS
                </button>
              </div>

              <div className="pt-2 text-[11px] font-mono-code text-white/55">
                Arrow Keys / A-D Move · Space / Tap Arena Fire · P Pause · Esc Exit
              </div>
            </div>
          </div>
        )}

        {/* Pause Overlay */}
        {hudState.status === 'paused' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-[#050b18]/85 backdrop-blur-sm">
            <div className="max-w-md w-full rounded-3xl border border-[#fbcfe8]/50 bg-[#0b162c] p-6 text-center space-y-4">
              <div className="font-mono-code text-xs uppercase tracking-widest text-[#fbcfe8]">
                DEFENSE SIMULATION PAUSED
              </div>
              <h2 className="font-pixel text-2xl text-white">SYSTEM HOLD</h2>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={togglePause}
                  className="px-5 py-2.5 rounded-full bg-[#fbcfe8] text-[#050b18] font-mono-code text-xs font-bold uppercase cursor-pointer"
                >
                  RESUME MISSION
                </button>
                <button
                  type="button"
                  onClick={startGame}
                  className="px-5 py-2.5 rounded-full border border-white/25 text-white font-mono-code text-xs uppercase cursor-pointer"
                >
                  RESTART
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Victory / Mission Complete Overlay with Links to All 5 Verified Projects */}
        {hudState.status === 'victory' && (
          <div
            data-testid="arcade-victory-screen"
            className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 bg-[#050b18]/94 backdrop-blur-md overflow-y-auto"
          >
            <div className="max-w-2xl w-full rounded-3xl border-2 border-[#5eead4] bg-[#0b162c] p-5 sm:p-7 text-center space-y-5 shadow-2xl my-auto">
              <div className="flex justify-center">
                <ShieldCheck className="w-11 h-11 text-[#5eead4]" />
              </div>

              <div className="space-y-1">
                <div className="font-mono-code text-xs uppercase tracking-widest text-[#5eead4]">
                  PERIMETER SECURED // AUDIT THRESHOLD REACHED
                </div>
                <h2 className="font-pixel text-xl sm:text-2xl text-[#fbcfe8]">
                  MISSION COMPLETE: ALL NODES PROTECTED
                </h2>
                <p className="text-xs font-mono-code text-white/75">
                  Score: {Math.round(hudState.score)} · Packets Neutralized:{' '}
                  {Math.round(hudState.blockedCount)} · Integrity: {Math.round(hudState.integrity)}%
                </p>
              </div>

              {/* Direct Links to All 5 Real GitHub Projects */}
              <div className="text-left space-y-2.5 border-y border-white/15 py-4">
                <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#fbcfe8]">
                  UNLOCKED PORTFOLIO REPOSITORY DOSSIER (5 VERIFIED PROJECTS):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PROJECTS.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-3 rounded-2xl bg-black/35 border border-white/15 flex flex-col justify-between gap-2"
                    >
                      <div>
                        <div className="font-mono-code text-xs font-bold text-white flex items-center justify-between gap-1">
                          <span>{proj.title}</span>
                          <span className="text-[10px] text-[#fbcfe8]">{proj.language}</span>
                        </div>
                        <p className="text-[11px] text-white/65 mt-0.5 line-clamp-1">
                          {proj.category}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-[#fbcfe8] hover:text-[#050b18] text-white font-mono-code text-[10px] font-bold flex items-center gap-1 no-underline transition-colors"
                        >
                          <GitBranch className="w-3 h-3" />
                          <span>GitHub Repo</span>
                        </a>
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-full bg-[#5eead4]/20 hover:bg-[#5eead4] text-[#5eead4] hover:text-[#050b18] font-mono-code text-[10px] font-bold flex items-center gap-1 no-underline transition-colors"
                          >
                            <span>Live Demo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={continueEndless}
                  className="px-5 py-2.5 rounded-full bg-[#5eead4] text-[#050b18] font-pixel text-xs font-bold uppercase tracking-wider hover:opacity-90 cursor-pointer"
                >
                  CONTINUE ENDLESS MODE
                </button>
                <button
                  type="button"
                  onClick={startGame}
                  className="px-5 py-2.5 rounded-full bg-[#fbcfe8] text-[#050b18] font-mono-code text-xs font-bold uppercase tracking-wider hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESTART</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-white/25 text-white/85 hover:text-white font-mono-code text-xs uppercase cursor-pointer"
                >
                  RETURN TO PORTFOLIO
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {hudState.status === 'gameover' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-[#050b18]/92 backdrop-blur-md">
            <div className="max-w-lg w-full rounded-3xl border-2 border-[#fb7185] bg-[#0b162c] p-6 sm:p-8 text-center space-y-5">
              <div className="flex justify-center">
                <ShieldAlert className="w-12 h-12 text-[#fb7185]" />
              </div>
              <div className="space-y-1">
                <div className="font-mono-code text-xs uppercase tracking-widest text-[#fb7185]">
                  SYSTEM PERIMETER BREACHED
                </div>
                <h2 className="font-pixel text-2xl sm:text-3xl text-white">BREACH DETECTED</h2>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/15 font-mono-code">
                <div>
                  <div className="text-[10px] text-white/55">SCORE</div>
                  <div className="text-lg font-bold text-[#5eead4] tabular-nums">
                    {Math.round(hudState.score)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-white/55">BLOCKED</div>
                  <div className="text-lg font-bold text-[#fbcfe8] tabular-nums">
                    {Math.round(hudState.blockedCount)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-white/55">HIGH SCORE</div>
                  <div className="text-lg font-bold text-[#c084fc] tabular-nums">
                    {Math.round(hudState.highScore)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={startGame}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#fbcfe8] text-[#050b18] font-pixel text-xs font-bold uppercase tracking-wider hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>RESTART DEFENSE</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-full border border-white/25 text-white/80 hover:text-white font-mono-code text-xs uppercase cursor-pointer"
                >
                  EXIT ARCADE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Mobile & Touch Controls */}
      <div className="relative z-20 px-4 py-3 border-t border-white/15 bg-[#081126] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <button
            type="button"
            onPointerDown={() => {
              keysRef.current.left = true;
            }}
            onPointerUp={() => {
              keysRef.current.left = false;
            }}
            onPointerLeave={() => {
              keysRef.current.left = false;
            }}
            onClick={() => {
              gameStateRef.current.playerX = Math.max(8, gameStateRef.current.playerX - 9);
            }}
            aria-label="Move turret left"
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full border border-white/20 bg-white/5 active:bg-[#fbcfe8] active:text-[#050b18] font-mono-code text-xs font-bold uppercase cursor-pointer"
          >
            ◀ MOVE LEFT
          </button>

          <button
            type="button"
            onClick={firePulse}
            aria-label="Fire firewall countermeasure pulse"
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full bg-[#fbcfe8] text-[#050b18] font-mono-code text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform cursor-pointer"
          >
            ⚡ DEPLOY PATCH
          </button>

          <button
            type="button"
            onPointerDown={() => {
              keysRef.current.right = true;
            }}
            onPointerUp={() => {
              keysRef.current.right = false;
            }}
            onPointerLeave={() => {
              keysRef.current.right = false;
            }}
            onClick={() => {
              gameStateRef.current.playerX = Math.min(92, gameStateRef.current.playerX + 9);
            }}
            aria-label="Move turret right"
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full border border-white/20 bg-white/5 active:bg-[#fbcfe8] active:text-[#050b18] font-mono-code text-xs font-bold uppercase cursor-pointer"
          >
            MOVE RIGHT ▶
          </button>
        </div>

        <div className="hidden md:block font-mono-code text-xs text-white/60">
          TIP: Click or tap anywhere on the radar grid to reposition &amp; fire immediately.
        </div>
      </div>
    </div>
  );
};
