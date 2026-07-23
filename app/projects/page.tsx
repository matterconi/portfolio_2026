import type { Metadata } from "next";
import Link from "next/link";
import { FloatingNav } from "../components/floating-nav";
import { MotionRoot, Reveal, ScrollProgress, SectionTitle } from "../components/motion";
import { ProjectCollection } from "../components/project-collection";
import { projects } from "../data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected full-stack, AI and interactive web projects by Matteo Marconi.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    url: "/projects",
    title: "Projects — Matteo Marconi",
    description: "Selected full-stack, AI and interactive web projects by Matteo Marconi.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — Matteo Marconi",
    description: "Selected full-stack, AI and interactive web projects by Matteo Marconi.",
  },
};

const floatingNavItems = [
  { name: "Home", href: "/" },
  { name: "Experience", href: "/#experience" },
  { name: "Education", href: "/#education" },
  { name: "Stack", href: "/#stack" },
] as const;

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function ProjectsPage() {
  return (
    <MotionRoot>
      <ScrollProgress />
      <FloatingNav items={floatingNavItems} identityHref="/" />
      <main className="page-shell projects-page site-main" id="top">
        <section className="projects-archive">
          <SectionTitle eyebrow="Selected work" title="All projects" headingLevel="h1" />
          <Reveal className="projects-archive-intro" delay={0.08} distance={12}>
            <p>
              A collection of full-stack products, AI experiments and interactive web experiences.
            </p>
          </Reveal>

          <ProjectCollection id="all-projects" projects={projects} archive showCount />

          <Reveal>
            <Link className="row-link projects-back-link" href="/">
              ← Back home
            </Link>
          </Reveal>
        </section>
      </main>

      <footer className="contact projects-contact">
        <div className="page-shell">
          <Reveal distance={20}>
            <h2>Have a role in mind?</h2>
          </Reveal>
          <Reveal className="contact-bottom" delay={0.06}>
            <div className="contact-actions">
              <a className="cta-link cta-link-primary" href="mailto:matterconi@gmail.com">
                matterconi@gmail.com <Arrow />
              </a>
              <a className="cta-link cta-link-secondary" href="/matteo-marconi-cv.pdf" download>
                Download CV <Arrow />
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
