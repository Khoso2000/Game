/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { LeaderboardEntry } from '../types/game';
import { cacheDailyLeaderboard, getCachedDailyLeaderboard } from './storage';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
}

/**
 * Fetch top scores for a specific daily challenge date
 * Automatically caches for offline use and falls back to offline cache on failure
 */
export async function fetchDailyLeaderboard(dateKey: string): Promise<{ entries: LeaderboardEntry[]; isOffline: boolean }> {
  const path = 'daily_leaderboard';
  try {
    const q = query(
      collection(db, path),
      where('dateKey', '==', dateKey),
      orderBy('score', 'desc'),
      limit(50)
    );

    const snapshot = await getDocs(q);
    const entries: LeaderboardEntry[] = [];
    snapshot.forEach((docSnap) => {
      entries.push(docSnap.data() as LeaderboardEntry);
    });

    if (entries.length > 0) {
      cacheDailyLeaderboard(dateKey, entries);
    } else {
      const cached = getCachedDailyLeaderboard(dateKey);
      if (cached.length > 0) {
        return { entries: cached, isOffline: false };
      }
    }

    return { entries, isOffline: false };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    // Graceful offline fallback
    const cached = getCachedDailyLeaderboard(dateKey);
    return { entries: cached, isOffline: true };
  }
}

/**
 * Submits a new daily challenge score to Firestore and updates local cache
 */
export async function submitDailyScore(entry: LeaderboardEntry): Promise<{ success: boolean; isOffline: boolean }> {
  const path = `daily_leaderboard/${entry.id}`;
  
  // Always update local cache first for instant feedback & offline preservation
  const cached = getCachedDailyLeaderboard(entry.dateKey);
  const existingIdx = cached.findIndex((e) => e.id === entry.id);
  const updated = [...cached];
  if (existingIdx >= 0) {
    updated[existingIdx] = entry;
  } else {
    updated.push(entry);
  }
  updated.sort((a, b) => b.score - a.score);
  cacheDailyLeaderboard(entry.dateKey, updated);

  try {
    const docRef = doc(db, 'daily_leaderboard', entry.id);
    await setDoc(docRef, {
      ...entry,
      createdAt: new Date().toISOString(),
    });
    return { success: true, isOffline: false };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    // Score is preserved in local cache for offline play
    return { success: true, isOffline: true };
  }
}
