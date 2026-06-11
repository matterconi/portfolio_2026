'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

const tracks = [
  { id: 'ethereal-sounds', title: 'Ethereal Sounds', src: '/audio/ethereal-sounds.mp3' },
  { id: 'agentic-loop', title: 'Agentic Loop', src: '/audio/agentic-loop.mp3' },
  { id: 'kaffeina', title: 'Kaffeina', src: '/audio/kaffeina.mp3' },
];

// Longest title drives the width so no track name gets clipped.
const longestTitle = tracks.reduce(
  (longest, t) => (t.title.length > longest.length ? t.title : longest),
  ''
);

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  }, []);

  const previousTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  }, []);

  // Sync play/pause state with the audio element. Music is on by default, but
  // browsers block autoplay until the first user gesture — if play() is rejected
  // we resume on the first interaction (click/tap/scroll/key) anywhere on the page.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      audio.pause();
      return;
    }

    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;
    let cleanup = () => {};

    audio.play().catch(() => {
      const resume = () => {
        audio.play().catch(() => {});
        cleanup();
      };
      events.forEach((e) =>
        window.addEventListener(e, resume, { once: true, passive: true })
      );
      cleanup = () => events.forEach((e) => window.removeEventListener(e, resume));
    });

    return () => cleanup();
  }, [isPlaying, currentTrackIndex]);

  return (
    <div className="flex items-center gap-3">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onEnded={nextTrack}
        preload="auto"
      />

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
