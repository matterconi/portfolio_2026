"use client";

import Image from "next/image";
import { useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import * as m from "motion/react-m";
import { ThemeToggle } from "./theme-toggle";

type NavItem = {
  name: string;
  href: string;
};

type NavMode = "initial" | "hidden" | "visible";

export function FloatingNav({
  items,
  identityHref,
}: {
  items: readonly NavItem[];
  identityHref: string;
}) {
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const [mode, setMode] = useState<NavMode>("initial");

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? current;

    if (current < 160) {
      setMode("initial");
      return;
    }

    setMode(current < previous ? "visible" : "hidden");
  });

  const hidden = mode === "hidden";

  return (
    <m.div
      className={`floating-header floating-header-${mode}`}
      initial={false}
      animate={hidden ? { opacity: 0, y: -24, scale: 0.985 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden={hidden ? true : undefined}
    >
      <a className="identity" href={identityHref} tabIndex={hidden ? -1 : undefined}>
        <Image
          src="/matteo-casual.webp"
          alt="Matteo Marconi"
          width={36}
          height={36}
          priority
        />
        <span>
          <strong>Matteo Marconi</strong>
          <small>Full-stack developer &amp; AI engineer</small>
        </span>
      </a>

      <div className="header-actions">
        <nav aria-label="Primary navigation">
          {items.map((item) => (
            <a href={item.href} key={item.href} tabIndex={hidden ? -1 : undefined}>
              {item.name}
            </a>
          ))}
        </nav>
        <ThemeToggle disabled={hidden} />
      </div>
    </m.div>
  );
}
