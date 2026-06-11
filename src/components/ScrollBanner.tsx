'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

const REPEAT = 5;
const TEXT = 'MY PROJECTS';
const SEPARATOR = ' ✦ ';

interface ScrollBannerProps {
  reveal?: boolean;
}

export default function ScrollBanner({ reveal = true }: ScrollBannerProps) {
  const { scrollYProgress } = useScroll();

  const x = useTransform(scrollYProgress, [0, 1], ['20%', '-80%']);

  const repeated = Array.from({ length: REPEAT })
    .map(() => TEXT)
    .join(SEPARATOR) + SEPARATOR;

  return (
    <section className={reveal ? 'banner-reveal-section' : undefined}>
      <div
        className="relative mx-auto mt-12 mb-8 sm:mt-16 sm:mb-12 max-w-7xl overflow-hidden rounded-2xl select-none"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div className="relative z-10 py-4 sm:py-5">
          <motion.p
            style={{ x }}
            className="whitespace-nowrap text-[clamp(1.5rem,5vw,7rem)] font-black uppercase leading-none tracking-tight text-white"
          >
            {repeated}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
