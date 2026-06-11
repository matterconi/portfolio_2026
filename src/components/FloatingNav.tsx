"use client";
import React, { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export const FloatingNav = ({
  className
}: {
  className?: string;
}) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const homeBase = `/${locale}`;

  const { scrollY } = useScroll();
  const [isFloating, setIsFloating] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const navbarRef = useRef<HTMLDivElement>(null);
  const hasFloatedRef = useRef(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = lastScrollY.current;
    const direction = current - previous;
    const scrollingUp = direction < 0;

    if (current === 0) {
      hasFloatedRef.current = false;
      setIsFloating(false);
      setHideNavbar(false);
    } else if (!hasFloatedRef.current && !scrollingUp) {
      setIsFloating(false);
      setHideNavbar(false);
    } else {
      hasFloatedRef.current = true;
      setIsFloating(true);
      setHideNavbar(direction > 0 && current >= 100);
    }

    lastScrollY.current = current;
  });

  const menuItems = [
    { name: 'Home', href: `${homeBase}/#home` },
    { name: 'About', href: `${homeBase}/#about` },
    { name: 'Experience', href: `${homeBase}/#experience` },
    { name: 'Projects', href: `${homeBase}/#projects` },
    { name: 'Contact', href: `${homeBase}/#contact` },
  ];

  return (
    <motion.div
      ref={navbarRef}
      className={cn(
        "top-2 w-full z-[5000]",
        isFloating ? "fixed" : "absolute"
      )}
      animate={{
        y: isFloating && hideNavbar ? -100 : 0,
        opacity: isFloating && hideNavbar ? 0 : 1,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      <div className={cn(
        "flex inset-x-0 mx-auto rounded-md shadow-2xl items-center justify-between px-6 py-3 max-w-6xl",
        isFloating
          ? "bg-white/[0.08] backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]"
          : "bg-black",
        className
      )}>
        <a href={`${homeBase}/#home`} className="font-display text-xl font-bold tracking-wide flex-shrink-0 transition-opacity duration-300 hover:opacity-80">
          <span className="text-white">Matteo Marconi</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="px-3 py-2 text-sm font-medium transition-colors duration-300 text-gray-300 hover:text-white"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-gray-300 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-4 mx-4 rounded-md shadow-2xl bg-black/95 backdrop-blur-xl border border-gray-700/50 overflow-hidden">
            <div className="px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-white transition-colors rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
