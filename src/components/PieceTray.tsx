/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BlockColor, PieceShape } from '../types/game';
import { COLOR_CLASSES } from './GameBoard';

interface PieceTrayProps {
  pieces: (PieceShape | null)[];
  selectedPieceIndex: number | null;
  draggedPieceIndex: number | null;
  pieceCanFit: boolean[];
  onSelectPiece: (index: number) => void;
  onPointerDownPiece: (e: React.PointerEvent, index: number) => void;
}

export const PieceTray: React.FC<PieceTrayProps> = ({
  pieces,
  selectedPieceIndex,
  draggedPieceIndex,
  pieceCanFit,
  onSelectPiece,
  onPointerDownPiece,
}) => {
  return (
    <div className="w-full max-w-[400px] mx-auto h-32 px-2 flex items-center justify-around gap-2 select-none">
      {pieces.map((piece, idx) => {
        if (!piece) {
          // Empty exhausted slot
          return (
            <div
              key={`empty-${idx}`}
              className="flex-1 h-28 rounded-2xl border border-dashed border-slate-800/60 bg-slate-900/30 flex items-center justify-center"
            >
              <div className="w-2 h-2 rounded-full bg-slate-800" />
            </div>
          );
        }

        const isSelected = selectedPieceIndex === idx;
        const isBeingDragged = draggedPieceIndex === idx;
        const canFit = pieceCanFit[idx] ?? true;

        return (
          <div
            key={piece.id + '-' + idx}
            onPointerDown={(e) => {
              onPointerDownPiece(e, idx);
            }}
            onClick={() => onSelectPiece(idx)}
            className={`flex-1 h-28 rounded-2xl flex items-center justify-center cursor-grab active:cursor-grabbing p-1 transition-all duration-150 relative ${
              isSelected
                ? 'bg-slate-800/90 ring-2 ring-teal-400 scale-105 shadow-lg shadow-teal-500/20'
                : 'bg-slate-900/60 hover:bg-slate-800/50 border border-slate-800/80 active:scale-95'
            } ${!canFit ? 'opacity-40 grayscale-[40%]' : 'opacity-100'} ${
              isBeingDragged ? 'opacity-20' : ''
            }`}
          >
            {/* Render mini piece grid */}
            <MiniPieceGrid piece={piece} />

            {/* Subtle tap badge for accessibility */}
            {isSelected && (
              <span className="absolute -top-2 bg-teal-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                TAP BOARD
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const MiniPieceGrid: React.FC<{ piece: PieceShape; cellSize?: number }> = ({
  piece,
  cellSize = 20,
}) => {
  const matrix = piece.matrix;
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const colorClass = COLOR_CLASSES[piece.color];

  return (
    <div
      className="grid gap-[2.5px] p-1"
      style={{
        gridTemplateRows: `repeat(${numRows}, ${cellSize}px)`,
        gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`,
      }}
    >
      {matrix.map((row, r) =>
        row.map((val, c) => (
          <div
            key={`${r}-${c}`}
            style={{ width: cellSize, height: cellSize }}
            className={`rounded-[5px] transition-all ${
              val === 1
                ? `${colorClass.bg} ${colorClass.border} ${colorClass.glow} border-[1px] relative shadow-sm`
                : 'opacity-0'
            }`}
          >
            {val === 1 && (
              <div className="absolute inset-x-0.5 top-0.5 h-[35%] bg-white/30 rounded-t-[3px] pointer-events-none" />
            )}
          </div>
        ))
      )}
    </div>
  );
};
