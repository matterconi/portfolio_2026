'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { useScroll, useTransform, motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import ABCPanel from './ABCPanel';
import type { PanelData } from './ABCPanel';
import type { ShaderVariant } from './WaterPlaneShader';
import { SectionTitle } from './ui/section-title';
import { useStickyCardLayout } from '@/hooks/useStickyCardLayout';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';


interface TopicMeta {
  title: string;
  description: string;
  image: string;
  bullets?: string[];
  emphasize?: string[];
}

interface ABCSectionProps {
  sectionTitle: string;
  sectionDescription?: string;
  translations: {
    progressIndicator: string;
    mobileHint: string;
    scrollHint: string;
  };
  panelTopics: {
    a: [TopicMeta, TopicMeta];
    b: [TopicMeta, TopicMeta];
    c: [TopicMeta, TopicMeta];
  };
}

const PANEL_CONFIGS: Record<string, { color: string; shaderVariant: ShaderVariant }> = {
  A: {
    color: '#00ff00',
    shaderVariant: {
      colorA: [0, 1, 0],
      colorB: [0, 0.9, 0.8],
      fillTint: [0, 0.06, 0.04],
      frequency: 5.5,
      amplitude: 24,
      rotationSpread: 820,
      cutAngle: -5,
      speed: 1,
    },
  },
  B: {
    color: '#00ffff',
    shaderVariant: {
      colorA: [0, 0.85, 1],
      colorB: [0.1, 0.3, 0.9],
      fillTint: [0.02, 0.04, 0.08],
      frequency: 3.5,
      amplitude: 18,
      rotationSpread: 600,
      cutAngle: 15,
      speed: 0.7,
    },
  },
  C: {
    color: '#b478ff',
    shaderVariant: {
      colorA: [0.7, 0.47, 1],
      colorB: [1, 0.2, 0.6],
      fillTint: [0.05, 0.02, 0.06],
      frequency: 8,
      amplitude: 32,
      rotationSpread: 1100,
      cutAngle: -20,
      speed: 0.5,
    },
  },
};

export default function ABCSection({
  sectionTitle,
  sectionDescription,
  translations,
  panelTopics,
}: ABCSectionProps) {
  const [overflow, setOverflow] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { stickyTop, titleInside } = useStickyCardLayout(cardRef, titleRef);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -overflow]);

  const fadeWidth = useMotionValue(100);

  const baseLeftFade = useTransform(scrollYProgress, [0, 0.02], [0, 1]);
  const baseRightFade = useTransform(scrollYProgress, [0.98, 1], [1, 0]);

  const leftFade = useTransform([baseLeftFade, fadeWidth], ([ratio, width]: number[]) => (ratio as number) * (width as number));
  const rightFade = useTransform([baseRightFade, fadeWidth], ([ratio, width]: number[]) => (ratio as number) * (width as number));
  const maskImage = useMotionTemplate`linear-gradient(to right, transparent, black ${leftFade}px, black calc(100% - ${rightFade}px), transparent)`;

  useEffect(() => {
    const calculate = () => {
      if (!cardRef.current) return;
      const styles = window.getComputedStyle(cardRef.current);
      const paddingRight = parseFloat(styles.paddingRight);
      setOverflow(cardRef.current.scrollWidth - cardRef.current.clientWidth + paddingRight);
    };

    const handleResize = () => {
      fadeWidth.set(window.innerWidth < 640 ? 40 : 100);
      calculate();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const panels: PanelData[] = useMemo(() => [
    { letter: 'A', ...PANEL_CONFIGS.A, topics: panelTopics.a },
    { letter: 'B', ...PANEL_CONFIGS.B, topics: panelTopics.b },
    { letter: 'C', ...PANEL_CONFIGS.C, topics: panelTopics.c },
  ], [panelTopics]);

  return (
    <>
      <div ref={wrapperRef} id="abc" className="relative h-[300vh] max-w-7xl mx-auto hidden sm:block">
        <div
          className="sticky"
          style={{ top: stickyTop }}
        >
          <motion.div
            className="overflow-hidden"
            style={{
              maskImage,
              WebkitMaskImage: maskImage,
            }}
          >
            <motion.div
              className="mx-auto flex items-center gap-8 px-6 py-12"
              ref={cardRef}
              style={{ x }}
            >
              {panels.map((panel) => (
                <ABCPanel key={panel.letter} panel={panel} />
              ))}
            </motion.div>
            {titleInside && (
              <div ref={titleRef} className="px-6 pb-6 pt-12">
                <SectionTitle title={sectionTitle} visible className="text-5xl sm:text-6xl !text-center mb-3" />
                {sectionDescription && (
                  <p className="text-lg text-foreground-subtle text-center">{sectionDescription}</p>
                )}
              </div>
            )}
          </motion.div>
        </div>
        {!titleInside && (
          <div ref={titleRef} className="px-6 pb-6 pt-12">
            <SectionTitle title={sectionTitle} visible className="text-5xl sm:text-6xl !text-center mb-3" />
            {sectionDescription && (
              <p className="text-lg text-foreground-subtle text-center">{sectionDescription}</p>
            )}
          </div>
        )}
      </div>

      <div className="sm:hidden py-12 flex flex-col gap-8">
        <div className="px-6 abc-mobile-swiper">
          <style>{`
            .abc-mobile-swiper .swiper-pagination {
              position: relative !important;
              bottom: auto !important;
              margin-top: 24px !important;
            }
            .abc-mobile-swiper .swiper-pagination-bullet {
              background: rgba(255,255,255,0.4) !important;
              opacity: 1 !important;
            }
            .abc-mobile-swiper .swiper-pagination-bullet-active {
              background: rgba(255,255,255,0.9) !important;
            }
          `}</style>
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            slidesPerView={1}
            spaceBetween={16}
            breakpoints={{ 400: { slidesPerView: 'auto' } }}
          >
            {panels.map((panel) => (
              <SwiperSlide key={panel.letter}>
                <ABCPanel panel={panel} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="px-6 pt-12">
          <SectionTitle title={sectionTitle} visible className="text-5xl sm:text-6xl !text-center mb-3" />
          {sectionDescription && (
            <p className="text-lg text-foreground-subtle text-center">{sectionDescription}</p>
          )}
        </div>
      </div>
    </>
  );
}
