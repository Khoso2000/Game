/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Vibrate } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onHome,
  soundEnabled,
  hapticsEnabled,
  onToggleSound,
  onToggleHaptics,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xs rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center flex flex-col items-center">
        <h2 className="text-2xl font-black font-display text-white tracking-tight mb-1">Game Paused</h2>
        <p className="text-xs text-slate-400 mb-5">Take a breather, blocks aren't going anywhere.</p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 active:scale-[0.98] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-transform"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Resume Game</span>
          </button>
          <button
            onClick={onRestart}
            className="w-full h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700/60 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Round</span>
          </button>
          <button
            onClick={onHome}
            className="w-full h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700/60 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Choose Mode</span>
          </button>
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-slate-800/80 w-full text-slate-400">
          <button
            onClick={onToggleSound}
            className={`flex items-center gap-1.5 text-xs ${soundEnabled ? 'text-teal-400' : 'text-slate-500'}`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Sound</span>
          </button>
          <span>·</span>
          <button
            onClick={onToggleHaptics}
            className={`flex items-center gap-1.5 text-xs ${hapticsEnabled ? 'text-amber-400' : 'text-slate-500'}`}
          >
            <Vibrate className="w-4 h-4" />
            <span>Haptics</span>
          </button>
        </div>
      </div>
    </div>
  );
};
