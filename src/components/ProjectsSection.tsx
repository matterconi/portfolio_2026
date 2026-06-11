'use client';

import React from 'react';
import DomeGallery from './DomeGallery';
import { Project } from '@data/types';

interface ProjectsSectionProps {
  projects: Project[];
  locale: string;
  translations: {
    title: string;
    viewProject: string;
  };
}

const UNSPLASH_IMAGES = [
  '/images/projects/resumind.webp',
  '/images/projects/monoforge.webp',
  '/images/projects/colivio.webp',
  '/images/projects/interspeak.webp',
  '/images/projects/swaggerz.webp',
  '/images/projects/barman-clone.webp',
  '/images/projects/apple-clone.webp',
  '/images/projects/portfolio-2024.webp',
  '/images/projects/portfolio-2026.webp',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542393545-40078c300fdc?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1528901166007-3784c7dd3653?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop',
];

const RANDOM_NAMES = [
  'Resumind', 'Monoforge', 'Colivio', 'Interspeak', 'Swaggerz', 'Barman clone', 'Apple clone', 'Portfolio 2024', 'Portfolio 2026', 'Nebula', 'Cipher',
  'Quasar', 'Vertex', 'Kinetic', 'Zenith', 'Arcane', 'Echo', 'Lattice', 'Mirage',
  'Pulsar', 'Rift', 'Solstice', 'Titan',
];

const PROJECT_LINKS = [
  null,
  'https://www.monoforge.studio/',
  'https://colivio.vercel.app/',
  'https://platone-alpha.vercel.app/',
  'https://swaggerz-y7ys.vercel.app/',
  'https://gsap-cocktails-three-zeta.vercel.app/',
  'https://apple-clone-six-virid.vercel.app/#',
  'https://portfolio-eight-blue-39.vercel.app/',
  'https://matteomarconi.com',
  null, null, null, null, null, null, null, null, null, null, null, null, null, null,
];

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const images = UNSPLASH_IMAGES.map((src, i) => ({
    src,
    alt: RANDOM_NAMES[i % RANDOM_NAMES.length],
  }));

  const handleItemClick = (index: number) => {
    const link = PROJECT_LINKS[index];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="projects" className="relative w-full h-screen overflow-hidden bg-black touch-none">
      <div className="w-full h-full">
        <DomeGallery
          images={images}
          grayscale={false}
          overlayBlurColor="#000000"
          padFactor={0.05}
          onItemClick={handleItemClick}
        />
      </div>
    </section>
  );
}
