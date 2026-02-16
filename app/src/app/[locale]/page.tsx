import { getTranslations } from 'next-intl/server';
import { getProjects, getSkills, getCourses, getAbout, getSocialLinks } from '@/lib/data';
import { Locale, Skill } from '@data/types';
import AboutSection from '@/components/AboutSection';
import ABCSection from '@/components/ABCSection';
import ChessSection from '@/components/ChessSection';
import ExperienceSection from '@/components/ExperienceSection';
import ContactSection from '@/components/ContactSection';
import ProjectsSection from '@/components/ProjectsSection';
import Hero from '@/components/Hero';
import TechStackSection from '@/components/TechStackSection';
import ProofSection from '@/components/ProofSection';

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
  const tChess = await getTranslations({ locale, namespace: 'chess' });
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

        {/* Scroll Reveal + Stats */}
        <ProofSection />
      {/* About Section */}
      <AboutSection title={tAbout('title')} about={about} />

      {/* ABC Section — full bleed */}
      <ABCSection
          sectionTitle={tAbc('title')}
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

      {/* Chess Section */}
      <ChessSection
        translations={{
          title: tChess('title'),
          subtitle: tChess('subtitle'),
          newGame: tChess('newGame'),
          undo: tChess('undo'),
          flipBoard: tChess('flipBoard'),
          yourTurn: tChess('yourTurn'),
          botTurn: tChess('botTurn'),
          check: tChess('check'),
          checkmate: tChess('checkmate'),
          stalemate: tChess('stalemate'),
          draw: tChess('draw'),
          moveHistory: tChess('moveHistory'),
          white: tChess('white'),
          black: tChess('black'),
          connectWallet: tChess('connectWallet'),
          playAs: tChess('playAs'),
          copyPgn: tChess('copyPgn'),
          copied: tChess('copied'),
          capturedPieces: tChess('capturedPieces'),
          sound: tChess('sound'),
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
        {/* Experience Section */}
        <ExperienceSection
          title={tExp('title')}
          courses={courses}
          locale={locale}
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
