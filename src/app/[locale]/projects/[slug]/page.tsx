import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { getProjects, getProjectBySlug } from '@/lib/data';
import { Locale } from '@data/types';
import ProjectDetailContent from './ProjectDetailContent';
import ProjectScrollToTop from './ProjectScrollToTop';

export async function generateStaticParams() {
  const locales: Locale[] = ['en', 'it'];
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const projects = await getProjects(locale);
    for (const project of projects) {
      params.push({ locale, slug: project.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(locale as Locale, slug);
  if (!project) return {};
  return {
    title: `${project.title} - Portfolio`,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(locale as Locale, slug);

  if (!project) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'projects' });

  return (
    <div className="min-h-screen bg-background">
      <ProjectScrollToTop slug={slug} />
      <div className="mx-auto w-full max-w-4xl px-6 sm:px-8 py-12">
        {/* Back link */}
        <Link
          href={`/${locale}/#projects`}
          className="inline-flex items-center gap-2 text-sm text-foreground-subtle hover:text-accent-green transition-colors mb-10"
        >
          ← {t('backToPortfolio')}
        </Link>

        {/* Hero image */}
        <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-background-elevated mb-10">
          <Image
            src={project.images.hero}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 896px, 100vw"
            priority
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/80 to-transparent p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-accent-green drop-shadow-[0_0_15px_rgba(0,255,0,0.4)]">
              {project.title}
            </h1>
          </div>
        </div>

        <ProjectDetailContent
          project={project}
          translations={{
            problemTitle: t('problemTitle'),
            solutionTitle: t('solutionTitle'),
            technologiesTitle: t('technologiesTitle'),
            featuresTitle: t('featuresTitle'),
            linksTitle: t('linksTitle'),
            viewLive: t('viewLive'),
            viewGithub: t('viewGithub'),
          }}
        />
      </div>
    </div>
  );
}
