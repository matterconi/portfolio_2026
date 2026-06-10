'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const CURSOR_SIZE = 32;
const HOVER_SCALE = 2;
const CLICK_SCALE = 0.75;

const SPRING_CONFIG = { stiffness: 150, damping: 20, mass: 0.3 };
const NEON_GLOW = '0 0 20px rgba(0, 255, 255, 0.6), 0 0 60px rgba(0, 255, 255, 0.2)';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, [data-cursor-hover]';

export default function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const [isTouch, setIsTouch] = useState(false);
  const [visible, setVisible] = useState(false);
  const [inViewport, setInViewport] = useState(true);
  const initialized = useRef(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, SPRING_CONFIG);
  const springY = useSpring(mouseY, SPRING_CONFIG);

  // Hover: 0 → 1
  const hoverProgress = useMotionValue(0);
  const smoothHover = useSpring(hoverProgress, { stiffness: 300, damping: 25 });
  const hoverScale = useTransform(smoothHover, [0, 1], [1, HOVER_SCALE]);

  // Click: 0 → 1
  const clickProgress = useMotionValue(0);
  const smoothClick = useSpring(clickProgress, { stiffness: 400, damping: 15 });
  const clickScale = useTransform(smoothClick, [0, 1], [1, CLICK_SCALE]);

  // Combined scale: hover * click
  const scale = useTransform(() => hoverScale.get() * clickScale.get());

  // Glow: interpolate box-shadow from hover progress
  const boxShadow = useTransform(smoothHover, [0, 1], ['0 0 0px rgba(0,255,255,0)', NEON_GLOW]);

  // Offset so the circle is centered on the cursor
  const offsetX = useTransform(springX, (v) => v - CURSOR_SIZE / 2);
  const offsetY = useTransform(springY, (v) => v - CURSOR_SIZE / 2);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!initialized.current) {
        initialized.current = true;
        springX.jump(e.clientX);
        springY.jump(e.clientY);
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        setVisible(true);
        return;
      }
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    },
    [mouseX, mouseY, springX, springY],
  );

  const handleMouseOver = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        hoverProgress.set(1);
      }
    },
    [hoverProgress],
  );

  const handleMouseOut = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        hoverProgress.set(0);
      }
    },
    [hoverProgress],
  );

  const handleMouseDown = useCallback(() => {
    clickProgress.set(1);
  }, [clickProgress]);

  const handleMouseUp = useCallback(() => {
    clickProgress.set(0);
  }, [clickProgress]);

  // Detect touch device
  useEffect(() => {
    const onTouch = () => setIsTouch(true);
    window.addEventListener('touchstart', onTouch, { once: true });
    return () => window.removeEventListener('touchstart', onTouch);
  }, []);

  // Mouse listeners
  useEffect(() => {
    if (isTouch || reducedMotion) return;

    const handleMouseLeave = () => {
      setInViewport(false);
      initialized.current = false;
    };
    const handleMouseEnter = () => setInViewport(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isTouch, reducedMotion, handleMouseMove, handleMouseOver, handleMouseOut, handleMouseDown, handleMouseUp]);

  if (isTouch || reducedMotion || !visible) return null;

  return (
    <motion.div
      animate={{ opacity: inViewport ? 1 : 0 }}
      transition={{ duration: 0.15 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x: offsetX,
        y: offsetY,
        scale,
        boxShadow,
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        borderRadius: '50%',
        backgroundColor: '#fff',
        mixBlendMode: 'difference',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
