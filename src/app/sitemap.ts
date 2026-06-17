import type { MetadataRoute } from 'next';
import { siteConfig } from '@/constants/metadata';
import { locales } from '@/i18n/locales';
import { getProjects } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const localizedPages = locales.flatMap((locale) => [
    {
      url: `${siteConfig.url}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: locale === 'en' ? 1 : 0.9,
      alternates: {
        languages: {
          en: `${siteConfig.url}/en`,
          it: `${siteConfig.url}/it`,
          'x-default': `${siteConfig.url}/en`,
        },
      },
    },
  ]);

  const projectPages = await Promise.all(
    locales.map(async (locale) => {
      const projects = await getProjects(locale);

      return projects.map((project) => ({
        url: `${siteConfig.url}/${locale}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        alternates: {
          languages: {
            en: `${siteConfig.url}/en/projects/${project.slug}`,
            it: `${siteConfig.url}/it/projects/${project.slug}`,
            'x-default': `${siteConfig.url}/en/projects/${project.slug}`,
          },
        },
      }));
    }),
  );

  return [...localizedPages, ...projectPages.flat()];
}
