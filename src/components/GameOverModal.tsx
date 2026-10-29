/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCcw, Home, Trophy, Sparkles } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewHigh: boolean;
  linesCleared: number;
  maxCombo: number;
  onRestart: () => void;
  onHome: () => void;
  onOpenLeaderboard?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewHigh,
  linesCleared,
  maxCombo,
  onRestart,
  onHome,
  onOpenLeaderboard,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center flex flex-col items-center">
        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-3">
          <Trophy className="w-8 h-8 text-amber-400" />
        </div>

        <h2 className="text-2xl font-black font-display text-white tracking-tight">No Moves Left!</h2>
        <p className="text-xs text-slate-400 mt-1">None of the remaining blocks could fit on the board.</p>

        {/* New High Score Callout */}
        {isNewHigh && (
          <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NEW HIGH SCORE!</span>
          </div>
        )}

        {/* Score Breakdown Card */}
        <div className="w-full mt-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/60 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs text-slate-400 font-medium">Final Score</span>
            <span className="text-2xl font-black font-display text-teal-400 tabular-nums">
              {score.toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-medium uppercase">Best</span>
              <span className="text-sm font-bold font-mono text-slate-300 tabular-nums">
                {highScore.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col border-x border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-medium uppercase">Lines</span>
              <span className="text-sm font-bold font-mono text-slate-300 tabular-nums">{linesCleared}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-medium uppercase">Max Combo</span>
              <span className="text-sm font-bold font-mono text-amber-400 tabular-nums">{maxCombo}x</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 mt-5">
          <button
            onClick={onRestart}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 active:scale-[0.98] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-transform"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
          {onOpenLeaderboard && (
            <button
              onClick={onOpenLeaderboard}
              className="w-full h-11 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 border border-amber-500/40 transition-colors"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Global Leaderboard</span>
            </button>
          )}
          <button
            onClick={onHome}
            className="w-full h-11 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 border border-slate-700/60 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Game Modes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
