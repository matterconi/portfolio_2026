'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Chess, Square } from 'chess.js';

const PIECE_VALUES: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };

function playChessSound(type: 'move' | 'capture' | 'check', enabled: boolean) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = type === 'move' ? 440 : type === 'capture' ? 280 : 600;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // AudioContext may be unavailable in some environments
  }
}

function getCapturedPieces(fen: string): CapturedPieces {
  const starting: Record<string, number> = { p: 8, r: 2, n: 2, b: 2, q: 1 };
  const boardStr = fen.split(' ')[0];
  const white: Record<string, number> = {};
  const black: Record<string, number> = {};

  for (const char of boardStr) {
    if (char === '/' || char === ' ') continue;
    if (/[a-zA-Z]/.test(char)) {
      const piece = char.toLowerCase();
      if (piece in starting) {
        if (char === char.toUpperCase()) {
          white[piece] = (white[piece] || 0) + 1;
        } else {
          black[piece] = (black[piece] || 0) + 1;
        }
      }
    }
  }

  const capturedByWhite: Record<string, number> = {};
  const capturedByBlack: Record<string, number> = {};

  for (const [piece, count] of Object.entries(starting)) {
    const cbw = count - (black[piece] || 0);
    const cbb = count - (white[piece] || 0);
    if (cbw > 0) capturedByWhite[piece] = cbw;
    if (cbb > 0) capturedByBlack[piece] = cbb;
  }

  const whiteScore = Object.entries(capturedByWhite).reduce(
    (sum, [p, c]) => sum + (PIECE_VALUES[p] || 0) * c,
    0
  );
  const blackScore = Object.entries(capturedByBlack).reduce(
    (sum, [p, c]) => sum + (PIECE_VALUES[p] || 0) * c,
    0
  );

  return { capturedByWhite, capturedByBlack, advantage: whiteScore - blackScore };
}

export interface CapturedPieces {
  capturedByWhite: Record<string, number>;
  capturedByBlack: Record<string, number>;
  advantage: number;
}

export interface ChessGameState {
  fen: string;
  isThinking: boolean;
  boardOrientation: 'white' | 'black';
  playerColor: 'white' | 'black';
  difficulty: 'easy' | 'medium' | 'hard';
  soundEnabled: boolean;
  history: string[];
  movePairs: { num: number; white: string; black?: string }[];
  capturedPieces: CapturedPieces;
  pgn: string;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
  onDrop: (source: Square, target: Square) => boolean;
  newGame: () => void;
  startGame: (color: 'white' | 'black') => void;
  undo: () => void;
  flipBoard: () => void;
  setDifficulty: (d: 'easy' | 'medium' | 'hard') => void;
  toggleSound: () => void;
  movesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function useChessGame(): ChessGameState {
  const [game, setGame] = useState(new Chess());
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [isThinking, setIsThinking] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const movesEndRef = useRef<HTMLDivElement>(null);

  // Keep a ref in sync so closures inside setTimeout always see the latest value
  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Auto-scroll move history (skip on mount)
  const historyLen = game.history().length;
  const prevHistoryLen = useRef(historyLen);
  useEffect(() => {
    if (historyLen > 0 && historyLen !== prevHistoryLen.current) {
      movesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    prevHistoryLen.current = historyLen;
  }, [historyLen]);

  const makeBotMove = useCallback((currentGame: Chess) => {
    if (currentGame.isGameOver()) return;
    setIsThinking(true);

    const delay = 400 + Math.random() * 600;
    setTimeout(() => {
      const moves = currentGame.moves({ verbose: true });
      if (moves.length > 0) {
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        currentGame.move(randomMove);
        const isCapture = !!randomMove.captured;
        const isCheck = currentGame.isCheck();
        playChessSound(
          isCheck ? 'check' : isCapture ? 'capture' : 'move',
          soundEnabledRef.current
        );
        setGame(new Chess(currentGame.fen()));
      }
      setIsThinking(false);
    }, delay);
  }, []);

  const onDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square): boolean => {
      if (isThinking || game.turn() !== playerColor[0]) return false;

      const gameCopy = new Chess(game.fen());
      try {
        const move = gameCopy.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q',
        });
        if (!move) return false;

        const isCapture = !!move.captured;
        const isCheck = gameCopy.isCheck();
        playChessSound(
          isCheck ? 'check' : isCapture ? 'capture' : 'move',
          soundEnabledRef.current
        );
        setGame(new Chess(gameCopy.fen()));
        makeBotMove(gameCopy);
        return true;
      } catch {
        return false;
      }
    },
    [game, isThinking, playerColor, makeBotMove]
  );

  const newGame = useCallback(() => {
    setGame(new Chess());
    setIsThinking(false);
  }, []);

  const startGame = useCallback(
    (color: 'white' | 'black') => {
      const fresh = new Chess();
      setGame(fresh);
      setIsThinking(false);
      setPlayerColor(color);
      setBoardOrientation(color);
      if (color === 'black') {
        setTimeout(() => makeBotMove(fresh), 200);
      }
    },
    [makeBotMove]
  );

  const undo = useCallback(() => {
    if (isThinking) return;
    const gameCopy = new Chess(game.fen());
    gameCopy.undo();
    gameCopy.undo();
    setGame(new Chess(gameCopy.fen()));
  }, [game, isThinking]);

  const flipBoard = useCallback(() => {
    setBoardOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  const history = game.history();
  const movePairs: { num: number; white: string; black?: string }[] = [];
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      num: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1],
    });
  }

  return {
    fen: game.fen(),
    isThinking,
    boardOrientation,
    playerColor,
    difficulty,
    soundEnabled,
    history,
    movePairs,
    capturedPieces: getCapturedPieces(game.fen()),
    pgn: game.pgn(),
    isCheck: game.isCheck(),
    isCheckmate: game.isCheckmate(),
    isStalemate: game.isStalemate(),
    isDraw: game.isDraw(),
    isGameOver: game.isGameOver(),
    onDrop,
    newGame,
    startGame,
    undo,
    flipBoard,
    setDifficulty,
    toggleSound,
    movesEndRef,
  };
}
