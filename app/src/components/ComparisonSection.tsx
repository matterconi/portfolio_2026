'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

interface ComparisonSectionProps {
  translations: {
    title: string;
    description: string;
    aiLabel: string;
    devLabel: string;
  };
}

export default function ComparisonSection({ translations }: ComparisonSectionProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const imageMotionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [sliderX, setSliderX] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  /* Entry phase: 0 = enters from below, 1 = reaches top (sticky activates) */
  const { scrollYProgress: entryProgress } = useScroll({
    target: outerRef,
    offset: ['start end', 'start start'],
  });

  /* Sticky phase: 0 = sticky just activated, 1 = section exits */
  const { scrollYProgress: stickyProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  const scale = useTransform(entryProgress, [0, 1], [0.45, 1.0]);
  const borderRadius = useTransform(entryProgress, [0, 1], [48, 16]);

  /* Text fades in during first 20% of sticky phase */
  const textOpacity = useTransform(stickyProgress, [0, 0.2], [0, 1]);

  useMotionValueEvent(stickyProgress, 'change', () => {
    if (textRef.current) {
      textRef.current.style.opacity = String(textOpacity.get());
    }
  });

  const updateSlider = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSliderX(Math.max(2, Math.min(98, x)));
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateSlider(e.clientX);
  }, [updateSlider]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  }, [isDragging, updateSlider]);

  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none';
      return () => { document.body.style.userSelect = ''; };
    }
  }, [isDragging]);

  return (
    <div ref={outerRef} className="relative z-20" style={{ height: '250vh', marginTop: '-100vh' }}>
      <div className="sticky top-0 h-screen w-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            ref={imageMotionRef}
            style={{ scale, borderRadius }}
            className="absolute inset-0 overflow-hidden border border-white/10 will-change-transform"
          >
            <div
              ref={sliderRef}
              className="absolute inset-0 cursor-col-resize"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {/* Developer video */}
              <div className="absolute inset-0">
                <video src="/videos/dev.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover" />
              </div>

              {/* AI video (clipped by slider) */}
              <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}>
                <video src="/videos/ai.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover" />
              </div>

              {/* Frosted glass text — fades in during sticky phase */}
              <div
                ref={textRef}
                className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
                style={{ opacity: 0 }}
              >
                <div className="rounded-2xl border border-white/15 bg-black/40 px-8 py-5 backdrop-blur-md">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                    {translations.title}
                  </h2>
                </div>
              </div>

              {/* Slider line + handle */}
              <div
                className="pointer-events-none absolute bottom-0 top-0 z-10 w-0.5 bg-white/80"
                style={{ left: `${sliderX}%` }}
              >
                <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-black/60 backdrop-blur-sm">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
                    <path d="M7 4L3 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13 4L17 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
