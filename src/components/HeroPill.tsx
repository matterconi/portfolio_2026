'use client';

import { motion } from 'framer-motion';
import MusicPlayer from './MusicPlayer';

interface HeroPillProps {
  revealDelay: number;
}

export default function HeroPill({ revealDelay }: HeroPillProps) {
  return (
    <div className="flex justify-center lg:justify-start" style={{ clipPath: 'inset(0 -50px -50px -50px)' }}>
      <motion.div
        className="mt-6 flex w-full max-w-xl flex-col items-center gap-5 lg:items-start"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.33, 1, 0.68, 1],
          delay: revealDelay,
        }}
      >
        <MusicPlayer />
      </motion.div>
    </div>
  );
}
