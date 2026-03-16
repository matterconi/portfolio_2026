'use client';

import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Project } from '@data/types';

interface ProjectsSectionProps {
  projects: Project[];
  locale: string;
  translations: {
    title: string;
    viewProject: string;
  };
}

const CARD_OFFSET = 40;      // px – each subsequent card sticks a bit lower
const DESIRED_MARGIN = 200;   // px – desired scroll distance between cards

const GLOW_COLORS = ['#00ff00', '#00ffff', '#b478ff'];

// Temporary Unsplash placeholders per project (by order index)
const PLACEHOLDER_IMAGES: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', // BYLT – marketing / web agency
  2: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=800&h=600&fit=crop', // Chess Bot – chess / strategy
  3: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop', // To Do App – productivity / checklist
};

/* ── Scale wrapper (hook-safe) ────────────────────────────── */
function ScalingCard({
  globalProgress,
  range,
  targetScale,
  children,
}: {
  globalProgress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  children: React.ReactNode;
}) {
  const scale = useTransform(globalProgress, range, [1, targetScale]);

  return (
    <motion.div style={{ scale, transformOrigin: 'top center' }}>
      {children}
    </motion.div>
  );
}

/* ── Main component ───────────────────────────────────────── */
export default function ProjectsSection({ projects, locale, translations }: ProjectsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardLayout, setCardLayout] = useState({ top: 80, height: 500 });

  const sorted = useMemo(
    () => [...projects].sort((a, b) => a.order - b.order),
    [projects]
  );

  const updateCardLayout = useCallback(() => {
    const cardH = cardRef.current?.getBoundingClientRect().height ?? 0;
    if (cardH > 0) {
      setCardLayout({
        top: Math.max(0, (window.innerHeight - cardH) / 2),
        height: cardH,
      });
    }
  }, []);

  useEffect(() => {
    const ro = new ResizeObserver(updateCardLayout);
    if (cardRef.current) ro.observe(cardRef.current);

    window.addEventListener('resize', updateCardLayout);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateCardLayout);
    };
  }, [updateCardLayout]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section id="projects" className="py-20">
      {/* Stacking sticky panels — vertical on mobile, horizontal on md+ */}
      <div ref={containerRef}>
        {sorted.map((project, i) => {
          const totalCards = sorted.length;
          const isLast = i === totalCards - 1;
          const topPosition = cardLayout.top + i * CARD_OFFSET;
          const stickyHeight = cardLayout.height + (totalCards - 1 - i) * CARD_OFFSET;
          const intrinsicMargin = (totalCards - 1 - i) * CARD_OFFSET;
          const compensatedSpacer = Math.max(0, DESIRED_MARGIN - intrinsicMargin);
          const imgSrc = PLACEHOLDER_IMAGES[project.order] ?? PLACEHOLDER_IMAGES[1];
          const glowColor = GLOW_COLORS[i % GLOW_COLORS.length];

          // Scale: last card stays at 1, others shrink as the next card scrolls in
          const targetScale = isLast ? 1 : 1 - (totalCards - 1 - i) * 0.05;
          const start = i * (1 / totalCards);
          const end = Math.min(start + 1 / totalCards, 1);

          return (
            <React.Fragment key={project.slug}>
              <div
                className="sticky"
                style={{
                  top: `${topPosition}px`,
                  height: `${stickyHeight}px`,
                  zIndex: i + 1,
                }}
              >
                <ScalingCard
                  globalProgress={scrollYProgress}
                  range={[start, end]}
                  targetScale={targetScale}
                >
                  {/* Glow wrapper */}
                  <div
                    ref={i === 0 ? cardRef : undefined}
                    className="rounded-2xl p-px"
                    style={{
                      background: `linear-gradient(135deg, ${glowColor}40, transparent 50%, ${glowColor}20)`,
                      boxShadow: `0 0 25px ${glowColor}15, 0 0 50px ${glowColor}0d`,
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] items-stretch overflow-hidden rounded-2xl bg-[#0f0a14]">
                      {/* Image — edge-to-edge, alternates sides on md+ */}
                      <div className={`relative aspect-4/3 overflow-hidden bg-background ${i % 2 !== 0 ? 'md:order-last' : ''}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgSrc}
                          alt={project.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex flex-col justify-center p-5 md:p-8">
                        <h3
                          className="text-2xl md:text-3xl font-bold text-white"
                          style={{ fontFamily: "'Clash Display', sans-serif" }}
                        >
                          {project.title}
                        </h3>

                        <p className="mt-3 md:mt-5 text-sm md:text-base text-foreground-muted leading-relaxed max-w-md">
                          {project.shortDescription}
                        </p>

                        <div className="mt-5 md:mt-8 flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full bg-white/5 border border-white/10 text-foreground-subtle px-3 py-1 text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={`/${locale}/projects/${project.slug}`}
                          className="mt-6 md:mt-10 inline-flex items-center gap-2 self-start text-sm text-accent-cyan hover:text-white transition-colors"
                        >
                          {translations.viewProject}
                          <span aria-hidden="true">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScalingCard>
              </div>

              {/* Spacer: compensa lo scroll tra una card e la successiva */}
              {!isLast && <div style={{ height: `${compensatedSpacer}px` }} />}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
