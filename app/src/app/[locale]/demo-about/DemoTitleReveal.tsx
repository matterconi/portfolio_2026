"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

function RevealLetter({
  letter,
  progress,
  range,
}: {
  letter: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  // TODO: derive y from progress and range
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className="inline-block overflow-hidden align-bottom" style={{ perspective: "600px" }}>
      <motion.span
        className="inline-block"
        style={{opacity}}
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
}

export function DemoTitleReveal({ text, scrollProgress, className }: DemoTitleRevealProps) {
  const fallbackRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress: fallbackProgress } = useScroll({
    target: fallbackRef,
    offset: ["start 0.9", "start 0.2"],
  });

  const progress = scrollProgress ?? fallbackProgress;

  // TODO: split text, calculate totalChars, charIndex, ranges
  const chars = text.split("");
  const totalChars = chars.filter((c) => c !== " ").length;

  let charIndex = 0;

  return (
    <h2
      ref={fallbackRef}
      className={`font-bold tracking-wide text-white text-left ${className ?? ""}`}
      style={{ fontFamily: "'Clash Display', sans-serif" }}
    >
      {/* TODO: map chars → RevealLetter with calculated ranges */}
      {chars.map((char, i) => {
        if (char === " ") return <span key={i}>&nbsp;</span>
        const start = charIndex / totalChars
        const end = (charIndex + 1) / totalChars
        charIndex ++;
        return <RevealLetter letter={char} progress={progress} range={[start, end]} key={i}/>
      })}
    </h2>
  );
}
