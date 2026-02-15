'use client';

import { useEffect, useRef, useState } from 'react';
import { CARDS, Card } from './cards';
import { useScroll, useTransform, motion, useMotionTemplate } from 'framer-motion';

export default function HorizontalDemo() {
  const [overflow, setOverflow] = useState(0);
  const [stickyTop, setStickyTop] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -overflow]);

  useEffect(() => {
    const calculate = () => {
      if (!cardRef.current) return;
      const paddingRightString = window.getComputedStyle(cardRef.current);
      const paddingRight = parseFloat(paddingRightString.paddingRight)
      setOverflow(cardRef.current.scrollWidth - cardRef.current.clientWidth + paddingRight);
      setStickyTop((window.innerHeight - cardRef.current.offsetHeight) / 2);
    };

    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, []);

  const leftFade = useTransform(scrollYProgress, [0, 0.02], [0, 100]);
  const rightFade = useTransform(scrollYProgress, [0.98, 1], [100, 0]);

  const maskImage = useMotionTemplate`linear-gradient(to right, transparent, black ${leftFade}px, black calc(100% - ${rightFade}px), transparent)`;


  return (
    <main className="min-h-screen bg-slate-500 text-white px-32">
      <section className="flex h-screen items-center justify-center">
        <h1 className="text-4xl font-bold text-white/20">Scroll down</h1>
      </section>

      <div ref={wrapperRef} className="relative h-[300vh]">
        <motion.div
          className="sticky overflow-hidden"
          style={{
            top: stickyTop,
            maskImage,
            WebkitMaskImage: maskImage,
          }}
        >
          <motion.div
            className="flex items-center gap-8 px-12"
            ref={cardRef}
            style={{ x }}
          >
            {CARDS.map((card) => (
              <Card key={card.id} card={card} />
            ))}
          </motion.div>
        </motion.div>
      </div>

      <section className="flex h-screen items-center justify-center">
        <h1 className="text-4xl font-bold text-white/20">End</h1>
      </section>
    </main>
  );
}
