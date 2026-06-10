'use client';

import { useParams, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const locales = ['en', 'it'] as const;
type Locale = (typeof locales)[number];

const localeNames: Record<Locale, string> = {
  en: 'English',
  it: 'Italiano',
};

const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  it: '🇮🇹',
};

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const currentLocale = params.locale as Locale;

  // Extract hash from current URL (client-side only)
  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  const query = searchParams.toString();

  return (
    <div className="flex gap-2">
      {locales.map((locale) => {
        // Replace locale in pathname
        const segments = pathname.split('/');
        segments[1] = locale;
        const newPathname = segments.join('/');

        const isActive = locale === currentLocale;

        return (
          <Link
            key={locale}
            href={`${newPathname}${query ? `?${query}` : ''}${hash}`}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${isActive
                ? 'bg-accent-green-subtle text-accent-green border border-accent-green'
                : 'text-foreground-muted hover:text-foreground hover:bg-background-elevated'
              }
            `}
            aria-label={`Switch to ${localeNames[locale]}`}
          >
            {localeFlags[locale]} {localeNames[locale]}
          </Link>
        );
      })}
    </div>
  );
}
