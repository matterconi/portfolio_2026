'use client';

import { useRef } from 'react';
import { useScroll, useTransform, useMotionValueEvent, MotionValue } from 'framer-motion';
import { useState } from 'react';

const PANEL_COUNT = 3;

interface UseHorizontalScrollReturn {
  /** 0–1 progress through the entire scroll-lock region */
  scrollProgress: MotionValue<number>;
  /** Horizontal translateX percentage (0 → -200) for the panel strip */
  translateX: MotionValue<number>;
  /** Index of the currently active panel (0, 1, or 2) */
  currentPanel: number;
  /** Ref to attach to the tall outer wrapper that creates scroll space */
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useHorizontalScroll(): UseHorizontalScrollReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPanel, setCurrentPanel] = useState(0);

  // Track scroll progress within the tall container (0 at top, 1 at bottom)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map vertical scroll progress (0–1) to horizontal translateX (0% → -200%)
  // Panel 0: 0%, Panel 1: -100%, Panel 2: -200%
  const translateX = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(PANEL_COUNT - 1) * 100]
  );

  // Derive current panel index from scroll progress
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const panelIndex = Math.min(
      PANEL_COUNT - 1,
      Math.floor(latest * PANEL_COUNT)
    );
    setCurrentPanel(panelIndex);
  });

  return {
    scrollProgress: scrollYProgress,
    translateX,
    currentPanel,
    containerRef,
  };
}
