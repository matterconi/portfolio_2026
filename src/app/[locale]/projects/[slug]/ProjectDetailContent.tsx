'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Locale, Project } from '@data/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import InfiniteMovingCards from '@/components/ui/infinite-moving-cards';
import ScrollRevealText from '@/components/ScrollRevealText';
import { TextReveal } from '@/components/ui/text-reveal';
import CircularCTA from '@/components/CircularCTA';

type RecommendedProject = Pick<Project, 'slug' | 'title' | 'shortDescription' | 'technologies' | 'images'>;
type ProjectAccordionItem = { title: string; content: string };

const STACK_COLORS = ['#00ff00', '#00e5a0', '#00ffff', '#6680ff', '#b478ff', '#ff4da6'];
const LEARNING_COLORS = ['#00ff00', '#00ffff', '#b478ff', '#ff4da6'];
const labelClass = 'text-xs font-semibold uppercase tracking-[0.22em] text-accent-green';
const sectionTitleClass = 'font-display text-4xl font-semibold leading-none tracking-[-0.05em] text-foreground sm:text-5xl';
const bodyTextClass = 'text-base leading-7 text-foreground-muted sm:text-lg sm:leading-8';
const accordionBodyClass = 'text-sm leading-6 text-foreground-muted sm:text-base sm:leading-7';
const cardBodyClass = 'text-sm leading-6 text-foreground-muted sm:text-base sm:leading-7';

function createFallbackAccordionTitle(text: string): string {
  const title = text.trim().split(/\s+/).slice(0, 5).join(' ');
  return title;
}

function getAccordionItems(project: Project): ProjectAccordionItem[] {
  const items = project.particularAspects?.length
    ? project.particularAspects
    : project.features.slice(0, 4).map((feature) => ({
        title: createFallbackAccordionTitle(feature),
        content: feature,
      }));

  return items.slice(0, 4);
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

interface ProjectDetailContentProps {
  project: Project;
  locale: Locale;
  recommendedProjects: RecommendedProject[];
  translations: {
    stackHeading: string;
    storyHeading: string;
    keyLessonsHeading: string;
    problemTitle: string;
    solutionTitle: string;
    technologiesTitle: string;
    featuresTitle: string;
    linksTitle: string;
    viewLive: string;
    viewGithub: string;
    recommendedKicker: string;
    recommendedTitle: string;
    recommendedDescription: string;
    viewProject: string;
    designFocus: string;
    developmentFocus: string;
    interactionDetails: string;
    technicalHighlights: string;
    productStoryHeading: string;
  };
}

export default function ProjectDetailContent({
  project,
  locale,
  recommendedProjects,
  translations,
}: ProjectDetailContentProps) {
  const reducedMotion = useReducedMotion();
  const [openDecisionIndex, setOpenDecisionIndex] = useState<number | null>(null);
  const [openComplementaryIndex, setOpenComplementaryIndex] = useState<number | null>(null);
  const stackImage = project.images.stack || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80';
  const lessonsImage = project.images.lessons || project.images.hero;
  const stackItems = project.technologies.map((name) => ({ id: name, name }));
  const learningsText = project.suggestedCaseStudyText?.learnings || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. UX strategy, visual direction, prototyping, and front-end implementation shaped into a single product narrative.';
  const aspectsText = project.suggestedCaseStudyText?.particularAspects;
  const outcomeText = project.suggestedCaseStudyText?.outcome || project.portfolioValue || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. The page is structured to communicate context, decisions, stack, role, and implementation value quickly.';
  const learnings = project.whatILearned?.length ? project.whatILearned : [];
  const aspects = getAccordionItems(project);
  const complementarySections = [
    [translations.designFocus, project.designFocus],
    [translations.developmentFocus, project.developmentFocus],
    [translations.interactionDetails, project.interactionDetails],
    [translations.technicalHighlights, project.technicalHighlights],
  ].filter((section): section is [string, string[]] => Boolean(section[1]?.length));

  const fadeUp = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <div className="mt-10 space-y-4 lg:mt-14">
      <motion.section
        {...fadeUp}
        transition={{ delay: 0.1 }}
        className="py-8"
      >
        <div className="mx-auto grid max-w-6xl min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <div className="min-w-0 overflow-hidden">
            <h2 className={`${sectionTitleClass} lg:text-6xl`}>
              {translations.stackHeading}
            </h2>
            {project.stackSummary && (
              <p className={`mt-6 max-w-3xl ${bodyTextClass}`}>
                {project.stackSummary}
              </p>
            )}
            <div className="mt-8 -mx-6 overflow-hidden sm:-mx-8 lg:-mx-10">
              <InfiniteMovingCards
                items={stackItems}
                direction="left"
                pauseOnHover={false}
                gap="gap-2"
                className="max-w-none max-sm:[mask-image:none]"
                renderItem={(item, index) => (
                  <span
                    className="rounded-full p-px"
                    style={{
                      background: `linear-gradient(135deg, ${hexToRgba(STACK_COLORS[index % STACK_COLORS.length], 0.35)}, transparent 58%, ${hexToRgba(STACK_COLORS[index % STACK_COLORS.length], 0.18)})`,
                      boxShadow: `0 0 22px ${hexToRgba(STACK_COLORS[index % STACK_COLORS.length], 0.08)}`,
                    }}
                  >
                    <span className="block rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl">
                      {item.name}
                    </span>
                  </span>
                )}
              />
            </div>
          </div>
          <div className="relative min-h-72 flex-1 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25 lg:min-h-full">
            <Image
              src={stackImage}
              alt={`${project.title} stack visual`}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 360px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
          </div>
        </div>
      </motion.section>

      <motion.section
        {...fadeUp}
        transition={{ delay: 0.2 }}
        className="py-10"
      >
        <h2 className={sectionTitleClass}>
          {translations.storyHeading}
        </h2>

        <div className="mt-8 grid border-b border-white/10 xl:grid-cols-2 xl:gap-x-10">
          {aspects.map((aspect, index) => {
            return (
              <div key={`${aspect.title}-${index}`} className="border-t border-white/10 py-5">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-5 text-left"
                  aria-expanded={openDecisionIndex === index}
                  onClick={() => setOpenDecisionIndex(openDecisionIndex === index ? null : index)}
                >
                  <span className="flex items-center">
                    <span className="text-base font-medium leading-7 text-white/80 sm:text-lg sm:leading-8">
                      {aspect.title}
                    </span>
                  </span>
                  <span className={`text-xl leading-none text-white/85 transition-transform ${openDecisionIndex === index ? 'rotate-45 text-white' : ''}`}>
                    +
                  </span>
                </button>
                {openDecisionIndex === index && (
                  <p className={`mt-4 max-w-3xl ${accordionBodyClass}`}>
                    {aspect.content}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {aspectsText && (
          <div className="pt-8">
            <ScrollRevealText lines={[aspectsText]} textClassName="text-xl leading-tight sm:text-2xl sm:leading-tight" />
          </div>
        )}
        {learnings.length > 0 && (
          <div className="mt-6 flex flex-row flex-wrap gap-4 xl:flex-nowrap">
            {learnings.slice(0, 4).map((learning, index) => {
              const color = LEARNING_COLORS[index % LEARNING_COLORS.length];

              return (
                <article
                  key={learning}
                  className="relative flex min-h-48 min-w-full flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/[0.08] p-5 backdrop-blur-xl sm:min-w-[calc(50%_-_0.5rem)] sm:flex-1 sm:p-6 xl:min-h-56 xl:min-w-0"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(color, 0.22)}, rgba(255,255,255,0.08) 54%, ${hexToRgba(color, 0.1)})`,
                  }}
                >
                  <span className="pointer-events-none absolute -right-4 -top-5 font-display text-8xl font-semibold leading-none tracking-[-0.08em] text-white/[0.06] sm:text-9xl">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className={`relative mt-auto ${cardBodyClass}`}>{learning}</p>
                </article>
              );
            })}
          </div>
        )}
      </motion.section>

      <motion.section
        {...fadeUp}
        transition={{ delay: 0.36 }}
        className="pt-0 pb-10"
      >
        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <div className="max-w-4xl">
            <TextReveal
              text={translations.keyLessonsHeading}
              className="pb-2 [&>div]:font-display [&>div]:text-4xl [&>div]:font-semibold [&>div]:leading-none [&>div]:tracking-[-0.05em] sm:[&>div]:text-5xl"
              revealedClassName="text-white"
            />
            <TextReveal
              text={learningsText}
              className="mt-5 [&>div]:text-base [&>div]:font-normal [&>div]:leading-7 sm:[&>div]:text-lg sm:[&>div]:leading-8"
            />
          </div>
          <div className="relative min-h-72 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25 lg:min-h-full">
            <Image
              src={lessonsImage}
              alt={`${project.title} key lessons visual`}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 360px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
          </div>
        </div>
      </motion.section>

      {complementarySections.length > 0 && (
        <motion.section
          {...fadeUp}
          transition={{ delay: 0.38 }}
          className="py-8"
        >
          <div className="border-b border-white/10">
            {complementarySections.map(([title, items], index) => {
              const isOpen = openComplementaryIndex === index;

              return (
                <div key={title} className="border-t border-white/10 py-5">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenComplementaryIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-5 text-left"
                  >
                    <span className="text-base font-medium leading-7 text-white/80 sm:text-lg sm:leading-8">
                      {title}
                    </span>
                    <span className={`text-xl leading-none text-white/85 transition-transform ${isOpen ? 'rotate-45 text-white' : ''}`}>
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <ul className="mt-5 grid gap-3 md:grid-cols-2">
                      {items.slice(0, 5).map((item) => (
                        <li key={item} className={`flex gap-3 ${accordionBodyClass}`}>
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      <motion.section
        {...fadeUp}
        transition={{ delay: 0.4 }}
        className="grid gap-8 pt-8 pb-24 lg:grid-cols-[minmax(0,1fr)_180px] lg:items-center"
      >
        <div>
          <h2 className={sectionTitleClass}>
            {translations.productStoryHeading}
          </h2>
          <p className={`mt-6 max-w-3xl ${bodyTextClass}`}>
            {outcomeText}
          </p>
        </div>
        {(project.links.live || project.links.github) && (
          <div className="flex justify-center lg:justify-end">
            <CircularCTA
              label={project.links.live ? translations.viewLive : translations.viewGithub}
              href={project.links.live || project.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-8 w-8" />
            </CircularCTA>
          </div>
        )}
      </motion.section>

      {recommendedProjects.length > 0 && (
        <motion.section
          {...fadeUp}
          transition={{ delay: 0.45 }}
          className="rounded-[1.5rem] border border-border bg-background-elevated/55 p-6 sm:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className={labelClass}>{translations.recommendedKicker}</p>
              <h2 className={`mt-4 ${sectionTitleClass}`}>
                {translations.recommendedTitle}
              </h2>
              <p className={`mt-4 ${bodyTextClass}`}>
                {translations.recommendedDescription}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {recommendedProjects.map((recommendedProject) => (
              <Link
                key={recommendedProject.slug}
                href={`/${locale}/projects/${recommendedProject.slug}`}
                className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25 transition-colors hover:border-accent-green/60"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-background">
                  <Image
                    src={recommendedProject.images.hero}
                    alt={recommendedProject.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-2xl font-semibold leading-tight tracking-[-0.04em] text-foreground">
                    {recommendedProject.title}
                  </h3>
                  <p className={`mt-3 line-clamp-3 ${cardBodyClass}`}>
                    {recommendedProject.shortDescription}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {recommendedProject.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="rounded-full border border-border px-3 py-1 text-xs text-foreground-muted">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="mt-5 text-sm text-white transition-colors group-hover:text-accent-green">
                    {translations.viewProject} →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
