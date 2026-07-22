"use client";

import { Children, type ReactNode } from "react";
import {
  domAnimation,
  LazyMotion,
  MotionConfig,
  useReducedMotion,
  useScroll,
} from "motion/react";
import * as m from "motion/react-m";

const softEase = [0.16, 1, 0.3, 1] as const;
const viewport = { once: true, amount: 0.16, margin: "0px 0px -6% 0px" } as const;
const waveWord = {
  hidden: { opacity: 0, y: "118%", rotate: 2.4, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: "0%",
    rotate: 0,
    filter: "blur(0px)",
    transition: { duration: 0.92, ease: softEase },
  },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
};

function useReveal(delay: number, distance: number) {
  const shouldReduceMotion = useReducedMotion();

  return {
    initial: shouldReduceMotion ? false : { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    viewport,
    transition: shouldReduceMotion
      ? { duration: 0 }
      : { duration: 0.82, delay, ease: softEase },
  } as const;
}

export function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <m.div
      className="scroll-progress"
      style={{ scaleX: scrollYProgress }}
      aria-hidden="true"
    />
  );
}

export function Reveal({ children, className, delay = 0, distance = 16 }: RevealProps) {
  return (
    <m.div className={className} {...useReveal(delay, distance)}>
      {children}
    </m.div>
  );
}

export function RevealArticle({ children, className, delay = 0, distance = 14 }: RevealProps) {
  return (
    <m.article className={className} {...useReveal(delay, distance)}>
      {children}
    </m.article>
  );
}

function WaveWords({ text }: { text: string }) {
  return text.split(" ").map((word, index) => (
    <span className="wave-word-clip" key={`${word}-${index}`}>
      <m.span className="wave-word" variants={waveWord}>
        {word}
      </m.span>
    </span>
  ));
}

export function HeroTitle({ children }: { children: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.h1
      className="wave-heading hero-wave-title"
      variants={{
        hidden: {},
        visible: { transition: { delayChildren: 0.08, staggerChildren: 0.075 } },
      }}
      initial={shouldReduceMotion ? false : "hidden"}
      animate={shouldReduceMotion ? undefined : "visible"}
    >
      <WaveWords text={children} />
    </m.h1>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  className = "",
  delay = 0,
  headingLevel = "h2",
}: {
  eyebrow: string;
  title: string;
  className?: string;
  delay?: number;
  headingLevel?: "h1" | "h2";
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      className={`section-title title-reveal ${className}`.trim()}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={viewport}
    >
      <m.span
        variants={{
          hidden: { opacity: 0, x: -10 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.65, delay, ease: softEase },
          },
        }}
      >
        {eyebrow}
      </m.span>
      {headingLevel === "h1" ? (
        <m.h1
          className="wave-heading"
          variants={{
            hidden: {},
            visible: {
              transition: {
                delayChildren: delay + 0.1,
                staggerChildren: 0.09,
              },
            },
          }}
        >
          <WaveWords text={title} />
        </m.h1>
      ) : (
        <m.h2
          className="wave-heading"
          variants={{
            hidden: {},
            visible: {
              transition: {
                delayChildren: delay + 0.1,
                staggerChildren: 0.09,
              },
            },
          }}
        >
          <WaveWords text={title} />
        </m.h2>
      )}
    </m.div>
  );
}

export function FadeArticle({ children, className, delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.article
      className={className}
      initial={
        shouldReduceMotion ? false : { opacity: 0, scale: 0.98, filter: "blur(8px)" }
      }
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={viewport}
      transition={
        shouldReduceMotion ? { duration: 0 } : { duration: 0.92, delay, ease: softEase }
      }
    >
      {children}
    </m.article>
  );
}

export function SlideArticle({
  children,
  className,
  delay = 0,
  direction = "left",
}: RevealProps & { direction?: "left" | "right" }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.article
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, x: direction === "left" ? -34 : 34 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ ...viewport, amount: 0.22 }}
      transition={
        shouldReduceMotion ? { duration: 0 } : { duration: 0.95, delay, ease: softEase }
      }
    >
      {children}
    </m.article>
  );
}

const stackContainer = {
  hidden: { opacity: 0, scale: 0.985 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.68,
      delay,
      ease: softEase,
      delayChildren: delay + 0.14,
      staggerChildren: 0.09,
    },
  }),
};

const stackItem = {
  hidden: { opacity: 0, y: 11, scale: 0.93 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.58, ease: softEase } },
};

export function StackGroup({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: ReactNode;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.article
      className="stack-group"
      custom={delay}
      variants={stackContainer}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ ...viewport, amount: 0.22 }}
    >
      <m.h3 variants={stackItem}>{title}</m.h3>
      <m.div className="tech-chips">
        {Children.toArray(children).map((child, index) => (
          <m.span className="tech-chip" variants={stackItem} key={index}>
            {child}
          </m.span>
        ))}
      </m.div>
    </m.article>
  );
}
