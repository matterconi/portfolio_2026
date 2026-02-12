'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

const tracks = [
  { id: 'ethereal-drift', title: 'Ethereal Drift' },
  { id: 'deep-currents', title: 'Deep Currents' },
  { id: 'crystalline', title: 'Crystalline' },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  }, []);

  const previousTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  }, []);

  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-4">
        <button
          onClick={previousTrack}
          aria-label="Previous track"
          className="text-foreground-muted hover:text-white transition-colors p-1"
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
          className="text-foreground-muted hover:text-white transition-colors p-1"
        >
          <SkipForward size={12} />
        </button>
      </div>

      <div className="relative h-4 overflow-hidden" style={{ minWidth: '8ch' }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentTrack.id}
            className="absolute inset-0 text-[10px] uppercase tracking-[0.2em] text-foreground-subtle whitespace-nowrap flex items-center"
            style={{ fontFamily: "'Zodiak', serif" }}
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
