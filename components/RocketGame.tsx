'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, X, Play, RotateCcw, Trophy } from 'lucide-react';
import { useRocket } from '@/components/RocketContext';

interface Laser {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

interface Asteroid {
  x: number;
  y: number;
  size: number;
  speed: number;
  hp: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

export function RocketGame() {
  const { loadingState, isGameOpen: isOpen, setIsGameOpen: setIsOpen, setIsKaiOpen } = useRocket();
  const [gameState, setGameState] = useState<'input_name' | 'ready' | 'playing' | 'game_over'>('input_name');
  const [playerName, setPlayerName] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Gameplay state refs for loop
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const rocketX = useRef(180);
  const lasers = useRef<Laser[]>([]);
  const asteroids = useRef<Asteroid[]>([]);
  const particles = useRef<Particle[]>([]);
  const spawnTimer = useRef(0);
  const shootTimer = useRef(0);
  const scoreRef = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const frameCount = useRef(0);

  const isVisible =
    loadingState === 'revealing' ||
    loadingState === 'cursor_returning' ||
    loadingState === 'ready';

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rocket_game_highscore');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Reset game state to fresh start on close
  useEffect(() => {
    if (!isOpen) {
      setGameState('input_name');
    }
  }, [isOpen]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop controller
  useEffect(() => {
    if (isOpen && gameState === 'playing') {
      // Start loop
      scoreRef.current = 0;
      setScore(0);
      rocketX.current = 180;
      lasers.current = [];
      asteroids.current = [];
      particles.current = [];
      spawnTimer.current = 0;
      shootTimer.current = 0;
      frameCount.current = 0;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          gameLoop(ctx, canvas);
        }
      }
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isOpen, gameState]);

  // Touch and Mouse control events for direct steering
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    rocketX.current = Math.max(15, Math.min(canvas.width - 15, x));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    rocketX.current = Math.max(15, Math.min(canvas.width - 15, x));
  };

  const createExplosion = (x: number, y: number, color: string, count = 8) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1,
        color,
        alpha: 1
      });
    }
  };

  const gameLoop = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    frameCount.current++;
    const elapsedSeconds = frameCount.current / 60;

    // 1. Update Rocket Position from keys
    if (keysPressed.current['ArrowLeft'] || keysPressed.current['a'] || keysPressed.current['A']) {
      rocketX.current = Math.max(15, rocketX.current - 5);
    }
    if (keysPressed.current['ArrowRight'] || keysPressed.current['d'] || keysPressed.current['D']) {
      rocketX.current = Math.min(canvas.width - 15, rocketX.current + 5);
    }

    // 2. Shoot automatic lasers
    shootTimer.current++;
    if (shootTimer.current >= 15) {
      shootTimer.current = 0;
      lasers.current.push({
        x: rocketX.current - 2,
        y: canvas.height - 45,
        width: 4,
        height: 12,
        speed: 8
      });
      // Tiny engine spark sparks
      particles.current.push({
        x: rocketX.current,
        y: canvas.height - 15,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 2 + 2,
        size: Math.random() * 2 + 1,
        color: '#ff3300',
        alpha: 0.8
      });
    }

    // 3. Spawn asteroids
    spawnTimer.current++;
    const spawnRate = Math.max(30, 85 - Math.floor(elapsedSeconds / 4)); // Slow build-up over 1-2 minutes
    if (spawnTimer.current >= spawnRate) {
      spawnTimer.current = 0;
      const size = Math.random() * 25 + 15;
      asteroids.current.push({
        x: Math.random() * (canvas.width - size * 2) + size,
        y: -size,
        size,
        speed: Math.random() * 1.0 + 1.2 + (elapsedSeconds * 0.035), // Start slow and scale up gradually
        hp: Math.ceil(size / 15)
      });
    }

    // 4. Update elements
    // Lasers
    lasers.current.forEach((l) => (l.y -= l.speed));
    lasers.current = lasers.current.filter((l) => l.y > -20);

    // Asteroids
    let hitRocket = false;
    asteroids.current.forEach((ast) => {
      ast.y += ast.speed;

      // Simple box collision with rocket
      // Rocket sits at bottom-center: X: rocketX, Y: canvas.height - 30
      const rx = rocketX.current;
      const ry = canvas.height - 30;
      const dist = Math.hypot(ast.x - rx, ast.y - ry);
      if (dist < ast.size + 15) {
        hitRocket = true;
      }
    });

    if (hitRocket) {
      createExplosion(rocketX.current, canvas.height - 30, '#ff3300', 30);
      setScore(scoreRef.current);
      if (scoreRef.current > highScore) {
        setHighScore(scoreRef.current);
        localStorage.setItem('rocket_game_highscore', scoreRef.current.toString());
      }
      setGameState('game_over');
      return;
    }

    // Asteroid laser collisions
    asteroids.current.forEach((ast, aIdx) => {
      lasers.current.forEach((las, lIdx) => {
        const dist = Math.hypot(ast.x - las.x, ast.y - las.y);
        if (dist < ast.size + 5) {
          // Hit asteroid
          ast.hp--;
          // Remove laser
          lasers.current.splice(lIdx, 1);
          // Spark particles
          createExplosion(las.x, las.y, '#ffea00', 4);

          if (ast.hp <= 0) {
            // Destroy asteroid
            createExplosion(ast.x, ast.y, '#9e9e9e', 12);
            asteroids.current.splice(aIdx, 1);
            scoreRef.current += Math.floor(ast.size);
            setScore(scoreRef.current);
          }
        }
      });
    });

    // Remove offscreen asteroids
    asteroids.current = asteroids.current.filter((ast) => ast.y < canvas.height + ast.size);

    // Particles update
    particles.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.02;
    });
    particles.current = particles.current.filter((p) => p.alpha > 0);

    // 5. Draw Frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Starry bg dots
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    for (let i = 0; i < 20; i++) {
      const sx = (Math.sin(i * 999) + 1) * canvas.width * 0.5;
      const sy = ((timeProgress() + i * 50) % canvas.height);
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    // Draw Lasers
    ctx.fillStyle = '#ff3366';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff3366';
    lasers.current.forEach((l) => {
      ctx.fillRect(l.x, l.y, l.width, l.height);
    });
    ctx.shadowBlur = 0; // Reset shadow

    // Draw Asteroids
    ctx.fillStyle = '#424242';
    ctx.strokeStyle = '#757575';
    ctx.lineWidth = 2;
    asteroids.current.forEach((ast) => {
      ctx.beginPath();
      ctx.arc(ast.x, ast.y, ast.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cracks / texture
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.moveTo(ast.x - ast.size * 0.4, ast.y - ast.size * 0.2);
      ctx.lineTo(ast.x + ast.size * 0.2, ast.y + ast.size * 0.4);
      ctx.stroke();
    });

    // Draw Particles
    particles.current.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Rocket
    const rx = rocketX.current;
    const ry = canvas.height - 30;

    // Fire flame engine glowing
    ctx.fillStyle = Math.random() > 0.5 ? '#ff3300' : '#ffea00';
    ctx.beginPath();
    ctx.moveTo(rx - 6, ry + 15);
    ctx.lineTo(rx, ry + 25 + Math.random() * 8);
    ctx.lineTo(rx + 6, ry + 15);
    ctx.closePath();
    ctx.fill();

    // Rocket body shell
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.moveTo(rx, ry - 20); // Tip
    ctx.lineTo(rx - 12, ry + 15); // Bottom Left
    ctx.lineTo(rx + 12, ry + 15); // Bottom Right
    ctx.closePath();
    ctx.fill();

    // Red wing details
    ctx.fillStyle = '#ff1744';
    ctx.beginPath();
    ctx.moveTo(rx - 12, ry + 5);
    ctx.lineTo(rx - 18, ry + 15);
    ctx.lineTo(rx - 12, ry + 15);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(rx + 12, ry + 5);
    ctx.lineTo(rx + 18, ry + 15);
    ctx.lineTo(rx + 12, ry + 15);
    ctx.closePath();
    ctx.fill();

    // Window glass
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(rx, ry - 2, 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw HUD Score
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`SCORE: ${scoreRef.current}`, 15, 25);
    ctx.fillText(`HI: ${highScore}`, canvas.width - 90, 25);

    animationFrameId.current = requestAnimationFrame(() => gameLoop(ctx, canvas));
  };

  // Scroll mock bg
  const timeProgress = () => {
    return (Date.now() / 15) % 400;
  };

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      setGameState('playing');
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Game Button (Placed beside KAI) */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.1, type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => {
          if (isOpen && gameState === 'playing') {
            setScore(scoreRef.current);
            if (scoreRef.current > highScore) {
              setHighScore(scoreRef.current);
              localStorage.setItem('rocket_game_highscore', scoreRef.current.toString());
            }
            setGameState('game_over');
          } else {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setIsKaiOpen(false);
            }
          }
        }}
        className="fixed bottom-8 right-24 z-40 bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/20 hover:border-red-500/50 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors group"
        aria-label="Toggle Rocket Game"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-red-500/10 group-hover:bg-red-500/20 scale-95" />
          <Rocket className={`w-6 h-6 text-white group-hover:text-red-500 transition-colors ${isOpen ? 'rotate-45' : ''}`} />
        </div>
      </motion.button>

      {/* Game Window Card Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click blocker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (gameState === 'playing') {
                  setScore(scoreRef.current);
                  if (scoreRef.current > highScore) {
                    setHighScore(scoreRef.current);
                    localStorage.setItem('rocket_game_highscore', scoreRef.current.toString());
                  }
                  setGameState('game_over');
                } else {
                  setIsOpen(false);
                }
              }}
              className="fixed inset-0 z-30 bg-black/10 backdrop-blur-[1px]"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="fixed bottom-24 right-4 sm:right-24 z-40 w-[92vw] sm:w-[400px] h-[550px] bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-3xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Rocket className="w-5 h-5 text-red-500 animate-pulse" />
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wider">RETRO ROCKET</h3>
                    <p className="text-[10px] text-white/50 tracking-wider">ARCADE SUB-SCREEN</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (gameState === 'playing') {
                      setScore(scoreRef.current);
                      if (scoreRef.current > highScore) {
                        setHighScore(scoreRef.current);
                        localStorage.setItem('rocket_game_highscore', scoreRef.current.toString());
                      }
                      setGameState('game_over');
                    } else {
                      setIsOpen(false);
                    }
                  }}
                  className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Game Workspace Body */}
            <div ref={containerRef} className="flex-1 relative bg-black/40 flex flex-col items-center justify-center p-6">
              {gameState === 'input_name' && (
                <motion.form
                  onSubmit={handleStartGame}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full flex flex-col gap-6 text-center"
                >
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Launch Protocol</h2>
                    <p className="text-xs text-white/60">Enter your callsign/name to begin navigation check.</p>
                  </div>

                  <input
                    type="text"
                    required
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Your Callsign..."
                    maxLength={15}
                    className="bg-black/60 border border-white/10 hover:border-white/20 focus:border-red-500/50 rounded-xl px-4 py-3 text-center text-sm text-white placeholder-white/30 outline-none transition-all"
                  />

                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-500 text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-600/20"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Initialize Engine
                  </button>
                </motion.form>
              )}

              {gameState === 'playing' && (
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden">
                   <canvas
                    ref={canvasRef}
                    width={360}
                    height={440}
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleTouchMove}
                    className="border border-white/5 rounded-xl bg-black/80"
                  />
                  <div className="text-[10px] text-white/40 mt-2 text-center">
                    Drag / move cursor horizontal to steer. Automatic blasters active.
                  </div>
                </div>
              )}

              {gameState === 'game_over' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex flex-col gap-6 text-center items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
                    <Trophy className="w-8 h-8 text-red-500" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-red-500 tracking-wider mb-2">MISSION CONCLUDED</h2>
                    <p className="text-sm text-white/90 font-medium px-4">
                      Thank you for visiting the portfolio, <span className="text-red-400 font-bold">{playerName}</span>!
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl py-4 px-8 w-full max-w-[280px]">
                    <div className="text-xs text-white/40 tracking-widest uppercase mb-1">Final Score</div>
                    <div className="text-3xl font-black text-white">{score}</div>
                  </div>

                  <button
                    onClick={() => setGameState('playing')}
                    className="bg-white/10 hover:bg-white/15 border border-white/10 hover:border-red-500/50 text-white rounded-xl py-3 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restart Flight
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
