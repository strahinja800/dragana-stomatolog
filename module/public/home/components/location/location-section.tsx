import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, MapPin, Phone } from '@/constants/icons';

export default async function LocationSection() {
  const t = await getTranslations('home.location');

  return (
    <section className="pb-16 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-kicker">{t('kicker')}</span>
          <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('description')}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="section-shell h-[420px] overflow-hidden border-border/70 lg:col-span-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.3890988073946!2d20.4565!3d44.8125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a7ab4a0e4f4c9%3A0x5c4a4e4f4e4f4e4f!2sBelgrade%2C%20Serbia!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t('mapTitle')}
            />
          </div>

          <div className="space-y-5">
            <article className="section-shell p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-primary">
                  <MapPin className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {t('addressTitle')}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t('addressLine1')}
                    <br />
                    {t('addressLine2')}
                  </p>
                </div>
              </div>
            </article>

            <article className="section-shell p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-primary">
                  <Phone className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {t('phoneTitle')}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t('phone1')}
                    <br />
                    {t('phone2')}
                  </p>
                </div>
              </div>
            </article>

            <article className="section-shell p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-primary">
                  <Clock className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {t('hoursTitle')}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t('hours1')}
                    <br />
                    {t('hours2')}
                  </p>
                </div>
              </div>
            </article>

            <Button className="btn-shimmer w-full rounded-full" asChild>
              <a
                href="https://www.google.com/maps/dir//Belgrade,+Serbia"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('directionsButton')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
