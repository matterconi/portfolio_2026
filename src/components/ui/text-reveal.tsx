"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const cn = (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(" ");

interface TextRevealProps {
  text: string;
  emphasize?: string[];
  scrollProgress?: MotionValue<number>;
  className?: string;
  revealedClassName?: string;
  /** Element rendered inside the text flow with float (e.g. a profile image on tablet) */
  floatingElement?: ReactNode;
}

export function TextReveal({ text, emphasize = [], scrollProgress, className, revealedClassName = "text-foreground-muted", floatingElement }: TextRevealProps) {
  const fallbackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: fallbackProgress } = useScroll({
    target: fallbackRef,
    offset: ["start 0.8", "end 0.8"],
  });

  const progress = scrollProgress ?? fallbackProgress;
  const emphasisSet = new Set(emphasize);
  const words = text.split(" ");
  const totalWords = words.length;

  return (
    <div ref={fallbackRef} className={cn("relative", className)}>
      <div
        className="text-xl sm:text-2xl leading-relaxed font-medium"
      >
        {floatingElement}
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
              revealedClassName={revealedClassName}
            >
              {word}
            </Word>
          );
        })}
      </div>
    </div>
  );
}

function Word({
  children,
  progress,
  range,
  totalWords,
  emphasized,
  revealedClassName,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  totalWords: number;
  emphasized: boolean;
  revealedClassName: string;
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
            ? "italic bg-accent-cyan/30 px-1 mx-1 rounded"
            : revealedClassName
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
