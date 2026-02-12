'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Course } from '@data/types';

interface CourseCardProps {
  course: Course;
  index: number;
  locale: string;
  certificateLabel: string;
  reducedMotion: boolean;
}

const CourseCard = memo(function CourseCard({
  course,
  index,
  locale,
  certificateLabel,
  reducedMotion,
}: CourseCardProps) {
  const provider = course.provider;

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={
        reducedMotion
          ? undefined
          : { scale: 1.03, boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)' }
      }
      className="rounded-lg border border-border bg-background-elevated p-6 transition-colors hover:border-accent-cyan"
    >
      {/* Provider icon + name */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-accent-cyan-subtle">
          {course.icon && (course.icon.startsWith('/') || course.icon.startsWith('http')) ? (
            <Image
              src={course.icon}
              alt={provider}
              width={20}
              height={20}
              className="opacity-80"
              loading="lazy"
            />
          ) : (
            <span className="text-xs font-bold text-accent-cyan">
              {provider.charAt(0)}
            </span>
          )}
        </div>
        <span className="text-sm text-accent-cyan">{provider}</span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-foreground">{course.title}</h3>

      {/* Completion date */}
      {course.completionDate && (
        <p className="mt-1 text-xs text-foreground-subtle">
          {new Date(course.completionDate).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'short',
          })}
        </p>
      )}

      {/* Skills tags */}
      {course.skills && course.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {course.skills.map((skill) => (
            <span
              key={skill}
              className="rounded bg-accent-cyan-subtle text-accent-cyan px-2 py-0.5 text-xs"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Certificate link */}
      {course.certificateUrl && (
        <a
          href={course.certificateUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${certificateLabel} - ${course.title}`}
          className="mt-4 inline-block text-xs text-accent-green hover:underline"
        >
          {certificateLabel} ↗
        </a>
      )}
    </motion.div>
  );
});

export default CourseCard;
