import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Droplets, RotateCcw, ArrowLeft, Volume2, VolumeX, ShieldAlert, Award, Compass, Zap } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface AerialBomberGameProps {
  onBack: () => void;
  onDonateEarned: (liters: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

interface Hotspot {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  health: number; // 100 down to 0
  maxHealth: number;
  extinguished: boolean;
  smokeTimer: number;
}

interface WaterDrop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export const AerialBomberGame: React.FC<AerialBomberGameProps> = ({
  onBack,
  onDonateEarned,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'briefing' | 'playing' | 'victory' | 'failed'>('briefing');
  const [waterTank, setWaterTank] = useState<number>(1000);
  const [maxTank] = useState<number>(1000);
  const [extinguishedCount, setExtinguishedCount] = useState<number>(0);
  const [totalFires, setTotalFires] = useState<number>(8);
  const [sessionLitersDonated, setSessionLitersDonated] = useState<number>(0);
  const [isSkimmingRiver, setIsSkimmingRiver] = useState<boolean>(false);
  const [forestHealth, setForestHealth] = useState<number>(100);

  // References to keep game loop fast and garbage-collection light
  const planeRef = useRef({
    x: 400,
    y: 300,
    angle: 0,
    speed: 3.5,
    targetX: 400,
    targetY: 300,
    isDropping: false,
    dropCooldown: 0,
  });

  const keysRef = useRef<{ [key: string]: boolean }>({});
  const hotspotsRef = useRef<Hotspot[]>([]);
  const waterDropsRef = useRef<WaterDrop[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const riverRef = useRef<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 420,
    width: 800,
    height: 90,
  });

  const initMission = useCallback(() => {
    const fires: Hotspot[] = [
      { id: 1, x: 180, y: 150, radius: 28, maxRadius: 50, health: 100, maxHealth: 100, extinguished: false, smokeTimer: 0 },
      { id: 2, x: 340, y: 110, radius: 32, maxRadius: 55, health: 100, maxHealth: 100, extinguished: false, smokeTimer: 0 },
      { id: 3, x: 620, y: 160, radius: 35, maxRadius: 60, health: 100, maxHealth: 100, extinguished: false, smokeTimer: 0 },
      { id: 4, x: 150, y: 320, radius: 25, maxRadius: 45, health: 100, maxHealth: 100, extinguished: false, smokeTimer: 0 },
      { id: 5, x: 670, y: 310, radius: 30, maxRadius: 50, health: 100, maxHealth: 100, extinguished: false, smokeTimer: 0 },
      { id: 6, x: 260, y: 550, radius: 35, maxRadius: 55, health: 100, maxHealth: 100, extinguished: false, smokeTimer: 0 },
      { id: 7, x: 500, y: 560, radius: 32, maxRadius: 50, health: 100, maxHealth: 100, extinguished: false, smokeTimer: 0 },
      { id: 8, x: 690, y: 530, radius: 28, maxRadius: 45, health: 100, maxHealth: 100, extinguished: false, smokeTimer: 0 },
    ];
    hotspotsRef.current = fires;
    waterDropsRef.current = [];
    particlesRef.current = [];
    planeRef.current = {
      x: 400,
      y: 450,
      angle: -Math.PI / 2,
      speed: 3.5,
      targetX: 400,
      targetY: 450,
      isDropping: false,
      dropCooldown: 0,
    };
    setWaterTank(1000);
    setExtinguishedCount(0);
    setTotalFires(fires.length);
    setForestHealth(100);
    setGameState('playing');
  }, []);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        planeRef.current.isDropping = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
      if (e.key === ' ' || e.code === 'Space') {
        planeRef.current.isDropping = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Canvas Animation Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const p = planeRef.current;
      const keys = keysRef.current;

      // Plane Steering
      if (keys['arrowleft'] || keys['a']) {
        p.angle -= 3.2 * dt;
      }
      if (keys['arrowright'] || keys['d']) {
        p.angle += 3.2 * dt;
      }
      if (keys['arrowup'] || keys['w']) {
        p.speed = Math.min(p.speed + 4 * dt, 5.5);
      } else if (keys['arrowdown'] || keys['s']) {
        p.speed = Math.max(p.speed - 3 * dt, 2.2);
      } else {
        // Return to standard cruising speed
        if (p.speed > 3.5) p.speed -= 2 * dt;
        if (p.speed < 3.5) p.speed += 1.5 * dt;
      }

      // Move plane
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;

      // Screen wrap
      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;
      if (p.y < -20) p.y = canvas.height + 20;
      if (p.y > canvas.height + 20) p.y = -20;

      // River Refill Check (skimming river)
      const river = riverRef.current;
      const inRiver = p.y >= river.y && p.y <= river.y + river.height;
      setIsSkimmingRiver(inRiver);

      if (inRiver && waterTank < maxTank) {
        setWaterTank((prev) => {
          const next = Math.min(prev + 400 * dt, maxTank);
          return Math.round(next);
        });
        // Create water refill spray particles
        if (Math.random() < 0.5) {
          particlesRef.current.push({
            x: p.x - Math.cos(p.angle) * 15 + (Math.random() * 10 - 5),
            y: p.y - Math.sin(p.angle) * 15 + (Math.random() * 10 - 5),
            vx: -Math.cos(p.angle) * 2 + (Math.random() * 2 - 1),
            vy: -Math.sin(p.angle) * 2 + (Math.random() * 2 - 1),
            size: Math.random() * 3 + 2,
            alpha: 0.8,
            life: 0,
            maxLife: 0.4,
            color: '#38bdf8',
          });
        }
      }

      // Water Dropping Action
      if (p.isDropping && p.dropCooldown <= 0 && waterTank > 0) {
        p.dropCooldown = 0.08; // rate limit drops
        setWaterTank((prev) => Math.max(prev - 25, 0));
        soundEffects.playWaterSplash();

        // Spawn falling water burst
        for (let i = 0; i < 4; i++) {
          const spread = (Math.random() - 0.5) * 14;
          waterDropsRef.current.push({
            x: p.x + Math.sin(p.angle) * spread,
            y: p.y - Math.cos(p.angle) * spread,
            vx: Math.cos(p.angle) * (p.speed * 0.7) + (Math.random() * 1 - 0.5),
            vy: Math.sin(p.angle) * (p.speed * 0.7) + (Math.random() * 1 - 0.5),
            radius: Math.random() * 6 + 7,
            alpha: 0.85,
          });
        }
      }
      if (p.dropCooldown > 0) {
        p.dropCooldown -= dt;
      }

      // Update Water Drops
      for (let i = waterDropsRef.current.length - 1; i >= 0; i--) {
        const drop = waterDropsRef.current[i];
        drop.x += drop.vx;
        drop.y += drop.vy;
        drop.radius += 0.2;
        drop.alpha -= 0.035;

        // Check collision against active fire hotspots
        hotspotsRef.current.forEach((spot) => {
          if (!spot.extinguished) {
            const dx = drop.x - spot.x;
            const dy = drop.y - spot.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < spot.radius + drop.radius) {
              spot.health -= 6;
              // Steam particles
              particlesRef.current.push({
                x: drop.x + (Math.random() * 10 - 5),
                y: drop.y + (Math.random() * 10 - 5),
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 3 - 1,
                size: Math.random() * 6 + 4,
                alpha: 0.9,
                life: 0,
                maxLife: 0.7,
                color: '#e2e8f0',
              });

              if (spot.health <= 0 && !spot.extinguished) {
                spot.extinguished = true;
                soundEffects.playSteamExtinguish();
                setExtinguishedCount((prev) => {
                  const updated = prev + 1;
                  return updated;
                });
                setSessionLitersDonated((prev) => prev + 10);
                onDonateEarned(10);
              }
            }
          }
        });

        if (drop.alpha <= 0) {
          waterDropsRef.current.splice(i, 1);
        }
      }

      // Update Hotspots and Smoke
      let activeFireCount = 0;
      hotspotsRef.current.forEach((spot) => {
        if (!spot.extinguished) {
          activeFireCount++;
          spot.smokeTimer += dt;
          if (spot.smokeTimer > 0.08) {
            spot.smokeTimer = 0;
            // Thick orange/gray smoke
            particlesRef.current.push({
              x: spot.x + (Math.random() - 0.5) * spot.radius,
              y: spot.y + (Math.random() - 0.5) * spot.radius,
              vx: (Math.random() - 0.5) * 1.5,
              vy: -Math.random() * 2 - 1.5,
              size: Math.random() * 8 + 6,
              alpha: 0.7,
              life: 0,
              maxLife: 1.2,
              color: Math.random() < 0.3 ? '#f97316' : '#57534e',
            });
          }
        }
      });

      // Slowly damage forest health if fires are raging
      if (activeFireCount > 0) {
        setForestHealth((prev) => {
          const dmg = (activeFireCount * 0.4) * dt;
          const next = Math.max(prev - dmg, 0);
          if (next <= 0) {
            setGameState('failed');
            soundEffects.playError();
          }
          return Math.round(next * 10) / 10;
        });
      }

      // Check Victory Condition
      if (activeFireCount === 0 && hotspotsRef.current.length > 0) {
        setGameState('victory');
        soundEffects.playSuccess();
        // Bonus for mission completion
        setSessionLitersDonated((prev) => prev + 25);
        onDonateEarned(25);
      }

      // Update Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life += dt;
        pt.size += 0.15;
        pt.alpha = 1 - pt.life / pt.maxLife;

        if (pt.life >= pt.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      // RENDER CANVAS
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Peat forest terrain backdrop (lush deep green moss and peat mounds)
      ctx.fillStyle = '#1c281e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle peat forest texture patches
      ctx.fillStyle = '#223425';
      for (let i = 0; i < 30; i++) {
        const px = ((i * 137) % canvas.width);
        const py = ((i * 211) % canvas.height);
        ctx.beginPath();
        ctx.arc(px, py, 45, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. River Zone (Water scooping area)
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(river.x, river.y, river.width, river.height);

      // Gentle river ripples
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      const rippleOffset = (currentTime * 0.05) % 40;
      for (let y = river.y + 15; y < river.y + river.height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < canvas.width; x += 60) {
          ctx.quadraticCurveTo(x + 30 + rippleOffset, y - 6, x + 60, y);
        }
        ctx.stroke();
      }

      // River label indicator
      ctx.fillStyle = '#e0f2fe';
      ctx.font = '11px sans-serif';
      ctx.fillText('RIVER REFILL ZONE (Fly here to scoop water)', 20, river.y + 30);

      // 3. Render Fire Hotspots
      hotspotsRef.current.forEach((spot) => {
        if (!spot.extinguished) {
          // Ember ground
          const grad = ctx.createRadialGradient(spot.x, spot.y, 2, spot.x, spot.y, spot.radius);
          grad.addColorStop(0, '#fef08a');
          grad.addColorStop(0.3, '#f97316');
          grad.addColorStop(0.8, '#dc2626');
          grad.addColorStop(1, 'rgba(185, 28, 28, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(spot.x, spot.y, spot.radius, 0, Math.PI * 2);
          ctx.fill();

          // Health bar above spot
          const barW = 34;
          const barH = 4;
          const barX = spot.x - barW / 2;
          const barY = spot.y - spot.radius - 8;
          ctx.fillStyle = '#1c1917';
          ctx.fillRect(barX, barY, barW, barH);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(barX, barY, (spot.health / spot.maxHealth) * barW, barH);
        } else {
          // Extinguished ash circle with green sprouts
          ctx.fillStyle = '#3f3f46';
          ctx.beginPath();
          ctx.arc(spot.x, spot.y, spot.radius * 0.7, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#4ade80';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('SAVED', spot.x, spot.y + 4);
          ctx.textAlign = 'start';
        }
      });

      // 4. Render Particles (Smoke and Steam)
      particlesRef.current.forEach((pt) => {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(pt.alpha, 0);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 5. Render Water Drops
      waterDropsRef.current.forEach((drop) => {
        ctx.fillStyle = '#38bdf8';
        ctx.globalAlpha = drop.alpha;
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 6. Render Aircraft (Top-Down Water Bomber)
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      // Plane shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(12, 12, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Plane fuselage (Air tanker orange & white)
      ctx.fillStyle = '#f97316'; // Vivid safety orange
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wings
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-6, -22, 12, 44);

      // Wingtips (yellow high-vis)
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-5, -22, 10, 4);
      ctx.fillRect(-5, 18, 10, 4);

      // Cockpit windshield
      ctx.fillStyle = '#0ea5e9';
      ctx.beginPath();
      ctx.ellipse(8, 0, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tail wings
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-16, -9, 5, 18);

      // Propeller spin blur
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(19, 0, 7, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, waterTank, maxTank, onDonateEarned]);

  // Touch & Mouse click to drop water
  const handlePointerDown = () => {
    if (gameState === 'playing') {
      planeRef.current.isDropping = true;
    }
  };

  const handlePointerUp = () => {
    planeRef.current.isDropping = false;
  };

  return (
    <div className="space-y-4">
      {/* Top Header / Status bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-stone-900 border border-stone-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEffects.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-300 hover:text-stone-100 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Mission Hub</span>
          </button>
          <div className="h-4 w-px bg-stone-700 hidden sm:block" />
          <h2 className="text-base font-bold text-stone-100 font-display">
            Mission 1: Sebangau Peatland Sky Bomber
          </h2>
        </div>

        {/* Meters */}
        <div className="flex items-center gap-4 text-xs">
          {/* Water Tank */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Payload:</span>
            <div className="w-24 sm:w-32 h-3 bg-stone-800 rounded-full overflow-hidden border border-stone-700">
              <div
                className={`h-full transition-all ${
                  isSkimmingRiver ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
                }`}
                style={{ width: `${(waterTank / maxTank) * 100}%` }}
              />
            </div>
            <span className="font-mono text-cyan-300 tabular-nums">
              {Math.round(waterTank)}L
            </span>
          </div>

          {/* Extinguished Progress */}
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-stone-400">Doused:</span>
            <span className="font-bold text-emerald-400 tabular-nums">
              {extinguishedCount}/{totalFires}
            </span>
          </div>

          {/* Peat Forest Health */}
          <div className="hidden md:flex items-center gap-1.5 font-mono">
            <span className="text-stone-400">Canopy:</span>
            <span className={`font-bold tabular-nums ${forestHealth > 40 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {forestHealth}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Game Screen */}
      <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-stone-950 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={800}
          height={650}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className="w-full h-auto max-h-[70vh] block cursor-crosshair select-none"
        />

        {/* River Refill Alert */}
        {isSkimmingRiver && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-cyan-950/90 border border-cyan-500/50 text-cyan-200 px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 backdrop-blur-sm shadow-lg pointer-events-none">
            <Zap className="w-3.5 h-3.5 text-cyan-300 fill-cyan-300 animate-bounce" />
            <span>Skimming River: Refilling Water Tanks!</span>
          </div>
        )}

        {/* Empty Tank Alert */}
        {waterTank <= 0 && gameState === 'playing' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-rose-950/90 border border-rose-500/50 text-rose-200 px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 backdrop-blur-sm shadow-lg pointer-events-none">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>WATER EMPTY — Fly down to the blue river to scoop more water!</span>
          </div>
        )}

        {/* Briefing Overlay */}
        {gameState === 'briefing' && (
          <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-6 z-20">
            <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5 text-center">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/30">
                <Droplets className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-stone-100 font-display">
                  Aerial Water Bombing Run
                </h3>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Fly an amphibious firefighting aircraft over burning peatland. Douse subterranean embers before primary rainforest is consumed.
                </p>
              </div>

              <div className="bg-stone-950/80 rounded-xl p-3.5 text-xs text-stone-300 text-left space-y-2 border border-stone-800">
                <div className="font-semibold text-stone-200">Flight Controls:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-400">
                  <div><strong className="text-stone-200">A / D</strong> or <strong className="text-stone-200">Arrows</strong>: Steer</div>
                  <div><strong className="text-stone-200">W / S</strong>: Throttle / Brake</div>
                  <div><strong className="text-stone-200">Spacebar / Click</strong>: Drop Water</div>
                  <div><strong className="text-cyan-300">Blue River</strong>: Refill Tank</div>
                </div>
              </div>

              <div className="text-xs text-amber-400/90 bg-amber-950/30 p-2.5 rounded-lg border border-amber-800/40">
                Impact Reward: +10L real donated water per extinguished hotspot (+25L mission bonus)!
              </div>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  initMission();
                }}
                className="w-full py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-bold text-sm transition-colors cursor-pointer shadow-md"
              >
                Launch Firefighting Aircraft
              </button>
            </div>
          </div>
        )}

        {/* Victory Modal */}
        {gameState === 'victory' && (
          <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-6 z-20">
            <div className="max-w-md w-full bg-stone-900 border border-emerald-500/40 rounded-2xl p-6 space-y-5 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <Award className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-stone-100 font-display">
                  Mission Accomplished!
                </h3>
                <p className="text-stone-300 text-xs">
                  All 8 peat hotspots successfully doused. Sebangau forest canopy saved!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-2">
                <div className="text-xs text-emerald-300">Water Donated This Flight:</div>
                <div className="text-3xl font-mono font-bold text-emerald-400">
                  +{sessionLitersDonated} Liters
                </div>
                <div className="text-[11px] text-stone-400">
                  Sponsored and credited directly to Manggala Agni frontline ground crews.
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    initMission();
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Fly Again</span>
                </button>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onBack();
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs border border-stone-700 transition-colors cursor-pointer"
                >
                  Return to Hub
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Failed Modal */}
        {gameState === 'failed' && (
          <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-6 z-20">
            <div className="max-w-md w-full bg-stone-900 border border-rose-500/40 rounded-2xl p-6 space-y-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-100 font-display">
                Canopy Overwhelmed
              </h3>
              <p className="text-stone-300 text-xs">
                The subterranean peat fires expanded too quickly. Keep fires suppressed early and replenish your water payload at the river frequently.
              </p>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  initMission();
                }}
                className="w-full py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Restart Mission
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Touch Action Controls for Mobile / Small Screens */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 md:hidden">
        <button
          onPointerDown={() => { keysRef.current['a'] = true; }}
          onPointerUp={() => { keysRef.current['a'] = false; }}
          className="py-3 bg-stone-800 active:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700 select-none"
        >
          Turn Left (A)
        </button>
        <button
          onPointerDown={() => { keysRef.current['d'] = true; }}
          onPointerUp={() => { keysRef.current['d'] = false; }}
          className="py-3 bg-stone-800 active:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700 select-none"
        >
          Turn Right (D)
        </button>
        <button
          onPointerDown={() => { keysRef.current['w'] = true; }}
          onPointerUp={() => { keysRef.current['w'] = false; }}
          className="py-3 bg-stone-800 active:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700 select-none"
        >
          Accelerate (W)
        </button>
        <button
          onPointerDown={() => { planeRef.current.isDropping = true; }}
          onPointerUp={() => { planeRef.current.isDropping = false; }}
          className="py-3 bg-cyan-500 active:bg-cyan-400 text-stone-950 text-xs font-bold rounded-lg select-none"
        >
          DROP WATER
        </button>
      </div>

    </div>
  );
};
