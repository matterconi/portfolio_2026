'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ComparisonSectionProps {
  translations: {
    title: string;
    description: string;
    aiLabel: string;
    devLabel: string;
  };
}

export default function ComparisonSection({ translations }: ComparisonSectionProps) {
  const outerRef  = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderX, setSliderX]       = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  /* Sticky phase: 0 = section top hits viewport top, 1 = section exits */
  const { scrollYProgress: stickyProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  // ── Sticky timeline (section = 250 vh → sticky scroll = 150 vh) ──────────
  //
  //  0.00 → 0.08   video incorniciato visibile (nessuna mask)          ~12 vh
  //  0.08 → 0.12   mask fade-in a scale 80                             ~6 vh
  //  0.12 → 0.55   mask scala 80 → 1.1  (spark si rivela)             ~64 vh
  //  0.55 → 0.72   hold
  //  0.72 → 0.85   mask fade-out
  //  0.85 → 1.00   slider visibile e interattivo

  const maskOpacity = useTransform(stickyProgress, [0, 0.08, 0.12, 0.72, 0.85], [0, 0, 1, 1, 0]);
  const maskScale   = useTransform(stickyProgress, [0.12, 0.55], [80, 1.1]);

  // ── Slider interaction ─────────────────────────────────────────────────────
  const updateSlider = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    setSliderX(Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateSlider(e.clientX);
  }, [updateSlider]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isDragging) updateSlider(e.clientX);
  }, [isDragging, updateSlider]);

  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none';
      return () => { document.body.style.userSelect = ''; };
    }
  }, [isDragging]);

  return (
    <div ref={outerRef} style={{ height: '250vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── Video con inset + bordi arrotondati (stato iniziale fisso) ──── */}
        <div className="absolute inset-3 overflow-hidden rounded-2xl border border-white/10">
          <div
            ref={sliderRef}
            className="absolute inset-0 cursor-col-resize"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <div className="absolute inset-0">
              <video src="/videos/dev.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}>
              <video src="/videos/ai.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover" />
            </div>
            <div
              className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white/80"
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
        </div>

        {/* ── Spark mask: parte a scale(80) e si restringe a scale(1.1) ────── */}
        <motion.div
          style={{ opacity: maskOpacity }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <motion.img
            src="/spark-mask.svg"
            alt=""
            style={{ scale: maskScale }}
            className="min-h-full min-w-full object-cover will-change-transform"
          />
        </motion.div>

      </div>
    </div>
  );
}
