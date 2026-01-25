import { NonWorkingDaysSkeleton } from '@/module/admin/podesavanja/components/non-working-days-skeleton';
import { NonWorkingDaysTab } from '@/module/admin/podesavanja/components/non-working-days-tab';
import { HydrateClient } from '@/trpc/hydrate-client';
import { prefetch, trpc } from '@/trpc/server';

export default function NonWorkingDaysPage() {
  void prefetch(
    trpc.settings.getNonWorkingDays.queryOptions({
      year: new Date().getFullYear(),
    })
  );

  return (
    <HydrateClient loadingFallback={<NonWorkingDaysSkeleton />}>
      <NonWorkingDaysTab />
    </HydrateClient>
  );
}
