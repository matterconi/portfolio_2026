'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useTransform, useMotionValue, type Variants } from 'framer-motion';
import { Chessboard } from 'react-chessboard';
import { SectionTitle } from './ui/section-title';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useChessGame } from '@/hooks/useChessGame';
import type { Square } from 'chess.js';
import ChessControls from './ChessControls';

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

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const ENGINE_TAGS = [
  { label: 'Rust', color: '#f97316' },
  { label: 'NNUE', color: '#00ff00' },
  { label: 'MCTS', color: '#3b82f6' },
  { label: 'WebAssembly', color: '#a78bfa' },
  { label: 'chess.js', color: '#facc15' },
];

const WEB3_TAGS = [
  { label: 'Solidity', color: '#a78bfa' },
  { label: 'ERC-721', color: '#00ff00' },
  { label: 'IPFS', color: '#3b82f6' },
  { label: 'Ethereum', color: '#818cf8' },
  { label: 'wagmi', color: '#f97316' },
];

function InfoPanel() {
  const [tab, setTab] = useState<'engine' | 'web3'>('engine');
  const isWeb3 = tab === 'web3';
  const tags = isWeb3 ? WEB3_TAGS : ENGINE_TAGS;

  return (
    <div
      className="rounded-2xl px-5 py-4 text-sm"
      style={{ background: '#000000', border: '1px solid var(--border)' }}
    >
      {/* Switch */}
      <div className="flex gap-2 mb-4">
        {(['engine', 'web3'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer"
            style={
              tab === t
                ? { background: '#00ff0020', border: '1px solid #00ff00', color: '#00ff00' }
                : { background: 'transparent', border: '1px solid var(--border)', color: 'var(--foreground-muted)' }
            }
          >
            {t === 'engine' ? '⚙ Engine' : '⬡ Web3'}
          </button>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map(({ label, color }) => (
          <span
            key={label}
            className="rounded-md px-2 py-0.5 text-xs font-mono font-medium"
            style={{ background: `${color}18`, border: `1px solid ${color}50`, color }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Description */}
      {isWeb3 ? (
        <p className="text-foreground-muted leading-relaxed text-xs">
          Ogni partita completata viene registrata on-chain su{' '}
          <span className="text-[#818cf8] font-medium">Ethereum</span> tramite uno smart contract in{' '}
          <span className="text-[#a78bfa] font-medium">Solidity</span>: mosse, esito e PGN vengono
          hash-ati e archiviati su{' '}
          <span className="text-[#3b82f6] font-medium">IPFS</span>. Al termine, il vincitore riceve
          un NFT commemorativo{' '}
          <span className="text-[#00ff00] font-medium">ERC-721</span> che immortala la partita —
          completo di board rendering generato al momento del mint.
        </p>
      ) : (
        <p className="text-foreground-muted leading-relaxed text-xs">
          Il motore è scritto in <span className="text-[#f97316] font-medium">Rust</span> e
          compilato in <span className="text-[#a78bfa] font-medium">WebAssembly</span> per girare
          direttamente nel browser senza latenza di rete. La valutazione delle posizioni usa una
          rete neurale <span className="text-[#00ff00] font-medium">NNUE</span> addestrata su
          milioni di partite — tecnica resa famosa da Stockfish 12. La ricerca si basa su{' '}
          <span className="text-[#3b82f6] font-medium">MCTS</span> con alpha-beta pruning, così
          anche a profondità limitata il bot gioca mosse ragionevoli senza far esplodere il thread
          principale.
        </p>
      )}
    </div>
  );
}

export default function ChessSection({ translations }: ChessSectionProps) {
  const {
    fen, boardOrientation, onDrop,
    isThinking, history, movePairs,
    isCheck, isCheckmate, isStalemate, isDraw, isGameOver,
    playerColor, soundEnabled, capturedPieces, pgn,
    newGame, startGame, undo, flipBoard, toggleSound, movesEndRef,
  } = useChessGame();
  const reducedMotion = useReducedMotion();

  // ── Scroll-driven background only ──
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const update = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const progress = -rect.top / (el.offsetHeight - window.innerHeight);
      scrollYProgress.set(Math.min(1, Math.max(0, progress)));
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [scrollYProgress]);

  const bgColor = useTransform(scrollYProgress, [0, 0.5], ['rgb(0, 0, 0)', 'rgb(15, 40, 15)']);

  const [bgLocked, setBgLocked] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      if (v >= 0.5) setBgLocked(true);
      if (v >= 0.4) setContentVisible(true);
    });
  }, [scrollYProgress]);

  // ── Render ──
  return (
    <div ref={wrapperRef} className="relative h-[150vh] md:h-[250vh]" id="chess">
      {/* Sticky full-screen viewport */}
      <motion.div
        className="sticky top-0 min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: reducedMotion ? 'rgba(0,255,0,0.1)' : bgLocked ? 'rgb(15, 40, 15)' : bgColor }}
      >
        {/* Content — staggered time-based fade-in */}
        <motion.div
          className="mx-auto w-full max-w-7xl px-6 sm:px-8 flex flex-col h-full py-10"
          variants={containerVariants}
          initial="hidden"
          animate={contentVisible ? 'visible' : 'hidden'}
        >
          {/* Title */}
          <motion.div variants={itemVariants}>
            <SectionTitle visible title={translations.title} className="text-5xl sm:text-6xl mb-2" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-foreground-muted text-sm sm:text-base mb-6"
            variants={itemVariants}
          >
            {translations.subtitle}
          </motion.p>

          {/* Board + Controls */}
          <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 items-start">
            {/* Board */}
            <motion.div
              className="relative rounded-2xl shrink-0 overflow-hidden self-start w-full md:w-auto md:h-[min(calc(100vh-220px),360px)] lg:h-[min(calc(100vh-220px),560px)]"
              style={{ aspectRatio: '1 / 1' }}
              variants={itemVariants}
            >
              <Chessboard
                options={{
                  position: fen,
                  boardOrientation,
                  boardStyle: { width: '100%', borderRadius: '12px' },
                  onPieceDrop: ({ sourceSquare, targetSquare }) =>
                    onDrop(sourceSquare as Square, targetSquare as Square),
                }}
              />
            </motion.div>

            {/* Controls + Under the hood */}
            <motion.div className="flex-1 min-w-0 flex flex-col gap-4" variants={itemVariants}>
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
              <InfoPanel />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
