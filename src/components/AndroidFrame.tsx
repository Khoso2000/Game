/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  useBezel: boolean;
  onToggleBezel: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  useBezel,
  onToggleBezel,
}) => {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 select-none">
      {/* Top Desktop Controls Bar */}
      <div className="w-full max-w-md hidden sm:flex items-center justify-between mb-3 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-teal-400 tracking-wider">BLOCK QUEST</span>
          <span>·</span>
          <span>Android Edition</span>
        </div>
        <button
          onClick={onToggleBezel}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
          title="Toggle Android Device Frame"
        >
          {useBezel ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-teal-400" />
              <span>Full View</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-teal-400" />
              <span>Phone Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full max-w-[430px] flex flex-col transition-all duration-300 relative ${
          useBezel
            ? 'sm:h-[890px] sm:max-h-[94vh] sm:rounded-[48px] sm:border-[10px] sm:border-slate-800 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] sm:ring-1 sm:ring-slate-700/50 bg-slate-950 overflow-hidden'
            : 'h-screen max-w-lg bg-slate-950 overflow-y-auto'
        }`}
      >
        {/* Android Punch Hole & Status Bar */}
        {useBezel && (
          <div className="w-full h-8 pt-1.5 px-6 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0 z-40 bg-slate-950/80 backdrop-blur-sm">
            <span>10:00</span>
            {/* Center Front Camera Punch-hole */}
            <div className="w-4 h-4 rounded-full bg-black ring-1 ring-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            </div>
            <div className="flex items-center gap-1.5">
              {/* 5G / Wi-Fi icon */}
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4z" />
              </svg>
              {/* Battery indicator */}
              <div className="w-5 h-2.5 rounded-sm border border-slate-400 p-[1px] flex items-center">
                <div className="w-3 h-full bg-slate-200 rounded-[1px]" />
              </div>
            </div>
          </div>
        )}

        {/* Game Applet Viewport */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Android Navigation Bar Pill (bottom) */}
        {useBezel && (
          <div className="w-full h-5 flex items-center justify-center pb-1 shrink-0 bg-slate-950 z-40">
            <div className="w-32 h-1 rounded-full bg-slate-600/70" />
          </div>
        )}
      </div>
    </div>
  );
};
