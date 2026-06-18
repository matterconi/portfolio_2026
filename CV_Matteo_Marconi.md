# Matteo Marconi
**Full-Stack & Creative Developer**

matteomarconi.com · matterconi@gmail.com · github.com/matterconi · @matteomarconi

---

## Profilo

Sviluppatore full-stack e creativo con forte interesse per l'intersezione tra tecnologia e design. Ho costruito progetti che spaziano da applicazioni AI full-stack a landing page con shader WebGL personalizzati e animazioni scroll-driven, con un'attenzione costante a performance, accessibilità e qualità visiva. Il mio background in Lettere Moderne mi ha dato solide basi nel pensiero critico e nella comunicazione, che applico ogni giorno nella strutturazione di architetture software e nel design di interfacce.

---

## Competenze Tecniche

### Frontend & Framework
- **Next.js** (App Router, SSR, Server Components, API Routes)
- **React** (React 19, hooks, custom hooks, composizione avanzata)
- **TypeScript** (strict mode, generics, utility types)
- **Tailwind CSS v4** · Framer Motion · GSAP + ScrollTrigger · Lenis

### 3D, WebGL & Motion Design
- **Three.js** (rendering, luci, materiali, VideoTexture, animazioni)
- **React Three Fiber** + @react-three/drei
- **GLSL / WebGL Shaders** (fragment shader, noise, UV distortion)
- GSAP ScrollTrigger (scrub, pin, SplitText, mask animations)
- CSS 3D Transforms · canvas particle effects

### Backend & Database
- **PostgreSQL** (query complesse, pgvector, transazioni serializzabili)
- **Prisma ORM** · **Drizzle ORM** · Mongoose (MongoDB)
- **Node.js** · Express.js
- Better Auth · NextAuth v5 · JWT · bcryptjs

### AI & Integrazioni
- DeepSeek API · OpenAI (GPT, embeddings) · Google Gemini · VAPI (voice AI)
- Vercel AI SDK · prompt engineering per output JSON strutturato
- Hybrid vector + SQL search (pgvector, embeddings OpenAI)

### Pagamenti & Servizi
- **Stripe** (Payment Intents, webhooks, subscription)
- **Paddle** (billing, crediti, webhook con Svix)
- Upstash Redis (rate limiting) · Cloudflare Turnstile · Resend

### Blockchain (in apprendimento)
- **Solidity** · ethers.js · Hardhat
- Smart contract development su Ethereum (Alchemy University)

### DevOps & Tooling
- Docker · GitHub Actions (CI/CD) · Vercel · Sentry
- Python (scripting, automazione) · Vite · Vitest

---

## Progetti

### RESUMIND — AI CV Analyzer
*React 19 · React Router v7 (SSR) · TypeScript · PostgreSQL · Drizzle ORM · DeepSeek API · PDF.js · better-auth · Docker*

Web app AI che analizza CV, restituisce un ATS score e feedback dettagliato per categoria calibrato sul job description target.
- Conversione client-side PDF→PNG a 4x scala via PDF.js (CDN)
- Feedback AI su 5 categorie (ATS, Tone & Style, Content, Structure, Skills) con punteggio 0–100
- Layout split-view: preview CV a sinistra, feedback scrollabile a destra
- Google OAuth con limite di 3 analisi per utente

---

### MONOFORGE STUDIO — Sito istituzionale + AI Assistant
*Next.js 16 · Three.js · GLSL Shaders · XState 5 · Framer Motion · DeepSeek API · Upstash Redis · Cloudflare Turnstile*
🔗 [monoforge.studio](https://www.monoforge.studio/)

Sito ufficiale di un laboratorio tecnico-visivo con AI assistant integrata, shader GLSL personalizzati e design system dark con glassmorphism.
- AI assistant (Monica) gestita da una state machine XState 5 con rate limiting multi-livello via Redis
- Renderer WebGL singleton condiviso tra tutti i componenti per ridurre overhead GPU
- Design system con CSS custom tokens, Klein blue e glassmorphism

---

### COLIVIO — Piattaforma Coliving Full-Stack
*Next.js 14 · TypeScript · Prisma · PostgreSQL + pgvector · Stripe · OpenAI (embeddings) · Zustand · TanStack Query · Zod*
🔗 [colivio.vercel.app](https://colivio.vercel.app/)

Piattaforma coliving con ricerca AI ibrida (vector + SQL), pagamenti Stripe, autenticazione JWT e pannello admin.
- Ricerca ibrida: input in linguaggio naturale → function calling → query pgvector + SQL (60% vector, 30% keyword, 10% exact)
- Fallback progressivo: rilassa automaticamente budget e filtri quando non trova risultati esatti
- RBAC con 4 ruoli (Guest, Host, Admin, Superadmin) e audit log per conformità GDPR
- Flusso di prenotazione con check disponibilità, prezzi dinamici e Stripe integrato

---

### INTERSPEAK — AI Voice Interview Platform
*Next.js 16 · VAPI AI (WebRTC) · Vercel AI SDK · DeepSeek/OpenAI/Gemini · Neon PostgreSQL · Paddle · Upstash Redis · Sentry · Vitest*
🔗 [platone-alpha.vercel.app](https://platone-alpha.vercel.app/)

SaaS per la simulazione di colloqui vocali AI con feedback in tempo reale, 50+ ruoli e sistema di crediti.
- Interviste vocali in real-time via VAPI WebRTC con trascrizione live e feedback AI mid-sessione
- Pipeline LLM multi-provider (DeepSeek, OpenAI, Gemini) con 50+ ruoli su 6 settori
- Tool panel in sessione: code editor, notebook markdown, whiteboard (tldraw), spreadsheet
- Billing credit-based via Paddle con webhook protetti da Svix e JWT nonce

---

### SWAGGERZ — Landing Page con GLSL Shaders
*Next.js 15 · Three.js · GLSL (WebGL Shaders) · Framer Motion · Lenis · Tailwind CSS v4 · Better Auth*
🔗 [swaggerz-y7ys.vercel.app](https://swaggerz-y7ys.vercel.app/)

Landing page per brand streetwear immaginario con shader WebGL personalizzati e design system semantico.
- Hero title renderizzato via GLSL fragment shader come SVG pattern fill (ShaderText)
- Liquid video shader che reagisce alla posizione del cursore con simplex noise e UV distortion
- SharedRendererManager singleton che condivide un WebGLRenderer tra tutti i componenti
- Magic link + Google OAuth via Better Auth

---

### APPLE MACBOOK PRO LANDING PAGE CLONE
*React 19 · TypeScript · Three.js · React Three Fiber · GSAP · ScrollTrigger · Lenis · Zustand · Tailwind CSS v4*
🔗 [apple-clone-six-virid.vercel.app](https://apple-clone-six-virid.vercel.app/)

Replica interattiva della landing page Apple MacBook Pro con modelli 3D navigabili e animazioni scroll-driven.
- VideoTexture proiettata live sullo schermo 3D del MacBook — cambia video per feature allo scroll
- Rotazione 3D 360° sincronizzata con lo scroll progress via R3F useFrame
- Color picker che applica Three.js Color ai materiali del modello in real time

---

### DAVIDE'S COCKTAIL BAR — GSAP Animation Exercise
*React 19 · Vite · GSAP 3.13 · ScrollTrigger · SplitText · Tailwind CSS v4*
🔗 [gsap-cocktails-three-zeta.vercel.app](https://gsap-cocktails-three-zeta.vercel.app/)

Landing page con animazioni scroll-driven avanzate costruita come esercizio del corso GSAP.
- Scroll-scrubbed video: currentTime del video hero controllato dalla posizione di scroll
- Circular mask reveal con CSS maskSize animato da 50% a 400% via GSAP
- SplitText con animazioni char-by-char e word-by-word all'entrata

---

### DEV OVERFLOW — Stack Overflow Clone
*Next.js 16 · TypeScript · MongoDB · NextAuth v5 · Tiptap v3 · Vercel AI SDK · OpenAI GPT · Shadcn/UI · Zod*
🔗 [dev-overflow-jet.vercel.app](https://dev-overflow-jet.vercel.app/)

Clone funzionale di Stack Overflow con domande, risposte, voting, tag e generazione AI delle risposte.
- Generazione risposta AI (HTML-native, compatibile Tiptap) con rate limiting per utente e rollback atomico
- NextAuth v5 con GitHub, Google OAuth e credenziali
- Server Actions tipizzate con pattern di risposta uniforme

---

### TRANCE TRAVEL — AI Travel Itinerary App
*React 19 · React Router v7 · TypeScript · Prisma · PostgreSQL · Better Auth · DeepSeek API · Stripe · Unsplash API · Syncfusion*
🔗 [trance-travel-jsf3.vercel.app](https://trance-travel-jsf3.vercel.app/)

Web app full-stack per la generazione di itinerari di viaggio personalizzati con AI, pagamenti Stripe e dashboard admin.
- Generazione itinerario AI day-by-day via DeepSeek con parsing e validazione del JSON output
- Mappa mondiale interattiva Syncfusion per la selezione del paese
- Dashboard admin con statistiche, grafici e gestione viaggi generati

---

### PORTFOLIO 2026 — matteomarconi.com
*Next.js 16 · React Three Fiber · GLSL · Framer Motion · GSAP · Lenis · next-intl · Tailwind CSS v4*
🔗 [matteomarconi.com](https://matteomarconi.com)

Portfolio personale con shader GLSL custom, galleria CSS 3D dome, animazioni scroll-driven e musica ambient.
- PersistentShaderLayer: canvas WebGL globale che sopravvive alla navigazione client-side in Next.js
- DomeGallery: dome CSS 3D con rotazione gesture e shuffle deterministico (FNV-1a + Mulberry32)
- Localizzazione completa EN/IT via next-intl con traduzioni server-side

---

## Formazione & Corsi

| Titolo | Istituzione | Stato | Competenze |
|--------|-------------|-------|------------|
| **Full-Stack Engineer** | Codecademy | ✅ Completato (gen 2025) | React, Node.js, Express.js, PostgreSQL |
| **Three.js Journey** | Three.js Journey | 🔄 In corso | Three.js, WebGL, GLSL, React Three Fiber |
| **The Ultimate GSAP Course** | JavaScript Mastery | 🔄 In corso | GSAP, ScrollTrigger, Web Animations |
| **The Ultimate Next.js 16 Course** | JavaScript Mastery | ✅ Completato | Next.js, React, TypeScript, App Router |
| **Alchemy University** | Alchemy | 🔄 In corso | Solidity, Ethereum, Smart Contracts, ethers.js |
| **Laurea in Lettere Moderne** | Università degli Studi di Firenze | ✅ Conseguita | Pensiero critico, ricerca, comunicazione scritta |

---

## Lingue

- **Italiano** — Madrelingua
- **Inglese** — Livello professionale (lettura documentazione tecnica, comunicazione scritta e orale)
