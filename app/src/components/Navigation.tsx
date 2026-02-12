'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useActiveSection } from '@/hooks/useActiveSection';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const SECTION_IDS = ['home', 'about', 'abc', 'experience', 'projects', 'skills', 'contact'];

const SECTION_ICONS: Record<string, React.ReactNode> = {
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  about: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  abc: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  experience: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  projects: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  skills: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  contact: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
};

export default function Navigation() {
  const t = useTranslations('nav');
  const scrollDirection = useScrollDirection();
  const activeSection = useActiveSection(SECTION_IDS);
  const prefersReducedMotion = useReducedMotion();

  const [isVisible, setIsVisible] = useState(false);
  const [isNearTop, setIsNearTop] = useState(false);
  const hideTimeoutRef = useMemo(() => ({ current: null as ReturnType<typeof setTimeout> | null }), []);

  const resetHideTimer = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      if (!isNearTop) {
        setIsVisible(false);
      }
    }, 2500);
  }, [isNearTop, hideTimeoutRef]);

  // Handle scroll direction
  useEffect(() => {
    if (scrollDirection === 'up') {
      setIsVisible(true);
      resetHideTimer();
    } else if (scrollDirection === 'down' && !isNearTop) {
      setIsVisible(false);
    }
  }, [scrollDirection, isNearTop, resetHideTimer]);

  // Handle mouse near top of viewport (desktop only)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nearTop = e.clientY < 100;
      setIsNearTop(nearTop);
      if (nearTop) {
        setIsVisible(true);
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
      } else if (scrollDirection !== 'up') {
        resetHideTimer();
      }
    };

    const mediaQuery = window.matchMedia('(min-width: 768px)');
    if (mediaQuery.matches) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [scrollDirection, resetHideTimer, hideTimeoutRef]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [hideTimeoutRef]);

  const navLinks = SECTION_IDS.map((id) => ({
    id,
    label: t(id as any),
    href: `#${id}`,
  }));

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: '-100%' }}
        animate={{ y: isVisible ? '0%' : '-100%' }}
        transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:block"
      >
        <div className="bg-background/95 backdrop-blur-md border-b border-border">
          <div className="mx-auto max-w-4xl px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className={`text-sm transition-colors duration-200 ${
                    activeSection === link.id
                      ? 'text-accent-green border-b-2 border-accent-green pb-0.5'
                      : 'text-foreground-muted hover:text-accent-cyan'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-background/95 backdrop-blur-md border-t border-border">
          <div className="flex items-center justify-around h-16 px-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-md transition-colors duration-200 ${
                  activeSection === link.id
                    ? 'text-accent-green bg-accent-green-subtle'
                    : 'text-foreground-subtle hover:text-accent-cyan'
                }`}
              >
                {SECTION_ICONS[link.id]}
                <span className="text-[10px] leading-none">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
