'use client';

import { memo } from 'react';
import TiltedCard from '@/components/tilted-card/TiltedCard';
import type { Course } from '@data/types';

interface TiltedCourseCardProps {
  course: Course;
  index: number;
  locale: string;
  reducedMotion: boolean;
  color: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const TiltedCourseCard = memo(function TiltedCourseCard({
  course,
  locale,
  reducedMotion,
  color,
}: TiltedCourseCardProps) {
  const isPdf = course.icon?.endsWith('.pdf');
  const isSvg = course.icon?.endsWith('.svg');
  const hasImage = course.icon && !isPdf;
  const completionDate = course.completionDate
    ? new Date(course.completionDate).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
      })
    : null;

  return (
    <div className="group relative h-full min-h-[400px]" style={{ perspective: '900px' }}>
      <TiltedCard
        containerHeight="100%"
        containerWidth="100%"
        scaleOnHover={reducedMotion ? 1 : 1.05}
        rotateAmplitude={reducedMotion ? 0 : 12}
        showMobileWarning={false}
        showTooltip={false}
      >
        <div
          className="relative flex flex-col overflow-hidden rounded-2xl h-full p-px"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(color, 0.25)}, transparent 50%, ${hexToRgba(color, 0.12)})`,
            boxShadow: `0 0 25px ${hexToRgba(color, 0.08)}, 0 0 50px ${hexToRgba(color, 0.05)}`,
          }}
        >
          <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-white/[0.08] backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]">
          {/* Image area */}
          <div className={`relative aspect-video w-full overflow-hidden ${isSvg ? 'bg-white' : ''}`}>
            {isPdf ? (
              <object
                data={`${course.icon}#toolbar=0&navpanes=0&scrollbar=0`}
                type="application/pdf"
                className="pointer-events-none h-full w-full"
                aria-label={`${course.title} certificate`}
              >
                <div className="flex h-full w-full items-center justify-center">
                  <span
                    className="text-4xl font-bold tracking-tighter text-accent-cyan/60"
                  >
                    {course.provider}
                  </span>
                </div>
              </object>
            ) : hasImage ? (
              <img
                src={course.icon}
                alt={course.title}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span
                  className="text-4xl font-bold tracking-tighter text-accent-cyan/60"
                >
                  {course.provider}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="relative flex flex-1 flex-col p-5 border-t border-white/15">
            <h3
              className="text-xl font-semibold text-foreground sm:text-2xl"
            >
              {course.title}
            </h3>
            {completionDate && (
              <p className="mt-1 text-sm text-foreground-subtle sm:text-base">
                {completionDate}
              </p>
            )}
            {course.skills && course.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {course.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-xs text-foreground-muted"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
      </TiltedCard>
    </div>
  );
});

export default TiltedCourseCard;
