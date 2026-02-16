'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import CourseCard from '@/components/CourseCard';
import type { Course } from '@data/types';
import { SectionTitle } from './ui/section-title';

interface ExperienceSectionProps {
  title: string;
  courses: Course[];
  locale: string;
}

export default function ExperienceSection({
  title,
  courses,
  locale,
}: ExperienceSectionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section id="experience" className="min-h-screen flex flex-col justify-center py-20">
      <SectionTitle
                visible
                title={title}
                className="text-5xl sm:text-6xl !text-right w-full mx-auto mt-8"
              />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {courses.map((course, index) => (
          <CourseCard
            key={course.id}
            course={course}
            index={index}
            locale={locale}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </section>
  );
}
