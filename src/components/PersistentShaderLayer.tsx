'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { persistentShaderRenderer } from '@/lib/persistentShaderRenderer';

export default function PersistentShaderLayer() {
  const pathname = usePathname();
  const isHome = /^\/(en|it)\/?$/.test(pathname);
  const [heroVisible, setHeroVisible] = useState(isHome);
  const heroVisibleRef = useRef(heroVisible);

  useEffect(() => {
    heroVisibleRef.current = heroVisible;
  }, [heroVisible]);

  useEffect(() => {
    if (!isHome) {
      setHeroVisible(false);
      return;
    }

    let frameId: number | null = null;

    const update = () => {
      frameId = null;

      const hero = document.getElementById('home');
      if (!hero) {
        if (!heroVisibleRef.current) setHeroVisible(true);
        return;
      }

      const rect = hero.getBoundingClientRect();
      const topInset = 80;
      const sideInset = 24;
      const bottomInset = 24;
      const nextVisible = rect.bottom > topInset && rect.top < window.innerHeight - bottomInset;

      persistentShaderRenderer.setBounds({
        top: rect.top + topInset,
        left: rect.left + sideInset,
        width: rect.width - sideInset * 2,
        height: rect.height - topInset - bottomInset,
      });

      if (heroVisibleRef.current !== nextVisible) {
        heroVisibleRef.current = nextVisible;
        setHeroVisible(nextVisible);
      }
    };

    const scheduleUpdate = () => {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [isHome]);

  const active = isHome && heroVisible;

  useEffect(() => {
    persistentShaderRenderer.setActive(active);
  }, [active]);

  return null;
}
