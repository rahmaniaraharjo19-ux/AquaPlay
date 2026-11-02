import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Droplets, CheckCircle, Waves, Sparkles, Award, ShieldCheck } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface CanalPuzzleGameProps {
  onBack: () => void;
  onDonateEarned: (liters: number) => void;
}

// Openings: [top, right, bottom, left] boolean
type TileType = 'straight' | 'elbow' | 'tee' | 'cross' | 'source' | 'target';

interface GridTile {
  id: string;
  row: number;
  col: number;
  type: TileType;
  rotation: number; // 0, 90, 180, 270
  isSource?: boolean;
  isTarget?: boolean;
  targetName?: string;
  isFilled?: boolean;
}

interface LevelConfig {
  id: number;
  name: string;
  region: string;
  gridSize: number;
  rewardLiters: number;
  description: string;
  tiles: {
    row: number;
    col: number;
    type: TileType;
    initialRot: number;
    isSource?: boolean;
    isTarget?: boolean;
    targetName?: string;
  }[];
}

const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Stage 1: Bengkalis Canal Sluice',
    region: 'Riau Peat Dome',
    gridSize: 4,
    rewardLiters: 25,
    description: 'Rotate the wooden canal sluices to direct water from the Siak River to the dry Bengkalis peat dome.',
    tiles: [
      { row: 0, col: 0, type: 'source', initialRot: 0, isSource: true },
      { row: 0, col: 1, type: 'straight', initialRot: 0 },
      { row: 0, col: 2, type: 'elbow', initialRot: 90 },
      { row: 0, col: 3, type: 'elbow', initialRot: 180 },
      { row: 1, col: 0, type: 'straight', initialRot: 90 },
      { row: 1, col: 1, type: 'tee', initialRot: 0 },
      { row: 1, col: 2, type: 'straight', initialRot: 90 },
      { row: 1, col: 3, type: 'straight', initialRot: 0 },
      { row: 2, col: 0, type: 'elbow', initialRot: 270 },
      { row: 2, col: 1, type: 'straight', initialRot: 0 },
      { row: 2, col: 2, type: 'tee', initialRot: 180 },
      { row: 2, col: 3, type: 'elbow', initialRot: 90 },
      { row: 3, col: 0, type: 'straight', initialRot: 0 },
      { row: 3, col: 1, type: 'elbow', initialRot: 270 },
      { row: 3, col: 2, type: 'straight', initialRot: 0 },
      { row: 3, col: 3, type: 'target', initialRot: 0, isTarget: true, targetName: 'Bengkalis Peat' },
    ],
  },
  {
    id: 2,
    name: 'Stage 2: Kahayan River Sluice Network',
    region: 'Central Kalimantan',
    gridSize: 4,
    rewardLiters: 35,
    description: 'Saturate two separate smoldering peat zones simultaneously using split T-canals.',
    tiles: [
      { row: 0, col: 0, type: 'source', initialRot: 0, isSource: true },
      { row: 0, col: 1, type: 'tee', initialRot: 90 },
      { row: 0, col: 2, type: 'straight', initialRot: 0 },
      { row: 0, col: 3, type: 'target', initialRot: 0, isTarget: true, targetName: 'East Peat Sector' },
      { row: 1, col: 0, type: 'straight', initialRot: 0 },
      { row: 1, col: 1, type: 'straight', initialRot: 90 },
      { row: 1, col: 2, type: 'elbow', initialRot: 180 },
      { row: 1, col: 3, type: 'straight', initialRot: 0 },
      { row: 2, col: 0, type: 'elbow', initialRot: 0 },
      { row: 2, col: 1, type: 'cross', initialRot: 0 },
      { row: 2, col: 2, type: 'tee', initialRot: 270 },
      { row: 2, col: 3, type: 'elbow', initialRot: 90 },
      { row: 3, col: 0, type: 'straight', initialRot: 90 },
      { row: 3, col: 1, type: 'elbow', initialRot: 180 },
      { row: 3, col: 2, type: 'straight', initialRot: 0 },
      { row: 3, col: 3, type: 'target', initialRot: 0, isTarget: true, targetName: 'South Peat Dome' },
    ],
  },
  {
    id: 3,
    name: 'Stage 3: Sebangau Deep Siphon Matrix',
    region: 'Sebangau National Park',
    gridSize: 4,
    rewardLiters: 50,
    description: 'Master a dense network to rewet endangered orangutan habitat before dry wind fans sparks.',
    tiles: [
      { row: 0, col: 0, type: 'source', initialRot: 0, isSource: true },
      { row: 0, col: 1, type: 'elbow', initialRot: 270 },
      { row: 0, col: 2, type: 'tee', initialRot: 0 },
      { row: 0, col: 3, type: 'straight', initialRot: 90 },
      { row: 1, col: 0, type: 'straight', initialRot: 90 },
      { row: 1, col: 1, type: 'cross', initialRot: 0 },
      { row: 1, col: 2, type: 'straight', initialRot: 0 },
      { row: 1, col: 3, type: 'target', initialRot: 0, isTarget: true, targetName: 'Habitat Sector Alpha' },
      { row: 2, col: 0, type: 'tee', initialRot: 180 },
      { row: 2, col: 1, type: 'straight', initialRot: 90 },
      { row: 2, col: 2, type: 'elbow', initialRot: 90 },
      { row: 2, col: 3, type: 'straight', initialRot: 0 },
      { row: 3, col: 0, type: 'elbow', initialRot: 180 },
      { row: 3, col: 1, type: 'tee', initialRot: 270 },
      { row: 3, col: 2, type: 'straight', initialRot: 0 },
      { row: 3, col: 3, type: 'target', initialRot: 0, isTarget: true, targetName: 'Orangutan Sanctuary' },
    ],
  },
];

// Helper to determine active openings based on tile type and rotation
// directions: 0 = top, 1 = right, 2 = bottom, 3 = left
function getTileOpenings(type: TileType, rotation: number): boolean[] {
  let base = [false, false, false, false];
  if (type === 'straight') {
    // horizontal: right (1) and left (3)
    base = [false, true, false, true];
  } else if (type === 'elbow') {
    // top (0) and right (1)
    base = [true, true, false, false];
  } else if (type === 'tee') {
    // top (0), right (1), bottom (2)
    base = [true, true, true, false];
  } else if (type === 'cross') {
    base = [true, true, true, true];
  } else if (type === 'source') {
    // Source flows right and down
    base = [false, true, true, false];
  } else if (type === 'target') {
    // Target accepts from all sides
    base = [true, true, true, true];
  }

  // Shift openings according to rotation (in steps of 90 deg)
  const steps = (rotation / 90) % 4;
  const rotated = [false, false, false, false];
  for (let i = 0; i < 4; i++) {
    rotated[(i + steps) % 4] = base[i];
  }
  return rotated;
}

export const CanalPuzzleGame: React.FC<CanalPuzzleGameProps> = ({
  onBack,
  onDonateEarned,
}) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState<number>(0);
  const [tiles, setTiles] = useState<GridTile[]>([]);
  const [levelWon, setLevelWon] = useState<boolean>(false);
  const [sessionDonated, setSessionDonated] = useState<number>(0);

  const level = LEVELS[currentLevelIdx];

  // Initialize level
  const loadLevel = useCallback((lvlIndex: number) => {
    const config = LEVELS[lvlIndex];
    const initialTiles: GridTile[] = config.tiles.map((t) => ({
      id: `${t.row}-${t.col}`,
      row: t.row,
      col: t.col,
      type: t.type,
      rotation: t.initialRot,
      isSource: t.isSource,
      isTarget: t.isTarget,
      targetName: t.targetName,
      isFilled: false,
    }));
    setTiles(initialTiles);
    setLevelWon(false);
  }, []);

  useEffect(() => {
    loadLevel(currentLevelIdx);
  }, [currentLevelIdx, loadLevel]);

  // Compute water propagation through connected canal tiles
  const waterState = useMemo(() => {
    if (tiles.length === 0) return { filledSet: new Set<string>(), targetsReached: 0, totalTargets: 0 };

    const grid: { [key: string]: GridTile } = {};
    let sourceKey = '';
    let totalTargets = 0;

    tiles.forEach((t) => {
      const key = `${t.row},${t.col}`;
      grid[key] = t;
      if (t.isSource) sourceKey = key;
      if (t.isTarget) totalTargets++;
    });

    const filledSet = new Set<string>();
    const queue: string[] = [];

    if (sourceKey) {
      filledSet.add(sourceKey);
      queue.push(sourceKey);
    }

    let targetsReached = 0;

    // Directions: 0: top, 1: right, 2: bottom, 3: left
    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];
    const oppositeDir = [2, 3, 0, 1];

    while (queue.length > 0) {
      const currKey = queue.shift()!;
      const currTile = grid[currKey];
      if (!currTile) continue;

      const currOpenings = getTileOpenings(currTile.type, currTile.rotation);

      for (let dir = 0; dir < 4; dir++) {
        if (!currOpenings[dir]) continue;

        const nr = currTile.row + dr[dir];
        const nc = currTile.col + dc[dir];
        const nextKey = `${nr},${nc}`;
        const nextTile = grid[nextKey];

        if (nextTile && !filledSet.has(nextKey)) {
          const nextOpenings = getTileOpenings(nextTile.type, nextTile.rotation);
          const requiredOpposite = oppositeDir[dir];

          // Connection check: does neighbor have opening matching ours?
          if (nextOpenings[requiredOpposite]) {
            filledSet.add(nextKey);
            queue.push(nextKey);
            if (nextTile.isTarget) {
              targetsReached++;
            }
          }
        }
      }
    }

    return { filledSet, targetsReached, totalTargets };
  }, [tiles]);

  // Check victory condition
  useEffect(() => {
    if (!levelWon && waterState.totalTargets > 0 && waterState.targetsReached === waterState.totalTargets) {
      setLevelWon(true);
      soundEffects.playSuccess();
      soundEffects.playWaterSplash();
      setSessionDonated((prev) => prev + level.rewardLiters);
      onDonateEarned(level.rewardLiters);
    }
  }, [waterState, levelWon, level.rewardLiters, onDonateEarned]);

  // Rotate tile on click
  const handleTileClick = (tileId: string) => {
    if (levelWon) return;

    soundEffects.playClick();
    setTiles((prev) =>
      prev.map((t) => {
        if (t.id === tileId) {
          if (t.isSource || t.isTarget) return t; // fixed tiles
          const nextRot = (t.rotation + 90) % 360;
          return { ...t, rotation: nextRot };
        }
        return t;
      })
    );
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Top Header */}
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
          <div>
            <h2 className="text-base font-bold text-stone-100 font-display">
              {level.name}
            </h2>
            <div className="text-xs text-stone-400">
              {level.region} · Reward: +{level.rewardLiters}L Donated Water
            </div>
          </div>
        </div>

        {/* Level Controls & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-xs">
            <span className="text-stone-400">Peat Targets Saturated:</span>
            <span className="font-mono font-bold text-cyan-400 tabular-nums">
              {waterState.targetsReached} / {waterState.totalTargets}
            </span>
          </div>

          <button
            onClick={() => {
              soundEffects.playClick();
              loadLevel(currentLevelIdx);
            }}
            aria-label="Reset canal rotation"
            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description & Instruction Banner */}
      <div className="p-3.5 rounded-xl bg-stone-900/60 border border-stone-800 text-xs text-stone-300 flex items-center justify-between">
        <p className="flex items-center gap-2">
          <Waves className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Click any canal section to rotate it 90°. Form an unbroken water channel from the river reservoir to all dry peat sectors.</span>
        </p>
        <span className="font-mono text-cyan-400 shrink-0 hidden sm:inline-block">
          Water Tank: ACTIVE
        </span>
      </div>

      {/* Main Grid Card */}
      <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 relative overflow-hidden shadow-2xl flex flex-col items-center">
        
        {/* Subtle Peat Terrain backdrop texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* 4x4 Puzzle Grid */}
        <div className="grid grid-cols-4 gap-3.5 z-10 p-3 bg-stone-950/80 rounded-2xl border border-stone-800/80 shadow-inner">
          {tiles.map((tile) => {
            const key = `${tile.row},${tile.col}`;
            const isFilled = waterState.filledSet.has(key);

            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile.id)}
                disabled={tile.isSource || tile.isTarget}
                aria-label={`Canal tile at row ${tile.row + 1}, column ${tile.col + 1}`}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex items-center justify-center relative transition-all duration-150 select-none ${
                  tile.isSource || tile.isTarget
                    ? 'cursor-default ring-1 ring-cyan-500/30'
                    : 'cursor-pointer hover:scale-105 active:scale-95'
                } ${
                  isFilled ? 'bg-cyan-950/60 border-2 border-cyan-400 shadow-md shadow-cyan-500/20' : 'bg-stone-900 border border-stone-800'
                }`}
              >
                {/* Visual Canal Graphics */}
                <div
                  className="w-full h-full p-2 flex items-center justify-center transition-transform duration-200"
                  style={{ transform: `rotate(${tile.rotation}deg)` }}
                >
                  {/* SOURCE TILE */}
                  {tile.type === 'source' && (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-1 bg-cyan-900/60 rounded-lg border border-cyan-500">
                      <Waves className="w-5 h-5 text-cyan-300 animate-pulse" />
                      <span className="text-[10px] font-bold text-cyan-200 mt-1">RIVER SOURCE</span>
                    </div>
                  )}

                  {/* TARGET TILE */}
                  {tile.type === 'target' && (
                    <div
                      className={`w-full h-full flex flex-col items-center justify-center text-center p-1 rounded-lg border transition-colors ${
                        isFilled
                          ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300'
                          : 'bg-amber-950/40 border-amber-600/50 text-amber-300'
                      }`}
                    >
                      {isFilled ? (
                        <CheckCircle className="w-6 h-6 text-emerald-400 animate-bounce" />
                      ) : (
                        <Droplets className="w-5 h-5 text-amber-400 animate-pulse" />
                      )}
                      <span className="text-[9px] font-bold mt-1 uppercase leading-tight">
                        {isFilled ? 'SATURATED' : tile.targetName || 'DRY PEAT'}
                      </span>
                    </div>
                  )}

                  {/* STRAIGHT CANAL */}
                  {tile.type === 'straight' && (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Horizontal canal trench */}
                      <div
                        className={`w-full h-5 rounded-sm transition-colors ${
                          isFilled ? 'bg-cyan-400 shadow-sm shadow-cyan-300' : 'bg-stone-700'
                        }`}
                      />
                      {/* Wooden timber embankment borders */}
                      <div className="absolute top-1/2 -translate-y-1/2 w-full h-7 border-y-2 border-stone-800 pointer-events-none" />
                    </div>
                  )}

                  {/* ELBOW / CORNER CANAL */}
                  {tile.type === 'elbow' && (
                    <div className="relative w-full h-full">
                      {/* Top vertical branch */}
                      <div
                        className={`absolute top-0 right-1/2 translate-x-1/2 w-5 h-1/2 transition-colors ${
                          isFilled ? 'bg-cyan-400' : 'bg-stone-700'
                        }`}
                      />
                      {/* Right horizontal branch */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 right-0 w-1/2 h-5 transition-colors ${
                          isFilled ? 'bg-cyan-400' : 'bg-stone-700'
                        }`}
                      />
                      {/* Corner joint */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2 w-5 h-5 transition-colors ${
                          isFilled ? 'bg-cyan-400' : 'bg-stone-700'
                        }`}
                      />
                    </div>
                  )}

                  {/* T-JUNCTION CANAL */}
                  {tile.type === 'tee' && (
                    <div className="relative w-full h-full">
                      {/* Vertical full trench */}
                      <div
                        className={`absolute top-0 right-1/2 translate-x-1/2 w-5 h-full transition-colors ${
                          isFilled ? 'bg-cyan-400' : 'bg-stone-700'
                        }`}
                      />
                      {/* Right horizontal arm */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 right-0 w-1/2 h-5 transition-colors ${
                          isFilled ? 'bg-cyan-400' : 'bg-stone-700'
                        }`}
                      />
                    </div>
                  )}

                  {/* CROSS CANAL */}
                  {tile.type === 'cross' && (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div
                        className={`absolute w-full h-5 rounded-sm transition-colors ${
                          isFilled ? 'bg-cyan-400' : 'bg-stone-700'
                        }`}
                      />
                      <div
                        className={`absolute h-full w-5 rounded-sm transition-colors ${
                          isFilled ? 'bg-cyan-400' : 'bg-stone-700'
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* Flow droplet animation indicator */}
                {isFilled && !tile.isSource && !tile.isTarget && (
                  <span className="absolute w-2 h-2 rounded-full bg-white animate-ping opacity-75 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {/* Victory Level Banner */}
        {levelWon && (
          <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-sm z-20 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-stone-900 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <Sparkles className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-stone-100 font-display">
                  Peat Dome Saturated!
                </h3>
                <p className="text-stone-300 text-xs">
                  Water table raised by 45cm. Subterranean ignition prevented across {level.region}.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300">
                <span className="font-semibold text-emerald-400 text-lg font-mono">+{level.rewardLiters} Liters</span>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Real water donation funded for peatland canal blocking dams.
                </p>
              </div>

              <div className="flex gap-3">
                {currentLevelIdx < LEVELS.length - 1 ? (
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setCurrentLevelIdx((prev) => prev + 1);
                    }}
                    className="flex-1 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Next Stage →
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setCurrentLevelIdx(0);
                    }}
                    className="flex-1 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Play Again (Stage 1)
                  </button>
                )}

                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onBack();
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors cursor-pointer"
                >
                  Return to Hub
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Real World Impact Note */}
      <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 text-xs text-stone-400 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-stone-200">The Science of Sekat Kanal (Canal Blocking):</span>
          <p className="leading-relaxed">
            In Indonesia, over 1.4 million hectares of degraded peatland have been revitalized through community-built wooden dams. Keeping peat soil saturated retains moisture throughout the dry El Niño season, cutting fire risk by over 80%.
          </p>
        </div>
      </div>

    </div>
  );
};
