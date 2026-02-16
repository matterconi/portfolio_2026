'use client';

import { useState } from 'react';

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

export default function ChessInfoPanel() {
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
