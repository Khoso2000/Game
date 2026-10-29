/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Settings, Volume2, VolumeX, Vibrate, Sparkles, CheckCircle2, XCircle, RotateCcw, Smartphone, Play } from 'lucide-react';
import { GameSettings } from '../types/game';
import { runDeterministicTests, TestResult } from '../engine/gameEngine.test';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onClose,
}) => {
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleRunTests = () => {
    const results = runDeterministicTests();
    setTestResults(results);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-black font-display text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options List */}
        <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-3">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2.5">
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-teal-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <span className="text-xs text-slate-200 font-medium">Sound Effects</span>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 focus:ring-offset-slate-950 bg-slate-900 border-slate-700"
            />
          </div>

          {/* Haptics Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2.5">
              <Vibrate className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-200 font-medium">Vibration / Haptics</span>
            </div>
            <input
              type="checkbox"
              checked={settings.hapticsEnabled}
              onChange={(e) => onUpdateSettings({ hapticsEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 focus:ring-offset-slate-950 bg-slate-900 border-slate-700"
            />
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <div className="flex flex-col">
                <span className="text-xs text-slate-200 font-medium">Reduced Motion</span>
                <span className="text-[10px] text-slate-400">Diminish animations</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => onUpdateSettings({ reducedMotion: e.target.checked })}
              className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 focus:ring-offset-slate-950 bg-slate-900 border-slate-700"
            />
          </div>

          {/* Touch Drag Offset */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-xs text-slate-200 font-medium">Thumb View Offset</span>
                <span className="text-[10px] text-slate-400">Floats piece above finger</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.touchAssistOffset}
              onChange={(e) => onUpdateSettings({ touchAssistOffset: e.target.checked })}
              className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 focus:ring-offset-slate-950 bg-slate-900 border-slate-700"
            />
          </div>

          {/* Deterministic Unit Tests Section */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-slate-200 font-semibold">Engine Unit Tests</span>
                <span className="text-[10px] text-slate-400">Verify rules, clears & combos</span>
              </div>
              <button
                onClick={handleRunTests}
                className="px-2.5 py-1 rounded-md bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Play className="w-3 h-3" />
                <span>Run</span>
              </button>
            </div>

            {testResults && (
              <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-slate-800/80">
                {testResults.map((t, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                    {t.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex flex-col">
                      <span className={t.passed ? 'text-slate-200 font-medium' : 'text-rose-300 font-bold'}>
                        {t.name}
                      </span>
                      <span className="text-[10px] text-slate-500">{t.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reset Progress */}
          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 flex items-center justify-between mt-1">
            <div className="flex flex-col">
              <span className="text-xs text-rose-300 font-medium">Reset All Progress</span>
              <span className="text-[10px] text-slate-400">Clear scores, stars & streak</span>
            </div>
            {confirmReset ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    onResetProgress();
                    setConfirmReset(false);
                  }}
                  className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-bold"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[10px]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="px-2.5 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
