'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useRef } from 'react';
import HeroPill from './HeroPill';
import CircularCTA from './CircularCTA';

function AnimatedLetter({
  letter,
  revealDelay,
}: {
  letter: string;
  revealDelay: number;
}) {
  const controls = useAnimationControls();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const scheduleGlitch = () => {
      const wait = 3000 + Math.random() * 8000;
      timeoutRef.current = setTimeout(async () => {
        const effects = [
          { rotateX: [0, 180, 360], transition: { duration: 0.5, ease: 'easeInOut' as const } },
          { rotateY: [0, 180, 360], transition: { duration: 0.5, ease: 'easeInOut' as const } },
          { scaleY: [1, 0, 1], transition: { duration: 0.4, ease: 'easeInOut' as const } },
          { skewX: [0, 25, -25, 0], transition: { duration: 0.4, ease: 'easeInOut' as const } },
          { y: [0, -8, 0], rotateZ: [0, -10, 10, 0], transition: { duration: 0.5, ease: 'easeInOut' as const } },
        ];
        const effect = effects[Math.floor(Math.random() * effects.length)];
        await controls.start(effect);
        scheduleGlitch();
      }, wait);
    };

    const startDelay = setTimeout(() => {
      scheduleGlitch();
    }, (revealDelay + 0.6) * 1000);

    return () => {
      clearTimeout(startDelay);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [controls, revealDelay]);

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

interface HeroTextProps {
  name: string;
  tagline: string;
  ctaLabel?: string;
}

export default function HeroText({
  name,
  tagline,
  ctaLabel = "Get in touch",
}: HeroTextProps) {
  const words = name.split(' ');
  let letterIndex = 0;

  return (
    <div className="relative z-20 w-full items-center text-center lg:items-start lg:text-left max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:flex-wrap lg:items-end lg:gap-x-16">
        <h1
          className="text-7xl max-[350px]:text-6xl sm:text-8xl lg:text-[10rem] leading-none font-bold tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
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
                {!isLast ? ' ' : null}
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
          <CircularCTA label={ctaLabel} href="#contact">
            <svg
              className="w-16 h-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </CircularCTA>
        </motion.div>
        <div className="lg:basis-full mt-12">
          <HeroPill tagline={tagline} revealDelay={0.3 + letterIndex * 0.04} />
        </div>
      </div>
    </div>
  );
}
