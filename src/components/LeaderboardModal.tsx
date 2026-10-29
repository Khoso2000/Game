/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Trophy, RefreshCw, WifiOff, Wifi, User, Check, Flame, Zap, Award } from 'lucide-react';
import { LeaderboardEntry } from '../types/game';
import { fetchDailyLeaderboard, submitDailyScore } from '../services/firebase';

interface LeaderboardModalProps {
  todayKey: string;
  playerName: string;
  myScore?: number;
  myLines?: number;
  myCombo?: number;
  onUpdatePlayerName: (name: string) => void;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  todayKey,
  playerName,
  myScore = 0,
  myLines = 0,
  myCombo = 0,
  onUpdatePlayerName,
  onClose,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(playerName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    const result = await fetchDailyLeaderboard(todayKey);
    setEntries(result.entries);
    setIsOffline(result.isOffline);
    setIsLoading(false);
  };

  useEffect(() => {
    loadLeaderboard();
  }, [todayKey]);

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed.length > 0) {
      onUpdatePlayerName(trimmed.substring(0, 30));
    }
    setIsEditingName(false);
  };

  const handleSubmitMyScore = async () => {
    if (myScore <= 0 || isSubmitting || hasSubmitted) return;
    setIsSubmitting(true);
    
    // Generate deterministic id for today's entry per player device
    let userId = localStorage.getItem('blockquest_device_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('blockquest_device_id', userId);
    }
    const entryId = `${todayKey}_${userId}`;

    const newEntry: LeaderboardEntry = {
      id: entryId,
      playerName: playerName.trim() || 'BlockKnight',
      score: myScore,
      linesCleared: myLines,
      maxCombo: myCombo,
      dateKey: todayKey,
      userId,
    };

    const res = await submitDailyScore(newEntry);
    setIsOffline(res.isOffline);
    setHasSubmitted(true);
    setIsSubmitting(false);
    loadLeaderboard();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-sm">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black font-display text-white tracking-tight">Global Leaderboard</h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>Daily Challenge · {todayKey}</span>
                <span>·</span>
                {isOffline ? (
                  <span className="flex items-center gap-1 text-amber-400">
                    <WifiOff className="w-3 h-3" />
                    Offline (Cached)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-teal-400">
                    <Wifi className="w-3 h-3" />
                    Live Cloud Sync
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={loadLeaderboard}
              disabled={isLoading}
              className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors disabled:opacity-50"
              title="Refresh Leaderboard"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Player Profile & Submission Bar */}
        <div className="my-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-teal-400" />
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={nameInput}
                    maxLength={25}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-2 py-0.5 text-xs bg-slate-900 border border-teal-500 rounded text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1 rounded bg-teal-500 text-slate-950 text-xs font-bold"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{playerName}</span>
                  <button
                    onClick={() => {
                      setNameInput(playerName);
                      setIsEditingName(true);
                    }}
                    className="text-[10px] text-teal-400 hover:underline"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {myScore > 0 && !hasSubmitted && (
              <button
                onClick={handleSubmitMyScore}
                disabled={isSubmitting}
                className="px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : `Post Score (${myScore})`}
              </button>
            )}

            {hasSubmitted && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" />
                Score Submitted!
              </span>
            )}
          </div>
        </div>

        {/* Leaderboard Entries List */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5">
          {isLoading && entries.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center gap-2 text-slate-500 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin text-teal-400" />
              <span>Fetching global rankings...</span>
            </div>
          ) : entries.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center gap-2 text-slate-500 text-xs text-center p-4">
              <Trophy className="w-8 h-8 text-slate-700" />
              <span className="text-slate-300 font-semibold">No scores posted yet today!</span>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Be the first player to complete today's Daily Quest and take the #1 spot on the global leaderboard.
              </p>
            </div>
          ) : (
            entries.map((entry, idx) => {
              const rank = idx + 1;
              const isTop1 = rank === 1;
              const isTop2 = rank === 2;
              const isTop3 = rank === 3;
              const isMe = entry.playerName === playerName;

              return (
                <div
                  key={entry.id || idx}
                  className={`p-2.5 rounded-xl flex items-center justify-between transition-all ${
                    isTop1
                      ? 'bg-amber-500/15 border border-amber-500/40 shadow-sm'
                      : isTop2
                      ? 'bg-slate-800/80 border border-slate-600/60'
                      : isTop3
                      ? 'bg-amber-900/20 border border-amber-800/40'
                      : isMe
                      ? 'bg-teal-500/10 border border-teal-500/30'
                      : 'bg-slate-950/60 border border-slate-800/60'
                  }`}
                >
                  {/* Rank & Player Info */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-display font-black text-xs ${
                        isTop1
                          ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                          : isTop2
                          ? 'bg-slate-300 text-slate-950'
                          : isTop3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {rank}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate max-w-[140px]">
                          {entry.playerName}
                        </span>
                        {isMe && (
                          <span className="text-[9px] bg-teal-500/20 text-teal-300 font-bold px-1 rounded">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="flex items-center gap-0.5">
                          <Zap className="w-3 h-3 text-teal-400" />
                          {entry.linesCleared} lines
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5 text-amber-400">
                          <Flame className="w-3 h-3 fill-amber-400" />
                          {entry.maxCombo}x combo
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-black font-display text-teal-400 tabular-nums">
                      {entry.score.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase font-medium">Points</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>Powered by Firebase Firestore</span>
          <span>Offline cached & live synced</span>
        </div>
      </div>
    </div>
  );
};
