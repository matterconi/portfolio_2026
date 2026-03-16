'use client';

import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';

const WaterPlaneShader = dynamic(() => import('./WaterPlaneShader'), {
  ssr: false,
});

const REPEAT = 5;
const TEXT = 'MY PROJECTS';
const SEPARATOR = ' ✦ ';

interface ScrollBannerProps {
  reveal?: boolean;
}

export default function ScrollBanner({ reveal = true }: ScrollBannerProps) {
  // Track global page scroll so the text moves during the sticky reveal too
  const { scrollYProgress } = useScroll();

  const x = useTransform(scrollYProgress, [0, 1], ['10%', '-60%']);

  const repeated = Array.from({ length: REPEAT })
    .map(() => TEXT)
    .join(SEPARATOR) + SEPARATOR;

  return (
    <section className={reveal ? 'banner-reveal-section' : undefined}>
      <div className="relative mx-auto my-16 max-w-7xl overflow-hidden rounded-2xl select-none">
        {/* Shader background */}
        <div className="absolute inset-0">
          <WaterPlaneShader />
        </div>

        {/* Scrolling text */}
        <div className="relative z-10 py-10">
          <motion.p
            style={{ x }}
            className="whitespace-nowrap text-[clamp(3rem,8vw,7rem)] font-black uppercase leading-none tracking-tight text-white mix-blend-overlay"
          >
            {repeated}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
