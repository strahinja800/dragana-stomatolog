import { getTranslations } from 'next-intl/server';

import { Award, Microscope, ShieldCheck, Users } from '@/constants/icons';

export default async function TrustSection() {
  const t = await getTranslations('services.trust');

  const trustPoints = [
    {
      key: 't1',
      icon: Microscope,
      title: t('t1Title'),
      description: t('t1Description'),
    },
    {
      key: 't2',
      icon: Award,
      title: t('t2Title'),
      description: t('t2Description'),
    },
    {
      key: 't3',
      icon: Users,
      title: t('t3Title'),
      description: t('t3Description'),
    },
    {
      key: 't4',
      icon: ShieldCheck,
      title: t('t4Title'),
      description: t('t4Description'),
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="section-kicker">{t('kicker')}</span>
          <h2 className="mt-5 font-heading text-3xl font-bold text-foreground md:text-5xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            {t('description')}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:gap-6">
          {trustPoints.map((point, index) => (
            <article
              key={point.key}
              className="group section-shell relative overflow-hidden p-7 transition-smooth hover:-translate-y-1 hover:shadow-hover-blue sm:p-8"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 left-0 h-1 w-full gradient-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gradient-primary shadow-soft">
                  <point.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
