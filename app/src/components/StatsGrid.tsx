'use client';

import { useState, useEffect, useRef } from 'react';
import { useCountUp } from '@/hooks/useCountUp';
import { InfiniteMovingCards } from './ui/infinite-moving-cards';

export interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

const STAT_COLORS = ['#00ff00', '#00ffff', '#b478ff', '#ff4da6'];

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  return isMobile;
};

const StaticStat = ({ value, suffix = '', prefix = '', label, color }: Stat & { color?: string }) => (
  <div className="flex flex-col items-center gap-1 px-8 py-4">
    <span
      className="text-4xl md:text-5xl font-bold tracking-tight"
      style={{ fontFamily: "'Clash Display', sans-serif", color }}
    >
      {prefix}{value}{suffix}
    </span>
    <span
      className="text-xs uppercase tracking-widest text-foreground-subtle"
      style={{ fontFamily: "'Clash Display', sans-serif" }}
    >
      {label}
    </span>
  </div>
);

const AnimatedStat = ({ value, suffix = '', prefix = '', label, delay = 0, color }: Stat & { delay?: number; color?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [delay]);

  const animatedValue = useCountUp(value, 2000, isVisible);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 px-8 py-4">
      <span
        className="text-4xl md:text-5xl font-bold tracking-tight"
        style={{ fontFamily: "'Clash Display', sans-serif", color }}
      >
        {prefix}{animatedValue}{suffix}
      </span>
      <span
        className="text-xs uppercase tracking-widest text-foreground-subtle"
        style={{ fontFamily: "'Clash Display', sans-serif" }}
      >
        {label}
      </span>
    </div>
  );
};

export default function StatsGrid({ stats, className = '' }: { stats: Stat[]; className?: string }) {
  const isMobile = useIsMobile(1024);

  if (isMobile) {
    return (
      <InfiniteMovingCards
        items={stats}
        direction="left"
        speed="slow"
        pauseOnHover={false}
        className={className}
        gap="gap-4"
        renderItem={(stat: Stat, idx: number) => (
          <StaticStat key={idx} {...stat} color={STAT_COLORS[idx % STAT_COLORS.length]} />
        )}
      />
    );
  }

  return (
    <div className={`grid grid-cols-4 gap-8 w-full max-w-4xl mx-auto ${className}`.trim()}>
      {stats.map((stat, index) => (
        <AnimatedStat key={index} {...stat} delay={index * 100} color={STAT_COLORS[index % STAT_COLORS.length]} />
      ))}
    </div>
  );
}
