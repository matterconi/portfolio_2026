'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useRef, useCallback } from 'react';

function AnimatedLetter({
  letter,
  revealDelay,
}: {
  letter: string;
  revealDelay: number;
}) {
  const controls = useAnimationControls();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const scheduleGlitch = useCallback(() => {
    const wait = 3000 + Math.random() * 8000;
    timeoutRef.current = setTimeout(async () => {
      const effects = [
        { rotateX: [0, 180, 360], transition: { duration: 0.5, ease: 'easeInOut' } },
        { rotateY: [0, 180, 360], transition: { duration: 0.5, ease: 'easeInOut' } },
        { scaleY: [1, 0, 1], transition: { duration: 0.4, ease: 'easeInOut' } },
        { skewX: [0, 25, -25, 0], transition: { duration: 0.4, ease: 'easeInOut' } },
        { y: [0, -8, 0], rotateZ: [0, -10, 10, 0], transition: { duration: 0.5, ease: 'easeInOut' } },
      ];
      const effect = effects[Math.floor(Math.random() * effects.length)];
      await controls.start(effect);
      scheduleGlitch();
    }, wait);
  }, [controls]);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      scheduleGlitch();
    }, (revealDelay + 0.6) * 1000);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(timeoutRef.current);
    };
  }, [revealDelay, scheduleGlitch]);

  return (
    <span className="inline-block overflow-hidden align-bottom" style={{ perspective: '600px' }}>
      <motion.span
        className="inline-block"
        animate={controls}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.span
          className="inline-block"
          initial={{ y: '100%' }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            ease: [0.33, 1, 0.68, 1],
            delay: revealDelay,
          }}
        >
          {letter}
        </motion.span>
      </motion.span>
    </span>
  );
}

export default function FooterName() {
  const words = ['MATTEO', 'MARCONI'];
  let letterIndex = 0;

  return (
    <h2
      className="text-7xl max-[350px]:text-6xl sm:text-8xl lg:text-[10rem] leading-none font-bold tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
      style={{ fontFamily: "'Clash Display', sans-serif" }}
    >
      {words.map((word, wi) => {
        const wordLetters = word.split('').map((letter, li) => {
          const delay = letterIndex * 0.04;
          letterIndex++;
          return <AnimatedLetter key={li} letter={letter} revealDelay={delay} />;
        });
        letterIndex++;
        return (
          <span key={wi} className={`block ${wi === 1 ? 'italic' : ''}`}>
            {wordLetters}
          </span>
        );
      })}
    </h2>
  );
}
