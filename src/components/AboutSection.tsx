'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { TextReveal } from '@/components/ui/text-reveal';
import type { AboutContent } from '@data/types';
import { DemoTitleReveal } from '@/app/[locale]/demo-about/DemoTitleReveal';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface AboutSectionProps {
  title: string;
  about: AboutContent;
}

// Nothing visible before this scroll %
const TEXT_START = 0.25;

const IMAGE_STYLES = {
  background: 'linear-gradient(135deg, #ff4da640, transparent 50%, #ff4da620)',
  boxShadow: '0 0 25px #ff4da615, 0 0 50px #ff4da60d',
} as const;

const EMPHASIZE_WORDS = [
  // EN
  'technology', 'creativity', 'blockchain', '3D',
  'performant', 'Web3', 'generative', 'open-source',
  // IT
  'tecnologia', 'creatività', 'blockchain', '3D',
  'performanti', 'Web3', 'generativa', 'open-source',
];

function ProfileImage({ className }: { className?: string }) {
  return (
    <div
      className={`relative rounded-2xl p-px ${className ?? ''}`}
      style={IMAGE_STYLES}
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden">
        <Image
          src="/images/profile/matteo.webp"
          alt="Profile photo"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}

export default function AboutSection({ title, about }: AboutSectionProps) {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scrollProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // --- md+ scroll-driven timeline (only used when !isMobile) ---
  const textProgress = useTransform(scrollProgress, [0, TEXT_START, 1], [-1, 0, 1]);
  const titleProgress = useTransform(scrollProgress, [0.10, 0.25], [0, 1]);
  const imageOpacity = useTransform(textProgress, [0.05, 0.25], [0, 1]);
  const imageScale = useTransform(textProgress, [0.05, 0.25], [0.85, 1]);

  // Floated image for tablet only (hidden on mobile & desktop)
  const floatingImage = (
    <motion.div
      className="hidden md:block lg:hidden float-right ml-6 mb-4"
      style={{ opacity: imageOpacity, scale: imageScale }}
    >
      <ProfileImage className="w-56 h-56 md:w-60 md:h-60" />
    </motion.div>
  );

  // ── Mobile: each element animates independently on enter ──
  if (isMobile) {
    return (
      <section id="about" className="relative px-6 sm:px-8">
        <div className="flex flex-col gap-y-8 py-24">
          {/* Image — animates on viewport enter */}
          <motion.div
            className="self-center"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <ProfileImage className="w-56 h-56" />
          </motion.div>

          {/* Title — time-based stagger on mobile */}
          <DemoTitleReveal text={title} className="text-5xl sm:text-6xl" timeBased={0.8} />

          {/* Text — uses its own fallback scrollProgress */}
          <TextReveal
            text={about.bio.join(' ')}
            emphasize={EMPHASIZE_WORDS}
          />
        </div>
      </section>
    );
  }

  // ── md+: sticky section with coordinated scroll-driven animations ──
  return (
    <section id="about" ref={sectionRef} className="relative px-6 sm:px-8" style={{ height: '350vh' }}>
      <div className="sticky top-0 flex flex-col pt-24 pb-12">
        <div className="w-full max-w-4xl lg:max-w-7xl mx-auto flex flex-col gap-y-6">
          {/* Title */}
          <DemoTitleReveal text={title} scrollProgress={titleProgress} className="text-5xl sm:text-6xl" />

          {/* Bio + image row: on lg+ image sits in its own column */}
          <div className="lg:grid lg:grid-cols-[1fr_auto] lg:gap-x-10">
            <TextReveal
              text={about.bio.join(' ')}
              scrollProgress={textProgress}
              emphasize={EMPHASIZE_WORDS}
              floatingElement={floatingImage}
            />

            {/* Desktop-only image column (hidden below lg) */}
            <motion.div
              className="hidden lg:block self-start shrink-0"
              style={{ opacity: imageOpacity, scale: imageScale }}
            >
              <ProfileImage className="w-64 h-64" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
