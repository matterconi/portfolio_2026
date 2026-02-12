'use client';

import { motion } from 'framer-motion';
import MusicPlayer from './MusicPlayer';

interface HeroPillProps {
  tagline: string;
  revealDelay: number;
}

export default function HeroPill({ tagline, revealDelay }: HeroPillProps) {
  return (
    <div className="overflow-hidden flex justify-center lg:justify-start">
      <motion.div
        className="mt-6 inline-flex flex-col items-center gap-2 rounded-3xl bg-black/80 backdrop-blur-sm border border-white/10 px-5 py-3"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.33, 1, 0.68, 1],
          delay: revealDelay,
        }}
      >
        <p
          className="text-sm sm:text-base font-normal uppercase tracking-[0.25em] text-foreground-muted"
          style={{ fontFamily: "'Zodiak', serif" }}
        >
          {tagline.split(/(Creative)/i).map((part, i) =>
            part.toLowerCase() === 'creative' ? (
              <span key={i} className="italic text-accent-cyan">{part}</span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>

        <div className="w-full border-t border-white/5" />

        <MusicPlayer />
      </motion.div>
    </div>
  );
}
