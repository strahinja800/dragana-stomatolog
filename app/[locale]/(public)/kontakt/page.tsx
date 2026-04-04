import { getTranslations } from 'next-intl/server';

import { buildAlternates } from '@/lib/seo';
import Contact from '@/module/public/contact/views/contact-view/contact';
import ContactHero from '@/module/public/contact/views/contact-view/hero';

const OG_LOCALE = { sr: 'sr_RS', en: 'en_US' } as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.contact' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates(locale as 'sr' | 'en', '/kontakt'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: OG_LOCALE[locale as keyof typeof OG_LOCALE],
      alternateLocale: locale === 'sr' ? ['en_US'] : ['sr_RS'],
      type: 'website' as const,
    },
  };
}

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <ContactHero />

      {/* Contact Section */}
      <Contact />
    </>
  );
}
