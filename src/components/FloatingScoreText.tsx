/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface ScorePopup {
  id: number;
  text: string;
  subText?: string;
  isCombo?: boolean;
}

interface FloatingScoreTextProps {
  popups: ScorePopup[];
}

export const FloatingScoreText: React.FC<FloatingScoreTextProps> = ({ popups }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30 flex items-center justify-center">
      {popups.map((p) => (
        <div
          key={p.id}
          className="absolute left-1/2 top-1/2 flex flex-col items-center animate-combo-float"
        >
          <span
            className={`font-black font-display tracking-tight text-xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] ${
              p.isCombo
                ? 'text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                : 'text-teal-300'
            }`}
          >
            {p.text}
          </span>
          {p.subText && (
            <span className="text-xs font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-700/60 mt-0.5">
              {p.subText}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
