/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PieceShape } from '../types/game';
import {
  BOARD_SIZE,
  canPlacePiece,
  createEmptyGrid,
  executePiecePlacement,
  hasValidMovesRemaining,
} from './gameEngine';

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

export function runDeterministicTests(): TestResult[] {
  const results: TestResult[] = [];

  // Test 1: Move Validation - in bounds on empty board
  {
    const grid = createEmptyGrid();
    const piece2x2: PieceShape = {
      id: 'test_2x2',
      name: '2x2',
      matrix: [
        [1, 1],
        [1, 1],
      ],
      color: 'amber',
    };

    const validPlace = canPlacePiece(grid, piece2x2, 0, 0);
    const validCenter = canPlacePiece(grid, piece2x2, 3, 3);
    const outOfBoundsRow = canPlacePiece(grid, piece2x2, 7, 0); // 7 + 2 > 8
    const outOfBoundsCol = canPlacePiece(grid, piece2x2, 0, 7); // 7 + 2 > 8

    results.push({
      name: 'Move Validation: Bounds Check',
      passed: validPlace && validCenter && !outOfBoundsRow && !outOfBoundsCol,
      message: 'Pieces correctly rejected when overflowing 8x8 boundaries',
    });
  }

  // Test 2: Move Validation - collision check
  {
    const grid = createEmptyGrid();
    grid[1][1] = { filled: true, color: 'teal' };

    const piece2x2: PieceShape = {
      id: 'test_2x2',
      name: '2x2',
      matrix: [
        [1, 1],
        [1, 1],
      ],
      color: 'amber',
    };

    const collision = canPlacePiece(grid, piece2x2, 0, 0); // overlaps cell (1, 1)
    const noCollision = canPlacePiece(grid, piece2x2, 2, 2);

    results.push({
      name: 'Move Validation: Cell Collision',
      passed: !collision && noCollision,
      message: 'Prevents overlapping occupied grid cells',
    });
  }

  // Test 3: Horizontal Line Clearing
  {
    const grid = createEmptyGrid();
    // Fill 7 of 8 cells in row 0
    for (let c = 0; c < 7; c++) {
      grid[0][c] = { filled: true, color: 'coral' };
    }

    const singleDot: PieceShape = {
      id: 'dot',
      name: 'Single',
      matrix: [[1]],
      color: 'teal',
    };

    const result = executePiecePlacement(grid, singleDot, 0, 7, 0);

    const rowCleared = !result.newGrid[0].some((c) => c.filled);
    const expectedPoints = 10 + 100 * 1; // 10 placement + 100 line * 1 combo

    results.push({
      name: 'Single Row Line Clear & Scoring',
      passed: result.linesCleared === 1 && rowCleared && result.pointsEarned === expectedPoints,
      message: `Row cleared: ${rowCleared}, Points: ${result.pointsEarned} (expected ${expectedPoints})`,
    });
  }

  // Test 4: Simultaneous Row and Column Clear (Cross Clear)
  {
    const grid = createEmptyGrid();
    // Fill row 3 except col 3
    for (let c = 0; c < 8; c++) {
      if (c !== 3) grid[3][c] = { filled: true, color: 'teal' };
    }
    // Fill col 3 except row 3
    for (let r = 0; r < 8; r++) {
      if (r !== 3) grid[r][3] = { filled: true, color: 'violet' };
    }

    const singleDot: PieceShape = {
      id: 'dot',
      name: 'Single',
      matrix: [[1]],
      color: 'amber',
    };

    // Place dot at (3, 3) to trigger simultaneous horizontal + vertical clear
    const result = executePiecePlacement(grid, singleDot, 3, 3, 0);

    const bothCleared =
      result.linesCleared === 2 &&
      result.clearedRows.includes(3) &&
      result.clearedCols.includes(3) &&
      !result.newGrid[3][3].filled;

    results.push({
      name: 'Simultaneous Row & Column Clearing',
      passed: bothCleared && result.pointsEarned > 300,
      message: `Cleared 2 lines simultaneously with multi-line bonus, points: ${result.pointsEarned}`,
    });
  }

  // Test 5: Combo Multiplier Progression
  {
    const grid = createEmptyGrid();
    for (let c = 0; c < 7; c++) grid[0][c] = { filled: true, color: 'coral' };

    const singleDot: PieceShape = {
      id: 'dot',
      name: 'Single',
      matrix: [[1]],
      color: 'teal',
    };

    // If current combo was 2, new combo should be 3 and award 3x line score
    const result = executePiecePlacement(grid, singleDot, 0, 7, 2);

    results.push({
      name: 'Combo Multiplier Scaling',
      passed: result.newCombo === 3 && result.pointsEarned === 10 + 100 * 3,
      message: `Combo scaled to 3x, Points: ${result.pointsEarned}`,
    });
  }

  // Test 6: Game Over Detection (No Moves Possible)
  {
    // Fill entire grid completely
    const fullGrid = createEmptyGrid();
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        fullGrid[r][c] = { filled: true, color: 'rose' };
      }
    }

    const piece2x2: PieceShape = {
      id: 'test_2x2',
      name: '2x2',
      matrix: [
        [1, 1],
        [1, 1],
      ],
      color: 'amber',
    };

    const hasMoves = hasValidMovesRemaining(fullGrid, [piece2x2]);

    results.push({
      name: 'Game Over Detection',
      passed: !hasMoves,
      message: 'Accurately detects when remaining piece cannot fit anywhere',
    });
  }

  return results;
}
