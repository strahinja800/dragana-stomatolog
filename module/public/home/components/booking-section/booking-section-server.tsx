import { getTranslations } from 'next-intl/server';

import { startOfDay } from 'date-fns';

import {
  CalendarCheck,
  Clock,
  MailCheck,
  ShieldCheck,
} from '@/constants/icons';
import { HydrateClient } from '@/trpc/hydrate-client';
import { prefetch, trpc } from '@/trpc/server';

import BookingForm from './booking-form';
import { BookingSectionSkeleton } from './booking-form-skeleton';

export default async function BookingSectionServer() {
  const today = startOfDay(new Date());
  const t = await getTranslations('home.booking');

  const features = [
    { icon: CalendarCheck, text: t('feature1') },
    { icon: MailCheck, text: t('feature2') },
    { icon: ShieldCheck, text: t('feature3') },
    { icon: Clock, text: t('feature4') },
  ];

  void prefetch(trpc.appointment.getNonWorkingDays.queryOptions());
  void prefetch(
    trpc.appointment.getTimeSlotsForDate.queryOptions({
      date: today,
    })
  );

  return (
    <section
      id="zakazivanje"
      className="relative scroll-mt-28 overflow-hidden py-16 md:scroll-mt-32 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-primary/[0.04] to-primary/[0.09]" />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-start gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="space-y-6 text-center lg:col-span-2 lg:text-left">
            <span className="section-kicker">{t('kicker')}</span>
            <h2 className="text-3xl font-bold text-foreground md:text-5xl">
              {t('title')}
            </h2>

            <p className="text-lg text-muted-foreground">{t('description')}</p>

            <ul className="space-y-3.5 pt-2">
              {features.map((feature) => (
                <li
                  key={feature.text}
                  className="flex items-center justify-center gap-3 lg:justify-start"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <HydrateClient loadingFallback={<BookingSectionSkeleton />}>
              <BookingForm compact />
            </HydrateClient>
          </div>
        </div>
      </div>
    </section>
  );
}
