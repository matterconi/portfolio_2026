"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

// ── Scroll-driven letter ──
function ScrollRevealLetter({
  letter,
  progress,
  range,
}: {
  letter: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="inline-block overflow-hidden align-bottom" style={{ perspective: "600px" }}>
      <motion.span className="inline-block" style={{ opacity }}>
        {letter}
      </motion.span>
    </span>
  );
}

// ── Time-based letter (whileInView + stagger) ──
function TimeRevealLetter({
  letter,
  delay,
}: {
  letter: string;
  delay: number;
}) {
  return (
    <span className="inline-block overflow-hidden align-bottom" style={{ perspective: "600px" }}>
      <motion.span
        className="inline-block"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.05, delay }}
      >
        {letter}
      </motion.span>
    </span>
  );
}

interface DemoTitleRevealProps {
  text: string;
  scrollProgress?: MotionValue<number>;
  className?: string;
  /** When set, uses time-based animation (seconds) instead of scroll-driven */
  timeBased?: number;
}

export function DemoTitleReveal({ text, scrollProgress, className, timeBased }: DemoTitleRevealProps) {
  const fallbackRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress: fallbackProgress } = useScroll({
    target: fallbackRef,
    offset: ["start 0.9", "end 0.8"],
  });

  const progress = scrollProgress ?? fallbackProgress;

  const chars = text.split("");
  const totalChars = chars.filter((c) => c !== " ").length;

  let charIndex = 0;

  return (
    <h2
      ref={fallbackRef}
      className={`font-bold tracking-wide text-white text-left ${className ?? ""}`}
    >
      {chars.map((char, i) => {
        if (char === " ") return <span key={i}>&nbsp;</span>;
        const idx = charIndex++;

        if (timeBased != null) {
          const delay = (idx / totalChars) * timeBased;
          return <TimeRevealLetter letter={char} delay={delay} key={i} />;
        }

        const start = idx / totalChars;
        const end = (idx + 1) / totalChars;
        return <ScrollRevealLetter letter={char} progress={progress} range={[start, end]} key={i} />;
      })}
    </h2>
  );
}
