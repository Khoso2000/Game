/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameSettings, LeaderboardEntry, UserStats } from '../types/game';

const STATS_KEY = 'blockquest_user_stats_v1';
const SETTINGS_KEY = 'blockquest_settings_v1';
const SAVED_GAME_KEY = 'blockquest_saved_session_v1';
const LEADERBOARD_CACHE_PREFIX = 'blockquest_leaderboard_cache_';

export const DEFAULT_STATS: UserStats = {
  gamesPlayed: 0,
  highScoreClassic: 0,
  totalLinesCleared: 0,
  maxCombo: 0,
  adventureLevelReached: 1,
  starsEarned: {},
  dailyCompletedDates: [],
  dailyCurrentStreak: 0,
  dailyBestStreak: 0,
  timeChallengeHighScore: 0,
  hintsAvailable: 3,
  hintsUsedTotal: 0,
  playerName: 'Player' + Math.floor(1000 + Math.random() * 9000),
};

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  reducedMotion: false,
  touchAssistOffset: true,
  androidFrameBezel: true,
  autoHintAfterInactivity: true,
};

export function loadUserStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage quota
  }
}

export function loadSettings(): GameSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore
  }
}

export function saveUnfinishedGame(gameData: unknown) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SAVED_GAME_KEY, JSON.stringify(gameData));
  } catch {
    // Ignore
  }
}

export function loadUnfinishedGame(): unknown | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SAVED_GAME_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearUnfinishedGame() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SAVED_GAME_KEY);
  } catch {
    // Ignore
  }
}

export function cacheDailyLeaderboard(dateKey: string, entries: LeaderboardEntry[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LEADERBOARD_CACHE_PREFIX + dateKey, JSON.stringify(entries));
  } catch {
    // Ignore
  }
}

export function getCachedDailyLeaderboard(dateKey: string): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LEADERBOARD_CACHE_PREFIX + dateKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
