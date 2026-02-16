'use client';

import { RefObject, useState } from 'react';
import { RotateCw, Undo2, RefreshCw, Wallet, Volume2, VolumeX, Copy, Check } from 'lucide-react';
import type { CapturedPieces } from '@/hooks/useChessGame';

const ACCENT = '#00ff00';

const PIECE_ORDER = ['q', 'r', 'b', 'n', 'p'] as const;
const WHITE_SYMBOLS: Record<string, string> = { q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' };
const BLACK_SYMBOLS: Record<string, string> = { q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };

function renderCapturedRow(captured: Record<string, number>, useBlackSymbols: boolean): string {
  const symbols = useBlackSymbols ? BLACK_SYMBOLS : WHITE_SYMBOLS;
  const pieces: string[] = [];
  for (const piece of PIECE_ORDER) {
    const count = captured[piece] || 0;
    for (let i = 0; i < count; i++) {
      pieces.push(symbols[piece]);
    }
  }
  return pieces.join('');
}

interface MovePair {
  num: number;
  white: string;
  black?: string;
}

interface ChessControlsProps {
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
  isThinking: boolean;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
  historyLength: number;
  movePairs: MovePair[];
  capturedPieces: CapturedPieces;
  pgn: string;
  playerColor: 'white' | 'black';
  soundEnabled: boolean;
  movesEndRef: RefObject<HTMLDivElement | null>;
  onNewGame: () => void;
  onUndo: () => void;
  onFlipBoard: () => void;
  onStartGame: (color: 'white' | 'black') => void;
  onToggleSound: () => void;
}

export default function ChessControls({
  translations,
  isThinking,
  isCheck,
  isCheckmate,
  isStalemate,
  isDraw,
  isGameOver,
  historyLength,
  movePairs,
  capturedPieces,
  pgn,
  playerColor,
  soundEnabled,
  movesEndRef,
  onNewGame,
  onUndo,
  onFlipBoard,
  onStartGame,
  onToggleSound,
}: ChessControlsProps) {
  const [copied, setCopied] = useState(false);

  function getStatus(): string {
    if (isCheckmate) return translations.checkmate;
    if (isStalemate) return translations.stalemate;
    if (isDraw) return translations.draw;
    if (isCheck) return translations.check;
    if (isThinking) return translations.botTurn;
    return translations.yourTurn;
  }

  const statusColor =
    isCheckmate || isCheck
      ? '#ff4444'
      : isGameOver
        ? ACCENT
        : 'var(--foreground)';

  function handleCopyPgn() {
    if (!pgn) return;
    navigator.clipboard.writeText(pgn).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const hasCaptures =
    Object.values(capturedPieces.capturedByWhite).some((v) => v > 0) ||
    Object.values(capturedPieces.capturedByBlack).some((v) => v > 0);

  const whiteRow = renderCapturedRow(capturedPieces.capturedByWhite, true);
  const blackRow = renderCapturedRow(capturedPieces.capturedByBlack, false);
  const adv = capturedPieces.advantage;

  return (
    <div
      className="flex flex-col w-full h-full rounded-2xl overflow-hidden"
      style={{ background: '#000000', border: '1px solid var(--border)' }}
    >
      {/* Status + Connect Wallet */}
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-foreground-subtle mb-0.5">Status</p>
          <p
            className="text-lg font-semibold leading-none"
            style={{ fontFamily: 'Clash Display, sans-serif', color: statusColor }}
          >
            {getStatus()}
          </p>
        </div>
        <button
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
          style={{ background: '#7c3aed15', border: '1px solid #7c3aed60', color: '#a78bfa' }}
        >
          <Wallet size={15} />
          {translations.connectWallet}
        </button>
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* Play as */}
      <div className="px-5 py-4">
        <p className="text-xs uppercase tracking-wider text-foreground-subtle mb-2.5">
          {translations.playAs}
        </p>
        <div className="flex gap-2">
          {(['white', 'black'] as const).map((color) => (
            <button
              key={color}
              onClick={() => onStartGame(color)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
              style={
                playerColor === color
                  ? { background: `${ACCENT}20`, border: `1px solid ${ACCENT}60`, color: ACCENT }
                  : {
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground-muted)',
                    }
              }
            >
              <span>{color === 'white' ? '♔' : '♚'}</span>
              <span>{color === 'white' ? translations.white : translations.black}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* Actions */}
      <div className="px-5 py-4 flex flex-wrap gap-2">
        <button
          onClick={onNewGame}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
          style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}40`, color: ACCENT }}
        >
          <RefreshCw size={15} />
          {translations.newGame}
        </button>
        <button
          onClick={onUndo}
          disabled={historyLength < 2 || isThinking}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          style={{
            background: 'var(--background)',
            border: '1px solid var(--border)',
            color: 'var(--foreground-muted)',
          }}
        >
          <Undo2 size={15} />
          {translations.undo}
        </button>
        <button
          onClick={onFlipBoard}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
          style={{
            background: 'var(--background)',
            border: '1px solid var(--border)',
            color: 'var(--foreground-muted)',
          }}
        >
          <RotateCw size={15} />
          {translations.flipBoard}
        </button>
        <button
          onClick={handleCopyPgn}
          disabled={historyLength === 0}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          style={{
            background: 'var(--background)',
            border: '1px solid var(--border)',
            color: copied ? ACCENT : 'var(--foreground-muted)',
          }}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? translations.copied : translations.copyPgn}
        </button>
        <button
          onClick={onToggleSound}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
          style={
            soundEnabled
              ? { background: `${ACCENT}15`, border: `1px solid ${ACCENT}40`, color: ACCENT }
              : {
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground-muted)',
                }
          }
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          {translations.sound}
        </button>
      </div>

      {/* Captured pieces */}
      {hasCaptures && (
        <>
          <div style={{ borderTop: '1px solid var(--border)' }} />
          <div className="px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-foreground-subtle mb-2.5">
              {translations.capturedPieces}
            </p>
            <div className="flex flex-col gap-1.5">
              {whiteRow && (
                <div className="flex items-center justify-between">
                  <span className="text-base leading-none tracking-wide">{whiteRow}</span>
                  {adv > 0 && (
                    <span className="text-xs font-semibold" style={{ color: ACCENT }}>
                      +{adv}
                    </span>
                  )}
                </div>
              )}
              {blackRow && (
                <div className="flex items-center justify-between">
                  <span className="text-base leading-none tracking-wide text-foreground-muted">
                    {blackRow}
                  </span>
                  {adv < 0 && (
                    <span className="text-xs font-semibold text-foreground-muted">
                      +{Math.abs(adv)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* Move History — grows to fill remaining space */}
      <div className="px-5 py-4 flex-1 flex flex-col min-h-0">
        <p className="text-xs uppercase tracking-wider text-foreground-subtle mb-3">
          {translations.moveHistory}
        </p>
        <div className="flex-1 overflow-y-auto space-y-1 text-sm font-mono min-h-0">
          {movePairs.length === 0 && (
            <p className="text-foreground-subtle text-xs italic">—</p>
          )}
          {movePairs.map((pair) => (
            <div key={pair.num} className="flex gap-3">
              <span className="text-foreground-subtle w-6 text-right">{pair.num}.</span>
              <span className="text-foreground w-16">{pair.white}</span>
              <span className="text-foreground-muted w-16">{pair.black || ''}</span>
            </div>
          ))}
          <div ref={movesEndRef} />
        </div>
      </div>
    </div>
  );
}
