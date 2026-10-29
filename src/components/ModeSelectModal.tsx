/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Trophy, Map, Calendar, Clock, Sparkles, Code, BarChart2, Settings } from 'lucide-react';
import { GameMode } from '../types/game';

interface ModeSelectModalProps {
  currentMode: GameMode;
  adventureLevel: number;
  dailyStreak: number;
  onSelectMode: (mode: GameMode) => void;
  onOpenLevels: () => void;
  onOpenDaily: () => void;
  onOpenLeaderboard: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onOpenAndroidExport: () => void;
  onClose: () => void;
}

export const ModeSelectModal: React.FC<ModeSelectModalProps> = ({
  currentMode,
  adventureLevel,
  dailyStreak,
  onSelectMode,
  onOpenLevels,
  onOpenDaily,
  onOpenLeaderboard,
  onOpenStats,
  onOpenSettings,
  onOpenAndroidExport,
  onClose,
}) => {
  const modes: {
    id: GameMode;
    title: string;
    description: string;
    icon: React.ReactNode;
    badge?: string;
    action?: () => void;
  }[] = [
    {
      id: 'classic',
      title: 'Classic Mode',
      description: 'Endless 8x8 block puzzle. Pure score chasing.',
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'adventure',
      title: 'Level Adventure',
      description: '100 progressive levels with objectives & stars.',
      icon: <Map className="w-5 h-5 text-teal-400" />,
      badge: `Lvl ${adventureLevel}`,
      action: onOpenLevels,
    },
    {
      id: 'daily',
      title: 'Daily Challenge',
      description: 'Unique daily mission. Build your daily streak.',
      icon: <Calendar className="w-5 h-5 text-rose-400" />,
      badge: `${dailyStreak}d Streak`,
      action: onOpenDaily,
    },
    {
      id: 'time_challenge',
      title: 'Time Attack',
      description: '2-minute countdown. Gain bonus time by clearing lines.',
      icon: <Clock className="w-5 h-5 text-cyan-400" />,
      badge: 'Fast-paced',
    },
    {
      id: 'practice',
      title: 'Practice Mode',
      description: 'Relaxed zen mode with unlimited undos and no game over.',
      icon: <Sparkles className="w-5 h-5 text-violet-400" />,
      badge: 'Zen',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/block_quest_icon_1793294085350.jpg"
              alt="Block Quest Icon"
              className="w-10 h-10 rounded-xl shadow-md border border-slate-700/60 object-cover"
            />
            <div>
              <h2 className="text-xl font-black font-display text-white tracking-tight">Block Quest</h2>
              <div className="text-[11px] text-slate-400">Android Puzzle Edition</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode List */}
        <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-2.5">
          {modes.map((m) => {
            const isSelected = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  if (m.action) {
                    m.action();
                  } else {
                    onSelectMode(m.id);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl text-left flex items-start gap-3 transition-all ${
                  isSelected
                    ? 'bg-teal-500/15 border-2 border-teal-400 text-white shadow-lg shadow-teal-500/10'
                    : 'bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 text-slate-200 active:scale-[0.99]'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-display text-sm text-white">{m.title}</span>
                    {m.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-slate-700">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">{m.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Utility Grid */}
        <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-slate-800 shrink-0">
          <button
            onClick={() => {
              onOpenLeaderboard();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-amber-300 text-xs font-semibold flex flex-col items-center justify-center gap-1 border border-slate-700/60 transition-colors"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] truncate">Leaderboard</span>
          </button>
          <button
            onClick={() => {
              onOpenStats();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex flex-col items-center justify-center gap-1 border border-slate-700/60 transition-colors"
          >
            <BarChart2 className="w-4 h-4 text-teal-400" />
            <span className="text-[10px] truncate">Records</span>
          </button>
          <button
            onClick={() => {
              onOpenAndroidExport();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-teal-300 text-xs font-semibold flex flex-col items-center justify-center gap-1 border border-slate-700/60 transition-colors"
          >
            <Code className="w-4 h-4 text-teal-400" />
            <span className="text-[10px] truncate">Android Export</span>
          </button>
          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex flex-col items-center justify-center gap-1 border border-slate-700/60 transition-colors"
          >
            <Settings className="w-4 h-4 text-violet-400" />
            <span className="text-[10px] truncate">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
