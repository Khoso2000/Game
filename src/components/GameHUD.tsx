/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameMode, LevelObjective } from '../types/game';
import { RotateCcw, Undo2, Pause, Volume2, VolumeX, Flame, Clock, Trophy, Lightbulb } from 'lucide-react';

interface GameHUDProps {
  mode: GameMode;
  score: number;
  highScore: number;
  combo: number;
  levelNumber?: number;
  objectives?: LevelObjective[];
  movesRemaining?: number;
  timeRemaining?: number; // for time_challenge
  canUndo: boolean;
  hintsAvailable: number;
  onUseHint: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onUndo: () => void;
  onRestart: () => void;
  onPause: () => void;
  onOpenMenu: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  mode,
  score,
  highScore,
  combo,
  levelNumber,
  objectives,
  movesRemaining,
  timeRemaining,
  canUndo,
  hintsAvailable,
  onUseHint,
  soundEnabled,
  onToggleSound,
  onUndo,
  onRestart,
  onPause,
  onOpenMenu,
}) => {
  const getModeTitle = () => {
    switch (mode) {
      case 'classic':
        return 'Classic Endless';
      case 'adventure':
        return `Level ${levelNumber || 1}`;
      case 'daily':
        return 'Daily Quest';
      case 'time_challenge':
        return 'Time Attack';
      case 'practice':
        return 'Zen Practice';
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto px-4 pt-3 pb-2 flex flex-col gap-2 select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between text-xs">
        <button
          onClick={onOpenMenu}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 font-medium tracking-tight transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-teal-400" />
          <span>{getModeTitle()}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
          <button
            onClick={onRestart}
            aria-label="Restart round"
            title="Restart round"
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onPause}
            aria-label="Pause game"
            title="Pause game"
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Score & Target Cards */}
      <div className="grid grid-cols-2 gap-2 mt-1">
        {/* Current Score */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl px-3 py-2 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Score</span>
          <span className="text-2xl font-black font-display text-white tracking-tight tabular-nums">
            {score.toLocaleString()}
          </span>
        </div>

        {/* High Score or Objectives */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl px-3 py-2 flex flex-col justify-between shadow-sm relative overflow-hidden">
          {mode === 'classic' || mode === 'practice' ? (
            <>
              <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                <span>Best</span>
                <Trophy className="w-3 h-3 text-amber-400" />
              </div>
              <span className="text-2xl font-black font-display text-amber-400 tracking-tight tabular-nums">
                {highScore.toLocaleString()}
              </span>
            </>
          ) : mode === 'time_challenge' ? (
            <>
              <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                <span>Time Left</span>
                <Clock className="w-3 h-3 text-teal-400" />
              </div>
              <span
                className={`text-2xl font-black font-mono tracking-tight tabular-nums ${
                  (timeRemaining || 0) < 15 ? 'text-rose-400 animate-pulse' : 'text-teal-400'
                }`}
              >
                {Math.floor((timeRemaining || 0) / 60)}:
                {((timeRemaining || 0) % 60).toString().padStart(2, '0')}
              </span>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                <span>Goal</span>
                {movesRemaining !== undefined && (
                  <span className="text-slate-400">{movesRemaining} Moves Left</span>
                )}
              </div>
              <div className="flex flex-col gap-0.5 mt-0.5">
                {objectives?.map((obj, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-300 truncate max-w-[110px] text-[11px]">{obj.description}</span>
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        obj.current >= obj.target ? 'text-emerald-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {obj.current}/{obj.target}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Combo Indicator & Undo Action Strip */}
      <div className="flex items-center justify-between px-1 h-7">
        {combo > 1 ? (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold animate-pulse">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" />
            <span>COMBO x{combo}!</span>
          </div>
        ) : (
          <div className="text-[11px] text-slate-500 font-medium">Clear lines for combo multipliers</div>
        )}

        <div className="flex items-center gap-1.5">
          <button
            onClick={onUseHint}
            disabled={hintsAvailable <= 0}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              hintsAvailable > 0
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25 active:scale-95'
                : 'bg-slate-900/40 text-slate-600 border border-slate-800/40 cursor-not-allowed opacity-50'
            }`}
            title="Use Hint power-up to find best move"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Hint ({hintsAvailable})</span>
          </button>

          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              canUndo
                ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 active:scale-95'
                : 'bg-slate-900/40 text-slate-600 border border-slate-800/40 cursor-not-allowed opacity-50'
            }`}
            title="Undo previous move (1 per turn)"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
