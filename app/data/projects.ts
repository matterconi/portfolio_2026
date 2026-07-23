export type ProjectCategory = "AI" | "3D" | "Motion design" | "Backend";

export type Project = {
  title: string;
  description: string;
  stack: string[];
  categories: ProjectCategory[];
  image: string;
  href: string;
};

export const projects: Project[] = [
  {
    title: "InterSpeak",
    description:
      "Voice interview platform with live transcription, role-specific feedback, subscriptions and usage credits.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "VAPI", "AI SDK", "Paddle"],
    categories: ["AI", "Backend"],
    image: "/projects/interspeak.webp",
    href: "https://platone-alpha.vercel.app/",
  },
  {
    title: "Colivio",
    description:
      "Coliving marketplace with hybrid vector search, bookings, role-based access and Stripe payments.",
    stack: ["Next.js", "Prisma", "PostgreSQL", "pgvector", "Stripe", "OpenAI"],
    categories: ["AI", "Backend"],
    image: "/projects/colivio.webp",
    href: "https://colivio.vercel.app/",
  },
  {
    title: "Resumind",
    description:
      "Résumé analyser that scores a CV against a job description and returns structured feedback.",
    stack: ["React", "TypeScript", "Drizzle", "PostgreSQL", "DeepSeek", "Docker"],
    categories: ["AI", "Backend"],
    image: "/projects/resumind.webp",
    href: "https://github.com/matterconi",
  },
  {
    title: "Monoforge Studio",
    description:
      "Technical-visual studio website for direct AI systems, automations and conversational interfaces.",
    stack: ["Next.js", "TypeScript", "Three.js", "XState", "Motion", "DeepSeek"],
    categories: ["AI", "3D", "Motion design"],
    image: "/projects/monoforge.webp",
    href: "https://www.monoforge.studio/",
  },
  {
    title: "Swaggerz",
    description:
      "Streetwear concept with custom WebGL shaders, scroll-driven animation and a bespoke design system.",
    stack: ["Next.js", "TypeScript", "Three.js", "GLSL", "Motion", "PostgreSQL"],
    categories: ["3D", "Motion design", "Backend"],
    image: "/projects/swaggerz.webp",
    href: "https://swaggerz-y7ys.vercel.app/",
  },
  {
    title: "Davide’s Cocktail Bar",
    description:
      "A cinematic cocktail-bar landing page with scroll-linked sequences and tactile typography.",
    stack: ["React", "Vite", "GSAP", "ScrollTrigger", "SplitText", "Tailwind CSS"],
    categories: ["Motion design"],
    image: "/projects/barman-clone.webp",
    href: "https://gsap-cocktails-three-zeta.vercel.app/",
  },
  {
    title: "MacBook Pro Clone",
    description:
      "Interactive product page with navigable 3D models and scroll-driven storytelling.",
    stack: ["React", "TypeScript", "Three.js", "React Three Fiber", "GSAP", "Zustand"],
    categories: ["3D", "Motion design"],
    image: "/projects/apple-clone.webp",
    href: "https://apple-clone-six-virid.vercel.app/",
  },
  {
    title: "Portfolio 2024",
    description:
      "Interactive portfolio with a WebGL globe, cursor effects, particles and motion-led interfaces.",
    stack: ["Next.js", "React", "Three.js", "React Three Fiber", "Motion", "Sentry"],
    categories: ["3D", "Motion design"],
    image: "/projects/portfolio-2024.webp",
    href: "https://portfolio-eight-blue-39.vercel.app/",
  },
  {
    title: "Portfolio 2026",
    description:
      "Experimental portfolio with GLSL shaders, a CSS 3D gallery and scroll-driven interactions.",
    stack: ["Next.js", "TypeScript", "Three.js", "GLSL", "GSAP", "Motion"],
    categories: ["3D", "Motion design"],
    image: "/projects/portfolio-2026.webp",
    href: "https://matteomarconi.com",
  },
  {
    title: "Dev Overflow",
    description:
      "Full-stack developer community with questions, voting, collections and AI-assisted answers.",
    stack: ["Next.js", "TypeScript", "MongoDB", "NextAuth", "AI SDK", "OpenAI"],
    categories: ["AI", "Backend"],
    image: "/projects/devflow.webp",
    href: "https://dev-overflow-jet.vercel.app/",
  },
  {
    title: "Trance Travel",
    description:
      "AI travel planner that generates personalised itineraries with imagery, payments and admin tools.",
    stack: ["React", "TypeScript", "Prisma", "PostgreSQL", "DeepSeek", "Stripe"],
    categories: ["AI", "Backend"],
    image: "/projects/trance-travel.webp",
    href: "https://trance-travel-jsf3.vercel.app/",
  },
  {
    title: "Monocode",
    description:
      "Context-aware AI development toolkit composed of a terminal UI, API and product website.",
    stack: ["Bun", "TypeScript", "Hono", "OpenTUI", "React", "AI SDK"],
    categories: ["AI", "Backend"],
    image: "/projects/monocode.webp",
    href: "https://monocode-server.vercel.app",
  },
];

export const selectedProjects = projects.slice(0, 3);
