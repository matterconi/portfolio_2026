import type { Metadata } from "next";

export const siteConfig = {
  name: "Matteo Marconi",
  url: "https://matteomarconi.com",
  description:
    "Portfolio of Matteo Marconi, a creative full-stack developer building immersive web experiences with Next.js, React, Three.js, WebGL, and AI.",
  creator: "Matteo Marconi",
  twitterHandle: "@matteomarconi",
};

export const sharedKeywords: string[] = [
  "Matteo Marconi",
  "Full-Stack Developer",
  "Creative Developer",
  "Next.js",
  "React",
  "TypeScript",
  "Three.js",
  "WebGL",
  "AI",
  "Web3",
  "Portfolio",
  "Frontend Development",
];

export const sharedAuthors: { name: string; url?: string }[] = [
  { name: siteConfig.creator, url: siteConfig.url },
];

export const sharedRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  nocache: false,
  googleBot: {
    index: true,
    follow: true,
    noimageindex: false,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export const sharedIcons: Metadata["icons"] = {
  icon: "/logo-v4.png",
  shortcut: "/logo-v4.png",
  apple: "/logo-v4.png",
};

export const sharedOGImage = {
  url: "/logo-v4.png",
  width: 386,
  height: 200,
  alt: `${siteConfig.name} - Creative Full-Stack Developer`,
};
