/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PieceShape } from '../types/game';
import { MiniPieceGrid } from './PieceTray';

interface DragPieceOverlayProps {
  dragPiece: PieceShape | null;
  dragPos: { x: number; y: number } | null;
  touchOffset: boolean;
}

export const DragPieceOverlay: React.FC<DragPieceOverlayProps> = ({
  dragPiece,
  dragPos,
  touchOffset,
}) => {
  if (!dragPiece || !dragPos) return null;

  // Float piece ~55px above thumb if touch offset enabled
  const offsetY = touchOffset ? -65 : 0;

  return (
    <div
      className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl transition-transform duration-75"
      style={{
        left: `${dragPos.x}px`,
        top: `${dragPos.y + offsetY}px`,
      }}
    >
      <div className="scale-125 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]">
        <MiniPieceGrid piece={dragPiece} cellSize={28} />
      </div>
    </div>
  );
};
