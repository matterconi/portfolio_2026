"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

// ── Word component ──────────────────────────────────────────
// Each word has two layers:
//   1. The actual text (opacity: 0 → 1 when scroll passes the word)
//   2. A colored block behind it (fades in as the word approaches, disappears when revealed)

function Word({
  children,
  progress,
  range,
  totalWords,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  totalWords: number;
}) {
  const [wordStart, wordEnd] = range;
  const wordSize = 1 / totalWords;
  const visibleWindow = wordSize * 10; // ~10 words of lookahead

  const textOpacity = useTransform(progress, (p) => {
    if (p < 0) return 0;
    if (p >= wordEnd) return 1;
    return 0;
  })

  const blockOpacity = useTransform(progress, (p) => {
    if (p < 0) return 0;
    if (p >= wordEnd) return 0;
    const distance = wordStart - p 
    if (distance < 0) return 1;
    const fade = distance / visibleWindow;
    if (fade >= 1) return 0;
    return 1 - fade;
  })

  return (
    <span className="relative mr-[0.25em] mt-[0.15em] inline-block">
      {/* Layer 1: actual text — hidden until scroll reaches this word */}
      <motion.span
        className="text-foreground-muted"
        // TODO: style={{ opacity: textOpacity }}
        style={{opacity: textOpacity}}
      >
        {children}
      </motion.span>

      {/* Layer 2: colored block — fades in before text, disappears when text appears */}
      <motion.span
        className="absolute inset-0 rounded-sm bg-foreground-subtle"
        // TODO: style={{ opacity: blockOpacity }}
      style={{opacity: blockOpacity}}
        aria-hidden
      />
    </span>
  );
}

// ── Main component ──────────────────────────────────────────

interface DemoTextRevealProps {
  text: string;
  scrollProgress?: MotionValue<number>; // if provided, use this (timeline mode)
  className?: string;
}

export function DemoTextReveal({ text, scrollProgress, className }: DemoTextRevealProps) {
  // Fallback: if no external progress, create own scroll tracking
  const fallbackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: fallbackProgress } = useScroll({
    target: fallbackRef,
    offset: ["start 0.9", "start 0.2"],
  });

  const progress = scrollProgress ?? fallbackProgress;
  const words = text.split(" ");
  const totalWords = words.length;

  return (
    <div ref={fallbackRef} className={className}>
      <p
        className="text-xl sm:text-2xl leading-relaxed font-medium flex flex-wrap"
      >
        {words.map((word, i) => {
          const start = i / totalWords;
          const end = (i + 1) / totalWords;

          return (
            <Word
              key={i}
              progress={progress}
              range={[start, end]}
              totalWords={totalWords}
            >
              {word}
            </Word>
          );
        })}
      </p>
    </div>
  );
}
