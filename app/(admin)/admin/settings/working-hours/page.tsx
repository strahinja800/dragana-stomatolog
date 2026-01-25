import { WorkingHoursSkeleton } from '@/module/admin/podesavanja/components/working-hours/working-hours-skeleton';
import { WorkingHoursTab } from '@/module/admin/podesavanja/components/working-hours/working-hours-tab';
import { HydrateClient } from '@/trpc/hydrate-client';
import { prefetch, trpc } from '@/trpc/server';

export default function WorkingHoursPage() {
  void prefetch(trpc.settings.getWorkingHours.queryOptions());

  return (
    <HydrateClient loadingFallback={<WorkingHoursSkeleton />}>
      <WorkingHoursTab />
    </HydrateClient>
  );
}
