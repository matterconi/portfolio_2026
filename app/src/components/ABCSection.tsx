'use client';

import { memo, useMemo, useState, useEffect } from 'react';
import { motion, useMotionTemplate } from 'framer-motion';
import Image from 'next/image';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SkillData {
  category: string;
  name: string;
  icon: string;
  description: string;
}

interface ABCTranslations {
  progressIndicator: string;
  mobileHint: string;
  scrollHint: string;
}

interface PanelData {
  letter: string;
  title: string;
  description: string;
  color: string;
  glowColor: string;
  skills: SkillData[];
}

interface ABCSectionProps {
  sectionTitle: string;
  skills: SkillData[];
  translations: ABCTranslations;
  panelMeta: {
    automationTitle: string;
    automationDescription: string;
    blockchainTitle: string;
    blockchainDescription: string;
    graphicsTitle: string;
    graphicsDescription: string;
  };
}

const PANEL_COLORS = {
  A: { color: 'rgb(0, 255, 0)', glowColor: 'rgba(0, 255, 0, 0.15)', shadow: 'rgba(0, 255, 0, 0.3)' },
  B: { color: 'rgb(0, 255, 255)', glowColor: 'rgba(0, 255, 255, 0.15)', shadow: 'rgba(0, 255, 255, 0.3)' },
  C: { color: 'rgb(180, 120, 255)', glowColor: 'rgba(180, 120, 255, 0.15)', shadow: 'rgba(180, 120, 255, 0.3)' },
} as const;

// -- Skill Card (memoized) --------------------------------------------------

const SkillCard = memo(function SkillCard({
  skill,
  panelColor,
  index,
}: {
  skill: SkillData;
  panelColor: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{
        scale: 1.04,
        boxShadow: `0 0 20px ${panelColor}`,
      }}
      className="flex items-start gap-4 rounded-lg border border-border bg-background-elevated p-4 transition-colors hover:border-white/20"
    >
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: `${panelColor}15` }}
      >
        {skill.icon && (skill.icon.startsWith('/') || skill.icon.startsWith('http')) ? (
          <Image
            src={skill.icon}
            alt={skill.name}
            width={24}
            height={24}
            className="opacity-80"
            loading="lazy"
          />
        ) : (
          <span
            className="text-xs font-bold opacity-60"
            style={{ color: panelColor }}
          >
            {skill.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-foreground">{skill.name}</h4>
        <p className="mt-0.5 text-xs leading-relaxed text-foreground-muted">
          {skill.description}
        </p>
      </div>
    </motion.div>
  );
});

// -- Progress Indicator ------------------------------------------------------

function ProgressIndicator({
  current,
  total,
  label,
  color,
}: {
  current: number;
  total: number;
  label: string;
  color: string;
}) {
  const text = label.replace('{current}', String(current)).replace('{total}', String(total));
  return (
    <div
      className="fixed bottom-8 right-8 z-50 rounded-full border border-border bg-background-elevated/90 px-4 py-2 text-xs font-medium backdrop-blur-sm"
      style={{
        color,
        boxShadow: `0 0 12px ${color}40`,
        borderColor: `${color}30`,
      }}
    >
      {text}
    </div>
  );
}

// -- Mobile Hint -------------------------------------------------------------

function MobileHint({ text, visible }: { text: string; visible: boolean }) {
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border bg-background-elevated/90 px-5 py-2 text-xs text-foreground-muted backdrop-blur-sm"
    >
      {text}
    </motion.div>
  );
}

// -- Panel Component ---------------------------------------------------------

function Panel({ panel }: { panel: PanelData }) {
  return (
    <div className="flex h-full w-screen flex-shrink-0 items-center">
      <div className="mx-auto w-full max-w-4xl px-6 sm:px-8">
        {/* Header */}
        <div className="mb-10 flex items-end gap-6">
          <span
            className="text-7xl font-bold sm:text-8xl"
            style={{
              color: panel.color,
              textShadow: `0 0 30px ${panel.glowColor}, 0 0 60px ${panel.glowColor}`,
              filter: `drop-shadow(0 0 20px ${panel.glowColor})`,
            }}
          >
            {panel.letter}
          </span>
          <div className="pb-2">
            <h3
              className="text-xl font-semibold sm:text-2xl"
              style={{ color: panel.color }}
            >
              {panel.title}
            </h3>
            <p className="mt-1 text-sm text-foreground-muted">{panel.description}</p>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {panel.skills.map((skill, i) => (
            <SkillCard
              key={skill.name}
              skill={skill}
              panelColor={panel.color}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// -- Reduced Motion Fallback -------------------------------------------------

function ReducedMotionLayout({
  panels,
  sectionTitle,
}: {
  panels: PanelData[];
  sectionTitle: string;
}) {
  return (
    <section id="abc" className="py-20">
      <h2 className="mb-12 text-2xl font-semibold text-accent-cyan">
        {sectionTitle}
      </h2>
      <div className="space-y-20">
        {panels.map((panel) => (
          <div key={panel.letter} className="scroll-mt-20">
            <div className="mb-8 flex items-end gap-5">
              <span
                className="text-6xl font-bold"
                style={{ color: panel.color }}
              >
                {panel.letter}
              </span>
              <div className="pb-1">
                <h3
                  className="text-xl font-semibold"
                  style={{ color: panel.color }}
                >
                  {panel.title}
                </h3>
                <p className="mt-1 text-sm text-foreground-muted">
                  {panel.description}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {panel.skills.map((skill, i) => (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  panelColor={panel.color}
                  index={i}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// -- Main Component ----------------------------------------------------------

export default function ABCSection({
  sectionTitle,
  skills,
  translations,
  panelMeta,
}: ABCSectionProps) {
  const reducedMotion = useReducedMotion();
  const { scrollProgress, translateX, currentPanel, containerRef } =
    useHorizontalScroll();
  const [showHint, setShowHint] = useState(true);

  // Build panel data from skills
  const panels: PanelData[] = useMemo(() => {
    const automationSkills = skills.filter((s) => s.category === 'automation');
    const blockchainSkills = skills.filter((s) => s.category === 'blockchain');
    const graphicsSkills = skills.filter((s) => s.category === 'graphics');

    return [
      {
        letter: 'A',
        title: panelMeta.automationTitle,
        description: panelMeta.automationDescription,
        ...PANEL_COLORS.A,
        skills: automationSkills,
      },
      {
        letter: 'B',
        title: panelMeta.blockchainTitle,
        description: panelMeta.blockchainDescription,
        ...PANEL_COLORS.B,
        skills: blockchainSkills,
      },
      {
        letter: 'C',
        title: panelMeta.graphicsTitle,
        description: panelMeta.graphicsDescription,
        ...PANEL_COLORS.C,
        skills: graphicsSkills,
      },
    ];
  }, [skills, panelMeta]);

  // Auto-dismiss mobile hint after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Reduced motion: vertical stack layout
  if (reducedMotion) {
    return (
      <ReducedMotionLayout panels={panels} sectionTitle={sectionTitle} />
    );
  }

  const activeColor = panels[currentPanel]?.color ?? PANEL_COLORS.A.color;

  return (
    <>
      {/* Tall wrapper creates scroll space: 3 panels × 100vh */}
      <div
        ref={containerRef}
        id="abc"
        className="relative"
        style={{ height: `${panels.length * 100}vh` }}
      >
        {/* Sticky viewport locks the visible area */}
        <div className="sticky top-0 h-screen w-screen overflow-hidden -ml-[calc((100vw-100%)/2)]">
          {/* Horizontal strip translated by scroll progress */}
          <motion.div
            className="flex h-full will-change-transform"
            style={{ x: useMotionTemplate`${translateX}vw` }}
          >
            {panels.map((panel) => (
              <Panel key={panel.letter} panel={panel} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Progress indicator */}
      <ProgressIndicator
        current={currentPanel + 1}
        total={panels.length}
        label={translations.progressIndicator}
        color={activeColor}
      />

      {/* Mobile hint */}
      <MobileHint text={translations.mobileHint} visible={showHint} />
    </>
  );
}
