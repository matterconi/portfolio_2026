"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

type Mode = "word" | "char";

const Word = ({ children, progress, range, isLast }: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  isLast: boolean;
}) => {
  const color = useTransform(progress, range, [
    "rgba(255, 255, 255, 0.2)",
    "rgba(255, 255, 255, 1)",
  ]);

  return (
    <motion.span
      style={{ color }}
      className={`inline-block ${!isLast ? "mr-[0.25em]" : ""}`}
    >
      {children}
    </motion.span>
  );
};

const Char = ({ children, progress, range }: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) => {
  const color = useTransform(progress, range, [
    "rgba(255, 255, 255, 0.2)",
    "rgba(255, 255, 255, 1)",
  ]);

  return (
    <motion.span style={{ color }} className="inline-block">
      {children}
    </motion.span>
  );
};

const mode: Mode = "char";

export default function ScrollRevealText({ lines }: { lines: string[] }) {
  const textRef = useRef(null);
  
    const { scrollYProgress } = useScroll({
      target: textRef,
      offset: ["start 0.8", "start 0.3"],
    });
  
    const totalWords = lines.reduce((acc, l) => acc + l.split(" ").length, 0);
    const totalChars = lines.reduce((acc, l) => acc + l.replace(/ /g, "").length, 0);
    const totalUnits = mode === "word" ? totalWords : totalChars;

  return (
<div className="flex flex-col items-center gap-2 pb-16" ref={textRef}>
        {lines.map((line, lineIndex) => {
          const words = line.split(" ");
          const wordsBefore = lines
            .slice(0, lineIndex)
            .reduce((acc, l) => acc + l.split(" ").length, 0);
          const charsBefore = lines
            .slice(0, lineIndex)
            .reduce((acc, l) => acc + l.replace(/ /g, "").length, 0);

          let charIndex = charsBefore;

          return (
            <h3
              key={lineIndex}
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide text-center"
            >
              {mode === "word"
                ? words.map((word, i) => {
                    const start = (wordsBefore + i) / totalUnits;
                    const end = (wordsBefore + i + 1) / totalUnits;

                    return (
                      <Word
                        key={i}
                        progress={scrollYProgress}
                        range={[start, end]}
                        isLast={i === words.length - 1}
                      >
                        {word}
                      </Word>
                    );
                  })
                : words.map((word, wordIdx) => (
                    <span
                      key={wordIdx}
                      className={`inline-block ${wordIdx < words.length - 1 ? "mr-[0.25em]" : ""}`}
                    >
                      {word.split("").map((char, charIdx) => {
                        const start = charIndex / totalUnits;
                        const end = (charIndex + 1) / totalUnits;
                        charIndex++;

                        return (
                          <Char
                            key={charIdx}
                            progress={scrollYProgress}
                            range={[start, end]}
                          >
                            {char}
                          </Char>
                        );
                      })}
                    </span>
                  ))}
            </h3>
          );
        })}
      </div>
  );
}
