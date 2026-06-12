import { Locale, Project, Course, Skill, AboutContent, SocialLinks, PortfolioData } from '@data/types';
import { cache } from 'react';

// Cache data fetching functions to avoid multiple reads during SSR
export const getProjects = cache(async (locale: Locale): Promise<Project[]> => {
  const data = await import(`@data/${locale}/projects.json`);
  return data.default;
});

export const getCourses = cache(async (locale: Locale): Promise<Course[]> => {
  const data = await import(`@data/${locale}/courses.json`);
  return data.default;
});

export const getSkills = cache(async (locale: Locale): Promise<Skill[]> => {
  const data = await import(`@data/${locale}/skills.json`);
  return data.default;
});

export const getAbout = cache(async (locale: Locale): Promise<AboutContent> => {
  const data = await import(`@data/${locale}/about.json`);
  return data.default;
});

export const getSocialLinks = cache(async (locale: Locale): Promise<SocialLinks> => {
  const data = await import(`@data/${locale}/social.json`);
  return data.default;
});

// Helper functions for filtered data
export const getProjectBySlug = cache(async (locale: Locale, slug: string): Promise<Project | null> => {
  const projects = await getProjects(locale);
  return projects.find(p => p.slug === slug) || null;
});

const tokenizeProject = (project: Project) => {
  const text = [
    project.title,
    project.shortDescription,
    project.fullDescription,
    project.problem,
    project.projectType,
    project.stackSummary,
    project.portfolioValue,
    ...project.technologies,
    ...project.features,
    ...(project.whatILearned || []),
    ...(project.particularAspects || []),
    ...(project.designFocus || []),
    ...(project.developmentFocus || []),
    ...(project.interactionDetails || []),
    ...(project.technicalHighlights || []),
  ].filter(Boolean).join(' ');

  return new Set(text.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2));
};

const countOverlap = (left: Set<string>, right: Set<string>) => {
  let overlap = 0;

  for (const value of left) {
    if (right.has(value)) {
      overlap += 1;
    }
  }

  return overlap;
};

export const getRecommendedProjects = cache(async (
  locale: Locale,
  slug: string,
  limit = 3,
): Promise<Project[]> => {
  const projects = await getProjects(locale);
  const currentProject = projects.find((project) => project.slug === slug);

  if (!currentProject) {
    return [];
  }

  const currentTokens = tokenizeProject(currentProject);
  const currentTech = new Set(currentProject.technologies.map((tech) => tech.toLowerCase()));

  return projects
    .filter((project) => project.slug !== slug)
    .map((project) => {
      const tokens = tokenizeProject(project);
      const tech = new Set(project.technologies.map((item) => item.toLowerCase()));
      const tokenOverlap = countOverlap(currentTokens, tokens);
      const techOverlap = countOverlap(currentTech, tech);
      const sameType = project.projectType && currentProject.projectType && project.projectType === currentProject.projectType;

      return {
        project,
        score: tokenOverlap + techOverlap * 8 + (sameType ? 12 : 0),
      };
    })
    .sort((left, right) => right.score - left.score || left.project.order - right.project.order)
    .slice(0, limit)
    .map(({ project }) => project);
});

// Aggregator: load all portfolio data for a locale
export const getPortfolioData = cache(async (locale: Locale): Promise<PortfolioData> => {
  const [about, projects, experience, skills, social] = await Promise.all([
    getAbout(locale),
    getProjects(locale),
    getCourses(locale),
    getSkills(locale),
    getSocialLinks(locale),
  ]);

  return { about, projects, experience, skills, social };
});
