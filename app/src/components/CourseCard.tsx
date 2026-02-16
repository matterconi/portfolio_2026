'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Course } from '@data/types';

const GLOW_COLORS = ['#00ff00', '#00ffff', '#b478ff'];
const GLOW_SEQUENCE = [0, 1, 2, 1, 2, 0];

interface CourseCardProps {
  course: Course;
  index: number;
  locale: string;
  reducedMotion: boolean;
}

const CourseCard = memo(function CourseCard({
  course,
  index,
  locale,
  reducedMotion,
}: CourseCardProps) {
  const isPdf = course.icon?.endsWith('.pdf');
  const isSvg = course.icon?.endsWith('.svg');
  const hasImage = course.icon && !isPdf;
  const glowColor = GLOW_COLORS[GLOW_SEQUENCE[index % GLOW_SEQUENCE.length]];

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative rounded-2xl p-px"
      style={{
        background: `linear-gradient(135deg, ${glowColor}40, transparent 50%, ${glowColor}20)`,
        boxShadow: `0 0 25px ${glowColor}15, 0 0 50px ${glowColor}0d`,
      }}
    >
      <div className="relative flex flex-col overflow-hidden rounded-2xl bg-[#0a0a0a] h-full">
      {/* Image / PDF / Fallback area */}
      <div className={`relative aspect-video w-full overflow-hidden ${isSvg ? 'bg-white' : 'bg-background-subtle'}`}>
        {isPdf ? (
          <object
            data={`${course.icon}#toolbar=0&navpanes=0&scrollbar=0`}
            type="application/pdf"
            className="pointer-events-none h-full w-full"
            aria-label={`${course.title} certificate`}
          >
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-background-elevated to-background-subtle">
              <span
                className="text-4xl font-bold tracking-tighter text-accent-cyan/60"
                style={{ fontFamily: "'Clash Display', var(--font-mono), sans-serif" }}
              >
                {course.provider}
              </span>
            </div>
          </object>
        ) : hasImage ? (
          <Image
            src={course.icon}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-background-elevated to-background-subtle">
            <span
              className="text-4xl font-bold tracking-tighter text-accent-cyan/60"
              style={{ fontFamily: "'Clash Display', var(--font-mono), sans-serif" }}
            >
              {course.provider}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Provider */}
        <span className="text-xs uppercase tracking-widest text-foreground-subtle">
          {course.provider}
        </span>

        {/* Title */}
        <h3
          className="mt-1 text-lg font-semibold text-foreground"
          style={{ fontFamily: "'Clash Display', var(--font-mono), sans-serif" }}
        >
          {course.title}
        </h3>

        {/* Date */}
        {course.completionDate && (
          <p className="mt-1 text-xs text-foreground-subtle">
            {new Date(course.completionDate).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'long',
            })}
          </p>
        )}

        {/* Skills */}
        {course.skills && course.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {course.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-foreground-muted transition-colors group-hover:border-accent-cyan/20 group-hover:text-accent-cyan/80"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

      </div>
      </div>
    </motion.div>
  );
});

export default CourseCard;
