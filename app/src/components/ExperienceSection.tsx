'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import CourseCard from '@/components/CourseCard';
import type { Course } from '@data/types';

interface ExperienceSectionProps {
  title: string;
  courses: Course[];
  locale: string;
  certificateLabel: string;
}

export default function ExperienceSection({
  title,
  courses,
  locale,
  certificateLabel,
}: ExperienceSectionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section id="experience" className="min-h-screen flex flex-col justify-center py-20">
      <motion.h2
        initial={reducedMotion ? false : { opacity: 0, y: -10 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-8 text-2xl font-semibold text-accent-cyan"
      >
        {title}
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <CourseCard
            key={course.id}
            course={course}
            index={index}
            locale={locale}
            certificateLabel={certificateLabel}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </section>
  );
}
