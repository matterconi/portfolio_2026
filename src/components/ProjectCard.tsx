'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  shortDescription: string;
  fullDescription: string;
  technologies: string[];
  features: string[];
  links: { live?: string; github?: string };
  viewLabel: string;
}

export default function ProjectCard({
  title,
  shortDescription,
  fullDescription,
  technologies,
  features,
  links,
  viewLabel,
}: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <motion.div
        layout
        onClick={() => setExpanded(true)}
        whileHover={{ borderColor: 'rgb(0, 255, 0)' }}
        className="group rounded-lg border border-border bg-background-elevated p-6 cursor-pointer transition-shadow hover:shadow-[0_0_15px_rgba(0,255,0,0.15)]"
      >
        <h3 className="font-semibold text-foreground text-lg">{title}</h3>
        <p className="mt-2 text-sm text-foreground-muted">{shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded bg-accent-green-subtle text-accent-green px-2 py-1 text-xs"
            >
              {tech}
            </span>
          ))}
          {technologies.length > 4 && (
            <span className="rounded bg-background-subtle text-foreground-subtle px-2 py-1 text-xs">
              +{technologies.length - 4}
            </span>
          )}
        </div>
        <p className="mt-4 text-xs text-white transition-colors group-hover:text-accent-green">{viewLabel} →</p>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg border border-accent-green bg-background-elevated p-8 shadow-[0_0_30px_rgba(0,255,0,0.2)]"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-accent-green">{title}</h3>
                <button
                  onClick={() => setExpanded(false)}
                  className="text-foreground-subtle hover:text-foreground text-xl"
                >
                  ✕
                </button>
              </div>
              <p className="text-foreground-muted leading-relaxed mb-6">
                {fullDescription}
              </p>
              {features.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-accent-cyan mb-3">Features</h4>
                  <ul className="space-y-1">
                    {features.map((f) => (
                      <li key={f} className="text-sm text-foreground-muted flex items-start gap-2">
                        <span className="text-accent-green mt-0.5">▸</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mb-6 flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-accent-green-subtle text-accent-green px-2 py-1 text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                {links.live && (
                  <a
                    href={links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded border border-accent-cyan px-4 py-2 text-sm text-accent-cyan hover:bg-accent-cyan-subtle transition-colors"
                  >
                    Live Demo ↗
                  </a>
                )}
                {links.github && (
                  <a
                    href={links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded border border-foreground-subtle px-4 py-2 text-sm text-foreground-muted hover:border-foreground hover:text-foreground transition-colors"
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
