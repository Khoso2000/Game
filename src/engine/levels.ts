/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LevelDefinition, LevelObjective } from '../types/game';

/**
 * Procedural + curated 100-level database with smooth difficulty scaling
 */
export function generateLevels(): LevelDefinition[] {
  const levels: LevelDefinition[] = [];

  for (let i = 1; i <= 100; i++) {
    const isBoss = i % 10 === 0;
    const tier = Math.ceil(i / 10); // 1 to 10

    // Objectives vary based on level
    const objectives: LevelObjective[] = [];

    // Target score scales progressively
    const baseTargetScore = 300 + i * 45 + (isBoss ? 400 : 0);
    objectives.push({
      type: 'score',
      target: baseTargetScore,
      current: 0,
      description: `Reach ${baseTargetScore} Points`,
    });

    // Secondary objectives
    if (i % 3 === 0) {
      const lineTarget = 3 + Math.floor(tier * 1.2);
      objectives.push({
        type: 'lines',
        target: lineTarget,
        current: 0,
        description: `Clear ${lineTarget} Lines`,
      });
    } else if (i % 4 === 0) {
      const comboTarget = tier > 4 ? 3 : 2;
      objectives.push({
        type: 'combo',
        target: comboTarget,
        current: 0,
        description: `Achieve a ${comboTarget}x Combo`,
      });
    }

    // Jewel targets on specific levels
    const initialGrid: { r: number; c: number; color?: 'teal' | 'coral' | 'amber' | 'violet'; isJewel?: boolean }[] = [];
    if (i % 2 === 0 || isBoss) {
      const jewelCount = Math.min(2 + Math.floor(tier * 0.8), 8);
      objectives.push({
        type: 'jewels',
        target: jewelCount,
        current: 0,
        description: `Shatter ${jewelCount} Crystal Blocks`,
      });

      // Scatter jewels deterministically based on level seed
      for (let j = 0; j < jewelCount; j++) {
        const r = (i * 3 + j * 2 + 1) % 6 + 1;
        const c = (i * 5 + j * 3 + 2) % 6 + 1;
        // Avoid duplicate cells
        if (!initialGrid.some((cell) => cell.r === r && cell.c === c)) {
          initialGrid.push({
            r,
            c,
            color: j % 2 === 0 ? 'amber' : 'violet',
            isJewel: true,
          });
        }
      }
    }

    // Move limits for strategic levels
    let maxMoves: number | undefined = undefined;
    if (i > 5 && (i % 2 === 1 || isBoss)) {
      maxMoves = Math.max(16, 32 - Math.floor(tier * 1.5));
    }

    // 3-star score thresholds
    const star1 = baseTargetScore;
    const star2 = Math.round(baseTargetScore * 1.35);
    const star3 = Math.round(baseTargetScore * 1.75);

    levels.push({
      levelNumber: i,
      targetScore: baseTargetScore,
      objectives,
      initialGrid: initialGrid.length > 0 ? initialGrid : undefined,
      maxMoves,
      starThresholds: [star1, star2, star3],
    });
  }

  return levels;
}

export const ALL_LEVELS: LevelDefinition[] = generateLevels();

export function getLevelDefinition(levelNumber: number): LevelDefinition {
  const index = Math.max(1, Math.min(levelNumber, ALL_LEVELS.length)) - 1;
  return ALL_LEVELS[index];
}
