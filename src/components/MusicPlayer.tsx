'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useAudioPlayer } from './AudioPlayerProvider';

export default function MusicPlayer() {
  const {
    tracks,
    currentTrack,
    isPlaying,
    togglePlayPause,
    nextTrack,
    previousTrack,
  } = useAudioPlayer();

  // Longest title drives the width so no track name gets clipped.
  const longestTitle = tracks.reduce(
    (longest, t) => (t.title.length > longest.length ? t.title : longest),
    ''
  );

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-4">
        <button
          onClick={previousTrack}
          aria-label="Previous track"
          className="text-foreground-muted hover:text-accent-cyan hover:scale-125 transition-all p-1"
        >
          <SkipBack size={12} />
        </button>

        <button
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="text-white hover:text-accent-cyan transition-colors p-1"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <button
          onClick={nextTrack}
          aria-label="Next track"
          className="text-foreground-muted hover:text-accent-cyan hover:scale-125 transition-all p-1"
        >
          <SkipForward size={12} />
        </button>
      </div>

      <div className="relative h-4 overflow-hidden flex items-center">
        {/* Invisible sizer: reserves the width of the longest title so the
            crossfade animation has a stable box and names never get clipped. */}
        <span
          aria-hidden
          className="invisible text-[10px] uppercase tracking-[0.2em] whitespace-nowrap"
        >
          {longestTitle}
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentTrack.id}
            className="absolute inset-0 text-[10px] uppercase tracking-[0.2em] text-foreground-subtle whitespace-nowrap flex items-center"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {currentTrack.title}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
