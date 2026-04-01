import { useTranslations } from 'next-intl';

export default function BlogViewHero() {
  const t = useTranslations('home.blog');

  return (
    <section className="gradient-hero pt-34 pb-20 md:pt-40 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <span className="section-kicker">Blog</span>
          <h1 className="mt-5 text-4xl font-bold text-foreground md:text-6xl">
            {t('pageTitle')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {t('pageDescription')}
          </p>
        </div>
      </div>
    </section>
  );
}
