'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

export default function DemoChessPage() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // TODO: scroll logic here
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end']
  })

  const bgColor = useTransform(scrollYProgress, [0, 0.5], ['rgb(10, 10, 10)', 'rgba(15, 40, 15)']);
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.5, 1], [0, 0, 1, 1]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Spacer top */}
      <div className="h-screen flex items-center justify-center">
        <p className="text-foreground-subtle text-lg" style={{ fontFamily: "'Clash Display', sans-serif" }}>
          Scrolla giù
        </p>
      </div>

      {/* Chess section demo */}
      <section ref={sectionRef} className="relative" style={{ height: '300vh' }}>
        <motion.div className="sticky top-0 h-screen flex items-center justify-center" style={{ backgroundColor: bgColor }}>
          <motion.p className="text-4xl font-bold" style={{ opacity }}>♟ Contenuto Chess</motion.p>
        </motion.div>
      </section>

      {/* Spacer bottom */}
      <div className="h-screen flex items-center justify-center">
        <p className="text-foreground-subtle text-lg" style={{ fontFamily: "'Clash Display', sans-serif" }}>
          Scrolla su
        </p>
      </div>
    </div>
  );
}
