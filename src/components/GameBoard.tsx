/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BlockColor, Cell, Grid, PieceShape } from '../types/game';
import { BOARD_SIZE, canPlacePiece } from '../engine/gameEngine';
import { Diamond } from 'lucide-react';

interface GameBoardProps {
  grid: Grid;
  hoverPiece: PieceShape | null;
  hoverPos: { r: number; c: number } | null;
  selectedPiece: PieceShape | null;
  hintCells?: { r: number; c: number }[] | null;
  isInvalidAttempt: boolean;
  onCellClick: (r: number, c: number) => void;
  onPointerMoveOnBoard?: (e: React.PointerEvent) => void;
  onPointerUpOnBoard?: (e: React.PointerEvent) => void;
}

export const COLOR_CLASSES: Record<BlockColor, { bg: string; border: string; glow: string }> = {
  teal: {
    bg: 'bg-gradient-to-b from-teal-400 to-teal-600',
    border: 'border-t-teal-200 border-b-teal-800 border-x-teal-500',
    glow: 'shadow-[0_2px_8px_rgba(20,184,166,0.35)]',
  },
  coral: {
    bg: 'bg-gradient-to-b from-rose-400 to-rose-600',
    border: 'border-t-rose-200 border-b-rose-800 border-x-rose-500',
    glow: 'shadow-[0_2px_8px_rgba(244,63,94,0.35)]',
  },
  amber: {
    bg: 'bg-gradient-to-b from-amber-400 to-amber-600',
    border: 'border-t-amber-200 border-b-amber-800 border-x-amber-500',
    glow: 'shadow-[0_2px_8px_rgba(245,158,11,0.35)]',
  },
  violet: {
    bg: 'bg-gradient-to-b from-violet-400 to-violet-600',
    border: 'border-t-violet-200 border-b-violet-800 border-x-violet-500',
    glow: 'shadow-[0_2px_8px_rgba(139,92,246,0.35)]',
  },
  emerald: {
    bg: 'bg-gradient-to-b from-emerald-400 to-emerald-600',
    border: 'border-t-emerald-200 border-b-emerald-800 border-x-emerald-500',
    glow: 'shadow-[0_2px_8px_rgba(16,185,129,0.35)]',
  },
  cyan: {
    bg: 'bg-gradient-to-b from-cyan-400 to-cyan-600',
    border: 'border-t-cyan-200 border-b-cyan-800 border-x-cyan-500',
    glow: 'shadow-[0_2px_8px_rgba(6,182,212,0.35)]',
  },
  rose: {
    bg: 'bg-gradient-to-b from-pink-400 to-rose-600',
    border: 'border-t-pink-200 border-b-pink-800 border-x-pink-500',
    glow: 'shadow-[0_2px_8px_rgba(236,72,153,0.35)]',
  },
  indigo: {
    bg: 'bg-gradient-to-b from-indigo-400 to-indigo-600',
    border: 'border-t-indigo-200 border-b-indigo-800 border-x-indigo-500',
    glow: 'shadow-[0_2px_8px_rgba(99,102,241,0.35)]',
  },
};

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  hoverPiece,
  hoverPos,
  selectedPiece,
  hintCells,
  isInvalidAttempt,
  onCellClick,
}) => {
  // Compute preview map for hover piece
  const activePiece = hoverPiece || selectedPiece;
  const previewCells = new Map<string, { valid: boolean; color: BlockColor }>();

  if (activePiece && hoverPos) {
    const isValid = canPlacePiece(grid, activePiece, hoverPos.r, hoverPos.c);
    for (let r = 0; r < activePiece.matrix.length; r++) {
      for (let c = 0; c < activePiece.matrix[0].length; c++) {
        if (activePiece.matrix[r][c] === 1) {
          const boardR = hoverPos.r + r;
          const boardC = hoverPos.c + c;
          if (boardR >= 0 && boardR < BOARD_SIZE && boardC >= 0 && boardC < BOARD_SIZE) {
            previewCells.set(`${boardR},${boardC}`, {
              valid: isValid,
              color: activePiece.color,
            });
          }
        }
      }
    }
  }

  const hintKeys = new Set(hintCells?.map((pos) => `${pos.r},${pos.c}`) || []);

  return (
    <div
      id="game-board-container"
      className={`relative w-full aspect-square max-w-[380px] mx-auto p-2 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-2xl shadow-black/60 game-touch-surface select-none ${
        isInvalidAttempt ? 'animate-invalid-shake ring-2 ring-rose-500/50' : ''
      }`}
    >
      {/* 8x8 Grid */}
      <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-1 p-1 bg-slate-950/70 rounded-xl border border-slate-800/50">
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const cellKey = `${r},${c}`;
            const preview = previewCells.get(cellKey);
            const isHint = hintKeys.has(cellKey);
            const isFilled = cell.filled;
            const colorClass = cell.color ? COLOR_CLASSES[cell.color] : null;

            return (
              <div
                key={cellKey}
                data-row={r}
                data-col={c}
                onClick={() => onCellClick(r, c)}
                className={`relative rounded-lg transition-all duration-100 flex items-center justify-center cursor-pointer ${
                  isFilled
                    ? `${colorClass?.bg} ${colorClass?.border} ${colorClass?.glow} border-[1.5px] animate-block-pop`
                    : preview
                    ? preview.valid
                      ? 'bg-teal-400/40 border border-teal-300 ring-2 ring-teal-400/60 shadow-lg'
                      : 'bg-rose-500/30 border border-rose-400 ring-1 ring-rose-400'
                    : isHint
                    ? 'bg-amber-500/20 border border-amber-400/60 ring-2 ring-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.35)] animate-pulse'
                    : 'bg-slate-900/80 border border-slate-800/60 hover:bg-slate-800/70 shadow-inner'
                } ${cell.isClearing ? 'animate-clear-flash' : ''}`}
              >
                {/* 3D Cell Highlight Shine */}
                {isFilled && (
                  <div className="absolute inset-x-1 top-0.5 h-[30%] bg-white/25 rounded-t-sm pointer-events-none" />
                )}

                {/* Adventure Target Jewel Icon */}
                {cell.isJewel && (
                  <div className="relative z-10 flex items-center justify-center animate-pulse">
                    <Diamond className="w-3.5 h-3.5 text-amber-200 fill-amber-300 drop-shadow-[0_1px_4px_rgba(251,191,36,0.8)]" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
