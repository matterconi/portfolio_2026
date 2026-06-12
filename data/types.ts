/** A portfolio project with full details for the project showcase page. */
export interface ProjectAspect {
  /** Short accordion title */
  title: string;
  /** Supporting accordion body */
  content: string;
}

export interface Project {
  /** URL-friendly identifier used for routing (e.g., "ecommerce-platform") */
  slug: string;
  /** Display title of the project */
  title: string;
  /** Brief one-line summary shown in project cards */
  shortDescription: string;
  /** Detailed description shown on the project detail page */
  fullDescription: string;
  /** The problem this project solves */
  problem: string;
  /** List of technologies used (e.g., ["Next.js", "TypeScript", "Prisma"]) */
  technologies: string[];
  /** Key features of the project */
  features: string[];
  /** Project category shown in detail pages */
  projectType?: string;
  /** Role covered in the project */
  role?: string;
  /** Short explanation of how the stack was used */
  stackSummary?: string;
  /** Main learnings from the project */
  whatILearned?: string[];
  /** Notable visual or technical details */
  particularAspects?: ProjectAspect[];
  /** Design-focused highlights */
  designFocus?: string[];
  /** Development-focused highlights */
  developmentFocus?: string[];
  /** Interaction and motion details */
  interactionDetails?: string[];
  /** Technical implementation highlights */
  technicalHighlights?: string[];
  /** Why this project is valuable in the portfolio */
  portfolioValue?: string;
  /** Ready-to-render case study copy */
  suggestedCaseStudyText?: {
    overview?: string;
    learnings?: string;
    particularAspects?: string;
    outcome?: string;
  };
  /** Image paths for the project */
  images: {
    /** Hero/banner image path */
    hero: string;
    /** Optional visual used in the stack section */
    stack?: string;
    /** Optional visual used in the key lessons section */
    lessons?: string;
    /** Additional screenshot paths */
    screenshots: string[];
  };
  /** External links related to the project */
  links: {
    /** Live deployment URL */
    live?: string;
    /** GitHub repository URL */
    github?: string;
  };
  /** Display order (lower numbers appear first) */
  order: number;
}

/** A completed course or certification. */
export interface Course {
  /** Unique identifier for the course */
  id: string;
  /** Course title */
  title: string;
  /** Platform or institution that provided the course (e.g., "Udemy", "Coursera") */
  provider: string;
  /** Icon identifier or path for the provider */
  icon: string;
  /** Skills gained from the course */
  skills: string[];
  /** Date when the course was completed (ISO date string) */
  completionDate: string;
  /** URL to the certificate, if available */
  certificateUrl?: string;
}

/** A technical skill categorized by domain. */
export interface Skill {
  /** The domain category this skill belongs to */
  category: "automation" | "blockchain" | "graphics" | "stack";
  /** Name of the skill (e.g., "React", "Solidity") */
  name: string;
  /** Icon identifier or path */
  icon: string;
  /** Brief description of proficiency or usage context */
  description: string;
}

/** Personal information displayed on the About section. */
export interface AboutContent {
  /** Full name */
  name: string;
  /** Short tagline or title (e.g., "Full-Stack Developer") */
  tagline: string;
  /** Bio paragraphs - each string is a separate paragraph */
  bio: string[];
  /** Personal passions or interests */
  passions: string[];
}

/** Social media and contact links. */
export interface SocialLinks {
  /** LinkedIn profile URL */
  linkedin: string;
  /** GitHub profile URL */
  github: string;
  /** Contact email address */
  email: string;
}

/** A contact form submission stored in the database. */
export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  message: string;
  locale: string;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at?: Date;
  email_sent?: boolean;
  email_sent_at?: Date | null;
  email_error?: string | null;
}

/** Contact form data sent from the client. */
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  turnstileToken: string;
  locale: string;
  formStartedAt?: number;
}

/** API response for contact form submission. */
export interface ContactAPIResponse {
  success: boolean;
  message?: string;
  error?: 'turnstile_failed' | 'validation_failed' | 'server_error' | string;
}

/** Turnstile verification response from Cloudflare. */
export interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

/** Locale type for type safety. */
export type Locale = 'en' | 'it';

/** Complete portfolio data structure aggregating all content sections. */
export interface PortfolioData {
  /** Personal information */
  about: AboutContent;
  /** Portfolio projects */
  projects: Project[];
  /** Completed courses and certifications */
  experience: Course[];
  /** Technical skills by category */
  skills: Skill[];
  /** Social and contact links */
  social: SocialLinks;
}
