'use client';

import { useState, useEffect } from 'react';

export function useActiveProject(slugs: string[]): string | null {
  const [activeSlug, setActiveSlug] = useState<string | null>(slugs[0] ?? null);

  useEffect(() => {
    if (slugs.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.getAttribute('data-slug'));
          }
        }
      },
      {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px',
      }
    );

    for (const slug of slugs) {
      const el = document.querySelector(`[data-slug="${slug}"]`);
      if (el) {
        observer.observe(el);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [slugs]);

  return activeSlug;
}
