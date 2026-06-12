'use client';


import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, type MotionValue } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import TiltedCourseCard from '@/components/TiltedCourseCard';
import type { Course } from '@data/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const CARD_COLORS = ['#00ff00', '#00e5a0', '#00ffff', '#6680ff', '#b478ff', '#ff4da6'];

function RevealChar({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const color = useTransform(progress, range, ['rgba(255,255,255,0.15)', 'rgba(255,255,255,1)']);
  return <motion.span style={{ color }} className="inline-block">{children}</motion.span>;
}

function RevealHeading({ lines, studyHint }: { lines: string[]; studyHint: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.2'] });
  const isHintInView = useInView(hintRef, { once: true });

  const totalChars = lines.reduce((acc, l) => acc + l.replace(/ /g, '').length, 0);
  let charIndex = 0;

  return (
    <div ref={ref} className="bg-black px-6 py-16 text-center">
      {lines.map((line, li) => (
          <p key={li} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-none">
          {line.split(' ').map((word, wi) => (
            <span key={wi} className={`inline-block ${wi < line.split(' ').length - 1 ? 'mr-[0.25em]' : ''}`}>
              {word.split('').map((char) => {
                const start = charIndex / totalChars;
                const end = (charIndex + 1) / totalChars;
                charIndex++;
                return <RevealChar key={charIndex} progress={scrollYProgress} range={[start, end]}>{char}</RevealChar>;
              })}
            </span>
          ))}
        </p>
      ))}
      <motion.p
        ref={hintRef}
        className="mt-6 text-lg text-foreground-subtle"
        initial={{ opacity: 0, y: 20 }}
        animate={isHintInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {studyHint}
      </motion.p>
    </div>
  );
}

interface ExperienceSectionProps {
  title: string;
  courses: Course[];
  locale: string;
  translations?: {
    motivationLine1: string;
    motivationLine2: string;
    studyHint: string;
  };
}

export default function ExperienceSection({
  title,
  courses,
  locale,
  translations,
}: ExperienceSectionProps) {
  const lines = [
    translations?.motivationLine1 ?? 'AI is better',
    translations?.motivationLine2 ?? 'with a great developer.'
  ];
  const studyHint = translations?.studyHint ?? 'Vibe coding is not enough. Study makes perfect.';
  const reducedMotion = useReducedMotion();

  return (
    <section id="experience" className="min-h-screen flex flex-col justify-center pt-2 pb-20">
      <RevealHeading lines={lines} studyHint={studyHint} />
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 auto-rows-fr">
        {courses.map((course, index) => (
          <TiltedCourseCard
            key={course.id}
            course={course}
            index={index}
            locale={locale}
            reducedMotion={reducedMotion}
            color={CARD_COLORS[index % CARD_COLORS.length]}
          />
        ))}
      </div>
      <div className="sm:hidden mt-4 px-6">
        <style>{`
          .swiper-pagination-bullet {
            background: rgba(255,255,255,0.4) !important;
            opacity: 1 !important;
          }
          .swiper-pagination-bullet-active {
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
          {courses.map((course, index) => (
            <SwiperSlide key={course.id}>
              <TiltedCourseCard
                course={course}
                index={index}
                locale={locale}
                reducedMotion={reducedMotion}
                color={CARD_COLORS[index % CARD_COLORS.length]}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
