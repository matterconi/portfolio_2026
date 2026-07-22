import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const siteUrl = "https://matteomarconi.com";
const description =
  "Full-stack developer and AI engineer building production-ready products with Next.js, TypeScript, PostgreSQL, LLM integrations and voice agents.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Matteo Marconi — Full-stack Developer & AI Engineer",
    template: "%s — Matteo Marconi",
  },
  description,
  applicationName: "Matteo Marconi Portfolio",
  authors: [{ name: "Matteo Marconi", url: siteUrl }],
  creator: "Matteo Marconi",
  publisher: "Matteo Marconi",
  keywords: [
    "Matteo Marconi",
    "full-stack developer",
    "AI engineer",
    "Next.js developer",
    "TypeScript developer",
    "Florence developer",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Matteo Marconi",
    title: "Matteo Marconi — Full-stack Developer & AI Engineer",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Matteo Marconi — Full-stack Developer & AI Engineer",
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Matteo Marconi",
  url: siteUrl,
  image: `${siteUrl}/matteo-casual.webp`,
  jobTitle: "Full-stack Developer & AI Engineer",
  email: "mailto:matterconi@gmail.com",
  sameAs: [
    "https://github.com/matterconi",
    "https://www.linkedin.com/in/matteo-marconi-582625416/",
  ],
  knowsAbout: ["Next.js", "TypeScript", "PostgreSQL", "Artificial Intelligence", "Voice AI"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var saved=localStorage.getItem("theme");var theme=saved==="light"||saved==="dark"?saved:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=theme;}catch(e){document.documentElement.dataset.theme="light";}})();`}
        </Script>
        {children}
      </body>
    </html>
  );
}
