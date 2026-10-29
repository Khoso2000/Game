/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlockColor, Cell, Grid, LevelDefinition, MoveRecord, PieceShape } from '../types/game';
import { generatePieceSet } from './pieces';

export const BOARD_SIZE = 8;

export function createEmptyGrid(): Grid {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => ({
      filled: false,
    }))
  );
}

export function createInitialGridFromLevel(level?: LevelDefinition): Grid {
  const grid = createEmptyGrid();
  if (!level || !level.initialGrid) return grid;

  for (const item of level.initialGrid) {
    if (item.r >= 0 && item.r < BOARD_SIZE && item.c >= 0 && item.c < BOARD_SIZE) {
      grid[item.r][item.c] = {
        filled: true,
        color: item.color || 'teal',
        isJewel: item.isJewel,
      };
    }
  }
  return grid;
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

/**
 * Checks if a piece can be placed on the grid at (startRow, startCol)
 */
export function canPlacePiece(grid: Grid, piece: PieceShape, startRow: number, startCol: number): boolean {
  const matrix = piece.matrix;
  const numRows = matrix.length;
  const numCols = matrix[0].length;

  // Check bounds
  if (startRow < 0 || startCol < 0 || startRow + numRows > BOARD_SIZE || startCol + numCols > BOARD_SIZE) {
    return false;
  }

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (matrix[r][c] === 1) {
        const boardR = startRow + r;
        const boardC = startCol + c;
        if (grid[boardR][boardC].filled) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Checks if ANY remaining piece can fit in ANY position on the grid
 */
export function hasValidMovesRemaining(grid: Grid, pieces: (PieceShape | null)[]): boolean {
  const activePieces = pieces.filter((p): p is PieceShape => p !== null);
  if (activePieces.length === 0) return true; // Will generate new pieces

  for (const piece of activePieces) {
    const numRows = piece.matrix.length;
    const numCols = piece.matrix[0].length;

    for (let r = 0; r <= BOARD_SIZE - numRows; r++) {
      for (let c = 0; c <= BOARD_SIZE - numCols; c++) {
        if (canPlacePiece(grid, piece, r, c)) {
          return true;
        }
      }
    }
  }

  return false;
}

export interface PlaceResult {
  newGrid: Grid;
  pointsEarned: number;
  linesCleared: number;
  clearedRows: number[];
  clearedCols: number[];
  jewelsCleared: number;
  newCombo: number;
}

/**
 * Places piece, detects completed rows & columns simultaneously, awards points & combo
 */
export function executePiecePlacement(
  grid: Grid,
  piece: PieceShape,
  startRow: number,
  startCol: number,
  currentCombo: number
): PlaceResult {
  const newGrid = cloneGrid(grid);
  const matrix = piece.matrix;
  let blockCount = 0;

  // 1. Stamp piece onto board
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[0].length; c++) {
      if (matrix[r][c] === 1) {
        newGrid[startRow + r][startCol + c] = {
          filled: true,
          color: piece.color,
        };
        blockCount++;
      }
    }
  }

  // Base points for placing the tiles
  const placementPoints = blockCount * 10;

  // 2. Identify all full rows
  const fullRows: number[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    let rowFull = true;
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (!newGrid[r][c].filled) {
        rowFull = false;
        break;
      }
    }
    if (rowFull) fullRows.push(r);
  }

  // 3. Identify all full columns
  const fullCols: number[] = [];
  for (let c = 0; c < BOARD_SIZE; c++) {
    let colFull = true;
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (!newGrid[r][c].filled) {
        colFull = false;
        break;
      }
    }
    if (colFull) fullCols.push(c);
  }

  const linesCleared = fullRows.length + fullCols.length;
  let jewelsCleared = 0;
  let pointsEarned = placementPoints;
  let newCombo = currentCombo;

  if (linesCleared > 0) {
    newCombo = currentCombo + 1;

    // Clear cells and count jewels
    const cellsToClear = new Set<string>();

    for (const r of fullRows) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        cellsToClear.add(`${r},${c}`);
      }
    }

    for (const c of fullCols) {
      for (let r = 0; r < BOARD_SIZE; r++) {
        cellsToClear.add(`${r},${c}`);
      }
    }

    cellsToClear.forEach((key) => {
      const [rStr, cStr] = key.split(',');
      const r = parseInt(rStr, 10);
      const c = parseInt(cStr, 10);
      if (newGrid[r][c].isJewel) {
        jewelsCleared++;
      }
      newGrid[r][c] = { filled: false };
    });

    // Score calculations:
    // Base 100 per line + multi-line exponential bonus + combo multiplier + jewel bonus
    const baseLinePoints = linesCleared * 100;
    const multiLineBonus = linesCleared > 1 ? linesCleared * 60 * (linesCleared - 1) : 0;
    const jewelBonus = jewelsCleared * 150;
    const lineScore = (baseLinePoints + multiLineBonus + jewelBonus) * Math.min(newCombo, 10);

    pointsEarned += lineScore;
  } else {
    newCombo = 0;
  }

  return {
    newGrid,
    pointsEarned,
    linesCleared,
    clearedRows: fullRows,
    clearedCols: fullCols,
    jewelsCleared,
    newCombo,
  };
}

/**
 * Searches for the most advantageous valid placement for a given piece on the board
 */
export function findBestPlacementForPiece(
  grid: Grid,
  piece: PieceShape
): { r: number; c: number; score: number } | null {
  let bestMove: { r: number; c: number; score: number } | null = null;
  const numRows = piece.matrix.length;
  const numCols = piece.matrix[0].length;

  for (let r = 0; r <= BOARD_SIZE - numRows; r++) {
    for (let c = 0; c <= BOARD_SIZE - numCols; c++) {
      if (canPlacePiece(grid, piece, r, c)) {
        // Evaluate simulated move
        const outcome = executePiecePlacement(grid, piece, r, c, 0);
        let evalScore = outcome.pointsEarned;

        // Line clears are top priority
        if (outcome.linesCleared > 0) {
          evalScore += 1000 * outcome.linesCleared;
        }

        // Slight preference for board edges and corners to keep space open
        if (r === 0 || r === BOARD_SIZE - numRows) evalScore += 5;
        if (c === 0 || c === BOARD_SIZE - numCols) evalScore += 5;

        if (!bestMove || evalScore > bestMove.score) {
          bestMove = { r, c, score: evalScore };
        }
      }
    }
  }

  return bestMove;
}

/**
 * Finds a valid placement hint for the selected piece or the best available piece in the tray
 */
export function findHintCandidate(
  grid: Grid,
  pieces: (PieceShape | null)[],
  selectedIdx: number | null
): { pieceIndex: number; pos: { r: number; c: number } } | null {
  // If player has a piece selected, prioritize finding a hint for that piece
  if (selectedIdx !== null && pieces[selectedIdx]) {
    const best = findBestPlacementForPiece(grid, pieces[selectedIdx]!);
    if (best) {
      return { pieceIndex: selectedIdx, pos: { r: best.r, c: best.c } };
    }
  }

  // Otherwise, find the best move among all remaining pieces
  let bestPieceIndex: number = -1;
  let bestPos: { r: number; c: number } | null = null;
  let highestScore = -Infinity;

  for (let idx = 0; idx < pieces.length; idx++) {
    const piece = pieces[idx];
    if (!piece) continue;
    const move = findBestPlacementForPiece(grid, piece);
    if (move && move.score > highestScore) {
      highestScore = move.score;
      bestPieceIndex = idx;
      bestPos = { r: move.r, c: move.c };
    }
  }

  if (bestPieceIndex !== -1 && bestPos) {
    return { pieceIndex: bestPieceIndex, pos: bestPos };
  }

  return null;
}
