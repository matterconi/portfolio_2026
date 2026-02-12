'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Project } from '@data/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ProjectDetailContentProps {
  project: Project;
  translations: {
    problemTitle: string;
    solutionTitle: string;
    technologiesTitle: string;
    featuresTitle: string;
    linksTitle: string;
    viewLive: string;
    viewGithub: string;
  };
}

export default function ProjectDetailContent({ project, translations }: ProjectDetailContentProps) {
  const reducedMotion = useReducedMotion();

  const fadeUp = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <div className="space-y-12">
      {/* Problem */}
      <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent-cyan">
          {translations.problemTitle}
        </h2>
        <p className="text-foreground-muted leading-relaxed">
          {project.problem}
        </p>
      </motion.div>

      {/* Solution */}
      <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent-cyan">
          {translations.solutionTitle}
        </h2>
        <p className="text-foreground-muted leading-relaxed">
          {project.fullDescription}
        </p>
      </motion.div>

      {/* Technologies */}
      <motion.div {...fadeUp} transition={{ delay: 0.3 }}>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent-cyan">
          {translations.technologiesTitle}
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded bg-accent-green-subtle text-accent-green px-3 py-1.5 text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Features */}
      <motion.div {...fadeUp} transition={{ delay: 0.4 }}>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent-cyan">
          {translations.featuresTitle}
        </h2>
        <ul className="space-y-2">
          {project.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-foreground-muted">
              <span className="text-accent-green mt-0.5">▸</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Screenshots */}
      {project.images.screenshots.length > 0 && (
        <motion.div {...fadeUp} transition={{ delay: 0.5 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.images.screenshots.map((src, i) => (
              <div
                key={src}
                className="relative aspect-video overflow-hidden rounded-lg border border-border bg-background-elevated"
              >
                <Image
                  src={src}
                  alt={`${project.title} screenshot ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 432px, 100vw"
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Links */}
      {(project.links.live || project.links.github) && (
        <motion.div {...fadeUp} transition={{ delay: 0.6 }}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent-cyan">
            {translations.linksTitle}
          </h2>
          <div className="flex gap-4">
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-accent-cyan px-5 py-2 text-sm text-accent-cyan hover:bg-accent-cyan-subtle transition-colors"
              >
                {translations.viewLive} ↗
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-foreground-subtle px-5 py-2 text-sm text-foreground-muted hover:border-foreground hover:text-foreground transition-colors"
              >
                {translations.viewGithub} ↗
              </a>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
