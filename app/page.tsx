import Image from "next/image";
import Link from "next/link";
import {
  FadeArticle,
  HeroTitle,
  MotionRoot,
  Reveal,
  RevealArticle,
  SectionTitle,
  SlideArticle,
  ScrollProgress,
  StackGroup,
} from "./components/motion";
import { CopyEmailButton } from "./components/copy-email-button";
import { FloatingNav } from "./components/floating-nav";
import { ProjectCollection } from "./components/project-collection";
import { projects } from "./data/projects";
import { getGitHubActivity } from "./lib/github-activity";

const floatingNavItems = [
  { name: "Work", href: "#work" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Stack", href: "#stack" },
] as const;

const homeProjectOrder = {
  ai: ["InterSpeak", "Monocode", "Resumind"],
};

const experience = [
  {
    role: "Full-Stack Developer & AI Engineer",
    company: "Monoforge Studio",
    location: "Florence, Italy",
    period: "2026 — Present",
    description:
      "Building AI products and full-stack applications, from product definition to delivery. Voice agents, workflow automation, MCP integrations, APIs, webhooks and real-time features.",
  },
  {
    role: "Web Developer · Collaboration",
    company: "BYLT Media",
    location: "London, UK",
    period: "2026",
    description:
      "Designed and developed a new corporate landing page for a performance marketing agency using Next.js, Three.js and scroll-driven animation.",
  },
];

const education = [
  {
    title: "Build Your Own Claude Code",
    provider: "Code With Antonio",
    status: "Completed",
    year: "2026",
    description:
      "Created a terminal coding agent capable of planning multi-step tasks, calling tools, editing files and executing commands.",
    image: "/courses/claude-code.svg",
    imageFit: "contain",
  },
  {
    title: "The Ultimate Next.js 16 Course",
    provider: "JavaScript Mastery",
    status: "Completed",
    year: "2025",
    description:
      "Explored modern Next.js architecture through a production-style app, with the App Router, Server Components, caching and server-side data flows.",
    image: "/courses/nextjs.webp",
  },
  {
    title: "Full-Stack Engineer",
    provider: "Codecademy",
    status: "Completed",
    year: "2024",
    description:
      "Completed a broad full-stack curriculum spanning React interfaces, Node.js and Express APIs, authentication and relational data with PostgreSQL.",
    image: "/courses/codecademy-certificate.png",
    imagePosition: "top",
  },
  {
    title: "Degree in Modern Literature",
    provider: "University of Florence",
    status: "Graduated",
    year: "2023",
    description:
      "Studied modern literature with a focus on research, critical analysis and long-form writing, culminating in an undergraduate thesis.",
    image: "/courses/university-florence.svg",
    imageFit: "logo",
  },
];

const iconBase = "https://cdn.jsdelivr.net/npm/simple-icons@v16/icons";

const stack = [
  {
    category: "Frontend",
    tools: [
      { name: "React", slug: "react" },
      { name: "Next.js", slug: "nextdotjs" },
      { name: "TypeScript", slug: "typescript" },
      { name: "Tailwind CSS", slug: "tailwindcss" },
      { name: "Framer Motion", slug: "framer" },
    ],
  },
  {
    category: "Backend",
    tools: [
      { name: "Node.js", slug: "nodedotjs" },
      { name: "NestJS", slug: "nestjs" },
      { name: "Express", slug: "express" },
      { name: "Hono", slug: "hono" },
      { name: "JWT", slug: "jsonwebtokens" },
    ],
  },
  {
    category: "Data",
    tools: [
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "Prisma", slug: "prisma" },
      { name: "Drizzle", slug: "drizzle" },
      { name: "MongoDB", slug: "mongodb" },
      { name: "Redis", slug: "redis" },
    ],
  },
  {
    category: "Product",
    tools: [
      { name: "Stripe", slug: "stripe" },
      { name: "Paddle", slug: "paddle" },
      { name: "Resend", slug: "resend" },
      { name: "Sentry", slug: "sentry" },
      { name: "Cloudflare", slug: "cloudflare" },
    ],
  },
  {
    category: "AI",
    tools: [
      { name: "AI SDK", slug: "vercel" },
      { name: "OpenAI", mark: "openai" },
      { name: "Claude Code", mark: "claude" },
      { name: "DeepSeek", slug: "deepseek" },
      { name: "Gemini", slug: "googlegemini" },
      { name: "Vapi", mark: "vapi" },
    ],
  },
  {
    category: "Tooling",
    tools: [
      { name: "Git", slug: "git" },
      { name: "Docker", slug: "docker" },
      { name: "GitHub Actions", slug: "githubactions" },
      { name: "Vercel", slug: "vercel" },
      { name: "Vitest", slug: "vitest" },
      { name: "Bun", slug: "bun" },
    ],
  },
] satisfies Array<{
  category: string;
  tools: Array<{ name: string; slug?: string; mark?: "openai" | "claude" | "vapi" }>;
}>;

function BrandMark({
  name,
  slug,
  mark,
}: {
  name: string;
  slug?: string;
  mark?: "openai" | "claude" | "vapi";
}) {
  if (mark === "openai") {
    return (
      <svg className="brand-mark brand-mark-openai" viewBox="0 0 24 24" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.55">
          <ellipse cx="12" cy="7.8" rx="4.15" ry="2.75" />
          <ellipse cx="12" cy="7.8" rx="4.15" ry="2.75" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="7.8" rx="4.15" ry="2.75" transform="rotate(120 12 12)" />
          <ellipse cx="12" cy="7.8" rx="4.15" ry="2.75" transform="rotate(180 12 12)" />
          <ellipse cx="12" cy="7.8" rx="4.15" ry="2.75" transform="rotate(240 12 12)" />
          <ellipse cx="12" cy="7.8" rx="4.15" ry="2.75" transform="rotate(300 12 12)" />
        </g>
      </svg>
    );
  }

  if (mark === "claude") {
    return (
      <svg className="brand-mark brand-mark-claude" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.5v19M2.5 12h19M5.3 5.3l13.4 13.4M18.7 5.3 5.3 18.7M8.3 3.5l7.4 17M20.5 8.3l-17 7.4M15.7 3.5l-7.4 17M3.5 8.3l17 7.4" />
      </svg>
    );
  }

  if (mark === "vapi") {
    return (
      <svg className="brand-mark brand-mark-vapi" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="9" width="3" height="6" rx="1.5" />
        <rect x="8" y="5" width="3" height="14" rx="1.5" />
        <rect x="13" y="2" width="3" height="20" rx="1.5" />
        <rect x="18" y="7" width="3" height="10" rx="1.5" />
      </svg>
    );
  }

  return (
    <Image
      src={`${iconBase}/${slug}.svg`}
      alt={`${name} logo`}
      width={16}
      height={16}
      unoptimized
    />
  );
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 8.2H3.3V21h3.2V8.2ZM4.9 3A1.9 1.9 0 1 0 4.9 6.8 1.9 1.9 0 0 0 4.9 3ZM21 13.7c0-3.86-2.06-5.66-4.8-5.66a4.15 4.15 0 0 0-3.75 2.06V8.2H9.25V21h3.2v-6.34c0-1.67.32-3.29 2.39-3.29 2.04 0 2.06 1.91 2.06 3.4V21H21v-7.3Z" />
    </svg>
  );
}

async function GitHubTracker() {
  const { total } = await getGitHubActivity();

  return (
    <a
      className="github-tracker-link"
      href="https://github.com/matterconi"
      target="_blank"
      rel="noreferrer"
      aria-label="View matterconi on GitHub"
    >
      <figure className="github-tracker">
        <div className="github-tracker-header">
          <span className="github-tracker-brand">
            <GitHubIcon />
            View GitHub profile
          </span>
          <span className="github-tracker-handle">@matterconi</span>
        </div>
        <div className="github-tracker-chart">
          <Image
            src="/github-activity?display=graph-v2"
            alt="GitHub contribution activity for matterconi over the last year"
            width={660}
            height={100}
            sizes="(max-width: 720px) 660px, 660px"
            unoptimized
          />
        </div>
        <figcaption className="github-tracker-caption">
          <strong>{total?.toLocaleString("en-US") ?? "—"}</strong> contributions in the last year
        </figcaption>
      </figure>
    </a>
  );
}

export default function Home() {
  return (
    <MotionRoot>
      <ScrollProgress />
      <FloatingNav items={floatingNavItems} identityHref="#top" />
      <main className="page-shell site-main" id="top">
      <section className="intro">
        <HeroTitle>Full-stack web applications, built and shipped with AI.</HeroTitle>
        <Reveal delay={0.1} distance={12}>
          <p className="intro-copy">
            I&apos;m a full-stack developer and AI engineer focused on building production-ready web
            products end to end. I combine Next.js, TypeScript and PostgreSQL with LLMs, voice
            agents and automation, taking projects from product definition to deployment.
          </p>

          <div className="quick-links">
            <CopyEmailButton />
            <a className="cta-link cta-link-secondary" href="/matteo-marconi-cv.pdf" download>
              Download CV <Arrow />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <GitHubTracker />
        </Reveal>

        <div className="currently-working">
          <SectionTitle
            className="currently-working-title"
            eyebrow="Selected work"
            title="Currently working on"
          />
          <RevealArticle className="current-project" delay={0.06}>
            <div className="current-project-copy">
              <div className="current-project-heading">
                <h3>Monoforge</h3>
              </div>
              <p>
                A technical-visual studio building direct AI systems, automations and
                conversational interfaces.
              </p>
              <div className="tags" aria-label="Project stack">
                <span>AI</span>
                <span>3D</span>
                <span>Motion design</span>
              </div>
              <a
                className="cta-link cta-link-secondary current-project-cta"
                href="https://www.monoforge.studio/"
                target="_blank"
                rel="noreferrer"
              >
                View live site <Arrow />
              </a>
            </div>
            <div className="current-project-image">
              <Image
                src="/projects/monoforge.webp"
                alt="Preview of the Monoforge Studio website"
                width={320}
                height={180}
                sizes="(max-width: 720px) 100vw, 320px"
              />
            </div>
          </RevealArticle>
        </div>
      </section>

      <section className="section" id="work">
        <SectionTitle eyebrow="Selected work" title="Projects" />

        <ProjectCollection
          id="home-projects"
          projects={projects}
          maxResults={3}
          showFilterCounts={false}
          allLabel="Featured"
          projectOrderByFilter={homeProjectOrder}
        />

        <Reveal className="projects-cta-wrap">
          <Link className="cta-link cta-link-secondary" href="/projects">
            Explore all projects <Arrow />
          </Link>
        </Reveal>
      </section>

      <section className="section" id="experience">
        <SectionTitle eyebrow="Career" title="Experience" />

        <div className="experience-list">
          {experience.map((item, index) => (
            <SlideArticle
              delay={index * 0.06}
              direction={index % 2 === 0 ? "left" : "right"}
              key={item.company}
            >
              <div className="experience-role">
                <h3>{item.role}</h3>
                <p>{item.company}</p>
              </div>
              <p className="experience-description">{item.description}</p>
              <div className="experience-meta">
                <time>{item.period}</time>
                <span>{item.location}</span>
              </div>
            </SlideArticle>
          ))}
        </div>
      </section>

      <section className="section" id="education">
        <SectionTitle eyebrow="Training" title="Education" />

        <div className="education-grid">
          {education.map((item, index) => (
            <FadeArticle delay={Math.min(index * 0.055, 0.15)} key={item.title}>
                  <div
                    className={`education-image${item.imageFit === "logo" ? " education-image-logo" : ""}`}
                  >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 720px) 88px, 104px"
                  className={item.imageFit ? `is-${item.imageFit}` : undefined}
                  style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
                />
              </div>
              <div className="education-copy">
                <h3>{item.title}</h3>
                <p>{item.provider}</p>
              </div>
              <p className="education-description">{item.description}</p>
              <div className="education-meta">
                <span>{item.status}</span>
                <time>{item.year}</time>
              </div>
            </FadeArticle>
          ))}
        </div>
      </section>

      <section className="section" id="stack">
        <SectionTitle eyebrow="Toolkit" title="Tech stack" />

        <div className="stack-grid">
          {stack.map(({ category, tools }, index) => (
            <StackGroup title={category} delay={(index % 2) * 0.06} key={category}>
              {tools.map((tool) => (
                  <span className="tech-chip-content" key={tool.name}>
                    <BrandMark {...tool} />
                    {tool.name}
                  </span>
              ))}
            </StackGroup>
          ))}
        </div>
      </section>
      </main>

      <footer className="contact">
        <div className="page-shell">
          <Reveal distance={20}>
            <h2>Have a role in mind?</h2>
          </Reveal>
          <Reveal className="contact-bottom" delay={0.06}>
            <div className="contact-actions">
              <CopyEmailButton />
              <a className="cta-link cta-link-secondary" href="/matteo-marconi-cv.pdf" download>
                Download CV <Arrow />
              </a>
            </div>
            <div className="social-links" aria-label="Social links">
              <a
                className="social-link"
                href="https://github.com/matterconi"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
              >
                <GitHubIcon />
              </a>
              <a
                className="social-link"
                href="https://www.linkedin.com/in/matteo-marconi-582625416/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
              >
                <LinkedInIcon />
              </a>
            </div>
          </Reveal>
          <div className="footer-meta">
            <span>
              Matteo Marconi · <time dateTime="2026">2026</time>
            </span>
            <span>Full-stack &amp; AI Engineer</span>
          </div>
        </div>
      </footer>
    </MotionRoot>
  );
}
