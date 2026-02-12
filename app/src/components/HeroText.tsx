'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useRef, useCallback } from 'react';
import HeroPill from './HeroPill';

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
          animate={{ y: 0 }}
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

export default function HeroText({
  name,
  tagline,
}: {
  name: string;
  tagline: string;
}) {
  const words = name.split(' ');
  let letterIndex = 0;

  return (
    <div className="relative z-10 w-full items-center text-center lg:items-start lg:text-left max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:flex-wrap lg:items-end lg:gap-x-16">
        <h1
          style={{ fontFamily: "'Clash Display', sans-serif" }}
          className="text-8xl sm:text-[10rem] leading-none font-bold tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          {words.map((word, wi) => {
            const isLast = wi === words.length - 1;
            const wordLetters = word.split('').map((letter, li) => {
              const delay = 0.3 + letterIndex * 0.04;
              letterIndex++;
              return (
                <AnimatedLetter key={li} letter={letter} revealDelay={delay} />
              );
            });
            letterIndex++;
            return (
              <span key={wi} className={`block ${isLast ? 'italic' : ''}`}>
                {wordLetters}
              </span>
            );
          })}
        </h1>
        <motion.div
          className="order-last lg:order-0 mt-16 lg:mt-0 lg:mb-4 flex justify-center lg:justify-start shrink-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.33, 1, 0.68, 1],
            delay: 0.3 + letterIndex * 0.04 + 0.3,
          }}
        >
          <a
            href="#contact"
            className="group relative inline-flex items-center justify-center w-36 h-36 rounded-full border border-white/10 bg-black/80 backdrop-blur-sm transition-all hover:border-accent-cyan/40 hover:shadow-[0_0_30px_rgba(0,255,200,0.1)] active:scale-95"
          >
            <svg
              className="absolute inset-0 w-full h-full animate-[spin_12s_linear_infinite]"
              viewBox="0 0 144 144"
            >
              <defs>
                <path
                  id="circlePath"
                  d="M 72,72 m -56,0 a 56,56 0 1,1 112,0 a 56,56 0 1,1 -112,0"
                />
              </defs>
              <text
                fill="currentColor"
                className="text-foreground-muted text-[13px] uppercase tracking-[0.3em]"
                style={{ fontFamily: "'Zodiak', serif" }}
              >
                <textPath href="#circlePath">
                  Get in touch · Get in touch ·&nbsp;
                </textPath>
              </text>
            </svg>
            <svg
              className="relative w-16 h-16 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </motion.div>
        <div className="lg:basis-full">
          <HeroPill tagline={tagline} revealDelay={0.3 + letterIndex * 0.04} />
        </div>
      </div>
    </div>
  );
}
