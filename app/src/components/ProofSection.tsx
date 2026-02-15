"use client";

import ScrollRevealText from "./ScrollRevealText";
import StatsGrid, { type Stat } from "./StatsGrid";

const stats: Stat[] = [
  { value: 3, suffix: "+", label: "Years Exp" },
  { value: 20, suffix: "+", label: "Projects" },
  { value: 9, label: "Core Tools" },
  { value: 3, label: "Languages" },
];

const lines = [
  "Creative Vision",
  "Solid Engineering",
  "Endless Curiosity",
];

export default function ProofSection() {
  return (
    <div className="relative z-10 overflow-visible">
      <ScrollRevealText lines={lines} />
      <StatsGrid stats={stats} className="mt-8" />
    </div>
  );
}
