import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale, Skill } from '@data/types';
import { getProjects, getSkills, getCourses, getAbout } from '@/lib/data';
import { siteConfig } from '@/constants/metadata';
import AboutSection from '@/components/AboutSection';
import ABCSection from '@/components/ABCSection';
import ExperienceSection from '@/components/ExperienceSection';
import ContactSection from '@/components/ContactSection';
import ProjectsSection from '@/components/ProjectsSection';
import Hero from '@/components/Hero';
import TechStackSection from '@/components/TechStackSection';
import ProofSection from '@/components/ProofSection';

import ComparisonSection from '@/components/ComparisonSection';
import ScrollBanner from '@/components/ScrollBanner';


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });

  return {
    title: {
      absolute: siteConfig.name,
    },
    description: t('tagline'),
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  // Load all translations
  const tAbout = await getTranslations({ locale, namespace: 'about' });
  const tAbc = await getTranslations({ locale, namespace: 'abc' });
  const tExp = await getTranslations({ locale, namespace: 'experience' });
  const tHero = await getTranslations({ locale, namespace: 'hero' });
  const tProjects = await getTranslations({ locale, namespace: 'projects' });
  const tSkills = await getTranslations({ locale, namespace: 'skills' });
  const tComparison = await getTranslations({ locale, namespace: 'comparison' });
  const tStack = await getTranslations({ locale, namespace: 'stack' });
  const tProof = await getTranslations({ locale, namespace: 'proof' });
  const tContact = await getTranslations({ locale, namespace: 'contact' });

  // Load all data
  const [about, projects, courses, skills] = await Promise.all([
    getAbout(loc),
    getProjects(loc),
    getCourses(loc),
    getSkills(loc),
  ]);

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-black">
      <div className="relative bg-black">
              {/* Hero Section */}
              <Hero about={about} ctaLabel={tHero('ctaLabel')} />
              <TechStackSection translations={{ stackTitle: tStack('title'), stackDescription: tStack('description') }} />

        {/* Scroll Reveal + Stats */}
        <ProofSection translations={{ yearsExp: tProof('yearsExp'), projects: tProof('projects'), coreTools: tProof('coreTools'), languages: tProof('languages') }} />
      {/* About Section */}
      <AboutSection title={tAbout('title')} about={about} />

      {/* Spacer before ABC Section */}
      <div className="h-12 sm:h-16" />

      {/* ABC Section — full bleed */}
      <ABCSection
          sectionTitle={tAbc('title')}
          sectionDescription={tAbc('description')}
          translations={{
            progressIndicator: tAbc('progressIndicator'),
            mobileHint: tAbc('mobileHint'),
            scrollHint: tAbc('scrollHint'),
          }}
          panelTopics={{
            a: [
              { title: tAbc('automationTitle'), description: tAbc('automationDescription'), image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&q=80&auto=format&fit=crop', bullets: tAbc('automationBullets').split(', '), emphasize: ['Scripting,', 'CI/CD', 'infrastructure-as-code', 'pipeline', 'infrastruttura'] },
              { title: tAbc('animationsTitle'), description: tAbc('animationsDescription'), image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80&auto=format&fit=crop', bullets: tAbc('animationsBullets').split(', '), emphasize: ['Motion', 'interattive', 'interactive', 'immersive', 'immersive'] },
            ],
            b: [
              { title: tAbc('blockchainTitle'), description: tAbc('blockchainDescription'), image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80&auto=format&fit=crop', bullets: tAbc('blockchainBullets').split(', '), emphasize: ['Smart', 'Web3', 'Ethereum.', 'decentralizzate', 'decentralized'] },
              { title: tAbc('backendTitle'), description: tAbc('backendDescription'), image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80&auto=format&fit=crop', bullets: tAbc('backendBullets').split(', '), emphasize: ['REST/GraphQL', 'microservizi', 'microservices', 'scalabili.', 'scalable'] },
            ],
            c: [
              { title: tAbc('graphicsTitle'), description: tAbc('graphicsDescription'), image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80&auto=format&fit=crop', bullets: tAbc('graphicsBullets').split(', '), emphasize: ['3D', 'WebGL', 'shader', 'shaders,'] },
              { title: tAbc('cyberSecurityTitle'), description: tAbc('cyberSecurityDescription'), image: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=400&q=80&auto=format&fit=crop', bullets: tAbc('cyberSecurityBullets').split(', '), emphasize: ['Penetration', 'vulnerabilità', 'vulnerability', 'sicuro.', 'secure'] },
            ],
          }}
        />
      </div>

      {/* Spacer between ABC and Comparison */}
      <div className="h-16 sm:h-24" />

      {/* Comparison Section — outside stacking context so z-20 can cover ABCSection */}
      <ComparisonSection
        translations={{
          title: tComparison('title'),
          description: tComparison('description'),
          aiLabel: tComparison('aiLabel'),
          devLabel: tComparison('devLabel'),
        }}
      />

      {/* Education Section — higher z-index so it stays above the banner on scroll up */}
      <div className="relative z-40 bg-black">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
          <ExperienceSection
            title={tExp('title')}
            courses={courses}
            locale={locale}
            translations={{
              motivationLine1: tExp('motivationLine1'),
              motivationLine2: tExp('motivationLine2'),
              studyHint: tExp('studyHint'),
            }}
          />
        </div>
      </div>

      {/* Scroll Banner — sticky reveal, sits above projects but below education */}
      <div className="relative z-30 bg-black">
        <ScrollBanner />
      </div>

      {/* Projects & below — lower z-index so the banner can cover it */}
      <div className="relative z-20 bg-black">
        <ProjectsSection
          projects={projects}
          locale={locale}
          translations={{
            title: tProjects('title'),
            viewProject: tProjects('viewProject'),
          }}
        />

        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
          {/* Contact Section */}
          <ContactSection
            locale={locale}
            translations={{
              title: tContact('title'),
              nameLabel: tContact('nameLabel'),
              emailLabel: tContact('emailLabel'),
              messageLabel: tContact('messageLabel'),
              nameFieldPlaceholder: tContact('nameFieldPlaceholder'),
              emailFieldPlaceholder: tContact('emailFieldPlaceholder'),
              messageFieldPlaceholder: tContact('messageFieldPlaceholder'),
              sendButton: tContact('sendButton'),
              successMessage: tContact('successMessage'),
              errorMessage: tContact('errorMessage'),
              downloadCV: tContact('downloadCV'),

              nameRequired: tContact('nameRequired'),
              emailRequired: tContact('emailRequired'),
              emailInvalid: tContact('emailInvalid'),
              messageRequired: tContact('messageRequired'),
              messageMinLength: tContact('messageMinLength'),
              turnstileError: tContact('turnstileError'),
              networkError: tContact('networkError'),
              serverError: tContact('serverError'),
              successModalTitle: tContact('successModalTitle'),
              successModalMessage: tContact('successModalMessage'),
              revealLine1: tContact('revealLine1'),
              revealLine2: tContact('revealLine2'),
              revealDescription: tContact('revealDescription'),
            }}
            turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
          />
        </div>
      </div>

    </div>
  );
}
