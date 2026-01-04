import { HydrateClient, prefetch, trpc } from '@/trpc/server';

import BookingForm from './booking-form';
import { BookingFormSkeleton } from './booking-form-skeleton';

export async function BookingFormServer() {
  // Prefetch working hours and non-working days
  prefetch(trpc.settings.getWorkingHours.queryOptions());
  prefetch(trpc.settings.getNonWorkingDays.queryOptions({}));

  return (
    <HydrateClient loadingFallback={<BookingFormSkeleton />}>
      <BookingForm />
    </HydrateClient>
  );
}
