'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Image from 'next/image';
import { TextReveal } from '@/components/ui/text-reveal';
import { SectionTitle } from '@/components/ui/section-title';
import type { AboutContent } from '@data/types';

interface AboutSectionProps {
  title: string;
  about: AboutContent;
}

// Nothing visible before this scroll %
const ENTER_AT = 0.08;
const TEXT_START = 0.23;

export default function AboutSection({ title, about }: AboutSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scrollProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const [titleVisible, setTitleVisible] = useState(false);

  useMotionValueEvent(scrollProgress, 'change', (p) => {
    setTitleVisible(p >= ENTER_AT);
  });

  // Ramp: 0→TEXT_START = -1→0 (blocks fade in gradually), TEXT_START→1 = 0→1 (text reveal)
  const textProgress = useTransform(scrollProgress, [0, TEXT_START, 1], [-1, 0, 1]);

  // Image reveal: fade + scale, synced with text progress
  const imageOpacity = useTransform(textProgress, [0.05, 0.25], [0, 1]);
  const imageScale = useTransform(textProgress, [0.05, 0.25], [0.85, 1]);

  return (
    <section id="about" ref={sectionRef} className="relative px-6 sm:px-8" style={{ height: '350vh' }}>
      <div className="sticky top-0 flex flex-col pt-24 pb-12">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] gap-x-10 gap-y-6">
          {/* Title — mobile: after image | tablet: row 1 col 1 | desktop: row 1 full width */}
          <div className="order-2 md:order-none md:row-start-1 md:col-start-1 lg:col-span-2 self-center">
            <SectionTitle title={title} visible={titleVisible} className="text-5xl sm:text-6xl" />
          </div>

          {/* Profile Photo — mobile: first | tablet: beside title | desktop: beside text */}
          <motion.div
            className="order-1 md:order-none md:row-start-1 md:col-start-2 lg:row-start-2 shrink-0 self-center justify-self-center md:self-center lg:self-start"
            style={{ opacity: imageOpacity, scale: imageScale }}
          >
            <div
              className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl p-px"
              style={{
                background: 'linear-gradient(135deg, #ff4da640, transparent 50%, #ff4da620)',
                boxShadow: '0 0 25px #ff4da615, 0 0 50px #ff4da60d',
              }}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="/images/profile/matteo.png"
                  alt="Profile photo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Bio text — mobile: last | tablet: full width row 2 | desktop: row 2 col 1 */}
          <div className="order-3 md:order-none md:row-start-2 md:col-span-2 lg:col-span-1 lg:row-start-2 min-w-0">
            <TextReveal
              text={about.bio.join(' ')}
              scrollProgress={textProgress}
              emphasize={[
                // EN
                'technology', 'creativity', 'blockchain', '3D',
                'performant', 'Web3', 'generative', 'open-source',
                // IT
                'tecnologia', 'creatività', 'blockchain', '3D',
                'performanti', 'Web3', 'generativa', 'open-source',
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
