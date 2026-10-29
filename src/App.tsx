/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameMode,
  Grid,
  PieceShape,
  LevelDefinition,
  UserStats,
  GameSettings,
  MoveRecord,
} from './types/game';
import {
  BOARD_SIZE,
  canPlacePiece,
  createEmptyGrid,
  createInitialGridFromLevel,
  executePiecePlacement,
  hasValidMovesRemaining,
  findBestPlacementForPiece,
} from './engine/gameEngine';
import { generatePieceSet } from './engine/pieces';
import { getLevelDefinition } from './engine/levels';
import { sound } from './services/audio';
import { haptics } from './services/haptics';
import {
  loadUserStats,
  saveUserStats,
  loadSettings,
  saveSettings,
} from './services/storage';
import { AndroidFrame } from './components/AndroidFrame';
import { GameBoard } from './components/GameBoard';
import { PieceTray } from './components/PieceTray';
import { GameHUD } from './components/GameHUD';
import { DragPieceOverlay } from './components/DragPieceOverlay';
import { FloatingScoreText, ScorePopup } from './components/FloatingScoreText';
import { ModeSelectModal } from './components/ModeSelectModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { StatsModal } from './components/StatsModal';
import { SettingsModal } from './components/SettingsModal';
import { AndroidProjectModal } from './components/AndroidProjectModal';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';

export default function App() {
  // Global Settings & Persistent Stats
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [settings, setSettings] = useState<GameSettings>(loadSettings);

  // Active Game State
  const [mode, setMode] = useState<GameMode>('classic');
  const [levelNumber, setLevelNumber] = useState<number>(1);
  const [grid, setGrid] = useState<Grid>(createEmptyGrid);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [pieces, setPieces] = useState<(PieceShape | null)[]>(() => generatePieceSet());
  const [undoSnapshot, setUndoSnapshot] = useState<MoveRecord | null>(null);
  const [movesRemaining, setMovesRemaining] = useState<number | undefined>(undefined);
  const [timeRemaining, setTimeRemaining] = useState<number>(120); // for time attack

  // Adventure Objectives State
  const [levelDef, setLevelDef] = useState<LevelDefinition | null>(null);
  const [objectivesState, setObjectivesState] = useState(levelDef?.objectives || []);

  // Round Stats
  const [roundLinesCleared, setRoundLinesCleared] = useState<number>(0);
  const [roundMaxCombo, setRoundMaxCombo] = useState<number>(0);

  // Status & Modals
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isInvalidAttempt, setIsInvalidAttempt] = useState<boolean>(false);

  // Modal Visibility
  const [showModeModal, setShowModeModal] = useState<boolean>(false);
  const [showLevelsModal, setShowLevelsModal] = useState<boolean>(false);
  const [showDailyModal, setShowDailyModal] = useState<boolean>(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState<boolean>(false);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showAndroidModal, setShowAndroidModal] = useState<boolean>(false);

  // Dragging and Selection State
  const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);
  const [draggedPieceIndex, setDraggedPieceIndex] = useState<number | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverGridPos, setHoverGridPos] = useState<{ r: number; c: number } | null>(null);

  // Hint System State
  const [hintCells, setHintCells] = useState<{ r: number; c: number }[] | null>(null);
  const lastActivityTimeRef = useRef<number>(Date.now());

  // Floating Popups
  const [popups, setPopups] = useState<ScorePopup[]>([]);
  const popupIdRef = useRef(0);

  // Sync settings with audio/haptics services
  useEffect(() => {
    sound.setMuted(!settings.soundEnabled);
    haptics.setEnabled(settings.hapticsEnabled);
    saveSettings(settings);
  }, [settings]);

  // Sync stats to localStorage
  useEffect(() => {
    saveUserStats(stats);
  }, [stats]);

  const resetActivity = useCallback(() => {
    lastActivityTimeRef.current = Date.now();
    setHintCells(null);
  }, []);

  // Initialize Level or Mode
  const startNewGame = useCallback(
    (targetMode: GameMode, targetLevel: number = 1) => {
      setMode(targetMode);
      setScore(0);
      setCombo(0);
      setRoundLinesCleared(0);
      setRoundMaxCombo(0);
      setIsGameOver(false);
      setIsLevelComplete(false);
      setIsPaused(false);
      setUndoSnapshot(null);
      setSelectedPieceIndex(null);
      setDraggedPieceIndex(null);
      setHoverGridPos(null);
      setHintCells(null);
      lastActivityTimeRef.current = Date.now();

      const newPieces = generatePieceSet();
      setPieces(newPieces);

      if (targetMode === 'adventure') {
        setLevelNumber(targetLevel);
        const def = getLevelDefinition(targetLevel);
        setLevelDef(def);
        setObjectivesState(def.objectives.map((o) => ({ ...o, current: 0 })));
        setMovesRemaining(def.maxMoves);
        setGrid(createInitialGridFromLevel(def));
      } else if (targetMode === 'daily') {
        const dailyDef = getLevelDefinition(targetLevel);
        setLevelDef(dailyDef);
        setObjectivesState([
          { type: 'score', target: 1200, current: 0, description: 'Reach 1,200 Points' },
          { type: 'combo', target: 2, current: 0, description: 'Achieve 2x Combo' },
        ]);
        setMovesRemaining(undefined);
        setGrid(createEmptyGrid());
      } else if (targetMode === 'time_challenge') {
        setTimeRemaining(120);
        setMovesRemaining(undefined);
        setLevelDef(null);
        setGrid(createEmptyGrid());
      } else {
        // Classic & Practice
        setLevelDef(null);
        setMovesRemaining(undefined);
        setGrid(createEmptyGrid());
      }

      // Track games played count
      setStats((prev) => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
    },
    []
  );

  // On first load, start classic
  useEffect(() => {
    startNewGame('classic');
  }, [startNewGame]);

  // Time Attack Countdown Loop
  useEffect(() => {
    if (mode !== 'time_challenge' || isPaused || isGameOver) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          sound.playGameOver();
          haptics.error();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, isPaused, isGameOver]);

  // Compute which tray pieces can fit anywhere on the current board
  const pieceCanFit = pieces.map((piece) => {
    if (!piece) return false;
    for (let r = 0; r <= BOARD_SIZE - piece.matrix.length; r++) {
      for (let c = 0; c <= BOARD_SIZE - piece.matrix[0].length; c++) {
        if (canPlacePiece(grid, piece, r, c)) {
          return true;
        }
      }
    }
    return false;
  });

  // 10-Second Inactivity Hint Timer
  useEffect(() => {
    if (isPaused || isGameOver || !settings.autoHintAfterInactivity) return;

    const interval = setInterval(() => {
      const idleMs = Date.now() - lastActivityTimeRef.current;
      if (idleMs >= 10000 && !hintCells) {
        // Find best move for selected piece or first available piece
        let candidateIdx = selectedPieceIndex;
        if (candidateIdx === null || !pieces[candidateIdx] || !pieceCanFit[candidateIdx]) {
          candidateIdx = pieces.findIndex((p, idx) => p !== null && pieceCanFit[idx]);
        }

        if (candidateIdx !== -1 && pieces[candidateIdx]) {
          const candidatePiece = pieces[candidateIdx]!;
          const bestMove = findBestPlacementForPiece(grid, candidatePiece);
          if (bestMove) {
            const cells: { r: number; c: number }[] = [];
            for (let r = 0; r < candidatePiece.matrix.length; r++) {
              for (let c = 0; c < candidatePiece.matrix[0].length; c++) {
                if (candidatePiece.matrix[r][c] === 1) {
                  cells.push({ r: bestMove.r + r, c: bestMove.c + c });
                }
              }
            }
            setHintCells(cells);
            if (selectedPieceIndex === null) {
              setSelectedPieceIndex(candidateIdx);
            }
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isGameOver, settings.autoHintAfterInactivity, hintCells, selectedPieceIndex, pieces, grid, pieceCanFit]);

  const triggerInvalidFeedback = () => {
    setIsInvalidAttempt(true);
    sound.playInvalid();
    haptics.error();
    setTimeout(() => setIsInvalidAttempt(false), 300);
  };

  const showPopup = (text: string, subText?: string, isCombo?: boolean) => {
    const id = ++popupIdRef.current;
    setPopups((prev) => [...prev, { id, text, subText, isCombo }]);
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 950);
  };

  // Trigger explicit Hint power-up
  const handleUseHint = () => {
    resetActivity();
    if (stats.hintsAvailable <= 0) {
      showPopup('NO HINTS LEFT', 'Complete daily challenges for more');
      return;
    }

    let candidateIdx = selectedPieceIndex;
    if (candidateIdx === null || !pieces[candidateIdx] || !pieceCanFit[candidateIdx]) {
      candidateIdx = pieces.findIndex((p, idx) => p !== null && pieceCanFit[idx]);
    }
    if (candidateIdx === -1 || !pieces[candidateIdx]) {
      showPopup('NO VALID MOVES');
      return;
    }

    const candidatePiece = pieces[candidateIdx]!;
    const bestMove = findBestPlacementForPiece(grid, candidatePiece);
    if (!bestMove) return;

    const cells: { r: number; c: number }[] = [];
    for (let r = 0; r < candidatePiece.matrix.length; r++) {
      for (let c = 0; c < candidatePiece.matrix[0].length; c++) {
        if (candidatePiece.matrix[r][c] === 1) {
          cells.push({ r: bestMove.r + r, c: bestMove.c + c });
        }
      }
    }

    setHintCells(cells);
    setSelectedPieceIndex(candidateIdx);
    sound.playPiecePick();
    haptics.tap();
    showPopup('HINT ACTIVATED!', 'Follow the golden glow');

    // Deduct 1 hint from inventory, increment total hints used in stats
    setStats((prev) => ({
      ...prev,
      hintsAvailable: Math.max(0, prev.hintsAvailable - 1),
      hintsUsedTotal: prev.hintsUsedTotal + 1,
    }));
  };

  // Execute placement
  const handlePlacePiece = (
    piece: PieceShape,
    targetRow: number,
    targetCol: number,
    trayIndex: number
  ) => {
    resetActivity();

    if (!canPlacePiece(grid, piece, targetRow, targetCol)) {
      triggerInvalidFeedback();
      return false;
    }

    // Save undo snapshot
    setUndoSnapshot({
      grid: grid.map((r) => r.map((c) => ({ ...c }))),
      score,
      combo,
      pieces: [...pieces],
      movesUsed: movesRemaining,
      objectivesProgress: objectivesState.reduce((acc, o) => ({ ...acc, [o.type]: o.current }), {}),
    });

    // Run engine placement
    const outcome = executePiecePlacement(grid, piece, targetRow, targetCol, combo);

    // Update board & score
    setGrid(outcome.newGrid);
    const newScore = score + outcome.pointsEarned;
    setScore(newScore);
    setCombo(outcome.newCombo);

    // Audio & Haptics
    if (outcome.linesCleared > 0) {
      sound.playLineClear(outcome.linesCleared, outcome.newCombo);
      if (outcome.newCombo > 1) {
        haptics.combo();
        showPopup(
          `COMBO x${outcome.newCombo}!`,
          `+${outcome.pointsEarned} pts · ${outcome.linesCleared} Lines`,
          true
        );
      } else {
        haptics.success();
        showPopup(`+${outcome.pointsEarned} pts`, `${outcome.linesCleared} Lines Cleared`);
      }
    } else {
      sound.playPiecePlace();
      haptics.tap();
      showPopup(`+${outcome.pointsEarned}`);
    }

    // Track round stats
    const totalLines = roundLinesCleared + outcome.linesCleared;
    setRoundLinesCleared(totalLines);
    if (outcome.newCombo > roundMaxCombo) {
      setRoundMaxCombo(outcome.newCombo);
    }

    // Update lifetime stats
    setStats((prev) => {
      const updated = { ...prev };
      updated.totalLinesCleared += outcome.linesCleared;
      if (outcome.newCombo > updated.maxCombo) {
        updated.maxCombo = outcome.newCombo;
      }
      if (mode === 'classic' && newScore > updated.highScoreClassic) {
        updated.highScoreClassic = newScore;
      }
      if (mode === 'time_challenge' && newScore > updated.timeChallengeHighScore) {
        updated.timeChallengeHighScore = newScore;
      }
      return updated;
    });

    // Time attack bonus (+5s per cleared line)
    if (mode === 'time_challenge' && outcome.linesCleared > 0) {
      setTimeRemaining((prev) => Math.min(180, prev + outcome.linesCleared * 5));
    }

    // Move limits in Adventure
    let newMovesRemaining = movesRemaining;
    if (movesRemaining !== undefined) {
      newMovesRemaining = movesRemaining - 1;
      setMovesRemaining(newMovesRemaining);
    }

    // Objectives check (Adventure & Daily)
    let allMet = false;
    if (levelDef && objectivesState.length > 0) {
      const updatedObjectives = objectivesState.map((obj) => {
        let current = obj.current;
        if (obj.type === 'score') current = newScore;
        if (obj.type === 'lines') current += outcome.linesCleared;
        if (obj.type === 'jewels') current += outcome.jewelsCleared;
        if (obj.type === 'combo') current = Math.max(current, outcome.newCombo);
        return { ...obj, current };
      });
      setObjectivesState(updatedObjectives);

      allMet = updatedObjectives.every((obj) => obj.current >= obj.target);
    }

    // Remove placed piece from tray
    const nextPieces = [...pieces];
    nextPieces[trayIndex] = null;

    // If tray exhausted, generate 3 fresh pieces
    const allUsed = nextPieces.every((p) => p === null);
    const finalPieces = allUsed ? generatePieceSet() : nextPieces;
    setPieces(finalPieces);

    // Reset selection & drag
    setSelectedPieceIndex(null);
    setDraggedPieceIndex(null);
    setHoverGridPos(null);

    // Adventure Victory Check
    if (allMet && mode === 'adventure' && levelDef) {
      sound.playLevelVictory();
      haptics.combo();
      setIsLevelComplete(true);

      // Calculate star rating
      let stars = 1;
      if (newScore >= levelDef.starThresholds[2]) stars = 3;
      else if (newScore >= levelDef.starThresholds[1]) stars = 2;
      setEarnedStars(stars);

      // Save level progress
      setStats((prev) => {
        const nextStars = { ...prev.starsEarned, [levelNumber]: Math.max(stars, prev.starsEarned[levelNumber] || 0) };
        const nextLevel = Math.max(prev.adventureLevelReached, levelNumber + 1);
        return {
          ...prev,
          adventureLevelReached: nextLevel,
          starsEarned: nextStars,
        };
      });
      return true;
    }

    // Daily Challenge Victory Check
    if (allMet && mode === 'daily') {
      sound.playLevelVictory();
      haptics.combo();
      setIsLevelComplete(true);
      const todayKey = new Date().toISOString().split('T')[0];
      setStats((prev) => {
        if (!prev.dailyCompletedDates.includes(todayKey)) {
          const newStreak = prev.dailyCurrentStreak + 1;
          return {
            ...prev,
            dailyCompletedDates: [...prev.dailyCompletedDates, todayKey],
            dailyCurrentStreak: newStreak,
            dailyBestStreak: Math.max(prev.dailyBestStreak, newStreak),
            // Reward: +1 hint refill on daily completion!
            hintsAvailable: prev.hintsAvailable + 1,
          };
        }
        return prev;
      });
      return true;
    }

    // Check Adventure Move limit exceeded without meeting objectives
    if (newMovesRemaining !== undefined && newMovesRemaining <= 0 && !allMet) {
      setIsGameOver(true);
      sound.playGameOver();
      haptics.error();
      return true;
    }

    // Game Over Detection (No remaining piece can fit)
    const canContinue = hasValidMovesRemaining(outcome.newGrid, finalPieces);
    if (!canContinue && mode !== 'practice') {
      setIsGameOver(true);
      sound.playGameOver();
      haptics.error();
    }

    return true;
  };

  // Undo previous move
  const handleUndo = () => {
    resetActivity();
    if (!undoSnapshot) return;
    setGrid(undoSnapshot.grid);
    setScore(undoSnapshot.score);
    setCombo(undoSnapshot.combo);
    setPieces(undoSnapshot.pieces);
    setMovesRemaining(undoSnapshot.movesUsed);
    if (undoSnapshot.objectivesProgress) {
      setObjectivesState((prev) =>
        prev.map((o) => ({ ...o, current: undoSnapshot.objectivesProgress?.[o.type] ?? o.current }))
      );
    }
    sound.playPiecePick();
    haptics.tap();

    // In competitive modes, undo is limited to once per turn
    if (mode !== 'practice') {
      setUndoSnapshot(null);
    }
  };

  // Touch / Pointer Drag Calculation
  const handlePointerDownPiece = (e: React.PointerEvent, index: number) => {
    const piece = pieces[index];
    if (!piece) return;

    resetActivity();
    sound.playPiecePick();
    haptics.tap();
    setDraggedPieceIndex(index);
    setSelectedPieceIndex(index);
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (draggedPieceIndex === null) return;

    const handlePointerMove = (e: PointerEvent) => {
      setDragPos({ x: e.clientX, y: e.clientY });

      // Calculate candidate board row and col under finger
      const boardEl = document.getElementById('game-board-container');
      if (!boardEl) return;

      const rect = boardEl.getBoundingClientRect();
      const offsetY = settings.touchAssistOffset ? -65 : 0;
      const targetX = e.clientX;
      const targetY = e.clientY + offsetY;

      if (
        targetX >= rect.left &&
        targetX <= rect.right &&
        targetY >= rect.top &&
        targetY <= rect.bottom
      ) {
        const cellSize = rect.width / BOARD_SIZE;
        const col = Math.floor((targetX - rect.left) / cellSize);
        const row = Math.floor((targetY - rect.top) / cellSize);
        setHoverGridPos({
          r: Math.max(0, Math.min(row, BOARD_SIZE - 1)),
          c: Math.max(0, Math.min(col, BOARD_SIZE - 1)),
        });
      } else {
        setHoverGridPos(null);
      }
    };

    const handlePointerUp = () => {
      if (draggedPieceIndex !== null && hoverGridPos) {
        const piece = pieces[draggedPieceIndex];
        if (piece) {
          handlePlacePiece(piece, hoverGridPos.r, hoverGridPos.c, draggedPieceIndex);
        }
      }
      setDraggedPieceIndex(null);
      setDragPos(null);
      setHoverGridPos(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggedPieceIndex, hoverGridPos, pieces, settings.touchAssistOffset]);

  // Tap-to-place board cell handler
  const handleCellClick = (r: number, c: number) => {
    resetActivity();
    if (selectedPieceIndex === null) return;
    const piece = pieces[selectedPieceIndex];
    if (!piece) return;

    handlePlacePiece(piece, r, c, selectedPieceIndex);
  };

  const todayKey = new Date().toISOString().split('T')[0];
  const isCompletedToday = stats.dailyCompletedDates.includes(todayKey);

  const activeHoverPiece =
    draggedPieceIndex !== null ? pieces[draggedPieceIndex] : selectedPieceIndex !== null ? pieces[selectedPieceIndex] : null;

  return (
    <AndroidFrame
      useBezel={settings.androidFrameBezel}
      onToggleBezel={() => setSettings((s) => ({ ...s, androidFrameBezel: !s.androidFrameBezel }))}
    >
      <div className="flex-1 flex flex-col justify-between bg-slate-950 text-slate-100 relative overflow-hidden select-none">
        {/* PWA Install Banner */}
        <PWAInstallBanner />

        {/* Top HUD */}
        <GameHUD
          mode={mode}
          score={score}
          highScore={mode === 'time_challenge' ? stats.timeChallengeHighScore : stats.highScoreClassic}
          combo={combo}
          levelNumber={levelNumber}
          objectives={objectivesState}
          movesRemaining={movesRemaining}
          timeRemaining={timeRemaining}
          canUndo={undoSnapshot !== null}
          hintsAvailable={stats.hintsAvailable || 0}
          onUseHint={handleUseHint}
          soundEnabled={settings.soundEnabled}
          onToggleSound={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
          onUndo={handleUndo}
          onRestart={() => startNewGame(mode, levelNumber)}
          onPause={() => setIsPaused(true)}
          onOpenMenu={() => setShowModeModal(true)}
        />

        {/* Center Game Board */}
        <div className="relative flex-1 flex items-center justify-center px-3 py-1">
          <GameBoard
            grid={grid}
            hoverPiece={activeHoverPiece}
            hoverPos={hoverGridPos}
            selectedPiece={selectedPieceIndex !== null ? pieces[selectedPieceIndex] : null}
            hintCells={hintCells}
            isInvalidAttempt={isInvalidAttempt}
            onCellClick={handleCellClick}
          />

          {/* Floating animated score popups */}
          <FloatingScoreText popups={popups} />
        </div>

        {/* Bottom Tray with 3 Pieces */}
        <div className="pb-3 pt-1">
          <PieceTray
            pieces={pieces}
            selectedPieceIndex={selectedPieceIndex}
            draggedPieceIndex={draggedPieceIndex}
            pieceCanFit={pieceCanFit}
            onSelectPiece={(idx) => {
              resetActivity();
              if (selectedPieceIndex === idx) {
                setSelectedPieceIndex(null);
              } else {
                setSelectedPieceIndex(idx);
                sound.playPiecePick();
                haptics.tap();
              }
            }}
            onPointerDownPiece={handlePointerDownPiece}
          />
        </div>

        {/* Dragging floating piece overlay */}
        <DragPieceOverlay
          dragPiece={draggedPieceIndex !== null ? pieces[draggedPieceIndex] : null}
          dragPos={dragPos}
          touchOffset={settings.touchAssistOffset}
        />

        {/* Modals */}
        {showModeModal && (
          <ModeSelectModal
            currentMode={mode}
            adventureLevel={stats.adventureLevelReached}
            dailyStreak={stats.dailyCurrentStreak}
            onSelectMode={(m) => startNewGame(m)}
            onOpenLevels={() => {
              setShowModeModal(false);
              setShowLevelsModal(true);
            }}
            onOpenDaily={() => {
              setShowModeModal(false);
              setShowDailyModal(true);
            }}
            onOpenLeaderboard={() => {
              setShowModeModal(false);
              setShowLeaderboardModal(true);
            }}
            onOpenStats={() => {
              setShowModeModal(false);
              setShowStatsModal(true);
            }}
            onOpenSettings={() => {
              setShowModeModal(false);
              setShowSettingsModal(true);
            }}
            onOpenAndroidExport={() => {
              setShowModeModal(false);
              setShowAndroidModal(true);
            }}
            onClose={() => setShowModeModal(false)}
          />
        )}

        {showLevelsModal && (
          <LevelSelectModal
            currentLevel={levelNumber}
            highestUnlockedLevel={stats.adventureLevelReached}
            starsEarned={stats.starsEarned}
            onSelectLevel={(lvl) => startNewGame('adventure', lvl)}
            onClose={() => setShowLevelsModal(false)}
          />
        )}

        {showDailyModal && (
          <DailyChallengeModal
            todayKey={todayKey}
            isCompletedToday={isCompletedToday}
            currentStreak={stats.dailyCurrentStreak}
            bestStreak={stats.dailyBestStreak}
            onPlayDaily={() => startNewGame('daily')}
            onOpenLeaderboard={() => {
              setShowDailyModal(false);
              setShowLeaderboardModal(true);
            }}
            onClose={() => setShowDailyModal(false)}
          />
        )}

        {showLeaderboardModal && (
          <LeaderboardModal
            todayKey={todayKey}
            playerName={stats.playerName || 'BlockKnight'}
            myScore={score}
            myLines={roundLinesCleared}
            myCombo={roundMaxCombo}
            onUpdatePlayerName={(name) => setStats((s) => ({ ...s, playerName: name }))}
            onClose={() => setShowLeaderboardModal(false)}
          />
        )}

        {showStatsModal && (
          <StatsModal stats={stats} onClose={() => setShowStatsModal(false)} />
        )}

        {showSettingsModal && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={(newS) => setSettings((s) => ({ ...s, ...newS }))}
            onResetProgress={() => {
              localStorage.clear();
              setStats(loadUserStats());
              startNewGame('classic');
            }}
            onClose={() => setShowSettingsModal(false)}
          />
        )}

        {showAndroidModal && (
          <AndroidProjectModal onClose={() => setShowAndroidModal(false)} />
        )}

        {isPaused && (
          <PauseModal
            onResume={() => setIsPaused(false)}
            onRestart={() => startNewGame(mode, levelNumber)}
            onHome={() => {
              setIsPaused(false);
              setShowModeModal(true);
            }}
            soundEnabled={settings.soundEnabled}
            hapticsEnabled={settings.hapticsEnabled}
            onToggleSound={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
            onToggleHaptics={() => setSettings((s) => ({ ...s, hapticsEnabled: !s.hapticsEnabled }))}
          />
        )}

        {isGameOver && (
          <GameOverModal
            score={score}
            highScore={mode === 'time_challenge' ? stats.timeChallengeHighScore : stats.highScoreClassic}
            isNewHigh={
              (mode === 'classic' && score > 0 && score >= stats.highScoreClassic) ||
              (mode === 'time_challenge' && score > 0 && score >= stats.timeChallengeHighScore)
            }
            linesCleared={roundLinesCleared}
            maxCombo={roundMaxCombo}
            onRestart={() => startNewGame(mode, levelNumber)}
            onOpenLeaderboard={mode === 'daily' ? () => setShowLeaderboardModal(true) : undefined}
            onHome={() => {
              setIsGameOver(false);
              setShowModeModal(true);
            }}
          />
        )}

        {isLevelComplete && (
          <LevelCompleteModal
            levelNumber={levelNumber}
            score={score}
            stars={earnedStars}
            onNextLevel={() => {
              setIsLevelComplete(false);
              startNewGame('adventure', levelNumber + 1);
            }}
            onRetry={() => {
              setIsLevelComplete(false);
              startNewGame(mode, levelNumber);
            }}
            onLevelSelect={() => {
              setIsLevelComplete(false);
              setShowLevelsModal(true);
            }}
            onOpenLeaderboard={mode === 'daily' ? () => setShowLeaderboardModal(true) : undefined}
          />
        )}
      </div>
    </AndroidFrame>
  );
}
