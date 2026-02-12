"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface TextRevealProps {
  text: string;
  emphasize?: string[];
  scrollProgress?: MotionValue<number>;
  className?: string;
}

export function TextReveal({ text, emphasize = [], scrollProgress, className }: TextRevealProps) {
  const fallbackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: fallbackProgress } = useScroll({
    target: fallbackRef,
    offset: ["start 0.9", "start 0.2"],
  });

  const progress = scrollProgress ?? fallbackProgress;
  const emphasisSet = new Set(emphasize);
  const words = text.split(" ");
  const totalWords = words.length;

  return (
    <div ref={fallbackRef} className={className}>
      <p
        className="text-xl sm:text-2xl leading-relaxed font-medium flex flex-wrap"
        style={{ fontFamily: "'Clash Display', sans-serif" }}
      >
        {words.map((word, i) => {
          const start = i / totalWords;
          const end = start + 1 / totalWords;
          const bare = word.replace(/[.,;:!?]+$/, "");
          const emphasized = emphasisSet.has(word) || emphasisSet.has(bare);
          return (
            <Word
              key={i}
              progress={progress}
              range={[start, end]}
              totalWords={totalWords}
              emphasized={emphasized}
            >
              {word}
            </Word>
          );
        })}
      </p>
    </div>
  );
}

function Word({
  children,
  progress,
  range,
  totalWords,
  emphasized,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  totalWords: number;
  emphasized: boolean;
}) {
  const wordStart = range[0];
  const wordEnd = range[1];
  const wordSize = 1 / totalWords;
  const visibleWindow = wordSize * 10;

  const blockOpacity = useTransform(progress, (p: number) => {
    if (p >= wordEnd) return 0;
    const distance = wordStart - p;
    if (distance < 0) return 1;
    const fade = distance / visibleWindow;
    if (fade >= 1) return 0;
    return 1 - fade;
  });

  const textOpacity = useTransform(progress, (p: number) => {
    if (p < 0) return 0;
    return p >= wordEnd ? 1 : 0;
  });

  return (
    <span className="relative mr-[0.25em] mt-[0.15em] inline-block">
      <motion.span
        className={
          emphasized
            ? "italic text-accent-cyan bg-accent-cyan/30 px-1 -mx-0.5 rounded"
            : "text-foreground-muted"
        }
        style={{ opacity: textOpacity }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute inset-0 rounded-sm bg-foreground-subtle"
        style={{ opacity: blockOpacity }}
        aria-hidden
      />
    </span>
  );
}
