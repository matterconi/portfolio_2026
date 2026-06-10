'use client';

import { useEffect, useState, type RefObject } from 'react';

interface StickyCardLayout {
  /** px value for `top` on the sticky container */
  stickyTop: number;
  /** Whether the title should live inside the sticky/masked container */
  titleInside: boolean;
}

/**
 * Measures the card and title elements and decides whether the title fits
 * inside the sticky viewport window together with the card.
 *
 * Threshold: 100dvh - 100px  (mobile < 768px)
 *            100dvh - 200px  (desktop)
 *
 * If card + title < threshold → title is inside; stickyTop centres both.
 * Otherwise                   → title is outside; stickyTop centres card only.
 */
export function useStickyCardLayout(
  cardRef: RefObject<HTMLElement | null>,
  titleRef: RefObject<HTMLElement | null>,
): StickyCardLayout {
  const [layout, setLayout] = useState<StickyCardLayout>({ stickyTop: 0, titleInside: true });

  useEffect(() => {
    const calculate = () => {
      if (!cardRef.current || !titleRef.current) return;

      const vh = window.innerHeight;
      const isMobile = window.innerWidth < 768;
      const margin = isMobile ? 100 : 200;
      const threshold = vh - margin;

      const cardH = cardRef.current.offsetHeight;
      const titleH = titleRef.current.offsetHeight;

      const fits = cardH + titleH < threshold;

      const stickyTop = fits
        ? (vh - cardH - titleH) / 2
        : (vh - cardH) / 2;

      setLayout({ stickyTop, titleInside: fits });
    };

    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, [cardRef, titleRef]);

  return layout;
}
