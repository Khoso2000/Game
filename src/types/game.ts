/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameMode = 'classic' | 'adventure' | 'daily' | 'time_challenge' | 'practice';

export type BlockColor = 'teal' | 'coral' | 'amber' | 'violet' | 'emerald' | 'cyan' | 'rose' | 'indigo';

export interface Cell {
  filled: boolean;
  color?: BlockColor;
  isClearing?: boolean;
  isJewel?: boolean; // For adventure levels: break target jewel blocks
  clearingAnimKey?: number;
}

export type Grid = Cell[][]; // 8x8

export interface PieceShape {
  id: string;
  name: string;
  matrix: number[][]; // 1 for filled, 0 for empty
  color: BlockColor;
  rarity?: number;
}

export interface PlacedPiece {
  shape: PieceShape;
  row: number;
  col: number;
}

export interface MoveRecord {
  grid: Grid;
  score: number;
  combo: number;
  pieces: (PieceShape | null)[];
  objectivesProgress?: Record<string, number>;
  movesUsed?: number;
}

export interface LevelObjective {
  type: 'score' | 'lines' | 'rows' | 'cols' | 'jewels' | 'combo';
  target: number;
  current: number;
  description: string;
}

export interface LevelDefinition {
  levelNumber: number;
  targetScore: number;
  objectives: LevelObjective[];
  initialGrid?: { r: number; c: number; color?: BlockColor; isJewel?: boolean }[];
  maxMoves?: number;
  starThresholds: [number, number, number]; // 1, 2, 3 stars scores
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  linesCleared: number;
  maxCombo: number;
  dateKey: string;
  userId: string;
  createdAt?: string;
}

export interface UserStats {
  gamesPlayed: number;
  highScoreClassic: number;
  totalLinesCleared: number;
  maxCombo: number;
  adventureLevelReached: number;
  starsEarned: Record<number, number>; // levelNumber -> stars (1-3)
  dailyCompletedDates: string[]; // YYYY-MM-DD
  dailyCurrentStreak: number;
  dailyBestStreak: number;
  timeChallengeHighScore: number;
  hintsAvailable: number; // limited hint power-up inventory
  hintsUsedTotal: number; // total hint power-ups used
  playerName: string; // custom display name for global leaderboard
}

export interface GameSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  touchAssistOffset: boolean; // offset piece above finger when dragging
  androidFrameBezel: boolean; // view inside Google Pixel frame or borderless
  autoHintAfterInactivity: boolean; // show subtle glow after 10s inactivity
}
