import type { MetadataRoute } from 'next';
import { siteConfig } from '@/constants/metadata';
import { locales } from '@/i18n/locales';
import { getProjects } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const localizedPages = locales.flatMap((locale) => [
    {
      url: `${siteConfig.url}/${locale}`,
      lastModified: new Date(),
    },
  ]);

  const projectPages = await Promise.all(
    locales.map(async (locale) => {
      const projects = await getProjects(locale);

      return projects.map((project) => ({
        url: `${siteConfig.url}/${locale}/projects/${project.slug}`,
        lastModified: new Date(),
      }));
    }),
  );

  return [...localizedPages, ...projectPages.flat()];
}
