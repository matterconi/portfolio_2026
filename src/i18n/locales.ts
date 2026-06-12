export const locales = ['en', 'it'] as const;
export const defaultLocale = 'en';

export type AppLocale = (typeof locales)[number];

export function isLocale(locale: string): locale is AppLocale {
  return (locales as readonly string[]).includes(locale);
}
