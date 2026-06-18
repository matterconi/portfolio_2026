'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, Repeat2, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import { useAudioPlayer } from './AudioPlayerProvider';

export default function MusicPlayer() {
  const {
    tracks,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    shuffleEnabled,
    repeatEnabled,
    seekTo,
    play,
    toggleShuffle,
    toggleRepeat,
    togglePlayPause,
    nextTrack,
    previousTrack,
  } = useAudioPlayer();

  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;
  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  };
  const bars = [10, 16, 12, 24, 18, 32, 44, 26, 38, 54, 30, 22, 16, 12, 18, 28, 40, 34, 22, 14, 10, 16];
  const artworkUrl = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=240&q=80';
  const handleSeek = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (duration <= 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    seekTo(Math.min(Math.max(ratio, 0), 1) * duration);
    play();
  };

  // Longest title drives the width so no track name gets clipped.
  const longestTitle = tracks.reduce(
    (longest, t) => (t.title.length > longest.length ? t.title : longest),
    ''
  );

  return (
    <div className="relative w-full overflow-hidden rounded-[1.5rem] bg-white/[0.08] backdrop-blur-xl sm:max-w-[500px]">
      <div className="pointer-events-none absolute inset-0 bg-black/78" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.13),transparent_42%,rgba(255,255,255,0.04))]" />
      <div className="relative px-3.5 py-3 sm:px-4">
        <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <div className="mb-3.5 grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={artworkUrl}
              alt="Track artwork"
              className="h-14 w-14 shrink-0 rounded-xl border border-white/15 object-cover shadow-[0_14px_30px_rgba(0,0,0,0.42)] sm:h-16 sm:w-16"
              loading="lazy"
            />
            <div className="min-w-0">
              <div className="relative h-6 min-w-0 overflow-hidden flex items-center">
                <span
                  aria-hidden
                  className="invisible font-display text-base uppercase tracking-wide whitespace-nowrap sm:text-lg"
                >
                  {longestTitle}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentTrack.id}
                    className="absolute inset-0 font-display text-base uppercase tracking-wide text-white whitespace-nowrap flex items-center sm:text-lg"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentTrack.title}
                  </motion.span>
                </AnimatePresence>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${currentTrack.id}-description`}
                  className="mt-0.5 text-xs tracking-wide text-foreground-muted sm:text-sm"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentTrack.description}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden h-12 min-w-36 items-center justify-center gap-1 text-accent-green/80 sm:flex" aria-hidden>
            {bars.map((height, index) => (
              <span
                key={`${height}-${index}`}
                className="w-0.5 origin-center rounded-full bg-current opacity-60 transition-transform duration-300"
                style={{
                  height: `${height}%`,
                  animation: isPlaying ? `wave-bar 900ms ease-in-out ${index * 70}ms infinite alternate` : undefined,
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <button
            type="button"
            aria-label="Seek track position"
            className="group mb-2 block h-1 w-full cursor-pointer rounded-full bg-white/10 p-0 text-left"
            onPointerDown={handleSeek}
          >
            <span className="block h-1 rounded-full bg-accent-green transition-[width] duration-150 group-hover:bg-white" style={{ width: `${progress}%` }} />
          </button>
          <div className="mb-3 flex justify-between font-display text-[11px] tracking-wider text-foreground-muted">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 text-foreground-muted">
          <button
            type="button"
            aria-label="Shuffle"
            aria-pressed={shuffleEnabled}
            onClick={toggleShuffle}
            className={`rounded-full p-1.5 transition-all hover:text-white ${
              shuffleEnabled
                ? 'bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.18)]'
                : 'text-foreground-muted'
            }`}
          >
            <Shuffle size={15} />
          </button>
          <div className="flex items-center gap-2.5">
            <button
              onClick={previousTrack}
              aria-label="Previous track"
              className="rounded-full p-1.5 transition-all hover:scale-110 hover:text-white"
            >
              <SkipBack size={16} />
            </button>

            <button
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="rounded-full border border-white/30 bg-white/[0.06] p-3 text-white backdrop-blur-md transition-transform hover:scale-105 hover:border-white hover:bg-white/[0.1]"
            >
              {isPlaying ? <Pause size={17} /> : <Play size={17} />}
            </button>

            <button
              onClick={nextTrack}
              aria-label="Next track"
              className="rounded-full p-1.5 transition-all hover:scale-110 hover:text-white"
            >
              <SkipForward size={16} />
            </button>
          </div>
          <button
            type="button"
            aria-label="Repeat"
            aria-pressed={repeatEnabled}
            onClick={toggleRepeat}
            className={`relative rounded-full p-1.5 transition-all hover:text-white ${
              repeatEnabled
                ? 'bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.18)]'
                : 'text-foreground-muted'
            }`}
          >
            <Repeat2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
