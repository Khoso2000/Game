/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Calendar, Flame, CheckCircle2, Play, Trophy } from 'lucide-react';

interface DailyChallengeModalProps {
  todayKey: string;
  isCompletedToday: boolean;
  currentStreak: number;
  bestStreak: number;
  onPlayDaily: () => void;
  onOpenLeaderboard?: () => void;
  onClose: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  todayKey,
  isCompletedToday,
  currentStreak,
  bestStreak,
  onPlayDaily,
  onOpenLeaderboard,
  onClose,
}) => {
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-black font-display text-white">Daily Challenge</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Date & Streak Hero */}
        <div className="mt-4 flex flex-col items-center">
          <span className="text-xs text-teal-400 font-semibold tracking-wider uppercase">{formattedDate}</span>
          <h3 className="text-xl font-bold font-display text-white mt-1">Master of the Day</h3>

          {/* Streak Pills */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{currentStreak} Day Streak</span>
            </div>
            <div className="text-xs text-slate-400">Best: {bestStreak} Days</div>
          </div>
        </div>

        {/* Challenge Mission Details */}
        <div className="w-full mt-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-left flex flex-col gap-2.5">
          <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">Today's Mission</span>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium">1. Target Score</span>
            <span className="text-xs font-mono font-bold text-teal-400">1,200 pts</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-800/60 pt-2">
            <span className="text-xs text-slate-300 font-medium">2. Consecutive Combos</span>
            <span className="text-xs font-mono font-bold text-amber-400">2x Combo</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-800/60 pt-2">
            <span className="text-xs text-slate-300 font-medium">Status</span>
            {isCompletedToday ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed
              </span>
            ) : (
              <span className="text-xs text-amber-400 font-medium">Pending Today</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 mt-5">
          <button
            onClick={() => {
              onPlayDaily();
              onClose();
            }}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 active:scale-[0.98] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-transform"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{isCompletedToday ? 'Play Daily Again' : 'Start Daily Quest'}</span>
          </button>

          {onOpenLeaderboard && (
            <button
              onClick={() => {
                onOpenLeaderboard();
                onClose();
              }}
              className="w-full h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700/60 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>View Global Leaderboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
