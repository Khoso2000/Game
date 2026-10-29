/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BarChart2, Trophy, Flame, Star, Award, Zap, ShieldCheck, Lightbulb } from 'lucide-react';
import { UserStats } from '../types/game';

interface StatsModalProps {
  stats: UserStats;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose }) => {
  const totalStars = Object.values(stats.starsEarned).reduce((a, b) => a + b, 0);

  const statItems = [
    {
      label: 'Classic High Score',
      value: stats.highScoreClassic.toLocaleString(),
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
      color: 'text-amber-400',
    },
    {
      label: 'Adventure Level',
      value: `Level ${stats.adventureLevelReached} / 100`,
      icon: <Award className="w-4 h-4 text-teal-400" />,
      color: 'text-teal-400',
    },
    {
      label: 'Adventure Stars',
      value: `${totalStars} / 300`,
      icon: <Star className="w-4 h-4 text-amber-400 fill-amber-400" />,
      color: 'text-amber-400',
    },
    {
      label: 'Total Lines Cleared',
      value: stats.totalLinesCleared.toLocaleString(),
      icon: <Zap className="w-4 h-4 text-violet-400" />,
      color: 'text-violet-400',
    },
    {
      label: 'Maximum Combo',
      value: `${stats.maxCombo}x Multiplier`,
      icon: <Flame className="w-4 h-4 text-rose-400" />,
      color: 'text-rose-400',
    },
    {
      label: 'Time Attack Best',
      value: stats.timeChallengeHighScore.toLocaleString(),
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      color: 'text-emerald-400',
    },
    {
      label: 'Daily Challenge Streak',
      value: `${stats.dailyCurrentStreak} Days (Best: ${stats.dailyBestStreak})`,
      icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
      color: 'text-cyan-400',
    },
    {
      label: 'Hint Power-ups Used',
      value: `${stats.hintsUsedTotal || 0} Used (${stats.hintsAvailable || 0} Available)`,
      icon: <Lightbulb className="w-4 h-4 text-amber-300" />,
      color: 'text-amber-300',
    },
    {
      label: 'Total Games Played',
      value: stats.gamesPlayed.toLocaleString(),
      icon: <BarChart2 className="w-4 h-4 text-slate-400" />,
      color: 'text-slate-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-black font-display text-white">Player Records</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-2">
          {statItems.map((item, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-xs text-slate-400 font-medium">{item.label}</span>
              </div>
              <span className={`text-sm font-bold font-mono ${item.color} tabular-nums`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
