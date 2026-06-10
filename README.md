# Magnus Lemme — Portfolio

A high-performance, bilingual (EN / IT) personal portfolio built with Next.js 16, React 19, and custom WebGL shaders. Designed for developers who want to showcase their work with motion, depth, and interactivity.

---

## 🚀 Live Demo

> *Coming soon — deploy on [Vercel](https://vercel.com)*

---

## ✨ Features

- **Custom WebGL Hero** — Animated 3D plane with GLSL vertex & fragment shaders, powered by React Three Fiber
- **Bilingual Support** — Full i18n routing via `next-intl` (English & Italian)
- **Smooth Scrolling** — Lenis-based smooth scroll with GSAP scroll-triggered animations
- **Custom Cursor** — A fully custom cursor replacing the default system one
- **Floating Navigation** — Minimal navigation that adapts to scroll direction
- **Page Loader** — Elegant entrance animation for first-time visits
- **ABC Expertise Section** — Scroll-driven stacked panels showcasing core skills (Automation, Animations, Blockchain, Backend, Graphics, Cyber Security)
- **Comparison Section** — Interactive before/after style reveal for AI vs Developer
- **Education & Experience** — Timeline-based course cards with scroll animations
- **Projects Showcase** — Project cards with links and details
- **Tech Stack Marquee** — Animated scrolling banner of technologies
- **Contact Form** — Secure form with Cloudflare Turnstile, Resend email delivery, and Vercel Postgres persistence
- **Dome Gallery** — Custom 3D image gallery component
- **Responsive Design** — Tailwind CSS v4 with mobile-first breakpoints
- **SEO Optimized** — Dynamic metadata generation per locale

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4 |
| Animation | GSAP, Framer Motion, Lenis |
| 3D / WebGL | React Three Fiber, Three.js, camera-controls, three-stdlib |
| i18n | next-intl |
| Database | Vercel Postgres (@vercel/postgres) |
| Email | Resend |
| Captcha | Cloudflare Turnstile |
| Carousel | Swiper |
| Icons | Lucide React |
| Fonts | Clash Display, Zodiak (via Fontshare) |

---

## 📁 Project Structure

```
portfolio/
├── app/                          # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── [locale]/         # Localized routes (en, it)
│   │   │   ├── api/contact/      # Contact form API route
│   │   │   ├── layout.tsx        # Root layout
│   │   │   └── globals.css       # Global styles
│   │   ├── components/           # React components
│   │   │   ├── Hero.tsx
│   │   │   ├── HeroShader.tsx
│   │   │   ├── WaterPlaneShader.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ABCSection.tsx
│   │   │   ├── ComparisonSection.tsx
│   │   │   ├── ExperienceSection.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── CustomCursor.tsx
│   │   │   ├── FloatingNav.tsx
│   │   │   ├── DomeGallery.jsx
│   │   │   └── ...
│   │   ├── lib/                  # Utilities & data helpers
│   │   │   ├── data.ts           # JSON data loaders
│   │   │   ├── db.ts             # Database queries
│   │   │   ├── shaderTextRenderer.ts
│   │   │   └── utils.ts
│   │   ├── i18n/
│   │   │   └── request.ts        # next-intl configuration
│   │   ├── middleware.ts         # Locale routing middleware
│   │   └── types/                # TypeScript types
│   ├── data/
│   │   ├── en/                   # English content (JSON)
│   │   ├── it/                   # Italian content (JSON)
│   │   └── types.ts              # Shared data types
│   ├── messages/
│   │   ├── en.json               # UI translations
│   │   └── it.json               # UI translations
│   ├── scripts/
│   │   └── migrate.ts            # Database migration script
│   ├── public/                   # Static assets
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
├── SHADER_GUIDE.md               # Custom shader customization guide
└── README.md                     # This file
```

---

## 🧪 Getting Started

### Prerequisites

- Node.js 20+ (or [Bun](https://bun.sh/))
- A Vercel account (for Postgres deployment)
- Resend API key
- Cloudflare Turnstile keys (optional, for contact form)

### 1. Install Dependencies

```bash
cd app
npm install
```

### 2. Environment Variables

Create a `.env.local` file inside the `app/` directory:

```env
# Database
POSTGRES_URL="postgres://..."

# Email (Resend)
RESEND_API_KEY="re_..."
CONTACT_EMAIL_TO="your@email.com"
CONTACT_EMAIL_FROM="onboarding@resend.dev"

# Cloudflare Turnstile (optional)
NEXT_PUBLIC_TURNSTILE_SITE_KEY="0x..."
TURNSTILE_SECRET_KEY="0x..."
```

### 3. Database Setup

Run the migration script to create the `contact_messages` table:

```bash
cd app
npm run db:migrate
```

Or manually execute the SQL from `src/lib/db.ts`.

### 4. Run Development Server

```bash
cd app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run database migrations via `tsx` |

---

## 🎨 Customization

### Custom Shader Hero

The WebGL hero effect is fully customizable via GLSL uniforms. See [`SHADER_GUIDE.md`](./SHADER_GUIDE.md) for a detailed breakdown of:

- Uniform controls (speed, noise density, colors, grain)
- Vertex shader displacement
- Fragment shader color blending & zones
- Camera, geometry, and lighting adjustments

### Content & Translations

All text content is stored in JSON files:

- **Portfolio data** (projects, courses, skills, about): `app/data/{en,it}/`
- **UI labels** (buttons, forms, navigation): `app/messages/{en,it}.json`

To add a new language, extend the `locales` array in `src/middleware.ts` and `src/i18n/request.ts`, then create the corresponding JSON files.

---

## 🚢 Deployment

The easiest way to deploy is via [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Add the required environment variables in the Vercel dashboard.
4. Deploy.

Make sure to connect a **Vercel Postgres** database and configure the `POSTGRES_URL` environment variable.

---

## 🧩 Key Dependencies

- `next` — Framework
- `react` / `react-dom` — UI library
- `tailwindcss` — Styling
- `next-intl` — Internationalization
- `@react-three/fiber` / `three` — 3D & WebGL
- `gsap` / `framer-motion` — Animation
- `lenis` — Smooth scroll
- `@vercel/postgres` — Database
- `resend` — Email sending
- `swiper` — Touch slider
- `lucide-react` — Icons

---

## 📄 License

This project is **private** and proprietary. No license is granted for reuse or redistribution without explicit permission.

---

Built with passion by **Magnus Lemme**.
