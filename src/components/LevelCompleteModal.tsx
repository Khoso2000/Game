/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Star, ArrowRight, RotateCcw, Grid, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LevelCompleteModalProps {
  levelNumber: number;
  score: number;
  stars: number; // 1, 2, or 3
  onNextLevel: () => void;
  onRetry: () => void;
  onLevelSelect: () => void;
  onOpenLeaderboard?: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelNumber,
  score,
  stars,
  onNextLevel,
  onRetry,
  onLevelSelect,
  onOpenLeaderboard,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#14B8A6', '#F59E0B', '#8B5CF6', '#F43F5E'],
      });
    } catch {
      // Ignore confetti error
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center flex flex-col items-center">
        {/* Animated Stars Row */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= stars;
            return (
              <div
                key={starIdx}
                className={`transition-all duration-300 ${
                  isEarned ? 'scale-110 drop-shadow-[0_2px_10px_rgba(245,158,11,0.6)]' : 'opacity-30'
                }`}
              >
                <Star
                  className={`w-10 h-10 ${
                    isEarned ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                  }`}
                />
              </div>
            );
          })}
        </div>

        <h2 className="text-2xl font-black font-display text-white tracking-tight mt-2">Level Complete!</h2>
        <p className="text-xs text-slate-400 mt-0.5">Level {levelNumber} Cleared Successfully</p>

        {/* Score & Reward Card */}
        <div className="w-full mt-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/60 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-400">Score Earned</span>
            <span className="text-lg font-bold font-mono text-teal-400 tabular-nums">
              {score.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-medium border-t border-slate-800/80 pt-2">
            <span className="text-slate-400">Stars Earned</span>
            <span className="text-sm font-bold text-amber-400">{stars} / 3 Stars</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 mt-5">
          <button
            onClick={onNextLevel}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 active:scale-[0.98] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-transform"
          >
            <span>Next Level</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          {onOpenLeaderboard && (
            <button
              onClick={onOpenLeaderboard}
              className="w-full h-10 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-amber-500/40 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Post to Global Leaderboard</span>
            </button>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onRetry}
              className="h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-700/60 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <button
              onClick={onLevelSelect}
              className="h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-700/60 transition-colors"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Level Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
