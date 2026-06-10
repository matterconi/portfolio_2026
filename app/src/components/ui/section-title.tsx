'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  visible: boolean;
  className?: string;
}

function RevealLetter({ letter, delay }: { letter: string; delay: number }) {
  return (
    <span className="inline-block overflow-hidden align-bottom" style={{ perspective: '600px' }}>
      <motion.span
        className="inline-block"
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        exit={{ y: '110%' }}
        transition={{
          duration: 0.6,
          ease: [0.33, 1, 0.68, 1],
          delay,
        }}
      >
        {letter}
      </motion.span>
    </span>
  );
}

export function SectionTitle({ title, visible, className = '' }: SectionTitleProps) {
  let letterIndex = 0;

  return (
    <h2
      className={`font-bold tracking-wide text-white text-left ${className}`}
    >
      <AnimatePresence>
        {visible &&
          title.split('').map((char, i) => {
            if (char === ' ') {
              letterIndex++;
              return <span key={i}>&nbsp;</span>;
            }
            const delay = 0.05 + letterIndex * 0.04;
            letterIndex++;
            return <RevealLetter key={i} letter={char} delay={delay} />;
          })}
      </AnimatePresence>
    </h2>
  );
}
