export type ActiveView = 'home' | 'game-bomber' | 'game-canal' | 'game-trivia' | 'map' | 'donate';

export interface DonationStats {
  userLiters: number;
  globalLiters: number;
  totalGamesPlayed: number;
  peatHectaresProtected: number;
  brigadesHydrated: number;
  canalBlocksFunded: number;
}

export interface CommunityAction {
  id: string;
  name: string;
  location: string;
  liters: number;
  action: string;
  timestamp: string;
}

export interface HotspotRegion {
  id: string;
  name: string;
  province: string;
  island: 'Sumatra' | 'Kalimantan';
  lat: number;
  lng: number;
  activeFires: number;
  riskLevel: 'Extreme' | 'High' | 'Moderate';
  peatMoisture: number; // percentage
  waterNeededLiters: number;
  waterProvidedLiters: number;
  brigadeUnit: string;
}

export interface TriviaQuestion {
  id: number;
  questionEn: string;
  questionId: string;
  optionsEn: string[];
  optionsId: string[];
  correctIndex: number;
  explanationEn: string;
  explanationId: string;
  category: 'Ecology' | 'Peatland' | 'Firefighting' | 'Wildlife';
  waterRewardLiters: number;
}

export type CanalTileType = 'straight-h' | 'straight-v' | 'elbow-ne' | 'elbow-se' | 'elbow-sw' | 'elbow-nw' | 'tee-north' | 'tee-south' | 'tee-east' | 'tee-west' | 'cross' | 'source' | 'goal' | 'block';

export interface CanalTile {
  row: number;
  col: number;
  type: CanalTileType;
  rotation: number; // 0, 90, 180, 270 degrees
  isFixed?: boolean;
  isFilled?: boolean;
  isSource?: boolean;
  isGoal?: boolean;
  goalWaterNeeded?: number;
  currentWater?: number;
}

export interface BomberPlane {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  angle: number;
  speed: number;
  waterCapacity: number;
  currentWater: number;
  isDropping: boolean;
}

export interface FireHotspot {
  id: string;
  x: number;
  y: number;
  size: number;
  intensity: number; // 0 (extinguished) to 100 (raging)
  smokeParticles: number;
  isPeatFire: boolean;
}
