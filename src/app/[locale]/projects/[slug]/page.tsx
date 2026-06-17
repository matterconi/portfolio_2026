import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { getProjects, getProjectBySlug, getRecommendedProjects } from '@/lib/data';
import { sharedOGImage, siteConfig } from '@/constants/metadata';
import { TextReveal } from '@/components/ui/text-reveal';
import ProjectDetailContent from './ProjectDetailContent';
import ProjectScrollToTop from './ProjectScrollToTop';
import { isLocale, locales } from '@/i18n/locales';

const metadataLabelClass = 'text-xs font-semibold uppercase tracking-[0.22em] text-accent-green';
const metadataValueClass = 'mt-3 text-sm font-semibold leading-5 text-foreground';

function truncateDescription(description: string) {
  if (description.length <= 155) return description;
  return `${description.slice(0, 152).trim()}...`;
}

export async function generateStaticParams() {
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

  if (!isLocale(locale)) {
    return {};
  }

  const project = await getProjectBySlug(locale, slug);
  if (!project) return {};
  const title = `${project.title} | ${siteConfig.name}`;
  const description = truncateDescription(project.shortDescription);
  const canonicalUrl = `${siteConfig.url}/${locale}/projects/${project.slug}`;
  const image = project.images.hero || sharedOGImage.url;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteConfig.url}/en/projects/${project.slug}`,
        it: `${siteConfig.url}/it/projects/${project.slug}`,
        'x-default': `${siteConfig.url}/en/projects/${project.slug}`,
      },
    },
    openGraph: {
      type: 'article',
      locale: locale === 'it' ? 'it_IT' : 'en_US',
      alternateLocale: locale === 'it' ? ['en_US'] : ['it_IT'],
      siteName: siteConfig.name,
      url: canonicalUrl,
      title,
      description,
      images: [
        {
          url: image,
          alt: `${project.title} project preview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: siteConfig.twitterHandle,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const [project, recommendedProjects, t] = await Promise.all([
    getProjectBySlug(locale, slug),
    getRecommendedProjects(locale, slug),
    getTranslations({ locale, namespace: 'projects' }),
  ]);

  if (!project) {
    notFound();
  }

  const primaryStack = project.technologies.slice(0, 3).join(' / ');
  const projectType = project.projectType || 'Web App / Product Design';
  const projectRole = project.role || 'Developer / Designer';
  const metadataItems = [
    [t('indexLabel'), `${t('caseStudyLabel')} ${project.order.toString().padStart(2, '0')}`],
    [t('stackLabel'), primaryStack || 'Product Engineering'],
    [t('typeLabel'), projectType],
    [t('roleLabel'), projectRole],
  ];
  const revealText = project.suggestedCaseStudyText?.overview || project.fullDescription;
  const recommendedProjectCards = recommendedProjects.map((recommendedProject) => ({
    slug: recommendedProject.slug,
    title: recommendedProject.title,
    shortDescription: recommendedProject.shortDescription,
    technologies: recommendedProject.technologies,
    images: recommendedProject.images,
    order: recommendedProject.order,
  }));
  const projectUrl = `${siteConfig.url}/${locale}/projects/${project.slug}`;
  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    url: projectUrl,
    description: project.shortDescription,
    creator: {
      '@type': 'Person',
      name: siteConfig.creator,
      url: siteConfig.url,
    },
    image: `${siteConfig.url}${project.images.hero}`,
    keywords: project.technologies.join(', '),
  };

  return (
    <div className="min-h-screen bg-black text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <ProjectScrollToTop slug={slug} />
      <main className="mx-auto w-full max-w-7xl px-5 pb-8 pt-28 sm:px-8 sm:pb-10 sm:pt-32 lg:px-12 lg:pb-14 lg:pt-32">
        <Link
          href={`/${locale}/#projects`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-white transition-colors hover:text-accent-green"
        >
          ← {t('backToPortfolio')}
        </Link>

        <section className="max-w-5xl">
          <h1 className="font-display text-5xl font-semibold leading-[0.9] tracking-[-0.06em] text-foreground sm:text-7xl lg:text-8xl">
            {project.title}
          </h1>
        </section>

        <section className="relative mt-16 overflow-hidden rounded-[2rem] border border-border bg-background-elevated shadow-2xl shadow-black/40">
          <div className="absolute inset-0">
            <Image
              src={project.images.hero}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 1216px, 100vw"
              priority
            />
          </div>

          <div className="relative flex min-h-[520px] items-end p-4 sm:min-h-[620px] sm:p-8 lg:p-10">
            <div className="hidden w-full gap-3 lg:grid lg:grid-cols-4">
              {metadataItems.map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/15 bg-black p-4 shadow-xl shadow-black/50">
                  <p className={metadataLabelClass}>{label}</p>
                  <p className={metadataValueClass}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:hidden">
          {metadataItems.map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-black p-4 shadow-xl shadow-black/50">
              <p className={metadataLabelClass}>{label}</p>
              <p className={metadataValueClass}>{value}</p>
            </div>
          ))}
        </section>

        <div className="mx-auto max-w-4xl pt-10 pb-0 sm:pt-12 lg:pt-16">
          <TextReveal
            text={revealText}
            className="pb-8 [&>div]:text-base [&>div]:font-normal [&>div]:leading-7 sm:[&>div]:text-lg sm:[&>div]:leading-8"
          />
        </div>

        <ProjectDetailContent
          project={project}
          locale={locale}
          recommendedProjects={recommendedProjectCards}
          translations={{
            stackHeading: t('stackHeading'),
            storyHeading: t('storyHeading'),
            keyLessonsHeading: t('keyLessonsHeading'),
            problemTitle: t('problemTitle'),
            solutionTitle: t('solutionTitle'),
            technologiesTitle: t('technologiesTitle'),
            featuresTitle: t('featuresTitle'),
            linksTitle: t('linksTitle'),
            viewLive: t('viewLive'),
            viewGithub: t('viewGithub'),
            recommendedKicker: t('recommendedKicker'),
            recommendedTitle: t('recommendedTitle'),
            recommendedDescription: t('recommendedDescription'),
            viewProject: t('viewProject'),
            designFocus: t('designFocus'),
            developmentFocus: t('developmentFocus'),
            interactionDetails: t('interactionDetails'),
            technicalHighlights: t('technicalHighlights'),
            productStoryHeading: t('productStoryHeading'),
          }}
        />
      </main>
    </div>
  );
}
