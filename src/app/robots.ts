import type { MetadataRoute } from 'next';
import { siteConfig } from '@/constants/metadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/en/demo-about',
        '/it/demo-about',
        '/en/demo-reveal',
        '/it/demo-reveal',
        '/en/horizontal-demo',
        '/it/horizontal-demo',
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
