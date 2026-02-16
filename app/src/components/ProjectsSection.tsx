'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@data/types';

interface ProjectsSectionProps {
  projects: Project[];
  locale: string;
  translations: {
    title: string;
    viewProject: string;
  };
}

const CARD_TOP_BASE = 80; // px – first card sticks at this offset
const CARD_TOP_STEP = 40; // px – each subsequent card sticks a bit lower

export default function ProjectsSection({ projects, locale, translations }: ProjectsSectionProps) {
  const sorted = useMemo(
    () => [...projects].sort((a, b) => a.order - b.order),
    [projects]
  );

  return (
    <section id="projects" className="py-20">
      <h2 className="mb-12 text-2xl font-semibold text-accent-cyan">
        {translations.title}
      </h2>

      {/* Desktop: stacking cards */}
      <div className="hidden lg:block">
        {sorted.map((project, i) => (
          <div
            key={project.slug}
            className="sticky mb-8 last:mb-0"
            style={{
              top: `${CARD_TOP_BASE + i * CARD_TOP_STEP}px`,
              zIndex: i + 1,
            }}
          >
            <div className="grid grid-cols-[1.2fr_1fr] gap-8 rounded-xl border border-border bg-background-elevated p-6 shadow-lg shadow-black/30">
              {/* Image */}
              <div className="relative aspect-video overflow-hidden rounded-lg bg-background">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-foreground-subtle text-lg font-semibold">
                    {project.title}
                  </span>
                </div>
                <Image
                  src={project.images.hero}
                  alt={project.title}
                  fill
                  className="object-cover relative z-10"
                  sizes="(min-width: 1024px) 55vw, 100vw"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-bold text-accent-green drop-shadow-[0_0_10px_rgba(0,255,0,0.3)]">
                  {project.title}
                </h3>
                <p className="mt-4 text-sm text-foreground-muted leading-relaxed">
                  {project.shortDescription}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-accent-green-subtle text-accent-green px-2 py-1 text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/${locale}/projects/${project.slug}`}
                  className="mt-8 inline-block self-start rounded border border-accent-cyan px-5 py-2 text-sm text-accent-cyan hover:bg-accent-cyan-subtle transition-colors"
                >
                  {translations.viewProject} →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: stacked layout (normal scroll) */}
      <div className="lg:hidden space-y-12">
        {sorted.map((project) => (
          <div key={project.slug} className="space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-background-elevated">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-foreground-subtle text-lg font-semibold">
                  {project.title}
                </span>
              </div>
              <Image
                src={project.images.hero}
                alt={project.title}
                fill
                className="object-cover relative z-10"
                sizes="100vw"
              />
            </div>
            <h3 className="text-lg font-bold text-accent-green">
              {project.title}
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              {project.shortDescription}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded bg-accent-green-subtle text-accent-green px-2 py-1 text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
            <Link
              href={`/${locale}/projects/${project.slug}`}
              className="inline-block rounded border border-accent-cyan px-5 py-2 text-sm text-accent-cyan hover:bg-accent-cyan-subtle transition-colors"
            >
              {translations.viewProject} →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
