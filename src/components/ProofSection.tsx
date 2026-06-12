"use client";

import ScrollRevealText from "./ScrollRevealText";
import StatsGrid, { type Stat } from "./StatsGrid";

const lines = [
  "Creative Vision",
  "Solid Engineering",
  "Endless Curiosity",
];

interface ProofSectionProps {
  translations?: {
    yearsExp: string;
    projects: string;
    coreTools: string;
    languages: string;
  };
}

export default function ProofSection({ translations }: ProofSectionProps = {}) {
  const stats: Stat[] = [
    { value: 3, suffix: "+", label: translations?.yearsExp ?? "Years Exp" },
    { value: 20, suffix: "+", label: translations?.projects ?? "Projects" },
    { value: 9, label: translations?.coreTools ?? "Core Tools" },
    { value: 3, label: translations?.languages ?? "Languages" },
  ];

  return (
    <div className="relative z-10 overflow-visible">
      <ScrollRevealText lines={lines} />
      <StatsGrid stats={stats} className="mt-8" />
    </div>
  );
}
