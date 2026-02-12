'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@data/types';
import { useActiveProject } from '@/hooks/useActiveProject';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ProjectsSectionProps {
  projects: Project[];
  locale: string;
  translations: {
    title: string;
    viewProject: string;
  };
}

export default function ProjectsSection({ projects, locale, translations }: ProjectsSectionProps) {
  const reducedMotion = useReducedMotion();
  const sorted = useMemo(
    () => [...projects].sort((a, b) => a.order - b.order),
    [projects]
  );
  const slugs = useMemo(() => sorted.map((p) => p.slug), [sorted]);
  const activeSlug = useActiveProject(slugs);
  const activeProject = sorted.find((p) => p.slug === activeSlug) ?? sorted[0];

  return (
    <section id="projects" className="py-20">
      <h2 className="mb-12 text-2xl font-semibold text-accent-cyan">
        {translations.title}
      </h2>

      {/* Desktop: split-screen layout */}
      <div className="hidden lg:grid grid-cols-[1.2fr_1fr] gap-8">
        {/* Left column: scrolling project images */}
        <div className="space-y-16">
          {sorted.map((project) => (
            <div
              key={project.slug}
              data-slug={project.slug}
              className="relative aspect-video overflow-hidden rounded-lg border border-border bg-background-elevated"
            >
              {/* Fallback: sits behind the image, visible only when image fails */}
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
          ))}
        </div>

        {/* Right column: sticky project info */}
        <div className="relative">
          <div className="sticky top-[20vh]">
            <AnimatePresence mode="wait">
              {activeProject && (
                <motion.div
                  key={activeProject.slug}
                  initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-accent-green drop-shadow-[0_0_10px_rgba(0,255,0,0.3)]">
                    {activeProject.title}
                  </h3>
                  <p className="mt-4 text-sm text-foreground-muted leading-relaxed">
                    {activeProject.shortDescription}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {activeProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-accent-green-subtle text-accent-green px-2 py-1 text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/${locale}/projects/${activeProject.slug}`}
                    className="mt-8 inline-block rounded border border-accent-cyan px-5 py-2 text-sm text-accent-cyan hover:bg-accent-cyan-subtle transition-colors"
                  >
                    {translations.viewProject} →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile: stacked layout */}
      <div className="lg:hidden space-y-12">
        {sorted.map((project) => (
          <div key={project.slug} className="space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-background-elevated">
              {/* Fallback: sits behind the image, visible only when image fails */}
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
