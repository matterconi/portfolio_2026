import { Locale, Project, Course, Skill, AboutContent, SocialLinks, PortfolioData, Review } from '@data/types';
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

export const getReviews = cache(async (locale: Locale): Promise<Review[]> => {
  const data = await import(`@data/${locale}/reviews.json`);
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
