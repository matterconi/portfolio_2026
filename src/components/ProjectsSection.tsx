'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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

export default function ProjectsSection({ projects, locale }: ProjectsSectionProps) {
  const router = useRouter();

  const visibleProjects = [...projects].sort((a, b) => a.order - b.order);
  const images = visibleProjects.map((project) => ({
    src: project.images.hero,
    alt: project.title,
  }));

  const handleItemClick = (index: number) => {
    const project = visibleProjects[index];
    if (project) {
      router.push(`/${locale}/projects/${project.slug}`);
    }
  };

  return (
    <section id="projects" className="relative w-full h-screen overflow-hidden bg-black">
      <div className="w-full h-full">
        <DomeGallery
          images={images}
          grayscale={false}
          overlayBlurColor="#000000"
          padFactor={0.05}
          disableEnlarge={true}
          onItemClick={handleItemClick}
        />
      </div>
    </section>
  );
}
