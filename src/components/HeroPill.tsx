'use client';

import { motion } from 'framer-motion';
import MusicPlayer from './MusicPlayer';

interface HeroPillProps {
  tagline: string;
  revealDelay: number;
}

export default function HeroPill({ tagline, revealDelay }: HeroPillProps) {
  return (
    <div className="flex justify-center lg:justify-start" style={{ clipPath: 'inset(0 -50px -50px -50px)' }}>
      <motion.div
        className="mt-6 inline-flex rounded-3xl p-px"
        style={{
          background: 'linear-gradient(135deg, #ffffff40, transparent 50%, #ffffff20)',
          boxShadow: '0 0 25px #ffffff15, 0 0 50px #ffffff0d',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.33, 1, 0.68, 1],
          delay: revealDelay,
        }}
      >
          <div className="flex flex-col items-center gap-2 rounded-3xl bg-black/90 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] px-5 py-3">
          <p
            className="text-sm max-[350px]:text-xs sm:text-base font-normal uppercase tracking-[0.25em] text-foreground-muted text-center leading-relaxed"
          >
            {tagline.split(/(Creative)/i).map((part, i) =>
              part.toLowerCase() === 'creative' ? (
                <span key={i}>
                  <br className="sm:hidden" />
                  <span className="italic text-accent-cyan">{part}</span>
                  <br className="max-[350px]:inline hidden" />
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>

          <div className="w-full border-t border-white/5" />

          <MusicPlayer />
        </div>
      </motion.div>
    </div>
  );
}
