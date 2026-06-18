import { getTranslations } from 'next-intl/server';
import { getSocialLinks } from '@/lib/data';
import { Locale, SocialLinks } from '@data/types';
import FooterName from './FooterName';
import FooterShader from './FooterShader';
import FooterSocialLinks from './FooterSocialLinks';

const SECTION_IDS = ['home', 'about', 'abc', 'experience', 'projects', 'contact'] as const;

export default async function Footer({ locale }: { locale: string }) {
  const loc = locale as Locale;
  const [tNav, tFooter, social] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'footer' }),
    getSocialLinks(loc),
  ]);

  const quickLinks = SECTION_IDS.map((id) => ({
    id,
    label: tNav(id),
    href: `#${id}`,
  }));

  const socialObj = social as SocialLinks;
  const socialLinks = [
    { platform: 'github' as const, label: 'GitHub', url: socialObj.github },
    { platform: 'linkedin' as const, label: 'LinkedIn', url: socialObj.linkedin },
    { platform: 'email' as const, label: 'Email', url: socialObj.email },
  ];

  return (
    <footer className="relative overflow-hidden bg-black pt-24 sm:pt-32">
      <FooterShader />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        {/* Main row: Name left, Links right */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
          {/* Name */}
          <FooterName />

          {/* Links */}
          <div className="flex flex-row gap-8 sm:gap-x-12">
            {/* Quick Links */}
            <div>
              <h3 className="mb-4 text-base font-semibold uppercase tracking-wider text-foreground-subtle px-4 sm:px-0">
                Link
              </h3>
              <ul className="space-y-2 px-4 sm:px-0">
                {quickLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      className="text-base text-foreground-muted hover:text-accent-green transition-colors duration-200 inline-block px-1 py-0.5"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="mb-4 text-base font-semibold uppercase tracking-wider text-foreground-subtle px-4 sm:px-0">
                {tFooter('social')}
              </h3>
              <FooterSocialLinks
                links={socialLinks}
                copiedMessage={tFooter('emailCopied')}
                copyErrorMessage={tFooter('emailCopyError')}
              />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-sm text-foreground-subtle">
            &copy; {new Date().getFullYear()} {tFooter('copyright')}
          </p>
        </div>
      </div>

      {/* Spacer for mobile bottom nav */}
      <div className="relative z-10 h-16 md:h-0" />
    </footer>
  );
}
