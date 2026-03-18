import { getTranslations } from 'next-intl/server';
import ComparisonSection from '@/components/ComparisonSection';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tComparison = await getTranslations({ locale, namespace: 'comparison' });

  return (
    <div className="bg-black">
      {/* Spacer */}
      <div style={{ height: '100vh' }} />

      <ComparisonSection
        translations={{
          title: tComparison('title'),
          description: tComparison('description'),
          aiLabel: tComparison('aiLabel'),
          devLabel: tComparison('devLabel'),
        }}
      />
    </div>
  );
}
