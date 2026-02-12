'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { TextReveal } from '@/components/ui/text-reveal';
import type { AboutContent } from '@data/types';

interface AboutSectionProps {
  title: string;
  about: AboutContent;
}

// Nothing visible before this scroll %
const ENTER_AT = 0.08;
const TEXT_START = 0.23;

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

export default function AboutSection({ title, about }: AboutSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scrollProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const [titleVisible, setTitleVisible] = useState(false);
  const [passionsVisible, setPassionsVisible] = useState(false);

  useMotionValueEvent(scrollProgress, 'change', (p) => {
    setTitleVisible(p >= ENTER_AT);
    setPassionsVisible(p >= 0.92);
  });

  // Ramp: 0→TEXT_START = -1→0 (blocks fade in gradually), TEXT_START→1 = 0→1 (text reveal)
  const textProgress = useTransform(scrollProgress, [0, TEXT_START, 1], [-1, 0, 1]);

  let letterIndex = 0;

  return (
    <section id="about" ref={sectionRef} className="relative px-6 sm:px-8" style={{ height: '350vh' }}>
      <div className="sticky top-0 flex flex-col py-24">
        {/* Titolo con letter reveal — stessa animazione della Hero */}
        <div className="w-full max-w-5xl mx-auto">
          <h2
            className="mb-8 text-5xl sm:text-6xl font-bold tracking-tighter text-white text-left"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            <AnimatePresence>
              {titleVisible &&
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
        </div>

        {/* Bio + Passions */}
        <div className="w-full max-w-4xl mx-auto">
          <TextReveal
            text={about.bio.join(' ')}
            scrollProgress={textProgress}
            emphasize={[
              // EN
              'technology', 'creativity', 'blockchain', '3D',
              'performant', 'Web3', 'generative', 'open-source',
              // IT
              'tecnologia', 'creatività', 'blockchain', '3D',
              'performanti', 'Web3', 'generativa', 'open-source',
            ]}
          />

          {/* Passions Grid — sempre nel DOM, staggered per card */}
          {about.passions.length > 0 && (
            <div className="mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {about.passions.map((passion, i) => (
                  <motion.div
                    key={passion}
                    animate={{
                      opacity: passionsVisible ? 1 : 0,
                      y: passionsVisible ? 0 : 24,
                    }}
                    transition={{ duration: 0.4, delay: passionsVisible ? i * 0.1 : 0 }}
                    className="flex items-center gap-3 rounded border border-border-subtle bg-background-elevated px-4 py-3"
                  >
                    <span className="text-accent-green">▸</span>
                    <span className="text-sm text-foreground-muted">{passion}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
