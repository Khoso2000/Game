/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { X, Lock, Star, Trophy, Sparkles } from 'lucide-react';
import { ALL_LEVELS } from '../engine/levels';

interface LevelSelectModalProps {
  currentLevel: number;
  highestUnlockedLevel: number;
  starsEarned: Record<number, number>;
  onSelectLevel: (levelNumber: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  currentLevel,
  highestUnlockedLevel,
  starsEarned,
  onSelectLevel,
  onClose,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to current level
  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector(`[data-level="${currentLevel}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [currentLevel]);

  const totalStars = Object.values(starsEarned).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md h-[88vh] rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-black font-display text-white tracking-tight">Adventure Levels</h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-0.5 text-amber-400 font-semibold font-mono">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {totalStars} / 300 Stars
                </span>
                <span>·</span>
                <span>Level {highestUnlockedLevel}/100 Unlocked</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 100 Levels Scrollable Grid */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 px-1">
          <div className="grid grid-cols-5 gap-2.5">
            {ALL_LEVELS.map((lvl) => {
              const num = lvl.levelNumber;
              const isUnlocked = num <= highestUnlockedLevel;
              const isCurrent = num === currentLevel;
              const stars = starsEarned[num] || 0;
              const isBoss = num % 10 === 0;

              return (
                <button
                  key={num}
                  data-level={num}
                  disabled={!isUnlocked}
                  onClick={() => {
                    onSelectLevel(num);
                    onClose();
                  }}
                  className={`h-16 rounded-xl flex flex-col items-center justify-center relative transition-all duration-150 ${
                    !isUnlocked
                      ? 'bg-slate-950/40 border border-slate-800/40 text-slate-600 cursor-not-allowed'
                      : isCurrent
                      ? 'bg-teal-500/20 border-2 border-teal-400 text-teal-300 shadow-md shadow-teal-500/20'
                      : isBoss
                      ? 'bg-violet-950/40 border border-violet-500/50 text-violet-200 hover:bg-violet-900/40'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 active:scale-95'
                  }`}
                >
                  {isBoss && isUnlocked && (
                    <span className="absolute -top-1.5 -right-1 text-[8px] bg-violet-500 text-white font-bold px-1 rounded-sm">
                      TIER
                    </span>
                  )}

                  {!isUnlocked ? (
                    <Lock className="w-4 h-4 text-slate-600" />
                  ) : (
                    <>
                      <span className="text-sm font-bold font-display">{num}</span>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-2.5 h-2.5 ${
                              s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
