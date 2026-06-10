import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { FloatingNav } from "@/components/FloatingNav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import LenisProvider from "@/components/LenisProvider";
import PageLoader from "@/components/PageLoader";

const locales = ['en', 'it'] as const;

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
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Load messages for current locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=zodiak@400,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased cursor-none">
        <PageLoader />
        <LenisProvider />
        <CustomCursor />
        <NextIntlClientProvider messages={messages}>
          <FloatingNav />
          <main>{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
