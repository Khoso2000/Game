/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PieceShape } from '../types/game';

export const PIECE_CATALOG: PieceShape[] = [
  // 1x1 Dot
  {
    id: 'dot_1x1',
    name: 'Single',
    matrix: [[1]],
    color: 'amber',
    rarity: 6,
  },
  // 1x2 and 2x1 Dominos
  {
    id: 'line_1x2',
    name: 'Horizontal 2',
    matrix: [[1, 1]],
    color: 'teal',
    rarity: 8,
  },
  {
    id: 'line_2x1',
    name: 'Vertical 2',
    matrix: [[1], [1]],
    color: 'teal',
    rarity: 8,
  },
  // 1x3 and 3x1 Triominos
  {
    id: 'line_1x3',
    name: 'Horizontal 3',
    matrix: [[1, 1, 1]],
    color: 'coral',
    rarity: 8,
  },
  {
    id: 'line_3x1',
    name: 'Vertical 3',
    matrix: [[1], [1], [1]],
    color: 'coral',
    rarity: 8,
  },
  // 1x4 and 4x1 Tetraminos
  {
    id: 'line_1x4',
    name: 'Horizontal 4',
    matrix: [[1, 1, 1, 1]],
    color: 'violet',
    rarity: 6,
  },
  {
    id: 'line_4x1',
    name: 'Vertical 4',
    matrix: [[1], [1], [1], [1]],
    color: 'violet',
    rarity: 6,
  },
  // 1x5 and 5x1 Lines
  {
    id: 'line_1x5',
    name: 'Horizontal 5',
    matrix: [[1, 1, 1, 1, 1]],
    color: 'emerald',
    rarity: 4,
  },
  {
    id: 'line_5x1',
    name: 'Vertical 5',
    matrix: [[1], [1], [1], [1], [1]],
    color: 'emerald',
    rarity: 4,
  },
  // 2x2 Square
  {
    id: 'square_2x2',
    name: 'Square 2x2',
    matrix: [
      [1, 1],
      [1, 1],
    ],
    color: 'amber',
    rarity: 7,
  },
  // 3x3 Big Square
  {
    id: 'square_3x3',
    name: 'Block 3x3',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    color: 'rose',
    rarity: 2,
  },
  // Small 2x2 Corners (3 cells)
  {
    id: 'corner_2x2_tl',
    name: 'Corner TL',
    matrix: [
      [1, 1],
      [1, 0],
    ],
    color: 'teal',
    rarity: 7,
  },
  {
    id: 'corner_2x2_tr',
    name: 'Corner TR',
    matrix: [
      [1, 1],
      [0, 1],
    ],
    color: 'teal',
    rarity: 7,
  },
  {
    id: 'corner_2x2_bl',
    name: 'Corner BL',
    matrix: [
      [1, 0],
      [1, 1],
    ],
    color: 'teal',
    rarity: 7,
  },
  {
    id: 'corner_2x2_br',
    name: 'Corner BR',
    matrix: [
      [0, 1],
      [1, 1],
    ],
    color: 'teal',
    rarity: 7,
  },
  // Big 3x3 Corners (5 cells)
  {
    id: 'corner_3x3_tl',
    name: 'Big Corner TL',
    matrix: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
    color: 'violet',
    rarity: 4,
  },
  {
    id: 'corner_3x3_tr',
    name: 'Big Corner TR',
    matrix: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1],
    ],
    color: 'violet',
    rarity: 4,
  },
  {
    id: 'corner_3x3_bl',
    name: 'Big Corner BL',
    matrix: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: 'violet',
    rarity: 4,
  },
  {
    id: 'corner_3x3_br',
    name: 'Big Corner BR',
    matrix: [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: 'violet',
    rarity: 4,
  },
  // T-Shapes (4 cells)
  {
    id: 't_shape_up',
    name: 'T Up',
    matrix: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: 'indigo',
    rarity: 5,
  },
  {
    id: 't_shape_down',
    name: 'T Down',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: 'indigo',
    rarity: 5,
  },
  {
    id: 't_shape_left',
    name: 'T Left',
    matrix: [
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    color: 'indigo',
    rarity: 5,
  },
  {
    id: 't_shape_right',
    name: 'T Right',
    matrix: [
      [0, 1],
      [1, 1],
      [0, 1],
    ],
    color: 'indigo',
    rarity: 5,
  },
  // Z and S Shapes
  {
    id: 'z_shape',
    name: 'Z Shape',
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: 'coral',
    rarity: 5,
  },
  {
    id: 's_shape',
    name: 'S Shape',
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: 'coral',
    rarity: 5,
  },
];

/**
 * Weighted random piece generation
 */
export function generateRandomPiece(excludeIds?: string[]): PieceShape {
  const candidates = PIECE_CATALOG.filter((p) => !excludeIds?.includes(p.id));
  const pool = candidates.length > 0 ? candidates : PIECE_CATALOG;

  const totalWeight = pool.reduce((acc, p) => acc + (p.rarity || 5), 0);
  let randomVal = Math.random() * totalWeight;

  for (const piece of pool) {
    const weight = piece.rarity || 5;
    if (randomVal < weight) {
      return piece;
    }
    randomVal -= weight;
  }
  return pool[0];
}

/**
 * Generate 3 pieces with balanced variety (never 3 identical large pieces)
 */
export function generatePieceSet(): [PieceShape, PieceShape, PieceShape] {
  const p1 = generateRandomPiece();
  const p2 = generateRandomPiece([p1.id]);
  const p3 = generateRandomPiece([p1.id, p2.id]);
  return [p1, p2, p3];
}
