'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { SectionTitle } from './ui/section-title';
import { useChessGame } from '@/hooks/useChessGame';
import { Chessboard } from 'react-chessboard';
import type { Square } from 'chess.js';
import ChessControls from './ChessControls';
import ChessInfoPanel from './ChessInfoPanel';

interface ChessSectionProps {
  translations: {
    title: string;
    subtitle: string;
    newGame: string;
    undo: string;
    flipBoard: string;
    yourTurn: string;
    botTurn: string;
    check: string;
    checkmate: string;
    stalemate: string;
    draw: string;
    moveHistory: string;
    white: string;
    black: string;
    connectWallet: string;
    playAs: string;
    copyPgn: string;
    copied: string;
    capturedPieces: string;
    sound: string;
  };
}

export default function ChessSection({ translations }: ChessSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'start -50vh'],
  });

  const bgColor = useTransform(scrollYProgress, [0, 1], ['rgb(0,0,0)', 'rgb(15,40,15)']);

  // Staggered transforms — each element enters with a delay
  const titleOpacity = useTransform(scrollYProgress, [0.05, 0.4], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.05, 0.4], [40, 0]);

  const subtitleOpacity = useTransform(scrollYProgress, [0.15, 0.5], [0, 1]);
  const subtitleY = useTransform(scrollYProgress, [0.15, 0.5], [30, 0]);

  const boardOpacity = useTransform(scrollYProgress, [0.25, 0.6], [0, 1]);
  const boardY = useTransform(scrollYProgress, [0.25, 0.6], [48, 0]);

  // Applica via DOM (framer-motion style non funziona su figli di sticky)
  useMotionValueEvent(scrollYProgress, 'change', () => {
    if (titleRef.current) {
      titleRef.current.style.opacity = String(titleOpacity.get());
      titleRef.current.style.transform = `translateY(${titleY.get()}px)`;
    }
    if (subtitleRef.current) {
      subtitleRef.current.style.opacity = String(subtitleOpacity.get());
      subtitleRef.current.style.transform = `translateY(${subtitleY.get()}px)`;
    }
    if (boardRef.current) {
      boardRef.current.style.opacity = String(boardOpacity.get());
      boardRef.current.style.transform = `translateY(${boardY.get()}px)`;
    }
  });

  const {
    fen, boardOrientation, onDrop,
    isThinking, history, movePairs,
    isCheck, isCheckmate, isStalemate, isDraw, isGameOver,
    playerColor, soundEnabled, capturedPieces, pgn,
    newGame, startGame, undo, flipBoard, toggleSound, movesEndRef,
  } = useChessGame();

  return (
    <div id="chess" ref={wrapperRef}>
      <motion.div
        className="sticky top-0 min-h-screen flex flex-col justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 py-10">
          {/* Title */}
          <div ref={titleRef} style={{ opacity: 0, transform: 'translateY(40px)' }}>
            <SectionTitle visible title={translations.title} className="text-5xl sm:text-6xl mb-2" />
          </div>

          {/* Subtitle */}
          <p ref={subtitleRef} className="text-foreground-muted text-sm sm:text-base mb-6" style={{ opacity: 0, transform: 'translateY(30px)' }}>
            {translations.subtitle}
          </p>

          {/* Board + Controls */}
          <div ref={boardRef} className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 items-start" style={{ opacity: 0, transform: 'translateY(48px)' }}>
            {/* Board */}
            <div
              className="relative rounded-2xl shrink-0 overflow-hidden self-start w-full md:w-auto md:h-[min(calc(100vh-220px),360px)] lg:h-[min(calc(100vh-220px),560px)]"
              style={{ aspectRatio: '1 / 1' }}
            >
              <Chessboard
                options={{
                  position: fen,
                  boardOrientation,
                  boardStyle: { borderRadius: '12px' },
                  onPieceDrop: ({ sourceSquare, targetSquare }) =>
                    onDrop(sourceSquare as Square, targetSquare as Square),
                }}
              />
            </div>

            {/* Controls + Under the hood */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
              <ChessControls
                translations={translations}
                isThinking={isThinking}
                isCheck={isCheck}
                isCheckmate={isCheckmate}
                isStalemate={isStalemate}
                isDraw={isDraw}
                isGameOver={isGameOver}
                historyLength={history.length}
                movePairs={movePairs}
                capturedPieces={capturedPieces}
                pgn={pgn}
                playerColor={playerColor}
                soundEnabled={soundEnabled}
                movesEndRef={movesEndRef}
                onNewGame={newGame}
                onUndo={undo}
                onFlipBoard={flipBoard}
                onStartGame={startGame}
                onToggleSound={toggleSound}
              />

              {/* Under the hood */}
              <ChessInfoPanel />
            </div>
          </div>
        </div>
      </motion.div>
      {/* ── Pinning room: gives sticky element space to stay pinned ── */}
      <div className="h-[50vh] pointer-events-none" aria-hidden="true" />
    </div>
  );
}
