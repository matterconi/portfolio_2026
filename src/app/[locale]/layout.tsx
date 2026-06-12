import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { FloatingNav } from "@/components/FloatingNav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import LenisProvider from "@/components/LenisProvider";
import PageLoader from "@/components/PageLoader";
import PersistentShaderLayer from "@/components/PersistentShaderLayer";
import AudioPlayerProvider from "@/components/AudioPlayerProvider";
import { isLocale, locales } from "@/i18n/locales";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validate locale
  if (!isLocale(locale)) {
    notFound();
  }

  // Load messages for current locale
  const [messages, cookieStore] = await Promise.all([getMessages(), cookies()]);
  const hasLoadedPage = cookieStore.has('pageLoaderSeen');

  return (
    <html lang={locale}>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=zodiak@400,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased cursor-none">
        <PageLoader initiallyVisible={!hasLoadedPage} />
        <PersistentShaderLayer />
        <LenisProvider />
        <CustomCursor />
        <NextIntlClientProvider messages={messages}>
          <AudioPlayerProvider>
            <FloatingNav />
            <main>{children}</main>
            <Footer locale={locale} />
          </AudioPlayerProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
