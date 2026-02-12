import { getTranslations } from 'next-intl/server';
import { getProjects, getSkills, getCourses, getAbout, getSocialLinks } from '@/lib/data';
import { Locale, Skill } from '@data/types';
import AboutSection from '@/components/AboutSection';
import ABCSection from '@/components/ABCSection';
import ExperienceSection from '@/components/ExperienceSection';
import ContactSection from '@/components/ContactSection';
import ProjectsSection from '@/components/ProjectsSection';
import HeroShader from '@/components/HeroShader';
import HeroText from '@/components/HeroText';
import Hero from '@/components/Hero';
import TechStackSection from '@/components/TechStackSection';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });

  return {
    title: `${t('name')} - Portfolio`,
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
  const tProjects = await getTranslations({ locale, namespace: 'projects' });
  const tSkills = await getTranslations({ locale, namespace: 'skills' });
  const tContact = await getTranslations({ locale, namespace: 'contact' });

  // Load all data
  const [about, projects, courses, skills, social] = await Promise.all([
    getAbout(loc),
    getProjects(loc),
    getCourses(loc),
    getSkills(loc),
    getSocialLinks(loc),
  ]);

  // ABC skills filtered to automation/blockchain/graphics categories
  const abcCategories: Skill['category'][] = ['automation', 'blockchain', 'graphics'];
  const abcSkills = skills.filter((s) => abcCategories.includes(s.category));

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-black">
              {/* Hero Section */}
              <Hero about={about}/>
              <TechStackSection />
      {/* About Section — fuori dal container per titolo full-width */}
      <AboutSection title={tAbout('title')} about={about} />

      <div className="mx-auto w-full max-w-4xl px-6 sm:px-8">
        {/* ABC Section */}
        <ABCSection
          sectionTitle={tAbc('title')}
          skills={abcSkills.map((s) => ({
            category: s.category,
            name: s.name,
            icon: s.icon,
            description: s.description,
          }))}
          translations={{
            progressIndicator: tAbc('progressIndicator'),
            mobileHint: tAbc('mobileHint'),
            scrollHint: tAbc('scrollHint'),
          }}
          panelMeta={{
            automationTitle: tAbc('automationTitle'),
            automationDescription: tAbc('automationDescription'),
            blockchainTitle: tAbc('blockchainTitle'),
            blockchainDescription: tAbc('blockchainDescription'),
            graphicsTitle: tAbc('graphicsTitle'),
            graphicsDescription: tAbc('graphicsDescription'),
          }}
        />

        {/* Experience Section */}
        <ExperienceSection
          title={tExp('title')}
          courses={courses}
          locale={locale}
          certificateLabel={tExp('certificateLabel')}
        />

        {/* Projects Section */}
        <ProjectsSection
          projects={projects}
          locale={locale}
          translations={{
            title: tProjects('title'),
            viewProject: tProjects('viewProject'),
          }}
        />

        {/* Skills Section */}
        <section id="skills" className="py-20">
          <h2 className="mb-8 text-2xl font-semibold text-accent-cyan">
            {tSkills('title')}
          </h2>
          <div className="space-y-8">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground-subtle">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <span
                      key={skill.name}
                      title={skill.description}
                      className="rounded border border-border bg-background-elevated px-3 py-1.5 text-sm text-foreground-muted hover:border-accent-cyan hover:text-accent-cyan transition-colors cursor-default"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <ContactSection
          locale={locale}
          translations={{
            title: tContact('title'),
            nameLabel: tContact('nameLabel'),
            emailLabel: tContact('emailLabel'),
            messageLabel: tContact('messageLabel'),
            sendButton: tContact('sendButton'),
            successMessage: tContact('successMessage'),
            errorMessage: tContact('errorMessage'),
            socialLinks: tContact('socialLinks'),
            downloadCV: tContact('downloadCV'),
            viewCV: tContact('viewCV'),
            cvPreviewTitle: tContact('cvPreviewTitle'),
            closeModal: tContact('closeModal'),
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
          }}
          socialLinks={social}
          turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
        />

      </div>
    </div>
  );
}
